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

// Mock project data
const projects: Project[] = [
  {
    id: '1',
    name: '台南頂級芒果莊園',
    location: '台灣台南',
    cropType: '愛文芒果',
    image: 'https://images.unsplash.com/photo-1724144861106-bbb33df2f50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNzYwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedROI: 18.5,
    tokenizedShare: '5年內收益的25%',
    status: '開放中',
    contractAddress: '0x742d35...3a9b1f',
    insuranceCoverage: true,
    insuranceProvider: '富邦承保',
  },
  {
    id: '2',
    name: '高雄有機木瓜農場',
    location: '台灣高雄',
    cropType: '木瓜',
    image: 'https://images.unsplash.com/photo-1707282399877-8d57c412c5c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBheWElMjBwbGFudGF0aW9ufGVufDF8fHx8MTc2MTc2MDAzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    expectedROI: 15.2,
    tokenizedShare: '4年內收益的20%',
    status: '開放中',
    contractAddress: '0x8f3c47...2d5e9a',
    insuranceCoverage: true,
    insuranceProvider: '富邦承保',
  },
  {
    id: '3',
    name: '屏東火龍果谷',
    location: '台灣屏東',
    cropType: '火龍果',
    image: 'https://images.unsplash.com/photo-1594490986417-2b50613cd63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb24lMjBmcnVpdCUyMGZhcm18ZW58MXx8fHwxNzYxNzYwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedROI: 16.8,
    tokenizedShare: '3年內收益的30%',
    status: '已募資',
    contractAddress: '0xa2b9c1...7f4e3d',
    insuranceCoverage: true,
    insuranceProvider: '國泰承保',
  },
  {
    id: '4',
    name: '台中永續農業合作社',
    location: '台灣台中',
    cropType: '鳳梨',
    image: 'https://images.unsplash.com/photo-1749483432710-707b46a32b25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWl3YW4lMjBhZ3JpY3VsdHVyZSUyMGZpZWxkfGVufDF8fHx8MTc2MTc2MDAzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    expectedROI: 14.5,
    tokenizedShare: '6年內收益的15%',
    status: '即將推出',
    contractAddress: '0x5d7a8f...1c9e2b',
    insuranceCoverage: false,
  },
  {
    id: '5',
    name: '雲林有機蔬菜農場',
    location: '台灣雲林',
    cropType: '綜合蔬菜',
    image: 'https://images.unsplash.com/photo-1714588419509-3a9b5b1b959e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzYxNzYwMDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedROI: 12.3,
    tokenizedShare: '4年內收益的18%',
    status: '開放中',
    contractAddress: '0x9c4b2d...6a8f5e',
    insuranceCoverage: true,
    insuranceProvider: '富邦承保',
  },
  {
    id: '6',
    name: '南投高山茶園',
    location: '台灣南投',
    cropType: '綠茶',
    image: 'https://images.unsplash.com/photo-1621445162463-61ff2c677736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlYSUyMHBsYW50YXRpb258ZW58MXx8fHwxNzYxNzYwMDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedROI: 19.7,
    tokenizedShare: '5年內收益的22%',
    status: '開放中',
    contractAddress: '0x3e6d9a...4f7c1b',
    insuranceCoverage: true,
    insuranceProvider: '國泰承保',
  },
]

const currentPage = ref(1)
const featuredProject = projects[0]
const regularProjects = projects.slice(1)
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
      <div class="flex gap-8">
        <!-- Projects Section -->
        <div class="flex-1">
          <!-- Featured Project -->
          <FeaturedProject :project="featuredProject" />

          <!-- Project Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            <ProjectCard
              v-for="project in regularProjects"
              :key="project.id"
              :project="project"
            />
          </div>

          <!-- Pagination -->
          <Pagination
            v-slot="{ page }"
            :total="100"
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

