// =========================================
// TECHBRIDGE INTERN DASHBOARD
// Task 6: progress, task tracker, filters,
// task details and technology explorer
// =========================================


// =========================================
// 1. DATA
// Tasks and technologies are ARRAYS of OBJECTS.
// The page is built from this data.
// =========================================

const webTasks = [
  {
    number: 1,
    title: "Build the TechBridge Homepage",
    day: 1,
    difficulty: "Beginner",
    description: "Create the first version of the TechBridge website using HTML and CSS.",
    details: "Build a responsive homepage that introduces TechBridge, its programs and the 30-day internship.",
    skills: ["HTML5", "CSS3", "Responsive design"],
    status: "in-progress"
  },
  {
    number: 2,
    title: "Build the TechBridge Programs Experience",
    day: 4,
    difficulty: "Beginner",
    description: "Create a Programs experience presenting TechBridge's available learning programs.",
    details: "Design a page that explains the Data Analytics and Web Development programs and compares them side by side.",
    skills: ["Semantic HTML", "CSS Grid", "Layout"],
    status: "not-started"
  },
  {
    number: 3,
    title: "Build the Internship Tasks Experience",
    day: 8,
    difficulty: "Beginner → Intermediate",
    description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
    details: "Present the internship tasks in a clear, easy-to-scan layout that shows the 30-day journey.",
    skills: ["HTML5", "CSS3", "Information design"],
    status: "not-started"
  },
  {
    number: 4,
    title: "Build an Interactive Internship Roadmap",
    day: 11,
    difficulty: "Beginner → Intermediate",
    description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.",
    details: "Store the tasks as JavaScript data and render them on the page, switching tracks without a refresh.",
    skills: ["JavaScript", "DOM manipulation", "Event listeners"],
    status: "not-started"
  },
  {
    number: 5,
    title: "Build the Intern Registration Experience",
    day: 15,
    difficulty: "Intermediate",
    description: "Create a professional registration and onboarding interface for TechBridge interns.",
    details: "Design a registration flow with clear fields, helpful messages and an onboarding feel.",
    skills: ["Forms", "Validation", "UX"],
    status: "not-started"
  },
  {
    number: 6,
    title: "Build the Task Submission System",
    day: 19,
    difficulty: "Intermediate",
    description: "Create an interface through which interns can prepare and submit their task work.",
    details: "Build a submission interface where interns can prepare their work and send it for review.",
    skills: ["Forms", "JavaScript", "State handling"],
    status: "not-started"
  },
  {
    number: 7,
    title: "Build the Intern Dashboard",
    day: 22,
    difficulty: "Intermediate",
    description: "Create a dashboard where an intern can view their profile, progress, tasks and submissions.",
    details: "Bring progress, tasks and submissions together in one dashboard that updates live.",
    skills: ["JavaScript", "Filtering", "Progress calculations"],
    status: "not-started"
  },
  {
    number: 8,
    title: "Build the Complete TechBridge Internship Platform",
    day: 26,
    difficulty: "Intermediate",
    description: "Combine the different components created during the internship into a complete TechBridge platform.",
    details: "Connect every page and feature built so far into one polished, working platform.",
    skills: ["Project organization", "Integration", "Responsive design"],
    status: "not-started"
  }
];

