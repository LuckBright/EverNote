<template>
  <div>
    <!-- 补费列表 包含待提交和已提交的数据 -->
    <patient-fee-table
      ref="feeTable"
      :provider-list="providerArr"
      :visitType="visitType"
      :base-info="baseInfo"
      :disabled="disabled"
      :provider-types="providerTypes"
      :t-fee-limit="tFeeLimit"
			:refuse-type="refuseType"
      :workspace="workspace"
      :fees-type="feesType"
      :has-tpl="hasTpl"
      v-bind="$attrs"
      @quote="quote"
    >
    </patient-fee-table>
    <!-- 补费开单组件 -->
    <patient-fee-order
      v-if="!disabled"
      :key="randomKey"
      :provider-list="providerArr"
      :order-source="1"
      :handle-disabled="false"
      :base-info="baseInfo"
      :sub-order-source="subOrderSource"
      :provider-id="baseInfo.providerId"
      :provider-types="providerTypes"
      :scene="visitType"
			:filter-advice-type="filterAdviceType"
			:workspace="workspace"
      @submit="submit"
      @add="addData"
      ref="add"
		></patient-fee-order>
		<!-- 费用引用弹窗 -->
    <quote-dialog
      ref="quoteTpl"
      v-if="!disabled"
      :provider-list="providerArr"
      :order-source="1"
      :handle-disabled="false"
      :base-info="baseInfo"
      :sub-order-source="subOrderSource"
      :provider-id="baseInfo.providerId"
      :provider-types="providerTypes"
      :filter-advice-type="filterAdviceType"
      :workspace="workspace"
      :is-add="false"
      :scene="visitType"
      @submit="submit"
    ></quote-dialog>
  </div>
</template>
<script>
import patientFeeOrder from './fee.orders.vue' // 补费开单组件
import patientFeeTable from './fee.table.vue' // 补费列表
import quoteDialog from './quote.dialog.vue' // 费用模版引用弹窗
import api from './api'
import adviceapi from '@/inpatient/store/adviceapi'
import storage from '@/util/storage'
import apiTpl from '@/sob/store/tmpl.api.js'
import residentApi from '@/inpatient/store/resident'

