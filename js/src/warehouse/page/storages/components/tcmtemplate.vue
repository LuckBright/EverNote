<!-- 中药模版 -->
<template>
  <div class="tcm-template">
    <el-row class="tcm-item">
      <el-col :span="8" v-for="(item, index) in templateData" :key="index" :class="item.outpatientDispenseItem.identification ? 'exception' : ''">
        <div>
          <span>
            <wh-code-to-name
              v-if="scope.row.localSettingObject"
              :showIcon="false"
              :isExt="true"
              :patchObj="{
                code: SEARCH_CODE[1],
                list: item.localSettingObject.materialSkuObject.ext,
                isInfo: false
              }"
            ></wh-code-to-name>
          </span>
          <span>{{item.outpatientDispenseItem.measure}}</span>
          <span>{{item.outpatientDispenseItem.measureUnit}}</span>
          <span v-if="item.outpatientDispenseItem.decoction"> / <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="item.outpatientDispenseItem.decoction"></sys-value></span>
        </div>
        <div v-if="item.outpatientDispenseItem.identification" class="red">异常原因：{{item.outpatientDispenseItem.exceptionCause}}</div>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" justify="start" class="tcm-bottom">
      <el-col :span="4">
        <span class="span-label">剂数：</span>
        <span class="red big">{{templateData[0].outpatientDispenseItem.num / templateData[0].outpatientDispenseItem.measure}}</span>剂
      </el-col>
      <el-col :span="4">
        <span class="span-label ml20">频次：</span>
        <span>{{templateData[0].outpatientDispenseItem.useFreqTxt}}</span>
      </el-col>
      <el-col :span="4">
        <span class="span-label ml20">用法：</span>
        <span>{{templateData[0].outpatientDispenseItem.employtxt}}</span>
      </el-col>
      <el-col :span="4">
        <span class="span-label ml20">是否代煎：</span>
        <span>{{templateData[0].outpatientDispenseItem.decoct === '1' ? '代煎' : '否'}}</span>
      </el-col>
      <el-col :span="4">
        <span class="span-label ml20">嘱托：</span>
        <span>{{templateData[0].outpatientDispenseItem.entrust}}</span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" justify="start" class="tcm-bottom TCM_cdss" v-if="templateData[0].outpatientDispenseItem.cdssResult">
      <i class="f12 iconfont icon-wodebaojing red mr10"></i>
      <span v-html="formatHTML(templateData[0].outpatientDispenseItem.cdssResult)"></span>
    </el-row>
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
    formatHTML (val) {
      if (!val) return ''
      let arr = val.split('|')
      let str = ''
      arr.forEach((htm, index) => {
        str += `${index + 1}.${htm}<br>`
      })
      return str
    },
    ...patch
  }
}
</script>
<style lang="less" scoped>
  .tcm-template {
    background-color: #F0F0F0;
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
      color: #9EA09E;
    }
    .big {
      font-size: 18px;
    }
  }
</style>
