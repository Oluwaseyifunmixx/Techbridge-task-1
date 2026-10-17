// =========================================
// TECHBRIDGE CHALLENGE HUB
// Task 5: browse, filter, and view challenges
// =========================================


// =========================================
// 1. CHALLENGE DATA
// One ARRAY holding every challenge.
// Each challenge is an OBJECT with its own track and difficulty,
// so the filters can mix and match them.
// =========================================

const challenges = [
  {
    id: "monthly-sales-analysis",
    title: "Monthly Sales Analysis",
    track: "data-analytics",
    difficulty: "Beginner",
    description: "Analyse a small store's sales records to find its best-selling products and busiest months.",
    outcome: "A short summary of sales trends, backed by a few clear charts.",
    objective: "Explore a sales dataset, calculate totals and averages, and identify which products and months perform best.",
    skills: ["Data cleaning", "Basic formulas", "Sorting and filtering", "Simple charts"],
    tools: ["Excel or Google Sheets"],
    deliverable: "A spreadsheet with your calculations and 2–3 charts, plus a short written summary of what you found.",
    time: "3–5 hours"
  },
  {
    id: "personal-expense-breakdown",
    title: "Personal Expense Breakdown",
    track: "data-analytics",
    difficulty: "Beginner",
    description: "Organise a month of expense records into categories to see exactly where the money goes.",
    outcome: "A categorised expense sheet with a chart showing spending by category.",
    objective: "Clean and categorise expense records, then summarise spending by category and by week.",
    skills: ["Data cleaning", "Category totals (SUMIF)", "Pivot Tables", "Bar and pie charts"],
    tools: ["Excel or Google Sheets"],
    deliverable: "A cleaned expense sheet, a Pivot Table summary and one chart, with three practical saving recommendations.",
    time: "2–4 hours"
  },
  {
    id: "customer-churn-analysis",
    title: "Customer Churn Analysis",
    track: "data-analytics",
    difficulty: "Intermediate",
    description: "Investigate why customers of a subscription service cancel, using customer and usage data.",
    outcome: "A short report on the main factors linked to customers leaving, with recommendations.",
    objective: "Compare customers who stayed with those who left, and identify patterns such as plan type, usage levels or support requests.",
    skills: ["Data cleaning", "Pivot Tables", "Lookup functions", "Comparing groups", "Data visualization"],
    tools: ["Excel or Google Sheets", "SQL (optional)"],
    deliverable: "An analysis workbook and a one-page report with charts and 3–5 recommendations for reducing churn.",
    time: "6–8 hours"
  },
  {
    id: "business-performance-dashboard",
    title: "Business Performance Dashboard",
    track: "data-analytics",
    difficulty: "Advanced",
    description: "Combine sales, product and region data from several tables into one dashboard for business managers.",
    outcome: "An interactive dashboard that shows key performance figures at a glance.",
    objective: "Use SQL to join related tables and calculate key metrics, then present them in a clear, filterable dashboard.",
    skills: ["SQL joins and aggregations", "Data modelling", "Choosing key metrics", "Dashboard design"],
    tools: ["SQL (e.g. SQLite or MySQL)", "Excel, Google Sheets or Looker Studio"],
    deliverable: "Your SQL queries, a cleaned dataset and a dashboard with at least four key metrics and working filters.",
    time: "10–15 hours"
  },
  {
    id: "responsive-landing-page",
    title: "Responsive Landing Page",
    track: "web-development",
    difficulty: "Beginner",
    description: "Build a one-page website for a small business that looks good on phones, tablets and laptops.",
    outcome: "A live, responsive landing page with a clear call to action.",
    objective: "Structure content with semantic HTML and style it with CSS so the layout adapts to any screen size.",
    skills: ["Semantic HTML", "CSS Flexbox and Grid", "Media queries", "Basic accessibility"],
    tools: ["HTML", "CSS", "VS Code", "GitHub Pages"],
    deliverable: "A deployed landing page with a hero, features and contact section, plus its GitHub repository.",
    time: "4–6 hours"
  },
  {
    id: "contact-form-validation",
    title: "Contact Form with Validation",
    track: "web-development",
    difficulty: "Intermediate",
    description: "Create a contact form that checks what users type and shows helpful messages before it submits.",
    outcome: "A user-friendly form that catches mistakes like empty fields or invalid email addresses.",
    objective: "Build an accessible form and use JavaScript to validate each field and give clear, friendly feedback.",
    skills: ["HTML forms", "JavaScript events", "Form validation", "Accessible error messages"],
    tools: ["HTML", "CSS", "JavaScript"],
    deliverable: "A working contact form page that validates name, email and message, and shows a success message.",
    time: "4–6 hours"
  },
  {
    id: "product-page-cart",
    title: "Product Page with Cart Counter",
    track: "web-development",
    difficulty: "Intermediate",
    description: "Build a product page where shoppers can pick options and add items to a cart that updates instantly.",
    outcome: "An interactive product page with a live cart count.",
    objective: "Use JavaScript to update the selected options, quantity and cart count without reloading the page.",
    skills: ["DOM manipulation", "Event listeners", "Working with data in JavaScript", "Responsive layout"],
    tools: ["HTML", "CSS", "JavaScript"],
    deliverable: "A product page with an image, options, a quantity selector and a cart counter that updates as items are added.",
    time: "5–7 hours"
  },
  {
    id: "multi-page-business-website",
    title: "Multi-Page Business Website",
    track: "web-development",
    difficulty: "Advanced",
    description: "Build a complete website for a business, with several connected pages and interactive features.",
    outcome: "A deployed multi-page website with consistent design, navigation and interactive elements.",
    objective: "Plan and build several linked pages that share one design system, one navigation and reusable JavaScript features.",
    skills: ["Site planning", "Reusable CSS", "Responsive design", "JavaScript interactivity", "Git workflow"],
    tools: ["HTML", "CSS", "JavaScript", "Git", "GitHub Pages"],
    deliverable: "A live website with at least four pages, a mobile menu and at least one interactive feature, plus a README.",
    time: "12–16 hours"
  }
];


