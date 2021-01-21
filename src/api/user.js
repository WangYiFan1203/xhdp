import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/api/token',
//     method: 'post',
//     params: data,
//     data,
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest'
//     }
//   })
// }
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
