<template>
  <div class="layout_box triage_wrap" id="triage">
    <div class="layout_inner top_wrap">
      <div class="main-wrap">
        <div>
          <el-form
            :model="form"
            label-width="80px"
            label-position="right"
            ref="form"
            size="small"
            class="triageForm"
          >
            <el-row class="lh40">
              <el-col :span="4">
                <el-form-item label prop="patient.name" style="margin-left:-80px;">
                  <ever-patient-select
                    v-if="show"
                    v-model="form.patient.name"
                    @select="selectPatient"
                    :scence="0"
                    :allow-create="true"
                    :scence="0"
                    @newuser="resetPatient"
                  ></ever-patient-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="ml10 mt4">
                <el-button size="small" class @click="resetform">重置</el-button>
              </el-col>
              <!-- todo 二维码 -->
              <el-col :span="2" class="fr">
                <div class="qrcodeDiv" v-if="qrcodeData&&qrcodeData.url" @click="setClass">
                  <img :src="qrcodeData.url" alt />
                  <img :src="qrcodeData.url" alt class="specialImg" v-if="imgFlag" />
                </div>
              </el-col>
              <el-col :span="4" class="fr">
                <el-form-item label="分诊诊区" prop="diagnosisArea">
                  <el-select
                    v-model="form.diagnosisAreaId"
                    placeholder="请选择诊区"
                    clearable
                    style="width:100%"
                  >
                    <el-option
                      v-for="(item, i) in diagnosisOption"
                      :key="i"
                      :value="item.id"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 葛东说改文案 20181002-->
              <el-col :span="6" class="fr">
                <el-form-item label="超时提醒" prop="waitTime" class="fr">
                  <el-input-number v-model="waitTime" :controls="false" :min="waitTime1" :max="999"></el-input-number>
                  <span style="display:inline-block;line-height:36px;">分钟</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-show="tableData && tableData.length >0 && form.patient.name">
          <el-table
            v-loading.body="loading"
            :show-header="false"
            align="center"
            :data="tableData"
            border
          >
            <el-table-column prop="billingOrgName" label="开单机构" width="140"></el-table-column>
            <el-table-column prop="orgName" label="执行机构" width="140"></el-table-column>
            <el-table-column prop="deptName" label="科室" width="140"></el-table-column>
            <el-table-column prop="patientName" label="患者姓名" width="180"></el-table-column>
            <el-table-column prop="visitType" label="来源" width="180">
              <template slot-scope="scope">{{ scope.row.visitType === 1 ? '门诊' : scope.row.visitType === 3 ? '住院' : '--'}}</template>
            </el-table-column>
            <el-table-column prop="serviceName" label="服务" width="200"></el-table-column>
            <el-table-column prop="sceneAppointName" label="现场挂号" width="200"></el-table-column>
            <el-table-column prop="planTime" label="执行时间" width="200"></el-table-column>
            <el-table-column prop label="预约时段" width="180">
              <template slot-scope="scope">{{ scope.row.registrationTime | formatDateByExp('YYYY-MM-DD') }}</template>
            </el-table-column>
            <el-table-column prop="appointTimerange" label="预约时段" width="180"></el-table-column>
            <el-table-column width align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  v-if="scope.row.isSceneAppoint==0"
                  v-ever-click-once="disabled1"
                  :disabled="disabled1"
                  @click="onVisit(scope.row.taskId,scope.row.isSceneAppoint,scope.row.patientId,scope.row)"
                >到诊</el-button>
                <a
                  class="result"
                  href="javascript:void(0)"
                  v-else-if="scope.row.isSceneAppoint==1"
                  v-ever-click-once="disabled2"
                  :disabled="disabled2"
                  @click="onVisit(scope.row.taskId,scope.row.isSceneAppoint,scope.row.patientId,scope.row)"
                >查看结果</a>
                <el-button
                  type="primary"
                  size="small"
                  v-else
                  v-ever-click-once="disabled3"
                  :disabled="disabled3"
                  @click="onVisit(scope.row.taskId,scope.row.isSceneAppoint,scope.row.patientId,scope.row)"
                >取消标记</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <triagetab
      class="layout_inner flex_column_1_hidden mt10"
      ref="triagetab"
      :reload="reload"
      :isNew="isNew"
      :diagnosisAreaId="form.diagnosisAreaId"
    ></triagetab>
  </div>
</template>
<script>
import api from '@/arrange/store/triageapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import triagetab from '@/arrange/page/triage/triagetab'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import storage from '@/util/storage.js'

