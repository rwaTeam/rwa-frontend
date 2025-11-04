import { ref, computed } from 'vue'
import { Contract } from 'ethers'
import SafeHarvestNFT_ABI from '~/config/SafeHarvestNFT_ABI.json'

// 擴展 Window 介面以支持 ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

/**
 * 專案進度查詢 Composable
 */
export function useProjectProgress() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 獲取專案進度資訊
   * @param contractAddress NFT 合約地址
   */
  const getProjectProgress = async (contractAddress: string) => {
    if (!contractAddress || contractAddress === '待分配') {
      console.log('[useProjectProgress] 合約地址無效:', contractAddress)
      return null
    }

    loading.value = true
    error.value = null

    try {
      // 確保有 window.ethereum
      if (typeof window === 'undefined' || !window.ethereum) {
        console.warn('[useProjectProgress] MetaMask 未安裝或未初始化')
        return null
      }

      // 使用 window.ethereum 創建 provider
      const { BrowserProvider } = await import('ethers')
      const provider = new BrowserProvider(window.ethereum)
      
      // 檢查合約地址格式
      if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        console.warn('[useProjectProgress] 合約地址格式無效:', contractAddress)
        return null
      }

      // 檢查該地址是否有合約代碼
      const code = await provider.getCode(contractAddress)
      if (code === '0x') {
        console.warn('[useProjectProgress] 該地址上沒有部署合約:', contractAddress)
        // 返回默認值而不是 null，避免頁面錯誤
        return {
          totalNFTs: 0,
          mintedNFTs: 0,
          remainingNFTs: 0,
          percentage: 0,
          status: 0,
          statusText: '合約未部署',
          isSoldOut: false,
          isOperational: false
        }
      }
      
      const contract = new Contract(
        contractAddress,
        SafeHarvestNFT_ABI,
        provider
      )

      // 同時查詢三個數據（使用 as any 避免 TypeScript 錯誤）
      const [totalNFTs, mintedNFTs, status] = await Promise.all([
        (contract as any).totalNFTs(),
        (contract as any).mintedNFTs(),
        (contract as any).status()
      ])

      const total = Number(totalNFTs)
      const minted = Number(mintedNFTs)
      const statusNum = Number(status)

      console.log('[useProjectProgress] 成功獲取進度:', {
        contractAddress,
        total,
        minted,
        status: statusNum
      })

      return {
        totalNFTs: total,
        mintedNFTs: minted,
        remainingNFTs: total - minted,
        percentage: total > 0 ? Math.round((minted / total) * 100) : 0,
        status: statusNum,
        statusText: getStatusText(statusNum),
        isSoldOut: minted >= total,
        isOperational: statusNum === 1
      }
    } catch (err: any) {
      console.error('[useProjectProgress] 獲取專案進度失敗:', {
        contractAddress,
        error: err.message,
        code: err.code
      })
      error.value = err.message || '獲取進度失敗'
      
      // 返回默認值而不是 null，避免頁面錯誤
      return {
        totalNFTs: 0,
        mintedNFTs: 0,
        remainingNFTs: 0,
        percentage: 0,
        status: 0,
        statusText: '讀取失敗',
        isSoldOut: false,
        isOperational: false
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 獲取狀態文字
   */
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return '開放投資中'
      case 2:
        return '僅允許提領收益'
      case 3:
        return '已停止'
      default:
        return '未知狀態'
    }
  }

  /**
   * 獲取狀態顏色
   */
  const getStatusColor = (status: number): string => {
    switch (status) {
      case 1:
        return 'green'
      case 2:
        return 'yellow'
      case 3:
        return 'red'
      default:
        return 'gray'
    }
  }

  return {
    loading,
    error,
    getProjectProgress,
    getStatusText,
    getStatusColor
  }
}

