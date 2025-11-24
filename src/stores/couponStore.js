import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '@/services/apiService';
import { useToast } from 'vue-toastification';

export const useCouponStore = defineStore('coupon', () => {
  const coupons = ref([]);
  const selectedCoupon = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const lastFetchTime = ref(null);

  const toast = useToast();

  // Cupom aplicado atualmente (para checkout)
  // Tenta carregar de localStorage para persistir entre páginas
  const appliedCoupon = ref(null);
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('appliedCoupon');
      appliedCoupon.value = raw ? JSON.parse(raw) : null;
    }
  } catch (e) {
    console.warn('Não foi possível carregar appliedCoupon do localStorage', e);
  }

  // Verificar se precisa recarregar os dados
  const shouldRefetch = () => {
    return !lastFetchTime.value || (Date.now() - lastFetchTime.value) > 5 * 60 * 1000; // 5 minutos
  };

  // Buscar todos os cupons
  const fetchAllCoupons = async () => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getAllCoupons();
      coupons.value = data || [];
      lastFetchTime.value = Date.now();
    } catch (err) {
      error.value = 'Erro ao carregar cupons';
      coupons.value = [];
      console.error('Erro ao buscar cupons:', err);
      toast.error('Erro ao carregar cupons');
    } finally {
      loading.value = false;
    }
  };

  // Buscar cupom por ID
  const fetchCouponById = async (couponId) => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getCouponById(couponId);
      selectedCoupon.value = data;
      return data;
    } catch (err) {
      error.value = 'Erro ao carregar cupom';
      selectedCoupon.value = null;
      console.error('Erro ao buscar cupom:', err);
      toast.error('Erro ao carregar cupom');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Helper para formatar dados para o backend
  function formatCouponPayload(couponData) {
    return {
      code: couponData.code?.trim().toUpperCase(),
      discount_percentage: couponData.discount_percentage ?? couponData.value ?? 0,
      start_date: couponData.start_date,
      end_date: couponData.end_date,
    };
  }

  // Criar novo cupom
  const createNewCoupon = async (couponData) => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const payload = formatCouponPayload(couponData);
      const data = await createCoupon(payload);
      coupons.value.push(data);
      lastFetchTime.value = Date.now();
      toast.success('Cupom criado com sucesso!');
      return data;
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Resposta do servidor:', err.response?.data);
      console.error('Status:', err.response?.status);
      
      // Tratar erro 422 especificamente
      if (err.response?.status === 422) {
        const serverError = err.response.data;
        console.error('Detalhes completos do erro 422:', serverError);
        
        if (serverError.detail && Array.isArray(serverError.detail)) {
          console.error('Array de detalhes:', serverError.detail);
          serverError.detail.forEach((error, index) => {
            console.error(`Erro ${index + 1}:`, error);
            console.error(`  - Campo: ${error.loc?.join('.')}`);
            console.error(`  - Mensagem: ${error.msg}`);
            console.error(`  - Tipo: ${error.type}`);
            console.error(`  - Valor recebido: ${error.input}`);
          });
          
          const errorMessages = serverError.detail.map(error => 
            `${error.loc?.join('.')}: ${error.msg}`
          ).join(', ');
          error.value = `Erro de validação: ${errorMessages}`;
          toast.error(`Erro de validação: ${errorMessages}`);
        } else {
          console.error('Estrutura inesperada do erro:', serverError);
          error.value = 'Erro de validação: Dados inválidos';
          toast.error('Erro de validação: Dados inválidos');
        }
      } else {
        error.value = 'Erro ao criar cupom';
        toast.error('Erro ao criar cupom');
      }
      
      console.error('Erro ao criar cupom:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Atualizar cupom
  const updateExistingCoupon = async (couponId, couponData) => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const payload = formatCouponPayload(couponData);
      
      // Remove campos undefined ou null antes de enviar
      const cleanData = Object.keys(payload).reduce((acc, key) => {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
          acc[key] = payload[key]
        }
        return acc
      }, {})
      
      // 🔹 Busca o cupom atual para verificar se o código foi alterado
      const currentCoupon = coupons.value.find(c => c.id === couponId)
      
      // 🔹 Se o código não foi alterado, REMOVE do payload
      if (currentCoupon && currentCoupon.code === cleanData.code) {
        delete cleanData.code
        console.debug('⚠️ Código do cupom não foi alterado, removendo do payload')
      }
      
      const data = await updateCoupon(couponId, cleanData);

      // Atualiza o cupom na lista
      const index = coupons.value.findIndex(c => c.id === couponId);
      if (index !== -1) {
        coupons.value[index] = data;
      }
      
      // Atualiza o cupom selecionado se for o mesmo
      if (selectedCoupon.value && selectedCoupon.value.id === couponId) {
        selectedCoupon.value = data;
      }
      
      lastFetchTime.value = Date.now();
      toast.success('Cupom atualizado com sucesso!');
      return data;
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Resposta do servidor:', err.response?.data);
      console.error('Status:', err.response?.status);
      
      // Tratar erro 422 especificamente
      if (err.response?.status === 422) {
        const serverError = err.response.data;
        console.error('Detalhes completos do erro 422:', serverError);
        
        if (serverError.detail && Array.isArray(serverError.detail)) {
          console.error('Array de detalhes:', serverError.detail);
          serverError.detail.forEach((error, index) => {
            console.error(`Erro ${index + 1}:`, error);
            console.error(`  - Campo: ${error.loc?.join('.')}`);
            console.error(`  - Mensagem: ${error.msg}`);
            console.error(`  - Tipo: ${error.type}`);
            console.error(`  - Valor recebido: ${error.input}`);
          });
          
          const errorMessages = serverError.detail.map(error => 
            `${error.loc?.join('.')}: ${error.msg}`
          ).join(', ');
          error.value = `Erro de validação: ${errorMessages}`;
          toast.error(`Erro de validação: ${errorMessages}`);
        } else {
          console.error('Estrutura inesperada do erro:', serverError);
          error.value = 'Erro de validação: Dados inválidos';
          toast.error('Erro de validação: Dados inválidos');
        }
      } else {
        error.value = 'Erro ao atualizar cupom';
        toast.error('Erro ao atualizar cupom');
      }
      
      console.error('Erro ao atualizar cupom:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Deletar cupom
  const deleteExistingCoupon = async (couponId) => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      await deleteCoupon(couponId);
      
      // Remove o cupom da lista
      coupons.value = coupons.value.filter(c => c.id !== couponId);
      
      // Limpa o cupom selecionado se for o mesmo
      if (selectedCoupon.value && selectedCoupon.value.id === couponId) {
        selectedCoupon.value = null;
      }
      
      lastFetchTime.value = Date.now();
      toast.success('Cupom excluído com sucesso!');
    } catch (err) {
      error.value = 'Erro ao excluir cupom';
      console.error('Erro ao excluir cupom:', err);
      toast.error('Erro ao excluir cupom');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para forçar atualização dos dados
  const refreshCoupons = async () => {
    lastFetchTime.value = null;
    await fetchAllCoupons();
  };

  // Computed properties
  const totalCoupons = computed(() => coupons.value.length);
  
  const activeCoupons = computed(() => 
    coupons.value.filter(coupon => {
      if (!coupon.end_date) return true;
      return new Date(coupon.end_date) >= new Date();
    })
  );
  
  const expiredCoupons = computed(() => 
    coupons.value.filter(coupon => {
      if (!coupon.end_date) return false;
      return new Date(coupon.end_date) < new Date();
    })
  );

  const validCoupons = computed(() => 
    coupons.value.filter(coupon => {
      if (coupon.end_date && new Date(coupon.end_date) < new Date()) return false;
      return true;
    })
  );

  // Limpar estado
  const clearState = () => {
    coupons.value = [];
    selectedCoupon.value = null;
    error.value = null;
    lastFetchTime.value = null;
  };

  // Definir/limpar cupom aplicado (usado pelo checkout)
  const setAppliedCoupon = (coupon) => {
    appliedCoupon.value = coupon || null;
    try {
      if (typeof localStorage !== 'undefined') {
        if (coupon) localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
        else localStorage.removeItem('appliedCoupon');
      }
    } catch (e) {
      console.warn('Não foi possível salvar appliedCoupon no localStorage', e);
    }
  };

  const clearAppliedCoupon = () => setAppliedCoupon(null);

  return {
    // State
    coupons,
    selectedCoupon,
    loading,
    error,
    lastFetchTime,
    
    // Actions
    fetchAllCoupons,
    fetchCouponById,
    createNewCoupon,
    updateExistingCoupon,
    deleteExistingCoupon,
    refreshCoupons,
    clearState,
    shouldRefetch,
    
    // Computed
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    validCoupons
    ,
    // Applied coupon
    appliedCoupon,
    setAppliedCoupon,
    clearAppliedCoupon
  };
});
