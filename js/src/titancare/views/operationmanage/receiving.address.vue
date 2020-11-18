<template>
  <div class='address-box'>
    <div>
      <div class='address-body'>
        <p>
          <span class='lable-span'>收货地址：</span>
          <b>{{values.province ? values.province : '---' }}</b>
          <b>{{values.city ? values.city : '---' }}</b>
          <b>{{values.county ? values.county : '---' }}</b>
          <b>{{values.addressDetail ? values.addressDetail : '---' }}</b>
        </p>
        <p>
          <span class='lable-span'>收件姓名：</span>
          <b>{{values.name ? values.name : '---'}}</b>
        </p>
        <p>
          <span class='lable-span'>手机号码：</span>
          <b>{{values.mobile ? values.mobile : '---'}}</b>
        </p>
      </div>
      <div>
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          :highlight-current-row="false"
          border
          style="width: 100%; margin-top: 20px">
          <el-table-column
            prop="expressNumber"
            label="快递单号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="expressComName"
            label="快递公司">
          </el-table-column>
          <template v-if="values.dispensingWay !== 3">
            <el-table-column
              prop="serviceName"
              label="物资名称">
            </el-table-column>
            <el-table-column
              prop="recipeCode"
              label="处方号">
            </el-table-column>
          </template>
          <el-table-column
            prop="verificationCode"
            label="验证码">
            <template slot-scope="scope">
              <div>
                {{scope.row.verificationCode || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="收货状态">
            <template slot-scope="scope">
              <div v-if="">
                {{scope.row.status === 0 ? '未收货' : '已收货'}}
              </div>
              <div>
                {{ scope.row.orderExecuteStatus == '1000' ? '已收货' : '未收货' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="opration"
            label="操作">
            <template slot-scope="scope">
              <el-button
                @click="seeAddress(scope.row)">
                查看物流
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="物流进程"
      :visible.sync="dialogVisible"
      width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in details"
          :key="index"
          :timestamp="item.ftime">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <!-- <span slot="footer" class="dialog-footer"></span> -->
    </el-dialog>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
export default {
  props: ['values', 'list'],
  data () {
    return {
      api,
      dialogVisible: false,
      details: [],
      tableData: []
    }
  },
  watch: {
    list (list) {
      this.mergeData(list)
    }
  },
  created () {
    this.mergeData(this.list)
  },
  methods: {
    mergeData (list) {
      if (!list) return
      const _list = list.slice()

      let expressNumberPosi = 0
      let recipeCodePosi = 0
      for (let i = 0; i < _list.length; i++) {
        if (i === 0) {
          _list[expressNumberPosi].mergeRow = 1
          _list[expressNumberPosi].mergeCol = 1
          _list[recipeCodePosi].mergeRow1 = 1
          _list[recipeCodePosi].mergeCol1 = 1
        } else {
          if (_list[i].expressNumber === _list[i - 1].expressNumber) {
            _list[expressNumberPosi].mergeRow = i - expressNumberPosi + 1
            _list[expressNumberPosi].mergeCol = 1
            _list[i].mergeRow = 0
            _list[i].mergeCol = 0
          } else {
            expressNumberPosi = i
            _list[i].mergeRow = 1
            _list[i].mergeCol = 1
          }
          if (_list[i].recipeCode === _list[i - 1].recipeCode) {
            _list[recipeCodePosi].mergeRow1 = i - recipeCodePosi + 1
            _list[recipeCodePosi].mergeCol1 = 1
            _list[i].mergeRow1 = 0
            _list[i].mergeCol1 = 0
          } else {
            recipeCodePosi = i
            _list[i].mergeRow1 = 1
            _list[i].mergeCol1 = 1
          }
        }
      }
      this.tableData = _list
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'expressNumber' || column.property === 'opration') {
        if (row.mergeRow > 1) {
          return {
            rowspan: row.mergeRow,
            colspan: row.mergeCol,
          }
        } else {
          return {
            rowspan: row.mergeRow,
            colspan: row.mergeCol
          }
        }
      }
      if (column.property === 'recipeCode') {
        if (row.mergeRow1 > 1) {
          return {
            rowspan: row.mergeRow1,
            colspan: row.mergeCol1,
          }
        } else {
          return {
            rowspan: row.mergeRow1,
            colspan: row.mergeCol1
          }
        }
      }
    },
    seeAddress (item) {
      let params = { com: item.expressComCode, num: item.expressNumber }
      // let params = {com: 'yunda', num: '4301942573403'}
      api.query(params).then(res => {
        if (!res.errCode) {
          this.dialogVisible = true
          this.details = res.data.data
        } else {
          this.$notify({
            title: '提示',
            message: '暂未查到物流信息',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.address-box{
  padding: 10px;
  .mr {
    margin-right: 16px;
  }
  border-bottom: 1px solid #ddd;
  .expressNumber{
    display: inline-block;
    width: 300px;
  }
  .lable-span{
    font-size: 14px;
    color: #999;
    line-height: 28px;
  }
  .tip-btn{
    width: 92px;
    height: 24px;
    line-height: 3px;
    font-size: 12px;
    color: #1c7bef;
    background: #fff;
    border: 1px solid #1c7bef;
    border-radius: 2px;
    margin-top: 3px;
    margin-left: 10px;
  }
  .address-body{
    width: 485px;
    padding: 10px 20px;
    background: #FFFCF9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  /deep/ .el-dialog .el-timeline-item__wrapper{
    line-height: 20px;
  }
  /deep/ .el-table tbody tr:hover>td {
    background-color: transparent!important
  }
}
</style>
