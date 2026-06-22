<template>
  <div class="coming-soon-container">
    <div class="coming-soon-card">
      <!-- Glow effect background -->
      <div class="glowing-bg"></div>

      <!-- Icon representation -->
      <div class="coming-soon-icon-wrapper">
        <svg v-if="pageName === 'inbox'" class="coming-soon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <svg v-else-if="pageName === 'docs'" class="coming-soon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <svg v-else-if="pageName === 'meeting'" class="coming-soon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7z" />
          <path d="M1 9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9z" />
          <path d="M15 12h-4" />
        </svg>
        <svg v-else-if="pageName === 'settings'" class="coming-soon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <svg v-else class="coming-soon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div class="coming-soon-badge">Coming Soon</div>
      <h2 class="coming-soon-title">{{ formattedPageName }}</h2>
      <p class="coming-soon-description">
        We are building a powerful, integrated {{ pageName }} space for your workspace.
        This feature will allow team members to seamlessly interact and align on deliverables.
      </p>

      <!-- Mock interaction: Notify Me -->
      <div class="coming-soon-notify">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="submitted" class="notify-success">
            <span class="success-icon">✨</span>
            <p>You're on the list! We'll notify you as soon as this space is live.</p>
          </div>
          <form v-else @submit.prevent="submitForm" class="notify-form">
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email for early access"
              class="notify-input"
              required
            />
            <button type="submit" class="btn btn--accent notify-btn">
              Notify Me
            </button>
          </form>
        </Transition>
      </div>

      <!-- Feature Sneak Peek -->
      <div class="sneak-peek">
        <div class="sneak-peek-title">Sneak Peek Features</div>
        <div class="sneak-peek-grid">
          <div class="sneak-peek-item">
            <span class="peek-dot"></span>
            <span>Real-time Syncing</span>
          </div>
          <div class="sneak-peek-item">
            <span class="peek-dot"></span>
            <span>Rich Templates</span>
          </div>
          <div class="sneak-peek-item">
            <span class="peek-dot"></span>
            <span>AI Summarization</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComingSoonProps } from '../../BLL/taskManager/types'

const props = defineProps<ComingSoonProps>()

const email = ref<string>('')
const submitted = ref<boolean>(false)

const formattedPageName = computed<string>(() => {
  const mapping: Record<string, string> = {
    inbox: 'Team Inbox',
    docs: 'Document Workspace',
    meeting: 'Video Meetings',
    settings: 'Workspace Settings',
    support: 'Support & Guides',
  }
  return mapping[props.pageName] ?? 'New Feature'
})

function submitForm(): void {
  if (email.value.trim()) {
    submitted.value = true
    email.value = ''
  }
}
</script>

<style scoped>
.coming-soon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: var(--space-8);
  font-family: var(--font-family);
}

.coming-soon-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.glowing-bg {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
  pointer-events: none;
  filter: blur(10px);
}

.coming-soon-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  background: var(--color-accent-light);
  color: var(--color-accent);
  margin-bottom: var(--space-5);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.15);
}

.coming-soon-svg {
  width: 36px;
  height: 36px;
}

.coming-soon-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-3);
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.coming-soon-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  letter-spacing: -0.5px;
}

.coming-soon-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

/* Notify Form */
.coming-soon-notify {
  margin-bottom: var(--space-8);
  min-height: 44px;
}

.notify-form {
  display: flex;
  gap: var(--space-2);
  background: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}

.notify-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-2) var(--space-3);
  font-size: 13px;
  color: var(--color-text-primary);
  outline: none;
}

.notify-input::placeholder {
  color: var(--color-text-muted);
}

.notify-btn {
  font-size: 13px;
  font-weight: 500;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  white-space: nowrap;
}

.notify-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
}

.success-icon {
  font-size: 20px;
  animation: pulse-sparkle 1.5s infinite ease-in-out;
}

.notify-success p {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-success);
}

/* Sneak Peek */
.sneak-peek {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
  text-align: left;
}

.sneak-peek-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-3);
}

.sneak-peek-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.sneak-peek-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.peek-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
}

/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes pulse-sparkle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
