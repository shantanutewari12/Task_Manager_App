<template>
  <div class="dashboard-view">
    <!-- Welcome Header Card -->
    <div class="dashboard-welcome-banner">
      <div class="banner-content">
        <h2 class="banner-title">Welcome back, Test User!</h2>
        <p class="banner-subtitle">Here is a quick breakdown of your workspace health and progress.</p>
      </div>
      <div class="banner-sparkle">💭</div>
    </div>

    <!-- Metrics Row -->
    <div class="dashboard-stats-grid">
      <div class="dashboard-card metric-card">
        <div class="metric-icon metric-icon--total">
          <svg class="metric-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="13" y2="17" />
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Tasks</span>
          <h3 class="metric-val">{{ totalTasks }}</h3>
        </div>
      </div>

      <div class="dashboard-card metric-card">
        <div class="metric-icon metric-icon--todo">
          <svg class="metric-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Not Started</span>
          <h3 class="metric-val">{{ todoTasks }}</h3>
        </div>
      </div>

      <div class="dashboard-card metric-card">
        <div class="metric-icon metric-icon--progress">
          <svg class="metric-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">In Progress</span>
          <h3 class="metric-val">{{ inProgressTasks }}</h3>
        </div>
      </div>

      <div class="dashboard-card metric-card">
        <div class="metric-icon metric-icon--done">
          <svg class="metric-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Completed</span>
          <h3 class="metric-val">{{ doneTasks }}</h3>
        </div>
      </div>

      <div class="dashboard-card metric-card">
        <div class="metric-icon metric-icon--overdue">
          <svg class="metric-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Overdue</span>
          <h3 class="metric-val">{{ overdueTasks }}</h3>
        </div>
      </div>
    </div>

    <!-- Analytics & Activity Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Visual Analytics -->
      <div class="dashboard-col">
        <!-- Completion Rate Progress Gauge -->
        <div class="dashboard-card chart-card">
          <h4 class="chart-card-title">Completion Rate</h4>
          <div class="gauge-container">
            <div class="gauge-svg-wrapper">
              <svg width="140" height="140" viewBox="0 0 100 100">
                <!-- Background track -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-bg-main)" stroke-width="8" />
                <!-- Foreground filled progress track -->
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#accentGradient)"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="strokeDasharray"
                  :stroke-dashoffset="strokeDashoffset"
                  transform="rotate(-90 50 50)"
                  class="progress-ring-circle"
                />
                <!-- Gradient definitions -->
                <defs>
                  <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="100%" stop-color="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <!-- Inside label -->
              <div class="gauge-center-label">
                <span class="gauge-percent">{{ Math.round(completionPercentage) }}%</span>
                <span class="gauge-sub">Done</span>
              </div>
            </div>
            <div class="gauge-details">
              <p class="gauge-status-text">
                {{ completionStatusMessage }}
              </p>
              <div class="gauge-legend">
                <div class="legend-item"><span class="legend-dot legend-dot--done"></span> Completed ({{ doneTasks }})</div>
                <div class="legend-item"><span class="legend-dot legend-dot--todo"></span> Remaining ({{ remainingTasks }})</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Priority Chart -->
        <div class="dashboard-card chart-card">
          <h4 class="chart-card-title">Tasks by Priority</h4>
          <div class="priority-chart-bars">
            <div class="priority-bar-row">
              <div class="priority-bar-label">
                <span class="priority-dot priority-dot--high"></span>
                <span>High</span>
                <span class="priority-count">{{ highPriorityTasks }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-fill--high" :style="{ width: `${highPriorityPercent}%` }"></div>
              </div>
            </div>

            <div class="priority-bar-row">
              <div class="priority-bar-label">
                <span class="priority-dot priority-dot--medium"></span>
                <span>Medium</span>
                <span class="priority-count">{{ mediumPriorityTasks }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-fill--medium" :style="{ width: `${mediumPriorityPercent}%` }"></div>
              </div>
            </div>

            <div class="priority-bar-row">
              <div class="priority-bar-label">
                <span class="priority-dot priority-dot--low"></span>
                <span>Low</span>
                <span class="priority-count">{{ lowPriorityTasks }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-fill--low" :style="{ width: `${lowPriorityPercent}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Recent Activities & Team workload -->
      <div class="dashboard-col">
        <!-- Recent Tasks Activity list -->
        <div class="dashboard-card content-card">
          <div class="content-card-header">
            <h4 class="chart-card-title">Recent Tasks</h4>
            <span class="header-action-badge">Newest first</span>
          </div>

          <div v-if="recentTasks.length === 0" class="empty-list-message">
            No tasks found. Click "Add Task" to get started!
          </div>
          <div v-else class="recent-tasks-list">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              class="recent-task-row"
              @click="$emit('edit-task', task)"
            >
              <div class="task-row-main">
                <span class="priority-indicator" :class="`priority-indicator--${task.priority}`" :title="`Priority: ${task.priority}`"></span>
                <div class="task-row-details">
                  <span class="task-row-title">{{ task.title }}</span>
                  <span class="task-row-meta">Assigned to {{ task.assignee }}</span>
                </div>
              </div>
              <div class="task-row-side">
                <span class="task-status-badge" :class="`status--${task.status}`">
                  {{ getStatusLabel(task.status) }}
                </span>
                <span class="task-due-date" :class="{ 'date-overdue': isOverdue(task) }">
                  {{ formatDueDate(task.dueDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Workload breakdown -->
        <div class="dashboard-card content-card">
          <h4 class="chart-card-title">Resource Distribution</h4>
          <div v-if="workloadList.length === 0" class="empty-list-message">
            No active assignments.
          </div>
          <div v-else class="workload-list">
            <div v-for="item in workloadList" :key="item.name" class="workload-row">
              <div class="workload-meta">
                <div class="user-avatar-small" :style="{ background: getAvatarColor(item.name) }">
                  {{ getInitials(item.name) }}
                </div>
                <span class="workload-name">{{ item.name }}</span>
                <span class="workload-count">{{ item.count }} tasks active</span>
              </div>
              <div class="workload-bar-track">
                <div class="workload-bar-fill" :style="{ width: `${item.percentage}%`, background: getAvatarColor(item.name) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardProps, Task, TaskStatus, WorkloadItem } from '../../BLL/taskManager/types'

const props = defineProps<DashboardProps>()

defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
}>()

// ── Read from BLL manager ──────────────────────────────────────────
const allTasks = computed<Task[]>(() => props.manager.getAllTasks())
const totalTasks = computed<number>(() => allTasks.value.length)
const todoTasks = computed<number>(() => props.manager.getTaskCount('todo'))
const inProgressTasks = computed<number>(() => props.manager.getTaskCount('in-progress'))
const doneTasks = computed<number>(() => props.manager.getTaskCount('done'))
const remainingTasks = computed<number>(() => todoTasks.value + inProgressTasks.value)
const overdueTasks = computed<number>(() => allTasks.value.filter((t) => props.manager.isOverdue(t)).length)

// ── Gauge computation (Radius 40) ──────────────────────────────────
const strokeDasharray = 2 * Math.PI * 40 // ~251.3
const completionPercentage = computed<number>(() => {
  if (totalTasks.value === 0) return 0
  return (doneTasks.value / totalTasks.value) * 100
})
const strokeDashoffset = computed<number>(() => {
  const percent = completionPercentage.value
  return strokeDasharray - (percent / 100) * strokeDasharray
})

const completionStatusMessage = computed<string>(() => {
  const percent = Math.round(completionPercentage.value)
  if (totalTasks.value === 0) return 'No tasks created yet.'
  if (percent === 100) return 'Incredible! All tasks are completed. 🚀'
  if (percent >= 75) return 'Almost there! You are close to the finish line.'
  if (percent >= 50) return 'Halfway through. Keep up the momentum!'
  if (percent >= 25) return 'Making steady progress on workspace deliverables.'
  return 'Just starting off. Focus on critical path items.'
})

// ── Priority distribution ──────────────────────────────────────────
const highPriorityTasks = computed<number>(() => allTasks.value.filter((t) => t.priority === 'high').length)
const mediumPriorityTasks = computed<number>(() => allTasks.value.filter((t) => t.priority === 'medium').length)
const lowPriorityTasks = computed<number>(() => allTasks.value.filter((t) => t.priority === 'low').length)

const maxPriorityCount = computed<number>(() => {
  const counts = [highPriorityTasks.value, mediumPriorityTasks.value, lowPriorityTasks.value]
  return Math.max(...counts, 1)
})

const highPriorityPercent = computed<number>(() => (highPriorityTasks.value / maxPriorityCount.value) * 100)
const mediumPriorityPercent = computed<number>(() => (mediumPriorityTasks.value / maxPriorityCount.value) * 100)
const lowPriorityPercent = computed<number>(() => (lowPriorityTasks.value / maxPriorityCount.value) * 100)

// ── Recent Tasks List (Newest 5 tasks created) ─────────────────────
const recentTasks = computed<Task[]>(() => {
  return [...allTasks.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// ── Resource workload distribution ─────────────────────────────────
const workloadList = computed<WorkloadItem[]>(() => {
  const map: Record<string, number> = {}
  let maxCount = 0

  allTasks.value.forEach((t) => {
    if (t.status !== 'done') {
      const current = (map[t.assignee] ?? 0) + 1
      map[t.assignee] = current
      if (current > maxCount) maxCount = current
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
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

const AVATAR_PALETTE = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? '#6366f1'
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-4) 0;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Welcome Banner */
.dashboard-welcome-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(99, 102, 241, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.dashboard-welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
  pointer-events: none;
}

.banner-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-1);
}

.banner-subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.banner-sparkle {
  font-size: 28px;
  animation: float-sparkle 3s infinite ease-in-out;
}

/* Stats Metric Grid */
.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
}

.dashboard-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.metric-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.metric-card--alert {
  border-color: rgba(239, 68, 68, 0.25);
  background: #fff8f8;
}

.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-column);
  color: var(--color-text-secondary);
}

.metric-svg-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.metric-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
  margin-top: 2px;
}

.text-danger-pulse {
  color: var(--color-danger);
  animation: pulse-red 2s infinite ease-in-out;
}

/* Dashboard Columns Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: var(--space-6);
}

.dashboard-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Charts */
.chart-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.chart-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Gauge Ring Chart */
.gauge-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: var(--space-4);
  padding: var(--space-2) 0;
}

.gauge-svg-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.gauge-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-percent {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.gauge-sub {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  margin-top: 2px;
}

.gauge-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.gauge-status-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  font-weight: 500;
}

.gauge-legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
}

.legend-dot--done { background: var(--color-accent); }
.legend-dot--todo { background: var(--color-bg-main); border: 1px solid var(--color-border); }

/* Priority Bars */
.priority-chart-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-2) 0;
}

.priority-bar-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.priority-bar-label {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.priority-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  margin-right: var(--space-2);
}

.priority-dot--high { background: var(--color-priority-high); }
.priority-dot--medium { background: var(--color-priority-medium); }
.priority-dot--low { background: var(--color-priority-low); }

.priority-count {
  margin-left: auto;
  font-weight: 600;
  color: var(--color-text-primary);
}

.bar-track {
  height: 8px;
  background: var(--color-bg-main);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.bar-fill--high { background: var(--color-priority-high); }
.bar-fill--medium { background: var(--color-priority-medium); }
.bar-fill--low { background: var(--color-priority-low); }

/* Content Cards & Playlists */
.content-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.content-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-action-badge {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-list-message {
  padding: var(--space-6);
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-main);
}

/* Recent Tasks List */
.recent-tasks-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.recent-task-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
  background: var(--color-bg-card);
  transition: all var(--transition-fast);
}

.recent-task-row:hover {
  background: var(--color-bg-main);
  border-color: var(--color-accent);
  transform: translateX(2px);
}

.task-row-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.priority-indicator {
  width: 4px;
  height: 28px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.priority-indicator--high { background: var(--color-priority-high); }
.priority-indicator--medium { background: var(--color-priority-medium); }
.priority-indicator--low { background: var(--color-priority-low); }

.task-row-details {
  display: flex;
  flex-direction: column;
}

.task-row-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.task-row-meta {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 1px;
}

.task-row-side {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.task-status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.status--todo { background: var(--color-priority-medium-bg); color: var(--color-priority-medium); }
.status--in-progress { background: var(--color-accent-light); color: var(--color-accent); }
.status--done { background: #e6f9f2; color: var(--color-success); }

.task-due-date {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.date-overdue {
  color: var(--color-danger);
  font-weight: 600;
}

/* Resource workload breakdown */
.workload-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.workload-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.workload-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.workload-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.workload-count {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.workload-bar-track {
  height: 6px;
  background: var(--color-bg-main);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.workload-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

/* Animations */
@keyframes float-sparkle {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.1); }
}

@keyframes pulse-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Responsive Overrides */
@media (max-width: 1024px) {
  .dashboard-stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-stats-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-welcome-banner {
    padding: var(--space-4);
  }
  .gauge-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
