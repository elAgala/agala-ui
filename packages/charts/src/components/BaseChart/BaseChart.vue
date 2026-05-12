<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { useChartTheme } from '../../composables/useChartTheme'

// Register once at module level
use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

type ChartType = 'line' | 'bar' | 'pie'

interface Dataset {
  name?: string
  data: number[]
  color?: string
  areaStyle?: boolean
  smooth?: boolean
}

interface Props {
  type: ChartType
  labels: string[]
  datasets: Dataset[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 280,
})

const { getBaseOption } = useChartTheme()
const option = shallowRef<Record<string, unknown>>({})

function buildOption() {
  const base = getBaseOption(props.type) as Record<string, unknown>

  if (props.type === 'pie') {
    option.value = {
      ...base,
      series: [
        {
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {d}%',
          },
          data: props.datasets[0]?.data.map((value, i) => ({
            value,
            name: props.labels[i] || `Item ${i + 1}`,
          })),
        },
      ],
    }
    return
  }

  option.value = {
    ...base,
    xAxis: {
      ...((base.xAxis as Record<string, unknown>) || {}),
      data: props.labels,
    },
    series: props.datasets.map((ds) => ({
      type: props.type,
      name: ds.name,
      data: ds.data,
      smooth: ds.smooth ?? true,
      symbol: 'circle' as const,
      symbolSize: 6,
      areaStyle: ds.areaStyle ? { opacity: 0.12 } : undefined,
      lineStyle: {
        width: 2,
      },
    })),
  }
}

buildOption()

/* ─── Theme reactivity ─── */
let mo: MutationObserver | null = null
let mq: MediaQueryList | null = null

function onThemeChange() {
  buildOption()
}

onMounted(() => {
  // Watch for custom themes (data-theme attribute changes on <html>)
  mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'data-theme') {
        onThemeChange()
        break
      }
      // Also watch for inline style changes (used by custom theme CSS injection)
      if (m.type === 'childList' || m.type === 'attributes') {
        onThemeChange()
        break
      }
    }
  })
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'style', 'class'],
    subtree: false,
  })

  // Watch for dark mode changes
  mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', onThemeChange)
})

onUnmounted(() => {
  mo?.disconnect()
  mq?.removeEventListener('change', onThemeChange)
})
</script>

<template>
  <div class="base-chart" :style="{ height: `${props.height}px` }">
    <VChart
      :option="option"
      autoresize
      style="width: 100%; height: 100%"
    />
  </div>
</template>

<style scoped>
.base-chart {
  position: relative;
  width: 100%;
}
</style>
