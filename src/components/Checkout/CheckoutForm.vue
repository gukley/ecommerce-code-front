<template>
  <div class="checkout-form-modern glass-card">
    <CheckoutSteps v-if="showSteps" :etapa="etapa" />

    <!-- Etapa 1: Endereço -->
    <div v-if="etapa === 1" class="form-section">
      <div class="section-header">
        <i class="bi bi-geo-alt"></i>
        <h4>Endereço de Entrega</h4>
      </div>

      <!-- Lista de endereços salvos -->
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

      <!-- Formulário para novo endereço -->
      <form
        v-if="modoNovoEndereco || enderecos.length === 0"
        @submit.prevent="avancarEtapaEndereco"
        class="address-form"
      >
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label" for="street">Rua</label>
            <input id="street" type="text" class="form-input" v-model="form.street" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="number">Número</label>
            <input id="number" type="number" class="form-input" v-model.number="form.number" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="city">Cidade</label>
            <input id="city" type="text" class="form-input" v-model="form.city" required />
          </div>

         <div class="form-group">
          <label class="form-label" for="bairro">Bairro</label>
          <input
            id="bairro"
            type="text"
            class="form-input"
            v-model="form.bairro"
            required
          />
        </div>

          <div class="form-group">
            <label class="form-label" for="state">Estado</label>
            <input id="state" type="text" class="form-input" v-model="form.state" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="country">País</label>
            <input id="country" type="text" class="form-input" v-model="form.country" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="zip">CEP</label>
            <input
              id="zip"
              type="text"
              class="form-input"
              v-model="form.zip"
              maxlength="8"
              placeholder="Digite o CEP"
              required
            />
            <div v-if="frete.valor" class="frete-info mt-2 text-success">
              <small>Frete: R$ {{ frete.valor.toFixed(2) }} — {{ frete.prazo }} dias úteis</small>
            </div>
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

      <!-- Endereço salvo -->
      <div
        v-if="!modoNovoEndereco && enderecos.length > 0 && enderecoSelecionadoId && getSelectedAddressInfo()"
        class="address-continue"
      >
        <div class="selected-address-info">
          <h5>Endereço Selecionado:</h5>
          <div class="selected-address">
            <i class="bi bi-check-circle-fill"></i>
            <div class="address-details">
              <strong>{{ getSelectedAddressInfo() }}</strong>
            </div>
          </div>
        </div>
        <button class="btn-primary w-100" @click="avancarEtapaEndereco">
          <i class="bi bi-check-circle"></i>
          Continuar com este endereço
        </button>
      </div>
    </div>

    <!-- Etapa 2: Pagamento -->
    <PaymentSelection
      v-if="etapa === 2"
      v-model="metodoPagamento"
      @etapaChange="handleEtapaChangeFromPayment"
      @dadosColetados="handleDadosColetadosFromPayment"
      @pagamentoAprovado="handlePagamentoAprovado"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { createAddress, getAllAddresses, createOrder } from '@/services/apiService'
import { useToast } from 'vue-toastification'
import PaymentSelection from './PaymentSelection.vue'
import CheckoutSteps from './CheckoutSteps.vue'

const props = defineProps({
  etapa: Number,
  showSteps: { type: Boolean, default: true }
})
const emit = defineEmits(['etapaChange', 'dadosColetados', 'pedidoCriado'])

const toast = useToast()

const form = reactive({
  street: '',
  number: null,
  city: '',
  state: '',
  country: '',
  zip: '',
  bairro: ''
})

const enderecos = ref([])
const enderecoSelecionadoId = ref(null)
const modoNovoEndereco = ref(false)
const metodoPagamento = ref('card')

// Frete automático
const frete = ref({
  valor: 0,
  prazo: 0
})

onMounted(async () => {
  try {
    enderecos.value = await getAllAddresses()
  } catch (e) {
    console.error("Erro ao carregar endereços:", e)
  }
  if (enderecos.value.length > 0) {
    enderecoSelecionadoId.value = enderecos.value[0].id
    modoNovoEndereco.value = false
  } else {
    modoNovoEndereco.value = true
  }
})