const dataTasks = [
  {
    number: 1,
    title: "Data Cleaning Basics",
    day: 1,
    difficulty: "Beginner",
    description: "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.",
    details: "Take a messy spreadsheet and turn it into a clean, reliable dataset ready for analysis.",
    skills: ["Google Sheets", "Excel", "Data cleaning"],
    status: "in-progress"
  },
  {
    number: 2,
    title: "Formulas & Pivot Tables",
    day: 4,
    difficulty: "Beginner",
    description: "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.",
    details: "Summarise a dataset with formulas and Pivot Tables to answer real questions about it.",
    skills: ["Formulas", "Pivot Tables", "Summarising data"],
    status: "not-started"
  },
  {
    number: 3,
    title: "Data Visualization",
    day: 8,
    difficulty: "Beginner → Intermediate",
    description: "Create charts and a simple dashboard that communicate useful insights from a dataset.",
    details: "Choose the right charts and arrange them in a simple dashboard that tells a clear story.",
    skills: ["Charts", "Dashboards", "Data storytelling"],
    status: "not-started"
  },
  {
    number: 4,
    title: "Introduction to SQL",
    day: 11,
    difficulty: "Beginner → Intermediate",
    description: "Practice basic SQL queries and use them to answer real-world questions about data.",
    details: "Write SELECT queries with filtering and sorting to pull answers out of a database.",
    skills: ["SQL", "SELECT queries", "Filtering"],
    status: "not-started"
  },
  {
    number: 5,
    title: "SQL Joins & Aggregations",
    day: 15,
    difficulty: "Intermediate",
    description: "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.",
    details: "Combine several tables and summarise them with grouping and aggregate functions.",
    skills: ["JOIN", "GROUP BY", "COUNT, SUM, AVG"],
    status: "not-started"
  },
  {
    number: 6,
    title: "Lookup Functions & Data Wrangling",
    day: 19,
    difficulty: "Intermediate",
    description: "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.",
    details: "Merge related datasets with lookup functions and fix the mismatches you find along the way.",
    skills: ["VLOOKUP", "XLOOKUP", "Data wrangling"],
    status: "not-started"
  },
  {
    number: 7,
    title: "Mini Analysis Project",
    day: 22,
    difficulty: "Intermediate",
    description: "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.",
    details: "Run a small analysis from raw data to recommendations, using everything learned so far.",
    skills: ["Cleaning", "Pivot Tables", "Recommendations"],
    status: "not-started"
  },
  {
    number: 8,
    title: "Capstone Project",
    day: 26,
    difficulty: "Intermediate",
    description: "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.",
    details: "Finish a larger project that combines spreadsheet analysis and SQL across related tables.",
    skills: ["Spreadsheets", "SQL", "Project work"],
    status: "not-started"
  }
];

const tracks = {
  web: { name: "Web Development", tasks: webTasks },
  data: { name: "Data Analytics", tasks: dataTasks }
};

// Every new intern starts from these statuses
[webTasks, dataTasks].forEach(function (list) {
  list.forEach(function (task) {
    task.startStatus = task.status;
  });
});

const statusLabels = {
  "completed": "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started"
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
// 2. STATE AND PAGE ELEMENTS
// =========================================

const STORAGE_KEY = "techbridge-dashboard-tasks";
let currentTrack = "web";
let tasks = tracks[currentTrack].tasks;
let currentFilter = "all";

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

const taskDialog = document.getElementById("task-dialog");
const taskDialogMeta = document.getElementById("task-dialog-meta");
const taskDialogTitle = document.getElementById("task-dialog-title");
const taskDialogBody = document.getElementById("task-dialog-body");

const techPanel = document.getElementById("tech-panel");


// =========================================
// 3. SAVE AND LOAD (Local Storage)
// Only the statuses are saved. If storage is
// blocked or empty, the default statuses are used.
// =========================================

function saveProgress() {
  try {
    const saved = {};
    tasks.forEach(function (task) {
      saved[task.number] = task.status;
    });
    localStorage.setItem(STORAGE_KEY + "-" + currentTrack, JSON.stringify(saved));
  } catch (error) {
    // Storage unavailable: the dashboard still works for this visit
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY + "-" + currentTrack));
    if (!saved) {
      return;
    }
    tasks.forEach(function (task) {
      if (statusLabels[saved[task.number]]) {
        task.status = saved[task.number];
      }
    });
  } catch (error) {
    // Ignore unreadable saved data
  }
}


// =========================================
// 4. PROGRESS
// =========================================

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.status === "completed";
  }).length;
  const percent = Math.round((completed / total) * 1000) / 10; // one decimal, e.g. 37.5

  totalCount.textContent = total;
  completedCount.textContent = completed;
  completedText.textContent = completed;
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

  const allDone = completed === total;
  celebration.hidden = !allDone;
  internshipStatus.textContent = allDone ? "Completed" : "In Progress";
  internshipStatus.className = "status-pill " + (allDone ? "status-completed" : "status-in-progress");
}


// =========================================
// 5. TASK CARDS
// =========================================

// Which action button a task gets, depending on its status
function getActionButton(task) {
  if (task.status === "completed") {
    return "";
  }
  if (task.status === "not-started") {
    return `<button type="button" class="btn btn-secondary" data-action="start" data-number="${task.number}">Start Task</button>`;
  }
  return `<button type="button" class="btn btn-primary" data-action="complete" data-number="${task.number}">Mark as Completed</button>`;
}

