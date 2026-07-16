<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { appState, cartCount, unreadCount, logout } from '../stores/app.js'

const router = useRouter()
const route = useRoute()

const isSeller = computed(() => appState.currentUser?.role === 'seller')

const navItems = computed(() => {
  const base = [
    { name: 'Home', path: '/home', icon: '🏠', label: 'หน้าแรก' },
    { name: 'Messages', path: '/messages', icon: '💬', label: 'ข้อความ', badge: unreadCount.value },
    { name: 'Profile', path: '/profile', icon: '👤', label: 'โปรไฟล์' },
  ]
  if (isSeller.value) {
    return [
      { name: 'Home', path: '/home', icon: '🏠', label: 'หน้าแรก' },
      { name: 'SellerDashboard', path: '/seller/dashboard', icon: '📊', label: 'Dashboard' },
      { name: 'SellerProducts', path: '/seller/products', icon: '📦', label: 'สินค้า' },
      { name: 'SellerOrders', path: '/seller/orders', icon: '🛍️', label: 'ออเดอร์' },
      { name: 'SellerPromotions', path: '/seller/promotions', icon: '🎁', label: 'โปรโมชั่น' },
      { name: 'Messages', path: '/messages', icon: '💬', label: 'ข้อความ', badge: unreadCount.value },
      { name: 'Profile', path: '/profile', icon: '👤', label: 'โปรไฟล์' },
    ]
  }
  return [
    { name: 'Home', path: '/home', icon: '🏠', label: 'หน้าแรก' },
    { name: 'ProductList', path: '/products', icon: '🔍', label: 'ค้นหาสินค้า' },
    { name: 'Cart', path: '/cart', icon: '🛒', label: 'ตะกร้า', badge: cartCount.value },
    { name: 'OrderTracking', path: '/orders', icon: '📦', label: 'ออเดอร์' },
    { name: 'Messages', path: '/messages', icon: '💬', label: 'ข้อความ', badge: unreadCount.value },
    { name: 'Profile', path: '/profile', icon: '👤', label: 'โปรไฟล์' },
  ]
})

function isActive(path) {
  return route.path.startsWith(path) && path !== '/home'
    ? true
    : route.path === path
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <aside class="app-sidebar">
    <!-- Logo -->
    <div class="sidebar-brand">
      <div class="brand-logo">
        <span class="brand-icon">🌿</span>
        <div>
          <div class="brand-name">KU Market</div>
          <div class="brand-sub">{{ isSeller ? 'Seller Mode' : 'Campus Marketplace' }}</div>
        </div>
      </div>
    </div>

    <!-- User Info -->
    <div class="sidebar-user" v-if="appState.currentUser">
      <div class="avatar" :style="{ background: appState.currentUser.avatarColor }">
        {{ appState.currentUser.avatar }}
      </div>
      <div class="user-info">
        <div class="user-name">{{ appState.currentUser.name }}</div>
        <div class="user-sub verified-badge-sidebar" v-if="appState.currentUser.verified">
          ✓ Verified Student
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'nav-active': route.path === item.path || (item.path !== '/home' && route.path.startsWith(item.path)) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <!-- Bottom Spacer -->
    <div style="flex: 1;"></div>

    <!-- Post an Item CTA (Buyer Only) -->
    <div class="sidebar-cta" v-if="!isSeller">
      <RouterLink to="/seller/products" class="cta-card">
        <div class="cta-icon">💡</div>
        <div>
          <div class="cta-title">Ready to Sell?</div>
          <div class="cta-sub">Turn your unused items into cash today.</div>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top: 8px; width: 100%;" @click.prevent="$router.push('/seller/products')">Post a Listing</button>
      </RouterLink>
    </div>

    <!-- Logout -->
    <div class="sidebar-footer">
      <button class="nav-item logout-btn" @click="handleLogout">
        <span class="nav-icon">🚪</span>
        <span class="nav-label">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-brand {
  padding: 20px 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-icon { font-size: 24px; }
.brand-name {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}
.brand-sub {
  font-size: 11px;
  color: #6b7280;
  margin-top: 1px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #e5e7eb;
}
.verified-badge-sidebar {
  font-size: 10px;
  color: #4ade80;
  font-weight: 600;
}

.sidebar-nav {
  padding: 10px 10px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text-sidebar);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  position: relative;
}
.nav-item:hover {
  background: rgba(255,255,255,.06);
  color: #fff;
}
.nav-active {
  background: var(--bg-sidebar-active) !important;
  color: #fff !important;
}

.nav-icon { font-size: 16px; width: 20px; text-align: center; }
.nav-label { flex: 1; }

.nav-badge {
  background: #dc2626;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.sidebar-cta {
  padding: 12px 12px 0;
}
.cta-card {
  display: block;
  background: rgba(22,163,74,.15);
  border: 1px solid rgba(22,163,74,.3);
  border-radius: 10px;
  padding: 12px;
  text-decoration: none;
}
.cta-icon { font-size: 20px; margin-bottom: 4px; }
.cta-title { font-size: 12px; font-weight: 700; color: #fff; }
.cta-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; line-height: 1.3; }

.sidebar-footer {
  padding: 10px;
  border-top: 1px solid rgba(255,255,255,.06);
  margin-top: 12px;
}
.logout-btn { color: #9ca3af; }
.logout-btn:hover { color: #f87171; background: rgba(239,68,68,.1) !important; }
</style>
