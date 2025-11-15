<template>
  <div class="checkout-steps-modern">
    <div class="steps-indicator-modern">
      <div
        v-for="(label, index) in etapasLabels"
        :key="index"
        class="step-modern"
        :class="{ active: etapa >= index + 1, done: etapa > index + 1 }"
        @click="onClickStep(index + 1)"
        style="cursor: pointer;"
      >
        <div class="step-circle-modern">
          <i v-if="etapa > index + 1" class="bi bi-check"></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="step-label-modern">{{ label }}</span>
      </div>

      <div class="progress-bar-bg-modern">
        <div class="progress-bar-fg-modern" :style="{ width: progressWidth }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ etapa: Number })
const emit = defineEmits(['alterar-etapa'])

const etapasLabels = ['Endereço', 'Pagamento', 'Confirmação']

function onClickStep(novaEtapa) {
  // só permite avançar/regredir se fizer sentido:
  // permitir voltar sempre (quando novaEtapa < etapa)
  // permitir avançar apenas até uma etapa já desbloqueada (opcional).
  // Aqui vamos permitir voltar sempre e permitir avançar apenas se novaEtapa <= props.etapa
  if (novaEtapa < props.etapa) {
    emit('alterar-etapa', novaEtapa)
    return
  }

  // Se quiser permitir clicar pra avançar (por ex. ir de 1->2), permita quando novaEtapa <= props.etapa + 1
  // Se preferir bloquear avanço via clique (forçar fluxo), comente a linha abaixo.
  if (novaEtapa <= props.etapa + 1) {
    emit('alterar-etapa', novaEtapa)
  }
}

const progressWidth = computed(() => {
  if (props.etapa === 1) return '0%'
  if (props.etapa === 2) return '50%'
  if (props.etapa >= 3) return '100%'
  return '0%'
})
</script>

<style scoped>
.checkout-steps-modern {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px #7c3aed10;
  padding: 2.2rem 1.2rem 1.2rem 1.2rem;
  margin-bottom: 2.5rem;
}
.steps-indicator-modern {
  display: flex;
  justify-content: center;
  gap: 3.5rem;
  position: relative;
  align-items: flex-end;
  margin-bottom: 0.5rem;
}
.progress-bar-bg-modern {
  position: absolute;
  left: 0;
  right: 0;
  top: 2.2rem;
  height: 7px;
  background: #f3f4fa;
  border-radius: 4px;
  z-index: 0;
  width: 100%;
}
.progress-bar-fg-modern {
  height: 100%;
  background: linear-gradient(90deg, #4a90e2 0%, #6a5ae0 100%);
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(.4,2,.3,1);
}
.step-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.08rem;
  color: #b8b8d8;
  font-weight: 600;
  opacity: 0.7;
  position: relative;
  z-index: 2;
  min-width: 90px;
}
.step-modern.active, .step-modern.done {
  color: #4a90e2;
  opacity: 1;
}
.step-label-modern {
  font-size: 1.08rem;
  font-weight: 700;
  text-align: center;
  margin-top: 0.2rem;
  color: inherit;
  letter-spacing: 0.01em;
}
.step-circle-modern {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: #f3f4fa;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: #6a5ae0;
  margin-bottom: 0.1rem;
  transition: border 0.3s, background 0.3s;
  box-shadow: 0 2px 12px rgba(106, 90, 224, 0.1);
}
.step-modern.active .step-circle-modern,
.step-modern.done .step-circle-modern {
  border-color: #6a5ae0;
  background: linear-gradient(135deg, #4a90e2 0%, #6a5ae0 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(106, 90, 224, 0.3);
}
.step-modern.done .step-circle-modern {
  background: linear-gradient(135deg, #6a5ae0 0%, #4a90e2 100%);
}
.step-circle-modern i {
  font-size: 1.5rem;
  color: #fff;
}
@media (max-width: 768px) {
  .checkout-steps-modern {
    padding: 1.2rem 0.5rem 0.7rem 0.5rem;
    margin-bottom: 1.2rem;
  }
  .steps-indicator-modern {
    gap: 1.2rem;
  }
  .step-circle-modern {
    width: 2.1rem;
    height: 2.1rem;
    font-size: 1rem;
  }
  .step-label-modern {
    font-size: 0.92rem;
  }
  .progress-bar-bg-modern {
    top: 1.3rem;
    height: 4px;
  }
}
</style>
