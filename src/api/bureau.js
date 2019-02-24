import request from '@/utils/request'

export function getIndex () {
  return request({
    url: '/table_bureau/index',
    method: 'get'
  })
}
export function getList (params) {
  return request({
    url: '/table_bureau/getList',
    method: 'get',
    params
  })
}
export function getEdit (params) {
  return request({
    url: '/table_bureau/getEdit',
    method: 'get',
    params
  })
}
export function save (data) {
  return request({
    url: '/table_bureau/save',
    method: 'post',
    data
  })
}
export function getProgressList (data) {
  return request({
    url: '/table_bureau/getProgressList',
    method: 'post',
    data
  })
}
