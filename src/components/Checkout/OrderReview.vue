<template>
    <div class="order-review">
      <div class="review-header">
        <i class="bi bi-clipboard-check"></i>
        <h4>Confira seu pedido</h4>
      </div>
  
      <div class="products-list">
        <div class="product-item" v-for="item in cart" :key="item.id || item.product_id">
          <div>
            <div class="product-name">{{ item.product?.name || 'Produto desconhecido' }}</div>
            <div class="product-quantity">Quantidade: {{ item.quantity }}</div>
          </div>
          <div class="product-price">
            {{ formatPrice((item.product?.price || 0) * item.quantity) }}
          </div>
        </div>
      </div>
  
      <div class="divider"></div>
  
      <div class="totals">
        <div class="total-line">
          <span>Subtotal:</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="total-line">
          <span>Frete:</span>
          <span>{{ formatPrice(frete) }}</span>
        </div>
        <div class="total-line total-final">
          <span>Total:</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>
  
      <button class="btn-confirm" @click="$emit('confirmarPedido')">
        Confirmar Pedido
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    cart: {
      type: Array,
      default: () => []
    },
    frete: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  });
  
  const subtotal = computed(() =>
    props.cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  );
  
  function formatPrice(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
  </script>
  
  <style scoped>
  .order-review {
      background: #1e1e2d; 
      border-radius: 12px;
      padding: 2.5rem;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      font-family: 'Inter', sans-serif;
  }
  
  .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .review-header i {
      font-size: 24px;
      color: #007bff; 
  }
  
  .review-header h4 {
      margin: 0;
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
  }
  
  .products-list {
      margin-bottom: 24px;
  }
  
  .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .product-item:last-child {
      border-bottom: none;
  }
  
  .product-name {
      font-weight: 500;
      font-size: 16px;
  }
  
  .product-quantity {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
  }
  
  .product-price {
      color: #007bff; /* Preço destacado em azul */
      font-weight: 600;
      font-size: 18px;
  }
  
  .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 24px 0;
  }
  
  .totals {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
  }
  
  .total-line {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: #ffffff;
  }
  
  .total-line span:first-child {
      color: rgba(255, 255, 255, 0.7);
  }
  
  .total-line span:last-child {
      font-weight: 500;
  }
  
  .total-final {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 16px;
      margin-top: 8px;
  }
  
  .total-final span:first-child {
      color: #ffffff;
  }
  
  .total-final span:last-child {
      color: #007bff; 
  }
  
  .btn-confirm {
      width: 100%;
      background: linear-gradient(145deg, #007bff, #0056b3);
      border: none;
      border-radius: 50px;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  }
  
  .btn-confirm:hover {
      background: linear-gradient(145deg, #0056b3, #007bff);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }
  
  @media (max-width: 768px) {
      .order-review {
          padding: 2rem 1.5rem;
      }
  
      .review-header h4 {
          font-size: 18px;
      }
      
      .product-name, .product-price, .total-line, .btn-confirm {
          font-size: 15px;
      }
  
      .total-final {
          font-size: 18px;
      }
  }
</style>