<template>
  <div>
    <div class="layout_inner flex_col_1_auto">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="obj"
          ref="form"
          labelWidth="140px"
          label-position="right"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="patientId">
            <ever-patient-select v-model="obj.patientId" :allowCreate="false"></ever-patient-select>
          </template>
          <template slot="payStatus">
            <el-select v-model="obj.payStatus" placeholder="请选择" clearable>
              <el-option
                v-for="item in options.zfzt"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="teamOrderStatus">
            <el-select v-model="obj.teamOrderStatus" placeholder="请选择" clearable>
              <el-option
                v-for="item in options.xdzt"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="orderCreateTimeStart">
            <el-date-picker
              v-model="obj.orderCreateTimeStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </template>
          <template slot="orderCreateTimeEnd">
            <el-date-picker
              v-model="obj.orderCreateTimeEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button type="primary" @click="establish(true)">下单</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="teamName" label="团体名称"></el-table-column>
        <el-table-column prop="setMealTypeName" width="110" label="患者姓名">
          <template slot-scope="scope">{{scope.row.patient?scope.row.patient.name:''}}</template>
        </el-table-column>
        <el-table-column prop="patientAge" width="120" label="出生日期">
          <template
            slot-scope="scope"
          >{{(scope.row.patient && scope.row.patient.birthday ? scope.row.patient.birthday : '').split(' ')[0]}}</template>
        </el-table-column>
        <el-table-column width="70" label="性别">
          <template slot-scope="scope" v-if="scope.row.patient">
            <sys-value type="GBT.2261.1" :code="scope.row.patient.sex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="setMealTypeName" width="80" label="套餐类型"></el-table-column>
        <el-table-column prop="setMealName" width="150" label="套餐名称"></el-table-column>
        <el-table-column prop="teamOrderStatus" width="80" label="下单状态">
          <template slot-scope="scope">{{scope.row.teamOrderStatus===1 ? '已下单' : '未下单'}}</template>
        </el-table-column>
        <el-table-column prop="payStatusChs" width="80" label="支付"></el-table-column>
        <el-table-column prop width="80" label="使用">
          <template slot-scope="scope" v-if="scope.row.useStatus">
            <span>{{scope.row.useStatus == STATUS_OF_USE[1].id ? STATUS_OF_USE[1].name : STATUS_OF_USE[2].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" width="160" label="开始使用日期">
          <template slot-scope="scope">{{scope.row.teamOrderStatus===1 ? scope.row.createTime: ''}}</template>
        </el-table-column>
        <el-table-column prop="saleDeptName" align="right" width="100" label="金额（元）">
          <template slot-scope="scope">{{scope.row.totalPriceDis | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="establish(false, scope.row)"
              v-if="scope.row.teamOrderStatus !==1"
            >下单</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="details(scope.row)"
              v-if="scope.row.teamOrderStatus==1"
            >详情</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="pay(scope.row)"
              v-if="scope.row.teamOrderStatus==1&&scope.row.payStatus!==1"
            >支付</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="cancel(scope.row)"
              v-if="scope.row.teamOrderStatus==1&&scope.row.payStatus!==1"
            >取消</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.row)"
              v-if="scope.row.teamOrderStatus !==1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <establish-package-order
      :dialogVisible.sync="paydialogVisible"
      :initoptions="options"
      @establishCallback="establishCallback"
      :isGroup="true"
      :groupInfos="groupInfos"
    ></establish-package-order>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @cancel="cancelLog"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
    ></paymethodstwo>
    <refund-dialog
      :dialogVisible.sync="refundVisible"
      :refundInfo="refundInfo"
      @establishCallback="establishCallback"
    ></refund-dialog>
  </div>
</template>

<script>
import api from '../../store/packageapi.js'
import establishPackageOrder from './groupestablishpackageorder'
import refundDialog from './refunddialog'
import list from '@/util/list'
import { STATUS_OF_USE } from '@/util/common'
let querySchema = [
  {
    label: '团体名称',
    name: 'teamName'
  },
  {
    label: '姓名',
    name: 'patientId',
    comp: 'custom'
  },
  {
    name: 'orderCreateTimeStart',
    label: '开始使用时间',
    comp: 'custom'
  },
  {
    name: 'orderCreateTimeEnd',
    label: '结束使用时间',
    comp: 'custom'
  },
  {
    name: 'useStatus',
    label: '使用',
    comp: 'ever-select',
    props: {
      options: STATUS_OF_USE
    }
  },
  {
    label: '下单状态',
    name: 'teamOrderStatus',
    comp: 'custom'
  },
  {
    label: '支付状态',
    name: 'payStatus',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    obj.orderCreateTimeEnd = ''
    obj.orderCreateTimeStart = ''
    obj.setMealId = ''
    return {
      paydialogVisible: false,
      payVisible: false,
      refundVisible: false,
      obj,
      querySchema,
      curId: '',
      refundInfo: {
        patientId: '',
        setMealId: '',
        orderId: '',
        setMealName: '',
        name: '',
        birthday: '',
        sex: '',
        saleManName: '',
        createTime: ''
      },
      payObj: {
        patientid: '', // 患者id
        settlementId: '', // 结算单id
        settlementNo: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '3', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        paymethodArr: [], // 支付方式
        isValited: true, // 押金是false,费用为true
        payTradeLog: [], // 支付记录
        isDeposit: 0// 是否押金
      },
      multipleSelection: [],
      groupInfos: [],
      options: {
        zfzt: [
          { id: '', name: '全部' },
          { id: '1', name: '已付' },
          { id: '2', name: '未付' }
        ],
        xdzt: [
          { id: '', name: '全部' },
          { id: '1', name: '已下单' },
          { id: '0', name: '未下单' }
        ]
      },
      STATUS_OF_USE
    }
  },
  components: {
    establishPackageOrder,
    refundDialog
  },
  created () {
  },
  watch: {
    'obj.tc': {
      handler: function (val, oldval) {
        if (!val) {
          this.obj.setMealId = ''
        }
      }
    }
  },
  methods: {
    list () {
      let params = Object.assign({}, this.obj, { offset: this.offset, pagesize: this.pagesize })
      params.orderCreateTimeStart = params.orderCreateTimeStart + (params.orderCreateTimeStart ? ' 00:00:00' : '')
      params.orderCreateTimeEnd = params.orderCreateTimeEnd + (params.orderCreateTimeEnd ? ' 23:59:59' : '')
      this.loading = true
      api.groupPatientList(params).then(result => {
        this.tableData = result.data.resultList
        this.totalCount = result.data.totalCount
        this.loading = false
      })
    },
    initData (data) {
      let arr = []
      data.forEach(item => {
        arr.push({ value: item.name, address: item.id })
      })
      return arr
    },
    handleSelect (item) {
      this.obj.setMealId = item.address
    },
    establishCallback (val) {
      if (val) {
        this.list()
      }
    },
    establish (val, row) {
      if (val) {
        if (!this.multipleSelection.length) {
          this.$messageTips(this, 'error', '请至少选择一个人员')
          return
        }
      } else {
        this.multipleSelection = [row]
      }
      this.initInfos()
      this.paydialogVisible = true
    },
    initInfos () { // 初始化人员信息
      let params = []
      let info = {}
      this.multipleSelection.forEach((item, index) => {
        if (!info[item.patient.id]) {
          info[item.patient.id] = true
          let obj = {
            name: `${item.patient.name}  ${this.$filters.formatSex(item.patient.sex)}  ${item.patient.mobile || '--'}`,
            id: item.patient.id,
            teamId: item.teamId
          }
          params.push(obj)
        }
      })
      this.groupInfos = params
    },
    details (row) {
      this.$router.push({ path: '/kanban/orderdetails/' + row.id })
    },
    cancel (row) {
      this.$confirm('确定是要取消此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.changeStatus({ id: row.id, payStatus: 4 }).then(result => {
          if (result.head.errCode === 0) {
            this.list(true)()
            this.$messageTips(this, 'success', '取消成功')
          }
        })
      })
    },
    del (row) {
      this.$confirm('确定将患者从团体中删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteDetailByPatientId({ patientId: row.patient.id, teamId: row.teamId }).then(result => {
          if (result.head.errCode === 0) {
            this.list(true)()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      })
    },
    async pay (row) {
      let order = await api.orderPay({ id: row.id })
      let settlement = await api.oneStepSettle(order.data)
      this.curId = row.id
      // 患者id
      this.payObj.patientid = row.patientId
      // 结算单id
      this.payObj.id = settlement.data.settlementBillId
      // 结算单号
      this.payObj.settleCode = settlement.data.settlementBillCode
      // 还需支付
      this.payObj.unexefee = row.orderTotalPriceDis
      // 已收金额
      this.payObj.exefee = 0
      // 总额
      this.payObj.totalFee = row.orderTotalPriceDis
      this.payVisible = true
    },
    // 关闭弹窗
    cancelLog () {
      this.payVisible = false
    },
    // 支付成功回掉
    payStatus () {
      api.changeStatus({ id: this.curId, payStatus: 1 }).then(result => {
        if (result.head.errCode === 0) {
          this.payVisible = false
          this.list(true)
          this.$messageTips(this, 'success', '支付成功')
        }
      }) // 支付成功之后修改订单的支付状态
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    refund (row) {
      this.refundInfo.orderId = row.id
      this.refundInfo.setMealId = row.setMealId
      this.refundInfo.setMealName = row.setMealName
      this.refundInfo.name = row.patient.name
      this.refundInfo.birthday = row.patient.birthday
      this.refundInfo.sex = row.patient.sex
      this.refundInfo.saleManName = row.saleManName
      this.refundInfo.createTime = row.createTime
      this.refundInfo.patientId = row.patient.id
      this.refundVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="less" scoped>
.group-list /deep/ .el-date-editor.el-input {
  width: 170px !important;
}
</style>
