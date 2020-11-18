<template>
  <div>
    <ever-bread-crumb haveReturn="true" showTitle="true" :name="activityName || '新建活动'" :path="isGroup ? '/manages/activitys/' : '/card/activitys/'"></ever-bread-crumb>
    <div class="layout_inner">
      <el-tabs v-model="activeName" v-loading.body="activityLoading">
        <el-tab-pane label="基本信息" name="activityInfo">
          <activity-con
            :dataDetails="activityData"
            @tabChange="handleTabChange"
            :isGroupControl="isGroupControl"
          ></activity-con>
        </el-tab-pane>
        <el-tab-pane
          v-if="isGroup"
          :disabled="activityId ? false : true"
          label="适用地区"
          name="activityMechanism"
        >
          <association-agency :dataDetails="activityData"></association-agency>
        </el-tab-pane>
        <el-tab-pane v-if="showApproval" label="审批详情" name="activeAppoval">
          <approval-flows :processInstanceId="processInstanceId" @onSubmit="submitFn" :key="currentKey"></approval-flows>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ACTIVITY_FILE_TYPE } from '@/util/common'
import ActivityCon from '@/card/page/activitymanagement/activityadd'
import AssociationAgency from '@/card/components/associationagency'
import api from '@/card/store/activityapi'
import packageManagementApi from '@/card/store/packagemanagement/api'
import approvalFlows from '@/message/page/approval.flows.vue'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'
export default {
  data () {
    return {
      activityName: '',
      activeName: 'activityInfo',
      activityId: this.$route.query.id,
      viewApprovalFlag: this.$route.query.viewApproval,
      activityData: {},
      activityLoading: false,
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      isGroupControl: false,
      showApproval: false,
      processInstanceId: '',
      currentKey: new Date().getTime()
    }
  },
  created () {
    if (this.activityId) this.getInfo()
    if (!this.isGroup) { // 查询机构是否可编辑
      packageManagementApi.getClinicManageConfigForRecord({ type: ACTIVITY_FILE_TYPE }).then(res => {
        if (res && res.data) this.isGroupControl = (String(res.data.isConfig) === '1')
      })
    }
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
          if (this.viewApprovalFlag) this.activeName = 'activeAppoval'
        }
      })
    },
    // 提交审批内容之后地址切换到列表
    submitFn () {
      this.currentKey = new Date().getTime()
      this.$router.push(`${this.isGroup ? '/manages/activitys/' : '/card/activitys/'}`)
    },
    getInfo () {
      this.activityLoading = true
      api.getById({ id: this.activityId, isGroup: this.isGroup }).then(res => {
        if (res && res.data) {
          this.activityData = res.data
          this.activityName = res.data.name
          if (res.data.businessCode && !this.isGroup) this.getApprovalDetail(res.data.businessCode)
        }
        this.activityLoading = false
      }).catch(() => {
        this.activityLoading = false
      })
    },
    handleTabChange (tabData) {
      this.activeName = tabData.name
      if (tabData.id) this.activityId = tabData.id
      if (this.activityId) this.getInfo()
    }
  },
  components: {
    ActivityCon,
    AssociationAgency,
    approvalFlows
  }
}
</script>
