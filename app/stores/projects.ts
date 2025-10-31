import { defineStore } from 'pinia'
import type { ApiProject, ContractData } from '~/types/project'
import { DEMO_PROJECTS } from '~/config/demo-projects'

interface ProjectsState {
  projects: ApiProject[]
  contractData: Map<string, ContractData>
  lastFetchTime: number | null
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    contractData: new Map(),
    lastFetchTime: null,
  }),

  getters: {
    /**
     * 根據 id 取得專案
     * 支援 _id 或 id 欄位的比對
     */
    getProjectById: (state) => {
      return (id: string): ApiProject | undefined => {
        return state.projects.find(p => {
          const pAny = p as any
          const projectId = pAny.id || p._id
          return projectId === id || p._id === id
        })
      }
    },

    /**
     * 根據合約地址取得專案
     */
    getProjectByContractAddress: (state) => {
      return (address: string): ApiProject | undefined => {
        return state.projects.find(p => p.contract_address?.toLowerCase() === address.toLowerCase())
      }
    },

    /**
     * 取得所有專案
     */
    getAllProjects: (state) => {
      return state.projects
    },

    /**
     * 取得指定合約的鏈上資料
     */
    getContractData: (state) => {
      return (address: string): ContractData | undefined => {
        return state.contractData.get(address.toLowerCase())
      }
    },
  },

  actions: {
    /**
     * 設定專案列表
     */
    setProjects(projects: ApiProject[]) {
      this.projects = projects
      this.lastFetchTime = Date.now()
    },

    /**
     * 新增單一專案
     */
    addProject(project: ApiProject) {
      const existingIndex = this.projects.findIndex(p => p._id === project._id)
      if (existingIndex >= 0) {
        this.projects[existingIndex] = project
      } else {
        this.projects.push(project)
      }
    },

    /**
     * 從 API 取得專案列表並存入 store
     */
    async fetchProjects() {
      try {
        console.log('[Projects Store] 開始從 API 載入專案列表...')
        
        const { data, error } = await useFetch<ApiProject[]>('https://rwa-backend.vercel.app/api/getProjects', {
          server: false, // 只在客戶端執行
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (error.value) {
          console.error('[Projects Store] API 錯誤:', error.value)
          throw new Error(`API 請求失敗: ${error.value.message}`)
        }

        if (data.value) {
          // 顯示原始 API 響應（用於調試）
          console.log('[Projects Store] 📦 API 原始響應:', JSON.stringify(data.value, null, 2))
          
          // 處理可能的不同響應格式
          let projectsArray: ApiProject[] = []
          
          if (Array.isArray(data.value)) {
            projectsArray = data.value
            console.log('[Projects Store] ✅ 數據格式：直接數組')
          } else if (typeof data.value === 'object' && data.value !== null) {
            // 如果是對象，嘗試從常見的字段中提取數組
            const dataObj = data.value as Record<string, any>
            console.log('[Projects Store] 📋 數據格式：對象，可用的鍵:', Object.keys(dataObj))
            
            if ('data' in dataObj && Array.isArray(dataObj.data)) {
              projectsArray = dataObj.data
              console.log('[Projects Store] ✅ 從 data 字段提取數組')
            } else if ('projects' in dataObj && Array.isArray(dataObj.projects)) {
              projectsArray = dataObj.projects
              console.log('[Projects Store] ✅ 從 projects 字段提取數組')
            } else if ('items' in dataObj && Array.isArray(dataObj.items)) {
              projectsArray = dataObj.items
              console.log('[Projects Store] ✅ 從 items 字段提取數組')
            } else {
              console.error('[Projects Store] ❌ 無法識別的數據格式')
              console.error('[Projects Store] 完整數據:', dataObj)
            }
          }
          
          if (projectsArray.length > 0) {
            console.log('[Projects Store] 成功載入專案，數量:', projectsArray.length)
            console.log('[Projects Store] 第一個專案的字段:', projectsArray[0] ? Object.keys(projectsArray[0]) : '無')
            console.log('[Projects Store] 第一個專案的內容:', projectsArray[0])
            this.setProjects(projectsArray)
          } else {
            console.warn('[Projects Store] ⚠️ API 返回空數組或無法解析數據')
          }
        } else {
          console.warn('[Projects Store] API 返回空數據')
        }
      } catch (error: any) {
        console.error('[Projects Store] 取得專案列表失敗:', error)
        console.warn('[Projects Store] 使用 Demo 數據作為備用')
        
        // 使用 demo 數據作為備用
        this.setProjects(DEMO_PROJECTS)
        
        // 不拋出錯誤，讓流程繼續
        // throw error
      }
    },

    /**
     * 設定合約資料
     */
    setContractData(contractAddress: string, data: ContractData) {
      this.contractData.set(contractAddress.toLowerCase(), data)
    },

    /**
     * 從智能合約讀取資料（需要在 composable 中實作具體讀取邏輯）
     * 此方法負責更新 store 中的合約資料
     */
    async fetchContractData(contractAddress: string) {
      // 這個方法會被 useContractData composable 呼叫
      // 實際的合約讀取邏輯在 composable 中實作
      return this.getContractData(contractAddress)
    },
  },
})


