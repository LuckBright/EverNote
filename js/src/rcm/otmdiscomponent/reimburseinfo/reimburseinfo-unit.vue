<template>
  <div>
    <el-row
      v-for="(item,index) in result1"
      :class="{detail1:item.flag,detail:!item.flag}"
      :key="index"
    >
      <template v-for="(value,key) in item">
        <el-col :span="6" :key="key" v-if="fieldMap[key]">{{fieldMap[key]}}</el-col>
        <el-col :span="2" :key="`${key}_value`" v-if="fieldMap[key]">{{value | formatToFinacial}}</el-col>
      </template>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['result', 'fieldMap'],
  computed: {
    result1: {
      get: function () {
        let ArrItem = []
        let objItem = { flag: true } // 换行标识
        for (let key in this.result) {
          if (this.fieldMap[key]) {
            objItem[key] = this.result[key]
            if (Object.keys(objItem).length === 4) { // 三个换行
              ArrItem.push(JSON.parse(JSON.stringify(objItem)))
              objItem = { flag: !objItem.flag }
            }
          }
        }
        if (Object.keys(objItem).length > 1) {
          ArrItem.push(JSON.parse(JSON.stringify(objItem)))
        }
        return ArrItem
      }
    }
  }
}
</script>
<style scoped>
.detail,
.detail1 {
  line-height: 32px;
  padding-left: 10px;
  border-bottom: 1px solid #000;
}
.detail1 {
  background: #f8f8f8;
}
</style>
