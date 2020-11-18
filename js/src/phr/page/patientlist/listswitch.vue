<!--  -->
<template>
  <div class="list-switch" @click="go">
    <el-switch
      class="switch"
      v-model="listStatus"
      active-color="#ACC7F8"
      inactive-color="#BBC2D2"
    >
    </el-switch>
    列表
  </div>
</template>

<script>
export default {
  props: {
    status: Boolean
  },
  data () {
    return {
      listStatus: !!this.status
    }
  },

  components: {},

  computed: {},

  created () { },

  methods: {
    go () {
      this.$emit('go')
    }
  }
}

</script>
<style lang='scss' scoped>
.list-switch {
  position: absolute;
  right: 30px;
  top: 25px;
  z-index: 10;
  .switch {
    margin-right: 5px;
  }
  /deep/ .el-switch {
    .el-switch__core {
      width: 38px !important;
      height: 14px;
    }
    .el-switch.is-checked .el-switch__core:after {
      left: 100%;
      margin-left: -13px;
      background-color: #2265e1;
    }
    .el-switch__core:after {
      top: -4px;
      left: -1px;
      width: 20px;
      height: 20px;
    }
  }
  /deep/ .el-switch.is-checked .el-switch__core:after {
    left: 100%;
  }
  
}
</style>
