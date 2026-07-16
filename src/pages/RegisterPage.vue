<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../stores/app.js'

const router = useRouter()
const form = ref({ name: '', studentId: '', email: '', faculty: '', password: '', confirm: '', role: 'buyer' })
const loading = ref(false)
const error = ref('')

const faculties = ['Faculty of Engineering', 'Faculty of Science', 'Faculty of Business', 'Faculty of Liberal Arts', 'Faculty of Architecture']

function handleRegister() {
  if (!form.value.name || !form.value.studentId || !form.value.email) {
    error.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'; return
  }
  if (form.value.password !== form.value.confirm) {
    error.value = 'รหัสผ่านไม่ตรงกัน'; return
  }
  loading.value = true
  setTimeout(() => {
    login(form.value.studentId, form.value.password, form.value.role)
    loading.value = false
    router.push('/home')
  }, 900)
}
</script>

<template>
  <div class="reg-page">
    <div class="reg-left">
      <div class="reg-left-content">
        <RouterLink to="/login" class="back-link">← กลับไปหน้าล็อกอิน</RouterLink>
        <div class="reg-brand">
          <span>🌿</span>
          <span class="reg-brand-name">KU Market</span>
        </div>
        <h1 class="reg-title">สมัครสมาชิก<br/>เพื่อ KU Community</h1>
        <p class="reg-desc">เข้าร่วมกับนิสิตกว่า 2,500 คน ที่ซื้อขายของมือสองอย่างปลอดภัยในมหาวิทยาลัย</p>
        <div class="reg-perks">
          <div class="perk">🔒 ยืนยันตัวตนด้วย Student ID จริง</div>
          <div class="perk">⭐ ระบบ Rating & Review</div>
          <div class="perk">💬 แชทกับผู้ซื้อ/ผู้ขายโดยตรง</div>
          <div class="perk">🎁 โปรโมชั่นพิเศษสำหรับนิสิต</div>
        </div>
      </div>
    </div>

    <div class="reg-right">
      <div class="reg-form-wrap">
        <h2 class="reg-form-title">สร้างบัญชีใหม่</h2>
        <p class="reg-form-sub">กรอกข้อมูลเพื่อเริ่มใช้งาน KU Market</p>

        <form @submit.prevent="handleRegister" class="reg-form">
          <div class="role-tabs">
            <button type="button" class="role-tab" :class="{ active: form.role === 'buyer' }" @click="form.role = 'buyer'">🛒 ผู้ซื้อ</button>
            <button type="button" class="role-tab" :class="{ active: form.role === 'seller' }" @click="form.role = 'seller'">📦 ผู้ขาย</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="reg-name">ชื่อ-นามสกุล</label>
              <input id="reg-name" v-model="form.name" class="form-input" type="text" placeholder="Tanawat S." />
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-sid">รหัสนิสิต</label>
              <input id="reg-sid" v-model="form.studentId" class="form-input" type="text" placeholder="6450XXXXX" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">อีเมล มก. (@ku.th)</label>
            <input id="reg-email" v-model="form.email" class="form-input" type="email" placeholder="tanawat.s@ku.th" />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-faculty">คณะ / Faculty</label>
            <select id="reg-faculty" v-model="form.faculty" class="form-select">
              <option value="">เลือกคณะ</option>
              <option v-for="f in faculties" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="reg-pass">รหัสผ่าน</label>
              <input id="reg-pass" v-model="form.password" class="form-input" type="password" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-confirm">ยืนยันรหัสผ่าน</label>
              <input id="reg-confirm" v-model="form.confirm" class="form-input" type="password" placeholder="••••••••" />
            </div>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading" id="register-btn">
            <span v-if="loading">กำลังสมัคร...</span>
            <span v-else>สมัครสมาชิก →</span>
          </button>
        </form>

        <p class="login-link">
          มีบัญชีแล้ว?
          <RouterLink to="/login" class="link-green">เข้าสู่ระบบ</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reg-page { display: flex; min-height: 100vh; }
.reg-left {
  flex: 1;
  background: linear-gradient(135deg, #14532d 0%, #15803d 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 48px 40px;
}
.reg-left-content { max-width: 380px; }
.back-link { font-size: 13px; color: rgba(255,255,255,.7); text-decoration: none; display: block; margin-bottom: 32px; }
.back-link:hover { color: #fff; }
.reg-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; font-size: 20px; }
.reg-brand-name { font-weight: 800; color: #fff; }
.reg-title { font-size: 36px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 12px; }
.reg-desc { font-size: 14px; color: rgba(255,255,255,.7); line-height: 1.6; margin-bottom: 24px; }
.reg-perks { display: flex; flex-direction: column; gap: 8px; }
.perk { font-size: 13px; color: rgba(255,255,255,.8); }

.reg-right {
  width: 540px;
  display: flex; align-items: center; justify-content: center;
  padding: 48px 40px;
  background: #fff;
  overflow-y: auto;
}
.reg-form-wrap { width: 100%; max-width: 420px; }
.reg-form-title { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.reg-form-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
.reg-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.role-tabs {
  display: flex; gap: 8px;
  background: var(--bg-page); padding: 4px; border-radius: var(--radius-md);
}
.role-tab {
  flex: 1; padding: 8px; border-radius: 7px;
  font-size: 13px; font-weight: 600; color: var(--text-secondary);
  background: transparent; border: none; cursor: pointer; transition: all 0.15s;
}
.role-tab.active { background: #fff; color: var(--green-700); box-shadow: var(--shadow-sm); }

.error-msg { font-size: 13px; color: #dc2626; background: #fee2e2; padding: 8px 12px; border-radius: var(--radius-md); }
.login-link { font-size: 13px; color: var(--text-secondary); text-align: center; margin-top: 16px; }
.link-green { color: var(--green-600); font-weight: 600; }

@media (max-width: 768px) {
  .reg-left { display: none; }
  .reg-right { width: 100%; padding: 32px 20px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
