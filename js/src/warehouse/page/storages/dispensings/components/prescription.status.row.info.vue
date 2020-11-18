<template>
  <div class="tcm_title clearfix mt10">
    <div class="fl">
      <span v-if="isPrint && opdData.status !== 3" class="fl mr10">
        <el-checkbox @change="printChange" v-model="print"></el-checkbox>
      </span>
      <!-- 根据状态生成对应图标 -->
      <span v-if="opdData.status && opdData.status !== undefined" class="fl mr10">
        <svg class="icon" style="font-size:58px; height: 30px" aria-hidden="true">
          <use :xlink:href="'#' + iconName"></use>
        </svg>
      </span>
      <span class="light-gray fl">处方单号：</span>
      <strong class="fl mr10">{{opdData.recipeCode}}</strong>
      <!-- 执行单号 -->
      <span class="fl" style="display: block;width: 30px;height: 18px;">
        <el-popover
          v-if="opdData.adviceExecuteId"
          placement="bottom"
          title
          width="400"
          trigger="hover"
          content
        >
          <span>
            <span class="cGray6">执行单号：</span>
            {{opdData.adviceExecuteId}}
          </span>
          <span slot="reference">
            <svg class="icon" style="font-size:30px; height: 18px" aria-hidden="true">
              <use xlink:href="#icon-zhixingren"></use>
            </svg>
          </span>
        </el-popover>
        <!--  -->
      </span>
      <span class="ml15">
        <span class="light-gray">申请时间：</span>
        {{opdData.createTime}}
      </span>
      <span class="ml15 cGray6">医生：</span>
      <template v-if="doctorData">
        <strong>{{doctorData.doctorName}}</strong>
        （{{doctorData.providerName}}）
      </template>
      <span
        class="ml15"
        v-if="opdData.status === 6 && opdData.dispenseFinishTime">
        <span class="cGray6">发药时间：</span>
        {{opdData.dispenseFinishTime}}
      </span>
      <!-- 非当日  超三日图标 -->
      <el-tooltip
        v-if="opdData && opdData.isInvalid == 1"
        effect="dark"
        content="超时，待与医生沟通"
        placement="top"
      >
        <svg class="icon ml10" aria-hidden="true" style="font-size:40px; height: 24px">
          <use xlink:href="#icon-feidangri"></use>
        </svg>
      </el-tooltip>
      <el-tooltip
        v-if="opdData && opdData.isInvalid == 2"
        effect="dark"
        content="超过3日，不能发药"
        placement="top"
      >
        <svg class="icon ml10" aria-hidden="true" style="font-size:40px; height: 24px">
          <use xlink:href="#icon-chaosanri"></use>
        </svg>
      </el-tooltip>
    </div>
    <div class="fr">
      <check-information :propData="doctorData"></check-information>
      <span class="mr10 inline-block"
        v-if="!opdData.identification && opdData.status < 6 && opdData.outOfStock !== 23 && !readOnly">
        <el-button
        type="text"
        @click="handleException('sign')">
        <svg class="icon" aria-hidden="true" style="font-size:18px; height: 18px">
          <use xlink:href="#icon-biaoji"></use>
        </svg>
        <span class="cBlack f_nor">标记异常</span>
        </el-button>
      </span>
      <span class="mr10 inline-block"
        v-if="opdData.identification && opdData.status < 6 && opdData.outOfStock !== 23 && !readOnly">
        <el-button
        type="text"
        @click="handleException('cancel')">
        <svg class="icon" aria-hidden="true" style="font-size:18px; height: 18px">
          <use xlink:href="#icon-quxiaoyichang"></use>
        </svg>
        <span class="cBlack f_nor">取消异常</span>
      </el-button>
      </span>
      <span class="mr10 inline-block" v-if="opdData.status === 6 && mailState">
        <el-button
        type="text"
        @click="handleMailing">
        <svg class="icon" aria-hidden="true" style="font-size:16px; height: 16px">
          <use xlink:href="#icon-youji"></use>
        </svg>
        <span class="cBlack f_nor">邮寄信息</span>
      </el-button>
      </span>
      <span class="mr10 inline-block"
        v-if="opdData.outOfStock === 23 && !readOnly && opdData.status < 6">
        <el-button
        type="text"
        @click="handleException('shortage')">
        <svg class="icon" aria-hidden="true" style="font-size:18px; height: 18px">
          <use :xlink:href="'#' + (remind.dispenseRemind === 1 ? 'icon-wufadaohuo1' : 'icon-zaicitixing')"></use>
        </svg>
        <span class="cBlack f_nor">{{remind.dispenseRemind | formateValueToFnt({list: DISPENSING_REMIND})}}</span>
      </el-button>
      </span>
    </div>
    <!-- 异常标记 -->
    <exception-dialog
      v-if="operate === 'cancel'"
      :exceptionData="exceptionData"
      :operate="operate"
      :visible.sync="dialogVisible"
      @confirm="handleSave"
    ></exception-dialog>
    <!-- 新版异常标记 -->
    <anomaly-dialog
      v-if="operate === 'sign'"
      :visible.sync="dialogVisible"
      :exceptionData="exceptionData"
      :operate="operate"
      @confirm="handleSave"
    ></anomaly-dialog>
    <!-- 邮寄组件 -->
    <mail-dialog
      v-if="mailState"
      :itemData="opdData"
      :visible.sync="dialogVisibleMail"
      :isClick="isClick"
      :visitSn="opdData.visitSn"
    ></mail-dialog>
  </div>
