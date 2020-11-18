<template>
  <div class='tipSee'>
    <span class='label-info'>医嘱开立时间：</span>
    <span class='value-info'>{{list.createTime || '--'}}</span>
    <span class='label-info'>医嘱支付时间：</span>
    <span class='value-info'>{{list.payTime}}</span>
    <span class='label-info'>处方号：</span>
    <span class='value-info'>{{list.recipeCode || '--'}}</span>
    <el-button v-if="list.serviceType !== '800' && list.serviceType !== '801'" class='tip-btn' @click='seeClick(list.recipeId)'>查看电子处方</el-button>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
export default {
  props: ['list'],
  data () {
    return {
      api,
      status: {
        0: '待审核',
        1: '审核驳回',
        2: '审核通过'
      }
    }
  },
  methods: {
    seeClick (id) {
      api.getElectronicRecipe({ 'recipeIds': [id] }).then(res => {
        if (!res.errCode && res.data && res.data.length > 0) {
          let obj = res.data[0]
          let url = ''
          if (obj.auditFileIds && obj.auditFileIds.length) {
            url = obj.auditFileIds[0]
          } else if (obj.fileIds && obj.fileIds.length) {
            url = obj.fileIds[0]
          }
          window.open(this.$ever.fileUrl2 + url)
        } else {
          this.$message.warning('暂无电子处方')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tipSee{
  margin-top: 20px;
  font-size: 14px;
  line-height: 14px;
  .label-info{
    color: #999;
  }
  .value-info{
    color: #333;
    margin-right: 20px;
  }
  .tip-btn{
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
