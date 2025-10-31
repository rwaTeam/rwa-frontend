<script setup lang="ts">
import { Wallet, Shield, FileCheck, DollarSign, ExternalLink, AlertCircle, CheckCircle } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import Badge from '~/components/ui/badge/Badge.vue'
import { useWeb3 } from '~/composables/useWeb3'
import { useToast } from '~/composables/useToast'
import { useWeb3Store } from '~/stores/web3'

interface InvestmentCardProps {
  expectedROI: number
  minInvestment: number
  projectId?: string
  isInDrawer?: boolean
}

const props = withDefaults(defineProps<InvestmentCardProps>(), {
  projectId: '1',
  isInDrawer: false
})

// 使用 Web3 composable
const {
  connectWallet,
  disconnectWallet,
  invest,
  isConnected,
  isCorrectNetwork,
  hasMetaMask,
  shortAccount,
  balance,
  error: web3Error,
  validateAmount,
  calculateReturn,
  getTransactionUrl,
} = useWeb3()

// 使用 Toast 通知
const toast = useToast()

// 使用 Web3 Store 來檢測 MetaMask
const web3Store = useWeb3Store()

// 在組件掛載時檢測 MetaMask
onMounted(() => {
  web3Store.checkMetaMask()
})

const investmentAmount = ref('')
const isInvesting = ref(false)
const investmentError = ref<string | null>(null)
const investmentSuccess = ref(false)
const txHash = ref<string | null>(null)
const showNetworkWarning = ref(false)

// 監聽網路狀態
watch(isCorrectNetwork, (correct) => {
  showNetworkWarning.value = isConnected.value && !correct
})

// 連接錢包處理
const handleConnectWallet = async () => {
  investmentError.value = null
  
  if (!hasMetaMask.value) {
    const errorMsg = '請先安裝 MetaMask 錢包擴充功能'
    investmentError.value = errorMsg
    toast.error(errorMsg)
    return
  }

  try {
    const success = await connectWallet()
    if (success) {
      toast.success('錢包連接成功！')
    } else {
      const errorMsg = '連接錢包失敗，請重試'
      investmentError.value = errorMsg
      toast.error(errorMsg)
    }
  } catch (error: any) {
    console.error('連接錢包失敗:', error)
    const errorMsg = error.message || '連接錢包失敗，請確保 MetaMask 已解鎖'
    investmentError.value = errorMsg
    toast.error(errorMsg)
  }
}

// 投資處理
const handleInvest = async () => {
  investmentError.value = null
  investmentSuccess.value = false
  txHash.value = null

  // 驗證金額
  const validation = validateAmount(investmentAmount.value, props.minInvestment)
  if (!validation.valid) {
    const errorMsg = validation.error || '金額驗證失敗'
    investmentError.value = errorMsg
    toast.error(errorMsg)
    return
  }

  isInvesting.value = true
  toast.info('正在處理交易，請在 MetaMask 中確認...')

  try {
    // 確保金額是字符串格式
    const amountStr = String(investmentAmount.value)
    
    const result = await invest(props.projectId, amountStr)
    
    if (result.success && result.txHash) {
      investmentSuccess.value = true
      txHash.value = result.txHash
      toast.success('投資成功！交易已提交到區塊鏈')
      
      // 5秒後清空表單
      setTimeout(() => {
        investmentAmount.value = ''
        investmentSuccess.value = false
      }, 5000)
    } else {
      const errorMsg = result.error || '投資失敗'
      investmentError.value = errorMsg
      toast.error(errorMsg)
    }
  } catch (error: any) {
    const errorMsg = error.message || '投資過程中發生錯誤'
    investmentError.value = errorMsg
    toast.error(errorMsg)
  } finally {
    isInvesting.value = false
  }
}

// 計算顯示的回報金額
const expectedReturn = computed(() => {
  if (!investmentAmount.value || parseFloat(investmentAmount.value) < props.minInvestment) {
    return '0.0000'
  }
  return calculateReturn(investmentAmount.value, props.expectedROI)
})

// 檢查是否可以投資
const canInvest = computed(() => {
  return (
    isConnected.value &&
    isCorrectNetwork.value &&
    investmentAmount.value &&
    parseFloat(investmentAmount.value) >= props.minInvestment &&
    !isInvesting.value
  )
})
</script>

