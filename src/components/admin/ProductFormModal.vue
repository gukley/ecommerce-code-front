<template>
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark-card border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold text-primary-ggtech" id="productModalLabel">
              {{ isEditing ? 'Editar Produto' : 'Adicionar Novo Produto' }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label for="productName" class="form-label text-light">Nome do Produto</label>
                <input
                  type="text"
                  class="form-control input-custom"
                  id="productName"
                  v-model="productFormData.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="productDescription" class="form-label text-light">Descrição</label>
                <textarea
                  class="form-control input-custom"
                  id="productDescription"
                  rows="3"
                  v-model="productFormData.description"
                  required
                ></textarea>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="productPrice" class="form-label text-light">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    class="form-control input-custom"
                    id="productPrice"
                    v-model.number="productFormData.price"
                    min="0"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="productCategory" class="form-label text-light">Categoria</label>
                  <select
                    class="form-select input-custom"
                    id="productCategory"
                    v-model="productFormData.category_id"
                    required
                  >
                    <option value="" disabled>Selecione uma categoria</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="mb-3" v-if="!isEditing">
                <label for="productStock" class="form-label text-light">Estoque Inicial</label>
                <input
                  type="number"
                  class="form-control input-custom"
                  id="productStock"
                  v-model.number="productFormData.stock"
                  min="0"
                  required
                />
              </div>
  
              <div class="mb-3">
                <label for="productImage" class="form-label text-light">Imagem do Produto</label>
                <input
                  type="file"
                  class="form-control input-custom"
                  id="productImage"
                  @change="handleImageUpload"
                  accept="image/*"
                />
                <small class="text-light-50 mt-1 d-block" v-if="isEditing && productFormData.image_url">
                  Imagem atual: <a :href="productFormData.image_url" target="_blank" class="text-primary-ggtech">Ver imagem</a>
                </small>
              </div>
  
              <div class="d-flex justify-content-end mt-4">
                <button type="button" class="btn btn-outline-secondary-light me-3" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-main-action">
                  {{ isEditing ? 'Salvar Alterações' : 'Criar Produto' }}
                </button>
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
  import { Modal } from 'bootstrap'; // Importe o Modal do Bootstrap se estiver usando
  
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
  
  // Observa a prop 'product' e atualiza o formulário quando ela muda (para edição)
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
      // Monta o FormData
      const formData = new FormData();
      formData.append('name', String(productFormData.value.name));
      formData.append('description', String(productFormData.value.description));
      formData.append('price', String(productFormData.value.price));
      formData.append('stock', String(productFormData.value.stock));
      formData.append('category_id', String(productFormData.value.category_id));
      if (selectedFile.value) {
        formData.append('image', selectedFile.value);
      }

      if (props.isEditing) {
        // Atualizar o produto existente
        response = await updateProduct(productFormData.value.id, formData);
        toast.success('Produto atualizado com sucesso!');
      } else {
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
  .bg-dark-card {
    background-color: #3b3b4d;
    color: white;
  }
  
  .modal-header {
    border-bottom: 1px solid #4a4a5c;
  }
  
  .btn-close-white {
    filter: invert(1) grayscale(100%) brightness(200%); 
  }
  
  /* Estilo para inputs e selects */
  .input-custom {
    background-color: #4a4a5c;
    border: none;
    color: white;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
  }
  
  .input-custom::placeholder {
    color: #c0c0c0;
  }
  
  .input-custom:focus {
    background-color: #4a4a5c;
    color: white;
    box-shadow: 0 0 0 0.25rem rgba(143, 95, 232, 0.25);
    border-color: transparent;
  }
  
  .form-select.input-custom {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%238f5fe8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3csvg%3e");
    background-position: right 0.75rem center;
  }
  
  /* Botões do modal */
  .btn-main-action {
    background: linear-gradient(90deg, #a362ff, #8f5fe8);
    color: #fff;
    border: 2px solid #cbb6ff;
    font-size: 1.15rem;
    border-radius: 50px;
    box-shadow: 0 4px 16px rgba(163,98,255,0.18);
    transition: all 0.3s ease;
  }
  
  .btn-main-action:hover {
    background: linear-gradient(90deg, #8f5fe8, #a362ff);
    color: #fff;
    box-shadow: 0 8px 25px rgba(163,98,255,0.28);
    transform: translateY(-2px);
  }
  
  .btn-outline-secondary-light {
    border: 2px solid #00ffe1;
    color: #00ffe1;
    background-color: transparent;
    font-size: 1.15rem;
    border-radius: 50px;
    transition: all 0.3s ease;
  }
  
  .btn-outline-secondary-light:hover {
    background-color: #00ffe1;
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 225, 0.4);
  }
  </style>