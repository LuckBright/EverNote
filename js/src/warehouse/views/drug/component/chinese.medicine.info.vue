<template>
  <div>
    <div class="pos_re" @click="chienseEdit(task)" :class="{red: (taskData.identification || taskData.examineFlag == 1 || task.shortage == 23 || task.status == 4) && !isAuditPage, showEdit: (isEdit && pageType != 4 && task.scene != 6)}">
      <div class="pos_ab" v-if="task.status == 4" style="left: -15px">
        <span class="markIcon backgroundRed"> &nbsp;无法到货&nbsp; </span>
      </div>
      <el-popover
        :key="taskData.id"
        v-if="taskData.identification  && !isAuditPage"
        placement="bottom"
        title="异常原因:"
        width="300"
        trigger="hover">
          <template>
            <span class="red" v-html="identificationInfo"></span>
            <div class="alg_c mt5" v-if="(task.status === 2  || (isEdit && (task.status < 3 || task.status == 12)))">
              <el-button size="mini" type="primary" @click="deleteHandler">删除</el-button>
            </div>
          </template>
          <span slot="reference" class="pointer">
            <svg class="icon f18" aria-hidden="true">
              <use v-if="taskData.identification" xlink:href="#icon-yi"></use>
            </svg>
          </span>
      </el-popover>
      <svg class="icon f18" v-else aria-hidden="true"></svg>
      <svg class="icon f18" aria-hidden="true">
        <use xlink:href="#icon-que2" v-if="task.shortage == 23 && !isAuditPage"></use>
      </svg>
      <span v-if="isEdit && pageType != 4 && task.status != 4 && task.scene != 6" class="blue cur edit" title="点击修改"><i class="iconfont icon-xiugai"></i></span>
      <span v-if="task.scene == 6" style="width: 15px" class="inline-block">&nbsp;</span>
      <!-- :showSourceValue="taskData.scene" 自备药属性 -->
      <!-- <wh-code-to-name
        v-if="taskData.localSettingObject"
        class="f_bold m0"
        :isExt="true"
        :patchObj="{
          code: GENERAL_CODE,
          list: taskData.localSettingObject.materialSkuObject.ext,
          isInfo: false
        }">
      </wh-code-to-name> -->
      <material-show-name
        :materialName="taskData.materialName"
        :icons="taskData.icons">
      </material-show-name>
      <!-- 护士补费发药 不展示 -->
      <span class="pos_re up_down" v-if="task.scene != 6">
        <!-- measure:每次用量 、 measureUnitId：每次用量单位 -->
        <sub class="subs pos_ab">{{taskData.feesCount || newMeasure}}{{taskData.packagUnitName}}</sub>
        <!-- decoction:煎法 -->
        <sup v-if="taskData.decoction" class="sups pos_ab">(<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="taskData.decoction"></sys-value>)</sup>
        <!-- 新版 -->
        <sup v-if="taskData.footnote" class="sups pos_ab">(<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="taskData.footnote"></sys-value>)</sup>
        </span>
      <span v-else class="pl5">
        {{newMeasure}}<sys-value type="THC_WH_DOSE_UNIT" :code="taskData.unitId"></sys-value>
      </span>
      <!-- 中药异常 -->
      <div class="ml10 pos_re tips">
        <el-popover
          class="pos_ab"
          :key="taskData.id + taskData.examineFlag "
          v-if="taskData.examineFlag == 1 && (isAuditPage || notCurrentMark) && abnormalReason"
          placement="right"
          title="驳回原因:"
          width="300"
          trigger="hover">
            <template>
              <span class="cOrange" v-html="abnormalReason"></span>
              <div class="alg_c mt5">
                <el-button size="mini" type="primary" @click="deleteHandler">删除</el-button>
              </div>
            </template>
            <span slot="reference" class="pointer">
              <span class="markIcon backgroundRed">驳回</span>
            </span>
        </el-popover>
        <el-popover
          class="pos_ab"
          :key="taskData.id + task.description"
          v-if="task.description"
          placement="right"
          title="医生说明:"
          width="300"
          trigger="hover">
            <template>
              <span class="cBlue" v-html="task.description"></span>
            </template>
            <span slot="reference" class="pointer">
              <span class="markIcon backgroundBlue">说明</span>
            </span>
        </el-popover>
      </div>
    </div>
    <!-- 批次定价中药展示方式 -->
    <el-row v-if="isBatch" class="batch_item" style="font-size: 12px;">
      <el-col v-for="(item, index) in batchList" :key="index" :span="12">
        <div v-if="showChineseMedicineConfig.chineseBatchNum" style="line-height: 20px;"><span class="ml43">生产批号{{item.batchNum}}</span></div>
        <div v-if="showChineseMedicineConfig.chineseSysBatchCode" style="line-height: 20px;"><span class="ml43">系统批号{{item.sysBatchCode}}</span></div>
        <div v-if="showChineseMedicineConfig.chineseValidityDate" style="line-height: 20px;"><span class="ml43">有效期{{item.validityDate | formatDateByExp('YYYY-MM-DD')}}</span></div>
        <div v-if="showChineseMedicineConfig.chineseSaleprice" style="line-height: 20px;"><span class="ml43">销售价{{item.price}}</span></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GENERAL_CODE, objGet, floatTool } from '@/util/common'
