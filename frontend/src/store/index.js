import { createStore } from 'vuex'

export default createStore({
  state: {
    url: process.env.VUE_APP_URL, 
    userId: "",
    neoId: "",
    username: "",
    authorized: false,
    chatWindow: false,
    privateChat: "Global",
  },
  getters: {
  },
  mutations: {
    setUserId(state, param) {
      state.userId = param
    },
    setNeoId(state, param) {
      state.neoId = param
    },
    setUsername(state, param) {
      state.username = param
    },
    setAuthorized(state, param) {
      state.authorized = param
    },
    setChatWindow(state) {
      state.chatWindow = !state.chatWindow
    },
    setPrivateChat(state, param) {
      state.privateChat = param
    },
  },
  actions: {
  },
  modules: {
  }
})
