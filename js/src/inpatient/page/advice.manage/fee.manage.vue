<template>
  <div class="fee-manage">
    <span class="iconfont icon-exit close-btn" @click="close" v-if="!disabled"></span>
    <!-- 费用列表 -->
    <ever-table
      border
      id="fee-table"
      ref="feeTable"
      :loading="false"
      :columns="columns"
      :data="tableListData"
      :row-class-name="() => rowClass"
      :is-pagination="false"
      :is-drag-table="true"
      :max-height="maxHeight || 150"
      @cell-dblclick="editFeeOrder"
    >
      <template slot="feesType" slot-scope="scope">
        <span>{{getFeesType(scope.row)}}</span>
      </template>
      <template slot="spec" slot-scope="scope">
        <!-- 实物类的才有规格 -->
        <span>{{['10008', '299', '300', '301', '302', '303', '304'].includes(scope.row.serviceType) && scope.row.spec || '--'}}</span>
      </template>
      <template slot="finType" slot-scope="scope">
        <sys-value type="THC_RCM_FIN_TYPE" :code="scope.row.feesJson && scope.row.feesJson.finType"></sys-value>
      </template>
      <template slot="count" slot-scope="scope">
        <span>{{scope.row.count + scope.row.countUnitName}}</span>
      </template>
      <template slot="price" slot-scope="scope">
        <span>¥{{(scope.row.price || 0).toFixed(2)}}</span>
      </template>
      <template slot="total" slot-scope="scope">
        <span>¥{{(scope.row.count * scope.row.price).toFixed(2)}}</span>
      </template>
    </ever-table>
    <!-- 右键操作按钮列表 -->
    <contextmenu v-if="!disabled" :class-name="rowClass" :menu="contextList" @menu="getMenuList" @select="contextSelect"></contextmenu>
    <!-- 补费开单表单 -->
    <div class="add-order-wrap" v-if="!disabled">
      <div
        class="fee-orders-loading"
        v-show="loading"
        v-loading="loading"
        element-loading-text="加载费用信息中">
      </div>
      <div class="add_order_handle mt5"  v-if="!loading">
        <ever-form2
          v-ever-bind-enter
          ref="orderForm"
          :schema="schema"
          v-model="obj"
          :nosubmit="true"
          :gutter="10"
          :rules="rules"
          labelPosition="top"
          :showMessage="formShowMessage"
          :row-flex="true"
          :key="randomKey"
        >
          <template slot="serviceItem">
            <div class="service-item" v-if="obj.serviceItem">
              <span class="iconfont icon-exit clear-btn-front" @click="initOrder"></span>
              <el-input :value="obj.serviceItem.byname || obj.serviceItem.name" :disabled="true"></el-input>
            </div>
            <service-select
              v-show="!obj.serviceItem"
              class="service_select"
              v-model="obj.serviceItem"
              :search-type="searchType"
              :type="adviceType"
              three-type=""
              value-key="id"
              placeholder
              :scene="3"
              :providerId="patientInfo.providerId"
              :is-fee="true"
              :is-set="0"
              emit-name="feeTplSelectQuote"
              ref="select"
            ></service-select>
          </template>
          <template slot="handlerBtn">
            <el-button
              type="primary"
              class="handle_btn"
              @click="submit"
              :loading="subLoading"
            >添加</el-button>
          </template>
        </ever-form2>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@/assets/locals/index'
import contextmenu from '@/workspace/components/contextmenu'  // 右键组件
import api from '@/inpatient/components/fee.orders/api'
import adviceapi from '@/inpatient/store/adviceapi'
import storage from '@/util/storage'
import { objFind } from '@/util/common'

