<template>
  <div class="layout_inner flex_column_full_hidden" style="box-sizing: border-box;">
    <!-- 查询 -->
    <div class="main-head">
      <run-record-query ref="query" @query="query" @archive="archive" @sync-data="syncData"></run-record-query>
    </div>
    <!-- 列表 -->
    <ever-table
      ref="table"
      :show-checkbox="showCheckbox"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :fixed-height="50"
      is-auto-height
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
  import api from '@/medrecmanage/store/caserecordmanageapi.js'
  import runRecordQuery from '@/medrecmanage/components/runrecord.query'
  import operationLog, {commandLog} from '@/phr/mixin/operationLog.js'

  export default {
    mixins: [list],
    data () {
      return {
        showCheckbox: true,
        url: '/medical-record/doctor/recordManage/search',
        tableData: [],
        queryObj: {
          patientStatus: '2'
        },
        listApiName: 'recordManage',
        operationLogData: [],
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
            prop: 'primaryNurseName',
            label: '责任护士'
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
            prop: 'lockTime',
            label: '归档时间',
            showOverflowTooltip: true
          },
          {
            prop: 'lockType',
            label: '归档方式',
            width: '80',
            formatter ({value}) {
              if (value === 1) {
                return '自动'
              } else if (value === 2) {
                return '手动'
              }
            }
          },
          {
            prop: 'opStatus',
            label: '状态',
            width: '80',
            formatter ({value}) {
              if (value === 0) {
                return '未归档'
              } else {
                return '已归档'
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
    created () {
      commandLog({
        content: '登录病历归档',
        opModuleOne: '病案管理-病历归档',
        opType: 'LOGIN'
      })
    },
    methods: {
      // 查询
      query (val) {
        this.showCheckbox = val.opStatus !== '1'
        this.queryObj = val
        // 设置默认查询已出院的病历
        this.queryObj.patientStatus = '2'
        this.list()
      },
      eventChange ({ prop, row }) {
        this[prop](row)
      },
      // 查看病历
      showRecord (data) {
        let routeNames = {
          doctor_archive: 'medicalRecordDetailForDoctor',
          nurse_archive: 'medicalRecordDetailForNurse'
        }
        // console.log(this.$route, 'route')
        let query = {
          patientId: data.patientId,
          visitNumber: data.visitId,
          providerId: data.dptId,
          patientName: data.name,
          from: 'medicalArchive'
        }
        this.$router.push({name: routeNames['doctor_archive'], query})
        // 跳转至住院医生工作站的电子病历
        // let _query = 'from=medicalReview&readonly=' + true + '&patientId=' + data.patientId + '&hospitalizedNumber=' + data.visitId + '&providerId=' + data.dptId
        // let _url = this.$ever.hospitalIndex + '/resident/patientmgt/docs?' + _query
        // window.open(_url, '_blank')
      },
      // 归档
      archive () {
        // 只可以对 出院并且未归档的数据进行归档操作
        let ids = []
        this.operationLogData = []
        let selection = this.$refs.table.multipleSelection
        for (let i = 0; i < selection.length; i++) {
          let cur = selection[i]
          if (cur.patientStatus === 2 && cur.opStatus === 0) {
            ids.push(cur.id)
            this.operationLogData.push({
              content: '手动归档',
              opModuleOne: '病案管理-病历归档',
              opType: 1400,
              visitNumber: selection[i].visitId,
              patientId: selection[i].patientId,
              patientName: selection[i].name
            })
          } else {
            ids = []
            break
          }
        }
        if (ids.length === 0) {
          this.$notify({
            title: '警告',
            message: '请选择未归档的病历！',
            type: 'warning'
          })
          return
        }
        let param = {
          ids,
          lockType: '2'
        }
        api.recordManageLock(param).then(res => {
          if (res.head.errCode === 0) {
            // 归档成功
            this.$notify({
              title: '成功',
              message: '归档成功!',
              type: 'success'
            })
            operationLog(this.operationLogData, true)
            this.$refs.query.search()
          }
        })
      },
      syncData () {
        api.syncData(this.queryObj).then(res => {
          if (res.head.errCode === 0) {
            this.$notify({
              title: '成功',
              message: '同步成功!',
              type: 'success'
            })
          }
        })
      }
    },
    components: {
      runRecordQuery
    }
  }
</script>
