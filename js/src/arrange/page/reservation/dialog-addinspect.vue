<template>
  <div id="inspectAdd">
    <el-dialog
      :visible.sync="visible"
      title="预约检查"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
    >
      <el-row>
        <el-col :span="13" class="line">
          <el-form :model="form" label-width="80px" label-position="right" ref="form">
            <el-row>
              <el-col>
                <el-form-item label="姓名" prop="patient.name" :rules="rules.required">
                  <ever-patient-select
                    v-model="form.patient.name"
                    @select="selectPatient"
                    :allow-create="true"
                    v-if="isShow"
                    :showAttrType="true"
                    :disabled="isDisable"
                  ></ever-patient-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="性别">
                  <el-radio-group v-model="form.patient.sex" :disabled="isDisable">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item label="手机号码" prop="patient.mobile" :rules="rules.required">
                  <!-- <el-input v-model="form.patient.mobile" placeholder="手机号码" :disabled="isDisable"></el-input> -->
                  <el-input
                    v-model="form.patient.mobile"
                    placeholder="请输入手机号"
                    v-on:input="inputTrigger"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="line_b">
              <el-col>
                <el-form-item label="出生日期">
                  <el-row :gutter="10" type="flex">
                    <el-col>
                      <!-- <age v-model="form.patient.agebirthday" :disabled="isDisable" :isFlag="false"></age> -->
                      <age v-model="form.patient.birthday" :disabled="isDisable"></age>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            :model="form1"
            label-width="80px"
            label-position="right"
            ref="form1"
            class="form1">
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目" prop="hasDocAdviceFlag">
                  <el-select
                    v-model="form1.hasDocAdviceFlag"
                    placeholder="是否医嘱"
                    style="width:100%"
                    :disabled="isDisable"
                    @change="changeFlag"
                  >
                    <el-option
                      v-for="(item, i) in typeOption"
                      :key="i"
                      :value="item.id"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="form1.program&&form1.program.isEmergency&&form1.program.isEmergency==='1'?14:16">
                <el-form-item label prop="program" :rules="rules.requiredObject" label-width="0px">
                  <el-select
                    v-model="form1.program"
                    placeholder="请选择项目"
                    value-key="id"
                    clearable
                    filterable
                    remote
                    :remote-method="remoteMethod"
                    style="width:100%"
                    :disabled="isDisable"
                    v-if="form1.hasDocAdviceFlag==='0'"
                    class="program_sl"
                    @change="changeProgram">
                    <el-option
                      v-for="(item, i) in serviceData"
                      :key="i"
                      :value="item"
                      :label="item.name">
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="form1.program"
                    placeholder="请选择项目"
                    value-key="id"
                    clearable
                    filterable
                    remote
                    :remote-method="remoteMethod"
                    style="width:100%"
                    :disabled="isDisable"
                    class="program_sl"
                    @change="changeProgram"
                    v-else>
                    <el-option
                      v-for="(item, i) in serviceData1"
                      :key="i"
                      :value="item"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="form1.program&&form1.program.isEmergency&&form1.program.isEmergency==='1'">
                <span class="emergency">急</span>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="12">
                <el-form-item label="科室" prop="selectDept">
                  <dept-cascader v-model="form1.selectDept" :template-type="1" style="width:100%"></dept-cascader>
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
                <el-form-item label="日期" prop="appointmentDate" :rules="rules.required">
                  <el-date-picker
                    @change="changeDate"
                    style="width: 100%"
                    v-model="form1.appointmentDate"
                    type="date"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :pickerOptions='{
                      disabledDate (time) {
                        return time.getTime() < new Date().setDate(new Date().getDate() - 1)
                      }
                    }'></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="诊室" prop="ward">
                  <el-select
                    v-model="form1.ward"
                    value-key="resourceId"
                    clearable
                    placeholder="请选择诊室"
                    @change="changeRoom">
                    <el-option
                      v-for="item in roomOptions"
                      :key="item.resourceId"
                      :label="item.resourceName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="时段"
                  prop="time"
                  :rules="rules.requiredObject"
                  v-if="form1.program&&form1.program.serviceClassification&&form1.program.serviceClassification==='800'"
                >
                  <span v-if="timeOption&&timeOption.length>0">
                    <el-select
                      v-model="form1.time"
                      value-key="deviceId"
                      clearable
                      placeholder="请选择时段"
                    >
                      <el-option
                        v-for="item in timeOption"
                        :key="item.deviceId"
                        :label="item.startTimeStr"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </span>
                  <span v-else>--</span>
                </el-form-item>
                <!-- 治疗的时间段不必填 -->
                <el-form-item label="时段" prop="time" v-else>
                  <span v-if="timeOption&&timeOption.length>0">
                    <el-select
                      v-model="form1.time"
                      value-key="deviceId"
                      clearable
                      placeholder="请选择时段"
                    >
                      <el-option
                        v-for="item in timeOption"
                        :key="item.deviceId"
                        :label="item.startTimeStr"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </span>
                  <span v-else>--</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form1.remarks" placeholder="备注"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label>
                  <el-checkbox
                    v-model="form1.isSendMessage"
                    :disabled="form.isSceneAppoint === 1"
                  >发送短信</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label>
                  <el-button @click="clickBtn" type="primary">预约</el-button>
                  <el-button @click="resetPatient" v-if="!addParams||!addParams.patientId">重置</el-button>
                  <el-button @click="close" v-if="addParams&&addParams.patientId">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="11">
          <div class="line_b" v-if="isDisable">
            <el-table
              :data="tableData"
              ref="table"
              :show-header="false"
              @selection-change="setSelectData"
              @current-change="setCurrentData"
              row-key="id"
              max-height="120"
              highlight-current-row
              width="100%"
            >
              <el-table-column width="26" align="center">
                <template slot-scope="scope">
                  <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                width
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="deptName" label="科室" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.deptName?scope.row.deptName:'--'}}</template>
              </el-table-column>
              <el-table-column prop="diagName" label="诊室" min-width show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.diagName?scope.row.diagName:'--'}}</template>
              </el-table-column>
              <el-table-column prop="appointmentDate" label="日期" min-width show-overflow-tooltip>
                <template
                  slot-scope="scope"
                >{{scope.row.appointmentDate | formatDateByExp('YYYY-MM-DD')}}</template>
              </el-table-column>
              <el-table-column prop="startTimeStr" label="时间段" min-width="50" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
          <div>
            <h4>号源信息</h4>
            <!-- timeType时间类型 ：1、可用 2、已用 3、保留-->
            <div v-if="timeClinic && timeClinic[0]">
              <div v-for="(temp, j) in timeClinic" :key='j'>
                <span>{{temp.deviceName}}</span>
                <ul v-if="temp.timeList&&temp.timeList[0]" class="timeTable">
                  <li
                  v-for="(item, i) in temp.timeList"
                  :key="i"
                  @click="changeTime(item, j)"
                  :class="{on: item.timeType==='1'&& item.id === timeId,gray: item.timeType === '2'}">
                  {{item.startTimeStr}}
                  </li>
                </ul>
                <ul v-else>暂无可预约时段</ul>
              </div>
            </div>
            <div v-else>暂无可预约时段</div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import age from '@/components/age'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import selectTime from '@/arrange/page/register/selecttime.vue'
