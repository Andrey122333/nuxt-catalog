<template>
  <NuxtLink :to="`/catalog/${product.id}`" class="card">
    <div class="image">
      <div class="placeholder">
        {{ product.images[0] ? product.images[0].split('/').pop()?.split('.')[0] : 'Изображение' }}
      </div>
      <span v-if="product.badge" :class="['badge', badgeClass]">
        {{ product.badge }}
      </span>
      <span v-if="!product.inStock" class="badge unavailable">Нет в наличии</span>
    </div>

    <div class="content">
      <h3>{{ product.name }}</h3>
      <p class="description">{{ product.description }}</p>

      <div class="rating">
        <span class="stars">★★★★★</span>
        <span class="text">{{ product.rating }} ({{ product.reviewCount }})</span>
      </div>

      <div class="footer">
        <div class="price">{{ formatPrice(product.price) }}</div>
        <button 
          :class="['add-button', { 'in-cart': inCart }]"
          @click.prevent="handleToggleCart"
          :disabled="!product.inStock"
          :title="inCart ? 'Удалить из корзины' : 'Добавить в корзину'"
        >
          {{ inCart ? '✓ В корзине' : 'В корзину' }}
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const props = defineProps<{
  product: Product;
}>();

const cart = useCart();
const inCart = computed(() => cart.isInCart(props.product.id));

const badgeClass = computed(() => {
  if (props.product.badge === 'Хит продаж') return 'hit';
  if (props.product.badge === 'Новинка') return 'new';
  return '';
});

function handleToggleCart() {
  cart.toggleItem(
    props.product.id,
    props.product.name,
    props.product.price,
    props.product.images[0],
    props.product.stockQuantity
  );
}
</script>

<style scoped>
.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: var(--color-bg-secondary);
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  padding: 1rem;
}

.badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  z-index: 1;
}

.badge.hit {
  background: var(--color-error);
}

.badge.new {
  background: var(--color-success);
}

.badge.unavailable {
  background: var(--color-text-secondary);
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.stars {
  color: var(--color-star);
  font-size: 0.875rem;
}

.text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
}

.add-button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 0.875rem;
}

.add-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.add-button:disabled {
  background: var(--color-text-secondary);
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button.in-cart {
  background: var(--color-success);
}
</style>
