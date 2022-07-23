import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'
// 怎么操作cookie ==> 可以借助第三方库 因为原生的会比较麻烦
const TokenKey = 'hrsass_token' // token存储到本地存储 ==> key
const TimeKey = 'time_key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export const getTime = () => {
  return Cookies.get(TimeKey)
}
// 设置时间戳
export const setTime = () => {
  Cookies.set(TimeKey, Date.now())
}
