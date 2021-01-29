<template>
  <div id="Home">
    <div class="title">北京协和医院门诊就诊分布大屏</div>
    <el-row style="position: absolute;height: 100%;width: 100%">
      <el-col :span="8" style="display: flex;flex-direction: column;height: 100%">
        <district-count-chart style="height: 55%"/>
        <pie-chart style="height: 45%" />
      </el-col>
      <el-col :span="16" style="height: 100%;">
        <component :is="currenIndex" v-cloak style="width:100%;height: 100%;z-index: 0" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import PieChart from '../components/pieChart'
import allMap from '@/components/allMap'
import testMap from '@/components/testMap'
import DistrictCountChart from '../components/districtCountChart'
export default {
  name: 'Home',
  components: {
    DistrictCountChart,
    allMap,
    PieChart,
    testMap
  },
  data() {
    return {
      currenIndex: 'allMap',
      mapList: [
        {
          type: 'allMap',
          name: '综合地图',
          index: 4
        },
        {
          type: 'testMap',
          name: '综合地图',
          index: 3
        }
      ]
    }
  },
  mounted() {},
  methods: {
    changeList(val) {
      if (val.type === this.currenIndex) {
        return
      }
      this.currenIndex = val.type
    }
  }
}
</script>

<style lang="scss" scoped>
  @font-face {
    font-family: 'aliHeiTi';
    src: url("./../views/font/aliHeiTi.ttf");
  }
  #Home {
    width: 100%;
    height: 100%;
    position: relative;
    background: url("../assets/bg1.jpg") no-repeat;
    background-size: 100% 100%;
    color: #ffffff;
    overflow: hidden;

    .title{
      position: absolute;
      text-align: center;
      margin: 15px auto;
      left: 0;
      right: 0;
      color: #ecf5ff;
      font-size: 20px;
      font-family: 'aliHeiTi'
    }

    .select {
      position: absolute;
      left: 1%;
      top: 15%;
      z-index: 15;

      .select_item {
        padding: 6px 25px;
        color: rgb(179, 239, 255);
        background: rgba(147, 235, 248, .35);
        border-radius: 15px;
        margin: 25px 0;
        cursor: pointer;

        .active {
          color: rgb(254, 217, 50);
        }
      }
    }
  }

</style>
