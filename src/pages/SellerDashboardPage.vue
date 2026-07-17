<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, myProducts, sellerOrders } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'
import logoImg from '../assets/logo_branding.png'

const router = useRouter()
const activeListings = computed(() => myProducts.value.length)
const pendingOrders = computed(() => sellerOrders.value.filter(o => o.status === 'pending').length)
const grossRevenue = computed(() => sellerOrders.value.reduce((s, o) => s + o.totalAmount, 0))
const commissionFee = computed(() => Math.round(grossRevenue.value * 0.035))
const netRevenue = computed(() => grossRevenue.value - commissionFee.value)
const recentOrders = computed(() => sellerOrders.value.slice(0, 3))

const STATUS_ICONS = { pending: 'bi-hourglass-split', shipped: 'bi-truck', delivered: 'bi-check-circle-fill' }
const STATUS_LABELS = { pending: 'รอส่ง', shipped: 'กำลังส่ง', delivered: 'ส่งแล้ว' }

const statCards = computed(() => [
  { icon: 'bi-box-seam', label: 'Active Listings', val: activeListings.value, cls: '' },
  { icon: 'bi-bag-check', label: 'Total Orders', val: sellerOrders.value.length, cls: '' },
  { icon: 'bi-currency-dollar', label: 'Gross Revenue', val: `฿${grossRevenue.value.toLocaleString('th-TH')}`, cls: '' },
  { icon: 'bi-wallet2', label: 'Net Earnings (หัก 3.5%)', val: `฿${netRevenue.value.toLocaleString('th-TH')}`, cls: 'green' },
])
</script>

<template>
  <div>
    <AppTopBar title="Seller Dashboard" :show-search="false" />
    <div class="dash-page">
      <div class="dash-header">
        <div>
          <h1 class="page-title">Seller Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ appState.currentUser?.name }}!</p>
        </div>
        <RouterLink to="/seller/products" class="btn btn-primary" id="add-listing-btn">
          <i class="bi bi-plus-circle"></i> New Listing
        </RouterLink>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card card card-pad" v-for="s in statCards" :key="s.label">
          <div class="stat-icon-wrap"><i :class="['bi', s.icon, 'stat-icon']"></i></div>
          <div class="stat-val" :class="s.cls">{{ s.val }}</div>
          <div class="stat-lbl">{{ s.label }}</div>
        </div>
      </div>

      <div class="dash-grid">
        <!-- Order Summary -->
        <div class="dash-card card">
          <div class="dash-card-header">
            <h3><i class="bi bi-bag-check"></i> Recent Orders</h3>
            <RouterLink to="/seller/orders" class="view-all">View All <i class="bi bi-arrow-right"></i></RouterLink>
          </div>

          <div v-if="recentOrders.length === 0" class="empty-state" style="padding: 32px;">
            <i class="bi bi-inbox empty-icon"></i>
            <div class="empty-title">ยังไม่มีออเดอร์</div>
          </div>

          <div v-else>
            <div class="order-row" v-for="o in recentOrders" :key="o.id">
              <div class="order-row-left">
                <div class="order-num"><i class="bi bi-hash"></i>{{ o.id }}</div>
                <div class="order-items-preview">{{ o.items.map(i => i.title).join(', ').slice(0, 40) }}...</div>
                <div class="order-amount">฿{{ o.totalAmount.toLocaleString('th-TH') }}</div>
              </div>
              <span class="badge status-badge" :class="`status-${o.status}`">
                <i :class="['bi', STATUS_ICONS[o.status]]"></i>
                {{ STATUS_LABELS[o.status] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="quick-links card card-pad">
          <h3 style="margin-bottom: 16px; font-size: 14px; font-weight: 700;">Quick Actions</h3>
          <div class="quick-grid">
            <RouterLink to="/seller/products" class="quick-item" id="quick-products">
              <i class="bi bi-box-seam quick-icon"></i>
              <span>Products</span>
            </RouterLink>
            <RouterLink to="/seller/orders" class="quick-item" id="quick-orders">
              <i class="bi bi-bag-check quick-icon"></i>
              <span>Orders</span>
            </RouterLink>
            <RouterLink to="/seller/promotions" class="quick-item" id="quick-promos">
              <i class="bi bi-gift quick-icon"></i>
              <span>Promotions</span>
            </RouterLink>
            <RouterLink to="/messages" class="quick-item" id="quick-messages">
              <i class="bi bi-chat-dots quick-icon"></i>
              <span>Messages</span>
            </RouterLink>
          </div>

          <!-- Go Green Banner -->
          <div class="eco-banner">
            <i class="bi bi-leaf eco-icon"></i>
            <div>
              <div class="eco-title">Go Green!</div>
              <div class="eco-desc">Reuse textbooks and help the environment. Earn reward points.</div>
              <button class="btn btn-white-sm" style="margin-top: 8px;" id="learn-green-btn">
                <i class="bi bi-arrow-right-circle"></i> Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-page { padding: 20px 28px 40px; }
.dash-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.stat-card { text-align: center; }
.stat-icon-wrap { margin-bottom: 8px; }
.stat-icon { font-size: 26px; color: var(--green-500); }
.stat-val { font-size: 26px; font-weight: 800; color: var(--text-primary); }
.stat-val.pending { color: #f59e0b; }
.stat-val.green { color: var(--green-600); font-size: 20px; }
.stat-lbl { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.dash-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
.dash-card { overflow: visible; }
.dash-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.dash-card-header h3 { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.view-all { font-size: 13px; color: var(--green-600); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 4px; }

.order-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid var(--border-light); gap: 12px; }
.order-row:last-child { border-bottom: none; }
.order-num { font-size: 12px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; }
.order-items-preview { font-size: 12px; color: var(--text-secondary); margin: 2px 0; }
.order-amount { font-size: 14px; font-weight: 700; }
.status-badge { font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 4px; }

.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.quick-item { display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: var(--radius-md); border: 1.5px solid var(--border); text-decoration: none; color: var(--text-primary); font-size: 13px; font-weight: 600; transition: all 0.15s; }
.quick-item:hover { border-color: var(--green-400); background: var(--green-50); color: var(--green-700); }
.quick-icon { font-size: 18px; color: var(--green-500); }

.eco-banner { background: var(--green-700); border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 12px; align-items: flex-start; }
.eco-icon { font-size: 22px; color: #bbf7d0; flex-shrink: 0; }
.eco-title { font-size: 14px; font-weight: 700; color: #fff; }
.eco-desc { font-size: 11px; color: rgba(255,255,255,.75); margin-top: 2px; line-height: 1.4; }
.btn-white-sm { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,.15); color: #fff; border: none; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.btn-white-sm:hover { background: rgba(255,255,255,.25); }

@media (max-width: 768px) {
  .dash-page { padding: 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-grid { grid-template-columns: 1fr; }
}
</style>
