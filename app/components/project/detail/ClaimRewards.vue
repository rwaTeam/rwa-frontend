<script setup lang="ts">
import { Gift, ExternalLink, Wallet, AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'
import { useWeb3 } from '~/composables/useWeb3'
import { useToast } from '~/composables/useToast'

interface ClaimRewardsProps {
  contractAddress: string
}

const props = defineProps<ClaimRewardsProps>()

const {
  isConnected,
  isCorrectNetwork,
  getPendingRewards,
  claimRewards,
  getTransactionUrl,
  connectWallet
} = useWeb3()

const toast = useToast()

const pendingRewards = ref('0')
const loading = ref(false)
const claiming = ref(false)
const claimSuccess = ref(false)
const claimTxHash = ref<string | null>(null)

// 載入待領取獎勵
const loadPendingRewards = async () => {
  if (!props.contractAddress || !isConnected.value) return
  
  loading.value = true
  try {
    const rewards = await getPendingRewards(props.contractAddress)
    pendingRewards.value = rewards
  } catch (error) {
    console.error('載入待領取獎勵失敗:', error)
  } finally {
    loading.value = false
  }
}

// 領取獎勵
const handleClaimRewards = async () => {
  if (!isConnected.value) {
    await connectWallet()
    return
  }

  if (!isCorrectNetwork.value) {
    toast.error('請切換到 Sepolia 測試網')
    return
  }

  claiming.value = true
  claimSuccess.value = false
  claimTxHash.value = null

  toast.info('正在領取獎勵，請在 MetaMask 中確認...')

  try {
    const result = await claimRewards(props.contractAddress)
    
    if (result.success && result.txHash) {
      claimSuccess.value = true
      claimTxHash.value = result.txHash
      toast.success('獎勵領取成功！')
      
      // 3秒後重新載入獎勵
      setTimeout(() => {
        loadPendingRewards()
        claimSuccess.value = false
        claimTxHash.value = null
      }, 3000)
    } else {
      toast.error(result.error || '領取失敗')
    }
  } catch (error: any) {
    console.error('領取獎勵失敗:', error)
    toast.error(error.message || '領取獎勵失敗')
  } finally {
    claiming.value = false
  }
}

// 組件掛載時載入
onMounted(() => {
  if (isConnected.value) {
    loadPendingRewards()
  }
})

// 監聽連接狀態
watch(isConnected, (connected) => {
  if (connected) {
    loadPendingRewards()
  }
})

// 是否有獎勵可領
const hasRewards = computed(() => {
  return parseFloat(pendingRewards.value) > 0
})

// 是否可以領取
const canClaim = computed(() => {
  return isConnected.value && isCorrectNetwork.value && hasRewards.value && !claiming.value
})
</script>

<template>
  <Card class="p-6 border-2 border-primary/10">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-secondary flex items-center gap-2">
        <Gift class="w-5 h-5 text-primary" />
        我的獎勵
      </h3>
    </div>

    <!-- 未連接錢包 -->
    <div v-if="!isConnected" class="text-center py-8">
      <Wallet class="w-12 h-12 text-secondary/30 mx-auto mb-3" />
      <p class="text-secondary/60 text-sm mb-4">連接錢包查看您的獎勵</p>
      <Button
        @click="connectWallet"
        class="bg-primary hover:bg-accent text-white"
      >
        <Wallet class="w-4 h-4 mr-2" />
        連接錢包
      </Button>
    </div>

    <!-- 已連接錢包 -->
    <div v-else class="space-y-4">
      <!-- 載入中 -->
      <div v-if="loading" class="text-center py-8">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p class="text-secondary/60 text-sm">載入中...</p>
      </div>

      <!-- 獎勵資訊 -->
      <div v-else>
        <!-- 待領取金額 -->
        <div class="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 mb-4">
          <p class="text-sm text-secondary/70 mb-2">待領取收益</p>
          <p class="text-3xl font-bold text-primary mb-1">
            {{ parseFloat(pendingRewards).toFixed(4) }}
            <span class="text-lg text-secondary/70">TWDT</span>
          </p>
          <p v-if="hasRewards" class="text-xs text-secondary/60">
            ≈ ${{ (parseFloat(pendingRewards) * 1).toFixed(2) }} USD
          </p>
        </div>

        <!-- 網路警告 -->
        <div v-if="!isCorrectNetwork" class="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
          <div class="flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-orange-600 mt-0.5" />
            <div>
              <p class="text-sm text-orange-900 font-medium">請切換到 Sepolia 測試網</p>
              <p class="text-xs text-orange-700 mt-1">
                領取獎勵需要在 Sepolia 網路上進行
              </p>
            </div>
          </div>
        </div>

        <!-- 成功訊息 -->
        <div v-if="claimSuccess && claimTxHash" class="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
          <div class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-green-600 mt-0.5" />
            <div class="flex-1">
              <p class="text-sm text-green-900 font-medium">領取成功！</p>
              <a 
                :href="getTransactionUrl(claimTxHash)" 
                target="_blank"
                class="text-xs text-green-700 hover:text-green-800 inline-flex items-center gap-1 mt-1"
              >
                查看交易 <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <!-- 領取按鈕 -->
        <Button
          v-if="hasRewards"
          @click="handleClaimRewards"
          :disabled="!canClaim"
          class="w-full bg-primary hover:bg-accent text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          size="lg"
        >
          <span v-if="claiming">領取中...</span>
          <span v-else-if="!isCorrectNetwork">請切換到 Sepolia 網路</span>
          <span v-else>
            <Gift class="w-5 h-5 mr-2 inline" />
            領取獎勵
          </span>
        </Button>

        <!-- 無獎勵提示 -->
        <div v-else class="text-center py-6">
          <Gift class="w-12 h-12 text-secondary/20 mx-auto mb-3" />
          <p class="text-secondary/60 text-sm">目前沒有可領取的獎勵</p>
          <p class="text-secondary/40 text-xs mt-1">
            當專案產生收益時，您將可以在這裡領取獎勵
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

