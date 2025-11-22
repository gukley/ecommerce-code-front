import api from './api';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ===== Auth =====
export const login = (credentials) =>
  api.post('/login', credentials).then(res => res.data);

export const register = (data) =>
  api.post('/register', data).then(res => res.data);


export const renewToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token') || null;
  if (!refreshToken) {
    console.error('Erro: Refresh token ausente.');
    throw new Error('Refresh token ausente');
  }

  try {
    const res = await axios.post(`${baseURL}/renew-token`, { refresh_token: refreshToken });
    const data = res.data || {};
    const token = data.access_token || data.token || data.new_token || null;
    const refresh = data.refresh_token || data.refreshToken || data.new_refresh_token || null;

    if (token) localStorage.setItem('token', token);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('refresh_token', refresh);
    }

    return { token, refreshToken: refresh, ...data };
  } catch (error) {
    console.error('Erro ao renovar o token (service):', error.response?.data || error.message);
    throw error;
  }
};


export const verifyToken = () =>
  api.get('/verify-token').then(res => res.data);

export const getUserProfile = () =>
  api.get('/users/me').then(res => res.data);

export const updateUserProfile = (data) =>
  api.put('/users/me', data).then(res => res.data);

export const deleteUser = () =>
  api.delete('/users/me').then(res => res.data);

export const createModerator = (data) =>
  api.post('/users/create-moderator', data).then(res => res.data);

export const updateModerator = (moderatorId, data) =>
  api.put(`/users/moderators/${moderatorId}`, data).then(res => res.data);

export const getModerators = () =>
  api.get('/users/moderators').then(res => res.data);

