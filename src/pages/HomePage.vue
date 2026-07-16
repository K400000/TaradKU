<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appState } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const selectedSort = ref('Newest First')

const categories = [
  { id: 'All', icon: '🏪', label: 'All' },
  { id: 'Electronics', icon: '💻', label: 'Electronics' },
  { id: 'Books', icon: '📚', label: 'Books' },
  { id: 'Fashion', icon: '👕', label: 'Fashion' },
  { id: 'Stationery', icon: '✏️', label: 'Stationery' },
  { id: 'Accessories', icon: '🎒', label: 'Accessories' },
  { id: 'Housing', icon: '🏠', label: 'Housing' },
  { id: 'Sports', icon: '⚽', label: 'Sports' },
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
          <div class="hero-badge">🌿 CAMPUS EXCLUSIVE</div>
          <h1 class="hero-title">Campus Trade<br/>Made Easy</h1>
          <p class="hero-desc">The verified marketplace for Kasetsart University students. Buy and sell with trust.</p>
          <div class="hero-cta">
            <button class="btn btn-primary" @click="$router.push('/products')" id="shop-now-btn">Shop Now</button>
            <button class="btn btn-outline-white" @click="$router.push('/categories')" id="learn-more-btn">Learn More</button>
          </div>
        </div>
        <div class="hero-visual">🏫</div>
      </section>

      <!-- Categories -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Browse Categories</h2>
          <RouterLink to="/categories" class="view-all" id="view-all-categories">View All +</RouterLink>
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
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-label">{{ cat.label }}</span>
          </button>
        </div>
      </section>

      <!-- Fresh Listings -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">⚡ Fresh Listings</h2>
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
          <div class="empty-icon">🔍</div>
          <div class="empty-title">ไม่พบสินค้า</div>
          <div class="empty-desc">ลองค้นหาด้วยคำอื่น</div>
        </div>

        <div class="load-more">
          <button class="btn btn-ghost" @click="$router.push('/products')" id="load-more-btn">Load More Listings</button>
        </div>
      </section>

      <!-- Seller CTA (for buyers) -->
      <section class="seller-cta-banner" v-if="!isSeller">
        <div class="seller-cta-content">
          <div class="seller-cta-icon">🎒</div>
          <div>
            <h3>Got things to sell?</h3>
            <p>Join 2,500+ KU students already trading on campus.</p>
          </div>
        </div>
        <button class="btn btn-primary" @click="$router.push('/seller/products')" id="start-selling-btn">Start Selling →</button>
      </section>

      <!-- Footer -->
      <footer class="home-footer">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">🌿 KU Market</div>
            <p class="footer-desc">Official peer-to-peer campus marketplace for Kasetsart University students.</p>
          </div>
          <div>
            <div class="footer-col-title">Marketplace</div>
            <div class="footer-links">
              <RouterLink to="/products">All Listings</RouterLink>
              <RouterLink to="/categories">Campus Map</RouterLink>
              <a href="#">Safety Guidelines</a>
              <a href="#">Student Discounts</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Account</div>
            <div class="footer-links">
              <RouterLink to="/profile">Profile Settings</RouterLink>
              <RouterLink to="/orders">Sales History</RouterLink>
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
          <span>© 2025 KU Market. All rights reserved.</span>
          <span class="footer-status">🟢 All systems operational</span>
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
  display: inline-block;
  background: rgba(255,255,255,.15);
  color: #bbf7d0;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
  letter-spacing: 1px;
}
.hero-title {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 12px;
}
.hero-desc { font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.6; margin-bottom: 24px; }
.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-outline-white {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 20px; border-radius: var(--radius-md);
  font-size: 14px; font-weight: 600;
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,.5);
  cursor: pointer; transition: all 0.2s;
}
.btn-outline-white:hover { background: rgba(255,255,255,.1); border-color: #fff; }
.hero-visual { font-size: 80px; opacity: 0.3; }

/* Sections */
.section { padding: 28px 28px 0; }
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-title { font-size: 18px; font-weight: 700; }
.sort-wrap { display: flex; align-items: center; gap: 12px; }
.sort-select {
  padding: 6px 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 13px;
  background: #fff;
  color: var(--text-secondary);
  outline: none;
  cursor: pointer;
}
.view-all { font-size: 13px; color: var(--green-600); font-weight: 600; text-decoration: none; }
.view-all:hover { text-decoration: underline; }

/* Category Pills */
.category-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.category-pills::-webkit-scrollbar { display: none; }
.cat-pill {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 10px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 72px;
}
.cat-pill:hover { border-color: var(--green-300); background: var(--green-50); }
.cat-active { border-color: var(--green-600); background: var(--green-50); color: var(--green-700); }
.cat-icon { font-size: 22px; }
.cat-label { font-size: 11px; font-weight: 600; white-space: nowrap; }

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.load-more { display: flex; justify-content: center; margin: 28px 0; }

/* Seller CTA */
.seller-cta-banner {
  margin: 0 28px 28px;
  background: linear-gradient(135deg, var(--green-800) 0%, var(--green-700) 100%);
  border-radius: var(--radius-xl);
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.seller-cta-content { display: flex; align-items: center; gap: 16px; }
.seller-cta-icon { font-size: 36px; }
.seller-cta-content h3 { font-size: 18px; font-weight: 700; color: #fff; }
.seller-cta-content p { font-size: 13px; color: rgba(255,255,255,.75); }

/* Footer */
.home-footer {
  background: var(--bg-sidebar);
  color: rgba(255,255,255,.6);
  padding: 40px 28px 24px;
  margin-top: 16px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}
.footer-brand { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.footer-desc { font-size: 12px; line-height: 1.6; }
.footer-col-title { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.footer-links { display: flex; flex-direction: column; gap: 6px; }
.footer-links a { font-size: 12px; color: rgba(255,255,255,.5); text-decoration: none; transition: color 0.15s; }
.footer-links a:hover { color: rgba(255,255,255,.9); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.08); font-size: 11px; }
.footer-status { color: #4ade80; }

@media (max-width: 768px) {
  .hero-banner { padding: 28px 16px; flex-direction: column; }
  .hero-visual { display: none; }
  .hero-title { font-size: 26px; }
  .section { padding: 20px 16px 0; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .seller-cta-banner { flex-direction: column; text-align: center; margin: 0 16px 16px; }
}
</style>
