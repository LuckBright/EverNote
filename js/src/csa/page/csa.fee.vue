<template>
  <!-- 手术费用明细 -->
  <div class="fee-detail" :key="refreshKey">
    <!-- 补费列表 包含待提交和已提交的数据 -->
    <patient-fee-table
      ref="feeTable"
      :disabled="disabled"
      :provider-list="providerArr"
      :base-info="baseInfo"
      :has-tpl="false"
      :get-datas-list="getList"
      :visit-type="+baseInfo.visitType"
      :t-fee-limit="tFeeLimit"
      :fees-type="feesType"
      :refuse-type="[]"
      :is-virtual-scroll="true"
      :is-page="true"
      :is-part="true"
      :part-return="() => false"
			workspace="SMGL-001"
		>
      <div slot="search">
        <el-row class="fee-search">
          <el-col class="query-wrap" :span="18">
            <ever-form2
              ref="queryForm"
              :schema="querySchema"
              v-model="queryObj"
              :nosubmit="true"
              :gutter="10"
              :rules="rules"
              :row-flex="true"
              label-width="0px"
              ></ever-form2>
          </el-col>
          <el-col :span="2">
            <el-button class="search-btn" type="primary" size="small" @click="refresh" :loading="searchLoad">查询</el-button>
          </el-col>
          <el-col :span="4" align="right">
            <el-button v-if="!disabled" type="primary" size="small" :disabled="!this.waitList.length" @click="submit" :loading="submitLoad">提交</el-button>
          </el-col>
        </el-row>
      </div>
    </patient-fee-table>
    <!-- 补费开单组件 -->
    <patient-fee-order
      v-if="!disabled"
      :key="randomKey"
      :provider-list="providerArr"
      :has-header="false"
      :order-source="1"
      :handle-disabled="false"
      :base-info="baseInfo"
      :sub-order-source="subOrderSource"
      :area-id="baseInfo.areaId"
      :scene="+baseInfo.visitType"
      quote-event-name="hospitalTplQuote"
      :provider-types="providerTypes"
      workspace="SMGL-001"
      @submit="addDraft"
      ref="add"
    ></patient-fee-order>
    <!-- 费用引用弹窗 -->
    <quote-dialog
      ref="quoteTpl"
      v-if="!disabled"
      :provider-list="providerArr"
      :has-header="false"
      :is-add="false"
      :order-source="1"
      :handle-disabled="false"
      :base-info="baseInfo"
      :sub-order-source="subOrderSource"
      :area-id="baseInfo.areaId"
      :scene="+baseInfo.visitType"
      quote-event-name="hospitalTplQuote"
      :provider-types="providerTypes"
      workspace="SMGL-001"
      @submit="addDraft"
    ></quote-dialog>
  </div>
</template>
<script>
import patientFeeOrder from '@/inpatient/components/fee.orders/fee.orders.vue' // 补费开单组件
import patientFeeTable from '@/inpatient/components/fee.orders/fee.table.vue' // 补费列表
import quoteDialog from '@/inpatient/components/fee.orders/quote.dialog.vue' // 费用模版引用弹窗
import api from '@/inpatient/components/fee.orders/api'
import adviceapi from '@/inpatient/store/adviceapi'
import storage from '@/util/storage'
import apiTpl from '@/sob/store/tmpl.api.js'
import { objFind } from '@/util/common'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'
import residentApi from '@/inpatient/store/resident'

