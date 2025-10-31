import { ethers } from 'ethers'

export default defineNuxtPlugin(() => {
  // 確保 ethers 在客戶端可用
  // 這個 plugin 只在客戶端執行（.client.ts 後綴）
  
  if (import.meta.client) {
    // 可以選擇將 ethers 掛載到全局（用於調試）
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window.ethers = ethers
      console.log('✅ Ethers.js 已載入 (v' + ethers.version + ')')
    }
  }

  return {
    provide: {
      ethers
    }
  }
})

