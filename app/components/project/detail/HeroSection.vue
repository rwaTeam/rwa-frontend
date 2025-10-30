<script setup lang="ts">
import { MapPin, Calendar, TrendingUp } from 'lucide-vue-next'
import Badge from '~/components/ui/badge/Badge.vue'

interface HeroSectionProps {
  name: string
  cropType: string
  location: string
  startDate: string
  endDate: string
  expectedROI: number
  status: '開放中' | '已募資' | '即將推出'
  coverImage: string
}

const props = defineProps<HeroSectionProps>()

const statusColors = {
  '開放中': 'bg-primary text-white',
  '已募資': 'bg-chart-3 text-secondary',
  '即將推出': 'bg-secondary text-white',
}
</script>

<template>
  <div class="relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
    <img
      :src="coverImage"
      :alt="name"
      class="w-full h-full object-cover"
    >
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    
    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
      <div class="max-w-3xl">
        <Badge :class="`${statusColors[status]} mb-4 px-4 py-1 text-sm`">
          {{ status }}
        </Badge>
        
        <h1 class="text-5xl mb-4 text-white">
          {{ name }}
        </h1>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <p class="text-white/70 text-sm mb-1">
              作物種類
            </p>
            <p class="text-white">
              {{ cropType }}
            </p>
          </div>
          
          <div class="flex items-start gap-2">
            <MapPin class="w-4 h-4 mt-1 text-primary" />
            <div>
              <p class="text-white/70 text-sm mb-1">
                專案位置
              </p>
              <p class="text-white">
                {{ location }}
              </p>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <Calendar class="w-4 h-4 mt-1 text-chart-3" />
            <div>
              <p class="text-white/70 text-sm mb-1">
                專案期間
              </p>
              <p class="text-sm text-white">
                {{ startDate }} - {{ endDate }}
              </p>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <TrendingUp class="w-4 h-4 mt-1 text-primary" />
            <div>
              <p class="text-white/70 text-sm mb-1">
                預期 ROI
              </p>
              <p class="text-2xl text-primary">
                {{ expectedROI }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

