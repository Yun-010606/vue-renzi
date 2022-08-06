<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共304条记录</span>
        </template>
        <template #after>
          <el-button size="small" type="primary" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="small" type="warning" @click="isShowDialog=true">新增员工</el-button>
        </template>
      </ToolBar>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <el-row type="flex" justify="center">
                <el-avatar
                  style="width: 80px; height: 80px;"
                  :src="row.staffPhoto"
                  @click.native="showQrCode(row.staffPhoto)"
                >
                  <!-- 图片加载不出来的时候会展示插槽里面的内容 -->
                  <img src="@/assets/common/bigUserHeader.png" alt="">
                </el-avatar>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" />
          <el-table-column :formatter="formatter" prop="formOfEmployment" label="聘用形式" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column label="入职时间">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" />
          <el-table-column label="操作" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :page-size="page.size"
            :current-page.sync="page.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="getEmployeeList"
          />
        </el-row>
      </el-card>
    </div>
    <AddEmployee :is-show-dialog.sync="isShowDialog" />
    <el-dialog :visible.sync="showAvatar" title="头像二维码">
      <canvas ref="canvas" />
    </el-dialog>
    <AssignRole ref="roleRef" :current-id="currentId" :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import AssignRole from '@/views/employees/components/assign-role.vue'
import AddEmployee from './components/add-employee.vue'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
import qrCode from 'qrcode'
// import ToolBar from '@/components/ToolBar'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      showDialog: false,
      showAvatar: false,
      currentId: null,
      isShowDialog: false,
      list: [],
      total: 0, // 总数
      page: {
        page: 1, // 当前页码
        size: 10
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async showRole(id) {
      this.currentId = id
      // 手动调用弹层内部获取到当前用户角色数据的方法
      await this.$refs.roleRef.getCurrentRolesId(id)
      this.showDialog = true
    },
    showQrCode(url) {
      console.log(url)
      // 预览头像的弹层展示出来
      this.showAvatar = true
      // console.log(this.$refs.convas) // undefined
      // qrCode.toCanvas(this.$refs.convas, url)
      // 数据更新之后界面不能立即渲染
      // 如果要在数据更新后获取到更新后的最新的dom元素
      // 需要使用到$nextTick
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.canvas, url)
      })
    },
    async exportToExcel() {
      // 预期导出一个excel
      // 动态导入一个模块的时候 使用import语法
      // import 返回值是一个promise
      // 如果想要拿到模块内部导出的内容 .then(res) 接收
      // const tHeader = ['Id', '标题', '作者', '阅读', '时间']
      // import('@/utils/Export2Excel').then((res) => {
      //   res.export_json_to_excel({
      //     header: tHeader, // 表头 必填
      //     data: [[2, '白马', '123', '123', '2022-07-30']], // 具体数据 必填
      //     filename: 'excel-list', // 非必填
      //     autoWidth: true, // 非必填
      //     bookType: 'xlsx' // 非必填
      //   })
      // })
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 使用了import 语法的文件会单独打包出一个文件
      // 使用魔法注释 ==> 自定义文件名
      // webpackChunkName： '文件名'
      const { export_json_to_excel } = await import(/* webpackChunkName: 'export2Excel'*/'@/utils/Export2Excel')
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      // console.log(rows)
      const resData = this.formatterData(rows, headers)
      // console.log(resData)
      // const tHeader = ['Id', '标题', '作者', '阅读', '时间']
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        // 每一个内层数据占据一行数据
        // 内层数组和header一一对应
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatterData(rows, headers) {
      // console.log(rows)
      // console.log(headers)
      // 遍历原始rows数据
      const res = rows.map(item => {
        // item ==> 员工对象
        // 返回的值为数组
        // 顺序需要和headers的key一一对应
        // 直接map ==> Object.keys(headers)
        // k可以拿到遍历每一项的中文key
        // 中文key ==> 映射表 ==> 英文key ==> 通过item可以找到具体数据进行返回
        return Object.keys(headers).map(key => {
          // 判断
          // 如果是时间 ==> 格式化
          // 如果是聘用形式 ==> 转化 1 正式员工 2 非正式员工 未知
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
      return res
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      console.log(rows)
      this.list = rows
      this.total = total
    },
    async del(id) {
      try {
        // 点击删除提示用户是否删除
        await this.$confirm('是否删除?')
        // 请求接口
        await delEmployee(id)
        this.$message.success('删除成功')
        // 重新拉取列表
        await this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    },
    // changeCurrent(page) {
    //   this.page.page = page
    //   this.getEmployeeList()
    // },
    // formatter：格式化内容
    formatter(row, column, cellValue, index) {
      const identity = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return identity || '未知'
    }
  }
}
</script>

<style>

</style>
