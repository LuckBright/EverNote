<template>
  <el-footer class="alg_c bWhite" height="42px" v-if="showBtn || type === 9">
    <template  v-if="showBtn">
      <template v-if="type === 8">
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" type="primary" @click="clickBtn(1)">通过</el-button>
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" @click="clickBtn(2)">驳回</el-button>
      </template>
      <template v-if="type === 9">
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" type="primary" @click="clickBtn(3)">入库</el-button>
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" @click="clickBtn(4)">拒收</el-button>
      </template>
    </template>
  </el-footer>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
export default {
  props: {
    type: {
      type: Number,
      default: 8
    },
    tableData: {
      type: Array,
      default: () => []
    },
    selectionTable: {
      type: Array,
      default: () => []
    },
    toExamine: Number,
    isInvented: Number
  },
  data () {
    return {
      tableDefaultCellValue,
      btnloading: false,
    }
  },
  computed: {
    // 操作按钮是否显示
    showBtn () {
      if (this.type === 8) {
        return this.tableData.some(item => !item.examineFlag)
      } else {
        return this.tableData.some(item => item.status === 20)
      }
    }
  },
  methods: {
    clickBtn (type) {
      // type: 1: 审核 2：驳回 3：入库 4：拒收
      this.btnloading = true
      this.$emit('back-action-btn', type)
    }
  },
}
</script>

<style>

</style>
