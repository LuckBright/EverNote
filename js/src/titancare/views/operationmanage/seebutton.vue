<template>
  <div class="tipSee">
    <div v-if="show" class="top-tip">
      <span class="label-info">开方医生：</span>
      <span class="value-info">{{values.orderDoctorSignature}}</span>
      <span class="label-info">开方时间：</span>
      <span class="value-info">{{values.createTime}}</span>
      <span class="label-info">开方号：</span>
      <span class="value-info">{{values.recipeCode}}</span>
      <el-button class="tip-btn" @click="seeClick(values.recipeId)">查看电子处方</el-button>
    </div>
    <div v-else>
      <span class="label-info">医嘱开立时间：</span>
      <span class="value-info">{{values.createTime}}</span>
      <span class="label-info">医嘱支付时间：</span>
      <span class="value-info">{{values.payTime}}</span>
      <span class="label-info">处方号：</span>
      <span class="value-info">{{values.recipeCode}}</span>
      <el-button class="tip-btn" @click="seeClick(values.recipeId)">查看电子处方</el-button>
    </div>
  </div>
</template>
<script>
import { requestIh } from '@/util/req'
import urlMap from '@/titancare/utils/urls.js'

export default {
  props: ['values', 'show', 'status'],
  data () {
    return {
    }
  },
  methods: {
    seeClick (id) {
      requestIh(urlMap.recipeOrder.getElectronicRecipe, { 'recipeIds': [id] }).then(res => {
        console.log('res', res, this.status)
        if (!res.errCode && res.data && res.data.length) {
          let url = this.status === 2 ? res.data[0].auditFileIds[0] : res.data[0].fileIds[0]
          window.open(this.$ever.fileUrl2 + url)
        } else {
          this.$message.warning('暂无电子处方')
        }
      }, _ => { })
    }
  }
}
</script>
<style lang="less" scoped>
.tipSee {
  margin-top: 20px;
  font-size: 14px;
  line-height: 14px;
  .label-info {
    color: #999;
  }
  .value-info {
    color: #333;
    margin-right: 20px;
  }
  .top-tip {
    height: 32px;
    background: #f0f5fa;
    padding: 2px 10px;
    margin: 10px 0;
  }
  .tip-btn {
    height: 24px;
    line-height: 3px;
    font-size: 12px;
    color: #1c7bef;
    background: #fff;
    border: 1px solid #1c7bef;
    border-radius: 2px;
    margin-top: 3px;
  }
}
</style>
