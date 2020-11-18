<template>
<div class="tcm_box">
  <!-- 处方单状态信息表头 -->
  <prescription-status-row-info
    :opdData="opdData"
    :doctorData="doctorData"
    :isPrint="isPrint"
    :mailState="opdData.mailFlag"
    @print="handlerPrint"
    @updateDispenseStatus="updateDispenseStatus"
    :patientData="patientData"></prescription-status-row-info>
  <div class="tcm-template" :class="{ select: opdData.select, dangerRow: opdData.identification}">
    <el-row class="tcm-item f16">
      <el-col :span="6" v-for="(item, index) in opdData.outpatientDispenseItemList" :key="index" class="col_high">
        <chinese-name
          :data="item">
        </chinese-name>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" justify="start" class="tcm-bottom">
      <el-col :span="4">
        <span class="span-label">剂数：</span>
        <span class="red big f_bold">{{opdData.outpatientDispenseItemList[0].num / opdData.outpatientDispenseItemList[0].measure}} </span> 剂
      </el-col>
      <el-col :span="6">
        <span class="span-label ml20">频次：</span>
        <span>{{opdData.outpatientDispenseItemList[0].useFreqTxt}}</span>
      </el-col>
      <el-col :span="4">
        <span class="span-label ml20">用法：</span>
        <span>{{opdData.outpatientDispenseItemList[0].employtxt}}</span>
      </el-col>
      <el-col :span="4">
        <span class="span-label ml20">是否代煎：</span>
        <span>{{opdData.outpatientDispenseItemList[0].decoct === '1' ? '代煎' : '否'}}</span>
      </el-col>
      <el-col :span="6" v-if="opdData.outpatientDispenseItemList && opdData.outpatientDispenseItemList[0].entrust">
        <span class="span-label fl">嘱托：</span>
        <el-tooltip placement="top">
          <div slot="content">{{opdData.outpatientDispenseItemList[0].entrust}}</div>
          <span class="tooltip fl">{{opdData.outpatientDispenseItemList[0].entrust}}</span>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
  <div class="tcm-bottom TCM_cdss f14" v-if="opdData.outpatientDispenseItemList[0].cdssResult">
    <div class="f_bold">合理用药提醒：</div>
    <span v-html="formatHTML(opdData.outpatientDispenseItemList[0].cdssResult)"></span>
  </div>
</div>
</template>

<script>
// 中药 -- 处方列表  TODO  数据结构待修改
import { patch, SEARCH_CODE } from '@/util/common'
import prescriptionStatusRowInfo from './prescription.status.row.info'
import chineseName from '@/warehouse/page/storages/dispensings/components/chinese.name'
import { setUpClassifyName } from '@/util/formcustom'
export default {
  props: {
    patientData: {
      type: Array,
      default () {
        return []
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    opdData: {
      type: Object,
      default: () => ({})
    },
    doctorData: {
      type: Object,
      default: () => ({})
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      SEARCH_CODE,
      setUpClassifyName
    }
  },
  components: {
    prescriptionStatusRowInfo,
    chineseName
  },
  methods: {
    filterClassifyList (list) {
      if (list && list.length) {
        let arr = []
        list.map((item, index) => {
          arr.push(`<div><span>${index + 1}、</span>${setUpClassifyName(item, true, 'childClassifyItem', 'contentText')}</div>`)
        })
        // 异常原因只有一条不显示前面的 1、
        if (arr.length === 1) {
          arr[0] = arr[0].replace(new RegExp('<span>1、</span>'), '')
        }
        return arr.join('')
      }
    },
    handlerPrint (data) {
      this.$emit('print', data)
    },
    updateDispenseStatus (data) {
      this.$emit('updateDispenseStatus', data)
    },
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
  &.dangerRow {
    background: #fde2e2!important;
  }
  &.select {
    background: #E0EFFF!important;
  }
  background-color: #f1f1f1;
  font-size: 14px;
  .tcm-item {
    line-height: 36px;
    padding: 0 15px;
    .col_high {
      height: 36px;
    }
    .exception {
      // background-color: #ffc0c0;
      border-left: 3px solid #ee4433;
      > div {
        padding-top: 5px;
      }
    }
  }
  .tcm-bottom {
    line-height: 40px;
    padding:0 15px;
  }
  .span-label {
    color: #9EA09E;
  }
  .big {
    font-size: 18px;
  }
  .tooltip {
    width: 50%;
    height: 40px;
    display: block;
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
}
</style>
