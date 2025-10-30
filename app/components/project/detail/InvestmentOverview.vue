<script setup lang="ts">
import { TrendingUp, DollarSign, Shield } from 'lucide-vue-next'
import Card from '~/components/ui/card/Card.vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

interface InvestmentOverviewProps {
  investorShare: number
  farmerShare: number
  insuranceShare: number
  expectedTotalReturn: number
  insuranceCoverage: number
  annualizedROI: number
}

const props = defineProps<InvestmentOverviewProps>()

const simulationAmount = ref(10000)

// 圓餅圖配置
const pieChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    legend: {
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            formatter: '{b}\n{c}%'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: props.investorShare, 
            name: '投資人報酬',
            itemStyle: { color: '#16B36D' }
          },
          { 
            value: props.farmerShare, 
            name: '農夫收益',
            itemStyle: { color: '#1E3A5F' }
          },
          { 
            value: props.insuranceShare, 
            name: '保險支出',
            itemStyle: { color: '#FDBA45' }
          }
        ]
      }
    ]
  }
})

// 折線圖配置
const lineChartOption = computed(() => {
  const returnProjection = [
    { month: 'Month 1', value: simulationAmount.value },
    { month: 'Month 3', value: simulationAmount.value * 1.02 },
    { month: 'Month 6', value: simulationAmount.value * 1.05 },
    { month: 'Month 9', value: simulationAmount.value * 1.08 },
    { month: 'Month 12', value: simulationAmount.value * (1 + props.annualizedROI / 100) }
  ]

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: returnProjection.map(item => item.month),
      axisLine: {
        lineStyle: {
          color: '#E8EBE4'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#E8EBE4'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#E8EBE4',
          type: 'dashed'
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E8EBE4',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: (params: any) => {
        const value = params[0].value
        return `${params[0].name}<br/>回報: $${value.toLocaleString()}`
      }
    },
    series: [
      {
        data: returnProjection.map(item => item.value),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#16B36D',
          width: 3
        },
        itemStyle: {
          color: '#16B36D'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(22, 179, 109, 0.3)' },
              { offset: 1, color: 'rgba(22, 179, 109, 0.05)' }
            ]
          }
        }
      }
    ]
  }
})

const distributionData = computed(() => [
  { name: '投資人報酬', value: props.investorShare, color: '#16B36D' },
  { name: '農夫收益', value: props.farmerShare, color: '#1E3A5F' },
  { name: '保險支出', value: props.insuranceShare, color: '#FDBA45' }
])
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-secondary">
      收益與模擬
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="p-6 border-l-4 border-l-primary">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-primary/10 rounded-lg">
            <DollarSign class="w-5 h-5 text-primary" />
          </div>
          <h4 class="text-secondary">預期總收益</h4>
        </div>
        <p class="text-3xl text-primary mt-2">
          ${{ expectedTotalReturn.toLocaleString() }}
        </p>
        <p class="text-sm text-secondary/60 mt-1">
          每投資 $10,000
        </p>
      </Card>

      <Card class="p-6 border-l-4 border-l-chart-3">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-chart-3/10 rounded-lg">
            <Shield class="w-5 h-5 text-chart-3" />
          </div>
          <h4 class="text-secondary">保險覆蓋率</h4>
        </div>
        <p class="text-3xl text-chart-3 mt-2">
          {{ insuranceCoverage }}%
        </p>
        <p class="text-sm text-secondary/60 mt-1">
          風險保障
        </p>
      </Card>

      <Card class="p-6 border-l-4 border-l-secondary">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-secondary/10 rounded-lg">
            <TrendingUp class="w-5 h-5 text-secondary" />
          </div>
          <h4 class="text-secondary">年化報酬率</h4>
        </div>
        <p class="text-3xl text-secondary mt-2">
          {{ annualizedROI }}%
        </p>
        <p class="text-sm text-secondary/60 mt-1">
          預期 APY
        </p>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="p-6">
        <h3 class="mb-6 text-secondary">
          收益結構分配
        </h3>
        <ClientOnly>
          <div class="w-full" style="height: 250px; min-height: 250px;">
            <VChart 
              :option="pieChartOption" 
              style="width: 100%; height: 100%;"
              :autoresize="true"
              :init-options="{ renderer: 'canvas' }"
            />
          </div>
          <template #fallback>
            <div class="w-full flex items-center justify-center text-gray-400" style="height: 250px;">
              載入圖表中...
            </div>
          </template>
        </ClientOnly>
        <div class="mt-4"></div>
        <div class="space-y-2">
          <div
            v-for="(item, index) in distributionData"
            :key="index"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
              <span class="text-sm text-secondary">{{ item.name }}</span>
            </div>
            <span class="text-sm text-secondary">{{ item.value }}%</span>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <h3 class="mb-6 text-secondary">
          投資回報模擬
        </h3>
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-secondary/70">模擬投資金額</span>
            <span class="text-primary font-medium">${{ simulationAmount.toLocaleString() }}</span>
          </div>
          <input
            v-model.number="simulationAmount"
            type="range"
            min="1000"
            max="100000"
            step="1000"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          >
        </div>
        <ClientOnly>
          <div class="w-full" style="height: 200px; min-height: 200px;">
            <VChart 
              :option="lineChartOption" 
              style="width: 100%; height: 100%;"
              :autoresize="true"
              :init-options="{ renderer: 'canvas' }"
            />
          </div>
          <template #fallback>
            <div class="w-full flex items-center justify-center text-gray-400" style="height: 200px;">
              載入圖表中...
            </div>
          </template>
        </ClientOnly>
      </Card>
    </div>
  </section>
</template>

