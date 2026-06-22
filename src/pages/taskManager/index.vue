<template>
  <div class="app-shell">


    <!-- ── Sidebar ──────────────────────────────────────────────── -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': isSidebarCollapsed }">

      <!-- Profile at top -->
      <div class="sidebar-profile">
        <div class="user-avatar-small" :style="{ background: getAvatarColor('Davis Donin') }">DD</div>
        <div class="user-info" v-if="!isSidebarCollapsed">
          <div class="user-name">Test User</div>
          <div class="user-email">testuser12@gmail.com</div>
        </div>
        <button class="sidebar-toggle-btn" :title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'" @click="isSidebarCollapsed = !isSidebarCollapsed">
          <svg v-if="isSidebarCollapsed" viewBox="0 0 24 24" class="sidebar-toggle-icon" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <path d="M14 9l3 3-3 3" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="sidebar-toggle-icon" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <path d="M15 15l-3-3 3-3" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-label" v-if="!isSidebarCollapsed">Menu</div>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Dashboard</span>
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Inbox</span>
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Calendar</span>
        </a>

        <div class="nav-section-label" v-if="!isSidebarCollapsed">
          Team spaces
          <button class="nav-section-add" aria-label="Add team space">+</button>
        </div>
        <a class="nav-item nav-item--workspace-active" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Tasks</span>
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Docs</span>
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Meeting</span>
        </a>

        <div class="nav-section-label" v-if="!isSidebarCollapsed">Other</div>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Settings</span>
        </a>
        <a class="nav-item" href="#">
          <span class="nav-icon">
            <svg class="sidebar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </span>
          <span class="nav-text" v-if="!isSidebarCollapsed">Support</span>
        </a>
      </nav>
    </aside>

    <!-- ── Main content ─────────────────────────────────────────── -->
    <main class="main-content">

      <!-- Page header -->
      <header class="page-header">
        <div class="page-header-row-2">
          <div class="page-title-group">
            <h1 class="page-title">Task Workspace</h1>
            <p class="page-subtitle">Track, organize, and collaborate on your team projects</p>
          </div>
          <div class="header-meta">
            <div class="header-avatar-group" aria-label="Team members">
              <div class="header-avatar" :style="{ background: getAvatarColor('Sarah Chen') }">SC</div>
              <div class="header-avatar" :style="{ background: getAvatarColor('Marcus Reid') }">MR</div>
              <div class="header-avatar" :style="{ background: getAvatarColor('Priya Nair') }">PN</div>
              <div class="header-avatar-count">+2</div>
            </div>
            <button class="btn btn--invite" id="btn-invite-member">
              <svg class="btn-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
              Invite
            </button>
            <button class="btn btn--ghost" id="btn-settings-header">
              <svg class="btn-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </header>

      <!-- Page tabs bar (replaces old toolbar) -->
      <div class="page-tabs-bar">
        <div class="page-tabs">
          <button
            class="page-tab"
            :class="{ 'page-tab--active': manager.viewState.view === 'overview' }"
            id="tab-overview"
            @click="manager.setView('overview')"
          >Overview</button>
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
          <button
            class="page-tab"
            :class="{ 'page-tab--active': manager.viewState.view === 'table' }"
            id="tab-table"
            @click="manager.setView('table')"
          >⊟ Table</button>
          <button
            class="page-tab"
            :class="{ 'page-tab--active': manager.viewState.view === 'timeline' }"
            id="tab-timeline"
            @click="manager.setView('timeline')"
          >⏱ Timeline</button>
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
          <button class="btn btn--share-new" id="btn-share">
            <svg class="btn-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Share
          </button>
          <button
            class="btn btn--add-task-new"
            id="btn-new-task"
            @click="openCreateModal"
          >
            <svg class="btn-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <!-- New task button (floating above kanban/list) -->
      <div class="content-action-bar">
        <span class="total-count-label">{{ totalCount }} tasks total</span>
      </div>

      <!-- Views -->
      <div class="view-container">
        <Transition name="view-fade" mode="out-in">
          <Overview
            v-if="manager.viewState.view === 'overview'"
            key="overview"
            :manager="manager"
            @edit-task="openEditModal"
            @delete-task="confirmDelete"
          />
          <KanbanBoard
            v-else-if="manager.viewState.view === 'kanban'"
            key="kanban"
            :manager="manager"
            @edit-task="openEditModal"
            @delete-task="confirmDelete"
            @add-task="openCreateModal"
          />
          <ListView
            v-else-if="manager.viewState.view === 'list'"
            key="list"
            :manager="manager"
            @edit-task="openEditModal"
            @delete-task="confirmDelete"
          />
          <TableView
            v-else-if="manager.viewState.view === 'table'"
            key="table"
            :manager="manager"
            @edit-task="openEditModal"
            @delete-task="confirmDelete"
          />
          <TimelineView
            v-else-if="manager.viewState.view === 'timeline'"
            key="timeline"
            :manager="manager"
            @edit-task="openEditModal"
            @delete-task="confirmDelete"
          />
        </Transition>
      </div>
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
import Overview from '../../components/taskManager/Overview.vue'
import TableView from '../../components/taskManager/TableView.vue'
import TimelineView from '../../components/taskManager/TimelineView.vue'
import TaskModal from '../../components/taskManager/TaskModal.vue'

// ── Instantiate BLL (single instance, passed as prop to children) ─
const manager = new TaskManager()

// ── Derived state ─────────────────────────────────────────────────
const assignees = computed<string[]>(() => manager.getAssignees())
const totalCount = computed<number>(() => manager.getAllTasks().length)

// ── Sidebar State ─────────────────────────────────────────────────
const isSidebarCollapsed = ref<boolean>(false)

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
