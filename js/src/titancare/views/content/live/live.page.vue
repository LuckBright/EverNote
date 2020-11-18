<template>
  <div class="layout_inner live-comp">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="playback ? '直播回放' : '直播聊天'" name="1">
        <live-chat v-if="!playback && activeName === '1'"></live-chat>
        <live-playback v-if="playback" :data="liveRoom"></live-playback>
      </el-tab-pane>
      <el-tab-pane label="快速咨询" name="2" v-if="!playback">
        <customer-service
          v-if="!playback && activeName === '2'"
        ></customer-service>
      </el-tab-pane>
      <el-tab-pane label="带货数据" name="3">
        <bringgoods :live-room="liveRoom"></bringgoods>
      </el-tab-pane>
    </el-tabs>
    <p class="live-setting">
      <a :href="downloadUrl" ref="download" download="咨询数据"></a>
      <el-button size="small" @click="exportInfo" :disabled="!sig"
        >导出咨询数据</el-button
      >
      <el-button size="small" @click="liveGoodsDialog = true" v-if="!playback"
        >带货配置</el-button
      >
      <el-button size="small" v-if="!playback" @click="openSetting" :loading="settingLoading && !settingDialog"
        >设置</el-button
      >
    </p>
    <el-dialog title="数据分析" :visible.sync="analysisDialog" width="30%">
      <div class="analysis">
        <div>
          <p>
            <img src="../../../assets/img/shijian.png" alt="" />
          </p>
          <p class="p-shuju">
            <span class="span-shuju">{{ liveObj.time }}</span>
          </p>
          <p>
            <span class="span-label">直播时间</span>
          </p>
        </div>
        <div class="center-div">
          <p>
            <img src="../../../assets/img/renshu.png" alt="" />
          </p>
          <p class="p-shuju">
            <span class="span-shuju">{{ liveObj.watchNum }}</span>
          </p>
          <p>
            <span class="span-label">观看人数</span>
          </p>
        </div>
        <div>
          <p>
            <img src="../../../assets/img/liaotian.png" alt="" />
          </p>
          <p class="p-shuju">
            <span class="span-shuju">{{ liveObj.chatNum }}</span>
          </p>
          <p>
            <span class="span-label">聊天人数</span>
          </p>
        </div>
      </div>
      <div class="analysis ml10 mt10">
        <div>
          <p>
            <img src="../../../assets/img/zixun.png" alt="" />
          </p>
          <p class="p-shuju">
            <span class="span-shuju">{{ liveObj.numberOfConsulting }}</span>
          </p>
          <p>
            <span class="span-label">咨询人数</span>
          </p>
        </div>
        <div class="center-div">
          <p>
            <img src="../../../assets/img/shuliang.png" alt="" />
          </p>
          <p class="p-shuju">
            <span class="span-shuju">{{ liveObj.saleGoodsNum }}</span>
          </p>
          <p>
            <span class="span-label">带货总数量</span>
          </p>
        </div>
        <div>
          <p>
            <img src="../../../assets/img/jine.png" alt="" />
          </p>
          <p class="p-shuju">
            <span class="span-shuju">{{ liveObj.saleTotalCount }}</span>
          </p>
          <p>
            <span class="span-label">带货总金额</span>
          </p>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="设置"
      :visible.sync="settingDialog"
      width="40%"
      class="setting-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-loading="settingLoading">
        <p>
          <span class="span-label">谁能发言：</span>
          <el-radio v-model="radio" label="1">所有人</el-radio>
          <el-radio v-model="radio" label="2">全体禁言</el-radio>
        </p>
        <div class="p-flex">
          <span class="span-label">屏蔽关键词：</span>
          <span class="span-input">
            <span class="row-span">
              <el-input
                v-model.trim="keyText"
                size="small"
                style="width: 70%"
                placeholder="请输入关键词"
              ></el-input>
              <i class="el-icon-plus icon-i" @click="addClick"></i>
            </span>
          </span>
        </div>
        <div class="keyword mb10">
          <el-tag
            class="ml10 mb10"
            :key="index"
            v-for="(item, index) in keyWord"
            closable
            :disable-transitions="false"
            @close="deleteClick(index)"
          >
            {{ item.value }}
          </el-tag>
        </div>
        <div class="p-flex" v-show="radio !== '2'">
          <span class="span-label">解锁屏蔽：</span>
          <span class="span-input">
            <span class="row-span">
              <el-select
                style="width: 70%"
                v-model="blackIDArr"
                size="small"
                multiple
                placeholder="请输入用户名搜索已屏蔽的用户"
                filterable
              >
                <el-option
                  v-for="item in blackList"
                  :key="item.imId"
                  :label="item.nickName"
                  :value="item.imId"
                >
                </el-option>
              </el-select>
            </span>
          </span>
        </div>
        <p class="p-btn">
          <el-button type="primary" @click="sendNoInfoBtn">确认</el-button>
          <el-button @click="settingDialog = false">取消</el-button>
        </p>
      </div>
    </el-dialog>
    <el-dialog
      title="带货配置"
      :visible.sync="liveGoodsDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <goods-setting v-if="liveGoodsDialog"></goods-setting>
    </el-dialog>
  </div>