// =========================================
// 2. CURRENT FILTERS
// "all" means "don't filter by this".
// =========================================

let activeTrack = "all";
let activeDifficulty = "all";


// =========================================
// 3. PAGE ELEMENTS JAVASCRIPT WILL CHANGE
// =========================================

const challengeGrid = document.getElementById("challenge-grid");


// =========================================
// 4. HELPER FUNCTIONS (each does one small job)
// =========================================

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
  } else if (difficulty === "Intermediate") {
    return "badge-level-2";
  } else {
    return "badge-level-3";
  }
}

// Builds the HTML for one challenge card
function createChallengeCard(challenge) {
  return `
    <li>
      <article class="challenge-card challenge-card-${challenge.track}">
        <div class="challenge-tags">
          <span class="track-tag track-tag-${challenge.track}">${getTrackName(challenge.track)}</span>
          <span class="badge ${getDifficultyClass(challenge.difficulty)}">${challenge.difficulty}</span>
        </div>

        <h3>${challenge.title}</h3>
        <p class="challenge-description">${challenge.description}</p>

        <div class="challenge-outcome">
          <p class="outcome-label">Expected outcome</p>
          <p>${challenge.outcome}</p>
        </div>

        <button type="button" class="btn btn-secondary view-btn" data-id="${challenge.id}" aria-label="View challenge: ${challenge.title}">
          View Challenge
        </button>
      </article>
    </li>
  `;
}


// =========================================
// 5. DRAW A LIST OF CHALLENGES ON THE PAGE
// =========================================

function renderChallenges(list) {
  let cardsHTML = "";

  list.forEach(function (challenge) {
    cardsHTML += createChallengeCard(challenge);
  });

  challengeGrid.innerHTML = cardsHTML;
}

// =========================================
// 6. FILTERING
// =========================================

const filterButtons = document.querySelectorAll(".filter-btn");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");
const resetButton = document.getElementById("reset-filters");
const noResultsReset = document.getElementById("no-results-reset");

// Keeps only the challenges that match BOTH filters
function getFilteredChallenges() {
  return challenges.filter(function (challenge) {
    const matchesTrack = activeTrack === "all" || challenge.track === activeTrack;
    const matchesDifficulty = activeDifficulty === "all" || challenge.difficulty === activeDifficulty;

    return matchesTrack && matchesDifficulty;
  });
}

