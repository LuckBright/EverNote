<template>
  <span>
    <span class="common-head-def-label">{{itemConfig.paramValue}}：</span>
    <el-dropdown @command="handleCommand" size="mini" v-if="shangbaoItem.insurerName">
      <span class="el-dropdown-link">
        {{shangbaoItem.insurerName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,index) in shangbao" :key="item.insurerId" :command="index">{{item.insurerName}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tooltip class="item" effect="light" placement="bottom-end" :open-delay="500" v-if="shangbaoItem.insurerName">
      <i style="color: #BBBBBB;font-size:14px;" class="iconfont icon-gantanhao font16"></i>
      <span slot="content">
        保险卡编号：<br/>{{shangbaoItem.policyNum}}<br/> 保险有效期：
        <br/>{{shangbaoItem.startTime | formatDateByExp('YYYY/MM/DD')}}-{{shangbaoItem.endTime | formatDateByExp('YYYY/MM/DD')}}<br/> 福利：{{shangbaoItem.welfare}}
      </span>
    </el-tooltip>
    <span class="common-head-def-value" v-else>--</span>
  </span>
</template>
<script>
  export default {
    props: {
      itemConfig: {
        type: Object
      },
      itemData: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        shangbao: [],
        shangbaoItem: {}
      }
    },
    watch: {
      'itemData': {
        handler () {
          if (this.itemData.insuranceData) {
            this.shangbao = this.itemData.insuranceData
            this.shangbaoItem = this.shangbao[0] || {}
          }
        },
        deep: true,
        immediate: true,
      }
    },
    created () {
    },
    methods: {
      handleCommand (item) {
        this.shangbaoItem = this.shangbao[item]
      },
    },
  }
</script>
<style></style>
