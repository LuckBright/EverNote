<template>
  <div class="plan">
     <ever-form2
      :schema="schema"
      v-model="queryobj"
      label-position="right"
      :nosubmit="true"
      labelWidth="80px"
      :inline='true'
    >
     <template slot="serviceId">
        <el-select clearable filterable remote v-model="queryobj.serviceId" placeholder="手术"   :remote-method="queryService" :loading="ssloading">
          <el-option
          v-for="item in ssoptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="btn">
        <el-button type="primary" @click="getSurgeryTaskList(true)">查找手术</el-button>
      </template>
    </ever-form2>
    <ever-table
      ref='multipleTableRef'
      table-class="flex_layout_scroll patient-queue"
      :data="list"
      :table-loading="loading"
      :columns="columns"
      :isAutoCheckRow='false'
      :isRecordUrlParams='false'
      :notSelectCheckbox='true'
      @row-dblclick="rowClick"
      :config-option="configOption"
      >
      <template slot="emergencyLevel" slot-scope="scope">
        <span :class="scope.row.emergencyLevel == 3 ? 'redC' :''"><sys-value type="THC_CPOE_SSJJJB" :code="scope.row.emergencyLevel"></sys-value></span>
      </template>
      <template slot="anaesthesiaType" slot-scope="scope">
        <sys-value type="CV06.00.103" :code="scope.row.anaesthesiaType"></sys-value>
      </template>
      <template slot="visitType" slot-scope="scope">
       <span>{{scope.row.visitType ==1 ? '门诊' : scope.row.visitType ==2 ? '急诊': '住院'}}</span>
      </template>
      <template slot='patientName' slot-scope="scope">
        <a :href='`${$ever.crmIndex}/crm/memberinfo/userinfo/memberbaseinfo/${scope.row.patientId}`' target="_blank">{{scope.row.patientName}}</a>&nbsp;
        {{scope.row.sex | formatSex}}&nbsp;
        {{scope.row.ageShowText || '--'}}
      </template>
       <template slot="surgeryStatus" slot-scope="scope">
       <span>{{surgeryStatus(scope.row.surgeryStatus)}}</span>
      </template>
    </ever-table>
    <ever-pagination
      @current-change="handleSizeChange"
      :totalCount="totalCounts"
      :small='true'
      :pager-count="5"
      :pagesize="pagesize"
      :current='currentPage'
      layout="prev, pager, next"
    ></ever-pagination>
    <addcsa ref='addcsa'  @success='getSurgeryTaskList'></addcsa>
  </div>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import { CSA_PLAN_LIST } from '@/util/table-config'
