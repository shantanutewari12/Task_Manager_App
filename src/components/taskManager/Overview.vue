<template>
  <div class="overview-view">
    <!-- Stats Row -->
    <div class="overview-stats-grid">
      <div class="overview-card stat-card stat-card--total">
        <div class="stat-card-header">
          <span class="stat-card-title">Total Tasks</span>
          <span class="stat-card-icon">📋</span>
        </div>
        <div class="stat-card-value">{{ totalTasks }}</div>
        <div class="stat-card-desc">All tasks in workspace</div>
      </div>

      <div class="overview-card stat-card stat-card--todo">
        <div class="stat-card-header">
          <span class="stat-card-title">Not Started</span>
          <span class="stat-card-icon">⏳</span>
        </div>
        <div class="stat-card-value">{{ todoTasks }}</div>
        <div class="stat-card-desc">Tasks waiting to start</div>
      </div>

      <div class="overview-card stat-card stat-card--progress">
        <div class="stat-card-header">
          <span class="stat-card-title">In Progress</span>
          <span class="stat-card-icon">⚙️</span>
        </div>
        <div class="stat-card-value">{{ inProgressTasks }}</div>
        <div class="stat-card-desc">Active work items</div>
      </div>

      <div class="overview-card stat-card stat-card--done">
        <div class="stat-card-header">
          <span class="stat-card-title">Completed</span>
          <span class="stat-card-icon">✅</span>
        </div>
        <div class="stat-card-value">{{ doneTasks }}</div>
        <div class="stat-card-desc">Finished tasks</div>
      </div>

      <div class="overview-card stat-card stat-card--overdue">
        <div class="stat-card-header">
          <span class="stat-card-title">Overdue</span>
          <span class="stat-card-icon">🚨</span>
        </div>
        <div class="stat-card-value">{{ overdueTasks }}</div>
        <div class="stat-card-desc" :class="{ 'text-danger': overdueTasks > 0 }">
          {{ overdueTasks > 0 ? 'Action required immediately' : 'No overdue items' }}
        </div>
      </div>
    </div>

    <!-- Secondary Grid -->
    <div class="overview-content-grid">
      <!-- Left side: Urgent / Upcoming Tasks -->
      <div class="overview-card content-card">
        <h2 class="content-card-title">
          <svg class="content-card-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 22 22 22" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Urgent Tasks
        </h2>
        <div v-if="urgentList.length === 0" class="empty-list-message">
          No urgent tasks at the moment. Good job!
        </div>
        <div v-else class="urgent-list">
          <div
            v-for="task in urgentList"
            :key="task.id"
            class="urgent-task-item"
            @click="$emit('edit-task', task)"
          >
            <div class="urgent-task-left">
              <span class="urgent-task-priority-dot"></span>
              <span class="urgent-task-title">{{ task.title }}</span>
            </div>
            <div class="urgent-task-right">
              <span class="urgent-task-status-tag" :class="`status-tag--${task.status}`">
                {{ getStatusLabel(task.status) }}
              </span>
              <span class="urgent-task-date" :class="{ 'date-overdue': isOverdue(task) }">
                {{ formatDueDate(task.dueDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Workload Breakdown -->
      <div class="overview-card content-card">
        <h2 class="content-card-title">
          <svg class="content-card-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Team Workload
        </h2>
        <div v-if="workloadList.length === 0" class="empty-list-message">
          No active tasks assigned to anyone.
        </div>
        <div v-else class="workload-list">
          <div v-for="item in workloadList" :key="item.name" class="workload-item">
            <div class="workload-item-header">
              <div class="workload-item-user">
                <div class="header-avatar workload-avatar" :style="{ background: getAvatarColor(item.name) }">
                  {{ getInitials(item.name) }}
                </div>
                <span class="workload-user-name">{{ item.name }}</span>
              </div>
              <span class="workload-count">{{ item.count }} {{ item.count === 1 ? 'task' : 'tasks' }}</span>
            </div>
            <div class="workload-bar-wrapper">
              <div class="workload-bar-fill" :style="{ width: `${item.percentage}%`, background: getAvatarColor(item.name) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OverviewProps, Task, TaskStatus, WorkloadItem } from '../../BLL/taskManager/types'


// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<OverviewProps>()

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
}>()

// ── Computed stats ─────────────────────────────────────────────────
const allTasks = computed<Task[]>(() => props.manager.getAllTasks())

const totalTasks = computed<number>(() => allTasks.value.length)

const todoTasks = computed<number>(() => props.manager.getTaskCount('todo'))

const inProgressTasks = computed<number>(() => props.manager.getTaskCount('in-progress'))

const doneTasks = computed<number>(() => props.manager.getTaskCount('done'))

const overdueTasks = computed<number>(() =>
  allTasks.value.filter((t) => props.manager.isOverdue(t)).length
)

// ── Urgent / Upcoming list ─────────────────────────────────────────
const urgentList = computed<Task[]>(() => {
  return allTasks.value
    .filter((t) => t.status !== 'done' && (t.priority === 'high' || props.manager.isOverdue(t)))
    .slice(0, 5)
})

// ── Workload stats ─────────────────────────────────────────────────
const workloadList = computed<WorkloadItem[]>(() => {
  const map: Record<string, number> = {}
  let maxCount = 0

  allTasks.value.forEach((t) => {
    if (t.status !== 'done') {
      const current = (map[t.assignee] ?? 0) + 1
      map[t.assignee] = current
      if (current > maxCount) {
        maxCount = current
      }
    }
  })

  return Object.entries(map)
    .map(([name, count]) => ({
      name,
      count,
      percentage: maxCount > 0 ? (count / maxCount) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
})

// ── Helpers ────────────────────────────────────────────────────────
function getStatusLabel(status: TaskStatus): string {
  if (status === 'todo') return 'Not Started'
  if (status === 'in-progress') return 'In Progress'
  return 'Done'
}

function isOverdue(task: Task): boolean {
  return props.manager.isOverdue(task)
}

function formatDueDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })
}

// ── Avatar styles ──────────────────────────────────────────────────
const AVATAR_PALETTE = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? '#6366f1'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
