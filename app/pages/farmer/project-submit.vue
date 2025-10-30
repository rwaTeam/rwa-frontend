<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Header Section -->
    <div class="bg-gradient-to-br from-[#16B36D]/10 to-[#A4E2C2]/10 border-b border-[#16B36D]/20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <h1 class="text-5xl font-bold text-[#262624] mb-4">
            建立新計劃
          </h1>
          <p class="text-xl text-[#272D27]/70 max-w-2xl">
            提交您的農業專案，預估收益並吸引投資人。
          </p>
          <a
            href="#"
            class="inline-flex items-center gap-2 mt-4 text-[#16B36D] hover:text-[#16B36D]/80 transition-colors"
          >
            <HelpCircle class="w-5 h-5" />
            <span>了解如何計算收益</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column - Form -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Basic Information Card -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
            class="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 class="text-2xl font-semibold text-[#262624] mb-6 flex items-center gap-2">
              <FileText class="w-6 h-6 text-[#16B36D]" />
              基本資料
            </h2>

            <div class="space-y-6">
              <!-- Project Name -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  計劃名稱 <span class="text-red-500">*</span>
                </label>
                <Input
                  v-model="formData.projectName"
                  placeholder="例：愛文芒果外銷專案"
                  class="w-full"
                />
              </div>

              <!-- Crop Type -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  作物種類 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.cropType"
                  class="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="">請選擇作物種類</option>
                  <option value="芒果">芒果</option>
                  <option value="稻米">稻米</option>
                  <option value="番茄">番茄</option>
                  <option value="高麗菜">高麗菜</option>
                  <option value="葉菜類">葉菜類</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  農地位置 <span class="text-red-500">*</span>
                </label>
                <Input
                  v-model="formData.location"
                  placeholder="例：臺南市玉井區"
                  class="w-full"
                />
              </div>

              <!-- Area -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  種植面積 <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Input
                    v-model="formData.area"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    class="w-full pr-20"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#272D27]/60">
                    公頃
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  計劃描述 <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData.description"
                  rows="5"
                  placeholder="詳細描述您的農業專案，包括種植方式、預期產量、市場定位等..."
                  class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                />
              </div>

              <!-- Cover Image Upload -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  計劃封面照片 <span class="text-red-500">*</span>
                </label>
                <div
                  v-if="!imagePreview"
                  class="border-2 border-dashed border-[#16B36D]/30 rounded-2xl p-8 text-center hover:border-[#16B36D]/60 transition-colors cursor-pointer"
                  @click="openFileDialog"
                >
                  <Upload class="w-12 h-12 text-[#16B36D] mx-auto mb-3" />
                  <p class="text-sm text-[#272D27]/70 mb-1">
                    點擊上傳或拖曳圖片至此
                  </p>
                  <p class="text-xs text-[#272D27]/50">
                    支援 JPG、PNG 格式，建議尺寸 1200x800px
                  </p>
                </div>
                <div
                  v-else
                  class="relative rounded-2xl overflow-hidden group"
                >
                  <img
                    :src="imagePreview"
                    alt="封面預覽"
                    class="w-full h-64 object-cover"
                  >
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      class="bg-white hover:bg-white/90"
                      @click="openFileDialog"
                    >
                      <Upload class="w-4 h-4 mr-2" />
                      更換圖片
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      @click="removeImage"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      刪除
                    </Button>
                  </div>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  class="hidden"
                  @change="handleFileChange"
                >
              </div>

              <!-- Date Range -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-[#272D27] mb-2">
                    預計開始日期 <span class="text-red-500">*</span>
                  </label>
                  <Input
                    v-model="formData.startDate"
                    type="date"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#272D27] mb-2">
                    預計結束日期 <span class="text-red-500">*</span>
                  </label>
                  <Input
                    v-model="formData.endDate"
                    type="date"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Yield and Price -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-[#272D27] mb-2">
                    預估產量 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <Input
                      v-model="formData.expectedYield"
                      type="number"
                      step="1"
                      placeholder="0"
                      class="w-full pr-20"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#272D27]/60">
                      kg/ha
                    </span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#272D27] mb-2">
                    單位價格 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <Input
                      v-model="formData.unitPrice"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      class="w-full pr-20"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#272D27]/60">
                      元/kg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information Card -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
            class="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 class="text-2xl font-semibold text-[#262624] mb-6 flex items-center gap-2">
              <Shield class="w-6 h-6 text-[#16B36D]" />
              資料補充
            </h2>

            <div class="space-y-6">
              <!-- Insurance -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-3">
                  是否投保災害險？
                </label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="formData.hasInsurance"
                      type="radio"
                      :value="true"
                      class="w-4 h-4 text-[#16B36D] border-gray-300 focus:ring-[#16B36D]"
                    >
                    <span class="text-sm text-[#272D27]">是</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="formData.hasInsurance"
                      type="radio"
                      :value="false"
                      class="w-4 h-4 text-[#16B36D] border-gray-300 focus:ring-[#16B36D]"
                    >
                    <span class="text-sm text-[#272D27]">否</span>
                  </label>
                </div>
              </div>

              <!-- Sustainability -->
              <div>
                <label class="block text-sm font-medium text-[#272D27] mb-2">
                  永續性說明
                </label>
                <textarea
                  v-model="formData.sustainability"
                  rows="4"
                  placeholder="例如：採用減少農藥使用、節水灌溉技術、有機肥料等環境友善措施..."
                  class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons (Mobile) -->
          <div class="lg:hidden flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              class="flex-1"
              @click="handlePreview"
            >
              <Eye class="w-5 h-5 mr-2" />
              預覽計劃
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="flex-1"
              @click="handleCancel"
            >
              取消
            </Button>
            <Button
              size="lg"
              class="flex-1 bg-[#16B36D] hover:bg-[#16B36D]/90 text-white"
              @click="handleSubmit"
            >
              <Send class="w-5 h-5 mr-2" />
              提交審核
            </Button>
          </div>
        </div>

        <!-- Right Column - Calculator Panel -->
        <div class="lg:col-span-1">
          <div
            v-motion
            :initial="{ opacity: 0, x: 30 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 600, delay: 300 } }"
            class="sticky top-6"
          >
            <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
              <!-- Panel Header -->
              <button
                class="w-full px-6 py-4 bg-gradient-to-r from-[#16B36D] to-[#16B36D]/80 text-white flex items-center justify-between hover:from-[#16B36D]/90 hover:to-[#16B36D]/70 transition-all"
                @click="calculatorExpanded = !calculatorExpanded"
              >
                <div class="flex items-center gap-2">
                  <Calculator class="w-5 h-5" />
                  <span class="font-semibold">收益計算器</span>
                </div>
                <ChevronDown
                  class="w-5 h-5 transition-transform duration-300"
                  :class="{ 'rotate-180': calculatorExpanded }"
                />
              </button>

              <!-- Panel Content -->
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-300 ease-in"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[2000px]"
                leave-from-class="opacity-100 max-h-[2000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-show="calculatorExpanded" class="p-6 space-y-6">
                  <!-- Parameters -->
                  <div>
                    <h3 class="text-sm font-semibold text-[#262624] mb-4">
                      投資假設參數
                    </h3>
                    <div class="space-y-4">
                      <div
                        v-for="param in parameterList"
                        :key="param.key"
                        class="bg-[#FAF9F6] rounded-xl p-4 border border-[#16B36D]/10"
                      >
                        <label class="block text-xs text-[#272D27]/70 mb-2">
                          {{ param.name }}
                        </label>
                        <div class="flex items-center gap-2">
                          <Input
                            v-model="calculatorParams[param.key as keyof typeof calculatorParams]"
                            type="number"
                            step="any"
                            class="flex-1 text-right font-semibold"
                          />
                          <span class="text-sm font-medium text-[#16B36D] min-w-[40px]">
                            {{ param.unit }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Results -->
                  <div>
                    <h3 class="text-sm font-semibold text-[#262624] mb-4">
                      預估收益摘要
                    </h3>
                    <div class="space-y-3">
                      <div class="bg-gradient-to-br from-[#16B36D]/10 to-[#A4E2C2]/10 rounded-xl p-4 border border-[#16B36D]/20">
                        <div class="text-xs text-[#272D27]/70 mb-1">
                          第 1 年投資報酬率
                        </div>
                        <div class="text-2xl font-bold text-[#16B36D]">
                          {{ calculatedResults.year1Return }}
                        </div>
                      </div>
                      <div class="bg-gradient-to-br from-[#FDBA45]/10 to-[#FD773D]/10 rounded-xl p-4 border border-[#FDBA45]/20">
                        <div class="text-xs text-[#272D27]/70 mb-1">
                          第 5 年投資報酬率
                        </div>
                        <div class="text-2xl font-bold text-[#FD773D]">
                          {{ calculatedResults.year5Return }}
                        </div>
                      </div>
                      <div class="bg-gradient-to-br from-[#16B36D]/10 to-[#1E3A5F]/10 rounded-xl p-4 border border-[#1E3A5F]/20">
                        <div class="text-xs text-[#272D27]/70 mb-1">
                          第 10 年投資報酬率
                        </div>
                        <div class="text-2xl font-bold text-[#1E3A5F]">
                          {{ calculatedResults.year10Return }}
                        </div>
                      </div>
                      <div class="bg-gradient-to-br from-[#A4E2C2]/20 to-[#16B36D]/20 rounded-xl p-4 border border-[#16B36D]/30">
                        <div class="text-xs text-[#272D27]/70 mb-1">
                          殖利率（不買回）
                        </div>
                        <div class="text-2xl font-bold text-[#16B36D]">
                          {{ calculatedResults.yieldRate }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Action Buttons (Desktop) -->
            <div class="hidden lg:flex flex-col gap-4 mt-6">
              <Button
                size="lg"
                class="w-full bg-[#16B36D] hover:bg-[#16B36D]/90 text-white"
                @click="handleSubmit"
              >
                <Send class="w-5 h-5 mr-2" />
                提交審核
              </Button>
              <div class="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  @click="handlePreview"
                >
                  <Eye class="w-5 h-5 mr-2" />
                  預覽
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  @click="handleCancel"
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="showSuccessModal = false"
      >
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 300 } }"
          class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          @click.stop
        >
          <div class="text-center">
            <div class="w-16 h-16 bg-[#16B36D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle class="w-10 h-10 text-[#16B36D]" />
            </div>
            <h3 class="text-2xl font-bold text-[#262624] mb-2">
              提交成功！
            </h3>
            <p class="text-[#272D27]/70 mb-6">
              您的農業專案已成功提交審核，我們會盡快處理您的申請。
            </p>
            <Button
              size="lg"
              class="w-full bg-[#16B36D] hover:bg-[#16B36D]/90 text-white"
              @click="showSuccessModal = false"
            >
              確定
            </Button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Preview Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        @click="showPreviewModal = false"
      >
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 300 } }"
          class="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-[#262624]">
              計劃預覽
            </h3>
            <button
              class="text-[#272D27]/50 hover:text-[#272D27] transition-colors"
              @click="showPreviewModal = false"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Cover Image -->
            <div v-if="imagePreview" class="rounded-2xl overflow-hidden">
              <img
                :src="imagePreview"
                alt="封面預覽"
                class="w-full h-48 object-cover"
              >
            </div>

            <!-- Project Info -->
            <div class="space-y-4">
              <div>
                <div class="text-sm text-[#272D27]/60 mb-1">計劃名稱</div>
                <div class="text-lg font-semibold text-[#262624]">
                  {{ formData.projectName || '未填寫' }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-[#272D27]/60 mb-1">作物種類</div>
                  <div class="font-medium text-[#262624]">
                    {{ formData.cropType || '未填寫' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-[#272D27]/60 mb-1">農地位置</div>
                  <div class="font-medium text-[#262624]">
                    {{ formData.location || '未填寫' }}
                  </div>
                </div>
              </div>

              <div>
                <div class="text-sm text-[#272D27]/60 mb-1">種植面積</div>
                <div class="font-medium text-[#262624]">
                  {{ formData.area || '0' }} 公頃
                </div>
              </div>

              <div>
                <div class="text-sm text-[#272D27]/60 mb-1">計劃描述</div>
                <div class="text-[#262624] whitespace-pre-wrap">
                  {{ formData.description || '未填寫' }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-[#272D27]/60 mb-1">開始日期</div>
                  <div class="font-medium text-[#262624]">
                    {{ formData.startDate || '未填寫' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-[#272D27]/60 mb-1">結束日期</div>
                  <div class="font-medium text-[#262624]">
                    {{ formData.endDate || '未填寫' }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-[#272D27]/60 mb-1">預估產量</div>
                  <div class="font-medium text-[#262624]">
                    {{ formData.expectedYield || '0' }} kg/ha
                  </div>
                </div>
                <div>
                  <div class="text-sm text-[#272D27]/60 mb-1">單位價格</div>
                  <div class="font-medium text-[#262624]">
                    {{ formData.unitPrice || '0' }} 元/kg
                  </div>
                </div>
              </div>

              <div>
                <div class="text-sm text-[#272D27]/60 mb-1">是否投保災害險</div>
                <div class="font-medium text-[#262624]">
                  {{ formData.hasInsurance ? '是' : '否' }}
                </div>
              </div>

              <div v-if="formData.sustainability">
                <div class="text-sm text-[#272D27]/60 mb-1">永續性說明</div>
                <div class="text-[#262624] whitespace-pre-wrap">
                  {{ formData.sustainability }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-4 mt-8">
            <Button
              variant="outline"
              class="flex-1"
              @click="showPreviewModal = false"
            >
              關閉
            </Button>
            <Button
              class="flex-1 bg-[#16B36D] hover:bg-[#16B36D]/90 text-white"
              @click="handleSubmitFromPreview"
            >
              確認並提交
            </Button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  FileText,
  Shield,
  Calculator,
  Upload,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  X,
} from 'lucide-vue-next'
import Input from '~/components/ui/input/Input.vue'
import Button from '~/components/ui/button/Button.vue'

// Form Data
const formData = reactive({
  projectName: '',
  cropType: '',
  location: '',
  area: '',
  description: '',
  startDate: '',
  endDate: '',
  expectedYield: '',
  unitPrice: '',
  hasInsurance: false,
  sustainability: '',
})

// Image Upload
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = null
  imageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Calculator
const calculatorExpanded = ref(true)

interface Params {
  initCost: number
  annualIncome: number
  investorPercent: number
  interest: number
  premium: number
}

const calculatorParams = reactive({
  initCost: '1150',
  annualIncome: '312',
  investorPercent: '20',
  interest: '5',
  premium: '33',
})

const parameterList = [
  { key: 'initCost', name: '溫室建構費', unit: '萬' },
  { key: 'annualIncome', name: '每年營業額', unit: '萬' },
  { key: 'investorPercent', name: '投資人收益分成%', unit: '%' },
  { key: 'interest', name: '利率%', unit: '%' },
  { key: 'premium', name: '溢酬%', unit: '%' },
]

const toNum = (v: string): number => {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

const calculateData = (params: Params) => {
  const buildCost = params.initCost
  const annualIncome = params.annualIncome
  const investorShareRate = params.investorPercent / 100
  const interestRate = params.interest / 100
  const premiumRate = params.premium / 100
  const yearCount = 34

  const annualPayment = Math.round(annualIncome * investorShareRate)
  const yieldNoBuybackVal = buildCost > 0 ? annualPayment / buildCost : 0

  const data = [] as any[]
  let cumulative = 0
  let lastRemainingPrincipal = buildCost
  let lastRwi = buildCost * (1 + interestRate)

  for (let i = 0; i <= yearCount; i++) {
    let investorIncome: number
    let currentRemainingPrincipal: number
    let currentRwi: number
    let buybackPrice: number
    let totalBuybackIncome: number | string
    let yieldNoBuyback: string
    let totalReturnWithBuyback: string

    if (i === 0) {
      investorIncome = 0
      cumulative = 0
      currentRemainingPrincipal = lastRemainingPrincipal
      currentRwi = lastRwi
      buybackPrice = currentRemainingPrincipal * (1 + premiumRate)
      totalBuybackIncome = ''
      yieldNoBuyback = ''
      totalReturnWithBuyback = ''
    }
    else {
      investorIncome = annualPayment
      cumulative += investorIncome
      currentRemainingPrincipal = lastRwi - investorIncome
      if (currentRemainingPrincipal < 0) {
        currentRemainingPrincipal = 0
      }
      currentRwi = currentRemainingPrincipal * (1 + interestRate)
      buybackPrice = currentRemainingPrincipal * (1 + premiumRate)
      totalBuybackIncome = cumulative + buybackPrice
      const totalReturnVal = buildCost > 0 ? (totalBuybackIncome / buildCost - 1) : 0
      totalBuybackIncome = Math.round(totalBuybackIncome)
      yieldNoBuyback = `${Math.round(yieldNoBuybackVal * 100 * 10) / 10}%`
      totalReturnWithBuyback = `${Math.round(totalReturnVal * 100)}%`
    }

    data.push({
      year: i,
      investorIncome,
      cumulativePrincipal: cumulative,
      remainingPrincipal: Math.round(currentRemainingPrincipal),
      remainingWithInterest: Math.round(currentRwi),
      buybackPrice: Math.round(buybackPrice),
      totalBuybackIncome,
      yieldNoBuyback,
      totalReturnWithBuyback,
    })

    lastRemainingPrincipal = currentRemainingPrincipal
    lastRwi = currentRwi
  }

  return data
}

const calculatedResults = computed(() => {
  const params: Params = {
    initCost: toNum(calculatorParams.initCost),
    annualIncome: toNum(calculatorParams.annualIncome),
    investorPercent: toNum(calculatorParams.investorPercent),
    interest: toNum(calculatorParams.interest),
    premium: toNum(calculatorParams.premium),
  }

  const data = calculateData(params)

  return {
    year1Return: data[1]?.totalReturnWithBuyback || '0%',
    year5Return: data[5]?.totalReturnWithBuyback || '0%',
    year10Return: data[10]?.totalReturnWithBuyback || '0%',
    yieldRate: data[1]?.yieldNoBuyback || '0%',
  }
})

// Modals
const showSuccessModal = ref(false)
const showPreviewModal = ref(false)

// Actions
const handleSubmit = () => {
  // TODO: 實際提交到後端 API
  console.log('提交表單數據:', formData)
  console.log('上傳的圖片:', imageFile.value)
  console.log('計算器參數:', calculatorParams)

  showSuccessModal.value = true
}

const handlePreview = () => {
  showPreviewModal.value = true
}

const handleSubmitFromPreview = () => {
  showPreviewModal.value = false
  handleSubmit()
}

const handleCancel = () => {
  if (confirm('確定要取消嗎？所有未儲存的資料將會遺失。')) {
    // 重置表單
    formData.projectName = ''
    formData.cropType = ''
    formData.location = ''
    formData.area = ''
    formData.description = ''
    formData.startDate = ''
    formData.endDate = ''
    formData.expectedYield = ''
    formData.unitPrice = ''
    formData.hasInsurance = false
    formData.sustainability = ''
    removeImage()
  }
}
</script>

