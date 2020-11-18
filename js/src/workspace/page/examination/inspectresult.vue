<template>
  <div class="inspect_result">
    <!-- 数据为空的处理 -->
    <!--  -->
    <el-card class="box-card" v-if="info">
      <div slot="header" class="clearfix">
        <span>检查结果信息</span>
      </div>
      <el-row>
        <el-col :span="2">{{info.providerName}}</el-col>
        <el-col :span="8">检查时间：{{info.reportTime}}</el-col>
        <el-col :span="4">检查医生：{{info.doctorName}}</el-col>
      </el-row>
      <el-row>
        <el-col>
          影像链接：
          <a :href="info.imageUrl" target="_blank">{{info.imageUrl}}</a>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          描述：{{info.findings}}
          <el-button type="text" @click="quote('描述',info.findings)" v-if="info.findings!=null">引用</el-button>
          <span v-else>-</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          印象：{{info.impression}}
          <el-button
            type="text"
            @click="quote('印象',info.impression)"
            v-if="info.impression!=null"
          >引用</el-button>
          <span v-else>-</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          建议：{{info.doctorSuggest}}
          <el-button
            type="text"
            @click="quote('建议',info.doctorSuggest)"
            v-if="info.doctorSuggest!=null"
          >引用</el-button>
          <span v-else>-</span>
        </el-col>
      </el-row>
    </el-card>
    <everNoData v-else></everNoData>
  </div>
</template>
<script>
export default {
  props: ['info'],
  data () {
    return {}
  },
  methods: {
    quote (name, val) {
      let describe = `${name}:${val}`
      this.$emit('quote', describe)
    }
  }
}
</script>
<style lang="scss" scoped>
.inspect_result {
  margin-bottom: 15px;
}
.el-row {
  line-height: 36px;
  margin-bottom: 10px;
}
</style>

