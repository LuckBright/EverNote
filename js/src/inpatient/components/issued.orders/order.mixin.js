/**
 * 批量编辑和开处方公用方法
 */
import uuid from 'uuid/v1'
import serviceapi from '@/sob/store/serviceeditapi'
import storage from '@/util/storage'
import { objFind, objRemove, formatLang } from '@/util/common'
import { getSurgeryDoctor } from '../doctor.state'
import formphrapi from '@/form/store/phrapi'
import { createSchemaByItems } from '@/util/formcustom'
import api from '@/inpatient/components/issued.orders/api.js'
import { cloneDeep } from 'lodash'
import feeApi from '@/inpatient/components/fee.orders/api'
import decoctApi from '@/sob/store/surcharge'

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
  props: {
    scene: { // 场景
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    userInfo: Object, // 医生基础信息
    disabled: Boolean, // 是否允许开处方
    filterAdviceType: String, // 医嘱类型
    searchType: Number, // 1-医嘱项 2-收费项
    shareInfo: { // 医保信息
      type: Object | String,
      default: () => {}
    },
    isCheckStock: {  // 自备药是否校验库房，false 不校验 true 校验
      type: Boolean,
      default: false
    },
    isSend: {
      type: Boolean,
      default: true
    },
    customItems: { // 自定义表单属性
      type: Array,
      default: () => []
    },
    doctorLimit: Object, // 医生处方权
    selfSchemaValue: Function, // 对开单属性个例操作
    watchCustom: { // 监听开单属性
      type: Object,
      default: () => {
        return {}
      }
    },
    initDataBefor: Function, // 初始化医嘱信息个别处理
    initValueBefor: Function,
    linkages: { // 父子医嘱之间的联动开单属性
      type: Array,
      default: () => ['useFreq', 'executeOrgId', 'executeProvider', 'useDay', 'executeNumber', 'employ', 'startTime', 'source', 'sendClinic']
    },
    executeProviderTypes: { // 执行地科室类型
      type: Array,
      default: () => ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04'] // 默认门急诊+医技
    },
    templateScene: Number, // 开单属性场景
    isLimitValid: { // 是否检验处方权
      type: Boolean,
      default: true
    },
    supportMulti: { // 是否支持父子医嘱
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    // 无库房信息提示
    getSendClinicInfo (index) {
      if (index === 0) {
        return '未获取到库房信息，请联系管理员维护'
      } else {
        let clinic = this.orderData[0].sendClinic
        return clinic && `${clinic.name}没有此药，请联系管理员维护` || '未获取到库房信息，请联系管理员维护'
      }
    },
    // 生成唯一的id，用于判断父子医嘱和中药医嘱
    getMainGroupId () {
      return uuid()
    },
    // 耗材和商品库存单位
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
    // 获取代煎费
    async getDaijian (code) {
      let res = await decoctApi.getDecoctsAndPriceByCode({code})
      let decoctPrice = 0
      if (res.price) {
        decoctPrice = res.price
      }
      return decoctPrice
    },
    // 医嘱单条价格
    getPrice (service) {
      let price = 0
      if (+service.source === 2 || (+this.orderComData.source === 2) || service.freeSheetFlag) {
        price = 0
      } else {
        if (['303', '304'].includes(this.service.serviceClassification)) {
          price = this.orderComData.count * service.measure * service.servicePrice
        } else {
          price = service.count * service.servicePrice
        }
      }
      service.price = price || 0
      return service.price.toFixed(2)
    },
    // 获取开单模版及物资信息
    async getTemplateAndMaterial (service) {
      let params = {
        isSet: service.isSet,
        ids: [service.id],
        scene: this.scene,
        templateScene: this.templateScene || this.scene,
        supplyId: this.baseInfo.areaId || this.baseInfo.providerId,
        providerTypes: this.executeProviderTypes
      }
      let res = await api.getTemplate(params)
      return res
    },
    // 通过service类型获取医嘱项表单scheme
    async getSchemaTemplate (type) {
      const res = await serviceapi.getServiceItems({ serviceClassification: type, scene: this.scene })
      if (res && res.schemaValue) {
        let schemaValue = JSON.parse(res.schemaValue)
        let schema = Object.assign({}, res, {
          schemaValue: JSON.stringify(schemaValue.filter(item => !item.commonField))
        })
        let commonSchema = Object.assign({}, res, {
          schemaValue: JSON.stringify(schemaValue.filter(item => item.commonField))
        })
        return { schema, commonSchema }
      } else {
        return null
      }
    },
    // 监听开单属性，自动计算数量
    watchCount (order) {
      // if (order.measure && order.useFreq && order.useDay && !this.loading) {
      if (order.measure && order.useFreq && !this.loading) {
        let useFreq = Array.isArray(order.useFreq) ? order.useFreq[0] : order.useFreq
        let freqval = getSysTypeByCode('CV06.00.228', useFreq, 'value')
        let discountUnit = order.discountUnit
        let packageToPrepareRatio = order.packageToPrepareRatio
        let measure = order.measure
        let day = order.useDay || 1
        if (!freqval || !discountUnit) {
          return
        }
        if (+this.service.ifReused === 1) { // ifReuse是啥？
          let countNum = ((measure / discountUnit) * (+freqval) * day) / packageToPrepareRatio
          order.count = Math.ceil(countNum)
        } else {
          let countNum = (Math.ceil(measure / discountUnit) * freqval * day) / packageToPrepareRatio
          order.count = Math.ceil(countNum)
        }
      }
    },
    // 监听渠道的变化
    watchSource (order) {
      if (!order.serviceItem) {
        return
      }
      let sendClinicSchema = objFind(this.extendFormSchema[0], { name: 'sendClinic' })
      if (+order.source === 2 && !this.isCheckStock) {
        order.sendClinic = ''
        order.mainFlag = 0
        if (sendClinicSchema) {
          sendClinicSchema.props.disabled = true
          this.formShowMessage = false
          this.extendForm.rules.sendClinic.forEach(item => {
            item.required = false
          })
        }
      } else {
        order.sendClinic = order.sendClinic || order.sendClinicList[0] || ''
        order.mainFlag = order.sendClinic.mainFlag
        if (sendClinicSchema) {
          sendClinicSchema.props.disabled = sendClinicSchema.props.disabled && false
          this.extendForm.rules.sendClinic.forEach(item => {
            item.required = true
          })
        }
      }
    },
    // 监听库房的变化
    watchSendClinic (order) {
      if (+order.source === 2) {
        this.sendClinicToOrg(order, true)
        return
      }
      if (!order.sendClinic) {
        order.checkStockInfo = true
        this.sendClinicToOrg(order, true)
      } else {
        order.allotNum = order.sendClinic.usableNum
        order.mailFlag = order.sendClinic.mailFlag // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
        order.checkStockInfo = false
        let currentUser = this.$store.state.currentUser
        this.sendClinicToOrg(order, order.sendClinic.sendOrgId === currentUser.organizationId)
      }
    },
    // 监听手术等级
    watchSurgeryLevel (order) {
      getSurgeryDoctor(order.surgeryLevel).then(res => {
        if (order.doctorItem && order.doctorItem.id && !objFind(res, { id: order.doctorItem.id })) {
          order.doctorItem = ''
        }
        let doctorItemSchema = objFind(this.extendFormSchema[0], { name: 'doctorItem' })
        doctorItemSchema.props.options = res
        this.$set(this.extendFormSchema, 0, this.extendFormSchema[0])
      })
    },
    // 监听免单
    watchFreeSheetFlag (order) {
      let freeReasonSchema = objFind(this.extendFormSchema[0], { name: 'freeReason' })
      if (!freeReasonSchema) {
        return
      }
      if (order.freeSheetFlag) {
        delete freeReasonSchema.props.field.disabled
        freeReasonSchema.props.disabled = false
        // this.$set(this.extendFormSchema, 0, this.extendFormSchema[0])
      } else {
        order.freeReason = ''
        freeReasonSchema.props.disabled = true
      }
    },
    // 监听执行科室
    watchExecuteProvider (order) {
      let executeNumberSchema = objFind(this.extendFormSchema[0], { name: 'executeNumber' })
      if (!executeNumberSchema) {
        return
      }
      // 执行科室院外
      if (order.executeProvider && order.executeProvider.id === 'SOB_EXTUDE_PROVIDER_OUT') {
        order.executeNumber = null
        executeNumberSchema.props.disabled = true
      } else {
        executeNumberSchema.props.disabled = false
      }
    },
    // 监听执行科室
    watchExecuteOrgId: function (order) {
      let executeProviderSchema = objFind(this.extendFormSchema[0], {name: 'executeProvider'})
      let hasExecuteProvider = order.serviceItem.hasExecuteProvider
      let executeOrgSchema = objFind(this.extendFormSchema[0], {name: 'executeOrgId'})
      if (!executeOrgSchema) return
      let executeOrg = executeOrgSchema && objFind(executeOrgSchema.props.options, {id: String(order.executeOrgId)})
      if (executeProviderSchema && order.executeOrgId) {
        order.executeOrgName = executeOrg && executeOrg.name
        this.getExecuteProvider(order.serviceItem, order.executeOrgId).then(res => {
          executeProviderSchema.props.options = res || []
          if (!order.executeProvider && hasExecuteProvider && res.length) {
            order.executeProvider = {id: res[0].id, name: res[0].name}
          } else {
            if (!objFind(res, order.executeProvider)) {
              order.executeProvider = ''
            }
          }
        })
      } else {
        executeProviderSchema.props.options = []
        order.executeProvider = ''
        order.executeOrgName = ''
      }
    },
    async watchDecoct (order) {
      let decoctSchema = objFind(this.extendFormSchema[0], {name: 'decoct'})
      if (decoctSchema && order.decoct) {
        this.getDaijian(order.decoct).then(res => {
          order.decoctPrice = res
          this.decoctPrice = res
        })
      }
    },
    // 处理不是本机构库房的跨机构发药
    sendClinicToOrg (order, isSelf) {
      let executeProviderSchema = objFind(this.extendFormSchema[0], { name: 'executeProvider' })
      if (!executeProviderSchema) {
        return
      }
      if (isSelf) {
        executeProviderSchema.props.disabled = false
      } else {
        executeProviderSchema.props.disabled = true
        order.executeProvider = { id: 'SOB_EXTUDE_PROVIDER_OUT', name: '院外' }
      }
    },
    // 删除医嘱项
    delSubService (index) {
      if ((index === 0 && ['301', '302'].includes(this.service.serviceClassification)) || this.orderData.length === 1) {
        // 西药主医嘱删除 清空全部医嘱
        this.service = ''
        this.orderData = []
        this.extendForm = { schema: [], obj: {}, rules: {} }
        this.extendCommonForm = { schema: [], obj: {}, rules: {} }
        this.extendFormSchema = []
        this.$emit('remove')
      } else if ((index === 0 && ['303', '304'].includes(this.service.serviceClassification)) || this.orderData.length === 1) {
        this.orderData.splice(index, 1)
        this.extendFormSchema.splice(index, 1)
        this.shareProperty = this.orderData[0]
        this.orderComData.sendClinic = this.orderData[0].sendClinic
        let sendClinicSchema = objFind(this.extendCommonForm.schema, {name: 'sendClinic'})
        if (sendClinicSchema) {
          this.$set(sendClinicSchema.props, 'options', this.orderData[0].sendClinicList)
          if (this.orderData.length === 1) {
            this.$set(sendClinicSchema.props, 'disabled', false)
          }
        }
      } else {
        this.orderData.splice(index, 1)
        this.extendFormSchema.splice(index, 1)
      }
    },
    // 获取嘱托默认值，后端返回到schema里，不合理
    getDefaultEntrust (service) {
      if (!service.healthServiceTemplate) {
        return ''
      }
      if (!service.healthServiceTemplate.schemaValue) {
        return ''
      }
      let schemaValue = JSON.parse(service.healthServiceTemplate.schemaValue)
      let entrustSchema = objFind(schemaValue, { propertyObject: { code: 'entrust' } })
      if (entrustSchema) {
        return entrustSchema.propertyObject.defValue || ''
      }
      return ''
    },
    // 检查现病史获取
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
    // 数量是否为0
    checkCount (rule, value, callback) {
      if (+value === 0) {
        callback(new Error('不能为0'))
        return false
      }
      callback()
    },
    // 解析开单模版json数据
    async getSchemaValue (service) {
      let schema = service.healthServiceTemplate
      let commonSchema = service.commonTemplate
      if (!schema) {
        let temp = await this.getSchemaTemplate(service.serviceClassification)
        if (!temp) {
          return false
        }
        schema = temp.schema
        commonSchema = temp.commonSchema
        if (!schema) {
          this.$messageTips(this, 'warning', 'service医嘱项为空，请联系技术查看', '提示')
          return false
        }
      }
      if (this.schemaId === schema.id) {
        return this.extendForm
      }
      this.schemaId = schema.id
      let schemaValue = JSON.parse(schema.schemaValue)
      // 对库房进行处理, 不需要库房字段不显示
      if (this.noNeedSendClinic) {
        objRemove(schemaValue, (item) => {
          return item.propertyObject.code === 'sendClinic'
        })
      }
      // 添加模版库房不需要
      if (this.isAddTpl) {
        objRemove(schemaValue, { propertyObject: { code: 'sendClinic' } })
      }
      if (this.isSend) {
        let sendClinicSchema = objFind(schemaValue, { propertyObject: { code: 'sendClinic' } })
        if (sendClinicSchema) {
          sendClinicSchema.isMust = '0'
        }
      }
      let createSchema = createSchemaByItems(schemaValue, { noPlaceholder: true, tplHide: this.isAddTpl })
      // 过滤掉不需要的字段
      createSchema.schema = createSchema.schema.filter(item => {
        if (item.props.type === 'checkbox') {
          item.props['labelNumber'] = true
          item.props.type = 'singleCheckbox'
        }
        return +(item.props.display) !== 0
      })
      createSchema.rules.serviceItem = [
        { required: true, message: '必填项', trigger: 'change' },
        { validator: this.checkEqual, trigger: 'change' }
      ]
      createSchema.rules.measure = [
        { required: true, message: '必填项', trigger: 'change' },
        { validator: this.checkCount, trigger: 'change' }
      ]
      // 增加医嘱名称和金额的属性
      let serviceNameSpan = 5
      switch (service.serviceClassification) {
        case '303': case '304':
          serviceNameSpan = 10
          break
        case '800':
          serviceNameSpan = 6
          break
        case '2125':
          serviceNameSpan = 6
          let doctorItemSchema = objFind(createSchema.schema, { name: 'doctorItem' })
          doctorItemSchema.props.options = this.doctorItemData // 根据手术等级过滤医生
          let assistantItemSchema = objFind(createSchema.schema, { name: 'assistantItem' })
          // 开单属性自定义样式，这么是因为手术助手高度会造成换行
          assistantItemSchema.col = {
            style: 'height: 73px'
          }
          break
        case '301': case '302':
          if (this.scene === 1) {
            serviceNameSpan = 4
          }
          if (this.scene === 3) {
            serviceNameSpan = 7
          }
          break
      }
      let prevItem = [{
        name: 'serviceItem',
        label: `${this.visitText || '医嘱'}名称`,
        comp: 'custom',
        span: serviceNameSpan
      }]
      let nextItems = [{
        name: 'price',
        label: `金额`,
        comp: 'custom',
        span: 1
      }]
      // 添加模版库房非必选
      createSchema.schema = prevItem.concat(createSchema.schema, nextItems)
      if (['303', '304', '3002'].includes(service.serviceClassification)) {
        createSchema.obj.sendClinic = ''
      }
      this.extendForm = createSchema
      // 医嘱扩展项
      if (commonSchema && commonSchema.schemaValue) {
        let commonSchemaValue = JSON.parse(commonSchema.schemaValue)
        let extendCommonForm = createSchemaByItems(commonSchemaValue, { noPlaceholder: true })
        extendCommonForm.schema = extendCommonForm.schema.filter(item => {
          if (item.props.type === 'checkbox') {
            item.props['labelNumber'] = true
            item.props.type = 'singleCheckbox'
          }
          return +(item.props.display) !== 0
        })
        this.extendCommonForm = extendCommonForm
        this.orderComData = this.extendCommonForm.obj
        this.orderComData.entrust = ''
      }
      await this.executeOrgFormat(commonSchema || createSchema.schema, service)
      this.selfSchemaValue && await this.selfSchemaValue(createSchema, service)
      return createSchema
    },
    // 处理跨机构执行的属性
    async executeOrgFormat (schema, service) {
      let executeOrgSchema = objFind(schema, {name: 'executeOrgId'})
      let executeProviderSchema = objFind(schema, {name: 'executeProvider'})
      if (executeOrgSchema) {
        let res = await this.getOrgan(service)
        let apiUrl = executeOrgSchema.props.apiUrl
        executeOrgSchema.props.url = apiUrl
        delete executeOrgSchema.props.apiUrl
        executeOrgSchema.props.options = res || []
      }
      if (executeOrgSchema && executeProviderSchema) {
        let apiUrl = executeProviderSchema.props.apiUrl
        executeProviderSchema.props.url = apiUrl
        delete executeProviderSchema.props.apiUrl
        executeProviderSchema.props.options = []
      }
    },
    // 获取执行机构
    async getOrgan (service) {
      let res = await feeApi.getExecuteOrg({
        id: service.id,
        isSet: service.isSet
      })
      return res.map(item => ({id: String(item.orgId), name: item.orgName}))
    },
    // 获取执行科室
    async getExecuteProvider (service, orgId) {
      let res = await feeApi.getExecuteProviderList({
        serviceId: service.id,
        scene: 1,
        adviceType: +service.isSet === 1 ? 2 : 1,
        providerTypes: this.executeProviderTypes, // 执行科室类型
        relationType: 2, // 1-开单科室 2-执行科室
        orgId // 机构id
      })
      return res.map(item => ({id: item.providerId, name: item.providerName}))
    },
    // 获取协定方存信息
    async getAgreementStock (service) {
      let detail = service.servSetItemList
      if (!detail || !detail.length) {
        return null
      }
      let mainDetail = detail[0]
      let params = {
        checkScene: 1,
        scene: this.scene
      }
      if (this.scene === 3) {
        params.supplyId = this.baseInfo.areaId || storage.getSessionStorage('spaceId')
      } else {
        params.supplyId = this.baseInfo.providerId
      }
      params.materialSkuIds = detail.map(item => item.globalMaterialId)
      let res = await api.queryMultiServiceStock(params).then(rs => {
        if (!rs.length) {
          return false
        }
        let rsObj = {}
        rs.forEach(item => {
          if (rsObj[item.localMaterialId]) {
            rsObj[item.localMaterialId].push(item)
          } else {
            rsObj[item.localMaterialId] = [item]
          }
        })
        return rsObj
      }).catch(() => false)
      if (!res || !res[mainDetail.localMaterialId]) { // 第一味药没有库房信息
        return null
      }
      detail.forEach(item => {
        let localMaterialObject = res[item.localMaterialId][0].localMaterialObject
        item.dosageForm = localMaterialObject.dosageForm // 剂型
        item.dosageFormText = localMaterialObject.dosageFormText // 剂型文本
      })
      let storageRoom = res[mainDetail.localMaterialId][0] // 取第一味药的第一个库房
      let storageRoomId = storageRoom.storageRoomId
      let detailUsableNum = [Math.floor(storageRoom.num / detail[0].quantity)]
      for (let i = 1; i < detail.length; i++) {
        let localMaterialId = detail[i].localMaterialId
        if (!res[localMaterialId] || !objFind(res[localMaterialId], {storageRoomId: storageRoomId})) { // 判断其他药是否有库房以及第一位药的库房
          return null
        }
        let selfRoom = objFind(res[localMaterialId], {storageRoomId: storageRoomId})
        detailUsableNum.push(Math.floor(selfRoom.num / detail[i].quantity))
      }
      let num = Math.min(...detailUsableNum)
      return [{
        localSettingObject: null,
        clinicId: storageRoom.clinicId,
        clinicName: storageRoom.clinicName,
        storageRoomId: storageRoomId,
        storageRoomName: storageRoom.storageRoomName,
        num: num,
        isInvented: storageRoom.isInvented
      }]
    },
    // 有医保逻辑处方
    healthInsurance (data, schema, service) {
      let insuranceSchema = objFind(schema, { name: 'insuranceIdentification' })
      if (this.shareInfo.isBasicMedicalInsurance &&
        (service.chargeLevel === '1' || service.chargeLevel === '2')
      ) {
        if (insuranceSchema) {
          insuranceSchema.props.disabled = false
        }
        data.insuranceIdentification = '1'
        data.chargeLevel = service.chargeLevel
      } else {
        if (insuranceSchema) {
          insuranceSchema.props.disabled = true
          data.insuranceIdentification = '0'
        } else {
          data.insuranceIdentification = null
        }
        data.chargeLevel = service.chargeLevel
      }
    },
    // 初始化一条医嘱，中西药，医用耗材，商品查等实物类走这个方法，其他类型不用此方法初始化
    async initValue (data, schema, service) {
      let serviceClassification = service.serviceClassification
      data.serviceType = serviceClassification // 医嘱类型
      data.serviceId = service.id // 医嘱id
      data.serviceName = service.byname || service.name // 医嘱名称
      data.name = service.name
      data.engName = service.nameEn
      data.threeServiceClassify = service.threeServiceClassify // 物资三级分类
      data.setFlag = service.isSet ? 1 : 0 // 组套
      data.entrust = service.entrust || this.getDefaultEntrust(service) // 嘱托
      data.servicePrice = service.price // 单价
      data.shopSetItemId = data.shopSetItemId || service.shopSetItemId // 套餐标示
      data.diagnosisName = this.diagnosisName // 诊断
      data.type = 1
      data.spec = service.spec
      data.localMaterialId = service.localMaterialId // 物质id
      data.globalMaterialId = service.globalMaterialId // 物资id 获取说明书用这个ID
      data.countUnitId = service.unit  // 数量单位id
      data.countUnitName = service.unitName // 数量名称
      data.doseUnitCode = service.doseUnitCode
      // 医保逻辑
      this.healthInsurance(data, schema, service)

      let measureSchema = objFind(schema, { name: 'measure' })
      let countSchema = objFind(schema, { name: 'count' })
      // let amountSchema = objFind(schema, {name: 'amount'}) // 中药的剂量，是否要于西药统一
      if (measureSchema) {
        measureSchema.props.append = formatLang(service, 'doseUnitName')
        data.measureUnitId = service.doseUnit // 剂量单位id
        data.measureUnitName = service.doseUnitName // 剂量单位名称
        data.measure = service.doseValue || ''
      }
      if (countSchema) {
        countSchema.props.append = formatLang(service, 'unitName')
      }
      // 校验医嘱的价格信息, 非套餐是收费项的条件下无价格信息视为价格信息不完整
      if (
        !this.isAddTpl &&
        // (!service.isSet && service.isAdvice.toString().charAt(1) === '1') &&
        (service.isAdvice.toString().charAt(1) === '1') &&
        (isNaN(service.price) || service.price === null)
      ) {
        data.checkPriceInfo = true
      }
      if (this.checkSendClinic) {
        let list = service.stockObject || []
        let sendClinic = []
        let localObj
        if (list && list.length) {
          localObj = list[0].localMaterialObject || null // 物资信息
          data.drugType = localObj && localObj.classifyId || null // 医保超量校验使用
          data.allotNum = list[0].num || 0 // 库存量
          data.mailFlag = list[0].mailFlag || 0 // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
          list.forEach(item => {
            let dispensingWay = 1
            let iconTxt = ''
            if (this.$store.state.currentUser.organizationId !== item.clinicId) {
              dispensingWay = 2
              iconTxt = '(跨机构)'
            }
            if (item.recipelRoamSupplierCode) {
              item.storageRoomId = item.recipelRoamSupplierCode
              item.storageRoomName = item.recipelRoamSupplierName
              dispensingWay = 3
              iconTxt = '(第三方)'
              if (+item.inventoryStatus) {
                item.num = -2
              } else {
                item.num = -1
              }
            }
            if (item.storageRoomId) {
              sendClinic.push({
                id: item.storageRoomId, // 库房id
                // name: item.clinicName ? `${item.clinicName}-${item.storageRoomName}` : `${item.storageRoomName}`,
                name: item.storageRoomName + iconTxt,
                storageRoomName: item.storageRoomName,
                usableNum: item.num, // 库存量 -1库存不足 -2有库存
                sendOrgId: item.clinicId, // 机构id
                sendOrgName: item.clinicName, // 机构名称
                mailFlag: item.relationType || 0, // 邮寄标记
                localMaterialId: item.localMaterialId, // 机构的物资id
                dispensingWay,
              })
            }
          })
        } else {
          data.mailFlag = 0 // 邮寄状态，0 标示非邮寄，1 标示邮寄; relationType: 0 院内，1 院外；院内取非邮寄，院外取邮寄
          data.drugRatio = 1 // 换算率，中药为空, 医保超量校验使用
          data.specialClassify = '' // 限制非限制药
          data.highRisk = '' // 高危药品
          data.antibioticType = '' // 毒麻精放
          data.checkStockInfo = true // 无库房信息提示
          this.loading = false
        }
        if (localObj) {
          data.drugRatio = localObj.drugRatio || 1 // 换算率，中药为空, 医保超量校验使用
          data.globalMaterialId = data.globalMaterialId || localObj.materialSkuId // 物资id 获取说明书用这个ID
          data.specialClassify = localObj.specialClassify || '' // 限制非限制药
          data.highRisk = localObj.highRisk || '' // 高危药品
          data.antibioticType = localObj.antibioticType || '' // 毒麻精放
          data.allergenSecond = localObj.allergenSecond
          data.dosageForm = localObj.dosageForm // 剂型
          data.dosageFormText = localObj.dosageFormText // 剂型文本
          // 医生处方权和药品权限不匹配项
          let permissionArr = []
          if (localObj.antibioticType) {
            permissionArr.push(...localObj.antibioticType.split(','))
          }
          if (localObj.specialClassify) {
            permissionArr.push(...localObj.specialClassify.split(','))
          }
          if (permissionArr.length && this.isServicePermission && !this.isAddTpl) {
            data.noPermission = permissionArr.filter(item => !this.servicePermission.includes(item))
          } else {
            data.noPermission = false
          }
          let flag = false
          if (['301', '302'].includes(serviceClassification)) {
            let discountUnit = 1
            // 制剂成药转换比 ：preparTopatentMedicineRatio
            // 制剂成分转换比 ：preparationsUnilateral
            // 包装制剂转换比 : packageToPrepareRatio
            if (service.doseUnitCode === 'SXX000053') {     // 剂量单位为成分规格
              flag = !localObj.preparationsUnilateral // 无制剂成分转换比视为药品基础信息不全
              discountUnit = localObj.preparationsUnilateral || 0
            } else if (service.doseUnitCode === 'SXX000054') {     // 默认剂量单位为成药剂量
              flag = !localObj.preparTopatentMedicineRatio // 无包装制剂转换比视为药品基础信息不全
              discountUnit = localObj.preparTopatentMedicineRatio || 0
            } else if (service.doseUnitCode === 'SXX000047') {     // 默认剂量单位为制剂单位
              discountUnit = 1
            }
            data.discountUnit = discountUnit // 计算数量使用
            data.packageToPrepareRatio = localObj.packageToPrepareRatio || 1 // 计算数量使用
            // 西药的用法默认值
            if (!data.employ) {
              let employSchema = objFind(schema, { name: 'employ' })
              let comType = employSchema.comp
              if (comType === 'sys-type-cascader') { // 有滴速
                data.employ = localObj.useWay && [localObj.useWay.split(',')[0]] || []
              }
              if (comType === 'sys-type') { // 无滴速
                data.employ = localObj.useWay.split(',')[0] || ''
              }
            }
            // 西药的频次默认值
            if (!data.useFreq) {
              let frequency = localObj.frequency || ''
              if (this.scene === 3) {
                frequency = frequency ? [frequency] : []
              } else {
                frequency = frequency || ''
              }
              data.useFreq = frequency
            }
          }
          // 中西药查询药品基础信息，无剂量单位，无数量单位或其他计算数量信息不全都被视为基础信息不全
          if (['301', '302', '303', '304', '3002'].includes(serviceClassification) && (!service.doseUnitName || !service.unitName || flag)) {
            data.checkBaseInfo = true
          }
          if (!data.entrust) {
            data.entrust = localObj.entrust // 嘱托赋值
          }
        }
        let sendClinicSchema = objFind(schema, { name: 'sendClinic' })

        data.sendClinicList = sendClinic // 库房信息缓存到开单信息中
        if (sendClinicSchema) {
          sendClinicSchema.props.options = sendClinic
        }
        if (this.isSend) {
          this.watchCount(data) // 初始化计算数量
        } else if (!data.sendClinic && +data.source !== 2) {
          // 设置默认值
          data.sendClinic = sendClinic[0]
          if (data.sendClinic) {
            data.checkStockInfo = false
          } else {
            data.checkStockInfo = true
          }
          let extendSendClinicSchema = objFind(this.extendForm.schema, { name: 'sendClinic' })
          if (extendSendClinicSchema) {
            extendSendClinicSchema.props.options = sendClinic
          }
        } else {
          let isHasSendClinic = objFind(sendClinic, { id: data.sendClinic.id })
          if (!isHasSendClinic) {
            data.checkStockInfo = true
            data.sendClinic = ''
          } else {
            data.sendClinic = isHasSendClinic
            data.checkStockInfo = false
            // this.watchCount(data) // 初始化计算数量
          }
        }
        this.watchCount(data) // 初始化计算数量
        this.initValueBefor && this.initValueBefor(data, schema, this)
      }
    },
    // 执行科室字段格式化参数
    executeProviderFormat (service, props, type) {
      let url = props.apiUrl
      let format = {
        id: 'providerId',
        name: 'providerName'
      }
      if (url && url.indexOf('SERVICE_ID') > -1) {
        url = url.replace('SERVICE_ID', service.id)
        let n = 1
        if (+service.isSet === 1) {
          n = 2
        }
        props.apiUrl = url + '&relationType=2&adviceType=' + n
        props.format = format
        // let type2CodeList = ['02.01', '02.02', '02.03', '02.04']
        // if (this.scene === 1) {
        //   type2CodeList.push('01.02', '01.03')
        // } else {
        //   type2CodeList.push('01.01')
        // }
        props.field.params = {
          adviceType: n,
          serviceId: service.id,
          relationType: 2,
          scene: this.scene,
          providerTypes: this.executeProviderTypes
        }
        if (type) {
          props.field.firstSelect = type
          props.firstSelect = type
        }
      }
      return props
    },
    // 初始化orderdata值
    async initOrderData (data, service) {
      let schema = deepClone(this.extendForm.schema, 'json')
      let serviceClassification = service.serviceClassification
      data.serviceItem = service
      data.checkBaseInfo = false // 基础信息
      data.checkPriceInfo = false // 价格信息
      data.checkStockInfo = false // 库存信息
      // 初始化开单属性初值
      let objKeys = Object.keys(this.extendForm.obj)
      if (['2125'].includes(serviceClassification) && objKeys.includes('surgeryTime')) {
        data.surgeryTime = this.$moment().format('YYYY-MM-DD HH:mm') // 拟手术时间
        this.watchObj.surgeryLevel = this.watchSurgeryLevel.bind(this)
      }
      if (serviceClassification === '799') { // 医事服务免单原因监听
        this.watchObj.freeSheetFlag = this.watchFreeSheetFlag.bind(this)
      }
      data.executeOrgId = String(this.$store.state.currentUser.organizationId)
      data.executeOrgName = this.$store.state.currentUser.organizationName
      if (objKeys.includes('executeOrgId')) {
        this.watchObj.executeOrgId = this.watchExecuteOrgId.bind(this)
      }
      if (objKeys.includes('decoct')) {
        this.watchObj.decoct = this.watchDecoct.bind(this)
      }
      if (objKeys.includes('applyDate')) {
        data.applyDate = this.$moment().format('YYYY-MM-DD HH:mm') // 用血时间
      }
      if (objKeys.includes('source')) {
        data.source = '1' // 渠道 '1'-本院
      }
      if (objKeys.includes('entrust')) {
        data.entrust = service.entrust || this.getDefaultEntrust(service) // 嘱托
      }
      if (objFind(schema, {name: 'startTime'})) {
        data.startTime = this.$moment().format('YYYY-MM-DD HH:mm')
      }
      if (objFind(this.extendCommonForm.schema, {name: 'startTime'})) {
        this.orderComData.startTime = this.$moment().format('YYYY-MM-DD HH:mm')
      }
      if (objKeys.includes('termType') && !data.termType) {
        data.termType = '1' // 长临
      }
      // 校验医嘱的价格信息, 非套餐是收费项的条件下无价格信息视为价格信息不完整
      // 组套根据组套明细来判断价格是否完整getSetPrice
      if (
        !this.isAddTpl &&
        (service.isAdvice.toString().charAt(1) === '1') &&
        this.getPriceState(service)
      ) {
        service.price = null
        data.servicePrice = null
        data.checkPriceInfo = true
      }
      if (['301', '302', '303', '304', '300', '10008', '3002'].includes(serviceClassification)) {
        this.$set(data, 'allotNum', NaN) // 库存量
        this.checkSendClinic = true
        // 监听开单属性的变化
        this.watchObj.sendClinic = this.watchSendClinic.bind(this)
        this.watchObj.source = this.watchSource.bind(this)
        if (['301', '302'].includes(serviceClassification)) {
          Object.assign(this.watchObj, {
            useFreq: this.watchCount.bind(this),
            measure: this.watchCount.bind(this),
            useDay: this.watchCount.bind(this),
            executeProvider: this.watchExecuteProvider.bind(this)
          })
        }
        if (['303', '304'].includes(serviceClassification)) {
          this.orderComData.sendClinic = ''
          this.orderComData.source = '1'
          this.orderComData.decoctPrice = this.decoctPrice
          this.orderComData.setFlag = service.isSet ? 1 : 0 // 组套
          this.orderComData.diagnosisName = this.diagnosisName
          this.orderComData.shopSetItemId = this.orderComData.shopSetItemId || service.shopSetItemId // 套餐标示
          if (this.initDataBefor) {
            await this.initDataBefor(this.orderComData, this.extendCommonForm.schema, this)
          }
        }
        if (serviceClassification === '3002') {
          data.source = '1'
        }
        await this.initValue(data, schema, service)
        if (['303', '304'].includes(serviceClassification)) {
          let sendClinicSchema = objFind(this.extendCommonForm.schema, {name: 'sendClinic'})
          if (sendClinicSchema) {
            this.orderComData.sendClinic = data.sendClinic
            this.$set(sendClinicSchema.props, 'options', data.sendClinicList)
          }
        }
      } else {
        this.formRowFlex = false
        this.checkSendClinic = false
        data.count = 1
        data.countUnitId = service.unit
        data.countUnitName = service.unitName
        data.serviceType = serviceClassification // 医嘱类型
        data.serviceId = service.id // 医嘱id
        data.serviceName = service.byname || service.name // 医嘱名称
        data.name = service.name
        data.engName = service.nameEn
        data.threeServiceClassify = service.threeServiceClassify // 物资三级分类
        data.setFlag = service.isSet ? 1 : 0 // 组套
        data.servicePrice = service.price // 单价
        data.shopSetItemId = data.shopSetItemId || service.shopSetItemId // 套餐标示
        data.diagnosisName = this.diagnosisName
        data.type = 1
        let countSchema = objFind(schema, { name: 'count' })
        if (countSchema) {
          countSchema.props.append = formatLang(service, 'unitName')
          data.countUnitId = service.unit  // 数量单位id
          data.countUnitName = service.unitName // 数量名称
        }
        this.healthInsurance(data, schema, service)
      }
      if (['800'].includes(serviceClassification)) {
        let positionSchema = objFind(schema, { name: 'position' })
        data.examineTarget = '协助诊断'
        data.illHis = await this.getXianBingShi()
        data.positionValueSetCode = positionSchema ? positionSchema.props.code : ''
      }
      if (this.initDataBefor) {
        await this.initDataBefor(data, schema, this)
      }
      // 合并监听
      for (let k in this.watchCustom) {
        let keyName, p
        if (/^\$/.test(k)) {
          keyName = k.slice(1)
          p = -1
        } else if (/\$$/.test(k)) {
          keyName = k.slice(0, k.length - 1)
          p = 1
        } else {
          keyName = k
          p = 0
        }

        if (data.hasOwnProperty(keyName)) {
          let baseMethod
          if (this.watchObj[keyName]) {
            baseMethod = this.watchObj[keyName]
          }
          this.watchObj[keyName] = (order, pos) => {
            switch (p) {
              case -1:
                this.watchCustom[k].call(this, order, pos)
                baseMethod && baseMethod.call(this, order, pos)
                break
              case 1:
                baseMethod && baseMethod.call(this, order, pos)
                this.watchCustom[k].call(this, order, pos)
                break
              case 0:
                this.watchCustom[k].call(this, order, pos)
                break
              default:
                this.watchCustom[k].call(this, order, pos)
                break
            }
          }
        }
      }
      this.addOrEdit(data, schema, serviceClassification)
    },
    // 判断是否有价格
    getPriceState (service) {
      if (+service.isSet) {
        let list = service.servSetItemList || []
        return list.reduce((r, item) => {
          if (String(item.isAdvice).charAt(1) === '1') {
            return r || (item.price === null || isNaN(item.price))
          }
          return r || false
        }, false)
      } else {
        return (service.price === null || isNaN(service.price))
      }
    },
    draggingEnd (data) {
      let newIndex = data.newIndex
      let oldIndex = data.oldIndex
      if (newIndex === 0 || oldIndex === 0) {
        this.shareProperty = this.orderData[0]
      }
      let oldSendClinicSchema = objFind(this.extendFormSchema[Math.max(newIndex, oldIndex)], {name: 'sendClinic'})
      if (!oldSendClinicSchema) return
      let sendClinicOptions = oldSendClinicSchema.props.options
      for (let i = Math.min(newIndex, oldIndex); i < Math.max(newIndex, oldIndex) + 1; i++) {
        let schema = this.extendFormSchema[i]
        let sendClinicSchema = objFind(schema, {name: 'sendClinic'})
        let oldOptions = sendClinicSchema.props.options
        sendClinicSchema.props.options = sendClinicOptions
        sendClinicOptions = oldOptions
      }
      this.dragging = false
    }
  },
  watch: {
    'service': async function (val) {
      if (!val) {
        this.initData()
        return
      }
      this.loading = true
      this.mainGroupId = this.getMainGroupId()
      if (!val.healthServiceTemplate) {
        let tm = await this.getTemplateAndMaterial(val)
        Object.assign(val, {
          hasExecuteProvider: tm.hasExecuteProvider,
          healthServiceTemplate: tm.healthServiceTemplate,
          commonTemplate: tm.commonTemplate,
          stockObject: tm.stockObject
        })
      }
      if (val.serviceClassification === '3002' && val.isSet) {
        val.stockObject = await this.getAgreementStock(val)
      }
      let initObj = await this.getServiceInfo(val)
      if (initObj) {
        this.initOrderData(initObj, val)
      } else {
        this.initData()
      }
    },
    'orderComData.source' (val, oldVal) {
      if (!val) {
        return
      }
      if (+val === 2) {
        if (!this.isCheckStock) {
          this.shareProperty.sendClinic = ''
        }
      } else {
        let sendClinic = this.shareProperty.sendClinicList && this.shareProperty.sendClinicList[0]
        this.shareProperty.sendClinic = sendClinic || ''
        if (sendClinic) {
          this.shareProperty.checkStockInfo = false
        } else {
          this.shareProperty.checkStockInfo = true
        }
      }
      let sendClinicSchema = objFind(this.extendCommonForm.schema, { name: 'sendClinic' })
      if (+val === 2 && !this.isCheckStock) {
        this.orderComData.sendClinic = ''
        this.orderComData.mainFlag = 0
        if (sendClinicSchema) {
          sendClinicSchema.props.disabled = true
          this.formShowMessage = false
          this.extendCommonForm.rules.sendClinic.forEach(item => {
            item.required = false
          })
        }
      } else {
        this.orderComData.sendClinic = this.orderComData.sendClinic || (this.shareProperty.sendClinicList && this.shareProperty.sendClinicList[0]) || ''
        this.orderComData.mainFlag = this.orderComData.sendClinic.mainFlag
        if (sendClinicSchema) {
          sendClinicSchema.props.disabled = sendClinicSchema.props.disabled && false
          this.extendCommonForm.rules.sendClinic.forEach(item => {
            item.required = true
          })
        }
      }
    },
    'orderComData.decoct': {
      async handler (val) {
        if (!val) {
          return
        }
        let decoctPrice = await this.getDaijian(val)
        this.orderComData.decoctPrice = decoctPrice
        this.decoctPrice = decoctPrice
      },
      deep: true
    },
    'orderComData.sendClinic': {
      handler (val) {
        if (!this.shareProperty) {
          return
        }
        this.$set(this.shareProperty, 'sendClinic', val)
      },
      deep: true
    }
  },
}
