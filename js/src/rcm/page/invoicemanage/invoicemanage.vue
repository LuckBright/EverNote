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
        <template slot="type">
          <el-select v-model="obj.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
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
        <template slot="invalidStatus">
          <el-select v-model="obj.invalidStatus" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.zfzt"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot="daterange">
          <ever-range-picker :start.sync="obj.createTimeStart" :end.sync="obj.createTimeEnd"></ever-range-picker>
        </template>
        <template slot="daterange1">
          <ever-range-picker :start.sync="obj.invoiceCreateTimeStart" :end.sync="obj.invoiceCreateTimeEnd"></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        >
        <el-table-column
          prop="settleCode"
          width="180"
          label="结算单号">
        </el-table-column>
        <el-table-column
          prop="clinicName"
          width="170"
          label="就诊机构">
        </el-table-column>
        <el-table-column
          prop="type"
          width="60"
          label="类别">
          <template slot-scope="scope">
            {{scope.row.type==1?'门诊':'住院'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patientName"
          width="80"
          label="患者" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="patientNumber"
          width="120"
          label="患者档案号">
        </el-table-column>
        <el-table-column
          prop="deptName"
          width="100"
          label="科室" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="doctorName"
          width="80"
          label="医生" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalFee"
          min-width="120"
          label="应收" align="right">
          <template slot-scope="scope">
            {{scope.row.totalFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="benefitFee"
          miin-width="120"
          label="优惠" align="right">
          <template slot-scope="scope">
            {{scope.row.benefitFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realTotalFee"
          min-width="120"
          label="实收" align="right">
          <template slot-scope="scope">
            {{scope.row.realTotalFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="returnFee"
          min-width="120"
          label="已退款" align="right">
          <template slot-scope="scope">
            {{scope.row.returnFee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceNo"
          width="100"
          label="发票号">
        </el-table-column>
        <el-table-column
          prop="invoiceAmount"
          width="120"
          label="发票金额" align="right">
          <template slot-scope="scope">
            {{scope.row.invoiceAmount | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorName"
          width="90"
          show-overflow-tooltip
          label="收费员">
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="180"
          label="收费时间">
          <template slot-scope="scope">
            {{format(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="printorName"
          width="150"
          label="打印人">
        </el-table-column>
        <el-table-column
          prop="printTime"
          width="180"
          label="打印时间">
          <template slot-scope="scope">
            {{format(scope.row.printTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="invalidTime"
          width="180"
          label="作废时间">
          <template slot-scope="scope">
            {{format(scope.row.invalidTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="printStatusChn"
          width="100"
          align="center"
          fixed="right"
          label="打印状态">
        </el-table-column>
        <el-table-column
          prop="invalidStatusChn"
          width="100"
          align="center"
          fixed="right"
          label="发票作废">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="120"
          align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="small" v-if="(scope.row.taxEnable == '1')&&scope.row.canPrinit" @click="findInvoiceByIds(scope.row)">打印</el-button>
            <el-button type="danger" size="small" v-if="scope.row.taxEnable == '1'" @click="cancelInvoices(scope.row)">作废</el-button>
            <el-button type="primary" size="small" v-if="scope.row.taxEnable == '2'" @click="updateInvoice(scope.row)">编辑发票号</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </div>
    <el-dialog title="更新发票号" :visible.sync="invoiceDialog.visibile" width="30%" class='order ui_dialog_02 spe' >
    <div class='scoll'>
      <el-form ref="form" label-width="100px">
        <el-form-item label="发票号：">
          <el-input v-model="invoiceDialog.value"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="invoiceDialog.visibile = false">取消</el-button>
      <el-button @click="updateInvoiceConfirm" type="primary">确认</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import api from '@/rcm/store/invoicemanage/invoicemanageapi.js'
import list from '@/util/list'
import invoice from './invoice'
import settlementapi from '@/rcm/store/settlementapi'
let schema = [
  {
    name: 'clinicId',
    label: '机构',
    comp: 'everOrgSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
  },
  {
    label: '类别',
    name: 'type',
    comp: 'custom'
  },
  {
    label: '结算单号',
    name: 'settleCode'
  },
  {
    label: '发票号',
    name: 'invoiceNo'
  },
  {
    label: '患者',
    name: 'patientId',
    comp: 'custom'
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
    label: '作废状态',
    name: 'invalidStatus',
    comp: 'custom'
  },
  {
    name: 'daterange1',
    label: '开票时间',
    comp: 'custom'
  }
]
export default {
  mixins: [list, invoice],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.createTimeEnd = ''
    obj.createTimeStart = ''
    obj.invoiceCreateTimeEnd = ''
    obj.invoiceCreateTimeStart = ''
    obj.invalidStatus = 1
    return {
      querySchema: schema,
      api,
      settlementapi,
      obj,
      tableData: [],
      options: {
        dyzt: [
          {id: 1, name: '未开票'},
          {id: 3, name: '已开票'},
          {id: 2, name: '已打印'}
        ],
        zfzt: [
          {id: 2, name: '已作废'},
          {id: 1, name: '未作废'}
        ],
        types: [
          {id: '', name: '全部'},
          {id: '1', name: '门诊'},
          {id: '2', name: '住院'}
        ],
      },
      invoiceDialog: {
        visibile: false,
        infos: [],
        value: ''
      },
      iframeSrcArr: [],
      printInfo: {id: '', code: ''}
    }
  },
  created () {
  },
  watch: {
    'invoiceDialog.visibile': {
      handler (newValue) {
        if (!newValue) {
          this.invoiceDialog.value = ''
          this.invoiceDialog.infos = []
        }
      },
      immediate: true
    }
  },
  methods: {
    list () {
      let params = Object.assign({offset: this.offset, pagesize: this.pagesize}, this.obj)
      this.loading = true
      api.list(params).then(result => {
        this.loading = false
        result.data.map(item => {
          item.canPrinit = Math.abs(item.realTotalFee) > Math.abs(item.returnFee)
        })
        this.tableData = result.data
        this.totalCount = result.totalCount ? result.totalCount : 0
      })
    },
    resetForm () {
      this.obj.settleCode = ''
      this.obj.invoiceNo = ''
      this.obj.patientId = ''
      this.obj.createTimeStart = ''
      this.obj.createTimeEnd = ''
      this.obj.invoiceCreateTimeStart = ''
      this.obj.invoiceCreateTimeEnd = ''
      this.obj.printStatus = ''
      this.obj.invalidStatus = ''
      this.obj.clinicId = ''
    },
    printSuccessCall () { // 打印完成的回调
      this.query()
    },
    cancelSuccessCall () { // 作废完成的回调
      this.query()
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
<style lang="less">
</style>

