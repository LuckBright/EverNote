/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:28
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-21 10:08:29
 */
<template>
  <el-container>
    <ever-bread-crumb name="任务详情"></ever-bread-crumb>
    <el-main class="page_layout_full_hidden main">
      <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
        <template>
          <!-- 患者头组件 -->
          <template v-if="!isInternet">
            <patient-header
              :patient-id="patientId"
              :visit-number="visitNumber"
              :code="patientCode">
            </patient-header>
            <div v-if="typeof termType == 'number'" class="bWhite merge-patient-header">
              <div class="f14"><span>预执行时间：</span><span v-html="runTime"></span></div>
            </div>
          </template>
          <el-container class="flex_column_full_hidden station_layout_wrap bg_white mt5">
            <!-- 自取 | 邮寄 标识 -->
            <!-- 互联网商城订单不展示邮寄标识 -->
            <stateful v-if="((delivery == 1 || orderType == 1) && !isInternet)" :show-name="orderType == 1 ? '入库' : ''" :status="delivery"></stateful>

            <!-- 固定滚动区域 -->
            <el-main class="flex_scroll">

              <template v-if="!isInternet">
                <!-- 邮寄地址信息 -->
                <div class="ptb10" v-if="mailAddress">
                  <span class="cGray">收货地址：</span>
                  <strong>{{mailAddress.name}}</strong>
                  ({{mailAddress.mobile}})
                  <ever-address v-model="mailAddress.address" :level="2" :convertToFnt="true"></ever-address>
                </div>

                <!-- 机构  库房名称 -->
                <strong class="ptb10" v-if="type != 3">
                  {{clinicName}}<span v-if="actualStorageRoomName && clinicName"> - </span>{{actualStorageRoomName}} <span v-if="isOwnerOrg">(本机构)</span>
                </strong>
              </template>

              <template v-else>
                <!-- 互联网商城订单头信息 、超市收银 -->
                <order-header
                  class="p10"
                  :source="type == 4 ? 1 : ''"
                  :types="type == 4 ? [1, 3] : orderType == 1 ? [2] :  [1]"
                  :head-obj="orderHeadObj">
                </order-header>
              </template>

              <!-- 发药任务表格 -->
              <task-table
                :key="taskCode"
                :table-data="tableData"
                :order-type="orderType"
                :is-batch="isBatch"
                :task-type="String(taskType)"
                :type="type"></task-table>


              <!-- 发货流程 | 退药流程 -->
              <time-line
                style="width: 890px"
                :time-lines="processStatusList"
                :title="`${orderType == 0 ? '发货' : '退货'}流程`"></time-line>
              <!-- <approval-flows :processInstanceId="processInstanceId" @getProcessObj="getObj"></approval-flows> -->
            </el-main>
          </el-container>

        </template>
        <!-- <template v-else>
          <ever-no-data :tip-txt="noDataTip"></ever-no-data>
        </template> -->
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import PatientHeader from '@/inpatient/components/common.head.js'
import approvalFlows from '@/message/page/approval.flows.vue' // 审批流组件
import TimeLine from '../../components/timeline'
import Stateful from '@/warehouse/views/drug/component/stateful'
import TaskTable from '../../components/tasktable'
import OrderHeader from '@/warehouse/views/drug/internetmall/components/order.header.vue'
import api from '@/order/store/task.js'
import { omit } from 'lodash'
import { dateFormat } from '@/util/common'

export default {
  data () {
    return {
      loading: false,
      noDataTip: '暂无任务',
      patientId: '', // 患者id
      visitSn: '', // 门诊号
      hospitalizedNumber: '', // 住院号
      patientCode: '015',
      key: '1',
      orderType: '', // 0代表发药单，1代表退药单
      taskType: '', // 物资类型 301 西药  302 中成药 303 中药饮片 304 中成药
      taskCode: '',
      isOwnerOrg: '', // 是否本机构 1:本机构 0:非本机构
      tableData: [],
      orderHeadObj: {},  // 订单头信息
      delivery: '', // 是否邮寄 0：自取  1:邮寄 2:自备
      implementTime: '', // 执行时间
      termType: '', // 医嘱类型：0、临时；1、长期(医嘱)
      type: this.$route.params.type - 0, // 业务类型： 门诊／住院／超市收银／互联网商城等
      actualStorageRoomName: '', // 库房名
      clinicName: '', // 机构名
      processStatusList: [], // 流程状态集合
      mailAddress: '', // 邮寄地址对象
      isBatch: false, // 是否是批次定价模式数据
    }
  },
  created () {
    const { orderType, code, type } = this.$route.params
    this.orderType = orderType - 0
    this.taskCode = code
    this.loading = true
    api.getSummaryTaskItem({
      orderType,
      code,
      type
    }).then(res => {
      if (Array.isArray(res) && res.length) {
        res = res.map(item => (Object.assign({}, item, { _sourceData: res })))
        const data = res[0]
        // 批次定价模式数据会有多条
        const { sysBatchCode } = data
        this.isBatch = !!sysBatchCode
        // 住院按明细展示 ?
        this.tableData = this.isBatch ? res : [data]
        this.setParamsValue(['mailAddress', 'delivery', 'clinicName', 'mailAddress', 'isOwnerOrg', 'implementTime', 'termType', 'actualStorageRoomName', 'taskType', 'visitSn', 'hospitalizedNumber', 'patientId'], data)
        const { processStatusList } = data
        // 解析出mailAddress 中的数据  传递给 订单头信息展示
        const { mobile: phone, name: consignee, address } = this.mailAddress || {}
        this.orderHeadObj = Object.assign({}, omit(data, ['processStatusList', 'mailAddress']), { consignee, phone, address })
        if (Array.isArray(processStatusList)) {
          this.processStatusList = processStatusList
        }
      }
    }).finally(_ => {
      this.loading = false
    })
  },
  methods: {
    setParamsValue (keys, obj) {
      keys.forEach(key => {
        this[key] = obj[key]
      })
    }
  },
  computed: {
    runTime () {
      return !this.termType ? `${dateFormat(this.implementTime, 'YYYY-MM-DD')} <strong class="f16">立即执行</strong>` : `${dateFormat(this.implementTime, 'YYYY-MM-DD')} <strong class="f16">${dateFormat(this.implementTime, 'HH:mm')}</strong>`
    },
    visitNumber () {
      return this.visitSn || this.hospitalizedNumber
    },
    isInternet () { // 互联网商城、超市收银
      return [4, 5].includes(this.type)
    }
  },
  components: {
    PatientHeader,
    OrderHeader,
    TaskTable,
    Stateful,
    TimeLine,
    approvalFlows
  }
}
</script>

<style lang="scss" scoped>
.merge-patient-header {
  padding: 0 10px 10px 10px;
}
</style>
