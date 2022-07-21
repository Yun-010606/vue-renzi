import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken() // 初始化的时候把本地存储里面的token复制给vuex默认值
}
// 修改状态
const mutations = {
  // 修改token的方法
  setToken(state, token) {
    state.token = token // 修改了vuex状态
    // token ==》 cookie
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
// 执行异步
const actions = {
  // 登录请求 ==> 通过commit ==> 触发mutations
  async login(context, data) {
    // console.log(data)
    const res = await login(data)
    // console.log(res)
    context.commit('setToken', res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
