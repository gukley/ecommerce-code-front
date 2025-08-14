// =========================================================
// cartStore.js - Store do Pinia (Versão Corrigida e Reativa)
// =========================================================

import { defineStore, storeToRefs } from 'pinia';
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
  const items = ref([]); // Guarda os IDs e quantidades (dados brutos)
  const detailedItems = ref([]); // Guarda os objetos completos dos produtos
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

  // Função para carregar os detalhes dos produtos
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
          console.error(`Erro ao buscar detalhes do produto ${item.product_id}:`, err);
          return { ...item, product: null };
        }
      });
      detailedItems.value = await Promise.all(detailedItemsPromises);
    } finally {
      loading.value = false;
    }
  }

  // Sincroniza o carrinho do utilizador autenticado com a API
  async function syncAuthenticatedCart() {
    try {
      const res = await getCart();
      cartId.value = res.id;
      const apiItems = await getCartItems();
      items.value = apiItems;
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

  // Cria um novo carrinho na API
  async function createNewCart() {
    try {
      const createRes = await createCart();
      cartId.value = createRes.id;
      items.value = [];
      detailedItems.value = [];
    } catch (createErr) {
      console.error('Falha ao criar o carrinho:', createErr);
      toast.error('Não foi possível carregar ou criar seu carrinho.');
    }
  }

  // Sincroniza o carrinho do convidado com o localStorage
  function syncGuestCart() {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    items.value = localCart;
    loadDetailedItems(items.value);
  }

  // Inicializa o carrinho. Este é o ponto de entrada principal.
  async function initCart() {
    loading.value = true;
    if (isGuest.value) {
      syncGuestCart();
    } else {
      await syncAuthenticatedCart();
    }
    loading.value = false;
  }
  
  // Função para salvar o carrinho do convidado
  function saveGuestCart() {
    localStorage.setItem('guestCart', JSON.stringify(items.value));
  }

  // Adiciona um item ao carrinho
  async function addItem(productId, quantity = 1, unitPrice) {
    try {
      // 1. Obter o stock atual do produto
      const product = await getProductById(productId);
      const stock = product.stock;

      // 2. Encontrar o item existente para verificar o total
      const existingItem = items.value.find(item => item.product_id === productId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + quantity;

      // 3. Verificar stock
      if (newQuantity > stock) {
        toast.error(`Apenas ${stock} itens em stock. Não é possível adicionar mais.`);
        return;
      }

      // 4. Lógica para utilizadores autenticados ou convidados
      if (!isGuest.value) {
        await addItemToCart(productId, quantity, unitPrice);
        toast.success('Item adicionado ao carrinho!');
        await syncAuthenticatedCart(); // Força a sincronização após a ação
      } else {
        if (existingItem) {
          existingItem.quantity = newQuantity;
        } else {
          items.value.push({ product_id: productId, quantity: newQuantity, unit_price: unitPrice });
        }
        saveGuestCart();
        await loadDetailedItems(items.value);
        toast.success('Item adicionado ao carrinho!');
      }
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      toast.error('Erro ao adicionar item: ' + (err.message || 'Verifique a conexão.'));
    }
  }

  // Atualiza a quantidade do item
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
        toast.info(`Quantidade de item atualizada para ${newQuantity}.`);
        await syncAuthenticatedCart();
      } else {
        const item = items.value.find(i => i.product_id === productId);
        if (item) {
          item.quantity = newQuantity;
          saveGuestCart();
          await loadDetailedItems(items.value);
          toast.info(`Quantidade de item atualizada para ${newQuantity}.`);
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      toast.error('Erro ao atualizar item: ' + err.message);
    }
  }

  // Remove um item do carrinho
  async function removeItem(productId) {
    try {
      if (!isGuest.value) {
        await removeCartItem(productId);
        toast.success('Item removido do carrinho.');
        await syncAuthenticatedCart();
      } else {
        const itemIndex = items.value.findIndex(item => item.product_id === productId);
        if (itemIndex > -1) {
          items.value.splice(itemIndex, 1);
          saveGuestCart();
          await loadDetailedItems(items.value);
          toast.success('Item removido do carrinho.');
        }
      }
    } catch (err) {
      console.error('Erro ao remover item:', err);
      toast.error('Erro ao remover item: ' + err.message);
    }
  }

  // Limpa o carrinho
  async function clearCart() {
    try {
      if (!isGuest.value) {
        await clearCartAPI();
        toast.success('Carrinho limpo.');
        await syncAuthenticatedCart();
      } else {
        items.value = [];
        detailedItems.value = [];
        saveGuestCart();
        toast.success('Carrinho limpo.');
      }
    } catch (err) {
      console.error('Erro ao limpar o carrinho:', err);
      toast.error('Erro ao limpar o carrinho: ' + err.message);
    }
  }

  // Observa o estado de autenticação e inicializa o carrinho
  watch(isGuest, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      initCart();
    }
  });

  // Expor propriedades e funções REATIVAS!
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
    removeItem,
    clearCart
  };
});