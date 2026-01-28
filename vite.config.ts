import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // 引入这个

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 添加到插件列表
  ],
  base: '/endfieldXTools/',
})