import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'node:path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      core: path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'NexCore',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: [
        'vue',
        'naive-ui',
        'vue-router',
        'dayjs',
        'lodash-es',
        '@vicons/ionicons5',
        /^@\/.*/,
      ],
      output: {
        globals: {
          vue: 'Vue',
          'naive-ui': 'NaiveUI',
          'vue-router': 'VueRouter',
          dayjs: 'dayjs',
          'lodash-es': 'lodashEs',
          '@vicons/ionicons5': 'ViconsIonicons5',
        },
      },
    },
  },
})

