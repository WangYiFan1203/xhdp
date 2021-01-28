import axios from './api'

// 获取各院区病人数
export const queryBarData = (params) => {
  return axios({
    url: '/data/outHospData/',
    method: 'post',
    data: params
  })
}

// 获取地图省份数据
export const getProvince = (params) => {
  return axios({
    url: '/mapData/getProvince',
    method: 'post',
    data: params
  })
}

// 获取地图市区数据
export const getCityOrCounty = (params) => {
  return axios({
    url: '/mapData/getCityOrCounty',
    method: 'post',
    data: params
  })
}
