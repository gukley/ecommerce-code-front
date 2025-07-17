<template>
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
            <form class="modal-content" @submit.prevent="handleSubmit">
                <div class="modal-header">
                    <h5 class="modal-title">{{ category ? 'Editar' : 'Nova' }} Categoria</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="name" class="form-label">Nome</label>
                        <input
                            id="name"
                            v-model="form.name"
                            class="form-control"
                            placeholder="Nome da categoria"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Descrição</label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            class="form-control"
                            placeholder="Descrição da categoria (opcional)"
                            rows="3"
                        ></textarea>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
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
</style>
