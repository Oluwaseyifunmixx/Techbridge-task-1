// =========================================
// TECHBRIDGE TASK MANAGEMENT API: local server
// Task 7: runs the Express app from app.js on your computer
// and also serves the website itself.
// =========================================

const path = require("path");
const express = require("express");

const app = require("./app");

const PORT = process.env.PORT || 3000;

// Serving the frontend from here means the dashboard is available at
// http://localhost:3000/dashboard.html and can call /api/tasks directly.
// The backend folder and git files are never served.
const siteRoot = path.join(__dirname, "..");

app.use(function (req, res, next) {
  if (/^\/(backend|\.git|node_modules|api)(\/|$)/i.test(req.path)) {
    return res.status(404).send("Not found");
  }
  next();
});

app.use(express.static(siteRoot));

app.listen(PORT, function () {
  console.log("TechBridge API running at http://localhost:" + PORT);
  console.log("Try http://localhost:" + PORT + "/api/tasks");
});