// --- Preenche endereço e calcula frete ao digitar CEP ---
watch(() => form.zip, async (novoCep) => {
  const cepLimpo = novoCep.replace(/\D/g, '')
  if (cepLimpo.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        toast.error('CEP não encontrado.')
        return
      }

      form.street = data.logradouro || ''
      form.city = data.localidade || ''
      form.bairro = data.bairro || ''
      form.state = data.uf || ''
      form.country = 'Brasil'

      // Simula frete com base no CEP (poderia vir da API futuramente)
      frete.value.valor = 15.00
      frete.value.prazo = 5

      toast.info('Endereço preenchido e frete calculado!')
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast.error('Erro ao buscar o endereço pelo CEP.')
    }
  }
})

watch(enderecoSelecionadoId, async (id) => {
  if (!id) return;

  // Encontra o endereço selecionado
  const end = enderecos.value.find(e => e.id === id);
  if (!end) return;

  const cepLimpo = end.zip?.replace(/\D/g, '');

  if (cepLimpo?.length === 8) {
    // Simule o frete igual ao do CEP manual
    frete.value.valor = 15.00;
    frete.value.prazo = 5;

    // Envia para o CheckoutView.vue
    emit('freteCalculado', {
      valor: frete.value.valor,
      prazo: frete.value.prazo
    });
  }
});



// --- Avançar etapa endereço ---
async function avancarEtapaEndereco() {
  let enderecoFinal = null
  try {
    if (modoNovoEndereco.value) {
      const addressPayload = {
        street: form.street,
        number: form.number,
        city: form.city,
        state: form.state,
        zip: form.zip,
        bairro: form.bairro,
        country: form.country

     }
      if (!addressPayload.street || !addressPayload.number || !addressPayload.city || 
      !addressPayload.state || !addressPayload.zip || !addressPayload.bairro)  {
        toast.error('Por favor, preencha todos os campos do endereço.')
        return
      }

      enderecoFinal = await createAddress(addressPayload)
      if (!enderecoFinal?.id) {
        toast.error('Erro: O backend não retornou o ID do endereço.')
        return
      }

      enderecoSelecionadoId.value = enderecoFinal.id
      modoNovoEndereco.value = false
      toast.success('Novo endereço cadastrado com sucesso!')

      // Sempre envia 'card' como método de pagamento
      emit('dadosColetados', { 
        endereco: enderecoFinal, 
        metodoPagamento: 'card',
        frete: frete.value
      })
      emit('etapaChange', 2)
      return
    } else {
      enderecoFinal = enderecos.value.find((end) => end.id === enderecoSelecionadoId.value)
      if (!enderecoFinal) {
        toast.warning('Por favor, selecione um endereço válido.')
        return
      }
    }

    // Sempre envia 'card' como método de pagamento
    emit('dadosColetados', { 
      endereco: enderecoFinal, 
      metodoPagamento: 'card',
      frete: frete.value
    })
    emit('etapaChange', 2)
  } catch (error) {
    console.error('Erro ao processar o endereço:', error)
    toast.error('Ocorreu um erro ao processar o endereço. Tente novamente.')
  }
}

