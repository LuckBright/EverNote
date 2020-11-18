<!--  -->
<template>
  <el-card class="inline-block box-card">
    <div v-if="data.name">
      <div class="mb20 ellipsis">
        <span class="grey">姓名：</span><span>{{ data.name }}</span>
      </div>
      <div class="mb20 ellipsis">
        <span class="grey">性别：</span
        ><sys-value type="GBT.2261.1" :code="data.sex"></sys-value>
      </div>
      <div class="mb20">
        <span class="grey">出生日期：</span
        ><span>{{
          data.birthday ? $moment(data.birthday).format('YYYY-MM-DD') : '暂无'
        }}</span>
      </div>
      <div>
        <span class="grey">患者档案号：</span
        ><span>{{ data.patientNumber }}</span>
      </div>
    </div>
    <div v-else>
      <h2 class="alg_c">暂未选</h2>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  created () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.box-card {
  width: 280px;
  height: 160px;
}
.grey {
  color: #999999;
}
</style>
