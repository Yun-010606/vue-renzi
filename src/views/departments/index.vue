<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <TreeTool :is-root="true" :tree-data="company" @handleAddDepts="handleAddDepts" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data" @handleEditDepts="handleEditDepts" @handleAddDepts="handleAddDepts" @getDepartments="getDepartments" />
        </template>
      </el-tree>
    </div>
    <Adddept :current-node="currentNode" :is-show-adddept.sync="isShowAdddept" />
  </div>
</template>

<script>
import Adddept from '@/views/departments/components/add-dept.vue'
import { transListToTreeNew } from '@/utils/index'
// import { transListToTree } from '@/utils/index'
import { getDepartments } from '@/api/departments'
import TreeTool from '@/views/departments/components/tree-tool.vue'
export default {
  components: {
    TreeTool,
    Adddept
  },
  data() {
    return {
      isShowAdddept: false, // 是否展示弹层
      currentNode: {},
      defaultProps: {
        children: 'children',
        // label；指定节点标签为节点对象的某个属性值
        label: 'name'
      },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      // console.log(res)
      // 替换公司数据
      this.company = {
        name: res.companyName,
        manager: res.companyManage || '管理员',
        id: ''
      }
      // 替换部门数据
      // this.departs = transListToTree(res.depts, '')
      this.departs = transListToTreeNew(res.depts)
    },
    handleAddDepts(node) {
      // 把弹层展示出来
      this.isShowAdddept = true
      // 把当前点击的节点数据通过currentNode记录下来
      this.currentNode = node
      // console.log('点击了按钮')
    },
    handleEditDepts(node) {
      // 把弹层展示出来
      this.isShowAdddept = true
      // 把当前点击的节点数据通过currentNode记录下来
      this.currentNode = node
    }
  }
}
</script>

<style scoped lang="scss">
    .app-container {
        width: 800px;
        border: 1px solid red;
        margin: 100px auto;
    }
</style>
