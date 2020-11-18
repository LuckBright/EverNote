<template>
  <div class="layout_inner">
    <div class="list-box">
      <div class="list-title">
        {{typeText.title}}
      </div>
      <div class="list-box-inner">
        <div class="sms-price">
          <div class="label-text">{{typeText.priceText}}：</div>
          {{ userInfo.price }}元
        </div>
        <div class="main-head">
          <el-form label-width="120px" :inline="true">
            <el-form-item>
              <el-date-picker
                v-model="queryDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getList"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div class="label-text">
                {{typeText.sendTotalText}}：
              </div> {{smsTotalCount}}  {{typeText.unit}}
            </el-form-item>
          </el-form>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按日期" name="first">
            <div>
              <el-table :data="dateTableData" v-loading="dateloading">
                <el-table-column prop="billDate" label="日期">
                  <template slot-scope="scope">
                    {{ scope.row.billDate }}
                  </template>
                </el-table-column>
                <el-table-column prop="serviceCount" :label="typeText.tableHeadText"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按机构" name="second">
            <div>
              <el-table :data="tableData" v-loading="loading">
                <el-table-column prop="billDate" label="日期">
                  <template slot-scope="scope">
                    {{ scope.row.orgName }}
                  </template>
                </el-table-column>
                <el-table-column prop="serviceCount"  :label="typeText.tableHeadText"></el-table-column>
              </el-table>
              <ever-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :totalCount="totalCount"
                :current="current"
              ></ever-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog title="充值" :visible.sync="addDialogStatus" class="ui_dialog_02" width="600px"  @close="hideDialog">
      <div class="add-form">
        <div class="title-text-box">
          <div class="label-text">客户名称：</div>
          {{ userInfo.tenantName }}
        </div>
        <ever-form2 @submit.native.prevent class="recharge-form" v-model="obj" ref="rechargeForm" :schema="schema" :rules="addRule" v-show="payStatus === 1 || payStatus === 2">
          <template slot="default">
            <span></span>
          </template>
        </ever-form2>
        <div class="pay-code-box" v-if="payStatus === 3">
          <div class="pay-tip-box">
            <div>微信或支付宝扫一扫付款（元）</div>
            <div class="pay-money">{{ parseFloat(obj.money).toFixed(2) }}</div>
          </div>
<!--          <img :src="payCodeUrl"-->
<!--               alt="支付二维码">-->
          <qrcode :value="payCodeUrl" :options="payOptions"></qrcode>
        </div>
        <div class="pay-success" v-if="payStatus === 4">
          支付成功！
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="payStatus === 1 || payStatus === 2">
        <el-button @click="hideDialog">
          取消
        </el-button>
        <el-button @click="submitAdd" type="primary" :loading="payStatus === 2">
          支付
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let schema = [
  {
    name: 'money',
    props: {
      clearable: true,
      placeholder: '请输入充值金额'
    }
  },
]
// import { profileApi } from '@/warehouse/page/group/store/keyaccountmanage'
import { mapState } from 'vuex'
import { request } from '@/util/req'
import list from '@/util/list'
import globalUrlMap from '@/login/store/globalurls'

