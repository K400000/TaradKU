<script setup>
import { useRouter } from 'vue-router'
import { addToCart } from '../stores/app.js'

const props = defineProps({
  product: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

const router = useRouter()

const CATEGORY_ICONS = {
  Electronics: '💻',
  Books: '📚',
  Fashion: '👕',
  Accessories: '🎒',
  Stationery: '✏️',
  Housing: '🏠',
  Sports: '⚽',
  default: '📦',
}

function getIcon(category) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default
}

function formatPrice(n) {
  return n.toLocaleString('th-TH')
}

function timeAgo(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

function handleAddToCart(e) {
  e.stopPropagation()
  e.preventDefault()
  addToCart(props.product)
}
</script>

<template>
  <RouterLink :to="`/products/${product.id}`" class="product-card" :class="{ compact }">
    <!-- Image/Icon -->
    <div class="card-img">
      <div class="product-icon-wrap">
        {{ getIcon(product.category) }}
      </div>
      <div class="card-badges">
        <span v-if="product.verified" class="badge badge-green card-badge">✓ Verified</span>
        <span v-if="product.condition === 'Like New'" class="badge badge-blue card-badge">Like New</span>
      </div>
      <button class="wishlist-btn" @click.prevent.stop>♡</button>
    </div>

    <!-- Content -->
    <div class="card-body">
      <div class="card-category">{{ product.category }}</div>
      <div class="card-title">{{ product.title }}</div>

      <div class="card-price-row">
        <span class="card-price">฿{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="card-original">฿{{ formatPrice(product.originalPrice) }}</span>
      </div>

      <div class="card-meta">
        <div class="card-seller">
          <div class="avatar avatar-sm" style="background: #15803d;">{{ product.sellerAvatar }}</div>
          <span>{{ product.sellerName }}</span>
          <span v-if="product.sellerVerified" class="seller-check">✓</span>
        </div>
        <span class="card-time">{{ timeAgo(product.postedAt) }}</span>
      </div>

      <button v-if="!compact" class="btn btn-primary btn-sm add-cart-btn" @click="handleAddToCart">
        🛒 Add to Cart
      </button>
    </div>
  </RouterLink>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.card-img {
  position: relative;
  background: var(--bg-page);
  aspect-ratio: 1;
  overflow: hidden;
}
.card-img .product-icon-wrap {
  width: 100%; height: 100%;
  aspect-ratio: unset;
  font-size: 3.5rem;
  border-radius: 0;
}
.card-badges {
  position: absolute;
  top: 8px; left: 8px;
  display: flex; flex-direction: column; gap: 4px;
}
.card-badge { font-size: 10px; padding: 2px 6px; }
.wishlist-btn {
  position: absolute;
  top: 8px; right: 8px;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,.9);
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.wishlist-btn:hover { background: #fff; color: #dc2626; transform: scale(1.1); }

.card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.card-category { font-size: 11px; color: var(--green-600); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.card-title { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-price-row { display: flex; align-items: baseline; gap: 6px; margin-top: 2px; }
.card-price { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.card-original { font-size: 12px; color: var(--text-muted); text-decoration: line-through; }

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.card-seller {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}
.seller-check { color: var(--green-600); font-size: 10px; }
.card-time { font-size: 11px; color: var(--text-muted); }

.add-cart-btn { margin-top: 8px; width: 100%; }

.compact .card-img { aspect-ratio: 4/3; }
.compact .product-icon-wrap { font-size: 2.5rem; }
</style>
