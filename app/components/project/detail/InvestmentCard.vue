<script setup lang="ts">
import { Wallet, Shield, FileCheck, DollarSign } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import Badge from '~/components/ui/badge/Badge.vue'

interface InvestmentCardProps {
  expectedROI: number
  minInvestment: number
}

const props = defineProps<InvestmentCardProps>()

const isWalletConnected = ref(false)
const investmentAmount = ref('')
const isInvesting = ref(false)

const calculateReturn = (amount: number) => {
  return (amount * (1 + props.expectedROI / 100)).toFixed(2)
}

const handleConnectWallet = () => {
  isWalletConnected.value = true
}

const handleInvest = () => {
  isInvesting.value = true
  // 模擬投資交易
  setTimeout(() => {
    isInvesting.value = false
    alert('投資成功！')
  }, 2000)
}
</script>

<template>
  <div class="sticky top-6">
    <Card class="p-6 border-2 border-primary/20 shadow-lg">
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

      <div v-if="!isWalletConnected">
        <Button 
          class="w-full bg-primary hover:bg-accent text-white"
          size="lg"
          @click="handleConnectWallet"
        >
          <Wallet class="w-5 h-5 mr-2" />
          連結錢包
        </Button>
      </div>
      
      <div v-else class="space-y-4">
        <div class="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div class="flex items-center gap-2 text-primary">
            <Wallet class="w-4 h-4" />
            <span class="text-sm">錢包已連接</span>
          </div>
          <p class="text-xs text-secondary/60 mt-1">
            0x7f3d...8a2c
          </p>
        </div>

        <div>
          <label for="investment-amount" class="text-sm font-medium text-secondary mb-2 block">
            投資金額 (USDT)
          </label>
          <div class="relative mt-2">
            <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60" />
            <Input
              id="investment-amount"
              v-model="investmentAmount"
              type="number"
              :placeholder="`最低 ${minInvestment} USDT`"
              class="pl-10 border-primary/30 focus:border-primary"
            />
          </div>
          <p class="text-xs text-secondary/60 mt-1">
            最低投資額：{{ minInvestment }} USDT
          </p>
        </div>

        <div 
          v-if="investmentAmount && Number(investmentAmount) >= minInvestment" 
          class="p-4 bg-chart-3/10 rounded-lg border border-chart-3/30"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">投資金額</span>
            <span class="text-secondary">{{ investmentAmount }} USDT</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">預期 ROI</span>
            <span class="text-primary">{{ expectedROI }}%</span>
          </div>
          <div class="h-px bg-secondary/10 my-2" />
          <div class="flex justify-between items-center">
            <span class="text-secondary">預期回報</span>
            <span class="text-primary font-medium">
              {{ calculateReturn(Number(investmentAmount)) }} USDT
            </span>
          </div>
        </div>

        <Button
          class="w-full bg-primary hover:bg-accent text-white disabled:bg-gray-300"
          size="lg"
          :disabled="!investmentAmount || Number(investmentAmount) < minInvestment || isInvesting"
          @click="handleInvest"
        >
          {{ isInvesting ? '處理中...' : '確認投資' }}
        </Button>

        <p class="text-xs text-center text-secondary/60">
          投資將通過智能合約執行，資金流向透明可追溯
        </p>
      </div>
    </Card>
  </div>
</template>

