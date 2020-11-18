<template>
  <div>
    <el-row>
      <el-col :span="4">拒绝退款原因:</el-col>
      <el-col :span="20">
        <el-input
          type="textarea"
          :minlength="2"
          :maxlength="120"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="拒绝退款，请必须填写此项。拒绝内容讲返回给患者。（2-120字）"
          v-model="refundReason"
        ></el-input>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button type="primary" @click="save" class="btn" :disabled="rejectdisabled">拒绝本订单全部退款申请</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/settlement'
import storage from '@/util/storage'
import { debounce } from '@/titancare/utils/common'

export default {
  data () {
    return {
      api,
      storage,
      refundReason: '',
      rejectdisabled: false
    }
  },
  methods: {
    save: debounce(function () {
      if (!this.refundReason) {
        this.$notify({
          message: '请填写拒绝退款原因',
          type: 'warning'
        })
        return false
      }
      if (this.refundReason.length < 2) {
        this.$notify({
          message: '拒绝原因不能少于2个文字',
          type: 'warning'
        })
        return false
      }
      let params = {
        refundReason: this.refundReason,
        settlementId: this.$route.query.id,
        userId: this.storage.getLocalStorage('USERID'),
        userName: this.storage.getLocalStorage('DISPLAYNAME')
      }
      this.rejectdisabled = true
      this.api.refuseBySettlementId(params).then(rs => {
        if (rs && rs.errCode === 0) {
          this.$notify({
            message: '全部拒绝',
            type: 'success'
          })
          this.rejectdisabled = false
          this.$emit('getsuccess')
        } else {
          this.rejectdisabled = false
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
.table {
  margin-top: 20px;
}
.mgl10 {
  margin-right: 10px;
}
.mgt10 {
  margin-top: 30px;
}
.footer {
  text-align: center;
  .btn {
    margin-top: 20px;
  }
}
</style>>
