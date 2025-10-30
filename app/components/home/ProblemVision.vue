<template>
  <section class="py-24 bg-muted">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Problems -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <h2 class="text-4xl lg:text-5xl text-foreground mb-4">
          面臨的挑戰
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          臺灣農業正面臨前所未有的挑戰，威脅農民生計與糧食安全
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-24">
        <div
          v-for="(challenge, i) in challenges"
          :key="i"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 100 } }"
          class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <component :is="challenge.icon" class="w-7 h-7 text-red-500" />
          </div>
          <h3 class="text-2xl text-foreground mb-3">
            {{ challenge.title }}
          </h3>
          <p class="text-foreground/70">
            {{ challenge.description }}
          </p>
        </div>
      </div>

      <!-- Vision -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <div class="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <Shield class="w-5 h-5 text-primary" />
          <span class="text-primary">SafeHarvest 協議</span>
        </div>
        <h2 class="text-4xl lg:text-5xl text-foreground mb-4">
          從災後救濟到<span class="text-primary">災前投資</span>
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          透過區塊鏈基礎建設資金，實現農業金融的典範轉移
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(solution, i) in solutions"
          :key="i"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 100 } }"
          class="relative bg-white rounded-3xl p-8 shadow-lg overflow-hidden group hover:shadow-2xl transition-all"
        >
          <div
            class="absolute top-0 left-0 w-2 h-full transition-all group-hover:w-full opacity-10"
            :style="{ backgroundColor: solution.color }"
          />
          <div class="relative z-10">
            <div class="text-5xl mb-4 opacity-20" :style="{ color: solution.color }">
              0{{ i + 1 }}
            </div>
            <h3 class="text-2xl text-foreground mb-3">
              {{ solution.title }}
            </h3>
            <p class="text-foreground/70">
              {{ solution.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CloudRain, TrendingDown, DollarSign, Shield } from 'lucide-vue-next'

const challenges = [
  {
    icon: CloudRain,
    title: '氣候風險',
    description: '颱風與極端天氣每年損害作物與基礎設施',
  },
  {
    icon: TrendingDown,
    title: '產量不穩',
    description: '難以預測的收成導致農民收入波動',
  },
  {
    icon: DollarSign,
    title: '資金不足',
    description: '傳統金融體系將小農排除於基礎建設貸款之外',
  },
]

const solutions = [
  {
    title: '災前投資',
    description: '在氣候災害發生前建立韌性',
    color: '#16B36D',
  },
  {
    title: '收益權代幣化',
    description: '將未來收成轉換為可交易資產',
    color: '#FDBA45',
  },
  {
    title: '保險背書安全性',
    description: '以擔保式保險機制保護資本',
    color: '#1E3A5F',
  },
]
</script>

