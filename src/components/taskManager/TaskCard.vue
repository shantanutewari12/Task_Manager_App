<template>
  <div
    class="task-card"
    draggable="true"
    :class="{ 'task-card--overdue': isTaskOverdue }"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Top row: status badge + three-dot menu -->
    <div class="card-top">
      <span
        class="status-badge-card"
        :style="{ color: computedStatus.color, background: computedStatus.bg }"
      >
        <span class="status-dot" :style="{ background: computedStatus.color }"></span>
        {{ computedStatus.label }}
      </span>
      <div class="card-menu">
        <button class="card-menu-trigger" :id="`btn-menu-${task.id}`" aria-label="Task options">···</button>
        <div class="card-menu-dropdown">
          <button class="card-menu-item" :id="`btn-edit-${task.id}`" @click.stop="$emit('edit')">✎ Edit</button>
          <button class="card-menu-item card-menu-item--danger" :id="`btn-delete-${task.id}`" @click.stop="$emit('delete')">✕ Delete</button>
        </div>
      </div>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ task.title }}</h3>

    <!-- Description -->
    <p class="card-description">{{ task.description }}</p>

    <!-- Tags (chips) -->
    <div v-if="task.tags.length > 0" class="card-tags">
      <span v-for="tag in task.tags.slice(0, 3)" :key="tag" class="tag-chip">{{ tag }}</span>
      <span v-if="task.tags.length > 3" class="tag-chip tag-chip--more">+{{ task.tags.length - 3 }}</span>
    </div>

    <!-- Assignees row -->
    <div class="card-assignees-row">
      <span class="card-assignees-label">Assignees :</span>
      <div class="assignee-avatar" :title="task.assignee" :style="{ background: avatarColor }">
        {{ initials }}
      </div>
    </div>

    <!-- Date + Priority row -->
    <div class="card-date-priority-row">
      <span class="card-due" :class="{ 'card-due--overdue': isTaskOverdue }">
        <span class="due-icon">🗓</span>
        {{ formattedDueDate }}
        <span v-if="isTaskOverdue" class="overdue-label">Overdue</span>
      </span>
      <span class="priority-badge" :class="`priority-badge--${task.priority}`">
        {{ priorityLabel }}
      </span>
    </div>

    <!-- Stats row -->
    <div class="card-stats-row">
      <span class="stat-item">💬 {{ mockComments }} Comments</span>
      <span class="stat-divider">·</span>
      <span class="stat-item">🔗 {{ mockLinks }} Links</span>
      <span class="stat-divider">·</span>
      <span class="stat-item">📄 {{ mockFiles }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskCardProps, TaskPriority } from '../../BLL/taskManager/types'

// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<TaskCardProps>()

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

// ── Status config (presentation only) ──────────────────────────────
const computedStatus = computed(() => {
  if (props.task.status === 'done') {
    return {
      label: 'Complete',
      color: '#10b981',
      bg: '#d1fae5'
    }
  } else if (props.task.status === 'in-progress') {
    if (props.task.priority === 'high') {
      return {
        label: 'On Track',
        color: '#ec4899', // magenta
        bg: '#fdf2f8'
      }
    } else {
      return {
        label: 'In Research',
        color: '#f59e0b', // orange
        bg: '#fef3c7'
      }
    }
  } else {
    return {
      label: 'Not Started',
      color: '#6366f1', // indigo
      bg: '#ede9fe'
    }
  }
})

// ── Priority label ──────────────────────────────────────────────────
const PRIORITY_LABEL: Record<TaskPriority, string> = { high: 'High', medium: 'Medium', low: 'Low' }
const priorityLabel = computed<string>(() => PRIORITY_LABEL[props.task.priority])

// ── Overdue (delegated to BLL) ───────────────────────────────────────
const isTaskOverdue = computed<boolean>(() => props.manager.isOverdue(props.task))

// ── Due date format ──────────────────────────────────────────────────
const formattedDueDate = computed<string>(() => {
  const d = new Date(props.task.dueDate)
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
})

// ── Avatar initials + color ──────────────────────────────────────────
const initials = computed<string>(() =>
  props.task.assignee.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2)
)

const AVATAR_PALETTE = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']
const avatarColor = computed<string>(() => {
  let hash = 0
  for (let i = 0; i < props.task.assignee.length; i++) {
    hash = props.task.assignee.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? '#6366f1'
})

// ── Mock stats (presentation only, derived from task data) ──────────
const mockComments = computed<number>(() => {
  let h = 0
  for (let i = 0; i < props.task.id.length; i++) h = props.task.id.charCodeAt(i) + ((h << 5) - h)
  return (Math.abs(h) % 14) + 2
})
const mockLinks = computed<number>(() => Math.max(props.task.tags.length, 1))
const mockFiles = computed<string>(() => `${props.task.tags.length > 1 ? 2 : 1}/3`)

// ── Native drag-and-drop ────────────────────────────────────────────
function onDragStart(event: DragEvent): void {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.task.id)
  setTimeout(() => {
    ;(event.target as HTMLElement).classList.add('task-card--dragging')
  }, 0)
}

function onDragEnd(event: DragEvent): void {
  ;(event.target as HTMLElement).classList.remove('task-card--dragging')
}
</script>
