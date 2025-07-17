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

export const useCartStore = defineStore('cart', () => { 
  const toast = useToast()

// Estado das variaveis
const cartId = ref(null)
const items = ref([])
const detailedItems = ref([])
const loading = ref(false)

 const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
)

const totalPrice = computed(() =>
    (Array.isArray(detailedItems.value) ? detailedItems.value : []).reduce((sum, item) => {
      if (item && item.product && typeof item.product.price !== 'undefined') {
        return sum + item.quantity * item.product.price;
      }
      return sum;
    }, 0)
)

async function initCart() { 
  loading.value = true
  try { 
    const res = await getCart()
    cartId.value = res.data.id
    await fetchItems()
  } catch (err) { 
    try { 
      const res = await createCart()
      cartId.value = res.data.id
      await fetchItems()
    } catch (e) { 
      toast.error('Erro ao criar carrinho')
    }
  } finally { 
    loading.value = false
  }
}

async function fetchItems() { 
  try { 
    const res = await getCartItems()
    console.log('Resposta getCartItems:', res.data)
    if (Array.isArray(res.data)) {
      items.value = res.data
    } else if (res.data && Array.isArray(res.data.items)) {
      items.value = res.data.items
    } else {
      items.value = []
    }
    console.log('items.value final:', items.value)
    // Buscar detalhes dos produtos
    detailedItems.value = []
    if (Array.isArray(items.value)) {
      const promises = items.value.map(async (item) => {
        if (item.product_id) {
          try {
            const product = await getProductById(item.product_id)
            return { ...item, product }
          } catch (e) {
            return { ...item, product: null }
          }
        } else {
          return { ...item, product: null }
        }
      })
      detailedItems.value = await Promise.all(promises)
    }
    console.log('detailedItems final:', detailedItems.value)
  } catch (err) { 
    toast.error('Erro ao buscar itens do carrinho')
  }
}

async function addItem (productId, quantity = 1, unitPrice) { 
  try { 
    await addItemToCart(productId, quantity, unitPrice)
    toast.success('Item adicionado ao carrinho!')
    await fetchItems()
  } catch (err) { 
    let msg = 'Erro ao adicionar item.';
    if (err.response && err.response.data) {
      if (err.response.data.detail) {
        msg += ' ' + (typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail));
      } else if (err.response.data.message) {
        msg += ' ' + err.response.data.message;
      }
      console.error('Erro detalhado ao adicionar item:', err.response.data);
    } else {
      console.error('Erro desconhecido ao adicionar item:', err);
    }
    toast.error(msg);
  }
}

async function updateItem(productId, quantity) { 
  try {
    await updateCartItem(productId, quantity)
    toast.success('Quantidade atualizada!')
    await fetchItems()
  } catch (err) { 
    toast.error('Erro ao atualizar item.')
  }
}

async function removeItem(productId) { 
  try { 
    await removeCartItem(productId)
    toast.success('Item removido do carrinho.')
    await fetchItems()
  } catch (err) { 
    toast.error('Erro ao remover item.')
  }
}

async function clearCart() { 
  try { 
    await clearCartAPI()
    items.value = []
    toast.success('Carrinho limpo com sucesso.')
  } catch (err) { 
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
  clearCart,
  }
})