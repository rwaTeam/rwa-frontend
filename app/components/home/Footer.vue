<template>
  <footer class="bg-foreground text-white">
    <!-- Main CTA Section -->
    <div class="border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="grid lg:grid-cols-2 gap-12 items-center"
        >
          <!-- Left: CTA -->
          <div>
            <h2 class="text-3xl lg:text-4xl mb-4">
              準備好投資<span class="text-primary">永續農業</span>了嗎？
            </h2>
            <p class="text-white/70 text-lg mb-8">
              加入我們的投資者候補名單，優先掌握優質農業 RWA 投資機會。
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                class="bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                加入投資人候補名單
              </Button>
              <Button
                size="lg"
                variant="outline"
                class="border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-foreground rounded-xl"
              >
                查看全部專案
              </Button>
            </div>
          </div>

          <!-- Right: Newsletter -->
          <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div class="flex items-center gap-3 mb-4">
              <Mail class="w-6 h-6 text-primary" />
              <h3 class="text-xl">
                訂閱最新消息
              </h3>
            </div>
            <p class="text-white/70 mb-6">
              取得永續農業投資與 Web3 RWA 機會的最新洞察與資訊。
            </p>
            <div class="flex gap-3">
              <input
                type="email"
                placeholder="輸入您的 Email"
                class="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              >
              <Button class="bg-primary hover:bg-primary/90 rounded-xl px-6">
                <Send class="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Links Section -->
    <div class="border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-4 lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Leaf class="w-6 h-6 text-white" />
              </div>
              <span class="text-xl">GreenFi Labs</span>
            </div>
            <p class="text-white/60 text-sm mb-6">
              以代幣化推動卓越農業，邁向永續未來。
            </p>
            <div class="flex gap-4">
              <a
                v-for="item in social"
                :key="item.name"
                :href="item.href"
                class="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors"
              >
                <component :is="item.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <!-- Product -->
          <div>
            <h4 class="mb-4">
              產品
            </h4>
            <ul class="space-y-3">
              <li v-for="item in navigation.product" :key="item.name">
                <a :href="item.href" class="text-white/60 hover:text-primary transition-colors text-sm">
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Investors -->
          <div>
            <h4 class="mb-4">
              投資人專區
            </h4>
            <ul class="space-y-3">
              <li v-for="item in navigation.investors" :key="item.name">
                <a :href="item.href" class="text-white/60 hover:text-primary transition-colors text-sm">
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Farmers -->
          <div>
            <h4 class="mb-4">
              農民專區
            </h4>
            <ul class="space-y-3">
              <li v-for="item in navigation.farmers" :key="item.name">
                <a :href="item.href" class="text-white/60 hover:text-primary transition-colors text-sm">
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="mb-4">
              公司
            </h4>
            <ul class="space-y-3">
              <li v-for="item in navigation.company" :key="item.name">
                <a :href="item.href" class="text-white/60 hover:text-primary transition-colors text-sm">
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>&copy; 2025 GreenFi Labs. 版權所有。</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-primary transition-colors">隱私權政策</a>
            <a href="#" class="hover:text-primary transition-colors">服務條款</a>
            <a href="#" class="hover:text-primary transition-colors">法律資訊</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Leaf, Mail, Twitter, Github, Linkedin, Send } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'

const navigation = {
  product: [
    { name: '運作方式', href: '#' },
    { name: '專案', href: '#' },
    { name: '保險', href: '#' },
    { name: '白皮書', href: '#' },
  ],
  investors: [
    { name: '開始使用', href: '#' },
    { name: '報酬率試算', href: '#' },
    { name: '風險評估', href: '#' },
    { name: '常見問題', href: '#' },
  ],
  farmers: [
    { name: '立即申請', href: '#' },
    { name: '好處', href: '#' },
    { name: '成功案例', href: '#' },
    { name: '支援', href: '#' },
  ],
  company: [
    { name: '關於我們', href: '#' },
    { name: '團隊', href: '#' },
    { name: '合作夥伴', href: '#' },
    { name: '聯絡我們', href: '#' },
  ],
}

const social = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Github', icon: Github, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
]
</script>

