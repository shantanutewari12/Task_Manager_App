<template>
  <div class="list-view">
    <!-- Sort bar -->
    <div class="list-sort-bar">
      <span class="sort-label">Sort by:</span>
      <button
        class="sort-btn"
        :class="{
          'sort-btn--active': manager.viewState.sort.field === 'dueDate',
        }"
        id="sort-due-date"
        @click="toggleSort('dueDate')"
      >
        Due Date
        <span class="sort-arrow">{{ sortArrow("dueDate") }}</span>
      </button>
      <button
        class="sort-btn"
        :class="{
          'sort-btn--active': manager.viewState.sort.field === 'priority',
        }"
        id="sort-priority"
        @click="toggleSort('priority')"
      >
        Priority
        <span class="sort-arrow">{{ sortArrow("priority") }}</span>
      </button>
    </div>

    <!-- Grouped list by status -->
    <div v-for="group in groupedTasks" :key="group.status" class="list-group">
      <div
        class="list-group-header"
        :class="{ 'list-group-header--collapsed': !openGroups[group.status] }"
        @click="toggleGroup(group.status)"
      >
        <span
          class="list-group-header-badge"
          :class="`list-group-header-badge--${group.status}`"
        >
          {{ getStatusLabel(group.status) }}
        </span>
        <span class="list-group-count">{{ group.tasks.length }}</span>
        <span
          class="list-group-chevron"
          :class="{ 'list-group-chevron--collapsed': !openGroups[group.status] }"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      <div
        class="list-group-body"
        :class="{ 'list-group-body--expanded': openGroups[group.status] }"
      >
        <div class="list-group-body-inner">
          <!-- Table header -->
          <div class="list-row list-row--header">
            <div class="list-col list-col--title">
              <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              Task Name
            </div>
            <div class="list-col list-col--desc">
              <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              Descriptions
            </div>
            <div class="list-col list-col--people">
              <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              People
            </div>
            <div class="list-col list-col--type">
              <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
              Type
            </div>
            <div class="list-col list-col--timeline">
              <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Timeline Date
            </div>
            <div class="list-col list-col--priority">
              <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" /></svg>
              Priority
            </div>
            <div class="list-col list-col--actions"></div>
          </div>

          <!-- Empty state -->
          <div v-if="group.tasks.length === 0" class="list-empty">
            <span>{{ group.emptyIcon }} {{ group.emptyMessage }}</span>
          </div>

          <!-- Rows -->
          <div class="list-rows-container">
            <div
              v-for="task in group.tasks"
              :key="task.id"
              class="list-row list-row--task"
              :class="{ 'list-row--overdue': manager.isOverdue(task) }"
            >
              <div class="list-col list-col--title">
                <div class="task-title-cell">
                  <span class="drag-handle-grip" title="Drag handle">⠿</span>
                  <input
                    type="checkbox"
                    class="task-row-checkbox"
                    :checked="task.status === 'done'"
                    @change="onToggleComplete(task)"
                  />
                  <span
                    class="list-task-title"
                    :class="{ 'list-task-title--completed': task.status === 'done' }"
                  >
                    {{ task.title }}
                  </span>
                </div>
              </div>
              <div class="list-col list-col--desc">
                <span class="list-task-desc" :title="task.description || '-'">
                  {{ task.description || '-' }}
                </span>
              </div>
              <div class="list-col list-col--people">
                <div class="table-people-cell">
                  <div class="header-avatar-group">
                    <div
                      class="header-avatar assignee-avatar--sm"
                      :style="{ background: getAvatarColor(task.assignee) }"
                      :title="task.assignee"
                    >
                      {{ getInitials(task.assignee) }}
                    </div>
                    <div class="header-avatar assignee-avatar--sm" style="background: #10b981" title="Mock Team Member">MR</div>
                    <div class="header-avatar assignee-avatar--sm" style="background: #ec4899" title="Mock Team Member">PN</div>
                  </div>
                </div>
              </div>
              <div class="list-col list-col--type">
                <span
                  class="type-pill-tag"
                  :style="{ color: getTaskType(task).color, background: getTaskType(task).bg, borderColor: getTaskType(task).color }"
                >
                  <span class="type-pill-icon">{{ getTaskType(task).icon }}</span>
                  {{ getTaskType(task).label }}
                </span>
              </div>
              <div class="list-col list-col--timeline">
                <span class="timeline-range-text">
                  {{ getTimelineRange(task) }}
                </span>
              </div>
              <div class="list-col list-col--priority">
                <span
                  class="priority-flag-tag"
                  :class="`priority-flag-tag--${task.priority}`"
                >
                  <span class="priority-flag-icon">⚑</span>
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>
              <div class="list-col list-col--actions">
                <div class="card-menu">
                  <button class="card-menu-trigger" aria-label="Task options">···</button>
                  <div class="card-menu-dropdown">
                    <button class="card-menu-item" :id="`list-edit-${task.id}`" @click.stop="$emit('edit-task', task)">✎ Edit</button>
                    <button class="card-menu-item card-menu-item--danger" :id="`list-delete-${task.id}`" @click.stop="$emit('delete-task', task)">✕ Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import type { Task, TaskStatus, SortField, ListViewProps, GroupedColumn, TaskPriority, TaskTypeInfo } from "../../BLL/taskManager/types";


// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<ListViewProps>();

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: "edit-task", task: Task): void;
  (e: "delete-task", task: Task): void;
}>();

// ── Collapsible groups ─────────────────────────────────────────────
const openGroups = reactive<Record<TaskStatus, boolean>>({
  todo: true,
  "in-progress": true,
  done: true,
});

function toggleGroup(status: TaskStatus): void {
  openGroups[status] = !openGroups[status];
}

// ── Grouped data ────────────────────────────────────────────────────
const groupedTasks = computed<GroupedColumn[]>(() => [
  {
    status: "todo",
    label: "To do",
    color: "#f59e0b",
    emptyMessage: "No tasks",
    emptyIcon: "📋",
    tasks: props.manager.getFilteredByStatus("todo"),
  },
  {
    status: "in-progress",
    label: "In Progress",
    color: "#6366f1",
    emptyMessage: "Nothing in progress",
    emptyIcon: "🚀",
    tasks: props.manager.getFilteredByStatus("in-progress"),
  },
  {
    status: "done",
    label: "Done",
    color: "#10b981",
    emptyMessage: "No completed tasks",
    emptyIcon: "✅",
    tasks: props.manager.getFilteredByStatus("done"),
  },
]);

// ── Completion toggle (delegates to BLL) ─────────────────────
function onToggleComplete(task: Task): void {
  props.manager.toggleComplete(task.id);
}

// ── Status labels ───────────────────────────────────────────────────
function getStatusLabel(status: TaskStatus): string {
  if (status === "todo") return "Not Started";
  if (status === "in-progress") return "In Progress";
  return "Done";
}

// ── Sort ────────────────────────────────────────────────────────────
function toggleSort(field: SortField): void {
  props.manager.toggleSort(field);
}

// ── Priority labels ──────────────────────────────────────────────────
function getPriorityLabel(priority: TaskPriority): string {
  if (priority === "high") return "Urgent";
  if (priority === "medium") return "Normal";
  return "Lowest";
}

function sortArrow(field: SortField): string {
  const { sort } = props.manager.viewState;
  if (sort.field !== field) return "↕";
  return sort.direction === "asc" ? "↑" : "↓";
}

// ── Dynamic task types ────────────────────────────────────
function getTaskType(task: Task): TaskTypeInfo {
  const firstTag = task.tags[0]?.toLowerCase() ?? "";
  if (firstTag.includes("auth") || firstTag.includes("feature") || firstTag.includes("backend")) {
    return { label: "Feature", color: "#3b82f6", bg: "#eff6ff", icon: "⚡" };
  }
  if (firstTag.includes("bug") || firstTag.includes("security")) {
    return { label: "Bug", color: "#ef4444", bg: "#fee2e2", icon: "🪲" };
  }
  if (firstTag.includes("review") || firstTag.includes("performance")) {
    return { label: "Review", color: "#f59e0b", bg: "#fef3c7", icon: "📝" };
  }
  return { label: "Testing", color: "#10b981", bg: "#d1fae5", icon: "🧪" };
}

// ── Date timeline mock range ────────────────────────────────────────
function getTimelineRange(task: Task): string {
  const due = new Date(task.dueDate);
  // Start date 14 days before due date
  const start = new Date(due.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const fmt = (d: Date): string =>
    d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} - ${fmt(due)}`;
}

// ── Formatting helpers (presentation only) ──────────────────────────
const AVATAR_PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? "#6366f1";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
</script>
