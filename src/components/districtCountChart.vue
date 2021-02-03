<template>
  <div style="width: 100%;height: 100%;padding: 10px" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { queryBarData } from '@/api/http'
import { getNowDate, getTomorrowDate } from '@/utils/date'
const startDate = getNowDate()
const endDate = getTomorrowDate()

export default {
  name: 'DistrictCountChart',
  mixins: [resize],
  data() {
    return {
      chart: null,
      xData: [],
      yData: [],
      dataTimer:null,
    }
  },
  beforeDestroy() {
    clearInterval(this.dataTimer)
  },
  mounted() {
    this.getData()
    setTimeout(() => {
      this.dataTimer = setInterval(this.getData, 300000)
    }, 300000)
  },
  methods: {
    strMapToObj(strMap) {
      const obj = Object.create(null)
      for (const [k, v] of strMap) {
        obj[k] = v
      }
      return obj
    },
    getData() {
      const mapObj = new Map()
      mapObj.set('startDate', startDate)
      mapObj.set('endDate', endDate)
      const obj = this.strMapToObj(mapObj)
      queryBarData(obj).then((res) => {
        const xArr = []
        const yArr = []
        res.data.forEach(item => {
          xArr.push(item.name)
          yArr.push(item.value)
        })
        this.xData = xArr
        this.yData = yArr
        this.getInit()
      })
    },
    getInit() {
      const _this = this
      this.chart = echarts.init(this.$el, 'light')
      const option = {
        // backgroundColor: '#00265f',
        'title': {
          'text': '各院区就诊人数',
          x: 'center',
          y: '12%',
          textStyle: {
            color: 'rgb(179, 239, 255)',
            fontSize: '14',
            fontWeight:'bolder',
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'

          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '25%',
          right: '8%',
          left: '10%',
          bottom: '12%'
        },
        xAxis: [{
          type: 'category',
          data: this.xData,
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.12)'
            }
          },
          axisLabel: {
            margin: 20,
            rotate: -20,
            color: '#e2e9ff',
            textStyle: {
              fontSize: 10
            }
          }
        }],
        yAxis: [{
          name: '单位：人',
          axisLabel: {
            formatter: '{value}',
            color: '#e2e9ff'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255,255,255,1)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.12)'
            }
          }
        }],
        series: [{
          type: 'bar',
          data: this.yData,
          barWidth: '18px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,244,255,1)' // 0% 处的颜色
              }, {
                offset: 1,
                color: 'rgba(0,77,167,1)' // 100% 处的颜色
              }], false),
              barBorderRadius: [30, 30, 30, 30],
              shadowColor: 'rgba(0,160,221,1)',
              shadowBlur: 4
            }
          },
          label: {
            normal: {
              show: true,
              lineHeight: 30,
              width: 80,
              height: 30,
              backgroundColor: 'rgba(0,160,221,0.1)',
              borderRadius: 200,
              position: ['-8', '-60'],
              distance: 1,
              formatter: [
                '    {d|●}',
                ' {a|{c}}     \n',
                '    {b|}'
              ].join(','),
              rich: {
                d: {
                  color: '#3CDDCF'
                },
                a: {
                  color: '#fff',
                  align: 'center'
                },
                b: {
                  width: 1,
                  height: 30,
                  borderWidth: 1,
                  borderColor: '#234e6c',
                  align: 'left'
                }
              }
            }
          }
        }]
      }
      this.chart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
