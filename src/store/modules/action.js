import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  haveUpdated: {}
}
const vux = {
  state,
  mutations: {
    UPDATE_HAVEUPDATED (state, option) {
      for (const i in option) {
        Vue.set(state.haveUpdated, i, option[i])
      }
    }
  },
  actions: {
    UpdateHaveUpdated ({ commit }, option) {
      commit('UPDATE_HAVEUPDATED', option)
    },
    GetHaveUpdated ({ commit, state }, name) {
      return state.haveUpdated[name] ? state.haveUpdated[name] : false
    }
  }
}
export default vux
