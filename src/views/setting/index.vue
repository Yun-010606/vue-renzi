<template>
  <div class="dashboard-container">
    <el-card>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="first">
            <el-button style="margin-bottom: 15px;" size="small" icon="el-icon-plus" type="primary" @click="showDialog=true">新增角色</el-button>
            <!-- 表格 -->
            <el-table
              border
              stripe
              :data="list"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="180"
              />
              <el-table-column
                prop="name"
                label="角色名称"
                width="180"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column
                prop="address"
                label="操作"
                width="300px"
              >
                <template v-slot="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :page-size="page.pagesize"
                :total="total"
                :current-page="page.page"
                background
                layout="prev, pager, next"
                @current-change="changeCurrent"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            />
            <el-form style="margin-top: 20px;" label-width="80px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width: 55%;" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 55%;" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 55%;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" disabled style="width: 55%;" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
    <el-dialog :title="showTitle" :visible="showDialog" @close="close">
      <el-form ref="roleForm" :model="roleFormData" :rules="roleRules" label-width="120px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" style="width: 90%;" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleFormData.description" style="width: 90%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnOk">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
export default {
  name: 'Setting',
  data() {
    return {
      roleFormData: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [
          {
            required: true,
            message: '角色内容不能为空'
          }
        ]
      },
      showDialog: false,
      list: [], // 所有角色列表,
      page: {
        page: 1, // 页码
        pagesize: 10// 每页10条
      },
      total: 0,
      formData: {},
      activeName: 'first'
    }
  },
  computed: {
    showTitle() {
      return this.roleFormData.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 获取所有角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      // console.log(res)
      this.list = rows
      this.total = total
    },
    changeCurrent(page) {
      this.page.page = page
      this.getRoleList()
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.companyId)
      // console.log(res)
      this.formData = res
    },
    /** **
 *  删除角色
 *
 * ****/
    async del(id) {
      // 删除之前
      await this.$confirm('确认删除？')
      const len = this.list.length
      await deleteRole(id)
      // console.log(res)
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      // 重新获取数据
      // 删除成功给用户的提示
      this.$message.success('删除成功')
      // 重新拉取列表数据
      this.getRoleList()
    },
    async edit(id) {
      this.showDialog = true
      this.roleFormData = await getRoleDetail(id)
    },
    close() {
      this.showDialog = false
      // 重置默认数据
      this.$refs.roleForm.resetFields()
      // 清楚校验表单
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async btnOk() {
      // 表单校验
      await this.$refs.roleForm.validate()
      // 提交 新增/编辑
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        await addRole(this.roleFormData)
      }
      this.$message.success('编辑成功')
      // 重新拉取列表数据
      this.getRoleList()
      // 关闭弹层
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}
</style>
