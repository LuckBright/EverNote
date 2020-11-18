<template>
  <div class="layout_box" id="sendarea">
    <!-- 退库退费dialog组件 -->
    <refund-dialog
      :data="currentRefund"
      :base-info="baseInfo"
      :visible.sync="refundVisible"
      @submit="refundSuccess"
      :only-search="onlySearch"
      :is-print="false"
      @close="onlySearch = false">
    </refund-dialog>
    <!-- 坚持发药dialog -->
    <insist-dispense :visible.sync="handleVisible" @submit="confirmAdvice"></insist-dispense>
  </div>
</template>
<script>
import medicalapi from '@/workspace/store/medicalapi'
import recipeapi from '@/workspace/store/recipeapi'
import storage from '@/util/storage'
import api from '@/csa/store/advice'
import refundDialog from '@/inpatient/components/medical.orders/refund.dialog'
import insistDispense from '@/inpatient/components/medical.orders/insist.dispense'

export default {
  components: {
    refundDialog,
    insistDispense
  },
  props: {
    baseInfo: Object,
    sendData: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    visitType: {
      type: Number
    }
  },
  data () {
    return {
      medicalapi,
      recipeapi,
      storage,
      currentHandleObj: {},
      loading: false,
      contextList: [
        {id: 'a', name: '申请退库', disabled: false, methodName: 'refundDrug'},
        {id: 'b', name: '坚持发药', disabled: false, methodName: 'insistDispense'},
        {id: 'c', name: '撤回医嘱', disabled: false, methodName: 'removeAdvice'},
        {id: 'd', name: '取消医嘱', disabled: false, methodName: 'invalidAdvice'},
      ],
      currentRefund: [],
      refundVisible: false,
      handleVisible: false,
      onlySearch: false
    }
  },
  methods: {
    // 右键操作按钮列表触发事件回调
    getMenuList (index, row) {
      this.curRightClickRows = this.fuziData[row.mainGroupId]
      this.curRightClickRow = row
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.fuziData[row.mainGroupId], v.id, row)
      })
      return this.contextList
    },
    // 操作按钮显示判断逻辑
    getStatusShow (list, id, row) {
      if (id === 'a') { // 申请退库
        // outDrugStatus 出库状态才能退库
        let status = list.reduce((result, item) => {
          return result && (+item.outDrugStatus === 190)
        }, true)
        return status
      } else if (id === 'b') { // 坚持发药
        // outDrugStatus 出库状态是发药驳回才能坚持发药
        return [70, 2].includes(+row.outDrugStatus)
      } else if (id === 'c') { // 撤回医嘱
        /**
         * outDrugStatus 出库状态
         * payStatus 支付状态
         */
        if (this.disabled) {
          return false
        }
        // 出库状态后端判断
        // 待执行（未支付，未发药）可撤回
        let status = list.reduce((result, item) => {
          return result && (+item.status === 1 && !(+item.payStatus) && !(+item.outDrugStatus))
        }, true)
        return status
      } else if (id === 'd') { // 取消医嘱
        // 住院不让结算后不让取消医嘱
        // 待执行，(已支付)，未出库
        if (this.disabled || this.visitType === 3) {
          return false
        }
        // 待执行（未支付，未发药）可撤回
        let status = list.reduce((result, item) => {
          return result && (+item.status === 1 && +item.payStatus && !item.outDrugStatus)
        }, true)
        return status
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      if (!this.curRightClickRows) {
        return
      }
      if (['b'].includes(item.id)) { // 坚持发药针对单条
        this[item.methodName](this.curRightClickRow)
        return
      }
      // 作废医嘱操作需要二次确认
      if (['d'].includes(item.id)) {
        this.$confirm(`您即将${item.name.slice(0, 2)}该医嘱，是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this[item.methodName](this.curRightClickRows)
        })
      } else {
        this[item.methodName](this.curRightClickRows)
      }
    },
    // 撤回
    removeAdvice (item) {
      api.removeDoctorAdviceByIds(item.map(item => item.id)).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '撤回成功')
        }
        this.$emit('change', false)
      })
    },
    // 取消
    invalidAdvice (item) {
      this.$emit('change', true)
      api.cancelDoctorAdviceByIds(item.map(item => item.id)).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '取消成功')
        }
        this.$emit('change', true)
      })
    },
    // 退库
    refundDrug (item) {
      this.currentRefund = item
      this.refundVisible = true
    },
    // 退库查询
    refundDrugSearch (data) {
      this.currentRefund = data
      this.onlySearch = true
      this.refundVisible = true
    },
    // 退库 提交成功回调
    refundSuccess () {
      this.$emit('change', true)
    },
    // 坚持发药
    insistDispense (item) {
      this.handleVisible = true
    },
    // 坚持发药回调
    confirmAdvice (handleObj) {
      let params = {
        reason: handleObj.reason,
        doctorAdviceId: this.curRightClickRow.id,
      }
      recipeapi.confirmMaterialOutStatus(params).then(res => {
        this.handleVisible = false
        if (res.head.errCode === 0) {
          this.$emit('change', true)
          this.$messageTips(this, 'success', '保存成功', '成功')
        } else {
          this.$messageTips(this, 'warning', '保存失败', '提示')
        }
      })
    }
  },
  computed: {
    fuziData () {
      let obj = {}
      this.sendData.forEach(item => {
        if (obj[item.mainGroupId]) {
          obj[item.mainGroupId].push(item)
        } else {
          obj[item.mainGroupId] = [item]
        }
      })
      return obj
    }
  }
}
</script>
<style scoped lang="scss">
#sendarea {
  width: 100%;
}
</style>
