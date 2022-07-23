import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 初始化的时候把本地存储里面的token复制给vuex默认值
  userInfo: {} // 存储用户信息
}
// 修改状态
const mutations = {
  // 获取用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 修改token的方法
  setToken(state, token) {
    state.token = token // 修改了vuex状态
    // token ==》 cookie
    setToken(token)
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 退出登录清楚用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录请求 ==> 通过commit ==> 触发mutations
  async login(context, data) {
    // console.log(data)
    setTime()
    const res = await login(data)
    // console.log(res)
    context.commit('setToken', res)
  },
  // 获取用户资料的actions
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // console.log(res)
    // 存储到vuex里
    context.commit('setUserInfo', { ...res, ...baseInfo })
  },
  // 退出登录功能
  logOut(context) {
    context.commit('removeUserInfo') // 清除用户信息
    context.commit('removeToken') // 清除token
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
