<!--
  demo:
    import medicalInsurance from '@/workspace/page/reservation/paymentinfo'
    <medical-insurance :settlement-id="settlementId" :appoint-id="appointId" :key="settlementId" :visible.sync="insuranceVisible" :refund="true"></medical-insurance>
  参数：
    :settlement-id="settlementId"   结算单id（想辙拿到）
    :appoint-id="appointId"    挂号id（服务看板用到）
    :key="settlementId"   组件id，跟结算单id一样
    :visible.sync="insuranceVisible"    是否显示弹窗的flag
    :refund="true"      正单负单的标记 true 正单  false 负单
    @confirmFun=""    点击提交的执行的方法（父组件内执行的方法）
-->

<template>
    <el-dialog title="缴费确认" :visible.sync="insuranceVisible" width="50%" :close-on-click-modal="true" :modal-append-to-body="false" v-loading='loading'>
        <div class='insuranceInfo' v-if='refund'>
            <h4 class='capital'>医保信息</h4>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【医保卡号】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].cardno}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【医保应用号】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].icno}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【身份证号】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].idno}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【姓名】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].personname}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【性别】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].sexName}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【出生日期】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].birthday}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【转诊医院编码】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].fromhosp}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【转诊时限】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].fromhospdate}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【险种类型】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].fundtypeName}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【预提人员标示】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].isytName}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【军残等级】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].jclevelName}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【在院标识】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].hospflagName}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【参保人员类型】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].persontypeName}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【是否在红名单】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].isinredlistName}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    【是否本人定点医院】
                </el-col>
                <el-col :span='16'>
                    {{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].isspecifiedhospName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    【是否本人慢病定点医院】
                </el-col>
                <el-col :span='16'>
                    {{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].ischronichospName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【个人账户余额】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].personcount}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <el-row>
                        <el-col :span='10'>【慢病编码】</el-col>
                        <el-col :span='14'>{{obj.details.medPersonInfo&&obj.details.medPersonInfo.length>0&&obj.details.medPersonInfo[0].chroniccode}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <div class='insurancefee'>
            <h4 class='capital notfirst'>{{refund?'退费确认':'缴费确认'}}</h4>
            <el-row class='insuranceStyle'>
                <el-row class='detail'>
                    <el-col :span='8'>费用总金额</el-col>
                    <el-col :span='16' class='right'>{{obj.details.medPayInfo&&obj.details.medPayInfo.length>0&&obj.details.medPayInfo[0].feeall | formatMoney}}</el-col>
                </el-row>
                <el-row class='detail'>
                    <el-col :span='8'>基金支付金额</el-col>
                    <el-col :span='16' class='right'>{{obj.details.medPayInfo&&obj.details.medPayInfo.length>0&&obj.details.medPayInfo[0].fund | formatMoney}}</el-col>
                </el-row>
                <el-row class='detail'>
                    <el-col :span='8'>现金支付金额</el-col>
                    <el-col :span='16' class=' cash'>{{obj.details.medPayInfo&&obj.details.medPayInfo.length>0&&obj.details.medPayInfo[0].cash | formatMoney}}</el-col>
                </el-row>
                <el-row class='detail'>
                    <el-col :span='8'>个人账户支付金额</el-col>
                    <el-col :span='16' class='right'>{{obj.details.medPayInfo&&obj.details.medPayInfo.length>0&&obj.details.medPayInfo[0].personcountpay | formatMoney}}</el-col>
                </el-row>
            </el-row>
        </div>
        <div>
            <h2 class='capital notfirst'>医保费用分解</h2>
            <medicalsettle :medicalsettleobj="obj" ref="medicalsettle" v-show='toggledetailStatus'></medicalsettle>
            <div class="toggle_settledetail" @click="toggledetail">
                <span class="setCursor">
                    医保费用分解详情
                    <i class="el-icon-arrow-down" :class="{active: toggledetailStatus}"></i>
                </span>
            </div>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sureBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import api from '@/rcm/store/settlementapi'
import medicalsettle from '@/rcm/otmdiscomponent/medicalsettle.vue'

export default {
  props: ['settlementId', 'visible', 'refund', 'appointId', 'confirmFun'],
  data () {
    return {
      toggledetailStatus: false,
      loading: false,
      obj: {
        medInsurPubPayFee: '',
        medInsurOwnPayFee: '',
        details: {
          medPayInfo: [],
          medFeeitem: []
        }
      }
    }
  },
  computed: {
    insuranceVisible: {
      set (val) {
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    }
  },
  watch: {
    insuranceVisible: {
      handler: function (val, oldval) {
        if (val) {
          this.getPrint(this.settlementId)
        }
      }
    }
  },
  components: {
    medicalsettle
  },
  created () {
    this.getPrint(this.settlementId)
  },
  methods: {
    toggledetail () {
      this.toggledetailStatus = !this.toggledetailStatus
    },
    handleClose (done) {

    },
    sureBtn () {
      // 确认按钮的方法需要优化。跟着场景走
      this.$emit('confirmFun', this.appointId)
      this.insuranceVisible = false
    },
    getPrint (settlementId) {
      if (!settlementId) {
        return
      }
      this.loading = true
      if (this.refund) {
        api.getById(this.settlementId)
          .then(result => {
            this.obj = Object.assign(this.obj, result)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            console.log(err)
          })
      } else {
        api
          .getById(this.settlementId)
          .then(result => {
            Object.assign(this.obj, result)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            console.log(err)
          })
      }
    }
  }
}
</script>
<style scoped>
.insuranceInfo {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
}
.insuranceInfo .el-row {
  margin-top: 5px;
}
.insurancefee {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
}
.insuranceStyle .detail {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
}
.right {
  color: rgb(0, 0, 255);
}
.cash {
  color: #fa5555;
}
.toggle_settledetail {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #1c7bef;
  text-align: center;
}
.toggle_settledetail .el-icon-arrow-down {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}
.toggle_settledetail .el-icon-arrow-down_up {
  transform: rotateZ(180deg);
}
.moremedicalinfo {
  padding-left: 20px;
  font-weight: bold;
  color: #1c7bef;
  cursor: pointer;
  text-decoration: underline;
}
.el-icon-arrow-down {
  transition: all 0.5s;
}
.el-icon-arrow-down.active {
  transform: rotateZ(180deg);
}
.capital {
  font-size: 16px;
  padding: 0;
  margin: 0;
  border-left: 3px solid #1c7bef;
  padding-left: 10px;
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 3px 0 3px;
  text-align: left;
}
.notfirst {
  margin: 10px 0;
}
</style>

