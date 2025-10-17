import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { 
  getCart,
  createCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartAPI,
  getProductById
} from '@/services/apiService';
import { useToast } from 'vue-toastification';
import { useAuthStore } from './authStore';

export const useCartStore = defineStore('cart', () => {
  const toast = useToast();
  const authStore = useAuthStore();

  // Estado reativo
  const cartId = ref(null);
  const items = ref([]); // IDs e quantidades (dados brutos)
  const detailedItems = ref([]); // Objetos completos dos produtos
  const loading = ref(false);

  const isGuest = computed(() => !authStore.isAuthenticated);

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    detailedItems.value.reduce((sum, item) => {
      if (item?.product?.price != null) {
        return sum + item.quantity * item.product.price;
      }
      return sum;
    }, 0)
  );

  // Carrega detalhes dos produtos
  async function loadDetailedItems(rawItems) {
    if (!rawItems || rawItems.length === 0) {
      detailedItems.value = [];
      return;
    }
    
    loading.value = true;
    try {
      const detailedItemsPromises = rawItems.map(async item => {
        try {
          const product = await getProductById(item.product_id);
          return { ...item, product };
        } catch (err) {
          console.error(`Erro ao buscar produto ${item.product_id}:`, err);
          return { ...item, product: null };
        }
      });
      detailedItems.value = await Promise.all(detailedItemsPromises);
    } finally {
      loading.value = false;
    }
  }

  // 🔹 Carrinho autenticado sempre vem da API
  async function syncAuthenticatedCart() {
    try {
      const res = await getCart();
      cartId.value = res.id;

      const apiItems = await getCartItems();
      items.value = apiItems && apiItems.length > 0 ? apiItems : [];

      await loadDetailedItems(items.value);
    } catch (err) {
      if (err.message && err.message.includes('not found')) {
        await createNewCart();
      } else {
        console.error('Erro ao sincronizar carrinho autenticado:', err);
        toast.error('Não foi possível carregar o seu carrinho. Verifique a conexão.');
      }
    }
  }

  // Cria carrinho vazio na API
  async function createNewCart() {
    try {
      const createRes = await createCart();
      cartId.value = createRes.id;
      items.value = [];
      detailedItems.value = [];
    } catch (createErr) {
      console.error('Falha ao criar carrinho:', createErr);
      toast.error('Não foi possível criar o carrinho.');
    }
  }

  // Carrinho do convidado (localStorage)
  async function syncGuestCart() {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    items.value = localCart;
    await loadDetailedItems(items.value);
  }

  function saveGuestCart() {
    localStorage.setItem('guestCart', JSON.stringify(items.value));
  }

  // 🔹 Merge do guestCart para o backend no login
  async function mergeGuestCartOnLogin() {
    if (!isGuest.value && localStorage.getItem('guestCart')) {
      const guestItems = JSON.parse(localStorage.getItem('guestCart') || '[]');

      for (const item of guestItems) {
        try {
          await addItemToCart(item.product_id, item.quantity, item.unit_price);
        } catch (err) {
          console.error(`Erro ao enviar item ${item.product_id}:`, err);
        }
      }

      localStorage.removeItem('guestCart');
      await syncAuthenticatedCart();
    }
  }

  // 🔹 Inicializa o carrinho
  async function initCart() {
    loading.value = true;

    if (isGuest.value) {
      await syncGuestCart();
    } else {
      await mergeGuestCartOnLogin();
      await syncAuthenticatedCart();
    }

    loading.value = false;
  }

  // Adiciona item
  async function addItem(productId, quantity = 1, unitPrice) {
    try {
      const product = await getProductById(productId);
      const stock = product.stock;

      const existingItem = items.value.find(item => item.product_id === productId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + quantity;

      if (newQuantity > stock) {
        toast.error(`Apenas ${stock} itens em stock. Não é possível adicionar mais.`);
        return;
      }

      if (!isGuest.value) {
        await addItemToCart(productId, quantity, unitPrice);
        await syncAuthenticatedCart();
      } else {
        if (existingItem) {
          existingItem.quantity = newQuantity;
        } else {
          items.value.push({ product_id: productId, quantity: newQuantity, unit_price: unitPrice });
        }
        items.value = [...items.value];
        saveGuestCart();
        await loadDetailedItems(items.value);
      }
      toast.success('Item adicionado ao carrinho!');
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      toast.error('Erro ao adicionar item: ' + (err.message || 'Verifique a conexão.'));
    }
  }

  // Atualiza quantidade
  async function updateItemQuantity(productId, newQuantity) {
    try {
      const product = await getProductById(productId);
      const stock = product.stock;

      if (newQuantity < 1) {
        await removeItem(productId);
        return;
      }
      if (newQuantity > stock) {
        toast.error(`Apenas ${stock} itens em stock. Não é possível adicionar mais.`);
        return;
      }

      if (!isGuest.value) {
        await updateCartItem(productId, newQuantity);
        await syncAuthenticatedCart();
      } else {
        const idx = items.value.findIndex(i => i.product_id === productId);
        if (idx !== -1) {
          items.value[idx] = { ...items.value[idx], quantity: newQuantity };
          items.value = [...items.value];
          saveGuestCart();
          await loadDetailedItems(items.value);
        }
      }
      toast.info(`Quantidade atualizada para ${newQuantity}.`);
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      toast.error('Erro ao atualizar item: ' + err.message);
    }
  }

  async function updateQuantity(productId, delta) {
    const item = items.value.find(i => i.product_id === productId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    await updateItemQuantity(productId, newQuantity);
  }

  // Remove item
  async function removeItem(productId) {
    try {
      if (!isGuest.value) {
        await removeCartItem(productId);
        await syncAuthenticatedCart();
      } else {
        const itemIndex = items.value.findIndex(item => item.product_id === productId);
        if (itemIndex > -1) {
          items.value.splice(itemIndex, 1);
          items.value = [...items.value];
          saveGuestCart();
          await loadDetailedItems(items.value);
        }
      }
      toast.success('Item removido do carrinho.');
    } catch (err) {
      console.error('Erro ao remover item:', err);
      toast.error('Erro ao remover item: ' + err.message);
    }
  }

  // Limpa carrinho
  async function clearCart() {
    try {
      if (!isGuest.value) {
        await clearCartAPI();
        await syncAuthenticatedCart();
      } else {
        items.value = [];
        detailedItems.value = [];
        saveGuestCart();
      }
      toast.success('Carrinho limpo.');
    } catch (err) {
      console.error('Erro ao limpar carrinho:', err);
      toast.error('Erro ao limpar carrinho: ' + err.message);
    }
  }

  // 🔹 Observa login/logout
  watch(isGuest, async (newValue, oldValue) => {
    if (oldValue && !newValue) {
      await mergeGuestCartOnLogin();
    }
    await initCart();
  });

  
  // Expor propriedades e funções
  return {
    cartId,
    items,
    detailedItems,
    loading,
    isGuest,
    totalItems,
    totalPrice,
    initCart,
    addItem,
    updateItemQuantity,
    updateQuantity,
    removeItem,
    clearCart
  };
},
{
    persist: {
      key: 'cart',
      storage: localStorage,
      paths: ['items', 'cartId'] // só persiste o necessário
    }
  }

)
