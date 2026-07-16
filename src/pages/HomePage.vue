<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appState } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'
import ProductCard from '../components/ProductCard.vue'
import logoImg from '../assets/logo_branding.png'

const router = useRouter()
const selectedSort = ref('Newest First')

const categories = [
  { id: 'All', icon: 'bi-shop', label: 'All' },
  { id: 'Electronics', icon: 'bi-cpu', label: 'Electronics' },
  { id: 'Books', icon: 'bi-book', label: 'Books' },
  { id: 'Fashion', icon: 'bi-bag', label: 'Fashion' },
  { id: 'Stationery', icon: 'bi-pencil', label: 'Stationery' },
  { id: 'Accessories', icon: 'bi-backpack', label: 'Accessories' },
  { id: 'Housing', icon: 'bi-house', label: 'Housing' },
  { id: 'Sports', icon: 'bi-trophy', label: 'Sports' },
]

function selectCategory(id) {
  appState.selectedCategory = id
  if (id !== 'All') router.push('/products')
}

const freshListings = computed(() => {
  let list = [...appState.products]
  if (appState.searchQuery) {
    list = list.filter(p =>
      p.title.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(appState.searchQuery.toLowerCase())
    )
  }
  return list.slice(0, 8)
})

const isSeller = computed(() => appState.currentUser?.role === 'seller')
</script>

<template>
  <div class="home-page">
    <AppTopBar />

    <div class="home-content">
      <!-- Hero Banner -->
      <section class="hero-banner">
        <div class="hero-text">
          <div class="hero-badge">
            <i class="bi bi-patch-check-fill"></i> CAMPUS EXCLUSIVE
          </div>
          <h1 class="hero-title">Campus Trade<br/>Made Easy</h1>
          <p class="hero-desc">The verified marketplace for Kasetsart University students. Buy and sell with trust.</p>
          <div class="hero-cta">
            <button class="btn btn-white" @click="$router.push('/products')" id="shop-now-btn">
              <i class="bi bi-bag"></i> Shop Now
            </button>
            <button class="btn btn-outline-white" @click="$router.push('/categories')" id="learn-more-btn">
              <i class="bi bi-grid"></i> Categories
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <img :src="logoImg" alt="TaradKU" class="hero-logo-img" />
        </div>
      </section>

      <!-- Categories -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Browse Categories</h2>
          <RouterLink to="/categories" class="view-all" id="view-all-categories">View All <i class="bi bi-arrow-right"></i></RouterLink>
        </div>
        <div class="category-pills">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-pill"
            :class="{ 'cat-active': appState.selectedCategory === cat.id }"
            @click="selectCategory(cat.id)"
            :id="`cat-${cat.id}`"
          >
            <i :class="['bi', cat.icon, 'cat-icon']"></i>
            <span class="cat-label">{{ cat.label }}</span>
          </button>
        </div>
      </section>

      <!-- Fresh Listings -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="bi bi-lightning-charge-fill text-green"></i> Fresh Listings
          </h2>
          <div class="sort-wrap">
            <select v-model="selectedSort" class="sort-select" id="sort-select">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <RouterLink to="/products" class="view-all" id="view-all-listings">View All</RouterLink>
          </div>
        </div>

        <div class="products-grid" v-if="freshListings.length > 0">
          <ProductCard v-for="product in freshListings" :key="product.id" :product="product" />
        </div>
        <div class="empty-state" v-else>
          <i class="bi bi-search empty-icon"></i>
          <div class="empty-title">ไม่พบสินค้า</div>
          <div class="empty-desc">ลองค้นหาด้วยคำอื่น</div>
        </div>

        <div class="load-more">
          <button class="btn btn-ghost" @click="$router.push('/products')" id="load-more-btn">
            <i class="bi bi-arrow-down-circle"></i> Load More Listings
          </button>
        </div>
      </section>



      <!-- Footer -->
      <footer class="home-footer">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">
              <img :src="logoImg" alt="TaradKU" class="footer-logo" />
              TaradKU
            </div>
            <p class="footer-desc">Official peer-to-peer campus marketplace for Kasetsart University students.</p>
          </div>
          <div>
            <div class="footer-col-title">Marketplace</div>
            <div class="footer-links">
              <RouterLink to="/products">All Listings</RouterLink>
              <RouterLink to="/categories">Categories</RouterLink>
              <a href="#">Safety Guidelines</a>
              <a href="#">Student Discounts</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Account</div>
            <div class="footer-links">
              <RouterLink to="/profile">Profile Settings</RouterLink>
              <RouterLink to="/orders">Order History</RouterLink>
              <a href="#">Watchlist</a>
              <a href="#">Support Center</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Legal</div>
            <div class="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2025 TaradKU. All rights reserved.</span>
          <span class="footer-status"><i class="bi bi-circle-fill"></i> All systems operational</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.home-page { display: flex; flex-direction: column; min-height: 100vh; }
