<template>
  <el-popover
    placement="bottom"
    width="150"
    trigger="click"
		popper-class="popperClass"
		@hide="hide()">
		<el-radio-group v-model="radioNum" @change="changeVal">
      <el-radio :label="-1">全部</el-radio><br>
      <el-radio :label="1">预约使用</el-radio><br>
      <el-radio :label="2">挂号使用</el-radio><br>
			<el-radio :label="3">微信小程序</el-radio><br>
			<el-radio :label="4">预留</el-radio>
    </el-radio-group>
    <div slot="reference" class="number">{{dataNum}}</div>
  </el-popover>
</template>
<script>
  export default {
    props: ['dataNum', 'basesetTimesliceId'],
    data () {
      return {
        radioNum: -1
      }
    },
    methods: {
      hide () {
        this.$emit('pup', this.radioNum, this.basesetTimesliceId)building
      },
      changeVal (e) {
        this.radioNum = e
      }
    }
  }
</script>
<style scoped>
		.popperClass{height: 300px;}
</style>
