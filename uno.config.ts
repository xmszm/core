import { defineConfig, presetUno, presetAttributify } from 'unocss'
import { presetIcons } from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        // 可以根据需要配置图标集合
      },
    }),
  ],
  // 配置内容扫描路径
  content: {
    filesystem: ['src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  // 自定义规则和快捷方式
  shortcuts: {},
  // 主题配置
  theme: {},
})

