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
      fixed-elements="js-main-head js-title"
      :params.sync="queryObj"
      :columns="columns"
      @eventChange="eventChange">
      <template slot="sex" slot-scope="scope">
        <sys-value type="GBT.2261.1" :code="String(scope.row.sex)" v-if="scope.row.sex"></sys-value>
        <span v-else>--</span>
      </template>
    </ever-table>
    <refuse-dialog :visible.sync="dialogVisible" :command="curCommand" @submit="submit"></refuse-dialog>
  </div>
</template>
<script>

let borrowStatus = [
  {id: '1', name: '已申请'},
  {id: '2', name: '已借阅'},
  {id: '3', name: '已拒绝'},
  {id: '4', name: '已归还'},
]

import urlMap from '@/emr/urls'
import { request } from '@/util/req'
import refuseDialog from '@/medrecmanage/page/recordmanage/refuse.dialog'

export default {
  data () {
    let querySchema = [
      {
        name: 'patientName',
        label: '姓名',
      },
      {
        name: 'borrowerName',
        label: '借阅人',
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
    return {
      querySchema,
      queryObj,
      borrowStatus,
      columns: [],
      url: urlMap.borrow.queryBorrowing,
      dialogVisible: false,
      currentData: {},
      curCommand: '',
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
    // 通过
    async passEvent (data) {
      let res = await request(urlMap.borrow.adoptBorrowing, {id: data.id})
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '审核通过成功', '提示')
        this.list(true)
      }
    },
    // 拒绝
    refuseEvent (data) {
      this.dialogVisible = true
      this.currentData = data
      this.curCommand = '1'
    },
    // 强制归还
    returnback (data) {
      this.dialogVisible = true
      this.currentData = data
      this.curCommand = '2'
    },
    // 弹窗确认
    submit (method, data) {
      if (!method) return false
      this[method](data)
    },
    // 拒绝确认
    async refuseSubmit (data) {
      let params = {
        id: this.currentData.id,
        reasonsForRejection: data.reasonsForRejection
      }
      let res = await request(urlMap.borrow.refuseBorrowing, params)
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '拒绝申请成功', '提示')
        this.list(true)
      }
    },
    // 强制归还确认
    async backSubmit () {
      let res = await request(urlMap.borrow.returnBorrowing, {id: this.currentData.id})
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '强制归还成功', '提示')
        this.list(true)
      }
    },
    getColumns () {
      return [
        {
          prop: 'visitId',
          label: '住院号',
          width: 160,
        },
        {
          prop: 'patientName',
          label: '姓名',
          width: 100,
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
          width: 80,
        },
        {
          prop: 'admitDoctorName',
          label: '住院医师',
          width: 100,
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
          width: 100,
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
          prop: 'borrowingStatus',
          label: '借阅状态',
          width: 100,
          formatter ({ value }) {
            if (value) {
              return borrowStatus.find(v => v.id === String(value)).name || ''
            } else {
              return ''
            }
          },
        },
        {
          prop: 'reasonsForRejection',
          label: '拒绝原因',
          width: 150,
        },
        {
          prop: 'borrowerName',
          label: '借阅人',
          width: 100,
        },
        {
          prop: 'borrowingTime',
          label: '借阅日期',
          width: 160,
        },
        {
          prop: 'approverName',
          label: '审批人',
          width: 100,
        },
        {
          prop: 'approvalTime',
          label: '审批日期',
          width: 160,
        },
        {
          prop: 'returnName',
          label: '归还人',
          width: 100,
        },
        {
          prop: 'returnTime',
          label: '归还日期',
          width: 160,
        },
        {
          type: 'btns',
          label: '操作',
          fixed: 'right',
          width: 200,
          btns ({ row }) {
            return [
              ...(String(row.borrowingStatus) === '1' ? [{
                prop: 'passEvent',
                label: '通过',
              }] : []),
              ...(String(row.borrowingStatus) === '1' ? [{
                prop: 'refuseEvent',
                label: '拒绝',
              }] : []),
              ...(String(row.borrowingStatus) === '2' ? [{
                prop: 'returnback',
                label: '强制归还',
              }] : [])
            ]
          },
        },
      ]
    }
  },
  components: {
    refuseDialog
  }
}
</script>
<style scoped lang="less">
.layout_inner {
  width: auto;
}
</style>
