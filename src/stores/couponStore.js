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
import { useAuthStore } from '@/stores/authStore';

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
      // ✅ Removido o toast daqui (será exibido no componente)
      return data;
    } catch (err) {
      console.error('Erro ao criar cupom (store):', err);
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
      // ✅ Removido o toast daqui (será exibido no componente)
      return data;
    } catch (err) {
      console.debug('Erro ao atualizar cupom (store):', err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Deletar cupom - ✅ SOMENTE AQUI a verificação de permissão
  const deleteExistingCoupon = async (couponId) => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      // ✅ Verifica se o usuário é moderador - SOMENTE na exclusão
      const authStore = useAuthStore()
      if (authStore.user?.role === 'MODERATOR') {
        throw new Error('PERMISSION_DENIED')
      }

      await deleteCoupon(couponId);
      
      // Remove o cupom da lista
      coupons.value = coupons.value.filter(c => c.id !== couponId);
      
      // Limpa o cupom selecionado se for o mesmo
      if (selectedCoupon.value && selectedCoupon.value.id === couponId) {
        selectedCoupon.value = null;
      }
      
      lastFetchTime.value = Date.now();
    } catch (err) {
      console.debug('Erro ao excluir cupom (store):', err.message);
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
