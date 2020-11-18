<template>
  <div class="homePage">
    <el-row :gutter="10" class="mb10">
      <el-col :span="12">
        <home-early-warning></home-early-warning>
      </el-col>
      <el-col :span="12">
        <home-statistice-today></home-statistice-today>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
      <el-col :span="24">
        <div class="home home-default">
          <div class="home-body taskWar">
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import homeEarlyWarning from '@/warehouse/page/Integrated/component/home.early.warning.vue'
import homeStatisticeToday from '@/warehouse/page/Integrated/component/home.statistics.today.vue'

export default {
  data () {
    return {
    }
  },
  async created () {
  },
  components: {
    homeEarlyWarning,
    homeStatisticeToday
  }
}
</script>

<style lang="less" scoped>
.taskWar {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

