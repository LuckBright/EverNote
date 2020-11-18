<template>
  <div class="patient_info">
    <dialogCom ref='dialogCom' v-if="visible" v-model='visible' :title='title' :dis='savedisabled' @save='save' :showbtn='showbtn' @info='info'  :hospitalizedNumber='patient.hospitalizedNumber'>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-row>
                <el-col :span='12'>
                    <el-form-item label="床号:" prop="bed">
                        <el-input v-model="form.bed" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item  label="入科时间:" prop="hospitalTime">
                    <el-date-picker
                    class='wb100'
                     :disabled="type === 'cancle_allocated' || type === 'patient_info'"
                      v-model="form.hospitalTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      :pickerOptions="{
                          disabledDate 
                        }"
                    ></el-date-picker>
                </el-form-item>
                </el-col>
                 
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label="主治医师:" prop="chargeDoctorId">
                        <el-select :disabled="type === 'cancle_allocated'" filterable clearable placeholder="请选择" class="wb100" v-model="form.chargeDoctorId" value-key="doctorId">
                        <el-option
                            v-for="item in doctorIdOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="住院医师:" prop="admitDoctorId">
                        <el-select :disabled="type === 'cancle_allocated'" filterable clearable placeholder="请选择" class="wb100" v-model="form.admitDoctorId" value-key="doctorId">
                        <el-option
                            v-for="item in doctorIdOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item  label="责任护士:" prop="primaryNurseId">
                        <el-select :disabled="type === 'cancle_allocated'" filterable clearable placeholder="请选择" class="wb100" v-model="form.primaryNurseId" value-key="id">
                        <el-option
                            v-for="item in primaryNurseIdOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                 <el-col :span='12'>
                    <el-form-item label="接诊护士:" prop="receptionNurseId">
                        <el-select :disabled="type === 'cancle_allocated'" filterable clearable placeholder="请选择" class="wb100" v-model="form.receptionNurseId" value-key="id">
                        <el-option
                            v-for="item in primaryNurseIdOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </el-form-item>
                 </el-col>
                 <el-col :span='12'>
                    <el-form-item label="护理级别:" prop="nursinglevel">
                         <sys-type
                          clearable
                          placeholder="请选择"
                          size="mini"
                          code="CV06.00.220"
                          :disabled="type === 'cancle_allocated'"
                          v-model="form.nursinglevel"
                        ></sys-type>
                    </el-form-item>
                 </el-col>
                 <el-col :span='12'>
                    <el-form-item  label="病情:" prop="condition">
                        <sys-type
                          clearable
                          placeholder="请选择"
                          size="mini"
                          code="THC_CPOE_ZYBQZT"
                          :disabled="type === 'cancle_allocated'"
                          v-model="form.condition"
                        ></sys-type>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if='print'>
                 <el-col :span='24'>
                    <el-form-item label="打印:" prop="">
                        <el-checkbox v-model="form.bedCard" style="line-height:32px!important;">床头卡打印</el-checkbox>
                        <el-checkbox v-model="form.wristCard" style="line-height:32px!important;">腕带打印</el-checkbox>
                    </el-form-item>
                 </el-col>
            </el-row>
            <el-row v-if='!showbtn' class="back">
                {{infos.entranceNurseName || '--'}}于{{infos.entranceTime  | formatDateByExp("YYYY-MM-DD HH:mm")}}为{{infos.patientName || '--'}}办理入科 <span @click='cancle'  v-ever-click-once="disabled">取消入科</span>
            </el-row>
            <div  v-if='historyList.length > 0'>
              <el-row class="back" v-for='item in historyList' :key='item.id'>
                  {{item.operaterName || '--'}}于{{item.operaterTime  | formatDateByExp("YYYY-MM-DD HH:mm")}}为{{item.patientName || '--'}}办理{{item.operateName}}
              </el-row>
            </div>
        </el-form>
    </dialogCom>
  </div>
