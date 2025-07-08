import api from './api'

//autenticação
export const login = (credentials) => api.post('/login', credentials).then(res => res.data)
export const register = (data) => api.post('/register', data).then(res => res.data)
export const renewToken = () => api.post('/renew-token').then(res => res.data)
export const verifyToken = () => api.get('/verify-token').then(res => res.data)

//usuario
export const getUserProfile = () => api.get('/users/me').then(res => res.data)
export const updateUserProfile = (data) =>api.put('/users/me', data).then(res => res.data)
export const deleteUser = () => api.delete('/users/me').then(res => res.data)
export const createModerator = (data) => api.post('/users/create-moderator', data).then(res => res.data)

export const updateUserImage = (file) => { 
    const formData = new FormData()
    formData.append('image', file)
    return api.put('/users/image', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
}