// api.service.js
import api from './api'

// Função central de tratamento de requisições
const handleRequest = async (requestFn) => {
  try {
    const res = await requestFn()
    return res.data
  } catch (error) {
    if (error.response) {
      // Erro vindo do servidor (4xx, 5xx)
      throw {
        status: error.response.status,
        message: error.response.data?.detail || error.response.data?.message || 'Erro na requisição',
        data: error.response.data
      }
    } else if (error.request) {
      // Servidor não respondeu
      throw { message: 'Servidor não respondeu. Verifique sua conexão.' }
    } else {
      // Erro interno no código
      throw { message: `Erro inesperado: ${error.message}` }
    }
  }
}

// Autenticação
export const login = (credentials) => 
  handleRequest(() => api.post('/login', credentials))

export const register = (data) =>
  handleRequest(() => api.post('/register', data))

export const renewToken = () =>
  handleRequest(() => api.post('/renew-token'))

export const verifyToken = () => 
  handleRequest(() => api.get('/verify-token'))

export const getUserProfile = () => 
  handleRequest(() => api.get('/users/me'))

export const updateUserProfile = (data) => 
  handleRequest(() => api.put('/users/me', data))

export const deleteUser = () => 
  handleRequest(() => api.delete('/users/me'))

export const createModerator = (data) => 
  handleRequest(() => api.post('/users/create-moderator', data))

export const updateUserImage = (file) => { 
  const formData = new FormData()
  formData.append('image', file)

  return handleRequest(() => api.put('/users/image', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' }
  }))
}

// Produtos
export const getAllProducts = () =>
  handleRequest(() => api.get('/products'))

export const getProductById = (productId) =>
  handleRequest(() => api.get(`/products/${productId}`))

export const getProductsByUser = (userId) =>
  handleRequest(() => api.get(`/products/category/${userId}`))

export const getProductsByCategory = (categoryId) =>
  handleRequest(() => api.get(`/products/category/${categoryId}`))

export const createProduct = (data) =>
  handleRequest(() => api.post('/products/', data))

export const updateProduct = (productId, data) =>
  handleRequest(() => api.put(`/products/${productId}`, data))

export const updateProductStock = (productId, stockData) =>
  handleRequest(() => api.put(`/products/${productId}/stock`, stockData))

export const updateProductImage = (productId, formData) =>
  handleRequest(() => api.put(`/products/${productId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data'}
  }))

export const deleteProduct = (productId) =>
  handleRequest(() => api.delete(`/products/${productId}`))

// Categorias
export const getCategories = () =>
  handleRequest(() => api.get('/categories/'))

export const getCategoryById = (categoryId) =>
  handleRequest(() => api.get(`/categories/${categoryId}`))

export const getCategoriesByUser = (userId) =>
  handleRequest(() => api.get(`/categories/user/${userId}`))

export const createCategory = (data) =>
  handleRequest(() => api.post('/categories/', data))

export const updateCategory = (categoryId, data) =>
  handleRequest(() => api.put(`/categories/${categoryId}`, data))

export const deleteCategory = (categoryId) =>
  handleRequest(() => api.delete(`/categories/${categoryId}`))

export const updateCategoryImage = (categoryId, file) => { 
  const formData = new FormData()
  formData.append('image', file)

  return handleRequest(() => api.put(`/categories/${categoryId}/image`, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' }
  }))
}

// Carrinho
export const getCart = () => 
  handleRequest(() => api.get('/cart/'))

export const createCart = () => 
  handleRequest(() => api.post('/cart/'))

export const getCartItems = () => 
  handleRequest(() => api.get('/cart/items'))

export const addItemToCart = (productId, quantity = 1, unitPrice) =>
  handleRequest(() => api.post('/cart/items', { product_id: productId, quantity, unit_price: unitPrice }))

export const updateCartItem = (productId, quantity) =>
  handleRequest(() => api.put('/cart/items', { product_id: productId, quantity }))

export const removeCartItem = (productId) =>
  handleRequest(() => api.delete('/cart/items', { data: { product_id: productId }}))

export const clearCart = () => 
  handleRequest(() => api.delete('/cart/clear'))

// Endereços
export const getAllAddresses = () => 
  handleRequest(() => api.get('/addresses/'))

export const createAddress = (addressData) => 
  handleRequest(() => api.post('/addresses/', addressData))

export const getAddressById = (addressId) => 
  handleRequest(() => api.get(`/addresses/${addressId}`))

export const updateAddress = (addressId, updateData) => 
  handleRequest(() => api.put(`/addresses/${addressId}`, updateData))

export const deleteAddress = (addressId) => 
  handleRequest(() => api.delete(`/addresses/${addressId}`))

// Pedidos
export const getAllOrders = () =>
  handleRequest(() => api.get('/orders/all'))

export const getOrderByAdmin = (adminId) =>
  handleRequest(() => api.get(`/orders/all/${adminId}`))

export const getUsersOrders = () =>
  handleRequest(() => api.get('/orders/'))

export const getOrdersById = (orderId) =>
  handleRequest(() => api.get(`/orders/${orderId}`))

export const createOrder = (orderData) =>
  handleRequest(() => api.post('/orders/', orderData))

export const updateOrderStatus = (orderId, statusData) =>
  handleRequest(() => api.put(`/orders/${orderId}`, statusData))

export const cancelOrder = (orderId) =>
  handleRequest(() => api.delete(`/orders/${orderId}`))
