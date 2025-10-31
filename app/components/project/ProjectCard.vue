<script setup lang="ts">
import { Shield, TrendingUp, Coins, MapPin, ExternalLink } from 'lucide-vue-next'
import Badge from '~/components/ui/badge/Badge.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import type { Project } from '~/types/project'

interface ProjectCardProps {
  project: Project
}

const props = defineProps<ProjectCardProps>()

const statusColors = {
  '開放中': 'bg-primary text-white',
  '已募資': 'bg-secondary text-white',
  '即將推出': 'bg-chart-3 text-secondary'
}
</script>

<template>
  <Card class="group overflow-hidden border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
    <!-- Project Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="project.image"
        :alt="project.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <Badge :class="`${statusColors[project.status]} border-0`">
          {{ project.status }}
        </Badge>
      </div>
      <!-- Insurance Badge -->
      <div
        v-if="project.insuranceCoverage"
        class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1"
      >
        <Shield class="w-3 h-3 text-primary" />
        <span class="text-xs text-secondary">{{ project.insuranceProvider }}</span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-5">
      <!-- Project Name -->
      <h3 class="text-secondary mb-1">
        {{ project.name }}
      </h3>
      
      <!-- Location -->
      <div class="flex items-center gap-1 text-gray-600 mb-3">
        <MapPin class="w-3.5 h-3.5" />
        <span class="text-sm">{{ project.location }}</span>
      </div>

      <!-- Crop Type Badge -->
      <Badge variant="outline" class="mb-4 border-primary text-primary">
        {{ project.cropType }}
      </Badge>

      <!-- Key Metrics -->
      <div class="space-y-3 mb-4">
        <!-- Expected ROI -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-600">
            <TrendingUp class="w-4 h-4 text-primary" />
            <span class="text-sm">預期年收益率</span>
          </div>
          <span class="text-primary">{{ project.expectedROI }}%</span>
        </div>

        <!-- Tokenized Share -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start gap-2 text-gray-600">
            <Coins class="w-4 h-4 text-primary mt-0.5" />
            <span class="text-sm">代幣化份額</span>
          </div>
          <span class="text-sm text-right text-secondary max-w-[50%]">
            {{ project.tokenizedShare }}
          </span>
        </div>

        <!-- Contract Address -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-gray-600">
            <ExternalLink class="w-4 h-4 text-primary" />
            <span class="text-sm">合約</span>
          </div>
          <span class="text-xs text-gray-500 font-mono truncate max-w-[50%]">
            {{ project.contractAddress }}
          </span>
        </div>
      </div>

      <!-- CTA Button -->
      <Button class="w-full bg-primary hover:bg-accent text-white transition-colors"
        @click="navigateTo(`/project/${project.id}`)"
      >
        查看詳情
      </Button>
    </div>
  </Card>
</template>

