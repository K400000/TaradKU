<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { appState, addToCart, startConversation } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const product = computed(() => appState.products.find(p => p.id === route.params.id))
const relatedProducts = computed(() => appState.products.filter(p => p.category === product.value?.category && p.id !== product.value?.id).slice(0, 4))

const added = ref(false)
const activeImg = ref(0)

const CATEGORY_ICONS = { Electronics: 'bi-cpu', Books: 'bi-book', Fashion: 'bi-bag', Accessories: 'bi-backpack', Stationery: 'bi-pencil', Housing: 'bi-house', Sports: 'bi-trophy', default: 'bi-box-seam' }
function getIcon(cat) { return CATEGORY_ICONS[cat] || CATEGORY_ICONS.default }
function formatPrice(n) { return n?.toLocaleString('th-TH') || '0' }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '' }

const sellerUser = computed(() => appState.users.find(u => u.id === product.value?.sellerId))

function handleAddToCart() {
  addToCart(product.value)
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
}

function handleBuyNow() {
  addToCart(product.value)
  router.push('/cart')
}

function handleChat() {
  startConversation(product.value)
  router.push('/messages')
}
</script>

<template>
  <div>
    <AppTopBar />

    <div class="detail-page" v-if="product">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <RouterLink to="/home">Home</RouterLink>
        <i class="bi bi-chevron-right bc-sep"></i>
        <RouterLink to="/products">{{ product.category }}</RouterLink>
        <i class="bi bi-chevron-right bc-sep"></i>
        <span>{{ product.title }}</span>
      </div>

      <div class="detail-layout">
        <!-- Left: Images -->
        <div class="detail-media">
          <!-- Main mockup image -->
          <div class="main-img">
            <div class="product-mockup main-mockup">
              <i :class="['bi', getIcon(product.category)]"></i>
              <span class="mockup-label">{{ product.category }}</span>
            </div>
            <span v-if="product.verified" class="verified-overlay">
              <i class="bi bi-patch-check-fill"></i> Verified Student
            </span>
          </div>

          <!-- Thumb Strip -->
          <div class="thumb-strip">
            <div v-for="i in 3" :key="i" class="thumb" :class="{ 'thumb-active': activeImg === i-1 }" @click="activeImg = i-1">
              <i :class="['bi', getIcon(product.category)]"></i>
            </div>
          </div>

          <!-- Map placeholder -->
          <div class="map-placeholder">
            <i class="bi bi-geo-alt map-pin-icon"></i>
            <div class="map-label">Meeting spot map</div>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="detail-info">
          <div class="detail-header">
            <span class="detail-category">{{ product.category }}</span>
            <span class="badge badge-green">{{ product.condition }}</span>
          </div>
          <h1 class="detail-title">{{ product.title }}</h1>

          <div class="detail-pricing">
            <span class="detail-price">฿{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="detail-original">฿{{ formatPrice(product.originalPrice) }}</span>
            <span v-if="product.originalPrice" class="detail-discount">
              {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% off
            </span>
          </div>

          <div class="detail-rating">
            <i class="bi bi-star-fill text-yellow"></i>
            <i class="bi bi-star-fill text-yellow"></i>
            <i class="bi bi-star-fill text-yellow"></i>
            <i class="bi bi-star-fill text-yellow"></i>
            <i class="bi bi-star-fill text-yellow"></i>
            <span class="rating-count">({{ product.favorites }} saved)</span>
          </div>

          <!-- CTA Buttons -->
          <div class="detail-ctas">
            <button class="btn btn-primary btn-lg" style="flex: 1;" @click="handleBuyNow" id="buy-now-btn">
              <i class="bi bi-lightning-charge-fill"></i> Buy Now
            </button>
            <button class="btn btn-outline btn-lg" style="flex: 1;" @click="handleAddToCart" :class="{ 'btn-added': added }" id="add-to-cart-btn">
              <i :class="added ? 'bi bi-check-circle-fill' : 'bi bi-cart-plus'"></i>
              {{ added ? 'Added!' : 'Add to Cart' }}
            </button>
          </div>
          <button class="btn btn-ghost btn-full" style="margin-top: 8px;" id="wishlist-btn">
            <i class="bi bi-heart"></i> Add to Wishlist
          </button>

          <!-- Seller Info -->
          <div class="seller-card">
            <div class="seller-card-left">
              <div class="avatar avatar-lg" :style="{ background: sellerUser?.avatarColor || '#15803d' }">
                {{ product.sellerAvatar }}
              </div>
              <div>
                <div class="seller-name">{{ product.sellerName }}</div>
                <div class="verified-badge" v-if="product.sellerVerified">
                  <i class="bi bi-patch-check-fill"></i> Verified Student
                </div>
                <div class="seller-meta">
                  <span><i class="bi bi-star-fill text-yellow"></i> {{ product.sellerRating }}</span>
                  <span>·</span>
                  <span>Joined {{ formatDate(sellerUser?.joinedDate) }}</span>
                </div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" @click="handleChat" id="chat-btn">
              <i class="bi bi-chat-dots"></i> Chat
            </button>
          </div>

          <!-- Description -->
          <div class="detail-desc">
            <h3 class="desc-title">Item Description</h3>
            <div class="desc-body" v-html="product.description?.replace(/\n/g, '<br/>')"></div>
          </div>

          <!-- Meeting Locations -->
          <div class="meeting-locs" v-if="product.meetingLocations?.length">
            <h3 class="desc-title">Meeting Locations</h3>
            <div v-for="loc in product.meetingLocations" :key="loc" class="loc-item">
              <i class="bi bi-geo-alt-fill loc-pin"></i>
              <span>{{ loc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="related-section" v-if="relatedProducts.length">
        <div class="section-header">
          <h2 class="section-title">Similar Listings</h2>
          <RouterLink to="/products" class="view-all">View All <i class="bi bi-arrow-right"></i></RouterLink>
        </div>
        <div class="related-grid">
          <ProductCard v-for="p in relatedProducts" :key="p.id" :product="p" compact />
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <i class="bi bi-search empty-icon"></i>
      <div class="empty-title">ไม่พบสินค้า</div>
      <button class="btn btn-primary" @click="$router.push('/products')">Browse Products</button>
    </div>
  </div>
</template>

<style scoped>
.detail-page { padding-bottom: 40px; }
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); padding: 14px 28px 0; }
.breadcrumb a { color: var(--green-600); text-decoration: none; }
.bc-sep { font-size: 10px; color: var(--text-muted); }

.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 20px 28px; }

.detail-media { display: flex; flex-direction: column; gap: 12px; }
.main-img { position: relative; }
.main-mockup { height: 360px; aspect-ratio: unset; border-radius: var(--radius-lg); }
.main-mockup i { font-size: 6rem; }
.verified-overlay {
  position: absolute; top: 12px; left: 12px;
  background: rgba(21,128,61,.9); color: #fff;
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px;
  display: flex; align-items: center; gap: 5px;
}
.thumb-strip { display: flex; gap: 8px; }
.thumb {
  width: 64px; height: 64px;
  border: 2px solid var(--border); border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; background: #fff; cursor: pointer; transition: border-color 0.15s;
  color: var(--text-muted);
}
.thumb-active { border-color: var(--green-600); color: var(--green-600); }
.map-placeholder {
  background: var(--bg-page); border: 1px solid var(--border);
  border-radius: var(--radius-lg); height: 140px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  color: var(--text-muted);
}
.map-pin-icon { font-size: 32px; }
.map-label { font-size: 13px; }

.detail-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.detail-category { font-size: 12px; font-weight: 600; color: var(--green-600); text-transform: uppercase; letter-spacing: 0.5px; }
.detail-title { font-size: 24px; font-weight: 800; line-height: 1.3; margin-bottom: 12px; }
.detail-pricing { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
.detail-price { font-size: 28px; font-weight: 800; }
.detail-original { font-size: 16px; color: var(--text-muted); text-decoration: line-through; }
.detail-discount { font-size: 13px; font-weight: 700; color: #dc2626; background: #fee2e2; padding: 2px 8px; border-radius: 20px; }
.detail-rating { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; display: flex; align-items: center; gap: 4px; }
.rating-count { margin-left: 4px; }
.text-yellow { color: #f59e0b; }

.detail-ctas { display: flex; gap: 10px; margin-bottom: 8px; }
.btn-added { background: var(--green-700) !important; border-color: var(--green-700) !important; color: #fff !important; }

.seller-card {
  background: var(--bg-page); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 16px 0;
}
.seller-card-left { display: flex; align-items: center; gap: 12px; }
.seller-name { font-size: 14px; font-weight: 700; }
.seller-meta { font-size: 12px; color: var(--text-secondary); display: flex; gap: 6px; margin-top: 2px; align-items: center; }

.detail-desc { margin-bottom: 16px; }
.desc-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; }
.desc-body { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

.meeting-locs { margin-bottom: 16px; }
.loc-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-secondary); padding: 6px 0; border-bottom: 1px solid var(--border-light); }
.loc-pin { color: var(--green-600); }

.related-section { padding: 0 28px 32px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { font-size: 18px; font-weight: 700; }
.view-all { font-size: 13px; color: var(--green-600); font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; }
.related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }

@media (max-width: 768px) {
  .detail-layout { grid-template-columns: 1fr; padding: 16px; }
  .related-section { padding: 0 16px 24px; }
  .detail-title { font-size: 20px; }
  .detail-price { font-size: 24px; }
  .main-mockup { height: 240px; }
  .main-mockup i { font-size: 4rem; }
}
</style>
