<script setup>
import { ref, computed } from 'vue'
import { appState, addPromotion } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const showForm = ref(false)
const form = ref({ code: '', type: 'discount', value: '', description: '', minOrder: '', expiresAt: '' })

const myPromos = computed(() => appState.promotions.filter(p => p.sellerId === appState.currentUser?.id))

function handleAdd() {
  if (!form.value.code || !form.value.value) return
  addPromotion({
    code: form.value.code.toUpperCase(),
    type: form.value.type,
    value: Number(form.value.value),
    description: form.value.description || `${form.value.type === 'discount' ? 'ลด' : 'ส่งฟรี'} ${form.value.value} บาท`,
    minOrder: Number(form.value.minOrder || 0),
    expiresAt: form.value.expiresAt || '2026-12-31',
  })
  form.value = { code: '', type: 'discount', value: '', description: '', minOrder: '', expiresAt: '' }
  showForm.value = false
}

function togglePromo(promo) { promo.active = !promo.active }
</script>

<template>
  <div>
    <AppTopBar title="โปรโมชั่น" :show-search="false" />
    <div class="promo-page">
      <div class="promo-header">
        <div>
          <h1 class="page-title"><i class="bi bi-gift text-green"></i> โปรโมชั่น & ส่วนลด</h1>
          <p class="page-subtitle">สร้างโค้ดส่วนลดและ Flash Sale สำหรับร้านของคุณ</p>
        </div>
        <button class="btn btn-primary" @click="showForm = !showForm" id="create-promo-btn">
          <i :class="showForm ? 'bi bi-x-lg' : 'bi bi-plus-circle'"></i>
          {{ showForm ? 'ยกเลิก' : 'สร้างโปรโมชั่น' }}
        </button>
      </div>

      <!-- Create Form -->
      <Transition name="fade">
        <div class="promo-form card card-pad" v-if="showForm">
          <h3 style="margin-bottom: 16px;">สร้างโปรโมชั่นใหม่</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="promo-code">Promo Code</label>
              <input id="promo-code" v-model="form.code" class="form-input" placeholder="e.g. SUMMER50" style="text-transform: uppercase;" />
            </div>
            <div class="form-group">
              <label class="form-label" for="promo-type">ประเภท</label>
              <select id="promo-type" v-model="form.type" class="form-select">
                <option value="discount">ส่วนลด (บาท)</option>
                <option value="freeship">ส่งฟรี</option>
              </select>
            </div>
            <div class="form-group" v-if="form.type === 'discount'">
              <label class="form-label" for="promo-val">มูลค่าส่วนลด (฿)</label>
              <input id="promo-val" v-model="form.value" class="form-input" type="number" placeholder="100" />
            </div>
            <div class="form-group">
              <label class="form-label" for="promo-min">ขั้นต่ำ (฿)</label>
              <input id="promo-min" v-model="form.minOrder" class="form-input" type="number" placeholder="0" />
            </div>
            <div class="form-group">
              <label class="form-label" for="promo-exp">วันหมดอายุ</label>
              <input id="promo-exp" v-model="form.expiresAt" class="form-input" type="date" />
            </div>
            <div class="form-group" style="grid-column: 1/-1;">
              <label class="form-label" for="promo-desc">คำอธิบาย</label>
              <input id="promo-desc" v-model="form.description" class="form-input" placeholder="e.g. ลด 100 บาท สำหรับนิสิตปี 1" />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-ghost" @click="showForm = false" id="cancel-promo-btn">ยกเลิก</button>
            <button class="btn btn-primary" @click="handleAdd" id="save-promo-btn">สร้างโปรโมชั่น</button>
          </div>
        </div>
      </Transition>

      <!-- Promo List -->
      <div class="empty-state" v-if="myPromos.length === 0">
        <i class="bi bi-gift empty-icon"></i>
        <div class="empty-title">ยังไม่มีโปรโมชั่น</div>
        <div class="empty-desc">สร้างโค้ดส่วนลดเพื่อดึงดูดลูกค้า</div>
        <button class="btn btn-primary" @click="showForm = true" id="create-first-promo-btn">
          <i class="bi bi-plus-circle"></i> สร้างโปรโมชั่นแรก
        </button>
      </div>

      <div class="promos-grid" v-else>
        <div class="promo-card card" v-for="promo in myPromos" :key="promo.code">
          <div class="promo-card-top">
            <div class="promo-code-badge" :class="promo.active ? 'active' : 'inactive'">
              {{ promo.code }}
            </div>
            <label class="toggle-label">
              <div class="toggle" :class="{ active: promo.active }" @click="togglePromo(promo)" :id="`toggle-${promo.code}`"></div>
            </label>
          </div>
          <div class="promo-val">
            <span v-if="promo.type === 'discount'"><i class="bi bi-tag-fill text-green"></i> ลด ฿{{ promo.value.toLocaleString('th-TH') }}</span>
            <span v-else><i class="bi bi-truck text-green"></i> ส่งฟรี</span>
          </div>
          <div class="promo-desc">{{ promo.description }}</div>
          <div class="promo-meta">
            <span><i class="bi bi-currency-dollar"></i> ขั้นต่ำ ฿{{ promo.minOrder }}</span>
            <span><i class="bi bi-person-check"></i> ใช้แล้ว {{ promo.usedCount }} ครั้ง</span>
            <span><i class="bi bi-calendar-event"></i> หมดอายุ {{ promo.expiresAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.promo-page { padding: 20px 28px 40px; }
.promo-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.promo-form { margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; }

.promos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.promo-card { padding: 20px; }
.promo-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.promo-code-badge { font-size: 18px; font-weight: 800; letter-spacing: 2px; padding: 6px 14px; border-radius: 8px; font-family: monospace; }
.promo-code-badge.active { background: var(--green-100); color: var(--green-800); }
.promo-code-badge.inactive { background: var(--border-light); color: var(--text-muted); }
.promo-val { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.promo-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; }
.promo-meta { display: flex; gap: 10px; font-size: 11px; color: var(--text-muted); flex-wrap: wrap; }
.promo-meta span { display: flex; align-items: center; gap: 4px; }

.toggle-label { cursor: pointer; }
.toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--border); position: relative; cursor: pointer; transition: background 0.2s; }
.toggle.active { background: var(--green-600); }
.toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.toggle.active::after { transform: translateX(20px); }

@media (max-width: 768px) {
  .promo-page { padding: 16px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
