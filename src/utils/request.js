import axios from 'axios'
import Vue from 'vue'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Access-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== 1) {
      // -14:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      switch (res.code) {
        case -14:
        case 50014:
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
          break
        case 50012:
          Vue.$vux.confirm.show({
            value: true,
            title: '确定登出',
            content: '你已被登出，可以取消继续留在该页面，或者重新登录',
            confirmText: '重新登录',
            onConfirm () {
              store.dispatch('FedLogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            }
          })
          break
        default:
          Vue.$vux.toast.show({
            text: res.msg,
            type: 'cancel',
            time: 5 * 1000,
            position: 'top'
          })
      }
      Vue.$vux.loading.hide()
      return Promise.reject(new Error('发生了一些错误'))
    } else {
      return response.data
    }
  },
  error => {
    Vue.$vux.toast.show({
      text: '操作失败<br/>' + error.toString().substring(0, 20),
      type: 'cancel',
      time: 5 * 1000,
      position: 'top'
    })
    Vue.$vux.loading.hide()
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
