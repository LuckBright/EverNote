<template>
  <el-form :model="form" :rules="rule" ref="EyesForm" id="eyesform" v-ever-bind-enter>
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th width="70" align="right"></td>
          <th>视力</th>
          <th>眼压/mmhg</th>
          <th>球镜</th>
          <th>柱镜</th>
          <th>轴位</th>
        </tr>
      </thead>
      <tbody>
      <tr>
        <th width="70" align="right"><el-form-item>右眼</el-form-item></th>
        <td>
          <el-form-item prop="rightEyeView">
            <el-input v-model="form.rightEyeView"  :maxlength="5" size="small"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="rightEyePress">
            <el-input v-model.number="form.rightEyePress"  :class="[{ red : rightPress}, { normal : !rightPress}]"  type="number" size="small"></el-input> 
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="rightEyeDs">
            <el-input v-model="form.rightEyeDs" :class="[{ red : RDSFlag}, { normal : !RDSFlag}]" size="small" type="number"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="rightEyeDc">
            <el-input v-model="form.rightEyeDc" :class="[{ red : RDCFlag}, { normal : !RDCFlag}]" size="small" type="number"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="rightEyeAxle">
          <el-input v-model="form.rightEyeAxle" onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))" size="small" type="number"></el-input>
          </el-form-item>
        </td>
      </tr>
       <tr>
        <th width="70" align="right"><el-form-item>左眼</el-form-item></th>
        <td>
          <el-form-item prop="leftEyeView">
            <el-input v-model="form.leftEyeView"  :maxlength="5" size="small"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="leftEyePress">
            <el-input v-model.number="form.leftEyePress"  :class="[{ red : leftPress}, { normal : !leftPress}]"  type="number" size="small"></el-input> 
          </el-form-item>          
        </td>
        <td>
          <el-form-item prop="leftEyeDs">
            <el-input v-model="form.leftEyeDs" :class="[{ red : RDSFlag}, { normal : !RDSFlag}]" size="small" type="number"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="leftEyeDc">
            <el-input v-model="form.leftEyeDc" :class="[{ red : RDCFlag}, { normal : !RDCFlag}]" size="small" type="number"></el-input>
          </el-form-item>        
        </td>
        <td>
          <el-form-item prop="leftEyeAxle">
           <el-input v-model="form.leftEyeAxle"
            onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))" size="small" type="number"></el-input>
          </el-form-item>
        </td>
      </tr>
      </tbody>
    </table>
  </el-form>
</template>

<script>
  export default {
    props: ['value', 'isSubmit', 'validate'],
    data () {
      var validateEyeView = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (!isNaN(value) && value < 0) {
            callback(new Error('视力不能为负值'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var validatePress = (rule, value, callback) => {
        value = Number(value)
        if (value < 0) {
          this.rightPress = false
          callback(new Error('眼压不能为负值'))
        } else if (value < 10 || value > 21) {
          this.rightPress = true
          callback()
        } else {
          this.rightPress = false
          callback()
        }
      }
      var validateLeftPress = (rule, value, callback) => {
        value = Number(value)
        if (value < 0) {
          this.leftPress = false
          callback(new Error('眼压不能为负值'))
        } else if (value < 10 || value > 21) {
          this.leftPress = true
          callback()
        } else {
          this.leftPress = false
          callback()
        }
      }
      var validateAxle = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 0 || value > 360) {
            callback(new Error('轴位有效值为(0-360)的整数'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var validateRDS = (rule, value, callback) => {
        if (value) {
          if (value < 0 || value > 0.5) {
            this.RDSFlag = true
            callback()
          } else {
            this.RDSFlag = false
            callback()
          }
        } else {
          this.RDSFlag = false
          callback()
        }
      }
      var validateRDC = (rule, value, callback) => {
        if (value) {
          if (value < 0 || value > 0.5) {
            this.RDCFlag = true
            callback()
          } else {
            this.RDCFlag = false
            callback()
          }
        } else {
          this.RDCFlag = false
          callback()
        }
      }
      var validateLDS = (rule, value, callback) => {
        if (value) {
          if (value < 0 || value > 0.5) {
            this.LDSFlag = true
            callback()
          } else {
            this.LDSFlag = false
            callback()
          }
        } else {
          this.LDSFlag = false
          callback()
        }
      }
      var validateLDC = (rule, value, callback) => {
        if (value) {
          if (value < 0 || value > 0.5) {
            this.LDCFlag = true
            callback()
          } else {
            this.LDCFlag = false
            callback()
          }
        } else {
          this.LDCFlag = false
          callback()
        }
      }
      return {
        form: {
          rightEyeView: '',
          leftEyeView: '',
          rightEyePress: '',
          leftEyePress: '',
          rightEyeDs: '',
          rightEyeDc: '',
          leftEyeDs: '',
          leftEyeDc: '',
          taskName: '',
          rightEyeAxle: '',
          leftEyeAxle: ''
        },
        rule: {
          rightEyeView: [
            {trigger: 'blur', validator: validateEyeView}
          ],
          rightEyePress: [
            {trigger: 'blur', validator: validatePress}
          ],
          rightEyeAxle: [
            {trigger: 'blur', validator: validateAxle}
          ],
          rightEyeDs: [
            {trigger: 'blur', validator: validateRDS}
          ],
          rightEyeDc: [
            {trigger: 'blur', validator: validateRDC}
          ],
          leftEyeView: [
            {trigger: 'blur', validator: validateEyeView}
          ],
          leftEyePress: [
            {trigger: 'blur', validator: validateLeftPress}
          ],
          leftEyeAxle: [
            {trigger: 'blur', validator: validateAxle}
          ],
          leftEyeDs: [
            {trigger: 'blur', validator: validateLDS}
          ],
          leftEyeDc: [
            {trigger: 'blur', validator: validateLDC}
          ]
        },
        RDSFlag: false,
        RDCFlag: false,
        LDSFlag: false,
        LDCFlag: false,
        rightPress: false,
        leftPress: false
      }
    },
    watch: {
      form: {
        handler (val) {
          this.$emit('update:value', val)
        },
        deep: true
      },
      value: {
        handler (val) {
          Object.assign(this.form, val)
        },
        deep: true
      },
      isSubmit (val) {
        if (val) {
          this.$refs.EyesForm.validate(validate => {
            this.$emit('update:validate', validate)
          })
        }
      }
    }
  }
</script>

<style scoped>
  #eyesform /deep/ .el-input input{text-align: center;}
  #eyesform /deep/ .el-input.red input{color: #EE4433;}
  #eyesform /deep/ .el-input.normal input{color: #000;}
  #eyesform .el-form >.el-form-item {margin-bottom:15px!important;}
  #eyesform .eye_title{font-weight:700;margin-right:20px;}
  #eyesform .iconfont{color: #fff;}
  #eyesform table tr th,
  #eyesform table tr td{padding: 0 5px; font-size: 14px; margin: 0; width: 100px;}
  #eyesform table thead tr th:first-child,
  #eyesform table tbody tr th{width: 85px;}
  #eyesform table thead tr th{text-align: left;}  
</style>
