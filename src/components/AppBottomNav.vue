<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { appState, cartCount, unreadCount } from '../stores/app.js'

const route = useRoute()
const tabs = computed(() => [
  { path: '/home', icon: 'bi-house', label: 'Home' },
  { path: '/products', icon: 'bi-search', label: 'Browse' },
  { path: '/seller/products', icon: 'bi-shop', label: 'Sell' },
  { path: '/messages', icon: 'bi-chat-dots', label: 'Chat', badge: unreadCount.value },
  { path: '/profile', icon: 'bi-person-circle', label: 'Profile' },
])
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ 'tab-active': route.path === tab.path || (tab.path !== '/home' && route.path.startsWith(tab.path)) }"
    >
      <div class="tab-icon-wrap">
        <i :class="['bi', tab.icon, 'tab-icon']"></i>
        <span v-if="tab.badge && tab.badge > 0" class="tab-badge">{{ tab.badge }}</span>
      </div>
      <span class="tab-label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  justify-content: space-around;
  align-items: center;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  padding: 8px 4px;
  color: var(--text-muted);
  transition: color 0.15s;
  text-decoration: none;
}
.tab-active { color: var(--green-600); }
.tab-icon-wrap { position: relative; }
.tab-icon { font-size: 20px; display: block; }
.tab-badge {
  position: absolute;
  top: -4px; right: -8px;
  background: #dc2626;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}
.tab-label { font-size: 10px; font-weight: 500; }
</style>
