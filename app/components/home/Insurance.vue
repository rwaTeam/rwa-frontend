<template>
  <section class="py-24 bg-secondary relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <svg class="w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <div class="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
          <Shield class="w-5 h-5 text-primary" />
          <span class="text-primary">資本保障</span>
        </div>
        <h2 class="text-4xl lg:text-5xl text-white mb-4">
          保險支持的風險管理
        </h2>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          每筆投資皆由臺灣領先保險公司提供完整的保障護航
        </p>
      </div>

      <!-- Main Visual -->
      <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <!-- Left: Features -->
        <div class="space-y-6">
          <div
            v-for="(feature, i) in features"
            :key="i"
            v-motion
            :initial="{ opacity: 0, x: -30 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 600, delay: i * 100 } }"
            class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <component :is="feature.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl text-white mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-white/70">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual Diagram -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 600, delay: 300 } }"
          class="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
        >
          <div class="space-y-6">
            <!-- Layer 1 -->
            <div class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-2">
                <CheckCircle2 class="w-6 h-6 text-white" />
                <span class="text-white">第一層：主要保險</span>
              </div>
              <p class="text-white/80 text-sm">
                保障範圍涵蓋颱風、淹水與作物歉收等事件
              </p>
            </div>

            <!-- Arrow -->
            <div class="flex justify-center">
              <svg class="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-8 8h5v8h6v-8h5z" />
              </svg>
            </div>

            <!-- Layer 2 -->
            <div class="bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-2">
                <CheckCircle2 class="w-6 h-6 text-foreground" />
                <span class="text-foreground">第二層：智慧合約託管</span>
              </div>
              <p class="text-foreground/80 text-sm">
                依據預言機數據驗證，自動發放資金
              </p>
            </div>

            <!-- Arrow -->
            <div class="flex justify-center">
              <svg class="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-8 8h5v8h6v-8h5z" />
              </svg>
            </div>

            <!-- Layer 3 -->
            <div class="bg-gradient-to-r from-white/20 to-white/10 rounded-2xl p-6 border border-white/30">
              <div class="flex items-center gap-3 mb-2">
                <CheckCircle2 class="w-6 h-6 text-white" />
                <span class="text-white">第三層：投資者保護</span>
              </div>
              <p class="text-white/80 text-sm">
                98% 資本覆蓋率與保證理賠結算
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Insurance Partners -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
        class="text-center"
      >
        <p class="text-white/60 mb-8">
          可信賴的保險夥伴
        </p>
        <div class="flex flex-wrap justify-center items-center gap-12">
          <div
            v-for="(partner, i) in partners"
            :key="i"
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible-once="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 600 + i * 100 } }"
            class="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 hover:bg-white/15 transition-colors"
          >
            <span class="text-2xl text-white/90">{{ partner.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Shield, CheckCircle2, Lock, FileCheck } from 'lucide-vue-next'

const features = [
  {
    icon: Shield,
    title: '多層防護',
    description: '由臺灣領先的保險公司提供保障',
  },
  {
    icon: Lock,
    title: '擔保式安全',
    description: '所有投資均以保險擔保作為安全機制',
  },
  {
    icon: FileCheck,
    title: '智慧合約自動化',
    description: '透過預言機驗證，自動化理賠流程',
  },
]

const partners = [
  { name: '國泰', logo: 'Fubon' },
  { name: '富邦', logo: 'Cathay' },
  { name: '台產', logo: 'Taiwan' },
]
</script>

