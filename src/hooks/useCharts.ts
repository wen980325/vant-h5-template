import echarts from '@/utils/echarts'
import { merge } from 'lodash'

const asis = {
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#92A7CA',
    },
    axisLine: {
      lineStyle: {
        color: '#E8EEFA',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#E8EEFA',
        type: 'dashed',
      },
    },
  },
  defaultOption: any = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '2%',
      left: 'center',
      type: 'scroll',
    },
    grid: {
      top: '8%',
      right: '8%',
      bottom: '2%',
      left: '2%',
      containLabel: true,
    },
    xAxis: asis,
    yAxis: asis,
    series: [],
  }

export function useCharts({ clickFun }: any) {
  const myChart = ref()
  let chartInstance: any = null

  const resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })

  const setOption = (option: any) => {
    let opt = merge({}, defaultOption, option)
    chartInstance = echarts.init(myChart.value)
    chartInstance.clear()
    chartInstance.off('click')
    chartInstance.setOption(opt, true)
    chartInstance.on('click', (params: any) => {
      clickFun(params)
    })
  }

  onMounted(() => {
    resizeObserver.observe(myChart.value)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    chartInstance?.dispose()
  })

  return { myChart, setOption }
}
