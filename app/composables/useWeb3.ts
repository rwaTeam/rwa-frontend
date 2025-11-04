import { ref, computed, shallowRef } from 'vue'
import { ethers } from 'ethers'
import { CONTRACT_CONFIG, getTxUrl, getAddressUrl, shortenAddress } from '~/config/contract'

// 全域狀態（在所有組件間共享）
// ✅ 使用 shallowRef 來避免深度響應式代理，防止破壞 ethers.js 類實例
const provider = shallowRef<ethers.BrowserProvider | null>(null)
const signer = shallowRef<ethers.Signer | null>(null)
const account = ref<string>('')
const chainId = ref<number>(0)
const balance = ref<string>('0')
const tokenBalance = ref<string>('0')
const isInitialized = ref(false)
const isConnecting = ref(false)
const error = ref<string>('')

// 全局初始化 Promise，避免重複初始化
let initializationPromise: Promise<boolean> | null = null

export const useWeb3 = () => {
  const config = useRuntimeConfig()
  
  // 計算屬性
  const isConnected = computed(() => !!account.value && !!provider.value)
  const shortAccount = computed(() => {
    if (!account.value) return ''
    return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`
  })
  const shortAddress = computed(() => shortAccount.value) // 保留兼容性
  const isCorrectNetwork = computed(() => chainId.value === CONTRACT_CONFIG.CHAIN_ID)
  const hasMetaMask = computed(() => {
    if (typeof window === 'undefined') return false
    return typeof window.ethereum !== 'undefined'
  })

  // ============================================
  // 1. 檢查 MetaMask 是否安裝
  // ============================================
  const checkMetaMaskInstalled = (): boolean => {
    if (typeof window === 'undefined') {
      error.value = '請在瀏覽器環境中使用'
      return false
    }

    if (!window.ethereum) {
      error.value = '請安裝 MetaMask 錢包擴充功能'
      return false
    }

    return true
  }

  // ============================================
  // 1.1 動態獲取 Signer（按需獲取，避免狀態問題）
  // ============================================
  const getSignerSafely = async (): Promise<ethers.Signer> => {
    if (!provider.value) {
      throw new Error('Provider 未初始化')
    }
    
    if (!account.value) {
      throw new Error('帳戶未連接')
    }

    try {
      // 每次都重新獲取 signer，確保狀態新鮮
      const currentSigner = await provider.value.getSigner(account.value)
      return currentSigner
    } catch (err) {
      console.error('獲取 Signer 失敗:', err)
      throw new Error('無法獲取簽名者，請重新連接錢包')
    }
  }

  // ============================================
  // 2. 初始化 Provider（被動連接）
  // ============================================
  const initializeProvider = async () => {
    // 🔥 如果正在初始化，返回現有的 Promise
    if (initializationPromise) {
      console.log('⏳ Provider 正在初始化中，等待完成...')
      return initializationPromise
    }

    // 🔥 如果已經初始化且 provider 存在，直接返回
    if (isInitialized.value && provider.value) {
      console.log('✅ Provider 已經初始化，跳過重複初始化')
      return true
    }
    // 🔥 創建新的初始化 Promise
    initializationPromise = (async () => {
      try {
        if (!checkMetaMaskInstalled()) return false

        // 完全清除舊的 provider 引用
        if (provider.value) {
          console.log('🔄 清除舊的 Provider 實例...')
          provider.value = null
          isInitialized.value = false
          await new Promise(resolve => setTimeout(resolve, 50))
        }

        console.log('🚀 開始創建新的 Provider...')
        
        // 創建只讀 Provider（不需要用戶授權）
        const newProvider = new ethers.BrowserProvider(window.ethereum)
        
        // 獲取網路資訊
        const network = await newProvider.getNetwork()
        
        // 只有在成功後才賦值
        provider.value = newProvider
        chainId.value = Number(network.chainId)
        isInitialized.value = true
        
        console.log('✅ Provider 初始化成功')
        console.log(`   網路: ${network.name} (chainId: ${chainId.value})`)
        
        return true
      } catch (err: any) {
        console.error('❌ Provider 初始化失敗:', err)
        error.value = err.message
        provider.value = null
        isInitialized.value = false
        return false
      } finally {
        // 🔥 清除 Promise 引用，允許下次重試
        initializationPromise = null
      }
    })()

    return initializationPromise
  }

  // ============================================
  // 3. 連接錢包（需要用戶授權）
  // ============================================
  const connectWallet = async () => {
    try {
      if (!checkMetaMaskInstalled()) {
        return { success: false, error: error.value }
      }

      isConnecting.value = true
      error.value = ''

      console.log('🔐 請求連接錢包...')
      
      // 直接使用 window.ethereum.request 來請求帳戶，避免 provider 狀態問題
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('未獲取到帳戶')
      }

      account.value = accounts[0]
      console.log('✅ 帳戶已連接:', account.value)

      // 強制清除舊的 provider 實例並創建新的
      console.log('🔄 創建新的 Provider 實例...')
      provider.value = null
      isInitialized.value = false
      
      // 等待一下確保舊實例完全釋放
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 創建全新的 Provider 實例
      const newProvider = new ethers.BrowserProvider(window.ethereum)
      const network = await newProvider.getNetwork()
      
      provider.value = newProvider
      chainId.value = Number(network.chainId)
      isInitialized.value = true
      
      console.log('✅ Provider 重新初始化完成')

      // 暫時不獲取 Signer，避免狀態問題
      // Signer 將在實際需要簽署交易時動態獲取
      signer.value = null
      console.log('✅ 連接成功，Signer 將在需要時動態獲取')

      // 獲取 ETH 餘額和 TWDT 餘額
      await Promise.all([updateBalance(), updateTokenBalance()])

      // 設置事件監聽器
      setupEventListeners()

      return { 
        success: true, 
        account: account.value,
        chainId: chainId.value 
      }
    } catch (err: any) {
      console.error('❌ 連接錢包失敗:', err)
      
      // 處理用戶拒絕連接
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        error.value = '用戶拒絕連接錢包'
      } else {
        error.value = err.message
      }
      
      return { success: false, error: error.value }
    } finally {
      isConnecting.value = false
    }
  }

  // ============================================
  // 4. 更新 ETH 餘額
  // ============================================
  const updateBalance = async () => {
    try {
      if (!provider.value || !account.value) return

      const balanceWei = await provider.value.getBalance(account.value)
      balance.value = ethers.formatEther(balanceWei)
      
      console.log(`💰 ETH 餘額: ${balance.value}`)
    } catch (err) {
      console.error('獲取餘額失敗:', err)
    }
  }

  // ============================================
  // 4.1 更新 TWDT Token 餘額
  // ============================================
  const updateTokenBalance = async () => {
    try {
      if (!provider.value || !account.value) return

      // 導入 ERC20 ABI
      const ERC20_ABI = await import('~/config/abi/erc20.json')
      const tokenContract = new ethers.Contract(
        CONTRACT_CONFIG.TWDT_TOKEN_ADDRESS,
        ERC20_ABI.default || ERC20_ABI,
        provider.value
      )

      // ✅ 動態獲取 token 的實際 decimals
      const decimals = await (tokenContract as any).decimals()
      console.log(`🔍 TWDT Token decimals: ${decimals}`)
      
      const rawBalance = await (tokenContract as any).balanceOf(account.value)
      console.log(`🔍 TWDT 原始餘額 (raw): ${rawBalance.toString()}`)
      
      // ✅ 使用實際的 decimals 來格式化餘額
      tokenBalance.value = ethers.formatUnits(rawBalance, decimals)
      
      console.log(`💰 TWDT 餘額: ${tokenBalance.value}`)
    } catch (err) {
      console.error('獲取 TWDT 餘額失敗:', err)
      tokenBalance.value = '0'
    }
  }

  // ============================================
  // 5. 斷開連接
  // ============================================
  const disconnectWallet = () => {
    account.value = ''
    signer.value = null
    balance.value = '0'
    tokenBalance.value = '0'
    error.value = ''
    
    // 移除事件監聽器
    removeEventListeners()
    
    console.log('👋 錢包已斷開連接')
  }

  // ============================================
  // 6. 切換到 Sepolia 網路
  // ============================================
  const switchToSepolia = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask 未安裝')
      }

      const targetChainId = CONTRACT_CONFIG.CHAIN_ID
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })

      console.log(`✅ 已切換到 Sepolia 網路`)
      return { success: true }
    } catch (err: any) {
      // 錯誤碼 4902 表示該網路未添加到 MetaMask
      if (err.code === 4902) {
        console.log('Sepolia 網路未添加，嘗試添加...')
        return await addNetwork(CONTRACT_CONFIG.CHAIN_ID)
      }
      
      console.error('切換網路失敗:', err)
      return { success: false, error: err.message }
    }
  }

  // ============================================
  // 6.1 切換網路（通用方法）
  // ============================================
  const switchNetwork = async (targetChainId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask 未安裝')
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })

      console.log(`✅ 已切換到網路: ${targetChainId}`)
      return { success: true }
    } catch (err: any) {
      // 錯誤碼 4902 表示該網路未添加到 MetaMask
      if (err.code === 4902) {
        console.log('該網路未添加，嘗試添加...')
        return await addNetwork(targetChainId)
      }
      
      console.error('切換網路失敗:', err)
      return { success: false, error: err.message }
    }
  }

  // ============================================
  // 7. 添加自定義網路
  // ============================================
  const addNetwork = async (targetChainId: number) => {
    try {
      // 這裡可以根據 chainId 設置不同網路的參數
      const networkParams = getNetworkParams(targetChainId)
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
      })

      return { success: true }
    } catch (err: any) {
      console.error('添加網路失敗:', err)
      return { success: false, error: err.message }
    }
  }

  // 獲取網路參數
  const getNetworkParams = (chainId: number) => {
    const networks: Record<number, any> = {
      // Sepolia 測試網
      11155111: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: {
          name: 'Sepolia ETH',
          symbol: 'SepoliaETH',
          decimals: 18
        },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      },
      // 可以添加更多網路...
    }

    return networks[chainId] || null
  }

  // ============================================
  // 8. 事件監聽器
  // ============================================
  const setupEventListeners = () => {
    if (!window.ethereum) return

    // 監聽帳戶切換
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    
    // 監聽網路切換
    window.ethereum.on('chainChanged', handleChainChanged)
    
    // 監聽斷開連接
    window.ethereum.on('disconnect', handleDisconnect)

    console.log('👂 事件監聽器已設置')
  }

  const removeEventListeners = () => {
    if (!window.ethereum) return

    window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    window.ethereum.removeListener('chainChanged', handleChainChanged)
    window.ethereum.removeListener('disconnect', handleDisconnect)
  }

  // 處理帳戶切換
  const handleAccountsChanged = async (accounts: string[]) => {
    console.log('🔄 帳戶已切換:', accounts)
    
    if (accounts.length === 0) {
      // 用戶斷開了所有帳戶
      disconnectWallet()
    } else {
      // 用戶切換到新帳戶
      account.value = accounts[0] || ''
      await Promise.all([updateBalance(), updateTokenBalance()])
    }
  }

  // 處理網路切換
  const handleChainChanged = (newChainId: string) => {
    console.log('🔄 網路已切換:', newChainId)
    // 建議重新載入頁面以確保狀態一致
    window.location.reload()
  }

  // 處理斷開連接
  const handleDisconnect = () => {
    console.log('👋 錢包已斷開')
    disconnectWallet()
  }

  // ============================================
  // 9. 檢查是否已連接（自動重連）
  // ============================================
  const checkConnection = async () => {
    try {
      if (!window.ethereum) return false

      // 初始化 Provider
      await initializeProvider()

      // 檢查是否有已授權的帳戶
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      })

      if (accounts && accounts.length > 0) {
        // 已有授權，自動連接
        account.value = accounts[0]
        signer.value = null // 延遲獲取 signer，避免狀態問題
        await Promise.all([updateBalance(), updateTokenBalance()])
        setupEventListeners()
        
        console.log('✅ 自動重連成功:', account.value)
        return true
      }

      return false
    } catch (err) {
      console.error('檢查連接失敗:', err)
      return false
    }
  }

  // ============================================
  // 10. 業務方法：驗證金額
  // ============================================
  const validateAmount = (amount: string, minInvestment: number) => {
    const numAmount = parseFloat(amount)
    
    if (!amount || isNaN(numAmount)) {
      return { valid: false, error: '請輸入有效的金額' }
    }
    
    if (numAmount <= 0) {
      return { valid: false, error: '金額必須大於 0' }
    }
    
    if (numAmount < minInvestment) {
      return { valid: false, error: `最低投資額為 ${minInvestment} TWDT` }
    }
    
    // 檢查 TWDT 餘額
    const tokenBal = parseFloat(tokenBalance.value)
    if (numAmount > tokenBal) {
      return { valid: false, error: `TWDT 餘額不足（當前餘額：${tokenBal.toFixed(2)}）` }
    }
    
    return { valid: true }
  }

  // ============================================
  // 11. 業務方法：計算預期回報
  // ============================================
  const calculateReturn = (amount: string, roi: number) => {
    try {
      const numAmount = parseFloat(amount)
      if (isNaN(numAmount)) return '0.0000'
      
      const returnAmount = numAmount * (1 + roi / 100)
      return returnAmount.toFixed(4)
    } catch {
      return '0.0000'
    }
  }

  // ============================================
  // 12. 業務方法：投資專案
  // ============================================
  const invest = async (projectId: string, nftQuantity: number, nftPrice: number, contractAddress: string) => {
    try {
      if (!isConnected.value) {
        throw new Error('請先連接錢包')
      }

      if (!isCorrectNetwork.value) {
        throw new Error('請切換到 Sepolia 測試網')
      }

      if (isNaN(nftQuantity) || nftQuantity <= 0) {
        throw new Error('請輸入有效的 NFT 數量')
      }

      // 計算總 TWDT 金額
      const totalTwdtAmount = nftQuantity * nftPrice

      console.log(`🎯 開始投資流程：專案 ${projectId}，購買 ${nftQuantity} 份 NFT，總金額 ${totalTwdtAmount} TWDT`)

      // 動態獲取 Signer
      const currentSigner = await getSignerSafely()

      // 1. 導入 ABI
      const [ERC20_ABI, SafeHarvestNFT_ABI] = await Promise.all([
        import('~/config/abi/erc20.json'),
        import('~/config/SafeHarvestNFT_ABI.json')
      ])

      // 2. 創建合約實例
      const tokenContract = new ethers.Contract(
        CONTRACT_CONFIG.TWDT_TOKEN_ADDRESS,
        ERC20_ABI.default || ERC20_ABI,
        currentSigner
      )

      const projectContract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI.default || SafeHarvestNFT_ABI,
        currentSigner
      )

      // 3. 動態獲取 TWDT token 的 decimals 並轉換金額
      const decimals = await (tokenContract as any).decimals()
      console.log(`🔍 TWDT Token decimals: ${decimals}`)
      const totalAmountInWei = ethers.parseUnits(totalTwdtAmount.toString(), decimals)

      // 4. 檢查 TWDT 餘額
      const balance = await (tokenContract as any).balanceOf(account.value)
      if (balance < totalAmountInWei) {
        throw new Error('TWDT 餘額不足')
      }

      // 5. 檢查並 approve TWDT
      const allowance = await (tokenContract as any).allowance(account.value, contractAddress)
      if (allowance < totalAmountInWei) {
        console.log('📝 授權 TWDT 給專案合約...')
        const approveTx = await (tokenContract as any).approve(contractAddress, totalAmountInWei)
        await approveTx.wait()
        console.log('✅ TWDT 授權成功')
      }

      // 6. 調用 buyNFT，傳入 NFT 數量（不是金額）
      console.log(`🛒 購買 ${nftQuantity} 份 NFT...`)
      const buyTx = await (projectContract as any).buyNFT(nftQuantity)
      const receipt = await buyTx.wait()
      
      console.log('✅ 投資成功！交易哈希:', buyTx.hash)

      // 7. 更新餘額
      await Promise.all([updateBalance(), updateTokenBalance()])

      return {
        success: true,
        txHash: buyTx.hash,
        receipt
      }
    } catch (error: any) {
      console.error('❌ 投資失敗:', error)
      
      // 處理用戶拒絕交易
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return { success: false, error: '交易已被拒絕' }
      }
      
      return { 
        success: false, 
        error: error.message || '投資失敗，請重試'
      }
    }
  }

  // ============================================
  // 13. 業務方法：提領收益
  // ============================================
  const withdraw = async (contractAddress: string) => {
    try {
      if (!isConnected.value) {
        throw new Error('請先連接錢包')
      }

      if (!isCorrectNetwork.value) {
        throw new Error('請切換到 Sepolia 測試網')
      }

      console.log(`💰 開始提領流程：合約 ${contractAddress}`)

      // 動態獲取 Signer
      const currentSigner = await getSignerSafely()

      // 1. 導入 ABI
      const SafeHarvestNFT_ABI = await import('~/config/SafeHarvestNFT_ABI.json')

      // 2. 創建合約實例
      const projectContract = new ethers.Contract(
        contractAddress,
        SafeHarvestNFT_ABI.default || SafeHarvestNFT_ABI,
        currentSigner
      )

      // 3. 調用 claimReward
      console.log('📤 領取獎勵...')
      const claimTx = await (projectContract as any).claimReward()
      const receipt = await claimTx.wait()
      
      console.log('✅ 提領成功！交易哈希:', claimTx.hash)

      // 4. 更新餘額
      await Promise.all([updateBalance(), updateTokenBalance()])

      return {
        success: true,
        txHash: claimTx.hash,
        receipt
      }
    } catch (error: any) {
      console.error('❌ 提領失敗:', error)
      
      // 處理用戶拒絕交易
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return { success: false, error: '交易已被拒絕' }
      }
      
      return { 
        success: false, 
        error: error.message || '提領失敗，請重試'
      }
    }
  }

  // ============================================
  // 14. 輔助方法：獲取交易 URL
  // ============================================
  const getTransactionUrl = (txHash: string) => {
    return getTxUrl(txHash)
  }

  // ============================================
  // 15. 輔助方法：獲取地址 URL
  // ============================================
  const getAddressLink = (address: string) => {
    return getAddressUrl(address)
  }

  // ============================================
  // 16. 輔助方法：格式化地址
  // ============================================
  const formatAddress = (address: string, chars = 4) => {
    return shortenAddress(address, chars)
  }
  // ============================================
  // 返回所有方法和狀態
  // ============================================
  return {
    // 狀態
    provider: readonly(provider),
    signer: readonly(signer),
    account: readonly(account),
    chainId: readonly(chainId),
    balance: readonly(balance),
    tokenBalance: readonly(tokenBalance),
    isConnected,
    isCorrectNetwork,
    hasMetaMask,
    isInitialized: readonly(isInitialized),
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    shortAccount,
    shortAddress, // 保留兼容性

    // 基礎方法
    initializeProvider,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    switchToSepolia,
    updateBalance,
    updateTokenBalance,
    checkConnection,

    // 業務方法
    invest,
    withdraw,
    validateAmount,
    calculateReturn,

    // 輔助方法
    getTransactionUrl,
    getAddressLink,
    formatAddress,
  }
}