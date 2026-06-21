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
      <div class="list-group-header" @click="toggleGroup(group.status)">
        <span
          class="list-group-dot"
          :style="{ background: group.color }"
        ></span>
        <span class="list-group-label">{{ group.label }}</span>
        <span class="list-group-count">{{ group.tasks.length }}</span>
        <span
          class="list-group-chevron"
          :class="{ 'list-group-chevron--open': openGroups.has(group.status) }"
          >›</span
        >
      </div>

      <Transition name="group-expand">
        <div v-if="openGroups.has(group.status)" class="list-group-body">
          <!-- Table header -->
          <div class="list-row list-row--header">
            <div class="list-col list-col--title">Task</div>
            <div class="list-col list-col--assignee">Assignee</div>
            <div class="list-col list-col--priority">Priority</div>
            <div class="list-col list-col--due">Due Date</div>
            <div class="list-col list-col--tags">Tags</div>
            <div class="list-col list-col--actions"></div>
          </div>

          <!-- Empty state -->
          <div v-if="group.tasks.length === 0" class="list-empty">
            <span>{{ group.emptyIcon }} {{ group.emptyMessage }}</span>
          </div>

          <!-- Rows -->
          <TransitionGroup name="card-list" tag="div">
            <div
              v-for="task in group.tasks"
              :key="task.id"
              class="list-row list-row--task"
              :class="{ 'list-row--overdue': manager.isOverdue(task) }"
            >
              <div class="list-col list-col--title">
                <span class="list-task-title">{{ task.title }}</span>
              </div>
              <div class="list-col list-col--assignee">
                <div
                  class="assignee-avatar assignee-avatar--sm"
                  :style="{ background: getAvatarColor(task.assignee) }"
                  :title="task.assignee"
                >
                  {{ getInitials(task.assignee) }}
                </div>
                <span class="list-assignee-name">{{ task.assignee }}</span>
              </div>
              <div class="list-col list-col--priority">
                <span
                  class="priority-badge"
                  :class="`priority-badge--${task.priority}`"
                >
                  {{ capitalize(task.priority) }}
                </span>
              </div>
              <div class="list-col list-col--due">
                <span
                  class="card-due"
                  :class="{ 'card-due--overdue': manager.isOverdue(task) }"
                >
                  {{ formatDate(task.dueDate) }}
                  <span v-if="manager.isOverdue(task)" class="overdue-label"
                    >Overdue</span
                  >
                </span>
              </div>
              <div class="list-col list-col--tags">
                <span
                  v-for="tag in task.tags.slice(0, 2)"
                  :key="tag"
                  class="tag-chip"
                  >{{ tag }}</span
                >
                <span
                  v-if="task.tags.length > 2"
                  class="tag-chip tag-chip--more"
                  >+{{ task.tags.length - 2 }}</span
                >
              </div>
              <div class="list-col list-col--actions">
                <button
                  class="card-action-btn"
                  :id="`list-edit-${task.id}`"
                  @click="$emit('edit-task', task)"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  class="card-action-btn card-action-btn--danger"
                  :id="`list-delete-${task.id}`"
                  @click="$emit('delete-task', task)"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import type { Task, TaskStatus, SortField, ListViewProps, GroupedColumn } from "../../BLL/taskManager/types";

// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<ListViewProps>();

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: "edit-task", task: Task): void;
  (e: "delete-task", task: Task): void;
}>();

// ── Collapsible groups ─────────────────────────────────────────────
const openGroups = reactive<Set<TaskStatus>>(
  new Set(["todo", "in-progress", "done"]),
);

function toggleGroup(status: TaskStatus): void {
  if (openGroups.has(status)) {
    openGroups.delete(status);
  } else {
    openGroups.add(status);
  }
}

// ── Grouped data ────────────────────────────────────────────────────
const groupedTasks = computed<GroupedColumn[]>(() => [
  {
    status: "todo",
    label: "To Do",
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

// ── Sort ────────────────────────────────────────────────────────────
function toggleSort(field: SortField): void {
  const { sort } = props.manager.viewState;
  const newDir =
    sort.field === field && sort.direction === "asc" ? "desc" : "asc";
  props.manager.setSort(field, newDir);
}

function sortArrow(field: SortField): string {
  const { sort } = props.manager.viewState;
  if (sort.field !== field) return "↕";
  return sort.direction === "asc" ? "↑" : "↓";
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
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>
