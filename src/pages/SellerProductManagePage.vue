<script setup>
import { ref, computed } from 'vue'
import { appState, myProducts, sellerOrders, addProduct, deleteProduct } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const showForm = ref(false)
const form = ref({ title: '', price: '', category: '', description: '', condition: 'Good' })
const categories = ['Electronics', 'Books', 'Fashion', 'Stationery', 'Accessories', 'Housing', 'Sports']
const conditions = ['Like New', 'Good', 'Fair']
const activeTab = ref('All')

const CATEGORY_ICONS = { Electronics: 'bi-cpu', Books: 'bi-book', Fashion: 'bi-bag', Accessories: 'bi-backpack', Stationery: 'bi-pencil', Housing: 'bi-house', Sports: 'bi-trophy', default: 'bi-box-seam' }

const activeListings = computed(() => myProducts.value.length)
const pendingOrders = computed(() => sellerOrders.value.filter(o => o.status === 'pending').length)
const grossRevenue = computed(() => sellerOrders.value.reduce((s, o) => s + o.totalAmount, 0))
const commissionFee = computed(() => Math.round(grossRevenue.value * 0.035))
const netRevenue = computed(() => grossRevenue.value - commissionFee.value)

const statCards = computed(() => [
  { icon: 'bi-box-seam', label: 'Active Listings', val: activeListings.value, cls: '' },
  { icon: 'bi-bag-check', label: 'Total Orders', val: sellerOrders.value.length, cls: '' },
  { icon: 'bi-currency-dollar', label: 'Gross Revenue', val: `฿${grossRevenue.value.toLocaleString('th-TH')}`, cls: '' },
  { icon: 'bi-wallet2', label: 'Net Earnings (หัก 3.5%)', val: `฿${netRevenue.value.toLocaleString('th-TH')}`, cls: 'green' },
])

