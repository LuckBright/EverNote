<template>
  <el-popover
  v-model="show"
  placement="right"
  width="330"
  @show="clearPatient"
  trigger="click">
    <div class="title">
      <label>添加等待</label>
      <i class="el-icon-close" @click="show=false"></i>
    </div>
    <el-form :model="form" label-width="80px" label-position="right" ref="form">
      <el-form-item label="患者姓名" prop="patientName" :rules="rules.required">
        <ever-patient-select v-if="show" v-model="form.patientName" @select="selectPatient" :allow-create="true" @newuser="clearPatient"></ever-patient-select>
      </el-form-item>
      <!-- <el-form-item label="患者标签"><el-tag>标签二</el-tag></el-form-item> -->
      <el-form-item label="看者医生"><span>{{value.resourceName}}</span></el-form-item>
      <el-form-item label="看诊科室"><span>{{value.deptName}}</span></el-form-item>
      <el-form-item label="现场挂号">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="form.isSceneAppoint" style="display:inline-block">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="14" v-if="form.isSceneAppoint === 1">
            <el-checkbox v-model="form.isPhysicalExamination" :true-label="1" :false-label="0">预检</el-checkbox>
            <el-checkbox v-model="form.medicalRecordBook" :true-label="1" :false-label="0">病例本</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="看诊服务" prop="serviceid" :rules="rules.required">
        <sys-select
          v-model="form.serviceid"
          :options="serviceList">
        </sys-select>
      </el-form-item>
      <el-form-item label="预约备注"><el-input v-model="form.symptom" placeholder="请输入预约备注"></el-input></el-form-item>
    </el-form>
    <el-row class="footer">
      <el-col :span="24" align="center">
        <el-button type="primary" @click="addAppointWait"> 提交预约 </el-button>
      </el-col>
    </el-row>
    <div class="addblock" slot="reference">
      <span class="time">{{date}}</span>
      <strong><i class="iconfont icon-tianjia"></i> 添加等待</strong>
    </div>
  </el-popover>
</template>
<script>
  import api from '@/arrange/store/appointapi'
  export default {
    props: ['value', 'date', 'organ', 'title'],
    data () {
      return {
        api,
        show: false,
        form: {
          timeTrunkType: 1,
          appointmentResourceId: this.value.resourceId,
          appointmentDate: this.date,
          timerange: 10,
          channelId: 1,
          isSceneAppoint: 0,
          subsequentVisit: 0,
          appointmentType: 1,
          isMedicalInsurance: 0,
          medicalRecordBook: 0,
          isPhysicalExamination: 0,
          symptom: '',
          serviceid: '',
          organId: this.organ.organId,
          organName: this.organ.organName,
          deptId: this.value.deptId,
          deptName: this.value.deptName,
          patientName: '',
          patientId: ''
        },
        serviceList: [],
        rules: {
          required: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          requiredObject: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object'}
          ],
          requiredArray: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'array'}
          ]
        }
      }
    },
    watch: {
      organ: {
        handler (val) {
          this.form.organId = val.organId
          this.form.organName = val.organName
        },
        deep: true
      },
      value: {
        handler (val) {
          this.form.deptId = val.deptId
          this.form.deptName = val.deptName
          this.form.appointmentResourceId = val.resourceId
        },
        deep: true
      },
      date (val) {
        this.form.appointmentDate = val
      },
      show (val) {
        if (val) {
          this.getServiceList()
        }
      }
    },
    methods: {
      addAppointWait () {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return false
          }
          this.api.createAppointWait(this.form).then(rs => {
            if (rs.errCode) {
              return false
            }
            this.$notify({
              type: 'success',
              title: '预约成功',
              message: '患者' + this.form.patientName + '已预约成功',
              duration: 3000
            })
            this.show = false
            this.$emit('success', true)
          })
        })
      },
      selectPatient (val) {
        this.form.patientId = val.id
        this.form.channelId = val.source
      },
      clearPatient (val) {
        this.form.appointmentDate = this.date
        this.form.patientName = ''
        this.form.patientId = ''
      },
      getServiceList () {
        this.api.listServiceRange({
          timeTrunkType: 1,
          date: this.date,
          organId: this.organ.organId,
          deptId: this.value.deptId,
          resourceId: this.value.resourceId
        }).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.serviceList = rs.data.map(item => {
            return {id: item.serviceId, name: item.serviceName}
          })
        })
      }
    },
    components: {
    }
  }
</script>
<style scoped>
  .addblock{height: 62px; width: 136px; border: 1px dashed #aaa; border-left: 2px solid #aaa; padding: 5px; line-height: 1.2; cursor: pointer; display: inline-block; margin-bottom: 10px;  background: #fff;}
  .addblock span{display: block; font-size: 12px;margin-bottom: 8px;}
  .addblock strong{font-size: 12px; color: #666;}
  .addblock strong i.iconfont{font-size: 12px;}
  .title {font-size: 18px; font-weight: bold; margin-bottom: 20px;position: relative;}
  .title .el-icon-close{position: absolute; right: 0; top: 0; font-size: 20px; cursor: pointer;}
  .el-form-item {margin-bottom: 20px;}
  .el-form-item /deep/ >  * {line-height: 33px;}
  .footer {padding: 15px 0 4px; border-top: 1px solid #ddd;}
  .footer .el-button{width: 185px}
  .el-form /deep/ .el-radio + .el-radio,
  .el-form /deep/ .el-checkbox + .el-checkbox{margin-left: 10px;}
</style>
