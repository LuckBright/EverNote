<template>
  <div class="layout_box spe" id="triage">
    <div class="layout_inner spe">
      <div class="main-wrap">
        <el-row class="lh40">
          <el-col :span="5">
            <ever-patient-select
              v-if="show"
              v-model="form.patient.name"
              @select="selectPatient"
              :allow-create="true"
              @newuser="resetPatient"
            ></ever-patient-select>
          </el-col>
          <el-col :span="2" class="ml10 mt4">
            <el-button size="small" @click="resetform">重置</el-button>
          </el-col>
        </el-row>
        <div v-show="tableData && tableData.length > 0 && form.patient.name">
          <el-table v-loading.body="loading" align="center" :data="tableData" border>
            <el-table-column prop="billingOrgName" label="开单机构" width="140"></el-table-column>
            <el-table-column prop="orgName" label="执行机构" width="140"></el-table-column>            
            <el-table-column prop="tenantDeptName" label="科室" width="140"></el-table-column>
            <el-table-column prop="patientName" label="患者姓名" width="180"></el-table-column>
            <el-table-column prop="visitType" label="来源" width="180">
              <template slot-scope="scope">{{ scope.row.visitType === 1 ? '门诊' : scope.row.visitType === 3 ? '住院' : '--'}}</template>
            </el-table-column>
            <el-table-column prop="serviceName" label="服务" width="200"></el-table-column>
            <el-table-column prop="isSceneRegister" label="现场挂号" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.isSceneRegister | filterText}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="planTime" label="执行时间" width="200"></el-table-column>
            <el-table-column prop="appointmentTimerange" label="预约时段" width="220"></el-table-column>
            <el-table-column width align="center" label="操作">
              <template slot-scope="scope">
                <div v-if="scope.row.status!==6">
                  <el-button
                    type="primary"
                    size="small"
                    v-if="scope.row.status==1"
                    :disabled="isdisabled"
                    @click="onVisit(scope.row,true,true)"
                  >签到</el-button>
                  <el-button
                    v-if="(scope.row.status==3 || scope.row.status==5) && scope.row.isTriage"
                    type="primary"
                    size="small"
                    @click="openDialogVisible(scope.row,true)"
                  >分诊</el-button>
                  <el-button
                    v-if="scope.row.status!==1"
                    type="primary"
                    size="small"
                    @click="yujian(scope.row)"
                  >预检</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    v-if="scope.row.status==4"
                    @click="onVisit(scope.row,true,false)"
                  >回诊</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="layout_inner spe mt20">
      <div class="main-expand">
        <triagetab ref="triagetab" @rowclick="distribute" :isNew="isNew"></triagetab>
      </div>
    </div>
    <dialog-precheck
      ref="tirggeryujian"
      title="'预检'"
      :precheckData="precheckData"
      :nosubmit="false"
    ></dialog-precheck>
    <el-dialog title="分诊" :visible.sync="dialogVisible" width="45%">
      <el-row :gutter="20">
        <el-col :span="24" class="mb10">
          <h3>{{selectOrgan.name}}</h3>
        </el-col>
        <el-col :span="24" class="mb10">
          <ever-subject-select type="select" ref="ess" v-model="option1" :params="deptParams" placeholder="请选择科室"></ever-subject-select>
        </el-col>
        <el-col :span="8" class="mb10">
          <el-select style="width:100%;" v-model="option2" placeholder="请选择资源" clearable>
            <el-option
              v-for="item in diagnosisOption2"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" class="mb10">
          <el-select style="width:100%;" v-model="option3" :placeholder="selectplaceholder" filterable clearable>
            <el-option
              v-for="item in diagnosisOption3"
              :key="item.id"
              :label="item.name"
              :value="`${item.name}|${item.id}`"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" class="mb10">
          <el-input
            style="width:100%;"
            placeholder="请输入插队位数"
            type="number"
            v-model="number"
          ></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="trageDept">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/arrange/store/triageapi'
