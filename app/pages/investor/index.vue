<script setup lang="ts">
import { Leaf, Wallet, ExternalLink, Download, TrendingUp, DollarSign, Calendar, AlertCircle, CheckCircle, RefreshCw } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'
import Badge from '~/components/ui/badge/Badge.vue'
import { useWeb3 } from '~/composables/useWeb3'
import { useToast } from '~/composables/useToast'
import { useWeb3Store } from '~/stores/web3'
import { useProjectsStore } from '~/stores/projects'
import { useNFTBalance } from '~/composables/useNFTBalance'
import { getAddressUrl, shortenAddress } from '~/config/contract'
import type { InvestorProject, InvestmentCardData } from '~/types/project'

// 投資標的數據
const investments = ref<InvestmentCardData[]>([])
const isLoadingInvestments = ref(false)
const loadError = ref<string | null>(null)

// Web3 整合
const {
  connectWallet,
  isConnected,
  isCorrectNetwork,
  hasMetaMask,
  shortAccount,
  balance,
  getAddressLink,
  formatAddress,
  account,
} = useWeb3()

const toast = useToast()
const web3Store = useWeb3Store()
const projectsStore = useProjectsStore()
const { batchGetNFTBalances, getProjectOnChainData, getClaimableReward } = useNFTBalance()

// 組件掛載時檢測 MetaMask
onMounted(() => {
  web3Store.checkMetaMask()
})

// 載入投資標的
const loadInvestments = async () => {
  if (!account.value) {
    console.log('[Load Investments] 沒有連接的帳戶')
    investments.value = []
    return
  }

  console.log('[Load Investments] 開始載入投資標的，帳戶:', account.value)
  isLoadingInvestments.value = true
  loadError.value = null

  try {
    // 1. 確保已載入專案列表
    if (projectsStore.projects.length === 0) {
      console.log('[Load Investments] 正在從 API 載入專案列表...')
      await projectsStore.fetchProjects()
    }

    console.log('[Load Investments] 專案列表已載入，數量:', projectsStore.projects.length)
    console.log('[Load Investments] 專案列表:', projectsStore.projects.map(p => ({
      id: p._id,
      title: p.title,
      contract_address: p.contract_address
    })))

    // 2. 批量查詢用戶持有的 NFT
    console.log('[Load Investments] 開始批量查詢 NFT 餘額...')
    const projectsWithBalance = await batchGetNFTBalances(
      projectsStore.projects,
      account.value
    )

    console.log('[Load Investments] 批量查詢完成，持有的專案:', projectsWithBalance)

    // 3. 對每個持有的專案查詢詳細數據
    const investmentPromises = projectsWithBalance.map(async (project) => {
      try {
        const [onChainData, claimableReward] = await Promise.all([
          getProjectOnChainData(project.contract_address),
          getClaimableReward(project.contract_address, account.value!),
        ])

        // 計算投資金額（NFT 數量 × 價格）
        const investmentAmount = onChainData
          ? (project.nftBalance * parseFloat(onChainData.nftPrice)).toFixed(4)
          : (project.nftBalance * project.nft_price).toFixed(4)

        // 計算預期 ROI
        const expectedROI = parseFloat(project.annual_yield_rate.replace('%', ''))

        // 計算項目進度
        const projectProgress = onChainData?.progress || 0

        const investmentCard: InvestmentCardData = {
          id: project._id,
          projectName: project.title,
          projectImage: project.imageURL,
          contractAddress: project.contract_address,
          investmentAmount,
          claimableRewards: claimableReward,
          expectedROI,
          projectProgress,
          status: 'active',
          investDate: new Date().toISOString().split('T')[0], // 暫時使用當前日期
          expectedReturnDate: '2025年12月31日', // 可以從合約或 API 獲取
          nftBalance: project.nftBalance,
        }

        return investmentCard
      } catch (error) {
        console.error(`處理專案 ${project._id} 數據失敗:`, error)
        return null
      }
    })

    const results = await Promise.all(investmentPromises)
    investments.value = results.filter((inv) => inv !== null) as InvestmentCardData[]
  } catch (error: any) {
    console.error('載入投資標的失敗:', error)
    loadError.value = error.message || '載入失敗，請重試'
    toast.error('載入投資標的失敗')
  } finally {
    isLoadingInvestments.value = false
  }
}

// 監聽錢包連接狀態變化
watch([isConnected, account], ([connected, acc]) => {
  if (connected && acc) {
    loadInvestments()
  } else {
    investments.value = []
  }
}, { immediate: true })