</template>
<script>
import liveChat from './live.chat'
import goodsSetting from './goods.setting'
import customerService from '@/titancare/views/content/live/customer.service'
import api from '@/titancare/api/content/live.js'
import playback from '@/titancare/api/content/playback'
import livePlayback from '@/titancare/views/content/playback/live.playback'
import bringgoods from '@/titancare/views/content/live/customer/bringgoods'

export default {
  components: {
    liveChat,
    customerService,
    goodsSetting,
    livePlayback,
    bringgoods
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.state.im) {
        vm.$store.dispatch('getSig', !vm.playback)
      }
    })
    next(true)
  },
  data () {
    return {
      activeName: '1',
      analysisDialog: false,
      settingDialog: false,
      radio: '1',
      keyWord: [],
      keyText: '',
      liveObj: {
        time: '00:00:00',
        watchNum: 0,
        chatNum: 0
      },
      liveRoom: {},
      liveGoodsDialog: false,
      blackList: [],
      blackIDArr: [],
      playback: false,
      downloadUrl: '',
      receivedList: [],
      settingLoading: true
    }
  },
  computed: {
    sig () {
      return this.$store.state.sig
    }
  },
  created () {
    this.liveRoom = { ...JSON.parse(this.$route.query.liveRoom) }
    if ('playbackUrl' in this.liveRoom) {
      this.playback = true
    } else {
      this.getNOInfo()
    }
    this.activeName = this.liveRoom.activeName
    if (!this.liveRoom.activeName) {
      this.activeName = '1'
    }
    console.log('this.liveRoom :>> ', this.liveRoom)
  },
  methods: {
    openSetting () {
      this.settingLoading = true
      this.settingDialog = true
      this.getNOInfo()
    },
    async exportInfo () {
      await this.getConsultingImUsers()
      if (!this.receivedList.length) {
        this.$message(
          {
            message: '暂无咨询数据！',
            type: 'info'
          })
        return
      }
      const id = this.liveRoom.videoRecordId || this.liveRoom.id
      this.downloadUrl = this.$ever.api + playback.exportChatHistory() + '?liveId=' + id + '&tenantId=' + localStorage.getItem('TENANTID') + '&doctorAccount=' + this.$store.state.sig.userID
      this.$nextTick(() => {
        this.$refs.download.click()
      })
    },
    async getConsultingImUsers (account) {
      const received = await playback.getConsultingImUsers({
        tenantId: localStorage.getItem('TENANTID'),
        liveRecordId: this.liveRoom.videoRecordId || this.liveRoom.id,
        doctorAccountId: this.sig.userID
      })
      this.receivedList = received.data && received.data.list ? received.data.list : []
    },
    // 获取禁言
    getNOInfo () {
      this.keyWord = []
      this.keyText = ''
      api.getMaskKeywords({ id: this.liveRoom.id }).then(rs => {
        if (!rs.errCode) {
          this.radio = String(rs.data.code)
          this.$store.commit('setEstoppel', rs.data.chatMessage)
          rs.data.chatMessage.forEach(item => {
            let obj = { value: item }
            this.keyWord.push(obj)
          })
          this.blackList = rs.data.imUsers
        }
        this.settingLoading = false
      })
    },
    /***
     *  保存禁言
     */
    async sendNoInfo () {
      let chatMessage = []
      this.settingLoading = true
      this.keyWord.forEach(item => {
        if (item.value) {
          chatMessage.push(item.value)
        }
      })
      let params = {
        id: this.liveRoom.id,
        code: this.radio,
        chatMessage
      }
      if (this.blackIDArr.length) {
        await playback.removeImUserFromProhibitList(
          {
            imIds: this.blackIDArr,
            'roomId': this.liveRoom.roomId,
            'tenantId': localStorage.getItem('TENANTID')
          })
      }
      api.updateMaskKeywords(params).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.settingDialog = false
          this.getNOInfo()
        }
        this.settingDialog = false
      })
    },

    addClick () {
      if (this.keyText && this.keyWord.length < 20) {
        this.keyWord.push({ value: this.keyText })
        this.keyText = ''
      }
    },
    deleteClick (index) {
      this.keyWord.splice(index, 1)
    },
    getInfo () {
      api.getDurationAndNumberOfViewers({ id: this.liveRoom.videoRecordId || this.liveRoom.id }).then(rs => {
        if (!rs.errCode) {
          let t = rs.data.liveTimeSecond / 1000
          let h = this.info(Math.floor(t / 60 / 60 % 24))
          let m = this.info(Math.floor(t / 60 % 60))
          let s = this.info(Math.floor(t % 60))
          this.liveObj.time = h + ':' + m + ':' + s
          this.liveObj.watchNum = rs.data.watchNum
          this.liveObj.chatNum = rs.data.chatNum
          this.liveObj.saleGoodsNum = rs.data.saleGoodsNum
          this.liveObj.saleTotalCount = rs.data.saleTotalCount * 0.01
          this.liveObj.numberOfConsulting = rs.data.numberOfConsulting
          this.analysisDialog = true
        }
      })
    },
    info (val) {
      return val < 10 ? '0' + val : val
    },
    /**
     * 发送禁言信息
     * */
    sendNoInfoBtn () {
      this.sendNoInfo()
    }
  }
}
</script>
<style lang="less" scoped>
.live-comp {
  height: 100%;
  padding: 20px 0 20px 10px;
  /deep/ .el-tabs__header.is-top {
    margin: 0;
  }
  position: relative;
  .live-setting {
    position: absolute;
    margin: 0;
    right: 20px;
    top: 12px;
  }
}
.keyword {
  margin-left: 75px;
}
.analysis {
  display: flex;
  & > div {
    flex-grow: 1;
  }
  .center-div {
    border-left: 1px solid #f8f8f8;
    border-right: 1px solid #f8f8f8;
  }
  p {
    margin: 0;
    text-align: center;
    .span-label {
      color: #999;
      font-size: 12px;
    }
    .span-shuju {
      color: #000;
      font-size: 18px;
      font-weight: 700;
    }
  }
  .p-shuju {
    margin: 12px 0;
  }
}
.setting-dialog {
  /deep/ .el-dialog__body {
    padding-top: 0;
  }
  .p-flex {
    display: flex;
    .span-input {
      flex-basis: 0;
      flex-grow: 1;
      .row-span {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  .icon-i {
    color: #1c7bef;
    cursor: pointer;
    margin: 10px;
  }
  .span-label {
    display: inline-block;
    width: 85px;
    font-size: 14px;
    color: #999;
    text-align: right;
  }
  .p-btn {
    box-sizing: border-box;
    margin-left: 85px;
  }
}
</style>
