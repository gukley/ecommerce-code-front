<template>
  <div class="checkout-form">
    <!-- Etapa 1: Endereço -->
    <div v-if="etapa === 1" class="form-section">
      <div class="section-header">
        <i class="bi bi-geo-alt"></i>
        <h4>Endereço de Entrega</h4>
      </div>
      
      <div v-if="enderecos.length > 0 && !modoNovoEndereco" class="address-selection">
        <div class="selection-header">
          <label class="form-label">Selecione um endereço salvo:</label>
        </div>
        
        <div class="address-options">
          <div v-for="end in enderecos" :key="end.id" class="address-option">
            <input 
              class="address-radio" 
              type="radio" 
              :id="'endereco-'+end.id" 
              :value="end.id" 
              v-model="enderecoSelecionadoId"
            >
            <label class="address-label" :for="'endereco-'+end.id">
              <div class="address-info">
                <div class="address-street">{{ end.street }}, {{ end.number }}</div>
                <div class="address-details">{{ end.city }}/{{ end.state }} - CEP: {{ end.zip }}</div>
                <div v-if="end.country" class="address-country">{{ end.country }}</div>
              </div>
            </label>
          </div>
        </div>
        
        <button class="btn-secondary" @click="modoNovoEndereco = true">
          <i class="bi bi-plus-circle"></i>
          Cadastrar novo endereço
        </button>
      </div>
      
      <form v-if="modoNovoEndereco || enderecos.length === 0" @submit.prevent="avancarEtapaEndereco" class="address-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Rua</label>
            <input type="text" class="form-input" v-model="form.street" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">Número</label>
            <input type="number" class="form-input" v-model.number="form.number" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">Cidade</label>
            <input type="text" class="form-input" v-model="form.city" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">Estado</label>
            <input type="text" class="form-input" v-model="form.state" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">País</label>
            <input type="text" class="form-input" v-model="form.country" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">CEP</label>
            <input type="text" class="form-input" v-model="form.zip" required />
          </div>
        </div>
        
        <div class="form-actions">
          <button v-if="enderecos.length > 0" type="button" class="btn-secondary" @click="modoNovoEndereco = false">
            <i class="bi bi-arrow-left"></i>
            Selecionar endereço salvo
          </button>
          <button type="submit" class="btn-primary">
            <i class="bi bi-check-circle"></i>
            Continuar
          </button>
        </div>
      </form>
      
      <button v-else class="btn-primary w-100" @click="avancarEtapaEndereco">
        <i class="bi bi-check-circle"></i>
        Continuar
      </button>
    </div>

    <!-- Etapa 2: Pagamento (usando o novo componente) -->
    <PaymentSelection
      v-if="etapa === 2"
      v-model="metodoPagamento"
      @etapaChange="handleEtapaChangeFromPayment"
      @dadosColetados="handleDadosColetadosFromPayment"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { createAddress, getAllAddresses } from '@/services/apiService';
import { useToast } from 'vue-toastification';
import PaymentSelection from './PaymentSelection.vue'; // Importa o novo componente

// Define as props que este componente pode receber
const props = defineProps({
  etapa: Number // A etapa atual que o componente deve exibir (1 para Endereço, 2 para Pagamento)
});

// Define os eventos que este componente pode emitir
const emit = defineEmits(['etapaChange', 'dadosColetados']); // 'etapaChange' para mudar a etapa no pai, 'dadosColetados' para enviar dados

const toast = useToast();

// Estado para o formulário de novo endereço
const form = reactive({
  street: '',
  number: null,
  city: '',
  state: '',
  country: '',
  zip: '',
});

// Estados para endereços e seleção
const enderecos = ref([]);
const enderecoSelecionadoId = ref(null); 
const modoNovoEndereco = ref(false);

// Estado para o método de pagamento selecionado (agora compartilhado com PaymentSelection)
const metodoPagamento = ref('pix'); // Define 'pix' como padrão

