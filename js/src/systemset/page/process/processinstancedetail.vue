<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="layout_inner oa">
      <div v-if="processType === '1'">
        <p>当前流程图</p>
        <img v-if="processSrc" :src="processSrc" alt="">
      </div>
      <div>
        <approval-flows v-if="instanceId" :processInstanceId="instanceId" @getProcessObj="getObj" @onSubmit="submitFn"></approval-flows>
      </div>
    </div>
  </div>
</template>
<script>
  import approvalFlows from '@/message/page/approval.flows.vue'
  export default {
    components: {approvalFlows},
    data () {
      return {
        instanceId: '',
        processType: '',
        processSrc: '',
      }
    },
    created () {
      this.instanceId = this.$route.params.instanceId
      this.processType = this.$route.params.processType
      this.processSrc = `${this.$ever.api}/process-engine/ext/process/getInstanceImgResource?processInstanceId=${this.instanceId}`
    },
    methods: {
      getObj () {},
      submitFn () {},
    },
  }
</script>
<style scoped lang="less">
</style>
