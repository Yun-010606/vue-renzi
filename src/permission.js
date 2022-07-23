// 引入路由
import router from '@/router'
// 引入store仓库 ==> 有token的
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 给login和404空白页重命名一下
const loginPath = '/login'
const notFoundPath = '/404'

// 定义空白页
const whiteList = [loginPath, notFoundPath]

// 监听路由的变化
// 前置路由守卫 ==> 登录前
router.beforeEach(async(to, from, next) => {
  // 让进度条开始
  NProgress.start()
  // 1.是否有token(是否登录)
  const token = store.getters.token
  // 只要有token 我就获取用户信息 只要页面跳转 就会发送请求获取用户信息
  // 第一次进入界面获取 路由发生的跳转的时候不用获取了
  if (token) {
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 判断是否去登录
    if (to.path === loginPath) {
      next('/') // 跳转到首页
    } else {
      // 直接放行
      next()
    }
  } else {
    // 判断是否去空白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
    // 如果没有token, 同时要去的界面不是空白界面(要去有权限的界面) ==> 重定向到登录界面
      next(loginPath)
    }
  }
})
// 路由跳转完以后 ==> 关闭进度条
// 后置路由守卫
router.afterEach(() => {
  setTimeout(() => {
    NProgress.done()
  }, 2000)
})
