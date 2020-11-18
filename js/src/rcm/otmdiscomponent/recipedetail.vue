<template>
  <el-dialog :visible.sync="v" width="90%">
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData">
        <el-table-column label="全选" type="select"></el-table-column>
        <el-table-column label="就诊流水号"></el-table-column>
        <el-table-column label="visitNumber"></el-table-column>
        <el-table-column label="收费项目种类"></el-table-column>
        <el-table-column label="收费类别"></el-table-column>
        <el-table-column label="处方号"></el-table-column>
        <el-table-column label="处方日期"></el-table-column>
        <el-table-column label="收费项目编码"></el-table-column>
        <el-table-column label="收费项目名称"></el-table-column>
        <el-table-column label="单价" align="right"></el-table-column>
        <el-table-column label="数量"></el-table-column>
        <el-table-column label="剂量"></el-table-column>
        <el-table-column label="规格"></el-table-column>
        <el-table-column label="每次用量"></el-table-column>
        <el-table-column label="使用频次"></el-table-column>
        <el-table-column label="医生姓名"></el-table-column>
        <el-table-column label="科室"></el-table-column>
        <el-table-column label="用法"></el-table-column>
        <el-table-column label="执行天数"></el-table-column>
        <el-table-column label="发药人员"></el-table-column>
        <el-table-column label="收费计价方式"></el-table-column>
        <el-table-column label="最小包装内数量"></el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button type="primary" size="small" @click="handleSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['recipeshow'],
  data () {
    return {
      tableData: []
    }
  },
  computed: {
    v: {
      get () {
        return this.recipeshow
      },
      set (val) {
        this.$emit('update:recipeshow', val)
      }
    }
  },
  methods: {
    handleSure () { }
  }
}
</script>

<style scoped>
</style>
