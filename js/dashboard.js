// =========================================
// TECHBRIDGE INTERN DASHBOARD
// Task 6: progress, task tracker, filters, task details, technology explorer
// Task 7: the tasks now come from the Node.js + Express API
//   Frontend -> fetch() -> REST API -> Task data
// =========================================


// =========================================
// 1. API SETTINGS
// =========================================

// Where the API lives:
// - opened from the Express server (port 3000): same address, no prefix
// - opened any other way on your computer (Live Server, a file): localhost:3000
// - on the live site: the deployed backend address from js/config.js
const API_BASE = (function () {
  const isLocal = location.protocol === "file:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

  if (location.port === "3000") {
    return "";
  }
  if (isLocal) {
    return "http://localhost:3000";
  }
  return window.TECHBRIDGE_API_URL || "";
})();

// Sends a request to the API and returns the JSON answer.
// Throws an error if the server cannot be reached or says something is wrong.
async function api(path, options) {
  const response = await fetch(API_BASE + path, options);
  if (!response.ok) {
    throw new Error("The server answered with " + response.status);
  }
  return response.json();
}


// =========================================
// 2. STATIC DATA (not task data)
// =========================================

const statusLabels = {
  "completed": "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started"
};

const trackNames = {
  web: "Web Development",
  data: "Data Analytics"
};

const technologies = {
  nextjs: {
    name: "Next.js",
    summary: "Next.js is a React framework used for building modern web applications.",
    points: [
      "Adds routing, server-side rendering and static page generation on top of React.",
      "Commonly used for fast, SEO-friendly websites, e-commerce stores and dashboards.",
      "Lets one project hold both the frontend pages and simple API routes."
    ],
    link: "https://nextjs.org"
  },
  vue: {
    name: "Vue.js",
    summary: "Vue.js is a progressive JavaScript framework for building user interfaces.",
    points: [
      "Easy to learn: you can add it to one part of a page or build a full app with it.",
      "Developers use it for interactive interfaces, single-page applications and admin panels.",
      "Components keep HTML, CSS and JavaScript for one piece of the page together."
    ],
    link: "https://vuejs.org"
  },
  angular: {
    name: "Angular",
    summary: "Angular is a full framework from Google for building large web applications with TypeScript.",
    points: [
      "Comes with routing, forms and tools for testing built in.",
      "Commonly used in large companies for enterprise apps, internal tools and dashboards.",
      "Its strict structure helps big teams keep a large codebase organized."
    ],
    link: "https://angular.dev"
  },
  backend: {
    name: "Backend Development",
    summary: "Backend development is the work that happens behind the scenes: servers, databases and logic that users never see.",
    points: [
      "The frontend (what users see) sends requests, such as logging in or loading tasks.",
      "The backend receives them, checks the rules, talks to the database and sends data back.",
      "The frontend then shows that data on the page, for example your task progress."
    ],
    examples: [
      { name: "Node.js", text: "Runs JavaScript on the server, so one language can power both frontend and backend." },
      { name: "Express.js", text: "A small Node.js framework for building APIs and web servers quickly." },
      { name: "Django", text: "A Python framework with many built-in features, popular for data-driven sites." },
      { name: "Laravel", text: "A PHP framework known for clean syntax and fast development of web apps." }
    ],
    link: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Introduction"
  }
};



// =========================================
// 3. STATE AND PAGE ELEMENTS
// =========================================

let currentTrack = "web";
let tasks = [];            // filled from the API
let currentFilter = "all";
let searchText = "";

