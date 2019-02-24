import Cookies from 'js-cookie'
import store from '@/store'

const TokenKey = 'Access-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
export function checkRole (url) {
  const roles = store.getters.roles
  // TODO::参数权限
  return roles && url !== undefined && roles['m/' + url.toString()] === true
}
