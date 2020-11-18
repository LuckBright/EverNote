<template>
  <div class="ever-tab">
    <div class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item @click="$router.push(pathUrl + '1')" :class="routerName.includes(pathName) && pathStatus == 1 ? 'is-active' : 'is-inactive'" index="OutpatientReview">
              {{pathName === 'outpatientreviewStatus' ? '未点评处方' : '未点评医嘱'}}
            </el-menu-item>
            <el-menu-item @click="$router.push(pathUrl + '2')" :class="routerName.includes(pathName) && pathStatus == 2 ? 'is-active' : 'is-inactive'" index="hospitalizationreview">
              {{pathName === 'outpatientreviewStatus' ? '已点评处方' : '已点评医嘱'}}
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <router-view :key="pathName"></router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pathUrl: '',
      pathName: 'outpatientreviewStatus',
      pathStatus: 1,
      routerName: ['hospitalizationreviewStatus', 'outpatientreviewStatus']
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log(to)
  // },
  watch: {
    '$route' (v) {
      this.pathUrl = v.path.substr(0, v.path.length - 1)
      this.pathStatus = v.path.substr(v.path.length - 1)
      this.pathName = v.name
    }
  }
}
</script>
