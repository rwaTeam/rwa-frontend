<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{ opacity: 1, y: 0, transition: { duration: 400 } }"
    class="bg-white rounded-3xl p-8 shadow-lg hover:scale-[1.02] transition-all duration-300"
  >
    <!-- 專案標題與狀態 -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-xl font-semibold text-[#262624]">
            {{ project.title }}
          </h3>
          <Badge
            :class="statusBadgeClass"
            class="border"
          >
            {{ statusText }}
          </Badge>
        </div>
        <p class="text-sm text-[#272D27]/70">
          {{ project.crop_name }} · {{ project.region }}
        </p>
      </div>
      
      <!-- 專案圖片縮圖 -->
      <div
        v-if="project.imageURL"
        class="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF9F6]"
      >
        <img
          :src="project.imageURL"
          :alt="project.title"
          class="w-full h-full object-cover"
        >
      </div>
    </div>

    <!-- 合約資訊 -->
    <div class="mb-6 p-4 bg-gradient-to-br from-[#16B36D]/5 to-[#A4E2C2]/5 rounded-xl">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Link2 class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">合約地址</span>
        </div>
        <a
          v-if="project.contract_address"
          :href="getEtherscanUrl(project.contract_address)"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-[#16B36D] hover:text-[#16B36D]/80 transition-colors flex items-center gap-1"
        >
          <ExternalLink class="w-3 h-3" />
          Etherscan
        </a>
      </div>
      <p class="text-sm font-mono text-[#262624] break-all">
        {{ project.contract_address || '未部署' }}
      </p>
    </div>

    <!-- 專案數據網格 -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- NFT 總數 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Package class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">NFT 總數</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ formatNumber(project.total_nft) }}
        </p>
      </div>

      <!-- NFT 單價 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <DollarSign class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">NFT 單價</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ formatNumber(project.nft_price) }} TWDT
        </p>
      </div>

      <!-- 年化收益率 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">年化收益率</span>
        </div>
        <p class="text-base font-semibold text-[#3BB273]">
          {{ project.annual_yield_rate }}%
        </p>
      </div>

      <!-- 保險公司 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Shield class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">保險公司</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ project.insurance_company || '無' }}
        </p>
      </div>
    </div>

    <!-- 鏈上資料（如果有） -->
    <div
      v-if="onChainData"
      class="mb-6 p-4 bg-[#FAF9F6] rounded-xl space-y-3"
    >
      <h4 class="text-sm font-semibold text-[#262624] flex items-center gap-2">
        <Activity class="w-4 h-4 text-[#16B36D]" />
        鏈上狀態
      </h4>
      <div class="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p class="text-[#272D27]/60">已售出</p>
          <p class="text-base font-bold text-[#16B36D] mt-1">
            {{ onChainData.totalSupply || 0 }}
          </p>
        </div>
        <div>
          <p class="text-[#272D27]/60">進度</p>
          <p class="text-base font-bold text-[#16B36D] mt-1">
            {{ onChainData.progress || 0 }}%
          </p>
        </div>
        <div>
          <p class="text-[#272D27]/60">狀態</p>
          <p class="text-base font-bold text-[#16B36D] mt-1">
            {{ getStatusText(onChainData.status) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 專案描述 -->
    <div v-if="project.description" class="mb-6">
      <p class="text-sm text-[#272D27]/70 line-clamp-2">
        {{ project.description }}
      </p>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex gap-3">
      <Button
        v-if="project.contract_address"
        variant="outline"
        @click="handleRefreshData"
        :disabled="isRefreshing"
        class="flex-1 border-[#16B36D] text-[#16B36D] hover:bg-[#16B36D]/10"
      >
        <RefreshCw :class="['w-4 h-4 mr-2', { 'animate-spin': isRefreshing }]" />
        {{ isRefreshing ? '更新中...' : '刷新資料' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiProject, ProjectOnChainData } from '~/types/project'
import { 
  Link2, 
  ExternalLink, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Activity,
  RefreshCw 
} from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { getAddressUrl } from '~/config/contract'

interface Props {
  project: ApiProject
  onChainData?: ProjectOnChainData | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'refresh-data': [contractAddress: string]
}>()

const isRefreshing = ref(false)

// 狀態文字
const statusText = computed(() => {
  const statusMap: Record<string, string> = {
    'active': '進行中',
    'completed': '已完成',
    'pending': '待開始',
    'deployed': '已部署',
    'approved': '已通過',
  }
  return statusMap[props.project.status] || props.project.status
})

// 狀態徽章樣式
const statusBadgeClass = computed(() => {
  const classMap: Record<string, string> = {
    'active': 'bg-[#3BB273]/20 text-[#3BB273] border-[#3BB273]/30',
    'completed': 'bg-[#16B36D]/20 text-[#16B36D] border-[#16B36D]/30',
    'pending': 'bg-[#FDBA45]/20 text-[#FDBA45] border-[#FDBA45]/30',
    'deployed': 'bg-[#16B36D]/20 text-[#16B36D] border-[#16B36D]/30',
  }
  return classMap[props.project.status] || 'bg-gray-100 text-gray-600 border-gray-300'
})

// 取得 Etherscan URL
const getEtherscanUrl = (address: string) => {
  return getAddressUrl(address)
}

// 格式化數字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

// 取得鏈上狀態文字
const getStatusText = (status?: number) => {
  if (status === undefined) return '募資中'
  const statusMap: Record<number, string> = {
    0: '募資中',
    1: '已完成',
    2: '已關閉',
  }
  return statusMap[status] || '募資中'
}

// 刷新鏈上資料
const handleRefreshData = async () => {
  if (!props.project.contract_address) return
  
  isRefreshing.value = true
  emit('refresh-data', props.project.contract_address)
  
  // 模擬載入時間
  setTimeout(() => {
    isRefreshing.value = false
  }, 1500)
}
</script>

