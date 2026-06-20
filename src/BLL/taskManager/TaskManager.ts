// ============================================================
// TaskManager — ALL business logic lives here exclusively.
// Components call methods; they never implement logic inline.
// ============================================================

import { reactive } from 'vue'
import { mockTasks } from './mockData'
import type {
  Task,
  TaskStatus,
  TaskPriority,
  FilterOptions,
  SortOptions,
  TaskFormData,
  ViewState,
} from './types'

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

const STORAGE_KEY = 'task-manager-view-state'

export class TaskManager {
  // ── Reactive state ─────────────────────────────────────────
  private _tasks: Task[]
  public viewState: ViewState

  // ── Constructor ────────────────────────────────────────────
  constructor() {
    this._tasks = reactive([...mockTasks])
    this.viewState = reactive(this._loadViewState())
  }

  // ── Private helpers ────────────────────────────────────────

  private _generateId(): string {
    return `task-${String(Date.now())}-${Math.random().toString(36).slice(2, 8)}`
  }

  private _loadViewState(): ViewState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ViewState
        return parsed
      }
    } catch {
      // fall through to default
    }
    return {
      view: 'kanban',
      sort: { field: 'dueDate', direction: 'asc' },
      filters: { priority: 'all', assignee: 'all' },
    }
  }

  private _persistViewState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.viewState))
  }

  private _isOverdue(task: Task): boolean {
    if (task.status === 'done') return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(task.dueDate)
    return due < today
  }

  // ── Public read methods ────────────────────────────────────

  /** Returns a shallow copy to avoid external mutation */
  public getAllTasks(): Task[] {
    return [...this._tasks]
  }

  /** All tasks for a given column/status */
  public getTasksByStatus(status: TaskStatus): Task[] {
    return this._tasks.filter((t) => t.status === status)
  }

  /** Apply current filter + sort options to a task list */
  public getFilteredAndSorted(tasks: Task[]): Task[] {
    const { filters, sort } = this.viewState
    let result = [...tasks]

    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority)
    }

    // Filter by assignee
    if (filters.assignee !== 'all') {
      result = result.filter((t) => t.assignee === filters.assignee)
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0
      if (sort.field === 'dueDate') {
        cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else {
        // sort.field === 'priority' (only other SortField value)
        cmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      }
      return sort.direction === 'asc' ? cmp : -cmp
    })

    return result
  }

  /** Filtered tasks grouped by status for Kanban */
  public getFilteredByStatus(status: TaskStatus): Task[] {
    const all = this.getTasksByStatus(status)
    return this.getFilteredAndSorted(all)
  }

  /** Flat filtered+sorted list for List view */
  public getFilteredList(): Task[] {
    return this.getFilteredAndSorted([...this._tasks])
  }

  /** Whether a task is overdue (public for card rendering) */
  public isOverdue(task: Task): boolean {
    return this._isOverdue(task)
  }

  /** Unique assignee names for filter dropdown */
  public getAssignees(): string[] {
    const names = this._tasks.map((t) => t.assignee)
    return [...new Set(names)].sort()
  }

  /** Task by id */
  public getTaskById(id: string): Task | undefined {
    return this._tasks.find((t) => t.id === id)
  }

  // ── CRUD methods ───────────────────────────────────────────

  public createTask(formData: TaskFormData): Task {
    const newTask: Task = {
      id: this._generateId(),
      createdAt: new Date().toISOString(),
      ...formData,
    }
    this._tasks.push(newTask)
    return newTask
  }

  public updateTask(id: string, formData: TaskFormData): Task | null {
    const index = this._tasks.findIndex((t) => t.id === id)
    if (index === -1) return null
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updated: Task = { ...this._tasks[index]!, ...formData }
    this._tasks.splice(index, 1, updated)
    return updated
  }

  public deleteTask(id: string): boolean {
    const index = this._tasks.findIndex((t) => t.id === id)
    if (index === -1) return false
    this._tasks.splice(index, 1)
    return true
  }

  /** Move a task to a new column (Kanban drag-and-drop) */
  public moveTo(taskId: string, newStatus: TaskStatus): boolean {
    const task = this._tasks.find((t) => t.id === taskId)
    if (!task) return false
    task.status = newStatus
    return true
  }

  // ── View state mutations ───────────────────────────────────

  public setView(view: 'kanban' | 'list'): void {
    this.viewState.view = view
    this._persistViewState()
  }

  public setSort(field: SortOptions['field'], direction: SortOptions['direction']): void {
    this.viewState.sort = { field, direction }
    this._persistViewState()
  }

  public setFilterPriority(priority: FilterOptions['priority']): void {
    this.viewState.filters.priority = priority
    this._persistViewState()
  }

  public setFilterAssignee(assignee: FilterOptions['assignee']): void {
    this.viewState.filters.assignee = assignee
    this._persistViewState()
  }

  public clearFilters(): void {
    this.viewState.filters = { priority: 'all', assignee: 'all' }
    this._persistViewState()
  }

  // ── Derived state helpers ──────────────────────────────────

  public hasActiveFilters(): boolean {
    const { filters } = this.viewState
    return filters.priority !== 'all' || filters.assignee !== 'all'
  }

  public getTaskCount(status: TaskStatus): number {
    return this._tasks.filter((t) => t.status === status).length
  }
}
