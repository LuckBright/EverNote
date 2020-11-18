<template>
  <div class="advice-ihsystem">
    <div class="treatment_layout_main">
      <!-- <i class="refresh el-icon-refresh" :class="{'loading': loading}" @click="refresh"></i> -->
      <waitarea-ihsystem
        ref="waitIhsystem"
        :key="'waitIhsystem' + keyRandom"
        :visit-type="+baseInfo.visitType"
        :base-info="baseInfo"
        :disabled="!isPrescribe"
        :no-operate="false"
      ></waitarea-ihsystem>
    </div>
    <div
      class="footarea"
      v-if="isPrescribe"
    >
      <prescription
        ref="pres"
        :key="'pres' + keyRandom"
        :disabled="!isPrescribe"
        :init-data.sync="waitSendData"
        :user-info="baseInfo"
        :search-type="1"
        :filter-advice-type="filterAdviceType"
        :doctor-limit="doctorLimit"
        :share-info="{}"
        :linkages="linkages"
        :scene="+baseInfo.visitType"
        :is-send="isSend"
        :is-check-stock="isCheckStock"
        :execute-provider-types="executeProviderTypes"
        :template-scene="6"
        :is-limit-valid="false"
        :support-multi="false"
        filter-placeholder="请输入西药、中成药、中药颗粒、中药饮片、检查、检验、病理医嘱名称或缩写"
      >
      </prescription>
    </div>
    <!-- 提交前信息校验组件 -->
    <check-submit
      :base-info="baseInfo"
      :check-list="checkList"
      :scene="+baseInfo.visitType"
      :is-send="isSend"
      :is-check-stock="isCheckStock"
      @submit="submitOrders"
    ></check-submit>
    <!-- 引用批量编辑组件 -->
    <!-- <prescription-multi
      v-if="editMultiDialog"
      :edit-dialog-show.sync="editMultiDialog"
      :list="orderEditorList"
      :user-info="baseInfo"
      :share-info="{}"
      :is-send="isSend"
      :is-check-stock="isCheckStock"
      :doctor-limit="doctorLimit"
      :linkages="linkages"
      :scene="+baseInfo.visitType"
      :execute-provider-types="executeProviderTypes"
      :template-scene="5"
    ></prescription-multi> -->
    <limit-dialog :limit-show.sync="limitValid" :limit-medicine="limitMedicine"></limit-dialog>
  </div>
</template>
<script>
import waitareaIhsystem from '@/ihsystem/components/waitarea.ihsystem.vue'
import prescription from '@/inpatient/components/issued.orders/index.vue'
import { objRemove, objFind } from '@/util/common'
import excludeAdvicesCheck from '@/inpatient/components/medical.orders/exclude.advices.check'
import storage from '@/util/storage'
import checkSubmit from '@/inpatient/components/issued.orders/before.submit.vue'
import prescriptionMulti from '@/inpatient/components/issued.orders/multi.dialog.vue'
import sobApi from '@/inpatient/components/issued.orders/api.js'
import {getDoctorLimit} from '@/inpatient/components/doctor.state'
import adviceapi from '@/inpatient/store/adviceapi'
import api from '@/ihsystem/store/advice.js'
import limitDialog from '@/ihsystem/components/limit.dialog.vue'