const filteredProducts = computed(() => {
  if (activeTab.value === 'All') return myProducts.value
  return myProducts.value.filter(p => p.condition === activeTab.value)
})

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

      <!-- Listing Table View -->
      <div class="manage-layout" v-if="!showForm">
        <!-- Seller Dashboard Header Section -->
        <div class="seller-dash-summary">
          <div class="dash-top-row">
            <div>
              <h2 class="dash-title"><i class="bi bi-speedometer2 text-green me-2"></i>Dashboard ร้านค้า (Seller Overview)</h2>
              <p class="dash-subtitle">สรุปยอดขายและสถานะรายการสินค้าที่ลงขายทั้งหมดของคุณ</p>
            </div>
            <div class="dash-quick-links">
              <RouterLink to="/seller/orders" class="btn btn-outline btn-sm"><i class="bi bi-bag-check me-1"></i> ออเดอร์ลูกค้า ({{ sellerOrders.length }})</RouterLink>
              <RouterLink to="/seller/promotions" class="btn btn-outline btn-sm"><i class="bi bi-gift me-1"></i> โปรโมชั่น</RouterLink>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card card card-pad" v-for="s in statCards" :key="s.label">
              <div class="stat-icon-wrap"><i :class="['bi', s.icon, 'stat-icon']"></i></div>
              <div class="stat-val" :class="s.cls">{{ s.val }}</div>
              <div class="stat-lbl">{{ s.label }}</div>
            </div>
          </div>

          <div class="commission-info-banner mt-3">
            <span class="badge badge-green-light"><i class="bi bi-info-circle-fill me-1"></i> ระบบ Commission 3.5%</span>
            <span class="text-xs text-secondary ms-2">ทางระบบ TaradKU ไม่เก็บค่าธรรมเนียมลงขายหรือค่าสมาชิกรายเดือน โดยจะคิดค่าบริการ Commission 3.5% จากยอดขายเฉพาะเมื่อมีการสั่งซื้อและส่งมอบสินค้าสำเร็จเท่านั้น (Platform Fee 3.5%)</span>
          </div>
          <hr class="dash-divider" />
        </div>

        <div class="manage-header">
          <div>
            <h1 class="page-title">ลงขายสินค้า</h1>
            <p class="page-subtitle">Manage your listings on TaradKU.</p>
          </div>
          <button class="btn btn-primary" @click="showForm = true" id="new-listing-btn">
            <i class="bi bi-plus-circle"></i> New Listing
          </button>
        </div>

        <div class="manage-tabs">
          <button v-for="tab in ['All', 'Like New', 'Good', 'Fair']" :key="tab"
            class="manage-tab" :class="{ active: activeTab === tab }"
            @click="activeTab = tab" :id="`tab-manage-${tab}`">
            {{ tab }} <span class="tab-count">({{ tab === 'All' ? myProducts.length : myProducts.filter(p => p.condition === tab).length }})</span>
          </button>
        </div>

        <div class="empty-state" v-if="filteredProducts.length === 0">
          <i class="bi bi-box-seam empty-icon"></i>
          <div class="empty-title">ยังไม่มีสินค้า</div>
          <button class="btn btn-primary" @click="showForm = true" id="post-first-btn">
            <i class="bi bi-plus-circle"></i> Post your first listing
          </button>
        </div>

        <div class="products-list" v-else>
          <div class="product-row card" v-for="p in filteredProducts" :key="p.id">
            <!-- Mockup Image -->
            <div class="product-row-img">
              <i :class="['bi', CATEGORY_ICONS[p.category] || 'bi-box-seam']"></i>
            </div>
            <div class="product-row-info">
              <div class="product-row-title">{{ p.title }}</div>
              <div class="product-row-meta">
                <span class="badge badge-gray">{{ p.condition }}</span>
                <span class="badge badge-green">{{ p.category }}</span>
                <span class="meta-stat"><i class="bi bi-eye"></i> {{ p.views }}</span>
                <span class="meta-stat"><i class="bi bi-heart"></i> {{ p.favorites }}</span>
              </div>
            </div>
            <div class="product-row-price">฿{{ p.price.toLocaleString('th-TH') }}</div>
            <div class="product-row-actions">
              <button class="btn btn-outline btn-sm" :id="`edit-${p.id}`">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteProduct(p.id)" :id="`delete-${p.id}`">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Product Form -->
      <div class="add-form-layout" v-else>
        <div class="form-back">
          <button class="btn btn-ghost btn-sm" @click="showForm = false" id="back-to-listings">
            <i class="bi bi-arrow-left"></i> Back to Listings
          </button>
          <h1 class="page-title">ลงขายสินค้า</h1>
          <p class="page-subtitle">Create a new listing for your fellow KU students.</p>
        </div>

        <div class="add-form-grid">
          <!-- Photo Upload -->
          <div class="photo-section card card-pad">
            <h3 class="form-label" style="margin-bottom: 12px; font-size: 14px; font-weight: 700;">Upload Photos</h3>
            <div class="photo-main-drop">
              <i class="bi bi-camera photo-drop-icon"></i>
              <div class="photo-main-label">Main Product Photo</div>
              <div class="photo-sub">Click to upload or drag & drop</div>
              <div class="photo-sub">Recommended: 1000x1000px</div>
            </div>
            <div class="photo-thumbs">
              <div class="photo-thumb"><i class="bi bi-plus-lg"></i></div>
              <div class="photo-thumb"><i class="bi bi-plus-lg"></i></div>
              <div class="photo-thumb"><i class="bi bi-plus-lg"></i></div>
              <div class="photo-thumb"><i class="bi bi-plus-lg"></i></div>
            </div>

            <div class="safety-tip">
              <i class="bi bi-shield-check tip-check"></i>
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
                <div class="input-icon-wrap">
                  <i class="bi bi-currency-dollar input-icon"></i>
                  <input id="item-price" v-model="form.price" class="form-input input-with-icon" type="number" placeholder="0.00" />
                </div>
                <div v-if="form.price && Number(form.price) > 0" class="fee-calc-box mt-2">
                  <div class="fee-row text-xs text-secondary"><span>ราคาขายสินค้า:</span> <span>฿{{ Number(form.price).toLocaleString('th-TH') }}</span></div>
                  <div class="fee-row text-xs text-danger"><span>ค่าธรรมเนียมระบบ Commission (3.5%):</span> <span>-฿{{ Math.round(Number(form.price) * 0.035).toLocaleString('th-TH') }}</span></div>
                  <hr style="margin: 4px 0; border-color: var(--border);" />
                  <div class="fee-row text-xs font-bold text-green"><span>ยอดเงินที่จะได้รับสุทธิ (Net Earnings):</span> <span>฿{{ (Number(form.price) - Math.round(Number(form.price) * 0.035)).toLocaleString('th-TH') }}</span></div>
                </div>
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
              <label class="form-label">Condition</label>
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
                <label class="form-label">
                  <i class="bi bi-lock-fill text-green"></i> Visibility
                </label>
                <p class="visibility-sub">Only KU-verified students can view</p>
              </div>
              <div class="toggle active"></div>
            </div>
            <button class="btn btn-primary btn-lg" @click="handleSubmit" id="post-for-sale-btn">
              <i class="bi bi-upload"></i> Post for Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-page { padding: 20px 28px 40px; }
