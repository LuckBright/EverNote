<template>
  <div>
    <el-dialog
      :title="title + '支付流水'"
      :visible.sync="v"
      class="ui_dialog_02 dailytosettlecode"
      width="80%"
    >
      <div>
        <el-table :data="payArray" tooltip-effect="dark" id="printTable">
          <el-table-column prop="name" label="患者"></el-table-column>
          <el-table-column prop="payTime" label="支付时间"></el-table-column>
          <el-table-column prop="flowFee" label="金额">
            <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="settlementNo" label="结算单号">
            <template slot-scope="scope">
              <a
                href="javascript:void(0)"
                @click="settlementDetail(scope.row)"
              >{{scope.row.settlementNo}}</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['dialogtosettle', 'title', 'payArray'],
  computed: {
    v: {
      get () {
        return this.dialogtosettle
      },
      set (val) {
        this.$emit('update:dialogtosettle', val)
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    settlementDetail (row) {
      window.open(
        this.$ever.rcmIndex + '/rcm/paymentDetail?status=2&settlementId=' +
        row.settlementId
      )
    }
  }
}
</script>
<style scoped>
.ui_dialog_02.dailytosettlecode .el-dialog .el-dialog__body {
  padding-bottom: 30px;
}
</style>
