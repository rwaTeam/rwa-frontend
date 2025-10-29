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
          The Challenge
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          Taiwan's agriculture faces unprecedented challenges that threaten both farmers and food security
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
          <span class="text-primary">SafeHarvest Protocol</span>
        </div>
        <h2 class="text-4xl lg:text-5xl text-foreground mb-4">
          From Post-Disaster Relief to <span class="text-primary">Pre-Disaster Investment</span>
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          A paradigm shift in agricultural finance through blockchain-enabled infrastructure funding
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
    title: 'Climate Risk',
    description: 'Typhoons and extreme weather damage crops and infrastructure annually',
  },
  {
    icon: TrendingDown,
    title: 'Unstable Yields',
    description: 'Unpredictable harvests lead to income volatility for farmers',
  },
  {
    icon: DollarSign,
    title: 'Lack of Funding',
    description: 'Traditional finance excludes small farmers from infrastructure loans',
  },
]

const solutions = [
  {
    title: 'Pre-Disaster Investment',
    description: 'Build resilience before climate events occur',
    color: '#16B36D',
  },
  {
    title: 'Tokenized Revenue Rights',
    description: 'Convert future harvest into tradable assets',
    color: '#FDBA45',
  },
  {
    title: 'Insurance-Backed Security',
    description: 'Protect capital with collateralized coverage',
    color: '#1E3A5F',
  },
]
</script>

