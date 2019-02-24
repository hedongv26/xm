import router from '@/router'
import routerList from '@/router/routerList'
import store from '@/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import Vue from 'vue'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles && Object.keys(store.getters.roles).length > 0) {
        next()
      } else {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          router.addRoutes(routerList()) // 动态添加可访问路由表
          next({ ...to, replace: true })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            const showErr = err || 'Verification failed, please login again'
            Vue.$vux.toast.show({
              text: showErr.toString(),
              type: 'warn'
            })
            next({ path: '/' })
          })
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