export const updateUserImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.put('/users/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};

// ===== Produtos =====
export const getAllProducts = () =>
  api.get('/products').then(res => res.data);

export const getProductById = (productId) =>
  api.get(`/products/${productId}`).then(res => res.data);

export const getProductsByUser = (userId) =>
  api.get(`/products/user/${userId}`).then(res => res.data);

export const getProductsByCategory = (categoryId) =>
  api.get(`/products/category/${categoryId}`).then(res => res.data);

export const createProduct = (data) => {
  if (data instanceof FormData) {
    return api.post('/products/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  }
  return api.post('/products/', data).then(res => res.data);
};

export const updateProduct = (productId, data) =>
  api.put(`/products/${productId}`, data).then(res => res.data);

export const updateProductStock = (productId, stockData) =>
  api.put(`/products/${productId}/stock`, stockData).then(res => res.data);

export const updateProductImage = (productId, formData) =>
  api.put(`/products/${productId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);

export const deleteProduct = (productId) =>
  api.delete(`/products/${productId}`).then(res => res.data);

// ===== Categorias =====
export const getCategories = () =>
  api.get('/categories/').then(res => res.data);

export const getCategoryById = (categoryId) =>
  api.get(`/categories/${categoryId}`).then(res => res.data);

export const getCategoriesByUser = (userId) =>
  api.get(`/categories/user/${userId}`).then(res => res.data);

export const createCategory = (data) =>
  api.post('/categories/', data).then(res => res.data);

export const updateCategory = (categoryId, data) =>
  api.put(`/categories/${categoryId}`, data).then(res => res.data);

export const deleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`).then(res => res.data);

export const updateCategoryImage = (categoryId, file) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.put(`/categories/${categoryId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};

// ===== Carrinho =====
export const getCart = () => api.get('/cart/');
export const createCart = () => api.post('/cart/');
export const getCartItems = () => api.get('/cart/items');

export const addItemToCart = (productId, quantity = 1, unitPrice) =>
  api.post('/cart/items', { product_id: productId, quantity, unit_price: unitPrice });

export const updateCartItem = (productId, quantity) =>
  api.put('/cart/items', { product_id: productId, quantity });

export const removeCartItem = (productId) =>
  api.delete('/cart/items', { data: { product_id: productId } });

export const clearCart = () => api.delete('/cart/clear');

// ===== Endereços =====
export const getAllAddresses = () => api.get('/addresses/').then(res => res.data);

export async function getAddressByCep(cep) {
  const response = await api.get(`/addresses/cep/${cep}`);
  return response.data;
}

export const createAddress = (addressData) => {
  const requiredFields = ['street', 'number', 'zip', 'bairro', 'city', 'state', 'country'];
  for (const field of requiredFields) {
    if (!addressData[field]) {
      throw new Error(`Campo obrigatório faltando: ${field}`);
    }
  }
  if (typeof addressData.zip !== 'string' || addressData.zip.length !== 8) {
    throw new Error('O campo CEP (zip) deve conter exatamente 8 dígitos.');
  }
  return api.post('/addresses/', addressData).then(res => res.data);
};

export const getAddressById = (addressId) => api.get(`/addresses/${addressId}`).then(res => res.data);
export const updateAddress = (addressId, updateData) => api.put(`/addresses/${addressId}`, updateData).then(res => res.data);
export const deleteAddress = (addressId) => api.delete(`/addresses/${addressId}`).then(res => res.data);

// ===== Pedidos =====
export const getAllOrders = () => api.get('/orders/all').then(res => res.data);
export const getOrderByAdmin = (adminId) => api.get(`/orders/all/${adminId}`).then(res => res.data);
export const getUsersOrders = () => api.get('/orders/').then(res => res.data);
export const getOrdersById = (orderId) => api.get(`/orders/${orderId}`).then(res => res.data);

export const createOrder = (orderData) => {
  if (!('coupon_id' in orderData)) orderData.coupon_id = null;
  
  // Garante que unit_price seja número
  if (Array.isArray(orderData.items)) {
    orderData.items = orderData.items.map(item => ({
      ...item,
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity)
    }));
  }
  
  // ✅ Calcula subtotal (soma dos itens)
  const subtotal = orderData.items.reduce((sum, item) => {
    return sum + (Number(item.unit_price) * Number(item.quantity));
  }, 0);
  
  // ✅ Valores individuais
  const frete = Number(orderData.shipping_cost || 0);
  const desconto = Number(orderData.discount_amount || 0);
  
  // ✅ Total final: subtotal + frete - desconto
  const totalFinal = subtotal + frete - desconto;
  
  // ✅ Define os valores no payload
  orderData.subtotal_amount = subtotal;
  orderData.shipping_cost = frete;
  orderData.discount_amount = desconto;
  orderData.total_amount = totalFinal;
  orderData.total_price = totalFinal; // Garante que total_price seja igual ao total_amount
  
  console.debug('✅ Payload final enviado ao backend:', {
    subtotal: subtotal.toFixed(2),
    frete: frete.toFixed(2),
    desconto: desconto.toFixed(2),
    total_final: totalFinal.toFixed(2),
    coupon_id: orderData.coupon_id
  });
  
  return api.post('/orders/', orderData).then(res => res.data);
};

export const updateOrderStatus = (orderId, statusData) => api.put(`/orders/${orderId}`, statusData).then(res => res.data);
export const cancelOrder = (orderId) => api.delete(`/orders/${orderId}`).then(res => res.data);
export const getOrdersByUserId = (userId) => api.get(`/orders/user/${userId}`).then(res => res.data);

// ===== Cupons =====
export const getAllCoupons = () => api.get('/coupons/').then(res => res.data);
export const getCouponById = (couponId) => api.get(`/coupons/${couponId}`).then(res => res.data);
export const createCoupon = (couponData) => api.post('/coupons/', couponData).then(res => res.data);
export const updateCoupon = (couponId, couponData) => api.put(`/coupons/${couponId}`, couponData).then(res => res.data);
export const deleteCoupon = (couponId) => api.delete(`/coupons/${couponId}`).then(res => res.data);

// ===== Descontos =====
export const getAllDiscounts = () => api.get('/discounts/').then(res => res.data);
export const createDiscount = (discountData) => api.post('/discounts/', discountData).then(res => res.data);
export const getDiscountById = (discountId) => api.get(`/discounts/${discountId}`).then(res => res.data);
export const updateDiscount = (discountId, discountData) => api.put(`/discounts/${discountId}`, discountData).then(res => res.data);
export const deleteDiscount = (discountId) => api.delete(`/discounts/${discountId}`).then(res => res.data);

// ===== Senha =====
export const changeUserPassword = (data) => api.post('/users/me/change-password', data).then(res => res.data);
export const forgotPassword = (data) => api.post('/users/forgot-password', data).then(res => res.data);
export const resetPassword = (data) => api.post('/users/reset-password', data).then(res => res.data);

// ===== Favoritos =====
export const getFavorites = async () => { return [] };
export const addFavorite = (productId) => api.post('/favorites/', { product_id: productId }).then(res => res.data);
export const removeFavorite = (favoriteId) => api.delete(`/favorites/${favoriteId}`).then(res => res.data);

// ===== Admin / Clientes =====
export const getAdminClients = () => api.get('/admin/clients').then(res => res.data);
export const getUserSummary = () => api.get('/users/me/summary').then(res => res.data);

// ===== Pagamentos =====
export const createCheckoutSession = async (payload) => {
  // usa a instância api para manter headers/autenticação centralizados
  const { data } = await api.post('/payments/create-checkout-session', payload);
  return data;
};

export const createPaymentIntent = async (payload) => {
  // espera { clientSecret, id } do backend
  const { data } = await api.post('/payments/create-payment-intent', payload);
  return data;
};

export const confirmPayment = async (payload) => {
  // payload: { order_id, payment_intent_id, method }
  const { data } = await api.post('/payments/confirm-payment', payload);
  return data;
};

export const getFinance = async () => {
  const { data } = await api.get('/payments/finance');
  return data;
};

export const deleteModerator = (id) =>
  api.delete(`/users/${id}`).then(res => res.data);

// ===== Demais exports =====
export default {
  login,
  register,
  renewToken,
  verifyToken,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  createModerator,
  updateModerator,
  deleteModerator,
  updateUserImage,
  getAllProducts,
  getProductById,
  getProductsByUser,
  getProductsByCategory,
  createProduct,
  updateProduct,
  updateProductStock,
  updateProductImage,
  deleteProduct,
  getCategories,
  getCategoryById,
  getCategoriesByUser,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryImage,
  getCart,
  createCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getAllAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAllOrders,
  getOrderByAdmin,
  getUsersOrders,
  getOrdersById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllDiscounts,
  createDiscount,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  changeUserPassword,
  forgotPassword,
  resetPassword,
  getFavorites,
  addFavorite,
  removeFavorite,
  getAdminClients,
  getUserSummary,
  getOrdersByUserId,
  getModerators,
  createCheckoutSession,
  createPaymentIntent,
  confirmPayment,
  getFinance
};