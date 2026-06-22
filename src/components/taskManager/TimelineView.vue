<template>
  <div class="timeline-view">
    <!-- Sort bar (reused from List/Table views) -->
    <div class="list-sort-bar">
      <span class="sort-label">Sort by:</span>
      <button
        class="sort-btn"
        :class="{
          'sort-btn--active': manager.viewState.sort.field === 'dueDate',
        }"
        id="timeline-sort-due-date"
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
        id="timeline-sort-priority"
        @click="toggleSort('priority')"
      >
        Priority
        <span class="sort-arrow">{{ sortArrow("priority") }}</span>
      </button>
    </div>

    <!-- Timeline chart structure -->
    <div class="list-group timeline-container-card">
      <!-- Timeline Header: Grid Labels -->
      <div class="timeline-header-row">
        <div class="timeline-task-info-header">
          <svg class="table-header-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          Task Name & Details
        </div>
        <div class="timeline-track-header">
          <div
            v-for="line in gridLines"
            :key="line.left"
            class="timeline-grid-label"
            :style="{ left: line.left }"
          >
            {{ line.label }}
          </div>
        </div>
      </div>

      <div class="list-group-body list-group-body--expanded">
        <!-- Empty state -->
        <div v-if="filteredTasks.length === 0" class="list-empty">
          <span>📋 No tasks found matching current filters.</span>
        </div>

        <!-- Task Rows -->
        <div v-else class="timeline-rows-container">
          <!-- Background Grid Lines -->
          <div class="timeline-grid-lines">
            <div
              v-for="line in gridLines"
              :key="line.left"
              class="timeline-grid-line"
              :style="{ left: line.left }"
            ></div>
          </div>

          <!-- Rows list -->
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="timeline-row"
            :class="{ 'timeline-row--overdue': manager.isOverdue(task) }"
            @click="$emit('edit-task', task)"
          >
            <!-- Left Info Panel -->
            <div class="timeline-row-info">
              <div class="timeline-row-title-line">
                <span
                  class="list-task-title"
                  :class="{ 'list-task-title--completed': task.status === 'done' }"
                >
                  {{ task.title }}
                </span>
              </div>
              <div class="timeline-row-meta">
                <span
                  class="status-badge-card"
                  :style="{ color: getStatusStyle(task.status).color, background: getStatusStyle(task.status).bg }"
                >
                  {{ getStatusLabel(task.status) }}
                </span>
                <span
                  class="priority-flag-tag"
                  :class="`priority-flag-tag--${task.priority}`"
                >
                  ⚑ {{ getPriorityLabel(task.priority) }}
                </span>
                <div
                  class="header-avatar assignee-avatar--sm"
                  :style="{ background: getAvatarColor(task.assignee) }"
                  :title="task.assignee"
                >
                  {{ getInitials(task.assignee) }}
                </div>
              </div>
            </div>

            <!-- Right Visual Track -->
            <div class="timeline-row-track">
              <div
                class="timeline-bar"
                :class="`timeline-bar--${task.status}`"
                :style="getTaskBarStyle(task)"
              >
                <span class="timeline-bar-text">
                  {{ getTimelineRangeShort(task) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { Task, TaskStatus, SortField, TaskPriority, StatusStyle } from "../../BLL/taskManager/types";


// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<{
  manager: TaskManager;
}>();

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: "edit-task", task: Task): void;
  (e: "delete-task", task: Task): void;
}>();

// ── Computed data ──────────────────────────────────────────────────
const filteredTasks = computed<Task[]>(() => props.manager.getFilteredList());

// ── Calculate overall range for timeline ───────────────────────────
const timelineRange = computed(() => {
  const tasks = filteredTasks.value;
  if (tasks.length === 0) {
    const now = Date.now();
    return { min: now, max: now + 14 * 24 * 60 * 60 * 1000 };
  }

  let min = Infinity;
  let max = -Infinity;

  tasks.forEach((task) => {
    const due = new Date(task.dueDate).getTime();
    const start = due - 14 * 24 * 60 * 60 * 1000;
    if (start < min) min = start;
    if (due > max) max = due;
  });

  // Add 3 days padding on both ends
  min -= 3 * 24 * 60 * 60 * 1000;
  max += 3 * 24 * 60 * 60 * 1000;

  return { min, max };
});