export default {
  components: {
    prescription, // 开医嘱组件
    waitareaIhsystem, // 医嘱展示区域组件
    excludeAdvicesCheck, // 医嘱排斥组件
    checkSubmit, // 医嘱添加草稿校验组件
    prescriptionMulti, // 批量编辑组件
    limitDialog
  },
  data () {
    return {
      baseInfo: {},
      dataList: {},
      dataBack: [],
      waitSendData: [],
      stockData: [],
      outpartVisible: false,
      bedvisible: false,
      noStockSubmit: true,
      inpatientInfo: '',
      printParams: [],
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
      isPrescribe: true, // 是否能开立医嘱
      keyRandom: this.getRandom(),
      filterAdviceType: '301,302,303,304,800,801,10003,3002',
      limitValid: false,
      limitMedicine: [],
      loading: false
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 查询自备药是否校验库存
    sobApi.searchCheckConfig({
      code: 'CREATE_PERSONAL_DRUG_DISPENSE',
      defaultValue: '0'
    }).then(res => {
      // 0 自备药不校验库存；1 自备药校验库存
      let value = res && +res.value
      this.isCheckStock = value === 1
    })
  },
  methods: {
    init () {
      // this.isPrescribe = this.$route.matched[0].meta && this.$route.matched[0].meta.role === 1 || false
      this.baseInfo = this.getBaseInfo()
      this.checkList = ['diagnose', 'cdss']
      this.linkages = ['useFreq', 'termType', 'source', 'executeProvider', 'executeNumber', 'employ', 'startTime', 'sendClinic', 'stopTime']
      // 执行科室类别
      this.executeProviderTypes = ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']

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
    },
    // 获取患者的基本信息
    getBaseInfo () {
      let info = JSON.parse(JSON.stringify(this.$route.query))
      info.visitType = 1
      return info
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
    async refresh () {
      if (this.loading) {
        return
      }
      this.loading = true
      await this.$refs.waitIhsystem.query()
      this.loading = false
    },
    // 提交
    submitOrders (datas, type, done, fail) {
      if (!datas || !datas.length) {
        done && done()
        return
      }
      this.limitMedicine = []
      let baseInfo = this.baseInfo
      let currentUser = this.$store.state.currentUser
      let params = {
        doctorId: currentUser.userId, // 医生id
        doctorName: currentUser.displayName, // 医生名字
        groupId: baseInfo.groupId,
        orgId: currentUser.organizationId, // 机构id
        orgName: currentUser.organizationName, // 机构名称
        patientId: baseInfo.patientId, // 患者id
        patientName: baseInfo.patientName, // 患者姓名
        providerId: baseInfo.providerId, // 开单科室id
        providerName: baseInfo.providerName, // 开单科室
        serviceOrderId: baseInfo.serviceOrderId,
        visitNumber: baseInfo.visitNumber, // 就诊编号
        reqType: '0',
        doctorAdviceDtoList: datas,
      }
      datas.forEach(item => {
        item.orgId = currentUser.organizationId // 机构id
        item.tenantId = currentUser.tenantId // 归属
        item.subVisitType = 301 // 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
        item.bedId = this.baseInfo.bedId // 床位id
        item.bedName = this.baseInfo.bedName // 床位name
        item.areaId = this.baseInfo.patientAreaId // 病区id
        item.termType = item.termType || 0 // 默认为临时医嘱
        item.sourceExecuteId = this.baseInfo.executeId // 执行单id
        if (item.stopTime) {
          item.adviceJson.stopByName = currentUser.displayName
          item.stopBy = currentUser.userId
        }
        // 本次手术的执行单id
        item.adviceFeesDtoList && item.adviceFeesDtoList.forEach(item => {
          item.outpatientExecuteId = this.baseInfo.executeId
          Object.assign(item, item.feesJson)
          delete item.feesJson
        })
        Object.assign(item, item.adviceJson)
        delete item.adviceJson
        // 药品特殊类型
        let medicine = [
          ...getMedicineType(item.specialClassify),
          ...getMedicineType(item.highRisk),
          ...getMedicineType(item.antibioticType)
        ]
        medicine.forEach(t => {
          this.limitMedicine.push({
            name: item.serviceName,
            id: item.serviceId,
            type: t
          })
        })
        function getMedicineType (types) {
          return types && types.split(',') || []
        }
      })
      if (this.limitMedicine.length) {
        this.limitValid = true
        fail && fail()
        return
      }
      api.createDoctorAdvice(params).then(res => {
        this.setTicketCode()
        if (res) {
          done && done()
          this.$refs.waitIhsystem.getWaitData()
          // then(() => { // 重新加载待提交区数据
          //   this.$refs.waitIhsystem.selectWaitTable() // 选中待提交区列表
          // })
        } else {
          fail && fail()
        }
      })
    },
    resetWaitSendData (data) {
      data.forEach(item => {
        objRemove(this.waitSendData, { itemId: item.itemId })
      })
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
          scene: +this.baseInfo.visitType,
          services: services,
          supplyId: this.baseInfo.areaId,
          providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04'],
          visitNumber: this.baseInfo.visitNumber
        }
        let serviceList = await sobApi.queryOrgServiceMutil(params)
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
        if (['303', '304'].includes(order.serviceType)) {
          order.useFreq = [order.useFreq] // 住院的频次是数组
          order.useFreqTime && order.useFreq.push(order.useFreqTime) // useFreqTime时间点
          // 用法注射的时候是两个字段
          if (order.adviceJson && order.adviceJson.dropSpeed) {
            order.employ = [order.employ, order.adviceJson.dropSpeed]
          }
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
          order.useFreq = [order.useFreq] // 住院的频次是数组
          order.useFreqTime && order.useFreq.push(order.useFreqTime) // useFreqTime时间点
          // 用法注射的时候是两个字段
          if (order.adviceJson && order.adviceJson.dropSpeed) {
            order.employ = [order.employ, order.adviceJson.dropSpeed]
          }
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
        scene: +this.baseInfo.visitType,
        services: services,
        supplyId: this.baseInfo.areaId,
        providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04'],
        visitNumber: this.baseInfo.visitNumber
      }
      let serviceList = await sobApi.queryOrgServiceMutil(params)
      serviceList.forEach(service => {
        if (!service.stockObject) {
          service.stockObject = []
        }
        serviceIdObj[service.id].forEach(item => {
          item.serviceItem = service
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
  },
  watch: {
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
.advice-ihsystem {
  font-size: 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f1f5f8;
  position: relative;
  .refresh {
    position: absolute;
    top: 20px;
    right: 15px;
    z-index: 10;
    cursor: pointer;
    opacity: 0.4;
  }
  .loading {
    animation: roll .8s linear infinite;
  }
  @keyframes roll {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
  .headarea {
    margin: 15px 0;
    z-index: 1;
    width: 50%;
  }
  .treatment_layout_main {
    flex: 1;
    height: 0;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
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
