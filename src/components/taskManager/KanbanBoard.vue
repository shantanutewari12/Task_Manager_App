<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="col in columns"
      :key="col.status"
      :column="col"
      :tasks="manager.getFilteredByStatus(col.status)"
      :manager="manager"
      @edit-task="$emit('edit-task', $event)"
      @delete-task="$emit('delete-task', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TaskManager } from '../../BLL/taskManager/TaskManager'
import type { Task, ColumnMeta } from '../../BLL/taskManager/types'
import KanbanColumn from './KanbanColumn.vue'

// ── Props ──────────────────────────────────────────────────────────
interface Props {
  manager: TaskManager
}
defineProps<Props>()

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
}>()

// ── Column metadata (presentation only) ────────────────────────────
const columns: ColumnMeta[] = [
  {
    status: 'todo',
    label: 'To Do',
    color: '#f59e0b',
    emptyMessage: 'No tasks here yet',
    emptyIcon: '📋',
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    color: '#6366f1',
    emptyMessage: 'Nothing in progress',
    emptyIcon: '🚀',
  },
  {
    status: 'done',
    label: 'Done',
    color: '#10b981',
    emptyMessage: 'Complete tasks will appear here',
    emptyIcon: '✅',
  },
]
</script>
