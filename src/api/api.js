import axios from 'axios'
import config from '../../public/config'

const instance = axios.create({
  headers: { 'content-type': 'application/json' }
})

instance.defaults.baseURL = window.PLATFROM_CONFIG.baseURL
instance.defaults.withCredentials = true

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const urlValue = config.url.indexOf('/static')
  if (urlValue !== -1) {
    instance.defaults.baseURL = window.PLATFROM_CONFIG.jsonURL
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  // console.log(response)
  return response.data
}, function(error) {
  // 对响应错误做点什么

  return Promise.reject(error)
})

export default instance