<template>
  <div :class="{ 'sticky top-6': !isInDrawer }">
    <Card class="p-6 border-2 border-primary/20" :class="{ 'shadow-lg': !isInDrawer, 'border-0': isInDrawer }">
      <div class="mb-6">
        <h3 class="mb-4 text-secondary">
          立即投資
        </h3>
        
        <div class="flex gap-2 mb-4">
          <Badge variant="outline" class="text-primary border-primary">
            <Shield class="w-3 h-3 mr-1" />
            智能合約驗證
          </Badge>
          <Badge variant="outline" class="text-secondary border-secondary">
            <FileCheck class="w-3 h-3 mr-1" />
            保險支持
          </Badge>
        </div>
      </div>

      <!-- 未連接錢包 -->
      <div v-if="!isConnected">
        <div v-if="!hasMetaMask" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <p class="text-sm text-red-900 font-medium">未安裝 MetaMask</p>
              <p class="text-xs text-red-700 mt-1">
                請先安裝 MetaMask 錢包擴充功能
              </p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank"
                class="text-xs text-red-600 underline mt-1 inline-block"
              >
                前往下載 →
              </a>
            </div>
          </div>
        </div>

        <Button 
          class="w-full bg-primary hover:bg-accent text-white"
          size="lg"
          :disabled="!hasMetaMask"
          @click="handleConnectWallet"
        >
          <Wallet class="w-5 h-5 mr-2" />
          連結錢包
        </Button>

        <div v-if="investmentError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-900">{{ investmentError }}</p>
        </div>
      </div>
      
      <!-- 已連接錢包 -->
      <div v-else class="space-y-4">
        <!-- 網路警告 -->
        <div v-if="showNetworkWarning" class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-orange-600 mt-0.5" />
            <div>
              <p class="text-sm text-orange-900 font-medium">請切換到 Sepolia 測試網</p>
              <p class="text-xs text-orange-700 mt-1">
                此專案需要在 Sepolia 測試網上進行
              </p>
            </div>
          </div>
        </div>

        <!-- 錢包資訊 -->
        <div class="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 text-primary">
              <Wallet class="w-4 h-4" />
              <span class="text-sm font-medium">錢包已連接</span>
            </div>
            <Badge 
              :variant="isCorrectNetwork ? 'default' : 'destructive'" 
              class="text-xs"
            >
              {{ isCorrectNetwork ? 'Sepolia' : '錯誤網路' }}
            </Badge>
          </div>
          <p class="text-xs text-secondary/70 mb-1">
            地址：{{ shortAccount }}
          </p>
          <p class="text-xs text-secondary/70">
            餘額：{{ balance }} ETH
          </p>
        </div>

        <!-- 投資金額輸入 -->
        <div>
          <label for="investment-amount" class="text-sm font-medium text-secondary mb-2 block">
            投資金額 (ETH)
          </label>
          <div class="relative mt-2">
            <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60" />
            <Input
              id="investment-amount"
              v-model="investmentAmount"
              type="number"
              step="0.001"
              :placeholder="`最低 ${minInvestment} ETH`"
              class="pl-10 border-primary/30 focus:border-primary"
              :disabled="!isCorrectNetwork"
            />
          </div>
          <p class="text-xs text-secondary/60 mt-1">
            最低投資額：{{ minInvestment }} ETH
          </p>
        </div>

        <!-- 投資預覽 -->
        <div 
          v-if="investmentAmount && Number(investmentAmount) >= minInvestment" 
          class="p-4 bg-chart-3/10 rounded-lg border border-chart-3/30"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">投資金額</span>
            <span class="text-secondary font-medium">{{ investmentAmount }} ETH</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">預期 ROI</span>
            <span class="text-primary font-medium">{{ expectedROI }}%</span>
          </div>
          <div class="h-px bg-secondary/10 my-2" />
          <div class="flex justify-between items-center">
            <span class="text-secondary font-medium">預期回報</span>
            <span class="text-primary font-bold text-lg">
              {{ expectedReturn }} ETH
            </span>
          </div>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="investmentError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-red-600 mt-0.5" />
            <p class="text-sm text-red-900">{{ investmentError }}</p>
          </div>
        </div>

        <!-- 成功訊息 -->
        <div v-if="investmentSuccess && txHash" class="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start gap-2">
            <CheckCircle class="w-4 h-4 text-green-600 mt-0.5" />
            <div class="flex-1">
              <p class="text-sm text-green-900 font-medium">投資成功！</p>
              <a 
                :href="getTransactionUrl(txHash)" 
                target="_blank"
                class="text-xs text-green-700 hover:text-green-800 inline-flex items-center gap-1 mt-1"
              >
                查看交易 <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <!-- 投資按鈕 -->
        <Button
          class="w-full bg-primary hover:bg-accent text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          size="lg"
          :disabled="!canInvest"
          @click="handleInvest"
        >
          <span v-if="isInvesting">處理中...</span>
          <span v-else-if="!isCorrectNetwork">請切換到 Sepolia 網路</span>
          <span v-else>確認投資</span>
        </Button>

        <p class="text-xs text-center text-secondary/60">
          投資將通過智能合約執行，資金流向透明可追溯
        </p>
      </div>
    </Card>
  </div>
</template>

