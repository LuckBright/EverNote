<template>
  <div class="basic-info">
    <!-- 标题 -->
    <h4>{{!objId || status ? '填写基本信息' : '基本信息'}}</h4>
    <!-- 表单 -->
    <ever-form2
      :schema="schema"
      :nosubmit="true"
      :rules="rules"
      class="from readform"
      v-model="obj">
      <!-- 取消原因 -->
      <template slot="abolitionReason">
        <tooltip-info :content="obj.abolitionReason"></tooltip-info>
      </template>
      <template slot="remark">
        <tooltip-info :content="obj.remark"></tooltip-info>
      </template>
      <template slot="auditOpinion">
        <tooltip-info :content="obj.auditOpinion"></tooltip-info>
      </template>
    </ever-form2>
  </div>
</template>

<script>
import tooltipInfo from '@/warehouse/page/components/tooltip.schema.vue'
export default {
  props: ['title', 'schema', 'obj', 'rules'],
  data () {
    return {
      objId: this.$route.params.id,
      status: this.$route.query.status, // 为1则代表暂存页面
    }
  },
  components: {
    tooltipInfo
  },
  watch: {
    'obj.storageRoomName' (val) {
      if (val) {
        this.$emit('changeStorage', val)
      } else {
        this.$emit('changeStorage', {})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.from /deep/ .el-form-item .el-form-item__label {
  color: #999;
}
.basic-info {
  .stripTips {
   height: 14px;
   line-height: 14px;
   color: #333333;
   font-size: 14px;
  //  .strip {
  //    width: 3px;
  //    height: 14px;
  //    background: #1C7BEF;
  //  }
 }
}
</style>
