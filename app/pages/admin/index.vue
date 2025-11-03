<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Header Section -->
    <div class="bg-gradient-to-br from-[#16B36D]/10 to-[#A4E2C2]/10 border-b border-[#16B36D]/20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-5xl font-bold text-[#262624] mb-4">
                平台管理中心
              </h1>
              <p class="text-xl text-[#272D27]/70 max-w-2xl">
                審核農業專案、管理鏈上部署、監控平台運作狀態（使用 TWDT 代幣）
              </p>
            </div>
            
            <!-- 統計卡片 -->
            <div class="flex gap-4">
              <div class="bg-white rounded-2xl p-4 shadow-lg min-w-[120px]">
                <p class="text-sm text-[#272D27]/60 mb-1">待審核</p>
                <p class="text-3xl font-bold text-[#FDBA45]">
                  {{ pendingCount }}
                </p>
              </div>
              <div class="bg-white rounded-2xl p-4 shadow-lg min-w-[120px]">
                <p class="text-sm text-[#272D27]/60 mb-1">已上鏈</p>
                <p class="text-3xl font-bold text-[#16B36D]">
                  {{ deployedCount }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <!-- Tab Navigation -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: 100 } }"
        class="mb-8"
      >
        <div class="bg-white rounded-2xl p-2 shadow-lg inline-flex gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300',
              activeTab === tab.id
                ? 'bg-[#16B36D] text-white shadow-md'
                : 'text-[#272D27]/70 hover:bg-[#16B36D]/5'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4 inline-block mr-2" />
            {{ tab.label }}
            <Badge
              v-if="tab.count !== undefined"
              :class="[
                'ml-2',
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#16B36D]/10 text-[#16B36D]'
              ]"
            >
              {{ tab.count }}
            </Badge>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 400, delay: 200 } }"
      >
        <!-- Tab 1: 待審核專案 -->
        <div v-if="activeTab === 'pending'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-[#262624]">
              待審核專案
            </h2>
            <Button
              variant="outline"
              @click="refreshPendingProjects"
              :disabled="isLoading"
              class="border-[#16B36D] text-[#16B36D] hover:bg-[#16B36D]/10"
            >
              <RefreshCw :class="['w-4 h-4 mr-2', { 'animate-spin': isLoading }]" />
              重新整理
            </Button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#16B36D] border-t-transparent" />
            <p class="mt-4 text-[#272D27]/60">載入中...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="pendingProjects.length === 0"
            class="text-center py-12 bg-white rounded-3xl shadow-lg"
          >
            <FileSearch class="w-16 h-16 text-[#272D27]/30 mx-auto mb-4" />
            <p class="text-lg text-[#272D27]/60">目前沒有待審核的專案</p>
          </div>

          <!-- Project Cards -->
          <div v-else class="grid gap-6">
            <PendingProjectCard
              v-for="project in pendingProjects"
              :key="project._id"
              :project="project"
              @review="handleReviewProject"
              @quick-approve="handleQuickApprove"
            />
          </div>
        </div>

        <!-- Tab 2: 已上鏈專案 -->
        <div v-if="activeTab === 'deployed'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-[#262624]">
              已上鏈專案
            </h2>
            <Button
              variant="outline"
              @click="refreshDeployedProjects"
              :disabled="isLoading"
              class="border-[#16B36D] text-[#16B36D] hover:bg-[#16B36D]/10"
            >
              <RefreshCw :class="['w-4 h-4 mr-2', { 'animate-spin': isLoading }]" />
              重新整理
            </Button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#16B36D] border-t-transparent" />
            <p class="mt-4 text-[#272D27]/60">載入中...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="deployedProjects.length === 0"
            class="text-center py-12 bg-white rounded-3xl shadow-lg"
          >
            <Link2 class="w-16 h-16 text-[#272D27]/30 mx-auto mb-4" />
            <p class="text-lg text-[#272D27]/60">尚無已上鏈的專案</p>
          </div>

          <!-- Project Cards -->
          <div v-else class="grid gap-6">
            <OnChainProjectCard
              v-for="project in deployedProjects"
              :key="project._id"
              :project="project"
              :on-chain-data="onChainDataMap.get(project.contract_address)"
              @refresh-data="handleRefreshOnChainData"
            />
          </div>
        </div>

        <!-- Tab 3: 全部專案 -->
        <div v-if="activeTab === 'all'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-[#262624]">
              全部專案
            </h2>
            <div class="flex gap-3">
              <!-- 狀態篩選 -->
              <select
                v-model="statusFilter"
                class="h-10 rounded-lg border border-[#16B36D]/30 bg-white px-4 text-sm text-[#272D27] focus:outline-none focus:ring-2 focus:ring-[#16B36D]/50"
              >
                <option value="all">全部狀態</option>
                <option value="pending">待審核</option>
                <option value="approved">已通過</option>
                <option value="deployed">已上鏈</option>
                <option value="rejected">已拒絕</option>
              </select>

              <Button
                variant="outline"
                @click="refreshAllProjects"
                :disabled="isLoading"
                class="border-[#16B36D] text-[#16B36D] hover:bg-[#16B36D]/10"
              >
                <RefreshCw :class="['w-4 h-4 mr-2', { 'animate-spin': isLoading }]" />
                重新整理
              </Button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#16B36D] border-t-transparent" />
            <p class="mt-4 text-[#272D27]/60">載入中...</p>
          </div>

          <!-- Projects Table -->
          <div v-else class="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-[#16B36D]/5 to-[#A4E2C2]/5">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-[#262624]">專案名稱</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-[#262624]">作物</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-[#262624]">地區</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-[#262624]">狀態</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-[#262624]">合約地址</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-[#262624]">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#16B36D]/10">
                  <tr
                    v-for="project in filteredAllProjects"
                    :key="project._id"
                    class="hover:bg-[#16B36D]/5 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <p class="font-semibold text-[#262624]">{{ getProjectName(project) }}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-[#272D27]/70">
                      {{ getProjectCrop(project) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-[#272D27]/70">
                      {{ getProjectRegion(project) }}
                    </td>
                    <td class="px-6 py-4">
                      <Badge :class="getStatusBadgeClass(project.status)">
                        {{ getStatusText(project.status) }}
                      </Badge>
                    </td>
                    <td class="px-6 py-4">
                      <a
                        v-if="'contract_address' in project && project.contract_address"
                        :href="getEtherscanUrl(project.contract_address)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xs font-mono text-[#16B36D] hover:text-[#16B36D]/80 flex items-center gap-1"
                      >
                        {{ shortenAddress(project.contract_address) }}
                        <ExternalLink class="w-3 h-3" />
                      </a>
                      <span v-else class="text-xs text-[#272D27]/40">未部署</span>
                    </td>
                    <td class="px-6 py-4">
                      <a
                        v-if="'contract_address' in project && project.contract_address"
                        :href="getEtherscanUrl(project.contract_address)"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          class="border-[#16B36D] text-[#16B36D] hover:bg-[#16B36D]/10"
                        >
                          <ExternalLink class="w-3 h-3" />
                        </Button>
                      </a>
                      <span v-else class="text-xs text-[#272D27]/40">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div
              v-if="filteredAllProjects.length === 0"
              class="text-center py-12"
            >
              <FileSearch class="w-16 h-16 text-[#272D27]/30 mx-auto mb-4" />
              <p class="text-lg text-[#272D27]/60">沒有符合條件的專案</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approval Dialog -->
    <ApprovalDialog
      :open="showApprovalDialog"
      :project="selectedProject"
      @update:open="showApprovalDialog = $event"
      @approve="handleApproveProject"
      @reject="handleRejectProject"
    />

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 max-w-md px-6 py-4 rounded-2xl shadow-2xl',
          toast.type === 'success' ? 'bg-[#3BB273] text-white' : 'bg-[#E74C3C] text-white'
        ]"
      >
        <div class="flex items-center gap-3">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
          <XCircle v-else class="w-5 h-5" />
          <p class="font-medium">{{ toast.message }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { PendingProject, ApiProject, ProjectOnChainData } from '~/types/project'
import { 
  FileCheck, 
  Link2, 
  List, 
  RefreshCw, 
  FileSearch,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import PendingProjectCard from '~/components/admin/PendingProjectCard.vue'
import OnChainProjectCard from '~/components/admin/OnChainProjectCard.vue'
import ApprovalDialog from '~/components/admin/ApprovalDialog.vue'
import { useProjectsStore } from '~/stores/projects'
import { getAddressUrl, shortenAddress } from '~/config/contract'

// 設定頁面標題
useHead({
  title: '平台管理中心 | GreenFi Labs',
})

// API & Store
const API_BASE_URL = 'https://rwa-backend.vercel.app'
const projectsStore = useProjectsStore()

// 狀態
const activeTab = ref<'pending' | 'deployed' | 'all'>('pending')
const isLoading = ref(false)
const pendingProjects = ref<PendingProject[]>([])
const deployedProjects = ref<ApiProject[]>([])
const allProjects = ref<(PendingProject | ApiProject)[]>([])
const onChainDataMap = ref<Map<string, ProjectOnChainData>>(new Map())
const statusFilter = ref<string>('all')

// Dialog
const showApprovalDialog = ref(false)
const selectedProject = ref<PendingProject | null>(null)

// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

// Tab 配置
const tabs = computed(() => [
  { id: 'pending' as const, label: '待審核', icon: FileCheck, count: pendingCount.value },
  { id: 'deployed' as const, label: '已上鏈', icon: Link2, count: deployedCount.value },
  { id: 'all' as const, label: '全部專案', icon: List },
])

// 統計數據
const pendingCount = computed(() => pendingProjects.value.length)
const deployedCount = computed(() => deployedProjects.value.length)

// 篩選後的全部專案
const filteredAllProjects = computed(() => {
  if (statusFilter.value === 'all') {
    return allProjects.value
  }
  return allProjects.value.filter(p => p.status === statusFilter.value)
})

// 初始化載入
onMounted(async () => {
  await refreshPendingProjects()
})

// 重新整理待審核專案
const refreshPendingProjects = async () => {
  isLoading.value = true
  try {
    console.log('[Admin API] 開始取得待審核專案...')
    
    const { data, error } = await useFetch(`${API_BASE_URL}/api/projects/pending`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      throw new Error(`HTTP 錯誤！狀態：${error.value}`)
    }

    console.log('[Admin API] 待審核專案回應:', data.value)

    // 處理不同的回應格式
    const result = data.value as any
    if (Array.isArray(result)) {
      pendingProjects.value = result
    } else if (result?.data && Array.isArray(result.data)) {
      pendingProjects.value = result.data
    } else if (result?.projects && Array.isArray(result.projects)) {
      pendingProjects.value = result.projects
    } else {
      pendingProjects.value = []
    }
  } catch (error) {
    showToast('載入待審核專案失敗', 'error')
    console.error(error)
    pendingProjects.value = []
  } finally {
    isLoading.value = false
  }
}

// 重新整理已上鏈專案
const refreshDeployedProjects = async () => {
  isLoading.value = true
  try {
    console.log('[Admin API] 開始取得所有專案...')

    const { data, error } = await useFetch(`${API_BASE_URL}/api/getProjects`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      throw new Error(`HTTP 錯誤！狀態：${error.value}`)
    }

    console.log('[Admin API] 所有專案回應:', data.value)

    // 處理不同的回應格式
    const result = data.value as any
    let allProjectsList: ApiProject[] = []
    if (Array.isArray(result)) {
      allProjectsList = result
    } else if (result?.data && Array.isArray(result.data)) {
      allProjectsList = result.data
    } else if (result?.projects && Array.isArray(result.projects)) {
      allProjectsList = result.projects
    }

    deployedProjects.value = allProjectsList.filter(p => p.contract_address)
  } catch (error) {
    showToast('載入已上鏈專案失敗', 'error')
    console.error(error)
    deployedProjects.value = []
  } finally {
    isLoading.value = false
  }
}

// 重新整理全部專案
const refreshAllProjects = async () => {
  isLoading.value = true
  try {
    console.log('[Admin API] 開始取得所有專案（pending + deployed）...')

    const [pendingRes, deployedRes] = await Promise.all([
      useFetch(`${API_BASE_URL}/api/projects/pending`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      useFetch(`${API_BASE_URL}/api/getProjects`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ])

    // 處理待審核專案
    const pendingResult = pendingRes.data.value as any
    let pending: PendingProject[] = []
    if (Array.isArray(pendingResult)) {
      pending = pendingResult
    } else if (pendingResult?.data && Array.isArray(pendingResult.data)) {
      pending = pendingResult.data
    } else if (pendingResult?.projects && Array.isArray(pendingResult.projects)) {
      pending = pendingResult.projects
    }

    // 處理已部署專案
    const deployedResult = deployedRes.data.value as any
    let deployed: ApiProject[] = []
    if (Array.isArray(deployedResult)) {
      deployed = deployedResult
    } else if (deployedResult?.data && Array.isArray(deployedResult.data)) {
      deployed = deployedResult.data
    } else if (deployedResult?.projects && Array.isArray(deployedResult.projects)) {
      deployed = deployedResult.projects
    }

    allProjects.value = [...pending, ...deployed]
    console.log('[Admin API] 取得全部專案成功:', allProjects.value.length)
  } catch (error) {
    showToast('載入專案失敗', 'error')
    console.error(error)
    allProjects.value = []
  } finally {
    isLoading.value = false
  }
}

// 處理審核專案（打開詳細審核 Dialog）
const handleReviewProject = (project: PendingProject) => {
  selectedProject.value = project
  showApprovalDialog.value = true
}

// 處理快速通過（使用預設參數）
const handleQuickApprove = async (project: PendingProject) => {
  isLoading.value = true
  try {
    const { data, error } = await useFetch('https://rwa-backend.vercel.app/api/projects/adminagree', {
      method: 'POST',
      body: {
        _id: project._id,
      },
    })
    
    if (error.value) {
      showToast(error.value.message || '審核失敗', 'error')
    } else {
      showToast('專案審核通過，正在部署至區塊鏈...', 'success')
      
      // 延遲後重新整理列表
      setTimeout(async () => {
        await refreshPendingProjects()
        await refreshDeployedProjects()
      }, 2000)
    }
  } catch (error: any) {
    showToast(error.message || '審核失敗', 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 處理通過審核
const handleApproveProject = async (projectId: string) => {
  isLoading.value = true
  try {
    const { data, error } = await useFetch('https://rwa-backend.vercel.app/api/projects/adminagree', {
      method: 'POST',
      body: {
        _id: projectId,
      },
    })
    
    if (error.value) {
      showToast(error.value.message || '審核失敗', 'error')
    } else {
      showToast('專案審核通過，正在部署至區塊鏈...', 'success')
      showApprovalDialog.value = false
      
      // 延遲後重新整理列表
      setTimeout(async () => {
        await refreshPendingProjects()
        await refreshDeployedProjects()
      }, 2000)
    }
  } catch (error: any) {
    showToast(error.message || '審核失敗', 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 處理拒絕專案
const handleRejectProject = async (projectId: string, reason?: string) => {
  isLoading.value = true
  try {
    const { data, error } = await useFetch('https://rwa-backend.vercel.app/api/projects/approve', {
      method: 'POST',
      body: {
        _id: projectId,
        action: 'reject',
        reviewNote: reason || '不符合審核標準',
      },
    })
    
    if (error.value) {
      showToast(error.value.message || '拒絕失敗', 'error')
    } else {
      showToast('專案已拒絕', 'success')
      showApprovalDialog.value = false
      
      // 重新整理列表
      await refreshPendingProjects()
    }
  } catch (error: any) {
    showToast(error.message || '拒絕失敗', 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 刷新鏈上資料
const handleRefreshOnChainData = async (contractAddress: string) => {
  try {
    console.log('[Admin API] 開始查詢鏈上資料:', contractAddress)

    const { data, error } = await useFetch(
      `${API_BASE_URL}/api/con/project/data?projectAddress=${contractAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    if (error.value) {
      throw new Error(`HTTP 錯誤！狀態：${error.value}`)
    }

    console.log('[Admin API] 鏈上資料回應:', data.value)

    const result = data.value as any
    const onChainData = result?.data || result
    if (onChainData) {
      onChainDataMap.value.set(contractAddress, onChainData)
      showToast('鏈上資料已更新', 'success')
    }
  } catch (error) {
    console.error('刷新鏈上資料失敗:', error)
  }
}

// 顯示 Toast
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// 取得專案名稱（兼容不同格式）
const getProjectName = (project: any) => {
  return project.title || project.projectName || '未命名專案'
}

// 取得作物名稱
const getProjectCrop = (project: any) => {
  return project.crop_type || project.crop_name || project.cropType || '-'
}

// 取得地區
const getProjectRegion = (project: any) => {
  return project.location || project.region || '-'
}

// 取得狀態文字
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待審核',
    approved: '已通過',
    rejected: '已拒絕',
    deployed: '已上鏈',
    active: '進行中',
  }
  return statusMap[status] || status
}

// 取得狀態徽章樣式
const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-[#FDBA45]/20 text-[#FDBA45] border border-[#FDBA45]/30',
    approved: 'bg-[#3BB273]/20 text-[#3BB273] border border-[#3BB273]/30',
    rejected: 'bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30',
    deployed: 'bg-[#16B36D]/20 text-[#16B36D] border border-[#16B36D]/30',
    active: 'bg-[#16B36D]/20 text-[#16B36D] border border-[#16B36D]/30',
  }
  return classMap[status] || 'bg-gray-100 text-gray-600'
}

// 取得 Etherscan URL
const getEtherscanUrl = (address: string) => {
  return getAddressUrl(address)
}

// 切換 Tab 時自動載入資料
watch(activeTab, async (newTab) => {
  if (newTab === 'deployed' && deployedProjects.value.length === 0) {
    await refreshDeployedProjects()
  } else if (newTab === 'all' && allProjects.value.length === 0) {
    await refreshAllProjects()
  }
})
</script>

