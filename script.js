// =========================================
// TECHBRIDGE INTERNSHIP ROADMAP
// Task 4: switch between two internship tracks
// =========================================


// =========================================
// 1. TASK DATA
// Each track is an ARRAY (an ordered list).
// Each task is an OBJECT (one task's details).
// =========================================

const dataAnalyticsTasks = [
  {
    number: 1,
    title: "Data Cleaning Basics",
    day: 1,
    description: "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.",
    difficulty: "Beginner"
  },
  {
    number: 2,
    title: "Formulas & Pivot Tables",
    day: 4,
    description: "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.",
    difficulty: "Beginner"
  },
  {
    number: 3,
    title: "Data Visualization",
    day: 8,
    description: "Create charts and a simple dashboard that communicate useful insights from a dataset.",
    difficulty: "Beginner → Intermediate"
  },
  {
    number: 4,
    title: "Introduction to SQL",
    day: 11,
    description: "Practice basic SQL queries and use them to answer real-world questions about data.",
    difficulty: "Beginner → Intermediate"
  },
  {
    number: 5,
    title: "SQL Joins & Aggregations",
    day: 15,
    description: "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.",
    difficulty: "Intermediate"
  },
  {
    number: 6,
    title: "Lookup Functions & Data Wrangling",
    day: 19,
    description: "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.",
    difficulty: "Intermediate"
  },
  {
    number: 7,
    title: "Mini Analysis Project",
    day: 22,
    description: "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.",
    difficulty: "Intermediate"
  },
  {
    number: 8,
    title: "Capstone Project",
    day: 26,
    description: "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.",
    difficulty: "Intermediate"
  }
];

const webDevelopmentTasks = [
  {
    number: 1,
    title: "Build the TechBridge Homepage",
    day: 1,
    description: "Create the first version of the TechBridge website using HTML and CSS.",
    difficulty: "Beginner"
  },
  {
    number: 2,
    title: "Build the TechBridge Programs Experience",
    day: 4,
    description: "Create a Programs experience presenting TechBridge's available learning programs.",
    difficulty: "Beginner"
  },
  {
    number: 3,
    title: "Build the Internship Tasks Experience",
    day: 8,
    description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
    difficulty: "Beginner → Intermediate"
  },
  {
    number: 4,
    title: "Build an Interactive Internship Roadmap",
    day: 11,
    description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.",
    difficulty: "Beginner → Intermediate"
  },
  {
    number: 5,
    title: "Build the Intern Registration Experience",
    day: 15,
    description: "Create a professional registration and onboarding interface for TechBridge interns.",
    difficulty: "Intermediate"
  },
  {
    number: 6,
    title: "Build the Task Submission System",
    day: 19,
    description: "Create an interface through which interns can prepare and submit their task work.",
    difficulty: "Intermediate"
  },
  {
    number: 7,
    title: "Build the Intern Dashboard",
    day: 22,
    description: "Create a dashboard where an intern can view their profile, progress, tasks and submissions.",
    difficulty: "Intermediate"
  },
  {
    number: 8,
    title: "Build the Complete TechBridge Internship Platform",
    day: 26,
    description: "Combine the different components created during the internship into a complete TechBridge platform.",
    difficulty: "Intermediate"
  }
];


// =========================================
// 2. CURRENT STATE
// Remembers which track is on screen right now.
// =========================================

let currentTrack = "web-development";

// =========================================
// 3. PAGE ELEMENTS JAVASCRIPT WILL CHANGE
// =========================================

const taskList = document.getElementById("task-list");
const currentTrackName = document.getElementById("current-track-name");


// =========================================
// 4. HELPER FUNCTIONS (each does one small job)
// =========================================

// Picks the right list of tasks for a track
function getTasksForTrack(track) {
  if (track === "data-analytics") {
    return dataAnalyticsTasks;
  } else {
    return webDevelopmentTasks;
  }
}

// Turns a track's code name into a readable name
function getTrackName(track) {
  if (track === "data-analytics") {
    return "Data Analytics";
  } else {
    return "Web Development";
  }
}

// Picks the badge colour for a difficulty level
function getDifficultyClass(difficulty) {
  if (difficulty === "Beginner") {
    return "badge-level-1";
  } else if (difficulty === "Beginner → Intermediate") {
    return "badge-level-2";
  } else {
    return "badge-level-3";
  }
}

// Builds the HTML for one task card
function createTaskCard(task) {
  return `
    <li class="task-item" id="task-${task.number}">
      <div class="task-marker" aria-hidden="true">${task.number}</div>
      <article class="task-card">
        <div class="task-meta">
          <span class="task-day">Day ${task.day}</span>
          <span class="badge ${getDifficultyClass(task.difficulty)}">${task.difficulty}</span>
        </div>
        <p class="task-number">Task ${task.number}</p>
        <h3>${task.title}</h3>
        <p class="task-description">${task.description}</p>
      </article>
    </li>
  `;
}


// =========================================
// 5. DRAW A TRACK ON THE PAGE
// =========================================

function showTrack(track) {
  // 1. Get the right list of tasks
  const tasks = getTasksForTrack(track);

  // 2. Build one card for every task
  let cardsHTML = "";
  tasks.forEach(function (task) {
    cardsHTML += createTaskCard(task);
  });

  // 3. Put the cards on the page
  taskList.innerHTML = cardsHTML;

  // 4. Update the "Currently viewing" label
  currentTrackName.textContent = getTrackName(track);
}

// Show the default track when the page first loads
showTrack(currentTrack);

// =========================================
// 6. TRACK BUTTONS (event listeners)
// =========================================

const trackButtons = document.querySelectorAll(".track-btn");

// Marks the selected button as pressed, and the others as not pressed
function updateActiveButton(track) {
  trackButtons.forEach(function (button) {
    if (button.dataset.track === track) {
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }
  });
}

// Listen for clicks on each track button
trackButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedTrack = button.dataset.track;

    // If this track is already showing, there's nothing to change
    if (selectedTrack === currentTrack) {
      return;
    }

    currentTrack = selectedTrack;
    showTrack(currentTrack);
    updateActiveButton(currentTrack);
  });
});