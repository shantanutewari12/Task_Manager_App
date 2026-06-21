<template>
  <div class="view-toggle">
    <button
      class="view-toggle-btn"
      :class="{ 'view-toggle-btn--active': manager.viewState.view === 'kanban' }"
      id="btn-view-kanban"
      @click="manager.setView('kanban')"
      title="Kanban Board"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="4" height="14" rx="1" fill="currentColor" opacity=".9"/>
        <rect x="6" y="1" width="4" height="14" rx="1" fill="currentColor" opacity=".9"/>
        <rect x="11" y="1" width="4" height="14" rx="1" fill="currentColor" opacity=".9"/>
      </svg>
      Board
    </button>
    <button
      class="view-toggle-btn"
      :class="{ 'view-toggle-btn--active': manager.viewState.view === 'list' }"
      id="btn-view-list"
      @click="manager.setView('list')"
      title="List View"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor"/>
        <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
        <rect x="1" y="12" width="14" height="2" rx="1" fill="currentColor"/>
      </svg>
      List
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ViewToggleProps } from '../../BLL/taskManager/types'

// ── Props ──────────────────────────────────────────────────────────
defineProps<ViewToggleProps>()
</script>
