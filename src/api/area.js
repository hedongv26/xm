import request from '@/utils/request'

export function getAreaAll () {
  return request({
    url: '/Area/all',
    method: 'get'
  })
}
