<template>
  <div>
    <el-button :disabled="disabled" type="primary" size="mini" @click="handle">预结算</el-button>
    <el-dialog :visible="uploadVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="30%" append-to-body>
      <div class="u" style="height: 100px; line-height: 80px;text-align: center;">
        共上传 {{uploadLen}} 条病历信息，请稍后...
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { preSettle } from '@/rcm/store/otmdiscomponent/hospital-medical.js'
import { commonHeadEvent } from '@/inpatient/components/common.head.model'
import getmacaddress from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
import { costUpload } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
import { gdcfybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  mixins: [getmacaddress],
  props: {
    itemData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      obj: {
        totalFee: 0,
        selfpayText: 0,
        overallPayText: 0,
        personcountpay: 0
      },
      gdcfybCode,
      loading: null,
      disabled: false,
      uploadVisible: false,
      uploadLen: 0
    }
  },
  created () {
    this.disabled = (this.itemData.stationConfig.find(item => { return item.displayName === '在院状态' }) || {value: ''})['value'] === '出院已结算'
    this.$bus.$on('gdcf:handlePreSettle', () => {
      this.handle()
    })
  },
  methods: {
    handle () {
      let insuranceOrgId = this.$store.state.gdcfInsuranceInfo.insuranceOrgId
      if (insuranceOrgId && insuranceOrgId === this.gdcfybCode) { // 如果当前结算单走的是医保，并且是长峰医保
        this.handleCf()
      } else {
        this.handlePreSettle()
      }
    },
    handleCf () {
      this.uploadLen = this.$store.state.gdcfInsuranceInfo.costDetailsLen || 0
      this.uploadVisible = true
      let params = {
        hospitalizedNumber: this.itemData.hospitalizedNumber
      }
      costUpload(params).then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '费用上传医保成功')
          this.uploadVisible = false
          // 重新获取预结算信息
          this.$bus.$emit(commonHeadEvent.refresh)
        }
      }, rj => {
        this.$messageTips(this, 'error', '费用上传医保失败')
        this.uploadVisible = false
      })
    },
    handlePreSettle () {
      if (!this.macId) {
        this.$messageTips(this, 'error', '未获取到macId，请刷新页面重新获取mac地址后，再来操作')
        return
      }
      let params = {
        ipNo: this.itemData.hospitalizedNumber,
        macId: this.macId
      }
      preSettle(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        // 重新获取预结算信息
        this.$bus.$emit(commonHeadEvent.refresh)
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.box {
  float: left;
  margin-right: 20px;
  height: 36px;
}
.box .boxContent {
  color: #000;
}
</style>