.dash-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.dash-title { font-size: 18px; font-weight: 800; color: var(--text-primary); }
.dash-subtitle { font-size: 13px; color: var(--text-secondary); }
.dash-quick-links { display: flex; gap: 8px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.stat-card { text-align: center; }
.stat-icon-wrap { margin-bottom: 8px; }
.stat-icon { font-size: 24px; color: var(--green-500); }
.stat-val { font-size: 24px; font-weight: 800; color: var(--text-primary); }
.stat-val.pending { color: #f59e0b; }
.stat-val.green { color: var(--green-600); font-size: 20px; }
.stat-lbl { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.dash-divider { border: 0; border-top: 1px solid var(--border); margin: 24px 0; }

.manage-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.manage-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
.manage-tab { padding: 10px 16px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
.manage-tab.active { color: var(--green-700); border-bottom-color: var(--green-600); font-weight: 700; }
.tab-count { color: var(--text-muted); }

.products-list { display: flex; flex-direction: column; gap: 10px; }
.product-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; }
.product-row-img { width: 52px; height: 52px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #d1d5db; flex-shrink: 0; }
.product-row-info { flex: 1; min-width: 0; }
.product-row-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.product-row-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.meta-stat { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 3px; }
.product-row-price { font-size: 16px; font-weight: 700; white-space: nowrap; }
.product-row-actions { display: flex; gap: 8px; flex-shrink: 0; }

/* Add Form */
.form-back { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
.add-form-grid { display: grid; grid-template-columns: 340px 1fr; gap: 24px; }
.photo-main-drop { border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 36px 20px; text-align: center; background: #fafafa; cursor: pointer; transition: border-color 0.15s; margin-bottom: 12px; }
.photo-main-drop:hover { border-color: var(--green-400); background: var(--green-50); }
.photo-drop-icon { font-size: 36px; color: #d1d5db; display: block; margin-bottom: 8px; }
.photo-main-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.photo-sub { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
.photo-thumbs { display: flex; gap: 8px; margin-bottom: 16px; }
.photo-thumb { flex: 1; aspect-ratio: 1; border: 2px dashed var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--text-muted); cursor: pointer; transition: all 0.15s; background: #fafafa; }
.photo-thumb:hover { border-color: var(--green-400); color: var(--green-600); background: var(--green-50); }
.safety-tip { display: flex; gap: 10px; background: var(--green-50); border: 1px solid var(--green-200); border-radius: var(--radius-md); padding: 12px; font-size: 12px; align-items: flex-start; }
.tip-check { color: var(--green-600); font-size: 16px; flex-shrink: 0; }
.tip-title { font-weight: 700; color: var(--green-700); margin-bottom: 4px; }
.tip-desc { color: var(--text-secondary); line-height: 1.5; }

.form-fields { display: flex; flex-direction: column; gap: 16px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; pointer-events: none; }
.input-with-icon { padding-left: 36px; }
.condition-tabs { display: flex; gap: 8px; }
.cond-tab { padding: 7px 16px; border: 2px solid var(--border); border-radius: var(--radius-full); font-size: 13px; font-weight: 600; background: #fff; cursor: pointer; transition: all 0.15s; color: var(--text-secondary); }
.cond-tab.active { border-color: var(--green-600); background: var(--green-50); color: var(--green-700); }
.visibility-row { flex-direction: row !important; align-items: center !important; justify-content: space-between; }
.visibility-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--border); position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.toggle.active { background: var(--green-600); }
.toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.toggle.active::after { transform: translateX(20px); }

.commission-info-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.badge-green-light { background: #dcfce7; color: #166534; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
.fee-calc-box {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 10px;
}
.fee-row { display: flex; justify-content: space-between; align-items: center; margin: 2px 0; }
.text-danger { color: #dc2626; font-weight: 600; }
.font-bold { font-weight: 700; }

@media (max-width: 768px) {
  .manage-page { padding: 16px; }
  .add-form-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
