<template>
  <div class="treatment-wrap">
    <el-row class="headarea">
      <el-radio-group v-model="adviceStage">
        <el-radio :label="1">术前</el-radio>
        <el-radio :label="2">麻醉</el-radio>
        <el-radio :label="3">术中</el-radio>
        <el-radio :label="4">术后</el-radio>
      </el-radio-group>
    </el-row>
    <div class="treatment_layout_main">
      <waitarea-csa
        ref="waitCsa"
        :key="'waitCsa' + keyRandom"
        :visit-type="+baseInfo.visitType"
        :base-info="baseInfo"
        :disabled="!isPrescribe"
        :advice-stage="adviceStage"
        :no-operate="!isPrescribe"
      ></waitarea-csa>
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
        :template-scene="5"
        filter-placeholder="请输入西药、耗材、治疗、麻醉、其他医嘱名称或缩写"
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
    <prescription-multi
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
    ></prescription-multi>
  </div>
</template>
<script>
import waitareaCsa from '@/csa/components/waitarea.csa.vue'
import prescription from '@/inpatient/components/issued.orders/index.vue'
import { objRemove, objFind } from '@/util/common'
import excludeAdvicesCheck from '@/inpatient/components/medical.orders/exclude.advices.check'
import storage from '@/util/storage'
import checkSubmit from '@/inpatient/components/issued.orders/before.submit.vue'
import prescriptionMulti from '@/inpatient/components/issued.orders/multi.dialog.vue'
import api from '@/inpatient/components/issued.orders/api.js'
import {getDoctorLimit} from '@/inpatient/components/doctor.state'
import adviceapi from '@/inpatient/store/adviceapi'
import residentApi from '@/inpatient/store/resident'

export default {
  components: {
    prescription, // 开医嘱组件
    waitareaCsa, // 医嘱展示区域组件
    excludeAdvicesCheck, // 医嘱排斥组件
    checkSubmit, // 医嘱添加草稿校验组件
    prescriptionMulti, // 批量编辑组件
  },
  props: {
    provider: {
      type: Object,
      required: true
    }
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
      filterAdviceType: '300,301,802,867,10004',
      adviceStage: 1
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
  methods: {
    init () {
      this.isPrescribe = this.$route.matched[0].meta && this.$route.matched[0].meta.role === 1 || false
      this.baseInfo = this.getBaseInfo()
      if (+this.baseInfo.visitType === 3) {
        this.getPatientMsgByHospitalizedNumber()
      }
      this.checkList = ['limit', 'cdss']
      this.linkages = ['useFreq', 'termType', 'source', 'executeProvider', 'executeNumber', 'employ', 'startTime', 'sendClinic', 'stopTime']
      // 执行科室类别
      this.executeProviderTypes = +this.baseInfo.visitType === 3 ? ['01.01', '02.01', '02.02', '02.03', '02.04'] : ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']

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
      info.providerId = this.provider.id
      info.providerName = this.provider.name
      return info
    },
    // 获取患者在院状态
    async getPatientMsgByHospitalizedNumber () {
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId
      }
      let result = await residentApi.getPatientMsgByHospitalizedNumber(params)
      if (result && result.data) {
        this.baseInfo.patientAreaId = result.data.areaId
        this.baseInfo.patientAreaName = result.data.areaName
        this.baseInfo.bedId = result.data.bedId
        this.baseInfo.bedName = result.data.bedName
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
        channel: 1,
        visitType: +this.baseInfo.visitType, // 住院
        // subVisitType: 301, // 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
        tenantId: currentUser.tenantId, // 归属
        doctorAdviceDtoList: datas,
        ...this.getNumber()
      }
      datas.forEach(item => {
        item.orgId = currentUser.organizationId // 机构id
        item.tenantId = currentUser.tenantId // 归属
        item.subVisitType = 301 // 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
        item.bedId = this.baseInfo.bedId // 床位id
        item.bedName = this.baseInfo.bedName // 床位name
        item.areaId = this.baseInfo.patientAreaId // 病区id
        item.termType = item.termType || 0 // 默认为临时医嘱
        item.adviceStage = this.adviceStage // 手术阶段
        item.sourceExecuteId = this.baseInfo.executeId // 执行单id
        item.source = 1 // 渠道用本院
        if (item.stopTime) {
          item.adviceJson.stopByName = currentUser.displayName
          item.stopBy = currentUser.userId
        }
        // 本次手术的执行单id
        item.adviceFeesDtoList && item.adviceFeesDtoList.forEach(item => {
          item.outpatientExecuteId = this.baseInfo.executeId
        })
      })
      api.createDoctorAdvice(params).then(res => {
        this.setTicketCode()
        if (res) {
          done && done()
          this.$refs.waitCsa.getWaitData().then(() => { // 重新加载待提交区数据
            this.$refs.waitCsa.selectWaitTable() // 选中待提交区列表
          })
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
          ...this.getNumber()
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
        scene: +this.baseInfo.visitType,
        services: services,
        supplyId: this.baseInfo.areaId,
        providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04'],
        ...this.getNumber()
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
    getNumber () {
      let curNumber = {}
      if (+this.baseInfo.visitType === 1) {
        curNumber = {visitNumber: this.baseInfo.visitNumber}
      }
      if (+this.baseInfo.visitType === 3) {
        curNumber = {hospitalizedNumber: this.baseInfo.hospitalizedNumber}
      }
      return curNumber
    }
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
    },
    'adviceStage' () {
      this.keyRandom = this.getRandom()
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
  position: relative;
  .headarea {
    margin: 15px 0;
    z-index: 1;
    width: 50%;
  }
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
