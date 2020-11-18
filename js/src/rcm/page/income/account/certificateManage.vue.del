<template>
  <div class="certificateManage">
    <ever-bread-crumb name="凭证查询" path="/financial/certificateManage"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          ref="form"
          :schema="schema"
          v-model="obj"
          label-position="left"
          :is-query="true"
          @query="list(true)"
          class="form"
        >
          <template slot="tradeType">
            <el-form-item prop="tradeType" label="汇总单类别">
              <ever-select
                v-model="obj.tradeType"
                :options="periodArr"
                :clearable="true"
                style="width: 100%"
              ></ever-select>
            </el-form-item>
          </template>
          <template slot="time">
            <el-form-item prop="time" label="记账日期">
              <div class="range-picker">
                <date-picker v-model="obj.beginDate" :autoWidth="true" outformat="yyyy-MM-dd"></date-picker>
                <span style="display: inline-block;padding: 0 5px;color: #ddd;">至</span>
                <date-picker v-model="obj.endDate" :autoWidth="true" outformat="yyyy-MM-dd"></date-picker>
              </div>
            </el-form-item>
          </template>
          <template slot="mechanism">
            <el-form-item prop="mechanism" label="就诊医疗机构">
              <el-input disabled v-model="obj.mechanism"></el-input>
            </el-form-item>
          </template>
          <template slot="status">
            <el-form-item prop="type" label="状态">
              <ever-select
                v-model="obj.status"
                :options="statusArr"
                style="width: 100%"
                :clearable="true"
              ></ever-select>
            </el-form-item>
          </template>
        </ever-form2>
        <div class="main-option">
          <el-button type="primary" size="small" @click="createVouch" v-show="isCreateVouch">生成临时凭证</el-button>
          <el-button type="primary" size="small" @click="vouchSure" v-show="isVouchSure">凭证确认</el-button>
          <el-button type="primary" size="small" @click="vouchCancel" v-show="isVouchCancel">取消</el-button>
          <el-button type="primary" size="small" @click="vouchSend" v-show="isVouchSend">凭证传递至总账</el-button>
          <el-button type="primary" size="small" @click="vouchWithdraw" v-show="isVouchWithdraw">凭证冲销撤回</el-button>
        </div>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="cerData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" label="序号"></el-table-column>
          <el-table-column label="来源单据号" width="120">
            <template slot-scope="scope">{{ scope.row.memo}}</template>
          </el-table-column>
          <el-table-column prop="tradeType" label="汇总单类别">
            <template slot-scope="scope">{{ scope.row.tradeType | filterTradeType}}</template>
          </el-table-column>
          <el-table-column prop="accountDate" label="记账日期" show-overflow-tooltip>
            <template
              slot-scope="scope"
              v-if="scope.row.accountDate"
            >{{ $moment(scope.row.accountDate).format('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.status | filterStatus}}</template>
          </el-table-column>
          <el-table-column prop="startDate" label="日期自" show-overflow-tooltip>
            <template
              slot-scope="scope"
              v-if="scope.row.startDate"
            >{{ $moment(scope.row.startDate).format('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="endDate" label="日期至" show-overflow-tooltip>
            <template
              slot-scope="scope"
              v-if="scope.row.endDate"
            >{{ $moment(scope.row.endDate).format('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="periodName" label="会计期间" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link
                class="a_ui_01"
                :to="{path:'/financial/certificateList',query:{voucherId:scope.row.voucherId,id:scope.row.id}}"
                v-show="scope.row.voucherId"
              >详情</router-link>
              <!-- <router-link class="a_ui_01" :to="{path:'/income/certificateList',query:{voucherId:scope.row.voucherId,id:scope.row.id}}">详情</router-link> -->
              <router-link
                class="a_ui_01 setMg"
                :to="{path:'/financial/incomeDetail',query:{id:scope.row.id}}"
              >汇总结算单</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import medicalinsuexportapi from '@/insurance/store/medicalinsuexportapi'
import {
  getTitleList,
  getTradeTypeEnum,
  createTempVoucher,
  verify,
  deleteTempVoucher,
  createFinacialVoucher,
  writeOff,
  deleteSum
} from '../../../store/income/account/summary.js'

let schema = [
  {
    name: 'tradeType',
    comp: 'custom',
    noWrap: true,
    props: {
      clearable: true
    }
  },
  {
    name: 'time',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'mechanism',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'status',
    comp: 'custom',
    noWrap: true
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.beginDate = ''
    obj.endDate = ''
    return {
      obj: obj,
      schema: schema,
      isCreateVouch: true,
      isVouchSure: true,
      isVouchCancel: true,
      isVouchSend: true,
      isVouchWithdraw: true,
      periodArr: [],
      statusArr: [
        {
          id: '0',
          name: '新建'
        },
        {
          id: '1',
          name: '已经生成临时凭证'
        },
        {
          id: '2',
          name: '已审核'
        },
        {
          id: '3',
          name: '已经传送总账'
        },
        {
          id: '4',
          name: '已红冲'
        }
      ],
      cerData: [],
      createId: '',
      voucherId: '',
      checkArr: []
    }
  },
  filters: {
    filterTradeType (value) {
      switch (parseFloat(value)) {
        case 1:
          return '门诊收费'
        case 2:
          return '门诊挂号'
        case 3:
          return '疗程执行'
        case 4:
          return '应收收款核销'
        case 5:
          return '住院押金'
        case 6:
          return '采购入库'
        case 7:
          return '营销收费'
        default:
          return ''
      }
    },
    filterStatus (value) {
      switch (parseFloat(value)) {
        case 0:
          return '新建'
        case 1:
          return '已经生成临时凭证'
        case 2:
          return '已审核'
        case 3:
          return '已经传送总账'
        case 4:
          return '已红冲'
        default:
          return ''
      }
    }
  },
  created () {
    medicalinsuexportapi.getClinicInfo().then(result => {
      this.obj.mechanism = result.data.name
      this.obj.organizationCode = result.data.organizationCode
    })
    this.getList()
  },
  mounted () { },
  watch: {
    //   isVouchSure: true,
    //   isVouchCancel: true,
    //   isVouchSend: true,
    //   isVouchWithdraw: true,
    'obj.status': {
      handler: function (val, oldVal) {
        this.btnStatus(val)
      },
      immediate: true
    }
  },
  methods: {
    btnStatus (val) {
      switch (parseFloat(val)) {
        case 0:
          // 新建
          this.isCreateVouch = true
          this.isVouchSure = false
          this.isVouchCancel = true
          this.isVouchSend = false
          this.isVouchWithdraw = false
          break
        case 1:
          // 已经生成临时凭证
          this.isCreateVouch = false
          this.isVouchSure = true
          this.isVouchCancel = true
          this.isVouchSend = false
          this.isVouchWithdraw = false
          break
        case 2:
          // 已审核
          this.isCreateVouch = false
          this.isVouchSure = false
          this.isVouchCancel = true
          this.isVouchSend = true
          this.isVouchWithdraw = false
          break
        case 3:
          // 过账
          this.isCreateVouch = false
          this.isVouchSure = false
          this.isVouchCancel = false
          this.isVouchSend = false
          this.isVouchWithdraw = true
          break
        case 4:
          // 冲销
          this.isCreateVouch = false
          this.isVouchSure = false
          this.isVouchCancel = false
          this.isVouchSend = false
          this.isVouchWithdraw = false
          break
        default:
          this.isCreateVouch = true
          this.isVouchSure = true
          this.isVouchCancel = true
          this.isVouchSend = true
          this.isVouchWithdraw = true
          break
      }
    },
    async getList () {
      try {
        let data = await getTradeTypeEnum()
        if (data && data.data) {
          data.data.map(item => {
            for (let key in item) {
              this.periodArr.push({ name: item[key], id: key })
            }
          })
        }
      } catch (err) { }
    },
    async list () {
      this.cardloading = true
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        tradeType: this.obj.tradeType,
        beginDate: this.obj.beginDate,
        endDate: this.obj.endDate,
        status: this.obj.status
      }
      try {
        let data = await getTitleList(params)
        this.cerData = data.data
        this.totalCount = data.totalCount
        this.cardloading = false
      } catch (err) {
        this.cardloading = false
      }
    },
    handleSelectionChange (val) {
      this.checkArr = val
      if (val.length === 1) {
        this.createId = val[0].id
        this.voucherId = val[0].voucherId
        this.btnStatus(this.checkArr[0].status)
      } else {
        this.btnStatus()
        this.isCreateVouch = true
      }
    },
    // 生成临时凭证
    async createVouch () {
      if (this.checkArr.length === 1) {
        try {
          let params = {
            id: this.createId
          }
          let data = await createTempVoucher(params)
          if (data.head && data.head.errCode === 0) {
            this.$messageTips(this, 'success', (data.head.errMsg || '创建成功！'))
            this.list()
          }
        } catch (err) { }
      } else {
        this.$messageTips(this, 'info', '目前只支持单条凭证生成')
      }
    },
    // 凭证确认
    async vouchSure () {
      if (this.checkArr.length === 1) {
        try {
          let params = {
            id: this.voucherId
          }
          let data = await verify(params)
          if (data && data.head && data.head.errCode === 0) {
            this.$messageTips(this, 'success', (data.head.errMsg || '成功'))
            this.list()
          }
        } catch (err) { }
      } else {
        this.$messageTips(this, 'info', '目前只支持单条凭证确认')
      }
    },
    // 凭证取消
    async vouchCancel () {
      if (this.checkArr.length === 1) {
        try {
          let params = {
            id: this.voucherId ? this.voucherId : this.createId
          }
          if (this.voucherId) {
            let data = await deleteTempVoucher(params)
            if (data.head && data.head.errCode === 0) {
              this.$messageTips(this, 'success', (data.head.errMsg || '删除成功！'))
              this.list()
            }
          } else {
            let data = await deleteSum(params)
            if (data.head && data.head.errCode === 0) {
              this.$messageTips(this, 'success', (data.head.errMsg || '删除成功！'))
              this.list()
            }
          }
        } catch (err) { }
      } else {
        this.$messageTips(this, 'info', '目前只支持单条凭证删除')
      }
    },
    // 凭证传递至总账
    async vouchSend () {
      if (this.checkArr.length === 1) {
        try {
          let params = {
            id: this.voucherId
          }
          let data = await createFinacialVoucher(params)
          if (data.head && data.head.errCode === 0) {
            this.$messageTips(this, 'success', (data.head.errMsg || '删除成功！'))
            this.list()
          }
        } catch (err) { }
      } else {
        this.$messageTips(this, 'info', '目前只支持单条凭证传递至总账')
      }
    },
    // 凭证冲销撤回
    async vouchWithdraw () {
      if (this.checkArr.length === 1) {
        try {
          let params = {
            id: this.voucherId
          }
          let data = await writeOff(params)
          if (data.head && data.head.errCode === 0) {
            this.$messageTips(this, 'success', (data.head.errMsg || '冲销成功！'))
            this.list()
          }
        } catch (err) { }
      } else {
        this.$messageTips(this, 'info', '目前只支持单条凭证冲销')
      }
    }
  }
}
</script>
<style scoped>
.certificateManage /deep/ .el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.certificateManage /deep/ .el-form-item__label {
  text-align: left;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #48576a;
  line-height: 1;
  padding: 11px 12px 11px 0;
  box-sizing: border-box;
  width: auto !important;
}
.certificateManage /deep/ .el-form-item__content {
  margin-left: 0 !important;
  display: inline-block;
  vertical-align: top;
}
.certificateManage /deep/ .form {
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.setMg {
  margin-left: 10px;
}
</style>