// 提領狀態
const withdrawingIds = ref<Set<string>>(new Set())
const withdrawErrors = ref<Record<string, string>>({})
const { claimProjectReward } = useNFTBalance()

// 計算總覽數據
const totalInvestment = computed(() => {
  return investments.value.reduce((sum, inv) => sum + parseFloat(inv.investmentAmount), 0)
})

const totalClaimableRewards = computed(() => {
  return investments.value.reduce((sum, inv) => sum + parseFloat(inv.claimableRewards), 0)
})

const averageROI = computed(() => {
  if (investments.value.length === 0) return 0
  const totalROI = investments.value.reduce((sum, inv) => sum + inv.expectedROI, 0)
  return (totalROI / investments.value.length).toFixed(1)
})

// 提領功能
const handleWithdraw = async (investment: InvestmentCardData) => {
  if (!isConnected.value) {
    toast.error('請先連接錢包')
    return
  }

  if (!isCorrectNetwork.value) {
    toast.error('請切換到 Sepolia 測試網')
    return
  }

  if (parseFloat(investment.claimableRewards) <= 0) {
    toast.error('暫無可提取的收益')
    return
  }

  withdrawingIds.value.add(investment.id)
  withdrawErrors.value[investment.id] = ''

  try {
    toast.info('正在處理提領請求...')

    // 調用智能合約的 claimReward 方法
    const result = await claimProjectReward(investment.contractAddress)

    if (result.success) {
      // 更新數據
      const index = investments.value.findIndex(inv => inv.id === investment.id)
      if (index !== -1 && investments.value[index]) {
        investments.value[index].claimableRewards = '0'
      }

      toast.success(`成功提領收益！`)
      
      // 顯示交易連結
      if (result.txHash) {
        console.log('交易哈希:', result.txHash)
        console.log('區塊高度:', result.blockNumber)
      }

      // 重新載入餘額
      await web3Store.updateBalance()
    }
  } catch (error: any) {
    const errorMsg = error.message || '提領失敗，請重試'
    withdrawErrors.value[investment.id] = errorMsg
    toast.error(errorMsg)
  } finally {
    withdrawingIds.value.delete(investment.id)
  }
}

// 重新載入投資標的
const handleRefresh = () => {
  if (isConnected.value && account.value) {
    loadInvestments()
  }
}

// 複製地址到剪貼板
const copyAddress = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address)
    toast.success('地址已複製到剪貼板')
  } catch (error) {
    toast.error('複製失敗')
  }
}

