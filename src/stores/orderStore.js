import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
    getAllOrders,
    getOrdersByAdmin,
    getUsersOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder
} from '@/services/apiService'
import { useToast } from 'vue-toastification'

export const useOrderStore = defineStore('order', () => { 
    const orders = ref([])
    const selectedOrder = ref(null)
    const loading = ref(false)

    const toast = useToast()

    // Buscar todos pedidos
    const fetchAllOrders = async () => { 
        loading.value = true
        try { 
            const data = await getAllOrders()
            orders.value = data
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
            const data = await getOrdersByAdmin(adminId)
            orders.value = data
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
            const data = await getUserOrders()
            orders.value = data
        } catch (error) {
            toast.error('Erro ao carregar seus pedidos')
            console.error(error)
        } finally { 
            loading.value = false
        }
    }

    // buscar pedido por id
    const fetchOrderById = async (orderId) => { 
        loading.value = true
        try { 
            const data = await getOrderById(orderId)
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
            await fetchAllOrders()
        } catch (error) { 
            toast.error('Erro ao cancelar pedido')
            console.error(error)
        }
    }

    return { 
        orders,
        selectedOrder,
        loading,
        fetchAllOrders,
        fetchOrdersByAdmin,
        fetchUsersOrders,
        fetchOrderById,
        createNewOrder,
        changeOrderStatus,
        cancelOrderById
    }
})