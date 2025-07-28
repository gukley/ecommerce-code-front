<template> 
    <div class="container my-4"> 
        <h2 class="mb-4">Carrinho de Compras</h2>

        <div v-if="loading">Carregando...</div>
        <div v-else-if="items.lenght === 0">Seu carrinho está vazio</div>
        <div v-else> 
            <CartItem
                v-for="item in items"
                :key="item.id"
                :item="item"
                @update="updateItem"
                @remove="removeItem"
            />

            <CartSummary
                :total="totalPrice"
                :count="totalItems"
                @clear="clearCart"
                @checkout="goToCheckout"
            />
        </div>
    </div>
</template>

<script setup> 
import { onMounted } from 'vue'
import { useCartStore } from '@stores/cartStore'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const { items, totalPrice, totalItems, loading } = cart
const router = useRouter()

onMounted(() => { 
    cart.initCart()
})

const updateItem = (productId, quantity) => { 
    cart.updateItem(productId, quantity)
}

const removeItem = (productId) => { 
    cart.remove(productId)
}

const clearCart = () => { 
    cart.clearCart()
}

const goToCheckout = () => {
    router.push('/checkout')
}
</script>