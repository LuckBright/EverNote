<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        @query="list"
        labelWidth="140px"
        :inline="true"
        :is-query="true"
      ></ever-form2>
      <div class="main-option">
        <el-button type="primary" @click="upload(false)">上传</el-button>
      </div>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%;overflow:auto;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip prop="visitNumber" label="就诊流水号"></el-table-column>
      <el-table-column prop="patientName" label="姓名" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sex" label="性别" width="60">
        <template slot-scope="scope">{{scope.row.sex | formatSex}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="birthday" label="出生日期" width="110">
        <template slot-scope="scope">{{scope.row.birthday.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column prop="idNo" label="身份证号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="docNo" label="单据号"></el-table-column>
      <el-table-column prop="tradeType" label="交易类型">
        <template slot-scope="scope">{{scope.row.tradeType==1?'正交易': '负交易'}}</template>
      </el-table-column>
      <el-table-column prop="joinSettleFlag" label="确认结算标志">
        <template slot-scope="scope">{{scope.row.joinSettleFlag? '参加月结算': '不参加月结算'}}</template>
      </el-table-column>
      <el-table-column prop="checkAccountFlag" label="对账标志">
        <template slot-scope="scope">{{scope.row.checkAccountFlag? '帐平': '帐不平'}}</template>
      </el-table-column>
      <el-table-column prop="uploadFlag" label="上传标志">
        <template
          slot-scope="scope"
        >{{scope.row.uploadFlag==1? '成功': scope.row.uploadFlag==2? '未上传': '失败'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="upload(scope.row)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import {
  searchMedCheckAccount,
  uploadMedCheckAccount
} from '@/rcm/store/otmdiscomponent/reconciliationapi.js'
import list from '@/util/list'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'

let schema = [
  // {
  //   name: 'insuranceOrgId',
  //   label: '保险类别',
  //   comp: medicalOrgList,
  //   props: {
  //     defaultFirst: true
  //   }
  // },
  {
    name: 'settlePeriod',
    label: '费用属期',
    comp: 'elDatePicker',
    props: {
      type: 'month'
    }
  },
  {
    name: 'uploadFlag',
    label: '上传标记',
    comp: 'ever-select',
    props: {
      disabled: false,
      options: [
        { id: '1', name: '成功' },
        { id: '0', name: '失败' },
        { id: '2', name: '未上传' }
      ]
    }
  },
  {
    name: 'checkAccountFlag',
    label: '对账标志',
    comp: 'ever-select',
    props: {
      disabled: false,
      options: [
        { id: '1', name: '帐平' },
        { id: '0', name: '帐不平' }
      ]
    }
  }
]
export default {
  props: ['insuranceOrgId'],
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requestSwitch = true
    obj.settlePeriod = this.$moment(new Date()).format('YYYY-MM')
    return {
      querySchema: schema,
      queryObj: obj,
      loading: false,
      checkArr: []
    }
  },
  components: {
    medicalOrgList
  },
  async created () {
  },
  methods: {
    list () {
      this.loading = true
      let params = { pagesize: this.pagesize, offset: this.offset, ...this.queryObj, insuranceOrgId: this.insuranceOrgId }
      params.settlePeriod = params.settlePeriod ? this.$moment(params.settlePeriod).format('YYYY-MM').replace('-', '') : ''
      params.uploadFlag = params.uploadFlag ? Number(params.uploadFlag) : ''
      params.checkAccountFlag = params.checkAccountFlag ? Number(params.checkAccountFlag) : ''
      searchMedCheckAccount(params).then(rs => {
        this.loading = false
        this.tableData = rs.data
        this.totalCount = rs.totalCount
      })
    },
    upload (row) {
      let params = {}
      let infos = []
      if (!row) {
        infos = this.checkArr.map(item => { return { id: item.id, docNo: item.docNo, visitNumber: item.visitNumber, tradeType: item.tradeType } })
      } else {
        infos.push({ id: row.id, docNo: row.docNo, visitNumber: row.visitNumber, tradeType: row.tradeType })
      }
      params = {
        infos: infos,
        macId: this.macId,
        insuranceOrgId: this.insuranceOrgId
      }
      uploadMedCheckAccount(params).then(rs => {
        if (rs.head.errCode === 0 && rs.head.errMsg === 'Success') {
          this.$messageTips(this, 'success', '上传成功')
          this.list()
        } else {
          this.$messageTips(this, 'error', '上传失败')
        }
      })
    },
    handleSelectionChange (arr) {
      this.checkArr = arr
    }
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
</style>
