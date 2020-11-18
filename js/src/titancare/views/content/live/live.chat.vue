<template>
  <div class="live-chat">
    <div :class="{ live: true, 'is-stop': !showLive }">
      <video-player
        v-if="src"
        class="live-video"
        :src="src"
      ></video-player>
      <span class="stop" v-else>未开始</span>
    </div>
    <div class="chat" v-loading="loading">
      <div class="chat-text" ref="message-list">
        <div v-for="item in chatArr" :key="item.ID">
          <message-element
            :show-prohibit="true"
            :message="item"
            :key="item.ID"
          ></message-element>
        </div>
      </div>

      <div class="chat-input">
        <!-- <editdiv  v-model.trim="chatValue" placeholder="点击输入内容..." @send="sendClickBtn"></editdiv> -->
        <emoji class="btn inline-block mr10 mb5" @send="sendEmoji"></emoji>

        <el-button
          type="primary"
          size="small"
          class="btn inline-block mt10"
          @click="recommendDialog = true"
          >带货推荐</el-button
        >

        <el-input
          v-model="chatValue"
          placeholder="点击输入内容..."
          type="textarea"
          :rows="4"
          oninput="value=value.replace(/^\s*/, '')"
          @focus="focusValue"
          @blur="blurValue"
        ></el-input>

        <el-button
          type="primary"
          size="small"
          class="btn fr"
          @click="sendClickBtn"
          :disabled="textloading"
          :loading="textloading"
          >发送</el-button
        >
      </div>
    </div>
    <el-dialog title="带货推荐" :visible.sync="recommendDialog" width="50%">
      <goods-recommend
        v-if="recommendDialog"
        @info="sendGoodsInfo"
        :status="1"
      ></goods-recommend>
    </el-dialog>
  </div>
