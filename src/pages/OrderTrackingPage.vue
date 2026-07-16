<script setup>
import { computed, ref } from 'vue'
import { appState } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const activeTab = ref('all')
const myOrders = computed(() => appState.orders.filter(o => o.buyerId === appState.currentUser?.id))
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return myOrders.value
  return myOrders.value.filter(o => o.status === activeTab.value)
})

const STATUS_LABELS = { pending: 'รอยืนยัน', shipped: 'กำลังส่ง', delivered: 'ส่งแล้ว' }
const STATUS_ICONS = { pending: 'bi-hourglass-split', shipped: 'bi-truck', delivered: 'bi-check-circle-fill' }

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
}
</script>

<template>
  <div>
    <AppTopBar title="คำสั่งซื้อของฉัน" :show-search="false" />
    <div class="tracking-page">
      <div class="page-header" style="padding: 20px 28px 0;">
        <div>
          <h1 class="page-title">My Orders</h1>
          <p class="page-subtitle">ติดตามสถานะคำสั่งซื้อของคุณ</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="order-tabs">
        <button v-for="tab in ['all', 'pending', 'shipped', 'delivered']" :key="tab"
          class="order-tab" :class="{ active: activeTab === tab }"
          @click="activeTab = tab" :id="`tab-${tab}`">
          <i v-if="tab !== 'all'" :class="['bi', STATUS_ICONS[tab]]"></i>
          {{ tab === 'all' ? 'ทั้งหมด' : STATUS_LABELS[tab] }}
          <span class="tab-count">{{ tab === 'all' ? myOrders.length : myOrders.filter(o => o.status === tab).length }}</span>
        </button>
      </div>

      <div class="orders-list">
        <div class="empty-state" v-if="filteredOrders.length === 0">
          <i class="bi bi-box empty-icon"></i>
          <div class="empty-title">ยังไม่มีคำสั่งซื้อ</div>
          <div class="empty-desc">คำสั่งซื้อของคุณจะแสดงที่นี่</div>
          <RouterLink to="/products" class="btn btn-primary" id="browse-btn-tracking">
            <i class="bi bi-bag"></i> Browse Products
          </RouterLink>
        </div>

        <div v-for="order in filteredOrders" :key="order.id" class="order-card card">
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-id-row">
              <span class="order-id">#{{ order.id.toUpperCase() }}</span>
              <span class="badge" :class="`status-${order.status}`">
                <i :class="['bi', STATUS_ICONS[order.status]]"></i>
                {{ STATUS_LABELS[order.status] }}
              </span>
            </div>
            <div class="order-date">สั่งเมื่อ {{ formatDate(order.createdAt) }}</div>
          </div>

          <!-- Items -->
          <div class="order-items">
            <div class="order-item" v-for="item in order.items" :key="item.productId">
              <div class="item-thumb"><i class="bi bi-box-seam"></i></div>
              <div class="item-details">
                <div class="item-name">{{ item.title }}</div>
                <div class="item-sub">x{{ item.quantity }} · ฿{{ item.price.toLocaleString('th-TH') }}</div>
              </div>
            </div>
          </div>

          <!-- Tracking Steps -->
          <div class="tracking-steps">
            <div v-for="(step, i) in order.trackingSteps" :key="step.status"
              class="track-step"
              :class="{ done: step.done, current: step.done && (i === order.trackingSteps.length - 1 || !order.trackingSteps[i+1]?.done) }">
              <div class="step-dot">
                <i v-if="step.done" class="bi bi-check step-check"></i>
              </div>
              <div class="step-line" v-if="i < order.trackingSteps.length - 1"></div>
              <div class="step-content">
                <div class="step-label">{{ step.label }}</div>
                <div class="step-time" v-if="step.timestamp">{{ formatDate(step.timestamp) }}</div>
                <div class="step-time pending" v-else>รอดำเนินการ</div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="order-footer">
            <div class="order-total">
              <span>ยอดรวม</span>
              <span class="order-total-price">฿{{ order.totalAmount.toLocaleString('th-TH') }}</span>
            </div>
            <div class="order-actions">
              <span class="meta-pill"><i class="bi bi-credit-card"></i> {{ order.paymentMethod }}</span>
              <span class="meta-pill"><i class="bi bi-geo-alt"></i> {{ order.meetingLocation }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracking-page { padding-bottom: 40px; }
.order-tabs { display: flex; gap: 4px; padding: 16px 28px 0; border-bottom: 1px solid var(--border); overflow-x: auto; }
.order-tab { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; transition: all 0.15s; }
.order-tab.active { color: var(--green-700); border-bottom-color: var(--green-600); font-weight: 700; }
.tab-count { background: var(--border-light); font-size: 11px; padding: 1px 6px; border-radius: 10px; }
.orders-list { padding: 20px 28px; display: flex; flex-direction: column; gap: 16px; }

.order-card { overflow: visible; }
.order-header { padding: 16px 20px; border-bottom: 1px solid var(--border-light); }
.order-id-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.order-id { font-size: 13px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; }
.order-date { font-size: 12px; color: var(--text-muted); }

.order-items { padding: 12px 20px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid var(--border-light); }
.order-item { display: flex; align-items: center; gap: 10px; }
.item-thumb { width: 40px; height: 40px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #d1d5db; }
.item-name { font-size: 13px; font-weight: 600; }
.item-sub { font-size: 12px; color: var(--text-secondary); }

/* Tracking */
.tracking-steps { padding: 16px 20px; display: flex; gap: 0; border-bottom: 1px solid var(--border-light); overflow-x: auto; }
.track-step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; min-width: 80px; }
.step-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); background: #fff; z-index: 1; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.track-step.done .step-dot { background: var(--green-600); border-color: var(--green-600); }
.step-check { color: #fff; font-size: 10px; font-weight: 900; }
.track-step.current .step-dot { box-shadow: 0 0 0 4px rgba(22,163,74,.15); }
.step-line { position: absolute; top: 10px; left: 50%; width: 100%; height: 2px; background: var(--border); z-index: 0; }
.track-step.done .step-line { background: var(--green-600); }
.step-content { margin-top: 8px; text-align: center; }
.step-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); }
.track-step.done .step-label { color: var(--green-700); }
.step-time { font-size: 10px; color: var(--text-muted); }
.step-time.pending { font-style: italic; }

.order-footer { padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.order-total { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.order-total-price { font-size: 18px; font-weight: 700; }
.order-actions { display: flex; gap: 8px; }
.meta-pill { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); background: var(--bg-page); padding: 3px 8px; border-radius: 20px; border: 1px solid var(--border); }

@media (max-width: 768px) {
  .orders-list { padding: 16px; }
  .order-tabs { padding: 16px 16px 0; }
}
</style>
