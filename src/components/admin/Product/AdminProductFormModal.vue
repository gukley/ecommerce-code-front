<template>
  <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,0.7);">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content admin-modal-content"> <!-- Classe para o estilo do modal de categoria -->
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">
            {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
          </h5>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close"></button> <!-- Adicionada classe custom-btn-close para estilo -->
        </div>
        <div class="modal-body p-4">
          <form @submit.prevent="saveProduct">
            <div class="mb-3">
              <label for="productName" class="form-label">Nome do Produto</label>
              <input type="text" class="form-control modern-input" id="productName" v-model="productFormData.name" required />
            </div>

            <div class="mb-3">
              <label for="productDescription" class="form-label">Descrição</label>
              <textarea class="form-control modern-input" id="productDescription" rows="3" v-model="productFormData.description" required maxlength="800"></textarea>
              <div class="text-end small mt-1" :style="{color: productFormData.description && productFormData.description.length >= 800 ? 'var(--admin-danger)' : 'var(--admin-text-muted)'}">
                {{ (productFormData.description || '').length }}/800 caracteres
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="productPrice" class="form-label">Preço (R$)</label>
                <input type="number" step="0.01" class="form-control modern-input" id="productPrice" v-model.number="productFormData.price" min="0" required />
              </div>
              <div class="col-md-6">
                <label for="productCategory" class="form-label">Categoria</label>
                <select class="form-select modern-input" id="productCategory" v-model="productFormData.category_id" required>
                  <option value="" disabled>Selecione...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label for="productDiscount" class="form-label">Desconto</label>
              <select class="form-select modern-input" id="productDiscount" v-model="productFormData.discount_id">
                <option :value="null">Sem desconto</option>
                <option v-for="d in discounts" :key="d.id" :value="d.id">
                  {{ d.name }} - {{ d.value }}%
                </option>
              </select>
            </div>

            <div class="mb-3" v-if="!isEditing">
              <label for="productStock" class="form-label">Estoque Inicial</label>
              <input type="number" class="form-control modern-input" id="productStock" v-model.number="productFormData.stock" min="0" required />
            </div>

            <div class="mb-3">
              <label for="productImage" class="form-label">Imagem do Produto</label>
              <input type="file" class="form-control modern-input" id="productImage" @change="handleImageUpload" accept="image/*" />
              <small v-if="isEditing && productFormData.image_url" class="text-muted-custom">
                Imagem atual: <a :href="productFormData.image_url" target="_blank" class="text-link-custom">Visualizar</a>
              </small>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button type="button" class="btn btn-outline-secondary custom-btn-cancel me-3" data-bs-dismiss="modal">Cancelar</button> <!-- Adicionada classe custom-btn-cancel para estilo -->
              <button type="submit" class="btn btn-primary custom-btn-save px-4">{{ isEditing ? 'Salvar' : 'Criar Produto' }}</button> <!-- Adicionada classe custom-btn-save para estilo -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, nextTick, defineExpose } from 'vue';
import { useToast } from 'vue-toastification';
import { createProduct, updateProduct, updateProductImage, getAllDiscounts } from '@/services/apiService';
import { Modal } from 'bootstrap'; 
  
const props = defineProps({
    product: {
      type: Object,
      default: null 
    },
    categories: {
      type: Array,
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['product-saved']);
  const toast = useToast();
  
  const productFormData = ref({});
  const selectedFile = ref(null);
  const discounts = ref([]);
  let bootstrapModalInstance = null; 
  
  // Observa a prop 'product' e atualiza o formulário quando ela muda pra ediçao
  watch(() => props.product, (newVal) => {
    if (newVal) {
      productFormData.value = { ...newVal };
      if (productFormData.value.stock === undefined || productFormData.value.stock === null) {
        productFormData.value.stock = 0;
      }
      if (newVal.discount_id === undefined) {
        productFormData.value.discount_id = null;
      }
    } else {
      productFormData.value = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: '' 
      };
    }
    selectedFile.value = null; 
  }, { deep: true, immediate: true }); 
  
  const handleImageUpload = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  const saveProduct = async () => {
    try {
      let response;
      if (props.isEditing) {
        const updateData = {
          name: productFormData.value.name,
          description: productFormData.value.description,
          price: productFormData.value.price,
          category_id: productFormData.value.category_id,
          discount_id: productFormData.value.discount_id
        };
        response = await updateProduct(productFormData.value.id, updateData);
        if (selectedFile.value) {
          const imageForm = new FormData();
          imageForm.append('image', selectedFile.value);
          await updateProductImage(productFormData.value.id, imageForm);
        }
        toast.success('Produto atualizado com sucesso!');
      } else {
        // Criação: pode enviar FormData normalmente
        const formData = new FormData();
        formData.append('name', String(productFormData.value.name));
        formData.append('description', String(productFormData.value.description));
        formData.append('price', String(productFormData.value.price));
        formData.append('stock', String(productFormData.value.stock));
        formData.append('category_id', String(productFormData.value.category_id));
        formData.append('discount_id', productFormData.value.discount_id ?? '');
        if (selectedFile.value) {
          formData.append('image', selectedFile.value);
        }
        response = await createProduct(formData);
        toast.success('Produto criado com sucesso!');
      }
      bootstrapModalInstance.hide();
      emit('product-saved'); 
    } catch (error) {
      console.error('Erro detalhado ao salvar produto:', error); 
      toast.error('Erro ao salvar produto: ' + (error.response?.data?.message || error.message));
    }
  };
  const showModal = () => {
    nextTick(() => {
      bootstrapModalInstance.show();
    });
  };
  
  defineExpose({
    showModal
  });
  
  onMounted(async () => {
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      bootstrapModalInstance = new Modal(modalElement);
    } else {
      console.error("Elemento 'productModal' não encontrado no DOM. O modal pode não funcionar.");
    }
    discounts.value = await getAllDiscounts();
  });
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
  --admin-text-muted: rgba(255, 255, 255, 0.6);
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
.custom-btn-close {
  background: none; 
  border: none;
  color: var(--admin-text-muted); 
  font-size: 1.5rem; 
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23e0e0e0'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
  background-size: 1em; 
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1; 
}

.custom-btn-close:hover {
  color: var(--admin-danger);
  transform: rotate(90deg);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ff6b6b'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
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

.text-muted-custom {
  color: var(--admin-text-muted);
  font-size: 0.85rem;
}

.text-link-custom {
  color: var(--admin-accent-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.text-link-custom:hover {
  color: var(--admin-accent-secondary);
  text-decoration: underline;
}
.custom-btn-cancel { 
  background: transparent;
  color: var(--admin-text-secondary);
  border: 2px solid var(--admin-border-medium); 
  border-radius: 50px;
  font-weight: 600;
  padding: 0.75rem 1.5rem; 
  transition: all 0.3s ease;
}

.custom-btn-cancel:hover {
  background: var(--admin-bg-tertiary);
  color: var(--admin-text-primary); 
  border-color: var(--admin-accent-primary);
}

.custom-btn-save { 
  background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%); 
  color: #fff !important;
  border: none; 
  border-radius: 50px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
  transition: all 0.3s ease;
}
.custom-btn-save:hover {
  background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%); 
  color: #fff !important;
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
  transform: translateY(-2px); 
}
.custom-btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>