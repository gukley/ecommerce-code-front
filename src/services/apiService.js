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

//criar moderador
export const createModerator = (data) => 
    api.post('/users/create-moderator', data).then(res => res.data)
  

export const updateUserImage = (file) => { 
    const formData = new FormData()
    formData.append('image', file)

    return api.put('/users/image', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
}

//Produtos
export const getAllProducts = () =>
    api.get('/products').then(res => res.data)

export const getProductById = (productId) =>
    api.get(`/products/${productId}`).then(res => res.data)

export const getProductsByUser = (userId) =>
    api.get(`/products/category/${userId}`).then(res => res.data)

export const getProductsByCategory = (categoryId) =>
    api.get(`/products/category/${categoryId}`).then(res => res.data)

// Criar, atualizar e deletar
export const createProduct = (data) =>
    api.post('/products/', data).then(res => res.data)

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

//categorias
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

export const createOrder = (orderData) =>
    api.post('/orders/', orderData).then(res => res.data)

export const updateOrderStatus = (orderId, statusData) =>
    api.put(`/orders/${orderId}`, statusData).then(res => res.data)

export const cancelOrder = (orderId) =>
    api.delete(`/orders/${orderId}`).then(res => res.data)