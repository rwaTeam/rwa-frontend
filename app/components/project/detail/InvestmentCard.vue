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
  projectId?: string
  isInDrawer?: boolean
  contractAddress?: string
  nftPrice: number
  totalNft: number
  mintedNft: number
}

const props = withDefaults(defineProps<InvestmentCardProps>(), {
  projectId: '1',
  isInDrawer: false,
  nftPrice: 0,
  totalNft: 0,
  mintedNft: 0
})

// 使用 Web3 composable（現在包含所有功能）
const {
  connectWallet,
  disconnectWallet,
  invest,
  isConnected,
  isCorrectNetwork,
  hasMetaMask,
  shortAccount,
  balance,
  tokenBalance,
  error: web3Error,
  validateAmount,
  calculateReturn,
  getTransactionUrl,
} = useWeb3()

// 使用 Toast 通知
const toast = useToast()

// 使用 Web3 Store（僅用於持久化，可選）
const web3Store = useWeb3Store()

// MetaMask 檢測已由 useWeb3 composable 處理（hasMetaMask）

const nftQuantity = ref(1)
const isInvesting = ref(false)
const investmentError = ref<string | null>(null)
const investmentSuccess = ref(false)
const txHash = ref<string | null>(null)
const showNetworkWarning = ref(false)

// 計算剩餘可購買的 NFT 數量
const availableNft = computed(() => {
  return Math.max(0, props.totalNft - props.mintedNft)
})

// 計算總 TWDT 金額
const totalAmount = computed(() => {
  return nftQuantity.value * props.nftPrice
})

// 監聽網路狀態
watch(isCorrectNetwork, (correct) => {
  showNetworkWarning.value = isConnected.value && !correct
})

// 增加 NFT 數量
const increaseQuantity = () => {
  if (nftQuantity.value < availableNft.value) {
    nftQuantity.value++
  }
}

// 減少 NFT 數量
const decreaseQuantity = () => {
  if (nftQuantity.value > 1) {
    nftQuantity.value--
  }
}

