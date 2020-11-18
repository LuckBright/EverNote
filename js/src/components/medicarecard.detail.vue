<!-- 读取医保卡后展示的详细信息
  demo: <medicarecard-detail :medicare-data="medicareObj" @confirmFun="addIcInfo()" :show-confirm="true"></medicarecard-detail>
  参数：medicare-data   医保卡里面的内容object
       show-confirm   是否显示 确认按钮，可不传
       confirmFun  点击确认之后的方法（patientselect 组件内需要回填数据，）配合 show-confirm=true 使用
-->
<template>
  <div class="bdy">
    <template v-if="medicareData" v-loading="loading">
      <h4 class="ti2">
        医保信息 <span v-if="medicareData.useable">可用</span><span v-else>不可用（{{medicareData.useableMsg}}）</span>
      </h4>
      <el-row>
        <el-col :span="12">【医保卡号】 {{medicareData.cardno ? medicareData.cardno : ''}}</el-col>
        <el-col :span="12">【医保应用号】 {{medicareData.icno ? medicareData.icno : ''}}</el-col>
        <el-col :span="12">【身份证号】 {{medicareData.idno}}</el-col>
        <el-col :span="12">【姓名】 {{medicareData.personname ? medicareData.personname : ''}}</el-col>
        <el-col :span="12">【性别】 {{medicareData.sexName ? medicareData.sexName : ''}}</el-col>
        <el-col :span="12">【出生日期】 {{medicareData.birthday ? medicareData.birthday : ''}}</el-col>
        <el-col :span="12">【转诊医院编码】 {{medicareData.formhosp ? medicareData.formhosp :''}}</el-col>
        <el-col :span="12">【转诊时限】 {{medicareData.formhospdate ? medicareData.formhospdate : ''}}</el-col>
        <el-col :span="12">【险种类型】 {{medicareData.fundtypeName ? medicareData.fundtypeName : ''}}</el-col>
        <el-col :span="12">【预提人员标识】 {{medicareData.isytName ? medicareData.isytName : ''}}</el-col>
        <el-col :span="12">【军残等级】 {{medicareData.jclevelName ? medicareData.jclevelName : ''}}</el-col>
        <el-col :span="12">【在院标识】 {{medicareData.hospflagName ? medicareData.hospflagName : ''}}</el-col>
        <el-col :span="12">【参保人员类型】 {{medicareData.persontypeName ? medicareData.persontypeName : ''}}</el-col>
        <el-col :span="12" class="red">【是否在红名单】 {{medicareData.isinredlistName ? medicareData.isinredlistName : ''}}</el-col>
        <el-col :span="24" class="red">【对否本人定点医院】 {{medicareData.isspecifiedhospName ? medicareData.isspecifiedhospName : ''}}</el-col>
        <el-col :span="24" class="red">【对否本人慢病定点医院】 {{medicareData.ischronichospName ? medicareData.ischronichospName : ''}}</el-col>
        <el-col :span="12">【个人账户余额】 {{medicareData.personcount ? medicareData.personcount : ''}}</el-col>
        <el-col :span="12">【慢病编码】 {{medicareData.chroniccode ? medicareData.chroniccode : ''}}</el-col>
      </el-row>
      <div class="ic-footer" v-if="showConfirm">
        <el-row>
          <el-col :span="24" align="center">
            <el-button type="primary" @click="addIcInfo()">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: ['medicareData', 'showConfirm'],
    data () {
      return {
        loading: true
      }
    },
    created () {
      // loading 状态可以考虑加一下 但是要配合外面的请求方法，这块标记一个 todo
      this.loading = false
    },
    methods: {
      addIcInfo () {
        this.$emit('confirmFun')
      }
    }
  }
</script>
<style scoped>
  .bdy{line-height: 25px; font-size: 14px;text-align: left}
  .ti2{border-bottom: 1px solid #ccc;margin: 10px 0;height: 30px;line-height: 30px}
  .red{color:#f00;}
  .ic-footer{ padding-top:10px;}
</style>
