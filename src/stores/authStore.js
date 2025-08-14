import { defineStore } from 'pinia';
import { login, getUserProfile as apiGetUserProfile } from '@/services/apiService'; 
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => { 
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    const loginUser = async (email, password) => { 
        const response = await login({ email, password })
        token.value = response.token  // não response.data.token
        localStorage.setItem('token', token.value)
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      

    const getUserProfile = async () => { 
        const userData = await apiGetUserProfile();
        console.log('Perfil carregado:', userData);
        user.value = userData;
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