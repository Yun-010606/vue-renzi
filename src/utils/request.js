import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from './auth'
import router from '@/router'
const request = axios.create({
  baseURL: process.env['VUE_APP_BASE_API']
}) // 创建axios实例
const timeout = 60000000000
// 如果没有过期返回true
// 如果过期了返回false
function isCheckTime() {
  return Date.now() - getTime() < timeout
}
// 请求拦截器
request.interceptors.request.use(config => {
  // 如果token存在 请求的时候需要把token携带到请求头
  const token = store.getters.token
  if (token) {
    // token携带到请求头
    if (isCheckTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      Message.error('登陆过期, 请重新登录')
      store.dispatch('user/logOut')
      router.push('/')
      return Promise.reject('Token过期了')
    }
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(response => {
  console.log(response)
  const { data: { success, message, data }} = response
  // 判断success是否为true
  // true ==> 请求才是成功 ==> data可用
  if (success) {
    return data
  }
  // 如果代码走到这里 证明success不存在 ==> 接口请求有问题
  // 进行错误提示
  Message.error(message || '系统错误')
  // 失败的promise.reject ==> 就是为了让接口请求的地方报错
  return Promise.reject(message || '系统错误')
}, error => {
  // 添加一些错误的处理方式
  // 401 ==》 退出登陆 ==》跳转登录界面
  // console.dir(error)
  if (error.response.status === 401) {
    // 退出登录
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request // 默认导出request请求
