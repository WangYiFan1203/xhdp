<template>
  <div style="width:100%;height:100%;display: flex;flex-direction: column;position: relative">
    <div class="mapChoose">
      <span v-for="(item,index) in parentInfo" :key="item.code" style="height: 28px">
        <span class="title" @click="chooseArea(item,index)" style="height: 28px">{{ item.cityName==='全国'?'中国':item.cityName }}</span>
        <span v-show="index+1!==parentInfo.length" class="icon"></span>
      </span>
    </div>
    <div ref="allMap" style="width:100%;height:100%;z-index: 0;position: relative"/>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import { getProvince,getCityOrCounty } from '@/api/http'

  export default {
    name: 'AllMap',
    mixins: [resize],
    data() {
      return {
        myCharts: null,
        geoJson: {
          features: []
        },
        parentInfo: [{
          cityName: '全国',
          code: 100000
        }],
        timeTitle: ['2020-08-10'],
        dataTimer:null,
        otherData:[],
        clickBJFlag:false,
        clickCityOrCountyFlag: '',
        cityOrCountyCode:''
      }
    },
    mounted() {
      this.getGeoJson(100000)
      setTimeout(()=>{
        this.dataTimer = setInterval(this.getMapData,300000)
      },300000)
    },
    beforeDestroy() {
      clearInterval(this.dataTimer)
    },
    methods: {
      getGeoJson(adcode) {
        let that = this
        if (adcode.toString().substring(4, 6) !== '00') {
          // let arr
          // this.geoJson.features = this.geoJson.features.filter(
          //     item => item.properties.adcode === adcode
          // );
          //
          // this.getMapData();
          return
        }
        let url = '/static/' + adcode + '.geoJson'
        this.$axios({
          methods: 'GET',
          url: url
        }).then(res => {
          this.drawChart(res.data.features, adcode)
        }).catch(e => {

        })
      },
      drawChart(data, adcode) {
        let Json = data
        if (Json.length > 0) {
          this.geoJson.features = Json
        } else if (Json.length === 0) {
          this.geoJson.features = this.geoJson.features.filter(
            item => item.properties.adcode === adcode
          )
          if (this.geoJson.features.length === 0) return
        }
        this.getMapData()
      },
      // 获取数据
      getMapData() {
        let mapData = {}
        let pointData = {}
        let sum = {}
        this.timeTitle.forEach(item => {
          mapData[item] = []
          pointData[item] = []
          sum[item] = 0
          let params
          if (this.parentInfo.length === 1){
            params = {
              startDate: '2020-08-10',
              endDate: '2020-08-11'
            }
            getProvince(params).then((res) => {
              let result = res.data.codeResult
              this.otherData = []
              result.forEach(item=>{
                if (item.code.toString()==='999999'){
                  this.otherData.push(item)
                }
              })
              this.geoJson.features.forEach(j => {
                let value = 0
                let type = 0
                result.forEach(i => {
                  if (i.code === j.properties.adcode) {
                    value = i.count
                    type = i.type
                  }
                })
                let label = j.properties.name
                mapData[item].push({
                  name: label,
                  value: value,
                  cityCode: j.properties.adcode,
                  type: type
                })
                pointData[item].push({
                  name: label,
                  value: [j.properties.center[0], j.properties.center[1], value, type],
                  cityCode: j.properties.adcode,
                  type: type
                })
                // sum[item] += value
                mapData[item] = mapData[item].sort(function(a, b) {
                  return b.value - a.value
                })
              })
              sum[item] = res.data.total
              this.initEcharts(mapData, pointData, sum)
            })
          }else {
            if (this.clickBJFlag){
              params = {
                startDate: '2020-08-10',
                endDate: '2020-08-11',
                adcode:"11",
                flag:"city"
              }
            }else {
              params = {
                startDate: '2020-08-10',
                endDate: '2020-08-11',
                adcode: this.cityOrCountyCode,
                flag:this.clickCityOrCountyFlag
              }
            }
            getCityOrCounty(params).then((res) => {
              let result = res.data.codeResult
              this.otherData = []
              result.forEach(item=>{
                if (item.code.toString().length===7){
                  this.otherData.push(item)
                }
              })
              this.geoJson.features.forEach(j => {
                let value = 0
                let type = 0
                result.forEach(i => {
                  if (i.code === j.properties.adcode) {
                    value = i.count
                    type = i.type
                  }
                })
                let label = j.properties.name
                mapData[item].push({
                  name: label,
                  value: value,
                  cityCode: j.properties.adcode,
                  type: type
                })
                pointData[item].push({
                  name: label,
                  value: [j.properties.center[0], j.properties.center[1], value, type],
                  cityCode: j.properties.adcode,
                  type: type
                })
                // sum[item] += value
                mapData[item] = mapData[item].sort(function(a, b) {
                  return b.value - a.value
                })
              })
              sum[item] = res.data.total
              this.initEcharts(mapData, pointData, sum)
            })
          }
        })
      },
      initEcharts(mapData, pointData, sum) {
        console.log(mapData)
        this.myChart = echarts.init(this.$refs.allMap)
        if (this.parentInfo.length === 1) {
          echarts.registerMap('china', this.geoJson) // 注册
        } else {
          echarts.registerMap('map', this.geoJson) // 注册
        }
        var option = {
          timeline: {
            data: this.timeTitle,
            axisType: 'category',
            autoPlay: true,
            playInterval: 3000,
            left: '10%',
            right: '10%',
            bottom: '2%',
            width: '80%',
            label: {
              normal: {
                textStyle: {
                  color: 'rgb(179, 239, 255)'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbolSize: 10,
            lineStyle: {
              color: '#8df4f4'
            },
            checkpointStyle: {
              borderColor: '#8df4f4',
              color: '#53D9FF',
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                color: '#53D9FF',
                borderColor: '#53D9FF'
              },
              emphasis: {
                color: 'rgb(58,115,192)',
                borderColor: 'rgb(58,115,192)'
              }
            }

          },
          baseOption: {
            animation: false,
            animationDuration: 900,
            animationEasing: 'linear',
            animationDurationUpdate: 450,
            animationEasingUpdate: 'quadraticIn',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              right: '2%',
              top: '5%',
              bottom: '8%',
              width: '10%'
            },
            // toolbox: {
            //     feature: {
            //         restore: {
            //             show: false
            //         },
            //         dataView: {
            //             optionToContent: function (opt) {
            //                 let series = opt.series[0].static //折线图数据
            //                 let tdHeads =
            //                     '<th  style="padding: 0 20px">所在地区</th><th style="padding: 0 20px">销售额</th>' //表头
            //                 let tdBodys = '' //数据
            //                 let table =
            //                     `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:left;"><tbody><tr>${tdHeads} </tr>`
            //                 for (let i = 0; i < series.length; i++) {
            //                     table += `<tr>
            //       <td style="padding: 0 50px">${series[i].name}</td>
            //       <td style="padding: 0 50px">${series[i].value.toFixed(2)}万</td>
            //       </tr>`
            //                 }
            //                 table += '</tbody></table>'
            //                 return table
            //             }
            //         },
            //         saveAsImage: {
            //             name: this.parentInfo[this.parentInfo.length - 1].cityName + '销售额统计图'
            //         },
            //         dataZoom: {
            //             show: false
            //         },
            //         magicType: {
            //             show: false
            //         }
            //     },
            //     iconStyle: {
            //         normal: {
            //             borderColor: '#1990DA'
            //         }
            //     },
            //     top: 15,
            //     right: 35
            // },
            geo: {
              map: this.parentInfo.length === 1 ? 'china' : 'map',
              zoom: 1.0,
              aspectScale: 0.75, // 长宽比
              roam: true,
              left: '15%',
              right: '25%',
              top: '12%',
              // center: this.parentInfo.length === 1 ? ['118.83531246', '32.0267395887'] : false,
              tooltip: {
                trigger: 'item',
                formatter: (p) => {
                  let val = p.value[2]
                  if (window.isNaN(val)) {
                    val = 0
                  }
                  let txtCon
                  if (p.data.type === 0){
                     txtCon =
                      '<div style=\'text-align:left\'>' + p.name + ':<br />就诊人数：' + val + '人</div>'
                  }else if (p.data.type === 1){
                     txtCon =
                      '<div style=\'text-align:left\'>' + p.name + ':<br />就诊人数：' + val + '人' +
                      '<br/>该地区为中风险地区</div>'
                  }else if (p.data.type === 2){
                     txtCon =
                    '<div style=\'text-align:left\'>' + p.name + ':<br />就诊人数：' + val + '人' +
                    '<br/>该地区为高风险地区</div>'
                  }

                  return txtCon
                }
              },
              label: {
                normal: {
                  show: true,
                  color: 'rgb(249, 249, 249)', // 省份标签字体颜色
                  formatter: p => {
                    switch (p.name) {
                      case '内蒙古自治区':
                        p.name = '内蒙古'
                        break
                      case '西藏自治区':
                        p.name = '西藏'
                        break
                      case '新疆维吾尔自治区':
                        p.name = '新疆'
                        break
                      case '宁夏回族自治区':
                        p.name = '宁夏'
                        break
                      case '广西壮族自治区':
                        p.name = '广西'
                        break
                      case '香港特别行政区':
                        p.name = '香港'
                        break
                      case '澳门特别行政区':
                        p.name = '澳门'
                        break
                      default:
                        break
                    }
                    return p.data.name
                  }
                },
                emphasis: {
                  show: true,
                  color: '#f75a00'
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#24CFF4',
                  borderColor: '#53D9FF',
                  borderWidth: 1.3,
                  shadowBlur: 15,
                  shadowColor: 'rgb(58,115,192)',
                  shadowOffsetX: 7,
                  shadowOffsetY: 6
                },
                emphasis: {
                  areaColor: '#8dd7fc',
                  borderWidth: 1.6,
                  shadowBlur: 25
                }

              }
            }

          },
          options: []
        }
        this.timeTitle.forEach(item => {
          var xData = []
          var yData = []
          var min = mapData[item][mapData[item].length - 1].value
          var max = mapData[item][0].value
          if (mapData[item].length === 1) {
            min = 0
          }

          mapData[item].forEach(c => {
            xData.unshift(c.name)
            yData.unshift(c.value)
          })
          if (this.parentInfo.length===1){
            this.otherData.forEach(item=>{
              if (item.code.toString() === '999999'){
                xData.unshift("其他")
                yData.unshift(item.count)
              }
            })
          }else{
            xData.unshift(this.parentInfo[this.parentInfo.length-1].cityName.substring(0,2)+'其他')
            yData.unshift(this.otherData[0].count)
          }

          option.options.push({
            title: [{
              left: 'center',
              top: '7%',
              text: item + ' ' + this.parentInfo[this.parentInfo.length - 1].cityName +
                '患者来院就诊共' + sum[item] + '人',
              textStyle: {
                color: 'rgb(179, 239, 255)',
                fontSize: 14
              }
            }
            ],
            visualMap: {
              min: min,
              max: max,
              left: '3%',
              bottom: '5%',
              calculable: true,
              seriesIndex: [0],
              inRange: {
                // color: ['#24CFF4', '#2E98CA', '#1E62AC']
                color: ['#1E62AC', '#2E98CA', '#24CFF4']
              },
              textStyle: {
                color: '#24CFF4'
              }
            },
            xAxis: {
              type: 'value',
              scale: true,
              position: 'top',
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#455B77'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                interval: 1000,
                textStyle: {
                  fontSize: 12,
                  color: '#c0e6f9'
                }
              }
            },
            yAxis: {
              type: 'category',
              nameGap: 16,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#455B77'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#c0e6f9'
                }
              },
              data: xData
            },
            series: [
              {
                name: item + '人',
                type: 'map',
                geoIndex: 0,
                map: this.parentInfo.length === 1 ? 'china' : 'map',
                roam: true,
                zoom: 1.0,
                tooltip: {
                  trigger: 'item',
                  formatter: p => {
                    let val = p.value
                    if (p.name === '南海诸岛') return
                    if (window.isNaN(val)) {
                      val = 0
                    }
                    let txtCon =
                      '<div style=\'text-align:left\'>' + p.name +
                      ':<br />人数：' + val + '人</div>'
                    return txtCon
                  }
                },
                label: {
                  normal: {
                    show: true
                  },
                  emphasis: {
                    show: false
                  }
                },
                data: mapData[item]

              },
              {
                name: '散点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                rippleEffect: {
                  brushType: 'fill'
                },
                itemStyle: {
                  color:function(val){
                    if (val.data.type === 0){
                      return '#F4E925'
                    }else if (val.data.type === 1){
                      return '#ffb434'
                    }else if (val.data.type === 2){
                      return '#ff0000'
                    }
                  },
                  shadowBlur:24,
                  shadowColor:'#333'
                },
                data: pointData[item],
                // symbolSize: 8,
                symbolSize: function(val) {
                  let value = val[2]
                  let type = val[3]
                  if (type === 0){
                    if (value === max) {
                      return 18
                    }else if (value === 0){
                      return 0
                    }else {
                      return 12
                    }
                  }else {
                    if (value === max) {
                      return 18
                    }else {
                      return 12
                    }
                  }
                },
                showEffectOn: 'render' // 加载完毕显示特效
              },
              {
                type: 'bar',
                barGap: '-100%',
                barCategoryGap: '60%',
                itemStyle: {
                  normal: {
                    barBorderRadius: 30,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                      offset: 0,
                      color: 'rgb(57,89,255,1)'
                    }, {
                      offset: 1,
                      color: 'rgb(46,200,207,1)'
                    }])
                  },
                  emphasis: {
                    show: false
                  }
                },
                data: yData
              }

            ]
          })
        })
        this.myChart.setOption(option, true)
        this.myChart.off('click')
        this.myChart.on('click', this.echartsMapClick)
        this.myChart.getZr().on('click', (res) => { // 空白
          // console.log(res)
        })
      },

      // 点击下钻
      echartsMapClick(params) {
        if (params.name === '北京市'){
          this.clickBJFlag = true
        }else {
          this.clickBJFlag = false
          if (params.data.cityCode.toString().substring(2,6) === '0000'){
            this.clickCityOrCountyFlag = 'city'
            this.cityOrCountyCode = params.data.cityCode.toString().substring(0,2)
          }else {
            this.clickCityOrCountyFlag = 'county'
            this.cityOrCountyCode = params.data.cityCode.toString().substring(0,4)
          }
        }
        if (params.data.cityCode.toString().substring(4, 6) !== '00') return
        if (!params.data) {
          return
        }
        if (
          this.parentInfo[this.parentInfo.length - 1].code ===
          params.data.cityCode
        ) {
          return
        }
        let data = params.data
        this.parentInfo.push({
          cityName: data.name,
          code: data.cityCode
        })
        this.getGeoJson(data.cityCode)
      },
      // 选择切换市县
      chooseArea(val, index) {
        if (this.parentInfo.length === index + 1) {
          return
        }
        this.parentInfo.splice(index + 1)
        this.getGeoJson(this.parentInfo[this.parentInfo.length - 1].code)
      },
      getNowFormatDate() {
        var date = new Date()
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + ' ' + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds()
        return currentdate
      }
    },
    watch:{
      parentInfo(val){

      }
    }
  }
</script>
<style lang="scss" scoped>

  .mapChoose {
    color: #eee;
    font-size: 10px;
    float: left;
    padding: 5px;
    margin-left: 6%;
    margin-top: 6%;
    margin-bottom: 5px;
    position: absolute;
    z-index: 9999;

    .title {
      padding: 5px;
      border-top: 1px solid rgba(147, 235, 248, .8);
      border-bottom: 1px solid rgba(147, 235, 248, .8);
      cursor: pointer;
    }

    .icon {
      font-family: "simsun";
      font-size: 16px;
      margin: 0 11px;
    }
  }
</style>
