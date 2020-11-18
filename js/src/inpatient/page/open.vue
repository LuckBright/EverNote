<template>
  <div class="treatment-wrap">
    <div class="treatment_layout_main">
      <waitarea-hospital
        v-if="statusLoad"
        ref="waitHospital"
        :key="'waitHospital'"
        :visit-type="3"
        :fromMedical='fromMedical'
        :user-info="baseInfo"
        :disabled="!isPrescribe"
        @termChange="termChange"
      ></waitarea-hospital>
    </div>
    <div
      class="footarea"
    >
      <prescription
        v-if="statusLoad"
        ref="pres"
        :key="'pres' + keyRandom"
        :disabled="!isPrescribe"
        :init-data.sync="waitSendData"
        :user-info="baseInfo"
        :search-type="1"
        :filter-advice-type="filterAdviceType"
        :doctor-limit="doctorLimit"
        :share-info="{}"
        :left-icon="true"
        :custom-items="['measure']"
        :self-schema-value="selfSchemaValue(false)"
        :watch-custom="watchCustom"
        :init-value-befor="initValueBefor"
        :init-data-befor="initDataBefor"
        :linkages="linkages"
        :scene="3"
        :is-send="isSend"
        :is-check-stock="isCheckStock"
        :execute-provider-types="['01.01', '02.01', '02.02', '02.03', '02.04']"
      >
        <!-- 剂量需要有领量 -->
        <template slot="measure" slot-scope="{order}">
          <sys-text
            class="required"
            v-model="order.measure"
            type="number"
            :append="order.measureUnitName"
          ></sys-text>
          <label :class="+order.count?'el-form-item__info':'el-form-item__error'">
            {{$t('单次领量')}}:{{(order.count || 0) + (order.countUnitName || '')}}
          </label>
        </template>
      </prescription>
    </div>
    <!-- 医嘱排斥组件 -->
    <exclude-advices-check
      :list="excludeAdvicesList"
      :hospitalized-number="baseInfo.hospitalizedNumber"
      :patient-id="baseInfo.patientId"
      ref="excludeAdvicesDialog"
      @close="excludeAdviceClose"></exclude-advices-check>
    <!-- 提交前信息校验组件 -->
    <check-submit
      :base-info="baseInfo"
      :check-list="checkList"
      :scene="3"
      :is-send="isSend"
      :is-check-stock="isCheckStock"
      @selfCheck="checkExclude"
      @submit="submitOrders"
    ></check-submit>
    <!-- 引用批量编辑组件 -->
    <prescription-multi
      v-if="editMultiDialog"
      :edit-dialog-show.sync="editMultiDialog"
      :list="orderEditorList"
      :user-info="baseInfo"
      :share-info="shareInfo || {}"
      :is-send="isSend"
      :is-check-stock="isCheckStock"
      :doctor-limit="doctorLimit"
      :custom-items="['measure']"
      :self-schema-value="selfSchemaValue(true)"
      :watch-custom="watchCustom"
      :init-value-befor="initValueBefor"
      :init-data-befor="initDataBefor"
      :linkages="linkages"
      :scene="3"
      :execute-provider-types="['01.01', '02.01', '02.02', '02.03', '02.04']"
    ></prescription-multi>
    <!-- 患者列表监听 -->
    <inpatient-refresh
      ref="inpatientRefresh"
      :query="this.$route.query"
      :checks="['bedId', 'areaId', 'providerId']"
      @refresh="refresh"
    ></inpatient-refresh>
  </div>
</template>
<script>
import orderApi from '@/inpatient/components/fee.orders/api'
import waitareaHospital from '@/inpatient/components/waitarea.hospital.vue'
import prescription from '@/inpatient/components/issued.orders/index.vue'
import { objRemove, objFind } from '@/util/common'
import excludeAdvicesCheck from '@/inpatient/components/medical.orders/exclude.advices.check'
import setMealApi from '@/workspace/store/set.meal.api'
import storage from '@/util/storage'
import { findIndex } from 'lodash'
import checkSubmit from '@/inpatient/components/issued.orders/before.submit.vue'
import prescriptionMulti from '@/inpatient/components/issued.orders/multi.dialog.vue'
import api from '@/inpatient/components/issued.orders/api.js'
import {getDoctorLimit} from '@/inpatient/components/doctor.state'
import adviceapi from '@/inpatient/store/adviceapi'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