</template>

<script>
import setName from '@/util/setstatusname'
import { DISPENSING_STATUS, SCENE, DISPENSING_REMIND } from '@/util/common'
import commonApi from '../store/dispensingcommonapi.js'
import checkInformation from '@/warehouse/page/storages/dispensings/components/check.information'
import anomalyDialog from '@/warehouse/page/storages/components/anomalydialog'
import exceptionDialog from '@/warehouse/page/storages/components/exceptiondialog'
import mailDialog from '@/warehouse/page/storages/components/maildialog'
export default {
  props: {
    opdData: {
      type: Object,
      default: () => ({})
    },
    patientData: {
      type: Array,
      default () {
        return []
      }
    },
    doctorData: {
      type: Object,
      default: () => ({})
    },
    mailState: {
      type: Number,
      default: 0
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  mixins: [setName],
  data () {
    return {
      DISPENSING_STATUS,
      DISPENSING_REMIND,
      print: false,
      remind: {}, // 无法到货状态
      exceptionData: [],
      operate: 'sign',
      SCENE,
      isClick: false,
      dialogVisibleMail: false,
      dialogVisible: false // 异常标记弹窗
    }
  },
  watch: {
    'opdData': {
      handler (v) {
        this.remind = v
        if (this.remind && !this.remind.dispenseRemind) this.remind.dispenseRemind = 1
      },
      deep: true,
      immediate: true
    },
    'opdData.checked': {
      handler: function (v) {
        this.print = v
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    checkInformation,
    exceptionDialog,
    anomalyDialog,
    mailDialog
  },
  computed: {
    iconName () {
      const name = this.$filters.formateValueToFnt(this.opdData.status, {
        list: DISPENSING_STATUS,
        showKey: 'iconName'
      })
      return name
    }
  },
  methods: {
    printChange () {
      this.$emit('print', {
        status: this.print,
        id: this.opdData.id,
        visitSn: this.opdData.visitSn,
        print: this.print
      })
    },
    submitCancel () {
      let params = {
        id: this.opdData.id,
        storageRoomId: this.opdData.storageRoomId,
        code: this.opdData.code,
        patientName: this.opdData.patientName,
        recipeCode: this.opdData.recipeCode,
        doctorId: this.opdData.doctorId
      }
      commonApi.UnableToArrive(params).then(res => {
        if (res.flag) {
          this.remind = res.object
          return this.$messageTips(this, 'success', '提醒开嘱医生成功')
        }
      })
    },
    handleMailing () {
      this.isClick = true
      this.dialogVisibleMail = true
    },
    // 标记异常 - 弹窗
    handleException (operate) {
      if (operate === 'shortage') {
        this.$confirm('是否确认该处方暂时无法到货，提醒对应开嘱医生进行后续处理?', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitCancel()
        }).catch()
        return
      }
      let outpatientDispenseIds = [this.opdData.id]
      commonApi.getDispenseInfo({ outpatientDispenseIds }).then(res => {
        if (res) {
          this.exceptionData = res
          this.operate = operate
          this.dialogVisible = true
        }
      })
    },
    // 标记异常 - 请求
    async handleSave (val) {
      // 新版中药标记异常
      let tempObj = {}
      tempObj.classifyList = val.selectList
      tempObj.content = val.inputVal
      tempObj.itemIds = []
      tempObj.recipeId = this.opdData.id
      tempObj.recipeType = SCENE[0].id
      val.checkedItems.forEach(item => {
        tempObj.itemIds.push(item.outpatientDispenseItem.id)
      })
      let result
      if (this.operate === 'sign') {
        result = await commonApi.updateComment(tempObj).then(res => res)
      } else {
        result = await commonApi.materialRecipeCommentCancel(tempObj).then(res => res)
      }
      if (result.flag) {
        this.$messageTips(this, 'success', this.operate === 'sign' ? '标记异常成功' : '取消异常成功')
        this.dialogVisible = false
        this.$emit('updateDispenseStatus', { type: 'sign', data: tempObj })
      }
    }
  }
}
</script>

<style scoped>
.tcm_title {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
}
</style>
