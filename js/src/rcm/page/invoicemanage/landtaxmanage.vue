<template>
  <div>
    <div class="layout_inner">
      <ever-form2
        :schema="querySchema"
        v-model="obj"
        ref="form"
        labelWidth="140px"
        label-position="right"
        :is-query="true"
        :inline="true"
        @query="query(true)">
          <template slot="patientId">
            <ever-patient-select v-model="obj.patientId" :allowCreate="false"></ever-patient-select>
          </template>
        <template slot="printStatus">
          <el-select v-model="obj.printStatus" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.dyzt"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot="daterange">
          <ever-range-picker :start.sync="obj.createTimeStart" :end.sync="obj.createTimeEnd"></ever-range-picker>
        </template>
        <template slot="whetherSetMeal">
          <el-select v-model="obj.whetherSetMeal" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.tc"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="batchPrint">打印</el-button>
            <doc-download @downFile="downFile" ref="downloadfile" :btnTxt="'导出表格'" style="margin-left: 20px;"></doc-download>
          </el-form-item>
        </template>
      </ever-form2>
      <el-row style="margin-bottom:15px;font-size:14px;line-height:36px;">
        <el-col>
          <label style="margin-right:10px;">合计：</label><span>{{info.totalCount | formatToFinacial}}</span>
          <label style="margin:0 10px 0 20px;">应收合计：</label><span>{{info.totalFeeSum | formatToFinacial}}</span>
          <label style="margin:0 10px 0 20px;">实收合计：</label><span>{{info.realTotalFeeSum | formatToFinacial}}</span>
          <label style="margin:0 10px 0 20px;">优惠合计：</label><span>{{info.benefitFeeSum | formatToFinacial}}</span>
        </el-col>
      </el-row>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="settleCode"
          width="190"
          label="结算单号">
        </el-table-column>
        <el-table-column
          prop="patientName"
          width="90"
          label="患者" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="patientNumber"
          width="110"
          label="患者档案号">
        </el-table-column>
        <el-table-column
          prop="birthday"
          width="160"
          label="出生日期">
        </el-table-column>
        <el-table-column
          prop="deptName"
          width="120"
          label="科室" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="doctorName"
          width="90"
          label="医生" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalFee"
          width="120"
          label="应收" align="right">
          <template slot-scope="scope">
            {{scope.row.totalFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="benefitFee"
          width="120"
          label="优惠" align="right">
          <template slot-scope="scope">
            {{scope.row.benefitFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realTotalFee"
          width="120"
          label="实收" align="right">
          <template slot-scope="scope">
            {{scope.row.realTotalFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="returnFee"
          width="120"
          label="已退款" align="right">
          <template slot-scope="scope">
            {{scope.row.returnFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorName"
          width="100"
          label="收费员" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="160"
          label="收费时间">
          <template slot-scope="scope">
            {{format(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="printStatus"
          width="110"
          fixed="right"
          align="center"
          label="打印状态">
          <template slot-scope="scope">
            {{scope.row.printStatus===1?'已打印':'未打印'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="checkDeatils(scope.row)">查看明细</el-button>
            <template v-if="scope.row.canPrinit">
              <el-button type="primary" size="small" @click="print(scope.row)" v-if="scope.row.whetherSetMeal===0">打印发票</el-button>
              <el-button type="primary" size="small" @click="print(scope.row)" v-else>打印套餐发票</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </div>
    <el-dialog title="发票明细" :visible.sync="visibile" width="50%" class='order ui_dialog_02 spe' >
      <div class='scoll'>
        <el-table
        :data="tableDatat"
        style="width: 100%"
        >
        <el-table-column
          prop="invoiceClassName"
          label="发票类别">
        </el-table-column>
        <el-table-column
          prop="itemName"
          label="收费项目名称">
        </el-table-column>
        <el-table-column
          prop="patientName"
          label="实收金额">
          <template slot-scope="scope">
            {{scope.row.realFee | formatToFinacial}}
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:20px;">
        <el-col :span="24">
          <label>项目数量合计：</label>
          <span>{{detail.totalCount}}个</span>
          <label style="margin-left:20px;">金额合计：</label>
          <span>{{detail.realFeeSum | formatToFinacial}}</span>
        </el-col>
      </el-row>
      </div>
    </el-dialog>
    <el-dialog title="套餐发票设置" :visible.sync="visibilet" width="40%" class='order ui_dialog_02 spe dialog_diy' >
      <div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="换算比例：">
            <ever-price v-model="form.rate" placeholder= '请输入预计入院天数' append='%' type='number'></ever-price>
          </el-form-item>
        </el-form>
        <el-row style="margin-top:30px;color:#1c7bef">
          <el-col :span="24">系统会根据应收金额*换算比例生成发票金额</el-col>
        </el-row>
        <el-row style="margin-top:50px;float:right;">
          <el-col :span="24">
            <el-button >取消</el-button>
            <el-button type="primary" @click="logConfirm">确认</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/rcm/store/invoicemanage/invoicemanageapi.js'
import list from '@/util/list'
let schema = [
  {
    label: '患者',
    name: 'patientId',
    comp: 'custom'
  },
  {
    label: '结算单号',
    name: 'settleCode'
  },
  {
    name: 'daterange',
    label: '收费时间',
    comp: 'custom'
  },
  {
    label: '打印状态',
    name: 'printStatus',
    comp: 'custom'
  },
  {
    name: 'createBy',
    label: '收费员',
    comp: 'everStaffSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
  },
  {
    label: '套餐',
    name: 'whetherSetMeal',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.createTimeEnd = ''
    obj.createTimeStart = ''
    return {
      visibile: false,
      visibilet: false,
      querySchema: schema,
      api,
      obj,
      tableData: [],
      tableDatat: [],
      handleSeleArr: [],
      info: {
        totalFeeSum: 0,
        totalCount: 0,
        realTotalFeeSum: 0,
        benefitFeeSum: 0
      },
      detail: {
        realFeeSum: '',
        totalCount: ''
      },
      form: {
        rate: 100,
        id: '',
        type: 1
      },
      options: {
        dyzt: [
          {id: 0, name: '未打印'},
          {id: 1, name: '已打印'}
        ],
        tc: [
          {id: '', name: '全部'},
          {id: 1, name: '套餐'},
          {id: 0, name: '非套餐'}
        ]
      }
    }
  },
  methods: {
    downFile () { // 导出表格
      api.exportSettlement(this.obj).then(rs => {
        if (rs.head.errCode === 0 && rs.data && rs.data.fileId) {
          let filename = '/file/' + rs.data.fileId
          window.open(filename)
        }
      })
    },
    handleSelectionChange (data) { // 获取选中数据
      this.handleSeleArr = data
    },
    checkDeatils (row) { // 详情弹窗
      api.getDetails({settlementId: row.id}).then(result => {
        this.tableDatat = result.data
        this.detail.realFeeSum = result.realFeeSum
        this.detail.totalCount = result.totalCount
        this.visibile = true
      })
    },
    async batchPrint () { // 批量打印，判断是否已经打印过
      let ids = []
      this.handleSeleArr.forEach(item => {
        ids.push(item.id)
      })
      let isPrint = await api.settlementPrinted({settlementIds: ids})
      if (isPrint.data.length === 0) {
        this.batchPrintVerification()
      } else {
        let val = `结算单号【${isPrint.data.join('】,【')}】已打印过发票！是否继续打印?`
        this.$confirm(val, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.batchPrintVerification()
        })
      }
    },
    batchPrintVerification () { // 批量打印，对套餐打印和普通打印做不同处理
      let tcData = this.handleSeleArr.find(res => res.whetherSetMeal === 1)
      this.form.type = 2
      if (tcData) {
        this.proportionLog({id: ''})
      } else {
        this.batchSendPrint()
      }
    },
    batchSendPrint () { // 批量打印，针对不同的发票类型传不同的参数
      this.handleSeleArr.forEach(item => {
        if (item.whetherSetMeal === 1) {
          this.printInvoice(item, this.form.rate)
        } else {
          this.printInvoice(item, 100)
        }
      })
      this.printSuccessBack(this.handleSeleArr)
    },
    printSuccessBack (data) {
      let params = []
      data.forEach(item => {
        params.push(item.id)
      })
      api.printSave({settlementIds: params}).then(result => {
        this.visibilet = false
        this.query()
      })
    },
    proportionLog (row) { // 显示换算比例弹窗
      this.form.id = row.id
      this.form.rate = 100
      this.visibilet = true
    },
    async print (row) { // 单条打印判断是否已经打印过
      let isPrint = await api.settlementPrinted({settlementIds: [row.id]})
      if (isPrint.data.length === 0) {
        this.printVerification(row)
      } else {
        let val = `结算单号【${isPrint.data[0]}】已经打印过发票！是否继续打印?`
        this.$confirm(val, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.printVerification(row)
        })
      }
    },
    printVerification (row) { // 单条打印针对套餐发票和普通发票做不同处理
      this.form.type = 1
      if (row.whetherSetMeal === 0) {
        this.printInvoice(row, 100)
      } else {
        this.proportionLog(row)
      }
    },
    logConfirm () { // 换算比例弹窗确认按钮针对单条还是批量做不同处理
      if (!this.form.rate) {
        this.$messageTips(this, 'error', '换算比例不能为空')
        return
      }
      if (this.form.type === 1) {
        this.printInvoice({id: this.form.id}, this.form.rate)
      } else {
        this.batchSendPrint()
      }
    },
    printInvoice (row, rate) { // 打印一张发票
    },
    list () {
      let params = Object.assign({offset: this.offset, pagesize: this.pagesize}, this.obj)
      this.loading = true
      api.searchSettlement(params).then(result => {
        this.loading = false
        result.data.map(item => {
          item.canPrinit = Math.abs(item.realTotalFee) > Math.abs(item.returnFee)
        })
        this.tableData = result.data
        this.totalCount = result.totalCount ? result.totalCount : 0
        this.info.benefitFeeSum = result.benefitFeeSum
        this.info.totalFeeSum = result.totalFeeSum
        this.info.totalCount = result.totalCount
        this.info.realTotalFeeSum = result.realTotalFeeSum
      })
    },
    resetForm () {
      this.obj.settleCode = ''
      this.obj.createBy = ''
      this.obj.patientId = ''
      this.obj.createTimeStart = ''
      this.obj.createTimeEnd = ''
      this.obj.printStatus = ''
      this.obj.whetherSetMeal = ''
    },
    add0 (m) { return m < 10 ? '0' + m : m },
    format (date) {
      if (!date) return ''
      let time = new Date(Number(date))
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      let h = time.getHours()
      let mm = time.getMinutes()
      let s = time.getSeconds()
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    }
  }
}
</script>
<style lang="less" scoped>
.main-head{
  border-bottom: 1px solid #eeeeee;
}
.dialog_diy /deep/ .el-dialog__body{
  padding-top: 30px !important;
  border-top: 1px solid #eeeeee;
}
// .el-table /deep/ thead tr th:last-child{
//   text-align: center !important;
// }
</style>
