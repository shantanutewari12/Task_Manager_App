<template>
  <div
    class="task-card"
    draggable="true"
    :class="{ 'task-card--overdue': isTaskOverdue }"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Card header: priority badge + actions -->
    <div class="card-header">
      <span class="priority-badge" :class="`priority-badge--${task.priority}`">
        {{ priorityLabel }}
      </span>
      <div class="card-actions">
        <button
          class="card-action-btn"
          :id="`btn-edit-${task.id}`"
          title="Edit task"
          @click.stop="$emit('edit')"
        >✎</button>
        <button
          class="card-action-btn card-action-btn--danger"
          :id="`btn-delete-${task.id}`"
          title="Delete task"
          @click.stop="$emit('delete')"
        >✕</button>
      </div>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ task.title }}</h3>

    <!-- Description: 2-line clamp -->
    <p class="card-description">{{ task.description }}</p>

    <!-- Tags -->
    <div v-if="task.tags.length > 0" class="card-tags">
      <span v-for="tag in task.tags.slice(0, 3)" :key="tag" class="tag-chip">{{ tag }}</span>
      <span v-if="task.tags.length > 3" class="tag-chip tag-chip--more">+{{ task.tags.length - 3 }}</span>
    </div>

    <!-- Card footer: due date + assignee -->
    <div class="card-footer">
      <span class="card-due" :class="{ 'card-due--overdue': isTaskOverdue }">
        <span class="due-icon">📅</span>
        {{ formattedDueDate }}
        <span v-if="isTaskOverdue" class="overdue-label">Overdue</span>
      </span>
      <div class="assignee-avatar" :title="task.assignee" :style="{ background: avatarColor }">
        {{ initials }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskManager } from '../../BLL/taskManager/TaskManager'
import type { Task } from '../../BLL/taskManager/types'

// ── Props ──────────────────────────────────────────────────────────
interface Props {
  task: Task
  manager: TaskManager
}
const props = defineProps<Props>()

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

// ── Derived display values (presentation only) ──────────────────────
const isTaskOverdue = computed<boolean>(() => props.manager.isOverdue(props.task))

const priorityLabel = computed<string>(() => {
  const map: Record<string, string> = { high: 'High', medium: 'Medium', low: 'Low' }
  return map[props.task.priority] ?? props.task.priority
})

const formattedDueDate = computed<string>(() => {
  const d = new Date(props.task.dueDate)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const initials = computed<string>(() => {
  return props.task.assignee
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const AVATAR_PALETTE = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

const avatarColor = computed<string>(() => {
  let hash = 0
  for (let i = 0; i < props.task.assignee.length; i++) {
    hash = props.task.assignee.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? '#6366f1'
})

// ── Native drag-and-drop ────────────────────────────────────────────
function onDragStart(event: DragEvent): void {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.task.id)
  // Brief delay so the ghost image renders before the class is added
  setTimeout(() => {
    ;(event.target as HTMLElement).classList.add('task-card--dragging')
  }, 0)
}

function onDragEnd(event: DragEvent): void {
  ;(event.target as HTMLElement).classList.remove('task-card--dragging')
}
</script>
