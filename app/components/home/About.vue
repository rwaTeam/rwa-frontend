<template>
  <section class="py-24 bg-gradient-to-b from-muted to-white relative overflow-hidden">
    <!-- Background Leaf Pattern -->
    <div class="absolute right-0 top-1/2 -translate-y-1/2 opacity-5">
      <svg width="400" height="400" viewBox="0 0 200 200" class="fill-primary">
        <path d="M100 20 Q 150 60 140 120 Q 130 180 100 180 Q 70 180 60 120 Q 50 60 100 20" />
      </svg>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Content -->
        <div
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          class="space-y-8"
        >
          <div>
            <div class="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Leaf class="w-5 h-5 text-primary" />
              <span class="text-primary">關於 GreenFi Labs</span>
            </div>
            <h2 class="text-4xl lg:text-5xl text-foreground mb-6">
              打造<span class="text-primary">農業金融</span>的未來
            </h2>
            <p class="text-xl text-foreground/70 leading-relaxed mb-6">
              GreenFi Labs 開創去中心化金融與永續農業的交會點。我們的 SafeHarvest 協議結合區塊鏈透明度與真實世界的農業基礎建設，創造具韌性且獲利的農業生態系統。
            </p>
            <p class="text-lg text-foreground/70 leading-relaxed">
              我們相信科技應該賦能自然，而非取代自然。透過代幣化未來農業收益權，我們讓農民無需負債即可取得資金，同時為投資者提供透明、符合 ESG 且由實體資產支持的投資機會。
            </p>
          </div>

          <!-- Mission Points -->
          <div class="space-y-4">
            <div
              v-for="(item, i) in missionPoints"
              :key="i"
              v-motion
              :initial="{ opacity: 0, x: -20 }"
              :visible-once="{ opacity: 1, x: 0, transition: { duration: 400, delay: i * 100 } }"
              class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-md"
            >
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <component :is="item.icon" class="w-6 h-6 text-primary" />
              </div>
              <p class="text-foreground/80 pt-2">
                {{ item.text }}
              </p>
            </div>
          </div>

          <Button
            size="lg"
            variant="outline"
            class="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-xl group"
          >
            <FileText class="mr-2 w-5 h-5" />
            閱讀白皮書
          </Button>
        </div>

        <!-- Right: Visual Stats -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 600, delay: 200 } }"
          class="space-y-6"
        >
          <!-- Main Image Card -->
          <div class="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1761455953103-788d1018f174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjBtb2Rlcm58ZW58MXx8fHwxNzYxNjYzNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="永續農業"
              class="w-full h-96 object-cover"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent" />
            <div class="absolute bottom-6 left-6 right-6">
              <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <div class="text-3xl text-primary mb-1">
                      500+
                    </div>
              <div class="text-sm text-foreground/70">
                      受保護公頃數
                    </div>
                  </div>
                  <div>
                    <div class="text-3xl text-accent mb-1">
                      2,800
                    </div>
              <div class="text-sm text-foreground/70">
                      受支持農民
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Impact Metrics -->
          <div class="grid grid-cols-2 gap-6">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: 400 } }"
              class="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white"
            >
              <div class="text-3xl mb-2">
                $8.2M
              </div>
              <div class="text-sm text-white/90">
                基礎建設資金
              </div>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: 500 } }"
              class="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-white"
            >
              <div class="text-3xl mb-2">
                13.2%
              </div>
              <div class="text-sm text-white/90">
                平均年回報率
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileText, Leaf, Target } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'

const missionPoints = [
  {
    icon: Target,
    text: '使命：透過 Web3 創新加速氣候韌性農業',
  },
  {
    icon: Leaf,
    text: '願景：讓永續農業成為最具獲利的選擇',
  },
]
</script>

