<template>
  <el-popover
    placement="right"
    width="150"
    trigger="click"
    @hide="hide">
		<el-radio-group v-model="radioNum" @change="changeVal">
		   <el-row>
		       <el-radio :label="-1">全部</el-radio>
		   </el-row>
       <el-row>
           <el-radio :label="1">预约使用</el-radio>
       </el-row>
       <el-row>
           <el-radio :label="2">挂号使用</el-radio>
       </el-row>
       <el-row>
           <el-radio :label="3">微信小程序</el-radio>
       </el-row>
       <el-row>
           <el-radio :label="4">预留</el-radio>
       </el-row>
    </el-radio-group>
    <div slot="reference" class="number">{{tips}} {{dataNum}}</div>
  </el-popover>
</template>
<script>
  export default {
    props: {
      dataNum: undefined,
      basesetTimesliceId: undefined,
      channelId: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        radioNum: this.channelId,
        tips: ''
      }
    },
    watch: {
      channelId: function (a, b) {
        this.tips = a === 1 ? '预' : a === 2 ? '挂' : a === 3 ? '微' : a === 4 ? '留' : ''
      }
    },
    methods: {
      changeVal (e) {
        this.radioNum = e
        this.tips = e === 1 ? '预' : e === 2 ? '挂' : e === 3 ? '微' : e === 4 ? '留' : ''
      },
      hide () {
        this.$emit('pup', this.radioNum, this.basesetTimesliceId)
      }
    },
    created () {
      this.radioNum = this.channelId
      this.tips = this.radioNum === 1 ? '预' : this.radioNum === 2 ? '挂' : this.radioNum === 3 ? '微' : this.radioNum === 4 ? '留' : ''
    }
  }
</script>
<style scoped>
		.el-row{margin: 5px;}
</style>
