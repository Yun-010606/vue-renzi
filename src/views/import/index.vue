<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Input',
  data() {
    // const currentKey = [
    //   {
    //     '入职日期': 43535,
    //     '姓名': '高大山',
    //     '工号': 20089,
    //     '手机号': 13041139879,
    //     '转正日期': 43719
    //   },
    //   {
    //     '入职日期': 43535,
    //     '姓名': '高小山',
    //     '工号': 20099,
    //     '手机号': 13041130789,
    //     '转正日期': 43719
    //   }
    // ],
    return {
    }
  },
  methods: {
    async onSuccess({ results }) {
      // console.log(args)
      // console.log(results)
      const userRelations =
      {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const resArr = results.map(item => {
        const obj = {}
        for (const itemKey in item) {
          if (['correctionTime', 'timeOfEntry'].includes(userRelations[itemKey])) {
            // 值为时间 ==> 格式化
            obj[userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/'))
          } else {
            obj[userRelations[itemKey]] = item[itemKey]
          }
        }
        return obj
      })
      await importEmployee(resArr)
      this.$message.success('导入成功')
      // console.log(resArr)
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
