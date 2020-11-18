<template>
  <!-- 医技补费 -->
  <div class="fee-detail" :key="refreshKey">
    <el-button type="default" class="toggle" @click="toggleFee = !toggleFee">{{toggleFee ? '收起' : '展开'}}</el-button>
    <el-tabs v-model="tabType">
      <el-tab-pane label="住院费用" name="3" :disabled="!hospitalExecutes.length"></el-tab-pane>
      <el-tab-pane label="门诊费用" name="1" :disabled="!outpatientExecutes.length"></el-tab-pane>
    </el-tabs>
    <template v-if="toggleFee">
      <!-- 补费列表 包含待提交和已提交的数据 -->
      <patient-fee-table
        ref="feeTable"
        :disabled="disabled"
        :base-info="baseInfo"
        :has-tpl="false"
        :get-datas-list="getList"
        :visit-type="visitType"
        :t-fee-limit="tFeeLimit"
        :fees-type="4"
        :refuse-type="[]"
        :is-virtual-scroll="true"
        :is-page="true"
        :is-part="true"
        :part-return="() => false"
        workspace="YJ-001"
        :tab-type='tabType'
      >
        <div slot="search">
          <el-row class="fee-search">
            <el-button v-if="!disabled" type="primary" size="small" :disabled="!this.waitList.length" @click="submit" :loading="submitLoad">提交</el-button>
          </el-row>
        </div>
      </patient-fee-table>
      <!-- 补费开单组件 -->
      <patient-fee-order
        v-if="!disabled && !(tabType==='3'&& hospitalExecutes.length > 1)"
        :key="randomKey"
        :provider-list="providerArr"
        :has-header="false"
        :order-source="1"
        :handle-disabled="false"
        :base-info="baseInfo"
        :sub-order-source="subOrderSource"
        :area-id="baseInfo.areaId"
        :scene="visitType"
        quote-event-name="hospitalTplQuote"
        :provider-types="providerTypes"
        :filter-advice-type="filterAdviceType"
        workspace="YJ-001"
        @submit="addDraft"
        ref="add"
      ></patient-fee-order>
      <!-- 费用引用弹窗 -->
      <!-- <span>{{tabType}}<br>{{hospitalExecutes.length}}</span> -->
      <quote-dialog
        ref="quoteTpl"
        v-if="!disabled && !(tabType==='3'&& hospitalExecutes.length > 1)"
        :provider-list="providerArr"
        :has-header="false"
        :is-add="false"
        :order-source="1"
        :handle-disabled="false"
        :base-info="baseInfo"
        :sub-order-source="subOrderSource"
        :area-id="baseInfo.areaId"
        :scene="visitType"
        quote-event-name="hospitalTplQuote"
        :provider-types="providerTypes"
        :filter-advice-type="filterAdviceType"
        workspace="YJ-001"
        @submit="addDraft"
      ></quote-dialog>
    </template>

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

