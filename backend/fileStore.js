// =========================================
// FILE STORE
// Keeps the tasks in memory and saves them to data/progress.json after
// every change, so progress survives a restart. Used when no database
// is set up (for example when running on your own computer).
// =========================================

const fs = require("fs");
const path = require("path");

const startingTasks = require("./data/tasks.json");
const progressFile = path.join(__dirname, "data", "progress.json");

const validStatuses = ["completed", "in-progress", "not-started"];
const validTracks = ["web", "data"];

function clone(list) {
  return list.map(function (task) {
    return { ...task };
  });
}

let tasks = clone(startingTasks);

function save() {
  try {
    fs.writeFileSync(progressFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Could not save progress:", error.message);
  }
}

// Brings back the saved tasks when the server starts
function load() {
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

load();

function highest(list, field) {
  return list.reduce(function (top, task) {
    return Math.max(top, task[field]);
  }, 0);
}

module.exports = {
  name: "file",

  async list(track) {
    return track ? tasks.filter(function (task) { return task.track === track; }) : tasks;
  },

  async get(id) {
    return tasks.find(function (task) { return task.id === id; }) || null;
  },

  async setStatus(id, status) {
    const task = tasks.find(function (item) { return item.id === id; });
    if (!task) {
      return null;
    }
    task.status = status;
    save();
    return task;
  },

  async add(data) {
    const sameTrack = tasks.filter(function (task) { return task.track === data.track; });
    const task = {
      id: Math.max(highest(tasks, "id"), startingTasks.length) + 1,
      track: data.track,
      number: highest(sameTrack, "number") + 1,
      title: data.title,
      day: null,
      difficulty: "Custom",
      description: data.description,
      details: data.description,
      skills: [],
      status: "not-started",
      custom: true
    };
    tasks.push(task);
    save();
    return task;
  },

  async remove(id) {
    const task = tasks.find(function (item) { return item.id === id; });
    if (!task) {
      return null;
    }
    tasks = tasks.filter(function (item) { return item !== task; });
    save();
    return task;
  },

  async reset(track) {
    const fresh = clone(startingTasks.filter(function (task) { return task.track === track; }));
    tasks = tasks.filter(function (task) { return task.track !== track; })
      .concat(fresh)
      .sort(function (a, b) { return a.id - b.id; });
    save();
    return fresh;
  }
};
