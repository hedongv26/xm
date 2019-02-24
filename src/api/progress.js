import request from '@/utils/request'

export function getIndex () {
  return request({
    url: '/table_progress/index',
    method: 'get'
  })
}
export function getList (params) {
  return request({
    url: '/table_progress/getList',
    method: 'get',
    params
  })
}
export function getEdit (params) {
  return request({
    url: '/table_progress/getEdit',
    method: 'get',
    params
  })
}
export function save (data) {
  return request({
    url: '/table_progress/save',
    method: 'post',
    data
  })
}
export function getProgressList (data) {
  return request({
    url: '/table_progress/getProgressList',
    method: 'post',
    data
  })
}