export default {
  components: {
    patientFeeOrder,
    patientFeeTable,
    quoteDialog
  },
  props: {
    hasTpl: Boolean,
    /**
     * baseInfo
     * -| visitNumber: '',
     * -| doctorId: '',
     * -| patientId: '',
     * -| patientName: '',
     * -| providerId: '',
     * -| providerName: ''
     * -| feesDoctor: {id:'', name: ''}
     */
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    subOrderSource: {
      type: Number,
      default: 11
    },
    visitType: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tFeeLimit: { // 是否具有退费权限
      type: Boolean,
      default: true
    },
    refuseType: {
      type: Array,
      default: () => []
    },
    filterAdviceType: {
      type: String,
      default: '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,299,301,302,303,304,341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867'
    },
    workspace: String,
    feesType: { // 补费类型 1-医嘱本身 2-追加的 3-护士手动补 4-医技补 5-手麻补 6-门急诊收费
      type: Number,
      require: true
    }
  },
  data () {
    return {
      providerArr: [],
      randomKey: Math.random(),
      providerTypes: ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04'], // 默认门急诊+医技
    }
  },
  computed: {
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // // 查询是否有退费权限
      // this.tFeeLimit = this.$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_fee_return')
      this.$bus.$off('feeTplSelectQuote')
      this.$bus.$on('feeTplSelectQuote', (val) => {
        this.quote(val)
        this.getRandomKey()
      })
      this.setTicketCode()
      if (this.visitType === 3) {
        this.getPatientMsgByHospitalizedNumber()
      }
    },
    // 获取患者在院状态
    async getPatientMsgByHospitalizedNumber () {
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId
      }
      let result = await residentApi.getPatientMsgByHospitalizedNumber(params)
      if (result && result.data) {
        this.baseInfo.areaId = result.data.areaId
        this.baseInfo.areaName = result.data.areaName
        this.baseInfo.bedId = result.data.bedId
        this.baseInfo.bedName = result.data.bedName
        this.baseInfo.chargeTime = result.data.hospitalTime // 入科时间
      }
    },
    getRandomKey () {
      this.randomKey = Math.random()
    },
    async queryProvider () {
      let params = {
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          usePermissionStatus: 'Y',
          status: 'Y',
          orgIdList: [this.$store.state.currentUser.organizationId],
          type2CodeList: this.providerTypes // 科室类型
        }
      }
      const res = await apiTpl.getDoctorOffice(params)
      if (res && res.length) {
        this.providerArr = res.map(item => {
          item.name = item.orgSubjectName
          return item
        })
      } else {
        this.providerArr = []
      }
    },
    addData (list) {
    },
    submit (datas, type, done, fail) {
      if (!datas) {
        done && done()
        return
      }
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      let param = {
        // 公共部分
        orgId: this.$store.state.currentUser.organizationId, // 机构id
        orgName: this.$store.state.currentUser.organizationId, // 机构名称
        doctorId: this.$store.state.currentUser.userId, // 医生id
        doctorName: this.$store.state.currentUser.displayName, // 医生名字
        patientId: this.baseInfo.patientId, // 患者id
        patientName: this.baseInfo.patientName, // 患者姓名
        channel: 1,
        visitType: this.visitType, // 门诊
        tenantId: this.$store.state.currentUser.tenantId, // 归属
      }
      param = Object.assign({}, param, this.sceneNumber)
      let params = datas.map(data => {
        data.providerId = data.providerId || this.baseInfo.providerId
        data.providerName = data.providerName || this.baseInfo.providerName
        data.executeProviderId = data.executeProviderId || this.baseInfo.providerId
        data.executeProviderName = data.executeProviderName || this.baseInfo.providerName
        data.tenantId = this.$store.state.currentUser.tenantId
        data.orgId = this.$store.state.currentUser.organizationId
        data.feesType = this.feesType // 医技的补费是4
        data.doctorAdviceId = this.baseInfo.adviceId
        if (this.visitType === 3) {
          data.feesJson.areaId = this.baseInfo.areaId
          data.feesJson.areaName = this.baseInfo.areaName
          data.feesJson.bedId = this.baseInfo.bedId
          data.feesJson.bedName = this.baseInfo.bedName
        }
        return Object.assign({}, param, {
          adviceFeesDtoList: [data],
          providerId: data.providerId, // 开单科室id
          providerName: data.providerName // 开单科室
        })
      })
      if (type === 'update') {
        api.updateAdviceFees(params).then(res => {
          this.setTicketCode()
          if (res) {
            this.$refs.feeTable.getList(true)
            done && done()
          } else {
            fail && fail()
          }
        })
      } else {
        api.createAdviceFees(params).then(res => {
          this.setTicketCode()
          if (res) {
            this.$refs.feeTable.getList(true)
            done && done()
          } else {
            fail && fail()
          }
          this.getRandomKey()
        })
      }
    },
    setTicketCode () {
      adviceapi.getTicketCode().then(rs => {
        return rs.head.errCode === 0 && storage.setStorageByClinic('x-ticket-code', rs.data.xTicketCode)
      })
    },
    quote (val) {
      this.getFeeService(val).then(res => {
        res.forEach(item => {
          item.id = Math.random().toString().substring(2)
        })
        this.$refs.quoteTpl.open(res)
        // this.submit(res)
      })
    },
    // 获取service
    async getFeeService (datas) {
      let datasObj = {}
      let services = datas.map(item => {
        if (datasObj[item.serviceId]) {
          datasObj[item.serviceId].push(item)
        } else {
          datasObj[item.serviceId] = [item]
        }
        return {
          id: item.serviceId,
          isSet: 0
        }
      })
      let params = {
        providerId: this.baseInfo.providerId,
        scene: this.scene,
        services,
      }
      params = Object.assign({}, params, this.sceneNumber)
      const res = await api.queryOrgFeeTemplate(params).catch(() => false)
      if (res && res.length) {
        let p = []
        res.forEach(item => {
          datasObj[item.id].forEach(order => {
            order.serviceItem = item
          })
          if (item.hasExecuteProvider) {
            p.push(this.getExecuteProvider(datasObj[item.id]))
          }
        })
        await Promise.all(p)
      }
      return datas
    },
    // 获取执行科室
    async getExecuteProvider (data) {
      let res = await api.getExecuteProviderList({
        serviceId: data.serviceId, // 医嘱id
        scene: this.scene, // 场景
        adviceType: +data.serviceItem.isSet === 1 ? 2 : 1, // 组套
        providerTypes: this.providerTypes, // 科室类型
        relationType: 2 // 开单科室
      })
      if (res && res.length) {
        data.executeProviderId = res[0].providerId
        data.executeProviderName = res[0].providerName
      }
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        if (this.visitType === 1) {
          this.sceneNumber = {
            visitNumber: this.baseInfo.visitNumber
          }
          this.providerTypes = ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
        } else if (this.visitType === 3) {
          this.sceneNumber = {
            hospitalizedNumber: this.baseInfo.hospitalizedNumber
          }
          this.providerTypes = ['01.01', '02.01', '02.02', '02.03', '02.04']
        } else {
          this.sceneNumber = {
            visitNumber: this.baseInfo.visitNumber
          }
        }
        this.scene = this.visitType
        if (val) {
          this.queryProvider()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
