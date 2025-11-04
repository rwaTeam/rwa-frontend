<script setup lang="ts">
import { ArrowLeft, Leaf, Twitter, Github, Linkedin, TrendingUp } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'
import Drawer from '~/components/ui/drawer/Drawer.vue'
import Card from '~/components/ui/card/Card.vue'
import Badge from '~/components/ui/badge/Badge.vue'
import HeroSection from '~/components/project/detail/HeroSection.vue'
import FarmerProfile from '~/components/project/detail/FarmerProfile.vue'
import ProjectAbout from '~/components/project/detail/ProjectAbout.vue'
import InvestmentOverview from '~/components/project/detail/InvestmentOverview.vue'
import RiskInsurance from '~/components/project/detail/RiskInsurance.vue'
import TransparencySection from '~/components/project/detail/TransparencySection.vue'
import InvestmentStatus from '~/components/project/detail/InvestmentStatus.vue'
import InvestmentCard from '~/components/project/detail/InvestmentCard.vue'
import RelatedProjects from '~/components/project/detail/RelatedProjects.vue'
import { useProjectsStore } from '~/stores/projects'
import { useContractData } from '~/composables/useContractData'
import { useProjectProgress } from '~/composables/useProjectProgress'
import type { ApiProject, ContractData } from '~/types/project'

// 取得路由參數
const route = useRoute()
const projectId = route.params.id as string

// 取得 stores 和 composables
const projectsStore = useProjectsStore()
const { fetchContractData } = useContractData()

// 載入狀態
const loading = ref(true)
const contractLoading = ref(false)
const error = ref<string | null>(null)

// 專案資料
const apiProject = ref<ApiProject | null>(null)
const contractData = ref<ContractData | null>(null)

// 頁面 meta 設定（動態更新）
const pageTitle = computed(() => {
  if (apiProject.value?.title) {
    return `${apiProject.value.title} | GreenFi Labs`
  }
  return '專案詳情 | GreenFi Labs'
})

useHead({
  title: pageTitle
})

// 輔助函數：將任意專案資料轉換為 ApiProject 格式
const normalizeProject = (project: any): ApiProject => {
  // 如果已經是 ApiProject 格式，直接返回
  if (project._id && project.title) {
    return project as ApiProject
  }
  
  // 如果是 Project 格式，轉換為 ApiProject
  return {
    _id: project.id || project._id || '',
    title: project.name || project.title || '',
    imageURL: project.image || project.imageURL || '',
    region: project.location || project.region || '',
    annual_yield_rate: `${project.expectedROI || 0}%`,
    contract_address: project.contractAddress || project.contract_address || '',
    description: project.description || '',
    total_nft: project.total_nft || 1000,
    nft_price: project.nft_price || 0.001,
    minted_nft: project.minted_nft || project.mintedNFTs || 0,
    insurance_company: project.insuranceProvider || project.insurance_company || '',
    status: project.status || '開放中',
    crop_name: project.cropType || project.crop_name || '',
  } as ApiProject
}

