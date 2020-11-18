<template>
  <div v-loading='loading'>
    <div class="layout_inner">
      <ever-form2 :schema="schema" v-model="obj" ref="form" :inline="true" :is-query="true" @query="list(true)">
        <template slot="daterange">
          <ever-range-picker :start.sync="obj.beginDate" :end.sync="obj.endDate"></ever-range-picker>
        </template>
        <template slot="medPayState">
          <el-checkbox v-model="obj.medPayState">未提交的交易记录</el-checkbox>
        </template>
        <template slot="settlementType">
          <el-checkbox v-model="obj.settlementType">挂号结诊信息</el-checkbox>
        </template>
      </ever-form2>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="outpatientNumber" label="门诊档案号">
        </el-table-column>
        <el-table-column prop="cardno" label="医保卡号">
        </el-table-column>
        <el-table-column prop="personname" label="姓名">
        </el-table-column>
        <el-table-column prop="sexName" label="性别">
        </el-table-column>
        <el-table-column prop="age" label="年龄">
        </el-table-column>
        <el-table-column prop="idno" label="身份证号">
        </el-table-column>
        <el-table-column prop="mzfee" label="总金额">
          <template slot-scope="scope">
            {{scope.row.mzfee | formatToFinacial }}
          </template>
        </el-table-column>
        <el-table-column prop="fund" label="报销金额">
          <template slot-scope="scope">
            {{scope.row.fund | formatToFinacial }}
          </template>
        </el-table-column>
        <el-table-column prop="personcountpay" label="个人账户支付">
          <template slot-scope="scope">
            {{scope.row.personcountpay | formatToFinacial }}
          </template>
        </el-table-column>
        <el-table-column prop="settleDate" label="结算时间">
          <template slot-scope="scope">
            {{$moment(scope.row.settleDate).format('YYYY/MM/DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="医生">
        </el-table-column>
        <el-table-column prop="deptName" label="科室">
        </el-table-column>
        <el-table-column prop="tradeno" label="交易流水号">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='backBtn(scope.row)' v-if='scope.row.medPayState==3'>回退</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination :page-sizes="pageSizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount">
      </ever-pagination>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import {
  queryMedicareTrade,
  commitTradeStateAll
} from '@/rcm/store/medicaretransaction.js'
export default {
  mixins: [list],
  watch: {
    'obj.medPayState': {
      handler: function (val, oldval) {
        val ? (this.medPayState = 3) : (this.medPayState = '')
        this.list()
      }
    },
    'obj.settlementType': {
      handler: function (val, oldval) {
        val ? (this.settlementType = 0) : (this.settlementType = '')
        this.list()
      }
    },
    'obj.beginDate': {
      handler: function (val, oldval) {
        this.list()
      }
    }
  },
  data () {
    let schema = [
      {
        name: 'patientId',
        label: '患者姓名',
        comp: 'ever-patient-select',
        props: {
          placeholder: '患者姓名'
        }
      },
      {
        name: 'daterange',
        label: '起始日期',
        comp: 'custom' // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
      },
      {
        name: 'medPayState',
        comp: 'custom'
      },
      {
        name: 'settlementType',
        comp: 'custom'
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.daterangearr = []
    // obj.start = '2018-01-01'
    // obj.end = '2018-01-05'
    return {
      schema,
      obj,
      loading: false,
      medPayState: '',
      settlementType: '',
      tableData: []
    }
  },
  methods: {
    // 患者列表
    async list () {
      this.loading = true
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        beginDate: this.obj.beginDate,
        endDate: this.obj.endDate,
        patientId: this.obj.patientId,
        medPayState: this.medPayState,
        settlementType: this.settlementType
      }
      try {
        let data = await queryMedicareTrade(params)
        this.loading = false
        if (data.head && data.head.errCode === 0) {
          this.tableData = data.data
          this.totalCount = data.totalCount
        } else {
        }
      } catch (err) {
        this.loading = false
      }
    },
    async goBack (row) {
      try {
        let params = {
          id: row.id,
          tradeno: row.tradeno
        }
        let data = await commitTradeStateAll(params)
        if (data && data.head.errCode === 0) {
          this.$message({
            type: 'success',
            message: `${data.head.errMsg}` || '成功'
          })
          this.list()
        } else {
          this.$message({
            type: 'error',
            message: `${data.head.errMsg}` || '成功'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    backBtn (row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.goBack(row)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

