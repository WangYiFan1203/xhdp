<template>
  <div style="width: 100%;height: 100%;padding: 10px" />
</template>

<script>
import echarts from 'echarts'
import liquidfill from 'echarts-liquidfill'
import resize from './mixins/resize'
export default {
  name: 'PieChart',
  mixins: [resize],
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.getInit()
  },
  methods: {
    getInit() {
      const _this = this
      this.chart = echarts.init(this.$el, 'light')
      const option = {
        title: [
          {
            text: '患者及员工发热腹泻情况',
            textAlign: 'center',
            left: '50%',
            top: '12%',
            textStyle: {
              fontSize: '14',
              fontWeight: 'bolder',
              color: 'rgb(179, 239, 255)',
              textAlign: 'center'
            }
          },
          {
            text: '患者发热数',
            textAlign: 'center',
            left: '17%',
            top: '62%',
            textStyle: {
              fontSize: '14',
              fontWeight: 'bolder',
              color: '#00C0FF',
              textAlign: 'center'
            }
          },
          {
            text: '患者腹泻数',
            textAlign: 'center',
            left: '39%',
            top: '62%',
            textStyle: {
              fontSize: '14',
              fontWeight: 'bolder',
              color: '#00FFB0',
              textAlign: 'center'
            }
          },
          {
            text: '员工发热数',
            textAlign: 'center',
            left: '61%',
            top: '62%',
            textStyle: {
              fontSize: '14',
              fontWeight: 'bolder',
              color: '#FFBF11',
              textAlign: 'center'
            }
          },
          {
            text: '员工腹泻数',
            textAlign: 'center',
            left: '83%',
            top: '62%',
            textStyle: {
              fontSize: '14',
              fontWeight: 'bolder',
              color: '#ff4343',
              textAlign: 'center'
            }
          }
        ],
        series: [
          {
            type: 'liquidFill',
            name: '患者发热数',
            center: ['18%', '45%'],
            radius: '20%',
            // 水球颜色
            color: ['#0B5E8B', '#227DB3', '#3F91CC'],
            data: [0.12],
            label: {
              formatter: function(param) {
                // return param.value * 100 + '人'
                return  '--人'
              },
              fontSize: '14',
              textStyle: {
                color: '#ffffff'
              }
            },
            // outline  外边
            outline: {
              borderDistance: 5,
              itemStyle: {
                borderWidth: 5,
                borderColor: '#00C0FF'
              }
            },
            // 内图 背景色 边
            backgroundStyle: {
              color: 'rgba(0,37,83,0.8)'
            }
          }, {
            type: 'liquidFill',
            name: '患者腹泻数',
            // 水球颜色
            color: ['#49d088', '#38b470', '#2aaf66'],
            center: ['40%', '45%'],
            data: [0.2],
            radius: '20%',
            label: {
              formatter: function(param) {
                // return param.value * 100 + '人'
                return  '--人'
              },
              fontSize: '14',
              textStyle: {
                color: '#ffffff'
              }
            },
            // outline  外边
            outline: {
              borderDistance: 5,
              itemStyle: {
                borderWidth: 5,
                borderColor: '#00FFB0'
              }
            },
            // 内图 背景色 边
            backgroundStyle: {
              color: 'rgba(0,37,83,0.8)'
            }
          }, {
            type: 'liquidFill',
            name: '员工发热数',
            // 水球颜色
            color: ['#E3B340', '#F4B30E', '#EACE36'],
            center: ['62%', '45%'],
            data: [0.03],
            radius: '20%',
            label: {
              formatter: function(param) {
                // return param.value * 100 + '人'
                return  '--人'
              },
              fontSize: '14',
              textStyle: {
                color: '#ffffff'
              }
            },
            // outline  外边
            outline: {
              borderDistance: 5,
              itemStyle: {
                borderWidth: 5,
                borderColor: '#FFBF11'
              }
            },
            // 内图 背景色 边
            backgroundStyle: {
              color: 'rgba(0,37,83,0.8)'
            }
          }, {
            type: 'liquidFill',
            name: '员工腹泻数',
            // 水球颜色
            color: ['#ff4343', '#F4B30E', '#EACE36'],
            center: ['84%', '45%'],
            data: [0.06],
            radius: '20%',
            label: {
              formatter: function(param) {
                // return param.value * 100 + '人'
                return  '--人'
              },
              fontSize: '14',
              textStyle: {
                color: '#ffffff'
              }
            },
            // outline  外边
            outline: {
              borderDistance: 5,
              itemStyle: {
                borderWidth: 5,
                borderColor: '#ff4343'
              }
            },
            // 内图 背景色 边
            backgroundStyle: {
              color: 'rgba(0,37,83,0.8)'
            }
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
