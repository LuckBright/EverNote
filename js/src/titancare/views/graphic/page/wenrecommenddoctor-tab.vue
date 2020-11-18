<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="在线问诊" name="consult">
      <template v-if="activeName === 'consult'">
        <wenrecommenddoctor/>
      </template>
    </el-tab-pane>
    <el-tab-pane label="在线咨询" name="online">
      <template v-if="activeName === 'online'">
        <wenrecommenddoctor/>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import Wenrecommenddoctor from '@/titancare/views/graphic/page/wenrecommenddoctor'
  export default {
    components: { Wenrecommenddoctor },
    data () {
      return {
        activeName: 'consult'
      }
    },
    created() {
      if (!this.$route.query.tab) {
        this.handleClick({name: 'consult'})
      } else {
        this.activeName = this.$route.query.tab
      }
    },
    methods: {
      handleClick (tab) {
        this.activeName = tab.name
        this.$router.replace({
          query: {
            ...this.$route.query,
            tab: tab.name,
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .el-tab-pane {
    overflow: auto;
  }
</style>
