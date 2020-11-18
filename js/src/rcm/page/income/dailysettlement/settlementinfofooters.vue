<template>
  <div>
    <ul>
      <li>
        <label>制表：</label>
        {{infoObj.createUser}}
      </li>
      <li>
        <label>复核：</label>
      </li>
      <li class="time">
        <label>制表日期：</label>
        {{infoObj.closeTime}}
      </li>
      <li class="name">
        <label>收费员签字：</label>
      </li>
      <li>
        <label>出纳签字：</label>
      </li>
    </ul>
    <!-- <el-row class="basic-info">
      <el-col :span="4">
        <label>制表：</label>
        {{infoObj.createUser}}
      </el-col>
      <el-col :span="4">
        <label>复核：</label>
      </el-col>
      <el-col :span="8">
        <label>制表日期：</label>
        {{infoObj.closeTime}}
      </el-col>
      <el-col :span="4">
        <label>收费员签字：</label>
      </el-col>
      <el-col :span="4">
        <label>出纳签字：</label>
      </el-col>
    </el-row>-->
    <div class="clearfix"></div>
  </div>
</template>
<script>
export default {
  props: ['infoObj'],
  data () {
    return {
      info: {}
    }
  },
  watch: {
    infoObj: {
      handler (newValue) {
        if (newValue) {
          this.info = newValue
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped>
.el-row {
  margin-top: 30px;
}
ul {
  margin: 0;
  padding: 0;
}
ul li {
  float: left;
  width: 15%;
  line-height: 30px;
}
ul .time {
  width: 30%;
}
ul .name {
  width: 20%;
}
@media print {
  ul li {
    font-size: 12px;
  }
}
</style>
