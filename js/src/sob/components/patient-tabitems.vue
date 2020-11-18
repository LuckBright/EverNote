<template>
  <div>
    <div style="margin-bottom:10px">
      <el-button :type="item.name == currentHistory ? 'primary' : 'default'" v-for="(item,i) in items" @click="changeHistory(item.name)" :key="i" class="focusBtn"><i class="iconfont icon-tianjia" style="font-size: 12px"></i> {{item.label}}</el-button>
    </div>
    <el-form-item v-for="(item, i) in items" :key="i" v-show="item.name == currentHistory">
      <template v-if="item.name == 'bodyCheck'">
        <el-form :model="inspectForm" :rules="rules" ref="inspectForm">
          <el-form-item>
            <el-row class="examination">
              <el-col :span="4">
                <el-form-item prop="height">
                  <label>身高：</label> <el-input v-model="inspectForm.height" type="number"></el-input> cm
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="weight">
                  <label>体重：</label> <el-input v-model="inspectForm.weight" type="number"></el-input> kg
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="weight">
                  <label>BMI：</label> <el-input v-model="inspectForm.bmi" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="temperature">
                  <label>体温：</label> <el-input v-model="inspectForm.temperature" type="number" :class="[{ red : temFlag}, { normal : !temFlag}]"></el-input> ℃
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="pulse">
                  <label>脉搏：</label> <el-input v-model="inspectForm.pulse" type="number" :class="[{ red : pulseFlag}, { normal : !pulseFlag}]"></el-input> bpm
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row class="examination">
              <el-col :span="7">
                <el-form-item prop="highBloodPressure" style="display:inline-block;margin-right:0">
                  <label>血压：</label> <el-input style="width:5em" v-model="inspectForm.highBloodPressure" placeholder="收缩压" type="number" :class="[{ red : highFlag}, { normal : !highFlag}]"></el-input>
                </el-form-item> -
                <el-form-item prop="lowBloodPressure" style="display:inline-block;">
                  <el-input style="width:5em;margin-left:0;" v-model="inspectForm.lowBloodPressure" placeholder="舒张压" type="number" :class="[{ red : lowFlag}, { normal : !lowFlag}]"></el-input> mmHg
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="breathing">
                  <label>RR(呼吸率)：</label> <el-input v-model="inspectForm.breathing" type="number" :class="[{ red : breaFlag}, { normal : !breaFlag}]"></el-input> 次/分
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </template>
      <el-input v-if="item.name == 'pastIll'" type="textarea" :rows="4" v-model="form.pastIll"></el-input>
      <el-input v-if="item.name == 'personalHis'" type="textarea" :rows="4" v-model="form.personalHis"></el-input>
      <template v-if="item.name == 'allergicHis'">
        <ever-allergen v-model="form.allergicHis" :hasAllergicHis.sync="form.hasAllergicHis"></ever-allergen>
      </template>
      <el-input v-if="item.name == 'marryHis'" type="textarea" :rows="4" v-model="form.marryHis"></el-input>
      <el-input v-if="item.name == 'familyHis'" type="textarea" :rows="4" v-model="form.familyHis"></el-input>
      <el-input v-if="item.name == 'physicalExamine'" type="textarea" :rows="4" v-model="form.physicalExamine"></el-input>
      <el-input v-if="item.name == 'specExamine'" type="textarea" :rows="4" v-model="form.specExamine"></el-input>
      <el-input v-if="item.name == 'assistantExamine'" type="textarea" :rows="4" v-model="form.assistantExamine"></el-input>

    </el-form-item>
  </div>
</template>
<script>
  import api from '../../workspace/store/medicalapi'
  import everAllergen from '../../workspace/components/allergen'

  export default {
    props: ['patientId', 'form', 'items'],
    data () {
      var validateTem = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 30 || value > 45) {
            this.temFlag = false
            callback(new Error('体温有效值(30-45)'))
          } else if (value === 30 || value < 36.0 && value > 30 || value === 45 || value < 45 && value > 37.3) {
            this.temFlag = true
            callback()
          } else {
            this.temFlag = false
            callback()
          }
        } else {
          callback()
        }
      }
      var validatePulse = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 0 || value > 300) {
            this.pulseFlag = false
            callback(new Error('脉搏有效值(0-300)'))
          } else if (value === 0 || value < 60 && value > 0 || value === 300 || value < 300 && value > 100) {
            this.pulseFlag = true
            callback()
          } else {
            this.pulseFlag = false
            callback()
          }
        } else {
          callback()
        }
      }
      var validateBrea = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 1 || value > 100) {
            this.breaFlag = false
            callback(new Error('呼吸率有效值(1-100)'))
          } else if (value === 1 || value < 16 && value > 1 || value === 100 || value < 100 && value > 20) {
            this.breaFlag = true
            callback()
          } else {
            this.breaFlag = false
            callback()
          }
        }
      }
      var validateHighBlood = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 50 || value > 300) {
            this.highFlag = false
            callback(new Error('收缩压有效值(50-300)'))
          } else if (value === 50 || value < 90 && value > 50 || value === 300 || value < 300 && value > 140) {
            this.highFlag = true
            callback()
          } else {
            this.highFlag = false
            callback()
          }
        } else {
          callback()
        }
      }
      var validateLowBlood = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 30 || value > 150) {
            this.lowFlag = false
            callback(new Error('舒张压有效值(30-150)'))
          } else if (value === 30 || value < 60 && value > 30 || value === 150 || value < 150 && value > 90) {
            this.lowFlag = true
            callback()
          } else {
            this.lowFlag = false
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        currentHistory: this.items[0].name,
        inspectForm: {
          temperature: '',
          pulse: '',
          breathing: '',
          lowBloodPressure: '',
          highBloodPressure: '',
          height: '',
          weight: '',
          bmi: ''
        },
        rules: {
          temperature: [
            { trigger: 'blur', validator: validateTem }
          ],
          pulse: [
            { trigger: 'blur', validator: validatePulse }
          ],
          breathing: [
            { trigger: 'blur', validator: validateBrea }
          ],
          highBloodPressure: [
            { trigger: 'blur', validator: validateHighBlood }
          ],
          lowBloodPressure: [
            { trigger: 'blur', validator: validateLowBlood }
          ]
        },
        temFlag: false,
        pulseFlag: false,
        breaFlag: false,
        highFlag: false,
        lowFlag: false
      }
    },
    methods: {
      changeHistory (id) {
        this.currentHistory = id
      },
      initBodyCheck () {
        if (this.patientId) {
          api.getBodyCheck({patientId: this.patientId}).then(rs => {
            if (rs.data) {
              this.inspectForm = rs.data
            }
          })
        }
      },
      saveBodyCheck ({visitSn, phrAccountId, patientId, dptId}) {
        this.inspectForm.visitSn = visitSn
        this.inspectForm.phrAccountId = phrAccountId
        this.inspectForm.patientId = patientId
        this.inspectForm.dptId = dptId
        api.bodyCheckUpdate(this.inspectForm).then(rs => {
          if (rs.data) {
            this.inspectForm = rs.data
          }
        })
      }
    },
    created () {
      this.initBodyCheck()
    },
    components: {
      everAllergen
    }
  }
</script>
<style scoped>
  #patientcase .examination{margin-bottom: 20px;}
  .examination .el-input{width: 60px;}
  .examination .el-input input{text-align: center;}
  .el-row{margin-bottom: 10px;}
  .focusBtn.el-button--primary{font-weight: bold;}
</style>

<style scoped>
  .examination .el-input.red input{color: #EE4433;}
  .examination .el-input.normal input{color: #000;}
</style>

