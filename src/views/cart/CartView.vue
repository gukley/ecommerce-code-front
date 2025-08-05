<template> 
    <div class="container my-4"> 
        <h2 class="mb-4">Carrinho de Compras</h2>

        <div v-if="loading">Carregando...</div>
        <div v-if="!loading && items.length === 0"> 
            <p>Seu carrinho está vazio</p>
            <p><small>Debug: items.length = {{ items.length }}, loading = {{ loading }}</small></p>
            <button class="btn btn-success mt-3" @click="adicionarItemTeste">Adicionar Item de Teste</button>
        </div>
        <div v-else-if="!loading && items.length > 0"> 
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
import CartItem from '@/components/Cart/CartItem.vue'
import CartSummary from '@/components/Cart/CartSummary.vue'
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
    cart.removeItem(productId)
}

const clearCart = () => { 
    cart.clearCart()
}

const goToCheckout = () => {
    router.push('/checkout')
}

const adicionarItemTeste = () => {
    // Adiciona um item de teste ao carrinho
    cart.addItem(1, 1, 29.99)
}
</script>