// ── Background grid lines and labels ───────────────────────────────
const gridLines = computed(() => {
  const { min, max } = timelineRange.value;
  const totalSpan = max - min;
  const intervals = 5;
  const lines = [];

  for (let i = 0; i <= intervals; i++) {
    const time = min + (totalSpan / intervals) * i;
    const date = new Date(time);
    lines.push({
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      left: `${(i / intervals) * 100}%`,
    });
  }
  return lines;
});

// ── Style for task duration bar ────────────────────────────────────
function getTaskBarStyle(task: Task): { left: string; width: string } {
  const { min, max } = timelineRange.value;
  const totalSpan = max - min;
  if (totalSpan <= 0) return { left: "0%", width: "100%" };

  const due = new Date(task.dueDate).getTime();
  const start = due - 14 * 24 * 60 * 60 * 1000;

  const left = ((start - min) / totalSpan) * 100;
  const width = ((due - start) / totalSpan) * 100;

  return {
    left: `${left}%`,
    width: `${width}%`,
  };
}

// ── Status styling ────────────────────────────────────
function getStatusStyle(status: TaskStatus): StatusStyle {
  if (status === "todo") {
    return { color: "#ef4444", bg: "#fef2f2" };
  }
  if (status === "in-progress") {
    return { color: "#d97706", bg: "#fef3c7" };
  }
  return { color: "#10b981", bg: "#d1fae5" };
}

function getStatusLabel(status: TaskStatus): string {
  if (status === "todo") return "Not Started";
  if (status === "in-progress") return "In Progress";
  return "Done";
}

// ── Sorting ──────────────────────────────────────────────
function toggleSort(field: SortField): void {
  props.manager.toggleSort(field);
}

function sortArrow(field: SortField): string {
  const { sort } = props.manager.viewState;
  if (sort.field !== field) return "↕";
  return sort.direction === "asc" ? "↑" : "↓";
}

// ── Priority labels ─────────────────────────────────────────────────
function getPriorityLabel(priority: TaskPriority): string {
  if (priority === "high") return "Urgent";
  if (priority === "medium") return "Normal";
  return "Lowest";
}

// ── Date range short format ─────────────────────────────────────────
function getTimelineRangeShort(task: Task): string {
  const due = new Date(task.dueDate);
  const start = new Date(due.getTime() - 14 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date): string =>
    d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  return `${fmt(start)} - ${fmt(due)}`;
}

// ── Avatar coloring helpers ──────────────────────────────────────────
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

<style scoped>
.timeline-view {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-8);
  background: var(--color-bg-main);
  overflow-y: auto;
}

.timeline-container-card {
  display: flex;
  flex-direction: column;
}

.timeline-header-row {
  display: flex;
  background: #fafafb;
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-5);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.timeline-task-info-header {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.timeline-track-header {
  flex: 1;
  position: relative;
  height: 20px;
}

.timeline-grid-label {
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 10px;
  color: var(--color-text-muted);
}

.timeline-rows-container {
  position: relative;
  min-height: 200px;
}

.timeline-grid-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.timeline-grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed var(--color-border);
  opacity: 0.6;
}

.timeline-row {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-card);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.timeline-row:hover {
  background: #fafafb;
}

.timeline-row--overdue {
  border-left: 3px solid var(--color-danger);
}

.timeline-row-info {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-right: var(--space-4);
}

.timeline-row-title-line {
  display: flex;
  align-items: center;
}

.timeline-row-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.timeline-row-track {
  flex: 1;
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
}

.timeline-bar {
  position: absolute;
  height: 24px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  padding: 0 var(--space-2);
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-bar--todo {
  background: #f59e0b;
}

.timeline-bar--in-progress {
  background: #6366f1;
}

.timeline-bar--done {
  background: #10b981;
}

.timeline-bar-text {
  opacity: 0.95;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.status-badge-card {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.table-header-svg {
  color: var(--color-text-muted);
  opacity: 0.8;
}
</style>
