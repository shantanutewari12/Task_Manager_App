# TaskFlow — Production-Quality Task Manager

A feature-rich task management application built with **Vue 3 (Composition API) + TypeScript**, following strict architectural constraints and production-quality design standards.

![TaskFlow Kanban Board](./docs/screenshot-kanban.png)

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — mock data is pre-loaded, no configuration required.

---

## Architecture Overview

### Why `TaskManager` as a Class?

All business logic lives in a single class: [`src/BLL/taskManager/TaskManager.ts`](./src/BLL/taskManager/TaskManager.ts).

This is a deliberate architectural choice:

1. **Testability in isolation.** A class with typed method signatures can be unit-tested without mounting any Vue component. You instantiate `new TaskManager()`, call methods, and assert on return values — no DOM, no reactivity system required.

2. **Explicit data flow.** The class is instantiated exactly once in `pages/taskManager/index.vue` and passed as a typed prop to every child component. This makes the data flow visible and traceable — you can grep for `manager.` and immediately see every call site. There is no hidden global store or injection magic.

3. **Separation of concerns.** Components are responsible for *rendering* and *user events only*. They call `manager.moveTo()`, `manager.createTask()`, `manager.setSort()`, etc. — they never implement filtering, sorting, or validation logic themselves. This means the entire business behaviour of the app can be understood by reading one file.

4. **Vue reactivity without Pinia/Vuex.** The class uses `reactive()` internally on its `_tasks` array and `viewState` object. Because Vue's reactivity is *object-level*, components that receive the `manager` prop observe mutations automatically — no store subscription, no `provide/inject` ceremony.

### File Structure

```
src/
├── BLL/taskManager/
│   ├── types.ts          # ALL interfaces/types/enums — single source of truth
│   ├── mockData.ts       # Typed const mockTasks: Task[]
│   └── TaskManager.ts    # All business logic (CRUD, filter, sort, moveTo)
├── components/taskManager/
│   ├── KanbanBoard.vue   # Layout: renders 3 KanbanColumns
│   ├── KanbanColumn.vue  # Drop zone + TransitionGroup animation
│   ├── TaskCard.vue      # Card rendering + drag initiation
│   ├── ListView.vue      # Table layout, collapsible groups, sort bar
│   ├── TaskModal.vue     # Create/edit form with inline validation
│   └── ViewToggle.vue    # Board ↔ List toggle button group
└── pages/taskManager/
    └── index.vue         # Root: instantiates TaskManager, owns modals
```

---

## Design & UX Decisions

### 1. Deterministic Avatar Colors via Hash

Rather than assigning colours randomly (which would change on re-render) or requiring a stored colour map, assignee avatar backgrounds are computed by hashing the assignee's name string into an index into a curated 7-colour palette. The same name always produces the same colour across all views — Kanban cards, list rows, and the sidebar — with zero state.

```ts
let hash = 0
for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
return PALETTE[Math.abs(hash) % PALETTE.length]
```

### 2. Native HTML5 Drag-and-Drop (No Libraries)

The drag-and-drop implementation uses only the browser's built-in `dragstart` / `dragover` / `dragleave` / `drop` events and `DataTransfer`. This avoids bundling a drag library (saves ~30 KB), keeps the code auditable, and ensures the feature degrades gracefully in any environment that supports the HTML5 D&D API. The task ID is stored in `dataTransfer` as `text/plain`; on `drop`, `manager.moveTo(taskId, newStatus)` is called — a single BLL method that updates the reactive array in place.

### 3. View State Persisted in `localStorage`

The user's chosen view (Kanban/List), sort field, sort direction, and active filters are serialised as JSON into `localStorage` on every mutation via `_persistViewState()`. On the next page load, `_loadViewState()` rehydrates the `ViewState` object before the first render. This means refreshing the browser returns the user to exactly where they left off — a small detail that meaningfully reduces friction in a daily-use tool.

### 4. `TransitionGroup` for Column Animations

Card additions, deletions, and cross-column moves are animated using Vue's `<TransitionGroup name="card-list">` with separate `enter`, `leave`, and `move` CSS transitions. The `move` class uses `transform` + `transition` so Vue FLIP-animates repositioning without any JavaScript measurement. This gives smooth reordering entirely in CSS, performant on the compositor thread.

### 5. Form Validation Strategy

Validation runs field-by-field on `blur` (so errors appear as the user leaves each field, not on first focus) and in full on submit. The "due date cannot be in the past" rule is deliberately skipped for *edit* operations — it would be disruptive to refuse saving an existing task just because its due date has passed. New tasks, however, must have a future due date.

---

## Feature Checklist

| Feature | Status |
|---|---|
| Kanban board (3 columns) | ✅ |
| Native HTML5 drag-and-drop | ✅ |
| List view with sort (dueDate / priority asc/desc) | ✅ |
| View persisted in localStorage | ✅ |
| Priority badge (colour-coded) | ✅ |
| Overdue detection + red highlight | ✅ |
| Assignee initials + deterministic colour | ✅ |
| Tag chips on cards | ✅ |
| Create task modal + validation | ✅ |
| Edit task modal | ✅ |
| Delete with confirmation dialog | ✅ |
| Filter by priority | ✅ |
| Filter by assignee | ✅ |
| Column-change TransitionGroup animation | ✅ |
| Empty state per column | ✅ |
| Zero `any` types | ✅ |
| No Pinia/Vuex/provide-inject | ✅ |

---

## Known Limitations & Assumptions

- **No persistence beyond localStorage.** Task data is in-memory; refreshing the page reloads mock data. Adding a backend/IndexedDB store is the obvious next step.
- **No authentication.** The sidebar user is hardcoded as "Sarah Chen". A real app would read from a session/context.
- **No mobile layout.** The spec states mobile is not required; the layout is optimised for ≥ 1280 px width.
- **Drag-and-drop in automated browsers.** The native HTML5 D&D API requires actual `dragstart`/`drop` events with `DataTransfer`; pointer-event simulation in some headless browsers will not trigger the full lifecycle.
- **Tag comma input edge case.** Tags are added on Enter or comma key. Pasting a comma-separated string will not auto-split — users must add tags individually.
- **Single assignee per task.** The data model stores `assignee: string`. Multi-assignee is a common request but was out of scope per the spec.

---

## Rough 48-Hour Time Log

| Phase | Time | Tasks |
|---|---|---|
| Planning & architecture | 1h | Review spec, design file structure, define type contracts |
| Types + mock data | 0.5h | `types.ts`, 12 mock tasks with all constraints met |
| `TaskManager` BLL | 1.5h | CRUD, filter/sort, moveTo, localStorage persistence, reactive internals |
| Page + toolbar | 1h | `index.vue`, filter selects, modal/delete state, toolbar layout |
| KanbanBoard + KanbanColumn | 1h | Column layout, native D&D drop zone, `TransitionGroup` |
| TaskCard | 1h | All card UI: badge, 2-line clamp, overdue, avatar, tags, D&D initiation |
| ListView | 1.5h | Table grid, collapsible groups, sort bar, list-specific empty states |
| TaskModal | 1.5h | Form fields, tag input, per-field validation, blur/submit timing |
| ViewToggle | 0.25h | Segment control UI |
| CSS design system | 2h | Tokens, typography scale, all component styles, transitions |
| Type-check + bug fixes | 0.5h | `vue-tsc --noEmit`, zero errors |
| README | 0.5h | This document |
| **Total** | **~13h** | (Realistic focused sprint, not calendar time) |
