<template>
  <div id="myrecharge">
    <ever-bread-crumb :name="objId ? '编辑会员卡' : '新增会员卡'" show-edit-fnt="false"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <el-tabs @tab-click="changeTabs" v-model="currTabs">
          <el-tab-pane label="打折卡" name="dzk" v-if="showDiscountCard">
            <discount-card :select-data="selectData" @addservice="showPop">
            </discount-card>
          </el-tab-pane>
          <el-tab-pane label="充赠卡" name="czk" v-if="showGiftCard">
            <recharge-card :select-data="selectData" @addservice="showPop">
            </recharge-card>
          </el-tab-pane>
          <el-tab-pane v-if="showApproval" label="审批详情" name="storedValueCardAppoval">
            <approval-flows :processInstanceId="processInstanceId" @onSubmit="submitFn" :key="currentKey"></approval-flows>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <service-dialog ref="service" :itemIds="selectData" @selectChange="selectChange"></service-dialog>
  </div>
</template>

<script>
  import discountCard from '../page/discountcardbatch'
  import rechargeCard from '../page/rechargecardbatch'
  import serviceDialog from '../../sob/page/servicedialog'
  import api from '../store/cardbatchapi'
  import approvalFlows from '@/message/page/approval.flows.vue'
  import urlMap from '@/systemset/urls'
  import { request } from '@/util/req'
  export default {
    data () {
      return {
        currTabs: '',
        dataSelected: [],
        selectData: [],
        showDiscountCard: true,
        showGiftCard: true,
        objId: this.$route.query.id,
        showApproval: false,
        processInstanceId: '',
        viewApprovalFlag: this.$route.query.viewApproval,
        currentKey: new Date().getTime()
      }
    },
    methods: {
      selectChange (selects) {
        this.selectData = []
        selects.forEach(item => {
          this.selectData.push(item)
        })
        return this.selectData
      },
      changeTabs (tab) {
        this.currTabs = tab.name
        this.selectData = []
        this.dataSelected = []
      },
      showPop () {
        this.$refs.service.onDialogOpen(this.currTabs, this.selectData)
      },
      // 根据businessCode查 processinstanceId 然后显示审批流
      getApprovalDetail (businessCode) {
        request(urlMap.process.getInstanceInfoByBusinessCode, {
          businessCode
        }).then(res => {
          if (res.head.errCode === 0) {
            this.processInstanceId = res.data[0].processInstanceId
            this.showApproval = true
            if (this.viewApprovalFlag) this.currTabs = 'storedValueCardAppoval'
          }
        })
      },
      submitFn () {
        this.currentKey = new Date().getTime()
        this.$router.push('/card/cardbatchlist')
      }
    },
    created () {
      this.objId = this.$route.query.id
      if (this.objId) {
        api.getById(this.objId).then(res => {
          if (res && res.data && res.data.type) {
            if (Number(res.data.type) === 1) {
              this.currTabs = 'czk'
              this.showDiscountCard = false
            } else {
              this.showGiftCard = false
              this.currTabs = 'dzk'
            }
          }
          if (res.data.businessCode) this.getApprovalDetail(res.data.businessCode)
        })
      } else {
        this.currTabs = 'dzk'
      }
    },
    components: {
      serviceDialog,
      rechargeCard,
      discountCard,
      approvalFlows
    }
  }
</script>
<style scoped>
</style>