const taskGrid = document.getElementById("dash-task-grid");
const trackerCount = document.getElementById("tracker-count");
const completedCount = document.getElementById("completed-count");
const completedText = document.getElementById("completed-text");
const activeCount = document.getElementById("active-count");
const ring = document.getElementById("ring");
const ringValue = document.getElementById("ring-value");
const toast = document.getElementById("toast");
const continueBtn = document.getElementById("continue-btn");
const totalCount = document.getElementById("total-count");
const remainingCount = document.getElementById("remaining-count");
const progressFill = document.getElementById("progress-fill");
const progressBar = document.getElementById("progress-bar");
const progressPercent = document.getElementById("progress-percent");
const celebration = document.getElementById("celebration");
const internshipStatus = document.getElementById("internship-status");
const backendStatus = document.getElementById("backend-status");
const summaryTotal = document.getElementById("summary-total");

const taskDialog = document.getElementById("task-dialog");
const taskDialogMeta = document.getElementById("task-dialog-meta");
const taskDialogTitle = document.getElementById("task-dialog-title");
const taskDialogBody = document.getElementById("task-dialog-body");

const techPanel = document.getElementById("tech-panel");

// Makes text from the API safe to place inside HTML
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


// =========================================
// 4. BACKEND STATUS INDICATOR
// =========================================

function setBackendStatus(state) {
  const labels = { checking: "Checking...", connected: "Connected", offline: "Offline" };
  backendStatus.textContent = labels[state];
  backendStatus.className = "backend-pill backend-" + state;
}


// =========================================
// 5. PROGRESS
// =========================================

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.status === "completed";
  }).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 1000) / 10; // e.g. 37.5

  totalCount.textContent = total;
  completedCount.textContent = completed;
  completedText.textContent = completed;
  summaryTotal.textContent = total;
  activeCount.textContent = tasks.filter(function (task) {
    return task.status === "in-progress";
  }).length;
  ringValue.textContent = percent + "%";
  ring.style.setProperty("--percent", percent);
  ring.setAttribute("aria-valuenow", percent);
  remainingCount.textContent = total - completed;
  progressPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  progressBar.setAttribute("aria-valuenow", percent);

  const allDone = total > 0 && completed === total;
  celebration.hidden = !allDone;
  internshipStatus.textContent = allDone ? "Completed" : "In Progress";
  internshipStatus.className = "status-pill " + (allDone ? "status-completed" : "status-in-progress");
}


// =========================================
// 6. TASK CARDS
// =========================================

// Which action button a task gets, depending on its status
function getActionButton(task) {
  if (task.status === "completed") {
    return "";
  }
  if (task.status === "not-started") {
    return `<button type="button" class="btn btn-secondary" data-action="start" data-id="${task.id}">Start Task</button>`;
  }
  return `<button type="button" class="btn btn-primary" data-action="complete" data-id="${task.id}">Mark as Completed</button>`;
}

function createTaskCard(task) {
  return `
    <li class="dash-task status-${task.status}">
      <div class="dash-task-top">
        <p class="task-number">Task ${task.number}${task.custom ? " · Added by you" : ""}</p>
        <span class="status-pill status-${task.status}">${statusLabels[task.status]}</span>
      </div>
      <h3>${escapeHTML(task.title)}</h3>
      <p class="task-description">${escapeHTML(task.description)}</p>
      <div class="dash-task-actions">
        <button type="button" class="btn btn-secondary" data-action="view" data-id="${task.id}">View Task</button>
        ${getActionButton(task)}
        ${task.custom ? `<button type="button" class="btn-delete" data-action="delete" data-id="${task.id}">Delete</button>` : ""}
      </div>
    </li>
  `;
}

