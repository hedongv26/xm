import Vue from 'vue'
import Vuex from 'vuex'
import vux from './modules/vux'
import user from './modules/user'
import layout from './modules/layout'
import action from './modules/action'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    vux,
    layout,
    action
  },
  getters
})

export default store
