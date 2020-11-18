<template>
  <div id="outof">
    <el-dialog
      :visible.sync="flag"
      id='change_bed'
      title='患者转科'
      width="1000px">
       <el-row class='row title'>
         <span></span>基本信息
       </el-row>
      <el-row class='row'>
          <el-col :span="8">患者姓名：<span>{{info.patientName}}</span></el-col>
          <el-col :span="8" v-if='info.patient'>性别：<span>{{info.patient.sex | formatSex}}</span></el-col>
          <el-col :span="8" v-if='info.patient'>年龄：<span>{{info.patient.age}}</span></el-col>
      </el-row>
      <el-row class='row'>
          <el-col :span="8">住院号：<span>{{info.hospitalizedNumber}}</span></el-col>
          <el-col :span="8">入院时间：<span>{{moment(info.hospitalizedTime).format('YYYY-MM-DD HH:mm')}}</span></el-col>
          <el-col :span="8">床位：
                <span>{{info.hospitalizedWardName}} - {{info.hospitalizedBedName}}</span>
            </el-col>
      </el-row>
      <el-row class='row'>
          <el-col :span="8">主治医生：<span>{{info.chiefDoctorName}}</span></el-col>
          <el-col :span="8">责任护士：<span>{{info.primaryNurseName}}</span></el-col>
      </el-row>
          <el-col :span="8">科室：<span>{{info.providerName}}</span></el-col>
      <el-row class='row title'>
         <span></span>未执行医嘱
       </el-row>
       <el-row class='row title'>
         <span></span>费用风险
       </el-row>
      <div slot='footer'>
        <el-button>取消</el-button>
        <el-button type="primary" @click='out'>确认出科</el-button>
      </div>
     </el-dialog>
  </div>
</template>
<script>
// import storage from '@/util/storage.js'
import api from './../store/resident.js'
import moment from 'moment'
export default {
  data () {
    return {
      moment,
      flag: false,
      info: {
        patient: {}
      }
    }
  },
  created () {
    this.$bus.$on('dialog:outof', val => {
      this.opens(val)
    })
  },
  methods: {
    async opens (val) {
      this.flag = true
      this.info = val
      api
    },
    async out () {
      let result = await api.createOutEntranceMsg({
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        patientId: this.$route.query.patientId
      })
      if (result.head.errCode === 0) {
        this.$notify({
          title: '成功',
          type: 'success',
          message: result.head.errMsg
        })
        this.flag = false
        this.$emit('success')
      } else {
        this.$notify({
          type: 'warning',
          message: result.head.errMsg
        })
      }
      // storage.getSessionStorage('spaceId')
    }
  },
  computed: {

  },
  components: {

  }
}
</script>

<style lang='scss'>
#outof{
    .row{
      line-height: 30px;
      color: #666;
      span{
        color: #000;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow: hidden;
        
      }
    }
    .title{
      color: #000;
      span{
        display: inline-block;
        width: 3px;
        height: 15px;
        background: #1C7BEF;
        vertical-align: middle;
        margin-top:-2px;
        margin-right: 5px;
      }
    }
}
</style>
