import type { CartItem } from '~/types';

const STORAGE_KEY = 'kod-i-kofe-cart';

export const useCart = () => {
  const items = useState<CartItem[]>('cart-items', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Ошибка загрузки корзины:', e);
        }
      }
    }
    return [];
  });

  const total = computed(() => 
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const itemCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const addItem = (id: number, name: string, price: number, image: string, maxQuantity: number) => {
    const existing = items.value.find(item => item.id === id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, maxQuantity);
    } else {
      items.value.push({ id, name, price, quantity: 1, image, maxQuantity });
    }

    save();
  };

  const removeItem = (id: number) => {
    items.value = items.value.filter(item => item.id !== id);
    save();
  };

  const updateQuantity = (id: number, quantity: number) => {
    const item = items.value.find(item => item.id === id);
    if (item) {
      item.quantity = Math.min(Math.max(1, quantity), item.maxQuantity);
      save();
    }
  };

  const toggleItem = (id: number, name: string, price: number, image: string, maxQuantity: number) => {
    if (isInCart(id)) {
      removeItem(id);
    } else {
      addItem(id, name, price, image, maxQuantity);
    }
  };

  const isInCart = (id: number): boolean => {
    return items.value.some(item => item.id === id);
  };

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
    }
  };

  return {
    items: readonly(items),
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    toggleItem,
    isInCart
  };
};