import { isJsonString } from '@/util/common'
import { CSA_STATUS } from '@/csa/store/csa.js'
import addcsa from '@/csa/components/addcsa.vue'
let schema = [
  {
    name: 'patientId',
    label: '患者姓名',
    comp: 'ever-patient-select',
    props: {
      useText: false,
      allowCreate: false,
    }
  },
  {
    name: 'serviceId',
    comp: 'custom',
    label: '手术名称'
  },
  {
    name: 'providerId',
    label: '来源科室',
    comp: 'ever-select',
    props: {
      placeholder: '来源科室',
      options: [],
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'operatorDoctorId',
    label: '主刀医生',
    comp: 'ever-select',
    props: {
      placeholder: '请选择',
      options: [],
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'anaesthesiaDoctorId',
    label: '麻醉医生',
    comp: 'ever-select',
    props: {
      placeholder: '请选择',
      options: [],
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'applyTime',
    label: '申请时间',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  {
    name: 'dateTimes',
    label: '安排时间',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  {
    name: 'executeStatusList',
    label: '安排状态 ',
    comp: 'ever-select',
    props: {
      placeholder: '全部状态',
      options: [
        { id: '[10]', name: '待安排' },
        { id: '[20,30]', name: '已安排' },
      ]
    }
  },
  {
    name: 'surgeryStatus',
    label: '手术状态 ',
    comp: 'ever-select',
    props: {
      placeholder: '全部状态',
      options: CSA_STATUS
    }
  },
  {
    name: 'visitType',
    label: '患者来源 ',
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
    slot: 'emergencyLevel',
    prop: 'emergencyLevel',
    label: '紧急',
  }, {
    prop: 'applyTime',
    label: '申请时间'
  }, {
    prop: 'serviceName',
    label: '拟施手术'
  }, {
    slot: 'anaesthesiaType',
    prop: 'anaesthesiaType',
    label: '拟施麻醉'
  }, {
    slot: 'visitType',
    prop: 'visitType',
    label: '来源',
  }, {
    prop: 'providerName',
    label: '来源科室',
  }, {
    prop: 'doctorName',
    label: '开嘱医生',
  }, {
    prop: 'surgeryPlanTime',
    label: '拟手术日期'
  }, {
    prop: 'executeStatusStr',
    label: '安排状态'
  }, {
    slot: 'surgeryStatus',
    prop: 'surgeryStatus',
    label: '手术状态'
  }, {
    prop: 'appointmentDateStr',
    label: '安排时间',
  }, {
    slot: 'patientName',
    prop: 'patientName',
    label: '患者信息',
  }, {
    prop: 'actualExecuteProviderName',
    label: '执行科室',
  }, {
    prop: 'surgeryRoomName',
    label: '手术间号'
  // }, {
  //   prop: 'surgeryNumber',
  //   label: '台次'
  }, {
    prop: 'operatorDoctorName',
    label: '主刀医生',
  }, {
    prop: 'anaesthesiaDoctorName',
    label: '主麻医生'
  }, {
    prop: 'assistantDoctorsStr',
    label: '助手医生',
  }, {
    prop: 'anaesthesiaAssistantsStr',
    label: '辅麻医生'
  }, {
    prop: 'scrubNursesStr',
    label: '洗手护士'
  }, {
    prop: 'circulateNursesStr',
    label: '巡回护士'
  }]
export default {
  components: {
    addcsa
  },
  data () {
    let queryobj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      ssloading: false,
      ssoptions: [],
      queryobj,
      schema,
      columns,
      list: [],
      loading: true,
      configOption: {id: CSA_PLAN_LIST},
      totalCounts: 0,
      pagesize: 20,
      currentPage: 1
    }
  },
  created () {
  },
  mounted () {
    this.loading = false
    this.init()
    this.getSurgeryTaskList()
  },
  methods: {
    surgeryStatus (status) {
      let str = ''
      CSA_STATUS.forEach(ele => {
        if (ele.id === String(status))str = ele.name
      })
      return str
    },
    async queryService (name = '') {
      this.ssloading = true
      let res = await this.api.queryService({
        name,
        'filterServiceClassificationList': [],
        'serviceClassificationList': ['2125'],
        'isAdviceList': [11, 1],
        'isValid': 1,
        'usePermission': 1,
        'offset': 0,
        'pagesize': 100}
      )
      this.ssloading = false
      this.ssoptions = res.data
    },
    handleSizeChange (val) {
      this.currentPage = val
      this.getSurgeryTaskList()
    },
    rowClick ({row}) {
      // 执行单 10 20
      // 手术单状态 10 null
      if ((row.executeStatus === 10 || row.executeStatus === 20) && (row.surgeryStatus === null || row.surgeryStatus === 10)) {
        this.$refs.addcsa.open(row)
      }
    },
    async getSurgeryTaskList (flag) {
      if (flag) this.currentPage = 1
      let obj = JSON.parse(JSON.stringify(this.queryobj))
      obj.pagesize = this.pagesize
      obj.offset = (this.currentPage - 1) * this.pagesize
      if (this.queryobj.applyTime) {
        obj.applyStartTime = this.queryobj.applyTime[0] + ' 00:00:00'
        obj.applyEndTime = this.queryobj.applyTime[1] + ' 23:59:59'
      }
      if (this.queryobj.dateTimes) {
        obj.appointmentStartTime = this.queryobj.dateTimes[0] + ' 00:00:00'
        obj.appointmentEndTime = this.queryobj.dateTimes[1] + ' 23:59:59'
      }
      if (obj.executeStatusList)obj.executeStatusList = JSON.parse(obj.executeStatusList)
      else obj.executeStatusList = null
      let res = await this.api.getSurgeryTaskList(obj)
      let list = res.data || []
      list.forEach(element => {
        let patient = element.patientDto || {}
        element.ageShowText = patient.ageShowText
        element.sex = patient.sex
        element.birthday = patient.birthday
        if (element.applyTime)element.applyTime = this.$moment(element.applyTime).format('YYYY-MM-DD HH:mm')
        if (element.surgeryPlanTime)element.surgeryPlanTime = this.$moment(element.surgeryPlanTime).format('YYYY-MM-DD HH:mm')
        if (element.appointmentDate)element.appointmentDateStr = this.$moment(element.appointmentDate).format('YYYY-MM-DD')
        if (element.appointmentTime)element.appointmentDateStr += '  ' + element.appointmentTime
        if (element.executeStatus && element.executeStatus === 10) element.executeStatusStr = '待安排'
        else if (element.executeStatus) element.executeStatusStr = '已安排'
        let surgeryJson = element.surgeryJson || {}
        let array = ['assistantDoctors', 'anaesthesiaAssistants', 'scrubNurses', 'circulateNurses']
        array.forEach(item => {
          if (isJsonString(surgeryJson[item])) {
            let li = JSON.parse(surgeryJson[item]) || {}
            let arr = []
            let strArr = []
            li.forEach(ele => {
              arr.push(ele.id)
              strArr.push(ele.name)
            })
            element[item] = arr
            element[`${item}Str`] = strArr.join(',')
          }
        })
      })
      this.list = list
      this.totalCounts = res.totalCount || 0
    },
    async init () {
      this.queryobj.applyTime = [this.$moment(Date.now() - (2 * 24 * 3600 * 1000)).format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      this.api.getTenantSubjectListByCondition({
        // type2CodeList: ['02.04'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        status: 'Y',
        usePermissionStatus: 'Y'
      }).then(res => {
        if (res.data && res.data.resultList) {
          let arr = res.data.resultList.map(item => {
            return {
              id: item.tenantSubjectCode,
              name: item.tenantSubjectName
            }
          })
          this.$ever.getFieldFromSchema(this.schema, 'providerId').props.options = arr
        }
      })
      this.api.getStaffListByCondition({
        // tenantSubjectType2CodeList: ['02.04'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['DOCTOR']
      }).then(res => {
        if (res.data && res.data.resultList) {
          let arr = res.data.resultList || []
          this.$ever.getFieldFromSchema(this.schema, 'operatorDoctorId').props.options = arr
        }
      })
      this.api.getStaffListByCondition({
        baseStaffPermission2CodeList: ['01.03'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['DOCTOR']
      }).then(res => {
        if (res.data && res.data.resultList) {
          let arr = res.data.resultList || []
          this.$ever.getFieldFromSchema(this.schema, 'anaesthesiaDoctorId').props.options = arr
        }
      })
    }
  },
}
</script>
<style lang="scss" scope>
.plan {
  .redC{
    color: #D90000;
  }
}
</style>
