<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginAsDemo } from '../stores/app.js'
import logoImg from '../assets/logo_branding.png'

const router = useRouter()
const studentId = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPass = ref(false)

function handleLogin() {
  if (!studentId.value) { error.value = 'กรุณากรอกรหัสนิสิต'; return }
  loading.value = true
  setTimeout(() => {
    login(studentId.value, password.value, 'buyer')
    loading.value = false
    router.push('/home')
  }, 800)
}

function handleDemoLogin() {
  loading.value = true
  setTimeout(() => {
    loginAsDemo('buyer')
    loading.value = false
    router.push('/home')
  }, 600)
}
</script>

<template>
  <div class="login-page">
    <!-- Left Panel: background image -->
    <div class="login-left">
      <div class="login-left-overlay"></div>
      <div class="login-left-content">
        <div class="hero-brand">
          <img :src="logoImg" alt="TaradKU" class="hero-logo" />
          <span class="hero-name">TaradKU</span>
        </div>
        <h1 class="hero-title">Campus Trade<br/>Made Easy</h1>
        <p class="hero-desc">The verified marketplace for Kasetsart University Sriracha students. Buy and sell with trust.</p>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-num">2,500+</div>
            <div class="stat-label">Students</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">1,200+</div>
            <div class="stat-label">Listings</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">98%</div>
            <div class="stat-label">Verified</div>
          </div>
        </div>

        <div class="hero-trust">
          <div class="trust-item"><i class="bi bi-patch-check-fill"></i> ยืนยันตัวตนด้วย Student ID</div>
          <div class="trust-item"><i class="bi bi-shield-check"></i> พบกันในบริเวณมหาวิทยาลัยที่ปลอดภัย</div>
          <div class="trust-item"><i class="bi bi-star-fill"></i> ระบบรีวิว &amp; Rating น่าเชื่อถือ</div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Login Form -->
    <div class="login-right">
      <div class="login-form-card">
        <div class="form-brand-mobile">
          <img :src="logoImg" alt="TaradKU" class="mobile-logo" />
          <span class="mobile-brand-name">TaradKU</span>
        </div>

        <div class="form-header">
          <h2>เข้าสู่ระบบ</h2>
          <p>เข้าสู่ระบบด้วย Student ID มก.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label" for="student-id">รหัสนิสิต / Student ID</label>
            <div class="input-icon-wrap">
              <i class="bi bi-person input-icon"></i>
              <input id="student-id" v-model="studentId" class="form-input input-with-icon" type="text" placeholder="6450XXXXX" autocomplete="username" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">รหัสผ่าน / Password</label>
            <div class="input-icon-wrap">
              <i class="bi bi-lock input-icon"></i>
              <input id="password" v-model="password" class="form-input input-with-icon" :type="showPass ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password" />
              <button type="button" class="input-toggle" @click="showPass = !showPass" id="toggle-pass-btn">
                <i :class="['bi', showPass ? 'bi-eye-slash' : 'bi-eye']"></i>
              </button>
            </div>
          </div>

          <p v-if="error" class="error-msg"><i class="bi bi-exclamation-circle"></i> {{ error }}</p>

          <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading" id="login-btn">
            <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> กำลังเข้าสู่ระบบ...</span>
            <span v-else><i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ</span>
          </button>
        </form>

        <div class="divider-row">
          <hr class="divider" />
          <span class="divider-text">หรือทดลองใช้งานโดยไม่ต้องกรอกรหัส</span>
          <hr class="divider" />
        </div>

        <div class="demo-btns">
          <button type="button" class="btn btn-outline btn-full" @click="handleDemoLogin()" id="demo-login-btn">
            <i class="bi bi-play-circle-fill me-1 text-green"></i> เข้าสู่ระบบด้วยบัญชีตัวอย่าง (Demo Account)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
}

/* Left */
.login-left {
  flex: 1;
  position: relative;
  background-image: url('../assets/tarad.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  overflow: hidden;
}
.login-left-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(14,53,29,.82) 0%, rgba(21,128,61,.70) 100%);
  z-index: 0;
}
.login-left-content {
  position: relative;
  z-index: 1;
  max-width: 420px;
}

.hero-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}
.hero-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(0,0,0,.25);
}
.hero-name {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 15px;
  color: rgba(255,255,255,.8);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-stats {
  display: flex;
  gap: 28px;
  margin-bottom: 32px;
}
.stat-item { text-align: center; }
.stat-num { font-size: 26px; font-weight: 800; color: #fff; }
.stat-label { font-size: 12px; color: rgba(255,255,255,.6); margin-top: 2px; }

.hero-trust {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.trust-item {
  font-size: 13px;
  color: rgba(255,255,255,.85);
  display: flex;
  align-items: center;
  gap: 10px;
}
.trust-item i { color: #4ade80; }

/* Right */
.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: #fff;
  overflow-y: auto;
}
.login-form-card { width: 100%; max-width: 380px; }

.form-brand-mobile { display: none; align-items: center; gap: 10px; margin-bottom: 24px; }
.mobile-logo { width: 36px; height: 36px; border-radius: 8px; }
.mobile-brand-name { font-size: 18px; font-weight: 800; color: var(--text-primary); }

.form-header { margin-bottom: 24px; }
.form-header h2 { font-size: 24px; font-weight: 800; color: var(--text-primary); }
.form-header p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }

.login-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }



/* Input with icon */
.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 15px; pointer-events: none; }
.input-with-icon { padding-left: 38px; }
.input-toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 15px; padding: 4px; }
.input-toggle:hover { color: var(--text-primary); }

.error-msg { font-size: 13px; color: #dc2626; background: #fee2e2; padding: 8px 12px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 6px; }

.spin { display: inline-block; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.divider-row { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.divider-text { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.divider { flex: 1; }

.demo-btns { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.demo-btns .btn i { font-size: 14px; }



@media (max-width: 768px) {
  .login-left { display: none; }
  .login-right { width: 100%; padding: 32px 24px; }
  .form-brand-mobile { display: flex; }
}
</style>
