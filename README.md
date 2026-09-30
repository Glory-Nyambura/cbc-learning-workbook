# CBC Learning Workbook

A learner-friendly digital workbook for Kenyan CBC learners in Grades 1-3. The app provides Separate Learning Areas lessons, practice questions, assessments, revision activities, learner profiles, progress tracking, points, daily growth projects, and adult progress views.

## Features

- Up to three learner profiles
- Grade-focused home experience with optional access to other grades
- Separate Learning Areas lessons for Grades 1-3
- Structured lesson introductions, objectives, explanations, examples, and guided activities
- Topic-based English lessons with five authored questions each; Mathematics keeps its ten-question banks
- Randomized five-question practice attempts with easy-to-hard question order
- End-of-attempt scores, answer corrections, and non-repeating retries where possible
- Clickable curriculum strands that open related lessons
- Separate Learning Areas assessments
- Randomized 10-question subject assessments drawn across the grade curriculum
- Revision activities by grade and subject
- Learner-scoped progress tracking
- Points for completed lessons, assessments, and revision activities
- Daily activity tracking with selectable growth projects:
  - Grow a tree
  - Build a house
  - Paint a picture
- Learner leaderboard based on activity and points
- Adult View with selectable learner profiles and grade-specific progress
- Guided lesson key ideas and curriculum-authored real-world examples
- Profile-specific progress sync when the optional backend is available

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS
- Lucide React icons
- Optional `@appdeploy/sdk` backend for progress API routes

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173/`. If that port is already in use, Vite selects another available port.

### Publish a shareable link

The GitHub Actions workflow builds the site and publishes it to GitHub Pages whenever changes are pushed to `main`. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source. After the workflow completes, the site will be available at:

```text
https://glory-nyambura.github.io/cbc-learning-workbook/
```

The repository must be pushed to GitHub. The Pages URL may not be public if the repository or organization restricts Pages access.

### Use offline

Open the published site once while online so the service worker can cache the app. Then install it from the browser menu or add it to the device home screen. Lessons and local learner progress remain available offline. Progress syncs to the optional backend only when a connection is available.

### Create a production build

```bash
npm run build
```

### Run automated tests

```bash
npm test
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
.
├── backend/
│   └── index.ts       # Progress API routes
├── src/
│   ├── App.tsx        # Main application, lesson flow, routes, and learner state
│   ├── index.css      # Application styling and responsive layout
│   ├── main.tsx       # React entry point
│   └── lib/
│       └── api.ts     # Small fetch wrapper for API calls
├── tests/
│   ├── tests.json
│   └── workbook.test.tsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Data and Persistence

Learner profiles, profile settings, points, activity dates, completed tasks, and learner progress are stored in browser `localStorage`. When the optional backend is available, progress is also synced by learner profile ID and merged with local progress using the highest score per lesson. The API groups records by profile ID but does not authenticate learners, so it should not be treated as a secure account system.

The backend exposes:

- `GET /api/_healthcheck`
- `GET /api/progress`
- `POST /api/progress`

Progress API requests require a `profileId`. Older shared backend progress records are not assigned to a learner automatically; existing local profile progress remains available on the device.

## Navigation

- **Home:** Continue learning, choose the primary grade, select a subject, or explore another grade.
- **Revision:** Practise lessons by grade and subject.
- **Lessons:** Learn from a short explanation and examples, then answer five questions before seeing a score or corrections.
- **Assessments:** Take focused Mathematics or English assessments for the learner's grade.
- **Progress:** Review learning progress, activity streaks, and points.
- **Settings:** Edit learner profiles and change themes.
- **Adult View:** Select a learner profile and inspect grade-specific subject progress.

## License

This project does not currently define a license.
