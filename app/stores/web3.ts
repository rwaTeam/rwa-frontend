import { defineStore } from 'pinia'

/**
 * Web3 Store - 僅用於狀態持久化
 * 所有業務邏輯已移至 useWeb3 composable
 */

interface Web3State {
  isConnected: boolean
  account: string | null
  chainId: number | null
  hasMetaMask: boolean
}

export const useWeb3Store = defineStore('web3', {
  state: (): Web3State => ({
    isConnected: false,
    account: null,
    chainId: null,
    hasMetaMask: false,
  }),

  getters: {
    // 格式化帳戶地址
    shortAccount: (state) => {
      if (!state.account) return ''
      return `${state.account.substring(0, 6)}...${state.account.substring(state.account.length - 4)}`
    },
  },

  actions: {
    /**
     * 檢測 MetaMask 是否安裝
     */
    checkMetaMask() {
      if (typeof window !== 'undefined') {
        this.hasMetaMask = typeof window.ethereum !== 'undefined'
      }
    },

    /**
     * 從 composable 同步狀態
     * @param data - 來自 useWeb3 的狀態數據
     */
    syncFromComposable(data: {
      isConnected: boolean
      account: string
      chainId: number
    }) {
      this.isConnected = data.isConnected
      this.account = data.account
      this.chainId = data.chainId
    },

    /**
     * 重置狀態
     */
    reset() {
      this.isConnected = false
      this.account = null
      this.chainId = null
    },
  },

  // 持久化配置
  // 需要先安裝: npm install pinia-plugin-persistedstate
  // @ts-ignore - persist 配置由 pinia-plugin-persistedstate 提供
  persist: {
    key: 'greenfi-web3',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['account', 'chainId'], // 只持久化必要的狀態
  },
})

// 擴展 Window 介面以支持 ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
