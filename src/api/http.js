import axios from './api'

// 获取各院区病人数
export const queryBarData = (params) => {
  return axios({
    url: '/data/outHospData/',
    method: 'post',
    data: params
  })
}

// 获取地图数据
export const queryMapData = (params) => {
  return axios({
    url: '/data/mapData',
    method: 'post',
    data: params
  })
}

// 获取地图数据
export const queryMap = (params) => {
  return axios({
    url: '/data/mapData',
    method: 'post',
    data: params
  })
}
