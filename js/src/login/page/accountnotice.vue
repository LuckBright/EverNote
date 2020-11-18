<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :key="currentKey"
    :width="width">
    <div class="cnt" style="text-align:center;padding: 10px 0 20px">
      您的登录账号已发生变化，请刷新页面继续使用！
    </div>
    <div slot="footer" align="center">
      <!-- <el-button type="default" @click="handleClose">关闭</el-button> -->
      <el-button type="primary" @click="handleSel">刷新</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { wsConnect } from '@/util/common/'
import { resetPath } from './account.notice'

export default {
  props: {
    title: {
      type: String,
      default: '账号信息变化'
    },
    width: {
      type: String,
      default: '400px'
    },
  },
  data () {
    return {
      dialogVisible: false,
      currentKey: new Date().getTime(),
    }
  },
  created () {
    this.listenStorage()
    this.listenUserNotify()
  },
  methods: {
    listenStorage () {
      let that = this
      window.onstorage = function (e) {
        if (e.key === 'TOKEN') {
          if (localStorage.getItem('TOKEN') === e.newValue) {
            that.dialogVisible = true
          }
        }
      }
    },
    listenUserNotify () {
      // wsConnect('/exchange/exchange.thc-platform-core.business.user_op_notify/routingKey.thc-platform-core.business.user_op_notify', (client, d) => {
      //   let body = JSON.parse(d.body)
      //   console.log(body.body)
      // })
    },
    handleSel () {
      let url
      // 有些工作台需要回到初始配置页面，可以在 ./accountnotice 中配置 ACCOUNT_NOTICE
      if ((url = resetPath(this.$route.path))) {
        this.$router.push(url)
      }
      location.reload()
    },
    handleClose () {
      this.dialogVisible = false
    }
  },
}
</script>