export default {
  data () {
    // let validateTime = function (rule, value, callback) {
    //   if (value > 999 || value < 0) {
    //     callback(new Error('请输入正确范围0-999'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // tableDat: [{deptName: '儿科',appointTimerange: 'dfsdfsdf'}],
      api,
      schedulingapi,
      show: true,
      disabled1: false,
      disabled2: false,
      disabled3: false,
      deptList: [],
      loading: '',
      radio: '',
      waitTime1: null,
      waitTime: '',
      form: {
        diagnosisAreaId: '',
        selectDept: '',
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
      reload: '',
      isNew: '',
      qrcodeData: {
        url: ''
      },
      qrcodeUrl: '',
      diagnosisOption: [],
      imgFlag: false,
      id: this.$store.state.currentUser.userId
    }
  },
  created () {
    this.getArea()
    if (this.id) {
      if (storage.getCookie('diagnosisAreaId' + this.id)) {
        this.form.diagnosisAreaId = storage.getCookie('diagnosisAreaId' + this.id)
      }
    }
  },
  methods: {
    setClass () {
      this.imgFlag = !this.imgFlag
    },
    // 获取诊区
    getArea () {
      this.api.getArea().then(rs => {
        if (rs && rs.data && rs.data.resultList && rs.data.resultList[0]) {
          this.diagnosisOption = rs.data.resultList
        }
      })
    },
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
      let patientIdList = []
      if (val && val.id) {
        patientIdList.push(val.id)
        this.findTasksByPatientId(patientIdList, this.form.diagnosisAreaId)
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
    getDeptData () {
      this.schedulingapi.getDeptData({
        deptTypes: ['1']
      }).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.deptList = rs.data.map((v, i) => {
            let obj = {
              deptId: v.deptId,
              deptName: v.deptName,
              id: i
            }
            return obj
          })
        }
      })
    },
    findTasksByPatientId (patientIdList, diagnosisAreaId) {
      this.api.findTasksByPatientId({ patientIdList: patientIdList, diagnosisAreaId: diagnosisAreaId }).then(rs => {
        if (rs && rs.data) {
          this.tableData = rs.data
        }
      })
    },
    onVisit (val, flag, id, obj) {
      let patientIdList = []
      patientIdList.push(id)
      let params = {
        taskId: val || '',
        deptId: this.form.deptId && this.form.deptId.id ? this.form.deptId.id : '',
        waitTime: this.waitTime ? this.waitTime : '',
        patientId: id,
        obj: obj
      }
      this.api.completeTaskByTaskId(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '成功',
            type: 'success'
          })
          this.findTasksByPatientId(patientIdList)
          this.$refs.triagetab.change()
          this.isNew = flag
        }
      })
    }
  },
  components: {
    triagetab,
    deptCascader
  },
  watch: {
    '$store.state.currentUser.userId': {
      handler (val) {
        if (val) {
          if (storage.getCookie('diagnosisAreaId' + val)) {
            this.form.diagnosisAreaId = storage.getCookie('diagnosisAreaId' + val)
          }
        }
      }
    },
    'form.diagnosisAreaId': {
      handler (val) {
        if (val) {
          if (this.id) {
            storage.setCookie('diagnosisAreaId' + this.id, val)
          }
          this.api.getTreatAreaInfoById({ id: val }).then(rs => {
            if (rs && rs.data && rs.data.fileName) {
              this.$set(this.qrcodeData, 'url', 'http://' + rs.data.fileName)
            }
          })
        } else {
          this.$set(this.qrcodeData, 'url', '')
        }
      }
    },
    form: {
      handler (val) {
        if (!val.patient.name) {
          return
        }
        if (val && val.patient.name && val.patient.id) {
          let patientIdList = []
          patientIdList.push(val.patient.id)
          // let deptId = val.deptId && val.deptId.id ? val.deptId.id : ''
          let diagnosisAreaId = val.diagnosisAreaId
          this.findTasksByPatientId(patientIdList, diagnosisAreaId)
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
.triage_wrap {
  .top_wrap {
    padding: 10px 10px 0;
  }
}
.layout_box.spe {
  margin-top: 0;
}
.layout_box .layout_inner.spe .main-wrap {
  padding: 20px 20px;
}
.layout_box .layout_inner.spe .main-wrap.spe {
  padding-top: 0;
}
.lh40 {
  height: 40px;
  line-height: 40px;
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
/* .line{width:1px;height:36px;background-color:#cccccc;margin-top:2px;margin-left:62px;} */
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
#triage /deep/ label[for="waitTime"] {
  border-left: 1px solid #cccccc !important;
}
.mt4 {
  margin-top: -4px;
}
</style>
