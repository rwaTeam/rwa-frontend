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

        <!-- 審核參數表單 -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-[#262624] flex items-center gap-2">
            <Settings class="w-5 h-5 text-[#16B36D]" />
            部署參數設定
          </h3>

          <div class="grid grid-cols-2 gap-6">
            <!-- NFT 總數量 -->
            <div class="space-y-2">
              <Label for="totalNFTs" class="text-sm font-medium text-[#272D27]">
                NFT 總數量 <span class="text-[#E74C3C]">*</span>
              </Label>
              <Input
                id="totalNFTs"
                v-model.number="formData.totalNFTs"
                type="number"
                placeholder="例：150"
                :class="{ 'border-[#E74C3C]': errors.totalNFTs }"
              />
              <p v-if="errors.totalNFTs" class="text-xs text-[#E74C3C]">
                {{ errors.totalNFTs }}
              </p>
            </div>

            <!-- NFT 單價 -->
            <div class="space-y-2">
              <Label for="nftPrice" class="text-sm font-medium text-[#272D27]">
                NFT 單價 (TWDT) <span class="text-[#E74C3C]">*</span>
              </Label>
              <Input
                id="nftPrice"
                v-model.number="formData.nftPrice"
                type="number"
                step="0.01"
                placeholder="例：100"
                :class="{ 'border-[#E74C3C]': errors.nftPrice }"
              />
              <p v-if="errors.nftPrice" class="text-xs text-[#E74C3C]">
                {{ errors.nftPrice }}
              </p>
              <p class="text-xs text-[#272D27]/60">使用 TWDT 代幣計價</p>
            </div>

            <!-- 投資人分潤百分比 -->
            <div class="space-y-2">
              <Label for="investorShare" class="text-sm font-medium text-[#272D27]">
                投資人分潤 (%) <span class="text-[#E74C3C]">*</span>
              </Label>
              <Input
                id="investorShare"
                v-model.number="formData.investorShare"
                type="number"
                min="0"
                max="100"
                placeholder="例：70"
                :class="{ 'border-[#E74C3C]': errors.investorShare }"
              />
              <p v-if="errors.investorShare" class="text-xs text-[#E74C3C]">
                {{ errors.investorShare }}
              </p>
            </div>

            <!-- 利率 -->
            <div class="space-y-2">
              <Label for="interestRate" class="text-sm font-medium text-[#272D27]">
                利率 (%) <span class="text-[#E74C3C]">*</span>
              </Label>
              <Input
                id="interestRate"
                v-model.number="formData.interestRate"
                type="number"
                step="0.1"
                placeholder="例：5"
                :class="{ 'border-[#E74C3C]': errors.interestRate }"
              />
              <p v-if="errors.interestRate" class="text-xs text-[#E74C3C]">
                {{ errors.interestRate }}
              </p>
            </div>

            <!-- 溢價率 -->
            <div class="space-y-2">
              <Label for="premiumRate" class="text-sm font-medium text-[#272D27]">
                溢價率 (%) <span class="text-[#E74C3C]">*</span>
              </Label>
              <Input
                id="premiumRate"
                v-model.number="formData.premiumRate"
                type="number"
                step="0.1"
                placeholder="例：10"
                :class="{ 'border-[#E74C3C]': errors.premiumRate }"
              />
              <p v-if="errors.premiumRate" class="text-xs text-[#E74C3C]">
                {{ errors.premiumRate }}
              </p>
            </div>

            <!-- 農夫地址確認 -->
            <div class="space-y-2">
              <Label for="farmerAddress" class="text-sm font-medium text-[#272D27]">
                農夫地址 <span class="text-[#E74C3C]">*</span>
              </Label>
              <Input
                id="farmerAddress"
                v-model="formData.farmerAddress"
                placeholder="0x..."
                :class="{ 'border-[#E74C3C]': errors.farmerAddress }"
              />
              <p v-if="errors.farmerAddress" class="text-xs text-[#E74C3C]">
                {{ errors.farmerAddress }}
              </p>
            </div>
          </div>

          <!-- 審核備註 -->
          <div class="space-y-2">
            <Label for="reviewNote" class="text-sm font-medium text-[#272D27]">
              審核備註
            </Label>
            <textarea
              id="reviewNote"
              v-model="formData.reviewNote"
              rows="3"
              class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-[#16B36D] focus-visible:ring-[#16B36D]/50 focus-visible:ring-[3px]"
              placeholder="輸入審核備註（選填）"
            />
          </div>

          <!-- 計算摘要 -->
          <div class="p-6 bg-gradient-to-br from-[#16B36D]/10 to-[#A4E2C2]/10 rounded-2xl space-y-3">
            <h4 class="text-base font-semibold text-[#262624] mb-3">
              投資概覽（TWDT 代幣）
            </h4>
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-[#272D27]/60">總募資額</p>
                <p class="text-lg font-bold text-[#16B36D] mt-1">
                  {{ totalFunding }} TWDT
                </p>
              </div>
              <div>
                <p class="text-[#272D27]/60">投資人可獲收益</p>
                <p class="text-lg font-bold text-[#16B36D] mt-1">
                  {{ investorRevenue }} TWDT
                </p>
              </div>
              <div>
                <p class="text-[#272D27]/60">預估年化報酬率</p>
                <p class="text-lg font-bold text-[#16B36D] mt-1">
                  {{ estimatedROI }}%
                </p>
              </div>
            </div>
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
            :disabled="isLoading || !isFormValid"
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
import type { PendingProject, ApprovalFormData } from '~/types/project'
import { FileText, Settings, CheckCircle, XCircle } from 'lucide-vue-next'
import { Drawer } from '~/components/ui/drawer'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'

interface Props {
  open: boolean
  project: PendingProject | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  approve: [data: ApprovalFormData]
  reject: [projectId: string, reason?: string]
}>()

// 表單資料
const formData = ref({
  totalNFTs: 150,
  nftPrice: 100,
  farmerAddress: '',
  investorShare: 70,
  interestRate: 5,
  premiumRate: 10,
  reviewNote: '',
})

// 錯誤訊息
const errors = ref<Record<string, string>>({})

// 載入狀態
const isLoading = ref(false)

// 監聽專案變化，自動填充農夫地址
watch(() => props.project, (newProject) => {
  if (newProject) {
    formData.value.farmerAddress = newProject.farmer_id
  }
}, { immediate: true })

// 計算總募資額
const totalFunding = computed(() => {
  const total = formData.value.totalNFTs * formData.value.nftPrice
  return total.toFixed(2)
})

// 計算投資人可獲收益
const investorRevenue = computed(() => {
  if (!props.project) return '0.00'
  const revenue = props.project.annual_income * (formData.value.investorShare / 100)
  return revenue.toFixed(2)
})

// 計算預估年化報酬率
const estimatedROI = computed(() => {
  const funding = parseFloat(totalFunding.value)
  const revenue = parseFloat(investorRevenue.value)
  if (funding === 0) return '0.00'
  const roi = (revenue / funding) * 100
  return roi.toFixed(2)
})

// 表單驗證
const isFormValid = computed(() => {
  return (
    formData.value.totalNFTs > 0 &&
    formData.value.nftPrice > 0 &&
    formData.value.farmerAddress &&
    formData.value.investorShare >= 0 &&
    formData.value.investorShare <= 100 &&
    formData.value.interestRate >= 0 &&
    formData.value.premiumRate >= 0
  )
})

// 驗證表單
const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.totalNFTs || formData.value.totalNFTs <= 0) {
    errors.value.totalNFTs = '請輸入有效的 NFT 數量'
  }

  if (!formData.value.nftPrice || formData.value.nftPrice <= 0) {
    errors.value.nftPrice = '請輸入有效的 NFT 單價'
  }

  if (!formData.value.farmerAddress) {
    errors.value.farmerAddress = '請輸入農夫地址'
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.value.farmerAddress)) {
    errors.value.farmerAddress = '請輸入有效的以太坊地址'
  }

  if (formData.value.investorShare < 0 || formData.value.investorShare > 100) {
    errors.value.investorShare = '投資人分潤必須在 0-100 之間'
  }

  if (formData.value.interestRate < 0) {
    errors.value.interestRate = '利率不能為負數'
  }

  if (formData.value.premiumRate < 0) {
    errors.value.premiumRate = '溢價率不能為負數'
  }

  return Object.keys(errors.value).length === 0
}

// 處理通過審核
const handleApprove = async () => {
  if (!props.project || !validateForm()) {
    return
  }

  isLoading.value = true

  const approvalData: ApprovalFormData = {
    projectId: props.project._id,
    action: 'approve',
    totalNFTs: formData.value.totalNFTs,
    nftPrice: formData.value.nftPrice,
    farmerAddress: formData.value.farmerAddress,
    investorShare: formData.value.investorShare,
    interestRate: formData.value.interestRate,
    premiumRate: formData.value.premiumRate,
    reviewNote: formData.value.reviewNote,
  }

  emit('approve', approvalData)
  
  // 等待父組件處理完成
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isLoading.value = false
}

// 處理拒絕專案
const handleReject = async () => {
  if (!props.project) return

  const confirmReject = confirm('確定要拒絕此專案嗎？此操作無法撤銷。')
  if (!confirmReject) return

  isLoading.value = true
  
  emit('reject', props.project._id, formData.value.reviewNote || '不符合審核標準')
  
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

