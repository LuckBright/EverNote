<template>
    <el-dialog
    id="changeroom"
    :visible.sync="visible"
    title="给号"
    class="ui_dialog_02 spe">
    <el-row>
        <el-col :span="8"><span class="patient">{{medicalObj.patientName}}</span>
        <sys-value type="GBT.2261.1" :code="medicalObj.patientSex"></sys-value> /
        {{medicalObj.patientBirth | formatDateByExp('YYYY-MM-DD')}}</el-col>
        <el-col :span="8">
            <span class="label_name">病历编号:</span>
            <span class="content">{{medicalObj.medicalRecordNumber}}</span>
        </el-col>
        <el-col :span="8">
            <span class="label_name">排队号:</span>
            <span class="content">{{medicalObj.queueNum}}</span>
        </el-col>
    </el-row>
    <div class="scroll_box">
        <div v-if="medicalData && medicalData[0]">
            <div class="medical_wrap" v-for="(item,i) in medicalData" :key="i">
                <el-row class="medicalList">
                    <el-col :span="8">
                        <span class="label_name">医嘱名称:</span>
                        <span class="content">{{item.adviceName}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="label_name">用法:</span>
                        <span class="content">{{item.employTxt}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="label_name">交费状态:</span>
                        <span class="content cGreen">{{item.isPid==='1'?'已支付':'未支付'}}</span>
                    </el-col>
                </el-row>
                 <el-row class="medicalList">
                    <el-col :span="8">
                        <span class="label_name">执行科室:</span>
                        <span class="content">{{item.excuteProviderName}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="label_name">开单科室:</span>
                        <span class="content">{{item.providerName}}</span>
                    </el-col>
                 </el-row>
            </div>
        </div>
        <div class="noData" v-else>暂无医嘱</div>
     </div>
     <el-form :inline="true" :model="form" class="form" ref="form">
       <el-row>
         <el-col :span="20">
            <el-form-item label="分配诊室" prop="roomObj" :rules="rules.requiredObject">
                <el-select v-model.trim="form.roomObj" value-key="resourceId"  clearable placeholder="请选择诊室" :disabled="false">
                    <el-option
                        v-for="item in roomOption"
                        :key="item.resourceId"
                        :label="item.resourceName"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" v-if="medicalObj&&!medicalObj.queueNum&&medicalObj.deptId" @click="divideTriage" v-ever-click-once="disabled" :disabled="disabled">给号</el-button>
              <el-button type="primary" size="medium" v-if="medicalObj&&medicalObj.queueNum&&medicalObj.deptId" @click="changeStation" v-ever-click-once="isStation" :disabled="isStation">更换诊室</el-button>
              <el-button size="medium" v-if="medicalObj&&medicalObj.queueNum&&medicalObj.deptId" @click="changeStationTriage" v-ever-click-once="isTriage" :disabled="isTriage">更换并重新给号</el-button>
            </el-form-item>
         </el-col>
         <el-col :span="4">
            <el-form-item class="tl">
              <el-button size="medium" v-if="medicalObj&&medicalObj.queueNum" @click="handlePrint">重新打印号条</el-button>
            </el-form-item>
         </el-col>
       </el-row>
      </el-form>
    </el-dialog>
</template>
<script>
import api from '@/arrange/store/medicaltriagetabapi'
import tempapi from '@/arrange/store/templateapi'
import {frPrint} from '@/util/print'
export default {
  props: ['patientId'],
  data () {
    return {
      api,
      tempapi,
      form: {
        roomObj: ''
      },
      visible: false,
      medicalObj: {},
      medicalData: [],
      patientId1: '',
      roomOption: [],
      deptId: '',
      divideObj: {
        appointmentId: '',
        stationId: '',
        stationName: ''
      },
      printCode: 'JIAO_HAO_TIAO',
      serviceId: [],
      stationId: '',
      disabled: false,
      isStation: false,
      isTriage: false,
      rules: {
        requiredNo: [
          {required: false}
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredObject: [
          { required: true, message: '必填项', trigger: ['change'], type: 'object' }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ]
      }
    }
  },
  created () {
  },
  watch: {
    'form.roomObj' (val) {
      if (val && val.resourceId && val.resourceName) {
        this.divideObj.stationId = val.resourceId
        this.divideObj.stationName = val.resourceName
        this.stationId = val.resourceId
        console.log(this.stationId, 'this.stationId')
      }
    }
  },
  methods: {
    open (val) {
      this.visible = true
      this.patientId1 = val.patientId || val.id
      let deptId = val.deptNew || val.deptId // 科室id
      if (this.patientId1 && deptId) {
        this.getTriagemessage(deptId, this.patientId1)
      }
    },
    close () {
      this.patientId1 = ''
      this.form.roomObj = ''
      this.visible = false
    },
    divideTriage () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        let params = {
          appointmentId: '',
          patientId: this.medicalObj.patientId,
          stationId: this.form.roomObj.resourceId,
          stationName: this.form.roomObj.resourceName,
          serviceId: this.serviceId,
          deptId: this.medicalObj.deptId
        }
        if (params.patientId && params.stationId && params.stationName && params.serviceId && params.deptId) {
          this.api.divideTriage(params).then(rs => {
            if (rs.head.errCode === 0) {
              this.close()
              this.$messageTips(this, 'success', '给号成功')
              this.handlePrint()
              this.$emit('reload')
            }
          })
        }
      })
    },
    changeStation () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        let params = {
          appointmentId: this.medicalObj.appointmentId,
          patientId: this.medicalObj.patientId,
          stationId: this.form.roomObj.resourceId,
          stationName: this.form.roomObj.resourceName
        }
        if (params.appointmentId && params.patientId && params.stationId && params.stationName) {
          this.api.changeStation(params).then(rs => {
            if (rs.head.errCode === 0) {
              this.close()
              this.$messageTips(this, 'success', '更换诊室成功')
              this.$emit('reload')
            }
          })
        }
      })
    },
    changeStationTriage () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.divideObj.stationId && this.divideObj.stationName) {
          this.api.changeStationTriage(this.divideObj).then(rs => {
            if (rs.head.errCode === 0) {
              this.close()
              this.$messageTips(this, 'success', '成功')
              this.handlePrint()
              this.$emit('reload')
            }
          })
        }
      })
    },
    getTriagemessage (deptId, id) {
      this.api.getTriagemessage({deptId: deptId, patientId: id}).then(rs => {
        if (rs && rs.data) {
          this.medicalObj = rs.data
          if (rs.data && rs.data.doctorAdvice && rs.data.doctorAdvice[0]) {
            rs.data.doctorAdvice.forEach(v => {
              if (v.serviceId) {
                this.serviceId.push(v.serviceId)
              }
            })
            this.medicalData = rs.data.doctorAdvice
          } else {
            this.medicalData = []
          }
          if (rs.data.deptId) {
            this.deptId = rs.data.deptId
            // this.getRoomdata(this.deptId)
            this.triageConfigList(this.deptId)
          }
          if (rs.data.stationId && rs.data.stationName) {
            this.form.roomObj = {
              resourceId: rs.data.stationId,
              resourceName: rs.data.stationName
            }
          }
          if (rs.data.appointmentId) {
            this.divideObj.appointmentId = rs.data.appointmentId
          }
        } else {
          this.medicalObj = {}
          this.medicalData = []
        }
      })
    },
    // 根据科室获取诊室
    triageConfigList (id) {
      this.api.triageConfigList({deptId: id, resourceType: 'SPACE_CONSULTING_ROOM'}).then(rs => {
        if (rs && rs.data && rs.data.resultList && rs.data.resultList[0]) {
          let data = rs.data.resultList.filter(v => {
            return v.triageType && v.triageType === 1
          })
          this.roomOption = data
        }
      })
    },
    //  根据科室获取诊室
    getRoomdata (deptId) {
      this.tempapi.getRoomdata({
        deptId: deptId,
        isValid: 1,
        resourceType: 'SPACE_CONSULTING_ROOM'
      }).then(rs => {
        if (rs && rs.data && rs.data.resultList && rs.data.resultList[0]) {
          let data = rs.data.resultList.map(v => {
            let obj = {
              resourceId: v.id,
              resourceName: v.resourceName
            }
            return obj
          })
          this.roomOption = data
        }
      })
    },
     // 打印
    handlePrint () {
      if (this.medicalObj && this.medicalObj.patientId && this.stationId) {
        frPrint(this.printCode, {patientId: this.medicalObj.patientId, stationId: this.stationId})
      }
    }
  }
}
</script>
<style scoped>
.medicalList{background: #F4F4F4;padding:10px;font-size:14px;}
.medical_wrap{padding:10px 0;border-bottom: 1px solid #ccc;}
#changeroom /deep/ .el-dialog .el-dialog__body{padding:15px;padding-top:0px;}
.label_name{color: #666666;}
.content{color: #000000;}
.cGreen{color: #47B104;}
#changeroom /deep/ .el-input .el-input__inner{height:32px;line-height: 32px;}
#changeroom .patient{font-size: 16px;font-weight: 700;}
#changeroom /deep/ .el-dialog .el-dialog__header .el-dialog__title{font-size: 16px;font-weight: 700;}
.el-form {margin-top: 10px;}
.el-form .el-form-item{height: 30px;line-height: 30px;}
.noData{min-height: 50px;background: #F4F4F4;text-align: center;line-height: 50px;margin-top: 10px;}
.tl{text-align: right;}
#changeroom /deep/ .el-dialog .el-dialog__body{height:100%;display: flex;flex-direction:column;overflow: hidden;    padding-bottom: 24px;}
#changeroom /deep/ .el-dialog .scroll_box{flex:1;overflow: auto;}
</style>
