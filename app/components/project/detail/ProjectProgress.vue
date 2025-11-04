<script setup lang="ts">
import { TrendingUp, Users, CheckCircle } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Badge from '~/components/ui/badge/Badge.vue'
import { useProjectProgress } from '~/composables/useProjectProgress'

interface ProjectProgressProps {
  contractAddress: string
}

const props = defineProps<ProjectProgressProps>()

const { getProjectProgress, getStatusColor } = useProjectProgress()

// 進度資料
const progressData = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// 載入進度資料
const loadProgress = async () => {
  if (!props.contractAddress) return
  
  loading.value = true
  error.value = null
  try {
    const data = await getProjectProgress(props.contractAddress)
    if (data) {
      progressData.value = data
      error.value = null
    } else {
      error.value = '無法載入專案數據'
    }
  } catch (err: any) {
    console.error('載入進度失敗:', err)
    error.value = '合約數據載入失敗，該合約可能尚未部署'
  } finally {
    loading.value = false
  }
}

// 組件掛載時載入
onMounted(() => {
  loadProgress()
})

// 監聽合約地址變化
watch(() => props.contractAddress, () => {
  loadProgress()
})

// 狀態徽章變體
const statusVariant = computed(() => {
  if (!progressData.value) return 'default'
  const color = getStatusColor(progressData.value.status)
  switch (color) {
    case 'green':
      return 'default'
    case 'yellow':
      return 'outline'
    case 'red':
      return 'destructive'
    default:
      return 'secondary'
  }
})
</script>

<template>
  <Card class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-secondary flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-primary" />
        募資進度
      </h3>
      
      <Badge 
        v-if="progressData"
        :variant="statusVariant"
        class="text-sm"
      >
        {{ progressData.statusText }}
      </Badge>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="space-y-3">
      <div class="h-4 bg-secondary/10 rounded animate-pulse" />
      <div class="h-8 bg-secondary/10 rounded animate-pulse" />
    </div>

    <!-- 進度資料 -->
    <div v-else-if="progressData" class="space-y-4">
      <!-- 進度條 -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-secondary/70">
            已募資 {{ progressData.mintedNFTs }} / {{ progressData.totalNFTs }} NFT
          </span>
          <span class="text-lg font-bold text-primary">
            {{ progressData.percentage }}%
          </span>
        </div>
        
        <div class="h-3 bg-secondary/10 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            :style="{ width: `${progressData.percentage}%` }"
          />
        </div>
      </div>

      <!-- 統計資訊 -->
      <div class="grid grid-cols-2 gap-4 pt-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-secondary/60">已售出</p>
            <p class="text-lg font-semibold text-secondary">
              {{ progressData.mintedNFTs }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
            <CheckCircle class="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <p class="text-xs text-secondary/60">剩餘</p>
            <p class="text-lg font-semibold text-secondary">
              {{ progressData.remainingNFTs }}
            </p>
          </div>
        </div>
      </div>

      <!-- 售罄提示 -->
      <div 
        v-if="progressData.isSoldOut" 
        class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <p class="text-sm text-green-900 font-medium text-center">
          🎉 已完成募資！
        </p>
      </div>

      <!-- 狀態說明 -->
      <div v-if="progressData.status !== 1" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p class="text-sm text-orange-900">
          <span v-if="progressData.status === 2">
            ⚠️ 此專案目前僅允許提領收益，無法進行新投資
          </span>
          <span v-else-if="progressData.status === 3">
            🛑 此專案已停止運作
          </span>
        </p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="py-6">
      <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-orange-900 mb-1">
              無法載入專案數據
            </p>
            <p class="text-xs text-orange-700 mb-3">
              {{ error || '該合約地址上可能沒有部署合約，或合約版本與前端不匹配' }}
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
                  <li>合約已部署但版本不匹配</li>
                  <li>網路連接問題</li>
                </ul>
                <p class="mt-3 mb-1"><strong>建議操作:</strong></p>
                <ul class="list-disc list-inside space-y-1 ml-2">
                  <li>在 <a :href="`https://sepolia.etherscan.io/address/${contractAddress}`" target="_blank" class="text-orange-900 underline hover:text-orange-950">Etherscan</a> 上確認合約</li>
                  <li>聯繫專案管理員確認合約地址</li>
                  <li>稍後再試</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

