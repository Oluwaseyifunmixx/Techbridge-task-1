// =========================================
// TECHBRIDGE TASK MANAGEMENT API
// Task 7: Node.js + Express backend
//
//   GET  /api/tasks        all tasks (optional ?track=web or ?track=data)
//   GET  /api/tasks/:id    one task
//   PUT  /api/tasks/:id    update a task's status
//   POST /api/reset        put one track's tasks back to their starting status
// =========================================

const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// The task data. The file holds the starting data; the server keeps a
// working copy in memory, so status changes last until the server restarts.
const startingTasks = require("./data/tasks.json");
let tasks = startingTasks.map(function (task) {
  return { ...task };
});

const validStatuses = ["completed", "in-progress", "not-started"];
const validTracks = ["web", "data"];


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
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
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
  const task = tasks.find(function (item) {
    return item.id === Number(req.params.id);
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json(task);
});

// PUT /api/tasks/:id: update a task's status
// Body: { "status": "completed" }
app.put("/api/tasks/:id", function (req, res) {
  const task = tasks.find(function (item) {
    return item.id === Number(req.params.id);
  });

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
  res.json(task);
});

// POST /api/reset: a new intern starts again from the starting statuses
// Body: { "track": "web" }
app.post("/api/reset", function (req, res) {
  const track = req.body && req.body.track;
  if (!validTracks.includes(track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }

  tasks = tasks.map(function (task, index) {
    return task.track === track ? { ...startingTasks[index] } : task;
  });

  res.json(tasks.filter(function (task) {
    return task.track === track;
  }));
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
