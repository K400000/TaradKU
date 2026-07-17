import { createRouter, createWebHistory } from 'vue-router'
import { appState } from '../stores/app.js'

// Pages — Shared
import LoginPage from '../pages/LoginPage.vue'
import HomePage from '../pages/HomePage.vue'
import CategoriesPage from '../pages/CategoriesPage.vue'
import MessagePage from '../pages/MessagePage.vue'
import ProfilePage from '../pages/ProfilePage.vue'

// Pages — Buyer
import ProductListPage from '../pages/ProductListPage.vue'
import ProductDetailPage from '../pages/ProductDetailPage.vue'
import BucketPage from '../pages/BucketPage.vue'
import BillPage from '../pages/BillPage.vue'
import OrderTrackingPage from '../pages/OrderTrackingPage.vue'

// Pages — Seller
import SellerDashboardPage from '../pages/SellerDashboardPage.vue'
import SellerProductManagePage from '../pages/SellerProductManagePage.vue'
import SellerOrderManagePage from '../pages/SellerOrderManagePage.vue'
import SellerPromotionPage from '../pages/SellerPromotionPage.vue'

const routes = [
  // Auth
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginPage, meta: { public: true } },
  { path: '/register', redirect: '/login' },

  // Shared (authenticated)
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/categories', name: 'Categories', component: CategoriesPage },
  { path: '/messages', name: 'Messages', component: MessagePage },
  { path: '/profile', name: 'Profile', component: ProfilePage },

  // Buyer Flow
  { path: '/products', name: 'ProductList', component: ProductListPage },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetailPage },
  { path: '/cart', name: 'Cart', component: BucketPage },
  { path: '/checkout', name: 'Checkout', component: BillPage },
  { path: '/orders', name: 'OrderTracking', component: OrderTrackingPage },

  // Seller Flow
  { path: '/seller/dashboard', redirect: '/seller/products' },
  { path: '/seller/products', name: 'SellerProducts', component: SellerProductManagePage },
  { path: '/seller/orders', name: 'SellerOrders', component: SellerOrderManagePage },
  { path: '/seller/promotions', name: 'SellerPromotions', component: SellerPromotionPage },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Mock auth guard
router.beforeEach((to) => {
  if (!to.meta.public && !appState.isLoggedIn) {
    return { name: 'Login' }
  }
  if (to.meta.public && appState.isLoggedIn) {
    return { name: 'Home' }
  }
})

export default router
