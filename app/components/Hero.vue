<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/70 to-primary/60 z-10" />
      <img
        src="https://images.unsplash.com/photo-1568085609104-9aa98df4c87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWl3YW4lMjBmYXJtbGFuZCUyMGFlcmlhbHxlbnwxfHx8fDE3NjE2NjM2NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Taiwan Farmland"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Blockchain Node Overlay Animation -->
    <div class="absolute inset-0 z-20 pointer-events-none">
      <svg class="w-full h-full opacity-20">
        <circle
          v-for="i in 8"
          :key="`circle-${i}`"
          :cx="`${(i - 1) * 15 + 10}%`"
          :cy="`${((i - 1) % 3) * 30 + 20}%`"
          r="3"
          class="fill-accent"
          v-motion
          :initial="{ opacity: 0, scale: 0 }"
          :enter="{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0],
            transition: {
              duration: 3000,
              repeat: Infinity,
              delay: (i - 1) * 300,
            }
          }"
        />
        <line
          v-for="i in 12"
          :key="`line-${i}`"
          :x1="`${(i - 1) * 10 + 10}%`"
          :y1="`${((i - 1) % 4) * 25}%`"
          :x2="`${(i - 1) * 10 + 25}%`"
          :y2="`${(i % 4) * 25 + 20}%`"
          class="stroke-primary"
          stroke-width="1"
          v-motion
          :initial="{ pathLength: 0, opacity: 0 }"
          :enter="{ 
            pathLength: 1, 
            opacity: [0, 0.5, 0],
            transition: {
              duration: 4000,
              repeat: Infinity,
              delay: (i - 1) * 200,
            }
          }"
        />
      </svg>
    </div>

    <!-- Content -->
    <div class="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="space-y-8"
      >
        <!-- Logo/Brand -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 200 } }"
          class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
        >
          <Leaf class="w-6 h-6 text-primary" />
          <span class="text-white tracking-wider">GreenFi Labs</span>
        </div>

        <h1
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 300 } }"
          class="text-5xl lg:text-7xl text-white max-w-5xl mx-auto leading-tight"
        >
          Invest in the future of <span class="text-primary">sustainable agriculture</span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 500 } }"
          class="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
        >
          GreenFi Labs connects global capital with Taiwan's resilient farming through tokenized real-world assets.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 700 } }"
          class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Button
            size="lg"
            class="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full group shadow-lg shadow-primary/30"
          >
            Explore Projects
            <ArrowRight class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-6 rounded-full backdrop-blur-sm bg-white/10"
          >
            Learn How It Works
          </Button>
        </div>

        <!-- Stats -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 900 } }"
          class="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto"
        >
          <div
            v-for="(stat, i) in stats"
            :key="i"
            class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <div class="text-3xl text-white">
              {{ stat.value }}
            </div>
            <div class="text-sm text-white/80 mt-1">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Leaf, ArrowRight } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'

const stats = [
  { value: '$2.4M+', label: 'Total Value Locked' },
  { value: '120+', label: 'Farming Projects' },
  { value: '98%', label: 'Insurance Coverage' },
]
</script>

