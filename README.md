# TechBridge Website

Website for **TechBridge by Baselink Services Limited**, built for the TechBridge Web Development Internship.

> Bridging Learning to Real-World Experience

**Live site:** https://oluwaseyifunmixx.github.io/Techbridge-task-1/

## Pages

- **Homepage** (`index.html`), Task 1: introduces TechBridge, its programs, the 30-day practical internship, and how to apply and join the community.
- **Programs** (`programs.html`), Task 2: a dedicated page explaining the Data Analytics and Web Development programs, the skills each one introduces, and how they compare.
- **Internship Roadmap** (`tasks.html`), Tasks 3 and 4: the 30-day internship journey as an interactive roadmap. Visitors switch between the Data Analytics and Web Development tracks to see each track's 8 tasks, days, descriptions, and difficulty levels, without refreshing the page.
- **Challenge Hub** (`challenges.html`), Task 5: practical challenges from both tracks that visitors can filter by track and difficulty, with a details popup for each challenge.
- **Intern Dashboard** (`dashboard.html`), Task 6: interns register with a name and a track (Web Development or Data Analytics) and see only their own 8 tasks. The dashboard has a live progress ring and bar, an interactive task tracker (mark complete, filter by status, view details), a link to the Challenge Hub, and a Technology Explorer covering Next.js, Vue.js, Angular and backend development. Registration is saved in Local Storage (the profile is kept in the browser).

- **Task Management API** (`backend/`), Task 7: a Node.js + Express REST API. The dashboard no longer holds the tasks itself: it requests them with `fetch()`, shows a loading message and an error message, and sends status updates back to the server. A "Backend Status" indicator shows Connected or Offline.

## Built with

- **HTML5**: semantic structure, validated with the W3C Nu HTML Checker
- **CSS3**: custom properties (variables), Flexbox, Grid, media queries, and animations
- **JavaScript (vanilla)**: variables, arrays, objects, functions, event listeners, conditional logic, DOM manipulation, array methods (`filter`, `find`, `forEach`), and event delegation
- **Google Fonts**: Plus Jakarta Sans

No frameworks.

## Features

- Challenge Hub with combined track and difficulty filters, a live results count, a "no results" message, and a reset button
- Challenge details shown in an accessible popup using the native `<dialog>` element (closes with Escape, the close buttons, or a click outside)
- Interactive two-track roadmap that switches between Data Analytics and Web Development without a page refresh
- Content stored as JavaScript arrays of objects and rendered onto the page with DOM manipulation
- Accessible controls using `aria-pressed`, `aria-live` announcements, and visible keyboard focus styles
- 30-day journey bar with each task placed on its real day
- Expandable skill details using native `<details>` and `<summary>` elements
- Side-by-side program comparison
- Responsive layout for desktop, tablet, and mobile, with a CSS-only mobile navigation menu
- Sticky header with smooth scrolling and an active-page indicator
- Brand colours taken from the official TechBridge logo
- Cache-busted CSS and JavaScript files, so visitors always get the latest version
- Hover effects and reduced-motion support

## Task Management API (Task 7)

The dashboard gets its tasks from a small Node.js + Express backend: **Frontend -> fetch() -> REST API -> Node.js + Express -> Task data** (`backend/data/tasks.json`).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks. Add `?track=web` or `?track=data` for one internship track. |
| GET | `/api/tasks/:id` | Get one task. Used by **View Task**. Returns 404 if the task does not exist. |
| PUT | `/api/tasks/:id` | Update a task's status. Send `{ "status": "completed" }` (or `in-progress`, `not-started`). Returns 400 for any other status. |
| POST | `/api/tasks` | Optional challenge: add a new task. Send `{ "track": "web", "title": "...", "description": "..." }`. Returns the new task (201), or 400 if the title, description or track is missing or invalid. |
| DELETE | `/api/tasks/:id` | Optional challenge: delete a task. Returns the deleted task, or 404 if it does not exist. The dashboard only offers Delete on tasks the intern added. |
| POST | `/api/reset` | Extra: put one track's tasks back to their starting status when a new intern registers. Send `{ "track": "web" }`. |

Search is built into the dashboard: type in the search box to filter the loaded tasks by title or description, together with the status filters.

Task changes (status updates and added tasks) are saved to `backend/data/progress.json` (created automatically, not committed), so progress is still there after the server restarts. Delete that file to start from scratch.

### Run it locally

1. Open a terminal in the `backend` folder and run `npm install` (first time only).
2. Run `npm start`.
3. Open http://localhost:3000/dashboard.html. The same server also serves the website, so the dashboard and the API share one address. Try http://localhost:3000/api/tasks to see the raw JSON.

The dashboard also works when the website is opened with VS Code Live Server, as long as the backend is running on port 3000.

### Live site note

GitHub Pages only hosts static files, so the Node.js backend does not run there. On the live site the dashboard correctly shows "Unable to load tasks" and "Backend Status: Offline". To make it work online, deploy the `backend` folder to a Node host and put its address in `js/config.js`.

## Project structure

    Techbridge-task-1/
    ├── index.html
    ├── programs.html
    ├── tasks.html
    ├── challenges.html
    ├── dashboard.html
    ├── style.css
    ├── script.js          (Roadmap page)
    ├── challenges.js      (Challenge Hub page)
    ├── backend/
    │   ├── server.js          (Express API)
    │   ├── package.json
    │   └── data/tasks.json    (task data)
    ├── css/
    │   └── dashboard.css  (Dashboard page)
    ├── js/
    │   ├── dashboard.js   (Dashboard page, talks to the API)
    │   └── config.js      (deployed API address)
    ├── README.md
    └── images/
        └── techbridge-logo.png

## Run locally

1. Clone the repository:
   `git clone https://github.com/Oluwaseyifunmixx/Techbridge-task-1.git`
2. Open `index.html` in your browser, or use the Live Server extension in VS Code.

## Author

**Oluwaseyifunmi Akinlabi**: [@Oluwaseyifunmixx](https://github.com/Oluwaseyifunmixx)