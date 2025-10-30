<script setup lang="ts">
import { Award, MapPin, CheckCircle2 } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'

interface FarmerProfileProps {
  name: string
  region: string
  experience: string
  projectsCompleted: number
  reputation: number
  image: string
}

const props = defineProps<FarmerProfileProps>()
</script>

<template>
  <Card class="p-6">
    <div class="flex items-start gap-4">
      <img
        :src="image"
        :alt="name"
        class="w-20 h-20 rounded-full object-cover border-2 border-primary"
      >
      
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h4 class="text-secondary">
            {{ name }}
          </h4>
          <CheckCircle2 class="w-5 h-5 text-primary" />
        </div>
        
        <div class="flex items-center gap-4 text-sm text-secondary/70 mb-3">
          <div class="flex items-center gap-1">
            <MapPin class="w-4 h-4" />
            {{ region }}
          </div>
          <div class="flex items-center gap-1">
            <Award class="w-4 h-4" />
            {{ experience }}
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-primary/10 rounded-lg">
            <p class="text-sm text-secondary/70 mb-1">
              完成專案
            </p>
            <p class="text-primary font-medium">
              {{ projectsCompleted }} 項
            </p>
          </div>
          
          <div class="p-3 bg-chart-3/10 rounded-lg">
            <p class="text-sm text-secondary/70 mb-1">
              信譽評分
            </p>
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-chart-3 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${reputation}%` }"
                />
              </div>
              <span class="text-chart-3 font-medium text-sm">{{ reputation }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

