<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form ref="formRef" :model="formData" :rules="rules" class="form" label-width="120px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" style="width: 50%" />
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input v-model="formData.password2" style="width: 50%" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <!-- <UserInfo /> -->
        <!-- <keep-alive> -->
        <component :is="UserInfo" />
        <!-- </keep-alive> -->
      </el-tab-pane>
      <el-tab-pane label="角色管理">
        <!-- <JobInfo /> -->
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserInfo: 'UserInfo',
      // UserInfo: UserInfo,
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    console.log()
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      // 获取用户信息的时候需要用户id
      this.formData = await getUserDetailById(this.$route.params.id)
      // console.log(res)
    },
    async updateUserInfo() {
      // 表单的校验
      await this.$refs.formRef.validate()
      try {
        await saveUserDetailById({
          ...this.formData,
          // 密码是表单里面的字段名称
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (error) {
        this.$message.error(error || '更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
}
.form {
  padding-top: 20px;
}
</style>
