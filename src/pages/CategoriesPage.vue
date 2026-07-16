<script setup>
import { useRouter } from 'vue-router'
import { appState } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()

const categories = [
  { id: 'Electronics', icon: '💻', label: 'Electronics', count: 142, color: '#dbeafe' },
  { id: 'Books', icon: '📚', label: 'Books', count: 89, color: '#fef3c7' },
  { id: 'Fashion', icon: '👕', label: 'Fashion', count: 67, color: '#fce7f3' },
  { id: 'Stationery', icon: '✏️', label: 'Stationery', count: 54, color: '#f0fdf4' },
  { id: 'Accessories', icon: '🎒', label: 'Accessories', count: 38, color: '#ede9fe' },
  { id: 'Housing', icon: '🏠', label: 'Housing', count: 29, color: '#fff7ed' },
  { id: 'Sports', icon: '⚽', label: 'Sports', count: 21, color: '#f0fdf4' },
  { id: 'Food', icon: '🍜', label: 'Food & Drink', count: 15, color: '#fef9c3' },
]

function goToCategory(id) {
  appState.selectedCategory = id
  router.push('/products')
}
</script>

<template>
  <div>
    <AppTopBar title="Categories" :show-search="false" />
    <div class="cat-page">
      <div class="cat-header">
        <h1 class="page-title">Browse Categories</h1>
        <p class="page-subtitle">{{ appState.products.length }} listings across {{ categories.length }} categories</p>
      </div>

      <div class="cat-grid">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-card"
          :style="{ background: cat.color }"
          @click="goToCategory(cat.id)"
          :id="`category-card-${cat.id}`"
        >
          <div class="cat-card-icon">{{ cat.icon }}</div>
          <div class="cat-card-label">{{ cat.label }}</div>
          <div class="cat-card-count">{{ cat.count }} items</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat-page { padding: 0 28px 28px; }
.cat-header { padding: 24px 0 20px; }
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 20px;
  border-radius: var(--radius-xl);
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.cat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.cat-card-icon { font-size: 40px; }
.cat-card-label { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.cat-card-count { font-size: 12px; color: var(--text-secondary); }

@media (max-width: 768px) {
  .cat-page { padding: 0 16px 16px; }
  .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .cat-card { padding: 20px 12px; }
}
</style>
