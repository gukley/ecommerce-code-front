import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWishlistStore = defineStore('wishlist', () => {
  // STATE
  const items = ref([]) 

  // GETTERS
  const isInWishlist = (productId) => {
    return items.value.some(item => item.id === productId)
  }

  const total = computed(() => items.value.length)

  function add(product) { 
    if (!isInWishlist(product.id)) {
      items.value.push(product)
  }
}
  function remove(productId) { 
    items.value = items.value.filter(item => item.id !== productId)
  }

  function toggle(product) { 
    if (isInWishlist(product.id)) { 
      remove(product.id)
    } else { 
      add(product)
    }
  }

  function clear() { 
    items.value = []
  }

  return { 
    items,
    isInWishlist,
    total,
    add,
    remove,
    toggle,
    clear,
  }
})