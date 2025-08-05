import axios from 'axios'

const api = axios.create({ 
    baseURL: 'http://35.196.79.227:8000',
})

api.interceptors.request.use(config => { 
    const token = localStorage.getItem('token')
    if (token) { 
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
)

export default api