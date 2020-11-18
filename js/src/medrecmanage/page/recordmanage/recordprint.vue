<template>
  <div class="layout_inner flex_column_full_hidden" style="box-sizing: border-box;">
    <div class="main-head" v-if="!showPrintDetail">
      <run-record-query type="printRecord" @query="query"></run-record-query>
    </div>
    <ever-table
      v-if="!showPrintDetail"
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
    <print-detail 
      ref="printDetail"
      :print-length.sync="printLenth"
      v-if="showPrintDetail"
      :patient-id="patientId"
      :visit-id="visitId"
      :dpt-id="dptId"
      :patient-name="patientName"
      >
        <span slot="close" style="float:right;cursor:pointer;" @click="close">X</span>
      </print-detail>
  </div>
</template>

<script>
  import list from '@/util/list'
  import printDetail from '@/medrecmanage/page/recordmanage/printdetail'
  import runRecordQuery from '@/medrecmanage/components/runrecord.query'
  import storage from '@/util/storage'
  import {commandLog} from '@/phr/mixin/operationLog.js'
  export default {
    beforeRouteLeave (to, from, next) {
      if (this.printLenth > 0) {
        this.$confirm('离开此页面后续打印内容将中断', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.printDetail && this.$refs.printDetail.emptyPrintData()
          storage.setLocalStorage('recordPrintData', null)
          next()
        }).catch((e) => {
          this.noLeave()
          next(false)
        })
      } else {
        storage.setLocalStorage('recordPrintData', null)
        next()
      }
    },
    mixins: [list],
    data () {
      return {
        patientName: '',
        printLenth: 0,
        patientId: '',
        visitId: '',
        dptId: '',
        showPrintDetail: false,
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
            prop: 'opStatus',
            label: '归档状态',
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
            prop: 'patientStatus',
            label: '在院状态',
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
                label: '一键打印'
              }
            ]
          }
        ]
      }
    },
    watch: {
      '$route.query': {
        handler (val) {
          if (!val.visitId) {
            this.showPrintDetail = false
          }
        }
      }
    },
    created () {
      if (this.$route.query.visitId) {
        this.showPrintDetail = true
      }
      commandLog({
        content: '登录病历打印',
        opModuleOne: '病案管理-病历打印',
        opType: 'LOGIN'
      })
      window.addEventListener('beforeunload', this.onbeforeunloadhandler)
      window.addEventListener('unload', this.onbeforeunloadhandler)
    },
    methods: {
      noLeave () {
        // 阻止菜单的active变化
        this.$bus.$emit('nav:preventhirdtActiveChange', true)
      },
      onbeforeunloadhandler (e) {
        if (this.printLenth) {
          (e || window.event).returnValue = '将中断打印任务'
        }
      },
      close () {
        this.showPrintDetail = false
      },
      // 查询
      query (val) {
        this.queryObj = val
        this.list()
        let obj = this.$route.query
        storage.setLocalStorage('recordPrintData', null)
        let query = {
          q: obj.q,
          page: obj.page,
          pagesize: obj.pagesize
        }
        this.$router.push({
          name: this.$route.name,
          query: query
        })
      },
      eventChange ({ prop, row }) {
        this[prop](row)
      },
      // 查看病历
      showRecord (data) {
        this.patientId = data.patientId
        this.visitId = data.visitId
        this.dptId = data.dptId
        this.patientName = data.name
        this.showPrintDetail = true
        storage.setLocalStorage('recordPrintData', null)
        // 设置query
        this.$router.push({
          name: this.$route.name,
          query: Object.assign({}, this.$route.query, {
            patientId: data.patientId,
            visitId: data.visitId,
            dptId: data.dptId,
            patientName: data.name
          })
        })
      }
    },
    components: {
      runRecordQuery,
      printDetail
    }
  }
</script>
