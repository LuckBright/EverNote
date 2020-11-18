<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="dptId">
          <ever-subject-select type="select" v-model="queryObj.dptId" placeholder="科室" fields="id"></ever-subject-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :url="url"
      :max-height="maxHeight"
      fixed-elements="js-main-head js-title"
      :params.sync="queryObj"
      :columns="columns"
      @eventChange="eventChange">
      <template slot="sex" slot-scope="scope">
        <sys-value type="GBT.2261.1" :code="String(scope.row.sex)" v-if="scope.row.sex"></sys-value>
        <span v-else>--</span>
      </template>
    </ever-table>
  </div>
</template>
<script>
import maxHeight from './maxheight.js'
let borrowStatus = [
  {id: '1', name: '已申请'},
  {id: '2', name: '已借阅'},
  {id: '3', name: '已拒绝'},
  {id: '4', name: '已归还'},
]

import urlMap from '@/emr/urls'
import { request } from '@/util/req'
export default {
  mixins: [maxHeight],
  data () {
    let querySchema = [
      {
        name: 'patientName',
        label: '患者姓名',
      },
      {
        name: 'borrowingStatus',
        label: '借阅状态',
        comp: 'sys-select',
        props: {
          options: [],
          clearable: true
        },
      },
      {
        name: 'visitId',
        label: '住院号',
      },
      {
        name: 'dptId',
        label: '科室',
        comp: 'custom'
      },
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.borrowerId = this.$store.state.currentUser.userId
    return {
      querySchema,
      queryObj,
      borrowStatus,
      columns: [],
      url: urlMap.borrow.queryBorrowing,
      dialogVisible: false,
      currentData: {}
    }
  },
  created () {
    this.columns = this.getColumns()
  },
  mounted () {
    this.$ever.getFieldFromSchema(this.querySchema, 'borrowingStatus').props.options = this.borrowStatus
    this.list(false)
  },
  methods: {
    list (searchFirstPage = true) {
      this.$refs.table.list(searchFirstPage)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    showDetail (data) {
      let routeNames = {
        doc_recordborrow: 'medicalRecordDetailForDoctor',
        nur_recordborrow: 'medicalRecordDetailForNurse'
      }
      let query = {
        patientId: data.patientId,
        visitNumber: data.visitId,
        providerId: data.dptId,
        patientName: data.patientName,
        from: 'medicalBorrow'
      }
      this.$router.push({name: routeNames[this.$route.name], query})
    },
    // 归还
    async del (data) {
      let res = await request(urlMap.borrow.returnBorrowing, {id: data.id})
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '病历归还成功', '提示')
        this.list(true)
      }
    },
    getColumns () {
      return [
        {
          prop: 'applicationTime',
          label: '申请时间',
          width: 160,
        },
        {
          prop: 'borrowingMethod',
          label: '借阅方式',
          width: 120,
          formatter ({ value }) {
            if (String(value) === '1') {
              return '人工审核'
            } else if (String(value) === '2') {
              return '自动审核'
            } else {
              return ''
            }
          }
        },
        {
          prop: 'borrowingStatus',
          label: '借阅状态',
          width: 120,
          formatter ({ value }) {
            if (value) {
              return borrowStatus.find(v => v.id === String(value)).name || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'visitId',
          label: '住院号',
          width: 200,
        },
        {
          prop: 'patientName',
          label: '姓名',
          width: 150,
        },
        {
          slot: 'sex',
          prop: 'sex',
          label: '性别',
          width: 100,
        },
        {
          prop: 'age',
          label: '年龄',
          width: 100,
        },
        {
          prop: 'admitDoctorName',
          label: '住院医师',
          width: 120,
        },
        {
          prop: 'admissionTime',
          label: '入院时间',
          width: 160,
        },
        {
          prop: 'dischargeTime',
          label: '出院时间',
          width: 160,
        },
        {
          prop: 'dptName',
          label: '科室',
          width: 120
        },
        {
          prop: 'borrowingPurpose',
          label: '借阅目的',
          showOverflowTooltip: true,
          width: 150,
        },
        {
          prop: 'borrowingPeriod',
          label: '借阅期限',
          width: 120,
          formatter ({ value }) {
            return value ? value + '天' : '--'
          }
        },
        {
          prop: 'reasonsForRejection',
          label: '拒绝原因',
          showOverflowTooltip: true,
          width: 150,
        },
        {
          type: 'btns',
          label: '操作',
          fixed: 'right',
          width: 180,
          btns ({ row }) {
            return [
              ...(String(row.borrowingStatus) === '2' ? [{
                prop: 'showDetail',
                label: '查看详情',
              }] : []),
              ...(String(row.borrowingStatus) === '2' ? [{
                prop: 'del',
                label: '归还',
                desc: '您确定要执行归还操作吗？'
              }] : [])
            ]
          },
        },
      ]
    }
  },
  components: {
  }
}
</script>
<style scoped lang="less">
</style>
