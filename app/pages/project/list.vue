<script setup lang="ts">
import { Search, Leaf } from 'lucide-vue-next'
import Input from '~/components/ui/input/Input.vue'
import Button from '~/components/ui/button/Button.vue'
import Select from '~/components/ui/select/Select.vue'
import SelectContent from '~/components/ui/select/SelectContent.vue'
import SelectItem from '~/components/ui/select/SelectItem.vue'
import SelectTrigger from '~/components/ui/select/SelectTrigger.vue'
import SelectValue from '~/components/ui/select/SelectValue.vue'
import Pagination from '~/components/ui/pagination/Pagination.vue'
import PaginationContent from '~/components/ui/pagination/PaginationContent.vue'
import PaginationItem from '~/components/ui/pagination/PaginationItem.vue'
import PaginationEllipsis from '~/components/ui/pagination/PaginationEllipsis.vue'
import PaginationNext from '~/components/ui/pagination/PaginationNext.vue'
import PaginationPrevious from '~/components/ui/pagination/PaginationPrevious.vue'
import type { Project } from '~/types/project'

import FeaturedProject from '~/components/project/FeaturedProject.vue'
import ProjectCard from '~/components/project/ProjectCard.vue'

// API Response Type
interface ApiProject {
  _id: string
  title: string
  imageURL: string
  region: string
  annual_yield_rate: string
  contract_address: string
  description: string
  total_nft: number
  nft_price: number
  insurance_company: string
  status: string
  crop_name: string
}

// Transform API data to Project type
const transformApiProject = (apiProject: ApiProject): Project => {
  return {
    id: apiProject._id,
    name: apiProject.title,
    location: apiProject.region,
    cropType: apiProject.crop_name,
    image: apiProject.imageURL,
    expectedROI: parseFloat(apiProject.annual_yield_rate.replace('%', '')),
    tokenizedShare: '收益權代幣化',
    status: apiProject.status as Project['status'],
    contractAddress: apiProject.contract_address || '待分配',
    insuranceCoverage: !!apiProject.insurance_company,
    insuranceProvider: apiProject.insurance_company || undefined,
  }
}

// Fetch projects from API - using proxy to avoid CORS issues
const { data: apiData, pending, error, refresh } = useLazyFetch<ApiProject[]>('/api/getProjects', {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  onResponseError({ response }) {
    console.error('API Response Error:', response.status, response.statusText)
  },
  onRequestError({ error: err }) {
    console.error('API Request Error:', err.message)
  },
})

// Function to retry loading
const retryLoad = () => {
  refresh()
}

// Transform data
const projects = computed(() => {
  if (!apiData.value || apiData.value.length === 0) return []
  return apiData.value.map(transformApiProject)
})

const currentPage = ref(1)
const featuredProject = computed(() => {
  return projects.value.length > 0 ? projects.value[0] : null
})
const regularProjects = computed(() => {
  return projects.value.length > 1 ? projects.value.slice(1) : []
})
</script>

<template>
  <div class="min-h-screen bg-muted">
    <!-- Header Section -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-[1440px] mx-auto px-6 py-8">
        <!-- Logo/Brand -->
        <div class="flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-primary to-[#A4E2C2] rounded-lg flex items-center justify-center">
            <Leaf class="w-6 h-6 text-white" />
          </div>
          <span class="text-secondary">GreenFi Labs</span>
        </div>

        <!-- Title and Subtitle -->
        <h1 class="text-secondary mb-3">
          所有專案
        </h1>
        <p class="text-gray-600 mb-6 max-w-3xl">
          探索由真實數據和保險支持的實體農業投資機會
        </p>

        <!-- Filters and Search Bar -->
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Input -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜尋專案或農場..."
              class="pl-10 bg-white border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>

          <!-- Dropdown Filters -->
          <div class="flex gap-3">
            <Select>
              <SelectTrigger class="w-[160px] bg-white border-gray-300">
                <SelectValue placeholder="作物類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mango">
                  愛文芒果
                </SelectItem>
                <SelectItem value="papaya">
                  木瓜
                </SelectItem>
                <SelectItem value="dragonfruit">
                  火龍果
                </SelectItem>
                <SelectItem value="tea">
                  綠茶
                </SelectItem>
                <SelectItem value="pineapple">
                  鳳梨
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger class="w-[160px] bg-white border-gray-300">
                <SelectValue placeholder="地點" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tainan">
                  台南
                </SelectItem>
                <SelectItem value="kaohsiung">
                  高雄
                </SelectItem>
                <SelectItem value="pingtung">
                  屏東
                </SelectItem>
                <SelectItem value="taichung">
                  台中
                </SelectItem>
                <SelectItem value="nantou">
                  南投
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger class="w-[160px] bg-white border-gray-300">
                <SelectValue placeholder="狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">
                  開放中
                </SelectItem>
                <SelectItem value="funded">
                  已募資
                </SelectItem>
                <SelectItem value="coming">
                  即將推出
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger class="w-[160px] bg-white border-gray-300">
                <SelectValue placeholder="預期報酬率" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  0-10%
                </SelectItem>
                <SelectItem value="medium">
                  10-15%
                </SelectItem>
                <SelectItem value="high">
                  15-20%
                </SelectItem>
                <SelectItem value="veryhigh">
                  20%+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-[1440px] mx-auto px-6 py-10">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p class="text-gray-600">載入專案中...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <svg class="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">載入專案時發生錯誤</h3>
          <p class="text-gray-600 mb-4">{{ error.message || '無法連接到伺服器，請檢查網路連線' }}</p>
          <Button @click="retryLoad" class="bg-primary hover:bg-accent text-white">
            重新載入
          </Button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="flex gap-8">
        <!-- Projects Section -->
        <div class="flex-1">
          <!-- Featured Project -->
          <FeaturedProject v-if="featuredProject" :project="featuredProject" />

          <!-- Project Grid -->
          <div v-if="regularProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            <ProjectCard
              v-for="project in regularProjects"
              :key="project.id"
              :project="project"
            />
          </div>

          <!-- No Projects -->
          <div v-else-if="!featuredProject" class="text-center py-20">
            <p class="text-gray-600">目前沒有可用的專案</p>
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="projects.length > 0"
            v-slot="{ page }"
            :total="projects.length"
            :items-per-page="10"
            :sibling-count="1"
            show-edges
            :default-page="1"
            class="mb-10"
          >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrevious />

              <template v-for="(item, index) in items">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="w-10 h-10 p-0"
                    :variant="item.value === page ? 'default' : 'outline'"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationItem>
                <PaginationEllipsis
                  v-else
                  :key="item.type"
                  :index="index"
                />
              </template>

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>

    <!-- Footer CTA Section -->
    <footer class="bg-secondary text-white">
      <div class="max-w-[1440px] mx-auto px-6 py-16 text-center">
        <h2 class="text-white mb-4">
          準備好擴大您的影響力了嗎？加入 GreenFi 的永續投資網絡
        </h2>
        <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
          存取代幣化農業資產、透明的鏈上數據和機構級保險保障
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <Button class="bg-primary hover:bg-accent text-white px-8">
            加入候補名單
          </Button>
          <Button variant="outline" class="border-1 border-white/80 bg-transparent text-white hover:bg-white hover:text-foreground px-8">
            查看白皮書
          </Button>
        </div>
      </div>
    </footer>
  </div>
</template>

