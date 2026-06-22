<template>
  <div class="calendar-view">
    <!-- Calendar Controls -->
    <div class="calendar-header-panel">
      <div class="calendar-title-group">
        <h2 class="calendar-month-year">{{ currentMonthName }} {{ currentYear }}</h2>
        <span class="calendar-today-badge">June 2026</span>
      </div>
      <div class="calendar-nav-controls">
        <button class="btn btn--ghost btn--sm calendar-today-btn" @click="goToToday">Today</button>
        <button class="btn btn--ghost btn--sm nav-arrow-btn" @click="prevMonth" aria-label="Previous Month">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button class="btn btn--ghost btn--sm nav-arrow-btn" @click="nextMonth" aria-label="Next Month">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid-container">
      <!-- Weekday headers -->
      <div class="calendar-weekdays">
        <div v-for="dayName in dayNames" :key="dayName" class="weekday-header">
          {{ dayName }}
        </div>
      </div>

      <!-- Month days grid -->
      <div class="calendar-days-grid">
        <div
          v-for="cell in calendarDays"
          :key="cell.dateString"
          class="calendar-day-cell"
          :class="{
            'day-cell--outside': !cell.isCurrentMonth,
            'day-cell--today': cell.isToday
          }"
        >
          <!-- Day header inside cell -->
          <div class="day-cell-header">
            <span class="day-number">{{ cell.dayNumber }}</span>
            <button
              class="day-add-btn"
              title="Add task for this day"
              @click.stop="onCellClick(cell.dateString)"
            >
              +
            </button>
          </div>

          <!-- Day tasks list -->
          <div class="day-tasks-list">
            <div
              v-for="task in cell.tasks.slice(0, 3)"
              :key="task.id"
              class="calendar-task-chip"
              :class="[
                `task-chip--priority-${task.priority}`,
                `task-chip--status-${task.status}`
              ]"
              :title="`${task.title} (${task.status})`"
              @click.stop="$emit('edit-task', task)"
            >
              <span class="chip-status-dot"></span>
              <span class="chip-title">{{ task.title }}</span>
            </div>
            <div v-if="cell.tasks.length > 3" class="tasks-more-badge">
              +{{ cell.tasks.length - 3 }} more
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarProps, Task, CalendarDay } from '../../BLL/taskManager/types'

const props = defineProps<CalendarProps>()

const emit = defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'add-task-date', dateStr: string): void
}>()

// ── Date Navigation ────────────────────────────────────────────────
// The user's current date is June 22, 2026.
const currentYear = ref<number>(2026)
const currentMonth = ref<number>(5) // 0-indexed (5 = June)

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed<string>(() => monthNames[currentMonth.value] ?? 'June')

const allTasks = computed<Task[]>(() => props.manager.getAllTasks())

function getTasksForDate(dateStr: string): Task[] {
  return allTasks.value.filter((t) => t.dueDate === dateStr)
}

function checkIfToday(year: number, month: number, day: number): boolean {
  // Matches local system date (June 22, 2026)
  const today = new Date()
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  )
}

// ── Calendar Cells computation ─────────────────────────────────────
const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: CalendarDay[] = []

  // 1. Previous Month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`

    cells.push({
      dateString: dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: checkIfToday(prevYear, prevMonth, dayNum),
      tasks: getTasksForDate(dateStr),
    })
  }

  // 2. Current Month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`

    cells.push({
      dateString: dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: checkIfToday(year, month, i),
      tasks: getTasksForDate(dateStr),
    })
  }

  // 3. Next Month days to fill exactly 42 grid cells (6 rows * 7 columns)
  const remainingCells = 42 - cells.length
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`

    cells.push({
      dateString: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: checkIfToday(nextYear, nextMonth, i),
      tasks: getTasksForDate(dateStr),
    })
  }

  return cells
})

// ── Controls Handlers ──────────────────────────────────────────────
function prevMonth(): void {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function nextMonth(): void {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

function goToToday(): void {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
}

function onCellClick(dateString: string): void {
  emit('add-task-date', dateString)
}
</script>

<style scoped>
.calendar-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  min-height: 500px;
  gap: var(--space-4);
  font-family: var(--font-family);
  padding: var(--space-4) 0;
}

/* Header Panel */
.calendar-header-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.calendar-title-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.calendar-month-year {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
}

.calendar-today-badge {
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.calendar-nav-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.calendar-today-btn {
  font-size: 13px;
  font-weight: 500;
}

.nav-arrow-btn {
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Grid Container */
.calendar-grid-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* Weekday header row */
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--color-bg-main);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.weekday-header {
  padding: var(--space-3) var(--space-2);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Days Grid */
.calendar-days-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.calendar-day-cell {
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  min-height: 60px;
  background: var(--color-bg-card);
  transition: background var(--transition-fast);
  position: relative;
}

.calendar-day-cell:nth-child(7n) {
  border-right: none;
}

.calendar-days-grid > .calendar-day-cell:nth-last-child(-n+7) {
  border-bottom: none;
}

.calendar-day-cell:hover {
  background: rgba(248, 249, 252, 0.7);
}

.calendar-day-cell:hover .day-add-btn {
  opacity: 1;
}

.day-cell--outside {
  background: var(--color-bg-main);
  opacity: 0.65;
}

.day-cell--today {
  background: rgba(99, 102, 241, 0.03);
}

.day-cell--today::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-accent);
}

.day-cell--today .day-number {
  background: var(--color-accent);
  color: #fff;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: 600;
}

/* Day Header */
.day-cell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  flex-shrink: 0;
}

.day-number {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.day-cell--outside .day-number {
  color: var(--color-text-muted);
}

.day-add-btn {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
  opacity: 0;
  transition: opacity var(--transition-fast), color var(--transition-fast);
  cursor: pointer;
  line-height: 1;
}

.day-add-btn:hover {
  color: var(--color-accent);
}

/* Tasks inside cell */
.day-tasks-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  min-height: 0;
}

.calendar-task-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: transform var(--transition-fast), filter var(--transition-fast);
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calendar-task-chip:hover {
  transform: translateY(-1px);
  filter: brightness(0.95);
}

/* Priority status coloring */
.task-chip--priority-high {
  background: var(--color-priority-high-bg);
  color: var(--color-priority-high);
}
.task-chip--priority-medium {
  background: var(--color-priority-medium-bg);
  color: var(--color-priority-medium);
}
.task-chip--priority-low {
  background: var(--color-priority-low-bg);
  color: var(--color-priority-low);
}

/* Completed task line-through */
.task-chip--status-done {
  text-decoration: line-through;
  opacity: 0.65;
  background: #f1f3f8;
  color: var(--color-text-muted);
}

.chip-status-dot {
  width: 5px;
  height: 5px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.task-chip--priority-high .chip-status-dot { background: var(--color-priority-high); }
.task-chip--priority-medium .chip-status-dot { background: var(--color-priority-medium); }
.task-chip--priority-low .chip-status-dot { background: var(--color-priority-low); }
.task-chip--status-done .chip-status-dot { background: var(--color-text-muted); }

.tasks-more-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  padding-left: var(--space-1);
}

/* Mobile responsive scaling */
@media (max-width: 768px) {
  .calendar-view {
    height: auto;
  }
  .calendar-day-cell {
    padding: var(--space-1);
  }
  .weekday-header {
    font-size: 11px;
  }
  .day-add-btn {
    display: none; /* Hide on mobile to simplify layout */
  }
  .calendar-task-chip {
    padding: 2px 4px;
    font-size: 9px;
  }
  .chip-status-dot {
    display: none;
  }
}
</style>
