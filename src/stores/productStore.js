import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { getAllProducts } from '@/services/apiService';
import { useAuthStore } from './authStore';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchTerm = ref('');
  const selectedCategory = ref('Todos os Produtos');
  const orderBy = ref('');

  const authStore = useAuthStore();
  const userId = ref(authStore.user?.id || null);

  // Atualiza userId caso o usuário seja alterado
  watch(() => authStore.user, (newUser) => {
    userId.value = newUser?.id || null;
  });

  const fetchProducts = async () => {
    loading.value = true;
    try {
      const response = await getAllProducts();
      products.value = response;
      error.value = null;
    } catch (err) {
      error.value = 'Erro ao carregar produtos';
      products.value = [];
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Produtos do usuário (admin)
  const productsByUser = computed(() => {
    if (!userId.value) return [];
    // Certifique-se que cada produto tem o campo category.user_id!
    return products.value.filter(p => p.category?.user_id === userId.value);
  });

  // Getter para total de produtos do usuário
  const totalProdutos = computed(() => productsByUser.value.length);

  // Getter para produtos recentes do usuário
  const ultimosProdutos = computed(() => {
    return productsByUser.value
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
      filtrados = [...filtrados].sort((a, b) => b.price - a.price);
    } else if (orderBy.value === 'menor-valor') {
      filtrados = [...filtrados].sort((a, b) => a.price - b.price);
    } else if (orderBy.value === 'az') {
      filtrados = [...filtrados].sort((a, b) => a.name.localeCompare(b.name));
    } else if (orderBy.value === 'za') {
      filtrados = [...filtrados].sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtrados;
  });

  return {
    products,
    loading,
    error,
    searchTerm,
    selectedCategory,
    orderBy,
    userId,
    fetchProducts,
    filteredProducts,
    productsByUser,
    totalProdutos,
    ultimosProdutos
  };
});