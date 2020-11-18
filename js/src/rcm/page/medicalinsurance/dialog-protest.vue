<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-14 11:23:32
 -->
<template>
  <div>
    <div>
      <span class="basicInfo">患者姓名：{{obj.patientName}}</span>
      <span class="basicInfo">
        账单金额：
        <span class="cRed">{{obj.totalFee}}</span>
      </span>
      <span class="basicInfo">
        应收金额：
        <span class="cRed">{{obj.shouldPaid}}</span>
      </span>
      <span class="basicInfo">结算时间：{{obj.chargeDate}}</span>
      <div>
        <el-table
          :data="obj.tableData"
          style="width:100%;"
        >
          <el-table-column
            prop="serviceProvider"
            label="支付方"
          ></el-table-column>
          <el-table-column
            prop="pay"
            label="应收金额"
          ></el-table-column>
          <el-table-column
            prop="paid"
            label="已收金额"
          ></el-table-column>
          <el-table-column
            prop="remain"
            label="待付金额"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <el-row
        v-for="(item,key) in AdjustFromList"
        :key="key"
      >
        <el-col :span="3">
          <label class="AdjustLabel">调整源：</label>
        </el-col>
        <el-col :span="5">
          <ever-select
            :clearable="true"
            :filterable="true"
            :placeholder="'请选择调整类型'"
            :options="ChangeTypeOptions"
            v-model="item.changeType"
          ></ever-select>
        </el-col>
        <el-col
          :span="7"
          v-if="item.changeType===3"
        >
          <el-col :span="8">
            <label class="AdjustLabel">坏账审批号：</label>
          </el-col>
          <el-col :span="16">
            <el-input
              v-model="item.badCheckNo"
              :placeholder="'请填写坏账审批号'"
            ></el-input>
          </el-col>
        </el-col>
        <el-col
          :span="7"
          v-if="item.changeType===4"
        >
          <ever-select
            :clearable="true"
            :filterable="true"
            :placeholder="'请选择差异调整类型'"
            :options="DifChangeTypeOptions"
            v-model="item.difChangeType"
          ></ever-select>
        </el-col>
        <el-col :span="2">
          <label class="AdjustLabel">金额：</label>
        </el-col>
        <el-col :span="6">
          <el-input
            type="number"
            v-model="item.changeFee"
            @keyup.native="limitDecimal(item.changeFee, true, key)"
          ></el-input>
        </el-col>
        <el-col :span="1">
          <i
            class="iconAdd icon iconfont icon-tianjia"
            @click="AddFrom()"
          ></i>
          <i
            class="iconDelete icon iconfont icon-zhuyuan-yizhu-bohui"
            @click="DeleteFrom(key)"
          ></i>
        </el-col>
      </el-row>
      <hr>
      <el-row
        v-for="(item,key) in AdjustToList"
        :key="key"
      >
        <el-col :span="3">
          <label class="AdjustLabel">调整至：</label>
        </el-col>
        <el-col :span="5">
          <ever-select
            :clearable="true"
            :filterable="true"
            :placeholder="'请选择调整类型'"
            :options="ChangeTypeOptions"
            v-model="item.changeType"
          ></ever-select>
        </el-col>
        <el-col
          :span="7"
          v-if="item.changeType===3"
        >
          <el-col :span="8">
            <label class="AdjustLabel">坏账审批号：</label>
          </el-col>
          <el-col :span="16">
            <el-input
              v-model="item.badCheckNo"
              :placeholder="'请填写坏账审批号'"
            ></el-input>
          </el-col>
        </el-col>
        <el-col
          :span="7"
          v-if="item.changeType===4"
        >
          <ever-select
            :clearable="true"
            :filterable="true"
            :placeholder="'请选择差异调整类型'"
            :options="DifChangeTypeOptions"
            v-model="item.AdjustDifTo"
          ></ever-select>
        </el-col>
        <el-col :span="2">
          <label class="AdjustLabel">金额：</label>
        </el-col>
        <el-col :span="6">
          <el-input
            type="number"
            v-model="item.changeFee"
            @keyup.native="limitDecimal(item.changeFee, false, key)"
          ></el-input>
        </el-col>
        <el-col :span="1">
          <i
            class="iconAdd icon iconfont icon-tianjia"
            @click="AddTo()"
          ></i>
          <i
            class="iconDelete icon iconfont icon-zhuyuan-yizhu-bohui"
            @click="DeleteTo(key)"
          ></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <label class="AdjustLabel">调整金额合计：</label>
        </el-col>
        <el-col
          :span="6"
          class="badDebt cRed"
        >{{badDebt}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <label class="AdjustLabel">备注：</label>
        </el-col>
        <el-col :span="13">
          <el-input
            type="textarea"
            v-model="remark"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="buttons">
      <el-button
        type="primary"
        plain
        @click="cancelClick"
      >取消</el-button>
      <el-button
        type="primary"
        @click="changeHandler"
        :disabled="saving"
      >保存</el-button>
    </div>
  </div>
</template>
<script>
import { getChangeType, getDifChangeType, changeHandler } from '../../store/medicalinsurance.js'
export default {
  props: ['obj'],
  data () {
    return {
      AdjustFromList: [{
        changeType: '',
        difChangeType: '',
        changeFee: 0,
        badCheckNo: '',
        isSourse: 1
      }],
      AdjustToList: [{
        changeType: '',
        difChangeType: '',
        changeFee: 0,
        badCheckNo: '',
        isSourse: 0
      }],
      ChangeTypeOptions: [],
      DifChangeTypeOptions: [],
      remark: '',
      saving: false,
      meta: this.$route.meta.type
    }
  },
  watch: {
    'obj': {
      handler: function (val) {
        this.AdjustFromList = [{
          changeType: '',
          difChangeType: '',
          changeFee: 0,
          badCheckNo: '',
          isSourse: 1
        }]
        this.AdjustToList = [{
          changeType: '',
          difChangeType: '',
          changeFee: 0,
          badCheckNo: '',
          isSourse: 0
        }]
      },
      deep: true
    }
  },
  created () {
    let params = {
      typeId: 0,
      businessType: this.meta
    }
    getChangeType(params).then(res => {
      this.ChangeTypeOptions = res.data
    })
    let difparams = {
      difTypeId: 0,
      businessType: this.meta
    }
    getDifChangeType(difparams).then(res => {
      this.DifChangeTypeOptions = res.data
    })
  },
  computed: {
    'badDebt': function () {
      return this.AdjustFromList.length > 0 ? this.AdjustFromList.reduce((total, cur) => {
        total += Number(cur.changeFee)
        return total
      }, 0).toFixed(2) : this.AdjustToList.reduce((total, cur) => {
        total += Number(cur.changeFee)
        return total
      }, 0).toFixed(2)
    }
  },
  methods: {
    AddFrom () {
      this.AdjustFromList.push({
        changeType: '',
        difChangeType: '',
        changeFee: 0,
        isSourse: 1
      })
    },
    DeleteFrom (index) {
      if (this.AdjustFromList.length > 1) {
        this.AdjustFromList.splice(index, 1)
      } else {
        this.$messageTips(this, 'warning', '请至少留有一个调整源')
      }
    },
    AddTo () {
      this.AdjustToList.push({
        changeType: '',
        difChangeType: '',
        changeFee: 0,
        isSourse: 0
      })
    },
    DeleteTo (index) {
      if (this.AdjustToList.length > 1) {
        this.AdjustToList.splice(index, 1)
      } else {
        this.$messageTips(this, 'warning', '请至少留有一个调整至')
      }
    },
    cancelClick () {
      this.$emit('close')
    },
    changeHandler () {
      this.saving = true
      let changeinfos = this.AdjustFromList.concat(this.AdjustToList)
      let params = {
        receivableDetailId: this.obj.id,
        remark: this.remark,
        changeinfos: changeinfos
      }
      changeHandler(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '金额调整成功')
          this.saving = false
          this.$emit('close')
        }
      }).catch(() => {
        this.saving = false
      })
    },
    // 限制金额只能两位小数
    limitDecimal (fee, param, index) {
      if (/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
      } else {
        if (param) {
          this.AdjustFromList[index].changeFee = fee.substring(0, fee.length - 1)
        } else {
          this.AdjustToList[index].changeFee = fee.substring(0, fee.length - 1)
        }
      }
    }
  }
}
</script>
<style scoped>
.basicInfo {
  margin-right: 30px;
  font-size: 16px;
  line-height: 33px;
}
.el-row {
  margin-top: 12px;
}
.el-col {
  text-align: right;
}
hr {
  margin-top: 20px;
}
.badDebt {
  text-align: left;
  line-height: 36px;
}
.AdjustLabel {
  line-height: 36px;
}
.iconAdd {
  line-height: 36px;
  color: blue;
}
.iconDelete {
  line-height: 36px;
  color: #bbb;
}
.iconDelete:hover {
  color: red;
}
.buttons {
  margin-top: 20px;
  text-align: right;
}
</style>
