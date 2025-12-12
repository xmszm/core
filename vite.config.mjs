import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      dts: './types/auto-imports.d.ts', // 生成类型声明文件到 types 目录
      eslintrc: {
        enabled: false, // 如果使用 ESLint，可以设为 true
      },
      // 确保导入语句从正确的模块导入
      resolvers: [],
    }),
  ],
  resolve: {
    alias: {
      core: path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
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

