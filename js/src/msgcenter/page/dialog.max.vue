<template>
  <el-dialog :visible.sync="miniDialog" custom-class="ui_dialog_01 w_01">
    <div style="height:100px;padding:20px;text-align: center;font-size: 16px">
      <span>设置每日短信数量（不填写表示不限制条数）</span>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="dayMaxSend" class="custom-form-item">
          <el-input
            v-model.trim="form.dayMaxSend"
            placeholder="请输入数量（不填写表示不限制条数）"
            style="margin-top: 25px;"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="spe" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'
import { formCheckPositiveInt } from '@/util/validate'

export default {
  data () {
    return {
      miniDialog: false,
      form: {
        dayMaxSend: '',
      },
      rules: {
        dayMaxSend: [
          { required: false, validator: formCheckPositiveInt, maxValue: 9999999999, minValue: 1, trigger: ['change', 'blur'] }
        ],
      }
    }
  },
  created () {
    request(urlMap.msg.sms.getDayMaxSend, {}, 'get').then(res => {
      if (res.head.errCode === 0) {
        this.form.dayMaxSend = (res.data === -1) ? '' : res.data
      }
    })
  },
  methods: {
    open () {
      this.miniDialog = true
    },
    cancel () {
      this.miniDialog = false
      this.form.dayMaxSend = ''
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          request(urlMap.msg.sms.setDayMaxSend, {
            dayMaxSend: this.form.dayMaxSend
          }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '成功', '每日发送最大条数设置成功')
              this.$emit('success')
              this.miniDialog = false
            }
          })
        }
      })
    }
  },
}
</script>
