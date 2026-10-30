// =========================================
// TECHBRIDGE TASK MANAGEMENT API
// Task 7: the Express app (routes only)
//
//   GET    /api/tasks        all tasks (optional ?track=web or ?track=data)
//   GET    /api/tasks/:id    one task
//   PUT    /api/tasks/:id    update a task's status
//   POST   /api/tasks        add a new task            (optional challenge)
//   DELETE /api/tasks/:id    delete a task             (optional challenge)
//   POST   /api/reset        put one track back to its starting tasks
//
// server.js runs this app on your computer, and api/index.js runs it on Vercel.
// Where the tasks are stored depends on the environment:
//   MONGODB_URI is set -> a MongoDB database (mongoStore.js)
//   otherwise          -> a file, data/progress.json (fileStore.js)
// =========================================

const express = require("express");

const store = process.env.MONGODB_URI ? require("./mongoStore") : require("./fileStore");

const app = express();

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
app.get("/api/tasks", async function (req, res) {
  const track = req.query.track;

  if (track !== undefined && !validTracks.includes(track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }
  res.json(await store.list(track));
});

// GET /api/tasks/:id: get one task
app.get("/api/tasks/:id", async function (req, res) {
  const task = await store.get(Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json(task);
});

// PUT /api/tasks/:id: update a task's status
// Body: { "status": "completed" }
app.put("/api/tasks/:id", async function (req, res) {
  const status = req.body && req.body.status;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Status must be one of: " + validStatuses.join(", ") + "."
    });
  }

  const task = await store.setStatus(Number(req.params.id), status);
  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json(task);
});

// POST /api/tasks: add a new task
// Body: { "track": "web", "title": "...", "description": "..." }
app.post("/api/tasks", async function (req, res) {
  const body = req.body || {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!validTracks.includes(body.track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }
  if (title === "" || title.length > 80) {
    return res.status(400).json({ error: "Title is required (80 characters at most)." });
  }
  if (description === "" || description.length > 300) {
    return res.status(400).json({ error: "Description is required (300 characters at most)." });
  }

  const task = await store.add({ track: body.track, title: title, description: description });
  res.status(201).json(task);
});

// DELETE /api/tasks/:id: delete a task
app.delete("/api/tasks/:id", async function (req, res) {
  const task = await store.remove(Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json(task);
});

// POST /api/reset: a new intern starts again from the starting tasks
// Body: { "track": "web" }
app.post("/api/reset", async function (req, res) {
  const track = req.body && req.body.track;
  if (!validTracks.includes(track)) {
    return res.status(400).json({ error: "Track must be 'web' or 'data'." });
  }
  res.json(await store.reset(track));
});

// Any other /api address is not an endpoint
app.use("/api", function (req, res) {
  res.status(404).json({ error: "Endpoint not found." });
});

// If something goes wrong (for example the database is unreachable),
// answer with a JSON error instead of crashing
app.use(function (error, req, res, next) {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

module.exports = app;
