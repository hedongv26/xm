import request from '@/utils/request'

export function getIndex () {
  return request({
    url: '/table_stock/index',
    method: 'get'
  })
}
export function getList (params) {
  return request({
    url: '/table_stock/getList',
    method: 'get',
    params
  })
}
export function getEdit (params) {
  return request({
    url: '/table_stock/getEdit',
    method: 'get',
    params
  })
}
export function save (data) {
  return request({
    url: '/table_stock/save',
    method: 'post',
    data
  })
}
