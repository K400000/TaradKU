<!-- Reusable mockup image placeholder with white background and Bootstrap Icon -->
<script setup>
defineProps({
  icon: { type: String, default: 'bi-box-seam' },
  label: { type: String, default: '' },
  size: { type: String, default: 'normal' }, // 'normal' | 'sm' | 'lg'
  square: { type: Boolean, default: false },
})
</script>

<template>
  <div class="product-mockup" :class="{ 'product-mockup-sm': size === 'sm', 'product-mockup-lg': size === 'lg', 'mockup-square': square }">
    <i :class="icon"></i>
    <span v-if="label" class="mockup-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.product-mockup-lg i { font-size: 4rem; }
.mockup-square { aspect-ratio: unset; }
</style>
