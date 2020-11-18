<template>
  <div>
    <el-row>
      <el-col :span="4">申请退款时间</el-col>
      <el-col :span="20">
        <span class="personname">{{patientinfo.createTime||'--'}}</span>
        <span class="persontitle">申请人</span>
        <span class="personname mgl20">{{patientinfo.patientName||'--'}}</span>
      </el-col>
    </el-row>
    <el-row class="mgt10">
      <el-col :span="4">申请退款原因</el-col>
      <el-col :span="20">
        <el-input
          disabled
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="patientinfo.applyReason"
        ></el-input>
      </el-col>
    </el-row>
    <!-- checkStatus===3 拒绝 checkStatus===4 同意  -->
    <el-row class="mgt10" v-if="patientinfo.checkStatus===3||patientinfo.checkStatus===4">
      <el-col :span="4">申请处理时间</el-col>
      <el-col :span="20">
        <div>
          <span class="personname">{{patientinfo.createTime ||'--'}}</span>
          <span class="persontitle">处理人</span>
          <span class="personname mgl20">{{patientinfo.checkUserName ||'--'}}</span>
          <span class="persontitle">处理结果</span>
          <span
            class="personname mgl20"
          >{{patientinfo.checkStatus ===3?'审核驳回':patientinfo.checkStatus === 4 ?'审核通过':''}}</span>
        </div>
        <el-input
          v-model="patientinfo.checkReason"
          type="textarea"
          class="mgt10"
          :minlength="2"
          :maxlength="120"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-if="patientinfo.checkStatus ===3"
        ></el-input>
      </el-col>
    </el-row>
    <el-table
      class="mgt10"
      ref="alltable"
      :data="tableData"
      max-height="250px"
      style="width: 100%"
      @select="OnSelectRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column label="项目" prop="itemName"></el-table-column>
      <el-table-column label="可退数量/单位" width="220">
        <template slot-scope="scope">
          <!-- 中药可以输入小数  其他必须整数 302 303 304 是中药-->
          <el-input
            v-if="scope.row.itemType === 302||scope.row.itemType === 303||scope.row.itemType === 304"
            type="text"
            v-model="scope.row.refundQuantitySob"
            :disabled="patientinfo.checkStatus ===3||patientinfo.checkStatus ===4|| scope.row.refundType === 1||scope.row.itemClass === '91'||scope.row.itemClass === '90'||scope.row.itemClass === '92' ||scope.row.itemClass === '93'"
            style="width:100px"
            min="0"
            :max="scope.row.maxrefundQuantitySob"
            @input="oninput(scope.row,scope.row.refundQuantitySob,'refundQuantitySob')"
          ></el-input>
          <el-input
            v-else
            type="number"
            v-model="scope.row.refundQuantitySob"
            :disabled="patientinfo.checkStatus ===3||patientinfo.checkStatus ===4|| scope.row.refundType === 1||scope.row.itemClass === '91' ||scope.row.itemClass === '90'  ||scope.row.itemClass === '92' ||scope.row.itemClass === '93'"
            style="width:100px"
            min="0"
            :max="scope.row.maxrefundQuantitySob"
            onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          ></el-input>
          {{'/'+scope.row.unit?scope.row.unit:'次'}}
        </template>
      </el-table-column>
      <el-table-column label="单价" width="120">
        <template slot-scope="scope">{{scope.row.prePrice | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣">
        <template slot-scope="scope">{{toPercent(scope.row.discount)}}</template>
      </el-table-column>
      <el-table-column prop="preFee" label="金额">
        <template
          slot-scope="scope"
        >{{scope.row.refundQuantitySob*scope.row.prePrice | formatToFinacial}}</template>
      </el-table-column>
    </el-table>
    <!--   checkStatus ===2 代表没处理过-->
    <el-row class="mgt30" v-if="patientinfo.checkStatus ===2">
      <el-col :span="4">拒绝退款原因</el-col>
      <el-col :span="20">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="patientinfo.checkReason"
          placeholder="拒绝退款，请必须填写此项。拒绝内容讲返回给患者"
        ></el-input>
      </el-col>
    </el-row>
    <div class="footer" v-if="patientinfo.checkStatus ===2">
      <el-button type="primary" @click="save('yes')" class="btn" :disabled="argeedisabled">同意退款</el-button>
      <el-button type="warning" @click="save('no')" class="btn" :disabled="rejectdisabled">拒绝退款</el-button>
    </div>
  </div>
</template>

<script>
// 改变数量 金额要跟着改变

import api from '@/titancare/api/settlement'
import storage from '@/util/storage'
import { debounce } from '@/titancare/utils/common'

export default {
  props: ['settlementIdobj', 'orgId'],
  data () {
    return {
      api,
      storage,
      tableData: [],
      patientinfo: {
        applyReason: '',
        checkReason: ''
      },
      multipleSelection: [],
      argeedisabled: false,
      rejectdisabled: false
    }
  },
  created () {
    this.getRefundRecipeItemAndUser(this.settlementIdobj)
  },
  methods: {
    // 普通退费的时候 如果勾选的药，只有取消医嘱需要联动 refundType=1并且adviceId不等于空，那么就要自动勾选上列表中所有refundType=1并且adviceId等于勾选的那个的
    OnSelectRow (selection, row) {
      if (row.refundType === 1 && row.adviceId) {
        this.$refs.alltable.toggleRowSelection(row)
        this.tableData.forEach(item => {
          if (item.refundType === 1 && item.adviceId && item.adviceId === row.adviceId) {
            this.$refs.alltable.toggleRowSelection(item)
          }
        })
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
    handleSelectionChange (v) {
      this.multipleSelection = v
    },
    selectable (row, index) {
      if (this.patientinfo.checkStatus === 3 || this.patientinfo.checkStatus === 4) {
        return false
      } else {
        return true
      }
    },
    getRefundRecipeItemAndUser (v) {
      let params = {
        recipeId: v.recipeId,
        settlementId: this.$route.query.id
      }
      this.api.getRefundRecipeItemAndUser(params).then(rs => {
        if (rs && rs.errCode === 0 && rs.data && rs.data.recipeItems) {
          this.tableData = rs.data.recipeItems
          this.tableData.forEach(item => {
            item.maxrefundQuantitySob = item.refundQuantitySob // 普通退费最大值
          })
          Object.assign(this.patientinfo, rs.data.refundUserApplyDto)
        } else {
          this.tableData = []
        }
      })
    },
    // 普通同意退款 拒绝
    save: debounce(function (v) {
      // 同意退款
      let lastsection = []
      if (v === 'yes') {
        lastsection = this.multipleSelection.map(item => {
          let obj = {}
          obj.accountbillDetailId = item.accountbillDetailId
          obj.refundQuantity = item.refundQuantitySob
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
        this.argeedisabled = true
      } else { // 拒绝
        if (!this.patientinfo.checkReason) {
          this.$notify({
            message: '请填写拒绝退款原因',
            type: 'warning'
          })
          return false
        }
        if (this.patientinfo.checkReason.length < 2) {
          this.$notify({
            message: '拒绝原因不能低于2个文字',
            type: 'warning'
          })
          return false
        }
        this.rejectdisabled = true
      }
      let params = {}
      params.data = {
        refundCheckType: v === 'yes' ? 4 : 3, // 用户退费审批类型：3：拒绝退款 4：同意退款，默认4
        refundDetail: v === 'yes' ? lastsection : [],
        refundReason: v === 'yes' ? this.patientinfo.applyReason : this.patientinfo.checkReason,
        refundType: 0, // 非强制退费
        refundUserApplyId: this.settlementIdobj.refundUserApplyId, // 用户申请退费Id
        settlementId: this.$route.query.id, // 结算单id
        userId: this.storage.getLocalStorage('USERID'), // thc操作人Id
        userName: this.storage.getLocalStorage('DISPLAYNAME') // thc操作人姓名
      }
      params.config = {
        headers: {
          'x-org-id': this.orgId
        }
      }

      this.api.refundRecipe(params).then(rs => {
        if (rs && rs.errCode === 0) {
          if (v === 'yes') {
            this.$notify({
              message: '退款成功',
              type: 'success'
            })
            this.argeedisabled = false
          } else {
            this.$notify({
              message: '拒绝退款成功',
              type: 'success'
            })
            this.rejectdisabled = false
          }
          this.$emit('getsuccess')
        } else {
          this.argeedisabled = false
          this.rejectdisabled = false
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
.footer {
  text-align: center;
  padding: 30px;
}
.persontitle {
  font-size: 14px;
  color: #333333;
  margin-left: 20px;
}
.personname {
  font-size: 14px;
  color: #999999;
}
.mgt10 {
  margin-top: 15px;
}

.mgt30 {
  margin-top: 30px;
}
.mgl20 {
  margin-left: 20px;
}
</style>