import { setUpClassifyName } from '@/util/formcustom'
import { localToFixed } from '@/warehouse/views/util/index'
export default {
  props: {
    notCurrentMark: Boolean, // 标记审核驳回是否能删除
    pageType: Number,
    taskData: {
      type: Object,
      default: () => ({})
    },
    task: Object,
    isEdit: Boolean,
    multiLibrary: {  // 门诊多库房操作 -  1：统一门诊  2: 分库房门诊   0： 住院
      type: Number,
      default: 0
    },
    configColumns: {
      type: Array,
      default: () => ([ ])
    },
    isBatch: { // 定价模式 true：批次定价，flase：统一定价
      type: Boolean,
      default: false
    },
    batchList: {
      type: Array,
      default: () => ([ ])
    },
    tableData: { // 整个中药包明细
      type: Array,
      default: () => ([ ])
    }
  },
  data () {
    return {
      GENERAL_CODE,
      setUpClassifyName,
      tableConfig: []
    }
  },
  computed: {
    showChineseMedicineConfig () {
      let tableConfig = {}
      this.configColumns.forEach(col => {
        tableConfig[col.slotName] = !col.hidden
      })
      return tableConfig
    },
    isAuditPage () {
      return this.$route.path.indexOf('audit') > -1 || this.$route.path.indexOf('wmsprescribe') > -1
    },
    cdssResult () {
      return this.taskData.taskItemList ? objGet(this.taskData, 'taskItemList[0].cdssResult', '') : this.taskData
    },
    // 新的每次用量的计算规则 总量 num / 剂数 measure
    newMeasure () {
      const measure = this.task.measure || this.task.count
      // 审核页面的 task 是一个对象
      const list = this.task.taskItemList ? this.task.taskItemList : [this.task]
      let num = list.reduce((cur, pre) => {
        return floatTool.add(cur, Number(pre.num))
      }, 0)
      return floatTool.divide(num, measure)
    },
    abnormalReason () {
      const { rejectionReasons, exceptionCause } = this.taskData
      return exceptionCause || rejectionReasons
    },
    identificationInfo () {
      const { identificationInfo } = this.taskData
      return identificationInfo || ''
    },
    numberOfMedicine () {
      const { num, measure } = this.taskData
      return floatTool.divide(+localToFixed(num), +localToFixed(measure))
    },
    hasIdentification () { // 所有明细中存在异常数据
      return this.tableData.some(d => d.identification)
    }
  },
  beforeDestroy () {
    this.$bus.$off('ChineseMedicineCol')
  },
  methods: {
    deleteHandler () {
      if (this.isEdit && this.multiLibrary === 0) { // 住院udd才会存在 isEdit
        return this.$bus.$emit('hospital:delete-exception-cause', this.taskData, this.task) // // 派发删除异常信息
      }
      if (this.multiLibrary > 0) { // 门诊多库房统一发药 删除异常信息
        return this.$bus.$emit(this.multiLibrary === 1 ? 'outpatient:delete-exception-cause-multi' : 'outpatient:delete-exception-cause', this.task, this.taskData) // // 派发删除异常信息
      }
      // 删除驳回原因 | 异常原因
      // examineFlag：0 删除异常 | 1 删除驳回
      this.$emit('delete-reject', this.task, this.taskData.examineFlag === 1 ? 1 : 0)
    },
    chienseEdit ({ status, scene }) {
      if (this.isEdit && this.pageType !== 4 && status !== 4 && scene !== 6) {
        this.$bus.$emit('notify-chinese-medicine-edit', this.taskData, this.task) // 通知udd.list 组件进行修改操作
      }
    }
  }
}
</script>

<style lang="less" scoped>
.up_down {
  left: -5px;
  min-width: 60px;
  display: inline-block;
}
.sups {
  top: -1em;
}
.subs {
  bottom: -0.1em;
}
.pr10 {
  padding-right: 5px;
}
.m0 {margin: 0}
.tips {
  display: inline;
  .pos_ab {
    .markIcon {
      &:last-child {
        top: 10px
      }
      width: 40px;
      display: block;
      height: 14px;

      line-height: 14px;
    }
    &:last-child {
      top: 10px
    }
    left: 0;
    top: -6px
  }
}
.backgroundBlue {
  background: #1c78ef;
}
.backgroundOrg {
  background: #eb9e05;
}
.backgroundRed {
  background: #ee4433;
}
.showEdit {
  &:hover {
    color: #1c78ef;
    cursor: pointer;
    .edit {
      visibility: inherit
    }
  }
  .edit {
    visibility: hidden;
  }
  .ml43 {
  margin-left: 43px;
}
.batch_item {
  font-size: 12px;
  .linH_20 {
    line-height: 20px !important;
  }
}

}
</style>
