import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * Pinia 持久化插件配置
 * 用於在瀏覽器 localStorage 中保存狀態
 */
export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia
  
  if (pinia) {
    pinia.use(piniaPluginPersistedstate)
  }
})


