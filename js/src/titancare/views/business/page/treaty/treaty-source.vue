<template>
  <div>
    <div class="layout_inner">
      <el-divider content-position="left">执业申请配置</el-divider>
      院外医生在本院多点执业：<el-switch
        v-model="value"
        active-text="允许"
        inactive-text="禁止">
      </el-switch>
      <el-button @click='addClick' type="primary" size="small">保存</el-button>
    </div>
    <div class="layout_inner">
      <el-divider content-position="left">医院网址配置</el-divider>
      <el-form ref="form" label-width="150px" size="medium">
        <el-form-item label="互联网医院网址">
          <el-input type="textarea" v-model="configUrl" disabled :rows="1" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-clipboard:copy="configUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制链接</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="layout_inner">
      <el-divider content-position="left">APPlogo配置</el-divider>
      <img-comp></img-comp>
    </div>
    <div class="layout_inner">
      <el-divider content-position="left">协议配置</el-divider>
      <treaty></treaty>
    </div>
    <div class="layout_inner">
      <el-divider content-position="left">关于内容配置</el-divider>
      <text-comp></text-comp>
    </div>
  </div>
</template>
<script>
import treaty from './treaty'
import textComp from './text'
import imgComp from './img.comp'
import api from '@/titancare/api/homemanage/homemanageapi'

export default {
  components: {
    treaty,
    textComp,
    imgComp
  },
  data () {
    return {
      value: false,
      configUrl: this.$ever.host + this.$ever.unionIndex + '/home?tenant=' + localStorage.getItem('TENANTID')
    }
  },
  created () {
    this.applyClick()
  },
  methods: {
    // 多点执业状态显示
    applyClick () {
      api.getIHAllow().then(res => {
        if (res.errCode === 0) {
          this.value = res.data.configValue === '1'
        }
      })
    },
    // 多点执业状态切换方法
    addClick () {
      api.createOrUpdateIHAllow({ 'configValue': this.value ? '1' : '2' }).then(res => {
        if (res.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 操作系统复制成功提示
    onCopy () {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    // 复制失败提示
    onError () {
      this.$message.error('复制失败')
    }
  }
}
</script>
