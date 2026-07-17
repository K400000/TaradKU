<script setup>
import { ref, computed } from 'vue'
import { appState, sellerOrders, confirmShipping } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const activeTab = ref('all')
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return sellerOrders.value
  return sellerOrders.value.filter(o => o.status === activeTab.value)
})
const STATUS_ICONS = { pending: 'bi-hourglass-split', shipped: 'bi-truck', delivered: 'bi-check-circle-fill' }
const STATUS_LABELS = { pending: 'รอจัดเตรียม', shipped: 'กำลังจัดส่ง', delivered: 'ส่งแล้ว' }

function formatDate(d) { return d ? new Date(d).toLocaleString('th-TH') : '—' }

function handlePrintLabel(order) {
  alert(`Printing shipping label for Order #${order.id}\nBuyer: ${order.buyerId}\nItems: ${order.items.map(i => i.title).join(', ')}\nMeeting: ${order.meetingLocation}`)
}
</script>

<template>
  <div>
    <AppTopBar title="จัดการออเดอร์" :show-search="false" />
    <div class="order-manage-page">
      <div class="page-header" style="padding: 20px 28px 0;">
        <div>
          <h1 class="page-title">จัดการออเดอร์</h1>
          <p class="page-subtitle">{{ sellerOrders.length }} orders total · {{ sellerOrders.filter(o=>o.status==='pending').length }} need attention</p>
        </div>
      </div>

      <div class="order-tabs">
        <button v-for="tab in ['all', 'pending', 'shipped', 'delivered']" :key="tab"
          class="order-tab" :class="{ active: activeTab === tab }"
          @click="activeTab = tab" :id="`seller-tab-${tab}`">
          <i v-if="tab !== 'all'" :class="['bi', STATUS_ICONS[tab]]"></i>
          {{ tab === 'all' ? 'ทั้งหมด' : STATUS_LABELS[tab] }}
          <span class="tab-count">{{ tab === 'all' ? sellerOrders.length : sellerOrders.filter(o=>o.status===tab).length }}</span>
        </button>
      </div>

      <div class="orders-list">
        <div class="empty-state" v-if="filteredOrders.length === 0">
          <i class="bi bi-inbox empty-icon"></i>
          <div class="empty-title">ไม่มีออเดอร์ในสถานะนี้</div>
        </div>

        <div class="order-card card" v-for="order in filteredOrders" :key="order.id">
          <div class="order-card-header">
            <div>
              <span class="order-num">#{{ order.id.toUpperCase() }}</span>
              <div class="order-time">{{ formatDate(order.createdAt) }}</div>
            </div>
            <span class="badge" :class="`status-${order.status}`">
              <i :class="['bi', STATUS_ICONS[order.status]]"></i>
              {{ STATUS_LABELS[order.status] }}
            </span>
          </div>

          <div class="order-items-list">
            <div class="order-item" v-for="item in order.items" :key="item.productId">
              <div class="item-thumb">
                <i class="bi bi-box-seam"></i>
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-price">฿{{ item.price.toLocaleString('th-TH') }} × {{ item.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="order-meta">
            <div class="meta-item"><i class="bi bi-credit-card"></i> {{ order.paymentMethod }}</div>
            <div class="meta-item"><i class="bi bi-geo-alt"></i> {{ order.meetingLocation }}</div>
            <div class="meta-item meta-total">
              <span>฿{{ order.totalAmount.toLocaleString('th-TH') }}</span>
              <span class="text-xs text-green ms-2 font-bold" style="font-size: 12px; color: var(--green-600);">(รับสุทธิหลังหัก 3.5%: ฿{{ (order.totalAmount - Math.round(order.totalAmount * 0.035)).toLocaleString('th-TH') }})</span>
            </div>
          </div>

          <div class="order-card-actions">
            <button class="btn btn-ghost btn-sm" @click="handlePrintLabel(order)" :id="`print-${order.id}`">
              <i class="bi bi-printer"></i> พิมพ์ใบปะหน้า
            </button>
            <button v-if="order.status !== 'delivered'" class="btn btn-primary btn-sm" @click="confirmShipping(order.id)" :id="`confirm-${order.id}`">
              <i class="bi bi-check-lg"></i> ยืนยันการส่ง
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-manage-page { padding-bottom: 40px; }
.order-tabs { display: flex; gap: 4px; padding: 16px 28px 0; border-bottom: 1px solid var(--border); overflow-x: auto; }
.order-tab { padding: 10px 16px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
.order-tab.active { color: var(--green-700); border-bottom-color: var(--green-600); font-weight: 700; }
.tab-count { background: var(--border-light); font-size: 11px; padding: 1px 6px; border-radius: 10px; }
.orders-list { padding: 20px 28px; display: flex; flex-direction: column; gap: 14px; }

.order-card { overflow: visible; }
.order-card-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 16px 20px 12px; border-bottom: 1px solid var(--border-light); }
.order-num { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.order-time { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.order-items-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid var(--border-light); }
.order-item { display: flex; align-items: center; gap: 10px; }
.item-thumb { width: 44px; height: 44px; background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #d1d5db; }
.item-title { font-size: 13px; font-weight: 600; }
.item-price { font-size: 12px; color: var(--text-secondary); }

.order-meta { display: flex; gap: 16px; align-items: center; padding: 10px 20px; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; }
.meta-item { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 5px; }
.meta-total { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-left: auto; }

.order-card-actions { display: flex; gap: 10px; padding: 12px 20px; }

@media (max-width: 768px) {
  .orders-list { padding: 16px; }
  .order-tabs { padding: 16px 16px 0; }
}
</style>
