// 定义自定义指令
// 解决图片报错问题

export const imgError = {
  inserted(el, options) {
    // el: 指令所绑定的元素 可以用来直接操作DOM
    // console.log(el)
    console.log(options.value)
    // 如果图片赋值出错了 给他一个默认图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    el.onerror = function() {
      el.src = options.value // 这里不能写死 图片是动态绑定 图片的复用性
    }
  }
}

export const focus = {
  // 当被绑定的元素插入到DOM中时
  inserted: function(el) {
    // 聚焦元素
    el.focus()
  }
}
