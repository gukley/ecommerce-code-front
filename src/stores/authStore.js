import { defineStore } from 'pinia';
import api from '@services/api';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => { 
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    const loginUser = async (email, password) => { 
        const response = await api.login({ email, password})
        token.value = response.data.token
        localStorage.setItem('token', token.value)
        await getUserProfile()
    }

    const getUserProfile = async () => { 
        const response = await api.getUser()
        user.value = response.data
    }

    const logout = () => { 
        token.value = null
        user.value = null
        localStorage.removeItem('token')
    }

    return { 
        user,
        token,
        loginUser,
        logout,
        getUserProfile,
    }
})