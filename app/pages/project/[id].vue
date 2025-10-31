<script setup lang="ts">
import { ArrowLeft, Leaf, Twitter, Github, Linkedin, TrendingUp } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'
import Drawer from '~/components/ui/drawer/Drawer.vue'
import HeroSection from '~/components/project/detail/HeroSection.vue'
import FarmerProfile from '~/components/project/detail/FarmerProfile.vue'
import ProjectAbout from '~/components/project/detail/ProjectAbout.vue'
import InvestmentOverview from '~/components/project/detail/InvestmentOverview.vue'
import RiskInsurance from '~/components/project/detail/RiskInsurance.vue'
import TransparencySection from '~/components/project/detail/TransparencySection.vue'
import InvestmentStatus from '~/components/project/detail/InvestmentStatus.vue'
import InvestmentCard from '~/components/project/detail/InvestmentCard.vue'
import RelatedProjects from '~/components/project/detail/RelatedProjects.vue'

// 取得路由參數
const route = useRoute()
const projectId = route.params.id

// 頁面 meta 設定
useHead({
  title: '專案詳情 - GreenFi Labs',
  meta: [
    { name: 'description', content: '查看農業投資專案的詳細資訊' }
  ]
})

// Mock 專案資料（之後可替換為 API 呼叫）
const projectData = ref({
  name: "台南玉井愛文芒果種植計劃 2025",
  cropType: "愛文芒果（Irwin Mango）",
  location: "台南市玉井區",
  startDate: "2025年3月",
  endDate: "2025年7月",
  expectedROI: 18.5,
  status: "開放中" as const,
  coverImage: "https://images.unsplash.com/photo-1724144861106-bbb33df2f50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNzYwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  minInvestment: 0.001,
})

const farmerData = ref({
  name: "陳建宏",
  region: "台南玉井",
  experience: "25年種植經驗",
  projectsCompleted: 12,
  reputation: 95,
  image: "https://images.unsplash.com/photo-1599109190522-dc04cb741875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTgyMTY1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
})

const projectAbout = ref({
  description: "台南玉井素有「芒果之鄉」美稱，本計劃位於玉井核心產區，由第三代果農陳建宏先生主持。農場採用友善環境種植法，結合現代化灌溉系統與傳統套袋技術，確保每顆芒果都達到外銷等級。本季預計產量 12,000 公斤，主要供應日本與香港高端市場。",
  farmStory: "陳建宏先生自幼跟隨父親學習芒果種植，25 年來堅持以自然農法呵護每一棵果樹。他相信「土地會記得你的用心」，因此從不使用化學農藥，而是透過生態平衡維持果園健康。透過 GreenFi Labs 平台，陳先生希望讓更多人參與永續農業，共享豐收的喜悅。",
  scale: "3.5 公頃（約 10,500 坪）",
  method: "友善環境種植、有機肥培、滴灌系統",
  targetMarket: "日本、香港高端市場及台灣精品通路",
  farmImage: "https://images.unsplash.com/photo-1724144861106-bbb33df2f50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNzYwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
})

const investmentData = ref({
  investorShare: 65,
  farmerShare: 30,
  insuranceShare: 5,
  expectedTotalReturn: 11850,
  insuranceCoverage: 80,
  annualizedROI: 18.5,
})

const insuranceData = ref({
  providers: [
    { name: "富邦產險", coverage: "自然災害保障", logo: "🛡️" },
    { name: "國泰產險", coverage: "作物損失保障", logo: "🌿" },
  ],
  coverageDetails: [
    "颱風、豪雨造成的作物損害 - 最高賠償 80%",
    "乾旱、異常高溫損失 - 最高賠償 70%",
    "病蟲害防治失效損失 - 最高賠償 60%",
    "市場價格波動保護機制 - 保底收購價格",
  ],
  protocol: "SafeHarvest Protocol 是 GreenFi Labs 開發的智能合約保險系統，當符合理賠條件時（如氣象局發布颱風警報、實地損失評估達標），系統將自動觸發理賠流程，無需繁瑣申請手續。所有理賠紀錄均上鏈記錄，確保公開透明。",
})

