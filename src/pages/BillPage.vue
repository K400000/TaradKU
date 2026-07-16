<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appState, cartTotal, applyPromoCode, placeOrder } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const router = useRouter()
const selectedPayment = ref('PromptPay')
const promoCode = ref('')
const promoResult = ref(null)
const promoError = ref('')
const noteToSeller = ref('')

// Location Modal & State
const showLocationModal = ref(false)
const campusSpot = ref('Bar Mei (Cafeteria 1)')
const customLocation = ref('')
const specificDetails = ref('รอที่โต๊ะหินอ่อนหน้าประตูทางเข้าหลัก')
const contactPhone = ref('089-123-4567')

const spots = [
  { id: 'Bar Mei (Cafeteria 1)', name: 'Bar Mei (Cafeteria 1)', label: 'ศูนย์อาหารบาร์ใหม่', icon: 'bi-shop' },
  { id: 'Central Library', name: 'Central Library (หอสมุดกลาง)', label: 'หน้าทางเข้าหอสมุดกลาง', icon: 'bi-book' },
  { id: 'Engineering Building B', name: 'Engineering Building B', label: 'ใต้ตึกวิศวกรรมศาสตร์ B', icon: 'bi-building' },
  { id: 'Digital Gateway', name: 'Digital Gateway', label: 'อาคารเทคโนโลยีสารสนเทศ', icon: 'bi-laptop' },
  { id: 'Dormitory Area', name: 'Dormitory Area', label: 'บริเวณหอพักนิสิตใน มก.', icon: 'bi-house' },
  { id: 'Custom Location', name: 'Custom Location (ระบุสถานที่เอง)', label: 'พิมพ์จุดนัดรับเองภายใน มก.', icon: 'bi-geo-alt' },
]

const paymentMethods = [
  { id: 'PromptPay', icon: 'bi-qr-code-scan', name: 'PromptPay (QR Code)', desc: 'Instant student-to-student' },
  { id: 'BankTransfer', icon: 'bi-bank', name: 'Bank Transfer', desc: 'Direct bank account transfer' },
  { id: 'COD', icon: 'bi-cash-coin', name: 'Cash on Delivery (COD)', desc: 'Pay when you receive the item' },
]

const discount = computed(() => promoResult.value ? (promoResult.value.type === 'discount' ? promoResult.value.value : 0) : 0)
const finalTotal = computed(() => Math.max(0, cartTotal.value - discount.value))

const formattedPickupString = computed(() => {
  const spotName = campusSpot.value === 'Custom Location' ? (customLocation.value || 'ระบุจุดนัดพบเอง') : campusSpot.value
  const details = specificDetails.value ? ` · ${specificDetails.value}` : ''
  const phone = contactPhone.value ? ` (โทร: ${contactPhone.value})` : ''
  return `${spotName}${details}${phone}`
})

function handleApplyPromo() {
  promoError.value = ''
  const result = applyPromoCode(promoCode.value)
  if (result) { promoResult.value = result }
  else { promoError.value = 'รหัสส่วนลดไม่ถูกต้อง หรือไม่มีสิทธิ์ใช้' }
}

