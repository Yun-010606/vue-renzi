<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0', 1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table row-key="id" :data="list" border>
        <el-table-column align="center" type="index" label="序号" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加权限" :visible="showDialog" @close="close">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-color="1"
            inactive-color="0"
          />
        </el-form-item>
      </el-form>
      <!-- <el-row type="flex" justify="center">
        <el-col :span="6"> -->
      <template #footer>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </template>
      <!-- </el-col>
      </el-row> -->
    </el-dialog>
  </div>
</template>

<script>
import { transListToTree } from '@/utils/index'
import { getPermissionList, addPermission } from '@/api/permisson'
export default {
  name: 'Premission',
  data() {
    return {
      list: [],
      showDialog: false,
      value: true,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      // 新增或者编辑弹框的校验规则，
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async btnOK() {
      try {
        if (this.formData.id) {
        // 编辑
        } else {
        // 添加
          await addPermission(this.formData)
        }
        this.$message.success('添加权限点成功')
        this.close()
        await this.getPermissionList()
      } catch (error) {
        console.log(error)
        this.$message.error('修改失败')
      }
    },
    close() {
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    addPermission(pid, type) {
      // console.log(111)
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTree(res, '0')
      // console.log(this.list)
    }
  }
}
</script>

<style>

</style>
