<script setup lang="ts">
import { TrendingUp, DollarSign, Users, Calendar, Coins, Info, ExternalLink } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import { useNFTBalance } from '~/composables/useNFTBalance'

interface ProjectYieldInfoProps {
  contractAddress: string
}

const props = defineProps<ProjectYieldInfoProps>()

const { getProjectOnChainData } = useNFTBalance()

const loading = ref(false)
const projectData1 = ref<any>(null)
const projectData2 = ref<any>(null)
const error = ref<string | null>(null)

// 載入專案鏈上數據
const loadProjectData = async () => {
  if (!props.contractAddress) return

  loading.value = true
  error.value = null

  try {
    const data = await getProjectOnChainData(props.contractAddress)
    
    if (data) {
      // getProjectData1 的數據（基本/合約參數）
      projectData1.value = {
        name: data.name || '未設定',
        symbol: data.symbol || 'NFT',
        status: data.status,
        owner: data.owner,
        farmer: data.farmer,
        totalNFTs: data.totalNFTs,
        mintedNFTs: data.mintedNFTs,
        nftPrice: data.nftPrice,
        buildCost: data.buildCost,
        annualIncome: data.annualIncome,
        investorShare: data.investorShare,
        interestRate: data.interestRate,
        premiumRate: data.premiumRate,
      }

      // getProjectData2 的數據（收益狀態、合約其他資訊）
      projectData2.value = {
        currentYear: data.currentYear,
        cumulativePrincipal: data.cumulativePrincipal,
        remainingPrincipal: data.remainingPrincipal,
        buybackPrice: data.buybackPrice,
        buybackActive: data.buybackActive,
        paymentToken: data.paymentToken,
        factory: data.factory,
      }
      
      console.log('[ProjectYieldInfo] 數據載入成功:', { projectData1: projectData1.value, projectData2: projectData2.value })
    } else {
      error.value = '合約可能尚未部署或版本不匹配'
    }
  } catch (err: any) {
    console.error('載入專案數據失敗:', err)
    error.value = '無法載入專案數據'
  } finally {
    loading.value = false
  }
}

