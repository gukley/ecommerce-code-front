import axios from 'axios'

// Usa a variável de ambiente do Vue
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// Intercepta requisições para adicionar token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepta respostas para logar erros
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.status, error.response?.data)
        return Promise.reject(error)
    }
)

export default api