</template>
<script>
import MessageElement from './message-elements/message-element'
import goodsRecommend from './goods.recommend'
import api from '@/titancare/api/content/live.js'
import playback from '@/titancare/api/content/playback'
import { mapState } from 'vuex'
import emoji from '@/titancare/views/content/live/message-elements/emoji'
import videoPlayer from '@/titancare/views/content/live/customer/videoplayer'
let vm = {}
export default {
  components: {
    MessageElement,
    goodsRecommend,
    emoji,
    videoPlayer
  },
  data () {
    return {
      chatValue: '',
      chatArr: [],
      liveRoom: {},
      time: '',
      tim: null,
      showLive: false,
      liveLoop: '',
      recommendDialog: false,
      loading: true,
      textloading: false,
      sequence: {},
      src: ''
    }
  },
  watch: {
    '$store.state.imMessage' (val) {
      this.onMessageReceived(val)
    },
    '$store.state.imReady' (val) {
      this.inGroup()
    }
  },
  computed: mapState({
    estoppel: 'estoppel',
    imReady (state) {
      if (state.imReady) {
        this.inGroup(state.im)
      }
      return state.imReady
    },
    im (state) {
      return state.im
    }
  }),
  created () {
    vm = this
    this.liveRoom = { ...JSON.parse(this.$route.query.liveRoom) }
    if (this.$store.state.imReady) {
      this.inGroup()
    }
    this.getLiveStatus()
  },
  beforeDestroy () {
    if (this.liveLoop) {
      clearInterval(this.liveLoop)
    }
  },
  methods: {
    /**
     * 查询流状态
     * */
    getLiveStatus () {
      api.getWhetherLiveing({ streamName: this.liveRoom.streamName }).then(rs => {
        // 判断拉流的状态
        if (this.liveLoop) clearInterval(this.liveLoop)
        if (rs.data) {
          this.$nextTick(() => {
            let src = this.liveRoom.m3u8.replace(/https/g, 'http')
            this.src = src
            this.showLive = rs.data
          })
        } else {
          // 没有流状态 设置定时器请求
          if (!this.liveLoop) {
            this.liveLoop = setInterval(() => {
              this.getLiveStatus()
            }, 3000)
          }
        }
      })
    },
    sendEmoji (key) {
      this.chatValue += key
    },
    inGroup () {
      if (!this.im) return
      let options = {
        groupID: this.liveRoom.roomId,
        type: this.$_TIM.TYPES.GRP_AVCHATROOM
      }
      let params = this.im.joinGroup(options)
      params.then(imResponse => {
        // 修改昵称， 用于APP展示
        this.im.updateMyProfile({
          nick: '医生'
        })
        this.loading = false
      }).then(imError => {
        console.error('joinGroup-error', imError)
      })
    },
    /**
     * onMessageReceived 接受消息
     * */
    onMessageReceived (event) {
      if (event.data.length && (event.data[0].payload.text || event.data[0].payload.data || event.data[0].payload.userDefinedField) && event.data[0].to === this.liveRoom.roomId) {
        if (event.data[0].payload.userDefinedField) {
          if (this.sequence[event.data[0].sequence]) {
            return
          } else {
            this.sequence[event.data[0].sequence] = true
          }
          const { msgData, code } = JSON.parse(event.data[0].payload.userDefinedField)
          if (Number(code) !== 21) return
          try {
            const { goodsName, goodsPicture } = msgData
            this.chatArr.push({ _type: 'goods', flow: 'out', nick: '医生', goodsName, goodsPicture })
          } catch (err) {
            console.error('解析商品报错：', err)
          }
        } else {
          this.chatArr.push(event.data[0])
        }
        this.scrollMessageListToButtom()
      }
    },
    /**
     * 获取焦点时添加事件
     * */
    focusValue () {
      window.addEventListener('keydown', this.keydowns, this)
    },
    /**
     * 失去焦点时取消事件
     * */
    blurValue () {
      window.removeEventListener('keydown', this.keydowns, this)
    },
    /**
     * 发送消息
     * */
    sendClickBtn () {
      if (!vm.imReady) return
      if (vm.time) clearTimeout(vm.time)
      vm.textloading = true
      vm.time = setTimeout(() => {
        if (vm.chatValue) {
          let num = 0
          vm.estoppel.forEach(item => {
            if (vm.chatValue.includes(item)) ++num
          })
          if (num) {
            vm.$message.error('包含敏感词，请修改后再次发送')
            vm.textloading = false
            return
          }
          let message = vm.im.createCustomMessage({
            to: vm.liveRoom.roomId,
            conversationType: vm.$_TIM.TYPES.CONV_GROUP,
            payload: {
              data: '1',
              description: vm.chatValue,
              extension: '医生'
            }
          })
          let promise = vm.im.sendMessage(message)
          promise.then(function (imResponse) {
            // 发送成功
            vm.chatValue = ''
            vm.chatArr.push(imResponse.data.message)
            vm.scrollMessageListToButtom()
            vm.textloading = false
          }).catch(function (imError) {
            // 发送失败
            console.warn('sendMessage error:', imError)
            vm.textloading = false
            // 有可能是加群失败导致 再加一次
            vm.inGroup()
            vm.$message(
              {
                message: '发送失败！请售后再试！',
                type: 'error'
              }
            )
          })
        } else {
          vm.$message({
            message: '不能发送空内容！',
            type: 'error'
          })
          vm.textloading = false
        }
      }, 200)
    },
    /**
     * 错误信息
     * */
    onError (e) {
      console.log('error', e)
    },

    // 直接滚到底部
    scrollMessageListToButtom () {
      this.$nextTick(() => {
        let messageListNode = this.$refs['message-list']
        if (!messageListNode) {
          return
        }
        messageListNode.scrollTop = messageListNode.scrollHeight
      })
    },
    /**
     * 监听键盘
     * */
    keydowns (e) {
      if (e.keyCode === 13) {
        this.sendClickBtn()
      }
    },

    /**
     * 获取推荐商品信息
     * */
    async sendGoodsInfo (info) {
      const { goodsId, goodsPicture, price, tenantId, name, shopId } = info
      const res = await playback.recommendGoodsToRoom(
        {
          goodsId,
          'goodsName': name,
          goodsPicture,
          'groupId': this.liveRoom.roomId,
          'liveRecordId': this.liveRoom.id,
          price,
          roomId: this.liveRoom.roomId,
          tenantId,
          shopId
        })
      if (res && res.errCode === 0) {
        this.$message({
          message: '推荐成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '推荐失败！',
          type: 'warning'
        })
      }
      this.recommendDialog = false
    }
  }
}
</script>
<style lang="less" scoped>
.live-chat {
  height: calc(100vh - 12vh);
  display: flex;
  .live {
    width: 70%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    background: url('../../../assets/img/zhibo.png') no-repeat center;
    .live-video {
      height: 100%;
      width: 100%;
      margin-top: 20px;
      & /deep/ .video-js {
        width: 100%;
        height: 90%;
        .vjs-big-play-button {
          display: none !important;
        }
      }
    }
  }
  .is-stop {
    display: flex;
    justify-content: center;
    align-items: center;
    .stop {
      margin-top: 100px;
      color: #666;
      font-size: 14px;
    }
  }
  .chat {
    width: 30%;
    height: 100%;
    background: #f3f3f3;
    padding: 20px;
    position: relative;
    .chat-text {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 250px;
      overflow: scroll;
    }
    .chat-input {
      position: absolute;
      padding: 20px 20px 0;
      bottom: 66px;
      left: 0;
      right: 0;
      .btn {
        margin-top: 10px;
      }
      .emoji {
        position: absolute;
        top: -25px;
      }
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
    }
  }
}
.dialog-btn {
  margin: 0;
  text-align: right;
}
</style>
