<script setup>
import { ref, computed } from 'vue'
import { appState, myProducts, addProduct, deleteProduct } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const showForm = ref(false)
const form = ref({ title: '', price: '', category: '', description: '', condition: 'Good' })
const categories = ['Electronics', 'Books', 'Fashion', 'Stationery', 'Accessories', 'Housing', 'Sports']
const conditions = ['Like New', 'Good', 'Fair']
const activeTab = ref('All')

const filteredProducts = computed(() => {
  if (activeTab.value === 'All') return myProducts.value
  return myProducts.value.filter(p => p.condition === activeTab.value)
})

const CATEGORY_ICONS = { Electronics: '💻', Books: '📚', Fashion: '👕', Accessories: '🎒', Stationery: '✏️', Housing: '🏠', Sports: '⚽', default: '📦' }

function handleSubmit() {
  if (!form.value.title || !form.value.price) return
  addProduct({
    title: form.value.title,
    price: Number(form.value.price),
    category: form.value.category || 'Electronics',
    description: form.value.description,
    condition: form.value.condition,
    images: [],
    tags: [],
    meetingLocations: ['Bar Mei (Cafeteria 1)'],
    faculty: appState.currentUser?.faculty,
    verified: true,
  })
  form.value = { title: '', price: '', category: '', description: '', condition: 'Good' }
  showForm.value = false
}
</script>

<template>
  <div>
    <AppTopBar :show-search="false" />
    <div class="manage-page">

      <!-- Add Form / Header -->
      <div class="manage-layout" v-if="!showForm">
        <!-- Header -->
        <div class="manage-header">
          <div>
            <h1 class="page-title">ลงขายสินค้า</h1>
            <p class="page-subtitle">Create a new listing for your fellow KU students to see.</p>
          </div>
          <button class="btn btn-primary" @click="showForm = true" id="new-listing-btn">+ New Listing</button>
        </div>

        <!-- Tabs -->
        <div class="manage-tabs">
          <button v-for="tab in ['All', 'Like New', 'Good', 'Fair']" :key="tab"
            class="manage-tab" :class="{ active: activeTab === tab }"
            @click="activeTab = tab" :id="`tab-manage-${tab}`">
            {{ tab }} <span class="tab-count">({{ tab === 'All' ? myProducts.length : myProducts.filter(p => p.condition === tab).length }})</span>
          </button>
        </div>

        <!-- Products Table -->
        <div class="empty-state" v-if="filteredProducts.length === 0">
          <div class="empty-icon">📦</div>
          <div class="empty-title">ยังไม่มีสินค้า</div>
          <button class="btn btn-primary" @click="showForm = true" id="post-first-btn">+ Post your first listing</button>
        </div>

        <div class="products-list" v-else>
          <div class="product-row card" v-for="p in filteredProducts" :key="p.id">
            <div class="product-row-icon">{{ CATEGORY_ICONS[p.category] || '📦' }}</div>
            <div class="product-row-info">
              <div class="product-row-title">{{ p.title }}</div>
              <div class="product-row-meta">
                <span class="badge badge-gray">{{ p.condition }}</span>
                <span class="badge badge-green">{{ p.category }}</span>
                <span class="meta-stat">👁 {{ p.views }}</span>
                <span class="meta-stat">♡ {{ p.favorites }}</span>
              </div>
            </div>
            <div class="product-row-price">฿{{ p.price.toLocaleString('th-TH') }}</div>
            <div class="product-row-actions">
              <button class="btn btn-outline btn-sm" :id="`edit-${p.id}`">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteProduct(p.id)" :id="`delete-${p.id}`">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Product Form -->
      <div class="add-form-layout" v-else>
        <div class="form-back">
          <button class="btn btn-ghost btn-sm" @click="showForm = false" id="back-to-listings">← Back to Listings</button>
          <h1 class="page-title">ลงขายสินค้า</h1>
          <p class="page-subtitle">Create a new listing for your fellow KU students to see.</p>
        </div>

        <div class="add-form-grid">
          <!-- Photo Upload -->
          <div class="photo-section card card-pad">
            <h3 class="form-label" style="margin-bottom: 12px;">Upload Photos</h3>
            <div class="photo-main-drop">
              <div class="photo-icon">📷</div>
              <div class="photo-main-label">Main Product Photo</div>
              <div class="photo-sub">Recommended: 1000x1000px</div>
            </div>
            <div class="photo-thumbs">
              <div class="photo-thumb">+</div>
              <div class="photo-thumb">+</div>
              <div class="photo-thumb">+</div>
              <div class="photo-thumb">+</div>
            </div>

            <div class="safety-tip">
              <span>🟢</span>
              <div>
                <div class="tip-title">Campus Safety Tip</div>
                <div class="tip-desc">Always meet in designated safe zones like Bar Mei, the Central Library, or well-lit areas near student dorms for transactions.</div>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="form-fields">
            <div class="form-group">
              <label class="form-label" for="item-name">Item Name</label>
              <input id="item-name" v-model="form.title" class="form-input" placeholder="e.g. Kasetsart Engineering Textbooks Year 1" />
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="item-price">Price (฿)</label>
                <input id="item-price" v-model="form.price" class="form-input" type="number" placeholder="฿ 0.00" />
              </div>
              <div class="form-group">
                <label class="form-label" for="item-cat">Category</label>
                <select id="item-cat" v-model="form.category" class="form-select">
                  <option value="">Select Category</option>
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="item-condition">Condition</label>
              <div class="condition-tabs">
                <button v-for="c in conditions" :key="c" type="button"
                  class="cond-tab" :class="{ active: form.condition === c }"
                  @click="form.condition = c" :id="`cond-${c}`">{{ c }}</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="item-desc">Description</label>
              <textarea id="item-desc" v-model="form.description" class="form-textarea" placeholder="Tell us more about the item's condition, usage, and where you can meet..."></textarea>
            </div>
            <div class="form-group visibility-row">
              <div>
                <label class="form-label">Visibility</label>
                <p class="visibility-sub">Only KU-verified students can view</p>
              </div>
              <div class="toggle-wrap">
                <div class="toggle active"></div>
              </div>
            </div>
            <button class="btn btn-primary btn-lg" @click="handleSubmit" id="post-for-sale-btn">Post for Sale ▶</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-page { padding: 20px 28px 40px; }
