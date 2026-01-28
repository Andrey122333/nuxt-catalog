# Nuxt Каталог "Код и Кофе"

Интернет-магазин товаров для разработчиков на Nuxt 3 с Vue 3 Composition API.

## Технологии

- **Nuxt:** 3.10.0
- **Vue:** 3.4.15
- **TypeScript:** 5.3.3
- **Vite:** 6.0.0
- **Nitro Engine** для SSR

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3012

## Production сборка

```bash
npm run build
npm start
```

Или вручную:
```bash
PORT=3012 node .output/server/index.mjs
```

## Docker

```bash
docker build -t nuxt-catalog .
docker run -p 3012:3012 nuxt-catalog
```

## Структура проекта

```
nuxt-catalog/
├── components/
│   ├── Header.vue
│   ├── Footer.vue
│   └── ProductCard.vue
├── composables/
│   └── useCart.ts          # Composable для корзины
├── pages/
│   ├── index.vue
│   └── catalog/
│       ├── index.vue       # Список товаров
│       └── [id].vue        # Детальная страница
├── utils/
│   └── products.ts         # Утилиты для товаров
├── types/
│   └── index.ts            # TypeScript типы
├── data/
│   └── products.json
└── nuxt.config.ts
```

## Особенности Nuxt 3

### Composables

Auto-import composables без явного импорта:

```vue
<script setup>
const cart = useCart();  // Автоматически импортируется
const route = useRoute();
</script>
```

### useState

Shared state между компонентами:

```typescript
const items = useState<CartItem[]>('cart-items', () => []);
```

### useAsyncData

SSR data fetching (если используется):

```typescript
const { data } = await useAsyncData('products', () => fetchProducts());
```

## Корзина

Корзина реализована через composable `useCart()`:

- Сохранение в LocalStorage
- Реактивное состояние через `useState`
- Auto-import во всех компонентах
