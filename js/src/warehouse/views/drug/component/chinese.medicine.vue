<template>
  <div class="tcm_box">
    <div class="tcm-template">
      <el-row class="tcm-item">
        <el-col :span="6" v-for="(item, index) in tableData" :key="index" :class="isBatch ? '' : 'col_high'">
          <chinese-medicine-info
            @delete-reject="rejectDeleteHandler"
            :task="item"
            :multi-library="multiLibrary"
            :table-data="tableData"
            :is-edit="isEdit"
            :is-batch="isBatch"
            :config-columns="isBatch ? configColumns : []"
            :not-current-mark="notCurrentMark"
            :page-type="pageType"
            :batch-list="item.taskItemList"
            :task-data="(item.taskItemList && item.taskItemList[0]) ? item.taskItemList[0] : item">
          </chinese-medicine-info>
        </el-col>
      </el-row>
      <!-- 护士补费发药 不展示 -->
      <el-row type="flex" align="middle" justify="start" class="tcm-bottom bor_top_1" v-if="scene != 6">
        <el-col :span="4" style="padding-left: 45px">
          <span class="span-label">剂数：</span>
          <span class="red f18 f_bold">{{localToFixed(commonData.count || commonData.measure)}} </span> 剂
        </el-col>
        <el-col :span="4">
          <span class="span-label ml20">频次：</span>
          <sys-value
            :initoptions="FREQUENCY_LIST"
            v-if="commonData.useFreq"
            :code="commonData.useFreq"
          ></sys-value>
        </el-col>
        <el-col :span="4">
          <span class="span-label ml20">用法：</span>
          <sys-value
            type="CV06.00.102"
            v-if="commonData.employ"
            :code="commonData.employ"
          ></sys-value>
        </el-col>
        <el-col :span="4">
          <span v-if="commonData.decoctFlag">
            <span class="span-label ml20">是否代煎：</span>
            <span>{{commonData.decoctFlag == 1 ? '代煎' : '否'}}</span>
          </span>
          <span v-else>
            <span class="span-label ml20">煎法：</span>
            <span v-if="!commonData.decoct">无</span>
            <sys-value type="THC_SYS_DECOCTION_OF_TCM" :code="commonData.decoct" v-else></sys-value>
          </span>
        </el-col>
        <el-col :span="8" v-if="commonData.entrust">
          <span class="span-label fl">嘱托：</span>
          <el-tooltip placement="bottom">
            <div slot="content">{{commonData.entrust}}</div>
            <span class="tooltip fl">{{commonData.entrust}}</span>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <div class="tcm-bottom TCM_cdss f14" v-if="commonData.cdssResult">
      <div class="f_bold">合理用药提醒：</div>
      <span v-html="formatHTML(commonData.cdssResult)"></span>
    </div>
  </div>
</template>

<script>
import ChineseMedicineInfo from './chinese.medicine.info'
import { objGet } from '@/util/common'
import storage from '@/util/storage'
import { localToFixed } from '@/warehouse/views/util/index'
export default {
  props: {
    metaData: { // // 元数据，完整的一条数据集
      type: Object,
      default: () => []
    },
    multiLibrary: {  // 门诊多库房操作 -  1：门诊 2： 住院
      type: Number,
      default: 0
    },
    pageType: Number,
    tableData: { // 一条处方的所有明细
      type: Array,
      default: () => []
    },
    componentName: String, // 父级组件名
    content: Object, // ctx 组件上下文
    configColumns: { // 批次定价配置操作列数据
      type: Array,
      default: () => ([ ])
    },
    notCurrentMark: Boolean,
    isEdit: Boolean // 住院中药添加修改标签按钮
  },
  data () {
    return {
      localToFixed,
      FREQUENCY_LIST: JSON.parse(storage.getSessionStorage('FREQUENCY_LIST')) || [] // 频次
    }
  },
  computed: {
    // 是否是批次定价 根据列表数据来判断
    isBatch () {
      return this.tableData.some(item => item.sysBatchCode)
    },
    scene () {
      // 来源 6： 补费
      if (this.tableData.length) return this.tableData[0].scene
      return ''
    },
    commonData () {
      // 需要展示中药的公共属性<剂数、频次、嘱托、合理用药提醒>，因中药处方已task明细展示，一个处方中所有的这些属性都一样，获取中药处方明细中第一条数据
      if (this.tableData.length) return this.tableData[0].taskItemList ? objGet(this.tableData[0], 'taskItemList[0]', {}) : this.tableData[0]
      return {}
    },
  },
  components: {
    ChineseMedicineInfo
  },
  methods: {
    rejectDeleteHandler (row, type) {
      // 删除驳回原因
      /**
       * row :当前数据
       * null：index: tabledata 明细下标
       * 1：type 驳回类型 0 异常类型
      */
      this.$emit('delete-reject', row, 1, type)
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
  }
}
</script>
<style lang="less" scoped>
.tcm-template {
  // &.dangerRow {
  //   background: #fde2e2!important;
  // }
  &.select {
    background: #E0EFFF!important;
  }
  font-size: 14px;
  .tcm-item {
    line-height: 40px;
    padding: 0 15px;
    .col_high {
      height: 40px;
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
    line-height: 30px;
    padding:0 15px;
  }
  .span-label {
    color: #9EA09E;
  }
  .tooltip {
    max-width: 80%;
    height: 30px;
    display: block;
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
}
</style>
