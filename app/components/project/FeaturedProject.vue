<script setup lang="ts">
import { Shield, TrendingUp, Coins, MapPin, Star } from 'lucide-vue-next'
import Badge from '~/components/ui/badge/Badge.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import type { Project } from '~/types/project'

interface FeaturedProjectProps {
  project: Project
}

const props = defineProps<FeaturedProjectProps>()
</script>

<template>
  <Card class="overflow-hidden border-primary border-2 bg-gradient-to-br from-primary/5 to-[#A4E2C2]/10 mb-12">
    <div class="grid md:grid-cols-2 gap-0">
      <!-- Image Section -->
      <div class="relative h-80 md:h-full">
        <img
          :src="project.image"
          :alt="project.name"
          class="w-full h-full object-cover"
        >
        <!-- Spotlight Badge -->
        <div class="absolute top-4 left-4 bg-chart-3 text-secondary px-3 py-1.5 rounded-full flex items-center gap-2">
          <Star class="w-4 h-4 fill-current" />
          <span class="text-sm">精選專案</span>
        </div>
        <!-- Insurance Badge -->
        <div
          v-if="project.insuranceCoverage"
          class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center gap-2"
        >
          <Shield class="w-4 h-4 text-primary" />
          <span class="text-sm text-secondary">{{ project.insuranceProvider }}</span>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-8 md:p-10 flex flex-col justify-center">
        <!-- Status Badge -->
        <Badge class="w-fit mb-4 bg-primary text-white border-0">
          {{ project.status }}
        </Badge>

        <!-- Project Name -->
        <h2 class="text-secondary mb-3">
          {{ project.name }}
        </h2>

        <!-- Location -->
        <div class="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin class="w-4 h-4" />
          <span>{{ project.location }}</span>
        </div>

        <!-- Description -->
        <p class="text-gray-700 mb-6">
          高品質出口級{{ project.cropType }}農場，擁有經過驗證的永續農業實踐和機構級保險保障。此專案提供代幣化方式存取未來收益流，並以透明的鏈上結算機制運作。
        </p>

        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-2 gap-6 mb-8">
          <!-- Expected ROI -->
          <div>
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <TrendingUp class="w-5 h-5 text-primary" />
              <span class="text-sm">預期年收益率</span>
            </div>
            <div class="text-primary">
              {{ project.expectedROI }}%
            </div>
          </div>

          <!-- Tokenized Share -->
          <div>
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <Coins class="w-5 h-5 text-primary" />
              <span class="text-sm">代幣化份額</span>
            </div>
            <div class="text-secondary text-sm">
              {{ project.tokenizedShare }}
            </div>
          </div>
        </div>

        <!-- Crop Type Badge -->
        <div class="mb-6">
          <Badge variant="outline" class="border-primary text-primary">
            {{ project.cropType }}
          </Badge>
        </div>

        <!-- Contract Address -->
        <div class="mb-6 p-4 bg-white/60 rounded-lg border border-gray-200">
          <span class="text-xs text-gray-600 block mb-1">智能合約</span>
          <span class="text-xs font-mono text-secondary">{{ project.contractAddress }}</span>
        </div>

        <!-- CTA Buttons -->
        <div class="flex gap-3">
          <Button class="flex-1 bg-primary hover:bg-accent text-white">
            立即投資
          </Button>
          <Button variant="outline" class="flex-1 border-secondary text-secondary hover:bg-secondary/5" @click="navigateTo(`/project/${project.id}`)">
            查看詳情
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

