import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const vux = {
  state: {
    showBack: false,
    title: ''
  },
  mutations: {
    UPDATE_SHOW_BACK (state, status) {
      state.showBack = status
    },
    UPDATE_TITLE (state, title) {
      state.title = title
    }
  },
  actions: {
    UpdateTitleBack ({ commit }, data) {
      commit('UPDATE_TITLE', data.title)
      commit('UPDATE_SHOW_BACK', data.ShowBack)
    }
  }
}
export default vux