import triagetab from '@/arrange/page/triage/triagetab'
import { checkNonNegativeInteger, date2Timestamp } from '@/util/common'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import dialogPrecheck from '@/workspace/page/dialog-precheck'
import storage from '@/util/storage'
export default {
  data () {
    return {
      api,
      show: true,
      loading: '',
      selectOrgan: {
        id: storage.getStorageByClinic('CLINICID') || '',
        code: storage.getStorageByClinic('CLINICID') || '',
        name: storage.getStorageByClinic('CLINICNAME')
      },
      form: {
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: ''
        }
      },
      tableData: [],
      isNew: '',
      qrcodeData: {
        url: ''
      },
      qrcodeUrl: '',
      diagnosisOption2: [{
        text: '设备',
        id: '1'
      }, {
        text: '诊室',
        id: '2'
      }, {
        text: '医生',
        id: '3'
      }],
      diagnosisOption3: [],
      id: this.$store.state.currentUser.userId,
      clinicId: storage.getStorageByClinic('CLINICID') || '',
      deptOption: storage.getLocalStorage('STIAGE_SET_DEPTS') ? JSON.parse(storage.getLocalStorage('STIAGE_SET_DEPTS')) : [],
      precheckData: {},
      dialogVisible: false,
      isdisabled: false,
      number: '',
      objval: {},
      option1: '',
      option2: '',
      option3: '',
      selectplaceholder: '请选择',
      patientIds: [],
      deptIds: '',
      deptParams: {
        usePermissionStatus: 'Y',
        status: 'Y',
        orgIdList: [storage.getLocalStorage('CLINICID')],
        type1CodeList: ['01', '02'],
        type2CodeList: ['01.02', '01.03', '02.01', '02.03']
      }
    }
  },
  created () {
    this.initLocalStorage()
  },
  methods: {
    resetform () {
      this.form = {
        time: '',
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: ''
        }
      }
    },
    selectPatient (val) { // 'TkuIFJ9Cqe2JeyswMUw'
      this.form.patient = val
      let patientIds = []
      if (val && val.id) {
        patientIds.push(val.id)
        this.findTasksByPatientId(patientIds)
      }
    },
    resetPatient () {
      this.form.patient = {
        agebirthday: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: ''
      }
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 获取预约记录
    findTasksByPatientId (patientIds) {
      this.patientIds = patientIds
      this.api.findTasksByPatientId({ patientIds: patientIds, tenantDeptId: this.deptIds }).then(rs => {
        if (rs && rs.data) {
          this.tableData = rs.data
          this.isdisabled = false
        }
      })
    },
    initLocalStorage () {
      this.deptIds = []
      let tenantDeptId = JSON.parse(storage.getLocalStorage('STIAGE_SET_DEP'))
      if (tenantDeptId) {
        tenantDeptId.forEach(val => {
          this.deptIds.push(val.id)
        })
      }
    },
    distribute (val) {
      if (!val || !val.diff) {
        if (val) {
          this.deptIds = []
          this.deptIds.push(val)
        } else {
          this.initLocalStorage()
        }
        return false
      }
      if (val.diff === 'qd') this.onVisit(val, false, true)
      if (val.diff === 'hz') this.onVisit(val, false, false)
      if (val.diff === 'fz') this.openDialogVisible(val)
      if (val.diff === 'yj') this.yujian(val)
    },
    // 签到、回诊按钮
    onVisit (val, cp, cd) {
      this.isdisabled = true
      let params = { id: val.id }
      let time = this.$moment(new Date()).format('YYYY-MM-DD')
      if (date2Timestamp(val.appointmentDate.split(' ')[0]) > date2Timestamp(time) && val.appointmentType === 'register') {
        this.$messageTips(this, 'warning', '预约日期未到')
        this.$bus.$emit('cleardisabled', true)
        return false
      }
      this.api.checkIn(params).then(rs => {
        if (rs.head.errCode === 0) {
          if (cd) {
            this.$messageTips(this, 'success', '签到成功')
          } else {
            this.$messageTips(this, 'success', '回诊成功')
          }
          this.$refs.triagetab.search()
          if (cp) this.findTasksByPatientId(this.patientIds)
        } else {
          this.$bus.$emit('cleardisabled', true)
        }
      })
    },
    // 预检按钮
    yujian (obj) {
      this.precheckData.providerid = obj.tenantDeptId
      this.precheckData.visitNumber = obj.visitNumber
      this.precheckData.patientId = obj.patientId
      this.$refs.tirggeryujian.open()
    },
    // 分诊弹窗
    openDialogVisible (val, cp) {
      val.flag = cp ? 1 : 0
      this.number = ''
      this.dialogVisible = true
      this.objval = val
      this.option1 = ''
      this.option2 = ''
      this.option3 = ''
    },
    // 分诊弹窗确认
    trageDept () {
      if (this.option1 === '' && this.number !== '') {
        this.$messageTips(this, 'warning', '请选择科室!')
        return false
      }
      if (!checkNonNegativeInteger(this.number) || this.number === '0') {
        this.$messageTips(this, 'warning', '分诊位数必须为大于0的正整数!')
        return false
      }
      if (this.option2 === '' && this.option3 !== '') {
        this.$messageTips(this, 'warning', '请选择资源!')
        return false
      }
      if (this.option2 !== '' && this.option3 === '') {
        this.$messageTips(this, 'warning', this.selectplaceholder)
        return false
      }
      let params = {
        resourceType: this.option2,
        resourceId: this.option3.split('|')[1],
        resourceName: this.option3.split('|')[0],
        orgId: this.selectOrgan.id,
        orgName: this.selectOrgan.name,
        tenantDeptName: this.option1.orgSubjectName,
        tenantDeptId: this.option1.orgSubjectCode,
        id: this.objval.id,
        ranking: this.number,
        appointmentType: this.objval.appointmentType
      }
      this.api.changeDeptAndDoctor(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '分诊成功')
          this.dialogVisible = false
          if (this.objval.flag) {
            this.findTasksByPatientId(this.patientIds)
          } else {
            this.$refs.triagetab.search()
          }
        }
      })
    },
    handlerLogical (val) {
      this.diagnosisOption3 = []
      this.option3 = ''
      if (this.option1 !== '' && this.option2 === '2') {
        this.selectplaceholder = '请选择诊室'
        this.api.getRoomRecordVoBySearch({
          orgIdList: this.selectOrgan ? [this.selectOrgan.id] : [],
          tenantSubjectIds: [this.option1.orgSubjectCode],
        }).then(rs => {
          this.diagnosisOption3 = rs.data
        })
      }
      if (this.option1 !== '' && this.option2 === '3') {
        this.api.getSectionId({
          orgIdList: this.selectOrgan ? [this.selectOrgan.id] : [],
          tenantSubjectIdList: [this.option1.orgSubjectCode]
        }).then(rs => {
          this.diagnosisOption3 = rs.data.resultList
        })
        this.selectplaceholder = '请选择医生'
      }
    }
  },
  components: {
    triagetab,
    deptCascader,
    dialogPrecheck
  },
  filters: {
    filterText (val) {
      if (val) {
        val = '是'
      } else {
        val = '否'
      }
      return val
    }
  },
  watch: {
    'selectOrgan' (val) {
      this.deptParams.orgIdList = val ? [val.id] : [storage.getLocalStorage('CLINICID')]
    },
    'courseId': {
      handler (val) {
        if (val) {
          if (this.type === 0) {
            this.courseUrl = `/class/detail-${this.courseId}`
          } else if (this.type === 2) {
            this.courseUrl = `/live/detail-${this.courseId}`
          } else {
            this.courseUrl = `/course/detail-${this.courseId}`
          }
        }
      }
    },
    'option1': {
      handler (val) {
        if (val) {
          this.handlerLogical(val)
        }
      }
    },
    'option2': {
      handler (val) {
        if (val) {
          this.handlerLogical(val)
        }
      }
    },
    'dialogVisible' (val) {
      if (val && this.deptOption.length === 1) {
        this.option1 = this.deptOption[0]
      }
    },
    'form': {
      handler (val) {
        if (!val.patient.name) {
          return
        }
        if (val && val.patient.name && val.patient.id) {
          let patientIds = []
          patientIds.push(val.patient.id)
          this.findTasksByPatientId(patientIds)
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.layout_box.spe {
  margin-top: 0;
}
.layout_box .layout_inner.spe .main-wrap {
  padding: 20px 20px;
}
.layout_box .layout_inner.spe .main-wrap.spe {
  padding-top: 0;
}
.layout_box .layout_inner .main-expand {
  padding: 5px 20px 20px;
}
.lh40 {
  height: 40px;
  line-height: 40px;
  /deep/ .el-input__suffix-inner {
    margin-right: 8px !important;
  }
}
.ml40 {
  line-height: 10px;
}
.fr {
  float: right;
}
.bleft {
  border-left: 1px solid #cccccc;
}
a.result {
  text-decoration: underline;
  margin-left: 10px;
}
.fz14 {
  font-size: 14px;
}
.el-form-item__content {
  line-height: 36px !important;
}
#triage .qrcodeDiv {
  width: 20px;
  height: 20px;
  position: relative;
}
#triage .qrcodeDiv img:first-child {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0px;
  left: 58px;
}
#triage .qrcodeDiv img.specialImg {
  width: 300px;
  height: 300px;
  position: fixed;
  right: 20px;
  top: 120px;
  z-index: 900;
}
.mt4 {
  margin-top: -6px;
}
</style>
