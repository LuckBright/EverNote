<template>
  <div class="csa_patient_list">
     <ever-form2
      :schema="schema"
      v-model="queryobj"
      label-position="right"
      :nosubmit="true"
      labelWidth="0px"
      class="form2"
    >
      <template slot="btn">
        <el-button type="primary" @click="getSurgeryExecuteList(true)">查找</el-button>
      </template>
    </ever-form2>
    <ever-table
      ref='multipleTableRef'
      table-class="flex_layout_scroll patient-queue"
      :data="list"
      :table-loading="loading"
      :columns="columns"
       :row-class-name="rowClassName"
      :isAutoCheckRow='false'
      :isRecordUrlParams='false'
      :notSelectCheckbox='true'
      :config-option="configOption"
      @row-click='rowClick'
      >
      <template slot="visitType" slot-scope="scope">
       <span>{{scope.row.visitType ==1 ? '门诊' : scope.row.visitType ==2 ? '急诊': '住院'}}</span>
      </template>
       <template slot="surgeryStatus" slot-scope="scope">
       <span>{{surgeryStatus(scope.row.surgeryStatus)}}</span>
      </template>
    </ever-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleSizeChange"
      :totalCount="totalCounts"
      :small='true'
      :pager-count="5"
      :pagesize="pagesize"
      :current='currentPage'
      layout="prev, pager, next"
    ></ever-pagination>
    <dialogs ref='dialog' @success='success'></dialogs>
    <contextmenu className='csalistrow' @menu='menuClick' :menu='menu' @select='select'></contextmenu>
  </div>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import contextmenu from '@/workspace/components/contextmenu.vue'
