<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, myProducts, sellerOrders } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()
const activeListings = computed(() => myProducts.value.filter(p => true).length)
const pendingOrders = computed(() => sellerOrders.value.filter(o => o.status === 'pending').length)
const totalRevenue = computed(() => sellerOrders.value.reduce((s, o) => s + o.totalAmount, 0))

const recentOrders = computed(() => sellerOrders.value.slice(0, 3))

const STATUS_ICONS = { pending: '⏳', shipped: '🚚', delivered: '✅' }
const STATUS_LABELS = { pending: 'รอส่ง', shipped: 'กำลังส่ง', delivered: 'ส่งแล้ว' }
</script>

<template>
  <div>
    <AppTopBar title="Seller Dashboard" :show-search="false" />
    <div class="dash-page">
      <div class="dash-header">
        <div>
          <h1 class="page-title">⚡ Fresh Listings</h1>
          <p class="page-subtitle">Welcome back, {{ appState.currentUser?.name }}!</p>
        </div>
        <RouterLink to="/seller/products" class="btn btn-primary" id="add-listing-btn">+ New Listing</RouterLink>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card card card-pad">
          <div class="stat-icon">📦</div>
          <div class="stat-val">{{ activeListings }}</div>
          <div class="stat-lbl">Active Listings</div>
        </div>
        <div class="stat-card card card-pad">
          <div class="stat-icon">🛍️</div>
          <div class="stat-val">{{ sellerOrders.length }}</div>
          <div class="stat-lbl">Total Orders</div>
        </div>
        <div class="stat-card card card-pad">
          <div class="stat-icon">⏳</div>
          <div class="stat-val pending">{{ pendingOrders }}</div>
          <div class="stat-lbl">Pending Orders</div>
        </div>
        <div class="stat-card card card-pad">
          <div class="stat-icon">💰</div>
          <div class="stat-val green">฿{{ totalRevenue.toLocaleString('th-TH') }}</div>
          <div class="stat-lbl">Total Revenue</div>
        </div>
      </div>

      <div class="dash-grid">
        <!-- Order Summary -->
        <div class="dash-card card">
          <div class="dash-card-header">
            <h3>🛍️ Order Summary</h3>
            <RouterLink to="/seller/orders" class="view-all">View All →</RouterLink>
          </div>

          <div v-if="recentOrders.length === 0" class="empty-state" style="padding: 32px;">
            <div class="empty-icon">📭</div>
            <div class="empty-title">ยังไม่มีออเดอร์</div>
          </div>

          <div v-else>
            <div class="order-row" v-for="o in recentOrders" :key="o.id">
              <div class="order-row-left">
                <div class="order-num">#{{ o.id }}</div>
                <div class="order-items-preview">{{ o.items.map(i => i.title).join(', ').slice(0, 40) }}...</div>
                <div class="order-amount">฿{{ o.totalAmount.toLocaleString('th-TH') }}</div>
              </div>
              <span class="badge status-badge" :class="`status-${o.status}`">
                {{ STATUS_ICONS[o.status] }} {{ STATUS_LABELS[o.status] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="quick-links card card-pad">
          <h3 style="margin-bottom: 16px;">Quick Actions</h3>
          <div class="quick-grid">
            <RouterLink to="/seller/products" class="quick-item" id="quick-products">
              <span class="quick-icon">📦</span>
              <span>Manage Products</span>
            </RouterLink>
            <RouterLink to="/seller/orders" class="quick-item" id="quick-orders">
              <span class="quick-icon">🛍️</span>
              <span>Manage Orders</span>
            </RouterLink>
            <RouterLink to="/seller/promotions" class="quick-item" id="quick-promos">
              <span class="quick-icon">🎁</span>
              <span>Promotions</span>
            </RouterLink>
            <RouterLink to="/messages" class="quick-item" id="quick-messages">
              <span class="quick-icon">💬</span>
              <span>Messages</span>
            </RouterLink>
          </div>

          <!-- Go Green Banner -->
          <div class="eco-banner">
            <div class="eco-icon">🌱</div>
            <div>
              <div class="eco-title">Go Green!</div>
              <div class="eco-desc">Reuse textbooks and help the environment. Earn reward points.</div>
              <button class="btn btn-primary btn-sm" style="margin-top: 8px;" id="learn-green-btn">Learn More →</button>
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
.stat-icon { font-size: 28px; margin-bottom: 8px; }
.stat-val { font-size: 28px; font-weight: 800; color: var(--text-primary); }
.stat-val.pending { color: var(--color-pending); }
.stat-val.green { color: var(--green-600); }
.stat-lbl { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.dash-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
.dash-card { overflow: visible; }
.dash-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.dash-card-header h3 { font-size: 15px; font-weight: 700; }
.view-all { font-size: 13px; color: var(--green-600); text-decoration: none; font-weight: 600; }

.order-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid var(--border-light); gap: 12px; }
.order-row:last-child { border-bottom: none; }
.order-num { font-size: 12px; font-weight: 700; color: var(--text-muted); }
.order-items-preview { font-size: 13px; color: var(--text-secondary); margin: 2px 0; }
.order-amount { font-size: 14px; font-weight: 700; }
.status-badge { font-size: 11px; white-space: nowrap; }

.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.quick-item {
  display: flex; align-items: center; gap: 8px;
  padding: 12px; border-radius: var(--radius-md);
  border: 1.5px solid var(--border); text-decoration: none;
  color: var(--text-primary); font-size: 13px; font-weight: 600;
  transition: all 0.15s;
}
.quick-item:hover { border-color: var(--green-400); background: var(--green-50); color: var(--green-700); }
.quick-icon { font-size: 20px; }

.eco-banner { background: var(--green-700); border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 12px; align-items: flex-start; }
.eco-icon { font-size: 28px; }
.eco-title { font-size: 14px; font-weight: 700; color: #fff; }
.eco-desc { font-size: 12px; color: rgba(255,255,255,.75); margin-top: 2px; line-height: 1.4; }

@media (max-width: 768px) {
  .dash-page { padding: 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-grid { grid-template-columns: 1fr; }
}
</style>
