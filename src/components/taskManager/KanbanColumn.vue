<template>
  <div
    class="kanban-column"
    :class="{ 'kanban-column--drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column header -->
    <div class="column-header">
      <div class="column-header-left">
        <span class="column-dot" :style="{ background: column.color }" ></span>
        <span class="column-title">{{ column.label }}</span>
        <span class="column-count">{{ tasks.length }}</span>
      </div>
      <div class="column-header-right">
        <button
          class="col-icon-btn"
          :id="`btn-add-${column.status}`"
          title="Add task"
          @click="$emit('add-task')"
        >+</button>
        <button
          class="col-icon-btn"
          :id="`btn-col-more-${column.status}`"
          title="More options"
        >···</button>
      </div>
    </div>

    <!-- Task list with transition-group -->
    <div class="column-body">
      <TransitionGroup name="card-list" tag="div" class="card-list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :manager="manager"
          @edit="$emit('edit-task', task)"
          @delete="$emit('delete-task', task)"
        />
      </TransitionGroup>

      <!-- Empty state -->
      <div v-if="tasks.length === 0" class="column-empty">
        <span class="column-empty-icon">{{ column.emptyIcon }}</span>
        <p class="column-empty-text">{{ column.emptyMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task, KanbanColumnProps } from '../../BLL/taskManager/types'
import TaskCard from './TaskCard.vue'

// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<KanbanColumnProps>()

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
  (e: 'add-task'): void
}>()

// ── Drag and drop (native HTML5) ────────────────────────────────────
const isDragOver = ref<boolean>(false)

function onDragOver(event: DragEvent): void {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function onDragLeave(event: DragEvent): void {
  // Only clear if we're leaving the column itself (not entering a child)
  const related = event.relatedTarget as Node | null
  if (!event.currentTarget || !(event.currentTarget as HTMLElement).contains(related)) {
    isDragOver.value = false
  }
}

function onDrop(event: DragEvent): void {
  isDragOver.value = false
  const taskId = event.dataTransfer?.getData('text/plain')
  if (!taskId) return
  props.manager.moveTo(taskId, props.column.status)
}
</script>
