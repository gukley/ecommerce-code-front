<template> 
    <div class="order-summary-modern">
        <div class="summary-header-modern">
            <i class="bi bi-cart-check"></i>
            <h5>Resumo do Pedido</h5>
        </div>

        <div class="products-list">
            <div class="product-item" v-for="item in cart" :key="item.id">
                <div class="product-info">
                    <img v-if="item.product?.image" :src="item.product.image" class="product-thumb" alt="Imagem produto" />
                    <div>
                        <div class="product-name">{{ item.product?.name || item.name }}</div>
                        <div class="product-quantity">Qtd: {{ item.quantity }}</div>
                    </div>
                </div>
                <div class="product-price">R$ {{ (item.product?.price || item.price) * item.quantity | numberFormat }}</div>
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
                <span>
                  <template v-if="frete === 0">Grátis</template>
                  <template v-else>R$ {{ frete.toFixed(2) }}</template>
                </span>
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
    props.cart.reduce((sum, item) => (item.product?.price || item.price) * item.quantity + sum, 0)
)


// Formata número para moeda BRL
function numberFormat(value) {
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>

<style scoped>
.order-summary-modern {
  background: #fff;
  border-radius: 1.3rem;
  box-shadow: 0 8px 32px #7c3aed10;
  border: 1.5px solid #e5e7eb;
  padding: 2.2rem 2rem;
  color: #232e47;
  font-family: 'Inter', sans-serif;
}

.summary-header-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #b8d8ff;
  background: linear-gradient(90deg, #ede9fe 0%, #f9fafb 100%);
}

.summary-header-modern i {
  font-size: 24px;
  color: #7c3aed;
}

.summary-header-modern h5 {
  margin: 0;
  color: #4f46e5;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.02em;
}

.products-list {
  margin-bottom: 24px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  gap: 12px;
  background: #f9fafb;
  border-radius: 0.7rem;
  margin-bottom: 8px;
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.product-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 10px;
  background: #ede9fe;
  border: 1.5px solid #b8d8ff;
  box-shadow: 0 1px 5px #7c3aed10;
}

.product-name {
  font-weight: 600;
  color: #232e47;
  margin-bottom: 4px;
  font-size: 16px;
}

.product-quantity {
  font-size: 14px;
  color: #4f46e5;
}

.product-price {
  font-weight: 700;
  color: #7c3aed;
  font-size: 18px;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
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
  color: #4f46e5;
}

.total-line span:last-child {
  font-weight: 600;
  color: #232e47;
}

.total-final {
  font-size: 20px;
  font-weight: 800;
  color: #9333ea;
  padding-top: 16px;
  border-top: 1px solid #b8d8ff;
  margin-top: 8px;
  background: linear-gradient(90deg, #ede9fe 0%, #f9fafb 100%);
}

.total-final span:first-child {
  color: #232e47;
}

.total-final span:last-child {
  color: #7c3aed;
}

@media (max-width: 768px) {
  .order-summary-modern {
    padding: 1.2rem 0.7rem;
    border-radius: 1rem;
  }
  
  .summary-header-modern h5 {
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