// 檢查是否有投資
const hasInvestments = computed(() => investments.value.length > 0)
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-[1440px] mx-auto px-6 py-8">
        <!-- Logo/Brand -->
        <div class="flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-primary to-[#A4E2C2] rounded-lg flex items-center justify-center">
            <Leaf class="w-6 h-6 text-white" />
          </div>
          <span class="text-secondary text-lg font-medium">GreenFi Labs</span>
        </div>

        <!-- Title and Subtitle -->
        <h1 class="text-[36px] font-semibold text-secondary mb-3">
          我的投資組合
        </h1>
        <p class="text-gray-600 mb-6 max-w-3xl">
          管理您的農業投資標的，追蹤收益並隨時提領您的回報
        </p>

        <!-- Wallet Status -->
        <div v-if="isConnected" class="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20 max-w-md">
          <Wallet class="w-5 h-5 text-primary" />
          <div class="flex-1">
            <p class="text-sm text-secondary/70">已連接錢包</p>
            <p class="text-sm font-medium text-secondary">{{ shortAccount }}</p>
          </div>
          <Badge :variant="isCorrectNetwork ? 'default' : 'destructive'" class="text-xs">
            {{ isCorrectNetwork ? 'Sepolia' : '錯誤網路' }}
          </Badge>
        </div>
        <div v-else class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
          <AlertCircle class="w-5 h-5 text-gray-400" />
          <div class="flex-1">
            <p class="text-sm text-gray-600">請連接錢包以查看投資資訊</p>
          </div>
          <Button 
            v-if="hasMetaMask"
            size="sm"
            class="bg-primary hover:bg-accent text-white"
            @click="connectWallet"
          >
            連接錢包
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1440px] mx-auto px-6 py-10">
      <!-- Wallet Connection Prompt (Large) -->
      <div
        v-if="!isConnected"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="mb-10"
      >
        <Card class="p-8 bg-gradient-to-br from-primary/10 via-[#A4E2C2]/10 to-white border-2 border-primary/30 shadow-soft-lg">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <!-- Left Side: Icon and Text -->
            <div class="flex items-start gap-4 flex-1">
              <div class="p-4 bg-primary/20 rounded-xl flex-shrink-0">
                <Wallet class="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 class="text-2xl font-semibold text-secondary mb-2">
                  連結您的錢包
                </h3>
                <p class="text-gray-600 mb-3 max-w-xl">
                  請先連接您的錢包以查看完整的投資組合資訊、追蹤收益並執行提領操作。我們支援 MetaMask 錢包。
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle class="w-4 h-4 text-primary" />
                  <span>安全可靠</span>
                  <CheckCircle class="w-4 h-4 text-primary ml-2" />
                  <span>即時更新</span>
                  <CheckCircle class="w-4 h-4 text-primary ml-2" />
                  <span>透明追蹤</span>
                </div>
              </div>
            </div>

            <!-- Right Side: Action Button -->
            <div class="flex flex-col items-center gap-3 w-full md:w-auto">
              <Button
                v-if="hasMetaMask"
                size="lg"
                class="bg-primary hover:bg-accent text-white px-8 py-6 text-lg shadow-lg shadow-primary/30 w-full md:w-auto"
                @click="connectWallet"
              >
                <Wallet class="w-5 h-5 mr-2" />
                連結錢包
              </Button>
              <div v-else class="text-center">
                <p class="text-sm text-gray-600 mb-2">尚未安裝 MetaMask</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors text-lg shadow-lg"
                >
                  <ExternalLink class="w-5 h-5 mr-2" />
                  下載 MetaMask
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoadingInvestments && isConnected"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="mb-10"
      >
        <Card class="p-8 bg-white">
          <div class="flex flex-col items-center justify-center gap-4">
            <RefreshCw class="w-12 h-12 text-primary animate-spin" />
            <p class="text-lg text-secondary">正在載入您的投資標的...</p>
            <p class="text-sm text-gray-600">正在查詢區塊鏈數據，請稍候</p>
          </div>
        </Card>
      </div>

      <!-- Error State -->
      <div
        v-if="loadError && !isLoadingInvestments && isConnected"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="mb-10"
      >
        <Card class="p-8 bg-red-50 border-2 border-red-200">
          <div class="flex flex-col items-center justify-center gap-4">
            <AlertCircle class="w-12 h-12 text-red-600" />
            <p class="text-lg font-semibold text-red-900">載入失敗</p>
            <p class="text-sm text-red-700">{{ loadError }}</p>
            <Button
              class="bg-red-600 hover:bg-red-700 text-white"
              @click="handleRefresh"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              重新載入
            </Button>
          </div>
        </Card>
      </div>

      <!-- Investment Overview Cards -->
      <div 
        v-if="hasInvestments && isConnected && !isLoadingInvestments"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="mb-6"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-[28px] font-semibold text-secondary">投資總覽</h2>
          <Button
            variant="outline"
            size="sm"
            @click="handleRefresh"
            :disabled="isLoadingInvestments"
          >
            <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoadingInvestments }" />
            重新載入
          </Button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total Investment -->
          <Card class="p-6 bg-white hover-lift shadow-soft">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-primary/10 rounded-lg">
                <DollarSign class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-lg font-semibold text-secondary">總投資金額</h3>
            </div>
            <p class="text-3xl font-bold text-secondary mb-1">
              {{ totalInvestment.toFixed(4) }} ETH
            </p>
            <p class="text-sm text-gray-600">共 {{ investments.length }} 個投資標的</p>
          </Card>

          <!-- Total Claimable Rewards -->
          <Card class="p-6 bg-gradient-to-br from-primary/10 to-[#A4E2C2]/20 hover-lift shadow-soft border-primary/20">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-primary/20 rounded-lg">
                <Download class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-lg font-semibold text-secondary">未提取收益</h3>
            </div>
            <p class="text-3xl font-bold text-[#FD773D] mb-1">
              {{ totalClaimableRewards.toFixed(4) }} ETH
            </p>
            <p class="text-sm text-gray-600">可立即提領</p>
          </Card>

          <!-- Average ROI -->
          <Card class="p-6 bg-white hover-lift shadow-soft">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-chart-3/10 rounded-lg">
                <TrendingUp class="w-6 h-6 text-chart-3" />
              </div>
              <h3 class="text-lg font-semibold text-secondary">平均預期回報率</h3>
            </div>
            <p class="text-3xl font-bold text-primary mb-1">
              {{ averageROI }}%
            </p>
            <p class="text-sm text-gray-600">年度化收益率</p>
          </Card>
        </div>
      </div>

      <!-- Investment List -->
      <div v-if="hasInvestments && isConnected && !isLoadingInvestments" class="space-y-6">
        <h2 class="text-[28px] font-semibold text-secondary mb-6">投資標的</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card
            v-for="(investment, index) in investments"
            :key="investment.id"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }"
            class="p-6 bg-white hover-lift shadow-soft border border-gray-100"
          >
            <!-- Project Image -->
            <div class="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <img
                :src="investment.projectImage"
                :alt="investment.projectName"
                class="w-full h-full object-cover"
              >
              <Badge
                :variant="investment.status === 'active' ? 'default' : 'secondary'"
                class="absolute top-3 right-3"
              >
                {{ investment.status === 'active' ? '進行中' : investment.status === 'completed' ? '已完成' : '待處理' }}
              </Badge>
            </div>

            <!-- Project Name -->
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ investment.projectName }}
            </h3>

            <!-- Contract Address -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs text-gray-600 mb-1">標的地址</p>
              <div class="flex items-center gap-2">
                <code class="text-sm font-mono text-secondary flex-1 truncate">
                  {{ formatAddress(investment.contractAddress) }}
                </code>
                <button
                  @click="copyAddress(investment.contractAddress)"
                  class="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="複製地址"
                >
                  <ExternalLink class="w-4 h-4 text-gray-500" />
                </button>
                <a
                  :href="getAddressLink(investment.contractAddress)"
                  target="_blank"
                  class="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="在區塊鏈瀏覽器查看"
                >
                  <ExternalLink class="w-4 h-4 text-primary" />
                </a>
              </div>
            </div>

            <!-- Investment Details -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">持有 NFT</span>
                <span class="text-sm font-medium text-secondary">{{ investment.nftBalance }} 枚</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">投資金額</span>
                <span class="text-sm font-medium text-secondary">{{ investment.investmentAmount }} ETH</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">預期 ROI</span>
                <span class="text-sm font-medium text-primary">{{ investment.expectedROI }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">專案進度</span>
                <span class="text-sm font-medium text-secondary">{{ investment.projectProgress.toFixed(1) }}%</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  :style="{ width: `${investment.projectProgress}%` }"
                />
              </div>
            </div>

            <!-- Claimable Rewards -->
            <div class="mb-4 p-4 bg-gradient-to-r from-primary/10 to-[#FD773D]/10 rounded-lg border border-primary/20">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-secondary">未提取收益</span>
                <span class="text-2xl font-bold text-[#FD773D]">
                  {{ parseFloat(investment.claimableRewards).toFixed(4) }} ETH
                </span>
              </div>
              <p class="text-xs text-gray-600">可立即提領至您的錢包</p>
            </div>

            <!-- Withdraw Button -->
            <Button
              class="w-full bg-primary hover:bg-accent text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              :disabled="parseFloat(investment.claimableRewards) <= 0 || withdrawingIds.has(investment.id) || !isConnected || !isCorrectNetwork"
              @click="handleWithdraw(investment)"
            >
              <Download 
                v-if="!withdrawingIds.has(investment.id)"
                class="w-4 h-4 mr-2" 
              />
              <span v-if="withdrawingIds.has(investment.id)">處理中...</span>
              <span v-else-if="parseFloat(investment.claimableRewards) <= 0">暫無可提取</span>
              <span v-else-if="!isConnected">請連接錢包</span>
              <span v-else-if="!isCorrectNetwork">請切換網路</span>
              <span v-else>提領收益</span>
            </Button>

            <!-- Error Message -->
            <div
              v-if="withdrawErrors[investment.id]"
              class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start gap-2">
                <AlertCircle class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p class="text-sm text-red-900">{{ withdrawErrors[investment.id] }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="parseFloat(investment.claimableRewards) === 0 && !withdrawingIds.has(investment.id)"
              class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex items-start gap-2">
                <CheckCircle class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p class="text-sm text-green-900">目前無可提取收益</p>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center text-xs text-gray-600">
                <span>投資日期：{{ investment.investDate }}</span>
                <span>預計回收：{{ investment.expectedReturnDate }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Empty State (只在已連接錢包但無投資時顯示) -->
      <div
        v-if="!hasInvestments && isConnected && !isLoadingInvestments && !loadError"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Wallet class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-2xl font-semibold text-secondary mb-2">尚無投資標的</h3>
        <p class="text-gray-600 mb-8 max-w-md text-center">
          您還沒有任何投資記錄。開始探索我們的農業投資專案，開始您的永續投資之旅。
        </p>
        <Button
          class="bg-primary hover:bg-accent text-white px-8"
          @click="navigateTo('/project/list')"
        >
          探索專案
        </Button>
      </div>
    </main>
  </div>
</template>

