<template>
  <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content clean-card">
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">
            {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4">
          <form @submit.prevent="saveProduct">
            <div class="mb-3">
              <label for="productName" class="form-label">Nome do Produto</label>
              <input type="text" class="form-control modern-input" id="productName" v-model="productFormData.name" required />
            </div>

            <div class="mb-3">
              <label for="productDescription" class="form-label">Descrição</label>
              <textarea class="form-control modern-input" id="productDescription" rows="3" v-model="productFormData.description" required maxlength="500"></textarea>
              <div class="text-end small mt-1" :style="{color: productFormData.description && productFormData.description.length >= 500 ? '#ff4d6d' : '#b0b0b0'}">
                {{ (productFormData.description || '').length }}/500 caracteres
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

            <div class="mb-3" v-if="!isEditing">
              <label for="productStock" class="form-label">Estoque Inicial</label>
              <input type="number" class="form-control modern-input" id="productStock" v-model.number="productFormData.stock" min="0" required />
            </div>

            <div class="mb-3">
              <label for="productImage" class="form-label">Imagem do Produto</label>
              <input type="file" class="form-control modern-input" id="productImage" @change="handleImageUpload" accept="image/*" />
              <small v-if="isEditing && productFormData.image_url">
                Imagem atual: <a :href="productFormData.image_url" target="_blank">Visualizar</a>
              </small>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button type="button" class="btn btn-outline-secondary me-3" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary px-4">{{ isEditing ? 'Salvar' : 'Criar Produto' }}</button>
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
  import { createProduct, updateProduct, updateProductImage } from '@/services/apiService';
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
  let bootstrapModalInstance = null; 
  
  // Observa a prop 'product' e atualiza o formulário quando ela muda pra ediçao
  watch(() => props.product, (newVal) => {
    if (newVal) {
      // Garante que o productFormData seja um objeto separado, não uma referência direta
      productFormData.value = { ...newVal };
      if (productFormData.value.stock === undefined || productFormData.value.stock === null) {
        productFormData.value.stock = 0;
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
        // Atualizar o produto existente (JSON, não FormData)
        const updateData = {
          name: productFormData.value.name,
          description: productFormData.value.description,
          price: productFormData.value.price,
          category_id: productFormData.value.category_id
        };
        response = await updateProduct(productFormData.value.id, updateData);
        // Se houver imagem nova, atualiza separadamente
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
  
  onMounted(() => {
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      bootstrapModalInstance = new Modal(modalElement);
    } else {
      console.error("Elemento 'productModal' não encontrado no DOM. O modal pode não funcionar.");
    }
  });
  </script>
  
  <style scoped>
  .clean-card {
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0e0e0;
  }
  
  .modal-header {
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
  
  .modal-title {
    font-weight: 600;
    color: #333;
  }
  
  .form-label {
    font-weight: 500;
    color: #444;
  }
  
  .modern-input {
    border-radius: 0.5rem;
    padding: 0.65rem 1rem;
    border: 1px solid #ccc;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .modern-input:focus {
    border-color: #007cf0;
    box-shadow: 0 0 0 0.2rem rgba(0, 124, 240, 0.15);
    outline: none;
  }
  
  .btn-primary {
    background-color: #007cf0;
    border-color: #007cf0;
    font-weight: 600;
  }
  
  .btn-primary:hover {
    background-color: #005ec8;
    border-color: #005ec8;
  }
  </style>