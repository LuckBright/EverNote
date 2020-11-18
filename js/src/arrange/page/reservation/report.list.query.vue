<template>
  <div class="report">
    <el-row>
      <el-col :span="24">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          @query="query"
          ref="form"
        >
          <template slot="doctorId">
            <el-select
              v-model="queryObj.doctorId"
              filterable
              :placeholder="'请选择'"
              :clearable="true"
            >
              <el-option
                v-for="item in doctorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </ever-form2>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['serviceType', 'doctorOptions', 'orgOptions'],
  data () {
    let schema = [
      {
        name: 'taskTime',
        label: '申请日期',
        comp: 'everRangePicker'
      },
      {
        name: 'taskTime1',
        label: '报告日期',
        comp: 'everRangePicker'
      },
      // {
      //   name: 'status',
      //   label: '检验状态',
      //   comp: 'el-select',
      //   props: {
      //     options: [
      //       {
      //         id: '10',
      //         name: '待执行'
      //       },
      //       {
      //         id: '20',
      //         name: '执行中'
      //       },
      //       {
      //         id: '30',
      //         name: '已完成'
      //       },
      //       {
      //         id: '40',
      //         name: '已取消'
      //       }
      //     ]
      //   }
      // },
      {
        name: 'patientId',
        label: '患者姓名',
        comp: 'ever-patient-select'
      },
      {
        name: 'doctorId',
        label: '申请医生',
        comp: 'ever-staff-select'
      },
      {
        name: 'providerId',
        label: '申请科室',
        comp: 'ever-subject-select',
        props: {
          fields: 'orgSubjectCode',
          clearable: true
        }
      },
      {
        name: 'orgId',
        label: '申请机构',
        comp: 'ever-org-select',
        props: {
          fields: 'code'
        }
      }
    ]
    // if (this.serviceType === '800') {
    //   schema[2].label = '检查状态'
    // }
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.status = '60'
    queryObj.applyStartTime = ''
    queryObj.applyEndTime = ''
    queryObj.reportStartTime = ''
    queryObj.reportEndTime = ''
    queryObj.serviceType = this.serviceType
    queryObj.requestSwitch = true
    queryObj.doctorId = ''
    return {
      schema,
      queryObj,
    }
  },
  watch: {
    'queryObj.doctorId' (val) {
      this.query()
    }
  },
  created () {

  },
  mounted () {
    this.query()
  },
  methods: {
    query () {
      this.queryObj.applyStartTime = ''
      this.queryObj.applyEndTime = ''
      this.queryObj.reportStartTime = ''
      this.queryObj.reportEndTime = ''
      if (this.queryObj.taskTime) {
        if (this.queryObj.taskTime[0]) this.queryObj.applyStartTime = this.queryObj.taskTime[0] + ' 00:00:00'
        if (this.queryObj.taskTime[1]) this.queryObj.applyEndTime = this.queryObj.taskTime[1] + ' 23:59:59'
      }
      if (this.queryObj.taskTime1) {
        if (this.queryObj.taskTime1[0]) this.queryObj.reportStartTime = this.queryObj.taskTime1[0] + ' 00:00:00'
        if (this.queryObj.taskTime1[1]) this.queryObj.reportEndTime = this.queryObj.taskTime1[1] + ' 23:59:59'
      }
      this.$emit('list', this.queryObj)
    },
  },
  components: {
  },
  filters: {
  }
}
</script>

