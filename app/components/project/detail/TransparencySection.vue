<script setup lang="ts">
import { ExternalLink, Activity, Users, DollarSign, Shield } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'

interface Transaction {
  type: string
  amount: string
  date: string
  status: 'completed' | 'pending'
}

interface TransparencySectionProps {
  contractAddress: string
  transactions: Transaction[]
}

const props = defineProps<TransparencySectionProps>()

const fundFlowSteps = [
  { icon: Users, label: '投資人', color: '#16B36D' },
  { icon: Activity, label: '智能合約', color: '#1E3A5F' },
  { icon: DollarSign, label: '農夫', color: '#16B36D' },
  { icon: Shield, label: '保險池', color: '#FDBA45' },
  { icon: Users, label: '收益回流', color: '#16B36D' },
]
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-secondary">
      資金流與監管透明度
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="p-6">
        <h3 class="mb-6 text-secondary">
          區塊鏈資訊
        </h3>
        
        <div class="space-y-4">
          <div>
            <p class="text-sm text-secondary/60 mb-2">
              智能合約地址
            </p>
            <div class="flex items-center gap-2 p-3 bg-muted rounded-lg border border-primary/20">
              <code class="flex-1 text-sm text-secondary break-all font-mono">
                {{ contractAddress }}
              </code>
              <Button
                variant="ghost"
                size="sm"
                class="flex-shrink-0 text-primary hover:text-primary hover:bg-primary/10"
              >
                <ExternalLink class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div class="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
            <div class="flex items-center gap-2 mb-3">
              <Activity class="w-5 h-5 text-primary" />
              <h4 class="text-secondary">區塊鏈驗證</h4>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-secondary/60 mb-1">網絡</p>
                <p class="text-secondary">Polygon</p>
              </div>
              <div>
                <p class="text-secondary/60 mb-1">區塊確認</p>
                <p class="text-primary">✓ 已驗證</p>
              </div>
              <div>
                <p class="text-secondary/60 mb-1">審計狀態</p>
                <p class="text-primary">✓ 已審計</p>
              </div>
              <div>
                <p class="text-secondary/60 mb-1">安全評級</p>
                <p class="text-primary">A+</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <h3 class="mb-6 text-secondary">
          交易紀錄
        </h3>
        <div class="space-y-3 max-h-[300px] overflow-y-auto">
          <div
            v-for="(tx, index) in transactions"
            :key="index"
            class="flex items-center justify-between p-3 bg-muted rounded-lg border border-secondary/10"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-sm text-secondary">{{ tx.type }}</p>
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    tx.status === 'completed'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-chart-3/10 text-chart-3'
                  ]"
                >
                  {{ tx.status === 'completed' ? '已完成' : '處理中' }}
                </span>
              </div>
              <p class="text-xs text-secondary/60">{{ tx.date }}</p>
            </div>
            <p class="text-primary font-medium">{{ tx.amount }}</p>
          </div>
        </div>
      </Card>
    </div>

    <Card class="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-chart-3/10">
      <h3 class="text-center mb-8 text-secondary">
        資金分配流程
      </h3>
      
      <div class="flex items-center justify-between relative">
        <!-- Connection Lines -->
        <div class="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
        
        <div
          v-for="(step, index) in fundFlowSteps"
          :key="index"
          class="relative z-10 flex flex-col items-center flex-1"
        >
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg"
            :style="{
              backgroundColor: `${step.color}15`,
              border: `2px solid ${step.color}`,
            }"
          >
            <component
              :is="step.icon"
              class="w-7 h-7"
              :style="{ color: step.color }"
            />
          </div>
          <p class="text-sm text-center max-w-[80px] text-secondary">
            {{ step.label }}
          </p>
        </div>
      </div>
      
      <div class="mt-8 p-4 bg-white rounded-lg text-center">
        <p class="text-sm text-secondary/80">
          所有資金流向均記錄在區塊鏈上，投資人可隨時追蹤並驗證交易透明度
        </p>
      </div>
    </Card>
  </section>
</template>

