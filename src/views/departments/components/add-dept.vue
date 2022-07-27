<template>
  <el-dialog title="新增部门" :visible="isShowAdddept" @close="close">
    <el-form ref="formRef" :model="formData" :rules="formAddRules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-input v-model="formData.manager" /> -->
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartments } from '@/api/departments'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    isShowAdddept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value, callback) => {
      //   当前输入的name值 是否跟同级的节点有重复的 (pid === this.currentNode.id)
      // 1.获取所有部门数据
      const { depts } = await getDepartments()
      // 2.找出当前点击部门的子部门数据有什么特点？ pid = 当前点击部门的id
      const currentChildren = depts.filter(item => {
        return item.pid === this.currentNode.id
      })
      //   console.log(currentChildren)
      // 3.value值是否和筛选出来的数据结果里面的name值有重复
      const isRepeat = currentChildren.some(item => item.name === value)
      // return Promise也可以让表单校验拿到结果
      // 成功的promise >> 成功
      // 失败的promise >> 失败
      if (isRepeat) {
        return Promise.reject('部门名称重复了')
      }
    }

    const checkCode = async(rule, value) => {
      // 1.获取所有部门数据
      const { depts } = await getDepartments()

      //   2.检查编码是否有重复的
      const isRepeat = depts.some(item => item.code === value)

      if (isRepeat) {
        return Promise.reject('部门编码重复了')
      }
    }
    return {
      options: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      formAddRules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          },
          { validator: checkName },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          { validator: checkCode },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50字符',
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  //   created() {
  //     this.getEmployeeSimple()
  //   },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    async submit() {
    // 表单校验
      await this.$refs.formRef.validate()
      await addDepartments({
        ...this.formData, // 把表单的数据对象展开
        pid: this.currentNode.id
      })
      this.$message.success('添加成功')
      this.$emit('getDepartments')
      this.close()
    },
    close() {
    // 表单数据需要重置
      this.$refs.formRef.resetFields()
      //   通过.sync提供的自定义事件修改父组件属性
      this.$emit('update:isShowAdddept', false)
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
