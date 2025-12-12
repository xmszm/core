import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import naive from 'naive-ui'

// 创建简单的路由配置（用于测试）
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App,
    },
  ],
})

const app = createApp(App)
app.use(naive)
app.use(router)
// 注意：permission 指令会在使用 Options 组件时自动注册，无需手动安装
app.mount('#app')