export default {
  components: {
    patientFeeOrder,
    patientFeeTable,
    quoteDialog,
    inpatientRefresh // 患者列表监听
  },
  props: {
    subOrderSource: {
      type: Number,
      default: 11
    },
    provider: { // 当前科室
      type: Object,
      required: true
    }
  },
  data () {
    let schema = [
      {
        name: 'chargeTime',
        label: '计费时间', // 计费时间
        comp: 'date-picker',
        span: 12,
        labelWidth: '80px',
        props: {
          outformat: 'yyyy-MM-dd',
          showformat: 'yyyy-MM-dd',
          type: 'daterange',
          placeholder: '计费时间'
        }
      },
      {
        name: 'providerId',
        label: '', // 开单科室
        comp: 'sys-select',
        span: 4,
        props: {
          options: [],
          placeholder: '开单科室'
        }
      },
      {
        name: 'executeProviderId',
        label: '', // 执行科室
        comp: 'sys-select',
        span: 4,
        props: {
          options: [],
          placeholder: '执行科室'
        }
      },
      {
        name: 'serviceName',
        label: '', // 项目名称
        comp: 'sys-text',
        span: 4,
        props: {
          placeholder: '项目名称'
        }
      },
      {
        name: 'isSelf',
        label: '', // 本次手术
        comp: 'sys-select',
        span: 4,
        props: {
          placeholder: '本次手术',
          options: [{
            name: '是',
            id: '1'
          }, {
            name: '否',
            id: '0'
          }]
        }
      },
      {
        name: 'finType',
        label: '', // 项目名称
        comp: 'sys-type',
        span: 4,
        props: {
          code: 'THC_RCM_FIN_TYPE',
          placeholder: '业务分类'
        }
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      baseInfo: JSON.parse(JSON.stringify(this.$route.query)),
      querySchema: schema,
      queryObj: obj,
      providerArr: [],
      randomKey: Math.random(),
      disabled: false,
      refreshKey: Math.random(),
      providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04'],
      submitLoad: false,
      waitList: [],
      tFeeLimit: false, // 退费权限
      searchLoad: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.feesType = 5
      this.rules = {chargeTime: [], openProviderId: [], executeProviderId: [], serviceName: [], finType: []}
      this.$bus.$off('hospitalTplQuote')
      this.$bus.$on('hospitalTplQuote', (val) => {
        if (this.disabled) return
        this.quote(val)
        this.getRandomKey()
      })
      this.setTicketCode()
      // 查询是否有退费权限
      this.tFeeLimit = this.$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_fee_return')
    },
    // 刷新组件或者刷新页面
    componentRefresh () {
      this.refreshKey = Math.random()
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
      let executeProviderIdSchema = objFind(this.querySchema, {name: 'executeProviderId'})
      let providerIdSchema = objFind(this.querySchema, {name: 'providerId'})
      if (executeProviderIdSchema) executeProviderIdSchema.props.options = this.providerArr
      if (providerIdSchema) providerIdSchema.props.options = this.providerArr
    },
    // 获取提交区补费项目
    async getList (type, params) {
      let param = this.getParams(this.queryObj.isSelf === '1')
      if (type) {
        param = Object.assign({}, param, {
          providerId: this.queryObj.providerId,
          executeProviderId: this.queryObj.executeProviderId,
          serviceName: this.queryObj.serviceName,
          startTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).valueOf(),
          endTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[1]).add(1, 'days').valueOf(),
          finType: this.queryObj.finType
        })
      }
      params = Object.assign({}, params || {}, param)
      let list = await Promise.all([this.getWaitList(), this.getSubmitList(params)])
      this.waitList = list[0]
      return list
    },
    async getWaitList () {
      let params = this.getParams(true)
      params.status = 0
      params.feesType = 5
      let list = await api.getAdviceFeesInfo(params)
      let data = []
      list && list.forEach(item => {
        if (item.doctorId === this.$store.state.currentUser.userId) {
          data.push(item)
        }
      })
      return data
    },
    async getSubmitList (param) {
      let res = await api.getHospitalFeeList(param)
      return res
    },
    // 保存到费用草稿区/待提交区
    addDraft (datas, type, done, fail) {
      if (!datas) {
        done && done()
        return
      }
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      let currentUser = this.$store.state.currentUser
      let param = {
        // 公共部分
        orgId: currentUser.organizationId, // 机构id
        orgName: currentUser.organizationId, // 机构名称
        doctorId: currentUser.userId, // 医生id
        doctorName: currentUser.displayName, // 医生名字
        patientId: this.baseInfo.patientId, // 患者id
        patientName: this.baseInfo.patientName, // 患者姓名
        channel: 1,
        visitType: this.baseInfo.visitType, // 住院
        tenantId: currentUser.tenantId, // 归属
        ...this.getNumber() // 编号
      }
      let params = datas.map(data => {
        data.providerId = data.providerId || this.baseInfo.providerId
        data.providerName = data.providerName || this.baseInfo.providerName
        data.executeProviderId = data.executeProviderId || this.baseInfo.providerId
        data.executeProviderName = data.executeProviderName || this.baseInfo.providerName
        data.tenantId = currentUser.tenantId
        data.orgId = currentUser.organizationId
        data.feesType = this.feesType
        data.feesJson.areaId = this.baseInfo.patientAreaId
        data.feesJson.areaName = this.baseInfo.patientAreaName
        data.feesJson.bedId = this.baseInfo.bedId
        data.feesJson.bedName = this.baseInfo.bedName
        data.outpatientExecuteId = this.baseInfo.executeId
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
            this.refresh()
            done && done()
          } else {
            fail && fail()
            this.getRandomKey()
            // this.componentRefresh()
          }
        })
      } else {
        api.createAdviceFees(params).then(res => {
          this.setTicketCode()
          if (res) {
            this.refresh()
            done && done()
          } else {
            fail && fail()
            // this.componentRefresh()
            // this.getRandomKey()
          }
          // this.getRandomKey()
        })
      }
    },
    // 草稿区提交
    submit () {
      this.submitLoad = true
      this.$refs.feeTable.submit(() => {
        this.submitLoad = false
      })
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
        // this.addDraft(res)
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
        scene: this.baseInfo.visitType,
        services,
        ...this.getNumber(),
        providerTypes: this.providerTypes
      }
      const res = await api.queryOrgFeeTemplate(params).catch(() => false)
      if (res && res.length) {
        // let p = []
        res.forEach(item => {
          datasObj[item.id].forEach(order => {
            order.serviceItem = item
          })
          // if (item.hasExecuteProvider) {
          //   p.push(this.getExecuteProvider(datasObj[item.id]))
          // }
        })
        // await Promise.all(p)
      }
      return datas
    },
    // 获取执行科室
    async getExecuteProvider (data) {
      let res = await api.getExecuteProviderList({
        serviceId: data.serviceId,
        scene: this.baseInfo.visitType,
        adviceType: +data.serviceItem.isSet === 1 ? 2 : 1,
        providerTypes: this.providerTypes, // 执行科室类型
        relationType: 2
      })
      if (res && res.length) {
        data.executeProviderId = res[0].providerId
        data.executeProviderName = res[0].providerName
      }
    },
    async refresh () {
      this.searchLoad = true
      await this.$refs.feeTable.refresh()
      this.searchLoad = false
    },
    getParams (isSelf) {
      let params = {
        visitType: this.baseInfo.visitType,
        patientId: this.baseInfo.patientId,
        ...this.getNumber()
      }
      if (isSelf) {
        params.outpatientExecuteIdList = [this.baseInfo.executeId]
      }
      return params
    },
    getNumber () {
      if (+this.baseInfo.visitType === 1) {
        return {visitNumber: this.baseInfo.visitNumber}
      }
      if (+this.baseInfo.visitType === 3) {
        return {hospitalizedNumber: this.baseInfo.hospitalizedNumber}
      }
      return {}
    },
    // 获取参数
    getBaseInfo () {
      // 住院参数
      if (+this.baseInfo.visitType === 3) {
        this.providerTypes = ['01.01', '02.01', '02.02', '02.03', '02.04']
        this.getPatientMsgByHospitalizedNumber()
      } else {
        this.providerTypes = ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
      }
      this.baseInfo.providerId = this.provider.id
      this.baseInfo.providerName = this.provider.name
      this.baseInfo.feesDoctorId = this.$store.state.currentUser.userId
      this.baseInfo.feesDoctorName = this.$store.state.currentUser.displayName
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
        this.baseInfo.chargeTime = result.data.hospitalTime // 入科时间
      }
    }
  },
  watch: {
    'queryObj': {
      handler () {
        this.refresh()
      },
      deep: true
    },
    '$store.state.currentUser': {
      handler (val) {
        if (val) {
          this.getBaseInfo()
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
  .fee-detail {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    height: 100%;
    .search-btn {
      margin-left: 15px;
    }
    /deep/ .patient-fee-list {
      height: 0;
      flex: 1;
    }
  }
</style>
