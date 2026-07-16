import { reactive, computed } from 'vue'
import usersData from '../mock/users.json'
import productsData from '../mock/products.json'
import ordersData from '../mock/orders.json'
import promotionsData from '../mock/promotions.json'
import messagesData from '../mock/messages.json'

// ─── Global App State ────────────────────────────────────────────────────────
export const appState = reactive({
  // Auth
  isLoggedIn: false,
  currentUser: null,

  // Data
  users: [...usersData],
  products: [...productsData],
  orders: [...ordersData],
  promotions: [...promotionsData],
  conversations: [...messagesData],

  // Cart
  cart: [],

  // UI
  searchQuery: '',
  selectedCategory: 'All',
})

// ─── Auth Actions ─────────────────────────────────────────────────────────────
export function login(studentId, password, role) {
  // Mock login — just find user by studentId or use first user
  const found = appState.users.find(u => u.studentId === studentId) || appState.users[0]
  appState.currentUser = { ...found, role: role || found.role }
  appState.isLoggedIn = true
}

export function loginAsDemo(role) {
  const user = role === 'seller'
    ? appState.users.find(u => u.id === 'u002')
    : appState.users.find(u => u.id === 'u001')
  appState.currentUser = { ...user, role }
  appState.isLoggedIn = true
}

export function logout() {
  appState.isLoggedIn = false
  appState.currentUser = null
  appState.cart = []
}

export function switchRole(newRole) {
  if (appState.currentUser) {
    appState.currentUser.role = newRole
  }
}

// ─── Cart Actions ─────────────────────────────────────────────────────────────
export function addToCart(product) {
  const existing = appState.cart.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity++
  } else {
    appState.cart.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      sellerName: product.sellerName,
      sellerId: product.sellerId,
      sellerVerified: product.sellerVerified,
      quantity: 1,
    })
  }
}

export function removeFromCart(productId) {
  const idx = appState.cart.findIndex(i => i.productId === productId)
  if (idx > -1) appState.cart.splice(idx, 1)
}

export function updateCartQty(productId, qty) {
  const item = appState.cart.find(i => i.productId === productId)
  if (item) {
    if (qty <= 0) removeFromCart(productId)
    else item.quantity = qty
  }
}

export const cartTotal = computed(() =>
  appState.cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
)

export const cartCount = computed(() =>
  appState.cart.reduce((sum, i) => sum + i.quantity, 0)
)

// ─── Product Actions ──────────────────────────────────────────────────────────
export function addProduct(product) {
  const newProduct = {
    ...product,
    id: 'p' + Date.now(),
    sellerId: appState.currentUser?.id,
    sellerName: appState.currentUser?.name,
    sellerVerified: appState.currentUser?.verified,
    sellerRating: appState.currentUser?.rating,
    sellerAvatar: appState.currentUser?.avatar,
    postedAt: new Date().toISOString(),
    views: 0,
    favorites: 0,
    verified: true,
  }
  appState.products.unshift(newProduct)
  return newProduct
}

export function deleteProduct(productId) {
  const idx = appState.products.findIndex(p => p.id === productId)
  if (idx > -1) appState.products.splice(idx, 1)
}

// ─── Order Actions ────────────────────────────────────────────────────────────
export function placeOrder(paymentMethod, meetingLocation, discountCode, discount) {
  const newOrder = {
    id: 'o' + Date.now(),
    buyerId: appState.currentUser?.id,
    sellerId: appState.cart[0]?.sellerId,
    items: appState.cart.map(i => ({ ...i })),
    status: 'pending',
    paymentMethod,
    discountCode,
    meetingLocation,
    totalAmount: cartTotal.value - discount,
    shipping: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingSteps: [
      { status: 'confirmed', label: 'Order Confirmed', timestamp: new Date().toISOString(), done: true },
      { status: 'preparing', label: 'Preparing Item', timestamp: null, done: false },
      { status: 'shipped', label: 'On the Way', timestamp: null, done: false },
      { status: 'delivered', label: 'Delivered', timestamp: null, done: false },
    ],
  }
  appState.orders.unshift(newOrder)
  appState.cart = []
  return newOrder
}

export function confirmShipping(orderId) {
  const order = appState.orders.find(o => o.id === orderId)
  if (!order) return
  const step = order.trackingSteps.find(s => !s.done)
  if (step) {
    step.done = true
    step.timestamp = new Date().toISOString()
    order.status = step.status
    order.updatedAt = new Date().toISOString()
  }
}

// ─── Message Actions ──────────────────────────────────────────────────────────
export function sendMessage(conversationId, text) {
  const conv = appState.conversations.find(c => c.id === conversationId)
  if (!conv) return
  const msg = {
    id: 'm' + Date.now(),
    senderId: appState.currentUser?.id,
    text,
    timestamp: new Date().toISOString(),
  }
  conv.messages.push(msg)
  conv.lastMessage = text
  conv.lastTimestamp = msg.timestamp
}

export function startConversation(product) {
  const existing = appState.conversations.find(
    c => c.productId === product.id && c.buyerId === appState.currentUser?.id
  )
  if (existing) return existing.id
  const newConv = {
    id: 'conv' + Date.now(),
    buyerId: appState.currentUser?.id,
    sellerId: product.sellerId,
    productId: product.id,
    productTitle: product.title,
    lastMessage: '',
    lastTimestamp: new Date().toISOString(),
    unread: 0,
    messages: [],
  }
  appState.conversations.unshift(newConv)
  return newConv.id
}

// ─── Promotion Actions ────────────────────────────────────────────────────────
export function applyPromoCode(code) {
  const promo = appState.promotions.find(
    p => p.code.toUpperCase() === code.toUpperCase() && p.active
  )
  if (!promo) return null
  if (promo.minOrder > cartTotal.value) return null
  return promo
}

export function addPromotion(promo) {
  appState.promotions.unshift({
    ...promo,
    sellerId: appState.currentUser?.id,
    usedCount: 0,
    active: true,
  })
}

// ─── Computed Helpers ─────────────────────────────────────────────────────────
export const myProducts = computed(() =>
  appState.products.filter(p => p.sellerId === appState.currentUser?.id)
)

export const myOrders = computed(() =>
  appState.orders.filter(o => o.buyerId === appState.currentUser?.id)
)

export const sellerOrders = computed(() =>
  appState.orders.filter(o => o.sellerId === appState.currentUser?.id)
)

export const myConversations = computed(() => {
  const uid = appState.currentUser?.id
  return appState.conversations.filter(c => c.buyerId === uid || c.sellerId === uid)
})

export const unreadCount = computed(() =>
  myConversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
)