.home-content { flex: 1; }

/* Hero */
.hero-banner {
  background: linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%);
  padding: 48px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: relative;
  overflow: hidden;
}
.hero-banner::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 240px; height: 240px;
  background: rgba(255,255,255,.05);
  border-radius: 50%;
}
.hero-text { max-width: 480px; position: relative; z-index: 1; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,.15);
  color: #bbf7d0;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}
.hero-title { font-size: 36px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 12px; }
.hero-desc { font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.6; margin-bottom: 24px; }
.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }

.btn-white {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 20px; border-radius: var(--radius-md);
  font-size: 14px; font-weight: 600;
  background: #fff; color: var(--green-800);
  border: none; cursor: pointer; transition: all 0.2s;
}
.btn-white:hover { background: #f0fdf4; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
.btn-outline-white {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 20px; border-radius: var(--radius-md);
  font-size: 14px; font-weight: 600;
  background: transparent; color: #fff;
  border: 2px solid rgba(255,255,255,.5);
  cursor: pointer; transition: all 0.2s;
}
.btn-outline-white:hover { background: rgba(255,255,255,.1); border-color: #fff; }

.hero-visual { position: relative; z-index: 1; }
.hero-logo-img {
  width: 140px; height: 140px;
  border-radius: 28px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0,0,0,.25);
  opacity: 0.85;
}

/* Sections */
.section { padding: 28px 28px 0; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.sort-wrap { display: flex; align-items: center; gap: 12px; }
.sort-select { padding: 6px 10px; border: 1.5px solid var(--border); border-radius: var(--radius-md); font-size: 13px; background: #fff; color: var(--text-secondary); outline: none; cursor: pointer; }
.view-all { font-size: 13px; color: var(--green-600); font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; }
.view-all:hover { text-decoration: underline; }

/* Category Pills */
.category-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.category-pills::-webkit-scrollbar { display: none; }
.cat-pill {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 10px 16px;
  border: 2px solid var(--border); border-radius: var(--radius-lg);
  background: #fff; cursor: pointer; transition: all 0.15s; min-width: 76px;
}
.cat-pill:hover { border-color: var(--green-300); background: var(--green-50); }
.cat-active { border-color: var(--green-600); background: var(--green-50); color: var(--green-700); }
.cat-icon { font-size: 22px; }
.cat-label { font-size: 11px; font-weight: 600; white-space: nowrap; }

/* Products Grid */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.load-more { display: flex; justify-content: center; margin: 28px 0; }

/* Seller CTA */
.seller-cta-banner {
  margin: 28px 28px 0;
  background: linear-gradient(135deg, var(--green-800) 0%, var(--green-700) 100%);
  border-radius: var(--radius-xl); padding: 24px 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.seller-cta-content { display: flex; align-items: center; gap: 16px; }
.seller-cta-icon { font-size: 36px; color: #bbf7d0; }
.seller-cta-content h3 { font-size: 18px; font-weight: 700; color: #fff; }
.seller-cta-content p { font-size: 13px; color: rgba(255,255,255,.75); }

/* Footer */
.home-footer { background: var(--bg-sidebar); color: rgba(255,255,255,.6); padding: 40px 28px 24px; margin-top: 28px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 24px; }
.footer-brand { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.footer-logo { width: 24px; height: 24px; border-radius: 6px; object-fit: cover; }
.footer-desc { font-size: 12px; line-height: 1.6; }
.footer-col-title { font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.footer-links { display: flex; flex-direction: column; gap: 6px; }
.footer-links a { font-size: 12px; color: rgba(255,255,255,.5); text-decoration: none; transition: color 0.15s; }
.footer-links a:hover { color: rgba(255,255,255,.9); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.08); font-size: 11px; }
.footer-status { color: #4ade80; display: flex; align-items: center; gap: 5px; }
.footer-status i { font-size: 7px; }

@media (max-width: 768px) {
  .hero-banner { padding: 28px 16px; flex-direction: column; }
  .hero-logo-img { width: 80px; height: 80px; }
  .hero-title { font-size: 26px; }
  .section { padding: 20px 16px 0; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .seller-cta-banner { flex-direction: column; text-align: center; margin: 16px 16px 0; }
}
</style>