function createTaskCard(task) {
  return `
    <li class="dash-task status-${task.status}">
      <div class="dash-task-top">
        <p class="task-number">Task ${task.number}</p>
        <span class="status-pill status-${task.status}">${statusLabels[task.status]}</span>
      </div>
      <h3>${task.title}</h3>
      <p class="task-description">${task.description}</p>
      <div class="dash-task-actions">
        <button type="button" class="btn btn-secondary" data-action="view" data-number="${task.number}">View Task</button>
        ${getActionButton(task)}
      </div>
    </li>
  `;
}

function renderTasks() {
  const visibleTasks = tasks.filter(function (task) {
    return currentFilter === "all" || task.status === currentFilter;
  });

  let cardsHTML = "";
  visibleTasks.forEach(function (task) {
    cardsHTML += createTaskCard(task);
  });

  if (visibleTasks.length === 0) {
    cardsHTML = `<li class="dash-empty">No tasks here yet.</li>`;
  }
  taskGrid.innerHTML = cardsHTML;

  if (currentFilter === "all") {
    trackerCount.textContent = "Showing all " + tasks.length + " tasks";
  } else {
    trackerCount.textContent = "Showing " + visibleTasks.length + " " + statusLabels[currentFilter] + " task(s)";
  }
}

// Redraws everything that depends on task statuses
function refresh() {
  renderTasks();
  updateProgress();
  saveProgress();
}


// =========================================
// 6. TASK ACTIONS (event delegation)
// One listener on the grid handles every button.
// =========================================

function findTask(number) {
  return tasks.find(function (task) {
    return task.number === number;
  });
}

function openTaskDialog(task) {
  taskDialogMeta.textContent = "Task " + task.number + " · Day " + task.day + " · " + task.difficulty;
  taskDialogTitle.textContent = task.title;

  let skillsHTML = "";
  task.skills.forEach(function (skill) {
    skillsHTML += `<li>${skill}</li>`;
  });

  taskDialogBody.innerHTML = `
    <p><span class="status-pill status-${task.status}">${statusLabels[task.status]}</span></p>
    <p>${task.description}</p>
    <h3>What you will do</h3>
    <p>${task.details}</p>
    <h3>Skills</h3>
    <ul class="dialog-list">${skillsHTML}</ul>
  `;
  taskDialog.showModal();
}

taskGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const task = findTask(Number(button.dataset.number));
  const action = button.dataset.action;

  if (action === "view") {
    openTaskDialog(task);
    return;
  }

  task.status = action === "start" ? "in-progress" : "completed";
  refresh();
  showToast(action === "start" ? "Task " + task.number + " started" : "Task " + task.number + " marked as completed");
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
    openTaskDialog(next);
  } else {
    showToast("All tasks are completed");
  }
});


// =========================================
// 7. FILTER BUTTONS
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
// 7b. REGISTRATION
// The intern registers once with a name and a track.
// After that only that track's tasks are shown.
// (Demo only: the profile lives in this browser.)
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
    if (profile && profile.name && tracks[profile.track]) {
      return profile;
    }
  } catch (error) {
    // No saved profile
  }
  return null;
}

function showDashboard(profile) {
  currentTrack = profile.track;
  tasks = tracks[currentTrack].tasks;
  currentFilter = "all";

  welcomeHeading.textContent = "Welcome back, " + profile.name;
  trackLabel.textContent = tracks[currentTrack].name + " Intern";
  avatar.textContent = profile.name.charAt(0).toUpperCase();

  statusFilterButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", button.dataset.status === "all" ? "true" : "false");
  });

  registerSection.hidden = true;
  dashboardView.hidden = false;
  loadProgress();
  refresh();
}

function showRegistration() {
  dashboardView.hidden = true;
  registerSection.hidden = false;
}

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (name === "") {
    nameError.hidden = false;
    nameInput.focus();
    return;
  }
  nameError.hidden = true;

  // A new registration starts fresh: clear any earlier progress
  Object.keys(tracks).forEach(function (key) {
    tracks[key].tasks.forEach(function (task) {
      task.status = task.startStatus;
    });
    try {
      localStorage.removeItem(STORAGE_KEY + "-" + key);
    } catch (error) {
      // Nothing to clear
    }
  });

  const profile = {
    name: name,
    track: registerForm.elements["track"].value
  };

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    // Storage unavailable: the dashboard still opens for this visit
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
// 8. TASK DETAILS POPUP: closing
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
// 9. TECHNOLOGY EXPLORER
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
// 10. START
// =========================================

const savedProfile = getProfile();
if (savedProfile) {
  showDashboard(savedProfile);
} else {
  showRegistration();
}
showTechnology("nextjs");
