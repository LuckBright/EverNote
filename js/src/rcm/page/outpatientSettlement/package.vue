<template>
  <el-dialog :visible.sync="v" width="70%" :close-on-click-modal="false" class="packageDialog">
    <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="按待结算项目查询" name="settlePackage">
          <el-table :data="tableData"  height="calc(100vh - 400px)">
            <el-table-column show-overflow-tooltip prop="setMealName" label="套餐名称" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="categoryName" label="目录" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="invalidDate" label="有效期" align="center">
              <template slot-scope="scope">
                <span>{{$moment(scope.row.invalidDate).format('YYYY-MM-DD')}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="项目名称" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="count" label="购买数量" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="itemNumFinished" label="可用数量" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.count-scope.row.itemNumFinished}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="按已购套餐查询" name="buyedPackage">
          <setmealquote :patientId="$route.query.patientId" v-on="$listeners"></setmealquote>
        </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { getUsableMealItemBill } from '@/rcm/store/outpatient/outpatient'
import setmealquote from '@/rcm/page/outpatientSettlement/buyedpackage'
export default {
  props: {
    packagevisiable: {
      type: Boolean,
      required: true
    },
    obj: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    v: {
      get () {
        if (this.packagevisiable) {
          this.getlist()
        }
        return this.packagevisiable
      },
      set (v) {
        this.$emit('update:packagevisiable', v)
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      activeTab: 'settlePackage'
    }
  },
  components: {
    setmealquote
  },
  methods: {
    async getlist () {
      try {
        let accountBillId = [
          ...new Set(this.obj.mergedReceiptData.map(item => {
            return item.recipeDetails.map(v => v.accountbillId)
          }))
        ].join(',')
        let params = {
          accountBillIds: accountBillId,
          patientId: this.$route.query.patientId,
          deptCode: this.$route.query.dptId
        }
        let data = await getUsableMealItemBill(params)
        if (data && data.data) {
          this.tableData = data.data
        }
      } catch (err) {}
    }
  }
}
</script>
<style scoped>
.packageDialog{
  min-height: 332px;
}
.packageDialog /deep/ .el-dialog__header{
  padding:0;
}
.packageDialog /deep/ .el-dialog__body{
  padding:10px 20px;
}
.packageDialog /deep/ .el-dialog__header .el-dialog__headerbtn{
  position:absolute;
  right:10px;
  top:10px;
}
.discountcol {
  line-height: 60px;
  text-align: left;
}
.el-col-8 {
  text-align: right;
}
.el-select {
  width: 100%;
}
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  position: absolute;
  margin-top: -5px;
  left: 0;
}
</style>
