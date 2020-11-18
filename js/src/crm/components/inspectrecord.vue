<template>
  <div>
    <other-record></other-record>
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="检验" name="first">
        <jian-yan :visiable="activeName" :patientId="patientId"></jian-yan>
      </el-tab-pane>
      <el-tab-pane label="检查" name="second">
        <jian-cha :visiable="activeName" :patientId="patientId"></jian-cha>
      </el-tab-pane>
      <el-tab-pane label="客户上传报告" name="third">
        <other-record :visiable="activeName"></other-record>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script>
// import JianCha from '@/components/phr/jiancha'
// import JianYan from '@/components/phr/jianyan'
import otherRecord from '../components/otherrecord'
export default {
  data () {
    return {
      // activeName: 'first',
      // patientId: this.$route.params.patientId
    }
  },
  watch: {
    // 'activeName': {
    //   handler: function (val) {
    //   },
    //   immediate: true
    // }
  },
  methods: {
  },
  components: {
    // JianCha,
    // JianYan,
    otherRecord
  }
}
</script>
