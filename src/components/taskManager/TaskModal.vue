<template>
  <Transition name="fade">
    <div v-if="show" class="overlay" @click.self="$emit('close')">
      <div class="detail-modal" role="dialog" aria-modal="true" :aria-label="isEditing ? 'Edit Task' : 'New Task'">

        <!-- ── Top bar ──────────────────────────────────────────── -->
        <div class="detail-modal-top">
          <button class="detail-close" id="btn-modal-close" @click="$emit('close')" aria-label="Close">✕</button>
          <div class="detail-top-right">
            <button class="detail-action-btn" title="History">⏱</button>
            <button class="detail-action-btn" title="Star">☆</button>
            <button class="detail-action-btn" title="More">···</button>
          </div>
        </div>

        <!-- ── Scrollable content ─────────────────────────────── -->
        <div class="detail-scroll">

          <!-- Title -->
          <div class="detail-title-row">
            <input
              id="field-title"
              v-model="form.title"
              class="detail-title-input"
              :class="{ 'detail-title-input--error': errors.title }"
              placeholder="Task title..."
              autocomplete="off"
              @blur="validateTitle"
            />
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <!-- ── Metadata rows ───────────────────────────────── -->
          <div class="detail-meta">

            <!-- Created time (edit mode only) -->
            <div v-if="isEditing" class="detail-row">
              <span class="detail-row-icon">⏱</span>
              <span class="detail-row-label">Created time</span>
              <span class="detail-row-value">{{ formattedCreatedAt }}</span>
            </div>

            <!-- Status -->
            <div class="detail-row">
              <span class="detail-row-icon">✦</span>
              <span class="detail-row-label">Status</span>
              <select
                id="field-status"
                v-model="form.status"
                class="detail-status-select"
                :class="`detail-status-select--${form.status}`"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <!-- Priority -->
            <div class="detail-row">
              <span class="detail-row-icon">○</span>
              <span class="detail-row-label">Priority</span>
              <select
                id="field-priority"
                v-model="form.priority"
                class="detail-priority-select"
                :class="`detail-priority-select--${form.priority}`"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <!-- Due Date -->
            <div class="detail-row" :class="{ 'detail-row--error': errors.dueDate }">
              <span class="detail-row-icon">📅</span>
              <span class="detail-row-label">Due Date</span>
              <div class="detail-row-field">
                <input
                  id="field-due-date"
                  v-model="form.dueDate"
                  type="date"
                  class="detail-date-input"
                  @blur="validateDueDate"
                />
                <span v-if="errors.dueDate" class="form-error">{{ errors.dueDate }}</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="detail-row">
              <span class="detail-row-icon">🏷</span>
              <span class="detail-row-label">Tags</span>
              <div class="detail-tags-area">
                <span
                  v-for="(tag, i) in form.tags"
                  :key="i"
                  class="tag-chip tag-chip--removable"
                >
                  {{ tag }}
                  <button type="button" class="tag-remove" @click="removeTag(i)">✕</button>
                </span>
                <input
                  id="field-tags"
                  v-model="tagInput"
                  class="detail-tag-input"
                  type="text"
                  placeholder="Add tag..."
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                />
              </div>
            </div>

            <!-- Assignees -->
            <div class="detail-row" :class="{ 'detail-row--error': errors.assignee }">
              <span class="detail-row-icon">👤</span>
              <span class="detail-row-label">Assignees</span>
              <div class="detail-assignee-area">
                <div
                  v-if="form.assignee"
                  class="assignee-avatar assignee-avatar--sm"
                  :style="{ background: assigneeAvatarColor }"
                  :title="form.assignee"
                >{{ assigneeInitials }}</div>
                <input
                  id="field-assignee"
                  v-model="form.assignee"
                  class="detail-assignee-input"
                  type="text"
                  placeholder="Assignee name..."
                  list="detail-assignee-suggestions"
                  @blur="validateAssignee"
                />
                <datalist id="detail-assignee-suggestions">
                <option v-for="name in existingAssignees" :key="name" :value="name"></option>
                </datalist>
                <span v-if="errors.assignee" class="form-error">{{ errors.assignee }}</span>
              </div>
            </div>
          </div>

          <!-- ── Project Description ──────────────────────────── -->
          <div class="detail-description-section">
            <h3 class="detail-description-label">Project Description</h3>
            <textarea
              id="field-description"
              v-model="form.description"
              class="detail-description-textarea"
              rows="4"
              placeholder="Add a project description..."
            ></textarea>
          </div>

          <!-- ── Activity Section ─────────────────────────────── -->
          <div class="detail-activity">
            <div class="detail-activity-tabs">
              <button class="detail-tab detail-tab--active">Activity</button>
              <button class="detail-tab">My Work</button>
              <button class="detail-tab">Assigned</button>
              <button class="detail-tab">Comments</button>
            </div>

            <div class="detail-activity-feed">
              <div class="activity-day-label">Today</div>
              <div class="activity-item">
                <div class="activity-avatar" :style="{ background: assigneeAvatarColor }">
                  {{ assigneeInitials }}
                </div>
                <div class="activity-content">
                  <span class="activity-text">
                    <strong>{{ form.assignee || 'You' }}</strong>
                    {{ isEditing ? 'updated this task' : 'is creating a new task' }}
                  </span>
                  <span class="activity-time">Just now</span>
                </div>
              </div>
              <div v-if="isEditing" class="activity-item">
                <div class="activity-avatar" style="background: #8b5cf6">TM</div>
                <div class="activity-content">
                  <span class="activity-text">
                    <strong>Team Member</strong> added a comment in
                    <strong>{{ form.title || 'this task' }}</strong>
                  </span>
                  <span class="activity-time">10:45 AM</span>
                </div>
              </div>
              <div v-if="isEditing" class="activity-item">
                <div class="activity-avatar" style="background: #ec4899">DD</div>
                <div class="activity-content">
                  <span class="activity-text">
                    <strong>Test User</strong> uploaded file
                    <strong>User flow</strong>
                  </span>
                  <span class="activity-time">10:45 AM</span>
                </div>
              </div>
              <div v-if="isEditing" class="activity-day-label" style="margin-top: var(--space-4);">Yesterday</div>
              <div v-if="isEditing" class="activity-item">
                <div class="activity-avatar" :style="{ background: assigneeAvatarColor }">
                  {{ assigneeInitials }}
                </div>
                <div class="activity-content">
                  <span class="activity-text">
                    <strong>{{ form.assignee || 'User' }}</strong> was created this task
                  </span>
                  <span class="activity-time">10:45 AM</span>
                </div>
              </div>
            </div>
          </div>

        </div><!-- /detail-scroll -->

        <!-- ── Footer ─────────────────────────────────────────── -->
        <div class="detail-modal-footer">
          <button type="button" class="btn btn--ghost" id="btn-modal-cancel" @click="$emit('close')">
            Cancel
          </button>
          <button type="button" class="btn btn--primary" id="btn-modal-save" @click="handleSubmit">
            {{ isEditing ? 'Save Changes' : 'Create Task' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { TaskFormData, ValidationErrors, TaskModalProps } from '../../BLL/taskManager/types'

// ── Props ──────────────────────────────────────────────────────────
const props = defineProps<TaskModalProps>()

// ── Emits ──────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

// ── Show/mount ──────────────────────────────────────────────────────
const show = ref<boolean>(false)
nextTick(() => { show.value = true })

// ── Derived state ───────────────────────────────────────────────────
const isEditing = computed<boolean>(() => props.task !== null && props.task.id !== '')
const existingAssignees = computed<string[]>(() => props.manager.getAssignees())

// ── Formatted created-at (read-only display) ─────────────────────────
const formattedCreatedAt = computed<string>(() => {
  if (!props.task?.id) return ''
  const d = new Date(props.task.createdAt)
  const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${date}  ${time}`
})

// ── Form state ──────────────────────────────────────────────────────
function buildInitialForm(): TaskFormData {
  if (props.task?.id) {
    return {
      title: props.task.title,
      description: props.task.description,
      priority: props.task.priority,
      dueDate: props.task.dueDate,
      assignee: props.task.assignee,
      status: props.task.status,
      tags: [...props.task.tags],
    }
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: props.task ? props.task.dueDate : (tomorrow.toISOString().split('T')[0] ?? ''),
    assignee: '',
    status: 'todo',
    tags: [],
  }
}

const form = reactive<TaskFormData>(buildInitialForm())
const errors = reactive<ValidationErrors>({})
const tagInput = ref<string>('')

watch(() => props.task, () => {
  const fresh = buildInitialForm()
  Object.assign(form, fresh)
  errors.title = undefined
  errors.dueDate = undefined
  errors.assignee = undefined
})

// ── Avatar helpers for activity section (presentation only) ─────────
const AVATAR_PALETTE = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

const assigneeAvatarColor = computed<string>(() => {
  const name = form.assignee || 'User'
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? '#6366f1'
})

const assigneeInitials = computed<string>(() => {
  const name = form.assignee || 'U'
  return name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2)
})

// ── Validation ──────────────────────────────────────────────────────
function validateTitle(): boolean {
  if (!form.title.trim()) {
    errors.title = 'Title is required'
    return false
  }
  errors.title = undefined
  return true
}

function validateDueDate(): boolean {
  if (!form.dueDate) {
    errors.dueDate = 'Due date is required'
    return false
  }
  if (!isEditing.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (new Date(form.dueDate) < today) {
      errors.dueDate = 'Due date cannot be in the past'
      return false
    }
  }
  errors.dueDate = undefined
  return true
}

function validateAssignee(): boolean {
  if (!form.assignee.trim()) {
    errors.assignee = 'Assignee is required'
    return false
  }
  errors.assignee = undefined
  return true
}

function validate(): boolean {
  const t = validateTitle()
  const d = validateDueDate()
  const a = validateAssignee()
  return t && d && a
}

// ── Tag management ──────────────────────────────────────────────────
function addTag(): void {
  const tag = tagInput.value.trim().replace(/,$/, '')
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(index: number): void {
  form.tags.splice(index, 1)
}

// ── Submit ──────────────────────────────────────────────────────────
function handleSubmit(): void {
  if (!validate()) return

  const formData: TaskFormData = {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    dueDate: form.dueDate,
    assignee: form.assignee.trim(),
    status: form.status,
    tags: [...form.tags],
  }

  if (isEditing.value && props.task) {
    props.manager.updateTask(props.task.id, formData)
  } else {
    props.manager.createTask(formData)
  }

  emit('saved')
}
</script>
