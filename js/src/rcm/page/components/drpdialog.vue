<template>
  <div>
    <el-dialog title="产房结算" :visible.sync="dialogVisible" class="ui_dialog_02" :close-on-click-modal="false">
      <div style="text-align: center;font-size: 20px">
        <el-row class="f14">
          <el-col :span="4">
            <span class="cGray6">姓名：</span><span class="ml5 bold cBlack">{{headerObj.patientName || ''}}</span>
          </el-col>
          <el-col :span="3">
            <span class="cGray6">性别：</span><span class="ml5 cBlack">{{headerObj.sexName || ''}}</span>
          </el-col>
          <el-col :span="5">
            <span class="cGray6">生日：</span><span class="ml5 cBlack">{{headerObj.birthday || ''}}</span>
          </el-col>
        </el-row>
        <div class="tableScroll ptb10" v-loading.body="loading">
          <el-table label-position="left" inline :class="isShow ? 'tableHeader isShowtableHeader' : ''">
            <el-table-column
              width="55">
            </el-table-column>
            <el-table-column
              prop="settlementStatusName"
              label="结算"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="useStatusName"
              label="使用"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="catalogname"
              label="项目类型"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="itemname"
              label="项目名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="totalPrice"
              label="原价"
              align="right"
              width="80"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="totalPriceDis"
              label="售价"
              align="right"
              width="80"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="itemNum"
              label="购买数量"
              align="right"
              width="80"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="itemNumPreUse"
              label="使用数量"
              align="right"
              width="80"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="orderdeptName"
              label="开方部门"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="orderdoctorName"
              label="开方医生"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="开方时间"
              width="160"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-table v-if="isShow" :data="tableData" border :default-expand-all="true" :show-header="false" @select="handleSelect" class="tableBody" ref="tableBody">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label=""
              prop=""
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.setmealName}}</span>
                <span class="ml20" v-if="scope.row.setmealOrderSn">订单号：{{scope.row.setmealOrderSn}}</span>
              </template>
            </el-table-column>
            <el-table-column
              type="expand"
              width="10">
              <template slot-scope="props">
                <el-table :data="props.row.details" :show-header="false" label-position="left" inline style="width: 100%;">
                  <el-table-column
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="结算"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span :class="scope.row.useStatus == userStatusArr[0].id ? 'blue' : 'cGreen'">{{scope.row.settlementStatusName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="使用"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span :class="scope.row.useStatus == userStatusArr[0].id ? 'blue' : 'cGreen'">{{scope.row.useStatusName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="catalogname"
                    label="项目类型"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="itemname"
                    label="项目名称"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="原价"
                    align="right"
                    width="80"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.totalPrice | formatToFinacial}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="售价"
                    align="right"
                    width="80"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.totalPriceDis | formatToFinacial}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="itemNum"
                    label="购买数量"
                    align="right"
                    width="80"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="itemNumPreUse"
                    label="使用数量"
                    align="right"
                    width="80"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="orderdeptName"
                    label="开方部门"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="orderdoctorName"
                    label="开方医生"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="开方时间"
                    width="160"
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" labelWidth="130px" :nosubmit="true" @submit="submitForm()"></ever-form2>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="spe" @click="close(true)">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="settlementFlag" :disabled="multipleSelection.details && multipleSelection.details.length ? false : true">确认</el-button>
      </span>
    </el-dialog>
    <paymethodstwo :dialogVisible.sync="payVisible" :obj="payObj" @closedialog="cancelDialog" @payStatus="handlePayStatus"></paymethodstwo>
  </div>
</template>
<script>
import { patientDeliveryPlanSettlementInfo, deliveryRoomSettlement, deliveryRoomPackageChangeSettleStatus } from '@/rcm/store/hospital/hospital'
import FeeValue from '@/rcm/page/components/feevalue'
import packageApi from '@/crm/store/packageapi'
let schema = [
  {
    name: 'totalPriceDis',
    label: '选中项目销售合计:',
    comp: FeeValue,
    props: {
      customVal: '¥',
      customPosition: true
    },
    span: 8
  },
  {
    name: 'settlementMoney',
    label: '选中项目已用金额:',
    comp: FeeValue,
    props: {
      customVal: '¥',
      customPosition: true
    },
    span: 8
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 8
  },
  {
    name: 'amountDue',
    label: '应结金额:',
    comp: FeeValue,
    props: {
      customVal: '¥',
      customPosition: true
    },
    span: 8
  },
  {
    name: 'totalFeeRefund',
    label: '退费金额:',
    comp: FeeValue,
    props: {
      customVal: '¥',
      customPosition: true
    },
    span: 8
  },
  {
    name: 'refundReason',
    label: '结算备注:',
    comp: 'sys-text',
    props: {
      placeholder: '结算备注'
    },
    span: 8
  }
]
export default {
  props: ['headerObj', 'isRefresh'],
  data () {
    return {
      dialogVisible: false,
      schema,
      obj: {},
      tableData: [],
      isShow: false,
      multipleSelection: {},
      loading: false,
      userStatusArr: [{id: 1, name: '未用'}, {id: 2, name: '半价'}, {id: 3, name: '全价'}],
      settlementFlag: false,
      payObj: {
        patientid: '', // 患者id
        id: '', // 结算单id
        settleCode: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '3', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        paymethodArr: [], // 支付方式
        isValited: true, // 押金是false,费用为true
        payTradeLog: [], // 支付记录
        isDeposit: 0, // 是否押金
        isRefund: true, // 是否退费(退费传true)
        iscallback: true, // 是否需要关闭前回调(true需要弹窗关闭前回调)
        backCalculation: true // 是否走反算流程默认true走反算流程
      },
      payVisible: false, // 退费dialog
      cacheParams: {}, // 缓存已选择数据
      settlementPatientId: '' // 患者id
    }
  },
  created () {},
  methods: {
    open (id) {
      this.settlementPatientId = id || this.$route.query.patientId
      this.dialogVisible = true
      this.obj = this.$ever.createObjFromSchema(schema)
      this._getTableData()
    },
    close (flag) {
      this.settlementFlag = false
      this.tableData = []
      this.multipleSelection = {}
      this.obj = {}
      this.cacheParams = {}
      if (this.isRefresh && !flag) this.$emit('refresh-status')
      this.dialogVisible = false
    },
    handleSelect (val, row) {
      this.$refs.tableBody.clearSelection()
      this.multipleSelection = {}
      if (val.length) {
        if (val.length > 1) {
          this.multipleSelection = row
          this.$refs.tableBody.toggleRowSelection(val[1], true)
        } else {
          this.multipleSelection = row
          this.$refs.tableBody.toggleRowSelection(val[0], true)
        }
      }
    },
    submitForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid && !this.settlementFlag) {
          this.settlementFlag = true
          let settlementArr = JSON.parse(JSON.stringify(this.multipleSelection))
          let params = {
            id: settlementArr.setmealOrderId, // 订单id
            totalFeeRefund: this.obj.totalFeeRefund, // 结算金额
            refundReason: this.obj.refundReason, // 结算备注
            patientId: this.settlementPatientId, // 患者id
            details: []
          }
          let settlementDetails = {}
          settlementArr.details && settlementArr.details.length && settlementArr.details.forEach(item => {
            settlementDetails = {
              id: item.orderDetailId, // 订单明细id
              serviceName: item.itemname, // 项目名称
              itemNum: item.itemNum, // 项目数量
              itemNumFinished: item.itemNumPreUse, // 项目已完成数量
              refundNum: item.refundNum, // 项目退费数量
              serviceId: item.itemid,  // 项目id
              totalPrice: item.totalPrice, // 原价
              totalPriceDis: item.totalPriceDis,  // 售价
              orderId: item.setmealOrderId, // 套餐订单主表id
              price: item.price, // 单价
              priceDis: item.priceDis, // 打折后单价
              sn: item.setmealOrderSn, // 订单明细sn
              useOrderId: item.batchId, // 使用订单id
              useOrderDetailId: item.id, // 使用订单明细id
              itemClass: item.itemclass, // 项目财务分类id
              itemClassName: item.itemclassname, // 财务分类名称
              orderDept: item.orderdept, // 开单部门
              orderDoctor: item.orderdoctor, // 开单医生
              exeOrderDept: item.exeorderdept, // 执行科室
              exeDoctor: item.exedoctor, // 执行医生
              serviceCode: item.itemcode, // 项目code
              unit: item.qtyunit, // 项目单位
              rootOrderId: item.rootOrderId, // 挂号id
              itemType: item.itemType // 项目分类
            }
            params.details.push(settlementDetails)
          })
          this.cacheParams = JSON.parse(JSON.stringify(params))
          try {
            deliveryRoomSettlement(params).then(res => {
              this.settlementFlag = false
              if (res) {
                if (this.obj.totalFeeRefund && res.data && res.data.settlementBillId) {
                  let resData = res.data
                  Object.assign(this.payObj, { patientid: this.settlementPatientId, id: resData.settlementBillId, settleCode: resData.settlementBillCode, totalFee: this.obj.totalPriceDis, unexefee: this.obj.totalFeeRefund })
                  // console.log(resData)
                  // console.log(this.payObj, 'payObj')
                  this.payVisible = true
                } else {
                  this.close()
                }
              }
            })
          } catch (err) {
            this.settlementFlag = false
          }
        }
      })
    },
    cancelDialog () { // 关闭退费弹窗
      try {
        // console.log(this.cacheParams)
        this._getTableData()
        packageApi.setMealCancelSettlement({id: this.cacheParams.id}).then(res => {
          // console.log(res)
          // if (res)
          this.payVisible = false
          this.close()
        })
      } catch (err) {
        this.payVisible = false
      }
    },
    handlePayStatus () { // 退费成功回调
      try {
        // console.log(this.cacheParams)
        this._getTableData()
        deliveryRoomPackageChangeSettleStatus({id: this.cacheParams.id, settlementStatus: 2, settlementRemark: this.obj.refundReason}).then(res => {
          // console.log(res)
          // if (res)
          this.payVisible = false
          this.close()
        })
      } catch (err) {
        this.payVisible = false
      }
    },
    _getTableData () { // 获取table数据
      this.loading = true
      try {
        patientDeliveryPlanSettlementInfo({patientId: this.settlementPatientId}).then(res => {
          this.loading = false
          res && res.data && res.data.length ? this.tableData = res.data : this.tableData = []
        })
      } catch (err) {
        this.loading = false
      }
    }
  },
  watch: {
    'dialogVisible' (flag) {
      if (!flag) this.close(true)
      // console.log(flag, 'flag')
    },
    'tableData' (val) {
      val.length ? this.isShow = true : this.isShow = false
    },
    'multipleSelection' (val) { // 选择其中一项数据处理
      // console.log(val, 'multipleSelection')
      let totalPriceDis = 0
      let settlementMoney = 0
      val.details && val.details.length && val.details.forEach(priceItem => {
        totalPriceDis += Number(priceItem.totalPriceDis)
        if (priceItem.useStatus !== this.userStatusArr[0].id) {
          settlementMoney += Number(priceItem.settlementMoney)
        }
      })
      Object.assign(this.obj, { totalPriceDis, settlementMoney, amountDue: settlementMoney, totalFeeRefund: totalPriceDis - settlementMoney })
    }
  },
  components: {
    FeeValue,
  }
}
</script>
<style lang="less" scoped>
.layout_box .tableScroll { overflow-x: scroll; width: 100%; }
.layout_box .tableHeader { margin-bottom: 0; border-bottom: none; max-width: none; width: 1440px !important; }
.layout_box .isShowtableHeader /deep/ .el-table__body-wrapper { display: none; }
.layout_box .tableBody { margin-top: 0; border-top: none; max-width: none; width: 1440px !important;}
.layout_box .tableScroll /deep/ .el-table /deep/ .el-icon { display: none; }
.layout_box .tableScroll /deep/ .el-table th, .el-table td { padding: 0 !important; }
.layout_box .tableScroll /deep/ .el-table {  margin: 0; padding: 0 !important; }
.layout_box .tableScroll /deep/ .cell { height: 30px !important; line-height: 30px !important; }
.layout_box .tableScroll /deep/ .el-table__expanded-cell { padding: 0 !important; }
.layout_box .tableScroll .el-table /deep/ tr.el-table__row td { padding: 0 !important; border-top: 1px solid #bbbbbb !important;  }
.layout_box .tableScroll /deep/ .el-table__expanded-cell tr.el-table__row td{  padding: 0 !important; border-top: 1px solid #dddddd !important; }
.layout_box .tableScroll /deep/ .el-table__expanded-cell tr.el-table__row td:first-of-type { border-top: none !important; }
.layout_box .el-form /deep/ .el-form-item__label { color: #666666; }
.layout_box .el-form /deep/ .el-form-item__content { text-align: left; }
.cGreen { color: #35A000; }
</style>
