# CBC Learning Workbook

A learner-friendly digital workbook for Kenyan CBC learners in Grades 1-3. The app provides Mathematics and English lessons, practice questions, assessments, revision activities, learner profiles, progress tracking, points, daily growth projects, and adult progress views.

## Features

- Up to three learner profiles
- Learner profile details including name, age, school, grade, favourite subject, avatar, and theme
- Profile editing from Settings
- Grade-focused home experience with optional access to other grades
- Mathematics and English lessons for Grades 1-3
- Clickable curriculum strands that open related lessons
- Separate Mathematics and English assessments
- Revision activities by grade and subject
- Learner-scoped progress tracking
- Points for completed lessons, assessments, and revision activities
- Daily activity tracking with selectable growth projects:
  - Grow a tree
  - Build a house
  - Paint a picture
- Learner leaderboard based on activity and points
- Five visual themes
- Collapsible desktop sidebar with Home, Revision, Assessments, and Settings
- Responsive mobile navigation
- Adult View with selectable learner profiles and grade-specific progress

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

### Create a production build

```bash
npm run build
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
│   ├── App.tsx        # Main application, curriculum, routes, and learner state
│   ├── index.css      # Application styling and responsive layout
│   ├── main.tsx       # React entry point
│   └── lib/
│       └── api.ts     # Small fetch wrapper for API calls
├── tests/
│   └── tests.json
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Data and Persistence

Learner profiles, profile settings, points, activity dates, completed tasks, and learner progress are stored in browser `localStorage` so each learner can use the app independently on the same device.

The backend exposes:

- `GET /api/_healthcheck`
- `GET /api/progress`
- `POST /api/progress`

The current backend progress record is a simple shared progress object. The browser profile state is the primary source for learner-specific progress and gamification data.

## Navigation

- **Home:** Continue learning, choose the primary grade, select a subject, or explore another grade.
- **Revision:** Practise lessons by grade and subject.
- **Assessments:** Take focused Mathematics or English assessments for the learner's grade.
- **Settings:** Edit learner profiles, change themes, open Progress, and open Adult View.
- **Adult View:** Select a learner profile and inspect grade-specific subject progress.

## License

This project does not currently define a license.
