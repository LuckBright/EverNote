<template>
  <div class="layout_inner" style="width:600px">
    <el-input v-model="tempAddress"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    'value': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tempAddress: this.value
    }
  },
  methods: {
  },
  watch: {
    'tempAddress': function (newVal) {
      // 必须是input
      this.$emit('input', newVal)
    }
  }
}
</script>
