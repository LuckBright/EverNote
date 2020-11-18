<template>
  <div class="z-extension-details">
    <ever-bread-crumb name="推广详情"></ever-bread-crumb>
    <div class="z-details">
      <p>
        <span class="z-top-tip">
          <span>姓名：</span>
          {{detailsObj.name}}
        </span>
        <span class="z-top-tip">
          <span>性别：</span>
          {{detailsObj.sex}}
        </span>
        <span>
          <span>登录账号：</span>
          {{detailsObj.mobile}}
        </span>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="推荐医生" name="first">
          <doctor-table v-if="activeName === 'first'"/>
        </el-tab-pane>
        <el-tab-pane label="推荐患者" name="second">
          <patient-table v-if="activeName === 'second'"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import doctorTable from './extension.doctor'
  import patientTable from './extension.patient'
  export default {
    components: {
      doctorTable,
      patientTable,
    },
    data () {
      return {
        detailsObj: {},
        activeName: ''
      }
    },
    created () {
      this.detailsObj = {...JSON.parse(this.$route.query.obj)}
      this.activeName = this.detailsObj.tab
    },
    methods: {
      handleClick(tab) {
        this.activeName = tab.paneName
      }
    },
  }
</script>
<style lang="less" scoped>
  .z-extension-details {
    .z-back {
      cursor: pointer;
      padding-left: 10px;
    }
    .z-details {
      padding: 10px 20px;
      background: #fff;
      .z-top-tip {
        display: inline-block;
        width: 170px;
      }
    }
  }
</style>