.manage-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.manage-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
.manage-tab { padding: 10px 16px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
.manage-tab.active { color: var(--green-700); border-bottom-color: var(--green-600); font-weight: 700; }
.tab-count { color: var(--text-muted); }

.products-list { display: flex; flex-direction: column; gap: 10px; }
.product-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; }
.product-row-icon { font-size: 2rem; width: 48px; height: 48px; background: var(--bg-page); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.product-row-info { flex: 1; min-width: 0; }
.product-row-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.product-row-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.meta-stat { font-size: 11px; color: var(--text-muted); }
.product-row-price { font-size: 16px; font-weight: 700; white-space: nowrap; }
.product-row-actions { display: flex; gap: 8px; flex-shrink: 0; }

/* Add Form */
.form-back { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
.add-form-grid { display: grid; grid-template-columns: 360px 1fr; gap: 24px; }
.photo-main-drop { border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 40px 20px; text-align: center; background: var(--bg-page); cursor: pointer; transition: border-color 0.15s; margin-bottom: 12px; }
.photo-main-drop:hover { border-color: var(--green-400); }
.photo-icon { font-size: 36px; margin-bottom: 8px; }
.photo-main-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.photo-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.photo-thumbs { display: flex; gap: 8px; margin-bottom: 16px; }
.photo-thumb { flex: 1; aspect-ratio: 1; border: 2px dashed var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.photo-thumb:hover { border-color: var(--green-400); color: var(--green-600); }
.safety-tip { display: flex; gap: 10px; background: var(--green-50); border: 1px solid var(--green-200); border-radius: var(--radius-md); padding: 12px; font-size: 12px; }
.tip-title { font-weight: 700; color: var(--green-700); margin-bottom: 4px; }
.tip-desc { color: var(--text-secondary); line-height: 1.5; }

.form-fields { display: flex; flex-direction: column; gap: 16px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.condition-tabs { display: flex; gap: 8px; }
.cond-tab { padding: 7px 16px; border: 2px solid var(--border); border-radius: var(--radius-full); font-size: 13px; font-weight: 600; background: #fff; cursor: pointer; transition: all 0.15s; color: var(--text-secondary); }
.cond-tab.active { border-color: var(--green-600); background: var(--green-50); color: var(--green-700); }
.visibility-row { flex-direction: row; align-items: center; justify-content: space-between; }
.visibility-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.toggle-wrap { padding: 4px; }
.toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--border); position: relative; cursor: pointer; transition: background 0.2s; }
.toggle.active { background: var(--green-600); }
.toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.toggle.active::after { transform: translateX(20px); }

@media (max-width: 768px) {
  .manage-page { padding: 16px; }
  .add-form-grid { grid-template-columns: 1fr; }
}
</style>
