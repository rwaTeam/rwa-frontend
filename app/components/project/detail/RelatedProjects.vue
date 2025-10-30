<script setup lang="ts">
import { MapPin, TrendingUp, Calendar } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import Button from '~/components/ui/button/Button.vue'
import Badge from '~/components/ui/badge/Badge.vue'

interface Project {
  id: string
  name: string
  cropType: string
  location: string
  roi: number
  duration: string
  status: '開放中' | '已募資' | '即將推出'
  image: string
}

interface RelatedProjectsProps {
  projects: Project[]
}

const props = defineProps<RelatedProjectsProps>()

const statusColors = {
  '開放中': 'bg-primary text-white',
  '已募資': 'bg-chart-3 text-secondary',
  '即將推出': 'bg-secondary text-white',
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-secondary">
        相關投資專案
      </h2>
      <NuxtLink to="/project/list">
        <Button variant="outline" class="border-primary text-primary hover:bg-primary/10">
          查看全部專案
        </Button>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="project in projects"
        :key="project.id"
        :to="`/project/${project.id}`"
      >
        <Card class="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
          <div class="relative h-48">
            <img
              :src="project.image"
              :alt="project.name"
              class="w-full h-full object-cover"
            >
            <Badge :class="`absolute top-3 right-3 ${statusColors[project.status]}`">
              {{ project.status }}
            </Badge>
          </div>

          <div class="p-4">
            <h4 class="mb-2 text-secondary">
              {{ project.name }}
            </h4>
            <p class="text-sm text-secondary/70 mb-4">
              {{ project.cropType }}
            </p>

            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-secondary/70">
                <MapPin class="w-4 h-4" />
                {{ project.location }}
              </div>
              <div class="flex items-center gap-2 text-sm text-secondary/70">
                <Calendar class="w-4 h-4" />
                {{ project.duration }}
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-secondary/10">
              <div class="flex items-center gap-1">
                <TrendingUp class="w-4 h-4 text-primary" />
                <span class="text-primary font-medium">{{ project.roi }}% ROI</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                class="text-primary hover:bg-primary/10"
              >
                查看詳情
              </Button>
            </div>
          </div>
        </Card>
      </NuxtLink>
    </div>
  </section>
</template>

