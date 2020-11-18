<template>
  <el-card :class="{'isdisabled':!nodisabled}" id="questionitem">
    <div v-for="(item,i) in data" :key="i">
      <el-row>
        <el-col :span="24" :class="{'col-gray':!nodisabled}">
          {{i+1}}.{{item.subject}}
        </el-col>
        <el-col :span="24">
          <el-radio-group :disabled="!nodisabled" v-if="item.type===1" v-model="item.answer.answer">
            <el-radio :label="val.value" v-for="(val,j) in item.options.data" :key="j">{{val.value}}</el-radio>
          </el-radio-group>
          <el-checkbox-group v-if="item.type===2" v-model="item.answer.answer">
            <el-checkbox :label="val.value" :disabled="!nodisabled" v-for="(val,j) in item.options.data" :key="j">{{val.value}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="mb20">
        <el-col :span="2" align=""><label :class="{'col-gray':!nodisabled}">{{item.type==3?'答案':'补充'}}：</label></el-col>
        <el-col :span="22" class="clearfix">
          <el-input :disabled="!nodisabled" v-model="item.answer.answer" type="textarea" :rows="2" :maxlength="500" v-if="item.type==3"></el-input>
          <el-input :disabled="!nodisabled" v-model="item.answer.comment"  type="textarea" :rows="2" :maxlength="500" v-else></el-input>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
  export default {
    props: ['data', 'nodisabled'],
    data () {
      return {}
    },
    watch: {
      data (val) {
        val.forEach(item => {
          if (typeof (item.options) === 'string') {
            item.options = JSON.parse(item.options, true)
          }
          if (!item.answer) {
            item.answer = {answer: item.type === 2 ? [] : '', comment: ''}
          }
          item.options.data = item.options.data.filter(opt => {
            return opt.value !== ''
          })
        })
      }
    }
  }
</script>
<style scoped>
  #questionitem{box-shadow: none;}
  #questionitem .el-radio,
  #questionitem .el-checkbox{margin-left: 0;margin-bottom: 15px;margin-right: 4px;width: 180px;}
  #questionitem .el-radio-group .el-input,
  #questionitem .el-checkbox-group .el-input{width: 100px;margin-right: 4px}
  #questionitem .el-col{margin-bottom: 10px;}
  #questionitem .el-input input{height: 35px;line-height: 35px;}
</style>
