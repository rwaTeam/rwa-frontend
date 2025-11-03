<template>
  <Drawer :open="open" :title="'專案審核'" @update:open="handleClose">
    <div class="max-w-4xl mx-auto">
      <!-- Dialog Header -->
      <div class="mb-6 p-6 border-b border-[#16B36D]/20 bg-gradient-to-br from-[#16B36D]/5 to-[#A4E2C2]/5 rounded-xl -mx-6 -mt-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-[#262624] mb-2">
              專案審核
            </h2>
            <p class="text-sm text-[#272D27]/70">
              審核通過後將自動部署至區塊鏈
            </p>
          </div>
          <Badge
            :class="{
              'bg-[#FDBA45]/20 text-[#FDBA45] border-[#FDBA45]/30': project?.status === 'pending',
            }"
            class="border"
          >
            待審核
          </Badge>
        </div>
      </div>

      <!-- Dialog Body -->
      <div class="space-y-8">
        <!-- 專案基本資訊 -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-[#262624] flex items-center gap-2">
            <FileText class="w-5 h-5 text-[#16B36D]" />
            專案資訊
          </h3>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label class="text-sm text-[#272D27]/60">專案名稱</Label>
              <p class="text-base font-semibold text-[#262624]">{{ project?.title }}</p>
            </div>
            <div class="space-y-2">
              <Label class="text-sm text-[#272D27]/60">作物種類</Label>
              <p class="text-base font-semibold text-[#262624]">{{ project?.crop_type }}</p>
            </div>
            <div class="space-y-2">
              <Label class="text-sm text-[#272D27]/60">產地</Label>
              <p class="text-base font-semibold text-[#262624]">{{ project?.location }}</p>
            </div>
            <div class="space-y-2">
              <Label class="text-sm text-[#272D27]/60">農地面積</Label>
              <p class="text-base font-semibold text-[#262624]">{{ project?.area }} 公頃</p>
            </div>
            <div class="space-y-2">
              <Label class="text-sm text-[#272D27]/60">建設成本</Label>
              <p class="text-base font-semibold text-[#262624]">{{ project?.build_cost }} TWDT</p>
            </div>
            <div class="space-y-2">
              <Label class="text-sm text-[#272D27]/60">年收益</Label>
              <p class="text-base font-semibold text-[#262624]">{{ project?.annual_income }} TWDT</p>
            </div>
          </div>

          <div class="p-4 bg-[#FAF9F6] rounded-xl space-y-2">
            <Label class="text-sm text-[#272D27]/60">農夫地址</Label>
            <p class="text-sm font-mono text-[#262624]">{{ project?.farmer_id }}</p>
          </div>

          <div v-if="project?.description" class="space-y-2">
            <Label class="text-sm text-[#272D27]/60">專案描述</Label>
            <p class="text-sm text-[#272D27]/80">{{ project.description }}</p>
          </div>
        </div>

        <!-- 分隔線 -->
        <div class="border-t border-[#16B36D]/10" />

        <!-- 審核確認 -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-[#262624] flex items-center gap-2">
            <Settings class="w-5 h-5 text-[#16B36D]" />
            審核確認
          </h3>

          <!-- 審核說明 -->
          <div class="p-6 bg-gradient-to-br from-[#16B36D]/10 to-[#A4E2C2]/10 rounded-2xl space-y-3">
            <p class="text-sm text-[#272D27]/80">
              專案將使用系統預設參數進行審核和上鏈部署。部署成功後，專案將自動上架至投資平台。
            </p>
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-[#16B36D]" />
                <span class="text-[#272D27]/70">自動配置 NFT 參數</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-[#16B36D]" />
                <span class="text-[#272D27]/70">使用 TWDT 代幣計價</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-[#16B36D]" />
                <span class="text-[#272D27]/70">部署至區塊鏈並生成合約地址</span>
              </div>
            </div>
          </div>

          <!-- 審核備註 -->
          <div class="space-y-2">
            <Label for="reviewNote" class="text-sm font-medium text-[#272D27]">
              審核備註（選填）
            </Label>
            <textarea
              id="reviewNote"
              v-model="reviewNote"
              rows="3"
              class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-[#16B36D] focus-visible:ring-[#16B36D]/50 focus-visible:ring-[3px]"
              placeholder="輸入審核備註（選填）"
            />
          </div>
        </div>
      </div>

      <!-- Dialog Footer -->
      <div class="mt-8 pt-6 border-t border-[#16B36D]/20">
        <div class="flex gap-3">
          <Button
            variant="outline"
            @click="handleClose"
            :disabled="isLoading"
            class="flex-1"
          >
            取消
          </Button>
          <Button
            variant="outline"
            @click="handleReject"
            :disabled="isLoading"
            class="flex-1 border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C]/10"
          >
            <XCircle class="w-4 h-4 mr-2" />
            拒絕專案
          </Button>
          <Button
            @click="handleApprove"
            :disabled="isLoading"
            class="flex-1 bg-[#16B36D] hover:bg-[#16B36D]/90 text-white"
          >
            <CheckCircle class="w-4 h-4 mr-2" />
            {{ isLoading ? '處理中...' : '通過並上鏈' }}
          </Button>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import type { PendingProject } from '~/types/project'
import { FileText, Settings, CheckCircle, XCircle } from 'lucide-vue-next'
import { Drawer } from '~/components/ui/drawer'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'

interface Props {
  open: boolean
  project: PendingProject | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  approve: [projectId: string]
  reject: [projectId: string, reason?: string]
}>()

// 審核備註
const reviewNote = ref('')

// 載入狀態
const isLoading = ref(false)

// 處理通過審核
const handleApprove = async () => {
  if (!props.project) {
    return
  }

  isLoading.value = true
  
  emit('approve', props.project._id)
  
  // 等待父組件處理完成
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isLoading.value = false
}

// 處理拒絕專案
const handleReject = async () => {
  if (!props.project) return

  isLoading.value = true
  
  emit('reject', props.project._id, reviewNote.value || '不符合審核標準')
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isLoading.value = false
}

// 關閉對話框
const handleClose = () => {
  if (!isLoading.value) {
    emit('update:open', false)
  }
}
</script>

