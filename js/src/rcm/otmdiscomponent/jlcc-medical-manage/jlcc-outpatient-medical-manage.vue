<template>
  <div>
    <commonTable @showDetail="showDetail" @payStatus="payStatus">
      <template slot="innerOperations" slot-scope="scope">
        <el-button type="primary" @click="showConfirmBox(1,scope.innerRow)">撤销交易</el-button>
        <el-button type="primary" @click="reconciliation(scope.innerRow)">对账</el-button>
        <el-button type="primary" @click="settle(scope.innerRow)">结算</el-button>
      </template>
      <template slot="outOperations" slot-scope="scope">
        <el-button type="primary" @click="handleOutClick(scope.outRow)">票据打印</el-button>
        <el-button type="primary" @click="handleOutClick(scope.outRow)">票据重打</el-button>
        <el-button type="primary" @click="handleOutClick(scope.outRow)">票据补打</el-button>
        <el-button type="primary" @click="showConfirmBox(2,scope.outRow)">修改票号</el-button>
        <el-button type="primary" @click="showConfirmBox(0,scope.outRow)">撤销门诊</el-button>
        <el-button type="primary" @click="reconciliation(scope.outRow)">对账</el-button>
      </template>
    </commonTable>
    <confirmBox ref="confirmbox" :message="confirmMessage" @sure="handleSureMethod"></confirmBox>
    <recipedetail :recipeshow.sync="recipeshow"></recipedetail>
    <medicalsettleinfo :settleInfoShow.sync="settleInfoShow"></medicalsettleinfo>
  </div>
</template>

<script>
import commonTable from '@/rcm/otmdiscomponent/jlcc-medical-manage/jlcc-medical-manage-common.vue'
import confirmBox from '@/rcm/otmdiscomponent/confirmbox.vue'
import medicalsettleinfo from '@/rcm/otmdiscomponent/medicalsettleinfo.vue'
import recipedetail from '@/rcm/otmdiscomponent/recipedetail.vue'
export default {
  data () {
    return {
      tableData: [],
      confirmMessage: '消息确认框',
      confirmType: 0, // 标识触发的消息确认框类型
      confirmData: {}, // 触发消息确认框的那行数据
      handlerMap: {
        0: { message: '撤销门诊将无法报销本次门诊的所有交易！是否确定撤销？', confirmType: 'showConfirmBox', sureMethod: this.repealOutpatient }, // 撤销门诊
        1: { message: '撤销交易将无法报销本次交易！是否确定撤销？', confirmType: 'showConfirmBox', sureMethod: this.repealTrade }, // 撤销交易
        2: { message: '', confirmType: 'showPrompt', sureMethod: this.modifyBill }  // 修改票号
      },
      settleInfoShow: false,
      recipeshow: false
    }
  },
  methods: {
    showDetail (row) {
      this.recipeshow = true
    },
    payStatus (row) {
      this.settleInfoShow = true
    },
    // 转发消息确认框处理事件
    handleSureMethod (data) {
      this.handlerMap[this.confirmType]['sureMethod'].call(this, data)
    },
    showConfirmBox (type, rowData) {
      this.confirmType = type
      this.confirmData = rowData
      if (type === 2) {
        this.handlerMap[type]['message'] = rowData.innerprop7
      }
      this.confirmMessage = this.handlerMap[type]['message']
      this.$nextTick(_ => {
        this.$refs.confirmbox[this.handlerMap[type]['confirmType']].call(this)
      })
    },
    // 撤销门诊
    repealOutpatient () {
      console.log('撤销门诊')
    },
    // 撤销交易
    repealTrade () {
      console.log('撤销交易')
    },
    // 变更票号
    modifyBill (data) {
      console.log('变更票号', data)
    },
    // 对账
    reconciliation (row) { },
    // 结算
    settle () { }
  },
  components: {
    commonTable,
    confirmBox,
    medicalsettleinfo,
    recipedetail
  }
}
</script>
