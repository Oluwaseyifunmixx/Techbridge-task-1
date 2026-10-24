// =========================================
// TECHBRIDGE TASK MANAGEMENT API
// Task 7: Node.js + Express backend
//
//   GET    /api/tasks        all tasks (optional ?track=web or ?track=data)
//   GET    /api/tasks/:id    one task
//   PUT    /api/tasks/:id    update a task's status
//   POST   /api/tasks        add a new task            (optional challenge)
//   DELETE /api/tasks/:id    delete a task             (optional challenge)
//   POST   /api/reset        put one track back to its starting tasks
// =========================================

const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const validStatuses = ["completed", "in-progress", "not-started"];
const validTracks = ["web", "data"];


// =========================================
// TASK DATA
// tasks.json holds the starting data. The server works on a copy in
// memory and saves it to data/progress.json after every change, so
// progress (and added tasks) are still there after a restart.
// =========================================

const startingTasks = require("./data/tasks.json");
const progressFile = path.join(__dirname, "data", "progress.json");

let tasks = startingTasks.map(function (task) {
  return { ...task };
});

function saveProgress() {
  try {
    fs.writeFileSync(progressFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Could not save progress:", error.message);
  }
}

// Brings back the saved tasks when the server starts
function loadProgress() {
  try {
    const saved = JSON.parse(fs.readFileSync(progressFile, "utf8"));
    const looksRight = Array.isArray(saved) && saved.every(function (task) {
      return task && Number.isInteger(task.id) &&
        validTracks.includes(task.track) && validStatuses.includes(task.status);
    });
    if (looksRight) {
      tasks = saved;
    }
  } catch (error) {
    // No saved progress yet: the starting tasks are used
  }
}

loadProgress();

// The next free id (ids are never reused while a larger one exists)
function nextId() {
  return tasks.reduce(function (highest, task) {
    return Math.max(highest, task.id);
  }, startingTasks.length) + 1;
}

function findTask(idText) {
  return tasks.find(function (task) {
    return task.id === Number(idText);
  });
}


// =========================================
// MIDDLEWARE
// =========================================

// Read JSON sent in the body of a request
app.use(express.json());

// Allow the frontend to call the API even when it is opened from a
// different address (for example VS Code Live Server)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});


// =========================================
// API ENDPOINTS
// =========================================

// GET /api/tasks: get all tasks (or one track's tasks)
app.get("/api/tasks", function (req, res) {
  const track = req.query.track;

  if (track === undefined) {
    return res.json(tasks);
  }
  if (!validTracks.includes(track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }

  res.json(tasks.filter(function (task) {
    return task.track === track;
  }));
});

// GET /api/tasks/:id: get one task
app.get("/api/tasks/:id", function (req, res) {
  const task = findTask(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json(task);
});

// PUT /api/tasks/:id: update a task's status
// Body: { "status": "completed" }
app.put("/api/tasks/:id", function (req, res) {
  const task = findTask(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  const status = req.body && req.body.status;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Status must be one of: " + validStatuses.join(", ") + "."
    });
  }

  task.status = status;
  saveProgress();
  res.json(task);
});

// POST /api/tasks: add a new task
// Body: { "track": "web", "title": "...", "description": "..." }
app.post("/api/tasks", function (req, res) {
  const body = req.body || {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!validTracks.includes(body.track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }
  if (title === "" || title.length > 80) {
    return res.status(400).json({ error: "Title is required (80 characters at most)." });
  }
  if (description.length > 300) {
    return res.status(400).json({ error: "Description can be 300 characters at most." });
  }

  const sameTrack = tasks.filter(function (task) {
    return task.track === body.track;
  });
  const highestNumber = sameTrack.reduce(function (highest, task) {
    return Math.max(highest, task.number);
  }, 0);

  const task = {
    id: nextId(),
    track: body.track,
    number: highestNumber + 1,
    title: title,
    day: null,
    difficulty: "Custom",
    description: description || "A task you added yourself.",
    details: description || "A task you added yourself.",
    skills: [],
    status: "not-started",
    custom: true
  };

  tasks.push(task);
  saveProgress();
  res.status(201).json(task);
});

// DELETE /api/tasks/:id: delete a task
app.delete("/api/tasks/:id", function (req, res) {
  const task = findTask(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  tasks = tasks.filter(function (item) {
    return item !== task;
  });
  saveProgress();
  res.json(task);
});

// POST /api/reset: a new intern starts again from the starting tasks
// Body: { "track": "web" }
app.post("/api/reset", function (req, res) {
  const track = req.body && req.body.track;
  if (!validTracks.includes(track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }

  const otherTracks = tasks.filter(function (task) {
    return task.track !== track;
  });
  const freshTasks = startingTasks.filter(function (task) {
    return task.track === track;
  }).map(function (task) {
    return { ...task };
  });

  tasks = otherTracks.concat(freshTasks).sort(function (a, b) {
    return a.id - b.id;
  });
  saveProgress();

  res.json(freshTasks);
});

// Any other /api address is not an endpoint
app.use("/api", function (req, res) {
  res.status(404).json({ error: "Endpoint not found." });
});


// =========================================
// THE WEBSITE ITSELF
// Serving the frontend from here means the dashboard is available at
// http://localhost:3000/dashboard.html and can call /api/tasks directly.
// The backend folder and git files are never served.
// =========================================

const siteRoot = path.join(__dirname, "..");

app.use(function (req, res, next) {
  if (/^\/(backend|\.git|node_modules)(\/|$)/i.test(req.path)) {
    return res.status(404).send("Not found");
  }
  next();
});

app.use(express.static(siteRoot));


// =========================================
// START THE SERVER
// =========================================

app.listen(PORT, function () {
  console.log("TechBridge API running at http://localhost:" + PORT);
  console.log("Try http://localhost:" + PORT + "/api/tasks");
});