function renderTasks() {
  const query = searchText.trim().toLowerCase();

  const visibleTasks = tasks.filter(function (task) {
    const matchesStatus = currentFilter === "all" || task.status === currentFilter;
    const matchesSearch = query === "" ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  let cardsHTML = "";
  visibleTasks.forEach(function (task) {
    cardsHTML += createTaskCard(task);
  });

  if (visibleTasks.length === 0) {
    cardsHTML = query === ""
      ? `<li class="dash-message">No tasks here yet.</li>`
      : `<li class="dash-message">No tasks match "${escapeHTML(searchText.trim())}".</li>`;
  }
  taskGrid.innerHTML = cardsHTML;

  if (currentFilter === "all" && query === "") {
    trackerCount.textContent = "Showing all " + tasks.length + " tasks";
  } else if (query !== "") {
    trackerCount.textContent = "Showing " + visibleTasks.length + " of " + tasks.length + " tasks";
  } else {
    trackerCount.textContent = "Showing " + visibleTasks.length + " " + statusLabels[currentFilter] + " task(s)";
  }
}

// Redraws everything that depends on task statuses
function refresh() {
  renderTasks();
  updateProgress();
}


// =========================================
// 7. LOADING TASKS FROM THE API
// Shows "Loading tasks..." while waiting, and a clear
// error message (with a Try again button) if it fails.
// =========================================

function showLoading() {
  tasks = [];
  updateProgress();
  trackerCount.textContent = "";
  taskGrid.innerHTML = `<li class="dash-message" role="status"><span class="spinner" aria-hidden="true"></span> Loading tasks...</li>`;
  setBackendStatus("checking");
}

function showLoadError() {
  tasks = [];
  updateProgress();
  trackerCount.textContent = "";
  taskGrid.innerHTML = `
    <li class="dash-message dash-error" role="alert">
      <strong>Unable to load tasks.</strong>
      <span>Please check your connection or try again.</span>
      <button type="button" class="btn btn-primary" data-action="retry">Try again</button>
    </li>`;
  setBackendStatus("offline");
}

// GET /api/tasks?track=web  (or data)
async function loadTasks() {
  showLoading();
  try {
    tasks = await api("/api/tasks?track=" + currentTrack);
    setBackendStatus("connected");
    refresh();
  } catch (error) {
    showLoadError();
  }
}


// =========================================
// 8. TASK ACTIONS (event delegation)
// One listener on the grid handles every button.
// =========================================

function findTask(id) {
  return tasks.find(function (task) {
    return task.id === id;
  });
}

// View Task: GET /api/tasks/:id, shown in a popup
async function openTaskDialog(id) {
  taskDialogMeta.textContent = "Task";
  taskDialogTitle.textContent = "Loading task...";
  taskDialogBody.innerHTML = `<p role="status"><span class="spinner" aria-hidden="true"></span> Loading task details...</p>`;
  if (!taskDialog.open) {
    taskDialog.showModal();
  }

  try {
    const task = await api("/api/tasks/" + id);
    setBackendStatus("connected");

    taskDialogMeta.textContent = "Task " + task.number + (task.day ? " · Day " + task.day : "") + " · " + task.difficulty;
    taskDialogTitle.textContent = task.title;

    let skillsHTML = "";
    task.skills.forEach(function (skill) {
      skillsHTML += `<li>${escapeHTML(skill)}</li>`;
    });

    taskDialogBody.innerHTML = `
      <p><span class="status-pill status-${task.status}">${statusLabels[task.status]}</span></p>
      <p>${escapeHTML(task.description)}</p>
      <h3>What you will do</h3>
      <p>${escapeHTML(task.details)}</p>
      ${task.skills.length > 0 ? `<h3>Skills</h3><ul class="dialog-list">${skillsHTML}</ul>` : ""}
    `;
  } catch (error) {
    setBackendStatus("offline");
    taskDialogTitle.textContent = "Unable to load task";
    taskDialogBody.innerHTML = `<p role="alert">Please check your connection or try again.</p>`;
  }
}

// Start Task / Mark as Completed: PUT /api/tasks/:id
async function updateTaskStatus(id, status, button) {
  button.disabled = true;
  button.textContent = "Saving...";

  try {
    const updated = await api("/api/tasks/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status })
    });

    // Replace the old copy of the task with the one the server sent back
    tasks = tasks.map(function (task) {
      return task.id === updated.id ? updated : task;
    });
    setBackendStatus("connected");
    refresh();
    showToast(status === "completed" ? "Task " + updated.number + " marked as completed" : "Task " + updated.number + " started");
  } catch (error) {
    setBackendStatus("offline");
    renderTasks();
    showToast("Could not update the task. Is the backend running?");
  }
}

// DELETE /api/tasks/:id (only tasks the intern added themselves)
async function deleteTask(id, button) {
  button.disabled = true;
  button.textContent = "Deleting...";

  try {
    await api("/api/tasks/" + id, { method: "DELETE" });
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    setBackendStatus("connected");
    refresh();
    showToast("Task deleted");
  } catch (error) {
    setBackendStatus("offline");
    renderTasks();
    showToast("Could not delete the task. Is the backend running?");
  }
}

taskGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  if (action === "retry") {
    loadTasks();
    return;
  }

  const id = Number(button.dataset.id);
  if (action === "view") {
    openTaskDialog(id);
  } else if (action === "start") {
    updateTaskStatus(id, "in-progress", button);
  } else if (action === "complete") {
    updateTaskStatus(id, "completed", button);
  } else if (action === "delete") {
    deleteTask(id, button);
  }
});

