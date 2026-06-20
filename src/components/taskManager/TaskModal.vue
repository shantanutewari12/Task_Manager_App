<template>
  <Transition name="fade">
    <div v-if="show" class="overlay" @click.self="$emit('close')">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="isEditing ? 'Edit Task' : 'New Task'">
        <!-- Modal header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? 'Edit Task' : 'New Task' }}</h2>
          <button class="modal-close" id="btn-modal-close" @click="$emit('close')" aria-label="Close">✕</button>
        </div>

        <!-- Form -->
        <form class="modal-body" @submit.prevent="handleSubmit" novalidate>
          <!-- Title -->
          <div class="form-field" :class="{ 'form-field--error': errors.title }">
            <label class="form-label" for="field-title">Title <span class="required">*</span></label>
            <input
              id="field-title"
              v-model="form.title"
              class="form-input"
              type="text"
              placeholder="e.g. Implement OAuth flow"
              autocomplete="off"
              @blur="validateTitle"
            />
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <!-- Description -->
          <div class="form-field">
            <label class="form-label" for="field-description">Description</label>
            <textarea
              id="field-description"
              v-model="form.description"
              class="form-textarea"
              rows="3"
              placeholder="Describe what needs to be done..."
            ></textarea>
          </div>

          <!-- Row: priority + status -->
          <div class="form-row">
            <div class="form-field">
              <label class="form-label" for="field-priority">Priority</label>
              <select id="field-priority" v-model="form.priority" class="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div class="form-field">
              <label class="form-label" for="field-status">Status</label>
              <select id="field-status" v-model="form.status" class="form-select">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <!-- Row: due date + assignee -->
          <div class="form-row">
            <div class="form-field" :class="{ 'form-field--error': errors.dueDate }">
              <label class="form-label" for="field-due-date">Due Date <span class="required">*</span></label>
              <input
                id="field-due-date"
                v-model="form.dueDate"
                class="form-input"
                type="date"
                @blur="validateDueDate"
              />
              <span v-if="errors.dueDate" class="form-error">{{ errors.dueDate }}</span>
            </div>

            <div class="form-field" :class="{ 'form-field--error': errors.assignee }">
              <label class="form-label" for="field-assignee">Assignee <span class="required">*</span></label>
              <input
                id="field-assignee"
                v-model="form.assignee"
                class="form-input"
                type="text"
                placeholder="e.g. Sarah Chen"
                list="assignee-suggestions"
                @blur="validateAssignee"
              />
              <datalist id="assignee-suggestions">
                <option v-for="name in existingAssignees" :key="name" :value="name" ></option>
              </datalist>
              <span v-if="errors.assignee" class="form-error">{{ errors.assignee }}</span>
            </div>
          </div>

          <!-- Tags -->
          <div class="form-field">
            <label class="form-label" for="field-tags">Tags</label>
            <div class="tags-input-wrapper">
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
                class="tags-input"
                type="text"
                placeholder="Add tag, press Enter"
                @keydown.enter.prevent="addTag"
                @keydown.comma.prevent="addTag"
              />
            </div>
            <p class="form-hint">Press Enter or comma to add a tag</p>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn--ghost" id="btn-modal-cancel" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn--primary" id="btn-modal-save">
              {{ isEditing ? 'Save Changes' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { TaskManager } from '../../BLL/taskManager/TaskManager'
import type { Task, TaskFormData, ValidationErrors } from '../../BLL/taskManager/types'

// ── Props ──────────────────────────────────────────────────────────
interface Props {
  task: Task | null
  manager: TaskManager
}
const props = defineProps<Props>()

// ── Emits ──────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

// ── Show/mount ──────────────────────────────────────────────────────
const show = ref<boolean>(false)
// mount with nextTick delay for transition to work
import { nextTick } from 'vue'
nextTick(() => { show.value = true })

// ── Derived state ───────────────────────────────────────────────────
const isEditing = computed<boolean>(() => props.task !== null)
const existingAssignees = computed<string[]>(() => props.manager.getAssignees())

// ── Form state ──────────────────────────────────────────────────────
function buildInitialForm(): TaskFormData {
  if (props.task) {
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
  // Default for new task
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: tomorrow.toISOString().split('T')[0],
    assignee: '',
    status: 'todo',
    tags: [],
  }
}

const form = reactive<TaskFormData>(buildInitialForm())
const errors = reactive<ValidationErrors>({})
const tagInput = ref<string>('')

// Reset form if task prop changes
watch(() => props.task, () => {
  const fresh = buildInitialForm()
  Object.assign(form, fresh)
  errors.title = undefined
  errors.dueDate = undefined
  errors.assignee = undefined
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
  // Only validate "not in past" for NEW tasks
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
