<template>
  <div class="add-order-wrap">
    <slot></slot>
    <template v-if="hasHeader">
      <h3 class="e_til" v-if="!isAddTpl">补费</h3>
      <h3 class="e_til" v-else>添加</h3>
    </template>
    <div
      class="fee-orders-loading"
      v-show="loading"
      v-loading="loading"
      element-loading-text="加载费用信息中">
    </div>
    <div :style="`min-width: ${120*schema.length}px;`" class="add-order-handle mt5" v-if="!loading">
      <ever-form2
        :key="keyRandom"
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
      >
        <template slot="serviceItem">
          <div class="service-item" v-if="obj.serviceItem">
            <span class="iconfont icon-exit clear-btn-front" @click="clear"></span>
            <el-input :value="obj.serviceItem.byname || obj.serviceItem.name" :disabled="true"></el-input>
					</div>
					<!-- v-model="obj.serviceItem" -->
          <service-select
            v-else
						class="service_select"
						:value="obj.serviceItem"
            :type="adviceType"
            three-type=""
            value-key="id"
            placeholder
            :providerTypes="providerTypes"
            :scene="scene"
            :is-fee="true"
            :is-set="0"
            :emit-name="quoteEventName"
            v-bind="$attrs"
            ref="select"
            @change="serviceChange"
          ></service-select>
          <label v-if="checkPriceInfo" class="el-form-item-error">{{isAddTpl ? '' : $t('未获取到价钱，请联系管理员维护')}}</label>
          <label v-if="checkStockInfo" class="el-form-item-error">{{getStockInfo()}}</label>
          <label v-if="isNotCharge" class="el-form-item-error">当前患者已欠费，不能计费</label>
          <label v-else-if="isShowStockInfo && !checkStockInfo" :class="isShort?'el-form-item-error':'el-form-item-info'">{{getStockInfo()}}</label>
        </template>
        <!-- 计费时间 -->
        <template slot="chargeTime">
          <date-picker
            type="datetime"
            v-model="obj.chargeTime"
            :pickerOptions="pickerOptions"
            :field="{showformat: 'yyyy-MM-dd HH:mm'}"
            :clearable="false"
            @change="chargeTimeChange"
          ></date-picker>
        </template>
        <template slot="price">
          <div
            class="no_wrap"
          >¥ {{obj.serviceItem && obj.serviceItem.price && obj.count ? (obj.serviceItem.price * obj.count).toFixed(2) : '0.00'}}</div>
        </template>
        <template slot="handlerBtn">
          <el-button
            v-if="isAdd"
            type="primary"
            class="handle_btn"
            @click="beforeSubmit"
            :loading="subLoading"
          >添加</el-button>
        </template>
      </ever-form2>
    </div>
    <!-- 库存不足 -->
    <el-dialog
      v-if="isShort"
      :visible.sync="noStockSubmit"
      title="警告"
      size="small"
      class="ui_dialog_02"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      @close="noStockSubmit = false"
    >
      <div class="waring-wrap">
        <span class="title">{{$t('库存不足')}}</span>
        <ul>
          <li>
            <template>1、{{obj.serviceItem.byname || obj.serviceItem.name}}</template>
            <template v-if="obj.serviceItem.spec">{{obj.serviceItem.spec}}</template>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
				<template v-if="stockPermission">
					<el-button @click="noStockSubmit = false">
						<i class="icon iconfont icon-quxiao"></i>{{$t('取消')}}
					</el-button>
					<el-button type="primary" @click="conSubmitStock">
						<i class="icon iconfont icon-tijiao"></i>{{$t('继续提交')}}
					</el-button>
				</template>
        <el-button type="primary" @click="noStockSubmit = false" v-else>
          <i class="icon iconfont icon-quxiao"></i>{{$t('我知道了')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { objFind } from '@/util/common'
import api from './api'
import * as doctorApi from '../doctor.state/api'
import sysvalue from '@/warehouse/store/sysvalueapi'
import orderApi from '@/inpatient/components/issued.orders/api.js'

// import storage from '@/util/storage.js'
export default {
  /** searchType(number): 1：医嘱项，2：收费项
  * subOrderSource
  * 1-普通订单；
  * 10-门诊普通订单；11-门诊护士补费；12-门诊手麻补费；13-门诊结算补费
  * 30-住院普通订单；31-住院护士补费；32-住院手麻补费；33-住院结算补费
  * 34-临床路径补费；35-住院手术费用；36-产房普通费用; 37-产房护士补费;
  * ['10000', '10001', '10002', '10003', '10004', '10005', '10006', '10008', '10009', '175801', '2124', '2125', '2126', '2466', '2467', '299', '300', '301', '302', '303', '304', '341', '503', '504', '553', '799', '800', '800001', '800002', '800003', '800004', '800005', '800006', '800007', '801', '801001', '801002', '801003', '802', '80201', '80202', '832', '867']
  **/
  props: {
    providerList: {
      type: Array,
      default: () => [],
    },
    orderSource: Number,
    subOrderSource: Number,
    baseInfo: Object,
    filterAdviceType: { // 可查类型
      type: String,
      default: '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,299,301,302,303,304,341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867'
    },
    /**
     * ZYHS-001 住院护士工作站
     * YJ-001 医技工作站
     * SMGL-001 手麻管理工作站
     **/
    workspace: String, // 工作站类型，有这个字段就不用filterAdviceType
    isAddTpl: Boolean,
    scene: {
      type: Number,
      default: 1
    },
    hasHeader: {
      type: Boolean,
      default: true
    },
    quoteEventName: { // 模版引用的接受事件名称
      type: String,
      default: 'feeTplSelectQuote'
    },
    providerTypes: { // 执行地科室类型
      type: Array,
      default: () => ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04'] // 默认门急诊+医技
    },
    isAdd: { // 是否费用模版使用组件
      type: Boolean,
      default: true
    },
    editorData: Object, // 费用模版引用回显数据
    feeToStockTpl: String
  },
  data () {
    let schema = this.getSchema()
    let obj = this.$ever.createObjFromSchema(schema)
    obj.chargeTime = this.$moment().valueOf()
    return {
      schema: this.getSchema(),
      obj,
      subLoading: false,
      loading: false,
      formShowMessage: false,
      checkPriceInfo: false, // 价格检查
      isShowStockInfo: false, // 是否显示库存信息
      checkStockInfo: false, // 库房检测
      isNotCharge: false, // 欠费提示
      isShort: false, // 是否缺货
      keyRandom: Math.random(),
      feesDoctorList: [],
      noStockSubmit: false, // 缺货提示弹窗
      feeToStock: this.feeToStockTpl || '2', // 费用联动库存
      adviceType: '',
      stockPermission: true // 是否允许缺库存提交
    }
  },
  computed: {
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.rules = {
        serviceItem: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        count: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        provider: [{ required: true, message: '必填项', trigger: 'change' }],
        executeProvider: [{ required: true, message: '必填项', trigger: 'change' }],
        finType: [{ required: true, message: '必填项', trigger: 'change' }],
        serviceName: [{ required: true, message: '必填项', trigger: 'change' }],
        storageRoom: [{ required: true, message: '必填项', trigger: 'change' }],
        feesDoctor: [{ required: true, message: '必填项', trigger: 'change' }]
      }
      // 计费时间时间限制
      let chargeTime = this.baseInfo.chargeTime
      this.pickerOptions = {
        disabledDate (time) {
          return time.getTime() < (chargeTime || 0) - 8.64e7
        }
      }
      // 模版引用编辑
      if (!this.isAdd) {
        this.initOrder(this.editorData)
        if (this.editorData.feesJson.storageRoomId) {
          this.storageRoom = {
            id: this.editorData.feesJson.storageRoomId,
            sendOrgId: this.editorData.feesJson.sendOrgId,
            materialType: this.editorData.feesJson.materialType
          }
        }
        this.serviceChange(this.editorData.serviceItem)
        return
      }
      this.getFeeToStock()
      if (this.workspace) {
        this.getFeeConfig(this.workspace).then(res => {
          this.adviceType = res
        })
      } else {
        this.adviceType = this.filterAdviceType || ''
      }
      // 编辑
      this.$bus.$off('edit:feeorder')
      this.$bus.$on('edit:feeorder', (data, cb) => {
        let params = {
          providerId: this.baseInfo.providerId,
          scene: this.scene,
          services: [{id: data.serviceId, isSet: 0}],
          visitNumber: this.baseInfo.visitNumber
        }
        this.loading = true
        api.queryOrgFeeTemplate(params).then(res => {
          if (res && res.length) {
            this.initOrder(data)
            if (data.feesJson.storageRoomId) {
              this.storageRoom = {
                id: data.feesJson.storageRoomId,
                sendOrgId: data.feesJson.sendOrgId,
                materialType: data.feesJson.materialType
              }
            }
            this.serviceChange(res[0])
            cb && cb()
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
      this.initOrder()
    },
    // 初始化补费form信息
    initOrder (data, cb) {
      this.schema = this.getSchema()
      this.obj = Object.assign(this.obj, this.$ever.createObjFromSchema(this.schema))
      this.obj.chargeTime = this.$moment().valueOf()
      this.formShowMessage = false
      this.checkPriceInfo = false
      this.keyRandom = Math.random()
      this.serviceItem = null
      this.isShowStockInfo = false
      this.checkStockInfo = false
      this.isShort = false
      this.isNotCharge = false
      this.storageRoom = ''
      if (this.baseInfo.feesDoctorId) {
        this.obj.feesDoctor = {
          name: this.baseInfo.feesDoctorName || '',
          id: this.baseInfo.feesDoctorId
        }
      }
      if (this.baseInfo.providerId) {
        this.obj.provider = {
          id: this.baseInfo.openProviderId || this.baseInfo.providerId,
          name: this.baseInfo.openProviderName || this.baseInfo.providerName
        }
      }
      if (data) {
        let keyList = Object.keys(this.obj)
        keyList.forEach(k => {
          if (k === 'provider' && data.providerId) {
            this.obj.provider = {name: data.providerName, id: data.providerId}
            return
          }
          if (k === 'executeProvider' && data.executeProviderId) {
            this.obj.executeProvider = {name: data.executeProviderName, id: data.executeProviderId}
            return
          }
          if (k === 'feesDoctor' && data.feesJson && data.feesJson.feesDoctorId) {
            this.obj.feesDoctor = {name: data.feesJson.feesDoctorName, id: data.feesJson.feesDoctorId}
            return
          }
          if (k === 'orderChargeTime') {
            this.obj.chargeTime = data.orderChargeTime
            return
          }
          if (data[k]) {
            this.obj[k] = data[k]
          }
        })
      }
    },
    clear () {
      if (!this.isAdd) {
        this.$emit('clear')
      } else {
        this.initOrder()
      }
    },
    async getSubmitStatus () {
      let isValid = true
      this.$refs.orderForm.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      // if (isValid && !this.checkPriceInfo && !this.checkStockInfo && !this.isShort) {
      if (isValid && !this.checkPriceInfo && !this.checkStockInfo) {
        this.obj.isShort = this.isShort
        return JSON.parse(JSON.stringify(this.obj))
      } else {
        this.formShowMessage = true
        return false
      }
    },
    async beforeSubmit () {
      let res = await this.getSubmitStatus()
      if (res) {
        let isCharge = await this.isCharge()
        if (!isCharge) {
          this.isNotCharge = !isCharge
          return false
        }
        this.isNotCharge = false
        // if (this.isShort) {
        //   this.stockPermission = await this.getStockPermission()
        //   this.noStockSubmit = true
        // } else {
        this.submit()
        // }
      }
    },
    // 获取缺库存是否能提交医嘱配置-用warehouse的配置，前端暂时不用做库存不足校验
    async getStockPermission () {
      let res = await orderApi.searchCheckConfig({
        code: 'OUT_OF_STOCK_PERMIT_SEND',
        defaultValue: '1'
      })
      if (res && +res.value) {
        return true
      }
      return false
    },
    // 库存不足确认提交
    conSubmitStock () {
      this.noStockSubmit = false
      this.submit()
    },
    submit () {
      let type = 'create'
      this.subLoading = true
      let data = JSON.parse(JSON.stringify(this.obj))
      let self = this
      data = this.getSubmitData()
      this.$emit('submit', data, type, () => {
        this.formShowMessage = false
        self.subLoading = false
        self.initOrder()
      }, () => {
        self.subLoading = false
      })
    },
    getSubmitData () {
      let obj = this.obj
      let service = obj.serviceItem
      let data = {
        executeProviderId: obj.executeProvider.id, // 执行科室id
        executeProviderName: obj.executeProvider.name, // 执行科室name
        providerId: obj.provider.id, // 开单科室id
        providerName: obj.provider.name, // 开单科室名称
        serviceType: service.serviceClassification, // 收费项id
        serviceName: service.byname || service.name, // 费用名称
        serviceId: service.id, // 费用项id
        price: (service.price || 0) * obj.count, // 金额
        count: obj.count, // 数量
        countUnitId: service.unit, // 数量单位id
        countUnitName: service.unitName,
        spec: service.spec, // 规格
        finType: service.finType, // 业务分类
        chargeTime: this.$moment(obj.chargeTime).valueOf(), // 计费时间
        feesJson: {
          chargeLevel: service.chargeLevel,
          finType: service.finType,
          feesDoctorId: obj.feesDoctor.id, // 开单医生id
          feesDoctorName: obj.feesDoctor.name, // 开单医生名称
          outwardDeliveryFlag: service.outwardDeliveryFlag // 外送
        }
      }
      if (+this.feeToStock === 1 && obj.storageRoom && ['299', '300', '301', '302', '303', '304', '10008'].includes(service.serviceClassification)) {
        data.feesJson.materialType = obj.storageRoom.materialType
        data.feesJson.sendOrgId = obj.storageRoom.sendOrgId
        data.feesJson.storageRoomId = obj.storageRoom.id
        data.feesJson.storageRoomName = obj.storageRoom.name
        data.feesJson.localMaterialId = service.localMaterialId
        data.feesJson.globalMaterialId = service.globalMaterialId
        data.feesJson.dosageForm = obj.storageRoom.dosageForm // 剂型
        data.feesJson.dosageFormText = obj.storageRoom.dosageFormText // 剂型文本
      }
      return data
    },
    // 获取执行科室
    async getExecuteProvider (service) {
      let res = await api.getExecuteProviderList({
        serviceId: service.id,
        scene: this.scene,
        adviceType: +service.isSet === 1 ? 2 : 1,
        providerTypes: this.providerTypes,
        relationType: 2
      })
      if (res && res.length) {
        if (service.hasExecuteProvider) {
          this.obj.executeProvider = {id: res[0].providerId, name: res[0].providerName}
        } else {
          let executeProvider = objFind(res, {providerId: this.baseInfo.providerId})
          if (executeProvider) {
            this.obj.executeProvider = {id: executeProvider.providerId, name: executeProvider.providerName}
          }
        }
        return res
      }
      return []
    },
    // 获取开单医生列表
    async getFeesDoctor () {
      let currentUser = this.$store.state.currentUser
      let params = {
        orgIdList: [currentUser.organizationId.toString()],
        typeCodeList: ['DOCTOR']
      }
      let res = await doctorApi.getStaffListDoctor(params)
      if (res) {
        this.feesDoctorList = res.map(item => {
          return {
            id: item.id,
            code: item.id,
            name: item.name
          }
        })
        if (!objFind(this.feesDoctorList, this.obj.feesDoctor)) {
          this.obj.feesDoctor = ''
        }
        objFind(this.schema, {name: 'feesDoctor'}).props.options = this.feesDoctorList
      }
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
            min: 0,
            max: 999,
            limitInteger: false
          }
        }
      }, {
        name: 'provider',
        label: '开单科室',
        comp: 'sys-select',
        span: 4,
        props: {
          options: this.providerList || [],
          field: {
            useObject: true
          }
        }
      }, {
        name: 'feesDoctor',
        label: '开单医生',
        comp: 'sys-select',
        span: 4,
        props: {
          options: this.feesDoctorList || [],
          field: {
            useObject: true
          }
        }
      }, {
        name: 'executeProvider',
        label: '执行科室',
        comp: 'sys-select',
        span: 4,
        props: {
          options: this.providerList || [],
          field: {
            useObject: true
          }
        }
      }, {
        name: 'chargeTime',
        label: '计费时间',
        comp: 'custom',
        span: 6
      }, {
        name: 'price',
        label: '金额',
        comp: 'custom',
        span: 2
      }, {
        name: 'handlerBtn',
        label: '　',
        comp: 'custom',
        span: 2
      }]
    },
    // 获取联动库存的配置
    async getFeeToStock () {
      let res = await api.getIsOutStock()
      if (res) {
        this.feeToStock = res || '2'
        return
      }
      this.feeToStock = '2'
    },
    // 获取service获取物资信息
    async getMaterial (service) {
      let params = {
        materialSkuIds: [service.globalMaterialId],
        scene: this.scene,
        checkScene: 1,
        // providerId: this.baseInfo.providerId,
        supplyId: this.baseInfo.areaId || this.baseInfo.providerId
      }
      let res = await orderApi.queryMultiServiceStock(params).then(res => {
        if (res.length && res[0].storageRoomId) {
          res = res.filter(item => !!item.storageRoomId)
          return res.map(item => {
            let localMaterialObject = item.localMaterialObject
            return {
              id: item.storageRoomId, // 库房id
              name: item.storageRoomName,
              // name: item.clinicName ? `${item.clinicName}-${item.storageRoomName}` : `${item.storageRoomName}`,
              usableNum: item.num, // 库存量
              sendOrgId: item.clinicId, // 机构id
              mailFlag: item.relationType || 0, // 邮寄标记
              materialType: localMaterialObject ? localMaterialObject.classifyId : null,
              dosageForm: localMaterialObject ? localMaterialObject.dosageForm : null, // 剂型
              dosageFormText: localMaterialObject ? localMaterialObject.dosageFormText : null // 剂型文本
            }
          })
        }
        return []
      }).catch(() => {
        return []
      })
      return res
    },
    // chang监听收费项的变化
    async serviceChange (val) {
      if (val && +this.feeToStock === 1 && ['299', '300', '301', '302', '303', '304', '10008'].includes(val.serviceClassification)) {
        let stock = await this.getMaterial(val)
        let storageRoomSchema = objFind(this.schema, {name: 'storageRoom'})
        if (storageRoomSchema) {
          storageRoomSchema.props.options = stock
        } else {
          this.schema.splice(5, 0, {
            name: 'storageRoom',
            label: '库房',
            comp: 'sys-select',
            span: 4,
            props: {
              options: stock || [],
              field: {
                useObject: true
              }
            }
          })
        }
        let room = objFind(stock, this.storageRoom)
        this.$set(this.obj, 'storageRoom', room || stock[0])
        this.$set(this.schema)
        this.isShowStockInfo = true
        if (!stock || !stock.length) {
          this.checkStockInfo = true
        }
      }
      // 计费时间重新赋值
      this.obj.chargeTime = this.$moment().valueOf()
      this.obj.serviceItem = val
    },
    // 获取库存显示的信息
    getStockInfo () {
      let storageRoomSchema = objFind(this.schema, {name: 'storageRoom'})
      if (!storageRoomSchema) {
        return ''
      }
      let stock = storageRoomSchema.props.options
      if (!stock || !stock.length) {
        return '未获取到库房信息，请联系管理员维护'
      } else {
        let storageRoom = this.obj.storageRoom
        if (storageRoom) {
          this.checkStockInfo = false
          let usableNum = storageRoom.usableNum || 0 // 库存量
          let count = this.obj.count // 数量
          if ((usableNum - (count || 0)) >= 0 && usableNum) {
            this.isShort = false
            return `库存${usableNum}`
          } else {
            this.isShort = true
            return '库存不足'
          }
        }
        return ''
      }
    },
    // 获取补费配置
    async getFeeConfig (workspace) {
      let res = await api.getChargeConfig({sceneCode: workspace})
      if (res) {
        return res[workspace] || ''
      } else {
        return ''
      }
    },
    // 欠费补费
    async isCharge () {
      if (this.scene !== 3) {
        return true
      }
      let params = {
        sceneCode: this.workspace,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        price: this.obj.count * this.obj.serviceItem.price
      }
      let res = await api.isCharge(params)
      if (!res) {
        return false
      }
      let chargeType = res.arrearageRule.split(',') // 欠费可补费类型
      let status = res.arrearageStatus // 是否欠费
      if (+status === 0) {
        return true
      }
      if (chargeType.includes(this.obj.serviceItem.serviceClassification)) {
        return true
      }
      return false
    },
    checkCharge (chargType) {
      if (!chargType.includes(this.obj.serviceItem.serviceClassification)) {
        this.isNotCharge = true
      }
    },
    // 计费时间变化
    chargeTimeChange (val) {
      if (this.baseInfo.chargeTime && this.baseInfo.chargeTime > new Date(val).getTime()) {
        this.obj.chargeTime = this.baseInfo.chargeTime
        return
      }
      this.obj.chargeTime = val
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        if (val) {
          this.getFeesDoctor()
        }
      },
      immediate: true
    },
    'obj.count': {
      handler (val) {
        console.log(val)
        this.$emit('countchange')
      },
      deep: true,
      immediate: true
    },
    'providerList': {
      handler (val) {
        if (!val) {
          return []
        }
        objFind(this.schema, {name: 'provider'}).props.options = val
        objFind(this.schema, {name: 'executeProvider'}).props.options = val
      },
      deep: true
    },
    'obj.serviceItem' (val) {
      if (!val) {
        this.checkPriceInfo = false
        return
      }
      // if (val.hasExecuteProvider) {
      this.getExecuteProvider(val).then(res => {
        objFind(this.schema, {name: 'executeProvider'}).props.options = res.map(item => {
          return {
            id: item.providerId,
            code: item.providerId,
            name: item.providerName
          }
        })
      })
      // } else {
      //   objFind(this.schema, {name: 'executeProvider'}).props.options = this.providerList
      // }
      if (this.baseInfo.providerId && !this.obj.provider) {
        this.obj.provider = {
          id: this.baseInfo.providerId,
          name: this.baseInfo.providerName
        }
      }
      if (val.price === null) {
        this.checkPriceInfo = true
      }
      if (['800', '801'].includes(val.serviceClassification) && this.subOrderSource === 32) {
        if (this.schema[4].name !== 'isEmergency') {
          let obj = {
            name: 'isEmergency',
            label: '加急',
            comp: 'sys-select',
            span: 2,
            props: {
              type: 'singleCheckbox',
              labelNumber: true
            }
          }
          this.schema.splice(4, 0, obj)
        }
      } else {
        if (this.schema[4].name === 'isEmergency') {
          this.schema.splice(4, 1)
        }
      }
      this.$ever.getFieldFromSchema(this.schema, 'count').props.append = val.unitName
      // 重新获取业务分类
      sysvalue.listOnce('THC_RCM_FIN_TYPE', false, false, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-order-wrap {
  // margin-top: 20px;
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
  /deep/ .el-form-item-error {
    padding-top: 2px;
    right: 0;
    line-height: 16px;
    background: rgba(0, 0, 0, 0);
    color: #f56c6c;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
  }
  /deep/ .el-form-item-info {
    padding-top: 2px;
    right: 0;
    line-height: 16px;
    background: rgba(0, 0, 0, 0);
    color: #9e8c8c;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
  }
  .fee-orders-loading {
    height: 50px;
    background-color: #fff;
    /deep/ .el-loading-spinner {
      margin-top: -36px;
    }
  }
  .e_til {
    font-size: 14px;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .add-order-handle {
    max-width: 70%;
    min-width: 800px;
    height: 94px;
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
.waring-wrap {
  border: 1px solid #ee4433;
  border-radius: 4px;
  background: rgba(238, 68, 51, 0.12);
  box-shadow: none;
  color: #ee4433;
  margin-bottom: 20px;
  line-height: 22px;
  position: relative;
  .title {
    position: absolute;
    width: 100px;
    font-weight: bold;
    left: 20px;
    top: 18px;
  }
  ul {
    padding-left: 100px;
  }
  ul li {
    line-height: 33px;
  }
}
</style>