async function handlePagamentoAprovado({ paymentIntent, items, email, valorTotal }) {
  try {
    if (!enderecoSelecionadoId.value) {
      toast.error('Endereço não selecionado')
      return
    }
    if (!items || items.length === 0) {
      toast.error('Nenhum item encontrado no carrinho')
      return
    }

    const validItems = items.filter(item => item.product_id && item.quantity > 0 && item.unit_price > 0)
    if (validItems.length === 0) {
      toast.error('Nenhum item válido encontrado')
      return
    }

    // Valida estoque antes de criar o pedido
    const { getProductById } = await import('@/services/apiService')
    const produtosSemEstoque = []
    
    for (const item of validItems) {
      try {
        const product = await getProductById(item.product_id)
        const quantidadeSolicitada = item.quantity
        const estoqueDisponivel = product.stock || 0
        
        if (quantidadeSolicitada > estoqueDisponivel) {
          produtosSemEstoque.push({
            nome: product.name || 'Produto',
            solicitado: quantidadeSolicitada,
            disponivel: estoqueDisponivel
          })
        }
      } catch (err) {
        console.error(`Erro ao verificar estoque do produto ${item.product_id}:`, err)
      }
    }

    if (produtosSemEstoque.length > 0) {
      const mensagem = produtosSemEstoque.map(p => 
        `${p.nome}: solicitado ${p.solicitado}, disponível ${p.disponivel}`
      ).join('; ')
      toast.error(`Estoque insuficiente: ${mensagem}`)
      return
    }

    const orderData = {
      items: validItems.map(item => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      })),
      address_id: Number(enderecoSelecionadoId.value),
      payment_method: 'card',
      total_amount: Number(valorTotal),
      shipping_cost: Number(frete.value.valor || 0),
      coupon_id: null
    }

    const response = await createOrder(orderData)
    if (response) {
      toast.success('Pedido gerado com sucesso!')
      emit('pedidoCriado', true)
      // Emite os dados coletados para o CheckoutView atualizar o estado
      const enderecoFinal = enderecos.value.find(end => end.id === enderecoSelecionadoId.value)
      emit('dadosColetados', {
        endereco: enderecoFinal,
        metodoPagamento: 'card',
        frete: frete.value
      })
      emit('etapaChange', 3)
    }
  } catch (err) {
    console.error('Erro detalhado ao criar pedido:', err)
    
    // Trata erros específicos de estoque
    const errorMessage = err.response?.data?.detail || err.message || ''
    if (errorMessage.includes('stock') || errorMessage.includes('estoque') || errorMessage.includes('Not enough stock')) {
      toast.error('Estoque insuficiente para um ou mais produtos. Por favor, verifique o carrinho e tente novamente.')
    } else {
      toast.error('Erro ao criar pedido. Tente novamente.')
    }
  }
}

function handleEtapaChangeFromPayment(newEtapa) {
  emit('etapaChange', newEtapa)
}

function handleDadosColetadosFromPayment(dados) {
  const enderecoFinal = enderecos.value.find(end => end.id === enderecoSelecionadoId.value)
  emit('dadosColetados', {
    endereco: enderecoFinal,
    metodoPagamento: dados.metodoPagamento || metodoPagamento.value
  })
}

function getSelectedAddressInfo() {
  const selectedAddress = enderecos.value.find(end => end.id === enderecoSelecionadoId.value)
  if (selectedAddress) {
    return `${selectedAddress.street}, ${selectedAddress.number} - ${selectedAddress.city}/${selectedAddress.state} - CEP: ${selectedAddress.zip}`
  }
  return ''
}
</script>


