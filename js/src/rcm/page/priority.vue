<template>
  <div>
    <div class="layout_inner priority">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="卡券名称"></el-table-column>
        <el-table-column prop="value" label="优先级">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" type="number"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button size="small" type="primary" style="margin-right:10px;" @click="save">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { findAll, update } from '@/rcm/store/priority.js'
export default {
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    async getlist () {
      this.loading = true
      try {
        let data = await findAll()
        this.tableData = data.data
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    checkreceipt (arr) {
      let obj = {}
      let newarr = arr.reduce((total, cur) => {
        cur.value === '' ? (obj[cur.value] = true) : null
        obj[cur.value] ? '' : (obj[cur.value] = true && total.push(cur))
        return total
      }, [])
      return newarr
    },
    async save () {
      if (this.checkreceipt(this.tableData).length === this.tableData.length) {
        try {
          this.tableData.filter(v => v.value === '')
          let data = await update(this.tableData)
          if (data) {
            this.$messageTips(this, 'success', '保存成功')
          }
        } catch (err) { }
      } else {
        this.$messageTips(this, 'error', '优先级不能重复且不能为空')
      }
    }
  }
}
</script>
<style scoped>
.priority /deep/ input::-webkit-outer-spin-button,
.priority /deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.priority /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
</style>

