import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAllProducts } from '@/services/apiService';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchTerm = ref('');
  const selectedCategory = ref('Todos os Produtos');
  const orderBy = ref(''); 
  const userId = ref(211); 

  // Busca produtos da API
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

  // Produtos filtrados conforme lógica da view
  const filteredProducts = computed(() => {
    let filtrados = products.value;
    if (selectedCategory.value && selectedCategory.value !== 'Todos os Produtos') {
      filtrados = filtrados.filter(p => p.category?.name === selectedCategory.value);
    }
    // Busca
    if (searchTerm.value.trim() !== '') {
      const termo = searchTerm.value.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        (p.name && p.name.toLowerCase().includes(termo)) ||
        (p.description && p.description.toLowerCase().includes(termo)) ||
        (p.category && p.category.name && p.category.name.toLowerCase().includes(termo))
      );
    }
    // Ordenação
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
    filteredProducts
  };
});