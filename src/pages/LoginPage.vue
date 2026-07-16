<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginAsDemo } from '../stores/app.js'

const router = useRouter()
const studentId = ref('')
const password = ref('')
const role = ref('buyer')
const error = ref('')
const loading = ref(false)

function handleLogin() {
  if (!studentId.value) { error.value = 'กรุณากรอกรหัสนิสิต'; return }
  loading.value = true
  setTimeout(() => {
    login(studentId.value, password.value, role.value)
    loading.value = false
    router.push('/home')
  }, 800)
}

function handleDemoLogin(r) {
  loading.value = true
  setTimeout(() => {
    loginAsDemo(r)
    loading.value = false
    router.push('/home')
  }, 600)
}
</script>

<template>
  <div class="login-page">
    <!-- Left Panel -->
    <div class="login-left">
      <div class="login-left-content">
        <div class="hero-brand">
          <span class="hero-icon">🌿</span>
          <span class="hero-name">KU Market</span>
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
          <div class="trust-item">✓ ยืนยันตัวตนด้วย Student ID</div>
          <div class="trust-item">✓ พบกันในบริเวณมหาวิทยาลัยที่ปลอดภัย</div>
          <div class="trust-item">✓ ระบบรีวิว & Rating น่าเชื่อถือ</div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="login-right">
      <div class="login-form-card">
        <div class="form-header">
          <h2>เข้าสู่ระบบ</h2>
          <p>เข้าสู่ระบบด้วย Student ID มก.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Role Selector -->
          <div class="role-tabs">
            <button type="button" class="role-tab" :class="{ active: role === 'buyer' }" @click="role = 'buyer'">🛒 ผู้ซื้อ</button>
            <button type="button" class="role-tab" :class="{ active: role === 'seller' }" @click="role = 'seller'">📦 ผู้ขาย</button>
          </div>

          <div class="form-group">
            <label class="form-label" for="student-id">รหัสนิสิต / Student ID</label>
            <input
              id="student-id"
              v-model="studentId"
              class="form-input"
              type="text"
              placeholder="6450XXXXX"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">รหัสผ่าน / Password</label>
            <input
              id="password"
              v-model="password"
              class="form-input"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading" id="login-btn">
            <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
            <span v-else>เข้าสู่ระบบ →</span>
          </button>
        </form>

        <div class="divider-row">
          <hr class="divider" />
          <span class="divider-text">หรือลองใช้งาน Demo</span>
          <hr class="divider" />
        </div>

        <div class="demo-btns">
          <button class="btn btn-outline btn-full" @click="handleDemoLogin('buyer')" id="demo-buyer-btn">
            🛒 Demo — Buyer
          </button>
          <button class="btn btn-ghost btn-full" @click="handleDemoLogin('seller')" id="demo-seller-btn">
            📦 Demo — Seller
          </button>
        </div>

        <p class="register-link">
          ยังไม่มีบัญชี?
          <RouterLink to="/register" class="link-green">สมัครสมาชิก</RouterLink>
        </p>
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
  background: linear-gradient(135deg, #14532d 0%, #15803d 50%, #166534 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  position: relative;
  overflow: hidden;
}
.login-left::before {
  content: '';
  position: absolute;
  top: -50%; right: -20%;
  width: 400px; height: 400px;
  background: rgba(255,255,255,.05);
  border-radius: 50%;
}
.login-left::after {
  content: '';
  position: absolute;
  bottom: -30%; left: -10%;
  width: 300px; height: 300px;
  background: rgba(255,255,255,.04);
  border-radius: 50%;
}
.login-left-content { position: relative; z-index: 1; max-width: 400px; }

.hero-brand {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 32px;
}
.hero-icon { font-size: 28px; }
.hero-name { font-size: 20px; font-weight: 800; color: #fff; }

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 15px;
  color: rgba(255,255,255,.75);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}
.stat-item { text-align: center; }
.stat-num { font-size: 24px; font-weight: 800; color: #fff; }
.stat-label { font-size: 12px; color: rgba(255,255,255,.6); margin-top: 2px; }

.hero-trust {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.trust-item {
  font-size: 13px;
  color: rgba(255,255,255,.8);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Right */
.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: #fff;
}
.login-form-card { width: 100%; max-width: 380px; }

.form-header { margin-bottom: 24px; }
.form-header h2 { font-size: 24px; font-weight: 800; color: var(--text-primary); }
.form-header p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }

.login-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }

.role-tabs {
  display: flex;
  gap: 8px;
  background: var(--bg-page);
  padding: 4px;
  border-radius: var(--radius-md);
}
.role-tab {
  flex: 1;
  padding: 8px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.role-tab.active {
  background: #fff;
  color: var(--green-700);
  box-shadow: var(--shadow-sm);
}

.error-msg {
  font-size: 13px;
  color: #dc2626;
  background: #fee2e2;
  padding: 8px 12px;
  border-radius: var(--radius-md);
}

.divider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}
.divider-text { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.divider { flex: 1; }

.demo-btns { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }

.register-link { font-size: 13px; color: var(--text-secondary); text-align: center; }
.link-green { color: var(--green-600); font-weight: 600; }

@media (max-width: 768px) {
  .login-left { display: none; }
  .login-right { width: 100%; padding: 32px 24px; }
}
</style>
