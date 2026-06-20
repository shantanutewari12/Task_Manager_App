<template>
  <div class="app-shell">
    <!-- ── Sidebar ──────────────────────────────────────────── -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-icon">⚡</span>
        <span class="brand-name">TaskFlow</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Workspace</div>
        <a class="nav-item nav-item--active" href="#">
          <span class="nav-icon">◈</span>Tasks
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">◉</span>Dashboard
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">◷</span>Calendar
        </a>
        <div class="nav-section-label">Team</div>
        <a class="nav-item" href="#">
          <span class="nav-icon">◎</span>Members
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">◌</span>Settings
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="user-avatar-small" :style="{ background: getAvatarColor('Sarah Chen') }">SC</div>
        <div class="user-info">
          <div class="user-name">Sarah Chen</div>
          <div class="user-role">Team Lead</div>
        </div>
      </div>
    </aside>

    <!-- ── Main content ─────────────────────────────────────── -->
    <main class="main-content">
      <!-- Header -->
      <header class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Tasks</h1>
          <p class="page-subtitle">Software team · {{ totalCount }} tasks</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn--primary" id="btn-new-task" @click="openCreateModal">
            <span>+</span> New Task
          </button>
        </div>
      </header>

      <!-- Toolbar -->
      <div class="toolbar">
        <ViewToggle :manager="manager" />

        <div class="toolbar-right">
          <!-- Filter: Priority -->
          <div class="filter-group">
            <label class="filter-label">Priority</label>
            <select
              id="filter-priority"
              class="filter-select"
              :value="manager.viewState.filters.priority"
              @change="onFilterPriority"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <!-- Filter: Assignee -->
          <div class="filter-group">
            <label class="filter-label">Assignee</label>
            <select
              id="filter-assignee"
              class="filter-select"
              :value="manager.viewState.filters.assignee"
              @change="onFilterAssignee"
            >
              <option value="all">All members</option>
              <option v-for="name in assignees" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>

          <!-- Clear filters -->
          <button
            v-if="manager.hasActiveFilters()"
            class="btn btn--ghost btn--sm"
            id="btn-clear-filters"
            @click="manager.clearFilters()"
          >
            ✕ Clear
          </button>
        </div>
      </div>

      <!-- Views -->
      <Transition name="view-fade" mode="out-in">
        <KanbanBoard
          v-if="manager.viewState.view === 'kanban'"
          key="kanban"
          :manager="manager"
          @edit-task="openEditModal"
          @delete-task="confirmDelete"
        />
        <ListView
          v-else
          key="list"
          :manager="manager"
          @edit-task="openEditModal"
          @delete-task="confirmDelete"
        />
      </Transition>
    </main>

    <!-- ── Task Modal ────────────────────────────────────────── -->
    <TaskModal
      v-if="showModal"
      :task="editingTask"
      :manager="manager"
      @close="closeModal"
      @saved="closeModal"
    />

    <!-- ── Delete Confirmation ───────────────────────────────── -->
    <Transition name="fade">
      <div v-if="showDeleteConfirm" class="overlay" @click.self="cancelDelete">
        <div class="confirm-dialog" role="dialog" aria-modal="true">
          <div class="confirm-icon">🗑️</div>
          <h2 class="confirm-title">Delete Task</h2>
          <p class="confirm-body">
            Are you sure you want to delete
            <strong>{{ taskToDelete?.title }}</strong>? This action cannot be undone.
          </p>
          <div class="confirm-actions">
            <button class="btn btn--ghost" id="btn-cancel-delete" @click="cancelDelete">
              Cancel
            </button>
            <button class="btn btn--danger" id="btn-confirm-delete" @click="executeDelete">
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TaskManager } from '../../BLL/taskManager/TaskManager'
import type { Task, FilterOptions } from '../../BLL/taskManager/types'
import KanbanBoard from '../../components/taskManager/KanbanBoard.vue'
import ListView from '../../components/taskManager/ListView.vue'
import TaskModal from '../../components/taskManager/TaskModal.vue'
import ViewToggle from '../../components/taskManager/ViewToggle.vue'

// ── Instantiate BLL (single instance, passed as prop to children) ───
const manager = new TaskManager()

// ── Derived state ───────────────────────────────────────────────────
const assignees = computed<string[]>(() => manager.getAssignees())
const totalCount = computed<number>(() => manager.getAllTasks().length)

// ── Modal state ─────────────────────────────────────────────────────
const showModal = ref<boolean>(false)
const editingTask = ref<Task | null>(null)

function openCreateModal(): void {
  editingTask.value = null
  showModal.value = true
}

function openEditModal(task: Task): void {
  editingTask.value = task
  showModal.value = true
}

function closeModal(): void {
  showModal.value = false
  editingTask.value = null
}

// ── Delete state ─────────────────────────────────────────────────────
const showDeleteConfirm = ref<boolean>(false)
const taskToDelete = ref<Task | null>(null)

function confirmDelete(task: Task): void {
  taskToDelete.value = task
  showDeleteConfirm.value = true
}

function cancelDelete(): void {
  showDeleteConfirm.value = false
  taskToDelete.value = null
}

function executeDelete(): void {
  if (taskToDelete.value) {
    manager.deleteTask(taskToDelete.value.id)
  }
  cancelDelete()
}

// ── Filter handlers ──────────────────────────────────────────────────
function onFilterPriority(event: Event): void {
  const val = (event.target as HTMLSelectElement).value as FilterOptions['priority']
  manager.setFilterPriority(val)
}

function onFilterAssignee(event: Event): void {
  const val = (event.target as HTMLSelectElement).value as FilterOptions['assignee']
  manager.setFilterAssignee(val)
}

// ── Avatar color helper (for sidebar) ───────────────────────────────
function getAvatarColor(name: string): string {
  const palette = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}
</script>
