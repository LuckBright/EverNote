<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="客户标签" name="first">
      <cust-label-info :visiable="activeName"></cust-label-info>
    </el-tab-pane>
    <el-tab-pane label="客户行为记录" name="second">
      <cust-behavior-record :visiable="activeName"></cust-behavior-record>
    </el-tab-pane>
    <el-tab-pane label="业务限制" name="three">
      <limit-list :visiable="activeName"></limit-list>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import custLabelInfo from '@/crm/components/custlabelinfo'
  import custBehaviorRecord from '../components/custbehaviorrecord'
  import limitList from '@/crm/page/member/limit.list'
  export default {
    data () {
      return {
        activeName: 'first',
        patientId: this.$route.params.patientId ? this.$route.params.patientId : null
      }
    },
    components: {
      custLabelInfo,
      custBehaviorRecord,
      limitList
    }
  }
</script>
