import { useWeb3Store } from '~/stores/web3'
import { getTxUrl, getAddressUrl, shortenAddress } from '~/config/contract'

/**
 * Web3 Composable
 * 提供便捷的 Web3 操作方法和工具函數
 */
export function useWeb3() {
  const web3Store = useWeb3Store()

  /**
   * 連接錢包
   */
  const connectWallet = async () => {
    try {
      await web3Store.connectWallet()
      return true
    } catch (error: any) {
      console.error('連接錢包失敗:', error)
      return false
    }
  }

  /**
   * 斷開錢包
   */
  const disconnectWallet = () => {
    web3Store.disconnectWallet()
  }

  /**
   * 切換到 Sepolia 網路
   */
  const switchToSepolia = async () => {
    try {
      await web3Store.switchToSepolia()
      return true
    } catch (error: any) {
      console.error('切換網路失敗:', error)
      return false
    }
  }

  /**
   * 執行投資
   * @param projectId 專案 ID
   * @param amount 投資金額（ETH）
   */
  const invest = async (projectId: string, amount: string) => {
    try {
      const result = await web3Store.invest(projectId, amount)
      return {
        success: true,
        txHash: result.txHash,
        txUrl: getTxUrl(result.txHash),
      }
    } catch (error: any) {
      console.error('投資失敗:', error)
      return {
        success: false,
        error: error.message || '投資失敗',
      }
    }
  }

  /**
   * 檢查錢包是否已連接且在正確網路
   */
  const isReady = computed(() => {
    return web3Store.isConnected && web3Store.isCorrectNetwork
  })

  /**
   * 獲取當前帳戶地址（完整）
   */
  const account = computed(() => web3Store.account)

  /**
   * 獲取當前帳戶地址（縮短）
   */
  const shortAccount = computed(() => web3Store.shortAccount)

  /**
   * 獲取餘額
   */
  const balance = computed(() => web3Store.formattedBalance)

  /**
   * 是否已連接
   */
  const isConnected = computed(() => web3Store.isConnected)

  /**
   * 是否在正確網路
   */
  const isCorrectNetwork = computed(() => web3Store.isCorrectNetwork)

  /**
   * 是否安裝 MetaMask
   */
  const hasMetaMask = computed(() => web3Store.hasMetaMask)

  /**
   * 錯誤訊息
   */
  const error = computed(() => web3Store.error)

  /**
   * 獲取交易 URL
   */
  const getTransactionUrl = (txHash: string) => getTxUrl(txHash)

  /**
   * 獲取地址 URL
   */
  const getAddressLink = (address: string) => getAddressUrl(address)

  /**
   * 縮短地址
   */
  const formatAddress = (address: string, chars = 4) => shortenAddress(address, chars)

  /**
   * 驗證投資金額
   */
  const validateAmount = (amount: string | number, minAmount: number) => {
    const numAmount = parseFloat(String(amount))
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return {
        valid: false,
        error: '請輸入有效的金額',
      }
    }

    if (numAmount < minAmount) {
      return {
        valid: false,
        error: `最低投資金額為 ${minAmount} ETH`,
      }
    }

    const currentBalance = parseFloat(web3Store.balance)
    if (numAmount > currentBalance) {
      return {
        valid: false,
        error: '餘額不足',
      }
    }

    return {
      valid: true,
      error: null,
    }
  }

  /**
   * 計算預期回報
   */
  const calculateReturn = (amount: string | number, roi: number) => {
    const numAmount = parseFloat(String(amount))
    if (isNaN(numAmount)) return '0'
    
    const returnAmount = numAmount * (1 + roi / 100)
    return returnAmount.toFixed(4)
  }

  return {
    // Actions
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    invest,

    // State
    account,
    shortAccount,
    balance,
    isConnected,
    isCorrectNetwork,
    isReady,
    hasMetaMask,
    error,

    // Utils
    getTransactionUrl,
    getAddressLink,
    formatAddress,
    validateAmount,
    calculateReturn,
  }
}

