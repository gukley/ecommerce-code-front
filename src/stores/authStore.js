import { defineStore } from 'pinia';
import { login, getUserProfile as apiGetUserProfile } from '@/services/apiService'; 
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => { 
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    // Getter para saber se o usuário está autenticado
    const isAuthenticated = computed(() => !!token.value)

    const loginUser = async (email, password) => { 
        const response = await login({ email, password }) 
        token.value = response.token 
        localStorage.setItem('token', token.value)
        await getUserProfile()
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
        isAuthenticated,
        loginUser,
        logout,
        getUserProfile,
    }
})
