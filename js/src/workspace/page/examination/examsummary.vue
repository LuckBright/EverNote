<template>
  <div class="exam_summary">
      <el-card class="box-card" v-for="item in examlist" :key="item.id">
        <div slot="header" class="clearfix cancel">
          <span>{{item.dptName}}检查结果<span v-if="item.status==0" style="color:red;">  未填写分检报告</span></span>
          <el-button type="primary" size="small" @click="cancelExam(item)" :disabled="item.status===1 && item.examStatus===0?false:true">取消分检</el-button>
        </div>
        <el-row>
          <el-col :span="8">
            检查时间:{{item.disposerTime}}
          </el-col>
          <el-col :span="5">
            检查医生：{{item.doctorName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            体检综述:
          </el-col>
          <el-col :span="19">
            <span v-if="item.summary">{{item.summary}}</span>
            <span v-else>-</span>
          </el-col>
          <el-col :span="1">
            <el-button type="text" v-if="item.summary"  @click="quote(item.summary)">引用</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">医生建议:</el-col>
          <el-col :span="19">
              <span v-if="item.suggestion">{{item.suggestion}}</span>
            <span v-else>-</span>
          </el-col>
          <el-col :span="1">
            <el-button type="text" v-if="item.suggestion"  @click="quote(item.suggestion)">引用</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-row>
        <el-col :span="2" :offset="21">
          <el-button type="primary" @click="quoteAll" :disabled="disabled">全部引用</el-button>
        </el-col>
      </el-row>
  </div>
</template>
<script>
export default {
  props: ['examlist', 'disabled', 'customApi'],
  data () {
    return {
      JIANYI: '',
      TIJIANJIELUN: ''
    }
  },
  methods: {
    cancelExam (item) {
      this.$emit('cancel', item)
    },
    quote (val) {
      this.$emit('quote', val)
    },
    quoteAll () {
      this.JIANYI = ''
      this.TIJIANJIELUN = ''
      this.examlist.forEach((item, index) => {
        this.JIANYI += item.suggestion ? item.suggestion + ' ' : ''
        this.TIJIANJIELUN += item.summary ? item.summary : ''
      })
      this.$bus.$emit('ref:appendAll', {JIANYI: this.JIANYI, TIJIANJIELUN: this.TIJIANJIELUN})
    }
  }
}
</script>
<style lang="scss" scoped>
.exam_summary{
  width:100%;
  min-width:800px;
  overflow:auto;
  margin-bottom: 15px;
  .box-card{
    margin-bottom: 15px;
  }
}
.el-row{
  margin-top:15px;
  line-height:36px;
  .el-col{
    ul{
      padding:0;
    }
    text-align: left;
  }
}
.cancel{
   display:flex;
   justify-content:space-between;
   &>span{
     flex:1
   }
 }
 .el-tabs__content{
   overflow:auto;
 }
</style>

