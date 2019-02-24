// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {LoadingPlugin, ToastPlugin, ConfirmPlugin} from 'vux'
import App from './App'
import router from './router'
import store from './store'
import animated from 'animate.css'
import {checkRole} from '@/utils/auth'
import '@/icons' // icon
import '@/utils/permission' // permission control

import FastClick from 'fastclick'

Vue.prototype.checkRole = checkRole

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(animated)
FastClick.attach(document.body)

Vue.config.productionTip = false

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.dispatch('UpdateDirection', 'forward')
    } else {
      store.dispatch('UpdateDirection', 'reverse')
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.dispatch('UpdateDirection', 'forward')
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
