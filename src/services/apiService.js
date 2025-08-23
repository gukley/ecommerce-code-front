import api from './api'

// Auth
export const login = (credentials) => 
    api.post('/login', credentials).then(res => res.data)

export const register = (data) =>
    api.post('/register', data).then(res => res.data)

export const renewToken = () =>
    api.post('/renew-token').then(res => res.data)

export const verifyToken = () => 
    api.get('/verify-token').then(res => res.data)

// Obter perfil do usuario autenticado
export const getUserProfile = () => 
    api.get('/users/me').then(res => res.data)

export const updateUserProfile = (data) => 
    api.put('/users/me', data).then(res => res.data)

export const deleteUser = () => 
    api.delete('/users/me').then(res => res.data)

// criar moderador
export const createModerator = (data) => 
    api.post('/users/create-moderator', data).then(res => res.data)
  

export const updateUserImage = (file) => { 
    const formData = new FormData()
    formData.append('image', file)

    return api.put('/users/image', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
}

// Produtos
export const getAllProducts = () =>
    api.get('/products').then(res => res.data)

export const getProductById = (productId) =>
    api.get(`/products/${productId}`).then(res => res.data)

export const getProductsByUser = (userId) =>
    api.get(`/products/category/${userId}`).then(res => res.data)

export const getProductsByCategory = (categoryId) =>
    api.get(`/products/category/${categoryId}`).then(res => res.data)

// Criar, atualizar e deletar
export const createProduct = (data) => {
  // If data is FormData (for image upload), use multipart/form-data
  if (data instanceof FormData) {
    return api.post('/products/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
  }
  // Otherwise, send as JSON
  return api.post('/products/', data).then(res => res.data)
}

export const updateProduct = (productId, data) =>
    api.put(`/products/${productId}`, data).then(res => res.data)

export const updateProductStock = (productId, stockData) =>
    api.put(`/products/${productId}/stock`, stockData).then(res => res.data)

export const updateProductImage = (productId, formData) =>
    api.put(`/products/${productId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
    }).then(res => res.data)

export const deleteProduct = (productId) =>
    api.delete(`/products/${productId}`).then(res => res.data)

// categorias
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
}

// Cart
export const getCart = () => api.get('/cart/')
export const createCart = () => api.post('/cart/')
export const getCartItems = () => api.get('/cart/items')

export const addItemToCart = (productId, quantity = 1, unitPrice) =>
    api.post('/cart/items', { product_id: productId, quantity, unit_price: unitPrice });

export const updateCartItem = (productId, quantity) =>
    api.put('/cart/items', { product_id: productId, quantity })

export const removeCartItem = (productId) =>
    api.delete('/cart/items', { data: { product_id: productId }})

export const clearCart = () => api.delete('/cart/clear')

// Address
export const getAllAddresses = () => { 
    return api.get('/addresses/').then(res => res.data)
}

export const createAddress = (addressData) => { 
    return api.post('/addresses/', addressData).then(res => res.data)
}

export const getAddressById = (addressId) => { 
    return api.get(`/addresses/${addressId}`).then(res => res.data)
}

export const updateAddress = (addressId, updateData) => { 
    return api.put(`/addresses/${addressId}`, updateData).then(res => res.data)
}

export const deleteAddress = (addressId) => { 
    return api.delete(`/addresses/${addressId}`).then(res => res.data)  
}

// Orders
export const getAllOrders = () =>
    api.get('/orders/all').then(res => res.data)

export const getOrderByAdmin = (adminId) =>
    api.get(`/orders/all/${adminId}`).then(res => res.data)

export const getUsersOrders = () =>
    api.get('/orders/').then(res => res.data)

export const getOrdersById = (orderId) =>
    api.get(`/orders/${orderId}`).then(res => res.data)

export const createOrder = (orderData) => {
    // Garante que coupon_id sempre existe (mesmo que null)
    if (!('coupon_id' in orderData)) {
        orderData.coupon_id = null;
    }
    // Garante que todos os unit_price são number (não string)
    if (Array.isArray(orderData.items)) {
        orderData.items = orderData.items.map(item => ({
            ...item,
            unit_price: Number(item.unit_price)
        }));
    }
    return api.post('/orders/', orderData).then(res => res.data)
}

export const updateOrderStatus = (orderId, statusData) =>
    api.put(`/orders/${orderId}`, statusData).then(res => res.data)

export const cancelOrder = (orderId) =>
    api.delete(`/orders/${orderId}`).then(res => res.data)

// Coupons
export const getAllCoupons = () =>
    api.get('/coupons/').then(res => res.data)

export const getCouponById = (couponId) =>
    api.get(`/coupons/${couponId}`).then(res => res.data)

export const createCoupon = (couponData) =>
    api.post('/coupons/', couponData).then(res => res.data)

export const updateCoupon = (couponId, couponData) =>
    api.put(`/coupons/${couponId}`, couponData).then(res => res.data)

export const deleteCoupon = (couponId) =>
    api.delete(`/coupons/${couponId}`).then(res => res.data)

// Discounts
export const getAllDiscounts = () =>
    api.get('/discounts/').then(res => res.data)

export const createDiscount = (discountData) =>
    api.post('/discounts/', {
        description: discountData.description,
        discount_percentage: discountData.discount_percentage,
        start_date: discountData.start_date,
        end_date: discountData.end_date,
        product_id: discountData.product_id
    }).then(res => res.data)

export const getDiscountById = (discountId) =>
    api.get(`/discounts/${discountId}`).then(res => res.data)

export const updateDiscount = (discountId, discountData) =>
    api.put(`/discounts/${discountId}`, {
        description: discountData.description,
        discount_percentage: discountData.discount_percentage,
        start_date: discountData.start_date,
        end_date: discountData.end_date,
        product_id: discountData.product_id
    }).then(res => res.data)

export const deleteDiscount = (discountId) =>
    api.delete(`/discounts/${discountId}`).then(res => res.data)

export const changeUserPassword = (data) =>
    api.post('/users/me/change-password', data).then(res => res.data) // alterar senha

export const getUserSummary = () =>
    api.get('/users/me/summary').then(res => res.data)

// Favoritos 
export const getFavorites = () => api.get('/favorites/').then(res => res.data)
export const addFavorite = (productId) => api.post('/favorites/', { product_id: productId }).then(res => res.data)
export const removeFavorite = (favoriteId) => api.delete(`/favorites/${favoriteId}`).then(res => res.data)

// Reviews
export const getReviews = () => api.get('/reviews/').then(res => res.data)
export const addReview = (reviewData) => api.post('/reviews/', reviewData).then(res => res.data)
export const updateReview = (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData).then(res => res.data)
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`).then(res => res.data)

/**
 * Busca todos os clientes (admin)
 */
export const getAdminClients = () => {
  return api.get('/admin/clients');
}


 // Busca pedidos de um cliente específico (admin)
export const getOrdersByUserId = (userId) =>
  api.get(`/orders/user/${userId}`).then(res => res.data);

// Editar moderador
export const updateModerator = (moderatorId, data) =>
    api.put(`/users/moderators/${moderatorId}`, data).then(res => res.data)

export const getModerators = () =>
    api.get('/users/moderators').then(res => res.data)

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
  getUserSummary,
  getFavorites,
  addFavorite,
  removeFavorite,
  getReviews,
  addReview,
  updateReview,
  deleteReview,
  getAdminClients,
  getOrdersByUserId,
  getModerators,
};
