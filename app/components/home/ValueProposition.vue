<template>
  <section class="py-24 bg-gradient-to-b from-muted to-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-20"
      >
        <h2 class="text-4xl lg:text-5xl text-foreground mb-4">
          三方共贏
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          為永續農業生態系中的每位參與者創造價值
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <div
          v-for="(stakeholder, i) in stakeholders"
          :key="i"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 150 } }"
          class="group"
        >
          <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <!-- Image Header -->
            <div class="relative h-48 overflow-hidden">
              <div
                class="absolute inset-0 opacity-60"
                :style="{ backgroundColor: stakeholder.color }"
              />
              <img
                :src="stakeholder.image"
                :alt="stakeholder.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-xl">
                  <component :is="stakeholder.icon" class="w-10 h-10" :style="{ color: stakeholder.color }" />
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-8">
              <h3 class="text-2xl text-foreground mb-6 text-center">
                {{ stakeholder.title }}
              </h3>
              <ul class="space-y-4">
                <li
                  v-for="(benefit, j) in stakeholder.benefits"
                  :key="j"
                  v-motion
                  :initial="{ opacity: 0, x: -20 }"
                  :visible-once="{ opacity: 1, x: 0, transition: { duration: 400, delay: i * 150 + j * 100 } }"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    :style="{ backgroundColor: `${stakeholder.color}20` }"
                  >
                    <svg
                      class="w-4 h-4"
                      :style="{ color: stakeholder.color }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-foreground/80">{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Impact Statement -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
        class="mt-16 text-center"
      >
        <div class="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white">
          <p class="text-2xl lg:text-3xl mb-6 leading-relaxed">
            「結合金融誘因與環境永續，我們為社區與地球創造長遠影響。」
          </p>
          <div class="flex items-center justify-center gap-2 text-white/80">
            <div class="w-12 h-0.5 bg-white/50" />
            <span>GreenFi Labs 使命</span>
            <div class="w-12 h-0.5 bg-white/50" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Users, TrendingUp, Globe } from 'lucide-vue-next'

const stakeholders = [
  {
    icon: Users,
    title: '對農民',
    color: '#16B36D',
    benefits: [
      '零前期基礎設施成本',
      '採用收成後才分潤的模式',
      '提供氣候災害保護',
      '取得現代化農業技術',
    ],
    image: 'https://images.unsplash.com/photo-1680725659623-0b1f36187924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzYxNjIwMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    icon: TrendingUp,
    title: '對投資者',
    color: '#1E3A5F',
    benefits: [
      '保險擔保的投資安全性',
      '透明的鏈上收益追蹤',
      '多元化農業投資組合',
      '符合 ESG 的影響力投資',
    ],
    image: 'https://images.unsplash.com/photo-1644343262170-e40d72e19a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neSUyMG5ldHdvcmt8ZW58MXx8fHwxNzYxNTg0MzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    icon: Globe,
    title: '對生態系',
    color: '#FDBA45',
    benefits: [
      '強化糧食供應鏈',
      '加速氣候調適',
      '帶動鄉村經濟發展',
      '擴大永續農業規模',
    ],
    image: 'https://images.unsplash.com/photo-1761455953103-788d1018f174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjBtb2Rlcm58ZW58MXx8fHwxNzYxNjYzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
]
</script>

