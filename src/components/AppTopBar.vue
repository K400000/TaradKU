<script setup>
import { useRoute } from 'vue-router'
import { appState, cartCount, unreadCount } from '../stores/app.js'
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
  showSearch: { type: Boolean, default: true },
})
const route = useRoute()
</script>

<template>
  <header class="topbar">
    <div class="search-wrap" v-if="showSearch">
      <span class="search-icon">🔍</span>
      <input
        v-model="appState.searchQuery"
        class="search-input"
        type="text"
        placeholder="Search textbooks, gadgets, gear..."
        id="global-search"
      />
    </div>
    <h1 v-else class="topbar-title">{{ title }}</h1>
    <div class="topbar-actions">
      <RouterLink to="/cart" class="topbar-icon-btn" v-if="appState.currentUser?.role !== 'seller'">
        <span>🛒</span>
        <span v-if="cartCount > 0" class="topbar-badge">{{ cartCount }}</span>
      </RouterLink>
      <RouterLink to="/profile" class="topbar-icon-btn">
        <div class="avatar avatar-sm" :style="{ background: appState.currentUser?.avatarColor || '#15803d' }">
          {{ appState.currentUser?.avatar || 'U' }}
        </div>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar-title {
  font-size: 17px;
  font-weight: 700;
  flex: 1;
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.topbar-icon-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg-page);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  text-decoration: none;
  position: relative;
  transition: background 0.15s;
}
.topbar-icon-btn:hover { background: var(--border-light); }
.topbar-badge {
  position: absolute;
  top: -4px; right: -4px;
  background: #dc2626;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}
</style>
