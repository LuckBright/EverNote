<template>
  <div class="hospital-container">
    <div class="hospital-search">
      <el-input size="small" v-model="value"
      :clearable="true" :placeholder="placeholder || '处方单号/执行单号'" @keyup.enter.native="handelSearchPatient"></el-input>
      <!-- <el-button size="small" type="primary" @click="handelSearchPatient">查询</el-button> -->
    </div>
  </div>
</template>
<script>
export default {
  props: ['searchPatient', 'placeholder'],
  data () {
    return {
      value: ''
    }
  },
  methods: {
    handelSearchPatient () {
      this.$emit('handelSearchPatient')
    }
  },
  watch: {
    searchPatient (v) {
      this.value = v
      this.$emit('update:searchPatient', v)
    },
    value (v) {
      this.$emit('update:searchPatient', v)
    }
  }
}
</script>

<style lang="less" scoped>
.hospital-container .hospital-search {
  padding-bottom: 10px;
}
</style>

