<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, cartTotal, applyPromoCode, placeOrder } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()
const selectedPayment = ref('PromptPay')
const selectedLocation = ref('Bar Mei (Cafeteria 1)')
const promoCode = ref('')
const promoResult = ref(null)
const promoError = ref('')
const noteToSeller = ref('')

const locations = [
  'Bar Mei (Cafeteria 1)',
  'Central Library',
  'Engineering Building B',
  'Digital Gateway',
  'Dormitory Area',
]

const paymentMethods = [
  { id: 'PromptPay', icon: 'bi-qr-code-scan', name: 'PromptPay (QR Code)', desc: 'Instant student-to-student' },
  { id: 'BankTransfer', icon: 'bi-bank', name: 'Bank Transfer', desc: 'Direct bank account transfer' },
  { id: 'COD', icon: 'bi-cash-coin', name: 'Cash on Delivery (COD)', desc: 'Pay when you receive the item' },
]

const discount = computed(() => promoResult.value ? (promoResult.value.type === 'discount' ? promoResult.value.value : 0) : 0)
const finalTotal = computed(() => Math.max(0, cartTotal.value - discount.value))

function handleApplyPromo() {
  promoError.value = ''
  const result = applyPromoCode(promoCode.value)
  if (result) { promoResult.value = result }
  else { promoError.value = 'รหัสส่วนลดไม่ถูกต้อง หรือไม่มีสิทธิ์ใช้' }
}

function handleConfirmOrder() {
  placeOrder(selectedPayment.value, selectedLocation.value, promoCode.value, discount.value)
  router.push('/orders')
}
</script>

<template>
  <div>
    <AppTopBar title="ชำระเงิน" :show-search="false" />
    <div class="bill-page">
      <div class="bill-layout">
        <!-- Left: Details -->
        <div class="bill-main">
          <h1 class="page-title" style="margin-bottom: 4px;">Checkout</h1>
          <p class="bill-sub">Review your items and select your payment method.</p>

          <!-- Pickup Location -->
          <div class="bill-section card card-pad">
            <h3 class="section-title">
              <i class="bi bi-geo-alt-fill text-green"></i> Pickup Location
            </h3>
            <div class="form-group" style="margin-top: 12px;">
              <label class="form-label" for="pickup-location">Campus Meeting Spot</label>
              <select v-model="selectedLocation" class="form-select" id="pickup-location">
                <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>
            <div class="meeting-tip">
              <i class="bi bi-info-circle-fill tip-icon"></i>
              <p><strong>Meeting Instructions</strong><br/>Sellers usually wait near the front entrance. Please bring your student ID card to verify the transaction.</p>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bill-section card card-pad">
            <h3 class="section-title">
              <i class="bi bi-credit-card text-green"></i> Payment Method
            </h3>
            <div class="payment-options">
              <label
                v-for="pm in paymentMethods"
                :key="pm.id"
                class="payment-opt"
                :class="{ selected: selectedPayment === pm.id }"
              >
                <input type="radio" v-model="selectedPayment" :value="pm.id" :id="`pay-${pm.id}`" name="payment" />
                <div class="pay-icon"><i :class="['bi', pm.icon]"></i></div>
                <div>
                  <div class="pay-name">{{ pm.name }}</div>
                  <div class="pay-desc">{{ pm.desc }}</div>
                </div>
                <i v-if="selectedPayment === pm.id" class="bi bi-check-circle-fill pay-check"></i>
              </label>
            </div>
          </div>

          <!-- Note to Seller -->
          <div class="bill-section card card-pad">
            <h3 class="section-title">
              <i class="bi bi-chat-left-text text-green"></i> Note to Seller <span class="optional-tag">(Optional)</span>
            </h3>
            <textarea v-model="noteToSeller" class="form-textarea" placeholder="e.g. I will be wearing a green jacket." style="margin-top: 12px;" id="note-to-seller"></textarea>
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="bill-summary card card-pad">
          <div class="summary-badge">
            <i class="bi bi-shield-check"></i> Campus Secure Transaction
          </div>
          <h3 class="summary-title">Order Summary</h3>

          <!-- Items -->
          <div class="summary-items">
            <div class="summary-item" v-for="item in appState.cart" :key="item.productId">
              <div class="sum-item-icon"><i class="bi bi-box-seam"></i></div>
              <div class="sum-item-info">
                <div class="sum-item-title">{{ item.title }}</div>
                <div class="sum-item-meta">x{{ item.quantity }}</div>
              </div>
              <div class="sum-item-price">฿{{ (item.price * item.quantity).toLocaleString('th-TH') }}</div>
            </div>
          </div>

          <hr class="divider" style="margin: 12px 0;" />

          <!-- Promo Code -->
          <div class="promo-row">
            <input v-model="promoCode" class="form-input" type="text" placeholder="Promo code e.g. KU2024" id="promo-code-input" />
            <button class="btn btn-outline btn-sm" @click="handleApplyPromo" id="apply-promo-btn">Apply</button>
          </div>
          <div v-if="promoResult" class="promo-success">
            <i class="bi bi-check-circle-fill"></i> {{ promoResult.description }}
          </div>
          <div v-if="promoError" class="promo-error">
            <i class="bi bi-x-circle-fill"></i> {{ promoError }}
          </div>

          <hr class="divider" style="margin: 12px 0;" />

          <div class="sum-row">
            <span>Subtotal</span>
            <span>฿{{ cartTotal.toLocaleString('th-TH') }}</span>
          </div>
          <div class="sum-row">
            <span>Shipping</span>
            <span class="text-green">฿0 (Campus Pickup)</span>
          </div>
          <div class="sum-row" v-if="discount > 0">
            <span>Discount</span>
            <span class="text-green">-฿{{ discount.toLocaleString('th-TH') }}</span>
          </div>

          <div class="sum-total">
            <span>Total Amount</span>
            <span class="total-price">฿{{ finalTotal.toLocaleString('th-TH') }}</span>
          </div>

          <button
            class="btn btn-primary btn-full btn-lg"
            style="margin-top: 16px;"
            @click="handleConfirmOrder"
            :disabled="appState.cart.length === 0"
            id="confirm-order-btn"
          >
            <i class="bi bi-bag-check-fill"></i> Confirm Order
          </button>

          <p class="confirm-note">By clicking Confirm Order, you agree to TaradKU Campus Secure Transaction Policies.</p>

          <div class="trust-badges">
            <div class="trust-badge"><i class="bi bi-patch-check-fill text-green"></i> Verified Sellers</div>
            <div class="trust-badge"><i class="bi bi-shield-fill-check text-green"></i> Fraud Protection</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bill-page { padding: 20px 28px 40px; }