// Small notice that fades away after a moment
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("toast-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("toast-show");
  }, 2500);
}

// "Continue Task" opens the first task still in progress
// (or the first not started one if nothing is in progress)
continueBtn.addEventListener("click", function () {
  const next = tasks.find(function (task) {
    return task.status === "in-progress";
  }) || tasks.find(function (task) {
    return task.status === "not-started";
  });

  if (next) {
    openTaskDialog(next.id);
  } else if (tasks.length === 0) {
    showToast("The tasks have not loaded yet");
  } else {
    showToast("All tasks are completed");
  }
});


// =========================================
// 9. FILTER BUTTONS
// =========================================

const statusFilterButtons = document.querySelectorAll("[data-status]");

statusFilterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.status;
    statusFilterButtons.forEach(function (other) {
      other.setAttribute("aria-pressed", other === button ? "true" : "false");
    });
    renderTasks();
  });
});


// =========================================
// 9b. SEARCH AND ADD A TASK (optional challenges)
// =========================================

document.getElementById("task-search").addEventListener("input", function (event) {
  searchText = event.target.value;
  renderTasks();
});

const addDialog = document.getElementById("add-dialog");
const addForm = document.getElementById("add-form");
const addTitle = document.getElementById("add-title");
const addDescription = document.getElementById("add-description");
const addError = document.getElementById("add-error");
const addSubmit = document.getElementById("add-submit");

document.getElementById("add-task-btn").addEventListener("click", function () {
  addForm.reset();
  addError.hidden = true;
  addDialog.showModal();
  addTitle.focus();
});

document.getElementById("add-dialog-close").addEventListener("click", function () {
  addDialog.close();
});

document.getElementById("add-cancel").addEventListener("click", function () {
  addDialog.close();
});

// POST /api/tasks
addForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (addTitle.value.trim() === "") {
    addError.textContent = "Please give your task a title.";
    addError.hidden = false;
    addTitle.focus();
    return;
  }
  if (addDescription.value.trim() === "") {
    addError.textContent = "Please describe the task so it is clear what needs to be done.";
    addError.hidden = false;
    addDescription.focus();
    return;
  }
  addError.hidden = true;
  addSubmit.disabled = true;
  addSubmit.textContent = "Adding...";

  try {
    const created = await api("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        track: currentTrack,
        title: addTitle.value.trim(),
        description: addDescription.value.trim()
      })
    });

    tasks.push(created);
    setBackendStatus("connected");
    currentFilter = "all";
    statusFilterButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.status === "all" ? "true" : "false");
    });
    refresh();
    addDialog.close();
    showToast("Task added");
  } catch (error) {
    addError.textContent = "Could not add the task. Please check your connection or try again.";
    addError.hidden = false;
  }

  addSubmit.disabled = false;
  addSubmit.textContent = "Add task";
});


