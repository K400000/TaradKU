<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, myOrders, myProducts, logout } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()
const activeTab = ref('listings')

const STATUS_LABELS = { pending: 'รอส่ง', shipped: 'กำลังส่ง', delivered: 'ส่งแล้ว' }
const STATUS_ICONS = { pending: 'bi-hourglass-split', shipped: 'bi-truck', delivered: 'bi-check-circle-fill' }

const CATEGORY_ICONS = { Electronics: 'bi-cpu', Books: 'bi-book', Fashion: 'bi-bag', Accessories: 'bi-backpack', Stationery: 'bi-pencil', Housing: 'bi-house', Sports: 'bi-trophy', default: 'bi-box-seam' }

function handleRestrictedAction(e, targetPath = null) {
  if (e) e.preventDefault()
  if (targetPath) router.push(targetPath)
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <AppTopBar title="โปรไฟล์" :show-search="false" />
    <div class="profile-page">
      <div class="profile-layout">
        <!-- Left: User Card -->
        <aside class="profile-sidebar">
          <!-- Avatar -->
          <div class="avatar-section card card-pad">
            <div class="avatar avatar-xl" :style="{ background: appState.currentUser?.avatarColor || '#15803d' }">
              {{ appState.currentUser?.avatar }}
            </div>
            <h2 class="profile-name">{{ appState.currentUser?.name }}</h2>
            <div class="profile-faculty">{{ appState.currentUser?.faculty }}</div>
            <div class="verified-badge" style="margin-top: 6px;"><i class="bi bi-patch-check-fill"></i> Verified Student</div>

            <div class="profile-stats">
              <div class="pstat">
                <div class="pstat-val">{{ myProducts.length }}</div>
                <div class="pstat-lbl">Listings</div>
              </div>
              <div class="pstat">
                <div class="pstat-val">{{ myOrders.length }}</div>
                <div class="pstat-lbl">Purchases</div>
              </div>
              <div class="pstat">
                <div class="pstat-val">{{ appState.currentUser?.rating }}</div>
                <div class="pstat-lbl"><i class="bi bi-star-fill text-yellow"></i> Rating</div>
              </div>
            </div>

            <button class="btn btn-outline btn-sm" style="margin-top: 12px; width: 100%;" id="edit-profile-btn">
              <i class="bi bi-pencil me-1"></i> Edit Profile
            </button>
          </div>

          <!-- Account Management -->
          <div class="profile-menu card">
            <div class="menu-section-title">Account Management</div>
            <RouterLink to="/profile" class="menu-item" id="menu-edit-profile">
              <i class="bi bi-person-gear"></i> Edit Profile
            </RouterLink>
            <a href="#" class="menu-item" id="menu-identity">
              <i class="bi bi-person-badge"></i> Identity Verification
            </a>
            <a href="#" class="menu-item" id="menu-privacy">
              <i class="bi bi-shield-lock"></i> Privacy & Security
            </a>
            <hr class="divider" />
            <div class="menu-section-title">Preferences</div>
            <div class="menu-item menu-toggle-row" id="menu-darkmode">
              <div><i class="bi bi-moon"></i> Dark Mode</div>
              <div class="toggle"></div>
            </div>
            <div class="menu-item menu-toggle-row" id="menu-online-status">
              <div><i class="bi bi-circle-fill text-green me-1"></i> Show Online Status</div>
              <div class="toggle active"></div>
            </div>
            <hr class="divider" />
            <button class="menu-item danger-item" @click="handleLogout" id="menu-logout">
              <i class="bi bi-box-arrow-right"></i> Sign Out
            </button>
          </div>
        </aside>

        <!-- Right: Content -->
        <main class="profile-main">
          <!-- Seller Commission Status Banner -->
          <div class="seller-commission-banner card card-pad">
            <div class="renewal-content">
              <div class="renewal-badge-row">
                <span class="badge badge-success">
                  <i class="bi bi-check-circle-fill me-1"></i> TaradKU Pro Seller (Active)
                </span>
                <span class="expiry-text">· ฟรีค่าธรรมเนียมรายเดือน 100% (No Monthly Fee)</span>
              </div>
              <h3 class="renewal-title">
                <i class="bi bi-patch-check-fill text-green me-1"></i> สิทธิ์ผู้ขายร้านค้า TaradKU Pro Seller
              </h3>
              <p class="renewal-desc">✔ ลงขายสินค้าได้ไม่จำกัดจำนวนชิ้น · ✔ แสดงป้าย Verified Student Seller น่าเชื่อถือ · ✔ ไม่มีค่าบริการรายเดือน</p>
              <div class="commission-note mt-2">
                <span class="badge badge-green-light"><i class="bi bi-info-circle me-1"></i> ระบบ Commission 3.5%</span>
                <span class="text-xs text-secondary ms-2">ทางระบบคิดค่าบริการ Commission 3.5% จากยอดขายเฉพาะเมื่อมีการสั่งซื้อและส่งมอบสินค้าสำเร็จเท่านั้น</span>
              </div>
            </div>
            <RouterLink to="/seller/products" class="btn btn-primary btn-sm" id="manage-shop-btn">
              <i class="bi bi-shop me-1"></i> หน้าจัดการสินค้า & Dashboard
            </RouterLink>
          </div>

          <!-- Tabs -->
          <div class="profile-tabs">
            <button class="profile-tab" :class="{ active: activeTab === 'listings' }" @click="activeTab = 'listings'" id="tab-listings">
              My Listings ({{ myProducts.length }})
            </button>
            <button class="profile-tab" :class="{ active: activeTab === 'purchased' }" @click="activeTab = 'purchased'" id="tab-purchased">
              Purchased ({{ myOrders.length }})
            </button>
            <button class="profile-tab" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'" id="tab-reviews">
              Reviews
            </button>
          </div>

          <!-- My Listings -->
          <div v-if="activeTab === 'listings'">
            <div class="empty-state" v-if="myProducts.length === 0">
              <i class="bi bi-box-seam empty-icon"></i>
              <div class="empty-title">ยังไม่มีสินค้าที่ลงขาย</div>
              <a href="#" @click="(e) => handleRestrictedAction(e, '/seller/products')" class="btn btn-primary" id="go-sell-btn">
                <i class="bi bi-plus-circle me-1"></i> Post a Listing
              </a>
            </div>
            <div class="listings-grid" v-else>
              <div class="listing-card card" v-for="p in myProducts.slice(0,6)" :key="p.id">
                <div class="listing-img"><i :class="['bi', CATEGORY_ICONS[p.category] || 'bi-box-seam']"></i></div>
                <div class="listing-body">
                  <div class="listing-title">{{ p.title }}</div>
                  <div class="listing-price">฿{{ p.price.toLocaleString('th-TH') }}</div>
                  <div class="listing-meta">
                    <span class="badge badge-gray">{{ p.condition }}</span>
                    <span class="text-xs text-muted"><i class="bi bi-eye"></i> {{ p.views }}</span>
                  </div>
                  <div class="listing-actions">
                    <button class="btn btn-outline btn-sm" style="flex:1;" @click="(e) => handleRestrictedAction(e, '/seller/products')" :id="`profile-edit-${p.id}`">Edit</button>
                    <button class="btn btn-ghost btn-sm" :id="`profile-more-${p.id}`"><i class="bi bi-three-dots"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <a href="#" @click="(e) => handleRestrictedAction(e, '/seller/products')" class="view-all-link" v-if="myProducts.length > 0" id="view-all-listings-profile">View All Listings ({{ myProducts.length }}) →</a>
          </div>

          <!-- Purchased Orders -->
          <div v-if="activeTab === 'purchased'">
            <div class="empty-state" v-if="myOrders.length === 0">
              <i class="bi bi-cart3 empty-icon"></i>
              <div class="empty-title">ยังไม่มีประวัติการซื้อ</div>
              <RouterLink to="/products" class="btn btn-primary" id="browse-profile-btn">
                <i class="bi bi-bag me-1"></i> Browse Products
              </RouterLink>
            </div>
            <div class="orders-list" v-else>
              <div class="order-item card" v-for="o in myOrders" :key="o.id">
                <div class="order-item-left">
                  <div class="order-num">#{{ o.id }}</div>
                  <div class="order-items-preview">{{ o.items.map(i => i.title).join(', ') }}</div>
                  <div class="order-date-text">฿{{ o.totalAmount.toLocaleString('th-TH') }}</div>
                </div>
                <span class="badge" :class="`status-${o.status}`"><i :class="['bi', STATUS_ICONS[o.status]]"></i> {{ STATUS_LABELS[o.status] }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div v-if="activeTab === 'reviews'">
            <div class="reviews-summary card card-pad">
              <div class="review-score">
                <div class="score-num">{{ appState.currentUser?.rating }}</div>
                <div class="star-row">
                  <i class="bi bi-star-fill text-yellow" v-for="i in 5" :key="i"></i>
                </div>
                <div class="score-count">Based on 24 reviews</div>
              </div>
              <div class="review-bars">
                <div class="bar-row" v-for="n in [5,4,3,2,1]" :key="n">
                  <span class="bar-label">{{ n }} <i class="bi bi-star-fill text-yellow" style="font-size: 10px;"></i></span>
                  <div class="bar-bg"><div class="bar-fill" :style="{ width: n === 5 ? '70%' : n === 4 ? '20%' : '5%' }"></div></div>
                  <span class="bar-count">{{ n === 5 ? 17 : n === 4 ? 5 : 1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>


  </div>
</template>

<style scoped>
.profile-page { padding: 20px 28px 40px; }
.profile-layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: flex-start; }

/* Sidebar */
.avatar-section { text-align: center; margin-bottom: 12px; }
.profile-name { font-size: 18px; font-weight: 700; margin-top: 12px; }
.profile-faculty { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.profile-stats { display: flex; justify-content: center; gap: 20px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
.pstat { text-align: center; }
.pstat-val { font-size: 20px; font-weight: 700; }
.pstat-lbl { font-size: 11px; color: var(--text-secondary); margin-top: 2px; display: flex; align-items: center; justify-content: center; gap: 3px; }
.text-yellow { color: #f59e0b; }
.text-green { color: var(--green-600); }
.me-1 { margin-right: 4px; }
.me-2 { margin-right: 8px; }

.profile-menu { overflow: visible; }
.menu-section-title { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 14px 4px; }
.menu-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; color: var(--text-primary); text-decoration: none; background: none; border: none; cursor: pointer; width: 100%; text-align: left; transition: background 0.15s; }
.menu-item i { font-size: 16px; color: var(--text-secondary); }
.menu-item:hover { background: var(--bg-page); }
.menu-toggle-row { justify-content: space-between; }
.danger-item { color: #dc2626; }
.danger-item i { color: #dc2626; }
.danger-item:hover { background: #fee2e2 !important; }
.toggle { width: 36px; height: 20px; border-radius: 10px; background: var(--border); position: relative; cursor: pointer; }
.toggle.active { background: var(--green-600); }
.toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
.toggle.active::after { transform: translateX(16px); }

/* Main */
.role-switch-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; background: var(--green-50); border: 1px solid var(--green-200); flex-wrap: wrap; }
.role-current { font-size: 14px; font-weight: 600; }
.role-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

/* Seller Renewal Banner */
.seller-renewal-banner { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; background: #fffbeb; border: 1.5px solid #fde68a; flex-wrap: wrap; transition: all 0.2s; }
.seller-renewal-banner.expired-banner { background: #fef2f2; border-color: #fca5a5; }
.renewal-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.badge-warning { background: #fef3c7; color: #d97706; font-weight: 700; padding: 4px 10px; border-radius: 12px; font-size: 11px; }
.badge-success { background: var(--green-100); color: var(--green-800); font-weight: 700; padding: 4px 10px; border-radius: 12px; font-size: 11px; }
.badge-danger { background: #fee2e2; color: #dc2626; font-weight: 700; padding: 4px 10px; border-radius: 12px; font-size: 11px; }
.expiry-text { font-size: 12px; color: var(--text-secondary); font-weight: 600; }
.renewal-title { font-size: 15px; font-weight: 700; color: #92400e; margin-bottom: 3px; display: flex; align-items: center; }
.renewal-title.text-danger-title { color: #991b1b; }
.renewal-desc { font-size: 12px; color: #b45309; }
.renewal-desc.text-danger-desc { color: #dc2626; font-weight: 600; }
.btn-warning-btn { background: #f59e0b; color: #fff; border: none; padding: 10px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 10px rgba(245,158,11,0.3); display: flex; align-items: center; white-space: nowrap; }
.btn-warning-btn:hover { background: #d97706; transform: translateY(-1px); }
.btn-danger-btn { background: #dc2626; color: #fff; border: none; padding: 10px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 10px rgba(220,38,38,0.3); display: flex; align-items: center; white-space: nowrap; animation: pulse 2s infinite; }
.btn-danger-btn:hover { background: #b91c1c; }

/* Mockup Sim Bar */
.mockup-sim-bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; margin-bottom: 16px; background: #f8fafc; border: 1px dashed var(--border); flex-wrap: wrap; }
.sim-label { font-size: 12px; color: var(--text-secondary); }
.sim-btn-group { display: flex; gap: 6px; flex-wrap: wrap; }
.btn-xs { padding: 5px 10px; font-size: 11px; border-radius: 6px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: #fff; }
.btn-sim-active { background: #fef3c7; border-color: #f59e0b; color: #d97706; }
.btn-sim-danger { background: #fee2e2; border-color: #dc2626; color: #dc2626; }
.btn-sim-success { background: var(--green-100); border-color: var(--green-600); color: var(--green-800); }

@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

.profile-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.profile-tab { padding: 10px 16px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
.profile-tab.active { color: var(--green-700); border-bottom-color: var(--green-600); font-weight: 700; }

.listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.listing-card { overflow: hidden; }
.listing-img { height: 100px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: var(--bg-page); color: #d1d5db; }
.listing-body { padding: 10px; }
.listing-title { font-size: 12px; font-weight: 600; margin-bottom: 4px; line-height: 1.3; height: 30px; overflow: hidden; }
.listing-price { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.listing-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
.listing-actions { display: flex; gap: 6px; }

.view-all-link { display: block; text-align: center; margin-top: 14px; font-size: 13px; color: var(--green-600); font-weight: 600; text-decoration: none; }
.view-all-link:hover { text-decoration: underline; }

.orders-list { display: flex; flex-direction: column; gap: 10px; }
.order-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; gap: 12px; }
.order-num { font-size: 12px; font-weight: 700; color: var(--text-muted); }
.order-items-preview { font-size: 13px; color: var(--text-secondary); margin: 2px 0; }
.order-date-text { font-size: 14px; font-weight: 700; }

.reviews-summary { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
.review-score { text-align: center; }
.score-num { font-size: 48px; font-weight: 800; color: var(--text-primary); }
.star-row { display: flex; justify-content: center; gap: 2px; font-size: 14px; margin: 4px 0; }
.score-count { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
.review-bars { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.bar-row { display: flex; align-items: center; gap: 8px; }
.bar-label { font-size: 12px; color: var(--text-secondary); width: 35px; display: flex; align-items: center; justify-content: flex-end; gap: 2px; }
.bar-bg { flex: 1; height: 8px; background: var(--border-light); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: var(--green-500); border-radius: 4px; }
.bar-count { font-size: 12px; color: var(--text-secondary); width: 20px; }

.seller-commission-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #86efac;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.commission-note { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.badge-green-light { background: #bbf7d0; color: #166534; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 11px; }

@media (max-width: 768px) {
  .profile-page { padding: 16px; }
  .profile-layout { grid-template-columns: 1fr; }
  .listings-grid { grid-template-columns: repeat(2, 1fr); }
  .pay-methods-grid { grid-template-columns: 1fr; }
}
</style>