<style scoped>
.checkout-form-modern {
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  padding: 2.2rem 2rem 2rem 2rem;
  border: 1.5px solid #e5e7eb;
  transition: box-shadow 0.2s, transform 0.2s;
}
.checkout-form-modern:focus-within, .checkout-form-modern:hover {
  box-shadow: 0 12px 40px rgba(106, 90, 224, 0.15);
  border-color: #6a5ae0;
  transform: translateY(-2px);
}
.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 2.2rem;
  margin-bottom: 2.2rem;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.03rem;
  color: #b8d8ff;
  font-weight: 600;
  opacity: 0.7;
  position: relative;
  transition: color 0.3s, opacity 0.3s;
}
.step i {
  font-size: 1.8rem;
  margin-bottom: 0.15rem;
  opacity: 0.85;
}
.step.active, .step.done {
  color: #399bff;
  opacity: 1;
}
.step.active i, .step.done i {
  color: #399bff;
  filter: drop-shadow(0 0 10px #399bff);
}
.step.done span::after {
  content: '';
  display: block;
  margin: 3px auto 0 auto;
  width: 22px;
  height: 3px;
  background: linear-gradient(90deg, #399bff 0%, #b8d8ff 100%);
  border-radius: 2px;
}
.form-section {
  background: transparent;
  box-shadow: none;
  border: none;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(90deg, #f8fafc 0%, #f3f4fa 100%);
  border-radius: 1rem 1rem 0 0;
  margin: -1.2rem -1.5rem 1.5rem -1.5rem;
}

.section-header i {
  font-size: 1.5rem;
  color: #6a5ae0;
}

.section-header h4 {
  margin: 0;
  color: #4a90e2;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.01em;
}

.address-selection {
  background: #f9fafb;
  border-radius: 1.2rem;
  padding: 1.2rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(106, 90, 224, 0.1);
  border: 1.5px solid #e5e7eb;
}

.address-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.address-option {
  position: relative;
  transition: all 0.3s ease;
}

.address-option:hover {
  transform: translateX(5px);
}

.address-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.address-label {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  background: #fff;
  transition: border 0.2s, background 0.2s;
  border-radius: 0.9rem;
  cursor: pointer;
  color: #232e47;
  box-shadow: 0 1px 6px #7c3aed10;
}

.address-radio:checked + .address-label {
  border-color: #6a5ae0;
  background: linear-gradient(135deg, #f3f4fa 0%, #ede9fe 100%);
  box-shadow: 0 4px 20px rgba(106, 90, 224, 0.2);
}

.address-info {
  flex: 1;
}

.address-street {
  font-weight: 700;
  font-size: 1.08rem;
  color: #232e47;
  margin-bottom: 0.2rem;
}

.address-details, .address-country {
  font-size: 0.97rem;
  color: #6a5ae0;
}

.btn-secondary {
  background: #fff;
  color: #6a5ae0;
  border: 2px solid #6a5ae0;
  border-radius: 0.9rem;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.2s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-secondary:hover {
  background: linear-gradient(90deg, #4a90e2, #6a5ae0);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(106, 90, 224, 0.3);
}
.address-form {
  background: #f9fafb;
  border-radius: 1.2rem;
  padding: 1.2rem 1rem;
  box-shadow: 0 2px 12px rgba(106, 90, 224, 0.1);
  border: 1.5px solid #e5e7eb;
  margin-bottom: 1.5rem;
}
.form-group.full-width {
  grid-column: 1 / -1;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-label {
  color: #4a90e2;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 7px;
  margin-left: 2px;
  letter-spacing: 0.01em;
}
.form-input {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.7rem;
  padding: 12px 16px;
  color: #232e47;
  font-size: 16px;
  transition: all 0.2s;
  min-width: 0;
  box-shadow: 0 1px 6px #7c3aed10;
}
.form-input:focus {
  outline: none;
  border-color: #6a5ae0;
  background: #f9fafb;
  box-shadow: 0 0 0 2px rgba(106, 90, 224, 0.3);
}
.form-input::placeholder {
  color: #b8d8ff;
}
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
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: linear-gradient(90deg, #4a90e2 0%, #6a5ae0 100%);
  color: #fff;
  border: none;
  border-radius: 0.9rem;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(106, 90, 224, 0.22);
  transition: background 0.22s, box-shadow 0.18s, transform 0.18s;
}
.btn-primary:hover {
  background: linear-gradient(90deg, #6a5ae0 0%, #4a90e2 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px rgba(106, 90, 224, 0.3);
}
.selected-address-info {
  background: #f9fafb;
  border-radius: 1.2rem;
  padding: 1rem 1rem 0.5rem 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(106, 90, 224, 0.1);
  border: 1.5px solid #e5e7eb;
}
.selected-address {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #ede9fe;
  border: 1.5px solid #b8d8ff;
  border-radius: 10px;
  color: #232e47;
  box-shadow: 0 2px 8px #7c3aed10;
}
.selected-address i {
  font-size: 24px;
  color: #6a5ae0;
}

/* Responsividade */
@media (max-width: 768px) {
  .checkout-form-modern {
    padding: 1.2rem 0.7rem;
    border-radius: 1rem;
  }
  .address-form, .address-selection, .selected-address-info {
    padding: 0.7rem 0.4rem;
    border-radius: 0.7rem;
  }
}
@media (max-width: 480px) {
  .checkout-form {
    padding: 0.5rem;
  }
  .glass-card {
    padding: 0.7rem 0.2rem;
  }
}
</style>