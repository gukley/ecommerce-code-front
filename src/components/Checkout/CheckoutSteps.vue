<template>
    <div class="checkout-steps">
      <div class="steps-container">
        <div class="step" :class="{ active: etapa >= 1, completed: etapa > 1 }">
          <div class="step-circle">
            <i v-if="etapa > 1" class="bi bi-check"></i>
            <span v-else>1</span>
          </div>
          <div class="step-label">Endereço</div>
        </div>
        <div class="step-line" :class="{ active: etapa >= 2 }"></div>
        <div class="step" :class="{ active: etapa >= 2, completed: etapa > 2 }">
          <div class="step-circle">
            <i v-if="etapa > 2" class="bi bi-check"></i>
            <span v-else>2</span>
          </div>
          <div class="step-label">Pagamento</div>
        </div>
        <div class="step-line" :class="{ active: etapa >= 3 }"></div>
        <div class="step" :class="{ active: etapa >= 3, completed: etapa > 3 }">
          <div class="step-circle">
            <i v-if="etapa > 3" class="bi bi-check"></i>
            <span v-else>3</span>
          </div>
          <div class="step-label">Confirmação</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ etapa: Number });
  </script>
  
  <style scoped>
  .checkout-steps {
    margin-bottom: 3rem;
    padding: 0 1rem;
    user-select: none;
  }
  
  .steps-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.2rem;
    position: relative;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.66rem;
    transition: all 0.3s cubic-bezier(.4,.2,.2,1);
  }
  
  .step-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(120deg, #23233a 60%, #2a2a3e 100%);
    border: 2.5px solid rgba(0,255,225,0.10);
    color: #a0a0a0;
    font-size: 19px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.28s cubic-bezier(.4,.2,.2,1);
    position: relative;
    box-shadow: 0 3px 15px rgba(0,255,225,0.07);
    z-index: 1;
  }
  
  .step-circle i {
    font-size: 22px;
    color: #fff;
    font-weight: bold;
    filter: drop-shadow(0 0 7px #00ffe1);
    transition: color 0.3s;
  }
  
  .step.active .step-circle {
    background: linear-gradient(120deg, #00ffe1 0%, #8f5fe8 90%);
    border-color: #8f5fe8;
    color: #181828;
    box-shadow: 0 4px 15px rgba(0,255,225,0.26);
    transform: scale(1.13);
  }
  
  .step.completed .step-circle {
    background: linear-gradient(120deg, #15fbe3 0%, #8f5fe8 90%);
    border-color: #00ffe1;
    color: #181828;
    box-shadow: 0 4px 12px rgba(0,255,225,0.16);
    filter: brightness(1.08);
  }
  
  .step-label {
    font-size: 15px;
    font-weight: 500;
    color: #a0a0a0;
    text-align: center;
    letter-spacing: 0.01em;
    transition: color 0.3s cubic-bezier(.4,.2,.2,1);
  }
  
  .step.active .step-label,
  .step.completed .step-label {
    color: #00ffe1;
    font-weight: 700;
    text-shadow: 0 2px 8px rgba(0,255,225,0.08);
  }
  
  .step-line {
    width: 70px;
    height: 4px;
    background: linear-gradient(90deg, #34345e 0%, #23233a 100%);
    border-radius: 2px;
    transition: all 0.28s cubic-bezier(.4,.2,.2,1);
    position: relative;
    z-index: 0;
  }
  .step-line.active {
    background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
    box-shadow: 0 2px 10px rgba(0,255,225,0.13);
  }
  
  @media (max-width: 768px) {
    .steps-container {
      gap: 1.2rem;
    }
    .step-circle {
      width: 36px;
      height: 36px;
      font-size: 15px;
    }
    .step-label {
      font-size: 12px;
    }
    .step-line {
      width: 30px;
      height: 3px;
    }
  }
  @media (max-width: 480px) {
    .checkout-steps {
      margin-bottom: 1.2rem;
      padding: 0 0.3rem;
    }
    .step-line {
      width: 15px;
    }
    .step-circle {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }
  }
  </style>