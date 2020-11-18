<template>
	<div id="mall">
		<el-row class="top">
      <el-col :span="12">
        <span class="title" @click="prevPage"><i class="el-icon-arrow-left"></i> 充值</span>
      </el-col>
      <el-col :span="12" align="right"></el-col>
    </el-row>
    <el-card style="min-height: 500px; text-align:center; padding-top:50px;">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="优惠卡号码" v-model="code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRecharege()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
	</div>
</template>
<script>
  import api from '../store/cartapi'
  import card from '../../card/store/cardbatchapi'
  export default {
    data () {
      return {
        api: api,
        code: '',
        rules: {
          // userInfo: [
          //   {required: true, message: '请选择持卡人', trigger: 'change', type: 'array'}
          // ]
        }
      }
    },
    methods: {
      prevPage () {
        window.history.go(-1)
      },
      submitRecharege () {
        card.getByCode(this.code).then(result => {
          if (result.data) {
            this.$router.push('/mallgoods/rechargebuy/' + this.code)
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>
