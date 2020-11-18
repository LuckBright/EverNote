<!-- 门诊 任务审核 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <search @query="queryHandler" v-if="!notCurrentMark" :schema="(wmSprescribe && !outpaitent) ? ['patientId', 'searchCode'] : []" :class="{pos_ab: wmSprescribe}"></search>
    <el-container class="page_layout_full_hidden" :class="{vh100: (wmSprescribe && !auditData), vh60: wmSprescribe && !outpaitent}">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth"  v-if="!auditData">
        <!-- 左侧列表查询组件 -->
        <!-- 患者列表组件 -->
        <list
          class="flex_scroll mt10"
          @aside-width="handlerAsideWidth"
          @row-click="handlerRowClick"
          name="getBatchAuditVisitSn"
          :page-type="pageType"
          :custom-params="customParams"
          :query-obj="queryObj"
          :notify-mark="notifyMark"
          :columns="filterColumns"></list>
      </el-aside>
      <el-main class="page_layout_full_hidden main" :class="{ml10: !auditData}">
        <el-container class="flex_column_full_hidden station_layout_wrap"  v-loading="loading">
          <template v-if="auditObj">
            <el-main class="flex_scroll main mt10">
              <!-- 患者头组件 -->
              <patient-header v-if="!auditData" :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
              <template v-for="(lists, key) in auditObj">
                <div class="radius bWhite" :class="[auditData && ((Object.keys(auditObj).length > 1 && key == 0) || Object.keys(auditObj).length == 1) ? 'mt5' : 'mt10']" :key="key">
                  <template v-for="(data, index) in lists">
                    <medicine-list
                      class="main10"
                      v-if="data"
                      @delete-abnormally="rejectDeleteHandler"
                      @save-after="saveAfterHandler"
                      @operator-func="operatorBtnFunc"
                      :audit-data="auditObj[key]"
                      :has-reject="!!(auditObj[0] && auditObj[0].length)"
                      :key="index"
                      :page-type="pageType"
                      :not-current-mark="notCurrentMark"
                      :type="Number(key)"
                      :is-coloumn="true"
                      :show-checkbox="false"
                      :operate-mode="2"
                      :parent-index="index"
                      :meta-data="data"
                      :table-data="data.taskDtoList"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :columns="medicineColumns"></medicine-list>
                  </template>
                </div>
              </template>
            </el-main>
          </template>
          <template v-else>
            <ever-no-data :tip-txt="noDataTip"></ever-no-data>
          </template>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import MethodsMixin from '@/warehouse/views/drug/multilibrary/mixin/methods.mixin.js'
import { CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant'
// const visitTypes = [
//   { id: 1, name: '门诊' },
//   { id: 2, name: '急诊' },
//   { id: 3, name: '住院' },
//   { id: 4, name: '体检' },
//   { id: 5, name: '互联网门诊' },
//   { id: 6, name: '其他' },
// ]
// const dispensingWay = [
//   { id: 1, name: '院内' },
//   { id: 2, name: '跨机构' },
//   { id: 3, name: '处方流转平台' },
// ],
export default {
  mixins: [MethodsMixin],
  props: {
    notCurrentMark: Boolean,
    pageType: {
      type: Number,
      default: 1
    },
    wmSprescribe: {
      type: Boolean,
      default: false
    },
    outpaitent: {
      type: Boolean,
      default: false
    },
    auditData: Object // 收方发药传递过来数据
  },
  watch: {
    auditData: {
      handler (v) {
        if (!v) return
        // 如果从收方发药中传入了数据， 直接使用
        this.auditObj = Object.assign({}, v)
        // 收方发药过来的给上级组装数据
        Object.keys(this.auditObj).forEach(key => {
          this.auditObj[key].forEach(item => {
            const {orderCode, createTime, doctorName, diagnosis, executeProviderName, type, orderId} = item.taskDtoList[0]
            item = Object.assign(item, {orderCode, createTime, doctorName, diagnosis, executeProviderName, recipeId: orderId})
            this.visitType = type
            item.taskDtoList.forEach(child => {
              child.taskId = child.serviceId + child.otherId
              child.id = child.otherId
            })
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      name: 'auditRecipeInfo',
      STORAGE_MEDICINE_CONFIG,
      customParams: {
        auditStatus: [0, 1],
        dispensingWay: (this.wmSprescribe && !this.outpaitent) ? [3] : [1, 2],
        visitTypes: [1, 2, 5],
      },
      auditObj: null, // 审核数据 0：待审核，1：驳回，2：已审核
      funcMap: {
        resolve: this.resolveHandler,
        reject: this.rejectHandler,
      },
      visitType: 0
    }
  },
  computed: {
    filterColumns () {
      return this.listColumns.slice(1)
    }
  },
  mounted () {
    this.$bus.$on('deleteAbnormallyDeleteHandler', row => {
      this.rejectDeleteHandler(row)
    })
  },
  beforeDestroy () {
    this.$bus.$off('deleteAbnormallyDeleteHandler')
  },
  created () {
    // 因为审核只会展示处方维度数据，审核展示模式固定为2 处方（整单）此处固定操作模式
    this.operateMode = 2
  },
  methods: {
    rejectDeleteHandler (row, index, subIndex, dataType) { // 删除驳回
      // 弹出框删除驳回
      if (row.rejectionReasons && !row.dialogFlag) {
        const { otherId, serviceId, serviceType } = row
        let params = {
          otherId,
          serviceId,
          serviceType,
          visitType: this.visitType || this.reportData.visitType,
          dispensingWay: this.customParams.dispensingWay,
        }
        this.commentHandler(params, 'delete')
      }
    },
    fetchList (clear) {
      // clear: 当左侧列表没有查到数据时，默认清空右侧所有数据
      if (clear) return (this.auditObj = null)
      // get data 根据条件查询发药列表-区分自备/邮寄/自取
      const params = {
        visitNumber: this.visitNumber,
        dispensingWay: this.customParams.dispensingWay
      }
      this.loading = true
      // get data 任务审核-查询该患者名下的任务
      dispenseApi.auditRecipeInfo(Object.assign(params, this.queryObj)).then(res => {
        if (!res) {
          return (this.auditObj = null)
        }
        const { 0: zero, 1: one, 2: two } = this.setDataKey(res)
        // 手动把后端返回的数据状态更改为 0：驳回，1：待审核，2：审核通过
        this.auditObj = {
          0: one,
          1: zero,
          2: two,
        }
      }).finally(_ => {
        this.loading = false
        // 当该患者数据不存在待审核 和 驳回数据时，删除该患者
        if (!this.auditObj || (!this.auditObj[0] && !this.auditObj[1])) {
          // notifyMark 通知list.vue 组件 修改患者异常标记信息 del: 删除患者
          this.notifyMark = {
            patientId: this.patientId,
            del: true
          }
        }
      })
    },
    setDataKey (res) {
      // 给返回的数据映射前端需要用到的字段
      Object.keys(res).forEach(key => {
        res[key].forEach(item => {
          item.orderCode = item.recipeCode
          item.orderId = item.recipeId
          item.delivery = key
          item.taskDtoList = item.items.map(child => {
            child.orderId = item.recipeId
            child.orderCode = item.recipeCode
            child.taskType = child.serviceType + ''
            child.rejectionReasons = child.auditOpinion
            child.examineFlag = child.auditStatus
            child.delivery = key
            child.localMaterialId = child.globalMaterialId
            child.taskId = child.serviceId + child.otherId
            // 中药需要拼接 _sourceData
            if (CHINESE_MEDICINE_TYPE.includes(child.taskType)) {
              child.id = child.serviceId + child.otherId
              child = Object.assign({}, child, { _sourceData: [child] })
            }
            return child
          })
        })
      })
      return res
    },
    resolveHandler () {
      // 审核通过是所有待审核处方一起审核
      const params = {
        recipeIds: [],
        auditStatus: 2,
        oldAuditStatus: 0,
        visitType: this.visitType || this.reportData.visitType,
        dispensingWay: this.customParams.dispensingWay,
      }
      this.auditObj[1].forEach(audit => {
        params.recipeIds.push(audit.recipeId)
      })
      this.commentHandler(params)
    },
    rejectHandler (obj, parentIndex, fullAdd, fullDelete) {
      // 驳回是展示所有未审核处方明细列表标记驳回原因
      // 驳回没有删除驳回原因操作，取所有新添加的数据就可以了
      let params = this.theParamsUpdateChange(obj, fullAdd)
      params = Object.assign(params, {
        recipeIds: [...new Set(fullAdd.map(item => item.orderId))],
        auditStatus: 1,
        oldAuditStatus: 0,
        visitType: this.visitType || this.reportData.visitType,
        dispensingWay: this.customParams.dispensingWay,
      })
      params.items = fullAdd.map(item => { return { otherId: item.otherId, serviceType: item.serviceType, serviceId: item.serviceId, auditOpinion: item.rejectionReasons } })
      delete params.recipeCommentDetailList
      delete params.dataType
      params.items.length && this.commentHandler(params)
    },
    operatorBtnFunc (ids, delivery, type) {
      // 检测type：因为所有操作通过一个方法emit出来，所以通过检测type类型来确定调用那类型的接口
      // 审核通过、审核驳回
      this.funcMap[type]()
    },
    commentHandler (params, type) {
      // 审核 和 驳回接口   params.recipeCommentDetailList为空 => 没有添加驳回数据即审核通过
      dispenseApi[type ? 'delAuditOpinion' : 'editRecipeStatus'](params).then(res => {
        if (res) {
          // 通知收方发药审核通过，进行后续操作
          this.$emit('notify-receive')
          const has = params.hasOwnProperty('items')
          if (!has) {
            // notifyMark 通知list.vue 组件 修改患者异常标记信息 del: 删除患者
            this.notifyMark = {
              patientId: this.patientId,
              del: true
            }
          } else {
            this.auditObj = null
          }
          !this.auditData && this.fetchList(!has)
          this.$messageTips(this, 'success', type ? '驳回原因删除成功' : has ? '处方驳回成功' : '处方审核通过')
        }
      })
    },
    saveAfterHandler (obj, singleAdd, fullAdd, fullDelete, parentIndex, currentData, currentIndex) {
      // this.fullSaveHandler(obj, parentIndex, fullAdd, fullDelete)
      this.funcMap.reject(obj, parentIndex, fullAdd, fullDelete)
    }
  }
}
</script>
<style lang="scss" scoped>
.vh100{
  height: calc(100vh - 90px);
  padding-top: 32px;
}
.vh60{
  height: calc(100vh - 60px);
}
.autohg{
  height: auto;
}
</style>
