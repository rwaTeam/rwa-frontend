<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{ opacity: 1, y: 0, transition: { duration: 400 } }"
    class="bg-white rounded-3xl p-8 shadow-lg hover:scale-[1.02] transition-all duration-300"
  >
    <!-- 專案標題與狀態 -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-xl font-semibold text-[#262624]">
            {{ project.title }}
          </h3>
          <Badge
            :class="{
              'bg-[#FDBA45]/20 text-[#FDBA45] border-[#FDBA45]/30': project.status === 'pending',
              'bg-[#3BB273]/20 text-[#3BB273] border-[#3BB273]/30': project.status === 'approved',
              'bg-[#E74C3C]/20 text-[#E74C3C] border-[#E74C3C]/30': project.status === 'rejected',
            }"
            class="border"
          >
            {{ statusText }}
          </Badge>
        </div>
        <p class="text-sm text-[#272D27]/70">
          {{ project.crop_type }} · {{ project.location }}
        </p>
      </div>
      
      <!-- 專案圖片縮圖 -->
      <div
        v-if="project.images && project.images.length > 0"
        class="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF9F6]"
      >
        <img
          :src="project.images[0]"
          :alt="project.title"
          class="w-full h-full object-cover"
        >
      </div>
    </div>

    <!-- 專案資訊網格 -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- 建設成本 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <DollarSign class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">建設成本</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ formatNumber(project.build_cost) }} TWDT
        </p>
      </div>

      <!-- 年收益 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">預估年收益</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ formatNumber(project.annual_income) }} TWDT
        </p>
      </div>

      <!-- 農地面積 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <MapPin class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">農地面積</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ formatNumber(project.area) }} 公頃
        </p>
      </div>

      <!-- 預估產量 -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Package class="w-4 h-4 text-[#16B36D]" />
          <span class="text-sm text-[#272D27]/60">預估產量</span>
        </div>
        <p class="text-base font-semibold text-[#262624]">
          {{ formatNumber(project.expected_yield) }} 公噸
        </p>
      </div>
    </div>

    <!-- 農夫地址 -->
    <div class="mb-6 p-4 bg-[#FAF9F6] rounded-xl">
      <div class="flex items-center gap-2 mb-1">
        <User class="w-4 h-4 text-[#16B36D]" />
        <span class="text-sm text-[#272D27]/60">農夫地址</span>
      </div>
      <p class="text-sm font-mono text-[#262624]">
        {{ project.farmer_id }}
      </p>
    </div>

    <!-- 保險資訊 -->
    <div
      v-if="project.has_insurance"
      class="mb-6 flex items-center gap-2 text-sm text-[#3BB273]"
    >
      <Shield class="w-4 h-4" />
      <span>已投保：{{ project.insurance_company || '未指定保險公司' }}</span>
    </div>

    <!-- 專案描述 -->
    <div v-if="project.description" class="mb-6">
      <p class="text-sm text-[#272D27]/70 line-clamp-2">
        {{ project.description }}
      </p>
    </div>

    <!-- 提交時間 -->
    <div class="flex items-center gap-2 text-xs text-[#272D27]/50 mb-6">
      <Clock class="w-3 h-3" />
      <span>提交時間：{{ formatDate(project.created_at) }}</span>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex gap-3">
      <Button
        @click="$emit('quick-approve', project)"
        variant="outline"
        class="flex-1 border-[#3BB273] text-[#3BB273] hover:bg-[#3BB273]/10"
      >
        <CheckCircle class="w-4 h-4 mr-2" />
        快速通過
      </Button>
      <Button
        @click="$emit('review', project)"
        class="flex-1 bg-[#16B36D] hover:bg-[#16B36D]/90 text-white"
      >
        <FileCheck class="w-4 h-4 mr-2" />
        審核
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PendingProject } from '~/types/project'
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Package, 
  User, 
  Shield, 
  Clock, 
  FileCheck,
  CheckCircle,
} from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

interface Props {
  project: PendingProject
}

const props = defineProps<Props>()

defineEmits<{
  review: [project: PendingProject]
  'quick-approve': [project: PendingProject]
}>()

const statusText = computed(() => {
  const statusMap = {
    pending: '待審核',
    approved: '已通過',
    rejected: '已拒絕',
    deployed: '已上鏈',
  }
  return statusMap[props.project.status] || '待審核'
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

const formatDate = (dateString: string) => {
  if (!dateString) {
    return '未提供'
  }
  
  const date = new Date(dateString)
  
  // 檢查日期是否有效
  if (isNaN(date.getTime())) {
    return '日期格式錯誤'
  }
  
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

