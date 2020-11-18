<!-- 中药模版 -->
<template>
  <div>
    <div v-for="(tableData, i) in templateData" :key="i" class="mb10 tcm-template">
      <el-row class="tcm-item">
        <el-col :span="24" :class="tableData.identification ? 'exception' : ''">
          <div
            v-for="(item, index) in tableData.chiAdviceItemList"
            :key="index"
            style="width: 25%; padding: 5px 0"
            class="fl"
          >
            <span>{{item.materialName}}</span>
            <span>{{item.amount}}</span>
            <span>{{item.amountUnitTxt}}</span>
            <span v-if="item.decoction">/
              <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="item.decoction"></sys-value>
            </span>
          </div>
          <div v-if="tableData.identification" class="red">异常原因：{{tableData.exceptionCause}}</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="start" class="tcm-bottom">
        <el-col :span="6">
          <span class="span-label">剂数：</span>
          <span class="red big">{{tableData.count}}</span>剂
        </el-col>
        <el-col :span="6">
          <span class="span-label ml20">频次：</span>
          <span>{{tableData.useFreqTxt}}</span>
        </el-col>
        <el-col :span="6">
          <span class="span-label ml20">用法：</span>
          <span>{{tableData.employTxt}}</span>
        </el-col>
        <el-col :span="6">
          <span class="span-label ml20">是否代煎：</span>
          <span>{{tableData.decoct == 1 ? '代煎' : '否'}}</span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="start" class="tcm-bottom">
        <el-col :span="24">
          <span class="span-label">嘱托：</span>
          <span>{{tableData.entrust}}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { patch, SEARCH_CODE } from '@/util/common'
export default {
  props: ['templateData'],
  data () {
    return {
      SEARCH_CODE
    }
  },
  created () {
  },
  methods: {
    ...patch
  }
}
</script>
<style lang="less" scoped>
.tcm-template {
  background-color: #f0f0f0;
  .tcm-item {
    padding: 10px 0 15px;
    > div {
      padding: 10px;
    }
    .exception {
      background-color: #ffc0c0;
      > div {
        padding-top: 5px;
      }
    }
  }
  .tcm-bottom {
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .span-label {
    color: #9ea09e;
  }
  .big {
    font-size: 18px;
  }
}
</style>