// 格式化地址
const formatAddress = (address: string) => {
  if (!address) return '未設定'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 格式化金額
const formatAmount = (amount: string | number, decimals: number = 4) => {
  if (!amount) return '0'
  return parseFloat(amount.toString()).toFixed(decimals)
}

// 計算進度百分比
const progressPercentage = computed(() => {
  if (!projectData1.value) return 0
  const { mintedNFTs, totalNFTs } = projectData1.value
  if (totalNFTs === 0) return 0
  return Math.round((mintedNFTs / totalNFTs) * 100)
})

// 計算年化收益率
const annualizedYieldRate = computed(() => {
  if (!projectData1.value) return 0
  const { interestRate, premiumRate } = projectData1.value
  return Number(interestRate || 0) + Number(premiumRate || 0)
})

// 格式化百分比
const formatPercentage = (value: number | string) => {
  const num = Number(value) / 100 // 合約返回的是基點（bps），需要除以 100
  return num.toFixed(2)
}

// 組件掛載時載入
onMounted(() => {
  loadProjectData()
})

// 監聽 contractAddress 變化
watch(() => props.contractAddress, () => {
  loadProjectData()
})
</script>

<template>
  <Card class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-secondary flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-primary" />
        專案詳細數據
      </h3>
      <div class="text-xs text-secondary/60 flex items-center gap-1">
        <Info class="w-3 h-3" />
        鏈上即時數據
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="text-center py-12">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p class="text-secondary/60 text-sm">載入鏈上數據...</p>
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="py-8">
      <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-orange-900 mb-1">
              無法載入專案詳細數據
            </p>
            <p class="text-xs text-orange-700 mb-3">
              {{ error }}
            </p>
            <details class="text-xs text-orange-800">
              <summary class="cursor-pointer hover:text-orange-900 font-medium mb-2">
                查看詳細資訊
              </summary>
              <div class="mt-2 p-3 bg-orange-100 rounded border border-orange-300">
                <p class="mb-2"><strong>合約地址:</strong></p>
                <p class="font-mono text-xs break-all mb-3">{{ contractAddress }}</p>
                <p class="mb-1"><strong>可能的原因:</strong></p>
                <ul class="list-disc list-inside space-y-1 ml-2">
                  <li>合約尚未部署到此地址</li>
                  <li>合約已部署但缺少 <code class="bg-orange-200 px-1 rounded">getProjectData1()</code> 和 <code class="bg-orange-200 px-1 rounded">getProjectData2()</code> 函數</li>
                  <li>合約版本與前端 ABI 不匹配</li>
                  <li>網路連接問題或 RPC 節點錯誤</li>
                </ul>
                <p class="mt-3 mb-1"><strong>建議操作:</strong></p>
                <ul class="list-disc list-inside space-y-1 ml-2">
                  <li>在 <a :href="`https://sepolia.etherscan.io/address/${contractAddress}#code`" target="_blank" class="text-orange-900 underline hover:text-orange-950">Etherscan</a> 上查看合約代碼</li>
                  <li>確認合約包含最新版本的 <code class="bg-orange-200 px-1 rounded">SafeHarvestNFT</code></li>
                  <li>聯繫專案管理員確認合約地址和版本</li>
                  <li>檢查控制台以獲取更多技術細節</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>

    <!-- 數據顯示 -->
    <div v-else-if="projectData1 && projectData2" class="space-y-6">
      <!-- 基本資訊區塊 -->
      <div>
        <h4 class="text-sm font-semibold text-secondary/70 mb-4 uppercase tracking-wide">
          基本資訊
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- NFT 名稱 -->
          <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p class="text-xs text-blue-700 mb-1 flex items-center gap-1">
              <Info class="w-3 h-3" />
              NFT 名稱
            </p>
            <p class="text-base font-semibold text-blue-900">{{ projectData1.name }}</p>
          </div>

          <!-- NFT 符號 -->
          <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p class="text-xs text-green-700 mb-1">NFT 符號</p>
            <p class="text-base font-semibold text-green-900">{{ projectData1.symbol }}</p>
          </div>

          <!-- 專案擁有者 -->
          <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p class="text-xs text-purple-700 mb-1">專案擁有者</p>
            <p class="text-xs font-mono text-purple-900">{{ formatAddress(projectData1.owner) }}</p>
          </div>

          <!-- 農民地址 -->
          <div class="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <p class="text-xs text-orange-700 mb-1">農民地址</p>
            <p class="text-xs font-mono text-orange-900">{{ formatAddress(projectData1.farmer) }}</p>
          </div>

          <!-- 投資人分潤 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-700 mb-1">投資人分潤比例</p>
            <p class="text-base font-semibold text-gray-900">{{ formatPercentage(projectData1.investorShare) }}%</p>
          </div>

          <!-- 利率 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-700 mb-1">利率</p>
            <p class="text-base font-semibold text-gray-900">{{ formatPercentage(projectData1.interestRate) }}%</p>
          </div>
        </div>
      </div>

      <!-- NFT 與募資資訊區塊 -->
      <div>
        <h4 class="text-sm font-semibold text-secondary/70 mb-4 uppercase tracking-wide">
          NFT 與募資資訊
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 建設費用 -->
          <div class="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <p class="text-xs text-secondary/70 mb-1 flex items-center gap-1">
              <DollarSign class="w-3 h-3" />
              建設費用
            </p>
            <p class="text-xl font-bold text-primary">
              {{ formatAmount(projectData1.buildCost) }}
              <span class="text-xs text-secondary/60">TWDT</span>
            </p>
          </div>

          <!-- NFT 價格 -->
          <div class="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <p class="text-xs text-secondary/70 mb-1 flex items-center gap-1">
              <Coins class="w-3 h-3" />
              NFT 單價
            </p>
            <p class="text-xl font-bold text-primary">
              {{ formatAmount(projectData1.nftPrice) }}
              <span class="text-xs text-secondary/60">TWDT</span>
            </p>
          </div>

          <!-- 募資進度 -->
          <div class="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <p class="text-xs text-secondary/70 mb-1 flex items-center gap-1">
              <Users class="w-3 h-3" />
              鑄造進度
            </p>
            <p class="text-xl font-bold text-primary">
              {{ projectData1.mintedNFTs }} / {{ projectData1.totalNFTs }}
            </p>
            <div class="mt-2 h-2 bg-secondary/10 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                :style="{ width: `${progressPercentage}%` }"
              />
            </div>
            <p class="text-xs text-secondary/60 mt-1">{{ progressPercentage }}%</p>
          </div>
        </div>
      </div>

      <!-- 收益與財務資訊區塊 -->
      <div>
        <h4 class="text-sm font-semibold text-secondary/70 mb-4 uppercase tracking-wide">
          收益與財務資訊
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 年收益 -->
          <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p class="text-xs text-green-700 mb-1">年收益</p>
            <p class="text-xl font-bold text-green-900">
              {{ formatAmount(projectData1.annualIncome) }}
              <span class="text-xs text-green-700">TWDT</span>
            </p>
          </div>

          <!-- 溢酬率 -->
          <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p class="text-xs text-green-700 mb-1">溢酬率</p>
            <p class="text-xl font-bold text-green-900">
              {{ formatPercentage(projectData1.premiumRate) }}%
            </p>
          </div>

          <!-- 當前年度 -->
          <div class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <p class="text-xs text-yellow-700 mb-1">當前年度</p>
            <p class="text-xl font-bold text-yellow-900">
              第 {{ projectData2.currentYear }} 年
            </p>
          </div>

          <!-- 累積本金 -->
          <div class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <p class="text-xs text-yellow-700 mb-1">累積本金</p>
            <p class="text-xl font-bold text-yellow-900">
              {{ formatAmount(projectData2.cumulativePrincipal) }}
              <span class="text-xs text-yellow-700">TWDT</span>
            </p>
          </div>

          <!-- 剩餘本金 -->
          <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p class="text-xs text-blue-700 mb-1">剩餘本金</p>
            <p class="text-xl font-bold text-blue-900">
              {{ formatAmount(projectData2.remainingPrincipal) }}
              <span class="text-xs text-blue-700">TWDT</span>
            </p>
          </div>

          <!-- 買回價格 -->
          <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p class="text-xs text-purple-700 mb-1">買回價格</p>
            <p class="text-xl font-bold text-purple-900">
              {{ formatAmount(projectData2.buybackPrice) }}
              <span class="text-xs text-purple-700">TWDT</span>
            </p>
            <p class="text-xs text-purple-700 mt-1">
              狀態: {{ projectData2.buybackActive ? '啟用' : '未啟用' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 合約資訊區塊 -->
      <div class="pt-4 border-t border-secondary/10">
        <h4 class="text-sm font-semibold text-secondary/70 mb-4 uppercase tracking-wide">
          合約資訊
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 專案狀態 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-700 mb-2">專案狀態</p>
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-green-500': projectData1.status === 1,
                  'bg-yellow-500': projectData1.status === 2,
                  'bg-gray-500': projectData1.status === 0,
                  'bg-red-500': projectData1.status === 3,
                }"
              />
              <span class="text-base font-semibold text-gray-900">
                {{ projectData1.status === 0 ? '未開始' : projectData1.status === 1 ? '進行中' : projectData1.status === 2 ? '已結束' : '已取消' }}
              </span>
            </div>
          </div>

          <!-- 付款代幣 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-700 mb-2">付款代幣合約</p>
            <a
              v-if="projectData2.paymentToken"
              :href="`https://sepolia.etherscan.io/address/${projectData2.paymentToken}`"
              target="_blank"
              class="text-xs font-mono text-primary hover:text-accent inline-flex items-center gap-1"
            >
              {{ formatAddress(projectData2.paymentToken) }}
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>

          <!-- Factory 合約 -->
          <div class="p-4 bg-gray-50 rounded-lg md:col-span-2">
            <p class="text-xs text-gray-700 mb-2">Factory 合約地址</p>
            <a
              v-if="projectData2.factory"
              :href="`https://sepolia.etherscan.io/address/${projectData2.factory}`"
              target="_blank"
              class="text-xs font-mono text-primary hover:text-accent inline-flex items-center gap-1"
            >
              {{ formatAddress(projectData2.factory) }}
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

