import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Configuração para aliases de caminho.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@views': path.resolve(__dirname, './src/views'),
      '@router': path.resolve(__dirname, './src/router'),
    }
  },
  // Configuração para o servidor de desenvolvimento.
  server: {
    // Habilita o "polling" para detectar alterações de arquivos
    // em ambientes Docker, onde a observação nativa pode falhar.
    watch: {
      usePolling: true,
    },
    // Permite que o servidor seja acessado de fora do container.
    host: true,
    // Define a porta do servidor de desenvolvimento.
    port: 8000,
  }
})