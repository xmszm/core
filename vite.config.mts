import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      // 确保 JSX 转换配置正确
      transformOn: true,
      mergeProps: true,
      // 确保处理所有 .tsx 文件
      include: /\.(tsx|jsx)$/,
    }),
    UnoCSS(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      exclude: ['node_modules', 'dist', 'types', 'docs', 'examples'],
      outDir: 'dist',
      entryRoot: 'src',
      rollupTypes: true,
    }),
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
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        // Vite 插件单独入口
        'plugin/vite/initRouteMeta': path.resolve(__dirname, 'src/plugin/vite/initRouteMeta.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return format === 'es' ? 'index.mjs' : 'index.cjs'
        }
        // 插件文件保持相对路径结构
        const ext = format === 'es' ? 'mjs' : 'cjs'
        return `${entryName}.${ext}`
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
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
        // 保持目录结构
        preserveModules: false,
      },
    },
  },

})

