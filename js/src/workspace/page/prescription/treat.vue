<template>
  <div id="treat" class="layout_box">
    <div class="wait_list_wrap">
      <div class="layout_inner advice_wait">
        <waitarea-outpatient
          ref="wait"
          :title="$t('')"
          :visit-type="1"
          :user-info="baseInfo"
          :disabled="orderDisable"
          :history="baseInfo.status === 'history'"
        ></waitarea-outpatient>
      </div>
      <div class="footarea" :style="{height: 'auto'}">
        <prescription
          ref="pres"
          :scene="1"
          :show-add="showAdd"
          :init-data.sync="waitSendData"
          :user-info="baseInfo"
          :share-info="shareInfo"
          :share-time="shareTime"
          :results="results"
          :appoint="appoint"
          :search-type="1"
          :disabled="orderDisable || baseInfo.status === 'history'"
          filter-advice-type="300,301,302,303,304,800,801,802,300,10006,2125,867,2467,10004,10003,10002,799,10008,3002"
          :doctor-limit="doctorLimit"
          :is-send="isSend"
          :execute-provider-types="['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']"
        ></prescription>
      </div>
    </div>
    <!-- 提交前信息校验组件 -->
    <check-submit
      :base-info="baseInfo"
      :check-list="checkList"
      :scene="1"
      :is-send="isSend"
      @submit="submitOrders"
    ></check-submit>
    <!-- 引用批量编辑组件 -->
    <prescription-multi
      v-if="editMultiDialog"
      :edit-dialog-show.sync="editMultiDialog"
      :list="orderEditorList"
      :user-info="baseInfo"
      :share-info="shareInfo"
      :is-send="isSend"
      :doctor-limit="doctorLimit"
      :execute-provider-types="['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']"
			:scene="1"
    ></prescription-multi>
  </div>
