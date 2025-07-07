import api from './api'

export const login = async (credentials) => { 
    const response = await api.post('/login', credentitals)
    return response.data
}

export