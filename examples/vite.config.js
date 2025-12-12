import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// 插件：重定向 @xmszm/core 中的 @/ 路径到项目 src
const redirectExternalImports = () => {
  return {
    name: 'redirect-external-imports',
    resolveId(id, importer) {
      // 如果是从 @xmszm/core 导入的 @/ 路径，重定向到项目 src
      if (importer && importer.includes('@xmszm/core') && id.startsWith('@/')) {
        const resolvedPath = path.resolve(__dirname, 'src', id.replace('@/', ''))
        return resolvedPath
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [vue(), vueJsx(), redirectExternalImports()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['vue'],
  },
  server: {
    port: 3000,
    open: true
  }
})

