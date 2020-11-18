<template>
  <div>
    <h3 class="print_header center">{{clinicName}}{{infoObj.title}}</h3>
    <ul class="clearfix">
      <li class="title">
        <label>收款人姓名：</label>
        {{info.createUser || ''}}
      </li>
      <li class="title">
        <label>上次日结时间：</label>
        {{info.preCloseTime || ''}}
      </li>
      <li class="title">
        截止时间：
        {{info.closeTime || ''}}
      </li>
    </ul>
    <div class="clearfix"></div>
    <hr />
    <!-- </el-row> -->
  </div>
</template>
<script>
export default {
  props: ['infoObj'],
  data () {
    return {
      info: {},
      clinicName: this.$store.state.currentUser.organizationName
    }
  },
  watch: {
    'infoObj': {
      handler (newValue) {
        if (newValue) {
          this.info = newValue
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.el-row {
  height: 40px;
  line-height: 40px;
}
h3 {
  text-align: center;
}
.basic-info {
  margin-top: 40px;
  border-bottom: 1px solid #000;
  padding-bottom: 10px;
}
ul {
  margin: 0;
  padding: 0;
}
.title {
  float: left;
  margin-left: 20px;
}
.title:nth-child(1) {
  margin-left: 0;
}
.clearfix {
  clear: both;
}
@media print {
  .title {
    font-size: 12px;
  }
}
</style>

