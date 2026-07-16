<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../stores/app.js'
import logoImg from '../assets/logo_branding.png'

const router = useRouter()
const form = ref({ name: '', studentId: '', email: '', faculty: '', password: '', confirm: '', role: 'buyer' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

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
      <div class="reg-left-overlay"></div>
      <div class="reg-left-content">
        <RouterLink to="/login" class="back-link">
          <i class="bi bi-arrow-left"></i> กลับไปหน้าล็อกอิน
        </RouterLink>
        <div class="reg-brand">
          <img :src="logoImg" alt="TaradKU" class="reg-logo" />
          <span class="reg-brand-name">TaradKU</span>
        </div>
        <h1 class="reg-title">สมัครสมาชิก<br/>เพื่อ KU Community</h1>
        <p class="reg-desc">เข้าร่วมกับนิสิตกว่า 2,500 คน ที่ซื้อขายของมือสองอย่างปลอดภัยในมหาวิทยาลัย</p>
        <div class="reg-perks">
          <div class="perk"><i class="bi bi-lock-fill"></i> ยืนยันตัวตนด้วย Student ID จริง</div>
          <div class="perk"><i class="bi bi-star-fill"></i> ระบบ Rating &amp; Review</div>
          <div class="perk"><i class="bi bi-chat-dots-fill"></i> แชทกับผู้ซื้อ/ผู้ขายโดยตรง</div>
          <div class="perk"><i class="bi bi-gift-fill"></i> โปรโมชั่นพิเศษสำหรับนิสิต</div>
        </div>
      </div>
    </div>

    <div class="reg-right">
      <div class="reg-form-wrap">
        <div class="form-brand-mobile">
          <img :src="logoImg" alt="TaradKU" class="mobile-logo" />
          <span class="mobile-brand-name">TaradKU</span>
        </div>
        <h2 class="reg-form-title">สร้างบัญชีใหม่</h2>
        <p class="reg-form-sub">กรอกข้อมูลเพื่อเริ่มใช้งาน TaradKU</p>

        <form @submit.prevent="handleRegister" class="reg-form">
          <div class="role-tabs">
            <button type="button" class="role-tab" :class="{ active: form.role === 'buyer' }" @click="form.role = 'buyer'" id="reg-role-buyer">
              <i class="bi bi-cart3"></i> ผู้ซื้อ
            </button>
            <button type="button" class="role-tab" :class="{ active: form.role === 'seller' }" @click="form.role = 'seller'" id="reg-role-seller">
              <i class="bi bi-shop"></i> ผู้ขาย
            </button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="reg-name">ชื่อ-นามสกุล</label>
              <div class="input-icon-wrap">
                <i class="bi bi-person input-icon"></i>
                <input id="reg-name" v-model="form.name" class="form-input input-with-icon" type="text" placeholder="Tanawat S." />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-sid">รหัสนิสิต</label>
              <div class="input-icon-wrap">
                <i class="bi bi-credit-card-2-front input-icon"></i>
                <input id="reg-sid" v-model="form.studentId" class="form-input input-with-icon" type="text" placeholder="6450XXXXX" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">อีเมล มก. (@ku.th)</label>
            <div class="input-icon-wrap">
              <i class="bi bi-envelope input-icon"></i>
              <input id="reg-email" v-model="form.email" class="form-input input-with-icon" type="email" placeholder="tanawat.s@ku.th" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-faculty">คณะ / Faculty</label>
            <div class="input-icon-wrap">
              <i class="bi bi-mortarboard input-icon"></i>
              <select id="reg-faculty" v-model="form.faculty" class="form-select input-with-icon">
                <option value="">เลือกคณะ</option>
                <option v-for="f in faculties" :key="f" :value="f">{{ f }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="reg-pass">รหัสผ่าน</label>
              <div class="input-icon-wrap">
                <i class="bi bi-lock input-icon"></i>
                <input id="reg-pass" v-model="form.password" class="form-input input-with-icon" :type="showPass ? 'text' : 'password'" placeholder="••••••••" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-confirm">ยืนยันรหัสผ่าน</label>
              <div class="input-icon-wrap">
                <i class="bi bi-lock-fill input-icon"></i>
                <input id="reg-confirm" v-model="form.confirm" class="form-input input-with-icon" :type="showPass ? 'text' : 'password'" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <p v-if="error" class="error-msg"><i class="bi bi-exclamation-circle"></i> {{ error }}</p>

          <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading" id="register-btn">
            <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> กำลังสมัคร...</span>
            <span v-else><i class="bi bi-person-check"></i> สมัครสมาชิก</span>
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
  position: relative;
  background-image: url('../assets/tarad.png');
  background-size: cover;
  background-position: center;
  display: flex; align-items: center; justify-content: center;
  padding: 48px 40px;
  overflow: hidden;
}
.reg-left-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(14,53,29,.82) 0%, rgba(21,128,61,.70) 100%);
  z-index: 0;
}
.reg-left-content { position: relative; z-index: 1; max-width: 380px; }

.back-link { font-size: 13px; color: rgba(255,255,255,.75); text-decoration: none; display: flex; align-items: center; gap: 6px; margin-bottom: 28px; transition: color 0.15s; }
.back-link:hover { color: #fff; }
.reg-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
.reg-logo { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; box-shadow: 0 4px 16px rgba(0,0,0,.25); }
.reg-brand-name { font-size: 20px; font-weight: 800; color: #fff; }
.reg-title { font-size: 34px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 12px; }
.reg-desc { font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.6; margin-bottom: 24px; }
.reg-perks { display: flex; flex-direction: column; gap: 10px; }
.perk { font-size: 13px; color: rgba(255,255,255,.85); display: flex; align-items: center; gap: 10px; }
.perk i { color: #4ade80; }

.reg-right {
  width: 540px;
  display: flex; align-items: center; justify-content: center;
  padding: 40px 40px;
  background: #fff;
  overflow-y: auto;
}
.reg-form-wrap { width: 100%; max-width: 420px; }

.form-brand-mobile { display: none; align-items: center; gap: 10px; margin-bottom: 20px; }
.mobile-logo { width: 32px; height: 32px; border-radius: 8px; }
.mobile-brand-name { font-size: 16px; font-weight: 800; }

.reg-form-title { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.reg-form-sub { font-size: 14px; color: var(--text-secondary); margin-bottom: 22px; }
.reg-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.role-tabs { display: flex; gap: 8px; background: var(--bg-page); padding: 4px; border-radius: var(--radius-md); }
.role-tab { flex: 1; padding: 9px; border-radius: 7px; font-size: 13px; font-weight: 600; color: var(--text-secondary); background: transparent; border: none; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
.role-tab.active { background: #fff; color: var(--green-700); box-shadow: var(--shadow-sm); }

.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; pointer-events: none; }
.input-with-icon { padding-left: 36px; }

.error-msg { font-size: 13px; color: #dc2626; background: #fee2e2; padding: 8px 12px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 6px; }
.spin { display: inline-block; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.login-link { font-size: 13px; color: var(--text-secondary); text-align: center; margin-top: 16px; }
.link-green { color: var(--green-600); font-weight: 600; }

@media (max-width: 768px) {
  .reg-left { display: none; }
  .reg-right { width: 100%; padding: 32px 20px; }
  .form-brand-mobile { display: flex; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
