<template>
  <div>
    <el-row>
      <el-col :span="4">
        <span class="require">*</span>申请退款原因:
      </el-col>
      <el-col :span="20">
        <el-input
          type="textarea"
          :disabled="!qiangzhicount"
          :autosize="{ minRows: 2, maxRows: 4}"
          :minlength="2"
          :maxlength="120"
          placeholder="请输入退款原因"
          v-model="reason"
        ></el-input>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      ref="alltable"
      class="table"
      max-height="300px"
      @select="OnSelectRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column label="项目" prop="itemName"></el-table-column>
      <el-table-column label="可退数量/单位" width="220">
        <template slot-scope="scope">
          <!-- 中药可以输入小数  其他必须整数 302 303 304 是中药 其他类型输入整数-->
          <!-- 普通退费 -->
          <el-input
            v-if="!checked&&(scope.row.itemType === 302||scope.row.itemType === 303||scope.row.itemType === 304)"
            type="text"
            v-model="scope.row.refundQuantitySob"
            :disabled="scope.row.maxrefundQuantitySob === 0 || scope.row.refundType === 1||scope.row.itemClass === '91' ||scope.row.itemClass === '90'  ||scope.row.itemClass === '92' ||scope.row.itemClass === '93'"
            style="width:100px"
            min="0"
            :max="scope.row.maxrefundQuantitySob"
            @input="oninput(scope.row,scope.row.refundQuantitySob,'refundQuantitySob')"
          ></el-input>
          <el-input
            v-if="!checked&&(scope.row.itemType !== 302&&scope.row.itemType !== 303&&scope.row.itemType !== 304)"
            type="text"
            v-model="scope.row.refundQuantitySob"
            :disabled="scope.row.maxrefundQuantitySob === 0 || scope.row.refundType === 1||scope.row.itemClass === '91' ||scope.row.itemClass === '90'  ||scope.row.itemClass === '92' ||scope.row.itemClass === '93'"
            style="width:100px"
            min="0"
            :max="scope.row.maxrefundQuantitySob"
            onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          ></el-input>
          <!-- 强制退费 -->
          <el-input
            v-if="checked&&(scope.row.itemType === 302||scope.row.itemType === 303||scope.row.itemType === 304)"
            type="text"
            v-model="scope.row.remainQuantity"
            :disabled="scope.row.maxremainQuantity === 0 || scope.row.refundType === 1||scope.row.itemClass === '91' ||scope.row.itemClass === '90'  ||scope.row.itemClass === '92' ||scope.row.itemClass === '93'"
            style="width:100px"
            min="0"
            :max="scope.row.maxremainQuantity"
            @input="oninput(scope.row,scope.row.remainQuantity,'remainQuantity')"
          ></el-input>
          <el-input
            v-if="checked&&scope.row.itemType !== 302&&scope.row.itemType !== 303&&scope.row.itemType !== 304"
            type="text"
            v-model="scope.row.remainQuantity"
            :disabled="scope.row.maxremainQuantity === 0 || scope.row.refundType === 1||scope.row.itemClass === '91' ||scope.row.itemClass === '90'  ||scope.row.itemClass === '92'||scope.row.itemClass === '93'"
            style="width:100px"
            min="0"
            :max="scope.row.maxremainQuantity"
            onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          ></el-input>
          /{{scope.row.unit?scope.row.unit:'次'}}
        </template>
      </el-table-column>
      <el-table-column label="单价" width="120">
        <template slot-scope="scope">{{scope.row.prePrice | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣">
        <template slot-scope="scope">{{toPercent(scope.row.discount)}}</template>
      </el-table-column>
      <el-table-column prop="preFee" label="金额">
        <template slot-scope="scope">
          <span v-if="checked">{{scope.row.remainQuantity*scope.row.prePrice | formatToFinacial}}</span>
          <span v-else>{{scope.row.refundQuantitySob*scope.row.prePrice | formatToFinacial}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="mgt10">
      <el-col :span="3">强制退款</el-col>
      <el-col :span="21">
        <el-checkbox v-model="checked" class="mgl10" :disabled="!qiangzhicount"></el-checkbox>
        <span style="color:#999999">强制退款勾选后，直接通知结算进行退款操作。不会通知药房和医技。建议在正常退款失败后使用，否则导致多发药或重复执行。</span>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button
        type="primary"
        @click="save"
        class="btn"
        :disabled="argeedisabled||!qiangzhicount"
      >同意退款</el-button>
    </div>
    <el-dialog title="退款信息" :visible.sync="confirm" append-to-body>
      <div class="fee">实退金额: {{qiangtotalfee | formatToFinacial}}</div>
      <div class="confirmfooter">
        <el-button type="primary" @click="confirmfee">确认退款</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import api from '@/titancare/api/settlement'
import storage from '@/util/storage'
import { debounce } from '@/titancare/utils/common'
export default {
  props: ['settlementIdobj', 'orgId'],
  data () {
    return {
      api,
      storage,
      checked: false,
      reason: '',
      tableData: [],
      multipleSelection: [],
      qiangtotalfee: '', // 强制退费总金额
      qiangsettlementId: '', // 强制退费结算单id
      confirm: false, //  强制退款 确认弹窗
      argeedisabled: false,
      qiangzhicount: true // 判断处理table里是否还有可退
    }
  },
  watch: {
    'settlementIdobj': {
      handler (v) {
        this.getRefundRecipeItem(v)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    OnSelectRow (selection, row) {
      if (!this.checked) {
        if (row.refundType === 1 && row.adviceId) {
          this.$refs.alltable.toggleRowSelection(row)
          this.tableData.forEach(item => {
            if (item.refundType === 1 && item.adviceId && item.adviceId === row.adviceId) {
              this.$refs.alltable.toggleRowSelection(item)
            }
          })
        }
      }
    },
    // 限制输入小数点后2位
    oninput (p, v, type) {
      p[type] = (v.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    // 显示百分比 如果是1 就为空  如果
    toPercent (point) {
      if (point === 1 || point === 0) {
        return ''
      }
      var str = Number(point * 100).toFixed()
      str += '%'
      return str
    },
    selectable (row, index) {
      if (this.checked) {
        if (row.maxremainQuantity === 0) {
          return false
        } else {
          return true
        }
      } else {
        if (row.maxrefundQuantitySob === 0) {
          return false
        } else {
          return true
        }
      }
    },
    //  强制退费确认退费
    confirmfee: debounce(function () {
      let params = {}
      params.data = {
        id: this.qiangsettlementId
      }
      params.config = {
        headers: {
          'x-org-id': this.orgId
        }
      }
      this.api.confirmRefund(params).then(rs => {
        if (rs && rs.errCode === 0) {
          this.$notify({
            message: '强制退费成功',
            type: 'success'
          })
          this.confirm = false
          this.$emit('getsuccess')
        }
      })
    }),
    // 普通同意退款
    save: debounce(function () {
      if (!this.reason) {
        this.$notify({
          message: '请填写退款原因',
          type: 'warning'
        })
        return false
      }
      if (this.reason.length < 2) {
        this.$notify({
          message: '退款原因不能少于2个文字',
          type: 'warning'
        })
        return false
      }
      let lastsection = this.multipleSelection.map(item => {
        let obj = {}
        obj.accountbillDetailId = item.accountbillDetailId
        if (this.checked) {
          obj.refundQuantity = item.remainQuantity
        } else {
          obj.refundQuantity = item.refundQuantitySob
        }
        return obj
      })

      let HasEmpty = lastsection.find(item => item.refundQuantity === '0')
      if (HasEmpty) {
        this.$notify({
          message: '退费明细数量不能为0',
          type: 'warning'
        })
        return false
      }
      let params = {}
      params.data = {
        refundCheckType: 4, // 用户退费审批类型：3：拒绝退款 4：同意退款，默认4
        refundDetail: lastsection,
        refundReason: this.reason,
        refundType: this.checked ? 3 : 0, // 非强制退费
        settlementId: this.$route.query.id, // 结算单id
        userId: this.storage.getLocalStorage('USERID'), // thc操作人Id
        userName: this.storage.getLocalStorage('DISPLAYNAME') // thc操作人姓名
      }
      params.config = {
        headers: {
          'x-org-id': this.orgId
        }
      }
      this.argeedisabled = true
      this.api.refundRecipe(params).then(rs => {
        if (rs && rs.errCode === 0) {
          if (this.checked) {
            this.confirm = true
            this.qiangtotalfee = rs.data.refundDetailResp.unexefee
            this.qiangsettlementId = rs.data.refundDetailResp.settlementId
            this.argeedisabled = false
          } else {
            this.$notify({
              message: '退款成功',
              type: 'success'
            })
            this.$emit('getsuccess')
            this.argeedisabled = false
          }
        } else {
          this.argeedisabled = false
        }
      })
    }),
    // 获得table明细
    getRefundRecipeItem (v) {
      let params = {
        recipeIds: [v.recipeId],
        settlementId: this.$route.query.id
      }
      this.api.getRefundRecipeItem(params).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.tableData = rs.data
          this.tableData.forEach(item => {
            item.maxrefundQuantitySob = item.refundQuantitySob // 普通退费最大值
            item.maxremainQuantity = item.remainQuantity // 强制退费最大值
          })
          this.qiangzhicount = this.tableData.find(item => {
            return item.maxremainQuantity !== 0
          })
        } else {
          this.tableData = []
        }
      })
    },
    handleSelectionChange (v) {
      this.multipleSelection = v
    }
  }
}
</script>

<style lang="less" scoped>
.fee {
  color: #333333;
  font-size: 14px;
  padding: 10px 68px;
}
.confirmfooter {
  padding-top: 10px;
  text-align: right;
}
.require {
  color: red;
}
.table {
  margin-top: 20px;
}
.mgl10 {
  margin-right: 10px;
}
.mgt10 {
  margin-top: 30px;
}
.footer {
  text-align: center;
  .btn {
    margin-top: 20px;
  }
}
</style>>
