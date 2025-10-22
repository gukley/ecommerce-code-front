<template> 
    <div class="order-summary">
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
.order-summary {
  background: #ffffff; /* Fundo branco */
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06); /* Sombra leve */
  border: 1.5px solid #e5e7eb; /* Borda cinza clara */
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.summary-header-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(90deg, #f8fafc 0%, #f3f4fa 100%);
  border-radius: 1rem 1rem 0 0;
  margin: -1.5rem -1.5rem 24px -1.5rem;
}

.summary-header-modern i {
  font-size: 24px;
  color: #6a5ae0;
}

.summary-header-modern h5 {
  margin: 0;
  color: #4a90e2;
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
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  gap: 12px;
  background: #f9fafb;
  border-radius: 0.7rem;
  margin-bottom: 8px;
  transition: all 0.2s;
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
  color: #6a5ae0;
}

.product-price {
  font-weight: 700;
  color: #6a5ae0;
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
  color: #4a90e2;
}

.total-line span:last-child {
  font-weight: 600;
  color: #232e47;
}

.total-final {
  font-size: 20px;
  font-weight: 800;
  color: #00c9a7;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  margin: 8px -1.5rem -1.5rem -1.5rem;
  background: linear-gradient(90deg, #f0fdfa 0%, #f3f4fa 100%);
  border-radius: 0 0 1rem 1rem;
}

.total-final span:first-child {
  color: #232e47;
}

.total-final span:last-child {
  color: #00c9a7;
}

.btn-apply-coupon {
  background: linear-gradient(90deg, #4a90e2, #6a5ae0); /* Gradiente azul-roxo */
  color: #ffffff; /* Texto branco */
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  transition: background 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
  width: 100%;
}

.btn-apply-coupon:hover {
  background: linear-gradient(90deg, #6a5ae0, #4a90e2); /* Gradiente invertido */
  box-shadow: 0 4px 16px rgba(106, 90, 224, 0.2); /* Sombra ao passar o mouse */
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