// ============================================================
// Task Manager — ALL domain types, interfaces, enums live here
// No inline types allowed anywhere else in the project
// ============================================================

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type SortField = 'dueDate' | 'priority'

/** Sentinel value meaning "no filter applied" */
export type FilterAll = 'all'

export type SortDirection = 'asc' | 'desc'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string          // ISO date string: 'YYYY-MM-DD'
  assignee: string
  status: TaskStatus
  tags: string[]
  createdAt: string        // ISO datetime string
}

export interface FilterOptions {
  priority: TaskPriority | FilterAll
  /** 'all' (FilterAll sentinel) or a specific assignee name */
  assignee: FilterAll | (string & Record<never, never>)
}

export interface SortOptions {
  field: SortField
  direction: SortDirection
}

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assignee: string
  status: TaskStatus
  tags: string[]
}

export interface ValidationErrors {
  title?: string
  dueDate?: string
  assignee?: string
}

export interface ColumnMeta {
  status: TaskStatus
  label: string
  color: string
  emptyMessage: string
  emptyIcon: string
}

export interface ViewState {
  view: 'kanban' | 'list'
  sort: SortOptions
  filters: FilterOptions
}