function handleConfirmOrder() {
  placeOrder(selectedPayment.value, formattedPickupString.value, promoCode.value, discount.value)
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
            <div class="section-header-row">
              <h3 class="section-title">
                <i class="bi bi-geo-alt-fill text-green"></i> จุดนัดรับสินค้า (Pickup Location)
              </h3>
              <button class="btn btn-outline btn-sm" @click="showLocationModal = true" id="change-location-btn">
                <i class="bi bi-pencil-square me-1"></i> เปลี่ยน / ระบุรายละเอียด
              </button>
            </div>

            <!-- Current Selected Location Card -->
            <div class="current-location-box" @click="showLocationModal = true">
              <div class="loc-icon-wrap"><i class="bi bi-geo-alt-fill"></i></div>
              <div class="loc-info-wrap">
                <div class="loc-main-title">{{ campusSpot === 'Custom Location' ? (customLocation || 'ระบุจุดนัดพบเอง') : campusSpot }}</div>
                <div class="loc-sub-details" v-if="specificDetails">
                  <i class="bi bi-info-circle me-1"></i> {{ specificDetails }}
                </div>
                <div class="loc-sub-phone" v-if="contactPhone">
                  <i class="bi bi-telephone me-1"></i> {{ contactPhone }}
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted ms-auto"></i>
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

    <!-- Location Selection Modal (Real-life App Style) -->
    <Transition name="fade">
      <div class="location-modal-overlay" v-if="showLocationModal" @click.self="showLocationModal = false">
        <div class="location-modal card">
          <div class="modal-header">
            <div>
              <h3 class="modal-title"><i class="bi bi-geo-alt-fill text-green me-2"></i> เลือกจุดนัดรับ & ระบุรายละเอียด</h3>
              <p class="modal-subtitle">เหมือนแอพเดลิเวอรี่ ปักหมุดหรือเขียนจุดสังเกตให้นัดเจอกันง่ายขึ้น</p>
            </div>
            <button class="btn-close-modal" @click="showLocationModal = false" id="close-location-modal"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">สถานที่นัดรับในมหาวิทยาลัย (Select Campus Spot)</label>
              <div class="spot-grid">
                <div
                  v-for="s in spots"
                  :key="s.id"
                  class="spot-card"
                  :class="{ active: campusSpot === s.id }"
                  @click="campusSpot = s.id"
                >
                  <div class="spot-icon"><i :class="['bi', s.icon]"></i></div>
                  <div class="spot-text">
                    <div class="spot-name">{{ s.name }}</div>
                    <div class="spot-label">{{ s.label }}</div>
                  </div>
                  <i class="bi bi-check-circle-fill spot-check" v-if="campusSpot === s.id"></i>
                </div>
              </div>
            </div>

            <!-- Custom Location Input if custom selected -->
            <div class="form-group" v-if="campusSpot === 'Custom Location'" style="margin-top: 14px;">
              <label class="form-label">ระบุจุดนัดพบเอง (Custom Location Name)</label>
              <input v-model="customLocation" class="form-input" placeholder="เช่น หน้าประตู 3 ฝั่งถนนวิภาวดี, ตึกกิจกรรมนิสิต..." />
            </div>

            <!-- Specific Details -->
            <div class="form-group" style="margin-top: 16px;">
              <label class="form-label">รายละเอียดเพิ่มเติม / จุดสังเกต (Note for Driver / Seller)</label>
              <textarea
                v-model="specificDetails"
                class="form-textarea"
                rows="2"
                placeholder="เช่น รอที่โต๊ะหินอ่อนตัวที่ 3 ข้างร้านน้ำปั่น, สวมเสื้อคลุมสีดำ, มาถึงแล้วโทรหาก่อน 5 นาที"
              ></textarea>
            </div>

            <!-- Phone Number -->
            <div class="form-group" style="margin-top: 16px;">
              <label class="form-label">เบอร์โทรศัพท์สำหรับติดต่อ (Contact Phone Number)</label>
              <div class="input-with-icon-wrap">
                <i class="bi bi-telephone input-icon"></i>
                <input v-model="contactPhone" class="form-input input-icon-pad" placeholder="08X-XXX-XXXX" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-ghost" @click="showLocationModal = false">ยกเลิก</button>
            <button class="btn btn-primary btn-lg" @click="showLocationModal = false" id="confirm-location-btn">
              <i class="bi bi-check2-circle me-1"></i> ยืนยันจุดนัดรับ
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bill-page { padding: 20px 28px 40px; }
.bill-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; }
.bill-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start; }
.bill-main { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.optional-tag { font-size: 12px; font-weight: 400; color: var(--text-muted); }
.section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }

/* Current Location Box */
.current-location-box {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border: 2px solid var(--border); border-radius: var(--radius-lg);
  cursor: pointer; transition: all 0.15s; background: #fff;
}
.current-location-box:hover { border-color: var(--green-400); background: var(--green-50); }
.loc-icon-wrap { width: 44px; height: 44px; border-radius: 50%; background: var(--green-100); color: var(--green-700); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.loc-info-wrap { flex: 1; min-width: 0; }
.loc-main-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px; }
.loc-sub-details { font-size: 13px; color: var(--text-secondary); margin-bottom: 2px; }
.loc-sub-phone { font-size: 12px; color: var(--text-muted); }

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

/* Modal */
.location-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.location-modal {
  width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
  background: #fff; border-radius: var(--radius-xl); box-shadow: 0 20px 40px rgba(0,0,0,0.25);
  display: flex; flex-direction: column;
}
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
.modal-title { font-size: 17px; font-weight: 700; display: flex; align-items: center; }
.modal-subtitle { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.btn-close-modal { background: var(--bg-page); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all 0.15s; }
.btn-close-modal:hover { background: var(--border); color: var(--text-primary); }
.modal-body { padding: 20px 24px; flex: 1; }
.spot-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 8px; }
.spot-card { display: flex; align-items: center; gap: 12px; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; background: #fff; }
.spot-card:hover { border-color: var(--green-400); background: var(--green-50); }
.spot-card.active { border-color: var(--green-600); background: var(--green-50); }
.spot-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-page); color: var(--green-600); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.spot-card.active .spot-icon { background: var(--green-600); color: #fff; }
.spot-text { flex: 1; min-width: 0; }
.spot-name { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.spot-label { font-size: 11px; color: var(--text-secondary); }
.spot-check { color: var(--green-600); font-size: 16px; flex-shrink: 0; }

.input-with-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 15px; }
.input-icon-pad { padding-left: 36px; }

.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border); background: var(--bg-page); border-radius: 0 0 var(--radius-xl) var(--radius-xl); }

@media (max-width: 768px) {
  .bill-page { padding: 16px; }
  .bill-layout { grid-template-columns: 1fr; }
  .spot-grid { grid-template-columns: 1fr; }
}
</style>
