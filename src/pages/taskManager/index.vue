<template>
  <div class="app-shell">


    <!-- ── Sidebar ──────────────────────────────────────────────── -->
    <aside class="sidebar">

      <!-- Profile at top -->
      <div class="sidebar-profile">
        <div class="user-avatar-small" :style="{ background: getAvatarColor('Davis Donin') }">DD</div>
        <div class="user-info">
          <div class="user-name">Davis Donin</div>
          <div class="user-email">daviddoni@gmail.com</div>
        </div>
        <button class="sidebar-profile-more" aria-label="Profile options">···</button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu</div>
        <a class="nav-item" href="#">
          <span class="nav-icon">🏠</span>Dashboard
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">📥</span>Inbox
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">📅</span>Calendar
        </a>

        <div class="nav-section-label">
          Team spaces
          <button class="nav-section-add" aria-label="Add team space">+</button>
        </div>
        <a class="nav-item nav-item--workspace-active" href="#">
          <span class="nav-icon">📋</span>Tasks
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">📄</span>Docs
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">👥</span>Meeting
        </a>

        <div class="nav-section-label">Other</div>
        <a class="nav-item" href="#">
          <span class="nav-icon">⚙</span>Settings
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">❓</span>Support
        </a>
      </nav>
    </aside>

    <!-- ── Main content ─────────────────────────────────────────── -->
    <main class="main-content">

      <!-- Page header -->
      <header class="page-header">
        <div class="page-header-row-1">
          <nav class="breadcrumb" aria-label="breadcrumb">
            <span class="breadcrumb-back">←</span>
            <span>Team spaces</span>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current">Tasks</span>
          </nav>
          <div class="header-controls">
            <div class="search-input-wrapper">
              <span class="search-icon-header">🔍</span>
              <input type="text" class="search-input-header" placeholder="Search" />
              <span class="search-shortcut">⌘F</span>
            </div>
            <button class="header-icon-btn" aria-label="Help">❓</button>
            <button class="header-icon-btn" aria-label="Notifications">🔔</button>
          </div>
        </div>

        <div class="page-header-row-2">
          <div class="page-title-group">
            <h1 class="page-title">Tasks</h1>
            <p class="page-subtitle">Short description will be placed here</p>
          </div>
          <div class="header-meta">
            <div class="header-avatar-group" aria-label="Team members">
              <div class="header-avatar" :style="{ background: getAvatarColor('Sarah Chen') }">SC</div>
              <div class="header-avatar" :style="{ background: getAvatarColor('Marcus Reid') }">MR</div>
              <div class="header-avatar" :style="{ background: getAvatarColor('Priya Nair') }">PN</div>
              <div class="header-avatar-count">+2</div>
            </div>
            <button class="btn btn--invite" id="btn-invite-member">👤 Invite Member</button>
            <button class="btn btn--share" id="btn-share">↗ Share</button>
          </div>
        </div>
      </header>

      <!-- Page tabs bar (replaces old toolbar) -->
      <div class="page-tabs-bar">
        <div class="page-tabs">
          <button class="page-tab" id="tab-overview">Overview</button>
          <button
            class="page-tab"
            :class="{ 'page-tab--active': manager.viewState.view === 'kanban' }"
            id="tab-board"
            @click="manager.setView('kanban')"
          >⊞ Board</button>
          <button
            class="page-tab"
            :class="{ 'page-tab--active': manager.viewState.view === 'list' }"
            id="tab-list"
            @click="manager.setView('list')"
          >☰ List</button>
          <button class="page-tab page-tab--disabled" id="tab-table">⊟ Table</button>
          <button class="page-tab page-tab--disabled" id="tab-timeline">⏱ Timeline</button>
        </div>

        <div class="page-tabs-right">
          <!-- Priority filter -->
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

          <!-- Assignee filter -->
          <select
            id="filter-assignee"
            class="filter-select"
            :value="manager.viewState.filters.assignee"
            @change="onFilterAssignee"
          >
            <option value="all">All members</option>
            <option v-for="name in assignees" :key="name" :value="name">{{ name }}</option>
          </select>

          <!-- Clear filters -->
          <button
            v-if="manager.hasActiveFilters()"
            class="btn btn--ghost btn--sm"
            id="btn-clear-filters"
            @click="manager.clearFilters()"
          >✕ Clear</button>

          <span class="tabs-separator" aria-hidden="true"></span>
          <button class="tab-action-btn" id="tab-btn-filter">⊟ Filter</button>
          <button class="tab-action-btn" id="tab-btn-groupby">⊞ Group by</button>
          <button class="tab-action-btn" id="tab-btn-sort">⇅ Sort</button>
          <button class="tab-action-btn" id="tab-btn-more">···</button>
        </div>
      </div>

      <!-- New task button (floating above kanban/list) -->
      <div class="content-action-bar">
        <button class="btn btn--primary" id="btn-new-task" @click="openCreateModal">
          + New Task
        </button>
        <span class="total-count-label">{{ totalCount }} tasks total</span>
      </div>

      <!-- Views -->
      <Transition name="view-fade" mode="out-in">
        <KanbanBoard
          v-if="manager.viewState.view === 'kanban'"
          key="kanban"
          :manager="manager"
          @edit-task="openEditModal"
          @delete-task="confirmDelete"
          @add-task="openCreateModal"
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

    <!-- ── Task Modal ────────────────────────────────────────────── -->
    <TaskModal
      v-if="showModal"
      :task="editingTask"
      :manager="manager"
      @close="closeModal"
      @saved="closeModal"
    />

    <!-- ── Delete Confirmation ───────────────────────────────────── -->
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
            <button class="btn btn--ghost" id="btn-cancel-delete" @click="cancelDelete">Cancel</button>
            <button class="btn btn--danger" id="btn-confirm-delete" @click="executeDelete">Delete Task</button>
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

// ── Instantiate BLL (single instance, passed as prop to children) ─
const manager = new TaskManager()

// ── Derived state ─────────────────────────────────────────────────
const assignees = computed<string[]>(() => manager.getAssignees())
const totalCount = computed<number>(() => manager.getAllTasks().length)

// ── Modal state ───────────────────────────────────────────────────
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

// ── Delete state ──────────────────────────────────────────────────
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

// ── Filter handlers ───────────────────────────────────────────────
function onFilterPriority(event: Event): void {
  const val = (event.target as HTMLSelectElement).value as FilterOptions['priority']
  manager.setFilterPriority(val)
}

function onFilterAssignee(event: Event): void {
  const val = (event.target as HTMLSelectElement).value as FilterOptions['assignee']
  manager.setFilterAssignee(val)
}

// ── Avatar color helper (presentation only) ───────────────────────
function getAvatarColor(name: string): string {
  const palette = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length] ?? '#6366f1'
}
</script>