</template>
<script>
import dialogCom from './dialog.vue'
import api from '@/inpatient/store/resident.js'
import { objFind } from '@/util/common'
export default {
  props: ['areaId', 'areaName'],
  data () {
    return {
      api,
      title: '',
      visible: false,
      patient: {},
      bed: {},
      print: false,
      showbtn: true,
      form: {
        bed: '',
        chargeDoctorId: '',
        admitDoctorId: '',
        primaryNurseId: '',
        receptionNurseId: '',
        condition: '',
        nursinglevel: '',
        hospitalTime: ''
      },
      doctorIdOptions: [],
      primaryNurseIdOptions: [],
      rules: {
        hospitalTime: [
            { required: true, message: '请选择入科时间', trigger: 'change', type: 'string' }
        ],
        bed: [
            { required: true, message: '请选择床位', trigger: 'change', type: 'string' }
        ],
        chargeDoctorId: [
            { required: true, message: '请选择主治医生', trigger: 'change', type: 'string' }
        ],
        admitDoctorId: [
            { required: true, message: '请选择住院医生', trigger: 'change', type: 'string' }
        ],
        primaryNurseId: [
            { required: true, message: '请选择责任护士', trigger: 'change', type: 'string' }
        ],
        nursinglevel: [
           { required: false, message: '请选择护理级别', trigger: 'change', type: 'string' }
        ]
      },
      type: '',
      infos: {},
      disabled: false,
      nursinglevelOptions: [],
      historyList: [],
      savedisabled: false,
      admitTime: ''
    }
  },
  watch: {

  },
  components: {
    dialogCom
  },
  methods: {
    disabledDate (time) {
      if (this.admitTime) {
        return time.getTime() + (3600000 * 24) < this.admitTime
      }
      return true
    },
    refales () {
      this.$bus.$emit('global:listwating')
      this.$emit('success')
      this.visible = false
    },
    async queryAreaOperateList () {
      let res = await this.api.queryAreaOperateList({
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
      if (res && res.data) this.historyList = res.data || []
    },
    async getDefault () {
      let res = await this.api.getApplyByHospitalizedNumberList({
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
        .catch(_ => {
          this.refales()
        })
      if (res.data) {
        let obj = res.data
        if (obj.admitTime) this.admitTime = new Date(obj.admitTime).getTime()
        if (String(this.patient.source) === '1') {
          let iconList = obj.iconList || {}
          if (obj.chargeDoctorId) this.form.chargeDoctorId = obj.chargeDoctorId
          if (obj.admitDoctorId) this.form.admitDoctorId = obj.admitDoctorId
          if (obj.admitSituation) this.form.condition = obj.admitSituation
          if (iconList.nursinglevel) this.form.nursinglevel = iconList.nursinglevel
          this.$refs.dialogCom.patientinfo(res.data)
        }
      }
    },
    setValue () {
      if (this.infos.bedName && this.type !== 'allocated') this.form.bed = this.infos.bedName
      if (this.infos.condition) this.form.condition = this.infos.condition
      if (this.infos.hospitalTime) this.form.hospitalTime = this.$moment((this.infos.hospitalTime)).format('YYYY-MM-DD HH:mm:ss')
      if ((this.infos.chargeDoctorId || this.infos.admitDoctorId) && this.doctorIdOptions.length > 0) {
        let chargeDoctorId = objFind(this.doctorIdOptions, {id: this.infos.chargeDoctorId})
        let admitDoctorId = objFind(this.doctorIdOptions, {id: this.infos.admitDoctorId})
        this.form.chargeDoctorId = chargeDoctorId && chargeDoctorId.id || '' // 主治医师
        this.form.admitDoctorId = admitDoctorId && admitDoctorId.id || '' // 住院医师
      }
      if ((this.infos.primaryNurseId || this.infos.receptionNurseId) && this.primaryNurseIdOptions.length > 0) {
        let primaryNurseId = objFind(this.primaryNurseIdOptions, {id: this.infos.primaryNurseId})
        let receptionNurseId = objFind(this.primaryNurseIdOptions, {id: this.infos.receptionNurseId})

        this.form.primaryNurseId = primaryNurseId && primaryNurseId.id || '' // 责任护士
        this.form.receptionNurseId = receptionNurseId && receptionNurseId.id || '' // 接诊护士
      }
      if (this.infos.nursinglevel) this.form.nursinglevel = this.infos.nursinglevel

        // this.form.chargeDoctorId = obj.chargeDoctorId // 主治医师
        // this.form.admitDoctorId = obj.admitDoctorId // 住院医师
        // this.form.primaryNurseId = obj.primaryNurseId // 责任护士
        // this.form.receptionNurseId = obj.receptionNurseId // 接诊护士
    },
    async info (obj) {
      this.infos = obj || {}
      this.setValue()
    },
    async getDoctor (providerId) { // 获取科室关联医生
      let res = await this.api.getTenantSubjectListHasStaffByCondition({
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          idList: [providerId]
        },
        outStaffGetStaffListByConditionReqDTO: {
          typeCodeList: ['DOCTOR'],
          orgIdList: [this.$store.state.currentUser.organizationId + '']
        }
      })
      if (res.data && res.data.resultList) {
        this.doctorIdOptions = []
        let data = res.data.resultList || []
        data.forEach(element => {
          element.tsStaffList.forEach(ele => {
            this.doctorIdOptions.push(ele)
          })
        })
        this.setValue()
      }
    },
    async getNurse () { // 获取病区关联护士
      let res = await this.api.getStaffListByCondition({
        sickAreaIdList: [this.areaId],
        typeCodeList: ['NURSE'],
        orgIdList: [this.$store.state.currentUser.organizationId + '']
      })
      if (res.data && res.data.resultList) {
        this.primaryNurseIdOptions = []
        let data = res.data.resultList || []
        data.forEach(element => {
          this.primaryNurseIdOptions.push(element)
          this.setValue()
        })
        if (this.type === 'allocated') {
          this.primaryNurseIdOptions.forEach(ele => {
            if (ele.id === this.$store.state.currentUser.userId) this.form.receptionNurseId = ele.id
          })
        }
      }
    },
    async open ({person, bed}, type) {
      this.type = type
      this.visible = true
      this.patient = JSON.parse(JSON.stringify(person))
        // print-- 是否有打印按钮  showbtn 是否显示提交按钮
      if (type === 'allocated') {
        this.title = '入科分床'
        this.print = true
        this.showbtn = true
        this.getDefault()
        this.queryAreaOperateList()
        this.form.hospitalTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }
      if (type === 'cancle_allocated') {
        this.title = '取消入科'
        this.print = false
        this.showbtn = false
      }
      if (type === 'patient_info') {
        this.title = '患者信息'
        this.print = false
        this.showbtn = true
      } else {
        if (bed) {
          this.bed = JSON.parse(JSON.stringify(bed))
          this.form.bed = bed.bedName
        }
      }

      this.getDoctor(person.providerId)
      this.getNurse()
    },
    getName (type, id) { // id 到name的映射
      if (!id) return ''
      let name = ''
      let arr = null
      if (type === 'doctor') arr = this.doctorIdOptions
      if (type === 'nurse') arr = this.primaryNurseIdOptions
      arr.forEach(ele => {
        if (ele.id === id) name = ele.name
      })
      return name
    },
    async save () {
      if (this.form.hospitalTime) {
        if (this.$moment(this.form.hospitalTime).valueOf() < this.admitTime) {
          this.$notify({
            title: '提示',
            message: `入科时间不能早于入院登记时间！入院登记时间时间为：${this.$moment(this.admitTime).format('YYYY-MM-DD HH:mm')}`,
            type: 'warning'
          })
          return
        }
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.savedisabled = true
          let obj = {
            patientId: this.patient.patientId,
            patientName: this.patient.patientName,
            hospitalizedNumber: this.patient.hospitalizedNumber,
            providerId: this.patient.providerId,
            providerName: this.patient.providerName,
            areaId: this.areaId,
            areaName: this.areaName,
            roomId: this.bed.roomId,
            roomName: this.bed.roomName,
            bedId: this.bed.bedId || this.infos.bedId,
            bedName: this.bed.bedName,
            chargeDoctorId: this.form.chargeDoctorId, // 主治医师
            chargeDoctorName: this.getName('doctor', this.form.chargeDoctorId),
            admitDoctorId: this.form.admitDoctorId, // 住院医师
            admitDoctorName: this.getName('doctor', this.form.admitDoctorId),
            primaryNurseId: this.form.primaryNurseId, // 责任护士
            primaryNurseName: this.getName('nurse', this.form.primaryNurseId),
            receptionNurseId: this.form.receptionNurseId, // 接诊护士
            receptionNurseName: this.getName('nurse', this.form.receptionNurseId),
            condition: this.form.condition,
            source: this.patient.source,
            nursinglevel: this.form.nursinglevel,
            hospitalTime: this.form.hospitalTime
          }
          let res = {}
          let str = ''
          if (this.type === 'patient_info') {
            str = '更新患者信息成功!'
            res = await this.api.updateEntrance(obj).catch(_ => {
              this.refales()
            })
          } else if (this.type === 'allocated') {
            str = '分床成功!'
            res = await this.api.entrance(obj).catch(_ => {
              this.refales()
            })
            this.printFn()
          }
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              type: 'success',
              message: str
            })
            this.$bus.$emit('global:listwating')
            this.$emit('success')
            this.visible = false
          }
          this.savedisabled = false
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            if (isError.length) {
              if (isError[0].querySelector('input')) {
                isError[0].querySelector('input').focus()
              }
            }
          }, 1)
        }
      })
    },
    printFn (patient) {
      if (this.form.bedCard && this.form.wristCard) {
        this.$emit('print', this.patient, 'double')
      } else {
        if (this.form.bedCard) this.$emit('print', this.patient, 'dyctk')
        if (this.form.wristCard) this.$emit('print', this.patient, 'dywd')
      }
    },
    async cancle () {
      if (this.disabled) return
      let res = await this.api.cancelEntrance({
        patientId: this.patient.patientId,
        patientName: this.patient.patientName,
        hospitalizedNumber: this.patient.hospitalizedNumber
      }).catch(_ => {
        this.refales()
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: '取消入科成功'
        })
        this.$bus.$emit('global:listwating')
        this.$emit('success')
        this.visible = false
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.patient_info{
    
}
</style>