// 從 store 或 API 取得專案資料
const loadProjectData = async () => {
  try {
    loading.value = true
    error.value = null

    // 如果 store 是空的，先載入所有專案
    if (projectsStore.getAllProjects.length === 0) {
      try {
        await projectsStore.fetchProjects()
      } catch (fetchError) {
        console.warn('無法載入專案列表:', fetchError)
      }
    }
    
    // 先從 store 查找
    let project = projectsStore.getProjectById(projectId)
    
    // 如果 store 沒有，嘗試從 API 取得
    if (!project) {
      try {
        const data = await $fetch<ApiProject>(`/api/getProject/${projectId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        
        if (data) {
          project = data
          projectsStore.addProject(project)
        }
      } catch (apiError) {
        console.warn('無法從 API 取得專案，嘗試使用 store 中的第一個專案')
        // 如果 API 失敗，使用 store 中的第一個專案作為 fallback
        const allProjects = projectsStore.getAllProjects
        if (allProjects.length > 0) {
          project = allProjects[0]
        }
      }
    }

    if (!project) {
      throw new Error('找不到專案資料')
    }

    // 標準化專案資料，確保格式正確
    apiProject.value = normalizeProject(project)

    // 讀取合約資料（使用標準化後的資料）
    const contractAddress = apiProject.value.contract_address
    if (contractAddress && contractAddress !== '待分配') {
      contractLoading.value = true
      try {
        const contract = await fetchContractData(contractAddress)
        contractData.value = contract
      } catch (contractError) {
        console.error('讀取合約資料失敗:', contractError)
        // 合約讀取失敗不影響頁面顯示，繼續使用假資料
      } finally {
        contractLoading.value = false
      }
    }
  } catch (err: any) {
    error.value = err.message || '載入專案資料失敗'
    console.error('載入專案資料失敗:', err)
  } finally {
    loading.value = false
  }
}

// 初始化載入資料
onMounted(() => {
  loadProjectData()
})

// 資料轉換函數：將 API 資料和合約資料轉換為頁面所需格式
const transformToDetailData = (apiProject: ApiProject, contractData?: ContractData | null) => {
  const expectedROI = parseFloat(apiProject.annual_yield_rate.replace('%', '')) || 18.5
  const contractBalance = contractData?.balance ? parseFloat(contractData.balance) : 0
  const balanceInUSD = contractBalance * 3000 // 假設 1 ETH = 3000 USD

  // 計算日期（使用假資料邏輯）
  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 4, 15)

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  const formatFullDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return {
    _projectData: {
      name: apiProject.title || "專案名稱",
      cropType: apiProject.crop_name || "作物類型",
      location: apiProject.region || "地點",
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      expectedROI,
      status: (apiProject.status === '開放中' || apiProject.status === '已募資' || apiProject.status === '即將推出') 
        ? apiProject.status as '開放中' | '已募資' | '即將推出'
        : '開放中' as const,
      coverImage: apiProject.imageURL || "https://plus.unsplash.com/premium_photo-1661823013705-d58ac4788630?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
      minInvestment: 0.001,
    },
    _farmerData: {
      name: "陳建宏",
      region: apiProject.region || "台南玉井",
      experience: "25年種植經驗",
      projectsCompleted: 12,
      reputation: 95,
      image: "https://images.unsplash.com/photo-1599109190522-dc04cb741875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTgyMTY1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    _projectAbout: {
      description: apiProject.description || "這是一個優質的農業投資專案，採用友善環境種植法，確保產品品質與永續發展。",
      farmStory: "農場主人多年來堅持以自然農法呵護每一棵作物，相信「土地會記得你的用心」。透過 GreenFi Labs 平台，希望讓更多人參與永續農業，共享豐收的喜悅。",
      scale: "3.5 公頃（約 10,500 坪）",
      method: "友善環境種植、有機肥培、滴灌系統",
      targetMarket: "日本、香港高端市場及台灣精品通路",
      farmImage: apiProject.imageURL || "https://images.unsplash.com/photo-1724144861106-bbb33df2f50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNzYwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    _investmentData: {
      investorShare: 65,
      farmerShare: 30,
      insuranceShare: 5,
      expectedTotalReturn: contractBalance > 0 ? Math.round(balanceInUSD * (1 + expectedROI / 100)) : 11850,
      insuranceCoverage: 80,
      annualizedROI: expectedROI,
    },
    _insuranceData: {
      providers: apiProject.insurance_company 
        ? [
            { name: apiProject.insurance_company, coverage: "自然災害保障", logo: "🛡️" },
            { name: "國泰產險", coverage: "作物損失保障", logo: "🌿" },
          ]
        : [
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
    },
    _transparencyData: {
      contractAddress: apiProject.contract_address || "0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab2E",
      transactions: contractData && contractData.transactionCount > 0
        ? [
            {
              type: "投資資金注入",
              amount: `$${Math.round(balanceInUSD).toLocaleString()}`,
              date: formatFullDate(new Date()),
              status: "completed" as const,
            },
            ...(contractData.transactionCount > 1 ? [
              {
                type: "農資採購支付",
                amount: `$${Math.round(balanceInUSD * 0.3).toLocaleString()}`,
                date: formatFullDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
                status: "completed" as const,
              },
            ] : []),
          ]
        : [
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
    },
  }
}

// 使用 computed 生成頁面所需的資料
const detailData = computed(() => {
  if (!apiProject.value) {
    return null
  }
  return transformToDetailData(apiProject.value, contractData.value)
})

// 展開資料以便在模板中使用
const projectData = computed(() => detailData.value?._projectData || {
  name: "載入中...",
  cropType: "",
  location: "",
  startDate: "",
  endDate: "",
  expectedROI: 0,
  status: "開放中" as const,
  coverImage: "",
  minInvestment: 0.001,
})

const farmerData = computed(() => detailData.value?._farmerData || {
  name: "",
  region: "",
  experience: "",
  projectsCompleted: 0,
  reputation: 0,
  image: "",
})

const projectAbout = computed(() => detailData.value?._projectAbout || {
  description: "",
  farmStory: "",
  scale: "",
  method: "",
  targetMarket: "",
  farmImage: "",
})

const investmentData = computed(() => detailData.value?._investmentData || {
  investorShare: 0,
  farmerShare: 0,
  insuranceShare: 0,
  expectedTotalReturn: 0,
  insuranceCoverage: 0,
  annualizedROI: 0,
})

const insuranceData = computed(() => detailData.value?._insuranceData || {
  providers: [],
  coverageDetails: [],
  protocol: "",
})

const transparencyData = computed(() => detailData.value?._transparencyData || {
  contractAddress: "",
  transactions: [],
})

// 募資進度（TWDT 顯示）
const { getProjectProgress } = useProjectProgress()
const progressData = ref<any | null>(null)
const progressLoading = ref(false)
const progressError = ref<string | null>(null)

const loadProgress = async () => {
  const addr = transparencyData.value.contractAddress
  if (!addr) {
    progressData.value = null
    return
  }
  progressLoading.value = true
  progressError.value = null
  try {
    const data = await getProjectProgress(addr)
    progressData.value = data
  } catch (e: any) {
    progressError.value = e?.message || '載入進度失敗'
    progressData.value = null
  } finally {
    progressLoading.value = false
  }
}

watch(() => transparencyData.value.contractAddress, () => {
  loadProgress()
})

onMounted(() => {
  loadProgress()
})

const percentage = computed(() => {
  return progressData.value?.percentage || 0
})

const targetTwdt = computed(() => {
  if (!apiProject.value) return 0
  const total = apiProject.value.total_nft || 0
  const price = apiProject.value.nft_price || 0
  return total * price
})

const currentTwdt = computed(() => {
  if (!apiProject.value || !progressData.value) return 0
  const minted = progressData.value.mintedNFTs || 0
  const price = apiProject.value.nft_price || 0
  return minted * price
})

const formatTwdt = (n: number) => {
  try {
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: 4 })
  } catch {
    return String(n)
  }
}

const hasInvested = ref(false)
const investmentStatus = computed(() => ({
  hasInvested: false,
  investmentAmount: 5000,
  estimatedROI: projectData.value.expectedROI,
  projectProgress: 35,
  expectedReturnDate: projectData.value.endDate || "2025年7月15日",
  unclaimedRewards: 0,
}))

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

          <!-- 募資進度 (TWDT) -->
          <Card class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-secondary">募資進度</h3>
              <Badge :variant="percentage >= 100 ? 'default' : 'outline'" class="text-sm">{{ percentage }}%</Badge>
            </div>

            <!-- 載入中骨架 -->
            <div v-if="progressLoading" class="space-y-3">
              <div class="h-4 bg-secondary/10 rounded animate-pulse" />
              <div class="h-8 bg-secondary/10 rounded animate-pulse" />
            </div>

            <!-- 內容 -->
            <div v-else class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-secondary/60">募資目標</p>
                  <p class="text-lg font-semibold text-secondary">{{ formatTwdt(targetTwdt) }} TWDT</p>
                </div>
                <div>
                  <p class="text-xs text-secondary/60">當前募資</p>
                  <p class="text-lg font-semibold text-secondary">{{ formatTwdt(currentTwdt) }} TWDT</p>
                </div>
              </div>

              <div class="h-3 bg-secondary/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                  :style="{ width: `${percentage}%` }"
                />
              </div>

              <div v-if="progressError" class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p class="text-xs text-orange-800">{{ progressError }}</p>
              </div>
            </div>
          </Card>

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
            :unclaimed-rewards="investmentStatus.unclaimedRewards"
          />
        </div>

        <!-- Right Column - Investment Card (Sticky) - 只在大螢幕顯示 -->
        <div class="hidden lg:block lg:col-span-1">
          <InvestmentCard
            :expected-r-o-i="projectData.expectedROI"
            :project-id="projectId as string"
            :contract-address="transparencyData.contractAddress"
            :nft-price="apiProject?.nft_price || 0"
            :total-nft="apiProject?.total_nft || 0"
            :minted-nft="progressData?.mintedNFTs || apiProject?.minted_nft || 0"
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
        :project-id="projectId as string"
        :is-in-drawer="true"
        :contract-address="transparencyData.contractAddress"
        :nft-price="apiProject?.nft_price || 0"
        :total-nft="apiProject?.total_nft || 0"
        :minted-nft="progressData?.mintedNFTs || apiProject?.minted_nft || 0"
      />
    </Drawer>
  </div>
</template>

