<template>
  <div id="bodycheck">
    <el-form :model="form" :rules="rules" ref="bodycheck" class="inspectform">
      <el-row class="bodycheck mb20">
        <el-col :span="12">
          <el-form-item prop="height" :rules="rules.height">
            <label class="fl">身高：</label>
            <el-input class="fl" v-model.number="form.height"></el-input>
            <em class="unit">cm</em>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="weight" :rules="rules.weight">
            <label class="fl">体重：</label>
            <el-input class="fl" v-model.number="form.weight"></el-input>
            <em class="unit">kg</em>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="temperature" :rules="rules.temperature">
            <label class="fl">体温：</label>
            <el-input
              class="fl"
              v-model.number="form.temperature"
              :class="[{ red : temFlag}, { normal : !temFlag}]"
            ></el-input>
            <em class="unit">°C</em>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="highBloodPressure"
            :rules="rules.highBloodPressure"
            class="fl"
            style="display: inline-block;margin-right: 0;"
          >
            <label class="fl">血压：</label>
            <el-input
              class="fl sort"
              placeholder="收缩压"
              v-model.number="form.highBloodPressure"
              :class="[{ red : highFlag}, { normal : !highFlag}]"
            ></el-input>
          </el-form-item>
          <span class="fl sp">-</span>
          <el-form-item
            prop="lowBloodPressure"
            :rules="rules.lowBloodPressure"
            class="fl"
            style="display: inline-block;margin-right: 0;"
          >
            <el-input
              class="fl sort"
              placeholder="舒张压"
              v-model.number="form.lowBloodPressure"
              :class="[{ red : lowFlag}, { normal : !lowFlag}]"
            ></el-input>
            <em class="unit">mmHg</em>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="pulse" :rules="rules.pulse">
            <label class="fl">脉搏：</label>
            <el-input
              class="fl"
              v-model.number="form.pulse"
              :class="[{ red : pulseFlag}, { normal : !pulseFlag}]"
            ></el-input>
            <em class="unit">bpm</em>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="breathing" :rules="rules.breathing">
            <label class="fl">呼吸：</label>
            <el-input
              class="fl"
              v-model.number="form.breathing"
              :class="[{ red : breaFlag}, { normal : !breaFlag}]"
            ></el-input>
            <em class="unit">次/分</em>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="spo2" class="clearmb" :rules="rules.spo2">
            <label class="fl">血氧：</label>
            <el-input class="fl" v-model.number="form.spo2"></el-input>
            <em class="unit">mmHg</em>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="this.form.patientAge < 6">
          <el-form-item prop="headSurround" class="clearmb" :rules="rules.headSurround">
            <label class="fl">头围：</label>
            <el-input class="fl" v-model.number="form.headSurround"></el-input>
            <em class="unit">cm</em>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import api from '../../workspace/store/medicalapi'

export default {
  props: ['commend', 'user', 'value'],
  data () {
    let validateTem = (rule, value, callback) => {
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
    let validatePulse = (rule, value, callback) => {
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
    let validateBrea = (rule, value, callback) => {
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
      } else {
        callback()
      }
    }
    let validateHighBlood = (rule, value, callback) => {
      if (value) {
        value = Number(value)
        if (value < 50 || value > 300) {
          this.highFlag = false
          callback(new Error('有效值(50-300)'))
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
    let validateLowBlood = (rule, value, callback) => {
      if (value) {
        value = Number(value)
        if (value < 30 || value > 150) {
          this.lowFlag = false
          callback(new Error('有效值(30-150)'))
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
    var validateheight = (rule, value, callback) => {
      if (value) {
        value = Number(value)
        if (value <= 0) {
          callback(new Error('请输入正确的身高'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateweight = (rule, value, callback) => {
      if (value) {
        value = Number(value)
        if (value <= 0) {
          callback(new Error('请输入正确的体重'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let validateNumber = (rule, value, callback) => {
      if (!value) {
        callback()
        return false
      }
      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确的数值'))
        return false
      }
      callback()
    }
    return {
      api,

      form: {
        temperature: '',
        pulse: '',
        breathing: '',
        lowBloodPressure: '',
        highBloodPressure: '',
        height: '',
        weight: '',
        bmi: '',
        spo2: '',
        headSurround: ''
      },
      temFlag: false,
      pulseFlag: false,
      breaFlag: false,
      highFlag: false,
      lowFlag: false,
      rules: {
        height: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validateheight }
        ],
        weight: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validateweight }
        ],
        temperature: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validateTem }
        ],
        pulse: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validatePulse }
        ],
        breathing: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validateBrea }
        ],
        highBloodPressure: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validateHighBlood }
        ],
        lowBloodPressure: [
          { trigger: 'blur', validator: validateNumber },
          { trigger: 'blur', validator: validateLowBlood }
        ],
        spo2: [
          { trigger: 'blur', validator: validateNumber }
        ],
        headSurround: [
          { trigger: 'blur', validator: validateNumber }
        ]
      }
    }
  },
  watch: {
    'value': {
      handler (v) {
        return v && Object.assign(this.form, v)
      },
      deep: true
    },
    'form': {
      handler (v) {
        this.$emit('update:value', v)
      },
      deep: true
    },
    'commend' (val) {
      return this.$refs.bodycheck.validate(valid => {
        return valid && this.saveBodyCheck(this.user)
      })
    }
  },
  created () {
    this.initBodyCheck()
  },
  methods: {
    initBodyCheck () {
      return this.user.patientId && this.api.getBodyCheck({ visitSn: this.user.visitSn || this.user.visitNumber }).then(rs => {
        if (rs) {
          this.form = Object.assign(this.form, rs)
          window.setTimeout(() => {
            this.$refs.bodycheck.validate(valid => {
              return valid
            })
          }, 0)
        }
      })
    },
    saveBodyCheck (user) {
      this.form.visitSn = user.visitSn
      this.form.phrAccountId = user.phrAccountId
      this.form.patientId = user.patientId
      this.form.dptId = user.dptId
      this.api.bodyCheckUpdate(this.form).then(rs => {
        if (rs.data) {
          this.form = rs.data
          this.$emit('success', true)
        }
      })
    },
    validate (cb) {
      this.$refs.bodycheck.validate(valid => {
        cb(valid)
      })
    }
  }
}
</script>
<style scoped>
.inspectForm {
  max-width: 1200px;
}
.bodycheck .el-input {
  width: 60px;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.bodycheck /deep/ .el-input__inner {
  height: 33px;
  line-height: 33px;
  text-align: center;
}
.bodycheck span.sp {
  margin: 0 5px;
}
.bodycheck em.unit {
  float: left;
  font-style: normal;
  margin-left: 5px;
}
.bodycheck .el-input.red input {
  color: #ee4433;
}
.bodycheck .el-input.normal input {
  color: #000;
}
.inspectform .el-form-item {
  margin-bottom: 20px;
}
.inspectform .clearmb {
  margin-bottom: 0;
}
@media (max-width: 1600px) {
  .bodycheck .sort {
    width: 40px !important;
  }
  .bodycheck .el-input {
    width: 94px;
  }
}
</style>
