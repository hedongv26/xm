import request from '@/utils/request'

export function getIndex () {
  return request({
    url: '/table_progress2/index',
    method: 'get'
  })
}
export function getList (params) {
  return request({
    url: '/table_progress2/getList',
    method: 'get',
    params
  })
}
export function getEdit (params) {
  return request({
    url: '/table_progress2/getEdit',
    method: 'get',
    params
  })
}
export function save (data) {
  return request({
    url: '/table_progress2/save',
    method: 'post',
    data
  })
}
export function getProgressList (data) {
  return request({
    url: '/table_progress2/getProgressList',
    method: 'post',
    data
  })
}
