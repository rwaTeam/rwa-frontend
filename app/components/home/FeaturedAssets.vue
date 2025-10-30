<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <h2 class="text-4xl lg:text-5xl text-foreground mb-4">
          精選 RWA 資產
        </h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          投資具有透明指標與驗證產量的代幣化農業專案
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <div
          v-for="(asset, i) in assets"
          :key="i"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 200 } }"
          class="group bg-muted rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          <!-- Image -->
          <div class="relative h-64 overflow-hidden">
            <img
              :src="asset.image"
              :alt="asset.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-foreground to-transparent opacity-60" />

            <!-- Funding Progress -->
            <div class="absolute bottom-4 left-4 right-4">
              <div class="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-foreground/70">募資進度</span>
                  <span class="text-primary">{{ asset.funded }}%</span>
                </div>
                <div class="h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    v-motion
                    :initial="{ width: '0%' }"
                    :visible-once="{ 
                      width: `${asset.funded}%`,
                      transition: { duration: 1000, delay: i * 200 + 500 }
                    }"
                    class="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <Badge
                v-for="(tag, j) in asset.tags"
                :key="j"
                class="bg-primary/10 text-primary hover:bg-primary/20 border-none"
              >
                {{ tag }}
              </Badge>
            </div>

            <h3 class="text-2xl text-foreground mb-3">
              {{ asset.name }}
            </h3>

            <div class="flex items-center gap-2 text-foreground/70 mb-6">
              <MapPin class="w-4 h-4" />
              <span>{{ asset.location }}</span>
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-white rounded-xl p-4 text-center">
                <DollarSign class="w-5 h-5 text-primary mx-auto mb-2" />
                <div class="text-xs text-foreground/60 mb-1">
                  TVL 總鎖定價值
                </div>
                <div class="text-foreground">
                  {{ asset.tvl }}
                </div>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <TrendingUp class="w-5 h-5 text-accent mx-auto mb-2" />
                <div class="text-xs text-foreground/60 mb-1">
                  ROI 投資報酬率
                </div>
                <div class="text-foreground">
                  {{ asset.roi }}
                </div>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <Calendar class="w-5 h-5 text-secondary mx-auto mb-2" />
                <div class="text-xs text-foreground/60 mb-1">
                  Duration 投資期限
                </div>
                <div class="text-foreground">
                  {{ asset.duration }}
                </div>
              </div>
            </div>

            <!-- CTA -->
            <Button class="w-full bg-primary hover:bg-primary/90 text-white rounded-xl">
              查看專案詳情
            </Button>
          </div>
        </div>
      </div>

      <!-- View All CTA -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
        class="text-center"
      >
          <Button
            variant="outline"
            size="lg"
            class="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl px-8"
          >
          查看全部專案
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TrendingUp, MapPin, Calendar, DollarSign } from 'lucide-vue-next'
import Badge from '~/components/ui/badge/Badge.vue'
import Button from '~/components/ui/button/Button.vue'

const assets = [
  {
    name: '愛文芒果外銷專案',
    location: '臺南, 臺灣',
    image: 'https://images.unsplash.com/photo-1680008702821-e1b598db30f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjB0cm9waWNhbHxlbnwxfHx8fDE3NjE2NjM2NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tvl: '$180,000',
    roi: '12-15%',
    duration: '6 個月',
    funded: 85,
    tags: ['外銷等級', '保險擔保', '抗颱設施'],
  },
  {
    name: '有機葉菜網絡',
    location: '彰化, 臺灣',
    image: 'https://images.unsplash.com/photo-1718202125952-9f516926d854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGxlYXZlcyUyMG5hdHVyYWx8ZW58MXx8fHwxNzYxNjA0MjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tvl: '$95,000',
    roi: '10-12%',
    duration: '4 個月',
    funded: 62,
    tags: ['有機認證', '高科技溫室', 'ESG導向'],
  },
]
</script>

