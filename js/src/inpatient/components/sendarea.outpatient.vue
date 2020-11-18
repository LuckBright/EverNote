<template>
  <div class="layout_box" id="sendarea">
    <!-- 退库退费dialog组件 -->
    <refund-dialog :data="currentRefund" :base-info="baseInfo" :visible.sync="refundVisible" @submit="refundSuccess" :only-search="onlySearch" @close="onlySearch = false"></refund-dialog>
    <!-- 执行记录dialog -->
    <excute-record-dialog :data="excuteRecordData" :visible.sync="excuteRecordVisible" :currentObj="currentHandleObj" @update="excuteRecord(currentHandleObj)" @viewReport="viewReport"></excute-record-dialog>
    <!-- 操作日志dialog -->
    <operation-log :data="currentHandleObj" :visible.sync="logVisible"></operation-log>
    <!-- 查看报告dialog -->
    <reportcard ref="reportcard" :isPrint="true" :special="true" :append-body="true"></reportcard>
    <!-- 坚持发药dialog -->
    <insist-dispense :visible.sync="handleVisible" @submit="confirmAdvice"></insist-dispense>
  </div>
</template>
<script>
import { singlePrint } from './sendarea.print'
import medicalapi from '@/workspace/store/medicalapi'
import recipeapi from '@/workspace/store/recipeapi'
import storage from '@/util/storage'
import refundDialog from '@/inpatient/components/medical.orders/refund.dialog'
import excuteRecordDialog from '@/inpatient/components/medical.orders/excute.record.dialog'
import operationLog from '@/inpatient/components/medical.orders/operation.log'
import insistDispense from '@/inpatient/components/medical.orders/insist.dispense'
import reportcard from '@/infusion/components/report.card.vue'
import { objFind } from '@/util/common'

