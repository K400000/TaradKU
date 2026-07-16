<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { appState } from './stores/app.js'
import AppSidebar from './components/AppSidebar.vue'
import AppBottomNav from './components/AppBottomNav.vue'

const route = useRoute()
const isPublicPage = computed(() => route.meta?.public)
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar (only when logged in) -->
    <AppSidebar v-if="appState.isLoggedIn && !isPublicPage" />

    <!-- Main Content -->
    <main :class="['app-main', { 'full-width': !appState.isLoggedIn || isPublicPage }]">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Bottom Nav (Mobile) -->
    <AppBottomNav v-if="appState.isLoggedIn && !isPublicPage" />
  </div>
</template>

<style>
.full-width {
  margin-left: 0 !important;
}
</style>
