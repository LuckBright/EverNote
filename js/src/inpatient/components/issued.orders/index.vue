<template>
  <div class="issued_orders_wrap">
    <div
      class="issued-orders-loading"
      v-show="loading"
      v-loading="loading"
      element-loading-text="加载医嘱信息中">
    </div>
    <div class="top_wrap" v-show="!loading">
      <el-row v-if="title" class="header" :class="{line: service}">
        <el-col :span="24">
          <strong>{{title}}</strong>
        </el-col>
      </el-row>
      <el-row v-if="!service" class="service-box">
        <el-col :span="24">
          <!-- 手写医嘱 -->
          <i
            v-if="leftIcon"
            class="iconfont icon-shouxie handleIcon"
            @click="handleAdvice"
          ></i>
          <service-select
            ref="serviceselect"
            v-model="service"
            value-key="id"
            :type="filterAdviceType"
            :search-type="searchType"
            placement="top-start"
            :placeholder="$t(filterPlaceholder || '请输入药品、检查、检验、治疗、手术等')"
            :scene="scene"
            :providerId="baseInfo.providerId"
            size="medium"
            :is-add-tpl="isAddTpl"
            :left-icon="leftIcon"
            :disabled="disabled"
          ></service-select>
        </el-col>
      </el-row>
      <div class="add-body">
        <div class="order-content">
          <draggable
            :list="orderData"
            :disabled="true || orderData.length < 2"
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
                  v-model="orderData[index]"
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
                      <span class="iconfont icon-exit clear-btn-front" @click="() => {delSubService(index)}"></span>
                      <el-input :value="item.serviceItem.byname || item.serviceItem.name" :disabled="true"></el-input>
                    </div>
                    <div class="service-item" v-else>
                      <span class="iconfont icon-exit clear-btn-front no-bg-color" @click="() => {delSubService(index)}"></span>
                      <service-select
                        :disabled="true && typeof item.serviceItem === 'object'"
                        class="service_select"
                        ref="serviceitemselect"
                        v-model="item.serviceItem"
                        value-key="id"
                        placeholder
                        :type="getType(service.serviceClassification)"
                        :three-type="service.threeServiceClassify"
                        :scene="scene"
                        :providerId="baseInfo.providerId"
                        @change="initAddOrder($event, index)"
                        size="medium"
                        :is-add-tpl="isAddTpl"
                      ></service-select>
                    </div>
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
                      <label v-if="item.checkBaseInfo" class="el-form-item__error">{{isAddTpl ? '' : $t('信息不完整，请联系管理员维护')}}</label>
                      <label v-else-if="item.checkPriceInfo" class="el-form-item__error">{{isAddTpl ? '' : $t('未获取到价钱，请联系管理员维护')}}</label>
                      <!-- <label v-else-if="item.checkStockInfo && !isSend" class="el-form-item__error">{{isAddTpl ? '' : $t('未获取到库房信息，请联系管理员维护')}}</label> -->
                      <label v-else-if="item.checkStockInfo && !isSend" class="el-form-item__error">{{isAddTpl ? '' : $t(getSendClinicInfo(index))}}</label>
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
                          </label>
                          <label class="el-form-item__info" v-else-if="item.allotNum === -2">
                            {{$t('有库存')}}
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
                  <template slot="serviceItem" v-else>
                    <watch-change
                      :value="item"
                      :watch-obj="watchObj"
                      :index="index"
                    ></watch-change>
                    <div class="service-item">
                      <span class="iconfont icon-exit clear-btn-front" @click="() => {delSubService(index)}"></span>
                      <el-input v-model="inputQuery"></el-input>
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
                      <el-form-item :label="' '">
                        <div class="handler_box alg_l" v-if="true">
                          <!--操作-->
                          <!-- <i
                            v-if="orderData.length > 1 || !item.serviceItem"
                            class="iconfont icon-delete"
                            @click="() => {delSubService(index)}"
                            style="color: #999"
                          ></i> -->
                          <i
                            v-if="['301', '302', '303', '304'].includes(service.serviceClassification) && index === orderData.length-1 && (supportMulti || ['303', '304'].includes(service.serviceClassification))"
                            class="iconfont icon-tianjia"
                            :class="{'ever-enter-focus': ['303', '304'].includes(service.serviceClassification)}"
                            @click="addSubService(index, $event)"
                          ></i>
                        </div>
                      </el-form-item>
                    </el-col>
                  </template>
                </ever-form2>
              </div>
            </template>
          </draggable>
          </div>
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
            labelWidth="40px"
            :validateOnRuleChange="false"
            :showMessage="formShowMessage"
            :row-flex="true"
          ></ever-form2>
        </div>
      </div>
    </div>
    <div :class="{bottom_wrap: service}">
      <el-row
        class="add-footer"
        v-ctrl-enter
        v-if="orderData && orderData.length"
      >
        <el-col class="sure-btn" align="left" :span="2">
          <el-button type="primary" @click="submitEvent" class="ctrlenter" :loading="submitFinished" :disabled="loading">{{$t('添加')}}</el-button>
        </el-col>
        <el-col :span="14">
          <el-alert
            v-if="showAlert"
            :title="showAlertMsg.serviceName || '警告'"
            show-icon
            type="warning"
            @close="alertClose"
          >
            <template slot>
              <el-row>
                <el-col v-if="showAlertMsg.alert">医嘱共享：{{showAlertMsg.alert}}，此药品将影响医保报销。</el-col>
                <el-col v-if="showAlertMsg.tips">医保适应症：{{showAlertMsg.tips}}</el-col>
              </el-row>
            </template>
          </el-alert>
        </el-col>
        <el-col :span="8" align="right" class="total-price">
          <!-- && ['301', '302', '303', '304', '800', '801'].includes(service.serviceClassification)  -->
          <span class="total_price_box" v-if="service">
            {{$t('总金额')}}：
            <var class="cRed" v-if="orderData[0].freeSheetFlag">￥0.00</var>
            <var class="cRed" v-else>￥{{orderTotalPrice().toFixed(2) || '0.00'}}</var>
            <em
              v-if="orderComData.decoct"
            >({{$t('含煎药费')}}{{(decoctPrice * (orderComData.count || 0)).toFixed(2)}}{{$t('元')}})</em>
            <em
              v-if="orderData[0].decoct"
            >({{$t('含煎药费')}}{{(decoctPrice * (orderData[0].count || 0)).toFixed(2)}}{{$t('元')}})</em>
            <em
              v-if="Number(orderData[0].emergencyFlag)"
            >({{$t('含加急费')}}{{service.urgentFee ? (service.urgentFee).toFixed(2) : '0.00'}}{{$t('元')}})</em>
            <em
              v-if="orderData[0].freeSheetFlag && scene === 3"
            >({{$t('免单金额')}}{{orderTotalPrice().toFixed(2) || '0.00'}}{{$t('元')}})</em>
          </span>
        </el-col>
      </el-row>
    </div>
    <!-- <el-button type="primary" @click="changeList">改开单属性</el-button> -->
  </div>
