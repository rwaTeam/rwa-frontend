// export default defineNuxtPlugin(async () => {
//   const { checkConnection } = useWeb3()
//   // await initializeProvider()  // 自動初始化
//   // await checkConnection()     // 嘗試自動重連
//   // 只在客戶端執行
//   if (import.meta.client) {
//     try {
//       // 延遲初始化，確保所有模組載入完成
//       await new Promise(resolve => setTimeout(resolve, 100))
//       await checkConnection()
//       console.log('✅ Web3 Plugin 初始化完成')
//     } catch (error) {
//       console.error('❌ Web3 Plugin 初始化失敗:', error)
//     }
//   }
// })