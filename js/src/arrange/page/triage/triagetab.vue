<template>
  <div>
    <el-row class="triage_row">
      <div>
        <el-button type="text" @click="configdept">配置科室</el-button>
        <el-dialog title="配置科室" :visible.sync="dialogVisible" width="30%">
          <ever-subject-select ref="ess" v-model="tenantDepts" multiple placeholder="请选择科室"></ever-subject-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveconfig">保 存</el-button>
          </span>
        </el-dialog>
      </div>
      <el-col :span="20">
        <ever-query-form :schema="schema" size="small" v-model="queryObj">
          <template slot="tenantDeptId">
            <el-select
              v-model="queryObj.tenantDeptId"
              placeholder="请选择科室"
              clearable
              filterable
              @clear="rowclick"
              style="width:100%"
              value-key="id"
            >
              <el-option
                v-for="(item, i) in deptOption"
                :key="i"
                :value="item.orgSubjectId"
                :label="item.orgSubjectName"
              ></el-option>
            </el-select>
          </template>
          <template slot="doctorId">
            <ever-staff-select
              ref="ess"
              v-model="queryObj.doctorId"
              fields="id"
              :params="{
                'tenantSubjectIdList': [...queryObj.tenantDeptId]
              }">
            </ever-staff-select>
          </template>
          <template slot="doctorIdObj1">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </template>
        </ever-query-form>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item,i) in tabsMap" :label="tabsMap[i]" :name="i" :key="i"></el-tab-pane>
    </el-tabs>
    <triagetable
      :queryObj="queryObj"
      ref="triagetable"
      @rowclick="rowclick"
      :isDaozhen="queryObj.status"
      :activeName="activeName"
      :key="newdate+''"
    ></triagetable>
    <precheck v-if="task&&task.variables" :task="task" @update:visible="clear" @done="done()"></precheck>
    <div id="task-view"></div>
  </div>
</template>
<script>
let schema = [
  {
    name: 'tenantDeptId',
    type: 'custom'
  },
  {
    name: 'doctorId',
    type: 'custom'
  },
  {
    name: 'appointmentDate',
    type: 'date',
    placeholder: '请选择日期',
    label: '',
    outformat: 'yyyy-MM-dd',
    clearable: true
  },
  {
    name: 'doctorIdObj1',
    type: 'custom'
  }
]
import triagetable from '@/arrange/page/triage/triagetable'
import api from '@/arrange/store/triageapi'
import sourceapi from '@/arrange/store/sourceapi'
import schedulingapi from '@/arrange/store/schedulingapi'
// import deptCascader from '@/arrange/page/scheduling/deptcascader'
// import serviceIconPopover from '@/workspace/page/service.panel/common/service.icon.popover'
import precheck from '@/workspace/page/dialog-precheck'
// import phrformDialog from '@/form/components/phrform.dialog.vue'
import storage from '@/util/storage'

