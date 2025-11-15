import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
    getAllOrders,
    getOrderByAdmin,
    getUsersOrders,
    getOrdersById,
    createOrder,
    updateOrderStatus,
    cancelOrder
} from '@/services/apiService'
import { useToast } from 'vue-toastification'

const VALID_STATUS_VALUES = ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'CANCELADO'];

function normalizeStatusValue(raw) {
  if (!raw && raw !== '') return raw;
  const s = String(raw).trim().toUpperCase();

  // mapeia variantes inglesas para português
  const MAP = {
    'PENDING': 'PENDENTE',
    'PROCESSING': 'PROCESSANDO',
    'SHIPPED': 'ENVIADO',
    'SENT': 'ENVIADO',
    'CANCELED': 'CANCELADO',
    'CANCELLED': 'CANCELADO',
    'CANCELADO': 'CANCELADO'
  };

  const normalized = MAP[s] || s;

  // retorna apenas se for um valor válido
  return VALID_STATUS_VALUES.includes(normalized) ? normalized : 'PENDENTE';
}

export const useOrderStore = defineStore('order', () => { 
    const orders = ref([])
    const selectedOrder = ref(null)
    const loading = ref(false)
    const lastFetchTime = ref(null)

    const toast = useToast()

    // Função auxiliar para processar um pedido e calcular o total
    const processOrderData = (order) => {
        let total = 0;
        let products = [];

        // Se vier um campo order_items (mais comum em APIs), use ele para montar os produtos
        if (order.order_items && Array.isArray(order.order_items)) {
            products = order.order_items.map(item => {
                const product = item.product || {}; // pode ser que venha item.product ou item.product_id
                const price = Number(item.unit_price || product.price || 0);
                total += price * (item.quantity || 1);
                return {
                    id: product.id || item.product_id,
                    name: product.name || 'Produto',
                    image_url: product.image_url || product.image_path
                        ? `${import.meta.env.VITE_API_URL || ''}${(product.image_path || '').startsWith('/') ? '' : '/'}${product.image_path || ''}`
                        : '',
                    quantity: item.quantity || 1,
                    price: price
                };
            });
        }
        // Caso não tenha order_items, mas tenha products (fallback antigo)
        else if (order.products && Array.isArray(order.products)) {
            products = order.products.map(product => {
                const price = Number(product.price) || 0;
                total += price * (product.quantity || 1);
                return {
                    id: product.id,
                    name: product.name,
                    image_url: product.image_url || product.image_path
                        ? `${import.meta.env.VITE_API_URL || ''}${(product.image_path || '').startsWith('/') ? '' : '/'}${product.image_path || ''}`
                        : '',
                    quantity: product.quantity || 1,
                    price: price
                };
            });
        }

        return {
            ...order,
            total: Number(total).toFixed(2),
            products
        }
    }

    // Buscar todos pedidos
    const fetchAllOrders = async () => { 
        loading.value = true
        try { 
            const data = await getAllOrders()
            orders.value = data.map(processOrderData)
            lastFetchTime.value = Date.now()
        } catch (error) { 
            toast.error('Erro ao carregar pedidos')
            console.error(error)
        } finally { 
            loading.value = false
        }
    }

    // buscar pedidos por admin especifico
    const fetchOrdersByAdmin = async (adminId) => { 
        loading.value = true
        try { 
            const data = await getOrderByAdmin(adminId)
            orders.value = data.map(processOrderData)
            lastFetchTime.value = Date.now()
        } catch (error) { 
            toast.error('Erro ao carregar pedidos da loja')
            console.error(error)
        } finally { 
            loading.value = false
        }
    }

    // buscar pedidos do usuario logado
    const fetchUsersOrders = async () => { 
        loading.value = true
        try { 
            const data = await getUsersOrders()
            orders.value = data.map(processOrderData)
            lastFetchTime.value = Date.now()
        } catch (error) { 
            console.error('Erro ao carregar pedidos:', error)
            toast.error('Erro ao carregar seus pedidos')
            orders.value = []
        } finally { 
            loading.value = false
        }
    }

    // Verificar se precisa recarregar os dados
    const shouldRefetch = () => {
        return !lastFetchTime.value || (Date.now() - lastFetchTime.value) > 5 * 60 * 1000;
    }

    // buscar pedido por id
    const fetchOrderById = async (orderId) => { 
        loading.value = true
        try { 
            const data = await getOrdersById(orderId)
            selectedOrder.value = data
        } catch (error) { 
            toast.error('Erro ao buscar pedido')
            console.error(error)
        } finally { 
            loading.value = false
        }
    }

    // criar pedido
    const createNewOrder = async (orderData) => { 
        try { 
            const data = await createOrder(orderData)
            toast.success('Pedido realizado com sucesso!')
            // Recarregar pedidos após criar um novo
            await fetchUsersOrders()
            return data
        } catch (error) { 
            toast.error('Erro ao criar pedido')
            console.error(error)
            throw error
        }
    }

    // atualizar status 
    async function changeOrderStatus(orderId, statusData, adminId) {
    try {
    // statusData pode ser { status: 'CANCELED' } ou apenas a string
    const payloadStatus = (typeof statusData === 'object' && statusData !== null)
      ? statusData.status
      : statusData;

    const normalized = normalizeStatusValue(payloadStatus);

    await updateOrderStatus(orderId, { status: normalized });

    toast.success('Status atualizado com sucesso!');
    if (adminId) {
      await fetchOrdersByAdmin(adminId);
    } else {
      await fetchAllOrders();
    }
  } catch (error) {
    toast.error('Erro ao atualizar status');
    console.error('Erro detalhado:', error);
    throw error;
  }
}

    // cancelar pedido
    const cancelOrderById = async (orderId) => { 
        try { 
            await cancelOrder(orderId)
            toast.success('Pedido cancelado')
            await fetchUsersOrders()
        } catch (error) { 
            toast.error('Erro ao cancelar pedido')
            console.error(error)
        }
    }
    
    return { 
        orders,
        selectedOrder,
        loading,
        lastFetchTime,
        shouldRefetch,
        fetchAllOrders,
        fetchOrdersByAdmin,
        fetchUsersOrders,
        fetchOrderById,
        createNewOrder,
        changeOrderStatus,
        cancelOrderById
    }
})