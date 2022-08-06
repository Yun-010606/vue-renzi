import ToolBar from '@/components/ToolBar'
import UploadExcel from './UploadExcel'
import ImageUpload from '@/components/ImageUpload'
// 封装ToolBar组件 再到mian.js中引入 共全局使用
// 对象
export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel) // 注册导入excel组件
    Vue.component(ImageUpload.name, ImageUpload)
  }
}
// 函数
// export default {
//     install(Vue) {
//         Vue.component(ToolBar.name,ToolBar)
//     }
// }

