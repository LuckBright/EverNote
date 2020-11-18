<template>
  <div class="issued_orders_wrap">
    <div class="top_wrap">
      <el-row class="header" :class="{line: service}">
        <el-col :span="12">
          <strong>{{title}}</strong>
        </el-col>
        <el-col :span="12" align="right">
          <a
            href="javascript:void(0)"
            class="cGray ml20"
            style="font-size:12px;margin-right:10px;"
            v-if="service"
            @click="showAddEvent"
          >{{$t(showAdd ? '收起' : '展开')}}</a>
        </el-col>
      </el-row>
      <el-row v-if="!service" class="service-box">
        <el-col :span="24">
          <i
            class="iconfont icon-shouxie handleIcon"
            @click="handleAdvice"
            v-if="visitType===3&&!stageId&&!isPathway&&!isAddTpl"
          ></i>
          <service-select
            ref="serviceselect"
            v-model="service"
            value-key="id"
            :type="filterAdviceType"
            :search-type="searchType"
            placement="top-start"
            :placeholder="$t(filterPlaceholder || '请输入药品、检查、检验，治疗，手术')"
            :scene="scene"
            :providerId="baseInfo.providerId"
            size="medium"
            :is-add-tpl="isAddTpl"
            :left-icon="visitType===3&&!stageId&&!isPathway"
            :disabled="disabled"
            @query="selectChange"
          ></service-select>
        </el-col>
      </el-row>
      <div class="add-body">
        <template v-for="(item,index) in orderData">
          <div
            class="issued_orders_box"
            v-ever-bind-enter
            v-if="service && extendFormSchema[index]"
            :key="index"
          >
            <ever-form2
              class="advice_form custom-form"
              :class="{'auto_form': formAuto}"
              ref="serviceIssued"
              :value="item"
              :schema="extendFormSchema[index]"
              :rules="extendForm.rules"
              :label-position="labelPosition"
              :label-width="labelWidth"
              :nosubmit="false"
              :gutter="10"
              :row-flex="formRowFlex"
              :inline="formInline"
              :key="index"
              :validateOnRuleChange="validateOnRuleChange"
              :showMessage="formShowMessage"
              size="medium"
            >
              <template slot="serviceItem" v-if="service.code !== 'custom_advice'">
                <service-select
                  :disabled="serviceItemDisabled && typeof item.serviceItem === 'object'"
                  class="service_select"
                  ref="serviceitemselect"
                  v-model="item.serviceItem"
                  value-key="id"
                  placeholder
                  :type="service.serviceClassification"
                  :three-type="service.threeServiceClassify"
                  :scene="scene"
                  :providerId="baseInfo.providerId"
                  @change="val => {getServiceStock(val, index, batchCheckShareInfo)}"
                  @clear="() => {clearServiceItem(service.serviceClassification, index)}"
                  size="medium"
                  :is-add-tpl="isAddTpl"
                ></service-select>
                <template v-if="item.isServicePermission">
                  <div v-if="item.isServicePermission.length" class="el-form-item__error">
                    <el-tooltip
                      effect="dark"
                      :disabled="item.isServicePermission.length === 1"
                      :content="'该药品为' + item.isServicePermission.map(v => specialClassify[v.type].name).join('、') + '；您无相应处方权，无法开立医嘱！'"
                      placement="bottom"
                    >
                      <span>该药品为{{specialClassify[item.isServicePermission[0].type].name}}；您无相应处方权，无法开立医嘱！</span>
                    </el-tooltip>
                  </div>
                  <div v-else class="el-form-item__error">您无处方权，无法开立医嘱！</div>
                </template>
                <template v-else>
                  <template v-if="item.checkBaseInfo && String(item.source) !== '2'">
                    <label class="el-form-item__error">{{$t('药品信息不完整，请联系管理员维护')}}</label>
                  </template>
                  <template v-if="item.checkPriceInfo && String(item.source) !== '2'">
                    <label class="el-form-item__error">{{$t('医嘱未获取到价钱，请联系管理员维护')}}</label>
                  </template>
                  <template v-if="item.checkStockInfo && String(item.source) !== '2'">
                    <label class="el-form-item__error">{{$t('医嘱未获取到库房信息，请联系管理员维护')}}</label>
                  </template>
                  <template
                    v-if="!isAddTpl && item.isGetStock && item.serviceItem && !item.isEntrust && ['301', '302', '303', '304', '300', '10008'].includes(service.serviceClassification)&& item.source !== '2'&& !isPathway&& !item.checkBaseInfo&& !item.checkPriceInfo && !item.checkStockInfo"
                  >
                    <template v-if="['303', '304'].includes(service.serviceClassification)">
                      <label
                        class="el-form-item__error"
                        v-if="item.checkStockInfo"
                      >{{$t('医嘱未获取到库房信息，请联系管理员维护')}}</label>
                      <label
                        class="el-form-item__error"
                        v-if="!item.checkStockInfo && (item.allotNum ===0 || item.allotNum - orderComData.count * item.amount < 0)"
                      >{{$t('库存不足')}}</label>
                      <label
                        class="el-form-item__info"
                        v-else
                      >{{$t('库存')}} {{item.allotNum}} {{item.countUnit || ''}}</label>
                    </template>
                    <template v-else>
                      <label
                        class="el-form-item__error"
                        v-if="item.allotNum ===0 || item.allotNum - item.count < 0"
                      >
                        {{$t('库存不足')}}
                        <drug-info
                          v-if="['301', '302'].includes(service.serviceClassification)"
                          :drug-obj="item"
                          :icon="true"
                        ></drug-info>
                      </label>
                      <label class="el-form-item__info" v-else>
                        <template
                          v-if="['299', '300', '10008'].includes(service.serviceClassification)"
                        >{{$t('库存')}}：{{item.allotNum}}{{getCountUnitText(item.serviceItem)}}</template>
                        <template v-else>{{$t('库存')}} {{item.allotNum}} {{item.countUnit || ''}}</template>
                        <drug-info
                          v-if="['301', '302'].includes(service.serviceClassification)"
                          :drug-obj="item"
                          :icon="true"
                        ></drug-info>
                      </label>
                    </template>
                  </template>
                </template>
              </template>
              <template slot="serviceItem" v-else>
                <el-input v-model="item.serviceItem.byname" placeholder="请输入医嘱名称"></el-input>
              </template>
              <template
                slot="measure"
                v-if="visitType === 3 && ['301', '302'].includes(service.serviceClassification)"
              >
                <sys-text
                  class="required"
                  v-model="item.measure"
                  type="number"
                  :append="item.measureUnitName"
                  @input="val => {measureChange(val, index)}"
                ></sys-text>
                <template>
                  <template v-if="['301', '302'].includes(service.serviceClassification)">
                    <label
                      class="el-form-item__error"
                      v-if="!item.count || item.measure==='' || item.measure===0"
                    >{{$t('单次领量')}}：0{{item.countUnit || ''}}</label>
                    <!-- <label class="el-form-item__error" v-if="item.measure===''"></label> -->
                    <label
                      class="el-form-item__info"
                      v-if="item.measure!=='' && item.count && item.measure>0"
                    >{{$t('单次领量')}}：{{item.count}}{{item.countUnit || ''}}</label>
                  </template>
                </template>
              </template>
              <template slot="price">
                <div class="no_wrap" v-if="['303', '304'].includes(service.serviceClassification)">
                  <template v-if="orderComData.source === '2'">¥0.00</template>
                  <template
                    v-else
                  >¥ {{item.serviceItem && item.serviceItem.price && item.amount ? (item.serviceItem.price * item.amount).toFixed(2) : '0.00'}}</template>
                </div>
                <div class="no_wrap" v-else>
                  <template v-if="item.source === '2'">¥0.00</template>
                  <template
                    v-else
                  >¥ {{item.serviceItem && item.serviceItem.price && item.count ? (item.serviceItem.price * item.count).toFixed(2) : '0.00'}}</template>
                </div>
              </template>
              <template slot="default">
                <el-col :span="1">
                  <el-form-item :label="' '">
                    <div class="handler_box alg_l" v-if="showHandle">
                      <!--操作-->
                      <i
                        class="iconfont icon-delete"
                        @click="() => {delSubService(index)}"
                        style="color: #999"
                      ></i>
                      <i
                        v-if="['301', '302', '303', '304'].includes(service.serviceClassification) && index === orderData.length-1"
                        class="iconfont icon-tianjia"
                        :class="{'ever-enter-focus': ['303', '304'].includes(service.serviceClassification)}"
                        @click="() => {addSubService(index)}"
                      ></i>
                    </div>
                  </el-form-item>
                </el-col>
              </template>
            </ever-form2>
          </div>
        </template>
        <div
          class="issued_com_box mt20"
          v-if="service && extendCommonForm.schema && extendCommonForm.schema.length"
        >
          <ever-form2
            ref="serviceCommon"
            v-ever-bind-enter
            v-model="orderComData"
            :schema="extendCommonForm.schema"
            :rules="extendCommonForm.rules"
            :nosubmit="true"
            :labelWidth="visitType === 1 ? '80px' : '80px'"
            :validateOnRuleChange="validateOnRuleChange"
            :showMessage="formShowMessage"
          ></ever-form2>
        </div>
      </div>
    </div>
    <div :class="{bottom_wrap: service}">
      <el-row
        class="add-footer"
        :class="{dn: !showAdd}"
        v-ctrl-enter
        v-if="orderData && orderData.length"
      >
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
          <span v-else>&nbsp;</span>
        </el-col>
        <el-col :span="10" align="right">
          <!-- && ['301', '302', '303', '304', '800', '801'].includes(service.serviceClassification)  -->
          <span class="total_price_box" v-if="service && !isAddTpl">
            {{$t('总金额')}}：
            <var class="cRed" v-if="orderData[0].freeSheet">￥0.00</var>
            <var class="cRed" v-else>￥{{orderTotalPrice ? orderTotalPrice.toFixed(2) : '0.00'}}</var>
            <em
              v-if="orderComData.decoct"
            >({{$t('含代煎费')}}{{(orderComData.decoctPrice * orderComData.count).toFixed(2)}}{{$t('元')}})</em>
            <em
              v-if="Number(orderData[0].isEmergency)"
            >({{$t('含加急费')}}{{service.urgentFee ? (service.urgentFee).toFixed(2) : '0.00'}}{{$t('元')}})</em>
            <em
              v-if="orderData[0].freeSheet && visitType === 3"
            >({{$t('免单金额')}}{{orderTotalPrice ? orderTotalPrice.toFixed(2) : '0.00'}}{{$t('元')}})</em>
          </span>
          <el-button type="primary" @click="submitEvent" class="ctrlenter">{{$t('确认')}}</el-button>
        </el-col>
      </el-row>
      <el-dialog
        v-if="wringData[0]"
        :visible.sync="showCdss"
        :title="$t(visitType === 1 ? '处方建议' : '医嘱建议')"
        size="tiny"
        class="ui_dialog_02"
        ref="cdssConfirm"
      >
        <cdss1 :wringData="wringData"></cdss1>
        <div slot="footer" class="dialog-footer" style="position:relative;z-index: 10">
          <el-button @click="closeCdssEvent">
            <i class="icon iconfont icon-quxiao"></i>
            {{$t('修改')}}{{visitText}}
          </el-button>
          <el-button type="primary" @click="confirmCdssSubmit">
            <i class="icon iconfont icon-tijiao"></i>
            {{$t('确认提交')}}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="wringStockList[0]"
        :visible.sync="noStockSubmit"
        title="警告"
        size="small"
        class="ui_dialog_02"
      >
        <div class="waring-wrap">
          <span class="title">{{$t('库存不足')}}</span>
          <ul>
            <li v-for="(item, i) in wringStockList" :key="i">
              <template
                v-if="['301', '302', '303', '304', '299', '300', '10008'].includes(item.serviceItem.serviceClassification)"
              >
                <template>{{i + 1}}、{{item.serviceItem.byname || item.serviceItem.name}}</template>
                <template v-if="item.serviceItem.spec">{{item.serviceItem.spec}}</template>
              </template>
            </li>
          </ul>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelStock">
            <i class="icon iconfont icon-quxiao"></i>{{$t('取消')}}
          </el-button>
          <el-button type="primary" @click="conSubmitStock">
            <i class="icon iconfont icon-tijiao"></i>{{$t('继续提交')}}
          </el-button>
        </div>
      </el-dialog>
      <!-- 处方权验证不通过弹窗 -->
      <doctor-limit-dialog :limit-show.sync="limitValid" :limit-medicine="limitMedicine"></doctor-limit-dialog>
    </div>
  </div>