export default {
  components: {
    contextmenu
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    subOrderSource: {
      type: Number,
      default: 11
    },
    scene: {
      type: Number,
      default: 1
    },
    searchType: {
      type: Number,
      default: 2
    },
    curAdvice: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxHeight: Number
  },
  data () {
    let schema = this.getSchema()
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      randomKey: Math.random(),
      tableListData: [],
      rowClass: 'fee-list-item',
      columns: [],
      contextList: [
        { id: 'a', name: '删除', disabled: false, methodName: 'deleteFee' }
      ],
      schema,
      obj,
      subLoading: false,
      loading: false,
      formShowMessage: false,
      patientInfo: {},
      adviceType: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.setTicketCode()
      this.getPatientInfo()
      this.getTableList()
      this.columns = this.getColumns()
      this.getFeeConfig('ZYHS-001')
      this.rules = {
        serviceItem: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        count: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
      }
    },
    initOrder (data, cb) {
      this.schema = this.getSchema()
      this.obj = Object.assign(this.obj, this.$ever.createObjFromSchema(this.schema))
      this.formShowMessage = false
      this.getRandomKey()
    },
    // 获取补费患者信息
    getPatientInfo () {
      if (this.curAdvice.length === 1) {
        this.mainAdvice = this.curAdvice[0]
      } else {
        this.mainAdvice = objFind(this.curAdvice, { mainFlag: 1 })
      }
      if (!this.mainAdvice) {
        this.close()
        this.$messageTips(this, 'warning', '未获取到医嘱信息')
      }
      let curAdvice = this.mainAdvice
      if (!curAdvice) {
        this.patientInfo = {}
        return
      }
      this.patientInfo = {
        hospitalizedNumber: curAdvice.hospitalizedNumber,
        patientId: curAdvice.patientId,
        patientName: curAdvice.patientName,
        orgId: curAdvice.orgId,
        orgName: curAdvice.orgName,
        providerId: curAdvice.providerId,
        providerName: curAdvice.providerName,
        tenantId: curAdvice.tenantId
      }
    },
    // 右键操作按钮列表触发事件回调
    getMenuList (index) {
      // 中药不允许删除且医嘱自带的费用
      // let isSelf = +this.mainAdvice.source === 2
      // let isMdrug = ['303', '304'].includes(this.tableListData[index].serviceType)
      let feesType = this.tableListData[index].feesType === 1
      this.contextList.forEach((v) => {
        v.disabled = true
        // if ((isSelf || isMdrug) && feesType) {
        if (feesType) {
          v.disabled = true
        } else {
          v.disabled = false
        }
      })
    },
    getRandomKey () {
      this.randomKey = Math.random()
    },
    getTableList () {
      if (!this.curAdvice.length) {
        this.tableListData = []
      }
      let params = {
        hospitalizedNumber: this.mainAdvice.hospitalizedNumber,
        doctorAdviceIdList: this.curAdvice.map(item => item.id)
      }
      api.getAdviceFeesInfo(params).then(res => {
        this.tableListData = []
        res && res.forEach(item => {
          this.tableListData.push(item)
        })
      })
    },
    submit () {
      let curAdvice = this.curAdvice[0] || {}
      let isValid = true
      this.$refs.orderForm.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      if (isValid) {
        this.subLoading = true
        let data = JSON.parse(JSON.stringify(this.obj))
        let obj = this.obj
        let service = obj.serviceItem
        data = {
          serviceType: service.serviceClassification, // 收费项id
          serviceName: service.byname || service.name, // 费用名称
          serviceId: service.id, // 费用项id
          price: (service.price || 0) * obj.count, // 金额
          count: obj.count, // 数量
          countUnitId: service.unit, // 数量单位id
          countUnitName: service.unitName,
          spec: service.spec, // 规格
          feesJson: {
            chargeLevel: service.chargeLevel,
            finType: service.finType, // 业务分类
            outwardDeliveryFlag: service.outwardDeliveryFlag, // 外送
            feesDoctorId: curAdvice.doctorId, // 开单医生id
            feesDoctorName: curAdvice.doctorName, // 开单医生名称
          }
        }
        this.getSubmitData(data).then(res => {
          if (res) {
            this.formShowMessage = false
            this.subLoading = false
            this.getTableList()
            this.initOrder()
          } else {
            this.subLoading = false
          }
        })
      } else {
        this.formShowMessage = true
      }
    },
    async getSubmitData (datas) {
      if (!datas) {
        return false
      }
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      let params = {
        // 公共部分
        orgId: this.patientInfo.orgId, // 机构id
        orgName: this.patientInfo.orgName, // 机构名称
        patientId: this.patientInfo.patientId, // 患者id
        patientName: this.patientInfo.patientName, // 患者姓名
        hospitalizedNumber: this.patientInfo.hospitalizedNumber, // 住院号
        channel: 1,
        visitType: 3, // 住院
        tenantId: this.patientInfo.tenantId, // 归属
        doctorId: this.$store.state.currentUser.userId, // 补费用项的护士
        doctorName: this.$store.state.currentUser.displayName, // 护士名字
        providerId: this.mainAdvice.providerId,
        providerName: this.mainAdvice.providerName,
        adviceFeesDtoList: datas.map(data => {
          data.tenantId = this.patientInfo.tenantId
          data.orgId = this.patientInfo.orgId
          data.feesType = 3
          data.doctorAdviceId = this.mainAdvice.id
          data.consultId = this.mainAdvice.consultId
          data.executeProviderId = this.mainAdvice.executeProviderId
          data.executeProviderName = this.mainAdvice.adviceJson.executeProviderName
          data.providerId = this.mainAdvice.providerId
          data.providerName = this.mainAdvice.providerName
          return data
        })
      }
      let res = await api.createAdviceFeesForInpatient(params)
      this.setTicketCode()
      if (res) {
        return true
      }
      return false
    },
    setTicketCode () {
      adviceapi.getTicketCode().then(rs => {
        return rs.head.errCode === 0 && storage.setStorageByClinic('x-ticket-code', rs.data.xTicketCode)
      })
    },
    // 获取service
    async getFeeService (datas) {
      let services = [{
        id: datas.serviceId,
        isSet: 0
      }]
      let params = {
        providerId: this.patientInfo.providerId,
        scene: this.scene,
        services,
        hospitalizedNumber: this.patientInfo.hospitalizedNumber
      }
      const res = await api.queryOrgFeeTemplate(params).catch(() => false)
      if (res && res.length) {
        this.obj.serviceItem = res[0]
        this.obj.count = datas.count
      }
    },
    // 编辑事件
    editFeeOrder ({ row }) {
      // if (row.feesType === 1) return
      // this.deleteFee(row)
      // this.getFeeService(row)
    },
    // 关闭事件
    close () {
      this.$emit('close')
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      this[item.methodName](this.tableListData[index], index)
    },
    // 费用删除事件
    deleteFee (order) {
      let param = {
        id: order.id,
        delFlag: 1
      }
      api.updateAdviceFees([param]).then(res => {
        if (res) {
          this.getTableList()
        }
      })
    },
    // 获取补费配置
    async getFeeConfig (workspace) {
      let res = await api.getChargeConfig({ sceneCode: workspace })
      // 去除实物类
      if (res) {
        let types = (res[workspace] || '').split(',')
        this.adviceType = types.filter(item => !['300', '301', '302', '303', '304', '10008', '3002'].includes(item)).join(',')
      } else {
        this.adviceType = ''
      }
    },
    // 获取费用来源
    getFeesType (row) {
      if (!row.feesType) {
        return '--'
      }
      // 已记账状态 未支付 已支付 已退费
      switch (row.feesType) {
        case 1:
          return '医嘱费用'
        case 2:
          return '自动追加'
        case 3:
          return '护士计费'
        case 4:
          return '医技计费'
        case 5:
          return '手术计费'
        case 6:
          return '门诊收费站'
        default:
          return '--'
      }
    },
    getColumns () {
      return [
        {
          slot: 'feesType',
          prop: 'feesType',
          label: i18n.t('费用来源'),
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          slot: 'finType',
          prop: 'finType',
          label: i18n.t('业务分类'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // undraggable: true
        },
        {
          prop: 'serviceName',
          label: i18n.t('收费项目'),
          minWidth: '20%',
          showOverflowTooltip: true
        },
        {
          slot: 'spec',
          prop: 'spec',
          label: i18n.t('规格'),
          minWidth: '7%',
          showOverflowTooltip: true
        },
        {
          slot: 'count',
          prop: 'count',
          label: i18n.t('数量'),
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'price',
          prop: 'price',
          label: i18n.t('单次价格'),
          showOverflowTooltip: true,
          minWidth: '10%',
        },
        {
          slot: 'total',
          props: 'total',
          label: i18n.t('总价'),
          showOverflowTooltip: true,
          minWidth: '10%'
        }
      ]
    },
    getSchema () {
      return [{
        name: 'serviceItem',
        label: '收费项目',
        comp: 'custom',
        span: 8
      }, {
        name: 'count',
        label: '数量',
        comp: 'sys-number',
        span: 4,
        props: {
          type: 'number',
          append: '',
          field: {
            min: 1,
            max: 999,
            limitInteger: true
          }
        }
      }, {
        name: 'handlerBtn',
        label: '　',
        comp: 'custom',
        span: 2
      }]
    }
  },
  watch: {
    'curAdvice': {
      handler (val) {
        this.getPatientInfo()
        this.getTableList()
      },
      deep: true
    }
  },
}
</script>

