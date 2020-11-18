<template>
  <el-dialog
    title="消费明细"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="70%"
  >
    <el-table :data="tableData" border stripe>
      <el-table-column label="序号" prop="index" width="60"></el-table-column>
      <el-table-column label="中心费用类别" prop="centralFeeCate"></el-table-column>
      <el-table-column label="处方日期" prop="dealTime"></el-table-column>
      <el-table-column label="中心收费项目名称" prop="centralFeeName" width="140"></el-table-column>
      <el-table-column label="单价" prop="unitprice"></el-table-column>
      <el-table-column label="数量" prop="count"></el-table-column>
      <el-table-column label="金额" prop="sum">
        <template slot-scope="scope">{{scope.row.sum | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="剂量" prop="dose"></el-table-column>
      <el-table-column label="规格" prop="specification"></el-table-column>
      <el-table-column label="单位" prop="unit"></el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </el-dialog>
</template>
<script>
import list from '@/util/list'
import { querySettlementDetial } from '@/rcm/store/otmdiscomponent/jljh-api.js'
import { jljhCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  mixins: [list],
  props: ['visible', 'params'],
  data () {
    return {
      insuranceOrgId: jljhCode,
      orgList,
      loading: false,
      allTableData: []
    }
  },
  methods: {
    list () {
      this.loading = true
      let params = {
        insuranceOrgId: this.insuranceOrgId,
        macId: this.macId,
        visitNumber: this.params.visitNumber,
        feeno: this.params.feeno,
        hosNo: this.orgList[this.insuranceOrgId].HosCode
      }
      querySettlementDetial(params).then(res => {
        this.allTableData = res.data && res.data.infos.map((item, index) => {
          item.index = index
          return item
        })
        this.totalCount = this.allTableData.length
        this.slice()
      }).catch(err => {
        console.log('err', err)
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.slice()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.slice()
    },
    slice () {
      this.loading = true
      this.tableData = this.allTableData.slice(this.offset, this.offset + this.pagesize)
      this.loading = false
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>