</template>
<script>
import medicalapi from '@/workspace/store/medicalapi'
import prescription from '@/inpatient/components/issued.orders/index.vue'
import checkSubmit from '@/inpatient/components/issued.orders/before.submit.vue'
import prescriptionMulti from '@/inpatient/components/issued.orders/multi.dialog.vue'
import api from '@/inpatient/components/issued.orders/api.js'
import waitareaOutpatient from '@/inpatient/components/waitarea.outpatient.vue'
import storage from '@/util/storage'
import { objFind, objRemove } from '@/util/common'
import {getDoctorLimit} from '@/inpatient/components/doctor.state'
import doctorLimitDialog from '@/inpatient/components/doctor.state/doctor.limit.dialog.vue'
import adviceapi from '@/inpatient/store/adviceapi'
// visitType 和 scene 是一个字段，暂时没做统一
export default {
  props: ['shareInfo', 'shareTime', 'results', 'appoint', 'disabled', 'fromQuick', 'space'],
  data () {
    return {
      visible: false, // 补费的弹窗，暂时使用
      medicalapi,
      baseInfo: this.$route.query,
      waitSendData: [],
      initData: [],
      stockData: [],
      showAll: true,
      showSend: true,
      showAdd: false,
      noPermisssionService: [],
      useValid: false,
      isShowSend: false,
      sendData: [],
      editMultiDialog: false,
      orderEditorList: [],
      isSend: false,
      // 校验 'diagnose'-诊断信息校验, 'limit'-处方权校验, 'number'-数量校验, 'sendclinic'-库存校验, 'cdss'-cdss校验, 'insurance'-医保校验
      checkList: ['diagnose', 'limit', 'number', 'cdss', 'noSendclinic', 'insurance'],
      doctorLimit: {
        isServicePermission: false,
        servicePermission: []
      },
      sesstionKey: ''
    }
  },
  created () {
    this.sesstionKey = `${this.space}Key`
    let str = localStorage.getItem(this.sesstionKey)
    if (str) {
      let arr = str.split(',')
      this.baseInfo = Object.assign({}, this.baseInfo, {
        providerId: arr[0],
        providerName: arr[1]
      })
    }
    if (this.$route.query.role === 'ma') {
      this.checkList = ['limit', 'number', 'noSendclinic', 'cdss', 'insurance']
    }
  },
  mounted () {
    api.searchCheckConfig({
      code: 'STOCK_QUERY_SWITCH',
      defaultValue: '1'
    }).then(res => {
      let value = res && +res.value
      this.isSend = !value
    })
    // 查配置是否校验诊断信息
    api.searchCheckConfig({
      code: 'NEED_CHECK_DIAGNOSE',
      defaultValue: '1'
    }).then(res => {
      let value = res ? +res.value : 1
      if (!value) {
        objRemove(this.checkList, item => item === 'diagnose')
      }
    })
  },
  methods: {
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
        if (['303', '304'].includes(item.serviceType)) {
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
    setTicketCode () {
      adviceapi.getTicketCode().then(rs => {
        return rs.head.errCode === 0 && storage.setStorageByClinic('x-ticket-code', rs.data.xTicketCode)
      })
    },
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
        providerId: this.baseInfo.providerId || this.baseInfo.dptId, // 开单科室id
        providerName: this.baseInfo.providerName, // 开单科室
        doctorId: currentUser.userId, // 医生id
        doctorName: currentUser.displayName, // 医生名字
        patientId: this.baseInfo.patientId, // 患者id
        patientName: this.baseInfo.patientName, // 患者姓名
        visitNumber: this.baseInfo.visitSn, // visitSn看诊唯一标示
        channel: 1,
        visitType: 1, // 门诊
        subVisitType: 101, // 101-门诊下医嘱; 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
        tenantId: currentUser.tenantId, // 归属
        doctorAdviceDtoList: datas
      }
      datas.forEach(item => {
        item.orgId = currentUser.organizationId // 机构id
        item.tenantId = currentUser.tenantId // 归属
        item.subVisitType = 101 // 101-门诊下医嘱; 301-住院 302-临床路径 303-住院手术 304-产房下医嘱
      })
      api.createDoctorAdvice(params).then(res => {
        this.setTicketCode()
        if (res) {
          this.$refs.wait.getWaitData()
          done && done()
        } else {
          fail && fail()
        }
      })
    },
    async setInitData (val, type) {
      if (!val || !val.length) {
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
            isSet: item.isSet
          }
        })
        let serviceTypeObj = {}
        let params = {
          scene: 1,
          visitNumber: this.baseInfo.visitSn,
          services: services,
          supplyId: this.baseInfo.dptId,
          providerTypes: ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
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
        scene: 1,
        visitNumber: this.baseInfo.visitSn,
        services: services,
        supplyId: this.baseInfo.dptId,
        providerTypes: ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
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
    }
  },
  components: {
    prescription, // 开医嘱组件
    waitareaOutpatient, // 待发送区域
    doctorLimitDialog, // 处方权验证提示弹窗
    checkSubmit, // 医嘱添加草稿校验组件
    prescriptionMulti // 批量编辑组件
  },
  computed: {
    orderDisable () {
      /**
       * status 一逗号分割的字符串'ma,history,other'
       * ma - 医疗主管
       * history - 历史患者
       * others - 非本人患者
       */
      let status = this.baseInfo.status ? this.baseInfo.status.split(',') : []
      let disabled = false
      if (status.includes('history') || status.includes('others')) {
        disabled = true
      }
      if (status.includes('ma')) {
        disabled = false
      }
      // if (this.baseInfo.status === 'history') {
      //   disabled = true
      // }
      return disabled
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
  }
}
</script>

<style lang="scss" scoped>
#treat {
  font-size: 14px;
  margin-top: 0;
  height: 100%;
}
#treat .layout_inner {
  position: relative;
  margin: 0;
  padding: 8px;
  background: #f1f5f8;
}
#treat .wait_list_wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* overflow-y: auto; */
}
#treat .introduce {
  color: #666666;
  font-size: 14px;
  margin-right: 10px;
  border: none;
}
#treat .introduce span {
  color: #666666;
}
#treat .introduce i {
  color: #bbbbbb;
  margin-right: 4px;
  vertical-align: middle;
}
#treat .advice_wait {
  /* display: flex; */
  flex: 1;
  min-height: 200px;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  padding-right: 15px;
  position: relative;
}
#treat .footarea {
  border-top: 1px solid #d9ddde;
  padding: 20px 15px;
  background-color: #e1e7ea;
}
</style>