import templateapi from '@/arrange/store/templateapi'
import api from '@/arrange/store/addinspectapi'
// import { setTimeout } from 'timers'
import { validateMobile } from '@/crm/util/common'
export default {
  data () {
    return {
      api,
      templateapi,
      visible: false,
      isShow: true,
      isDisable: false,
      form: {
        patient: {
          // agebirthday: {},
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: ''
        }
      },
      form1: {
        program: null,
        selectDept: {},
        appointmentDate: '',
        ward: {},
        timeRange: '',
        isSceneAppoint: 0,
        time: null,
        hasDocAdviceFlag: '0',
        remarks: ''
      },
      programOption: [],
      isReset: '',
      timerange: '',
      addWay: '',
      selected: [],
      radioed: '',
      tableData: [],
      roomOptions: [],
      timeId: '',
      serviceData: [],
      serviceData1: [],
      timeParam: {
        projectId: '',
        appointmentDate: '',
        deviceId: ''
      },
      timeClinic: [],
      timeSlice: [],
      timeOption: [],
      addParams: {},
      projectId: '',
      params: { offset: 0, pagesize: 50, serviceClassificationList: ['800', '802'], serviceBelongType: 2 },
      dateFlag: false,
      typeOption: [
        { id: '0', name: '无医嘱' },
        { id: '1', name: '有医嘱' }
      ],
      deviceId: '',
      rules: {
        required: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        requiredObject: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object' }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'array' }
        ]
      }
    }
  },
  created () {
    this.getService(this.params)
  },
  watch: {
    'form1.program': {
      handler (val) {
        // 没有code就会不发请求
        if (val && val.code) {
          this.dateFlag = true
          this.timeParam.deviceId = ''
          this.timeParam.projectId = val.code
          this.form1.ward = {}
          this.form1.time = {}
          this.form1.timeClinic = []
          this.timeOption = []
        } else {
          this.timeParam.projectId = ''
          this.form1.time = {}
          this.form1.timeClinic = []
          this.timeOption = []
        }
      },
      deep: true
    },
    'form1.appointmentDate' (val) {
      if (val) {
        this.timeParam.appointmentDate = val
        this.form1.ward = {}
        this.form1.time = {}
        this.form1.timeClinic = []
        this.timeOption = []
      } else {
        this.timeParam.appointmentDate = ''
        this.form1.ward = {}
        this.form1.time = {}
        this.form1.timeClinic = []
        this.timeOption = []
      }
    },
    'timeParam': {
      handler (val) {
        if (val && val.appointmentDate && val.projectId) {
          // if (this.dateFlag) {
          //   this.timeParam.deviceId = ''
          //   this.getClinicHnTime(val)
          // }
        } else {
          this.timeSlice = []
          this.timeOption = []
        }
      },
      deep: true
    },
    'form1.hasDocAdviceFlag' (val) {
      if (val) {
        if (val === '1') {
          this.params.name = ''
          if (this.form.patient && this.form.patient.id) {
            this.getProgram(this.form.patient.id)
          }
        } else {
          this.getService(this.params)
        }
      }
    },
    'form.patient.name' (val) {
      if (!val) {
        this.form.patient.id = ''
      }
    }
  },
  methods: {
    inputTrigger () {
      this.$set(this.form.patient, 'mobile', validateMobile(this.form.patient.mobile))
    },
    changeFlag (val) {
      this.form1.program = {}
      if (val && val.code) {
        this.dateFlag = true
        this.timeParam.deviceId = ''
        this.timeParam.projectId = val.code
        this.form1.ward = {}
        this.form1.time = {}
        this.form1.timeClinic = []
        this.timeOption = []
      } else {
        this.timeParam.projectId = ''
        this.form1.time = {}
        this.form1.timeClinic = []
        this.timeOption = []
      }
    },
    async open (val) {
      this.resetPatient()
      this.dateFlag = false
      this.visible = true
      this.timeId = ''
      if (val && val.patientId) {
        this.addParams = val
        let params = {
          executeId: val.executeId || '',
          appointmentRecordId: val.appointmentRecordId || '',
          patientId: val.patientId || '',
          deptId: val.deptId || '',
          dataType: val.searchType
        }
        const res = await this.api.getDetail(params)
        if (res && res.data) {
          this.isDisable = true
          let obj = res.data
          this.form.patient = {
            name: obj.patientName,
            sex: obj.sex,
            birthday: obj.birthday,
            age: obj.age,
            mobile: obj.phone,
            patientId: obj.patientId,
            // agebirthday: {
            //   age: obj.age,
            //   birthday: obj.birth,
            //   isShow: false
            // }
          }
          if (obj.deptId && obj.deptName) {
            let obj1 = {
              deptId: obj.deptId,
              deptName: obj.deptName,
              id: obj.deptId,
              name: obj.deptName
            }
            this.form1.selectDept = obj1
          }
          if (obj.hasDocAdviceFlag) {
            this.form1.hasDocAdviceFlag = obj.hasDocAdviceFlag
          }
          if (obj.executeId) {
            this.form1.executeId = obj.executeId
          }
          if (obj.projectId && obj.projectName && obj.serviceClassification) {
            this.form1.program = {
              id: obj.projectId,
              code: obj.code,
              name: obj.projectName,
              serviceClassification: obj.serviceClassification
            }
            if (obj.hasDocAdviceFlag && obj.hasDocAdviceFlag === '0') {
              this.serviceData.push(this.form1.program)
            } else {
              this.serviceData1.push(this.form1.program)
            }
          }
          // 加急标识
          if (Number(obj.isEmergency)) {
            this.form1.program.isEmergency = obj.isEmergency
          }
          if (obj.appointmentDate) {
            this.form1.appointmentDate = this.$moment(obj.appointmentDate).format('YYYY-MM-DD')
            this.timeParam.appointmentDate = this.$moment(obj.appointmentDate).format('YYYY-MM-DD')
            this.dateFlag = false
          } else {
            this.form1.appointmentDate = ''
          }
          if (obj.remarks) {
            this.form1.remarks = obj.remarks
          } else {
            this.form1.remarks = ''
          }
          this.timeParam.projectId = obj.code
          // 时间相关逻辑
          if (obj.startTimeStr && obj.endTimeStr) {
            let obj1 = {
              startTimeStr: obj.startTimeStr,
              endTimeStr: obj.endTimeStr,
              deviceId: obj.deviceId
            }
            this.timeClinic = []
            this.timeOption = []
            this.roomOptions = []
            if (this.timeParam.appointmentDate && this.timeParam.projectId) {
              this.api.getClinicHnTime(this.timeParam).then(rs => {
                if (rs && rs.data) {
                  // 时间源逻辑
                  this.timeId = ''
                  this.form1.time = obj1
                  this.timeOption.push(obj1)
                  this.timeClinic = rs.data
                  // 诊室逻辑
                  let data = rs.data.map(v => {
                    let obj2 = {
                      resourceId: v.deviceId,
                      resourceName: v.deviceName
                    }
                    return obj2
                  })
                  this.roomOptions = data
                  let arrayWard = rs.data.filter(v => {
                    if (v && v.deviceId && v.deviceId === obj.deviceId) {
                      return v
                    }
                  })
                  if (arrayWard && arrayWard[0]) {
                    this.form1.ward = {
                      resourceName: arrayWard[0].deviceName,
                      resourceId: arrayWard[0].deviceId
                    }
                  }
                } else {
                  this.form1.time = obj1
                  this.timeOption.push(obj1)
                  this.roomOptions = []
                }
              })
            }
          } else {
            this.form1.time = {
              startTimeStr: '',
              endTimeStr: '',
              deviceId: ''
            }
          }
          let params = {
            patientId: obj.patientId,
            projectId: obj.code
          }
          if (params.patientId && params.projectId) {
            this.getOldList(params)
          }
        }
      } else {
        this.addParams = {}
        this.resetPatient()
      }
    },
    formworkbean (obj) {
      obj = JSON.parse(JSON.stringify(obj))
      this.resetPatient()
      this.visible = true
      this.$nextTick(_ => {
        this.form1.hasDocAdviceFlag = '1'
        this.form.patient = obj
        this.form.patient.patientId = obj.id
        this.form.patient.birthday = obj.birthday
        // this.$set(this.form.patient, 'agebirthday', {
        //   age: obj.age,
        //   birthday: obj.birthday,
        //   isShow: false
        // })
        this.getProgram(this.form.patient.patientId)
      })
    },
    close () {
      this.resetPatient()
      this.visible = false
    },
    clickBtn () {
      this.$refs.form.validate(valid1 => {
        this.$refs.form1.validate(valid2 => {
          if (valid1 && valid2) {
            let data = {
              checkAppointmentRecordId: this.form1.checkAppointmentRecordId || '',
              appointmentRecordId: this.addParams.appointmentRecordId || '',
              executeId: this.addParams.executeId,
              patientId: this.form.patient.patientId || this.form.patient.id,
              patientName: this.form.patient.name,
              sex: this.form.patient.sex,
              phone: this.form.patient.phone || '',
              birthday: this.form.patient.birthday || '',
              age: this.form.patient.age || '',
              projectId: this.form1.program.code, // 修改为code
              projectName: this.form1.program.name,
              deptId: this.form1.selectDept.id || '',
              deptName: this.form1.selectDept.name || '',
              // diagId: this.form1.ward.resourceId || '', // 诊室
              // diagName: this.form1.ward.resourceName || '',
              appointmentDate: this.form1.appointmentDate,
              startTimeStr: this.form1.time && this.form1.time.startTimeStr ? this.form1.time.startTimeStr : '',
              endTimeStr: this.form1.time && this.form1.time.endTimeStr ? this.form1.time.endTimeStr : '',
              deviceId: this.deviceId || '',
              remarks: this.form1.remarks, // 诊室
              isSendSms: this.form1.isSendMessage ? 1 : 0,
              serviceClassification: this.form1.program.serviceClassification || '',
              hasDocAdviceFlag: this.form1.hasDocAdviceFlag
            }
            let allparams = {}
            allparams.patientName = this.form.patient.name
            allparams.phoneNumber = this.form.patient.phone || this.form.patient.mobile
            this.api.addOrUpdateAppoint(data).then(rs => {
              if (rs) {
                if (rs.head && rs.head.errCode === 0) {
                  this.$messageTips(
                    this,
                    'success', data.appointmentRecordId ? '改约成功' : '预约成功',
                    '提示')
                  this.$emit('success', { sendMessage: this.form1.isSendMessage, isSceneAppoint: this.form1.isSceneAppoint, patient: [this.form.patient], allparams: allparams })
                  this.close()
                } else {
                  this.form1.time = {}
                  this.form1.timeClinic = []
                  this.timeOption = []
                  this.timeId = ''
                  this.timeClinic = []
                  this.getClinicHnTime(this.timeParam)
                }
              }
            })
          } else {
            this.$formAutofocus()
          }
        })
      })
    },
    selectPatient (val) {
      if (val) {
        this.form.patient = val
        if (this.form.patient && this.form.patient.id) {
          if (this.form1.hasDocAdviceFlag === '1') {
            this.getProgram(this.form.patient.id)
          } else {
            this.getService(this.params)
          }
        }
      }
    },
    resetPatient () {
      this.isDisable = false
      this.form.patient = {
        name: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: '',
        patientId: '',
        // agebirthday: {
        //   age: '',
        //   isMonth: 0,
        //   birthday: '',
        //   isDay: 0,
        //   isShow: false
        // }
      }
      this.form1.selectDept = {}
      this.form1.program = null
      this.form1.ward = {}
      this.form1.time = null
      this.form1.remarks = ''
      this.form1.appointmentDate = ''
      this.form1.checkAppointmentRecordId = ''
      this.timeClinic = []
      this.timeParam = {
        projectId: '',
        appointmentDate: '',
        deviceId: ''
      }
    },
    setTimesliceId (val) {
      this.form1.timesliceId = val.timesliceId
      this.form1.appointmentStarttime = val.startTimeStr
      this.form1.appointmentEndtime = val.endTimeStr
    },
    setSelectData (val) {
      this.selected = val
    },
    setCurrentData (val) {
      if (!val) { return }
      this.radioed = val
      this.selected = [val]
      if (val.appointmentRecordId) {
        this.form1.checkAppointmentRecordId = val.appointmentRecordId
      }
      if (val.deptId && val.deptName) {
        let obj1 = {
          id: val.deptId,
          name: val.deptName,
          isSource: true
        }
        this.form1.selectDept = obj1
      } else {
        this.form1.selectDept = {}
      }
      if (val.serviceClassification) {
        this.form1.program.serviceClassification = val.serviceClassification
      }
      if (val.appointmentDate) {
        this.form1.appointmentDate = this.$moment(val.appointmentDate).format('YYYY-MM-DD')
        this.timeParam.appointmentDate = this.$moment(val.appointmentDate).format('YYYY-MM-DD')
        this.dateFlag = false
      } else {
        this.form1.appointmentDate = ''
      }
      if (val.startTimeStr && val.endTimeStr) {
        let obj = {
          startTimeStr: val.startTimeStr,
          endTimeStr: val.endTimeStr,
          deviceId: val.deviceId
        }
        this.timeClinic = []
        this.timeOption = []
        this.roomOptions = []
        if (this.timeParam.appointmentDate && this.timeParam.projectId) {
          this.api.getClinicHnTime(this.timeParam).then(rs => {
            if (rs && rs.data) {
              // 号源逻辑
              this.timeId = ''
              this.form1.time = obj
              this.timeOption.push(obj)
              this.timeClinic = rs.data
              // 诊室逻辑
              let data = rs.data.map(v => {
                let obj = {
                  resourceId: v.deviceId,
                  resourceName: v.deviceName
                }
                return obj
              })
              let arrayWard = rs.data.filter(v => {
                if (v && v.deviceId && v.deviceId === val.deviceId) {
                  return v
                }
              })
              let wardObj = {
                resourceId: arrayWard[0].deviceId,
                resourceName: arrayWard[0].deviceName
              }
              this.form1.ward = wardObj
              this.roomOptions = data
            } else {
              this.form1.time = obj
              this.timeOption.push(obj)
              this.roomOptions = []
            }
          })
        }
      } else {
        this.form1.time = {
          startTimeStr: '',
          endTimeStr: '',
          deviceId: ''
        }
      }
    },
    changeDate (val) {
      if (val) {
        this.form1.time = null
        this.form1.ward = null
        this.timeParam.deviceId = ''
        this.roomOptions = null
        if (this.timeParam.appointmentDate && this.timeParam.projectId) {
          this.getClinicHnTime(this.timeParam)
        }
      }
    },
    changeProgram (val) {
      if (val && val.code) {
        this.dateFlag = true
        this.timeParam.deviceId = ''
        this.timeParam.projectId = val.code
        this.form1.ward = {}
        this.form1.time = {}
        this.form1.timeClinic = []
        this.timeOption = []
        if (this.timeParam.appointmentDate && this.timeParam.projectId) {
          this.getClinicHnTime(this.timeParam)
        }
      } else {
        this.timeParam.projectId = ''
        this.form1.time = {}
        this.form1.timeClinic = []
        this.timeOption = []
      }
    },
    changeRoom (val) {
      if (val && val.resourceId) {
        this.form1.time = null
        this.timeOption = []
        this.deviceId = val.resourceId
        this.timeParam.deviceId = val.resourceId
        this.dateFlag = false
        if (this.timeParam.appointmentDate && this.timeParam.projectId) {
          this.api.getClinicHnTime(this.timeParam).then(rs => {
            if (rs && rs.data && rs.data[0]) {
              // 获取号源
              this.timeId = ''
              this.timeClinic = rs.data
            } else {
              this.timeClinic = []
            }
          })
        }
      } else {
        this.form1.time = null
        this.timeOption = []
        this.timeParam.deviceId = ''
        if (this.timeParam.appointmentDate && this.timeParam.projectId) {
          this.api.getClinicHnTime(this.timeParam).then(rs => {
            if (rs && rs.data && rs.data[0]) {
              // 获取号源
              this.timeId = ''
              this.timeClinic = rs.data
            } else {
              this.timeClinic = []
            }
          })
        }
      }
    },
    changeTime (val, j) {
      if (val && val.timeType && val.timeType === '2') {
        return
      }
      if (val && val.timeType && val.timeType === '3') {
        return
      }
      this.deviceId = this.timeClinic[j].deviceId
      this.timeId = val.id
      this.timeOption = []
      // this.roomOptions = []
      // 选择时间片的时候回显时间和诊室
      if (this.timeClinic[j].deviceId && this.timeClinic[j].deviceName) {
        this.form1.ward = {
          resourceId: this.timeClinic[j].deviceId,
          resourceName: this.timeClinic[j].deviceName
        }
        // this.roomOptions.push(this.form1.ward)
      } else {
        this.form1.ward = {}
      }
      if (val.startTimeStr && val.endTimeStr) {
        this.form1.time = {
          startTimeStr: val.startTimeStr,
          endTimeStr: val.endTimeStr,
          deviceId: val.id
        }
        this.timeOption.push(this.form1.time)
      } else {
        this.form1.time = {
          startTimeStr: '',
          endTimeStr: '',
          deviceId: ''
        }
      }
    },
    remoteMethod (query) {
      if (query) {
        this.params.name = query
        this.getService(this.params)
      } else {
        this.serviceData = []
      }
    },
    getRoomdata (params) {
      this.api.getClinicSource(params).then(rs => {
        if (rs && rs.data) {
          let data = rs.data.map(v => {
            let obj = {
              resourceId: v.id,
              resourceName: v.name
            }
            return obj
          })
          this.roomOptions = data
        }
      })
    },
    getService (params) {
      this.api.queryService(params).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.serviceData = rs.data
        }
      })
    },
    getClinicHnTime (params) {
      this.api.getClinicHnTime(params).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          // 获取号源
          this.timeId = ''
          this.timeClinic = rs.data
          this.deviceId = ''
          // 获取诊室
          let data = rs.data.map(v => {
            let obj = {
              resourceId: v.deviceId,
              resourceName: v.deviceName
            }
            return obj
          })
          this.roomOptions = data
        } else {
          this.timeClinic = []
          this.roomOptions = []
        }
      })
    },
    getOldList (params) {
      this.api.getOldList(params).then(rs => {
        if (rs && rs.data) {
          this.tableData = rs.data
        } else {
          this.tableData = []
        }
      })
    },
    getProgram (id) {
      this.api.list({ searchType: 1, serviceClassification: '800', patientId: id, offset: 0, pagesize: 50 }).then(rs => {
        if (rs && rs.data) {
          this.serviceData1 = rs.data.map(v => {
            let obj = {
              serviceClassification: '800',
              id: v.projectId,
              code: v.projectId,
              name: v.projectName,
              isEmergency: v.isEmergency
            }
            return obj
          })
        }
      })
    }
  },
  components: {
    age,
    deptCascader,
    selectTime
  }
}
</script>
<style scoped>
#inspectAdd .el-row {
  padding-right: 10px;
}
#inspectAdd .el-row .el-col:nth-child(2) {
  padding-left: 10px;
}
#inspectAdd .el-row .line {
  border-right: 1px solid #ddd;
}
#inspectAdd .line_b {
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}
#inspectAdd .form1 {
  margin-top: 15px;
}
#inspectAdd h4 {
  border-left: 3px solid #1c7bef;
  padding-left: 3px;
}
#inspectAdd .timeTable {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-left: 0px;
}
#inspectAdd .timeTable li {
  box-sizing: border-box;
  flex: 0 0 25%;
  height: 33px;
  line-height: 33px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-left: -1px;
  position: relative;
  text-align: center;
}
#inspectAdd .timeTable li:nth-child(1) {
  border-top: 1px solid #ddd;
}
#inspectAdd .timeTable li:nth-child(2) {
  border-top: 1px solid #ddd;
}
#inspectAdd .timeTable li:nth-child(3) {
  border-top: 1px solid #ddd;
}
#inspectAdd .timeTable li:nth-child(4) {
  border-top: 1px solid #ddd;
}
#inspectAdd .timeTable li span {
  position: absolute;
  left: 8px;
}
#inspectAdd .timeTable .on {
  background: #1c7bef;
  color: #fff;
  cursor: pointer;
}
.gray {
  background: #bbb;
}
.el-select.program_sl /deep/ .el-input__inner{
  height: 40px!important;
}
.emergency{
  display: inline-block;
  color: #fa5555;
  background: #fee;
  border:1px solid #fdbbbb;
  width:38px;
  height:38px;
  line-height: 38px;
  text-align:center;
  font-size: 14px;
  margin-left:-6px;
  position: relative;
  z-index:9999;
  border-radius: 0px 4px 4px 0px;
}
</style>

