<template>
  <div class="text">
    <p>
      <span>患者</span>
      <span class="span-tip">说明：本设置用于患者小程序关于中的文案提示</span>
      <el-input class="text-input" v-model="textObj.memberText" type="textarea" :rows="3" maxlength="500" placeholder="请输入患者小程序关于中的文案提示，500字以内" show-word-limit></el-input>
    </p>
    <p>
      <span>医生</span>
      <span class="span-tip">说明：本设置用于医生APP关于中的文案提示</span>
      <el-input class="text-input"  v-model="textObj.doctorText" type="textarea" :rows="3" maxlength="500" placeholder="请输入医生APP关于中的文案提示，500字以内" show-word-limit></el-input>
    </p>
    <p>
      <el-button type="primary" @click="sendBtn">保存</el-button>
    </p>
  </div>
</template>
<script>
import api from '@/titancare/api/business/index'
export default {
  data () {
    return {
      textObj: {
        memberText: '',
        doctorText: ''
      }
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      api.getAppAboutTextConfig().then(rs => {
        if (!rs.errCode) {
          this.textObj = { ...this.textObj, ...rs.data }
        }
      })
    },
    sendBtn () {
      let params = { ...this.textObj }
      api.createOrUpdateAppAboutTextConfig(params).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .text {
    .text-input {
      width: 50%;
      margin: 10px 0;
      display: block;
    }
    .span-tip {
      display: inline-block;
      color: #333;
      font-size: 12px;
      margin-left: 30px;
    }
  }
</style>
