<template>
  <span>
    <el-popover
      placement="bottom"
      width="260"
      trigger="hover"
      popper-class="ever_popover_01 msg_popover"
      :close-delay="700">
      <div class="container_box">
        <div @click="showComment(1)" class="top_div">
          <span>
            <i class="iconfont icon-cry textr"></i>
            {{ $t('告诉我们需要改进的功能') }}
          </span>
        </div>
        <div @click="showComment(2)" class="bot_div">
          <span>
            <i class="iconfont icon-smile textr"></i>
            {{ $t('告诉我们您喜欢的功能') }}
          </span>
        </div>
      </div>
      <el-badge class="spe_el-badge item" slot="reference">
        <i class="iconfont icon-smile"></i>
      </el-badge>
    </el-popover>
    <feedback-dialog ref="feedback" :key="tmpKey" :type="type" :visible.sync="visible"></feedback-dialog>
  </span>
</template>

<script>
import feedbackDialog from '@/login/page/feedback.dialog'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

export default {
  data () {
    return {
      visible: false,
      tmpKey: U(),
      type: 1
    }
  },
  created () {
  },
  methods: {
    showComment (val) {
      this.tmpKey = U()
      this.visible = true
      this.type = val
      this.$refs.feedback.init()
    },
  },
  components: {
    feedbackDialog
  }
}
</script>
<style lang="scss" scoped>
.container_box {
  height: 90px;
}
.top_div {
  height: 25px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0px;
}
.bot_div {
  height: 25px;
  padding: 10px 0px;
}
.textl {
  text-align: left;
  margin-left: 10px;
}
.textr {
  margin-right: 20px;
  margin-left: 40px;
}
.el-popover.msg_popover a.boxfooter {
  display: block;
  color: #1c7bef;
  text-align: center;
  background: #f8f8f8;
  padding: 14px 0;
  font-size: 16px;
  text-decoration: none;
}
.el-popover.msg_popover a.boxfooter:hover {
  text-decoration: none;
}
.top_div:hover {
  color: #1c7bef;
  cursor: pointer;
}
.bot_div:hover {
  color: #1c7bef;
  cursor: pointer;
}
.top_div > span {
  line-height: 24px;
}
.bot_div > span {
  line-height: 24px;
}
</style>