// 驗證 NFT 數量
const validateNftQuantity = () => {
  const quantity = nftQuantity.value
  
  if (!quantity || isNaN(quantity)) {
    return { valid: false, error: '請輸入有效的數量' }
  }
  
  if (quantity < 1) {
    return { valid: false, error: 'NFT 數量必須至少為 1' }
  }
  
  if (quantity > availableNft.value) {
    return { valid: false, error: `剩餘可購買數量：${availableNft.value} 份` }
  }
  
  // 檢查 TWDT 餘額
  const tokenBal = parseFloat(tokenBalance.value)
  const total = totalAmount.value
  if (total > tokenBal) {
    return { valid: false, error: `TWDT 餘額不足（當前餘額：${tokenBal.toFixed(2)}）` }
  }
  
  return { valid: true }
}

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
    const result = await connectWallet()
    if (result.success) {
      toast.success('錢包連接成功！')
    } else {
      const errorMsg = result.error || '連接錢包失敗，請重試'
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

  // 驗證 NFT 數量
  const validation = validateNftQuantity()
  if (!validation.valid) {
    const errorMsg = validation.error || '數量驗證失敗'
    investmentError.value = errorMsg
    toast.error(errorMsg)
    return
  }

  isInvesting.value = true
  toast.info('正在處理交易，請在 MetaMask 中確認...')

  try {
    if (!props.contractAddress) {
      throw new Error('缺少合約地址')
    }
    
    // 調用新的 invest 函數，傳入 NFT 數量和單價
    const result = await invest(
      props.projectId, 
      nftQuantity.value, 
      props.nftPrice, 
      props.contractAddress
    )
    
    if (result.success && result.txHash) {
      investmentSuccess.value = true
      txHash.value = result.txHash
      toast.success('投資成功！交易已提交到區塊鏈')
      
      // 同步 NFT 資料到後端
      try {
        await $fetch('/api/projects/syncNftData', {
          method: 'POST',
          body: {
            projectId: props.projectId
          }
        })
      } catch (syncError) {
        // 靜默記錄錯誤，不影響使用者體驗
        console.error('同步 NFT 資料失敗:', syncError)
      }
      
      // 5秒後清空表單
      setTimeout(() => {
        nftQuantity.value = 1
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
  if (nftQuantity.value < 1 || availableNft.value === 0) {
    return '0.0000'
  }
  const total = totalAmount.value
  const returnAmount = total * (1 + props.expectedROI / 100)
  return returnAmount.toFixed(4)
})

// 檢查是否可以投資
const canInvest = computed(() => {
  return (
    isConnected.value &&
    isCorrectNetwork.value &&
    nftQuantity.value >= 1 &&
    nftQuantity.value <= availableNft.value &&
    !isInvesting.value &&
    availableNft.value > 0
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
            餘額：{{ tokenBalance }} TWDT
          </p>
        </div>

        <!-- NFT 數量選擇 - 兩欄布局 (1:2 比例) -->
        <div class="grid grid-cols-5 gap-6 items-center">
          <!-- 左欄：NFT 價格資訊 (佔 1 份) -->
          <div class="col-span-2 flex flex-col justify-center items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-primary">$ {{ nftPrice }}</span>
              <span class="text-sm text-secondary/70">TWDT</span>
            </div>
            <span class="text-sm text-secondary/70 mt-2">每份 NFT 價格</span>
          </div>
          
          <!-- 右欄：購買數量操作 (佔 2 份) -->
          <div class="col-span-3">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-secondary">
                購買數量
              </label>
              <span class="text-xs text-secondary/60">
                剩餘 {{ availableNft }} / {{ totalNft }} 份
              </span>
            </div>
            <div class="flex items-center gap-3">
              <Button 
                @click="decreaseQuantity" 
                :disabled="nftQuantity <= 1 || !isCorrectNetwork"
                class="w-12 h-12 bg-primary hover:bg-accent text-white disabled:bg-gray-300 disabled:cursor-not-allowed text-xl font-bold flex-shrink-0"
              >
                -
              </Button>
              <Input
                v-model.number="nftQuantity"
                type="number"
                min="1"
                :max="availableNft"
                class="h-12 text-center text-lg font-semibold border-primary/30 focus:border-primary"
                :disabled="!isCorrectNetwork"
              />
              <Button 
                @click="increaseQuantity" 
                :disabled="nftQuantity >= availableNft || !isCorrectNetwork"
                class="w-12 h-12 bg-primary hover:bg-accent text-white disabled:bg-gray-300 disabled:cursor-not-allowed text-xl font-bold flex-shrink-0"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <!-- 投資預覽 -->
        <div 
          v-if="nftQuantity >= 1 && availableNft > 0" 
          class="p-4 bg-chart-3/10 rounded-lg border border-chart-3/30"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">購買數量</span>
            <span class="text-secondary font-medium">{{ nftQuantity }} 份 NFT</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">單價</span>
            <span class="text-secondary font-medium">{{ nftPrice }} TWDT</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">總金額</span>
            <span class="text-secondary font-semibold">{{ totalAmount.toFixed(4) }} TWDT</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">預期 ROI</span>
            <span class="text-primary font-medium">{{ expectedROI }}%</span>
          </div>
          <div class="h-px bg-secondary/10 my-2" />
          <div class="flex justify-between items-center">
            <span class="text-secondary font-medium">預期回報</span>
            <span class="text-primary font-bold text-lg">
              {{ expectedReturn }} TWDT
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
              <NuxtLink 
                to="/investor"
                class="text-xs text-green-700 hover:text-green-800 inline-flex items-center gap-1 mt-1"
              >
                查看交易 <ExternalLink class="w-3 h-3" />
              </NuxtLink>
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

