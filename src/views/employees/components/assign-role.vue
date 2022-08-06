<template>
  <el-dialog :visible="showDialog" title="角色权限" @close="close">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="btnOk">确认</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      // console.log(res)
      this.list = rows
      // console.log(this.list)
    },
    async getCurrentRolesId(id) {
      const { roleIds = [] } = await getUserDetailById(id)
      // console.log(res)
      this.roleIds = roleIds
    },
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('修改角色成功')
        // 关闭弹层
        this.close()
      } catch (error) {
        this.$message.error('修改失败')
        // 也需要关闭弹层
        this.close()
      }
    },
    close() {
      // 手动修改父组件的弹层标识变为false
      // 这个属性使用.sync传递下来的
      // 当前选中的角色列表数据置空
      this.roleIds = []
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