// Carrega os endereços salvos ao montar o componente
onMounted(async () => {
  try {
    enderecos.value = await getAllAddresses();
  } catch (e) {
    console.error("Erro ao carregar endereços:", e);
  }
  // Se houver endereços, seleciona o primeiro por padrão
  if (enderecos.value.length > 0) {
    enderecoSelecionadoId.value = enderecos.value[0].id; 
    modoNovoEndereco.value = false;
  } else {
    // Se não houver endereços, entra no modo de cadastro de novo endereço
    modoNovoEndereco.value = true; 
  }
});

// Observa mudanças na prop 'etapa' (útil para depuração ou lógica futura)
watch(() => props.etapa, (newVal) => {
  console.log('CheckoutForm - Etapa atual:', newVal);
});

// Função para avançar a etapa de Endereço
async function avancarEtapaEndereco() {
  let enderecoFinal = null;
  try {
    if (modoNovoEndereco.value) {
      // Validação básica para o novo endereço
      if (!form.street || !form.number || !form.city || !form.state || !form.country || !form.zip) {
        toast.error('Por favor, preencha todos os campos do endereço.');
        return;
      }
      const addressPayload = {
        street: form.street,
        number: form.number,
        city: form.city,
        state: form.state,
        country: form.country,
        zip: form.zip,
      };
      enderecoFinal = await createAddress(addressPayload);
      toast.success('Novo endereço cadastrado com sucesso!');
    } else {
      enderecoFinal = enderecos.value.find(
        (end) => end.id === enderecoSelecionadoId.value
      );
      if (!enderecoFinal) {
        toast.warning('Por favor, selecione um endereço válido.');
        return;
      }
    }

    // Emite os dados do endereço para o componente pai (CheckoutView)
    emit('dadosColetados', { endereco: enderecoFinal });
    // Sinaliza para o componente pai avançar para a próxima etapa (Pagamento)
    emit('etapaChange', 2);

  } catch (error) {
    console.error('Erro ao processar o endereço:', error);
    toast.error('Ocorreu um erro ao processar o endereço. Tente novamente.');
  }
}

// Handler para eventos 'etapaChange' vindos de PaymentSelection
function handleEtapaChangeFromPayment(newEtapa) {
  emit('etapaChange', newEtapa); // Repassa a mudança de etapa para o CheckoutView
}

// Handler para eventos 'dadosColetados' vindos de PaymentSelection
function handleDadosColetadosFromPayment(dados) {
  emit('dadosColetados', dados); // Repassa os dados de pagamento para o CheckoutView
}
</script>

<style scoped>
.checkout-form {
  max-width: 520px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif; 
}
.form-section {
  background: #1e1e2d;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.section-header i {
  font-size: 24px;
  color: #007bff; 
}
.section-header h4 {
  margin: 0;
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
}
.address-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.selection-header label {
  font-weight: 500;
  font-size: 16px;
  color: #b0b0b0; 
}
.address-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.address-option {
  position: relative;
}
.address-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.address-label {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.address-radio:checked + .address-label {
  border-color: #007bff;
  background: rgba(0, 123, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}
.address-radio:checked + .address-label::before {
  content: '';
  position: absolute;
  top: 10px;
  right: 12px;
  width: 18px;
  height: 18px;
  background: #007bff;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.address-radio:checked + .address-label::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 14px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
}
.address-info {
  color: #ffffff;
}
.address-street {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}
.address-details {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}
.address-country {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  margin-top: 4px;
}
.address-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 16px;
}
.form-group.full-width {
  grid-column: 1 / -1;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
}
.form-input {
  background: #2a2a3e; 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.2s ease;
  min-width: 0;
}
.form-input:focus {
  outline: none;
  border-color: #007bff;
  background: #2a2a3e;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}
.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
/* Botões */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  grid-column: 1 / -1; 
  margin-top: 8px;
}
.btn-primary,
.btn-secondary {
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}
.btn-primary:hover {
  background: linear-gradient(145deg, #0056b3, #007bff);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}
.btn-secondary {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 12px 24px;
  font-size: 15px;
}
.btn-secondary:hover {
  background: rgba(0, 123, 255, 0.1);
}
.w-100 {
  width: 100%;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-section {
    padding: 2rem 1.25rem;
  }
  .address-form {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 14px 24px;
  }
  .section-header h4 {
    font-size: 18px;
  }
}
</style>