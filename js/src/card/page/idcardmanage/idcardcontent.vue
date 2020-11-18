<template>
  <div>
    <ever-bread-crumb haveReturn="true" showTitle="true" :name="idCardName || '新建'" :path="isGroup ? '/crm/idcards/' : '/card/idcards/'"></ever-bread-crumb>
    <div class="layout_inner">
      <el-tabs v-model="activeName" v-loading.body="idCardLoading">
        <el-tab-pane label="基本信息" name="idCardInfo">
          <id-card-con :dataDetails="idCardData" @tabChange="handleTabChange" :isGroupControl="isGroupControl"></id-card-con>
        </el-tab-pane>
        <el-tab-pane v-if="isGroup" :disabled="idCardId ? false : true" label="适用地区" name="idCardMechanism">
          <association-agency :dataDetails="idCardData"></association-agency>
        </el-tab-pane>
        <el-tab-pane v-if="showApproval" label="审批详情" name="idCardAppoval">
          <approval-flows :processInstanceId="processInstanceId" @onSubmit="submitFn" :key="currentKey"></approval-flows>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { IDENTIFY_CARD_FILE_TYPE } from '@/util/common'
import IdCardCon from '@/card/page/idcardmanage/idcard.vue'
import AssociationAgency from '@/card/components/associationagency'
import idCardApi from '@/card/store/idcardapi'
import packageManagementApi from '@/card/store/packagemanagement/api'
import approvalFlows from '@/message/page/approval.flows.vue'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

export default {
  data () {
    return {
      idCardName: '',
      activeName: 'idCardInfo',
      idCardId: this.$route.query.id,
      viewApprovalFlag: this.$route.query.viewApproval,
      idCardData: {},
      idCardLoading: false,
      isGroup: this.$route.matched[0].meta.crm ? 1 : 0,
      isGroupControl: true,
      processInstanceId: '',
      showApproval: false,
      currentKey: new Date().getTime()
    }
  },
  created () {
    this.idCardId = this.$route.query.id
    if (!this.isGroup) { // 查询机构是否可编辑
      packageManagementApi.getClinicManageConfigForRecord({ type: IDENTIFY_CARD_FILE_TYPE }).then(res => {
        if (res && res.data) this.isGroupControl = (String(res.data.isConfig) === '1')
      })
    } else {
      this.isGroupControl = false
    }
    if (this.idCardId) this.getInfo()
  },
  methods: {
    // 根据businessCode查 processinstanceId 然后显示审批流
    getApprovalDetail (businessCode) {
      request(urlMap.process.getInstanceInfoByBusinessCode, {
        businessCode
      }).then(res => {
        if (res.head.errCode === 0) {
          this.processInstanceId = res.data[0].processInstanceId
          this.showApproval = true
          if (this.viewApprovalFlag) this.activeName = 'idCardAppoval'
        }
      })
    },
    // 提交审批内容之后地址切换到列表
    submitFn () {
      this.currentKey = new Date().getTime()
      this.$router.push({name: 'idcards'})
    },
    getInfo () {
      this.idCardLoading = true
      let params = { id: this.idCardId, isGroup: this.isGroup }
      idCardApi.getById(params).then(res => {
        if (res && res.data) {
          this.idCardData = res.data
          this.idCardName = res.data.name
          if (res.data.businessCode && !this.isGroup) this.getApprovalDetail(res.data.businessCode)
        }
        this.idCardLoading = false
      }).catch(() => {
        this.idCardLoading = false
      })
    },
    handleTabChange (tabData) {
      this.activeName = tabData.name
      if (tabData.id) this.idCardId = tabData.id
      if (this.idCardId) this.getInfo()
    }
  },
  components: {
    IdCardCon,
    AssociationAgency,
    approvalFlows
  }
}
</script>
