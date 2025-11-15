import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { getAllProducts } from '@/services/apiService';
import { useAuthStore } from './authStore';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchTerm = ref('');
  const selectedCategory = ref('Todos os Produtos');
  const orderBy = ref('');
  const lastFetchTime = ref(null);

  const authStore = useAuthStore();
  const userId = ref(authStore.user?.id || null);

  // Atualiza userId caso o usuário seja alterado
  watch(() => authStore.user, (newUser) => {
    userId.value = newUser?.id || null;
    // Se o usuário mudou, recarrega os produtos
    if (newUser?.id) {
      fetchProducts();
    }
  }, { immediate: false });

  const fetchProducts = async () => {
    // Evita múltiplas chamadas simultâneas
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getAllProducts();
      products.value = response || [];
      lastFetchTime.value = Date.now();
    } catch (err) {
      error.value = 'Erro ao carregar produtos';
      products.value = [];
      console.error('Erro ao buscar produtos:', err);
    } finally {
      loading.value = false;
    }
  };

  // Verifica se precisa recarregar os dados
  const shouldRefetch = () => {
    return !lastFetchTime.value || (Date.now() - lastFetchTime.value) > 5 * 60 * 1000; // 5 minutos
  };

  // Produtos do usuário (admin) ou todos os produtos (moderador)
  const productsByUser = computed(() => {
    if (!products.value.length) return [];
    
    // Se não tem userId ou é moderador, retorna todos os produtos
    const userRole = authStore.user?.role?.toUpperCase();
    if (!userId.value || userRole === 'MODERATOR') {
      return products.value;
    }
    
    // Para admins, filtra apenas produtos com categorias do usuário
    return products.value.filter(p => {
      // Verifica se o produto tem categoria e se a categoria pertence ao usuário
      return p.category && p.category.user_id === userId.value;
    });
  });

  // Getter para total de produtos do usuário
  const totalProdutos = computed(() => productsByUser.value.length);

  // Getter para produtos recentes do usuário
  const ultimosProdutos = computed(() => {
    if (!productsByUser.value.length) return [];
    
    return productsByUser.value
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
      })
      .slice(0, 5);
  });

  // Filtro de busca e ordenação para telas de listagem
  const filteredProducts = computed(() => {
    let filtrados = productsByUser.value;

    if (selectedCategory.value && selectedCategory.value !== 'Todos os Produtos') {
      filtrados = filtrados.filter(p => p.category?.name === selectedCategory.value);
    }

    if (searchTerm.value.trim() !== '') {
      const termo = searchTerm.value.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        (p.name && p.name.toLowerCase().includes(termo)) ||
        (p.description && p.description.toLowerCase().includes(termo)) ||
        (p.category && p.category.name && p.category.name.toLowerCase().includes(termo))
      );
    }

    if (orderBy.value === 'maior-valor') {
      filtrados = [...filtrados].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (orderBy.value === 'menor-valor') {
      filtrados = [...filtrados].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (orderBy.value === 'az') {
      filtrados = [...filtrados].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (orderBy.value === 'za') {
      filtrados = [...filtrados].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    return filtrados;
  });

  // Função para forçar atualização dos dados
  const refreshProducts = async () => {
    lastFetchTime.value = null;
    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    searchTerm,
    selectedCategory,
    orderBy,
    userId,
    lastFetchTime,
    fetchProducts,
    refreshProducts,
    shouldRefetch,
    filteredProducts,
    productsByUser,
    totalProdutos,
    ultimosProdutos
  };
});