.bill-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; }
.bill-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start; }
.bill-main { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.optional-tag { font-size: 12px; font-weight: 400; color: var(--text-muted); }

.meeting-tip { display: flex; gap: 8px; background: var(--green-50); border: 1px solid var(--green-200); border-radius: var(--radius-md); padding: 10px 12px; margin-top: 12px; font-size: 12px; color: var(--text-secondary); line-height: 1.5; align-items: flex-start; }
.tip-icon { color: var(--green-600); font-size: 14px; flex-shrink: 0; margin-top: 2px; }

.payment-options { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.payment-opt { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; }
.payment-opt input { display: none; }
.payment-opt:hover { border-color: var(--green-400); background: var(--green-50); }
.payment-opt.selected { border-color: var(--green-600); background: var(--green-50); }
.pay-icon { font-size: 22px; color: var(--green-600); }
.pay-name { font-size: 14px; font-weight: 600; }
.pay-desc { font-size: 12px; color: var(--text-secondary); }
.pay-check { margin-left: auto; color: var(--green-600); font-size: 18px; }

/* Summary */
.summary-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--green-50); color: var(--green-700); border: 1px solid var(--green-200); font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px; margin-bottom: 14px; }
.summary-title { font-size: 16px; font-weight: 700; margin-bottom: 14px; }
.summary-items { display: flex; flex-direction: column; gap: 10px; }
.summary-item { display: flex; align-items: center; gap: 10px; }
.sum-item-icon { width: 40px; height: 40px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #d1d5db; flex-shrink: 0; }
.sum-item-info { flex: 1; min-width: 0; }
.sum-item-title { font-size: 12px; font-weight: 600; line-height: 1.3; }
.sum-item-meta { font-size: 11px; color: var(--text-muted); }
.sum-item-price { font-size: 13px; font-weight: 700; }
.promo-row { display: flex; gap: 8px; }
.promo-success { font-size: 12px; color: var(--green-600); font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 5px; }
.promo-error { font-size: 12px; color: #dc2626; margin-top: 4px; display: flex; align-items: center; gap: 5px; }
.sum-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; }
.sum-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; padding-top: 8px; }
.total-price { font-size: 22px; color: var(--text-primary); }
.confirm-note { font-size: 10px; color: var(--text-muted); text-align: center; margin-top: 8px; line-height: 1.4; }
.trust-badges { display: flex; gap: 16px; justify-content: center; margin-top: 12px; }
.trust-badge { font-size: 11px; color: var(--green-700); font-weight: 600; display: flex; align-items: center; gap: 4px; }

@media (max-width: 768px) {
  .bill-page { padding: 16px; }
  .bill-layout { grid-template-columns: 1fr; }
}
</style>
