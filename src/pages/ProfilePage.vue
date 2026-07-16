<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, myOrders, myProducts, switchRole, logout } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()
const activeTab = ref('listings')
const isSeller = computed(() => appState.currentUser?.role === 'seller')

const STATUS_LABELS = { pending: 'รอส่ง', shipped: 'กำลังส่ง', delivered: 'ส่งแล้ว' }
const STATUS_ICONS = { pending: 'bi-hourglass-split', shipped: 'bi-truck', delivered: 'bi-check-circle-fill' }

const CATEGORY_ICONS = { Electronics: 'bi-cpu', Books: 'bi-book', Fashion: 'bi-bag', Accessories: 'bi-backpack', Stationery: 'bi-pencil', Housing: 'bi-house', Sports: 'bi-trophy', default: 'bi-box-seam' }

// Seller Membership Renewal State
const sellerStatus = ref('expiring_23') // 'expiring_23' | 'expired' | 'active'
const showRenewModal = ref(false)
const renewPaymentMethod = ref('PromptPay')

const expiryDateText = computed(() => {
  if (sellerStatus.value === 'active') {
    return '· ใช้งานได้ถึง 23 ส.ค. 2026'
  }
  if (sellerStatus.value === 'expired') {
    return '· ครบกำหนดไปแล้วเมื่อ 23 ก.ค. 2026'
  }
  return '· ครบกำหนดชำระวันที่ 23 ก.ค. 2026'
})

function handleSwitchRole() {
  const newRole = appState.currentUser?.role === 'buyer' ? 'seller' : 'buyer'
  switchRole(newRole)
}

function handleConfirmRenew() {
  sellerStatus.value = 'active'
  showRenewModal.value = false
  alert('🎉 ชำระเงินต่ออายุสิทธิ์ผู้ขายเรียบร้อยแล้ว!\nขอบคุณที่ใช้บริการ TaradKU Pro Seller (คุ้มครองถึง 23 ส.ค. 2026)')
}

