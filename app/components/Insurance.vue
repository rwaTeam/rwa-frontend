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
          <span class="text-primary">Capital Protection</span>
        </div>
        <h2 class="text-4xl lg:text-5xl text-white mb-4">
          Insurance-Backed Risk Management
        </h2>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          Every investment is protected through comprehensive insurance coverage from Taiwan's leading insurers
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
                <span class="text-white">Layer 1: Primary Insurance</span>
              </div>
              <p class="text-white/80 text-sm">
                Coverage for typhoon, flood, and crop failure events
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
                <span class="text-foreground">Layer 2: Smart Contract Escrow</span>
              </div>
              <p class="text-foreground/80 text-sm">
                Automated fund release based on oracle data verification
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
                <span class="text-white">Layer 3: Investor Protection</span>
              </div>
              <p class="text-white/80 text-sm">
                98% capital coverage with guaranteed claim settlement
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
          Trusted Insurance Partners
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
            <span class="text-2xl text-white/90">{{ partner.logo }}</span>
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
    title: 'Multi-Layer Protection',
    description: 'Insurance coverage backed by leading Taiwan insurers',
  },
  {
    icon: Lock,
    title: 'Collateralized Security',
    description: 'All investments secured with insurance collateral',
  },
  {
    icon: FileCheck,
    title: 'Smart Contract Automation',
    description: 'Automatic claim processing through oracle verification',
  },
]

const partners = [
  { name: 'Fubon Insurance', logo: 'Fubon' },
  { name: 'Cathay Insurance', logo: 'Cathay' },
  { name: 'Taiwan Insurance', logo: 'Taiwan' },
]
</script>