const transparencyData = ref({
  contractAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab2E",
  transactions: [
    {
      type: "投資資金注入",
      amount: "$125,000",
      date: "2025-03-15",
      status: "completed" as const,
    },
    {
      type: "農資採購支付",
      amount: "$35,000",
      date: "2025-03-20",
      status: "completed" as const,
    },
    {
      type: "保險金繳納",
      amount: "$6,250",
      date: "2025-03-20",
      status: "completed" as const,
    },
    {
      type: "灌溉設備支付",
      amount: "$12,500",
      date: "2025-04-01",
      status: "pending" as const,
    },
  ],
})

const hasInvested = ref(false)
const investmentStatus = ref({
  hasInvested: false,
  investmentAmount: 5000,
  estimatedROI: 18.5,
  projectProgress: 35,
  expectedReturnDate: "2025年7月15日",
  claimableRewards: 0,
})

const relatedProjects = ref([
  {
    id: "1",
    name: "嘉義阿里山高山茶",
    cropType: "烏龍茶",
    location: "嘉義縣阿里山鄉",
    roi: 22.5,
    duration: "6個月",
    status: "開放中" as const,
    image: "https://images.unsplash.com/photo-1491497895121-1334fc14d8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBwbGFudGF0aW9ufGVufDF8fHx8MTc2MTgwNTMxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    name: "花蓮富里有機稻米",
    cropType: "有機米",
    location: "花蓮縣富里鄉",
    roi: 15.0,
    duration: "4個月",
    status: "開放中" as const,
    image: "https://images.unsplash.com/photo-1670922757779-9472463fe234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZmllbGQlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NjE4MDY4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "3",
    name: "彰化溪湖溫室小番茄",
    cropType: "玉女小番茄",
    location: "彰化縣溪湖鎮",
    roi: 20.0,
    duration: "5個月",
    status: "開放中" as const,
    image: "https://images.unsplash.com/photo-1534940519139-f860fb3c6e38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjE4MDcxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "4",
    name: "屏東內埔檸檬種植",
    cropType: "無籽檸檬",
    location: "屏東縣內埔鄉",
    roi: 17.5,
    duration: "8個月",
    status: "開放中" as const,
    image: "https://images.unsplash.com/photo-1724144861106-bbb33df2f50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNzYwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
])

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
  { name: 'Twitter', href: '#' },
  { name: 'Github', href: '#' },
  { name: 'LinkedIn', href: '#' },
]

// 控制投資 Drawer 的顯示
const showInvestmentDrawer = ref(false)
</script>

