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
