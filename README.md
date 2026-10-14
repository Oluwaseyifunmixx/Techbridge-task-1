# TechBridge Website

Website for **TechBridge by Baselink Services Limited**, built for the TechBridge Web Development Internship.

> Bridging Learning to Real-World Experience

**Live site:** https://oluwaseyifunmixx.github.io/Techbridge-task-1/

## Pages

- **Homepage** (`index.html`), Task 1: introduces TechBridge, its programs, the 30-day practical internship, and how to apply and join the community.
- **Programs** (`programs.html`), Task 2: a dedicated page explaining the Data Analytics and Web Development programs, the skills each one introduces, and how they compare.
- **Internship Roadmap** (`tasks.html`), Tasks 3 and 4: the 30-day internship journey as an interactive roadmap. Visitors switch between the Data Analytics and Web Development tracks to see each track's 8 tasks, days, descriptions, and difficulty levels, without refreshing the page.

## Built with

- **HTML5**: semantic structure, validated with the W3C Nu HTML Checker
- **CSS3**: custom properties (variables), Flexbox, Grid, media queries, and animations
- **JavaScript (vanilla)**: track switching with variables, arrays, objects, functions, event listeners, conditional logic, and DOM manipulation
- **Google Fonts**: Plus Jakarta Sans

No frameworks.

## Features

- Interactive two-track roadmap that switches between Data Analytics and Web Development without a page refresh
- Task data stored as JavaScript arrays of objects and rendered onto the page with DOM manipulation
- Accessible track switcher using `aria-pressed` and a live "Currently viewing" label for screen readers
- 30-day journey bar with each task placed on its real day
- Vertical task timeline with difficulty badges
- Expandable skill details using native `<details>` and `<summary>` elements
- Side-by-side program comparison
- Responsive layout for desktop, tablet, and mobile, with a CSS-only mobile navigation menu
- Sticky header with smooth scrolling and an active-page indicator
- Brand colours taken from the official TechBridge logo
- Hover effects, visible keyboard focus styles, and reduced-motion support

## Project structure

    Techbridge-task-1/
    ├── index.html
    ├── programs.html
    ├── tasks.html
    ├── style.css
    ├── script.js
    ├── README.md
    └── images/
        └── techbridge-logo.png

## Run locally

1. Clone the repository:
   `git clone https://github.com/Oluwaseyifunmixx/Techbridge-task-1.git`
2. Open `index.html` in your browser, or use the Live Server extension in VS Code.

## Author

**Oluwaseyifunmi Akinlabi**: [@Oluwaseyifunmixx](https://github.com/Oluwaseyifunmixx)