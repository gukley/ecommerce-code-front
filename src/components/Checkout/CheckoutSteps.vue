<template>
  <div class="checkout-steps">
    <div class="steps-indicator">
      <div class="step" :class="{ active: etapa >= 1, done: etapa > 1 }">
        <div class="step-circle">
          <i v-if="etapa > 1" class="bi bi-check"></i>
          <span v-else>1</span>
        </div>
        <span class="step-label">Endereço</span>
      </div>
      <div class="step" :class="{ active: etapa >= 2, done: etapa > 2 }">
        <div class="step-circle">
          <i v-if="etapa > 2" class="bi bi-check"></i>
          <span v-else>2</span>
        </div>
        <span class="step-label">Pagamento</span>
      </div>
      <div class="step" :class="{ active: etapa >= 3, done: etapa > 3 }">
        <div class="step-circle">
          <i v-if="etapa > 3" class="bi bi-check"></i>
          <span v-else>3</span>
        </div>
        <span class="step-label">Confirmação</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fg" :style="{ width: progressWidth }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ etapa: Number });
const progressWidth = computed(() => {
  if (props.etapa === 1) return '0%';
  if (props.etapa === 2) return '50%';
  if (props.etapa >= 3) return '100%';
  return '0%';
});
</script>

<style scoped>
.checkout-steps {
  margin-bottom: 3rem;
  padding: 0 1rem;
  user-select: none;
}
.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  align-items: flex-end;
}
.progress-bar-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 1.7rem;
  height: 6px;
  background: #232e47;
  border-radius: 4px;
  z-index: 0;
  width: 100%;
}
.progress-bar-fg {
  height: 100%;
  background: linear-gradient(90deg, #399bff 0%, #42a5f5 100%);
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(.4,2,.3,1);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #9ca3af;
  font-weight: 600;
  opacity: 0.7;
  position: relative;
  z-index: 2;
}
.step.active, .step.done {
  color: #399bff;
  opacity: 1;
}
.step-label {
  font-size: 0.93rem;
  font-weight: 600;
  text-align: center;
  max-width: 100px;
  line-height: 1.2;
  color: inherit;
  margin-top: 0.2rem;
}
.step-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #232e47;
  border: 2.5px solid #232e47;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.1rem;
  transition: border 0.3s, background 0.3s;
  box-shadow: 0 2px 8px #399bff10;
}
.step.active .step-circle,
.step.done .step-circle {
  border-color: #399bff;
  background: linear-gradient(135deg, #399bff 0%, #42a5f5 100%);
  color: #fff;
  box-shadow: 0 4px 16px #399bff30;
}
.step.done .step-circle {
  background: linear-gradient(135deg, #42a5f5 0%, #399bff 100%);
}
.step-circle i {
  font-size: 1.3rem;
  color: #fff;
}
@media (max-width: 768px) {
  .steps-indicator {
    gap: 1.2rem;
    margin-bottom: 1.1rem;
  }
  .step-circle {
    width: 1.7rem;
    height: 1.7rem;
    font-size: 1rem;
  }
  .step-label {
    font-size: 0.82rem;
  }
  .progress-bar-bg {
    top: 1.1rem;
    height: 4px;
  }
}
@media (max-width: 480px) {
  .checkout-steps {
    margin-bottom: 1.2rem;
    padding: 0 0.3rem;
  }
  .steps-indicator {
    gap: 0.7rem;
  }
  .step-label {
    font-size: 0.75rem;
  }
}
</style>
