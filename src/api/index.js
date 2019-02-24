import request from '@/utils/request'

export function getIndex (params) {
  return request({
    url: '/Index/index',
    method: 'get',
    params
  })
}
export function getChart (params) {
  return request({
    url: '/Index/getChart',
    method: 'get',
    params
  })
}
