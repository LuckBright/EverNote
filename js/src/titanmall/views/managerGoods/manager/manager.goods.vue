<template>
  <div class="main ">
    <div class="manager-goods">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="销售中" name="first">
          <table-info
            :searchType="1"
            v-if="activeName === 'first'"
          ></table-info>
        </el-tab-pane>
        <el-tab-pane label="已下架" name="second">
          <table-info
            :searchType="2"
            v-if="activeName === 'second'"
          ></table-info>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import tableInfo from './details.info'
  import api from '../api'

  export default {
    components: {
      tableInfo,
    },
    data () {
      return {
        api,
        activeName: '',
      }
    },
    created () {
      if (location.hash.indexOf('=') > -1) {
        this.activeName = localStorage.getItem('activeName')
      } else {
        this.activeName = 'first'
        localStorage.setItem('activeName', 'first')
      }
    },
    methods: {
      handleClick (tab) {
        this.activeName = tab.name
        localStorage.setItem('activeName', tab.name)
        localStorage.setItem('isLoad', 1)
      },
    },
  }
</script>
<style lang="less" scoped>
  .manager-goods {
    background: #fff;
    padding: 20px;
  }
</style>
