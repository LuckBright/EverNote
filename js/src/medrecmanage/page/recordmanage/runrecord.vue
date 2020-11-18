<template>
  <div class="layout_inner flex_column_full_hidden" style="box-sizing: border-box;">
    <div class="main-head">
      <run-record-query type="runRecord" @query="query"></run-record-query>
    </div>
    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      is-auto-height
      :fixed-height="50"
      @eventChange="eventChange">
      <template slot="sex">
        <el-table-column prop="sex" show-overflow-tooltip label="性别">
          <template slot-scope="scope">
            <template v-if="scope.row.sex || scope.row.sex === 0">
              <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
            </template>
            <template v-else>
              --
            </template>
          </template>
        </el-table-column>
      </template>
    </ever-table>
  </div>
</template>

<script>
  import list from '@/util/list'
  import runRecordQuery from '@/medrecmanage/components/runrecord.query'
  import {commandLog} from '@/phr/mixin/operationLog.js'

  export default {
    mixins: [list],
    data () {
      return {
        url: '/medical-record/doctor/recordManage/search',
        tableData: [],
        queryObj: {},
        allColumns: [
          {
            prop: 'visitId',
            label: '住院号',
            showOverflowTooltip: true
          },
          {
            prop: 'name',
            label: '姓名',
            showOverflowTooltip: true
          },
          {
            prop: 'sex',
            label: '性别',
            slotName: 'sex'
          },
          {
            prop: 'age',
            label: '年龄',
            width: '80',
            formatter ({value}) {
              return value || '--'
            }
          },
          {
            prop: 'identification',
            label: '身份证号'
          },
          {
            prop: 'admitDoctorName',
            label: '住院医师'
          },
          {
            prop: 'dptName',
            label: '科室'
          },
          {
            prop: 'admissionTime',
            label: '入院时间',
            showOverflowTooltip: true
          },
          {
            prop: 'dischargeTime',
            label: '出院时间',
            showOverflowTooltip: true
          },
          {
            prop: 'patientStatus',
            label: '状态',
            width: '80',
            formatter ({value}) {
              if (value === 1) {
                return '在院'
              } else if (value === 2) {
                return '出院'
              }
            }
          },
          {
            prop: 'ever-op', // 该列的唯一标示
            type: 'btns',
            label: '操作',
            width: '100',
            fixed: 'right',
            btns: [
              {
                prop: 'showRecord',
                label: '查看详情'
              }
            ]
          }
        ]
      }
    },
    mounted () {
      commandLog({
        content: '登录运行病历',
        opModuleOne: '病案管理-运行病历',
        opType: 'LOGIN'
      })
    },
    methods: {
      // 查询
      query (val) {
        this.queryObj = val
        this.list()
      },
      eventChange ({ prop, row }) {
        this[prop](row)
      },
      // 查看病历
      showRecord (data) {
        // 跳转至住院医生工作站的电子病历
        let _query = 'from=medicalReview&readonly=' + true + '&patientId=' + data.patientId + '&hospitalizedNumber=' + data.visitId + '&providerId=' + data.dptId
        let _url = this.$ever.hospitalIndex + '/resident/patientmgt/docs?' + _query
        window.open(_url, '_blank')
      }
    },
    components: {
      runRecordQuery
    }
  }
</script>
