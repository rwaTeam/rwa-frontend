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
              <span class="text-primary">About GreenFi Labs</span>
            </div>
            <h2 class="text-4xl lg:text-5xl text-foreground mb-6">
              Building the Future of <span class="text-primary">AgriFinance</span>
            </h2>
            <p class="text-xl text-foreground/70 leading-relaxed mb-6">
              GreenFi Labs is pioneering the intersection of decentralized finance and sustainable agriculture. Our SafeHarvest Protocol combines blockchain transparency with real-world agricultural infrastructure to create resilient, profitable farming ecosystems.
            </p>
            <p class="text-lg text-foreground/70 leading-relaxed">
              We believe that technology should empower nature, not replace it. By tokenizing future agricultural revenue rights, we enable farmers to access capital without debt while offering investors transparent, ESG-aligned opportunities backed by real assets.
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
            Read the Whitepaper
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
              alt="Sustainable Farming"
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
                      Hectares Protected
                    </div>
                  </div>
                  <div>
                    <div class="text-3xl text-accent mb-1">
                      2,800
                    </div>
                    <div class="text-sm text-foreground/70">
                      Farmers Supported
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
                Infrastructure Funded
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
                Avg. Annual Return
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
    text: 'Mission: Accelerate climate-resilient agriculture through Web3 innovation',
  },
  {
    icon: Leaf,
    text: 'Vision: A world where sustainable farming is the most profitable choice',
  },
]
</script>

