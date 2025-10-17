<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.7);"> <!-- Fundo mais escuro -->
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content admin-modal-content" @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title">{{ category ? 'Editar Categoria' : 'Nova Categoria' }}</h5>
            <button type="button" class="btn-close-custom" @click="$emit('close')"> <!-- Classe customizada -->
              <i class="bi bi-x-lg"></i> <!-- Ícone de fechar para melhor visual -->
            </button>
          </div>
  
          <div class="modal-body p-4">
            <div class="mb-3">
              <label for="name" class="form-label">Nome</label>
              <input
                id="name"
                v-model="form.name"
                class="form-control modern-input"
                placeholder="Nome da categoria"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="description" class="form-label">Descrição</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-control modern-input"
                placeholder="Descrição da categoria (opcional)"
                rows="3"
              ></textarea>
            </div>
          </div>
  
          <div class="modal-footer d-flex justify-content-end">
            <button type="button" class="btn btn-cancel-custom me-3" @click="$emit('close')" :disabled="isSubmitting"> <!-- Botão Cancelar customizado -->
              Cancelar
            </button>
            <button type="submit" class="btn btn-save-custom px-4" :disabled="isSubmitting"> <!-- Botão Salvar customizado -->
              {{ category ? 'Salvar alterações' : 'Criar categoria' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { createCategory, updateCategory } from '@/services/apiService';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '@/stores/authStore';
  
  const props = defineProps({
    category: {
      type: Object,
      default: null
    }
  });
  
  const emit = defineEmits(['close', 'saved']);
  
  const form = ref({ name: '', description: '' });
  const isSubmitting = ref(false);
  const toast = useToast();
  const authStore = useAuthStore();
  
  // Inicializa o formulário quando props.category muda
  watch(
    () => props.category,
    (val) => {
      // Se 'val' existir (edição), preenche o form. Senão (criação), zera o form.
      form.value = val ? { ...val } : { name: '', description: '' };
    },
    { immediate: true, deep: true } // 'deep: true' garante a reatividade se o objeto for complexo
  );
  
  // Carrega o perfil do usuário se houver token, mas o usuário não estiver carregado
  onMounted(() => {
    if (authStore.token && !authStore.user) {
      authStore.getUserProfile();
    }
  });
  
  const handleSubmit = async () => {
    // 1. Validação do formulário no frontend
    if (!form.value.name || form.value.name.trim() === '') {
      toast.warning('O campo "nome" é obrigatório.');
      return;
    }
  
    // 2. Validação de autenticação do usuário
    if (!authStore.user || !authStore.user.id) {
      toast.error('Você precisa estar logado para realizar esta ação.');
      return;
    }
  
    isSubmitting.value = true;
  
    try {
      if (props.category && props.category.id) {
        // --- LÓGICA DE ATUALIZAÇÃO ---
        // O payload para atualização pode ser diferente.
        // Neste exemplo, enviamos apenas os campos que podem ser alterados.
        const updatePayload = {
          name: form.value.name.trim(),
          description: form.value.description.trim() || '',
        };
        await updateCategory(props.category.id, updatePayload);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        const createPayload = {
          name: form.value.name.trim(),
          description: form.value.description.trim() || '',
        };
        await createCategory(createPayload);
        toast.success('Categoria criada com sucesso!');
      }
      
      emit('saved'); // Sinaliza que a operação foi bem-sucedida
      emit('close'); // Fecha o modal
    } catch (err) {
      // Tratamento de erro aprimorado para dar feedback claro ao usuário
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
      if (err.response && err.response.data && err.response.data.detail) {
        console.error('Erro API detalhado:', JSON.stringify(err.response.data, null, 2));
        // Pega a primeira mensagem de erro da lista de detalhes da validação do FastAPI
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail[0].msg || 'Erro de validação nos dados enviados.';
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
      } else {
        console.error('Erro desconhecido:', err);
      }
      toast.error(errorMessage);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
<style scoped>
  :root {
    --admin-bg-primary: #0f0f23;
    --admin-bg-secondary: #181828;
    --admin-bg-tertiary: #202038;
    --admin-accent-primary: #00ffe1;
    --admin-accent-secondary: #8f5fe8;
    --admin-text-primary: #ffffff;
    --admin-text-secondary: rgba(255, 255, 255, 0.8);
    --admin-border-light: rgba(255, 255, 255, 0.1);
    --admin-shadow-light: rgba(0, 0, 0, 0.1);
    --admin-danger: #ff6b6b;
  }
  
 .admin-modal-content {
    background: var(--admin-bg-secondary); 
    color: var(--admin-text-primary); 
    border-radius: 1.25rem;
    border: 1px solid var(--admin-border-light); 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); 
  }
  
  .modal-header {
    border-bottom: 1px solid var(--admin-border-light);
    background-color: var(--admin-bg-tertiary); 
    padding: 1.25rem 1.5rem; 
  }
  
  .modal-title {
    font-weight: 600;
    color: var(--admin-accent-primary); 
    font-size: 1.4rem; 
  }
  
  .btn-close-custom {
    background: none;
    border: none;
    color: var(--admin-text-muted); 
    font-size: 1.5rem; 
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
  }
  
  .btn-close-custom:hover {
    color: var(--admin-danger); 
    transform: rotate(90deg); 
  }
  
  .form-label {
    color: var(--admin-text-secondary); 
    font-weight: 500;
    margin-bottom: 0.5rem; 
  }
  
  .modern-input {
    background: var(--admin-bg-primary); 
    color: var(--admin-text-primary); 
    border: 1px solid var(--admin-border-medium); 
    border-radius: 0.5rem;
    padding: 0.8rem 1rem; 
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .modern-input::placeholder {
    color: var(--admin-text-muted); 
  }
  
  .modern-input:focus {
    background: var(--admin-bg-primary);
    border-color: var(--admin-accent-primary); 
    box-shadow: 0 0 0 0.2rem rgba(0, 255, 225, 0.25); 
    color: var(--admin-text-primary);
    outline: none;
  }
  
  .modal-footer {
    border-top: 1px solid var(--admin-border-light);
    padding: 1.25rem 1.5rem; 
  }
  
 .btn-cancel-custom {
    background: transparent;
    color: var(--admin-text-secondary); 
    border: 2px solid var(--admin-border-medium); 
    border-radius: 50px;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s ease;
  }
  
  .btn-cancel-custom:hover {
    background: var(--admin-bg-tertiary); 
    color: var(--admin-text-primary); 
    border-color: var(--admin-accent-primary); 
  }
  
  .btn-save-custom {
    background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%); 
    color: #fff !important;
    border: none; 
    border-radius: 50px;
    font-weight: 600;
    padding: 0.75rem 1.5rem; 
    box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2); 
    transition: all 0.3s ease;
  }
  
  .btn-save-custom:hover {
    background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%); 
    color: #fff !important;
    box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
    transform: translateY(-2px); 
  }
  
  .btn-save-custom:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  </style>