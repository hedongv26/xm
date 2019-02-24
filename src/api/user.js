import request from '@/utils/request'

export function save (data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}
