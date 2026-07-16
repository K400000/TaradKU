<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { appState, cartCount, unreadCount, logout } from '../stores/app.js'
import logoImg from '../assets/logo_branding.png'

const router = useRouter()
const route = useRoute()

const isSeller = computed(() => appState.currentUser?.role === 'seller')

const navItems = computed(() => {
  if (isSeller.value) {
    return [
      { name: 'Home', path: '/home', icon: 'bi-house', label: 'หน้าแรก' },
      { name: 'SellerDashboard', path: '/seller/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
      { name: 'SellerProducts', path: '/seller/products', icon: 'bi-box-seam', label: 'สินค้า' },
      { name: 'SellerOrders', path: '/seller/orders', icon: 'bi-bag-check', label: 'ออเดอร์' },
      { name: 'SellerPromotions', path: '/seller/promotions', icon: 'bi-gift', label: 'โปรโมชั่น' },
      { name: 'Messages', path: '/messages', icon: 'bi-chat-dots', label: 'ข้อความ', badge: unreadCount.value },
      { name: 'Profile', path: '/profile', icon: 'bi-person-circle', label: 'โปรไฟล์' },
    ]
  }
  return [
    { name: 'Home', path: '/home', icon: 'bi-house', label: 'หน้าแรก' },
    { name: 'ProductList', path: '/products', icon: 'bi-search', label: 'ค้นหาสินค้า' },
    { name: 'Cart', path: '/cart', icon: 'bi-cart3', label: 'ตะกร้า', badge: cartCount.value },
    { name: 'OrderTracking', path: '/orders', icon: 'bi-truck', label: 'ออเดอร์' },
    { name: 'Messages', path: '/messages', icon: 'bi-chat-dots', label: 'ข้อความ', badge: unreadCount.value },
    { name: 'Profile', path: '/profile', icon: 'bi-person-circle', label: 'โปรไฟล์' },
  ]
})

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <aside class="app-sidebar">
    <!-- Logo Brand -->
    <div class="sidebar-brand">
      <div class="brand-logo">
        <img :src="logoImg" alt="TaradKU Logo" class="brand-img" />
        <div>
          <div class="brand-name">TaradKU</div>
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
        <div class="verified-badge-sidebar" v-if="appState.currentUser.verified">
          <i class="bi bi-patch-check-fill"></i> Verified Student
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
        <i :class="['nav-icon', 'bi', item.icon]"></i>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <div style="flex: 1;"></div>



    <!-- Logout -->
    <div class="sidebar-footer">
      <button class="nav-item logout-btn" @click="handleLogout" id="sidebar-logout-btn">
        <i class="bi bi-box-arrow-right nav-icon"></i>
        <span class="nav-label">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-brand {
  padding: 16px 14px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.brand-name {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}
.brand-sub {
  font-size: 10px;
  color: #6b7280;
  margin-top: 1px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
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
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
}

.sidebar-nav {
  padding: 10px 8px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  color: var(--text-sidebar);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  position: relative;
  text-decoration: none;
}
.nav-item:hover {
  background: rgba(255,255,255,.06);
  color: #fff;
}
.nav-active {
  background: var(--bg-sidebar-active) !important;
  color: #fff !important;
}

.nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
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
  padding: 10px 10px 0;
}
.cta-card {
  display: block;
  background: rgba(22,163,74,.15);
  border: 1px solid rgba(22,163,74,.3);
  border-radius: 10px;
  padding: 12px;
}
.cta-icon { font-size: 18px; color: #4ade80; margin-bottom: 4px; }
.cta-title { font-size: 12px; font-weight: 700; color: #fff; }
.cta-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; line-height: 1.3; }

.sidebar-footer {
  padding: 8px 8px;
  border-top: 1px solid rgba(255,255,255,.06);
  margin-top: 10px;
}
.logout-btn { color: #9ca3af; }
.logout-btn:hover { color: #f87171; background: rgba(239,68,68,.1) !important; }

.me-1 { margin-right: 4px; }
</style>
