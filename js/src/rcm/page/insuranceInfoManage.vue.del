<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 :schema="querySchema" v-model="queryObj"  ref="form" :inline="true" :is-query="true" @query="list(true)" :nosubmit="true">
          <template slot="daterange">
            <ever-range-picker :start.sync="obj.beginDate" :end.sync="obj.endDate"></ever-range-picker>
          </template>
          <template slot="comInsuranceOrg">
            <ever-select v-model="queryObj.comInsuranceOrg" :options="periodArr" :clearable='true' style="width: 100px">
              </ever-select>
          </template>
          <template slot="btn">

            <el-button type="primary" style="float: right;" @click="$router.push('/financial/uploadInsuranceInfo')">上传附件</el-button>
            <el-button type="primary" style="float: right;margin-right:10px;" @click="list">查询</el-button>

          </template>
        </ever-form2>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        >
        <el-table-column
          prop="name"
          label="所属患者">
        </el-table-column>
        <el-table-column
          prop="comInsuranceName"
          label="保险公司">
        </el-table-column>
        <el-table-column
          label="就诊日期">
          <template slot-scope="scope">
              <span>{{$moment(scope.row.clinicDate).format('YYYY-MM-DD')}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="结算单号">

          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="settlementDetail(scope.row)">{{scope.row.settlementNo}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上传日期">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="$router.push('/financial/uploadInsuranceInfo/'+scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </div>
  </div>
</template>

<script>
import insuranceorgapi from '@/insurance/store/insuranceorgapi'
import api from '../store/insuranceInfoManageApi'
import list from '../../util/list'

let schema = [
  {
    name: 'daterange',
    label: '日期区间',
    comp: 'custom' // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
  },
  {
    name: 'patientId',
    placeholder: '输入患者姓名',
    comp: 'ever-patient-select',
    label: '患者姓名'
  },
  {
    name: 'comInsuranceOrg',
    label: '保险公司',
    comp: 'custom'
  },
  {
    name: 'settlementNo',
    placeholder: '结算单号',
    label: '结算单号'
  },
  {
    name: 'btn',
    label: '',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.beginDate = ''
    obj.endDate = ''
    return {
      obj,
      queryObj: obj,
      querySchema: schema,
      tableData: [],
      printObj: {},
      periodArr: []
    }
  },
  created () {
    insuranceorgapi.list({}).then(result => {
      for (var insur of result.data) {
        insur.name = insur.insuranceOrgCnName
        insur.id = String(insur.id)
      }
      this.periodArr = result.data
    })
    this.list()
  },
  methods: {
    list () {
      let params = {
        offset: this.offset,
        pagesize: this.pagesize
      }
      if (this.queryObj.patientId) {
        params['patientId'] = this.queryObj.patientId
      }
      if (this.queryObj.comInsuranceOrg) {
        params['comInsuranceOrg'] = this.queryObj.comInsuranceOrg
      }
      if (this.queryObj.settlementNo) {
        params['settlementNo'] = this.queryObj.settlementNo
      }
      if (this.queryObj.beginDate) {
        params['beginDate'] = this.queryObj.beginDate
        params['endDate'] = this.queryObj.endDate
      }
      api.list(params).then(result => {
        this.tableData = result.list
        this.totalCount = result.total
      })
    },
    async settlementDetail (row) {
      // 1门诊2住院3营销
      if (row.type === 2) {
        this.$router.push({
          path: '/rcm/depositCharge',
          query: {
            settlementId: row.settlementId,
            patientId: row.patientId,
            settlementType: row.settlementType,
            status: '3',
            source: '1'
          }
        })
      } else if (row.type === 1) {
        location.href = `${this.$ever.rcmIndex}/rcm/outpatientfee/settled?patientId=${row.patientid}&returnFlag=${row.returnFlag ? 1 : 0}&visitNumber=${row.rootorderid}&status=2&showDetail=0&settlementid=${row.settlementId}&dptId=${row.orderDept}&isnoprint=${true}&isFromBoard=true`
      } else if (row.type === 3) {
        this.$router.push({
          path: '/rcm/paymentDetail',
          query: {
            patientId: row.patientId,
            settlementId: row.settlementId,
            status: '2',
            source: '1'
          }
        })
      }
    }
  }
}
</script>