// Updates the "Showing X of 8" text and the "no results" message
function updateResults(count) {
  if (count === challenges.length) {
    resultsCount.textContent = `Showing all ${challenges.length} challenges`;
  } else {
    resultsCount.textContent = `Showing ${count} of ${challenges.length} challenges`;
  }

  // Show the "no results" box only when nothing matched
  noResults.hidden = count !== 0;
}

// Highlights the chosen button in each filter group
function updateFilterButtons() {
  filterButtons.forEach(function (button) {
    const type = button.dataset.filterType;
    const value = button.dataset.value;
    let isActive;

    if (type === "track") {
      isActive = value === activeTrack;
    } else {
      isActive = value === activeDifficulty;
    }

    button.setAttribute("aria-pressed", String(isActive));
  });
}

// Runs the filters and updates everything on the page
function applyFilters() {
  const filtered = getFilteredChallenges();

  renderChallenges(filtered);
  updateResults(filtered.length);
  updateFilterButtons();
}

// When any filter button is clicked, remember the choice and re-filter
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const type = button.dataset.filterType;
    const value = button.dataset.value;

    if (type === "track") {
      activeTrack = value;
    } else {
      activeDifficulty = value;
    }

    applyFilters();
  });
});

// Reset both filters back to "All"
function resetFilters() {
  activeTrack = "all";
  activeDifficulty = "all";
  applyFilters();
}

resetButton.addEventListener("click", resetFilters);
noResultsReset.addEventListener("click", resetFilters);


// =========================================
// 8. CHALLENGE DETAILS POPUP
// =========================================

const dialog = document.getElementById("challenge-dialog");
const dialogMeta = document.getElementById("dialog-meta");
const dialogTitle = document.getElementById("dialog-title");
const dialogBody = document.getElementById("dialog-body");
const dialogClose = document.getElementById("dialog-close");
const dialogCloseBottom = document.getElementById("dialog-close-bottom");

// Turns a list (like skills) into small tags
function createTagList(items) {
  let tagsHTML = "";

  items.forEach(function (item) {
    tagsHTML += `<li>${item}</li>`;
  });

  return `<ul class="tag-list">${tagsHTML}</ul>`;
}

// Finds a challenge by its id, fills the popup, and opens it
function openChallenge(id) {
  const challenge = challenges.find(function (item) {
    return item.id === id;
  });

  // Safety check: stop if no challenge has that id
  if (!challenge) {
    return;
  }

  dialogMeta.textContent = `${getTrackName(challenge.track)} · ${challenge.difficulty}`;
  dialogTitle.textContent = challenge.title;

  dialogBody.innerHTML = `
    <div class="detail">
      <h3>Objective</h3>
      <p>${challenge.objective}</p>
    </div>

    <div class="detail">
      <h3>Skills you'll use</h3>
      ${createTagList(challenge.skills)}
    </div>

    <div class="detail">
      <h3>Tools</h3>
      ${createTagList(challenge.tools)}
    </div>

    <div class="detail">
      <h3>What you'll produce</h3>
      <p>${challenge.deliverable}</p>
    </div>

    <div class="detail-row">
      <div class="detail">
        <h3>Estimated time</h3>
        <p>${challenge.time}</p>
      </div>
      <div class="detail">
        <h3>Expected result</h3>
        <p>${challenge.outcome}</p>
      </div>
    </div>
  `;

  dialog.showModal();
}

function closeChallenge() {
  dialog.close();
}

// One listener on the whole grid catches clicks on ANY "View Challenge" button
challengeGrid.addEventListener("click", function (event) {
  const button = event.target.closest(".view-btn");

  if (button) {
    openChallenge(button.dataset.id);
  }
});

// The × button and the Close button
dialogClose.addEventListener("click", closeChallenge);
dialogCloseBottom.addEventListener("click", closeChallenge);

// Clicking the dimmed background (outside the popup box) also closes it
dialog.addEventListener("click", function (event) {
  if (event.target === dialog) {
    closeChallenge();
  }
});

// =========================================
// 7. START: show everything when the page loads
// =========================================

applyFilters();