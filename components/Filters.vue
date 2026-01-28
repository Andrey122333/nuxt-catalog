<template>
  <aside class="filters">
    <div class="filter-header">
      <h3>Фильтры</h3>
      <button @click="resetFilters" class="reset-button">Сбросить</button>
    </div>

    <!-- Категории -->
    <div class="filter-section">
      <h4>Категории</h4>
      <label v-for="cat in filterOptions.categories" :key="cat.id" class="checkbox">
        <input
          type="checkbox"
          :checked="selectedCategories.includes(cat.id)"
          @change="toggleCategory(cat.id)"
        />
        <span>{{ cat.name }}</span>
        <span class="count">({{ cat.count }})</span>
      </label>
    </div>

    <!-- Цена -->
    <div class="filter-section">
      <h4>Цена</h4>
      <div class="price-inputs">
        <div class="price-input">
          <label>От</label>
          <input
            type="number"
            v-model.number="priceMin"
            :min="filterOptions.priceRange.min"
            :max="priceMax"
          />
        </div>
        <div class="price-input">
          <label>До</label>
          <input
            type="number"
            v-model.number="priceMax"
            :min="priceMin"
            :max="filterOptions.priceRange.max"
          />
        </div>
      </div>
      <div class="price-range">
        <input
          type="range"
          :min="filterOptions.priceRange.min"
          :max="filterOptions.priceRange.max"
          v-model.number="priceMax"
          class="range-slider"
        />
      </div>
      <div class="price-labels">
        <span>{{ formatPrice(filterOptions.priceRange.min) }}</span>
        <span>{{ formatPrice(filterOptions.priceRange.max) }}</span>
      </div>
    </div>

    <!-- Бренды -->
    <div class="filter-section">
      <h4>Бренд</h4>
      <label v-for="brand in filterOptions.brands" :key="brand.id" class="checkbox">
        <input
          type="checkbox"
          :checked="selectedBrands.includes(brand.id)"
          @change="toggleBrand(brand.id)"
        />
        <span>{{ brand.name }}</span>
        <span class="count">({{ brand.count }})</span>
      </label>
    </div>

    <!-- Наличие -->
    <div class="filter-section">
      <h4>Наличие</h4>
      <label class="radio">
        <input type="radio" v-model="availability" value="all" />
        <span>Все товары</span>
      </label>
      <label class="radio">
        <input type="radio" v-model="availability" value="in_stock" />
        <span>В наличии</span>
      </label>
      <label class="radio">
        <input type="radio" v-model="availability" value="out_of_stock" />
        <span>Нет в наличии</span>
      </label>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { FilterOptions } from '~/types';
import { formatPrice } from '~/utils/products';

const props = defineProps<{
  filterOptions: FilterOptions;
}>();

const route = useRoute();
const router = useRouter();

// Реактивное состояние
const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const priceMin = ref(props.filterOptions.priceRange.min);
const priceMax = ref(props.filterOptions.priceRange.max);
const availability = ref<'all' | 'in_stock' | 'out_of_stock'>('all');

// Флаг инициализации для предотвращения двойного обновления
const isInitialized = ref(false);

// Инициализация из URL
watch(() => route.query, () => {
  const categories = route.query.category;
  const brands = route.query.brand;
  
  selectedCategories.value = Array.isArray(categories) ? categories : categories ? [categories] : [];
  selectedBrands.value = Array.isArray(brands) ? brands : brands ? [brands] : [];
  priceMin.value = route.query.price_min ? Number(route.query.price_min) : props.filterOptions.priceRange.min;
  priceMax.value = route.query.price_max ? Number(route.query.price_max) : props.filterOptions.priceRange.max;
  availability.value = (route.query.availability as any) || 'all';
  
  isInitialized.value = true;
}, { immediate: true });

// Автоматическое применение фильтров при изменении
watch(
  [selectedCategories, selectedBrands, priceMin, priceMax, availability],
  () => {
    if (!isInitialized.value) return;

    const query: any = {};

    if (selectedCategories.value.length > 0) {
      query.category = selectedCategories.value;
    }
    if (selectedBrands.value.length > 0) {
      query.brand = selectedBrands.value;
    }
    if (priceMin.value > props.filterOptions.priceRange.min) {
      query.price_min = priceMin.value;
    }
    if (priceMax.value < props.filterOptions.priceRange.max) {
      query.price_max = priceMax.value;
    }
    if (availability.value !== 'all') {
      query.availability = availability.value;
    }
    if (route.query.sort) {
      query.sort = route.query.sort;
    }

    router.push({ path: '/catalog', query });
  },
  { deep: true }
);

function resetFilters() {
  selectedCategories.value = [];
  selectedBrands.value = [];
  priceMin.value = props.filterOptions.priceRange.min;
  priceMax.value = props.filterOptions.priceRange.max;
  availability.value = 'all';
  router.push('/catalog');
}

function toggleCategory(categoryId: string) {
  if (selectedCategories.value.includes(categoryId)) {
    selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId);
  } else {
    selectedCategories.value = [...selectedCategories.value, categoryId];
  }
}

function toggleBrand(brandId: string) {
  if (selectedBrands.value.includes(brandId)) {
    selectedBrands.value = selectedBrands.value.filter(id => id !== brandId);
  } else {
    selectedBrands.value = [...selectedBrands.value, brandId];
  }
}
</script>

<style scoped>
.filters {
  background: var(--white);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--gray-200);
}

.filter-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.reset-button {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.875rem;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.reset-button:hover {
  background: var(--primary-light);
}

.filter-section {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-200);
}

.filter-section:last-of-type {
  border-bottom: none;
}

.filter-section h4 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
}

.checkbox,
.radio {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  cursor: pointer;
  transition: var(--transition);
}

.checkbox:hover,
.radio:hover {
  color: var(--primary);
}

.checkbox input[type='checkbox'],
.radio input[type='radio'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary);
}

.checkbox span,
.radio span {
  flex: 1;
}

.count {
  color: var(--gray-500);
  font-size: 0.875rem;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.price-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.price-input label {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.price-input input[type='number'] {
  padding: var(--spacing-sm);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.price-range {
  margin-bottom: var(--spacing-sm);
}

.range-slider {
  width: 100%;
  height: 6px;
  cursor: pointer;
  accent-color: var(--primary);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--gray-500);
}

@media (max-width: 768px) {
  .filters {
    padding: var(--spacing-md);
  }

  .filter-section {
    margin-bottom: var(--spacing-lg);
  }
}
</style>
