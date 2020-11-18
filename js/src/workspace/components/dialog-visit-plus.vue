<template>
  <el-dialog
    title="诊间加号"
    id='visit_plus'
    :visible.sync="flag"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    class="ui_dialog_02"
    :before-close="close">
    <el-form :model="form" :rules="rules1" ref="form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="" prop="name">
            <!-- <el-input class="input" v-model="form.name" @input='input' placeholder="患者姓名、编号、手机号"></el-input> -->
             <el-select
              v-model="form.name"
              remote
              filterable
              clearable
              placeholder="患者姓名、编号、手机号"
              :remote-method="input"
              @change='change'
              :loading="loading">
              <el-option
                v-for="item in names"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="subsequentVisit">
            <el-select v-model="form.subsequentVisit" placeholder="请选择就诊类型">
              <el-option label="初诊" value="0"></el-option>
              <el-option label="复诊" value="1"></el-option>
              <el-option label="转诊" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="deptId">
            <el-select v-model="form.deptId" placeholder="请选择科室">
              <el-option v-for='item in arrangeDepts' :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="serviceid">
            <el-select v-model="form.serviceid" placeholder="请选择服务">
              <el-option v-for='item in arrangeServiceList' :label="item.serviceName" :value="item.serviceId" :key="item.serviceId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="timerange">
            <el-select v-model="form.timerange" placeholder="请输入看诊时长">
              <el-option :value="10 * i" :label="(10 * i) + '分钟'" v-for="i of 6" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="fixed_info">
      <el-col :span="8">姓名：{{data.name}}</el-col>
      <el-col :span="8">性别：{{data.sex&&data.sex=='1'?'男':'女'}}</el-col>
      <el-col :span="8">门诊档案号：{{data.id}}</el-col>
    </el-row>
    <el-row class="fixed_info">
      <el-col :span="8">手机号：{{data.mobile}}</el-col>
      <el-col :span="8">证件号：{{data.idNo}}</el-col>
      <el-col :span="8">年龄：{{data.age}}岁</el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click='save' v-ever-click-once="disabled" :disabled="disabled">加号</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import resident from '@/inpatient/store/resident.js'
  import moment from 'moment'
  import storage from '@/util/storage'

  export default {
    props: [],
    data () {
      return {
        flag: false,
        arrangeDepts: [],
        arrangeServiceList: [],
        form: {
          serviceid: '',
          deptId: '',
          subsequentVisit: '',
          timerange: ''
        },
        disabled: false,
        names: [],
        loading: false,
        data: {},
        rules1: {
          name: [
            { required: true, message: '请输入患者姓名、编号、手机号', trigger: 'blur, change' }
          ],
          subsequentVisit: [
            { required: true, message: '请选择就诊类型', trigger: 'blur, change' }
          ],
          deptId: [
            { required: true, message: '请选择科室', trigger: 'blur, change' }
          ],
          serviceid: [
            { required: true, message: '请选择服务', trigger: 'blur, change' }
          ],
          timerange: [
            { required: true, message: '请选择看诊时长', trigger: 'blur, change' }
          ]
        }
      }
    },
    methods: {
      change (val) {
        this.names.forEach((vals) => {
          if (vals.id === val) this.data = vals
        })
      },
      async input (val) {
        let data = await resident.searchFuzzy({
          keyword: val
        })
        this.names = data.data.resultList
      },
      close () {
        this.$refs.form.resetFields()
        this.flag = false
      },
      open () {
        this.flag = true
        this.getArrangeDepts()
      },
      async getArrangeDepts () {
        let result = await resident.getArrangeDepts()
        this.arrangeDepts = result.data
      },
      async getArrangeServiceList (deptId) {
        let result = await resident.getArrangeServiceList({
          deptId: deptId,
          timeTrunkType: 1
        })
        this.arrangeServiceList = result.data
      },
      save () {
        this.$refs.form.validate(valid => {
          if (valid) {
            var deptName
            this.arrangeDepts.forEach((val) => {
              if (val.id === this.form.deptId) {
                deptName = val.name
              }
            })
            let obj = {
              appointmentRelateId: storage.getLocalStorage('USERID') || '',
              deptId: this.form.deptId, //
              appointmentType: 1, // 预约类型： 1.预约挂号 2.预约检查 3. 手术室预约
              serviceid: this.form.serviceid, //
              subsequentVisit: this.form.subsequentVisit, // 就诊类型：0：初诊 1：复诊 2：转诊
              appointmentStarttime: moment().format('HH:mm:ss'),
              timerange: this.form.timerange, //
              deptName: deptName, //
              patientId: this.data.id, //
              addWay: 2,
              appointmentDate: moment().format('YYYY-MM-DD')
            }
            resident.appointmentCreate(obj).then(result => {
              if (result.head.errCode === 0) {
                this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '加号成功'
                })
                this.flag = false
                this.$refs.form.resetFields()
                this.$emit('success')
              } else {
                this.$notify({
                  type: 'warning',
                  message: result.head.errMsg
                })
              }
            })
          }
        })
      }
    },
    watch: {
      'form.deptId': {
        handler: function (val) {
          this.form.serviceid = ''
          if (val) this.getArrangeServiceList(val)
        },
        immediate: true
      }
    }
  }
</script>
<style lang='scss'>
 #visit_plus{
   .el-dialog__body{
     padding-bottom: 10px;
   }
   .fixed_info{
     margin-bottom: 5px;
   }
   .input{
     width: 190px;
   }
   .fixed_info{
     line-height: 40px;
   }
 }
</style>

