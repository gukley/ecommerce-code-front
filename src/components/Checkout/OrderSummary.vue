<template> 
    <div class="order-summary">
        <div class="summary-header">
            <i class="bi bi-cart-check"></i>
            <h5>Resumo do Pedido</h5>
        </div>

        <div class="products-list">
            <div class="product-item" v-for="item in cart" :key="item.id">
                <div class="product-info">
                    <div class="product-name">{{ item.name }}</div>
                    <div class="product-quantity">Qtd: {{ item.quantity }}</div>
                </div>
                <div class="product-price">R$ {{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-totals">
            <div class="total-line">
                <span>Subtotal:</span>
                <span>R$ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-line">
                <span>Frete:</span>
                <span>R$ {{ frete.toFixed(2) }}</span>
            </div>
            <div class="total-line total-final">
                <span>Total:</span>
                <span>R$ {{ total.toFixed(2) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup> 
import { computed } from 'vue';
const props = defineProps({ 
    cart: Array,
    frete: Number,
    total: Number
});

const subtotal = computed(() => 
    props.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
</script>

<style scoped>
.order-summary {
    background: #1e1e2d; /* Fundo do container mais escuro */
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2.5rem;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
}

.summary-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-header i {
    font-size: 24px;
    color: #007bff; /* A cor de destaque azul */
}

.summary-header h5 {
    margin: 0;
    color: #ffffff;
    font-weight: 600;
    font-size: 20px;
}

.products-list {
    margin-bottom: 24px;
}

.product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.product-item:last-child {
    border-bottom: none;
}

.product-info {
    flex: 1;
}

.product-name {
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 4px;
    font-size: 16px;
}

.product-quantity {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
}

.product-price {
    font-weight: 600;
    color: #007bff; /* Preço destacado em azul */
    font-size: 18px;
}

.summary-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 24px 0;
}

.summary-totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
}

.total-line span:first-child {
    color: rgba(255, 255, 255, 0.7);
}

.total-line span:last-child {
    font-weight: 500;
    color: #ffffff;
}

.total-final {
    font-size: 20px;
    font-weight: 700;
    color: #007bff; 
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 8px;
}

.total-final span:first-child {
    color: #ffffff;
}

@media (max-width: 768px) {
    .order-summary {
        padding: 2rem;
    }
    
    .summary-header h5 {
        font-size: 18px;
    }
    
    .product-name {
        font-size: 15px;
    }
    
    .product-price {
        font-size: 16px;
    }
    
    .total-final {
        font-size: 18px;
    }
}
</style>