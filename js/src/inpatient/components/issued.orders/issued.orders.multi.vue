<template>
  <div class="issued_orders_wrap">
    <div class="add-body">
      <draggable
          :list="orderData"
          :disabled="true"
          class="list-group"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template v-for="(item,index) in orderData">
            <div
              class="issued_orders_box"
              v-ever-bind-enter
              v-if="service && extendFormSchema[index]"
              :key="item.id"
            >
              <ever-form2
                class="advice_form custom-form"
                :class="{'auto_form': formAuto}"
                ref="serviceIssued"
                :value="item"
                :schema="extendFormSchema[index]"
                :rules="extendForm.rules"
                label-position="top"
                label-width="80px"
                :nosubmit="false"
                :gutter="10"
                :row-flex="formRowFlex"
                :inline="false"
                :key="index"
                :validateOnRuleChange="false"
                :showMessage="formShowMessage"
                size="small"
              >
                <template slot="serviceItem" v-if="service.code !== 'custom_advice'">
                  <watch-change
                    :value="item"
                    :watch-obj="watchObj"
                    :pos="index"
                  ></watch-change>
                  <div class="service-item" v-if="item.serviceItem">
                    <span
                      class="icon-btn-front" 
                      :class="{'first-order': index===0, 'last-order': index === orderData.length - 1}"
                      v-if="orderData.length > 1 && ['301', '302'].includes(service.serviceClassification)">
                    </span>
                    <span class="iconfont icon-exit clear-btn-front" @click="() => {delSubService(index)}"></span>
                    <el-input :value="item.serviceItem.byname || item.serviceItem.name" :disabled="true"></el-input>
                  </div>
                  <service-select
                    v-else
                    :disabled="true && typeof item.serviceItem === 'object'"
                    class="service_select"
                    ref="serviceitemselect"
                    v-model="item.serviceItem"
                    value-key="id"
                    placeholder
                    :type="service.serviceClassification"
                    :three-type="service.threeServiceClassify"
                    :scene="scene"
                    :providerId="baseInfo.providerId"
                    @change="initAddOrder($event, index)"
                    @clear="() => {clearServiceItem(service.serviceClassification, index)}"
                    size="medium"
                    :is-add-tpl="false"
                  ></service-select>
                  <!-- 无处方权 -->
                  <div v-if="!isServicePermission && isLimitValid" class="el-form-item__error">您无处方权，无法开立医嘱！</div>
                  <!-- 有处方权无药品处方权 -->
                  <div v-else-if="item.noPermission && item.noPermission.length && isLimitValid" class="el-form-item__error">
                    <el-tooltip
                      effect="dark"
                      :disabled="item.noPermission.length === 0"
                      :content="'该药品为' + item.noPermission.map(v => (specialClassify[v]?specialClassify[v].name:'未知' )).join('、') + '；您无相应处方权，无法开立医嘱！'"
                      placement="bottom"
                    >
                      <span class="no-permission">您没有对应处方权，无法开立</span>
                    </el-tooltip>
                  </div>
                  <!-- 药品基础信息，价格信息，库房信息 -->
                  <template v-else-if="+item.source !== 2 && +orderComData.source !== 2 || isCheckStock">
                    <label v-if="item.checkBaseInfo" class="el-form-item__error">{{$t('信息不完整，请联系管理员维护')}}</label>
                    <label v-else-if="item.checkPriceInfo" class="el-form-item__error">{{$t('未获取到价钱，请联系管理员维护')}}</label>
                    <label v-else-if="item.checkStockInfo && !isSend" class="el-form-item__error">{{$t($t(getSendClinicInfo(index)))}}</label>
                    <!-- 医用耗材、商品、中西药展示库存 -->
                    <template v-else-if="!isNaN(+item.allotNum) && item.serviceItem && checkSendClinic && !isSend">
                      <!-- 西药 -->
                      <template v-if="['301', '302'].includes(service.serviceClassification)">
                        <label class="el-form-item__error" v-if="item.allotNum === -1">
                          {{$t('无库存')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__info" v-else-if="item.allotNum === -2">
                          {{$t('有库存')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__error" v-else-if="item.allotNum === 0 || item.allotNum - item.count < 0">
                          {{$t('库存不足')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__info" v-else>
                          {{$t('库存') + item.allotNum + (item.countUnit || '')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                      </template>
                      <!-- 中药 -->
                      <template v-if="['303', '304'].includes(service.serviceClassification)">
                        <label class="el-form-item__error" v-if="item.allotNum === -1">
                          {{$t('无库存')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__info" v-else-if="item.allotNum === -2">
                          {{$t('有库存')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__error" v-else-if="item.allotNum === 0 || item.allotNum - orderComData.count * item.measure < 0">
                          {{$t('库存不足')}}
                        </label>
                        <label class="el-form-item__info" v-else>{{$t('库存') + item.allotNum + (item.countUnit || '')}}</label>
                      </template>
                      <!-- 耗材、商品、协定方 -->
                      <template v-if="['299', '300', '10008'].includes(service.serviceClassification)">
                        <label class="el-form-item__error" v-if="item.allotNum === -1">
                          {{$t('无库存')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__info" v-else-if="item.allotNum === -2">
                          {{$t('有库存')}}
                          <drug-info :drug-obj="item" :icon="true"></drug-info>
                        </label>
                        <label class="el-form-item__error" v-else-if="item.allotNum === 0 || item.allotNum - item.count < 0">
                          {{$t('库存不足')}}
                        </label>
                        <label class="el-form-item__info" v-else>{{$t('库存') + item.allotNum + getCountUnitText(item.serviceItem)}}</label>
                      </template>
                      <template v-if="['3002'].includes(service.serviceClassification)">
                          <label class="el-form-item__error" v-if="item.allotNum === 0 || item.allotNum - item.count < 0">
                            {{$t('库存不足')}}
                          </label>
                          <label class="el-form-item__info" v-else>{{$t('有库存')}}</label>
                        </template>
                    </template>
                  </template>
                </template>
                <!-- 手写医嘱 -->
                <template slot="serviceItem" v-else>
                  <div class="service-item">
                    <span class="iconfont icon-exit clear-btn-front" @click="() => {delSubService(index)}"></span>
                    <el-input :value="inputQuery" :disabled="true"></el-input>
                  </div>
                </template>
                <!-- 自定义表单项 -->
                <template v-for="customName in customItems" :slot="customName">
                  <slot :name="customName" :order="item"></slot>
                </template>
                <template slot="price">
                  <div class="no_wrap">¥{{getPrice(item)}}</div>
                </template>
                <template slot="default">
                  <el-col :span="1">
                  </el-col>
                </template>
              </ever-form2>
            </div>
          </template>
      </draggable>
      <!-- 医嘱扩展属性 -->
      <div
        class="issued_com_box"
        v-if="orderData.length && extendCommonForm.schema && extendCommonForm.schema.length"
      >
        <ever-form2
          ref="serviceCommon"
          v-ever-bind-enter
          v-model="orderComData"
          :schema="extendCommonForm.schema"
          :rules="extendCommonForm.rules"
          :nosubmit="true"
          labelWidth="68px"
          :validateOnRuleChange="false"
          :showMessage="formShowMessage"
          :row-flex="true"
        ></ever-form2>
      </div>
    </div>
  </div>
</template>
<script>
import { objFind } from '@/util/common'
import storage from '@/util/storage'
import watchChange from './watch.change.vue'
import { getSurgeryDoctor, specialClassify } from '../doctor.state'
import drugInfo from '@/inpatient/components/drug.info'
import draggable from 'vuedraggable'
import orderMixin from './order.mixin'
import { cloneDeep } from 'lodash'

let deepClone = function (obj, type) {
  if (obj === undefined) {
    return
  }
  if (type === 'json') {
    return cloneDeep(obj)
  }
}

function getSysTypeByCode (code, val, type) {
  if (!window.sessionStorage.getItem(code) || !val) {
    return ''
  } else {
    let out = JSON.parse(window.sessionStorage.getItem(code), true).options.filter(v => {
      return String(v.code) === String(val) ||
        String(v.id) === String(val) ||
        String(v.value) === String(val)
    })[0]
    let name = out && out.name ? out.name : ''
    if (storage.getLocalStorage('LANG') === 'en') {
      name = out && out.nameEn ? out.nameEn : ''
    }
    return out ? !type ? name : out[type] : ''
  }
}

export default {
  mixins: [orderMixin], // 批量编辑和开处方公用方法
  components: {
    watchChange,
    drugInfo,
    draggable
  },
  props: {
    orders: {
      type: Array | Object,
      required: true
    },
    serviceType: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      service: null,
      orderData: [],
      extendFormSchema: [],
      extendCommonForm: {
        schema: [],
        obj: {},
        rules: {}
      },
      formShowMessage: false,
      shareProperty: {},
      watchObj: {},
      orderComData: {},
      showAlertMsg: {}, // 医保警告
      showAlert: false,
      isServicePermission: false,
      dragging: true,
      loading: false,
      inputQuery: '自定义'
    }
  },
  created () {
    this.init()
    if (this.serviceType === '301.302') {
      if (!this.orders[0].hasOwnProperty('adviceFeesDtoList')) {
        this.type = 'default'
        this.service = this.orders
        return
      }
      this.service = this.hasServiceItem(this.orders[0])
    } else if (this.serviceType === '303.304') {
      if (!this.orders.hasOwnProperty('adviceFeesDtoList')) {
        this.type = 'default'
        this.service = this.orders
        return
      }
      this.service = this.hasServiceItem(this.orders.adviceFeesDtoList[0])
    } else {
      if (!this.orders.hasOwnProperty('adviceFeesDtoList')) {
        this.type = 'default'
        this.service = this.orders
        return
      }
      this.service = this.hasServiceItem(this.orders)
    }
  },
  methods: {
    init () {
      this.formRowFlex = true
      this.formAuto = false

      // 是否查询库存, '301', '302', '303', '304', '300', '10008'
      this.checkSendClinic = false

      this.baseInfo = this.userInfo || this.$route.query
      this.baseInfo.providerId = this.baseInfo.providerId || this.baseInfo.dptId
      this.curProviderName = this.baseInfo.providerName

      // 药品类型
      this.specialClassify = specialClassify
      this.initData()
      // 是否开具相同中西药验证
      this.checkEqual = (rule, value, callback) => {
        if (!value) {
          callback()
          return false
        }
        let obj = this.orderData.filter(v => {
          return (v && v.serviceItem && v.serviceItem.id) === (value && value.id)
        })
        if (obj.length > 1) {
          callback(new Error('此药品已存在'))
          return false
        }
        callback()
      }
      this.loading = true
    },
    initData () {
      this.schemaId = ''
      this.orderData = []
      this.extendForm = {}
      this.extendFormSchema = []
      this.extendCommonForm = {
        schema: [],
        obj: {},
        rules: {}
      }
      this.watchObj = {}
      this.orderComData = ''
      this.service = ''
      this.shareProperty = ''
      this.id = ''
      // this.callbackData = null
      this.formRowFlex = true
      this.mainGroupId = ''
      this.type = ''
      this.loading = false
    },
    // 检查是否有service信息
    hasServiceItem (order) {
      if (order.serviceItem) {
        return order.serviceItem
      } else {
        // this.$messageTips(this, 'error', `没有查询到【${order.serviceName}】医嘱信息`)
        return ''
      }
    },
    // 确认提交到待提交区
    submitEvent () {
      let isValid = true
      let isCheck = true
      if (this.$refs.serviceIssued && this.$refs.serviceIssued.length) {
        this.$refs.serviceIssued.forEach(item => {
          item.$refs.form.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
      }
      if (this.$refs.serviceCommon && isValid) {
        this.$refs.serviceCommon.$refs.form.validate(valid => {
          if (!valid) {
            isValid = false
          }
        })
      }
      if (!isValid) {
        this.formShowMessage = true
        return
      }
      this.orderData.forEach(item => {
        if (+item.source !== 2 && +this.orderComData.source !== 2 && (item.checkBaseInfo || (item.checkStockInfo && !this.isSend) || item.checkPriceInfo)) {
          isCheck = false
        }
      })
      if (!isCheck) {
        this.formShowMessage = true
        // this.$messageTips(this, 'warning', '医嘱基础数据不完整，请联系管理员维护')
        return false
      }
      if (isValid) {
        // 检查唐筛申请单是否填写
        if (objFind(this.extendForm.schema, {name: 'applyForm'})) {
          let applyForm = this.orderData[0].applyForm
          if (!applyForm || !applyForm.id || applyForm.id === '-1') {
            this.$messageTips(this, 'warning', `请填写【${this.service.serviceName}】申请单`)
            return
          }
        }
        this.formShowMessage = false
        let data
        this.orderData.forEach(item => {
          // 初始化cdd校验信息 后端要用
          if (!this.isAddTpl) {
            item.cdssResult = ''
            item.outwardDeliveryFlag = item.serviceItem.outwardDeliveryFlag
          }
          item.mainGroupId = this.mainGroupId
          let useFreq = Array.isArray(item.useFreq) ? item.useFreq[0] : item.useFreq
          if (['301', '302', '3002'].includes(this.service.serviceClassification)) {
            let employ = Array.isArray(item.employ) ? item.employ[0] : item.employ
            let doctorAdviceContent = []
            doctorAdviceContent.push(getSysTypeByCode('CV06.00.102' || '', employ))
            item.measure && doctorAdviceContent.push('每次 ' + (item.measure || '') + (item.measureUnitName || ''))
            item.useDay && doctorAdviceContent.push('用 ' + item.useDay + ' 天')
            doctorAdviceContent.push(getSysTypeByCode('CV06.00.228', useFreq))
            if (this.scene === 1 || this.service.serviceClassification === '3002') { // 协定方没有领量
              doctorAdviceContent.push('共' + (item.count || 0) + (item.countUnitName || ''))
            } else if (this.scene === 3) {
              doctorAdviceContent.push('领' + (item.count || 0) + (item.countUnitName || ''))
            }
            // 医嘱名称
            if (this.service.serviceClassification === '3002') {
              if (item.decoct) {
                // doctorAdviceContent.push('代煎')
                doctorAdviceContent.push(getSysTypeByCode('THC_SYS_DECOCTION_OF_TCM', item.decoct))
              }
              item.doctorAdviceName = item.serviceItem.byname || item.serviceItem.name
            } else {
              item.doctorAdviceName = `${item.serviceItem.byname || ''}(${item.serviceItem.name || ''}) ${item.serviceItem.spec || ''}`
            }
            // 医嘱内容
            item.doctorAdviceContent = doctorAdviceContent.filter(v => v).join(' , ')
          } else {
            let doctorAdviceContent = [getSysTypeByCode('CV06.00.228', useFreq)]
            item.count && doctorAdviceContent.push(item.count + (item.countUnitName || '次'))
            item.useDay && doctorAdviceContent.push('用 ' + item.useDay + ' 天')
            item.doctorAdviceContent = doctorAdviceContent.filter(v => v).join(' , ')
            item.doctorAdviceName = (item.serviceItem.byname || '') || (item.serviceItem.name || '')
          }
        })
        if (['303', '304'].includes(this.service.serviceClassification)) {
          let orderComData = this.orderComData
          let useFreq = Array.isArray(orderComData.useFreq) ? orderComData.useFreq[0] : orderComData.useFreq
          let doctorAdviceContent = []
          orderComData.sendClinic = this.shareProperty.sendClinic
          orderComData.serviceId = ''
          orderComData.serviceName = ''
          orderComData.mainGroupId = this.mainGroupId
          orderComData.doctorAdviceName = this.orderData.map(item => {
            return (item.serviceItem.byname || '') || (item.serviceItem.name || '')
          }).join(',')
          // 初始化cdd校验信息 后端要用
          if (!this.isAddTpl) {
            orderComData.cdssResult = ''
          }
          doctorAdviceContent.push(getSysTypeByCode('CV06.00.102' || '', orderComData.employ))
          // doctorAdviceContent.push(storage.getSysTypeText('CV06.00.102', orderComData.employ))
          doctorAdviceContent.push('共' + orderComData.count + '剂')
          doctorAdviceContent.push(getSysTypeByCode('CV06.00.228', useFreq))
          if (orderComData.decoct) {
            // doctorAdviceContent.push('代煎')
            doctorAdviceContent.push(getSysTypeByCode('THC_SYS_DECOCTION_OF_TCM', orderComData.decoct))
          }
          orderComData.doctorAdviceContent = doctorAdviceContent.filter(v => v).join(' , ')
          data = deepClone([Object.assign({serviceType: this.service.serviceClassification}, orderComData, {list: this.orderData})], 'json')
        } else {
          data = deepClone(this.orderData, 'json')
        }
        if (data.length === 1) {
          data[0].mainFlag = 0
        } else {
          data.forEach((item, index) => {
            item.mainFlag = index ? 2 : 1
          })
        }
        return data
      } else {
        this.formShowMessage = true
        return false
      }
    },
    async getServiceInfo (service) {
      let extendForm = await this.getSchemaValue(service)
      if (!extendForm) {
        this.initData()
        return
      }
      // 父子医嘱的共有项
      this.shareProperty = deepClone(extendForm.obj, 'json')
      let executeProvider = objFind(extendForm.schema, {name: 'executeProvider'})
      if (executeProvider) {
        executeProvider.props = this.executeProviderFormat(service, executeProvider.props, service.hasExecuteProvider && this.type === 'default')
      }
      // 执行次数开单属性
      let executeNumberSchema = objFind(extendForm.schema, {name: 'executeNumber'})
      // 扩展属性执行科室格式化
      executeProvider = objFind(this.extendCommonForm.schema, {name: 'executeProvider'})
      if (executeProvider) {
        executeProvider.props = this.executeProviderFormat(service, executeProvider.props, service.hasExecuteProvider)
      }
      // 实物类的执行科室为院外
      if (!service.hasExecuteProvider && ['301', '302', '300', '10008', '3002'].includes(service.serviceClassification)) {
        this.shareProperty.executeProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
        if (executeNumberSchema) {
          executeNumberSchema.props.disabled = true
        }
      } else if (['303', '304'].includes(service.serviceClassification)) {
        this.orderComData.executeProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
      } else if (!service.hasExecuteProvider) {
        this.shareProperty.executeProvider = {id: this.baseInfo.providerId, name: this.curProviderName}
      }
      return this.shareProperty
    },
    // 编辑或者添加
    addOrEdit (data, schema, serviceClassification) {
      if (this.orders && this.type !== 'default') {
        // 处理编辑医嘱的内容
        this.editorOrderInit(data, schema, serviceClassification)
      } else {
        this.loading = false
        this.orderData.push(data)
        this.extendFormSchema.push(schema)
      }
    },
    // 编辑医嘱内容的回显
    async editorOrderInit (data, schema, type) {
      // let dataKey = Object.keys(data)
      let dataKey = Object.keys(this.extendForm.obj)
      let callbackData = this.orders
      dataKey.push('shopSetItemId', 'serviceItem')
      !dataKey.includes('executeProvider') && dataKey.push('executeProvider')
      // 自定医嘱service的serviceName回显
      if (this.service.code === 'custom_advice') {
        this.inputQuery = callbackData.serviceName || callbackData[0].serviceName
        data.serviceName = data.name = data.serviceItem.name = data.serviceItem.byname = this.inputQuery
      }
      // 西药类型的编辑回显
      if (['301', '302', '300', '10008', '3002'].includes(type)) {
        if (!Array.isArray(callbackData)) {
          callbackData = [callbackData]
        }
        callbackData.forEach(async (item, index) => {
          if (index === 0) {
            dataKey.forEach(k => {
              if (k === 'startTime') {
                data[k] = this.$moment().format('YYYY-MM-DD HH:mm')
                return
              }
              if (k === 'stopTime') {
                data[k] = ''
                return
              }
              if (k === 'source' && item.source === '2' && !this.isCheckStock) {
                let sendClinicSchema = objFind(schema, {name: 'sendClinic'})
                data.sendClinic = ''
                if (sendClinicSchema) {
                  sendClinicSchema.props.disabled = true
                  this.extendForm.rules.sendClinic.forEach(item => {
                    item.required = false
                  })
                }
              }
              if (k === 'executeProvider' && item.executeProviderName && item.executeProviderId) {
                data.executeProvider = {name: item.executeProviderName, id: item.executeProviderId}
                return
              }
              // 有些字段不需要回显的数据，取最新service的数据
              if (['sendClinic', 'sendClinicList', 'specialClassify', 'highRisk', 'antibioticType', 'checkStockInfo', 'globalMaterialId', 'localMaterialId'].includes(k)) {
                return
              }
              if (k === 'termType' || k === 'executeOrgId') {
                data[k] = [null, '', undefined].includes(item[k]) ? '' : item[k].toString()
                return
              }
              data[k] = item[k] === null ? data[k] : item[k]
            })
            // 对库房进行编辑处理
            if (this.checkSendClinic && data.source !== '2') {
              let sendClinic = {id: callbackData[0].storageRoomId}
              let hasSendClinic = objFind(this.shareProperty.sendClinicList, sendClinic)
              if (hasSendClinic) {
                data.sendClinic = hasSendClinic
              } else if (!this.isSend) {
                data.sendClinic = this.shareProperty.sendClinicList[0] || ''
              }
              data.mailFlag = data.sendClinic.mailFlag || 0 // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
            }
            this.orderData.push(data)
            this.extendFormSchema.push(schema)
          } else {
            let disabledArr = this.linkages
            let childOrderSchema = deepClone(this.extendForm.schema, 'json')
            let childOrderData = deepClone(this.extendForm.obj, 'json')
            childOrderData.checkBaseInfo = false // 基础信息
            childOrderData.checkPriceInfo = false // 价格信息
            childOrderData.checkStockInfo = false // 库存信息
            childOrderData.sendClinic = this.shareProperty.sendClinic // 库房
            childOrderSchema.forEach(item => {
              let name = item.name
              if (disabledArr.includes(name)) {
                item.props.disabled = true
                childOrderData[name] = this.shareProperty[name]
              }
            })
            this.$set(childOrderData, 'allotNum', NaN) // 初始化库存量，才能监听值的变化
            await this.initValue(childOrderData, childOrderSchema, item.serviceItem)
            dataKey.forEach(k => {
              if (disabledArr.includes(k)) {
                return
              }
              if (k === 'count') {
                window.setTimeout(() => {
                  childOrderData[k] = item[k] === null ? childOrderData[k] : item[k]
                })
                return
              }
              childOrderData[k] = item[k] === null ? childOrderData[k] : item[k]
            })
            childOrderData.executeProvider = {name: item.executeProviderName, id: item.executeProviderId}
            this.orderData.push(childOrderData)
            this.extendFormSchema.push(childOrderSchema)
          }
        })
        this.$nextTick(() => {
          this.loading = false
        })
        return
      }
      // 中药类型的编辑回显
      if (['303', '304'].includes(type)) {
        let comKey = Object.keys(this.extendCommonForm.obj)
        if (!comKey.includes('sendClinic')) {
          comKey.push('sendClinic')
        }
        if (!comKey.includes('executeProvider')) {
          comKey.push('executeProvider')
        }
        comKey.forEach(k => {
          if (k === 'executeProvider' && callbackData.executeProviderName && callbackData.executeProviderId) {
            this.orderComData[k].executeProvider = {name: callbackData.executeProviderName, id: callbackData.executeProviderId}
            return
          }
          if (k === 'startTime') {
            this.orderComData[k] = this.$moment().format('YYYY-MM-DD HH:mm')
            return
          }
          if (k === 'stopTime') {
            this.orderComData[k] = ''
            return
          }
          if (k === 'sendClinic') {
            // 对库房进行编辑处理
            if (this.checkSendClinic && data.source !== '2') {
              let sendClinic = {id: callbackData.storageRoomId}
              let hasSendClinic = objFind(this.shareProperty.sendClinicList, sendClinic)
              if (hasSendClinic) {
                this.orderComData.sendClinic = hasSendClinic
              } else if (!this.isSend) {
                this.orderComData.sendClinic = this.shareProperty.sendClinicList[0] || ''
              }
              this.orderComData.mailFlag = data.sendClinic && data.sendClinic.mailFlag || 0 // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
            }
            if (callbackData.adviceFeesDtoList.length > 1) {
              // 有第二味药，库房不能变
              let sendClinicSchema = objFind(this.extendCommonForm.schema, {name: 'sendClinic'})
              if (sendClinicSchema) {
                this.$set(sendClinicSchema.props, 'disabled', true)
              }
            }
            return
          }
          this.orderComData[k] = callbackData[k] || this.orderComData[k]
        })
        callbackData.adviceFeesDtoList.forEach(async (item, index) => {
          item.measure = item.count
          if (+this.orderComData.source === 2) {
            data.sendClinic = ''
          }
          if (index === 0) {
            dataKey.forEach(k => {
              // 有些字段不需要回显的数据，取最新service的数据
              if (['sendClinic', 'sendClinicList', 'specialClassify', 'highRisk', 'antibioticType', 'checkStockInfo', 'globalMaterialId', 'localMaterialId'].includes(k)) {
                return
              }
              data[k] = item[k] === null ? data[k] : item[k]
            })
            this.orderData.push(data)
            this.extendFormSchema.push(schema)
          } else {
            let childOrderSchema = deepClone(this.extendForm.schema, 'json')
            let childOrderData = deepClone(this.extendForm.obj, 'json')
            childOrderData.checkBaseInfo = false // 基础信息
            childOrderData.checkPriceInfo = false // 价格信息
            childOrderData.checkStockInfo = false // 库存信息
            childOrderData.sendClinic = this.shareProperty.sendClinic // 库房
            this.$set(childOrderData, 'allotNum', NaN) // 初始化库存量，才能监听值的变化
            await this.initValue(childOrderData, childOrderSchema, item.serviceItem)
            dataKey.forEach(k => {
              if (k === 'sendClinic' || k === 'sendClinicList') {
                return
              }
              childOrderData[k] = item[k] === null ? childOrderData[k] : item[k]
            })
            this.orderData.push(childOrderData)
            this.extendFormSchema.push(childOrderSchema)
          }
        })
        this.loading = false
        return
      }
      // 其他类型
      dataKey.forEach(k => {
        // 有些字段不需要回显的数据，取最新service的数据
        if (['sendClinic', 'sendClinicList', 'specialClassify', 'highRisk', 'antibioticType', 'checkStockInfo', 'globalMaterialId', 'localMaterialId'].includes(k)) {
          return
        }
        if (k === 'executeProvider' && callbackData.executeProviderName && callbackData.executeProviderId) {
          data.executeProvider = {name: callbackData.executeProviderName, id: callbackData.executeProviderId}
          return
        }
        // 后端返回的是到秒级，组件需要是分钟
        if (k === 'surgeryTime') {
          data[k] = ''
          return
        }
        if (k === 'applyDate') {
          data[k] = ''
          return
        }
        if (k === 'startTime') {
          data[k] = callbackData[k] && this.$moment().format('YYYY-MM-DD HH:mm')
          return
        }
        if (k === 'stopTime') {
          data[k] = ''
          return
        }
        // 申请单
        if (k === 'applyForm') {
          data[k] = {id: callbackData.applyFormId}
        }
        if (k === 'termType') {
          data[k] = [null, '', undefined].includes(callbackData[k]) && '0' || callbackData[k].toString()
          return
        }
        if (k === 'executeOrgId') {
          data[k] = callbackData[k] && callbackData[k].toString() || ''
          return
        }
        // 医事服务 免单原因特殊处理
        if (k === 'freeSheetFlag') {
          data[k] = callbackData[k] || data[k]
          if (data[k]) {
            let freeReasonSchema = objFind(schema, {name: 'freeReason'})
            if (freeReasonSchema) {
              delete freeReasonSchema.props.field.disabled
              freeReasonSchema.props.disabled = false
            }
          }
        }
        data[k] = callbackData[k] === null ? data[k] : callbackData[k]
      })
      // 手术的主刀医生的特殊处理
      if (type === '2125') {
        data.doctorItem = { // 主刀医生
          id: callbackData.chiefKnifeId,
          name: callbackData.chiefKnifeName
        }
        data.anesthesiologist = { // 麻醉医生
          id: callbackData.anesthesiologistId,
          name: callbackData.anesthesiologistName
        }
        if (data.surgeryLevel) {
          let res = await getSurgeryDoctor(data.surgeryLevel)
          if (data.doctorItem && data.doctorItem.id && !objFind(res, { id: data.doctorItem.id })) {
            data.doctorItem = ''
          } else {
            let doctorItemSchema = objFind(schema, {name: 'doctorItem'})
            doctorItemSchema.props.options = res
          }
        }
      }
      this.orderData.push(data)
      this.extendFormSchema.push(schema)
      this.loading = false
    },
  },
  watch: {
    'doctorLimit': {
      handler (val) {
        if (!val) {
          return
        }
        this.isServicePermission = val.isServicePermission
        this.servicePermission = val.servicePermission
      },
      deep: true,
      immediate: true
    },
    'shareProperty': {
      handler (val) {
        if (!val) {
          return
        }
        let list = this.orderData
        if (list.length && ['301', '302'].includes(this.service.serviceClassification)) {
          list.forEach((item, index) => {
            if (index === 0) {
              return
            }
            this.linkages.forEach(k => {
              if (k === 'sendClinic') {
                item[k] = objFind(item.sendClinicList, {id: val[k].id}) || ''
                return
              }
              item[k] = val[k]
            })
          })
        }
        if (list.length && ['303', '304'].includes(this.service.serviceClassification)) {
          list.forEach((item, index) => {
            if (index === 0 && !val.sendClinic) {
              return
            }
            item.sendClinic = objFind(item.sendClinicList, {id: val.sendClinic.id}) || ''
          })
        }
      },
      deep: true
    }
  },
}
</script>
<style lang="scss" scoped>
.issued_orders_wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top_wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-height: 400px;
    .header {
      padding-bottom: 4px;
    }
  }
}
.add-body {
  flex: 1;
  // overflow: auto;
  padding-bottom: 4px;
  .no-permission {
    white-space: nowrap;
  }
  .service-item {
    position: relative;
    .clear-btn-front {
      position: absolute;
      right: 1px;
      top: 0;
      z-index: 10;
      color: #999;
      font-size: 10px;
      background-color: #eee;
      padding: 0 5px;
      height: calc(100% - 3px);
      margin-top: 1px;
    }
    .no-bg-color {
      background-color: transparent;
    }
  }
  /deep/ .el-form-item__info {
    white-space: nowrap;
    display: block;
    color: #666;
    background: #fff;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
    /deep/.iconfont {
      font-size: 12px;
    }
  }
  .issued_orders_box {
    display: flex;
    align-items: flex-start;
    padding: 0 0 10px 0;
    /deep/ .el-input__inner {
      padding: 0 5px;
    }
    /deep/ .el-date-editor {
      .el-input__inner {
        padding-left: 30px;
      }
    }
    /deep/ .el-input--suffix {
      .el-input__inner {
        padding-right: 20px;
      }
    }
    /deep/ .el-input__suffix {
      right: 0;
      .el-input__icon {
        width: 20px;
      }
    }
    /deep/ input::-webkit-outer-spin-button,
    /deep/ input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    /deep/ input[type="number"] {
      -moz-appearance: textfield;
    }
    .handler_box {
      // width: 55px;
      padding-top: 0;
      padding-left: 25px;
      white-space: nowrap;
      .icon-delete {
        display: inline-block;
        padding-right: 10%;
      }
      .icon-tianjia {
        color: #137bef;
      }
    }
    .el-form.advice_form {
      width: calc(100% - 10px);
      /deep/ .order-employ {
        width: 120px;
      }
      /deep/ .el-form-item__error {
        padding-top: 2px;
        right: 0;
        line-height: 16px;
        background: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          overflow: visible;
          width: max-content;
          z-index: 100;
          padding-right: 20px;
        }
      }
      .required {
        /deep/ .el-input__inner {
          background: #fef5be;
          // border-color: #f56c6c;
        }
      }
      /deep/.el-input-group {
        overflow: hidden;
        /deep/ .el-input__inner {
          float: left;
        }
      }
      /deep/ .el-input-group__append,
      /deep/ .el-input-group__prepend {
        padding: 0 6px;
      }
      &.auto_form {
        // width: auto;
        /deep/ .el-row--flex {
          /deep/ .el-form-item__content {
            min-width: 68px;
            /deep/ .el-input.is-disabled {
              .el-input__inner {
                border-color: #ccc !important;
                height: 36px;
              }
            }
          }
          .service_select {
            min-width: 150px;
          }
        }
      }
      &.el-form--label-top {
        /deep/.el-form-item__label {
          height: 25px;
          min-width: 32px;
        }
      }
      /deep/.el-row--flex {
        .el-col:last-child {
          /deep/.el-form-item__content {
            min-width: 0 !important;
          }
        }
      }
    }
    .icon-btn-front {
      position: absolute;
      display: block;
      height: 0;
      left: -15px;
      &:before {
        content: '';
        display: block;
        width: 2px;
        background-color: #000;
        height: 60px;
        position: absolute
      }
      &:after {
        content: '';
        display: block;
        height: 2px;
        width: 12px;
        background-color: #000;
        position: absolute;
        left: 0;
        top: 20px;
      }
    }
    .first-order:before {
      top: 20px;
    }
    .last-order:before {
      top: -38px;
    }
    .no_wrap {
      white-space: nowrap;
    }
  }
  /deep/ .el-form-item .el-input-number {
    width: 100%;
  }
  /deep/ .el-form-item .el-select--medium {
    height: 36px;
  }
  .issued_com_box {
    // background: #f4f4f4;
    // padding: 10px 10px 0;
    .el-form {
      /deep/ .el-form-item {
        margin-bottom: 15px;
        min-width: 40px;
      }
    }
  }
}
.bottom_wrap {
  margin-top: 15px;
}
.add-footer {
  border-top: 1px solid #ddd;
  padding: 10px 0 0 10px;
  .total_price_box {
    font-size: 14px;
    margin-right: 20px;
    var,
    em {
      font-style: normal;
    }
    var {
      display: inline-block;
      font-size: 20px;
      font-weight: 600;
      margin-right: 10px;
    }
  }
}
.header {
  // padding-bottom: 8px;
}
.header strong {
  cursor: pointer;
  font-size: 14px;
  width: 120px;
}
.header strong i {
  float: right;
}
.service-box {
  padding-top: 10px;
  position: relative;
  .handleIcon {
    position: absolute;
    top: 15px;
    left: 6px;
    color: #aaa;
    z-index: 1;
    font-size: 19px;
    &:after {
      content: "";
      border-right: 1px solid #aaa;
      position: absolute;
      top: 2px;
      height: 17px;
      left: 24px;
    }
  }
  /deep/ .el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
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
    li {
      line-height: 33px;
    }
  }
}
.ml20 {
  margin-left: 20px;
}
.gray {
  color: #999999;
}
.wb96 {
  width: 96%;
}
.hide {
  display: none;
}
.line {
  border-bottom: 1px solid #ddd;
}
.h180 {
  height: 194px;
}
</style>