export default {
  components: {
    patientFeeOrder,
    patientFeeTable,
    quoteDialog
  },
  props: {
    provider: Object,
    subOrderSource: {
      type: Number,
      default: 11
    },
    scene: {
      type: Number,
      default: 1
    },
    executes: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      baseInfo: {},
      providerArr: [],
      randomKey: Math.random(),
      refreshKey: Math.random(),
      providerTypes: ['01.01', '02.01', '02.02', '02.03', '02.04'],
      submitLoad: false,
      waitList: [],
      tFeeLimit: false, // 退费权限
      filterAdviceType: '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,301,302,303,304341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867',
      tabType: '3',
      toggleFee: true,
      loading: false
    }
  },
  computed: {
    hospitalExecutes () {
      return this.executes.filter(item => item.visitType === 3)
    },
    outpatientExecutes () {
      return this.executes.filter(item => [1, 5].includes(item.visitType))
    },
    visitType () {
      if (this.executes.length) {
        return this.executes[0].visitType
      } else {
        return 1
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$bus.$off('hospitalTplQuote')
      this.$bus.$on('hospitalTplQuote', (val) => {
        if (this.disabled) return
        this.quote(val)
        this.getRandomKey()
      })
      this.setTicketCode()
      if (!this.hospitalExecutes.length) {
        this.tabType = '1'
        this.loading = true
      }
      // 获取科室
      this.queryProvider()
      // 查询是否有退费权限
      this.tFeeLimit = this.$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_fee_return')
      this.getBaseInfo()
      // 查询患者信息
      // this.getPatientMsgByHospitalizedNumber()
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
          // this.providerMap[item.id] = item.name
          item.name = item.orgSubjectName
          return item
        })
      } else {
        this.providerArr = []
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
        let data = result.data
        this.baseInfo.areaId = data.areaId
        this.baseInfo.areaName = data.areaName
        this.baseInfo.bedId = data.bedId
        this.baseInfo.bedName = data.bedName
        this.baseInfo.chargeTime = data.hospitalTime // 入科时间
        this.baseInfo.feesDoctorId = data.admitDoctorId
        this.baseInfo.feesDoctorName = data.admitDoctorName
        this.baseInfo.openProviderId = data.providerId
        this.baseInfo.openProviderName = data.providerName
      }
    },
    // 获取参数
    async getBaseInfo () {
      // 住院参数
      if (+this.tabType === 3) {
        this.providerTypes = ['01.01', '02.01', '02.02', '02.03', '02.04']
        let data = this.hospitalExecutes[0]
        this.baseInfo.hospitalizedNumber = data.hospitalizedNumber
        this.baseInfo.patientName = data.patientName
        this.baseInfo.patientId = data.patientId
        this.baseInfo.executeId = data.executeId
        this.baseInfo.executeIds = this.hospitalExecutes.map(item => item.executeId)
        await this.getPatientMsgByHospitalizedNumber()
      } else {
        this.providerTypes = ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
        // 门诊参数
        let data = this.outpatientExecutes[0]
        this.baseInfo.visitNumber = data.visitNumber
        this.baseInfo.patientName = data.patientName
        this.baseInfo.patientId = data.patientId
        this.baseInfo.feesDoctorId = data.doctorId
        this.baseInfo.feesDoctorName = data.doctorName
        this.baseInfo.openProviderId = data.providerId
        this.baseInfo.openProviderName = data.providerName
      }
      this.baseInfo.providerId = this.provider.id
      this.baseInfo.providerName = this.provider.name
      this.getRandomKey()
    },
    // 获取提交区补费项目
    async getList (type, params) {
      let param = {
        visitType: this.visitType,
        patientId: this.baseInfo.patientId
      }
      if (+this.tabType === 3) {
        param.hospitalizedNumber = this.baseInfo.hospitalizedNumber
        param.outpatientExecuteIdList = this.baseInfo.executeIds
      } else {
        param.visitNumber = this.baseInfo.visitNumber
      }
      params = Object.assign({}, params || {}, param)
      let list = await Promise.all([this.getWaitList(), this.getSubmitList(params)])
      this.waitList = list[0]
      this.loading = false
      return list
    },
    async getWaitList () {
      let params = {
        visitType: this.visitType,
        patientId: this.baseInfo.patientId,
        status: 0,
        feesType: 4
      }
      if (+this.tabType === 3) {
        params.hospitalizedNumber = this.baseInfo.hospitalizedNumber
        params.outpatientExecuteIdList = this.baseInfo.executeIds
      } else {
        params.visitNumber = this.baseInfo.visitNumber
      }
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
        hospitalizedNumber: this.baseInfo.hospitalizedNumber, // 住院号
        channel: 1,
        visitType: this.visitType, // 住院
        tenantId: currentUser.tenantId, // 归属
      }
      if (+this.tabType === 3) {
        param.hospitalizedNumber = this.baseInfo.hospitalizedNumber // 住院号
      } else {
        param.visitNumber = this.baseInfo.visitNumber // 门诊编号
      }
      let params = datas.map(data => {
        data.providerId = data.providerId || this.baseInfo.providerId
        data.providerName = data.providerName || this.baseInfo.providerName
        data.executeProviderId = data.executeProviderId || this.baseInfo.providerId
        data.executeProviderName = data.executeProviderName || this.baseInfo.providerName
        data.tenantId = currentUser.tenantId
        data.orgId = currentUser.organizationId
        data.feesType = 4
        data.feesJson.areaId = this.baseInfo.areaId
        data.feesJson.areaName = this.baseInfo.areaName
        data.feesJson.bedId = this.baseInfo.bedId
        data.feesJson.bedName = this.baseInfo.bedName
        if (+this.tabType === 3) {
          data.outpatientExecuteId = this.baseInfo.executeId
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
          }
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
        this.$refs.quoteTpl && this.$refs.quoteTpl.open(res)
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
        })
      }
      return datas
    },
    refresh () {
      this.$refs.feeTable.refresh()
    },
    // 退费限制条件
    returnFeeTerm (row) {
      if (+this.tabType === 1) {
        return true
      }
      // 住院已支付不让退
      if (+row.orderItemStatus === 1) {
        return false
      } else {
        return true
      }
    },
    // 部分退条件 响应产品需求，不能医技和门诊收费不能部分退，加参数isPart
    // partReturn (data) {
    //   if (+this.tabType === 3) {
    //     return true
    //   }
    //   if (data.orderItemStatus !== 1) {
    //     return false
    //   }
    //   return true
    // }
  },
  watch: {
    'tabType': {
      handler (val) {
        if ((+val === '3' && !this.hospitalExecutes.length) || (+val === 1 && !this.outpatientExecutes.length)) {
          return
        }
        this.queryProvider()
        this.getBaseInfo()
        if (!this.loading) {
          this.refresh()
        }
      }
    },
    executes: {
      handler () {
        this.getBaseInfo()
        this.refresh()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .fee-detail {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    max-height: 350px;
    .toggle {
      position: absolute;
      top: 12px;
      right: 0;
      width: 48px;
      height: 26px;
      background: #ddd;
      font-size: 12px;
      z-index: 10;
      opacity: 1.5;
      line-height: 12px;
      padding: 0;
      color: #1c7bef;
    }
    .search-btn {
      margin-left: 15px;
    }
    /deep/ .patient-fee-list {
      flex: 1;
    }
    .fee-search {
      text-align: right;
    }
  }
</style>
