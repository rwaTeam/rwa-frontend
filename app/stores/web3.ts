import { defineStore } from 'pinia'
import { CONTRACT_CONFIG, SEPOLIA_NETWORK_PARAMS } from '~/config/contract'

interface Web3State {
  isConnected: boolean
  account: string | null
  chainId: number | null
  balance: string
  provider: any | null  // 改用 any 避免類型問題
  signer: any | null
  contract: any | null
  isCorrectNetwork: boolean
  error: string | null
  hasMetaMask: boolean
}

export const useWeb3Store = defineStore('web3', {
  state: (): Web3State => ({
    isConnected: false,
    account: null,
    chainId: null,
    balance: '0',
    provider: null,
    signer: null,
    contract: null,
    isCorrectNetwork: false,
    error: null,
    hasMetaMask: false,
  }),

  getters: {
    // 格式化帳戶地址
    shortAccount: (state) => {
      if (!state.account) return ''
      return `${state.account.substring(0, 6)}...${state.account.substring(state.account.length - 4)}`
    },

    // 格式化餘額
    formattedBalance: (state) => {
      try {
        return parseFloat(state.balance).toFixed(4)
      } catch {
        return '0.0000'
      }
    },
  },

  actions: {
    // 檢測 MetaMask（在客戶端執行）
    checkMetaMask() {
      if (typeof window !== 'undefined') {
        this.hasMetaMask = typeof window.ethereum !== 'undefined'
      }
    },

    // 重置 state（避免緩存問題）
    resetState() {
      this.isConnected = false
      this.account = null
      this.chainId = null
      this.balance = '0'
      this.provider = null
      this.signer = null
      this.contract = null
      this.isCorrectNetwork = false
      this.error = null
    },

    // 連接錢包
    async connectWallet() {
      this.error = null
      
      // 先完全清除舊狀態
      this.isConnected = false
      this.account = null
      this.chainId = null
      this.balance = '0'
      this.provider = null
      this.signer = null
      this.contract = null
      this.isCorrectNetwork = false
      
      // 再次檢測 MetaMask
      this.checkMetaMask()
      
      if (!this.hasMetaMask) {
        this.error = '請先安裝 MetaMask 錢包擴充功能'
        throw new Error(this.error)
      }

      try {
        // 確保 window.ethereum 已就緒
        if (!window.ethereum) {
          throw new Error('MetaMask 未正確初始化')
        }

        // 請求連接錢包
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })

        if (accounts.length === 0) {
          throw new Error('未找到帳戶')
        }

        // 設置帳戶
        this.account = accounts[0]

        // 延遲一下，確保 MetaMask 完全就緒
        await new Promise(resolve => setTimeout(resolve, 100))

        // 使用直接的 chainId 獲取網路資訊（不用 provider）
        const currentChainId = parseInt(window.ethereum.chainId, 16)
        this.chainId = currentChainId

        // 完全繞過 BrowserProvider，使用自定義包裝器
        // 創建一個最小化的 provider 對象，只包含我們需要的方法
        this.provider = {
          // 使用 window.ethereum 的 request 方法
          async getBalance(address: string) {
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [address, 'latest']
            })
            return BigInt(balance)
          },
          
          async getNetwork() {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            return {
              chainId: BigInt(chainId),
              name: 'unknown'
            }
          },
          
          // 保存原始的 ethereum 對象引用
          _ethereum: window.ethereum
        }
        
        // 創建自定義 Signer
        // 保存當前帳戶地址的引用（避免作用域問題）
        const currentAccount = this.account
        
        this.signer = {
          // 保存帳戶地址
          address: currentAccount,
          
          // 獲取地址
          async getAddress() {
            return currentAccount
          },
          
          // 發送交易
          async sendTransaction(tx: any) {
            
            // 確保 value 正確轉換為十六進制字符串
            let valueHex = '0x0'
            if (tx.value) {
              // 如果是 BigInt，直接轉換
              if (typeof tx.value === 'bigint') {
                valueHex = '0x' + tx.value.toString(16)
              }
              // 如果是數字或字符串，需要先轉換為 BigInt
              else {
                const ethers = await import('ethers')
                const valueBigInt = typeof tx.value === 'string' 
                  ? ethers.parseEther(tx.value) 
                  : BigInt(Math.floor(tx.value))
                valueHex = '0x' + valueBigInt.toString(16)
              }
            }
            
            
            const txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: currentAccount,
                to: tx.to,
                value: valueHex,
                data: tx.data || '0x'
              }]
            })
            
            return {
              hash: txHash,
              wait: async () => {
                // 等待交易確認的簡化實現
                return { transactionHash: txHash }
              }
            }
          },
          
          // 簽名訊息
          async signMessage(message: string) {
            return await window.ethereum.request({
              method: 'personal_sign',
              params: [message, currentAccount]
            })
          },
          
          // 保存原始帳戶引用
          _account: currentAccount,
          _ethereum: window.ethereum
        }

        // 檢查是否為正確網路
        this.isCorrectNetwork = this.chainId === CONTRACT_CONFIG.CHAIN_ID

        // 如果不是 Sepolia，提示切換
        if (!this.isCorrectNetwork) {
          await this.switchToSepolia()
          
          // 等待網路切換完成
          await new Promise(resolve => setTimeout(resolve, 200))
          
          // 從 ethereum 直接獲取新的 chainId
          this.chainId = parseInt(window.ethereum.chainId, 16)
          this.isCorrectNetwork = this.chainId === CONTRACT_CONFIG.CHAIN_ID
        }

        // 初始化合約實例（暫時跳過，使用直接交易）
        this.contract = null
        
        // TODO: 如果需要調用合約方法，可以在這裡初始化
        // if (this.isCorrectNetwork && this.signer) {
        //   const { Contract } = await import('ethers')
        //   this.contract = new Contract(
        //     CONTRACT_CONFIG.ADDRESS,
        //     ContractABI,
        //     this.signer
        //   )
        // }

        // 獲取餘額
        await this.updateBalance()

        this.isConnected = true

        // 監聽帳戶變化
        this.setupEventListeners()

        return this.account
      } catch (error: any) {
        console.error('連接錢包失敗:', error)
        this.error = error.message || '連接錢包失敗'
        throw error
      }
    },

    // 斷開錢包
    disconnectWallet() {
      this.isConnected = false
      this.account = null
      this.chainId = null
      this.balance = '0'
      this.provider = null
      this.signer = null
      this.contract = null
      this.isCorrectNetwork = false
      this.error = null
    },

    // 切換到 Sepolia 網路
    async switchToSepolia() {
      if (!window.ethereum) {
        throw new Error('未安裝 MetaMask')
      }

      try {
        // 嘗試切換到 Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_NETWORK_PARAMS.chainId }],
        })
        
        // 注意：切換後調用者需要重新創建 provider 和 signer
      } catch (error: any) {
        // 如果網路不存在，嘗試添加
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [SEPOLIA_NETWORK_PARAMS],
            })
            
            // 注意：添加後調用者需要重新創建 provider 和 signer
          } catch (addError) {
            console.error('添加網路失敗:', addError)
            throw new Error('無法添加 Sepolia 網路')
          }
        } else {
          console.error('切換網路失敗:', error)
          throw new Error('切換網路失敗')
        }
      }
    },

    // 更新餘額
    async updateBalance() {
      if (!this.provider || !this.account) return

      try {
        const balance = await this.provider.getBalance(this.account)
        const { formatEther } = await import('ethers')
        this.balance = formatEther(balance)
      } catch (error) {
        console.error('獲取餘額失敗:', error)
      }
    },

    // 執行投資（發送 ETH）
    async invest(projectId: string, amount: string) {
      if (!this.isConnected || !this.signer || !this.isCorrectNetwork) {
        throw new Error('請先連接錢包並切換到 Sepolia 網路')
      }

      // 確保 amount 是字符串類型
      const amountStr = String(amount)
      
      if (!amountStr || parseFloat(amountStr) <= 0) {
        throw new Error('請輸入有效的投資金額')
      }

      try {
        
        // 檢查餘額是否足夠
        const { parseEther } = await import('ethers')
        const amountInWei = parseEther(amountStr)
        
        const balance = await this.provider!.getBalance(this.account!)
        
        if (balance < amountInWei) {
          throw new Error('餘額不足')
        }

        // 發送交易（直接發送 ETH 到合約地址）
        // 注意：根據實際合約邏輯，可能需要調用特定的合約方法
        const tx = await this.signer.sendTransaction({
          to: CONTRACT_CONFIG.ADDRESS,
          value: amountInWei,
        })

        console.log('交易已發送:', tx.hash)

        // 等待交易確認
        const receipt = await tx.wait()
        
        console.log('交易已確認:', receipt)

        // 更新餘額
        await this.updateBalance()

        return {
          txHash: tx.hash,
          receipt,
        }
      } catch (error: any) {
        console.error('投資失敗:', error)
        
        // 處理用戶拒絕交易
        if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
          throw new Error('交易已被拒絕')
        }
        
        throw new Error(error.message || '投資失敗')
      }
    },

    // 使用合約方法執行投資
    async investWithContract(projectId: string, amount: string) {
      if (!this.contract || !this.isCorrectNetwork) {
        throw new Error('合約未初始化或網路錯誤')
      }

      try {
        const { parseEther } = await import('ethers')
        const amountInWei = parseEther(amount)
        
        // 使用合約的 execute 方法
        // 注意：需要根據實際合約 ABI 調整參數
        const tx = await this.contract.execute(
          {
            target: CONTRACT_CONFIG.ADDRESS,
            value: amountInWei,
            callData: '0x',
          },
          { value: amountInWei }
        )

        const receipt = await tx.wait()
        await this.updateBalance()

        return {
          txHash: tx.hash,
          receipt,
        }
      } catch (error: any) {
        console.error('使用合約投資失敗:', error)
        throw new Error(error.message || '投資失敗')
      }
    },

    // 提領收益
    async withdraw(contractAddress: string, amount: string) {
      if (!this.isConnected || !this.signer || !this.isCorrectNetwork) {
        throw new Error('請先連接錢包並切換到 Sepolia 網路')
      }

      if (!contractAddress || !amount || parseFloat(amount) <= 0) {
        throw new Error('請提供有效的合約地址和提領金額')
      }

      try {
        const { parseEther, Contract } = await import('ethers')
        const ABI = await import('~/config/ABI.json')
        
        const amountInWei = parseEther(amount)
        
        // 創建合約實例
        // ABI.json 是數組格式，直接使用
        const contract = new Contract(contractAddress, ABI.default || ABI, this.signer)
        
        // 調用 withdrawDeposit 方法
        // 根據 ABI，withdrawDeposit 需要 _withdrawAddress 和 _withdrawAmount
        const tx = await contract.withdrawDeposit(
          this.account, // 提領地址
          amountInWei   // 提領金額
        )

        console.log('提領交易已發送:', tx.hash)

        // 等待交易確認
        const receipt = await tx.wait()
        
        console.log('提領交易已確認:', receipt)

        // 更新餘額
        await this.updateBalance()

        return {
          txHash: tx.hash,
          receipt,
        }
      } catch (error: any) {
        console.error('提領失敗:', error)
        
        // 處理用戶拒絕交易
        if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
          throw new Error('交易已被拒絕')
        }
        
        throw new Error(error.message || '提領失敗')
      }
    },

    // 設置事件監聽器
    setupEventListeners() {
      if (!window.ethereum) return

      // 監聽帳戶變化
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnectWallet()
        } else {
          this.account = accounts[0] || null
          this.updateBalance()
        }
      })

      // 監聽網路變化
      window.ethereum.on('chainChanged', (chainId: string) => {
        this.chainId = parseInt(chainId, 16)
        this.isCorrectNetwork = this.chainId === CONTRACT_CONFIG.CHAIN_ID
        
        // 網路變化時重新載入頁面
        window.location.reload()
      })
    },
  },
})

// 擴展 Window 介面以支持 ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