export default {
  mixins: [list],
  props: {
    type: {
      type: [Number, String],
      default: 0
    },
    typeText: {
      type: Object,
      default: () => {
        return {
          title: '短信账单',
          priceText: '每条短信单价',
          tableHeadText: '短信发送数量',
          sendTotalText: '发送条数',
          unit: '条',
          type: 0
        }
      }
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      timer: null,
      nowOrderId: null,
      tenantId: null,
      payCodeUrl: '',
      payOptions: {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: {
          quality: 0.3
        },
        width: 200
      },
      payStatus: 1, // 1 未生成订单 2 生成中 3 已生成未支付 4 已生成已支付
      wsClient: null,
      smsTotalCount: 0,
      schema,
      obj,
      rechargeForm: {
        money: ''
      },
      addRule: {
        money: [
          { required: true, message: '请输入充值金额', trigger: ['change'] },
          { pattern: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/, message: '请输入正确的金额格式', trigger: ['change', 'blur'] }
        ]
      },
      newpayobj: {
        id: '',
        settlecode: ''
      },
      layershow: false,
      addDialogStatus: false,
      dateTableData: [],
      dateloading: false,
      activeName: 'first',
      userInfo: {},
      minDate: null,
      api: {list: this.getJigouList},
      notUseQuery: true,
      tableData: [],
      queryDate: [
        new Date().getTime() - 1000 * 3600 * 24 * 7,
        new Date().getTime()
      ],
      queryObj: {
        startDate: this.$moment(new Date().getTime() - 1000 * 3600 * 24 * 7).format('YYYY-MM-DD'),
        endDate: this.$moment(new Date().getTime()).format('YYYY-MM-DD'),
        tenantId: window.localStorage.getItem('TENANTID'),
        requestSwitch: true,
        serviceType: this.type,
        type: this.type
      },
      pickerOptions: {
        disabledDate: (time) => {
          let timeOptionRange = this.minDate
          let days = 3600 * 1000 * 24 * 30
          if (timeOptionRange) {
            // /*选择的日期 与 当前日期 小于31天*/
            let current = new Date(new Date().toLocaleDateString()) - timeOptionRange.getTime()
            return (time.getTime() > timeOptionRange.getTime() + (current < days ? current : days) ||
              time.getTime() < timeOptionRange.getTime() - days)
          } else {
            return time.getTime() > Date.now()
          }
        },
        onPick: (time) => {
          this.minDate = time.minDate
        }
      },
    }
  },
  created () {
    this.tenantId = window.localStorage.getItem('TENANTID')
    this.getList()
    this.getUserInfo()
  },
  destroyed () {
    this.closeTimer()
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    closeTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    /**
     * 跳转充值记录页面
     */
    goRecordListPage () {
      this.$router.push({
        path: '/manages/message/recordlist',
        query: {
          tenantId: this.currentUser.tenantId,
          tenantName: this.userInfo.tenantName
        }
      })
    },
    /**
     * 充值（弹窗形式）
     */
    toNew () {
      this.payCodeUrl = ''
      this.payStatus = 1
      this.addDialogStatus = true
    },
    /**
     * 关闭弹窗
     */
    hideDialog () {
      this.payCodeUrl = ''
      this.payStatus = 1
      this.$refs.rechargeForm.resetForm()
      this.addDialogStatus = false
      this.closeTimer()
    },
    /**
     * 添加提交
     */
    submitAdd () {
      this.$refs.rechargeForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.payStatus = 2
        this.obj.tenantId = this.tenantId
        request({ url: '/msg/account/recharge', isStatic: false }, this.obj, 'post').then(res => {
          this.payCodeUrl = res.data.qr
          this.nowOrderId = res.data.orderId
          this.payStatus = 3
          setTimeout(() => {
            this.listenPayRes()
          }, 3000)
        })
      })
    },
    listenPayRes () {
      request({ url: '/msg/account/accountBill/getPayStatus', isStatic: false }, { orderId: this.nowOrderId }, 'post').then(res => {
        if (res.data.toString() === 'false') {
          this.timer = setTimeout(() => {
            this.listenPayRes()
          }, 3000)
        } else {
          this.paySuccess()
        }
      })
    },
    paySuccess () {
      this.payStatus = 4
      this.getUserInfo()
      this.$messageTips(this, 'success', '支付成功！', '提示')
    },
    /**
     * 获取日期维度列表
     */
    getDateList () {
      this.dateloading = true
      request(globalUrlMap.account.getDetailGroupBillDate, this.queryObj, 'post').then(res => {
        this.dateTableData = res.data
        this.dateloading = false
        this.getTotalCount(res.data)
      })
    },
    /**
     * 日期变更
     */
    handleClick (tab, event) {
      this.getList()
    },
    /**
     * 获取机构维度短信数
     */
    getJigouList (params) {
      params.serviceType = this.type
      return request(globalUrlMap.account.getDetailGroupOrg, params, 'post').then(res => {
        this.getTotalCount(res.data)
        return res
      })
    },
    /**
     * 获取租户信息
     */
    getUserInfo () {
      this.dateloading = true
      request(globalUrlMap.account.getPriceByTenantIdAndType, this.queryObj, 'post').then(res => {
        this.userInfo = res.data
        this.dateloading = false
      })
    },
    /**
     * 计算短信总数
     */
    getTotalCount (data) {
      let temptotal = 0
      data.map((item, index) => {
        temptotal += item.serviceCount
      })
      this.smsTotalCount = temptotal
    },
    /**
     * 获取列表（判断）
     */
    getList () {
      this.queryObj.startDate = this.$moment(this.queryDate[0]).format('YYYY-MM-DD')
      this.queryObj.endDate = this.$moment(this.queryDate[1]).format('YYYY-MM-DD')
      if (this.activeName === 'first') {
        this.getDateList()
      } else {
        this.list()
      }
      this.minDate = null
    }
  }
}
</script>

<style lang="less" scoped>
  .add-form{
    margin-bottom: 20px;
  }
  .label-text{
    font-size: 14px;
    color: #999;
    display: inline-block;
  }
  .list-title{
    height: 42px;
    background: #fff;
    line-height: 42px;
    padding-left: 30px;
    font-size: 14px;
    position: relative;
    border-bottom: solid 1px #DADCE0;
    &:after{
      content: '';
      display: block;
      height: 14px;
      width: 3px;
      background: #1C7BEF;
      position: absolute;
      left: 19px;
      top: 14px;
    }
  }
  .about-info-box{
    height: 110px;
    margin: 0 0 0px;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    font-size: 14px;
    box-sizing: border-box;
    position: relative;
    &::after{
      content: '';
      display: block;
      height: 10px;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      background:#ebedef;
    }
    .customer-name{
      margin: 0 0 15px;
    }
    .money-info{
      .money-about{
        div{
          display: inline-block;
        }
        .money-text{
          font-size: 24px;
          color: #ee4433;
        }
        .money-btn{
          margin-left: 20px;
          vertical-align: top;
        }
        margin-bottom: 5px;
      }
      .money-tip{
        color: #EE4433;
        i{
          margin-right: 5px;
          position: relative;
          top: 1px;
        }
      }
    }

  }
  .list-box{
    .list-box-inner{
      width: 600px;
      padding: 20px;
    }
  }
  .layout_inner{
    background: #F8F8F8;
    padding: 0;
    display: block;
    overflow: auto;
  }
  .sms-price{
    margin-bottom: 20px;
    font-size: 14px;
  }
  .title-text-box{
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    background: #F0F5FA;
    box-sizing: border-box;
    padding: 0 5px;
    margin-bottom: 15px;
  }
  .layout_inner .recharge-form /deep/ .el-form-item__content{
    margin-left: 0 !important;
  }
  .layout_inner /deep/ .ui_dialog_02 .el-dialog .el-dialog__body{
    max-height: 500px;
  }
  .pay-code-box{
    text-align: center;
    margin-bottom: 30px;
    .pay-tip-box{
      margin-bottom: 15px;
      .pay-money{
        font-size: 34px;
        font-weight: bold;
        color: orangered;
        margin-top: 5px;
      }
    }
    img{
      width: 250px;
      height: 250px;
    }
  }
  .pay-success{
    padding: 30px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    color: orangered;
  }
</style>
