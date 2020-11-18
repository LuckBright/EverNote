<template>
  <div id="appointlist">
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      ref="form"
      :inline="true"
      :rules="rules"
      :is-query="true"
      v-ever-bind-enter
      @query="list(true)"
    >
      <template slot="daterange">
        <ever-range-picker :start.sync="queryObj.startDate" :end.sync="queryObj.endDate"></ever-range-picker>
      </template>
      <template slot="resourceId">
        <ever-staff-select ref="ess" placeholder="医生" v-model="queryObj.resourceId" :params="paramsDoctor" fields="id" :disabled="disabledstaff"></ever-staff-select>
      </template>
    </ever-form2>
    <ever-table
      :columns="columns"
      :data="tableData"
      @eventChange="eventChange"
      table-default-cell-value="-"
      :is-record-url-params="false"
    >
    </ever-table>
    <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import list from '@/util/list'
// import storage from '@/util/storage'
import { APPOINT_STATUS_ARRAY, ageShow } from '@/util/common'
import moment from 'moment'
import { tableColWidth } from '@/util/table-config'
import SourceCascader from '@/crm/components/sourcecascader'
import { STAFF_TYPE } from '@/crm/util/common'
let querySchema = [
  {
    name: 'deptId',
    label: '科室',
    comp: 'ever-subject-select',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 12
  },
  {
    name: 'resourceId',
    label: '医生',
    comp: 'custom'
  },
  {
    name: 'channelId',
    label: '来源',
    comp: SourceCascader,
    props: {
      placeholder: '来源'
    }
  },
  {
    name: 'daterange',
    label: '日期',
    comp: 'custom'
  },
  {
    name: 'appointmentState',
    label: '状态',
    comp: 'ever-select',
    props: {
      options: APPOINT_STATUS_ARRAY,
      placeholder: '状态'
    }
  },
  {
    name: 'isUnusualStatus',
    label: '',
    comp: 'ever-select',
    props: {
      options: [{ id: '', name: '全部' }, { id: '1', name: '异常' }],
      placeholder: ''
    }
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.patientId = this.$route.params.patientId
    queryObj.apptType = 2
    queryObj.startDate = this.$moment().format('YYYY-MM-DD')
    queryObj.endDate = this.$moment().format('YYYY-MM-DD')
    return {
      api,
      listApiName: 'getNumberList',
      querySchema,
      queryObj,
      rules: {},
      paramsDoctor: {},
      disabledstaff: true,
      // clinicId: storage.getStorageByClinic('CLINICID') || '',
      columns: [
        {
          prop: 'patient',
          label: '姓名',
          formatter ({value}) {
            if (value) return value.name || ''
          }
        },
        {
          prop: 'patient',
          label: '性别',
          width: tableColWidth.name3W65,
          beforeHtmlFormatter: ({ row }) => {
            return row.patient && row.patient.sex ? `<span>${this.$filters.formatSex(row.patient.sex)}</span>` : ' '
          },
          formatter: ({ row }) => ' '
        },
        {
          prop: 'patient',
          label: '年龄',
          width: tableColWidth.name4W80,
          beforeHtmlFormatter: ({ row }) => {
            return row.patient && row.patient.birthday ? `<span>${ageShow(row.patient)}</span>` : ' '
          },
          formatter: ({ row }) => ' '
        },
        {
          prop: 'patient',
          label: '手机号码',
          width: tableColWidth.phoneW115,
          formatter ({value}) {
            if (value) return value.mobile || ''
          }
        },
        {
          prop: 'channelName',
          label: '来源'
        },
        {
          prop: 'date',
          label: '预约日期',
          width: tableColWidth.dateW105,
          formatter ({value}) {
            return value && moment(value).format('YYYY-MM-DD')
          }
        },
        {
          prop: 'startTimeStr',
          label: '时间',
          width: tableColWidth.name4W80
        },
        {
          prop: 'deptName',
          label: '科室',
          width: tableColWidth.name5W90
        },
        {
          prop: 'resourceName',
          label: '医生',
          width: tableColWidth.name5W90
        },
        {
          prop: 'serviceName',
          label: '服务'
        },
        {
          prop: 'symptom',
          label: '备注'
        }
      ]
    }
  },
  methods: {
    eventChange ({btnType, col, row}) {
      console.log(btnType, col, row)
    }
  },
  watch: {
    'queryObj.deptId' (val) {
      this.queryObj.resourceId = ''
      if (val) {
        this.paramsDoctor = {
          tenantSubjectIdList: [val],
          everQueryType: 'out',
          typeCodeList: [STAFF_TYPE[0].id]
        }
        this.disabledstaff = false
      } else {
        this.disabledstaff = true
      }
    }
  },
  components: {
    SourceCascader
  }
}
</script>

