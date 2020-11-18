<template>
  <el-dialog
    ref="everdialog"
    class="ui_dialog_02 spe"
    title="通知公告详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="650px"
  >
    <el-form ref="myform" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题，26个字以内" :disabled="edit"></el-input>
      </el-form-item>
      <el-form-item label="摘要：" prop="content">
        <el-input type="textarea" v-model="form.content" :rows="3" placeholder="请输入摘要，150个字以内" show-word-limit maxlength="150" :disabled="edit"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接：" prop="linkUrl">
        <el-input v-model="form.linkUrl" placeholder="选填" :disabled="edit"></el-input>
      </el-form-item>
      <el-form-item label="接收客户端：" prop="receiveClient">
        <el-radio-group v-model="form.receiveClient">
          <el-radio :label="0" :disabled="edit">医生端</el-radio>
          <el-radio :label="1" :disabled="edit">患者端(仅支持小程序关联的微信公众号链接或小程序内链)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送时间：" class="time" prop="sendTime">
        <el-radio-group v-model="form.sendTiming">
          <el-radio :label="0" :disabled="edit">立即发送</el-radio>
          <el-radio :label="1" :disabled="edit">定时发送</el-radio>
        </el-radio-group>
        <el-date-picker
          v-model="form.sendTime"
          :disabled="edit"
          class="ml10 pl"
          type="datetime"
          placeholder="选择日期时间"
          v-show="form.sendTiming === 1"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancel" :disabled="edit">取消</el-button>
      <el-button type="primary" @click="onSubmit(form)" :disabled="edit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { debounce } from '@/titancare/utils/common'
import storage from '@/util/storage'

export default {
  props: ['api'],
  data () {
    return {
      dialogVisible: false,
      edit: false, // 默认可编辑1
      form: {
        title: '',
        content: '',
        linkUrl: '',
        receiveClient: 0,
        sendTiming: 0,
        sendTime: ''
      },
      rules: {
        title: [{ max: 26, message: '最多26个字符', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
          { max: 150, message: '最多150个字符', trigger: 'blur' }
        ],
        linkUrl: [
          {
            validator: (rule, value, callback) => {
              if (value && value.includes('http') === false) {
                callback(new Error('请输入正确的网址'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        sendTime: [
          {
            validator: (rule, value, callback) => {
              if (this.form.sendTiming === 1 && (value === '' || value === null)) {
                callback(new Error('请选择发送时间'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    // 切换清除
    // 'form.receiveClient': {
    //   handler (val, oldVal) {
    //     if (val === 1 && val !== oldVal) {
    //       this.form.linkUrl = ''
    //       this.$refs.myform.clearValidate('linkUrl')
    //     }
    //   }
    // },
    'form.sendTiming': {
      handler (val, oldVal) {
        if (val === 0) {
          this.$refs.myform.clearValidate('sendTime')
        }
      }
    }
  },
  methods: {
    onSubmit: debounce(function () {
      this.$refs.myform.validate((valid) => {
        if (valid) {
          if (this.form.sendTiming === 0) {
            this.form.sendTime = ''
          } else {
            this.form.sendTime = this.$moment(this.form.sendTime).format('YYYY-MM-DD HH:mm:ss')
            if (this.$moment(this.form.sendTime).isBefore(this.$moment().format('YYYY-MM-DD HH:mm:ss'))) {
              this.$notify({
                message: '定时发送时间不能小于当前时间',
                type: 'warning'
              })
              return false
            }
          }
          this.form.tenantId = storage.getLocalStorage('TENANTID') || storage.getLocalStorage('TENANTIDCARE')
          this.api.createAndUpdate(this.form).then(rs => {
            if (rs.errCode === 0) {
              this.$notify({
                message: '保存成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.reset()
              this.$emit('seachList')
            }
          })
        }
      })
    }),
    open (v) {
      if (v === 'created') {
        this.reset()
      } else {
        this.form = Object.assign({}, this.form, v)
        if (this.form.status) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    cancel () {
      this.dialogVisible = false
      this.reset()
    },
    reset () {
      this.form = {
        title: '',
        content: '',
        linkUrl: '',
        receiveClient: 0,
        sendTiming: 0,
        sendTime: ''
      }
      this.edit = false
    }
  }
}
</script>
<style scoped>
>>> .el-form-item{margin-bottom: 15px;}
</style>
