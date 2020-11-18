<template>
  <el-row>
    <el-col :span="24">
      <el-radio-group v-model="form.sendType">
        <el-radio :label="0">短信</el-radio>
        <el-radio :label="1" v-if="!type || type===1">微信</el-radio>
        <el-radio :label="2" v-if="type===2">站内信</el-radio>
      </el-radio-group>
    </el-col>
    <el-col :span="24">
      <el-input type="textarea" :rows="5" v-model="form.title" maxlength="120" minlength="2" placeholder="请填写标题"></el-input>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['value', 'type'],
  data () {
    return {
      form: {
        sendType: 0,
        title: ''
      }
    }
  },
  watch: {
    'value' (val) {
      this.form = val || {
        sendType: 0,
        title: ''
      }
    },
    'form': {
      handler (val) {
        this.$emit('update:value', val)
      },
      deep: true
    },
    'form.sendType' () {
      this.form.title = ''
    }
  }
}
</script>
