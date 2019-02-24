import Vue from 'vue'
import Router from 'vue-router'
import routerList from './routerList'

Vue.use(Router)

let list = [
  { path: '/login', component: () => import('@/views/login/index') },
  { path: '/404', component: () => import('@/views/404') },
  {
    path: '',
    redirect: '/index'
  }
]
list.push(...routerList)

// 实例化vue的时候只挂载constantRouter
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: list
})