<template>
  <div class="min-h-screen bg-muted">
    <!-- Header -->
    <header class="bg-white border-b border-secondary/10 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/project/list">
              <Button variant="ghost" size="sm" class="text-secondary">
                <ArrowLeft class="w-5 h-5 mr-2" />
                返回專案列表
              </Button>
            </NuxtLink>
            <div class="h-6 w-px bg-secondary/20" />
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-primary to-[#A4E2C2] rounded-lg flex items-center justify-center">
                <Leaf class="w-6 h-6 text-white" />
              </div>
              <span class="text-lg text-secondary">GreenFi Labs</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Project Title -->
    <div class="bg-muted">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-secondary">{{ projectData.name }}</h1>
        <div class="flex items-center gap-4 mt-2">
          <span class="text-secondary/70">{{ projectData.cropType }}</span>
          <span class="text-secondary/40">•</span>
          <span class="text-secondary/70">{{ projectData.location }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Hero Section -->
          <HeroSection
            :name="projectData.name"
            :crop-type="projectData.cropType"
            :location="projectData.location"
            :start-date="projectData.startDate"
            :end-date="projectData.endDate"
            :expected-r-o-i="projectData.expectedROI"
            :status="projectData.status"
            :cover-image="projectData.coverImage"
          />

          <!-- Farmer Profile -->
          <FarmerProfile
            :name="farmerData.name"
            :region="farmerData.region"
            :experience="farmerData.experience"
            :projects-completed="farmerData.projectsCompleted"
            :reputation="farmerData.reputation"
            :image="farmerData.image"
          />

          <!-- Project About -->
          <ProjectAbout
            :description="projectAbout.description"
            :farm-story="projectAbout.farmStory"
            :scale="projectAbout.scale"
            :method="projectAbout.method"
            :target-market="projectAbout.targetMarket"
            :farm-image="projectAbout.farmImage"
          />

          <!-- Investment Overview -->
          <InvestmentOverview
            :investor-share="investmentData.investorShare"
            :farmer-share="investmentData.farmerShare"
            :insurance-share="investmentData.insuranceShare"
            :expected-total-return="investmentData.expectedTotalReturn"
            :insurance-coverage="investmentData.insuranceCoverage"
            :annualized-r-o-i="investmentData.annualizedROI"
          />

          <!-- Risk & Insurance -->
          <RiskInsurance
            :providers="insuranceData.providers"
            :coverage-details="insuranceData.coverageDetails"
            :protocol="insuranceData.protocol"
          />

          <!-- Transparency -->
          <TransparencySection
            :contract-address="transparencyData.contractAddress"
            :transactions="transparencyData.transactions"
          />

          <!-- Investment Status (only if invested) -->
          <InvestmentStatus
            :has-invested="investmentStatus.hasInvested"
            :investment-amount="investmentStatus.investmentAmount"
            :estimated-r-o-i="investmentStatus.estimatedROI"
            :project-progress="investmentStatus.projectProgress"
            :expected-return-date="investmentStatus.expectedReturnDate"
            :claimable-rewards="investmentStatus.claimableRewards"
          />
        </div>

        <!-- Right Column - Investment Card (Sticky) - 只在大螢幕顯示 -->
        <div class="hidden lg:block lg:col-span-1">
          <InvestmentCard
            :expected-r-o-i="projectData.expectedROI"
            :min-investment="projectData.minInvestment"
            :project-id="projectId as string"
          />
        </div>
      </div>

      <!-- Related Projects -->
      <div class="mt-12">
        <RelatedProjects :projects="relatedProjects" />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-foreground text-white">

      <!-- Links Section -->
      <div class="border-b border-white/10">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <!-- Brand -->
            <div class="col-span-2 md:col-span-4 lg:col-span-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-primary to-[#A4E2C2] rounded-lg flex items-center justify-center">
                  <Leaf class="w-6 h-6 text-white" />
                </div>
                <span class="text-xl">GreenFi Labs</span>
              </div>
              <p class="text-white/60 text-sm mb-6">
                科技賦能農業，共創永續未來
              </p>
              <div class="flex gap-4">
                <a
                  href="#"
                  class="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors"
                >
                  <Twitter class="w-5 h-5" />
                </a>
                <a
                  href="#"
                  class="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors"
                >
                  <Github class="w-5 h-5" />
                </a>
                <a
                  href="#"
                  class="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors"
                >
                  <Linkedin class="w-5 h-5" />
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

    <!-- 移動端浮動投資按鈕 - 只在小螢幕顯示 -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-secondary/10 shadow-2xl z-40 px-6 py-4">
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1">
          <p class="text-xs text-secondary/70 mb-1">預期年化報酬</p>
          <p class="text-xl font-bold text-primary">{{ projectData.expectedROI }}%</p>
        </div>
        <Button
          @click="showInvestmentDrawer = true"
          class="bg-primary hover:bg-accent text-white px-8 py-6 text-base font-semibold"
        >
          <TrendingUp class="w-5 h-5 mr-2" />
          立即投資
        </Button>
      </div>
    </div>

    <!-- 投資 Drawer - 只在小螢幕顯示 -->
    <Drawer v-model:open="showInvestmentDrawer" title="投資專案">
      <InvestmentCard
        :expected-r-o-i="projectData.expectedROI"
        :min-investment="projectData.minInvestment"
        :project-id="projectId as string"
        :is-in-drawer="true"
      />
    </Drawer>
  </div>
</template>