</template>
<script>
import { objFind } from '@/util/common'
import medicalapi from '@/workspace/store/medicalapi'
import storage from '@/util/storage'
import watchChange from './watch.change.vue'
import { getSurgeryDoctor, specialClassify } from '../doctor.state'
import drugInfo from '@/inpatient/components/drug.info'
import { changeOther } from './change.schema.script.js'
import {mapState} from 'vuex'
import api from '@/inpatient/components/issued.orders/api.js'
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
/**
 * scene 1-门诊 3-住院
 * {id: '799', name: '医事服务'},
 * {id: '800', name: '检查'},
 * {id: '801', name: '检验'},
 * {id: '802', name: '治疗'},
 * {id: '832', name: '饮食'},
 * {id: '867', name: '其他'},
 * {id: '2124', name: '嘱托'},
 * {id: '2125', name: '手术'},
 * {id: '2126', name: '护理'},
 * {id: '2466', name: '床位'},
 * {id: '2467', name: '会诊'},
 * {id: '300', name: '医用耗材'},
 * {id: '503', name: '办公设备'},
 * {id: '299', name: '办公耗材'},
 * {id: '504', name: '医用设备'},
 * {id: '341', name: '骨科类'},
 * {id: '553', name: '医疗器械'},
 * {id: '301', name: '西药'},
 * {id: '302', name: '中成药'},
 * {id: '303', name: '中药饮片'},
 * {id: '304', name: '中药颗粒'},
 * {id: '10007', name: '自备药'}
 * {id: '10008', name: '商品耗材'}
 * 开单属性
 * measure:剂量   employ:用法      useFreq:频次           useDay:天数        count:数量
 * source:渠道    sendClinic:库房  executeProvider:执行科室  executeNumber:院内执行    entrust:嘱托
 * price:价格
 */