<style lang="scss" scoped>
.fee-manage {
  padding-right: 20px;
  position: relative;
  .close-btn {
    position: absolute;
    right: 0;
    color: #999;
    font-size: 12px;
    margin-top: 3px;
  }
  .add-order-wrap {
    margin-top: 20px;
    .service-item {
      position: relative;
      .clear-btn-front {
        position: absolute;
        right: 1px;
        top: 0;
        z-index: 10;
        color: #999;
        font-size: 10px;
        background-color: #eeeeee;
        padding: 0 5px;
        height: calc(100% - 3px);
        margin-top: 1px;
      }
      .no-bg-color {
        background-color: transparent;
      }
    }
    .fee-orders-loading {
      height: 50px;
      background-color: #fff;
      /deep/ .el-loading-spinner {
        margin-top: -36px;
      }
    }
    .add_order_handle {
      max-width: 70%;
      min-width: 800px;
      height: 84px;
      .no_wrap {
        white-space: nowrap;
      }
      .handle_btn {
        display: inline-block;
        vertical-align: top;
      }
    }
    /deep/ .el-form-item__label {
      justify-content: flex-start;
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      .el-form-item__label,
      .el-form-item__content {
        height: 30px;
        line-height: 30px;
        /deep/.el-button {
          padding: 5px 10px;
          font-size: 12px;
        }
      }
      .el-input__inner,
      .el-input__prefix,
      .el-input__suffix {
        height: 30px;
        line-height: 30px;
      }
      .el-input__icon {
        line-height: 24px;
      }
    }
  }
}
</style>
