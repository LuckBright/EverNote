<template>
  <div>
    <el-container style="border: 1px solid #bbb">
      <el-aside width="353px" class="pos_re">
        <package-directory :packageDetails="packageDetails" :isGroupControl="isGroupControl"></package-directory>
      </el-aside>
      <tab-doctor-advice :packageDetails="packageDetails" :isGroupControl="isGroupControl"></tab-doctor-advice>
    </el-container>
  </div>
</template>
<script>
import PackageDirectory from '@/card/page/marketingpackage/packagedirectory'
import TabDoctorAdvice from '@/card/page/marketingpackage/tabdoctoradvice'
export default {
  props: ['packageDetails', 'isGroupControl'],
  data () {
    return {
      packageDetailsCon: {}
    }
  },
  created () {

  },
  methods: {
  },
  components: {
    PackageDirectory,
    TabDoctorAdvice
  }
}
</script>
<style scoped>
.el-aside { box-shadow: none !important; border-right: 1px solid #bbbbbb; height: 100%; }
</style>
