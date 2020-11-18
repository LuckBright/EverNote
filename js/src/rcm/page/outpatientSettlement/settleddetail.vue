<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-17 14:37:38
 -->
<template>
  <div class='bill' v-loading="loading">
    <div class="back-btn">
      <el-button @click="seeList">返回</el-button>
    </div>
    <div class="tableBox" style="height: calc(100% - 70px);">
      <div v-for="(item, index) in tableDatas" :key="index" class="tablescroll">
        <div style="display:flex;">
          <div class="table-container">
            <div class="left">
              账单号
            </div>
            <div style="padding:5px 10px;">
              <a href="javascript:void(0)" @click="detailBtn(item)" class="detail-btn">{{item.settlementCode}}</a>
            </div>
          </div>
          <div class="right">
            <out-settle-table :key = "index" :isAllDetail = "true" :tableData = "item.mergedReceiptData" :multipleSelection.sync = "obj.multipleSelection" :columns="columns" :obj="obj" ref="outSettleTable" @deleteByAccountBillId="deleteByAccountBillId"></out-settle-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getstatus,
  getSettlementsDetails
} from '@/rcm/store/outpatient/outpatient'
import outSettleTable from './outSettleTable'
import { tableconfig, singleConfig, multiConfig } from './settleconfig.js'
import { floatTool } from '@/util/common'
export default {
  components: {
    outSettleTable
  },
  data () {
    return {
      showHeaderData: [{ itemname: '无' }],
      tableData: [],
      tableDatas: [{}],
      deleteByAccountBillId: '',
      loading: false,
      obj: {
        payObj: {
          paymethod: '2',
          remark: '',
          flowfee: ''
        },
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: '1',
        // 结算单id
        id: '',
        settleStatus: 0,
        // 已勾选哪些
        multipleSelection: [],
        loading: false,
        // 取价数组
        getPriceJSON: [],
        // 参数配置
        parameters: {},
        // 处方
        mergedReceiptData: [],
        // 商保报销金额
        comInsuranceDirectFee: 0,
        settlementComInsurDetID: '',
        insuranceTotalfee: 0,
        insurancegetTotalfee: 0,
        // 总金额
        totalFee: 0,
        totalBenefit: 0,
        unFee: 0,
        recRate: 0,
        // 大客户报销金额
        majorAccountFee: 0,
        productId: '', // 报销方案id
        reimburseRate: '', // 报销比例
        majorTotalfee: 0,
        settleCode: '',
        // 营销方面的优惠
        benefitInfo: {
          patientId: this.$route.query.patientId,
          visitNumber: this.$route.query.visitNumber,
          deptId: this.$route.query.dptId,
          promotionId: '', // 活动id
          promotionFee: 0, // 活动优惠金额
          benefitCardId: '', // 身份卡id
          benefitFee: '', // 身份卡优惠金额
          giftcardIds: [], // 优惠券id
          memberactcutfee: 0, // 优惠券优惠金额
          memberCardId: '', // 储值卡id
          membergradecutfee: 0, // 储值卡优惠金额
          selfDiscountFee: 0 // 自费金额
        },
        mergedSettleDetail: [],
        // 结算信息
        details: {
          settlementDetail: [],
          mediCatalog: [],
          medFeeitem: [],
          medPayInfo: [],
          settlementThirdOrgCard: [],
          settlementComInsurDet: [], // 商保
          settlementMemberDet: [], // 储值卡
          medPersonInfo: [],
          settlementBenefitDet: [], // 身份卡
          settlementCouponDet: [], // 优惠券
          settlementPromotion: [],  // 活动优惠
          settlementMajorAccount: [] // 大客户信息
        },
        // 保险信息
        patientIdentity: []
      }
    }
  },
  methods: {
    detailBtn (item) {
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: {
          patientId: item.patientid,
          dptId: item.orderDept,
          visitNumber: item.rootorderid,
          settlementid: item.settlementId,
          isnoprint: true
        }
      })
    },
    seeList () {
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: this.$route.query
      })
    },
    initTableData () {

    },
    async print () {
      try {
        let params = {
          rootorderid: this.$route.query.visitNumber
        }
        this.loading = true
        let json = await getSettlementsDetails(params)
        this.obj.loading = false
        json.data.map(lab => {
          if (lab.settleStatus) {
            this.obj.settleStatus = lab.settleStatus
          }
          this.$bus.$emit('bill:obj', this.obj || {})
          // 将自费折扣字段换算成100进制的
          if (multiConfig.includes(this.obj.settleStatus)) {
            lab.mergedReceiptData.map(item => {
              item.recipeDetails.map(v => {
                v.discount = floatTool.multiply(v.discount, 100)
              })
            })
          }
        })
        this.tableDatas = json.data
        this.$nextTick(_ => {
          this.loading = false
        })
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    }
  },
  computed: {
    columns: function () {
      // 已结算的话根据结算顺序显示table
      // 未结算根据场景现实
      let tableconfigFilter = []
      // 单步状态，需要显示单列的过滤，状态医保1、商保2、大客户7
      if (singleConfig.indexOf(this.obj.settleStatus) > -1) {
        tableconfigFilter = tableconfig.filter(item => {
          if (item.index && item.index.indexOf(this.obj.settleStatus) > -1) {
            return item
          }
        })
      } else if (multiConfig.indexOf(this.obj.settleStatus) > -1) {
        // 单步状态，需要显示多列的过滤，状态自费结算0、代付款3、已付款4、待退费5、已退费6,这些状态下前面结算过的状态列都要显示
        let settledStatus = {}
        this.obj.patientIdentity.filter(item => item.status === 1).map(item => {
          settledStatus[item.sort] = true
        })
        tableconfigFilter = tableconfig.filter(item => {
          for (let i = 0; i < item.index.length; i++) {
            if (
              item.index.includes(this.obj.settleStatus) ||
              settledStatus[item.index[i]]
            ) {
              if (
                (item.hasOwnProperty('slotName') &&
                  item.slotName === 'useInsuranceDiscount') ||
                (item.hasOwnProperty('slotName') &&
                  item.slotName === 'majorAccountDiscount')
              ) {
              } else {
                return item
              }
            }
          }
        })
      }
      return tableconfigFilter
    }
  },
  filters: {
    orderfilter (type) {
      return getstatus(type)
    },
    quantityfilter (type) {
      switch (Number(type)) {
        case 1:
          return '部分退款'
        case 2:
          return '全部退款'
        default:
          return ''
      }
    }
  },
  created () {
    this.print()
  }
}
</script>
<style lang="less" scoped>
  .bill {
    padding: 15px;
    height: 100%;
  }
  .tablescroll {
    overflow-x: scroll;
    margin-bottom: 10px;
    border-right: 1px solid #ccc;
    border-left: 1px solid #ccc;
    .el-table {
      margin: 0 !important;
    }
  }
  .table-container {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    .left {
      width:300px;
      height:29px;
      line-height:29px;
      font-weight: bold;
      font-size:14px;
      padding-left: 10px;
      background-color: #eee;
      color:#000;
      border-bottom: 1px solid #ccc;
    }
  }
  .tableBox {
    overflow-y: scroll;
  }
  .detail-btn {
    font-size: 14px;
  }
  .back-btn {
    text-align:right;
    margin-bottom: 10px;
  }
  .right /deep/ .settleTable .el-table td {
    border-bottom: 1px solid #ccc;
}
  .right /deep/ .settleTable
  .el-table
  tr.el-table__row.noOrder:hover
  td {
  background-color: #deeeff;
}
</style>

