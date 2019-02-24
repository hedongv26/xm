import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getUserInfo (token) {
  return request({
    url: '/auth_rule/getRoles',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/Login/logout',
    method: 'get'
  })
}