// =========================================
// 10. REGISTRATION
// The intern registers once with a name and a track.
// After that only that track's tasks are shown.
// (The profile is kept in this browser; the tasks come from the API.)
// =========================================

const PROFILE_KEY = "techbridge-dashboard-profile";

const registerSection = document.getElementById("register");
const dashboardView = document.getElementById("dashboard-view");
const registerForm = document.getElementById("register-form");
const nameInput = document.getElementById("intern-name");
const nameError = document.getElementById("name-error");
const welcomeHeading = document.getElementById("welcome-heading");
const trackLabel = document.getElementById("track-label");
const avatar = document.getElementById("avatar");

function getProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (profile && profile.name && trackNames[profile.track]) {
      return profile;
    }
  } catch (error) {
    // No saved profile
  }
  return null;
}

function showDashboard(profile) {
  currentTrack = profile.track;
  currentFilter = "all";
  searchText = "";
  document.getElementById("task-search").value = "";

  welcomeHeading.textContent = "Welcome back, " + profile.name;
  trackLabel.textContent = trackNames[currentTrack] + " Intern";
  avatar.textContent = profile.name.charAt(0).toUpperCase();

  statusFilterButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", button.dataset.status === "all" ? "true" : "false");
  });

  registerSection.hidden = true;
  dashboardView.hidden = false;
  loadTasks();
}

function showRegistration() {
  dashboardView.hidden = true;
  registerSection.hidden = false;
}

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (name === "") {
    nameError.hidden = false;
    nameInput.focus();
    return;
  }
  nameError.hidden = true;

  const profile = {
    name: name,
    track: registerForm.elements["track"].value
  };

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    // Storage unavailable: the dashboard still opens for this visit
  }

  // A new intern starts fresh: POST /api/reset puts the track back to its starting statuses
  try {
    await api("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track: profile.track })
    });
  } catch (error) {
    // If the backend is down, the dashboard shows its error message instead
  }

  showDashboard(profile);
  window.scrollTo(0, 0);
});

document.getElementById("signout-btn").addEventListener("click", function () {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    // Nothing to remove
  }
  registerForm.reset();
  showRegistration();
  window.scrollTo(0, 0);
});


// =========================================
// 11. TASK DETAILS POPUP: closing
// =========================================

document.getElementById("task-dialog-close").addEventListener("click", function () {
  taskDialog.close();
});

document.getElementById("task-dialog-close-bottom").addEventListener("click", function () {
  taskDialog.close();
});

// A click on the dark backdrop lands on the dialog itself
taskDialog.addEventListener("click", function (event) {
  if (event.target === taskDialog) {
    taskDialog.close();
  }
});


// =========================================
// 12. TECHNOLOGY EXPLORER
// =========================================

function showTechnology(key) {
  const tech = technologies[key];

  let pointsHTML = "";
  tech.points.forEach(function (point) {
    pointsHTML += `<li>${point}</li>`;
  });

  let examplesHTML = "";
  if (tech.examples) {
    examplesHTML = `<h4>Backend technologies</h4><ul class="tech-examples">`;
    tech.examples.forEach(function (example) {
      examplesHTML += `<li><strong>${example.name}</strong><span>${example.text}</span></li>`;
    });
    examplesHTML += `</ul>`;
  }

  techPanel.innerHTML = `
    <h3>${tech.name}</h3>
    <p class="tech-summary">${tech.summary}</p>
    <ul class="dialog-list">${pointsHTML}</ul>
    ${examplesHTML}
    <a href="${tech.link}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Learn More</a>
  `;
}

const techButtons = document.querySelectorAll("[data-tech]");

techButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTechnology(button.dataset.tech);
    techButtons.forEach(function (other) {
      other.setAttribute("aria-pressed", other === button ? "true" : "false");
    });
  });
});


// =========================================
// 13. START
// =========================================

const savedProfile = getProfile();
if (savedProfile) {
  showDashboard(savedProfile);
} else {
  showRegistration();
}
showTechnology("nextjs");
