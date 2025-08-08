import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getCart,
  createCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartAPI,
  getProductById
} from '@/services/apiService'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './authStore'

export const useCartStore = defineStore('cart', () => {
  const toast = useToast()
  const authStore = useAuthStore()

  const cartId = ref(null)
  const items = ref([])
  const detailedItems = ref([])
  const loading = ref(false)

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    detailedItems.value.reduce((sum, item) => {
      if (item?.product?.price != null) {
        return sum + item.quantity * item.product.price
      }
      return sum
    }, 0)
  )

  function saveLocalCart() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function loadLocalCart() {
    const local = localStorage.getItem('cart')
    items.value = local ? JSON.parse(local) : []
  }

  async function initCart() {
    loading.value = true
    if (authStore.token) {
      try {
        const res = await getCart()
        cartId.value = res.data.id
        await fetchItems()
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn('Usuário não autenticado. Usando carrinho local.')
          loadLocalCart()
        } else {
          try {
            const res = await createCart()
            cartId.value = res.data.id
            await fetchItems()
          } catch {
            toast.error('Erro ao criar carrinho')
          }
        }
      }
    } else {
      loadLocalCart()
    }
    loading.value = false
  }

  async function fetchItems() {
    if (!authStore.token) {
      loadLocalCart()
      return
    }
    try {
      const res = await getCartItems()
      items.value = Array.isArray(res.data) ? res.data : res.data.items || []
      detailedItems.value = await Promise.all(
        items.value.map(async item => {
          try {
            const product = await getProductById(item.product_id)
            return { ...item, product }
          } catch {
            return { ...item, product: null }
          }
        })
      )
    } catch {
      toast.error('Erro ao buscar itens do carrinho')
    }
  }

  async function addItem(productId, quantity = 1, unitPrice) {
    if (!authStore.token) {
      const existing = items.value.find(i => i.product_id === productId)
      if (existing) {
        existing.quantity += quantity
      } else {
        items.value.push({ product_id: productId, quantity, unit_price: unitPrice })
      }
      saveLocalCart()
      toast.success('Item adicionado ao carrinho!')
      return
    }

    try {
      await addItemToCart(productId, quantity, unitPrice)
      toast.success('Item adicionado ao carrinho!')
      await fetchItems()
    } catch (err) {
      toast.error('Erro ao adicionar item.')
    }
  }

  async function updateItem(productId, quantity) {
    if (!authStore.token) {
      const existing = items.value.find(i => i.product_id === productId)
      if (existing) {
        existing.quantity = quantity
        saveLocalCart()
        toast.success('Quantidade atualizada!')
      }
      return
    }
    try {
      await updateCartItem(productId, quantity)
      toast.success('Quantidade atualizada!')
      await fetchItems()
    } catch {
      toast.error('Erro ao atualizar item.')
    }
  }

  async function removeItem(productId) {
    if (!authStore.token) {
      items.value = items.value.filter(i => i.product_id !== productId)
      saveLocalCart()
      toast.success('Item removido do carrinho.')
      return
    }
    try {
      await removeCartItem(productId)
      toast.success('Item removido do carrinho.')
      await fetchItems()
    } catch {
      toast.error('Erro ao remover item.')
    }
  }

  async function clearCart() {
    if (!authStore.token) {
      items.value = []
      saveLocalCart()
      toast.success('Carrinho limpo.')
      return
    }
    try {
      await clearCartAPI()
      items.value = []
      toast.success('Carrinho limpo com sucesso.')
    } catch {
      toast.error('Erro ao limpar o carrinho.')
    }
  }

  return {
    cartId,
    items,
    detailedItems,
    loading,
    totalItems,
    totalPrice,
    initCart,
    fetchItems,
    addItem,
    updateItem,
    removeItem,
    clearCart
  }
})