export default {
  mixins: [orderMixin], // 批量编辑和开处方公用方法
  components: {
    watchChange,
    drugInfo,
    draggable
  },
  props: {
    filterPlaceholder: String, // 查询的提示
    isAddTpl: Boolean,
    leftIcon: Boolean
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
      dragging: false,
      submitFinished: false,
      loading: false,
      inputQuery: '自定义',
      decoctPrice: 0
    }
  },
  computed: {
    ...mapState(['currentUser']),
  },
  created () {
    this.init()
  },
  methods: {
    changeList () {
      // changeList()
      changeOther(
        // {propertyObject: {valueUrl: '/sob\n/serviceprovider/getExecuteProviderList?serviceId=SERVICE_ID&scene=1'}},
        // {propertyObject: {
        //   valueUrl: '/sob/serviceProviderR/getExecuteProviderList?serviceId=SERVICE_ID&scene=3',
        //   field: {
        //     useObject: true,
        //     hasNot: false
        //   }
        // }}
        // {propertyObject: {code: 'useFreq', field: {cacheName: 'THC_PHR_DRUG_FREQUENCY'}}},
        // {propertyObject: {code: 'useFreq', field: {cacheName: 'CV06.00.228'}}}
        // {propertyObject: {code: 'useFreq', valueSetCode: 'THC_PHR_DRUG_FREQUENCY'}},
        // {propertyObject: {code: 'useFreq', valueSetCode: 'CV06.00.228', valueUrl: '/thc-platform-core/frequency/getFrequencysForSob?isValid=1'}}
        {propertyObject: {name: '长/临'}},
        {propertyObject: {name: '长/临'}}
      )
    },
    init () {
      this.formRowFlex = true
      this.formAuto = false
      // 是否查询库存, '301', '302', '303', '304', '300', '10008'
      this.checkSendClinic = false
      // 医生处方权
      if (this.isAddTpl) {
        this.isServicePermission = true
      }
      // 药品类型
      this.specialClassify = specialClassify
      // 编辑医嘱
      this.$bus.$off('edit:orderData')
      this.$bus.$on('edit:orderData', async (data, cb) => {
        if (!data.length || this.loading) {
          return
        }
        this.editorAble = false
        this.loading = true
        let serviceIdObj = {}
        let type = data[0].serviceType
        let services = []
        data.forEach(order => {
          // 后端返回的是number类型
          if (order.source !== null && order.source !== undefined) {
            order.source = order.source.toString()
          }
          // 频次有时候是两个字段
          if (order.useFreqTime) {
            order.useFreq = [order.useFreq, order.useFreqTime]
          }
          // 用法注射的时候是两个字段
          if (order.adviceJson && order.adviceJson.dropSpeed) {
            order.employ = [order.employ, order.adviceJson.dropSpeed]
          }
          if (!order.stockObject) {
            order.stockObject = []
          }
          if (['303', '304'].includes(type)) {
            order.adviceFeesDtoList.forEach(item => {
              if (item.feesType !== 1) {
                return
              }
              item.measure = item.count
              if (!serviceIdObj[item.serviceId]) {
                serviceIdObj[item.serviceId] = []
              }
              serviceIdObj[item.serviceId].push(item)
              services.push({
                id: item.serviceId,
                isSet: item.setFlag ? 1 : 0
              })
            })
            return
          }
          if (!serviceIdObj[order.serviceId]) {
            serviceIdObj[order.serviceId] = []
          }
          serviceIdObj[order.serviceId].push(order)
          services.push({
            id: order.serviceId,
            isSet: order.setFlag ? 1 : 0
          })
        })
        let params = {
          scene: this.scene || 1,
          visitNumber: this.baseInfo.visitSn,
          services: services,
          templateScene: this.templateScene || this.scene,
          supplyId: this.baseInfo.areaId || this.baseInfo.providerId,
          providerTypes: this.executeProviderTypes
        }
        let serviceList = await api.queryOrgServiceMutil(params).then(res => {
          this.initData()
          cb && cb()
          return res
        }).catch(() => {
          this.initData()
          return []
        })
        if (!serviceList.length) {
          return
        }
        serviceList.forEach(service => {
          serviceIdObj[service.id].forEach(item => { item.serviceItem = service })
        })
        this.callbackData = data.map(item => {
          if (item.adviceJson) {
            item = Object.assign({}, item, item.adviceJson)
            delete item.adviceJson
          }
          if (item.extendFieldJson) {
            item = Object.assign({}, item, item.extendFieldJson)
            delete item.extendFieldJson
          }
          return item
        })
        this.service = data[0].serviceItem || data[0].adviceFeesDtoList[0].serviceItem
      })
      this.baseInfo = this.userInfo || this.$route.query
      this.baseInfo.providerId = this.baseInfo.providerId || this.baseInfo.dptId
      this.curProviderName = this.baseInfo.providerName
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
    },
    initData () {
      this.inputQuery = '自定义'
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
      this.callbackData = null
      this.formRowFlex = true
      this.editorAble = true
      this.submitFinished = false
      this.loading = false
      this.mainGroupId = ''
      this.$nextTick(() => {
        this.$refs.serviceselect.$refs.select.focus()
      })
    },
    // 手写医嘱
    async handleAdvice () {
      if (this.getHandleLoading || this.disabled) {
        return
      }
      this.getHandleLoading = true
      let params = {
        code: 'custom_advice',
        scene: this.scene
      }
      let res = await medicalapi.getServiceByCode(params).catch(() => {
        return false
      })
      if (!res) {
        this.getHandleLoading = false
        return
      }
      res.data.byname = this.inputQuery
      this.service = res.data
      this.getHandleLoading = false
    },
    alertClose () {
      this.showAlertMsg = {}
      this.showAlert = false
    },
    // 医嘱总价
    orderTotalPrice () {
      let money = 0
      let urgentPrice = 0 // 加急费
      let decoctPrice = 0
      if (this.orderComData.decoct) {
        decoctPrice = this.decoctPrice * (this.orderComData.count || 0) // 代煎
        // this.orderComData.decoctPrice = decoctPrice
      }
      // 协定方也包含代煎费
      if (this.orderData[0].decoct) {
        decoctPrice = this.decoctPrice * (this.orderData[0].count || 0) // 代煎
        // this.orderData[0].decoctPrice = decoctPrice
      }
      if (+this.shareProperty.emergencyFlag) {
        urgentPrice = this.service.urgentFee || 0
      }
      money = this.orderData.reduce((total, item, index) => {
        return total + item.price
      }, 0) || 0
      return money + decoctPrice + urgentPrice
    },
    getType (serviceType) {
      if (['301', '302'].includes(serviceType)) {
        return '301,302'
      }
      return serviceType
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
      if (this.$refs.serviceCommon) {
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
      if (!isCheck && !this.isAddTpl) {
        this.formShowMessage = true
        // this.$messageTips(this, 'warning', '医嘱基础数据不完整，请联系管理员维护')
        return
      }
      if (isValid) {
        // 检查唐筛申请单是否填写
        if (objFind(this.extendForm.schema, {name: 'applyForm'})) {
          let applyForm = this.orderData[0].applyForm
          if (!applyForm || !applyForm.id || applyForm.id === '-1') {
            this.$bus.$emit('OPEN_DIALOG')
            return
          }
        }
        let data
        this.submitFinished = true
        this.orderData.forEach(item => {
          // 初始化cdd校验信息 后端要用
          if (!this.isAddTpl) {
            item.cdssResult = ''
            item.outwardDeliveryFlag = item.serviceItem.outwardDeliveryFlag
          }
          item.mainGroupId = this.mainGroupId
          let useFreq = Array.isArray(item.useFreq) ? item.useFreq[0] : item.useFreq
          if (['301', '302', '3002'].includes(this.service.serviceClassification)) {
            let doctorAdviceContent = []
            let employ = Array.isArray(item.employ) ? item.employ[0] : item.employ
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
          // 初始化cddss校验信息 后端要用
          if (!this.isAddTpl) {
            orderComData.cdssResult = ''
          }
          doctorAdviceContent.push(getSysTypeByCode('CV06.00.102' || '', orderComData.employ))
          // doctorAdviceContent.push(getSysTypeByCode('CV06.00.102', orderComData.employ))
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
        let type = 'create'
        let self = this
        if (this.callbackData) {
          type = 'update'
        }
        this.$emit('submit', [data])
        this.$bus.$emit('check:orderdata', {
          data: [data],
          type,
          success () {
            self.submitFinished = false
            self.initData()
          },
          fail () {
            self.submitFinished = false
          }
        })
      } else {
        this.formShowMessage = true
      }
    },
    addSubService (index) {
      if (this.$refs.serviceIssued.length - 1 !== index) return
      this.$refs.serviceIssued[index].$refs.form.validate(valid => {
        if (valid) {
          let disabledArr = this.linkages
          let schema = deepClone(this.extendFormSchema[0], 'json')
          let data = deepClone(this.extendForm.obj, 'json')
          data.checkBaseInfo = false // 基础信息
          data.checkPriceInfo = false // 价格信息
          data.checkStockInfo = false // 库存信息
          if (['303', '304'].includes(this.service.serviceClassification)) {
            // 中药没有库房且检查库房的情况下，没有库房不让添加第二味药
            if (!this.orderData[index].sendClinic && !this.isSend && !this.isAddTpl) {
              return
            }
            data.sendClinic = this.shareProperty.sendClinic
            // 有第二味药，库房不能变
            let sendClinicSchema = objFind(this.extendCommonForm.schema, {name: 'sendClinic'})
            if (sendClinicSchema) {
              this.$set(sendClinicSchema.props, 'disabled', true)
            }
          } else {
            // 渠道
            if (!data.source) {
              data.source = '1'
            }
          }
          schema.forEach(item => {
            let name = item.name
            if (disabledArr.includes(name)) {
              item.props.disabled = true
              data[name] = this.shareProperty[name]
            }
          })
          this.$set(data, 'allotNum', NaN) // 初始化库存量，才能监听值的变化
          if (!data.executeProvider) {
            data.executeProvider = this.shareProperty.executeProvider
          }
          this.orderData.push(data)
          this.extendFormSchema.push(schema)
          this.$nextTick(() => {
            this.$refs.serviceitemselect[0].$refs.select.focus()
          })
        } else {
          this.formShowMessage = true
        }
      })
    },
    async initAddOrder (val, index) {
      if (!val) {
        return
      }
      this.formShowMessage = false
      let data = this.orderData[index]
      let schema = this.extendFormSchema[index]
      let tm = await this.getTemplateAndMaterial(val)
      Object.assign(val, {
        stockObject: tm.stockObject
      })
      await this.initValue(data, schema, val)
      this.$nextTick(() => {
        this.focusSelect(data, schema, index)
      })
      // todo
    },
    // 聚焦第一个未填写的必填项
    focusSelect (data, schema, index) {
      let noValArr = []
      data = deepClone(data, 'json')
      schema = deepClone(schema, 'json')
      // 未填写的值
      schema.forEach((item, n) => {
        let dataItem = data[item.name]
        let flag = Array.isArray(dataItem) ? dataItem.length : dataItem
        if (!flag && item.props && !item.props.disabled) {
          noValArr.push({
            name: item.name,
            index: n
          })
        }
      })
      let rules = this.extendForm.rules
      let i = 0
      while (i < noValArr.length) {
        let val = noValArr[i]
        if (val.name === 'executeProvider') {
          i++
          continue
        }
        if (rules[val.name].length) {
          let required = rules[val.name].reduce((state, rule) => {
            return state || rule.required
          }, false)
          if (required) {
            this.$refs.serviceIssued[index].$refs.form.$el.querySelectorAll('input')[val.index].focus()
            return
          }
        }
        i++
      }
    },
    // 获取servic基础信息
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
        executeProvider.props = this.executeProviderFormat(service, executeProvider.props, service.hasExecuteProvider && !this.callbackData)
      } else {
        this.shareProperty.executeProvider = {id: this.baseInfo.providerId, name: this.curProviderName}
      }
      // 执行次数开单属性
      let executeNumberSchema = objFind(extendForm.schema, {name: 'executeNumber'})
      // 扩展属性执行科室格式化
      executeProvider = objFind(this.extendCommonForm.schema, {name: 'executeProvider'})
      if (executeProvider) {
        executeProvider.props = this.executeProviderFormat(service, executeProvider.props, service.hasExecuteProvider && !this.callbackData)
      }
      // 实物类的执行科室为院外
      if ((!executeProvider || !service.hasExecuteProvider) && ['301', '302', '300', '10008', '3002'].includes(service.serviceClassification)) {
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
      /**
       * 10.住院长【1】临【0】时初值,西药是默认长时，其他没有字段默认为临时
       * 13.2125手术删除执行科室
       * 15.住院1004类型医嘱
       * 16.住院和门诊查询库存参数不一样
       * 24.applyFormId 申请单ID（糖筛、备血时查询表单引擎使用）
       */
    },
    // 编辑或者添加
    addOrEdit (data, schema, serviceClassification) {
      if (this.callbackData) {
        // 处理编辑医嘱的内容
        this.editorOrderInit(data, schema, serviceClassification)
      } else {
        this.orderData.push(data)
        this.extendFormSchema.push(schema)
        this.loading = false
        this.$nextTick(() => {
          this.focusSelect(data, schema, 0)
        })
      }
    },
    // 医嘱共享校验
    async batchCheckShareInfo (service) {
      if (this.isAddTpl || !this.appoint || this.appoint.subsequentVisit === 3 || !this.shareInfo || !this.shareInfo.isBasicMedicalInsurance) {
        return
      }
      this.adviceShareInfo = []
      // 是否启用医嘱共享校验
      let postdata = {
        icno: this.shareInfo.icno,
        isEmergencyTradecuretype: this.shareInfo.isEmergencyTradecuretype,
        isBasicMedicalInsurance: this.shareInfo.isBasicMedicalInsurance,
        fundtype: this.shareInfo.fundtype,
        data: [],
        returnType: 0
      }
      // 单个校验 有自付 无自付医保校验
      if (service.chargeLevel === '1' || service.chargeLevel === '2') {
        postdata.data.push({
          id: service.id,
          name: service.name
        })
      }
      if (!postdata.data.length) {
        return
      }
      const res = await medicalapi.batchCheckShareInfo(postdata)
      if (res && res.data && res.data.length) {
        this.adviceShareInfo = res.data
        // 单个校验
        this.showAlertMsg.serviceName = service.name
        this.showAlertMsg.alert = `${res.data[0].validateMsg}`
        this.showAlertMsg.tips = service.medicalInsuranceObject ? service.medicalInsuranceObject.remark : ''
        this.showAlert = true
      } else {
        // 单个校验
        this.showAlertMsg.serviceName = service.name
        this.showAlertMsg.alert = ''
        this.showAlertMsg.tips = service.medicalInsuranceObject ? service.medicalInsuranceObject.remark : ''
        if (this.showAlertMsg.tips) {
          this.showAlert = true
        } else {
          this.showAlertMsg = {}
          this.showAlert = false
        }
      }
    },
    // 编辑医嘱内容的回显
    async editorOrderInit (data, schema, type) {
      // let dataKey = Object.keys(data)
      let dataKey = Object.keys(this.extendForm.obj)
      let callbackData = this.callbackData
      dataKey.push('shopSetItemId', 'serviceItem')
      !dataKey.includes('executeProvider') && dataKey.push('executeProvider')
      // 自定医嘱service的serviceName回显
      if (this.service.code === 'custom_advice') {
        this.inputQuery = callbackData[0].serviceName
      }
      // dataKey.push('id')
      // 西药类型的编辑回显
      if (['301', '302', '300', '10008', '3002'].includes(type)) {
        callbackData.forEach(async (item, index) => {
          if (index === 0) {
            dataKey.forEach(k => {
              if (k === 'startTime' || k === 'stopTime') {
                data[k] = item[k] ? this.$moment(item[k]).format('YYYY-MM-DD HH:mm') : ''
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
              if (k === 'executeProvider') {
                data.executeProvider = {name: item.executeProviderName, id: item.executeProviderId}
                return
              }
              if (k === 'sendClinic' || k === 'sendClinicList') {
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
              data.mailFlag = data.sendClinic && data.sendClinic.mailFlag || 0 // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
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
                this.$nextTick(() => {
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
        // comKey.push('id')
        comKey.forEach(k => {
          if (k === 'executeProvider') {
            this.orderComData.executeProvider = {name: callbackData[0].executeProviderName, id: callbackData[0].executeProviderId}
            return
          }
          if (k === 'startTime' || k === 'stopTime') {
            this.orderComData[k] = callbackData[0][k] ? this.$moment(callbackData[0][k]).format('YYYY-MM-DD HH:mm') : ''
            return
          }
          if (k === 'sendClinic') {
            // 对库房进行编辑处理
            if (this.checkSendClinic && data.source !== '2') {
              let sendClinic = {id: callbackData[0].storageRoomId}
              let hasSendClinic = objFind(this.shareProperty.sendClinicList, sendClinic)
              if (hasSendClinic) {
                this.orderComData.sendClinic = hasSendClinic
              } else if (!this.isSend) {
                this.orderComData.sendClinic = this.shareProperty.sendClinicList[0] || ''
              }
              this.orderComData.mailFlag = data.sendClinic && data.sendClinic.mailFlag || 0 // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
            }
            if (callbackData[0].adviceFeesDtoList.length > 1) {
              // 有第二味药，库房不能变
              let sendClinicSchema = objFind(this.extendCommonForm.schema, {name: 'sendClinic'})
              if (sendClinicSchema) {
                this.$set(sendClinicSchema.props, 'disabled', true)
              }
            }
            return
          }
          this.orderComData[k] = callbackData[0][k] || this.orderComData[k]
        })
        callbackData[0].adviceFeesDtoList.forEach(async (item, index) => {
          if (item.feesType !== 1) {
            return
          }
          if (+this.orderComData.source === 2) {
            data.sendClinic = ''
          }
          if (index === 0) {
            dataKey.forEach(k => {
              if (k === 'sendClinic' || k === 'sendClinicList') {
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
              if (k === 'sendClinic') {
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
        if (k === 'executeProvider') {
          data.executeProvider = {name: callbackData[0].executeProviderName, id: callbackData[0].executeProviderId}
          return
        }
        // 后端返回的是到秒级，组件需要是分钟
        if (k === 'surgeryTime') {
          data[k] = callbackData[0][k] && this.$moment(callbackData[0][k]).format('YYYY-MM-DD HH:mm')
          return
        }
        if (k === 'applyDate') {
          data[k] = this.$moment(callbackData[0][k]).format('YYYY-MM-DD HH:mm')
          return
        }
        // 申请单
        if (k === 'applyForm') {
          data[k] = {id: callbackData[0].applyFormId}
          return
        }
        if (k === 'startTime' || k === 'stopTime') {
          data[k] = callbackData[0][k] ? this.$moment(callbackData[0][k]).format('YYYY-MM-DD HH:mm') : ''
          return
        }
        if (k === 'termType' || k === 'executeOrgId') {
          data[k] = [null, '', undefined].includes(callbackData[0][k]) ? '' : callbackData[0][k].toString()
          return
        }
        // 医事服务 免单原因特殊处理
        if (k === 'freeSheetFlag') {
          data[k] = callbackData[0][k] || data[k]
          if (data[k]) {
            let freeReasonSchema = objFind(schema, {name: 'freeReason'})
            if (freeReasonSchema) {
              delete freeReasonSchema.props.field.disabled
              freeReasonSchema.props.disabled = false
            }
          }
          return
        }
        data[k] = callbackData[0][k] === null ? data[k] : callbackData[0][k]
      })
      // 手术的主刀医生的特殊处理
      if (type === '2125') {
        data.doctorItem = { // 主刀医生
          id: callbackData[0].chiefKnifeId,
          name: callbackData[0].chiefKnifeName
        }
        data.anesthesiologist = { // 麻醉医生
          id: callbackData[0].anesthesiologistId,
          name: callbackData[0].anesthesiologistName
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
      this.editorAble = true
      this.loading = false
    }
  },
  directives: {
    // 回车触发添加按钮指令
    ctrlEnter: {
      inserted (el, binding, vnode) {
        document.onkeydown = function (event) {
          if (event.keyCode !== 13 || vnode.context.submitFinished) {
            return
          }
          let e = event || window.event
          let dom = el.querySelectorAll('.ctrlenter')
          if (dom[0] && e) {
            const classArr = ['el-cascader-menu__item']
            const tagArr = ['BODY', 'HTML']
            let issuedOrdersBox = document.querySelector('.issued_orders_box')
            let activeElement = document.activeElement
            if (activeElement && tagArr.includes(activeElement.tagName) && issuedOrdersBox) {
              if (!classArr.includes(activeElement.className) && !issuedOrdersBox.contains(activeElement)) {
                vnode.context.submitEvent()
              }
            }
          }
        }
      }
    }
  },
  watch: {
    'doctorLimit': {
      handler (val) {
        if (this.isAddTpl) {
          this.isServicePermission = true
          return
        }
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
    },
    inputQuery (val) {
      if (val && this.orderData[0]) {
        this.orderData[0].serviceName = val
        this.orderData[0].name = val
        this.orderData[0].serviceItem.name = val
        this.orderData[0].serviceItem.byname = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.issued_orders_wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  .issued-orders-loading {
    height: 100px;
    background-color: #fff;
  }
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
  // overflow: hidden;
  // padding-bottom: 10px;
  .order-content {
    max-height: 300px;
    overflow-y: auto;
  }
  .issued_com_box {
    // background: #ebedef;
    // padding: 10px 10px 0;
    height: 46px;
    .el-form {
      /deep/ .el-form-item {
        margin-bottom: 15px;
        min-width: 40px;
      }
    }
  }
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
      background-color: #e0e0e0;
      padding: 0 5px;
      height: calc(100% - 3px);
      margin-top: 1px;
    }
    .no-bg-color {
      background-color: transparent;
    }
  }
  .el-form-item__info {
    display: block;
    color: #666;
    background: #ebedef;
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
      padding-left: 5px;
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
      /deep/ .el-form-item__label {
        display: none;
      }
      /deep/ .el-form-item__error {
        padding-top: 2px;
        right: 0;
        line-height: 16px;
        background: #e1e7ea;
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
      /deep/ .el-input.is-disabled {
        .el-input__inner {
          border-color: #bbb !important;
          background: #e0e0e0;
        }
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
    &:first-child {
      align-items: center;
      .el-form.advice_form {
        /deep/ .el-form-item__label {
          display: block;
        }
      }
      // .handler_box {
      //   padding-top: 18px;
      // }
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
}
.bottom_wrap {
  margin-top: 15px;
}
.add-footer {
  border-top: 1px solid #D9DDDE;
  padding: 10px 0 0 10px;
  .total-price {
    float: right;
  }
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
