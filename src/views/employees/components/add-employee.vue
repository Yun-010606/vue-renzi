<template>
  <el-dialog title="新增角色" :visible="isShowDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          /></el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!--
        checkStrictly: 是否严格的遵守父子节点不互相关联
        emitPath: 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，
        若设置 false，则只返回该节点的值
        -->
        <el-cascader
          v-model="formData.departmentName"
          filterable
          :options="options"
          :props="{label: 'name', value: 'name', checkStrictly: true, emitPath: false}"
          @focus="getDepartments"
        />
        <!-- <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" /> -->
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees.js'
export default {
  name: 'AddEmployee',
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      selectOptions: EmployeeEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  //   created() {
  //     this.getDepartments()
  //   },
  methods: {
    async btnOK() {
      //   校验表单
      await this.$refs.formRef.validate()
      //   调用接口
      await addEmployee(this.formData)
      //   成功的提示
      this.$message.success('新增员工成功')
      //   关闭弹层
      this.close()
      // 重新拉取列表
      //   获取父组件的实例，直接调用父组件的方法
      this.$parent.getEmployeeList()
    },
    async getDepartments() {
      const { depts: res } = await getDepartments()
      //   console.log(res)
      // 数组结构 ==> 树形
      this.options = transListToTreeNew(res, '')
      console.log(this.options)
    },
    close() {
      this.$emit('update:isShowDialog', false)
      //   重置表单
      this.$refs.formRef.resetFields()
      //   重置数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
    }
  }
}
</script>

<style>

</style>
