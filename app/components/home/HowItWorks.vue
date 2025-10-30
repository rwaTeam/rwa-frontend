<template>
  <section class="py-24 bg-white relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute inset-0 [background-image:radial-gradient(circle_at_2px_2px,var(--primary)_1px,transparent_0)] bg-[length:40px_40px]"
      />
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-20"
      >
        <h2 class="text-4xl lg:text-5xl text-foreground mb-4">
          運作方式
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          從投資到收益的透明自動化流程
        </p>
      </div>

      <div class="relative">
        <!-- Connection Lines -->
        <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
          <div
            v-motion
            :initial="{ scaleX: 0 }"
            :visible-once="{ scaleX: 1, transition: { duration: 1500, delay: 500 } }"
            class="h-full bg-gradient-to-r from-secondary via-primary to-accent opacity-20 rounded-full origin-left"
          />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          <div
            v-for="(step, i) in steps"
            :key="i"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 150 } }"
            class="relative"
          >
            <div class="bg-muted rounded-3xl p-8 h-full hover:shadow-xl transition-shadow">
              <!-- Step Number -->
              <div
                class="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                :style="{ backgroundColor: step.color }"
              >
                <span class="text-white text-xl">{{ i + 1 }}</span>
              </div>

              <!-- Icon -->
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform hover:scale-110"
                :style="{ backgroundColor: `${step.color}15` }"
              >
                <component :is="step.icon" class="w-8 h-8" :style="{ color: step.color }" />
              </div>

              <!-- Content -->
              <h3 class="text-2xl text-foreground mb-3">
                {{ step.title }}
              </h3>
              <p class="text-foreground/70 leading-relaxed">
                {{ step.description }}
              </p>
            </div>

            <!-- Arrow for mobile -->
            <div v-if="i < steps.length - 1" class="lg:hidden flex justify-center my-4">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Blockchain Trust Badge -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 800 } }"
        class="mt-16 text-center"
      >
        <div class="inline-flex items-center gap-4 bg-gradient-to-r from-secondary to-primary px-8 py-4 rounded-full text-white shadow-lg">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" stroke-width="2" />
            <rect x="14" y="3" width="7" height="7" stroke-width="2" />
            <rect x="14" y="14" width="7" height="7" stroke-width="2" />
            <rect x="3" y="14" width="7" height="7" stroke-width="2" />
          </svg>
          <span>以區塊鏈透明度與智慧合約自動化為後盾</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Wallet, Sprout, Radio, Coins } from 'lucide-vue-next'

const steps = [
  {
    icon: Wallet,
    title: '資金投入',
    description: '投資人透過智慧合約為代幣化的農業專案提供資金',
    color: '#1E3A5F',
  },
  {
    icon: Sprout,
    title: '建置設施',
    description: '資金用於建造抗氣候基礎設施，例如抗颱溫室',
    color: '#16B36D',
  },
  {
    icon: Radio,
    title: '預言機驗證',
    description: '透過 IoT 感測器與預言機網路驗證即時收成數據',
    color: '#FDBA45',
  },
  {
    icon: Coins,
    title: '收益分配',
    description: '根據實際產量自動分配收益給代幣持有者',
    color: '#16B36D',
  },
]
</script>

