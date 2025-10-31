import { ethers } from 'ethers'
import { CONTRACT_CONFIG } from '~/config/contract'
import type { ContractData } from '~/types/project'
import { useProjectsStore } from '~/stores/projects'

/**
 * 合約資料讀取 Composable
 * 提供讀取智能合約資料的功能
 */
export function useContractData() {
  const projectsStore = useProjectsStore()

  /**
   * 取得 Provider（用於讀取合約資料）
   */
  const getProvider = () => {
    // 如果瀏覽器環境且有 MetaMask，優先使用 BrowserProvider
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    }
    
    // 否則使用 JsonRpcProvider（需要 RPC URL）
    // 注意：這裡使用 Sepolia 的公開 RPC，生產環境建議使用自己的 RPC 節點
    const rpcUrl = CONTRACT_CONFIG.RPC_URL || 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    return new ethers.JsonRpcProvider(rpcUrl)
  }

  /**
   * 讀取合約餘額（ETH）
   */
  const getContractBalance = async (address: string): Promise<string> => {
    try {
      if (!address || address === '待分配') {
        return '0'
      }

      const provider = getProvider()
      const balance = await provider.getBalance(address)
      const balanceInEth = ethers.formatEther(balance)
      return balanceInEth
    } catch (error) {
      console.error(`讀取合約餘額失敗 (${address}):`, error)
      return '0'
    }
  }

  /**
   * 讀取合約交易數量
   */
  const getTransactionCount = async (address: string): Promise<number> => {
    try {
      if (!address || address === '待分配') {
        return 0
      }

      const provider = getProvider()
      const count = await provider.getTransactionCount(address, 'latest')
      return count
    } catch (error) {
      console.error(`讀取交易數量失敗 (${address}):`, error)
      return 0
    }
  }

  /**
   * 讀取合約的存款金額（如果合約有 getDeposit 方法）
   */
  const getDepositAmount = async (contractAddress: string): Promise<string | undefined> => {
    try {
      if (!contractAddress || contractAddress === '待分配') {
        return undefined
      }

      // 嘗試讀取合約的 getDeposit 方法
      // 注意：這需要合約實例和 ABI，目前 ABI 中確實有 getDeposit 方法
      const provider = getProvider()
      const ABI = await import('~/config/ABI.json')
      const contract = new ethers.Contract(contractAddress, ABI.default || ABI, provider)
      
      try {
        const deposit = await contract.getDeposit()
        return ethers.formatEther(deposit)
      } catch {
        // 如果合約沒有這個方法或方法不存在，返回 undefined
        return undefined
      }
    } catch (error) {
      console.error(`讀取存款金額失敗 (${contractAddress}):`, error)
      return undefined
    }
  }

  /**
   * 讀取合約的完整資料
   */
  const fetchContractData = async (contractAddress: string): Promise<ContractData | null> => {
    try {
      if (!contractAddress || contractAddress === '待分配') {
        return null
      }

      // 檢查是否已有快取的資料
      const cached = projectsStore.getContractData(contractAddress)
      if (cached) {
        return cached
      }

      // 並行讀取多個資料
      const [balance, transactionCount, depositAmount] = await Promise.all([
        getContractBalance(contractAddress),
        getTransactionCount(contractAddress),
        getDepositAmount(contractAddress),
      ])

      const contractData: ContractData = {
        balance,
        depositAmount,
        transactionCount,
      }

      // 存入 store
      projectsStore.setContractData(contractAddress, contractData)

      return contractData
    } catch (error) {
      console.error(`讀取合約資料失敗 (${contractAddress}):`, error)
      return null
    }
  }

  /**
   * 格式化合約資料為頁面所需格式
   */
  const formatContractData = (contractData: ContractData | null) => {
    if (!contractData) {
      return {
        balance: '0',
        depositAmount: undefined,
        transactionCount: 0,
      }
    }

    return {
      balance: parseFloat(contractData.balance).toFixed(4),
      depositAmount: contractData.depositAmount ? parseFloat(contractData.depositAmount).toFixed(4) : undefined,
      transactionCount: contractData.transactionCount,
    }
  }

  return {
    getContractBalance,
    getTransactionCount,
    getDepositAmount,
    fetchContractData,
    formatContractData,
  }
}


