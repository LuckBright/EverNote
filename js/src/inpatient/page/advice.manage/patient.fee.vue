<template>
  <!-- 住院护士费用明细 -->
  <div class="fee-detail" :key="refreshKey">
    <!-- 补费列表 包含待提交和已提交的数据 -->
    <patient-fee-table
      ref="feeTable"
      :disabled="disabled"
      :provider-list="providerArr"
      :base-info="baseInfo"
      :has-tpl="false"
      :get-datas-list="getList"
      :visit-type="3"
      :t-fee-limit="tFeeLimit"
      :fees-type="3"
      :refuse-type="['300', '301', '302', '303', '304', '10008']"
      :return-fee-term="returnFeeTerm"
      :is-virtual-scroll="true"
      :is-page="true"
      :is-part="true"
			workspace="ZYHS-001"
			@subError="ableFee"
		>
      <div slot="search">
        <el-row class="fee-search">
          <el-col class="query-wrap" :span="14">
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
          <el-col :span="5" style="white-space:nowrap;">
            <el-button class="search-btn" type="primary" size="small" @click="refresh" :loading="searchLoad">查询</el-button>
           <span style="fontSize:14px;white-space:nowrap;">合计：<span class="cRed" style="fontSize:16px">{{totalPrice}}</span>&nbsp; 待提交：<span class="cRed" style="fontSize:16px">{{waitSum}}</span></span>
          </el-col>
          <el-col :span="4" align="right" style="padding-left: 10px;}">
            <el-button v-if="!disabled" type="primary" size="small" :disabled="!this.waitList.length" @click="submit" :loading="submitLoad">提交</el-button>
            <el-dropdown @command="print">
              <el-button type="default">
                打印<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'ZY_CPOE_FEI_YONG_QING_DAN_MEI_RI'">日费用清单</el-dropdown-item>
                <el-dropdown-item :command="'ZY_CPOE_FEI_YONG_QING_DAN_HUI_ZONG'">总费用清单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      :scene="3"
      quote-event-name="hospitalTplQuote"
      :provider-types="providerTypes"
      workspace="ZYHS-001"
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
      :scene="3"
      quote-event-name="hospitalTplQuote"
      :provider-types="providerTypes"
      workspace="ZYHS-001"
      @submit="addDraft"
    ></quote-dialog>
    <!-- 患者列表监听 -->
    <inpatient-refresh
      ref="inpatientRefresh"
      :query="this.$route.query"
      :checks="['bedId', 'areaId', 'providerId']"
      @refresh="refreshPatient"
    ></inpatient-refresh>
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
import residentApi from '@/inpatient/store/resident'
import { objFind } from '@/util/common'
import { mutiplePrint } from '@/inpatient/components/sendarea.print'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

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
      disabled: true,
      refreshKey: Math.random(),
      providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04'],
      submitLoad: false,
      waitList: [],
      tFeeLimit: false, // 退费权限
      searchLoad: false,
      waitSum: 0,
      listSum: 0
    }
  },
  computed: {
    totalPrice () {
      return +(this.listSum + this.waitSum).toFixed(6)
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.rules = { chargeTime: [], openProviderId: [], executeProviderId: [], serviceName: [], finType: [] }
      this.$bus.$off('hospitalTplQuote')
      this.$bus.$on('hospitalTplQuote', (val) => {
        if (this.disabled) return
        this.quote(val)
        this.getRandomKey()
      })
      this.setTicketCode()
      // 查询是否有退费权限
      this.tFeeLimit = this.$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_fee_return')
      // 查询患者信息
      await this.getPatientMsgByHospitalizedNumber()
      // 该患者是否能够补费
      this.ableFee()
    },
    async ableFee () {
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId,
        type: 2
      }
      let res = await api.getHospitalPatientStatus(params)
      if (res) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 刷新组件或者刷新页面
    componentRefresh () {
      this.refreshKey = Math.random()
      // history.go(0)
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
        // outStaffGetStaffListByConditionReqDTO: {
        //   type2CodeList: this.providerTypes // 科室类型
        // }
      }
      const res = await apiTpl.getDoctorOffice(params)
      if (res && res.length) {
        this.providerArr = res.map(item => {
          // this.providerMap[item.id] = item.name
          item.name = item.orgSubjectName
          return item
        })
      } else {
        this.providerArr = []
      }
      let executeProviderIdSchema = objFind(this.querySchema, { name: 'executeProviderId' })
      let providerIdSchema = objFind(this.querySchema, { name: 'providerId' })
      if (executeProviderIdSchema) executeProviderIdSchema.props.options = this.providerArr
      if (providerIdSchema) providerIdSchema.props.options = this.providerArr
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
        this.baseInfo.feesDoctorId = result.data.admitDoctorId
        this.baseInfo.feesDoctorName = result.data.admitDoctorName
        this.baseInfo.chargeTime = result.data.hospitalTime // 入科时间
      }
    },
    getProviderMap (...arg) {
    },
    async getFeesTotalPrice(params) {
      let priceParams = {...params}
      delete priceParams.offset
      delete priceParams.pageSize
      let res = await api.getFeesTotalPrice(priceParams)
      if (res) {
        this.listSum = res.totalPrice || 0
      } else {
        this.listSum = 0
      }
    },
    // 获取提交区补费项目
    async getList (type, params) {
      let param = {
        // feesType: 3,
        visitType: 3,
        patientId: this.baseInfo.patientId,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber
      }
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
      // 已提交费用总计
      this.getFeesTotalPrice(params)
      let list = await Promise.all([this.getWaitList(), this.getSubmitList(params)])
      this.waitList = list[0]
      return list
    },
    async getWaitList () {
      let params = {
        visitType: 3,
        patientId: this.baseInfo.patientId,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        feesType: 3,
        status: 0
      }
      let list = await api.getAdviceFeesInfo(params)
      let data = []
      let sum = 0
      list && list.forEach(item => {
        if (item.doctorId === this.$store.state.currentUser.userId) {
          sum += item.count * item.price
          data.push(item)
        }
      })
      this.waitSum = +(sum.toFixed(6))
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
        hospitalizedNumber: this.baseInfo.hospitalizedNumber, // 住院号
        channel: 1,
        visitType: 3, // 住院
        tenantId: currentUser.tenantId, // 归属
      }
      let params = datas.map(data => {
        data.providerId = data.providerId || this.baseInfo.providerId
        data.providerName = data.providerName || this.baseInfo.providerName
        data.executeProviderId = data.executeProviderId || this.baseInfo.providerId
        data.executeProviderName = data.executeProviderName || this.baseInfo.providerName
        data.tenantId = currentUser.tenantId
        data.orgId = currentUser.organizationId
        data.feesType = 3
        data.feesJson.areaId = this.baseInfo.areaId
        data.feesJson.areaName = this.baseInfo.areaName
        data.feesJson.bedId = this.baseInfo.bedId
        data.feesJson.bedName = this.baseInfo.bedName
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
          isSet: 0,
        }
      })
      let params = {
        providerId: this.baseInfo.providerId,
        scene: 3,
        services,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
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
        scene: 3,
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
    print (command) {
      if (!command) return false
      let printData = []
      let params = {
        patientId: this.baseInfo.patientId,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        providerId: this.queryObj.providerId,
        executeProviderId: this.queryObj.executeProviderId,
        serviceName: this.queryObj.serviceName,
        feeType: command === 'ZY_CPOE_FEI_YONG_QING_DAN_MEI_RI' ? 1 : 2,
        startTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).valueOf(),
        finType: this.queryObj.finType
      }
      if (command === 'ZY_CPOE_FEI_YONG_QING_DAN_MEI_RI') {
        if (!this.queryObj.chargeTime) {
          this.$messageTips(this, 'warning', '计费时间不能为空')
          return
        }
        params.stopTime = this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[1]).add(1, 'days').valueOf()
        let num = Math.floor((params.stopTime - params.startTime) / (24 * 3600 * 1000))
        if (num) {
          for (var i = 0; i < num; i++) {
            params.startTime = this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).add(i, 'days').format('YYYY-MM-DD') || this.$moment().format('YYYY-MM-DD')
            params.stopTime = this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).add(i, 'days').format('YYYY-MM-DD') || this.$moment().format('YYYY-MM-DD')
            printData.push({ code: command, params: JSON.parse(JSON.stringify(params)) })
          }
        } else {
          params.stopTime = this.$moment().format('YYYY-MM-DD')
          printData.push({ code: command, params })
        }
      } else {
        params.startTime = this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).format('YYYY-MM-DD')
        params.stopTime = this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[1]).format('YYYY-MM-DD')
        printData.push({ code: command, params })
      }
      mutiplePrint(printData)
    },
    // 患者状态发生变化
    refreshPatient (key, patient) {
      if (!patient) {
        this.$router.push({ query: {} })
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
        this.$router.replace({ query })
        return
      }
      if (this.operate !== patient.operate) {
        this.init()
        return
      }
    },
    // 退费限制条件
    returnFeeTerm (row) {
      if (+row.orderItemStatus === 1) { // 已支付状态不能退费
        return false
      }
      if (
        row.feesType === 1 &&
        ['300', '301', '302', '303', '304', '10008'].includes(String(row.serviceType))
      ) { // 住院护士实物类医嘱费用不能退
        return false
      }
      if ([4, 5].includes(row.feesType)) { // 手麻医技实物类联动库存不让退费
        // this.$messageTips(this, 'warning', '费用来源于医技，请联系医技人员退费')
        return false
      }
      return true
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
    .showSum{
      font-size: 14px;
      line-height: 36px;
    }
  }
</style>