export default {
  components: {
    prescription, // 开医嘱组件
    waitareaHospital, // 医嘱展示区域组件
    excludeAdvicesCheck, // 医嘱排斥组件
    checkSubmit, // 医嘱添加草稿校验组件
    prescriptionMulti, // 批量编辑组件
    inpatientRefresh // 患者列表监听
  },
  props: ['type', 'stageId', 'isSendAdvice', 'historyStage', 'shareInfo'],
  data () {
    return {
      baseInfo: JSON.parse(JSON.stringify(this.$route.query)),
      dataList: {},
      dataBack: [],
      waitSendData: [],
      stockData: [],
      outpartVisible: false,
      bedvisible: false,
      noStockSubmit: true,
      inpatientInfo: '',
      excludeAdvicesList: [],
      printParams: [],
      isHistoryStage: false,
      setMealStatus: false,
      patientOrg: {},
      orderDisable: false,
      doctorLimit: {
        isServicePermission: false,
        servicePermission: []
      },
      isSend: false,
      isCheckStock: true,
      editMultiDialog: false,
      orderEditorList: [],
      isPrescribe: false, // 是否能开立医嘱
      statusLoad: false, // 先获取患者在院状态
      keyRandom: this.getRandom(),
      term: 1
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 查询自备药是否校验库存
    api.searchCheckConfig({
      code: 'CREATE_PERSONAL_DRUG_DISPENSE',
      defaultValue: '0'
    }).then(res => {
      // 0 自备药不校验库存；1 自备药校验库存
      let value = res && +res.value
      this.isCheckStock = value === 1
    })
  },
  computed: {
    filterAdviceType () {
      if (this.term === 1) {
        return '301,302,802,2126,10004,867,832,2124'
      } else {
        return '300,301,302,303,304,799,800,801,802,832,867,10002,10003,10004,10005,10006,10007,10008,2124,2125,2126,2466,2467,3001,3002'
      }
    },
    fromMedical() {
      return this.$route.query.from === 'medicalArchive' || this.$route.query.from === 'medicalReview'
    }
  },
  methods: {
    init () {
      this.checkList = ['limit', 'cdss', /* 'sendclinic', */ 'exclude']
      this.linkages = ['useFreq', 'termType', 'source', 'executeProvider', 'executeNumber', 'employ', 'startTime', 'sendClinic', 'stopTime']
      // 住院状态是否可以带在患者信息上
      this.getPatientMsgByHospitalizedNumber()

      // 判断某一个打印机打印完成，启动下一个打印任务
      let self = this
      window.addEventListener('message', function (e) {
        if (e.data === 'printdone' && self.printParams.length) {
          self.printRecipe()
        }
      }, false)

      this.$bus.$off('yihu:setRecipeTemplateToWaitarea')

      // 从医嘱搜索框引用模版
      this.$bus.$on('yihu:setRecipeTemplateToWaitarea', val => {
        this.setInitData(val)
      })

      // 引用模版
      this.$bus.$off('hospitalTplQuote')
      this.$bus.$on('hospitalTplQuote', (val) => {
        this.setInitData(val)
      })

      this.setTicketCode()

      this.selectOrderByPatient()

      // 监听开单属性值变化
      this.watchCustom = {
        source$: function (order, pos) {
          // 领量
          let countSchema = {
            comp: 'sys-text',
            label: '领量',
            name: 'count',
            span: 2,
            props: {
              append: order.countUnitName,
              clearable: false,
              disabled: false,
              display: 1,
              limitInteger: true,
              max: 999,
              min: 1,
              type: 'number'
            }
          }
          let schema = this.extendFormSchema[pos]
          if ([3, 33].includes(+order.source)) {
            if (objFind(schema, {name: 'count'})) {
              return
            }
            let index = findIndex(schema, {name: 'source'})
            index !== -1 && schema.splice(index + 1, 0, countSchema)
          } else {
            if (['301', '302'].includes(order.serviceType)) {
              objRemove(schema, {name: 'count'})
              this.watchCustom.measure.call(this, order)
              this.$set(this.extendFormSchema, pos, schema)
            }
          }
        },
        measure: function (order, opt) { // 住院的领量与剂量及出院带药有关
          if (order.measure) {
            if ([3, 33].includes(+order.source)) {
              return
            }
            let freqval = 1
            let discountUnit = order.discountUnit
            let packageToPrepareRatio = order.packageToPrepareRatio
            let measure = order.measure
            let day = 1
            if (!freqval || !discountUnit) {
              return
            }
            if (+this.service.ifReused === 1) { // ifReuse是否能重复使用
              let countNum = ((measure / discountUnit) * (+freqval) * day) / packageToPrepareRatio
              order.count = Math.ceil(countNum)
            } else {
              let countNum = (Math.ceil(measure / discountUnit) * freqval * day) / packageToPrepareRatio
              order.count = Math.ceil(countNum)
            }
          } else {
            order.count = ''
          }
        }
      }
    },
    selfSchemaValue (isTpl) {
      let self = this
      if (isTpl) {
        return function (createSchema, service) {
          let schema = createSchema.schema
          // 住院数量显示的是单次领量
          if (['301', '302'].includes(service.serviceClassification)) {
            objRemove(schema, {name: 'count'})
          }
          // 长临要放在开单属性最前面
          let [termTypeSchema] = objRemove(schema, {name: 'termType'})
          if (termTypeSchema) {
            if (service.code === 'zhuanke') {
              delete createSchema.obj.termType
              return
            }
            termTypeSchema.col = {
              style: 'width: 100px'
            }
            schema.unshift(termTypeSchema)
          }
        }
      }
      return function (createSchema, service) {
        let schema = createSchema.schema
        // 住院数量显示的是单次领量
        if (['301', '302'].includes(service.serviceClassification)) {
          objRemove(schema, {name: 'count'})
        }
        // 长临要放在开单属性最前面
        let [termTypeSchema] = objRemove(schema, {name: 'termType'})
        if (termTypeSchema) {
          if (service.code === 'zhuanke') {
            delete createSchema.obj.termType
            return
          }
          if (self.term !== -1) {
            createSchema.obj.termType = String(self.term)
            termTypeSchema.props.disabled = true
          }
          termTypeSchema.col = {
            style: 'width: 100px'
          }
          schema.unshift(termTypeSchema)
        }
      }
    },
    // 获取随机数
    getRandom () {
      return Math.random().toString().substring(2)
    },
    setTicketCode () {
      adviceapi.getTicketCode().then(rs => {
        return rs.head.errCode === 0 && storage.setStorageByClinic('x-ticket-code', rs.data.xTicketCode)
      })
    },
    initValueBefor (data, schema, vm) {
      this.watchCustom.measure.call(vm, data)
    },
    initDataBefor (data, schema, vm) {
      // 开始时间不能大于入科时间
      let startTimeSchema = objFind(schema, {name: 'startTime'})
      let stopTimeSchema = objFind(schema, {name: 'stopTime'})
      if (startTimeSchema) {
        startTimeSchema.props.pickerOptions = {
          disabledDate: (time) => {
            return time.getTime() < this.hospitalTime
          }
        }
      }
      if (stopTimeSchema) {
        stopTimeSchema.props['picker-options'] = {
          disabledDate: (time) => {
            return time.getTime() < this.hospitalTime
          },
        }
      }
      // 住院没有院外执行
      if (data.hasOwnProperty('executeProvider') && data.executeProvider && data.executeProvider.id === 'SOB_EXTUDE_PROVIDER_OUT') {
        if (this.baseInfo.providerId) {
          data.executeProvider = {
            id: this.baseInfo.providerId,
            name: this.baseInfo.providerName
          }
        } else {
          data.executeProvider = null
        }
      }
    },
    // 提交
    submitOrders (datas, type, done, fail) {
      if (!datas || !datas.length) {
        done && done()
        return
      }
      let currentUser = this.$store.state.currentUser
      let params = {
        // 公共部分
        orgId: currentUser.organizationId, // 机构id
        orgName: currentUser.organizationName, // 机构名称
        providerId: this.baseInfo.providerId, // 开单科室id
        providerName: this.baseInfo.providerName, // 开单科室
        doctorId: currentUser.userId, // 医生id
        doctorName: currentUser.displayName, // 医生名字
        patientId: this.baseInfo.patientId, // 患者id
        patientName: this.baseInfo.patientName, // 患者姓名
        hospitalizedNumber: this.baseInfo.hospitalizedNumber, // hospitalizedNumber住院标识
        channel: 1,
        visitType: 3, // 住院
        subVisitType: 301, // 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
        tenantId: currentUser.tenantId, // 归属
        doctorAdviceDtoList: datas
      }
      let isSetTerm = false // 长/临是否切换到全部的选项
      datas.forEach(item => {
        item.orgId = currentUser.organizationId // 机构id
        item.tenantId = currentUser.tenantId // 归属
        item.subVisitType = 301 // 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
        item.bedId = this.baseInfo.bedId // 床位id
        item.bedName = this.baseInfo.bedName // 床位name
        item.areaId = this.baseInfo.areaId // 病区id
        item.termType = item.termType || 0 // 默认为临时医嘱
        if (item.stopTime) {
          item.adviceJson.stopByName = currentUser.displayName
          item.stopBy = currentUser.userId
        }
        if (String(this.term) !== String(item.termType)) {
          isSetTerm = true
        }
      })
      api.createDoctorAdvice(params).then(res => {
        this.setTicketCode()
        if (res) {
          done && done()
          if (isSetTerm && this.term !== -1) {
            this.$refs.waitHospital.setTermType(-1)
            this.term = -1
            window.setTimeout(() => {
              this.$refs.waitHospital.selectWaitTable()
            }, 800)
          } else {
            this.$refs.waitHospital.getWaitData().then(() => { // 重新加载待提交区数据
              this.$refs.waitHospital.selectWaitTable() // 选中待提交区列表
            })
          }
        } else {
          fail && fail()
        }
      })
    },
    // 获取患者在院状态
    async getPatientMsgByHospitalizedNumber () {
      let isSameProvider = await orderApi.getInpatientbyHosNumber({hospitalizedNumber: this.baseInfo.hospitalizedNumber}).then(res => {
        // 患者入科时间
        let moment = this.$moment
        this.hospitalTime = moment(moment(res.hospitalTime || Date.now()).format('YYYY-MM-DD')).valueOf()
        if ((res.bedId !== this.baseInfo.bedId || res.areaId !== this.baseInfo.areaId) && !this.fromMedical) {
          this.$messageTips(this, 'warning', '当前患者病区或者床位发生变化')
          this.$router.push({query: {}})
          return true
        }
        if (res.providerId && res.providerId === this.baseInfo.providerId) {
          return true
        }
        return false
      })
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId,
        type: 1
      }
      let res = await orderApi.getHospitalPatientStatus(params)
      if (res) {
        this.isPrescribe = true
      } else {
        this.isPrescribe = false
      }
      if (!isSameProvider) {
        this.$messageTips(this, 'warning', '该患者不在当前科室')
        this.isPrescribe = false
      }
      this.statusLoad = true
      if (this.fromMedical) this.isPrescribe = false
    },
    // 显示换床
    bedChange (data) {
      this.inpatientInfo = data
      this.bedvisible = true
    },
    resetWaitSendData (data) {
      data.forEach(item => {
        objRemove(this.waitSendData, { itemId: item.itemId })
      })
    },
    // 排斥医嘱校验
    checkExclude (datas, cb) {
      let services = []
      datas && datas.length && datas.forEach(item => {
        item.forEach(service => {
          if (['303', '304'].includes(service.serviceType)) {
            services.push(...service.list)
          } else {
            services.push(service)
          }
        })
      })
      this.getExcludeAdvices(services).then(res => {
        if (res) {
          this.excludeAdvicesList = res
          this.$refs.excludeAdvicesDialog.open()
        }
        cb && cb()
      })
    },
    excludeAdviceClose (type) {
      this.excludeAdvicesList = []
      if (type) {
        this.$refs.waitHospital.search().then(() => {
          this.$refs.waitHospital.selectWaitTable()
        })
      }
    },
    // 排斥医嘱
    async getExcludeAdvices (data) {
      if (!data || !data.length) {
        return null
      }
      let currentUser = this.$store.state.currentUser
      let serviceIds = []
      data.forEach(item => {
        serviceIds.push(item.serviceId)
      })
      let res = await api.getExcludeAdvices({
        orgId: currentUser.organizationId, // 机构id
        patientId: this.baseInfo.patientId, // 患者id
        tenantId: currentUser.tenantId, // 归属
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        serviceIdList: serviceIds
      }).then(res => {
        if (res && res.length) {
          return res
        }
        return false
      }).catch(() => false)
      return res
    },
    // 判断是否是项目类型（检验/耗材/治疗/其它）
    isItemType (id) {
      let ids = ['299', '300', '801', '802', '867', '2124']
      return ids.filter(item => {
        return item === id
      })[0]
    },
    uniqueArray (array, key) {
      let result = [array[0]]
      for (let i = 1; i < array.length; i++) {
        let item = array[i]
        let repeat = false
        for (var j = 0; j < result.length; j++) {
          if (item[key] === result[j][key]) {
            repeat = true
            break
          }
        }
        if (!repeat) {
          result.push(item)
        }
      }
      return result
    },
    getStockObject (serviceId) {
      return this.stockData.filter(item => {
        return item.id === serviceId
      })[0]
    },
    getServiceIds (arr) {
      let ids = []
      if (!arr) {
        return []
      }
      arr.map((item, i) => {
        let isSet = 0
        if (item.doctorAdviceType === '1' || item.setId === '1') {
          isSet = 0
        } else if (item.doctorAdviceType === '2' || item.setId === '2') {
          isSet = 1
        }
        item.serviceItem = typeof item.serviceItem === 'string' ? JSON.parse(item.serviceItem) : item.serviceItem
        if (['303', '304'].includes(item.adviceType)) {
          let chiData = JSON.parse(item.adviceContent, true)
          chiData.map(data => {
            ids.push({
              id: data.serviceItem.id,
              isSet: isSet
            })
          })
        } else {
          ids.push({
            id: item.serviceItem.id,
            isSet: isSet
          })
        }
      })
      return ids
    },
    async selectOrderByPatient () {
      if (this.$route.query.patientId) {
        const res = await setMealApi.selectOrderByPatient({ patientId: this.$route.query.patientId, setmealType: 'f9163156-4509-474e-b276-b67ac8208f5d' })
        if (res && res.data && res.data.length) {
          res.data.forEach(item => {
            if (!this.setMealStatus) {
              this.getOrderBySetMealId(item)
            }
          })
        } else {
          this.setMealStatus = false
        }
      }
    },
    async getOrderBySetMealId (item) {
      let params = {
        itemName: '',
        setMeal: item.setMealId,
        orderMealId: item.orderId
      }
      const res = await setMealApi.getOrderBySetMealId(params)
      if (res && res.data && res.data.length) {
        res.data.forEach(sitem => {
          if (sitem && sitem.serviceInfos && sitem.serviceInfos.length > 0) {
            sitem.serviceInfos.forEach(mitem => {
              let localSessionCount = storage.getSessionStorage(`SET_MEAL_${mitem.orderDetailId}`)
              if (localSessionCount && localSessionCount.itemNumFinished) {
                mitem.itemNumFinished = localSessionCount.itemNumFinished
              }
              mitem.count = mitem.count || 0
              mitem.itemNumFinished = mitem.itemNumFinished || 0
              if (mitem.count - mitem.itemNumFinished > 0) {
                this.setMealStatus = true
              }
            })
            return sitem
          }
        })
      }
    },
    async setInitData (val, type) {
      if (!val || !val.length || !this.isPrescribe) {
        return
      }
      this.orderEditorList = []
      // 传递的是service
      if (type === 'default') {
        let serviceTypeObj = {}
        val.forEach(item => {
          item.keyId = Math.random().toString()
          item.serviceItem = JSON.parse(JSON.stringify(item))
          let serviceType = item.serviceClassification
          if (serviceTypeObj[serviceType]) {
            serviceTypeObj[serviceType].push(item)
          } else {
            serviceTypeObj[serviceType] = [item]
          }
        })
        for (let key in serviceTypeObj) {
          this.orderEditorList.push({
            type: key,
            list: serviceTypeObj[key]
          })
        }
        this.editMultiDialog = true
        return
      }
      // 传递的是serviceId和serviceName对象
      if (type === 'ids') {
        let services = val.map(item => {
          return {
            id: item.serviceId,
            isSet: item.isSet || 0
          }
        })
        let serviceTypeObj = {}
        let params = {
          scene: 3,
          hospitalizedNumber: this.baseInfo.hospitalizedNumber,
          services: services,
          supplyId: this.baseInfo.areaId,
          providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04']
        }
        let serviceList = await api.queryOrgServiceMutil(params)
        val.forEach(item => {
          let service = objFind(serviceList, {id: item.serviceId})
          if (service) {
            item = Object.assign(item, service)
          }
        })
        val.forEach(item => {
          item.keyId = Math.random().toString()
          let serviceType = item.serviceClassification
          if (serviceTypeObj[serviceType]) {
            serviceTypeObj[serviceType].push(item)
          } else {
            serviceTypeObj[serviceType] = [item]
          }
        })
        for (let key in serviceTypeObj) {
          this.orderEditorList.push({
            type: key,
            list: serviceTypeObj[key]
          })
        }
        this.editMultiDialog = true
        return
      }
      let services = []
      let serviceIdObj = {}
      let typeObj = {}
      val.forEach(order => {
        order.source = String(order.source)
        order.keyId = Math.random().toString()
        if (order.useFreq) {
          order.useFreq = [order.useFreq] // 住院的频次是数组
          order.useFreqTime && order.useFreq.push(order.useFreqTime) // useFreqTime时间点
        }
        // 用法注射的时候是两个字段
        if (order.adviceJson && order.adviceJson.dropSpeed) {
          order.employ = [order.employ, order.adviceJson.dropSpeed]
        }
        if (['303', '304'].includes(order.serviceType)) {
          if (typeObj['303.304']) {
            typeObj['303.304'].push(order)
          } else {
            typeObj['303.304'] = [order]
          }
          order.adviceFeesDtoList.forEach(item => {
            if (item.feesType !== 1) {
              return
            }
            // 处理医嘱项一样的处方
            if (serviceIdObj[item.serviceId]) {
              serviceIdObj[item.serviceId].push(item)
            } else {
              serviceIdObj[item.serviceId] = [item]
            }
            services.push({
              id: item.serviceId,
              isSet: item.setFlag ? 1 : 0
            })
          })
          return
        }
        if (['301', '302'].includes(order.serviceType)) {
          if (typeObj['301.302']) {
            typeObj['301.302'].push(order)
          } else {
            typeObj['301.302'] = [order]
          }
        } else {
          if (typeObj[order.serviceType]) {
            typeObj[order.serviceType].push(order)
          } else {
            typeObj[order.serviceType] = [order]
          }
        }
        // 处理医嘱项一样的处方
        if (serviceIdObj[order.serviceId]) {
          serviceIdObj[order.serviceId].push(order)
        } else {
          serviceIdObj[order.serviceId] = [order]
        }
        services.push({
          id: order.serviceId,
          isSet: order.setFlag ? 1 : 0
        })
      })
      let params = {
        scene: 3,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        services: services,
        supplyId: this.baseInfo.areaId,
        providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04']
      }
      let serviceList = await api.queryOrgServiceMutil(params)
      serviceList.forEach(service => {
        if (!service.stockObject) {
          service.stockObject = []
        }
        serviceIdObj[service.id].forEach(item => {
          item.serviceItem = JSON.parse(JSON.stringify(service))
        })
      })
      let keys = Object.keys(typeObj)
      for (let k of keys) {
        let list = typeObj[k]
        if (k === '301.302') {
          let mainObj = {}
          list.forEach(item => {
            if (mainObj[item.mainGroupId]) {
              mainObj[item.mainGroupId].push(item)
            } else {
              mainObj[item.mainGroupId] = [item]
            }
          })
          list = Object.values(mainObj)
        }
        this.orderEditorList.push({
          type: k,
          list: list
        })
      }
      this.editMultiDialog = true
    },
    // 患者状态发生变化
    refresh (key, patient) {
      if (!patient && !this.fromMedical) {
        this.$router.push({query: {}})
        return
      }
      let query = this.$route.query
      if (key) {
        query = Object.assign({}, query, {
          providerId: patient.providerId,
          providerName: patient.providerName,
          areaId: patient.areaId,
          areaName: patient.areaName,
          bedId: patient.bedId,
          bedName: patient.bedName
        })
        this.$router.replace({query})
        return
      }
      if (this.operate !== patient.operate) {
        this.init()
        return
      }
    },
    // 切换长期，临时，全部radio事件
    termChange (term) {
      this.term = term
      this.keyRandom = this.getRandom()
    }
  },
  watch: {
    'historyStage' (val) {
      this.isHistoryStage = val
    },
    '$store.state.currentUser': {
      handler (val) {
        if (!val.userId) {
          return
        }
        getDoctorLimit(val.userId).then(res => {
          if (res) {
            this.doctorLimit = {
              isServicePermission: true,
              servicePermission: res || []
            }
          } else {
            this.doctorLimit = {
              isServicePermission: false,
              servicePermission: []
            }
          }
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.treatment-wrap {
  font-size: 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .treatment_layout_main {
    flex: 1;
    height: 0;
    overflow-y: auto;
  }
  .footarea {
    position: relative;
    padding: 10px;
    border: 1px solid #dadce0;
    background-color: #e1e7ea;
  }
  .treatment_layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: #ebedef;
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
  }
}
/deep/ .mutil-edit-dialog {
  /deep/ .add-body .issued_orders_box .icon-btn-front {
    left: -90px;
  }
}
</style>
