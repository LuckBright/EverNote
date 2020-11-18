<template>
  <div>
    <ever-bread-crumb :name="giftbatchName || '新建优惠卷'" path="/card/giftbatchs"></ever-bread-crumb>
    <div class="layout_inner">
      <el-tabs v-model="activeName" v-loading.body="giftbatchLoading">
        <el-tab-pane label="基本信息" name="giftbatchInfo">
          <giftbatch-con
            :dataDetails="giftbatchData"
          ></giftbatch-con>
        </el-tab-pane>
        <el-tab-pane v-if="showApproval" label="审批详情" name="giftbatchAppoval">
          <approval-flows :processInstanceId="processInstanceId" @onSubmit="submitFn" :key="currentKey"></approval-flows>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import GiftbatchCon from '@/card/page/coupon/giftbatch'
import api from '@/card/store/giftbatchapi'
import approvalFlows from '@/message/page/approval.flows.vue'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'
export default {
  data () {
    return {
      giftbatchName: '',
      activeName: 'giftbatchInfo',
      giftbatchId: this.$route.query.id,
      viewApprovalFlag: this.$route.query.viewApproval,
      giftbatchData: {},
      giftbatchLoading: false,
      showApproval: false,
      processInstanceId: '',
      currentKey: new Date().getTime()
    }
  },
  created () {
    if (this.giftbatchId) this.getInfo()
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
          if (this.viewApprovalFlag) this.activeName = 'giftbatchAppoval'
        }
      })
    },
    // 提交审批内容之后地址切换到列表
    submitFn () {
      this.currentKey = new Date().getTime()
      this.$router.push(`/card/giftbatchs`)
    },
    getInfo () {
      this.giftbatchLoading = true
      api.getById(this.giftbatchId).then(res => {
        if (res && res.data) {
          this.giftbatchData = res.data
          this.giftbatchName = res.data.name
          if (res.data.businessCode) this.getApprovalDetail(res.data.businessCode)
        }
        this.giftbatchLoading = false
      }).catch(() => {
        this.giftbatchLoading = false
      })
    },
  },
  components: {
    GiftbatchCon,
    approvalFlows
  }
}
</script>
