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
      @add-task="$emit('add-task')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task, ColumnMeta, KanbanBoardProps } from '../../BLL/taskManager/types'
import KanbanColumn from './KanbanColumn.vue'

// ── Props ──────────────────────────────────────────────────────────
defineProps<KanbanBoardProps>()

// ── Emits ──────────────────────────────────────────────────────────
defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', task: Task): void
  (e: 'add-task'): void
}>()

// ── Column metadata (presentation only) ────────────────────────────
const columns: ColumnMeta[] = [
  {
    status: 'todo',
    label: 'To do',
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