export default {
  props: ['isNew'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.status = ''
    queryObj.appointmentDate = this.$moment(new Date()).format('YYYY-MM-DD')
    return {
      api,
      sourceapi,
      schedulingapi,
      schema,
      queryObj,
      activeName: '1',
      otherBtn: false,
      deptList: [],
      code: 'STAFF_DOCTOR',
      tabsMap: {
        '1': '全部', // ''
        '3': '候诊', // 3
        '4': '已诊', // 4
        '5': '回诊', // 5
        '6': '未到诊' // 1
      },
      deptOption: [],
      setIntTime: null,
      patientObj: {
        name: '张三'
      },
      popover: false,
      getPatientDisabled: false,
      task: {},
      dialogVisible: false,
      tenantDepts: [],
      diagnosisOption: [],
      doctorOption: [],
      clinicId: storage.getStorageByClinic('CLINICID') || '',
      newdate: ''
    }
  },
  created () {
    if (storage.getLocalStorage('STIAGE_SET_DEPTS')) {
      this.deptOption = JSON.parse(storage.getLocalStorage('STIAGE_SET_DEPTS'))
    }
  },
  mounted () {
    // 定时刷新分诊列表
    this.setIntTime = setInterval(_ => {
      this.$refs.triagetable.list()
    }, 30000)
    this.$refs.triagetable.list()
  },
  destroyed () {
    clearInterval(this.setIntTime)
  },
  methods: {
    clear () {
      this.popover = false
      this.task = null
    },
    destroyedTask () {
      this.task = null
    },
    getPatient () {
      this.popover = true
      if (this.getPatientDisabled) return
      this.getPatientDisabled = true
      this.api.physicalCallNumByDeptId({ deptId: this.queryObj.deptId }).then(rs => {
        if (rs && rs.data) {
          this.patientObj = rs.data
          setTimeout(_ => {
            this.popover = true
          })
          this.jzPatientObj = this.patientObj
          this.jzShow = true
          this.$bus.$emit('callPatientId', this.patientObj.patientId)
        }
      })
      setTimeout(_ => {
        this.getPatientDisabled = false
      }, 3000)
    },
    physicalCrossByDeptId () {
      this.api.physicalCrossByDeptId({ deptId: this.queryObj.deptId }).then(rs => {
        if (rs && rs.data) {
          this.patientObj = rs.data
          setTimeout(_ => {
            this.popover = true
          })
          this.jzPatientObj = this.patientObj
          this.jzShow = true
          this.$bus.$emit('callPatientId', this.patientObj.patientId)
        }
      })
    },
    change () {
      this.$refs.triagetable.list()
    },
    saveconfig () {
      this.dialogVisible = false
      storage.setLocalStorage('STIAGE_SET_DEPTS', JSON.stringify(this.tenantDepts))
      this.deptOption = JSON.parse(storage.getLocalStorage('STIAGE_SET_DEPTS'))
      this.queryObj.tenantDeptId = ''
      this.$refs.triagetable.list()
    },
    search () {
      this.$refs.triagetable.list()
    },
    handlerLogical (val) {
      this.api.getSectionId({ sectionRecordId: this.queryObj.tenantDeptId }).then(rs => {
        if (rs.data[0]) {
          this.doctorOption = rs.data[0].staffRecordVoList
        }
      })
    },
    configdept () {
      this.dialogVisible = true
      this.tenantDepts = JSON.parse(storage.getLocalStorage('STIAGE_SET_DEPTS'))
    },
    rowclick (val) {
      this.$emit('rowclick', val)
    }
  },
  watch: {
    activeName (val) {
      this.newdate = new Date()
      if (val === '6') {
        this.queryObj.status = '1'
      } else if (val === '2') {
        this.queryObj.status = '5'
      } else if (val === '3') {
        this.queryObj.status = '3'
      } else if (val === '4') {
        this.queryObj.status = '4'
      } else if (val === '5') {
        this.queryObj.status = '5'
      } else {
        this.queryObj.status = ''
      }
    },
    'queryObj.tenantDeptId': {
      handler (val) {
        if (val !== '') {
          this.queryObj.doctorId = ''
          // this.handlerLogical()
          this.rowclick(val)
        }
      },
      deep: true
    },
    queryObj: {
      handler (val) {
        this.$refs.triagetable.list()
      },
      deep: true
    },
    done () {
      this.popover = false
      this.$refs.triagetable.list()
    }
  },
  components: {
    triagetable,
    // deptCascader,
    // serviceIconPopover,
    // phrformDialog,
    precheck
  }
}
</script>
<style scoped>
.triage_row /deep/ .el-form-item .search_btn {
  display: none;
}
.el-main .el-button--text span {
  border-bottom: 1px solid #1c7bef !important;
}
.service_icon_tips {
  display: inline-block;
  padding: 15px 0px 15px 0;
  font-size: 14px;
  color: #666;
}
.service_icon_tips .iconfont {
  color: #bbb;
  margin-right: 5px;
}
.nextcontent {
  font-size: 14px;
  padding: 0px 20px 0px 10px;
}
.noCustomer {
  color: #666;
  line-height: 35px;
}
.callCustomer {
  color: #333;
  font-weight: 800;
  line-height: 30px;
}
.callCustomer span {
  font-size: 12px;
}
.callCustomer .active {
  height: 30px;
  line-height: 30px;
  width: 40px;
  position: relative;
  right: 0px;
}
</style>

