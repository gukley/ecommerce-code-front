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

export const useOrderStore = defineStore('order', () => { 
    const orders = ref([])
    const selectedOrder = ref(null)
    const loading = ref(false)
    const lastFetchTime = ref(null)

    const toast = useToast()

    // Função auxiliar para processar um pedido e calcular o total
    const processOrderData = (order) => {
        const groupedProducts = {};
        let total = 0;
        if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
                const productPrice = Number(product.price)
                if (isNaN(productPrice)) {
                    console.error('Preço do produto inválido:', product.price, 'em:', product.name)
                    return
                }
                if (!groupedProducts[product.id]) {
                    groupedProducts[product.id] = { ...product, quantity: 0 }
                }
                groupedProducts[product.id].quantity++
                total += productPrice
            });
        }
     return {
            ...order,
            total: Number(total).toFixed(2), 
            products: Object.values(groupedProducts)
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
    const changeOrderStatus = async (orderId, statusData) => { 
        try { 
            await updateOrderStatus(orderId, statusData)
            toast.success('Status atualizado com sucesso!')
            await fetchAllOrders()
        } catch (error) { 
            toast.error('Erro ao atualizar status')
            console.error(error)
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