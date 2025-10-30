<script setup lang="ts">
import { Shield, AlertTriangle, FileText, CheckCircle2 } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Badge from '~/components/ui/badge/Badge.vue'
import Accordion from '~/components/ui/accordion/Accordion.vue'
import AccordionContent from '~/components/ui/accordion/AccordionContent.vue'
import AccordionItem from '~/components/ui/accordion/AccordionItem.vue'
import AccordionTrigger from '~/components/ui/accordion/AccordionTrigger.vue'

interface InsuranceProvider {
  name: string
  coverage: string
  logo: string
}

interface RiskInsuranceProps {
  providers: InsuranceProvider[]
  coverageDetails: string[]
  protocol: string
}

const props = defineProps<RiskInsuranceProps>()
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-secondary">
      保險與風險管理
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-primary/10 rounded-lg">
            <Shield class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 class="text-secondary">保險保障</h3>
            <p class="text-sm text-secondary/60">多重保險提供者支持</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(provider, index) in providers"
            :key="index"
            class="flex items-center justify-between p-4 bg-muted rounded-lg border border-primary/20"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-secondary/10">
                <span class="text-secondary text-2xl">{{ provider.logo }}</span>
              </div>
              <div>
                <p class="text-secondary font-medium">{{ provider.name }}</p>
                <p class="text-sm text-secondary/60">{{ provider.coverage }}</p>
              </div>
            </div>
            <CheckCircle2 class="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-chart-3/10 rounded-lg">
            <AlertTriangle class="w-6 h-6 text-chart-3" />
          </div>
          <div>
            <h3 class="text-secondary">風險保障細節</h3>
            <p class="text-sm text-secondary/60">完整覆蓋主要農業風險</p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(detail, index) in coverageDetails"
            :key="index"
            class="flex items-start gap-3"
          >
            <CheckCircle2 class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span class="text-secondary/80">{{ detail }}</span>
          </div>
        </div>
      </Card>
    </div>

    <Card class="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div class="flex items-start gap-4 mb-6">
        <div class="p-3 bg-white rounded-lg shadow-sm">
          <FileText class="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 class="mb-2 text-secondary">SafeHarvest Protocol</h3>
          <p class="text-secondary/80 leading-relaxed">{{ protocol }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-white rounded-lg">
          <Badge class="bg-primary/10 text-primary mb-2">自動化</Badge>
          <p class="text-sm text-secondary/70">
            智能合約自動觸發理賠流程
          </p>
        </div>
        <div class="p-4 bg-white rounded-lg">
          <Badge class="bg-secondary/10 text-secondary mb-2">透明化</Badge>
          <p class="text-sm text-secondary/70">
            所有理賠紀錄上鏈可查詢
          </p>
        </div>
        <div class="p-4 bg-white rounded-lg">
          <Badge class="bg-chart-3/10 text-chart-3 mb-2">即時性</Badge>
          <p class="text-sm text-secondary/70">
            24-48小時內完成理賠處理
          </p>
        </div>
      </div>
    </Card>

    <Accordion type="single" collapsible>
      <AccordionItem value="terms">
        <AccordionTrigger class="text-secondary">
          查看完整保險條款與細則
        </AccordionTrigger>
        <AccordionContent>
          <div class="p-4 bg-muted rounded-lg space-y-3 text-sm text-secondary/80">
            <p>
              <span class="font-medium">1. </span>保險範圍涵蓋自然災害（颱風、豪雨、乾旱）造成的作物損失。
            </p>
            <p>
              <span class="font-medium">2. </span>保險理賠金額根據實際損失程度，由第三方評估機構確認。
            </p>
            <p>
              <span class="font-medium">3. </span>理賠申請需在災害發生後 7 日內提出，並提供相關證明文件。
            </p>
            <p>
              <span class="font-medium">4. </span>智能合約將在理賠確認後 48 小時內自動執行資金分配。
            </p>
            <p>
              <span class="font-medium">5. </span>人為因素造成的損失不在保險理賠範圍內。
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>

