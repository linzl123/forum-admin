import {createStore} from "vuex"

export default createStore({
  state: {
    alert: null,
    userMap: new Map(),
  },
  getters: {},
  mutations: {
    setAlert(state, payload) {
      state.alert = payload
    },
    alert(state, payload) {
      Object.assign(payload, {duration: 1800})
      state.alert(payload)
    },
    setUserMap(state, payload) {
      state.userMap.set(payload[0], payload[1])
    },
  },
  actions: {},
  modules: {},
})
