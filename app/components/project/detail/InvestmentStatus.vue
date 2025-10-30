<script setup lang="ts">
import { TrendingUp, Calendar, Award } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'
import Badge from '~/components/ui/badge/Badge.vue'

interface InvestmentStatusProps {
  hasInvested: boolean
  investmentAmount: number
  estimatedROI: number
  projectProgress: number
  expectedReturnDate: string
  claimableRewards: number
}

const props = defineProps<InvestmentStatusProps>()
</script>

<template>
  <section v-if="hasInvested" class="space-y-6">
    <Card class="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-secondary mb-1">
            您的投資狀態
          </h2>
          <p class="text-sm text-secondary/60">
            追蹤您的投資進度與預期收益
          </p>
        </div>
        <Badge class="bg-primary text-white px-4 py-1">
          投資中
        </Badge>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="p-4 bg-white rounded-lg border border-primary/20">
          <div class="flex items-center gap-2 mb-2">
            <TrendingUp class="w-4 h-4 text-primary" />
            <span class="text-sm text-secondary/70">投資金額</span>
          </div>
          <p class="text-2xl text-primary">
            ${{ investmentAmount.toLocaleString() }}
          </p>
        </div>

        <div class="p-4 bg-white rounded-lg border border-primary/20">
          <div class="flex items-center gap-2 mb-2">
            <Award class="w-4 h-4 text-chart-3" />
            <span class="text-sm text-secondary/70">預期收益</span>
          </div>
          <p class="text-2xl text-chart-3">
            ${{ (investmentAmount * (1 + estimatedROI / 100)).toFixed(2) }}
          </p>
        </div>

        <div class="p-4 bg-white rounded-lg border border-primary/20">
          <div class="flex items-center gap-2 mb-2">
            <Calendar class="w-4 h-4 text-secondary" />
            <span class="text-sm text-secondary/70">預計回收日期</span>
          </div>
          <p class="text-lg text-secondary">
            {{ expectedReturnDate }}
          </p>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-secondary/70">專案進度</span>
          <span class="text-sm text-primary">{{ projectProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-primary to-chart-3 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${projectProgress}%` }"
          />
        </div>
      </div>

      <div class="flex items-center justify-between p-4 bg-white rounded-lg">
        <div>
          <p class="text-sm text-secondary/70 mb-1">
            可領取獎勵
          </p>
          <p class="text-xl text-primary">
            ${{ claimableRewards.toLocaleString() }}
          </p>
        </div>
        <Button
          :disabled="claimableRewards === 0"
          class="bg-primary hover:bg-accent text-white disabled:bg-gray-300"
        >
          {{ claimableRewards === 0 ? '暫無可領取' : '領取獎勵' }}
        </Button>
      </div>
    </Card>
  </section>
</template>