import { CSA_SHOW_LIST } from '@/util/table-config'
import { CSA_STATUS } from '@/csa/store/csa.js'
import dialogs from '@/csa/components/dialog.vue'
import moment from 'moment'
let schema = [
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    props: {
      useText: false,
      allowCreate: false,
    }
  },
  {
    name: 'dateTimes',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  {
    name: 'surgeryStatusList',
    comp: 'ever-select',
    props: {
      class: 'status',
      placeholder: '全部状态',
      options: CSA_STATUS
    }
  },
  {
    name: 'visitTypes',
    comp: 'ever-select',
    props: {
      placeholder: '全部来源',
      options: [
        { id: '1', name: '门诊' },
        { id: '3', name: '住院' },
      ]
    }
  },
  {
    name: 'btn',
    comp: 'custom',
  },
]
let columns = [
  {
    slot: 'surgeryStatus',
    prop: 'surgeryStatus',
    label: '状态',
  }, {
    slot: 'visitType',
    prop: 'visitType',
    label: '来源',
  }, {
    prop: 'patientName',
    label: '姓名',
  }, {
    prop: 'serviceName',
    label: '手术名称',
  }, {
    prop: 'appointmentDateStr',
    label: '安排时间',
  }, {
    prop: 'surgeryRoomName',
    label: '手术间',
  // }, {
  //   prop: 'surgeryNumber',
  //   label: '台次',
  }
]
export default {
  components: {contextmenu, dialogs},
  props: ['space'],
  data () {
    let queryobj = this.$ever.createObjFromSchema(schema)
    queryobj.dateTimes = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    return {
      api,
      queryobj,
      schema,
      columns,
      list: [],
      loading: true,
      configOption: {id: CSA_SHOW_LIST},
      totalCounts: 0,
      pagesize: 20,
      currentPage: 1,
      menu: [],
      adviceId: '',
      index: '',
      providerId: ''
    }
  },

  mounted () {
    if (localStorage.getItem('csa_value')) {
      let obj = JSON.parse(localStorage.getItem('csa_value'))
      this.providerId = obj.id
    }
    this.getSurgeryExecuteList()
  },
  methods: {
    success () {
      this.$emit('success')
      this.getSurgeryExecuteList()
    },
    surgeryStatus (status) {
      let str = ''
      CSA_STATUS.forEach(ele => {
        if (ele.id === String(status))str = ele.name
      })
      return str
    },
    async getSurgeryExecuteList (flag) {
      if (flag) this.currentPage = 1
      let obj = {
        offset: (this.currentPage - 1) * this.pagesize,
        pagesize: this.pagesize,
        // ...this.queryobj,
        providerId: this.providerId
      }
      if (this.queryobj.dateTimes && this.queryobj.dateTimes.length > 1) {
        obj.appointmentStartTime = this.queryobj.dateTimes[0] + ' 00:00:00'
        obj.appointmentEndTime = this.queryobj.dateTimes[1] + ' 23:59:59'
      }
      if (this.queryobj.visitTypes)obj.visitTypes = [this.queryobj.visitTypes]
      if (this.queryobj.surgeryStatusList) obj.surgeryStatusList = [this.queryobj.surgeryStatusList]
      if (this.queryobj.patientId)obj.patientId = this.queryobj.patientId
      this.loading = true
      let res = await this.api.getSurgeryExecuteList(obj)
      this.loading = false
      let list = res.data || []
      list.forEach(element => {
        if (element.appointmentDate)element.appointmentDateStr = this.$moment(element.appointmentDate).format('YYYY-MM-DD')
        if (element.appointmentTime)element.appointmentDateStr += '  ' + element.appointmentTime
      })
      this.list = list
      this.totalCounts = res.totalCount
    },
    rowClick ({row}) {
      let query = {
        id: row.id,
        patientId: row.patientId,
        patientName: row.patientName,
        providerId: row.providerId,
        adviceId: row.adviceId,
        executeId: row.executeId,
        visitType: row.visitType,
        serviceId: row.serviceId,
        surgeryStatus: row.surgeryStatus,
        surgeryRoomId: row.surgeryRoomId
      }
      if (String(row.visitType) === '1') query.visitNumber = row.visitNumber
      else if (String(row.visitType) === '3') query.hospitalizedNumber = row.visitNumber
      this.$router.push({
        path: `/csa/${this.space}/index`,
        query
      })
    },
    rowClassName ({row}) {
      let id = this.adviceId
      if (id === row.adviceId) {
        return 'patient-active csalistrow'
      }
      return 'csalistrow'
    },
    handleSizeChange (val) {
      this.currentPage = val
      this.getSurgeryExecuteList()
    },
    menuClick (index) {
      let item = this.list[index]
      this.index = index
      let status = Number(item.surgeryStatus)
      this.menu = [{name: '无操作', id: 'null', disabled: true}]
      if (status === 70) return
      if (this.space === 'nurse') {
        if (status === 10) this.menu = [{name: '患者接收', id: 'RECEIPT_PATIENT', disabled: false}]
        else if (status === 20) {
          this.menu = [
          {name: '入手术间', id: 'ENTER_SURGERY_ROOM', disabled: false},
          {name: '取消接收', id: 'CANCEL_RECEIPT_PATIENT', disabled: false}
          ]
        } else if (status === 30) {
          this.menu = [
          {name: '出手术间', id: 'LEAVE_SURGERY_ROOM', disabled: false},
          {name: '取消入手术间', id: 'CANCEL_ENTER_SURGERY_ROOM', disabled: false}
          ]
        } else if (status === 50) {
          this.menu = [
          {name: '入复苏室', id: 'ENTER_RESUSCITATION_ROOM', disabled: false},
          {name: '取消出手术间', id: 'CANCEL_LEAVE_SURGERY_ROOM', disabled: false}
          ]
        } else if (status === 60) {
          this.menu = [
          {name: '出复苏室', id: 'LEAVE_RESUSCITATION_ROOM', disabled: false},
          {name: '取消入复苏室', id: 'CANCEL_ENTER_RESUSCITATION_ROOM', disabled: false}
          ]
        } else if (status === 40) {
          this.menu = [
          {name: '手术完成', id: 'EXECUTE', disabled: false},
          {name: '术后撤销', id: 'CANCEL_SURGERY', disabled: false},
          // {name: '取消出复苏室', id: 'CANCEL_LEAVE_RESUSCITATION_ROOM', disabled: false},
          // {name: '取消出手术间', id: 'CANCEL_LEAVE_SURGERY_ROOM', disabled: false}
          ]
        } else if (status === 80) this.menu = [{name: '取消完成', id: 'CANCEL_EXECUTE'}]
      } else if (this.space === 'anesthetist') {
        if (status === 10) this.menu = [{name: '拒绝手术', id: 'REJECT'}]
        else if (status === 40) this.menu = [{name: '完成手术', id: 'EXECUTE'}]
        else if (status === 80) this.menu = [{name: '取消完成', id: 'CANCEL_EXECUTE'}]
      }
    },
    select ({name, api, id}) {
      let row = this.list[this.index]
      if (['RECEIPT_PATIENT', 'ENTER_SURGERY_ROOM', 'LEAVE_SURGERY_ROOM', 'ENTER_RESUSCITATION_ROOM', 'LEAVE_RESUSCITATION_ROOM', 'REJECT', 'CANCEL_SURGERY'].includes(id)) {
        this.$refs.dialog.open(row, id)
      } else {
        this.$confirm(`确认要将患者${row.patientName}${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.api.handover({
            executeId: row.executeId,
            adviceId: row.adviceId,
            operateCode: id,
          })
          if (res && res.head && res.head.errCode === 0) {
            this.$message({
              type: 'success',
              message: `${name}成功!`
            })
            setTimeout(_ => {
              this.success()
            }, 500)
          }
        }).catch(() => {
          setTimeout(_ => {
            this.success()
          }, 500)
        })
      }
    }
  },
}
</script>
<style lang="scss" scope>
.csa_patient_list {
  box-sizing: border-box;
  // border-right: 1px solid #ccc;
  overflow: hidden;
  overflow-y: auto;
  background-color: #fff;
  .patient-active {
    background-color: #1c7bef;
    color: #fff;
    &:hover {
      color: inherit;
    }
  }
  /deep/ .el-form{
    padding: 10px;
  }
  /deep/  .el-input, 
  /deep/ .el-input__inner{
    width: 100%;
  }
  .form2{
    /deep/ .el-col-24{
      &:nth-child(3), &:nth-child(4){
        width: calc(50% - 33px);
        margin-right: 5px;
      }
      &:nth-child(5){
        width: 56px;
      }
    }
  }
}
</style>
