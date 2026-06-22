# TaskFlow — Modern Task Management Application

A highly responsive, premium task management application built with Vue 3, TypeScript, and Vanilla CSS. The app features 5 interactive views for tracking projects, workloads, and schedules, designed with modern aesthetics (glassmorphism, vibrant tailored color palettes, smooth micro-animations, and full responsive layout).

**Live Demo**: [https://taskmanager-task-flow.vercel.app/](https://taskmanager-task-flow.vercel.app/)

---

## 🌟 Key Features

1. **Dashboard Overview**: Rich analytics overview showing key metrics (total tasks, completed, in-progress, pending) along with progress gauges and team workload distribution charts.
2. **Kanban Board**: Drag-and-drop-style status boards for managing workflows. Move tasks between columns (Not Started, In Progress, Completed) with visual indicators.
3. **Interactive List View**: Grouped task lists by status with smooth, collapsible accordions. Fully responsive and aligns beautifully when expanded or collapsed.
4. **Data Table**: High-density grid with sortable columns (Due Date, Priority) and status-colored tags.
5. **Timeline (Gantt-style)**: Horizontal roadmap visualization displaying task durations, start/end dates, and task progressions mapped to a timeline grid.
6. **Task Actions (CRUD)**: Create, edit, and delete tasks dynamically via an advanced modal interface with fields for priority, category, assignees, dates, and descriptions.
7. **Filters & Sorting**: Global filtering by priority and assignee, and sorting by due date or priority.

---

## 🏗️ Architecture & Design Philosophy

The application strictly follows a **clean separation of concerns** by isolating the Presentation Layer (Vue Components) from the Business Logic Layer (BLL). State management is kept local and predictable through clear data flows, strictly avoiding complex third-party state managers like Pinia or Vuex.

### 1. Presentation Layer vs. Business Logic Layer (BLL)
* **Single Source of Truth**: All CRUD, filtering, sorting, and state mutation logic resides solely in [TaskManager.ts](file:///c:/Users/lko42/OneDrive/Desktop/task_manager/src/BLL/taskManager/TaskManager.ts).
* **Zero Business Logic in Views**: Vue components act as purely presentational templates. They read from properties exposed by the `TaskManager` class and delegate user actions back to `TaskManager` methods (e.g. `taskManager.addTask(...)`, `taskManager.toggleComplete(...)`).

### 2. Dependency Injection & Instantiation
* **Strict Parent-Child Props**: The `TaskManager` class is instantiated **exactly once** in the root page component: [index.vue](file:///c:/Users/lko42/OneDrive/Desktop/task_manager/src/pages/taskManager/index.vue).
* **No `provide`/`inject`**: To ensure maximum type safety and trace-ability, the instance is passed explicitly down the component tree using TypeScript-typed props.

### 3. Strict Type Safety
* **Zero `any` Types**: The codebase operates under strict TypeScript rules.
* **Unified Domain Models**: All shared interfaces, types, and enums live in a single, dedicated type file: [types.ts](file:///c:/Users/lko42/OneDrive/Desktop/task_manager/src/BLL/taskManager/types.ts). No inline interfaces or type declarations are scattered across views.

---

## 📂 Project Structure

```
task_manager/
├── src/
│   ├── BLL/                     # Business Logic Layer (Framework Agnostic)
│   │   └── taskManager/
│   │       ├── TaskManager.ts   # Core business logic, filters, sorting, and state mutations
│   │       ├── mockData.ts      # Initial seed dataset
│   │       └── types.ts         # Central types, interfaces, and enums (Single source of truth)
│   │
│   ├── components/              # Vue Components (Presentation Layer)
│   │   └── taskManager/
│   │       ├── KanbanBoard.vue  # Board view component
│   │       ├── KanbanColumn.vue # Kanban column renderer
│   │       ├── ListView.vue     # Collapsible Accordion List view
│   │       ├── TableView.vue    # Data grid view
│   │       ├── TimelineView.vue # Timeline / Gantt view
│   │       ├── Overview.vue     # Analytics Dashboard
│   │       ├── TaskCard.vue     # Individual task card
│   │       ├── TaskModal.vue    # Create / Edit task form modal
│   │       └── ViewToggle.vue   # Tab selector bar
│   │
│   ├── pages/
│   │   └── taskManager/
│   │       └── index.vue        # Main Entry Point (Instantiates BLL, layout shell)
│   │
│   ├── style.css                # Global Design Tokens & Typography
│   ├── main.ts                  # App initialization
│   └── App.vue                  # Root component wrapper
│
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # Strict TypeScript configuration
└── package.json                 # Project dependencies & scripts
```

---

## 🎨 Design Tokens & UI Specs

* **Typography**: Outfit / Inter Google Fonts for high legibility and premium editorial feel.
* **Color System**: Modern HSL-based dark mode theme with primary gradients, glowing active states, and custom status indicator pill designs.
* **Micro-Animations**:
  * Hover transitions for cards (`transform: translateY(-2px)`).
  * Smooth height transitions for collapsibles (`max-height` transitions).
  * Tab transitions and indicator sliders.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed.

### Installation
1. Clone or download the repository.
2. Navigate to the project root and install the dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
To build the application for deployment:
```bash
npm run build
```
The output files will be generated in the `dist/` folder, ready for hosting.

---

## 🧠 Architecture Decisions & Trade-offs

### Decision 1 — BLL Class over Pinia/Vuex
**Choice**: All business logic is in a single `TaskManager` class, instantiated once in `index.vue` and passed down via typed props.

**Reasoning**: Pinia/Vuex add an external dependency and scatter logic across stores, actions, getters. A plain TypeScript class is framework-agnostic, fully testable in isolation, and keeps all logic in one auditable file.

**Trade-off**: The class instance must be manually threaded through the component tree via props. This becomes verbose in deeply nested trees. For a larger app, this approach would need re-evaluation (e.g., a service layer or DI container).

---

### Decision 2 — Vanilla CSS over a Component Library (e.g., PrimeVue, Vuetify)
**Choice**: The entire UI is built with hand-crafted Vanilla CSS using design tokens defined in `:root`.

**Reasoning**: Component libraries impose their own design language, often requiring overrides that bloat the bundle and make consistency harder. Vanilla CSS gives full control over every pixel and results in a leaner build.

**Trade-off**: Significantly more time is spent on layout and component polish compared to using a pre-built library. Accessibility features (ARIA patterns, keyboard traps in modals) must be handled manually instead of inheriting them from a well-tested UI library.

---

### Decision 3 — localStorage for View Persistence (no backend)
**Choice**: The selected view, active filters, and sort state are persisted to `localStorage` by the `TaskManager` class on every mutation.

**Reasoning**: Keeps the app self-contained and offline-capable. No network roundtrip required to restore user preferences. Provides a native "session continuity" feel without any server dependency.

**Trade-off**: `localStorage` is synchronous and has a 5MB limit. If view state grew large (e.g., storing full task lists), this would become a bottleneck. Additionally, state is tied to a single browser/device — preferences are not portable across sessions or users.

---

## ⚠️ Known Limitations & Assumptions

1. **No real backend**: All data is held in memory (seeded from `mockData.ts`). Refreshing the page resets all tasks to the mock dataset — only the _view state_ (selected tab, filters, sort) is persisted.

2. **Single user**: The app assumes a single logged-in user ("Test User"). There is no authentication, multi-tenancy, or role-based access control.

3. **Mock assignees in table/timeline**: The Table and Timeline views render two additional "mock team members" (MR, PN) as decorative avatars per row — these are not derived from real task data and are purely presentational.

4. **Timeline is visual-only**: The Timeline (Gantt) view computes a "start date" as 14 days before the due date. It is not driven by a real `startDate` field on the task model — this is a UI approximation.

5. **No pagination**: The List and Table views render all tasks without pagination or virtual scrolling. Performance may degrade with hundreds of tasks.

6. **Tag management**: Tags are stored as plain strings and have no taxonomy or auto-complete validation beyond the existing task list — duplicate tags across tasks are not de-duplicated globally.

---

## ⏱ Time Log

| Phase | Task | Estimated Hours |
|-------|------|----------------|
| Planning | Requirements review, architecture design, component tree mapping | 1.0 h |
| Foundation | Project scaffold (Vite + Vue 3 + TypeScript), ESLint, Husky | 0.5 h |
| BLL | `TaskManager.ts`, `types.ts`, `mockData.ts` | 1.5 h |
| UI — Layout | Sidebar, page header, tabs bar, global CSS design system | 2.0 h |
| UI — Kanban | `KanbanBoard.vue`, `KanbanColumn.vue`, `TaskCard.vue`, native DnD | 2.0 h |
| UI — List | `ListView.vue` — collapsible accordions, sort bar | 1.5 h |
| UI — Table | `TableView.vue` — data grid with sort, status badges | 1.0 h |
| UI — Timeline | `TimelineView.vue` — Gantt visualization | 1.5 h |
| UI — Overview | `Overview.vue` — metrics, urgent list, workload chart | 1.5 h |
| UI — Modal | `TaskModal.vue` — form validation, create/edit flow | 2.0 h |
| Fixes & Polish | Accordion bugs, Add Task visibility, sidebar collapse toggle | 1.5 h |
| Compliance | Audit fixes (types.ts consolidation, BLL delegation, scroll fix) | 1.0 h |
| Deployment | Vercel setup, README | 0.5 h |
| **Total** | | **~17.5 h** |

