<template>
  <!-- 检验医嘱详情信息 -->
  <el-dialog :title="title" :visible.sync="dialogVisible" :append-to-body="appendToBody" class="layout_box ui_dialog_02">
    <el-table
      :data="examTable"
      height="250"
      border
      style="width: 100%">
      <el-table-column
        label="项目名称"
        align="left">
        <template slot-scope="scope">
          {{scope.row.adviceName}}
          <span v-if="scope.row.inspectItemShortName">({{scope.row.inspectItemShortName}})</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantityValue"
        label="测试结果"
        align="left">
        <template slot-scope="scope">
          {{ scope.row.quantityValue || scope.row.qualityValue}}
          <span class="level levelD" v-if='scope.row.resultStatus && (scope.row.resultStatus ==="L" || scope.row.resultStatus ==="LL")'>↓</span>
          <span class="level levelU" v-if='scope.row.resultStatus && (scope.row.resultStatus ==="H" || scope.row.resultStatus ==="HH")'>↑</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="inspectUnitShortName"
        label="单位"
        align="left">
      </el-table-column>
      <el-table-column
        prop="refValue"
        label="参考区间"
        align="left">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: ['examTableDetail', 'visible', 'title', 'appendToBody'],
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    examTable (val) {
      if (this.examTableDetail && this.examTableDetail.length) {
        let list = []
        this.examTableDetail.forEach(item => {
          if (!item.adviceName) {
            item.adviceName = item.inspectItemName
          }
          if (!item.quantityValue) {
            item.quantityValue = item.inspectQuantifyResult
          }
          if (!item.inspectUnitShortName) {
            item.inspectUnitShortName = item.inspectQuantifyUnit
          }
          list.push(item)
        })
        return list
      } else {
        return []
      }
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update', val)
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.level {
  margin-left:10px;
  margin-top:-20px;
  font-size:16px;
}
.levelU {
  color: #EE4433;
}
.levelD {
  color: #35a000;
}
</style>
