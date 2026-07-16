<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

const search = ref(appState.searchQuery || '')
const selectedCategory = ref(appState.selectedCategory || 'All')
const selectedCondition = ref('All')
const priceMin = ref('')
const priceMax = ref('')
const sortBy = ref('Newest')

const categories = ['All', 'Electronics', 'Books', 'Fashion', 'Stationery', 'Accessories', 'Housing', 'Sports']
const conditions = ['All', 'Like New', 'Good', 'Fair']
const sortOptions = ['Newest', 'Price: Low → High', 'Price: High → Low', 'Most Popular']

const filteredProducts = computed(() => {
  let list = [...appState.products]

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    )
  }
  if (selectedCategory.value !== 'All') list = list.filter(p => p.category === selectedCategory.value)
  if (selectedCondition.value !== 'All') list = list.filter(p => p.condition === selectedCondition.value)
  if (priceMin.value) list = list.filter(p => p.price >= Number(priceMin.value))
  if (priceMax.value) list = list.filter(p => p.price <= Number(priceMax.value))

  switch (sortBy.value) {
    case 'Price: Low → High': list.sort((a, b) => a.price - b.price); break
    case 'Price: High → Low': list.sort((a, b) => b.price - a.price); break
    case 'Most Popular': list.sort((a, b) => b.views - a.views); break
    default: list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  }
  return list
})

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'All'
  selectedCondition.value = 'All'
  priceMin.value = ''
  priceMax.value = ''
  sortBy.value = 'Newest'
}
</script>

<template>
  <div>
    <AppTopBar />
    <div class="list-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <RouterLink to="/home">Home</RouterLink>
        <span>›</span>
        <span>{{ selectedCategory !== 'All' ? selectedCategory : 'All Products' }}</span>
      </div>

      <div class="list-layout">
        <!-- Sidebar Filters -->
        <aside class="filter-panel">
          <div class="filter-header">
            <h3>Filters</h3>
            <button class="btn btn-ghost btn-sm" @click="clearFilters" id="clear-filters-btn">Clear All</button>
          </div>

          <!-- Search -->
          <div class="filter-section">
            <label class="filter-label">Search</label>
            <div class="search-wrap" style="max-width: none;">
              <span class="search-icon">🔍</span>
              <input v-model="search" class="search-input" type="text" placeholder="Search..." id="product-search" />
            </div>
          </div>

          <!-- Category -->
          <div class="filter-section">
            <label class="filter-label">Category</label>
            <div class="filter-options">
              <button
                v-for="cat in categories"
                :key="cat"
                class="filter-opt"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
                :id="`filter-cat-${cat}`"
              >{{ cat }}</button>
            </div>
          </div>

          <!-- Condition -->
          <div class="filter-section">
            <label class="filter-label">Condition</label>
            <div class="filter-options">
              <button
                v-for="c in conditions"
                :key="c"
                class="filter-opt"
                :class="{ active: selectedCondition === c }"
                @click="selectedCondition = c"
                :id="`filter-cond-${c}`"
              >{{ c }}</button>
            </div>
          </div>

          <!-- Price Range -->
          <div class="filter-section">
            <label class="filter-label">Price Range (฿)</label>
            <div class="price-inputs">
              <input v-model="priceMin" class="form-input" type="number" placeholder="Min" id="price-min" />
              <span>—</span>
              <input v-model="priceMax" class="form-input" type="number" placeholder="Max" id="price-max" />
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="list-main">
          <div class="list-top-bar">
            <span class="result-count">{{ filteredProducts.length }} results</span>
            <div class="sort-bar">
              <label class="sort-label">Sort:</label>
              <select v-model="sortBy" class="form-select" style="width: auto;" id="sort-select-list">
                <option v-for="s in sortOptions" :key="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="products-grid" v-if="filteredProducts.length > 0">
            <ProductCard v-for="p in filteredProducts" :key="p.id" :product="p" />
          </div>
          <div class="empty-state" v-else>
            <div class="empty-icon">🔍</div>
            <div class="empty-title">ไม่พบสินค้า</div>
            <div class="empty-desc">ลองปรับ filter หรือค้นหาด้วยคำอื่น</div>
            <button class="btn btn-outline" @click="clearFilters" id="clear-filters-empty">Clear Filters</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page { padding: 0 28px 28px; }
.breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-secondary);
  padding: 14px 0;
}
.breadcrumb a { color: var(--green-600); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }

.list-layout { display: flex; gap: 24px; align-items: flex-start; }

.filter-panel {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  position: sticky;
  top: calc(var(--nav-height) + 12px);
}
.filter-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.filter-header h3 { font-size: 15px; font-weight: 700; }
.filter-section { margin-bottom: 20px; }
.filter-label { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
.filter-options { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-opt {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  border: 1.5px solid var(--border);
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-secondary);
}
.filter-opt:hover { border-color: var(--green-400); color: var(--green-700); }
.filter-opt.active { border-color: var(--green-600); background: var(--green-50); color: var(--green-700); font-weight: 600; }
.price-inputs { display: flex; align-items: center; gap: 8px; }
.price-inputs .form-input { padding: 8px 10px; }

.list-main { flex: 1; min-width: 0; }
.list-top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.result-count { font-size: 14px; color: var(--text-secondary); font-weight: 600; }
.sort-bar { display: flex; align-items: center; gap: 8px; }
.sort-label { font-size: 13px; color: var(--text-secondary); }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }

@media (max-width: 768px) {
  .list-page { padding: 0 16px 16px; }
  .list-layout { flex-direction: column; }
  .filter-panel { width: 100%; position: static; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}
</style>