export default {
  props: {
    baseInfo: Object,
    orderDisabled: Boolean,
    fromHistory: Boolean,
    sendData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      medicalapi,
      recipeapi,
      storage,
      loading: false,
      currentRefund: [],
      refundVisible: false,
      currentHandleObj: {},
      excuteRecordData: [],
      excuteRecordVisible: false,
      logVisible: false,
      handleVisible: false,
      contextList: [
        {id: 'a', name: '撤回', disabled: false, methodName: 'removeAdvice'},
        {id: 'b', name: '整方撤回', disabled: false, isRecipe: true, methodName: 'removeRecipe'},
        {id: 'c', name: '取消', disabled: false, methodName: 'cancelAdvice'},
        {id: 'd', name: '整方取消', disabled: false, isRecipe: true, methodName: 'cancelRecipe'},
        {id: 'e', name: '退库', disabled: false, methodName: 'refundDrug'},
        {id: 'f', name: '执行记录', disabled: false, methodName: 'excuteRecord'},
        {id: 'g', name: '查看报告', disabled: false, methodName: 'viewReport'},
        {id: 'h', name: '操作日志', disabled: false, methodName: 'operationLog'}
      ],
      onlySearch: false
    }
  },
  created () {
    this.$bus.$off('refundEvent')
    // 退库标示的点击事件
    this.$bus.$on('refundEvent', (data) => {
      if (data.mainGroupId) {
        this.refundDrug(data)
        this.onlySearch = true
      }
    })
  },
  methods: {
    // 右键操作按钮列表触发事件回调
    getMenuList (index) {
      this.contextList.forEach((v) => {
        if (!v.isRecipe) {
          v.disabled = !this.getStatusShow(this.fuziData[this.sendData[index].mainGroupId], v.id)
        } else {
          if (this.sendData[index].mainFlag) {
            v.disabled = true
          } else {
            v.disabled = !this.getStatusShow(this.recipeData[this.sendData[index].recipeId], v.id)
          }
        }
        // 非本人患者只允许查看,历史患者允许所有操作
        if (!['g', 'h'].includes(v.id) && !this.fromHistory) {
          v.disabled = v.disabled || this.orderDisabled
        }
      })
      // 动态添加 打印标签 按钮
      if (this.sendData[index].barCode || this.sendData[index].serviceType === '10003') {
        if (!objFind(this.contextList, { id: 'i' })) {
          this.contextList.push({id: 'i', name: '打印标签', disabled: false, methodName: 'printBarcode'})
        }
      } else {
        if (objFind(this.contextList, { id: 'i' })) {
          this.contextList.splice(this.contextList.findIndex(val => { return val.id === 'i' }), 1)
        }
      }
      // 动态添加 坚持发药 按钮
      if (String(this.sendData[index].status) === '2' || String(this.sendData[index].status) === '70') {
        if (!objFind(this.contextList, { id: 'j' })) {
          this.contextList.push({id: 'j', name: '坚持发药', disabled: false, methodName: 'insistDispense'})
        }
      } else {
        if (objFind(this.contextList, { id: 'j' })) {
          this.contextList.splice(this.contextList.findIndex(val => { return val.id === 'j' }), 1)
        }
      }
      return this.contextList
    },
    /**
     * 执行单状态
     * 10,"待执行"
     * 20,"执行中"
     * 30,"已完成"
     * 40,"已取消"
     * 50+均为住院执行单状态
     * PRESUBMIT(51,"待提交"),
     * DELETED(52,"已删除")
     * INVALID(53,"已作废")
     * UNABLEFINISH(55,"无法执行")
     * 医嘱状态
     * 0, "待提交"
     * 1, "待执行"
     * 2, "未发药"
     * 5, "已完成"
     * 60 "报告已出"
     **/
    // 操作按钮显示判断逻辑
    getStatusShow (list, id) {
      if (id === 'a' || id === 'b') { // 撤回或整方撤回
        // 明细中都是未支付状态，且已提交（未发药），或者自备药，支付状态为null，且已提交，或未支付且（驳回或发药异常）可撤回
        let n1 = 0
        list.forEach(m => {
          if (
            (String(m.payStatus) === '0' && String(m.status) === '1') ||
            (String(m.source) === '2' && String(m.status) === '1' && m.payStatus === null) ||
            (String(m.payStatus) === '0' && (String(m.status) === '2' || String(m.status) === '70')) ||
            (m.adviceFeesList === null && String(m.status) === '1' && m.payStatus === null)
          ) {
            n1++
          }
        })
        return list.length === n1
      } else if (id === 'c' || id === 'd') { // 取消或整方取消
        // 明细中，实物类（药品，商品，耗材）已支付的状态，执行状态已提交，或出库异常，或者处方驳回，可取消
        // 明细中，非实物类，已支付状态，执行状态已提交，可取消
        let n2 = 0
        list.forEach(m => {
          if (['301', '302', '303', '304', '300', '10008', '3002'].includes(m.serviceType)) {
            if (String(m.payStatus) === '1' && (String(m.status) === '1' || String(m.status) === '70' || String(m.status) === '2')) {
              n2++
            }
          } else {
            if (String(m.payStatus) === '1' && String(m.status) === '1') {
              n2++
            }
          }
        })
        return list.length === n2
      } else if (id === 'e') { // 退库
        let n3 = 0
        // 院外，已发药，本机构的自提的药，非自备药，可退库
        list.forEach(m => {
          if (String(m.status) === '190' && !m.mailFlag && m.executeProviderId === 'SOB_EXTUDE_PROVIDER_OUT' && String(m.source) !== '2') {
            n3++
          }
        })
        return list.length === n3
      } else if (id === 'f') {  // 执行记录
        let n4 = 0
        // 药品 执行科室是院内的科室 且执行中，或已完成  可以查看执行记录
        // 治疗 执行中，或报告已出
        list.forEach(m => {
          if (m.outpatientExecutes && m.outpatientExecutes.length && ['301', '302', '303', '304', '800', '801', '802', '10003'].includes(m.serviceType)) {
            n4++
          }
        })
        return list.length === n4
      } else if (id === 'g') { // 查看报告
        // 检验，检查，手术  60 报告已出，可查看报告
        let n5 = false
        list.forEach(m => {
          if (m.releaseReport) {
            n5 = true
          }
        })
        return n5
      } else if (id === 'h') { // 操作日志
        return true
      } else if (id === 'i') { // 打印标签
        return true
      } else if (id === 'j') {  // 坚持发药
        return true
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      this[item.methodName](this.sendData[index])
    },
    // 撤回
    removeAdvice (item) {
      let ids = []
      this.fuziData[item.mainGroupId].forEach(val => {
        ids.push(val.id)
      })
      if (ids.length) this.remove(item, ids, 'mainGroupId')
    },
    // 整方撤回
    removeRecipe (item) {
      let ids = []
      let flag = false
      this.recipeData[item.recipeId].forEach(val => {
        ids.push(val.id)
        if (val.mainFlag) flag = true
      })
      if (flag) {
        return this.$messageTips(this, 'warning', '处方中包含父子医嘱，不能整方撤回', '提示')
      }
      if (ids.length) this.remove(item, ids, 'recipeId')
    },
    // 撤回，更新待提交及已提交数据
    remove (item, params, str) {
      this.recipeapi.removeRecipeAdvice({doctorAdviceIds: params}).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        // 门诊处方撤回后，如果返回列表，就展示在执行记录dialog
        if (rs.data && rs.data.length) {
          this.currentHandleObj = item
          this.excuteRecord(item, rs.data)
          return false
        }
        let data = this.sendData.filter(v => {
          return v[str] !== item[str]
        })
        this.$emit('cancel', data)
        this.$messageTips(this, 'success', '处方已成功撤回', '成功')
      })
    },
    // 取消
    cancelAdvice (item) {
      let ids = []
      this.fuziData[item.mainGroupId].forEach(val => {
        ids.push(val.id)
      })
      if (ids.length) this.cancel(item, ids)
    },
    // 整方取消
    cancelRecipe (item) {
      let ids = []
      let flag = false
      this.recipeData[item.recipeId].forEach(val => {
        ids.push(val.id)
        if (val.mainFlag) flag = true
      })
      if (flag) {
        return this.$messageTips(this, 'warning', '处方中包含父子医嘱，不能整方取消', '提示')
      }
      if (ids.length) this.cancel(item, ids)
    },
    // 取消
    cancel (item, params) {
      this.recipeapi.cancelRecipeAdvice({doctorAdviceIds: params}).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        // 门诊处方取消后，如果返回列表，就展示在执行记录dialog
        if (rs.data && rs.data.length) {
          this.currentHandleObj = item
          this.excuteRecord(item, rs.data)
          return false
        }
        this.$emit('update')
        this.$messageTips(this, 'success', '处方已成功取消', '成功')
      })
    },
    // 退库
    refundDrug (item) {
      this.currentRefund = this.fuziData[item.mainGroupId]
      this.refundVisible = true
    },
    // 退库 提交成功回调
    refundSuccess () {
      this.$emit('update')
    },
    // 查看报告
    viewReport (item) {
      if (!item.executeId) {
        item.executeId = item.outpatientExecutes && item.outpatientExecutes.length && item.outpatientExecutes[0].id || ''
      }
      this.$refs.reportcard.openDialog(item, true)
    },
    // 执行记录
    async excuteRecord (item, data) {
      this.currentHandleObj = item
      let list
      if (!data) {
        let ids = []
        this.fuziData[item.mainGroupId].forEach(val => {
          ids.push(val.id)
        })
        let result = await this.recipeapi.getExecuteRecordsByAdviceIds({ doctorAdviceIds: ids })
        if (result.head.errCode === 0 && result.data && result.data.length) {
          list = result.data
        }
      } else {
        list = data
      }
      if (list && list.length) {
        this.excuteRecordData = list
        this.excuteRecordVisible = true
      } else {
        this.$messageTips(this, 'warning', '未获取到执行记录', '提示')
      }
    },
    // 操作日志
    operationLog (item) {
      this.currentHandleObj = item
      this.logVisible = true
    },
    // 打印标签
    printBarcode (item) {
      let params = {
        idList: [this.baseInfo.doctorId],
        visitNumber: this.baseInfo.visitSn,
        patientId: this.baseInfo.patientId,
        serviceType: [item.serviceType],
        doctorAdviceIds: [item.id]
      }
      singlePrint('JIAN_YAN_TIAO_MA', params)
    },
    // 坚持发药
    insistDispense (item) {
      this.currentHandleObj = item
      this.handleVisible = true
    },
    confirmAdvice (handleObj) {
      let params = {
        reason: handleObj.reason,
        doctorAdviceId: this.currentHandleObj.id,
        recipeId: this.currentHandleObj.recipeId
      }
      this.recipeapi.confirmMaterialOutStatus(params).then(res => {
        this.handleVisible = false
        if (res.head.errCode === 0) {
          this.$emit('update')
          this.$messageTips(this, 'success', '保存成功', '成功')
        } else {
          this.$messageTips(this, 'warning', '保存失败', '提示')
        }
      })
    }
  },
  components: {
    refundDialog,       // 退库退费dialog组件
    excuteRecordDialog, // 执行记录dialog组件
    operationLog,       // 操作日志dialog组件
    reportcard,         // 查看报告dialog组件
    insistDispense      // 坚持发药dialog组件
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
    },
    recipeData () {
      let obj = {}
      this.sendData.forEach(item => {
        if (obj[item.recipeId]) {
          obj[item.recipeId].push(item)
        } else {
          obj[item.recipeId] = [item]
        }
      })
      return obj
    }
  },
  watch: {
  },
  destroyed () {
    // this.$bus.$off('refundEvent')
  }
}
</script>
<style scoped lang="scss">
#sendarea {
  width: 100%;
  #sendtable {
    /deep/ .el-table {
      tr {
        .noBottomBorder {
          border-bottom: none;
        }
        .pad-rt-30 {
          .cell {
            padding-right: 30px;
          }
        }
        .lineGray {
          text-decoration: line-through;
          color: #ccc;
          .labWrap {
            text-decoration: line-through;
          }
        }
        &:hover {
          td {
            background: transparent;
          }
        }
        .topCell {
          .cell {
            margin-bottom: -4px;
          }
        }
        .middleCell {
          .cell {
            margin-top: -4px;
            margin-bottom: -4px;
          }
        }
        .bottomCell {
          .cell {
            margin-top: -4px;
          }
        }
        .cell {
          .namesWrap {
            display: flex;
            .leftIcons {
              width: 6px;
              margin-right: 8px;
              position: relative;
              .top {
                border-top: 3px solid;
                border-left: 3px solid;
                width: 100%;
                position: absolute;
                top: 8px;
                bottom: 0;
              }
              .middle {
                border-left: 3px solid;
                width: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
              }
              .bottom {
                border-bottom: 3px solid;
                border-left: 3px solid;
                width: 100%;
                height: 10px;
                position: absolute;
                top: 0;
              }
            }
            .cellMain {
              flex: 1;
              .labWrap {
                position: relative;
                margin: 5px 40px 5px 0;
                line-height: 1.5;
                word-wrap: break-word;
                display: inline-block;
                .lab {
                  font-size: 12px;
                  position: absolute;
                  right: -48px;
                  width: 48px;
                  transform: scale(0.9, 0.9);
                }
              }
            }
          }
        }
      }
      .iconfont {
        color: #999;
      }
      .icon-charge {
        color: #009944;
      }
      .iconYouji {
        color: #FF4F00;
        position: absolute;
        top: 1px;
        right: 0;
        font-size: 24px;
      }
      .icon-yichang {
        font-size: 14px;
      }
      .fontMargin {
        margin: 0 2px;
        font-size: 16px;
      }
    }
  }
}
</style>