function handleRestrictedAction(e, targetPath = null) {
  if (sellerStatus.value === 'expired') {
    if (e) e.preventDefault()
    alert('⚠️ ไม่สามารถดำเนินการได้เนื่องจากสิทธิ์ผู้ขายหมดอายุแล้วเมื่อวันที่ 23 ก.ค. 2026\n\nกรุณากดปุ่ม "⚡ ต่ออายุการขาย (99฿ / เดือน)" เพื่อปลดล็อกสิทธิ์การลงขายและจัดการสินค้าครับ')
    showRenewModal.value = true
    return false
  }
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
          <!-- Role Switch Banner -->
          <div class="role-switch-banner card card-pad">
            <div>
              <div class="role-current">
                Current Mode: <strong><i :class="isSeller ? 'bi bi-shop' : 'bi bi-cart3'"></i> {{ isSeller ? 'Seller' : 'Buyer' }}</strong>
              </div>
              <div class="role-sub">Switch to {{ isSeller ? 'Buyer' : 'Seller' }} mode to {{ isSeller ? 'browse and buy items' : 'start selling your items' }}</div>
            </div>
            <button class="btn btn-primary btn-sm" @click="handleSwitchRole" id="switch-role-btn">
              <i class="bi bi-arrow-repeat me-1"></i> Switch to {{ isSeller ? 'Buyer' : 'Seller' }}
            </button>
          </div>

          <!-- Seller Membership Renewal Banner (Visible only in Seller Mode) -->
          <div class="seller-renewal-banner card card-pad" :class="{ 'expired-banner': sellerStatus === 'expired' }" v-if="isSeller">
            <div class="renewal-content">
              <div class="renewal-badge-row">
                <span class="badge" :class="sellerStatus === 'active' ? 'badge-success' : sellerStatus === 'expired' ? 'badge-danger' : 'badge-warning'">
                  <i :class="sellerStatus === 'active' ? 'bi bi-check-circle-fill me-1' : sellerStatus === 'expired' ? 'bi bi-x-circle-fill me-1' : 'bi bi-exclamation-triangle-fill me-1'"></i>
                  {{ sellerStatus === 'active' ? 'ต่ออายุสมาชิกแล้ว (Active)' : sellerStatus === 'expired' ? 'หมดอายุแล้ว (Expired)' : 'ใกล้ครบกำหนด (อีก 7 วัน)' }}
                </span>
                <span class="expiry-text">{{ expiryDateText }}</span>
              </div>
              <h3 class="renewal-title" :class="{ 'text-danger-title': sellerStatus === 'expired' }">
                <i class="bi bi-patch-check-fill text-green me-1" v-if="sellerStatus !== 'expired'"></i>
                <i class="bi bi-shield-exclamation text-danger me-1" v-else></i>
                สิทธิ์ผู้ขายร้านค้า TaradKU Pro Seller
              </h3>
              <p class="renewal-desc" v-if="sellerStatus !== 'expired'">โควตาลงขายสินค้าไม่จำกัด · แสดงป้าย Verified Student Seller น่าเชื่อถือ · ระบบจัดการโปรโมชั่น</p>
              <p class="renewal-desc text-danger-desc" v-else>🚫 สิทธิ์การลงขายสินค้าใหม่และการโปรโมทร้านค้าถูกระงับชั่วคราว เนื่องจากเลยกำหนดชำระค่าสมาชิกเมื่อ 23 ก.ค. 2026 กรุณาต่ออายุเพื่อเปิดใช้งาน</p>
            </div>
            <button class="btn" :class="sellerStatus === 'expired' ? 'btn-danger-btn' : 'btn-warning-btn'" @click="showRenewModal = true" id="renew-btn">
              <i class="bi bi-lightning-charge-fill me-1"></i> {{ sellerStatus === 'expired' ? 'ชำระเงินเพื่อปลดล็อก (99฿)' : 'ต่ออายุการขาย (99฿ / เดือน)' }}
            </button>
          </div>

          <!-- Mockup Simulation Switcher -->
          <div class="mockup-sim-bar card" v-if="isSeller">
            <div class="sim-label"><i class="bi bi-joystick me-1 text-green"></i> <strong>Mockup Simulation:</strong> จำลองทดสอบสถานะสิทธิ์ผู้ขาย</div>
            <div class="sim-btn-group">
              <button class="btn btn-xs" :class="sellerStatus === 'expiring_23' ? 'btn-sim-active' : 'btn-outline'" @click="sellerStatus = 'expiring_23'">
                ⏳ ครบกำหนด 23 ก.ค.
              </button>
              <button class="btn btn-xs" :class="sellerStatus === 'expired' ? 'btn-sim-danger' : 'btn-outline'" @click="sellerStatus = 'expired'">
                ❌ จำลองเมื่อหมดอายุ (Expired)
              </button>
              <button class="btn btn-xs" :class="sellerStatus === 'active' ? 'btn-sim-success' : 'btn-outline'" @click="sellerStatus = 'active'">
                🟢 ต่ออายุแล้ว (Active)
              </button>
            </div>
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

    <!-- Renew Membership Modal -->
    <Transition name="fade">
      <div class="renew-modal-overlay" v-if="showRenewModal" @click.self="showRenewModal = false">
        <div class="renew-modal card">
          <div class="modal-header">
            <div>
              <h3 class="modal-title"><i class="bi bi-patch-check-fill text-green me-2"></i> ต่ออายุสมาชิกผู้ขาย TaradKU Pro</h3>
              <p class="modal-subtitle">รักษาสิทธิ์การลงขาย และเพิ่มความน่าเชื่อถือให้กับร้านค้าของคุณในมหาวิทยาลัย</p>
            </div>
            <button class="btn-close-modal" @click="showRenewModal = false" id="close-renew-modal"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="modal-body">
            <div class="renew-price-box">
              <div class="price-val">99 บาท</div>
              <div class="price-period">/ เดือน (ต่ออายุสิทธิ์ 30 วัน)</div>
            </div>

            <div class="renew-perks">
              <div class="perk-item"><i class="bi bi-check-circle-fill text-green"></i> <span>ลงขายสินค้าได้ไม่จำกัดจำนวนชิ้น พร้อมระบบจัดการออเดอร์</span></div>
              <div class="perk-item"><i class="bi bi-check-circle-fill text-green"></i> <span>แสดงป้าย <strong>✓ Verified Student Seller</strong> โดดเด่นเหนือใคร</span></div>
              <div class="perk-item"><i class="bi bi-check-circle-fill text-green"></i> <span>สร้างโค้ดส่วนลด และร่วมแคมเปญ Flash Sale ของมหาวิทยาลัย</span></div>
            </div>

            <div class="form-group" style="margin-top: 18px;">
              <label class="form-label">เลือกช่องทางชำระเงิน (Payment Method)</label>
              <div class="pay-methods-grid">
                <label class="pay-option" :class="{ selected: renewPaymentMethod === 'PromptPay' }">
                  <input type="radio" v-model="renewPaymentMethod" value="PromptPay" />
                  <i class="bi bi-qr-code-scan pay-icon"></i>
                  <span>PromptPay QR</span>
                </label>
                <label class="pay-option" :class="{ selected: renewPaymentMethod === 'CreditCard' }">
                  <input type="radio" v-model="renewPaymentMethod" value="CreditCard" />
                  <i class="bi bi-credit-card pay-icon"></i>
                  <span>Credit Card</span>
                </label>
                <label class="pay-option" :class="{ selected: renewPaymentMethod === 'MobileBanking' }">
                  <input type="radio" v-model="renewPaymentMethod" value="MobileBanking" />
                  <i class="bi bi-phone pay-icon"></i>
                  <span>Mobile Banking</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-ghost" @click="showRenewModal = false">ยกเลิก</button>
            <button class="btn btn-primary btn-lg" @click="handleConfirmRenew" id="confirm-pay-renew-btn">
              <i class="bi bi-shield-lock-fill me-1"></i> ชำระเงิน 99 บาท & ต่ออายุทันที
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

/* Renewal Modal */
.renew-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.renew-modal {
  width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
  background: #fff; border-radius: var(--radius-xl); box-shadow: 0 20px 40px rgba(0,0,0,0.25);
  display: flex; flex-direction: column;
}
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
.modal-title { font-size: 17px; font-weight: 700; display: flex; align-items: center; }
.modal-subtitle { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.btn-close-modal { background: var(--bg-page); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all 0.15s; }
.btn-close-modal:hover { background: var(--border); color: var(--text-primary); }
.modal-body { padding: 20px 24px; flex: 1; }

.renew-price-box { text-align: center; background: var(--green-50); border: 2px solid var(--green-300); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; }
.price-val { font-size: 36px; font-weight: 800; color: var(--green-700); line-height: 1; }
.price-period { font-size: 13px; color: var(--green-800); font-weight: 600; margin-top: 4px; }

.renew-perks { display: flex; flex-direction: column; gap: 10px; background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px; }
.perk-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--text-primary); line-height: 1.4; }
.perk-item i { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

.pay-methods-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; }
.pay-option { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; font-size: 12px; font-weight: 600; text-align: center; }
.pay-option input { display: none; }
.pay-option:hover { border-color: var(--green-400); background: var(--green-50); }
.pay-option.selected { border-color: var(--green-600); background: var(--green-50); color: var(--green-700); }
.pay-icon { font-size: 22px; color: var(--green-600); }

.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border); background: var(--bg-page); border-radius: 0 0 var(--radius-xl) var(--radius-xl); }

@media (max-width: 768px) {
  .profile-page { padding: 16px; }
  .profile-layout { grid-template-columns: 1fr; }
  .listings-grid { grid-template-columns: repeat(2, 1fr); }
  .pay-methods-grid { grid-template-columns: 1fr; }
}
</style>
