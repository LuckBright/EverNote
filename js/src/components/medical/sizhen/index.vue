<template>
  <div style="position:relative">
    <el-input type="textarea" ref="input" :rows="2" v-model="input" @focus="showDianno"></el-input>
    <diagno-dialog ref="diagno" :inputvalue.sync="input"></diagno-dialog>
  </div>
</template>
<script>
import diagnoDialog from './diagnodialog'
export default {
  props: ['value'],
  data () {
    return {
      input: ''
    }
  },
  watch: {
    'value' (val) {
      if (val) {
        this.input = val
      }
    },
    'input' (val) {
      this.$emit('update:value', val)
      this.$emit('input', val)
    }
  },
  created () {
    this.input = this.value
  },
  methods: {
    showDianno () {
      this.$refs.diagno.isShow = true
    }
  },
  components: {
    diagnoDialog
  }
}
</script>