</template>
<script>
import serviceapi from '@/sob/store/serviceeditapi'
import medicalapi from '@/workspace/store/medicalapi'
import indepartapi from '@/inpatient/store/indepartapi'
import inhospitalapi from '@/workspace/store/inhospital'
import phrapi from '@/inpatient/store/phr'
import formphrapi from '@/form/store/phrapi'
import billingapi from '@/warehouse/page/group/store/billingapi.js'
import storage from '@/util/storage'
import cdss1 from '@/workspace/components/cdss1'
import drugInfo from '@/inpatient/components/drug.info'
import { createSchemaByItems } from '@/util/formcustom'
// import { GENERATE_UUID } from '@/bi/util/reportsetuuid'
import { objFind, objIntersection, isNull, objIsEqual, floatTool, randomString, formatLang, objKeyBy, isJsonString } from '@/util/common'
import { getDoctorLimit, getMedicineLimit, getSurgeryDoctor, diffLimit, specialClassify } from '../doctor.state'
import doctorLimitDialog from '../doctor.state/doctor.limit.dialog.vue'
export default {
  // 标题 收起展开 医嘱类型（1：门诊，2：住院）
  // searchType(number): 1：医嘱项，2：收费项
  // subVisitType: 301-住院下医嘱; 302-临床路径下医嘱场景; 303-住院手术下医嘱；304-产房下医嘱
  // isPathway：临床路径模版添加医嘱
  // stageId：临床路径应用添加医嘱
  props: ['title', 'showAdd', 'visitType', 'initData', 'callbackData', 'userInfo', 'isAddTpl', 'shareInfo', 'shareTime', 'results', 'appoint', 'filterAdviceType', 'filterPlaceholder', 'searchType', 'stageId', 'isPathway', 'subVisitType', 'disabled'],
  data () {
    let checkEqual = (rule, value, callback) => {
      // 是否开具相同中西药验证
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
    return {
      serviceapi,
      medicalapi,
      indepartapi,
      inhospitalapi,
      phrapi,
      formphrapi,
      storage,
      checkEqual,
      service: '',
      decoctPrice: 0,
      baseInfo: this.userInfo || this.$route.query,
      showCdss: false,
      cdssConfirm: false,
      loading: false,
      wringData: [],
      waitSendData: this.initData || [],
      scene: this.visitType || 1,
      visitText: this.visitType === 3 ? '医嘱' : '医嘱',
      extendForm: {
        schema: [],
        obj: {},
        rules: {}
      },
      extendFormSchema: [],
      extendCommonForm: {
        schema: [],
        obj: {},
        rules: {}
      },
      orderData: [],
      oldOrderData: [],
      orderComData: {},
      initServiceData: {},
      backData: this.callbackData || '',
      formRowFlex: true,
      labelPosition: 'top',
      labelWidth: '80px',
      formInline: false,
      formAuto: false,
      showAlert: false,
      showAlertMsg: {},
      adviceShareInfo: [],
      adviceCheckData: [],
      schemaId: '',
      diagnosisName: '',
      patientName: '',
      medicalRecordNumber: '',
      zhuSu: '',
      xianBingShi: '',
      curProviderName: '',
      validateOnRuleChange: false,
      formShowMessage: false,
      inputQuery: '',
      wringStockList: [],
      noStockSubmit: false,
      isCreateSchema: false,
      limitValid: false, // 是否具有处方权
      limitMedicine: [], // 没有处方权的药
      selfDrugStatus: true,  // 住院自备药设置开关
      specialClassify
    }
  },
  created () {
    if (this.baseInfo.id) delete this.baseInfo.id
    if (!this.baseInfo.providerId) this.baseInfo.providerId = this.baseInfo.dptId
    this.baseInfo.visitType = this.visitType // 初始化设置医嘱类型为住院，1 门诊 2住院
    this.orderData = []
    this.setChiDecoctPrice()
  },
  mounted () {
    // 从公共头部组件获取患者主诊断名称
    setTimeout(() => {
      this.$bus.$off('global:issued_order')
      this.$bus.$on('global:issued_order', val => {
        if (this.visitType === 1) {
          this.medicalRecordNumber = val.patient.patientOrg ? val.patient.patientOrg.outpatientNumber : ''
        } else {
          this.medicalRecordNumber = val.patient.patientOrg ? val.patient.patientOrg.inpatientNumber : ''
        }
        this.patientName = val.patient.name
        this.curProviderName = val.providerName
        if (val.medicalRecord && val.medicalRecord.outpatientHead && val.medicalRecord.outpatientHead.ZD_MEN_ZHEN_ZHEN_DUAN) {
          let zhenduan = JSON.parse(val.medicalRecord.outpatientHead.ZD_MEN_ZHEN_ZHEN_DUAN)
          this.diagnosisName = zhenduan[0].diseaseName
        }
      })
    }, 100)
  },
  computed: {
    // 医嘱总价格计算
    orderTotalPrice () {
      let money = 0
      let decoctPrice = 0
      let urgentPrice = 0
      if (this.orderComData.decoct) {
        this.orderComData.decoctPrice = this.decoctPrice
        decoctPrice = this.decoctPrice || 0
      }
      if (Number(this.orderData[0].isEmergency)) {
        urgentPrice = this.service.urgentFee || 0
      }
      if (!this.orderData[0] || this.orderComData.source === '2') {
        return 0
      }
      this.orderData.map(v => {
        if (v.source === '2') {
          money = floatTool.add(money, 0)
        } else {
          if (v.serviceItem.price) {
            let count = v.count ? v.count : 1
            if (['301', '302'].includes(this.service.serviceClassification)) {
              money = floatTool.add(money, floatTool.multiply(Number(v.serviceItem.price), Number(count)))
            } else if (['303', '304'].includes(this.service.serviceClassification)) {
              let price = floatTool.multiply(Number(v.serviceItem.price), Number(v.amount))
              money = floatTool.add(money, price)
            } else if (['800', '801'].includes(this.service.serviceClassification)) {
              money = floatTool.add(money, floatTool.add(Number(v.serviceItem.price), Number(urgentPrice)))
            } else {
              money = floatTool.multiply(Number(v.serviceItem.price), Number(v.count))
            }
          }
        }
      })
      if (this.orderComData.count) {
        money = floatTool.multiply(floatTool.add(money, decoctPrice), this.orderComData.count)
      }
      return money
    },
    serviceItemDisabled () {
      // 在路径应用时，编辑路径模版的医嘱，医嘱名称不可修改
      // if (this.stageId && this.orderData[0].pathwayAdviceId) {
      //   return true
      // }
      // return false
      return true
    },
    showHandle () {
      if (!this.stageId) {
        return true
      } else {
        if (this.orderData[0] && this.orderData[0].pathwayAdviceId) {
          return false
        } else {
          return true
        }
      }
    }
  },
  components: {
    drugInfo,
    formatLang,
    cdss1, // CDSS检验弹窗
    doctorLimitDialog // 处方权验证弹窗
  },
  directives: {
    ctrlEnter: {
      inserted (el, binding, vnode) {
        document.onkeydown = function (event) {
          let e = event || window.event
          let dom = el.querySelectorAll('.ctrlenter')
          if (dom[0] && e && e.keyCode === 13) {
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
          // if (dom[0] && e && e.keyCode === 13 && e.ctrlKey) {
          //   vnode.context.submitEvent()
          // }
        }
      }
    }
  },
  methods: {
    /**
     * #####################################  公共处理  #####################################
     */
    alertClose () {
      this.showAlertMsg = {}
      this.showAlert = false
    },
    getCountUnitText (item) {
      if (!item) {
        return '次'
      }
      if (item.unitName) {
        return item.unitName
      }
      if (item.localObject) {
        return item.localObject.unitGroupItemList[0].name
      }
      return ''
    },
    // 设置中药待煎费用
    setChiDecoctPrice () {
      this.medicalapi.getDaijian('daijian').then(res => {
        this.decoctPrice = this.orderComData.decoctPrice = (res.data && res.data.price) || 0
      })
    },
    // 通过频次值集返回code判断是临时还是长期医嘱（code=14 || 33为临时医嘱）
    getTermType (useFreq) {
      let code = this.storage.getSysTypeText('CV06.00.228', useFreq, 'code')
      return (code === '14' || code === '33') ? 0 : 1
    },
    showAddEvent () {
      this.$emit('change')
    },
    /**
     * #####################################  医嘱项表单处理  ##########################################
     */
    // 通过service类型获取医嘱项表单scheme
    async getServiceSchema (type) {
      const res = await serviceapi.getServiceItems({ serviceClassification: type, scene: this.scene })
      if (res && res.schemaValue) {
        return res
      } else {
        return null
      }
    },
    createFormSchema (index) {
      if (this.extendForm.schema && this.extendForm.schema.length) {
        // 过滤不需要展示的字段
        if (this.orderData[index] && this.orderData[index].source && this.orderData[index].source === '3') {
          this.extendForm.schema = this.extendForm.schema.filter(_ => {
            return _.name !== 'measure'
          })
        } else {
          this.extendForm.schema = this.extendForm.schema.filter(_ => {
            return Number(_.props.display) !== 0
          })
        }
        let serviceSapn = ['303', '304'].includes(this.service.serviceClassification) ? 10 : 5
        if (['800', '2125'].includes(this.service.serviceClassification)) {
          serviceSapn = 6
          if (this.service.serviceClassification === '2125') {
            let schema = objFind(this.extendForm.schema, { name: 'doctorItem' })
            schema.props.options = this.doctorItemData
          }
        }
        if (['301', '302'].includes(this.service.serviceClassification) && this.visitType === 1) {
          serviceSapn = 8
        }
        if (['301', '302'].includes(this.service.serviceClassification) && this.visitType === 3) {
          serviceSapn = 7
        }
        let prevItem = [{
          name: 'serviceItem',
          label: `${this.visitText}名称`,
          comp: 'custom',
          span: serviceSapn
        }]
        let measureItem = [{
          name: 'measure',
          label: '剂量',
          comp: 'custom',
          span: 2
        }]
        let nextItems = [{
          name: 'price',
          label: `金额`,
          comp: 'custom',
          span: 2
        }]
        if (['301', '302'].includes(this.service.serviceClassification) && this.visitType === 3) {
          prevItem.push(measureItem[0])
        }
        this.extendForm.schema = prevItem.concat(this.extendForm.schema)
        // if (['299', '300', '301', '302', '303', '304', '799', '800', '801', '802', '867', '10002', '10003', '10004', '10005', '10006', '10008'].includes(this.service.serviceClassification) && !this.isAddTpl) {
        //   this.extendForm.schema = this.extendForm.schema.concat(nextItems)
        // }
        this.extendForm.schema = this.extendForm.schema.concat(nextItems)
        this.extendForm.rules.serviceItem = [
          { required: true, message: '必填项', trigger: 'change' },
          { validator: this.checkEqual, trigger: 'change' }
        ]
        // this.extendForm.rules.measure = [
        //   { required: true, message: '必填项', trigger: 'change' }
        // ]
        this.extendFormSchema[index] = JSON.parse(JSON.stringify(this.extendForm.schema))
      } else {
        return this.$messageTips(this, 'warning', 'service医嘱项为空，请联系技术查看', '提示')
      }
    },
    // 处理医嘱项
    async getServiceItems (data, index, isShow) {
      if (data) {
        if ((data.healthServiceTemplate && data.healthServiceTemplate.schemaValue) || data.serviceClassification) {
          let schemaValue
          if (!data.healthServiceTemplate || !data.healthServiceTemplate.schemaValue) {
            schemaValue = await this.getServiceSchema(data.serviceClassification)
          } else {
            schemaValue = data.healthServiceTemplate
          }
          if (!schemaValue) {
            return false
          }
          // 当service变化时判断schema的变化
          let schemaChange = false
          if (this.schemaId !== schemaValue.id || this.isCreateSchema) {
            schemaChange = true
          }
          this.isCreateSchema = false
          this.schemaId = schemaValue.id
          let schemaObj = JSON.parse(schemaValue.schemaValue)
          // 兼容旧的执行科室、用法、滴速 schema
          let delIndex = -1
          schemaObj.forEach((i, j) => {
            if (i.propertyObject.code === 'excuteProvider' && i.propertyObject.valueUrl.indexOf('SERVICE_ID') === -1) {
              i.propertyObject.valueUrl = '/sob/serviceProviderR/getExecuteProviderList?serviceId=SERVICE_ID&scene=' + this.visitType
            }
            if (i.propertyObject.code === 'dropSpeed') {
              delIndex = j
            }
            if (i.propertyObject.code === 'employ' && i.propertyObject.type === 60001) {
              i.propertyObject.type = 60005
            }
          })
          if (delIndex > -1) {
            schemaObj.splice(delIndex, 1)
          }
          let format = {
            id: 'providerId',
            name: 'providerName'
          }
          // 动态获取执行科室，在获取执行科室url动态添加参数
          schemaObj.forEach((h, k) => {
            if (h.propertyObject.code === 'excuteProvider') {
              if (h.propertyObject.valueUrl.indexOf('SERVICE_ID') > -1) {
                h.propertyObject.valueUrl = h.propertyObject.valueUrl.replace('SERVICE_ID', data.id)
                let n = 1
                if (this.service.isSet === 1 || this.service.isSet === '1') {
                  n = 2
                }
                h.propertyObject.valueUrl = h.propertyObject.valueUrl + '&relationType=2&adviceType=' + n
                h.propertyObject.field.format = format
                if (this.orderData[0] && this.orderData[0].excuteProvider) {
                  h.propertyObject.field.firstSelect = false
                } else {
                  h.propertyObject.field.firstSelect = data.hasExecuteProvider
                }
              }
            }
            // 如果是添加模板，取消库房字段的必填
            if (this.isAddTpl && h.propertyObject.code === 'sendClinic') {
              h.isMust = '0'
            }
          })
          if (isShow) {
            // 获取service扩展项默认值
            let extend = createSchemaByItems(schemaObj, { noPlaceholder: true, tplHide: this.isAddTpl })
            this.extendForm = extend
            this.extendForm.rules.serviceItem = [
              { required: true, message: '必填项', trigger: 'change' },
              { validator: this.checkEqual, trigger: 'change' }
            ]
            this.extendForm.rules.measure = [
              { required: true, message: '必填项', trigger: 'change' }
            ]
            if (schemaChange) {
              this.createFormSchema(index)
            }
            let hasSendClinic = false
            this.extendForm.schema.map(item => {
              if (item.name === 'sendClinic') {
                hasSendClinic = true
              }
            })
            if (!data.hasExecuteProvider && !this.orderData[index].excuteProvider) {
              // 当前科室
              if (this.baseInfo && this.baseInfo.providerId && !hasSendClinic) {
                // 医用耗材和商用耗材默认执行科室【院外】
                if (['300', '10008'].includes(this.service.serviceClassification)) {
                  this.orderData[index].excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
                } else {
                  this.orderData[index].excuteProvider = { id: (this.baseInfo && this.baseInfo.providerId) ? this.baseInfo.providerId : '', name: this.curProviderName }
                }
              } else {
                this.extendForm.schema.map(item => {
                  if (item.name === 'excuteProvider') {
                    item.props.field.firstSelect = true
                  }
                  return item
                })
              }
            }
            if (extend && extend.obj) {
              // 父子医嘱 子医嘱部分字段取父医嘱的值 无法修改
              let firstKeys = ['useFreq', 'excuteProvider', 'totalUseDay', 'excuteNumber', 'employ', 'startTime', 'source']
              if (this.visitType === 3) {
                firstKeys = ['useFreq', 'termType', 'source', 'excuteProvider', 'excuteNumber', 'employ', 'startTime']
              }
              for (let item in extend.obj) {
                if (!firstKeys.includes(item) && extend.obj[item] && !this.orderData[index][item]) {
                  this.orderData[index][item] = extend.obj[item]
                }
              }
              // 医用耗材和商用耗材默认执行科室【院外】
              if (['300', '10008'].includes(this.service.serviceClassification)) {
                this.orderData[index].excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
              }
              this.$set(this.orderData, index, this.orderData[index])
            }
          } else {
            this.extendForm = createSchemaByItems(schemaObj, { noPlaceholder: true, tplHide: this.isAddTpl })
            this.createFormSchema(index)
          }
        }
        if (data.commonTemplate && data.commonTemplate.schemaValue) {
          let schemaObj = JSON.parse(data.commonTemplate.schemaValue)
          let format = {
            id: 'providerId',
            name: 'providerName'
          }
          // 动态获取执行科室，在获取执行科室url动态添加参数
          schemaObj.forEach((h, k) => {
            if (h.propertyObject.code === 'excuteProvider') {
              if (h.propertyObject.valueUrl.indexOf('SERVICE_ID') > -1) {
                h.propertyObject.valueUrl = h.propertyObject.valueUrl.replace('SERVICE_ID', data.id)
                let n = 1
                if (this.service.isSet === 1 || this.service.isSet === '1') {
                  n = 2
                }
                h.propertyObject.valueUrl = h.propertyObject.valueUrl + '&relationType=2&adviceType=' + n
                h.propertyObject.field.format = format
              }
            }
          })
          this.extendCommonForm = createSchemaByItems(schemaObj, { noPlaceholder: true })
        }
      }
    },
    setFormSchema () {
      if (this.extendFormSchema.length) {
        this.extendFormSchema.map((item, index) => {
          item.map(sitem => {
            if (sitem.props && sitem.props.apiParams) {
              sitem.props.obj = this.orderData[index]
            }
            return sitem
          })
          return item
        })
      }
    },
    addSubService (index) {
      let ordersData = this.orderData[index]
      if (this.visitType === 3 && !this.isAddTpl && ordersData.allotNum - ordersData.count < 0 && ordersData.source !== '2' && !this.isPathway) {
        return false
      }
      if (['301', '302'].includes(this.service.serviceClassification) && (!ordersData.measure || !ordersData.count)) {
        return false
      }
      this.$refs.serviceIssued[index].$refs.form.validate(valid => {
        if (valid) {
          this.formShowMessage = false
          let initServiceData = JSON.parse(JSON.stringify(this.initServiceData))
          if (['301', '302'].includes(this.service.serviceClassification)) {
            setTimeout(() => {
              initServiceData.isMain = 2
              initServiceData.useFreq = this.orderData[0].useFreq
              if (this.orderData[0].source) initServiceData.source = this.orderData[0].source
              initServiceData.excuteProvider = this.orderData[0].excuteProvider
              initServiceData.totalUseDay = this.orderData[0].totalUseDay
              initServiceData.excuteNumber = this.orderData[0].excuteNumber
              initServiceData.employ = this.orderData[0].employ
              initServiceData.startTime = this.orderData[0].startTime
              initServiceData.sendClinic = this.orderData[0].sendClinic
              if (this.visitType === 3) {
                initServiceData.termType = this.orderData[0].termType
              }
            }, 100)
          }
          initServiceData.serviceItem = ''
          initServiceData.itemId = randomString(32, 62)
          initServiceData.sendClinic = ''
          initServiceData.entrust = ''
          if (['303', '304'].includes(this.service.serviceClassification)) {
            initServiceData.decoction = ''
          }
          let schema = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
          schema.map(item => {
            if (item.name === 'excuteProvider') {
              item.props.field.firstSelect = false
            }
            return item
          })
          this.$set(this.extendFormSchema, index + 1, schema)
          this.$set(this.orderData, index + 1, initServiceData)
          // this.$set(this.oldOrderData, index + 1, initServiceData)
          this.$nextTick(_ => {
            let n = this.$refs.serviceitemselect.length
            this.$refs.serviceitemselect[n - 1].$refs.select.focus()
            setTimeout(_ => {
              if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'insuranceIdentification')) {
                this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'insuranceIdentification').props.disabled = false
              }
              if (['301', '302'].includes(this.service.serviceClassification)) {
                // 父子医嘱 子医嘱部分字段取父医嘱的值 无法修改
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'useFreq')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'useFreq').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'excuteProvider')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'excuteProvider').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'source')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'source').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'termType')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'termType').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'totalUseDay')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'totalUseDay').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'excuteNumber')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'excuteNumber').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'employ')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'employ').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'startTime')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'startTime').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'sendClinic')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index + 1], 'sendClinic').props.disabled = true
                }
              }
              if (this.$refs.serviceIssued[index + 1]) {
                let n = -1
                this.extendFormSchema[0].forEach((item, index) => {
                  let flag = false
                  if (Array.isArray(this.orderData[0][item.name])) {
                    if (!this.orderData[0][item.name].length) {
                      flag = true
                    }
                  }
                  if (!this.orderData[0][item.name]) {
                    flag = true
                  }
                  if (this.extendForm.rules[item.name] && this.extendForm.rules[item.name][0] && this.extendForm.rules[item.name][0].required && flag) {
                    n = index
                  }
                })
                if (n > -1) {
                  this.$refs.serviceIssued[index + 1].$refs.form.$el.querySelectorAll('input')[n].focus()
                }
              }
            }, 1500)
          })
        } else {
          this.formShowMessage = true
        }
      })
    },
    delSubService (index) {
      if (this.orderData[index].shopSetItemId) {
        let localSessionMealCount = this.storage.getSessionStorage(`SET_MEAL_${this.orderData[index].shopSetItemId}`)
        if (localSessionMealCount) {
          localSessionMealCount = JSON.parse(localSessionMealCount)
          localSessionMealCount.itemNumFinished = localSessionMealCount.itemNumFinished - 1
          if (localSessionMealCount.itemNumFinished === 0) {
            storage.removeSessionStorage(`SET_MEAL_${this.orderData[index].shopSetItemId}`)
          } else {
            storage.setSessionStorage(`SET_MEAL_${this.orderData[index].shopSetItemId}`, JSON.stringify(localSessionMealCount))
          }
        }
      }
      if ((index === 0 && ['301', '302'].includes(this.service.serviceClassification)) || this.orderData.length === 1) {
        // 西药主医嘱删除 清空全部医嘱
        this.service = ''
        this.orderData = []
        this.extendForm = { schema: [], obj: {}, rules: {} }
        this.extendCommonForm = { schema: [], obj: {}, rules: {} }
        this.extendFormSchema = []
      } else {
        this.orderData.splice(index, 1)
        // 解决删除后项目回显问题
        this.orderData.map(item => {
          delete item.serviceItem.echo
          return item
        })
      }
      // 刘杰坤添加，用于判断套餐定义部分，用户是否取消了编辑操作
      this.$emit('cancel', this.orderData.length)
    },
    clearServiceItem (type, index) {
      // this.orderData[index].measure = ''
      // this.orderData[index].entrust = ''
      // this.orderData[index].excuteProvider = ''
      // if (['301', '302'].includes(type)) {
      //   this.orderData[index].useFreq = ''
      //   this.orderData[index].employ = ''
      //   this.orderData[index].totalUseDay = ''
      //   this.orderData[index].count = ''
      // }
      // if (['303', '304'].includes(type)) {
      //   this.orderData[index].amount = ''
      //   this.orderData[index].decoction = ''
      // }
      // if (['800', '801'].includes(type)) {
      //   this.service.urgentFee = 0
      //   this.orderData[index].isEmergency = ''
      // }
      this.delSubService(index)
    },
    /**
     * #####################################  医嘱service库存处理  #####################################
     */
    async getServiceStock (value, index, callback) {
      if (!value && index === 0) {
        return false
      }
      let orderDataItem = this.orderData[index]
      if (value) {
        if (index > 0) {
          orderDataItem.useFreq = this.orderData[0].useFreq
          orderDataItem.employ = this.orderData[0].employ
          orderDataItem.totalUseDay = this.orderData[0].totalUseDay
          this.service.urgentFee = value.urgentFee
        }
        this.isCreateSchema = true
      }
      await this.getServiceItems(value, index, true)
      // 判断如果对应行没有表单schema自动遍历生成  (处理父组件传值回显问题)
      if (!this.extendFormSchema[index]) {
        this.extendFormSchema[0] = this.extendFormSchema[0] || JSON.parse(JSON.stringify(this.extendForm.schema[0]))
        let schema = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
        schema.map(item => {
          if (item.name === 'excuteProvider') {
            item.props.field.firstSelect = false
          }
          return item
        })
        setTimeout(() => {
          this.$set(this.extendFormSchema, index, schema)
        }, 500)
      }
      this.$nextTick(async _ => {
        // 门诊医保逻辑
        setTimeout(() => {
          if (this.visitType === 1 && !this.isAddTpl) {
            // 医保逻辑判断 开单属性增加“医保类型”，当是“无自付”“有自付”时默认医保，用户可切换成保外；“全自付”时，默认自费，不能修改
            // shareInfo.isBasicMedicalInsurance 是否为基本医疗保险
            if (this.shareInfo.isBasicMedicalInsurance && value && (value.chargeLevel === '1' || value.chargeLevel === '2')) {
              if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'insuranceIdentification')) {
                this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'insuranceIdentification').props.disabled = false
              }
              orderDataItem.insuranceIdentification = '1'
              orderDataItem.chargeLevel = value.chargeLevel
            } else {
              if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'insuranceIdentification')) {
                this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'insuranceIdentification').props.disabled = true
              }
              orderDataItem.insuranceIdentification = '0'
              orderDataItem.chargeLevel = value.chargeLevel
            }
          }
          if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'checkGuidance')) {
            this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'checkGuidance').props.disabled = true
          }
          this.$set(this.extendFormSchema, index, this.extendFormSchema[index])
        }, 1000)
        if (!this.isAddTpl) {
          // 判断收费项，是否有价格
          let flag = false
          if (value.isSet) {
            flag = false
          } else {
            if ((value.isAdvice + '').split('')[1] === '1') {
              flag = true
            }
          }
          if (flag && !value.price && typeof value.price !== 'number') {
            orderDataItem.checkPriceInfo = true
          } else {
            orderDataItem.checkPriceInfo = false
          }
        }
        orderDataItem.doctorAdviceType = value.isSet ? '2' : '1'
        if (['300', '10008'].includes(value.serviceClassification)) {
          orderDataItem.countUnitId = value.unit || ''
          orderDataItem.countUnit = value.unitName || ''
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'count').props.append = orderDataItem.countUnit
        } else if (['301', '302'].includes(value.serviceClassification) && this.visitType !== 3) {
          orderDataItem.measureUnit = value.doseUnit || ''
          orderDataItem.measureUnitName = value.doseUnitName || ''
          orderDataItem.countUnitId = value.unit || ''
          orderDataItem.countUnit = value.unitName || ''
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'measure').props.append = formatLang(value, 'doseUnitName')
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'count').props.append = formatLang(value, 'unitName')
        } else if (['303', '304'].includes(value.serviceClassification)) {
          orderDataItem.amountUnitTxt = value.doseUnitName || ''
          orderDataItem.amountUnit = value.doseUnit || ''
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'amount').props.append = orderDataItem.amountUnitTxt
        }
        if (!value || !['301', '302', '303', '304', '300', '10008'].includes(value.serviceClassification)) {
          return callback && callback(value)
        }
        if (!this.isAddTpl) {
          // 住院根据病区id areaId 查询库存；门诊根据科室Id providerId 查询库存
          let params = {
            localMaterialId: value.localMaterialId,
            scene: this.scene
          }
          if (this.visitType === 3) {
            params.areaId = this.baseInfo.areaId || this.storage.getSessionStorage('spaceId')
          } else {
            params.providerId = this.baseInfo.providerId
          }
          let res = await medicalapi.queryServiceStock(params).catch(() => {
            this.orderData[index].checkStockInfo = true
          })
          orderDataItem.isGetStock = true
          if (res && res.resultList && res.resultList.length) {
            let sendClinic = []
            res.resultList.forEach((item, indexs) => {
              if (!item.clinicObject) {
                orderDataItem.checkStockInfo = true
              } else {
                orderDataItem.checkStockInfo = false
                let clinicObject = item.clinicObject ? JSON.parse(JSON.stringify(item.clinicObject)) : {}
                let storageRoomObject = item.storageRoomObject || {}
                if (clinicObject && clinicObject.id) {
                  clinicObject.id = item.storageRoomId
                  clinicObject.name = (storageRoomObject && storageRoomObject.id) ? `${clinicObject.name}-${storageRoomObject.name}` : `${clinicObject.name}`
                  clinicObject.nameEn = (storageRoomObject && storageRoomObject.id) ? `${formatLang(clinicObject)}-${formatLang(storageRoomObject)}` : `${formatLang(clinicObject)}`
                  clinicObject.localSettingObject = JSON.parse(JSON.stringify(item))
                  sendClinic.push(clinicObject)
                }
              }
            })
            if (index > 0) {
              // 父子医嘱 子医嘱部分字段取父医嘱的值 无法修改
              setTimeout(() => {
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'useFreq')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'useFreq').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteProvider')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteProvider').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'source')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'source').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'termType')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'termType').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'totalUseDay')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'totalUseDay').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteNumber')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteNumber').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'employ')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'employ').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'startTime')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'startTime').props.disabled = true
                }
                if (this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'sendClinic')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'sendClinic').props.disabled = true
                }
              }, 1000)
            }
            let sclinic
            // 添加子医嘱，或者编辑状态下父医嘱，需要匹配列表中的库房，获取当前的库房
            if (sendClinic && sendClinic.length && (index > 0 || (index === 0 && this.orderData[0].sendClinic && typeof this.orderData[0].sendClinic === 'string'))) {
              sclinic = objFind(sendClinic, { id: this.orderData[0].sendClinic.id || this.orderData[0].sendClinic })
              if (!sclinic && orderDataItem.source !== '2') {
                orderDataItem.checkStockInfo = true
              }
            }
            let flag = false
            if (sendClinic[0]) {
              // 判断药品基础信息是否完整
              // 制剂成药转换比 ：preparTopatentMedicineRatio
              // 制剂成分转换比 ：preparationsUnilateral
              // 包装制剂转换比 : packageToPrepareRatio
              let materialObj = sendClinic[0] && sendClinic[0].localSettingObject && sendClinic[0].localSettingObject.localSettingObject && sendClinic[0].localSettingObject.localSettingObject.materialVoObject || {}
              if (!materialObj.packageToPrepareRatio && !orderDataItem.count && ['301', '302'].includes(value.serviceClassification)) {
                flag = true
              } else {
                if (value.doseUnitCode === 'SXX000053' && !materialObj.preparationsUnilateral && !orderDataItem.count && ['301', '302'].includes(value.serviceClassification)) {     // 剂量单位为成分规格
                  flag = true
                } else if (value.doseUnitCode === 'SXX000054' && !materialObj.preparTopatentMedicineRatio && !orderDataItem.count && ['301', '302'].includes(value.serviceClassification)) {     // 默认剂量单位为成药剂量
                  flag = true
                }
              }
            }
            if (['301', '302', '303', '304'].includes(value.serviceClassification) && (!value.doseUnitName || !value.unitName || flag)) {
              orderDataItem.checkBaseInfo = true
            } else {
              orderDataItem.checkBaseInfo = false
            }
            this.$nextTick(() => {
              setTimeout(() => {
                if (this.extendFormSchema[index] && this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'sendClinic')) {
                  this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'sendClinic').props.options = sendClinic
                  if (!orderDataItem.sendClinic) {
                    if (index === 0) {
                      orderDataItem.sendClinic = sendClinic[0]
                    } else {
                      orderDataItem.sendClinic = sclinic || {}
                    }
                  }
                  if (typeof orderDataItem.sendClinic === 'string') {
                    orderDataItem.sendClinic = sclinic || {}
                  }
                  if (typeof orderDataItem.sendClinic === 'object') {
                    if (this.service.id !== orderDataItem.serviceItem.id) {
                      if (index === 0) {
                        orderDataItem.sendClinic = sendClinic[0]
                      } else {
                        orderDataItem.sendClinic = sclinic || {}
                      }
                    }
                  }
                  if (orderDataItem.source === '2' && (this.visitType === 1 || !this.selfDrugStatus)) {
                    orderDataItem.sendClinic = {}
                    if (index === 0 && this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'sendClinic')) {
                      this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'sendClinic').props.disabled = true
                    }
                    if (this.visitType === 1) {
                      if (index === 0 && this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteProvider')) {
                        this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteProvider').props.disabled = true
                        this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteProvider').props.field.disabled = true
                      }
                      if (index === 0 && this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteNumber')) {
                        this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteNumber').props.disabled = true
                        this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'excuteNumber').props.field.disabled = true
                      }
                    }
                    return false
                  }
                } else {
                  orderDataItem.sendClinic = sendClinic[0]
                }
                // 解决（渠道是自备的时候，查不到库房会造成数量不自动计算）
                if (Object.keys(orderDataItem.sendClinic).length) {
                  this.setServiceInfo(orderDataItem.sendClinic, value, index, callback)
                } else {
                  this.setServiceInfo(this.oldSendClinic || {}, value, index, callback)
                }
              }, 300)
            })
          } else {
            this.orderData[index].checkStockInfo = true
          }
        } else {
          let res = await medicalapi.getDrugInfoByLocal({ ids: value.localMaterialId })
          // 判断药品基础信息是否完整
          // 制剂成药转换比 ：preparTopatentMedicineRatio
          // 制剂成分转换比 ：preparationsUnilateral
          // 包装制剂转换比 : packageToPrepareRatio
          let materialObj = res.data[0].materialVoObject
          let flag = false
          if (!materialObj.packageToPrepareRatio && !orderDataItem.count && this.visitType === 3 && ['301', '302'].includes(value.serviceClassification)) {
            flag = true
          } else {
            if (value.doseUnitCode === 'SXX000053' && !materialObj.preparationsUnilateral && !orderDataItem.count && this.visitType === 3 && ['301', '302'].includes(value.serviceClassification)) {     // 剂量单位为成分规格
              flag = true
            } else if (value.doseUnitCode === 'SXX000054' && !materialObj.preparTopatentMedicineRatio && !orderDataItem.count && this.visitType === 3 && ['301', '302'].includes(value.serviceClassification)) {     // 默认剂量单位为成药剂量
              flag = true
            }
          }
          if (['301', '302', '303', '304'].includes(value.serviceClassification) && (!value.doseUnitName || !value.unitName || flag)) {
            orderDataItem.checkBaseInfo = true
          } else {
            orderDataItem.checkBaseInfo = false
          }
          this.setServiceInfo(res.data, value, index, [], callback)
        }
      })
    },
    setServiceInfo (res, value, index, sendClinic, done) {
      res = res || {}
      let serviceData = this.orderData[index]
      if (!this.isAddTpl) {
        const localObj = res.localSettingObject || {}
        const obj = localObj.localSettingObject || {}
        const materialObj = obj.materialVoObject || {}
        if (serviceData) {
          serviceData.clinicid = localObj.clinicId
          serviceData.mailFlag = localObj.relationType    // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
          if (serviceData.source === '2') {
            this.orderComData.storageRoomId = ''
            this.orderComData.storageRoomName = ''
          } else {
            serviceData.storageRoomId = localObj.storageRoomId
            serviceData.storageRoomName = res.name
          }
          serviceData.drugType = obj.classifyId
          serviceData.localMaterialId = localObj.localMaterialId
          serviceData.allotNum = localObj.usableNum || 0
          serviceData.drugRatio = materialObj.drugRatio || 1
          serviceData.globalMaterialId = obj.materialSkuId
          serviceData.specialClassifyDrug = materialObj.specialClassify
          serviceData.specialClassify = materialObj.specialClassify
          serviceData.serviceItem.specialClassify = materialObj.specialClassify
          serviceData.highRisk = materialObj.highRisk
          serviceData.antibioticType = materialObj.antibioticType
          serviceData.allergenSecond = materialObj.allergenSecond
          if (!serviceData.entrust) {
            serviceData.entrust = materialObj.entrust
          }
          if (['301', '302'].includes(value.serviceClassification)) {
            let discountUnit = 1
            // 制剂成药转换比 ：preparTopatentMedicineRatio
            // 制剂成分转换比 ：preparationsUnilateral
            // 包装制剂转换比 : packageToPrepareRatio
            if (value.doseUnitCode === 'SXX000053') {     // 剂量单位为成分规格
              discountUnit = materialObj.preparationsUnilateral || 0
            } else if (value.doseUnitCode === 'SXX000054') {     // 默认剂量单位为成药剂量
              discountUnit = materialObj.preparTopatentMedicineRatio || 0
            } else if (value.doseUnitCode === 'SXX000047') {     // 默认剂量单位为制剂单位
              discountUnit = 1
            }
            // 药品转换比换算逻辑（旧）
            // if (value.doseUnitCode === 'SXX000053') {     // 默认剂量单位为成分
            //   discountUnit = materialObj.patentMedicineTopreparationSpecRatio || 1  // 成药成分转换比
            //   if (materialObj.patentMedicineUnit) {     // 判断是否有成药
            //     discountUnit = floatTool.multiply(discountUnit, (materialObj.preparTopatentMedicineRatio || 1))
            //   }
            // } else if (value.doseUnitCode === 'SXX000054') {     // 默认剂量单位为成药剂量
            //   discountUnit = materialObj.preparTopatentMedicineRatio || 1
            // } else if (value.doseUnitCode === 'SXX000047') {     // 默认剂量单位为制剂单位
            //   discountUnit = 1
            // }
            // discountUnit = floatTool.multiply(discountUnit, (materialObj.packageToPrepareRatio || 1))
            serviceData.measureUnit = value.doseUnit || ''
            serviceData.measureUnitName = value.doseUnitName || ''
            serviceData.countUnitId = value.unit || ''
            serviceData.countUnit = value.unitName || ''
            serviceData.discountUnit = discountUnit
            serviceData.packageToPrepareRatio = materialObj.packageToPrepareRatio || 0
            serviceData.measure = serviceData.measure || +value.doseValue || ''
            if (index === 0 && (!serviceData.employ || !serviceData.employ.length)) {
              serviceData.employ = materialObj.useWay ? [materialObj.useWay.split(',')[0]] : []
            }
            // if (!serviceData.employ || !serviceData.employ.length) {
            //   serviceData.employ = materialObj.useWay ? [materialObj.useWay.split(',')[0]] : []
            // }
            if (this.visitType === 1) {  // 门诊
              if (localObj.relationType || index) {
                this.extendFormSchema[index].map(item => {
                  if (item.name === 'excuteProvider' || item.name === 'excuteNumber') {
                    item.props.disabled = true
                  }
                  return item
                })
                if (index === 0 && !localObj.relationType) {
                  serviceData.excuteProvider = serviceData.excuteProvider || { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
                  serviceData.excuteNumber = ''
                } else if (localObj.relationType) {
                  serviceData.excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
                  serviceData.excuteNumber = ''
                }
              } else {
                this.extendFormSchema[index].map(item => {
                  if (item.name === 'excuteProvider' || item.name === 'excuteNumber') {
                    item.props.disabled = false
                  }
                  return item
                })
                serviceData.excuteProvider = serviceData.excuteProvider || { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
              }
            } else if (this.visitType === 3) {   // 住院
              if (!serviceData.excuteProvider || !serviceData.excuteProvider.id) {
                serviceData.excuteProvider = { id: (this.baseInfo && this.baseInfo.providerId) ? this.baseInfo.providerId : '', name: this.curProviderName }
              }
            }
            if (index === 0 && (!serviceData.useFreq || !serviceData.useFreq.length)) {
              if (this.visitType === 3) {
                serviceData.useFreq = materialObj.frequency ? [materialObj.frequency] : []
              } else {
                serviceData.useFreq = materialObj.frequency ? materialObj.frequency : ''
              }
            }
            if (this.visitType !== 3) {
              // serviceData.measureUnitNameEn = 'enu'
              // serviceData.countUnitEn = 'unu'
              // 给数量和剂量添加单位 by lvjiangtao 3.5.2 上面为测试数据
              this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'measure').props.append = formatLang(serviceData, 'measureUnitName')
              this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'count').props.append = formatLang(serviceData, 'countUnit')
            }
            this.$set(this.extendFormSchema, index, this.extendFormSchema[index])
          } else if (['303', '304'].includes(value.serviceClassification)) {
            serviceData.unitName = value.doseUnitName || ''
            serviceData.amountUnitTxt = value.doseUnitName || ''
            serviceData.amountUnit = value.doseUnit || ''
            serviceData.amount = serviceData.amount ? serviceData.amount : value.doseValue || ''
            serviceData.countUnitId = value.unit || ''
            serviceData.countUnit = value.unitName || ''
            serviceData.source = this.orderComData && this.orderComData.source || '1'
            this.orderComData.mailFlag = serviceData.mailFlag
            if (serviceData.source === '2') {
              this.orderComData.storageRoomId = ''
              this.orderComData.storageRoomName = ''
            } else {
              this.orderComData.storageRoomId = serviceData.storageRoomId
              this.orderComData.storageRoomName = serviceData.storageRoomName
            }
            if (this.visitType === 1) {  // 门诊
              if (!serviceData.excuteProvider || !serviceData.excuteProvider.id) {
                serviceData.excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
              }
            } else if (this.visitType === 3) {   // 住院
              if (!serviceData.excuteProvider || !serviceData.excuteProvider.id) {
                serviceData.excuteProvider = { id: (this.baseInfo && this.baseInfo.providerId) ? this.baseInfo.providerId : '', name: this.curProviderName }
              }
            }
            this.$set(this.extendFormSchema, index, this.extendFormSchema[index])
            this.$set(this.orderComData, 'excuteProvider', serviceData.excuteProvider)
            this.$set(this.orderComData, 'source', serviceData.source)
          }
        }
        if (['299', '300', '10008'].includes(value.serviceClassification)) {
          serviceData.countUnitId = value.unit || ''
          serviceData.countUnit = value.unitName || ''
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'count').props.append = serviceData.countUnit
        }
        return done && done(value, sendClinic)
      } else {
        const obj = res[0] || {}
        // const obj = localObj.localSettingObject || {}
        const materialObj = obj.materialVoObject || {}
        serviceData.drugType = obj.classifyId
        serviceData.allotNum = obj.usableNum || 0
        serviceData.localMaterialId = value.localMaterialId
        serviceData.globalMaterialId = obj.materialSkuId
        serviceData.drugRatio = materialObj.drugRatio || 1
        serviceData.entrust = materialObj.entrust
        if (['301', '302'].includes(value.serviceClassification)) {
          let discountUnit = 1
          // 药品转换比换算逻辑（旧）
          // if (value.doseUnitCode === 'SXX000053') {     // 默认剂量单位为制剂规格
          //   discountUnit = materialObj.patentMedicineTopreparationSpecRatio || 1
          //   if (materialObj.patentMedicineUnit) {     // 判断是否有成药剂量
          //     discountUnit = floatTool.multiply(discountUnit, (materialObj.preparTopatentMedicineRatio || 1))
          //   }
          // } else if (value.doseUnitCode === 'SXX000054') {     // 默认剂量单位为成药剂量
          //   discountUnit = materialObj.preparTopatentMedicineRatio || 1
          // } else if (value.doseUnitCode === 'SXX000047') {     // 默认剂量单位为制剂单位
          //   discountUnit = 1
          // }
          // discountUnit = floatTool.multiply(discountUnit, (materialObj.packageToPrepareRatio || 1))
          if (value.doseUnitCode === 'SXX000053') {     // 剂量单位为成分规格
            discountUnit = materialObj.preparationsUnilateral || 0
          } else if (value.doseUnitCode === 'SXX000054') {     // 默认剂量单位为成药剂量
            discountUnit = materialObj.preparTopatentMedicineRatio || 0
          } else if (value.doseUnitCode === 'SXX000047') {     // 默认剂量单位为制剂单位
            discountUnit = 1
          }
          serviceData.measureUnit = value.doseUnit || ''
          serviceData.measureUnitName = value.doseUnitName || ''
          serviceData.countUnitId = value.unit || ''
          serviceData.countUnit = value.unitName || ''
          serviceData.discountUnit = discountUnit
          serviceData.packageToPrepareRatio = materialObj.packageToPrepareRatio || 0
          serviceData.measure = serviceData.measure || +value.doseValue || ''
          if (index === 0) {
            serviceData.employ = materialObj.useWay ? [materialObj.useWay.split(',')[0]] : []
            if (this.visitType === 3) {
              serviceData.useFreq = materialObj.frequency ? [materialObj.frequency] : []
            } else {
              serviceData.useFreq = materialObj.frequency ? materialObj.frequency : ''
            }
          }
          if (this.visitType !== 3) {
            this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'measure').props.append = serviceData.measureUnitName
            this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'count').props.append = serviceData.countUnit
          }
          this.$set(this.extendFormSchema, index, this.extendFormSchema[index])
        }
        if (['303', '304'].includes(value.serviceClassification)) {
          serviceData.unitName = value.doseUnitName || ''
          serviceData.amountUnitTxt = value.doseUnitName || ''
          serviceData.amountUnit = value.doseUnit || ''
          serviceData.amount = serviceData.amount ? serviceData.amount : value.doseValue || ''
          serviceData.countUnitId = value.unit || ''
          serviceData.countUnit = value.unitName || ''
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'amount').props.append = serviceData.amountUnitTxt
          this.$set(this.extendFormSchema, index, this.extendFormSchema[index])
          if (this.visitType === 1) {  // 门诊
            if (!serviceData.excuteProvider || !serviceData.excuteProvider.id) {
              serviceData.excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
            }
          }
          this.$set(this.orderComData, 'excuteProvider', serviceData.excuteProvider)
        }
        if (['299', '300', '10008'].includes(value.serviceClassification)) {
          serviceData.countUnitId = value.unit || ''
          serviceData.countUnit = value.unitName || ''
          this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'count').props.append = serviceData.countUnit
        }
        return done && done(value, sendClinic)
      }
    },
    /**
     * #####################################  医嘱提交校验  ############################################
     */
    // 医保提交确认弹窗
    confirmCheckAdvice (res, done) {
      let tipsDom = '<ol class="decimal_ol">'
      res.forEach(item => {
        tipsDom += (item.serviceName || item.name) ? '<li>【' + (item.serviceName || item.name) + '】' + item.validateMsg + '</li>' : '<li>' + item.validateMsg + '</li>'
      })
      tipsDom += '</ol>'
      this.$confirm(tipsDom, '是否继续添加?', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '自费处方',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        if (done) done()
      }).catch(() => {
        return false
      })
    },
    // 医嘱共享批量校验
    async batchCheckShareInfo (service, callback) {
      if (this.isAddTpl || this.visitType !== 1 || !this.shareInfo.isBasicMedicalInsurance) {
        return callback && (typeof callback === 'function') && callback()
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
      if (service && service.id && (service.chargeLevel === '1' || service.chargeLevel === '2')) {
        postdata.data.push({
          id: service.id,
          name: service.name
        })
      } else {
        this.orderData.forEach(item => {
          // 只校验选了医保的处方
          if (item.insuranceIdentification === '1') {
            postdata.data.push({
              id: item.serviceItem.id,
              name: item.serviceItem.name
            })
          }
        })
      }
      if (!postdata.data.length || !this.shareInfo || !this.appoint || this.appoint.subsequentVisit === 3) {
        return callback && (typeof callback === 'function') && callback()
      }
      const res = await medicalapi.batchCheckShareInfo(postdata)
      if (res && res.data && res.data.length) {
        this.adviceShareInfo = res.data
        // 单个校验
        if (service && service.id) {
          this.showAlertMsg.serviceName = service.name
          this.showAlertMsg.alert = `${res.data[0].validateMsg}`
          this.showAlertMsg.tips = service.medicalInsuranceObject ? service.medicalInsuranceObject.remark : ''
          this.showAlert = true
        }
      } else {
        // 单个校验
        if (service && service.id) {
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
      }
      return callback && (typeof callback === 'function') && callback(this.adviceShareInfo)
    },
    // 医保批量校验药品
    async batchCheckDrug (callback) {
      if (this.isAddTpl || this.visitType !== 1) {
        return callback && callback()
      }
      this.adviceCheckData = []
      if (this.orderData.length > 1 || !this.shareInfo || !this.appoint || this.appoint.subsequentVisit === 3 || !this.results || !this.results[0] || !this.results[0].diseaseCode) {
        return callback()
      }
      let postdata = []
      this.orderData.forEach(item => {
        // 只有选了医保的处方才做校验
        if (item.insuranceIdentification === '1') {
          let obj = {
            curetype: this.appoint.subsequentVisit === 3 ? 19 : 11,  // 必填 门诊类型：11 普通门诊 19 急诊
            diagnosecode: this.results ? this.results[0].diseaseCode : '',  // 必填 诊断编码
            hiscode: item.serviceItem.id,  // 必填 项目id
            serviceName: item.serviceItem.name,
            itemtype: ['301', '302', '303', '304'].includes(item.drugType) ? 0 : 1,  // 必填 项目类别：0 药品 1 诊疗设施
            howtouse: this.storage.getSysTypeText('CV06.00.228', item.useFreq, 'code'),  // 必填 使用频次编码    使用值集：THC_PHR_DRUG_FREQUENCY 用药频次 取编码
            days: item.totalUseDay,  // 必填 用药天数
            dosage: item.measure,  // 必填 单次用量
            count: item.count,  // 必填 数量
            conversion: item.drugRatio,  // 必填 换算率
            stdFeeClass: (item.serviceItem.medicalInsuranceObject && item.serviceItem.medicalInsuranceObject.stdFeeClass) || ''
          }
          postdata.push(obj)
        }
      })
      if (!postdata.length) {
        return callback()
      }
      await this.batchCheckShareInfo(null, async res => {
        if (res && res.length) {
          this.confirmCheckAdvice(res, _ => {
            // 选择自费处方
            this.setMedicalInsurance(res)
            callback()
          })
        } else {
          // 医保给报销 做超量校验
          const checkRes = await medicalapi.batchCheckDrug({ data: postdata, returnType: 0 })
          if (checkRes && checkRes.data && checkRes.data.length) {
            this.adviceCheckData = checkRes.data
          }
          callback(this.adviceCheckData)
        }
      })
    },
    // 设置处方医保类型
    setMedicalInsurance (resData) {
      // 选择自费处方
      resData.map(item => {
        item.id = item.itemcode || item.hiscode
        return item
      })
      let idKeys = objKeyBy(resData, 'id')
      let ids = Object.keys(idKeys)
      // 遍历处方  未通过校验选自费
      this.orderData.map(item => {
        if (ids.includes(item.serviceItem.id)) {
          item.insuranceIdentification = '0'
        }
        return item
      })
    },
    async emitSubmit () {
      await this.setToWait()
      this.cdssConfirm = true
      this.showCdss = false
      this.showAlert = false
      this.$emit('submit', this.waitSendData, this.orderData)
      this.$nextTick(() => {
        if (this.$refs.serviceselect && this.$refs.serviceselect.$refs) {
          this.$refs.serviceselect.$refs.select.focus()
        }
      })
    },
    // CDSS弹窗关闭回调事件
    closeCdssEvent () {
      this.cdssConfirm = false
      this.showCdss = false
    },
    // CDSS不通过，强制提交
    confirmCdssSubmit () {
      let type = this.service.serviceClassification
      if (this.visitType === 1 && ['301', '302', '303', '304'].includes(type)) {
        // 校验是否超量
        this.batchCheckDrug(val => {
          if (val && val.length) {
            this.confirmCheckAdvice(val, _ => {
              // 选择自费处方
              this.setMedicalInsurance(val)
              this.showCdss = false
              this.cdssConfirm = false
              if (this.wringStockList && this.wringStockList.length) {
                this.noStockSubmit = true
              } else {
                this.emitSubmit()
              }
            })
          } else {
            this.showCdss = false
            this.cdssConfirm = false
            if (this.wringStockList && this.wringStockList.length) {
              this.noStockSubmit = true
            } else {
              this.emitSubmit()
            }
          }
        })
      } else {
        this.showCdss = false
        this.cdssConfirm = false
        if (this.wringStockList && this.wringStockList.length) {
          this.noStockSubmit = true
        } else {
          this.emitSubmit()
        }
      }
    },
    // CDSS校验
    checkDrugItem (callback) {
      let type = this.service.serviceClassification
      let items = []
      if (['301', '302'].includes(type)) {
        this.orderData.map(item => {
          let obj = {
            localMaterialId: item.localMaterialId,
            globalMaterialId: item.globalMaterialId,
            medicineId: item.localMaterialId,
            medicineName: item.serviceItem.name,
            singleAmount: item.measure,
            singleAmountUnitTxt: item.measureUnitName,
            totalAmount: item.count,
            allergenSecond: item.allergenSecond
          }
          if (item.useFreq) {
            if (this.visitType === 3 && Array.isArray(item.useFreq)) {
              obj.useFreq = item.useFreq[0]
            } else {
              obj.useFreq = item.useFreq
            }
          }
          if (item.employ) {
            if (Array.isArray(item.employ)) {
              obj.useMethod = item.employ[0]
            } else {
              obj.useMethod = item.employ
            }
          }
          items.push(obj)
        })
      }
      if (['303', '304'].includes(type)) {
        this.orderData.map(item => {
          items.push({
            localMaterialId: item.localMaterialId,
            globalMaterialId: item.globalMaterialId,
            medicineId: item.localMaterialId,
            medicineName: item.serviceItem.name,
            amount: item.amount,
            amountUnitTxt: item.amountUnitTxt
          })
        })
      }
      let params = {
        patientId: this.baseInfo.patientId,
        recipeItems: items,
        visitSn: '',
        recipeType: ['303', '304'].includes(type) ? 1 : 2,
        useMethod: ['303', '304'].includes(type) ? this.orderComData.employ : '',
        totalAmount: ['303', '304'].includes(type) ? this.orderComData.count : 1
      }
      if (this.visitType === 1) {
        params.visitSn = this.baseInfo.visitSn
      } else if (this.visitType === 3) {
        params.visitSn = this.baseInfo.hospitalizedNumber
      }
      if (this.orderComData.useFreq) {
        if (this.visitType === 3 && ['303', '304'].includes(type) && Array.isArray(this.orderComData.useFreq)) {
          params.useFreq = this.orderComData.useFreq[0]
        } else {
          params.useFreq = this.orderComData.useFreq
        }
      }
      return params && this.medicalapi.checkDrugItem(params).then(rs => {
        return callback && callback(rs)
      })
    },
    checkDrugItemHandle () {
      this.checkDrugItem(rs => {
        if (rs.data && rs.data.infoList && rs.data.infoList.length) {
          this.wringData = rs.data.infoList
          this.showCdss = true
        } else {
          this.wringData = []
          this.cdssConfirm = false
          this.confirmCdssSubmit()
        }
      })
    },
    // 中西药提交逻辑处理
    drugSubmitCheck (type) {
      let haveStock = this.orderData.filter(item => {
        // 自备药, 定义临床路径不做库存校验
        if (item.source !== '2' && !this.isPathway) {
          if (type === 1) {
            return !item.allotNum || item.allotNum - item.count < 0 && !item.isEntrust
          } else if (type === 2) {
            return !item.allotNum || item.allotNum - item.amount * this.orderComData.count < 0
          }
        }
      })
      // 校验西药 最后提交的数量不能是小数
      let havePass = this.orderData.filter(item => {
        let n = -1
        if ((!item.source || item.source !== '2') && type === 1 && this.visitType === 1 && (item.excuteProvider && item.excuteProvider.id !== 'SOB_EXTUDE_PROVIDER_OUT')) {
          n = Number(this.storage.getSysTypeText('CV06.00.228', item.useFreq, 'value'))
        }
        if (n > -1) {
          return Math.floor(item.count / (n * item.totalUseDay)) !== (item.count / (n * item.totalUseDay))
        }
      })
      if ((this.isAddTpl && !havePass[0]) || (!haveStock[0] && !havePass[0])) {
        return this.checkDrugItemHandle()
      } else if (havePass[0]) {
        return this.$messageTips(this, 'warning', '数量有误，请纠正', '提示')
      } else {
        // 库存验证 库存不足时不能提交
        // return this.$messageTips(this, 'warning', '医嘱存在库存不足项目', '提示')
        this.orderData.map(v => {
          let flag = false
          haveStock.map(n => {
            if (v.serviceId === n.serviceId) {
              flag = true
              v.shortAgeFlag = 0     //  缺货标识  0：缺货  1：有货
            }
          })
          if (!flag) {
            v.shortAgeFlag = 1
          }
          return v
        })
        this.noStockSubmit = true
        this.wringStockList = haveStock
        return this.checkDrugItemHandle()
      }
    },
    conSubmitStock () {
      // this.checkDrugItemHandle()
      this.emitSubmit()
      this.noStockSubmit = false
      this.wringStockList = []
    },
    cancelStock () {
      this.noStockSubmit = false
      this.wringStockList = []
    },
    /**
     * #####################################  医嘱提交  ###############################################
     */
    async submitEvent () {
      if (!this.isAddTpl && this.visitType === 1) {
        const result = await formphrapi.getZhenduan(this.$route.query.visitSn)
        if (!result || !result.length) {
          return this.$messageTips(this, 'warning', '请填写病历中的诊断信息', '提示')
        }
      }
      if (!this.orderData[0].serviceItem.name) {
        this.orderData[0].serviceItem = ''
      }
      if (this.orderData[0].useFreq) {
        let useFreq = Array.isArray(this.orderData[0].useFreq) ? this.orderData[0].useFreq[0] : this.orderData[0].useFreq
        if (useFreq && !this.storage.getSysTypeText('CV06.00.228', useFreq)) {
          if (this.orderData[0].useFreq[0]) {
            this.orderData[0].useFreq = []
          } else {
            this.orderData[0].useFreq = ''
          }
        }
      }
      if (this.orderData[0].employ) {
        let employ = Array.isArray(this.orderData[0].employ) ? this.orderData[0].employ[0] : this.orderData[0].employ
        if (employ && !this.storage.getSysTypeText('CV06.00.102', employ)) {
          if (this.orderData[0].employ[0]) {
            this.orderData[0].employ = []
          } else {
            this.orderData[0].employ = ''
          }
        }
      }
      let isValid = true
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
      if (isValid) {
        this.formShowMessage = false
        this.setWaitData()
      } else {
        this.formShowMessage = true
      }
    },
    async setWaitData () {
      let type = this.service.serviceClassification
      // 校验基础数据是否完整，不全不让提交
      if (this.orderData && this.orderData.length) {
        let baseVaild = false
        this.orderData.forEach(item => {
          if (item.jsonAttr) {
            delete item.jsonAttr
          }
          if (item.checkBaseInfo || item.checkPriceInfo || item.checkStockInfo) {
            baseVaild = true
          }
        })
        if (baseVaild) {
          return this.$messageTips(this, 'warning', '医嘱基础数据不完整，请联系管理员维护', '提示')
        }
      }
      // 住院长期医嘱没有执行时间不让提交
      if (this.orderData && this.orderData.length && this.visitType === 3) {
        let isVaild = true
        this.orderData.forEach(item => {
          if (item.termType === '1' && !item.useFreq[1]) {
            isVaild = false
          }
        })
        if (!isVaild) {
          return this.$messageTips(this, 'warning', '医嘱提交失败，用药频次需设置执行时间，请联系管理员处理！', '提示')
        }
      }
      if (!this.isAddTpl) {
        let isLimit = await this.isLimit()
        this.orderData.forEach(item => {
          item
        })
        if (isLimit) {
          this.limitMedicine = isLimit.length ? isLimit : []
          this.orderData.forEach(item => {
            if (isLimit.length) {
              let pers = this.limitMedicine.filter(v => v.id === item.localMaterialId)
              item.isServicePermission = pers.length ? pers : false
            } else {
              item.isServicePermission = true
            }
          })
          this.limitValid = true
          return
        }
      }
      if (['301', '302', '299', '300', '10008'].includes(type)) {
        return this.drugSubmitCheck(1)
      } else if (['303', '304'].includes(type)) {
        return this.drugSubmitCheck(2)
      } else {
        let data = this.orderData[0]
        let dataKeys = Object.keys(data)
        if (dataKeys.includes('applyForm')) {
          if (!data.applyForm.id || data.applyForm.id === '-1') {
            // return this.$messageTips(this, 'warning', '请填申请单', '提示')
            return this.$bus.$emit('OPEN_DIALOG')
          }
        }
        // 门诊校验库存
        // if (!this.isAddTpl && ['299', '300'].includes(this.service.serviceClassification) && this.visitType === 1 && (this.orderData[0].allotNum - this.orderData[0].count < 0) && this.orderData[0].source !== '2') {
        //   return this.$messageTips(this, 'warning', '医嘱存在库存不足项目', '提示')
        // }
        this.emitSubmit()
      }
    },
    async waitDataHandle (data, type, index, temp) {
      let disposeContent = []
      if (data.id) delete data.id
      if (data.noMust) delete data.noMust
      if (data.employ && this.storage.getSysTypeText('CV06.00.102', data.employ)) disposeContent.push(this.storage.getSysTypeText('CV06.00.102', data.employ))
      let obj = {
        visitType: this.visitType || 3,
        status: '',
        adviceId: data.groupId || (randomString(16, 32) + new Date().getTime()),
        // adviceId: data.groupId || GENERATE_UUID(),
        // termType: data.termType || 0,
        employTxt: this.storage.getSysTypeText('CV06.00.102', data.employ),
        doctorAdviceType: data.doctorAdviceType,
        adviceNum: this.orderData.length,
        cdssResult: '',
        patientName: this.patientName,
        diagnosisName: this.diagnosisName,
        medicalRecordNumber: this.medicalRecordNumber,
        localMaterialId: data.localMaterialId,
        sourceChannel: '1'   // 来源渠道，1-THC医院渠道，2-互联网医院渠道
      }
      let objKeys = Object.keys(data)
      if (objKeys.includes('surgeryTime')) {
        obj.surgeryTime = data.surgeryTime ? this.$moment(data.surgeryTime).format('YYYY-MM-DD HH:mm:ss') : null
      }
      if (objKeys.includes('startTime')) {
        obj.startTime = data.startTime ? this.$moment(data.startTime).format('YYYY-MM-DD HH:mm:ss') : null
      }
      if (objKeys.includes('endTime')) {
        obj.endTime = data.endTime ? this.$moment(data.endTime).format('YYYY-MM-DD HH:mm:ss') : null
      }
      if (objKeys.includes('applyDate')) {
        obj.applyDate = data.applyDate ? this.$moment(data.applyDate).format('YYYY-MM-DD HH:mm:ss') : null
      }
      if (objKeys.includes('ifCollectSpecimens') && !isNull(obj.ifCollectSpecimens)) {
        obj.ifCollectSpecimens = Number(obj.ifCollectSpecimens)
      }
      if (objKeys.includes('ifMatchingBlood') && !isNull(obj.ifMatchingBlood)) {
        obj.ifMatchingBlood = Number(obj.ifMatchingBlood)
      }
      if (objKeys.includes('freeSheet') && !isNull(obj.freeSheet)) {
        obj.freeSheet = Number(obj.freeSheet)
      }
      if (objKeys.includes('isEmergency') && !isNull(obj.isEmergency)) {
        obj.isEmergency = Number(obj.isEmergency)
      }
      if (objKeys.includes('appointDoctor') && !isNull(obj.appointDoctor)) {
        obj.appointDoctor = Number(obj.appointDoctor)
      }
      if (objKeys.includes('appointAnesthesiologist') && !isNull(obj.appointAnesthesiologist)) {
        obj.appointAnesthesiologist = Number(obj.appointAnesthesiologist)
      }
      if (objKeys.includes('appointDate') && !isNull(obj.appointDate)) {
        obj.appointDate = Number(obj.appointDate)
      }
      if (this.visitType === 3) {
        obj.termType = data.termType || 0
      }
      // 住院频次需要级联选择时间
      if (data.useFreq) {
        if (this.visitType === 3 && Array.isArray(data.useFreq)) {
          obj.useFreq = data.useFreq[0]
          obj.frequencyTime = data.useFreq[1]
        } else {
          obj.useFreq = data.useFreq
        }
        obj.useFreqTxt = this.storage.getSysTypeText('CV06.00.228', obj.useFreq)
      }
      if (data.employ) {
        if (Array.isArray(data.employ)) {
          obj.employ = data.employ[0]
          obj.dropSpeed = data.employ[1] || ''
        } else {
          obj.employ = data.employ
        }
        obj.employTxt = this.storage.getSysTypeText('CV06.00.102', obj.employ)
      }
      if (type === 1) {
        if (data.measure) disposeContent.push('每次 ' + data.measure + data.measureUnitName)
        if (data.totalUseDay) disposeContent.push('用 ' + data.totalUseDay + ' 天')
        if (obj.useFreq) disposeContent.push(obj.useFreqTxt)
        if (this.visitType === 1) {
          if (data.count) disposeContent.push('共' + data.count + data.countUnit)
        } else if (this.visitType === 3) {
          if (data.count) disposeContent.push('领' + data.count + data.countUnit)
        }
        // 确保西药父子医嘱adviceId一致
        if (index !== 0) {
          obj.groupId = this.orderData[0].groupId
          obj.adviceId = obj.groupId
        }
        obj.adviceType = data.serviceItem.serviceClassification
        obj.serviceId = data.serviceItem.id
        obj.adviceName = data.serviceItem.byname + (data.serviceItem.name ? '（' + data.serviceItem.name + '）  ' : '  ') + (data.serviceItem.spec ? ' ' + data.serviceItem.spec : '')
        obj.serviceName = data.serviceItem.byname
        obj.spec = data.serviceItem.spec || '' // 增加spec字段给打印用
        obj.price = data.serviceItem.price * data.count
        obj.sortNumber = index + 1
        if (this.orderData.length === 1) obj.isMain = 0
      } else if (type === 2) {
        if (data.count) disposeContent.push('共' + data.count + '剂')
        if (obj.useFreq) disposeContent.push(obj.useFreqTxt)
        if (data.decoct) disposeContent.push('代煎')
        obj.isMain = 0
        obj.decoct = Number(data.decoct)
        obj.adviceType = this.orderData[0].serviceItem.serviceClassification
        obj.price = this.orderTotalPrice - (this.orderComData.decoct ? this.orderComData.decoctPrice * this.orderComData.count : 0)
        obj.serviceItem = this.orderData[0].serviceItem
        obj.serviceId = this.orderData[0].serviceItem.id
        obj.adviceName = []
        this.orderData.map((item, k) => {
          item.sortNumber = k + 1
          if (this.visitType === 1) {
            item.excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
            obj.excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
          } else {
            item.excuteProvider = data.excuteProvider
          }
          obj.adviceName.push(item.serviceItem.byname + (item.serviceItem.name ? '（' + item.serviceItem.name + '）' : ''))
          return item
        })
        obj.adviceName = obj.adviceName.join(',')
        obj.adviceContent = JSON.stringify(this.orderData)
      }
      if (data.source && this.storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', data.source)) disposeContent.push(this.storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', data.source))
      obj.disposeContent = disposeContent.join(' , ')
      obj = Object.assign({}, data, obj, this.baseInfo)
      let _content = Object.assign({}, obj)
      if (type === 1) {
        delete _content.adviceContent
        obj.adviceContent = JSON.stringify(_content)
      }
      obj.excuteProvider = obj.excuteProvider ? obj.excuteProvider.id : ''
      obj.sendClinic = obj.sendClinic ? obj.sendClinic.id : ''
      if (obj.serviceItem) {
        obj.serviceItem.localObject && delete obj.serviceItem.localObject
      }
      // 临床路径
      if (this.stageId) {
        obj.stageInstanceId = this.stageId
      }
      let list = []
      if (this.wringData.length) {
        this.wringData.forEach(item => {
          let str = ''
          if (item.drugName) {
            str += '【' + item.drugName + '】'
          }
          str += item.errorInfo ? item.errorInfo : ''
          str += item.advice ? item.advice : ''
          list.push(str)
        })
      }
      obj.cdssResult = list.join('|')
      if (this.$route.path.split('/')[1] === 'ana') {
        obj.subVisitType = 303
      } else if (this.$route.path.split('/')[1] === 'birth_doctors') {
        obj.subVisitType = 304
      } else {
        if (this.subVisitType) {
          obj.subVisitType = this.subVisitType
        }
      }
      // 兼容格式不对的数据
      if (Array.isArray(obj.useFreq)) {
        delete obj.useFreq
        delete obj.useFreqTxt
        let contnet = JSON.parse(obj.adviceContent)
        delete contnet.useFreq
        delete contnet.useFreqTxt
        obj.adviceContent = JSON.stringify(contnet)
      }
      if (obj.serviceItem && typeof obj.serviceItem !== 'string') {
        obj.serviceItem = JSON.stringify(obj.serviceItem)
      }
      temp.push(obj)
      if (index === this.orderData.length - 1 || index < 0) {
        if (this.visitType === 1 && !this.isAddTpl) {
          // 处方确认添加后，调接口获取附加的service信息，并拼接在数据结构中
          let res = await medicalapi.handleServiceAddItems(temp)
          if (res && res.head && res.head.errCode === 0) {
            temp[0].additionalItem = res.data.addServItems
            temp[0].mergeDetail = res.data.mergeDetail
          }
        }
        let len = this.waitSendData.length
        temp.forEach((sitem, sindex) => {
          this.$set(this.waitSendData, len + sindex, sitem)
        })
      }
    },
    async setToWait () {
      let type = this.service.serviceClassification
      if (['301', '302'].includes(type)) {
        let temp = []
        this.orderData.map(async (v, i) => {
          await this.waitDataHandle(v, 1, i, temp)
        })
      } else if (['303', '304'].includes(type)) {
        this.waitDataHandle(this.orderComData, 2, -1, [])
      } else {
        let data = this.orderData[0]
        if (data && data.id) delete data.id
        if (data.noMust) delete data.noMust
        let obj = {
          isMain: 0,
          adviceType: data.serviceItem.serviceClassification,
          visitType: this.visitType || 3,
          // termType: 0,
          adviceId: data.groupId || randomString(16, 32) + new Date().getTime(),
          // adviceId: data.groupId || GENERATE_UUID(),
          itemId: randomString(32, 62),
          serviceId: data.serviceItem.id,
          adviceName: data.serviceItem.byname ? `${data.serviceItem.byname}${data.serviceItem.spec ? data.serviceItem.spec : ''}` : `${data.serviceItem.name}${data.serviceItem.spec ? data.serviceItem.spec : ''}`,
          serviceName: data.serviceItem.byname || data.serviceItem.name,
          price: data.serviceItem.price,
          disposeContent: '',
          count: data.count || 1,
          countUnitId: data.countUnitId || data.serviceItem.unit,
          countUnit: data.countUnit || data.serviceItem.unitName,
          doctorAdviceType: data.doctorAdviceType,
          patientName: this.patientName,
          diagnosisName: this.diagnosisName,
          medicalRecordNumber: this.medicalRecordNumber,
          sourceChannel: '1'   // 来源渠道，1-THC医院渠道，2-互联网医院渠道
        }
        if (this.visitType === 3) {
          obj.termType = 0
        }
        if (data.employ) {
          if (Array.isArray(data.employ)) {
            obj.employ = data.employ[0]
            obj.dropSpeed = data.employ[1] || ''
          } else {
            obj.employ = data.employ
          }
          obj.employTxt = this.storage.getSysTypeText('CV06.00.102', obj.employ)
        }
        // 临床路径
        if (this.stageId) {
          obj.stageInstanceId = this.stageId
        }
        let objKeys = Object.keys(data)
        if (this.visitType === 3) {
          // 住院频次需要级联选择时间
          if (data.useFreq) {
            if (Array.isArray(data.useFreq)) {
              obj.useFreq = data.useFreq[0]
              obj.frequencyTime = data.useFreq[1]
            } else {
              obj.useFreq = data.useFreq
            }
            // obj.useFreqTxt = this.storage.getSysTypeText('CV06.00.228', obj.useFreq)
          }
          obj.sortNumber = 1
        }
        if (type === '2125') {
          obj.checked = false
          // 手术名称处理  有的机构是单选  有的机构是多选
          if (data.surgeryFreq) {
            if (Array.isArray(data.surgeryFreq)) {
              let surgeryId = []
              let surgeryName = []
              let surgeryCode = []
              if (data.surgeryFreq.length) {
                data.surgeryFreq.forEach(item => {
                  surgeryId.push(item.id)
                  surgeryName.push(item.name)
                  surgeryCode.push(item.code)
                })
              }
              obj.surgeryId = surgeryId.join(',')
              obj.surgeryName = surgeryName.join(',')
              obj.surgeryCode = surgeryCode.join(',')
            } else {
              obj.surgeryId = data.surgeryFreq.id || ''
              obj.surgeryName = data.surgeryFreq.name || ''
              obj.surgeryCode = data.surgeryFreq.code || ''
            }
          }
          obj.positionId = data.position ? data.position.id : ''
          obj.endTime = ''
        } else if (type === '800') {
          if (this.visitType === 3) {
            obj.termType = data.termType || 0
          }
          obj.useFreqTxt = this.storage.getSysTypeText('CV06.00.228', obj.useFreq)
          obj.positionValueSetCode = this.$ever.getFieldFromSchema(this.extendFormSchema[0], 'position').props.code
        } else if (type === '10001') { // 备血医嘱
          obj.ifCollectSpecimens = Number(data.ifCollectSpecimens)
          obj.ifMatchingBlood = Number(data.ifMatchingBlood)
        } else {
          if (this.visitType === 3) {
            obj.termType = data.termType || 0
          }
          if (['299', '300', '10008'].includes(type)) {
            obj.sendClinic = obj.sendClinic ? obj.sendClinic.id : ''
          }
          obj.useFreq = data.useFreq
          obj.useFreqTxt = this.storage.getSysTypeText('CV06.00.228', obj.useFreq)
          obj.price = data.serviceItem.price * data.count
          let disposeContent = []
          if (data.useFreq) disposeContent.push(this.storage.getSysTypeText('CV06.00.228', obj.useFreq))
          if (data.count) disposeContent.push((['299', '300'].includes(data.serviceItem.serviceClassification) && this.visitType === 3 ? '每次' : '') + data.count + (!isNull(obj.countUnit) ? obj.countUnit : '次'))
          // 去除list中空值
          disposeContent = disposeContent.filter(v => {
            return v
          })
          obj.disposeContent = disposeContent.join(' , ')
        }
        if (type === '799') {
          obj.freeSheet = Number(data.freeSheet)
        }
        obj = Object.assign(data, this.baseInfo, obj)
        // 医嘱项id name提交后面需要统一（跟后端确认）
        if (objKeys.includes('surgeryTime') && data.surgeryTime) {
          obj.surgeryTime = this.$moment(data.surgeryTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (objKeys.includes('startTime') && data.startTime) {
          obj.startTime = this.$moment(data.startTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (objKeys.includes('endTime') && data.endTime) {
          obj.endTime = this.$moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (objKeys.includes('applyDate') && obj.applyDate) {
          obj.applyDate = this.$moment(data.applyDate).format('YYYY-MM-DD HH:mm:ss')
        }
        if (objKeys.includes('applyForm') && obj.applyForm && obj.applyForm.id) {
          obj.bloodFormId = obj.applyForm.id
          obj.bloodFormCode = obj.applyForm.phrFormCode
        }
        if (objKeys.includes('ifCollectSpecimens') && !isNull(obj.ifCollectSpecimens)) {
          obj.ifCollectSpecimens = Number(obj.ifCollectSpecimens)
        }
        if (objKeys.includes('ifMatchingBlood') && !isNull(obj.ifMatchingBlood)) {
          obj.ifMatchingBlood = Number(obj.ifMatchingBlood)
        }
        if (objKeys.includes('freeSheet') && !isNull(obj.freeSheet)) {
          obj.freeSheet = Number(obj.freeSheet)
        }
        if (objKeys.includes('isEmergency') && !isNull(obj.isEmergency)) {
          obj.isEmergency = Number(obj.isEmergency)
        }
        if (objKeys.includes('appointDoctor') && !isNull(obj.appointDoctor)) {
          obj.appointDoctor = Number(obj.appointDoctor)
        }
        if (objKeys.includes('appointAnesthesiologist') && !isNull(obj.appointAnesthesiologist)) {
          obj.appointAnesthesiologist = Number(obj.appointAnesthesiologist)
        }
        if (objKeys.includes('appointDate') && !isNull(obj.appointDate)) {
          obj.appointDate = Number(obj.appointDate)
        }
        let _content = Object.assign({}, obj)
        delete _content.adviceContent
        obj.adviceContent = JSON.stringify(_content)
        if (objKeys.includes('excuteProvider')) {
          obj.excuteProvider = obj.excuteProvider ? obj.excuteProvider.id : ''
        }
        if (objKeys.includes('operatingRoomId')) {
          obj.operatingRoomId = obj.operatingRoomId ? obj.operatingRoomId.id : ''
        }
        if (this.$route.path.split('/')[1] === 'ana') {
          obj.subVisitType = 303
        } else if (this.$route.path.split('/')[1] === 'birth_doctors') {
          obj.subVisitType = 304
        } else {
          if (this.subVisitType) {
            obj.subVisitType = this.subVisitType
          }
        }
        if (obj.serviceItem) {
          obj.serviceItem.localObject && delete obj.serviceItem.localObject
        }
        obj.serviceItem = JSON.stringify(obj.serviceItem)
        if (type === '801') {
          obj.specimenTypeName = this.storage.getSysTypeText('THC_SOB_SPECIMEN_TYPE', obj.specimenType)
        }
        // 兼容格式不对的数据
        if (Array.isArray(obj.useFreq)) {
          delete obj.useFreq
          delete obj.useFreqTxt
          let contnet = JSON.parse(obj.adviceContent)
          delete contnet.useFreq
          delete contnet.useFreqTxt
          obj.adviceContent = JSON.stringify(contnet)
        }
        if (this.visitType === 1 && !this.isAddTpl) {
          // 处方确认添加后，调接口获取附加的service信息，并拼接在数据结构中
          medicalapi.handleServiceAddItems([obj]).then(res => {
            if (res && res.head && res.head.errCode === 0) {
              obj.additionalItem = res.data.addServItems
              obj.mergeDetail = res.data.mergeDetail
              this.waitSendData.push(obj)
            } else {
              this.waitSendData.push(obj)
            }
          }).catch(() => {
            this.waitSendData.push(obj)
          })
        } else {
          this.waitSendData.push(obj)
        }
      }
      this.service = ''
    },
    /**
     * #####################################  监听开医嘱处理（遇到有些值修改不了或者自动计算盒数先看这块） #####################################
     */
    measureChange (val, index) {
      this.orderData[index].measure = val !== '' ? Number(val) : ''
      this.$set(this.orderData, index, this.orderData[index])
    },
    watchHandle (item, index) {
      // 监听关键值发生变化时进行数量自动计算
      let computeKeys = ['totalUseDay', 'useFreq', 'measure', 'discountUnit', 'count']
      let diffKeys = this.watchArray(this.oldOrderData, item, { itemId: item.itemId })
      let computeSameKeys = objIntersection(computeKeys, diffKeys)
      let entrustKeys = ['entrust']
      let entrustSameKeys = objIntersection(entrustKeys, diffKeys)
      let sourceKeys = ['source']
      let sourceSameKeys = objIntersection(sourceKeys, diffKeys)
      let clinicKeys = ['sendClinic']
      let clinicSameKeys = objIntersection(clinicKeys, diffKeys)
      // 父子医嘱 子医嘱部分字段取父医嘱的值 无法修改
      let firstKeys = ['useFreq', 'excuteProvider', 'totalUseDay', 'excuteNumber', 'employ', 'startTime', 'source']
      if (this.visitType === 3) {
        firstKeys = ['useFreq', 'termType', 'source', 'excuteProvider', 'excuteNumber', 'employ', 'startTime', 'surgeryLevel', 'doctorItem']
      }
      let firstSameKeys = objIntersection(firstKeys, diffKeys)
      if (!this.backData || !this.backData.length) {
        let useFreq = Array.isArray(item.useFreq) ? item.useFreq[0] : item.useFreq
        let day = this.visitType === 3 ? (item.totalUseDay || 1) : item.totalUseDay
        let freqval = this.storage.getSysTypeText('CV06.00.228', useFreq, 'value')
        let freq = (item.useFreq && freqval) ? Number(freqval) : null
        // 住院工作站，领量不与用药频次关联
        if (this.visitType === 3) {
          freq = 1
        }
        let discountUnit = item.discountUnit
        let packageToPrepareRatio = item.packageToPrepareRatio
        let measure = item.measure
        let count = item.count
        // 根据天数计算盒数
        // 门诊数量可编辑修改，父子医嘱数量修改不需要重新计算；住院数量不可修改，父子医嘱初始化数据时需要计算数量
        if (!!measure && !!discountUnit && !!day && !!freq && (!entrustSameKeys.length && !!computeSameKeys.length || entrustSameKeys.length) && !sourceSameKeys.length && (!!computeSameKeys.length && !computeSameKeys.includes('count') || this.visitType === 3 && !computeSameKeys.length)) {
          let countNum
          if (discountUnit && packageToPrepareRatio) {
            if (this.service.ifReused === '1' || this.service.ifReused === 1) { // 可重复使用
              countNum = ((measure / discountUnit) * freq * day) / packageToPrepareRatio
            } else {  // 不可重复使用
              countNum = (Math.ceil(measure / discountUnit) * freq * day) / packageToPrepareRatio
            }
          } else {
            countNum = NaN
          }
          item.count = !isNaN(countNum) ? (Math.ceil(countNum.toFixed(2)) || 1) : ''
        }
        // 医保根据盒数计算天数
        if (this.extendFormSchema[index] && this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'totalUseDay') && !this.$ever.getFieldFromSchema(this.extendFormSchema[index], 'totalUseDay').props.disabled && item.insuranceIdentification === '1') {
          if (!!measure && !!discountUnit && !!count && !computeSameKeys.includes('totalUseDay')) {
            let totalUseDayNum = count / ((measure * freq) / discountUnit)
            item.totalUseDay = !isNaN(totalUseDayNum) ? (Math.floor(totalUseDayNum) || 1) : ''
          }
        }
      }
      // 渠道变化 source= 1-本院 | 2-自备
      if (sourceSameKeys && !!sourceSameKeys.length) {
        if (['301', '302'].includes(item.drugType) && this.visitType === 3) {
          this.setCountSchema(item, index)
        }
        if (item.source === '4') {
          item.isEntrust = 1
          if (!item.count) item.count = 0
        } else {
          item.isEntrust = 0
        }
        // 渠道选择[自备],库房清空并不可选
        let sendClinic = item.sendClinic
        let sendClinicRules = this.extendForm.rules.sendClinic
        if (item.source === '2' && (this.visitType === 1 || !this.selfDrugStatus)) {
          if (Object.keys(sendClinic).length) {
            this.oldSendClinic = sendClinic
          }
          item.sendClinic = ''
          item.storageRoomId = ''
          item.storageRoomName = ''
          if (this.visitType === 1) {
            item.excuteProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
            item.excuteNumber = ''
            item.sendClinic = {}
          }
          if (index === 0) {
            let sendClinicSchema = objFind(this.extendFormSchema[index], { name: 'sendClinic' })
            sendClinicSchema.props.disabled = true
            if (this.visitType === 1) {
              let excuteProviderSchema = objFind(this.extendFormSchema[index], { name: 'excuteProvider' })
              excuteProviderSchema.props.disabled = true
              let excuteNumberSchema = objFind(this.extendFormSchema[index], { name: 'excuteNumber' })
              excuteNumberSchema.props.disabled = true
            }
          }
          sendClinicRules.forEach(rule => {
            rule.required = false
          })
        } else {
          if (!Object.keys(sendClinic).length) {
            item.sendClinic = this.oldSendClinic || {}
          }
          sendClinicRules.forEach(rule => {
            rule.required = true
          })
          item.allotNum = 0
          this.getServiceStock(item.serviceItem, index)
          if (index === 0 && this.visitType === 1 || !this.selfDrugStatus) {
            let sendClinicSchema = objFind(this.extendFormSchema[index], { name: 'sendClinic' })
            sendClinicSchema.props.disabled = false
            if (this.visitType === 1) {
              let excuteProviderSchema = objFind(this.extendFormSchema[index], { name: 'excuteProvider' })
              excuteProviderSchema.props.disabled = true
              let excuteNumberSchema = objFind(this.extendFormSchema[index], { name: 'excuteNumber' })
              excuteNumberSchema.props.disabled = true
            }
          }
        }
      }
      // 发货机构变化
      if (clinicSameKeys && !!clinicSameKeys.length && !this.backData && item.sendClinic) {
        if (index === 0) {
          this.orderData.map((m, n) => {
            if (n !== index) {
              this.getServiceStock(m.serviceItem, n, (service, sendClinic) => {
                if (sendClinic && sendClinic.length) {
                  let sclinic = objFind(sendClinic, { id: item.sendClinic.id })
                  if (sclinic) {
                    m.sendClinic = item.sendClinic
                  } else {
                    m.checkStockInfo = true
                    m.sendClinic = ''
                    m.storageRoomId = ''
                    m.storageRoomName = ''
                  }
                } else {
                  m.checkStockInfo = true
                  m.sendClinic = ''
                  m.storageRoomId = ''
                  m.storageRoomName = ''
                }
              })
            } else {
              this.setServiceInfo(item.sendClinic, item.serviceItem, index)
            }
            return m
          })
        }
      }
      if (firstSameKeys && !!firstSameKeys.length && index === 0) {
        firstSameKeys.forEach(sitem => {
          this.orderData.map(mitem => {
            mitem[sitem] = item[sitem]
            return mitem
          })
        })
      }
      if (this.$refs.serviceIssued && this.$refs.serviceIssued[index] && this.$refs.serviceIssued[index].$refs && item.isGetStock) {
        this.$refs.serviceIssued[index].$refs.form.validate(valid => { })
      }
      // 保存旧值 实现数组内watch
      // this.oldOrderData = JSON.parse(JSON.stringify(this.orderData))
      return item
    },
    setCountSchema (item, index) {
      let sindex = -1
      let cindex = -1
      this.extendFormSchema[index].forEach((m, n) => {
        if (m.name === 'source') {
          sindex = n
        }
        if (m.name === 'count') {
          cindex = n
        }
      })
      if (item.source === '3') {
        if (cindex < 0) {
          let obj = {
            comp: 'sys-text',
            label: '领量',
            name: 'count',
            span: 2,
            props: { type: 'number', max: 999, min: 1, limitInteger: true, disabled: false, append: item.countUnit || '', filed: { max: 999, min: 1, limitInteger: true } }
          }
          this.extendFormSchema[index].splice(sindex + 1, 0, obj)
        }
      } else {
        if (cindex > 0) {
          this.extendFormSchema[index].splice(cindex, 1)
        }
      }
    },
    setSchema (require, name, isMust, item, index) {
      if (item[require]) {
        this.extendForm.rules[name] = [{
          message: '必填项',
          required: isMust,
          trigger: ['blur', 'change']
        }]
      } else {
        this.extendForm.rules[name] = [{
          message: '必填项',
          required: !isMust,
          trigger: ['blur', 'change']
        }]
      }
    },
    watchHandleTypes (item, index) {
      let diffKeys = this.watchArray(this.oldOrderData, item, { itemId: item.itemId })
      let computeKeys = ['totalUseDay', 'useFreq']
      let computeSameKeys = objIntersection(computeKeys, diffKeys)
      let termTypeKeys = ['termType']
      let termTypeSameKeys = objIntersection(termTypeKeys, diffKeys)
      let supplyKeys = ['supply']
      let supplySameKeys = objIntersection(supplyKeys, diffKeys)
      let freeSheetKeys = ['freeSheet']
      let freeSheetSameKeys = objIntersection(freeSheetKeys, diffKeys)
      let ifMatchKeys = ['ifMatchingBlood']
      let ifMatchSameKeys = objIntersection(ifMatchKeys, diffKeys)
      let surgeryLevelKeys = ['surgeryLevel']
      let surgeryLevelSameKeys = objIntersection(surgeryLevelKeys, diffKeys)
      if (computeSameKeys && computeSameKeys.length && ['802'].includes(item.serviceItem.serviceClassification) && this.visitType === 1) {
        let useFreq = Array.isArray(item.useFreq) ? item.useFreq[0] : item.useFreq
        let day = item.totalUseDay || 0
        let freqval = Number(this.storage.getSysTypeText('CV06.00.228', useFreq, 'value') || 0)
        if (!!day && !!freqval) {
          item.count = day * freqval
        }
      }
      // 选择临时医嘱，频次默认立即
      if (termTypeSameKeys && termTypeSameKeys.length && this.visitType === 3) {
        if (String(item.termType) === '0') {
          item.useFreq = ['1571']
        }
      }
      if (supplySameKeys && supplySameKeys.length) {
        item.supply = item.supply === 1
      }
      if (freeSheetSameKeys && freeSheetSameKeys.length || item.freeSheet) {
        this.extendFormSchema[index].forEach(val => {
          if (val.name === 'freeReason') {
            val.props.field.disabled = !item.freeSheet
            val.props.disabled = !item.freeSheet
          }
        })
        this.setSchema('freeSheet', 'freeReason', true, item, index)
      }
      if (ifMatchSameKeys && ifMatchSameKeys.length || item.ifMatchingBlood) {
        this.extendFormSchema[index].forEach(val => {
          if (val.name === 'matchingBloodNum') {
            val.props.field.disabled = !item.ifMatchingBlood
            val.props.disabled = !item.ifMatchingBlood
          }
        })
        this.setSchema('ifMatchingBlood', 'matchingBloodNum', true, item, index)
      }
      // 手术等级变化
      if (surgeryLevelKeys && !!surgeryLevelSameKeys.length) {
        getSurgeryDoctor(item.surgeryLevel).then(res => {
          if (item.doctorItem && item.doctorItem.id && !objFind(res, { id: item.doctorItem.id })) {
            item.doctorItem = ''
          }
          let doctorItemSchema = this.$ever.getFieldFromSchema(this.extendFormSchema[index || 0], 'doctorItem')
          doctorItemSchema.props.options = res
          this.$set(this.orderData, index, item)
        })
      }
      if (this.$refs.serviceIssued && this.$refs.serviceIssued[index] && (item.excuteProvider && !item.excuteProvider.id && item.isGetStock)) {
        this.$refs.serviceIssued[index].$refs.form.validate(valid => { })
      }
      return item
    },
    watchArray (arr, item, obj) {
      let diffKeys = []
      if (arr && arr.length) {
        let data = objFind(arr, obj)
        try {
          for (let sitem in item) {
            let isEqual = false
            if (data) {
              if (!isNull(data[sitem])) {
                if (data[sitem] === item[sitem] || objIsEqual(data[sitem], item[sitem])) {
                  isEqual = true
                }
                if (data[sitem] instanceof Array && item[sitem] instanceof Array && objIsEqual(data[sitem], item[sitem])) {
                  isEqual = true
                }
                if (data[sitem] instanceof Object && item[sitem] instanceof Object && data[sitem].id && item[sitem].id && data[sitem].id === item[sitem].id) {
                  isEqual = true
                }
              } else {
                if (isNull(item[sitem])) {
                  isEqual = true
                }
              }
            } else {
              isEqual = true
            }
            if (!isEqual) {
              diffKeys.push(sitem)
            }
          }
        } catch (e) {
          console.log('----e----', e)
        }
      }
      return diffKeys
    },
    /**
     * #####################################  父组件传值处理  #####################################
     */
    async setCallbackData () {
      let _this = this
      let data = this.backData
      if (!data || !data[0]) {
        return false
      }
      // 重置orderData 重新渲染form 解决西药值集无法选择
      this.orderData = []
      let i = 0
      let lyout = async (i) => {
        // data.map(async (item, i) => {
        // 设置如果编辑状态，有执行科室，取消默认选中第一个
        if (data[i].excuteProvider || (data[i].excuteProvider && data[i].excuteProvider.id)) {
          let schema = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
          schema.map(val => {
            if (val.name === 'excuteProvider') {
              val.props.field.firstSelect = false
            }
            return val
          })
          this.$set(this.extendFormSchema, 0, schema)
        }
        let oldItem = JSON.parse(JSON.stringify(data[i]))
        // 确保scheme每一个对象有值
        oldItem = Object.assign(this.extendForm.obj, oldItem)
        if (oldItem.id) delete oldItem.id
        if (oldItem.recipeId) delete oldItem.recipeId
        if (oldItem.createTime) delete oldItem.createTime
        if (oldItem.updateTime) delete oldItem.updateTime
        let _serviceItem = oldItem.serviceItem && typeof oldItem.serviceItem === 'string' ? JSON.parse(oldItem.serviceItem, true) : oldItem.serviceItem
        if (_serviceItem) {
          delete _serviceItem.echo
        }
        let _content = isJsonString(oldItem.adviceContent) ? JSON.parse(oldItem.adviceContent, true) : ''
        // 中药数据结构跟其他类型不一样  需要特殊处理
        if (['303', '304'].includes(_serviceItem.serviceClassification)) {
          let _isEntrust = storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', oldItem.source, 'value')
          let nobj = {
            decoct: oldItem.decoct ? !!oldItem.decoct : false,
            isEntrust: _isEntrust === '4' ? 1 : 0
          }
          if (this.visitType === 3 && oldItem.useFreq) {
            oldItem.useFreq = [oldItem.useFreq]
            if (_content && _content.frequencyTime) oldItem.useFreq.push(_content.frequencyTime)
          }
          if (_content && _content.frequencyTime) nobj.frequencyTime = _content.frequencyTime
          nobj = Object.assign({}, oldItem, nobj)
          this.orderComData = nobj
          this.orderData = JSON.parse(oldItem.adviceContent, true).map(sitem => {
            delete sitem.serviceItem.echo
            return sitem
          })
          this.orderData.map((data, j) => {
            data.amount = data.amount ? parseFloat(data.amount) : ''
            data.decoct = data.decoct ? !!data.decoct : false
            // this.getServiceStock(data.serviceItem, j, this.batchCheckShareInfo)
            return data
          })
          // 延时调用，保证上一个schema渲染完成
          let i = 0
          var lyout = () => {
            _this.getServiceStock(_this.orderData[i].serviceItem, i, _this.batchCheckShareInfo)
          }
          let schemaTimer = setInterval(() => {
            if (i < _this.orderData.length) {
              lyout()
              i++
            } else {
              window.clearInterval(schemaTimer)
            }
          }, 300)
        } else {
          let nobj = {}
          nobj = _content ? Object.assign({}, oldItem, _content) : Object.assign({}, oldItem)
          nobj.serviceItem = _serviceItem
          nobj.itemId = oldItem.itemId || (randomString(32, 62) + i)
          nobj.groupId = oldItem.adviceId || (randomString(16, 32) + new Date().getTime())
          // nobj.groupId = oldItem.adviceId || GENERATE_UUID()
          // nobj.termType = !isNull(oldItem.termType) ? String(oldItem.termType) : '0'
          nobj.insuranceIdentification = !isNull(oldItem.insuranceIdentification) ? String(oldItem.insuranceIdentification) : '0'
          nobj.sendClinic = oldItem.sendClinic || oldItem.storageRoomId
          if (this.visitType === 3) {
            nobj.termType = !isNull(oldItem.termType) ? String(oldItem.termType) : '0'
          }
          if (this.visitType === 3 && oldItem.useFreq) {
            nobj.useFreq = [oldItem.useFreq]
            if (_content && _content.frequencyTime) nobj.useFreq.push(_content.frequencyTime)
          }
          if (oldItem.employ) {
            nobj.employ = [oldItem.employ]
            if (_content && _content.dropSpeed) nobj.employ.push(_content.dropSpeed)
          }
          if (nobj.surgeryTime) {
            nobj.surgeryTime = this.$moment(nobj.surgeryTime).format('YYYY-MM-DD HH:mm')
          }
          if (nobj.startTime) {
            nobj.startTime = this.$moment(nobj.startTime).format('YYYY-MM-DD HH:mm')
          }
          if (nobj.endTime) {
            nobj.endTime = this.$moment(nobj.endTime).format('YYYY-MM-DD HH:mm')
          }
          if (nobj.applyDate) {
            nobj.applyDate = this.$moment(nobj.applyDate).format('YYYY-MM-DD HH:mm')
          }
          if (Number(nobj.isEmergency) === 1) {
            nobj.isEmergency = !!nobj.isEmergency
          }
          if (nobj.ifCollectSpecimens === 1) {
            nobj.ifCollectSpecimens = !!nobj.ifCollectSpecimens
          }
          if (nobj.ifMatchingBlood === 1) {
            nobj.ifMatchingBlood = !!nobj.ifMatchingBlood
          }
          if (nobj.freeSheet === 1) {
            nobj.freeSheet = !!nobj.freeSheet
          }
          if (nobj.appointDoctor === 1) {
            nobj.appointDoctor = !!nobj.appointDoctor
          }
          if (nobj.appointAnesthesiologist === 1) {
            nobj.appointAnesthesiologist = !!nobj.appointAnesthesiologist
          }
          if (nobj.appointDate === 1) {
            nobj.appointDate = !!nobj.appointDate
          }
          if (nobj.bloodFormId) {
            nobj.applyForm = {
              id: nobj.bloodFormId
            }
          }
          // 修改编辑后，主刀医生回显问题
          if (nobj.surgeryLevel) {
            getSurgeryDoctor(nobj.surgeryLevel).then(res => {
              if (!objFind(res, { id: nobj.doctorItem.id })) {
                nobj.doctorItem = ''
              }
              let doctorItemSchema = this.$ever.getFieldFromSchema(this.extendFormSchema[0], 'doctorItem')
              doctorItemSchema.props.options = res
            })
          }
          if (['301', '302'].includes(_serviceItem.serviceClassification)) {
            nobj.isMain = i === 0 ? 1 : 2
            this.orderData.push(JSON.parse(JSON.stringify(nobj)))
            await this.getServiceStock(_serviceItem, i, service => {
              if (_this.orderData[i]) {
                _this.orderData[i].employ = nobj.employ
                _this.orderData[i].useFreq = nobj.useFreq
                _this.orderData[i].measure = oldItem.measure
                _this.orderData[i].insuranceIdentification = !isNull(oldItem.insuranceIdentification) ? String(oldItem.insuranceIdentification) : '0'
                if (nobj.excuteProvider) _this.orderData[i].excuteProvider = nobj.excuteProvider
                _this.$set(_this.orderData, i, _this.orderData[i])
              }
              _this.batchCheckShareInfo(service)
            })
          } else {
            nobj.isMain = 0
            nobj.countUnitId = oldItem.countUnitId || _serviceItem.unit
            nobj.countUnit = oldItem.countUnit || _serviceItem.unitName
            this.orderData.push(nobj)
            await this.getServiceStock(_serviceItem, 0, service => {
              if (objFind(this.extendFormSchema[i], { name: 'count' })) {
                this.$ever.getFieldFromSchema(this.extendFormSchema[i], 'count').props.append = nobj.countUnit
              }
              if (this.visitType === 3) {
                _this.orderData[0].termType = String(oldItem.termType)
              }
              _this.orderData[0].insuranceIdentification = !isNull(oldItem.insuranceIdentification) ? String(oldItem.insuranceIdentification) : '0'
              _this.$set(_this.orderData, 0, _this.orderData[0])
              // this.$nextTick(_ => {
              //   if (nobj.useFreq) {
              //     _this.orderData[0].useFreq = nobj.useFreq
              //   }
              // })
              if (service) _this.batchCheckShareInfo(service)
            })
          }
        }
      }
      setTimeout(() => {
        let time = 0
        if (['301', '302'].includes(data[0].adviceType) && data.length > 1) {
          time = 100
        }
        let t1 = setInterval(() => {
          if (!i) {
            lyout(i++)
          } else {
            window.clearInterval(t1)
            let t2 = setInterval(() => {
              if (i < data.length) {
                lyout(i++)
              } else {
                window.clearInterval(t2)
              }
            }, 100)
          }
        }, time)
      }, 100)
      setTimeout(_ => {
        this.backData = ''
      }, 2000)
    },
    selectChange (val) {
      this.inputQuery = val
    },
    async handleAdvice () {
      let params = {
        code: 'custom_advice',
        scene: this.visitType
      }
      let res = await medicalapi.getServiceByCode(params)
      res.data.byname = this.inputQuery
      this.service = res.data
    },
    async getXianBingShi () {
      if (!this.$route.query.visitSn) {
        return ''
      }
      let params = {
        visitId: this.$route.query.visitSn,
        metaNames: ['DL_XIAN_BING_SHI']
      }
      try {
        let res = await formphrapi.getByVisitIdAndMetaName(params)
        if (res) {
          return res.DL_XIAN_BING_SHI || ''
        } else {
          return ''
        }
      } catch (err) {
        return ''
      }
    },
    // 判断是医生是否具有药物处方权
    async isLimit () {
      let limit = await getDoctorLimit(this.$store.state.currentUser.userId)
      this.doctorLimit = limit
      if (!limit) {
        return true
      }
      let idsArr = []
      this.orderData && this.orderData.forEach(item => {
        if (item.serviceItem.localMaterialId) {
          idsArr.push(item.serviceItem.localMaterialId)
        }
      })
      let ids = idsArr.join(',')
      let medicineLimit = await getMedicineLimit(ids)
      return diffLimit(this.doctorLimit, medicineLimit)
    },
    getSelfDrugStatus () {
      let params = {
        type: 'selfProvidedDrug',
        scene: '3',
        controlPoint: 'createUddDispense'
      }
      billingapi.getSobConfigDetail(params).then(rs => {
        if (rs) {
          this.selfDrugStatus = rs.data.value === '1'
        }
      })
    }
  },
  watch: {
    'initData': {
      handler (val) {
        this.waitSendData = val
      },
      deep: true
    },
    'orderData': {
      handler (val) {
        if (!val || !val.length) {
          this.oldOrderData = []
          this.schemaId = ''
          return false
        }
        if (Number(val.isEmergency) === 1) {
          this.orderComData.urgent = true
          this.orderComData.urgentFee = val.urgentFee
        }
        val.map((item, index) => {
          let data = this.watchHandleTypes(item, index)
          item = Object.assign(item, data)
          return item
        })
        // 西药渠道处理（备注：新增了耗材和商品，解决商品和耗材库房无法监听到变化的问题）
        if (['301', '302', '10008', '300'].includes(this.service.serviceClassification) && val.length && (!this.backData || !this.backData.length)) {
          val.map((item, index) => {
            let data = this.watchHandle(item, index)
            item = Object.assign(item, data)
            return item
          })
          // 保存旧值 实现数组内watch
          // this.oldOrderData = JSON.parse(JSON.stringify(this.orderData))
        }
        // 保存旧值 实现数组内watch
        this.oldOrderData = JSON.parse(JSON.stringify(this.orderData))
      },
      deep: true
    },
    // 发送医嘱区域总service监听，通过service的不同类型显示不同的表单
    'service': {
      async handler (val) {
        if (!val) {
          this.extendForm = { schema: [], obj: {}, rules: {} }
          this.extendCommonForm = { schema: [], obj: {}, rules: {} }
          this.extendFormSchema = []
          this.orderData = []
          this.showAlert = false
          return false
        }
        if (this.visitType === 3) {
          this.getSelfDrugStatus()
        }
        delete val.echo
        await this.getServiceItems(val, 0)
        if (this.backData && this.backData.length && this.backData.length > 1) {
          for (let i = 0; i < (this.backData.length - 1); i++) {
            if (i > 0) {
              this.extendFormSchema[i] = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
            }
          }
        }
        // 中药公共项
        this.orderComData = JSON.parse(JSON.stringify(this.extendCommonForm.obj))
        let initObj = JSON.parse(JSON.stringify(this.extendForm.obj))
        initObj.serviceItem = val
        initObj.pirce = val.price || 0
        initObj.itemId = randomString(32, 62)
        initObj.doctorAdviceType = val.isSet ? '2' : '1'
        initObj.checkBaseInfo = false
        initObj.checkPriceInfo = false
        initObj.checkStockInfo = false
        this.orderComData.doctorAdviceType = val.isSet ? '2' : '1'
        this.formRowFlex = true
        this.formAuto = false
        let objKeys = Object.keys(this.extendForm.obj)
        if (!this.backData || !this.backData.length) {
          if (['2125'].includes(val.serviceClassification) && objKeys.includes('surgeryTime')) {
            initObj.surgeryTime = this.$moment().format('YYYY-MM-DD HH:mm')
          }
          if (objKeys.includes('applyDate')) {
            initObj.applyDate = this.$moment().format('YYYY-MM-DD HH:mm')
          }
          if (objKeys.includes('source')) {
            initObj.source = '1'
          }
          if (objKeys.includes('entrust')) {
            initObj.entrust = val.entrust
          }
        }
        if (['301', '302', '300', '10008'].includes(val.serviceClassification)) {
          // 西药
          this.formAuto = true
          initObj.isMain = 1
          initObj.allotNum = 0
          initObj.isGetStock = false
          if (!this.backData || !this.backData.length) {
            initObj.isEntrust = 0
            if (this.visitType === 3) {
              initObj.termType = '1'
            }
            initObj.groupId = randomString(16, 32) + new Date().getTime()
            // initObj.groupId = GENERATE_UUID()
          } else {
            if (this.visitType === 3) {
              initObj.termType = !isNull(this.backData[0].termType) ? String(this.backData[0].termType) : ''
            }
          }
          this.initServiceData = JSON.parse(JSON.stringify(initObj))
          this.$set(this.orderData, 0, initObj)
          let schema = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
          schema.map(item => {
            if (item.name === 'excuteProvider') {
              if (!this.isPathway) {
                item.props.field.firstSelect = false
              } else {
                item.props.field.firstSelect = true
              }
            }
            return item
          })
          this.$set(this.extendFormSchema, 0, schema)
          if (!this.backData || !this.backData.length) this.getServiceStock(val, 0, this.batchCheckShareInfo)
        } else if (['303', '304'].includes(val.serviceClassification)) {
          // 中药
          initObj.allotNum = 0
          initObj.isGetStock = false
          initObj.drugRatio = ''
          // 中药默认为临时医嘱
          if (this.visitType === 3) {
            initObj.termType = 0
          }
          this.initServiceData = JSON.parse(JSON.stringify(initObj))
          this.$set(this.orderData, 0, initObj)
          this.orderComData.decoctPrice = 0
          this.orderComData.count = 1
          if (!this.backData || !this.backData.length) this.getServiceStock(val, 0, this.batchCheckShareInfo)
          let schema = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
          schema.map(item => {
            if (item.name === 'excuteProvider') {
              item.props.field.firstSelect = false
            }
            return item
          })
          this.$set(this.extendFormSchema, 0, schema)
        } else {
          // 手术 检查 检验 治疗 耗材 其他等
          initObj.count = 1
          initObj.countUnitId = val.unit
          initObj.countUnit = val.unitName
          if (this.visitType === 3) {
            initObj.termType = 0
          }
          let schema = JSON.parse(JSON.stringify(this.extendFormSchema[0]))
          schema.map(item => {
            if (item.name === 'termType') {
              item.props.field.firstSelect = false
              item.props.firstSelect = false
            }
            if (item.name === 'count') {
              item.props.append = initObj.countUnit
            }
            return item
          })
          this.$set(this.extendFormSchema, 0, schema)
          if (val.hasExecuteProvider && !initObj.excuteProvider) {
            // 配置的科室
            schema.map(item => {
              if (item.name === 'excuteProvider') {
                item.props.field.firstSelect = true
              }
              return item
            })
            this.$set(this.extendFormSchema, 0, schema)
          } else if (!val.hasExecuteProvider && !initObj.excuteProvider) {
            // 当前科室
            if (this.baseInfo && this.baseInfo.providerId) {
              initObj.excuteProvider = { id: (this.baseInfo && this.baseInfo.providerId) ? this.baseInfo.providerId : '', name: this.curProviderName }
            } else {
              schema.map(item => {
                if (item.name === 'excuteProvider') {
                  item.props.field.firstSelect = true
                }
                return item
              })
            }
          }
          this.formRowFlex = false
          // 护理、床位、餐费默认长期医嘱
          if (this.visitType === 3) {
            if (['2126', '2466', '10005'].includes(val.serviceClassification)) {
              initObj.termType = '1'
              initObj.useFreq = ''
            } else if (['867', '802', '10003', '10002', '2124', '10008'].includes(val.serviceClassification) || ['800001'].includes(val.threeServiceClassify)) {
              initObj.termType = '0'
              initObj.useFreq = ['1571']
            }
          }
          if (!['800', '2125'].includes(val.serviceClassification)) {
            initObj.isEntrust = ''
            initObj.allotNum = 0
            if (['10004'].includes(val.serviceClassification) && this.visitType === 3) {
              initObj.termType = '0'
              initObj.useFreq = ['1571']
            }
            this.$set(this.orderData, 0, initObj)
            if (['299', '300'].includes(val.serviceClassification)) {
              if (!this.backData || !this.backData.length) this.getServiceStock(val, 0)
            }
            if (val.serviceClassification === '802') {
              // if (!this.backData || !this.backData.length) {
              //   initObj.termType = '1'
              // } else {
              //   initObj.termType = !isNull(this.backData[0].termType) ? String(this.backData[0].termType) : '1'
              // }
              // if (this.$ever.getFieldFromSchema(this.extendFormSchema[0], 'count')) {
              //   this.$ever.getFieldFromSchema(this.extendFormSchema[0], 'count').props.append = initObj.countUnit
              // }
            }
          } else {
            if (['2125'].includes(val.serviceClassification)) {
              delete initObj.excuteProvider
            }
            if (['800'].includes(val.serviceClassification)) {
              initObj.clinicalExamine = '协助诊断'
              initObj.illHis = await this.getXianBingShi()
            }
            this.$set(this.orderData, 0, initObj)
          }
          if (!this.backData || !this.backData.length) this.getServiceStock(val, 0, this.batchCheckShareInfo)
        }
        this.setFormSchema()
        this.setCallbackData()
        // 聚焦第一个空值的必填项
        this.$nextTick(_ => {
          window.setTimeout(_ => {
            let n = -1
            this.extendFormSchema[0].forEach((item, index) => {
              let flag = false
              if (this.orderData[0] && Array.isArray(this.orderData[0][item.name])) {
                if (!this.orderData[0][item.name].length) {
                  flag = true
                }
              }
              if (!this.orderData[0][item.name]) {
                flag = true
              }
              if (this.extendForm.rules[item.name] && this.extendForm.rules[item.name][0] && this.extendForm.rules[item.name][0].required && flag && n < 0) {
                n = index
              }
            })
            if (n > -1) {
              this.$refs.serviceIssued[0].$refs.form.$el.querySelectorAll('input')[n].focus()
            }
          }, 1200)
        })
        this.$emit('open')
      }
    },
    'callbackData': {
      handler (val) {
        if (!val) return
        this.backData = val
        if (!val || !val[0]) return false
        let _serviceItem = val[0].serviceItem && typeof val[0].serviceItem === 'string' ? JSON.parse(val[0].serviceItem, true) : val[0].serviceItem
        if (_serviceItem) {
          delete _serviceItem.echo
        }
        this.service = _serviceItem
      }
    },
    'orderComData.source' (val) {
      if (val) {
        let value = storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', val, 'value')
        this.orderData.map(item => {
          item.source = value
          return item
        })
        this.orderComData.isEntrust = value === '4' ? 1 : 0
        if (this.orderComData.decoct !== false) {
          this.orderComData.decoct = this.orderData[0].drugType === '303' && !this.orderComData.isEntrust
        }
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
  overflow: auto;
  padding-bottom: 10px;
  .el-form-item__info {
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
        background: #fff;
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
  .issued_com_box {
    background: #f4f4f4;
    padding: 10px 10px 0;
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
.wb96 {
  width: 96%;
}
.line {
  border-bottom: 1px solid #ddd;
}
.h180 {
  height: 194px;
}
</style>
