<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, cartTotal, removeFromCart, updateCartQty } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()

const groupedBySeller = computed(() => {
  const map = {}
  for (const item of appState.cart) {
    if (!map[item.sellerId]) map[item.sellerId] = { sellerName: item.sellerName, sellerVerified: item.sellerVerified, items: [] }
    map[item.sellerId].items.push(item)
  }
  return Object.values(map)
})

function formatPrice(n) { return n.toLocaleString('th-TH') }
</script>

<template>
  <div>
    <AppTopBar title="Shopping Cart" :show-search="false" />
    <div class="cart-page">

      <!-- Empty State -->
      <div class="empty-state" v-if="appState.cart.length === 0">
        <i class="bi bi-cart-x empty-icon"></i>
        <div class="empty-title">ตะกร้าว่างเปล่า</div>
        <div class="empty-desc">เลือกซื้อสินค้าก่อนนะคะ</div>
        <RouterLink to="/products" class="btn btn-primary" id="browse-products-btn">
          <i class="bi bi-bag"></i> Browse Products
        </RouterLink>
      </div>

      <div class="cart-layout" v-else>
        <!-- Cart Items -->
        <div class="cart-items">
          <p class="cart-subtitle">You have {{ appState.cart.length }} items selected from fellow students.</p>

          <div v-for="group in groupedBySeller" :key="group.sellerName" class="seller-group card">
            <div class="seller-group-header">
              <div class="seller-tag">
                <i class="bi bi-shop seller-icon"></i>
                <span class="seller-name">Seller: {{ group.sellerName }}</span>
                <span v-if="group.sellerVerified" class="verified-badge">
                  <i class="bi bi-patch-check-fill"></i> Verified
                </span>
              </div>
            </div>

            <div class="cart-item" v-for="item in group.items" :key="item.productId">
              <!-- Mockup thumbnail -->
              <div class="item-thumb">
                <i class="bi bi-box-seam"></i>
              </div>
              <div class="item-info">
                <RouterLink :to="`/products/${item.productId}`" class="item-title">{{ item.title }}</RouterLink>
                <div class="item-price">฿{{ formatPrice(item.price) }}</div>
              </div>
              <div class="item-qty">
                <button class="qty-btn" @click="updateCartQty(item.productId, item.quantity - 1)" :id="`qty-dec-${item.productId}`">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="qty-val">{{ item.quantity }}</span>
                <button class="qty-btn" @click="updateCartQty(item.productId, item.quantity + 1)" :id="`qty-inc-${item.productId}`">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              <div class="item-total">฿{{ formatPrice(item.price * item.quantity) }}</div>
              <button class="remove-btn" @click="removeFromCart(item.productId)" :id="`remove-${item.productId}`">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>

          <RouterLink to="/products" class="continue-link">
            <i class="bi bi-arrow-left"></i> Continue Shopping at TaradKU
          </RouterLink>
        </div>

        <!-- Order Summary -->
        <div class="order-summary card card-pad">
          <h3 class="summary-title">Order Summary</h3>

          <div class="summary-row">
            <span>Subtotal ({{ appState.cart.length }} items)</span>
            <span>฿{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="summary-row">
            <span><i class="bi bi-geo-alt"></i> Campus Pickup</span>
            <span class="text-green">FREE</span>
          </div>
          <div class="summary-row">
            <span>Service Fee</span>
            <span>฿0</span>
          </div>
          <hr class="divider" style="margin: 12px 0;" />
          <div class="summary-total">
            <span>Total</span>
            <span class="total-price">฿{{ formatPrice(cartTotal) }}</span>
          </div>

          <button class="btn btn-primary btn-full btn-lg" @click="$router.push('/checkout')" style="margin-top: 16px;" id="checkout-btn">
            <i class="bi bi-bag-check"></i> Checkout Now
          </button>

          <div class="safety-notice">
            <i class="bi bi-shield-check safety-icon"></i>
            <div>
              <div class="safety-title">Campus Safety Notice</div>
              <div class="safety-desc">We recommend meeting in well-lit campus areas like the main library or faculty hubs. Always verify the item condition before completing payment.</div>
            </div>
          </div>

          <div class="promo-section">
            <label class="form-label">Apply Promo Code</label>
            <div class="promo-input-row">
              <input class="form-input" type="text" placeholder="KU-2024" id="promo-input-cart" />
              <button class="btn btn-outline btn-sm" id="apply-promo-cart">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page { padding: 20px 28px 40px; }
.cart-subtitle { font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; }
.cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start; }

.seller-group { margin-bottom: 16px; overflow: visible; }
.seller-group-header { padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--bg-page); }
.seller-tag { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
.seller-icon { color: var(--green-600); font-size: 16px; }

.cart-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--border-light); }
.cart-item:last-child { border-bottom: none; }
.item-thumb {
  width: 56px; height: 56px;
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; color: #d1d5db; flex-shrink: 0;
}
.item-info { flex: 1; min-width: 0; }
.item-title { font-size: 13px; font-weight: 600; color: var(--text-primary); text-decoration: none; display: block; margin-bottom: 4px; }
.item-title:hover { color: var(--green-600); }
.item-price { font-size: 14px; font-weight: 700; color: var(--green-700); }

.item-qty { display: flex; align-items: center; gap: 8px; }
.qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--border); background: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.qty-btn:hover { border-color: var(--green-500); color: var(--green-600); }
.qty-val { font-size: 14px; font-weight: 700; min-width: 20px; text-align: center; }
.item-total { font-size: 15px; font-weight: 700; min-width: 80px; text-align: right; }
.remove-btn { font-size: 16px; color: #dc2626; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.15s; }
.remove-btn:hover { background: #fee2e2; }

.continue-link { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--green-600); text-decoration: none; margin-top: 12px; }
.continue-link:hover { text-decoration: underline; }

.summary-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; align-items: center; }
.summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; }
.total-price { font-size: 22px; color: var(--green-700); }

.safety-notice { display: flex; gap: 10px; background: var(--green-50); border: 1px solid var(--green-200); border-radius: var(--radius-md); padding: 12px; margin-top: 12px; align-items: flex-start; }
.safety-icon { font-size: 20px; color: var(--green-600); flex-shrink: 0; margin-top: 2px; }
.safety-title { font-size: 12px; font-weight: 700; color: var(--green-700); margin-bottom: 4px; }
.safety-desc { font-size: 11px; color: var(--text-secondary); line-height: 1.5; }

.promo-section { margin-top: 16px; }
.promo-input-row { display: flex; gap: 8px; margin-top: 6px; }

@media (max-width: 768px) {
  .cart-page { padding: 16px; }
  .cart-layout { grid-template-columns: 1fr; }
}
</style>
