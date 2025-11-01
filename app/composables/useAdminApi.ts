import type { PendingProject, ApprovalFormData, OnChainProjectData, ApiProject } from '~/types/project'

/**
 * 管理員 API Composable
 * 提供專案審核、上鏈部署、狀態查詢等功能
 */

const API_BASE_URL = 'https://rwa-backend.vercel.app'

interface ApiResponse<T> {
  ok: boolean
  data?: T
  message?: string
  error?: string
}

export function useAdminApi() {
  /**
   * 取得所有待審核專案
   */
  const fetchPendingProjects = async (): Promise<PendingProject[]> => {
    try {
      console.log('[Admin API] 開始取得待審核專案...')
      
      const response = await fetch(`${API_BASE_URL}/api/projects/pending`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP 錯誤！狀態：${response.status}`)
      }

      const result = await response.json()
      console.log('[Admin API] 待審核專案回應:', result)

      // 處理不同的回應格式
      if (Array.isArray(result)) {
        return result
      } else if (result.data && Array.isArray(result.data)) {
        return result.data
      } else if (result.projects && Array.isArray(result.projects)) {
        return result.projects
      }

      return []
    } catch (error) {
      console.error('[Admin API] 取得待審核專案失敗:', error)
      throw error
    }
  }

  /**
   * 審核專案並上鏈部署
   */
  const approveProject = async (formData: ApprovalFormData): Promise<ApiResponse<any>> => {
    try {
      console.log('[Admin API] 開始審核專案:', formData)

      const response = await fetch(`${API_BASE_URL}/api/projects/approve`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: formData.projectId,
          action: formData.action,
          totalNFTs: formData.totalNFTs,
          nftPrice: formData.nftPrice,
          farmerAddress: formData.farmerAddress,
          investorShare: formData.investorShare,
          interestRate: formData.interestRate,
          premiumRate: formData.premiumRate,
          reviewNote: formData.reviewNote,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || '審核請求失敗')
      }

      console.log('[Admin API] 審核成功:', result)
      return {
        ok: true,
        data: result,
        message: result.message || '審核成功',
      }
    } catch (error: any) {
      console.error('[Admin API] 審核專案失敗:', error)
      return {
        ok: false,
        error: error.message || '審核失敗',
      }
    }
  }

  /**
   * 拒絕專案
   */
  const rejectProject = async (projectId: string, reason?: string): Promise<ApiResponse<any>> => {
    try {
      console.log('[Admin API] 開始拒絕專案:', projectId)

      const response = await fetch(`${API_BASE_URL}/api/projects/approve`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          action: 'reject',
          reviewNote: reason || '不符合審核標準',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || '拒絕請求失敗')
      }

      console.log('[Admin API] 拒絕成功:', result)
      return {
        ok: true,
        data: result,
        message: result.message || '已拒絕專案',
      }
    } catch (error: any) {
      console.error('[Admin API] 拒絕專案失敗:', error)
      return {
        ok: false,
        error: error.message || '拒絕失敗',
      }
    }
  }

  /**
   * 查詢專案鏈上資料
   */
  const fetchProjectOnChainData = async (contractAddress: string): Promise<OnChainProjectData | null> => {
    try {
      console.log('[Admin API] 開始查詢鏈上資料:', contractAddress)

      const response = await fetch(
        `${API_BASE_URL}/api/con/project/data?projectAddress=${contractAddress}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP 錯誤！狀態：${response.status}`)
      }

      const result = await response.json()
      console.log('[Admin API] 鏈上資料回應:', result)

      return result.data || result
    } catch (error) {
      console.error('[Admin API] 查詢鏈上資料失敗:', error)
      return null
    }
  }

  /**
   * 取得所有專案（包含已上鏈的）
   */
  const fetchAllProjects = async (): Promise<ApiProject[]> => {
    try {
      console.log('[Admin API] 開始取得所有專案...')

      const response = await fetch(`${API_BASE_URL}/api/getProjects`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP 錯誤！狀態：${response.status}`)
      }

      const result = await response.json()
      console.log('[Admin API] 所有專案回應:', result)

      // 處理不同的回應格式
      if (Array.isArray(result)) {
        return result
      } else if (result.data && Array.isArray(result.data)) {
        return result.data
      } else if (result.projects && Array.isArray(result.projects)) {
        return result.projects
      }

      return []
    } catch (error) {
      console.error('[Admin API] 取得所有專案失敗:', error)
      throw error
    }
  }

  return {
    fetchPendingProjects,
    approveProject,
    rejectProject,
    fetchProjectOnChainData,
    fetchAllProjects,
  }
}

