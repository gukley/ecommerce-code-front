<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content admin-modal-content" @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title">{{ category ? 'Editar Categoria' : 'Nova Categoria' }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
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
            <button type="button" class="btn btn-outline-secondary me-3" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary px-4" :disabled="isSubmitting">
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

console.log('authStore.user na inicialização do componente:', authStore.user);
console.log('authStore.token na inicialização do componente:', authStore.token);


watch(() => authStore.user, (newUser) => {
    console.log('authStore.user mudou para:', newUser);
});

watch(() => authStore.token, (newToken) => {
    console.log('authStore.token mudou para:', newToken ? 'Token presente' : 'Token ausente');
    if (newToken && !authStore.user) {
        authStore.getUserProfile();
    }
});

onMounted(() => {
    if (authStore.token && !authStore.user) {
        console.log('Token presente na montagem, tentando carregar perfil do usuário...');
        authStore.getUserProfile();
    }
});


watch(
    () => props.category,
    (val) => {
        form.value = val ? { ...val } : { name: '', description: '' };
    },
    { immediate: true }
);

const handleSubmit = async () => {
    if (!form.value.name || form.value.name.trim() === '') {
        toast.warning('O campo "nome" é obrigatório.');
        return;
    }

    if (!authStore.user || !authStore.user.id) {
        console.warn('Usuário não logado ou ID de usuário não disponível no authStore.');
        toast.error('Você precisa estar logado para criar uma categoria. Por favor, faça login.');
        isSubmitting.value = false;
        return; 
    }

    isSubmitting.value = true;

    const baseData = {
        name: form.value.name.trim(),
        description: form.value.description.trim() || '',
    };

    let dataToSend;

    try {
        if (props.category) {
            dataToSend = { ...baseData, user_id: 211 }; 
            console.log('Payload para atualização:', dataToSend); 
            await updateCategory(props.category.id, dataToSend);
            toast.success('Categoria atualizada com sucesso!');
        } else {
            const formData = new FormData();
            formData.append('name', form.value.name.trim());
            formData.append('description', form.value.description.trim() || '');
            console.log('Payload para criação (FormData):', formData);
            await createCategory(formData);
            toast.success('Categoria criada com sucesso!');
        }
        emit('saved');
    } catch (err) {
        if (err.response && err.response.data) {
            console.error('Erro API detalhado:', JSON.stringify(err.response.data, null, 2));
            const errorMessage = err.response.data.detail?.[0]?.msg || 'Erro ao salvar categoria. Verifique os dados.';
            toast.error(errorMessage);
        } else {
            console.error('Erro desconhecido:', err);
            toast.error('Erro ao salvar categoria. Verifique os dados.');
        }
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped> 
:root { 
    --admin-primary: #00ffe1;
    --admin-primary-dark: #00bcd4;
    --admin-primary-gradient: linear-gradient(90deg, #00ffe1 0%, #007cf0 100%);
}
.admin-modal-content { 
    background: #f8f9fa;
    color: #212529;
    border-radius: 1.25rem;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.modal-header { 
    border-bottom: 1px solid #dee2e6;
    background-color: #ffffff;
}
.modal-title { 
    font-weight: 600;
    color: #212529;
}
.form-label { 
    color: #495057;
    font-weight: 500;
}
.modern-input { 
    background: #ffffff;
    color: #212529;
    border: 1px solid #ced4da;
    border-radius: 0.5rem;
    padding: 0.65rem 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
}
.modern-input::placeholder { 
    color: #adb5bd;
}
.modern-input:focus { 
    background: #ffffff;
    border-color: var(--admin-primary-dark);
    box-shadow: 0 0 0 0.2rem rgba(0, 255, 225, 0.15);
    color: #212529;
    outline: none;
}
.btn-outline-secondary { 
    background: transparent;
    color: var(--admin-primary-dark);
    border: 2px solid var(--admin-primary-dark);
    border-radius: 50px;
    transition: all 0.2s;
}
.btn-outline-secondary:hover { 
    background: var(--admin-primary-dark);
    color: #fff;
}
.btn-primary { 
    background: var(--admin-primary-gradient);
    color: #fff;
    border: 2px solid var(--admin-primary);
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
}
.btn-primary:hover { 
    background: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
    color: #fff;
}
</style>