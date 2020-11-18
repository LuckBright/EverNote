<template>
  <div class="live-chat">
    <div class="chat">
      <div class="text-header"  v-if="!modal">
        <div>{{obj.received.patientAccountName}}</div>
      </div>
      <div class="chat-text" ref="message-list">
        <div v-for="item in chatArr" :key="item.ID">
          <message-element
            name="客服"
            :message="item"
            :key="item.ID"
            :is-customer="true"
          ></message-element>
        </div>
      </div>
      <div class="chat-input">
        <div class="modal" v-if="modal"></div>
        <div class="confirm alg_c" v-if="modal">
          <el-button
            type="warning"
            class="btn"
            @click="giveAdvice"
            :loading="consultedLoading"
            >接受咨询</el-button
          >
        </div>
        <div class="mt10 mb5">
          <emoji class="send-btn inline-block" @send="sendEmoji"></emoji>

          <el-button
            :disabled="!groupID"
            type="primary"
            size="small"
            @click="recommendDialog = true"
            >商品推荐</el-button
          >
          <el-button
            :disabled="!groupID"
            type="primary"
            size="small"
            @click="doctorDialog = true"
            >挂号推荐</el-button
          >
        </div>
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
          class="fr send-btn"
          @click="sendClickBtn"
          :disabled="loading"
          :loading="loading"
          >发送</el-button
        >
      </div>
    </div>
    <el-dialog title="带货推荐" :visible.sync="recommendDialog" width="50%">
      <goods-recommend
        v-if="recommendDialog"
        :status="0"
        ref="goodsRef"
      ></goods-recommend>
      <div slot="footer">
        <el-button type="primary" @click="sendGoodsInfo">确定</el-button>
        <el-button @click="recommendDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="医生选择"
      width="60%"
      class="doctor-dialog"
      :visible.sync="doctorDialog"
      append-to-body
    >
      <doctor-comp ref="doctorRef"></doctor-comp>
      <div class="clear" slot="footer">
        <el-button
          type="primary"
          @click="getDoctorInfo"
          :loading="recommendLoading"
          >确定</el-button
        >
        <el-button @click="doctorDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MessageElement from '../message-elements/message-element'
import goodsRecommend from '../goods.recommend'
import playback from '@/titancare/api/content/playback'
import doctorComp from '@/titancare/views/content/live/doctor.comp'
import emoji from '@/titancare/views/content/live/message-elements/emoji'

export default {
  props: {
    obj: {
      type: Object
    }
  },
  watch: {
    obj: {
      handler (val, pre) {
        this.chatArr = []
        this.modal = val.modal
        this.groupID = val.waiting.groupId || val.received.groupId || ''
      },
      deep: true
    },
    groupID (val, pre) {
      this.getMessageList()
    },
    '$store.state.imMessage' (val) {
      // console.log('val >> ', val)
      this.onMessageReceived(val)
    },
  },
  computed: {
    tim () {
      return this.$store.state.im
    },
    sig () {
      return this.$store.state.sig
    }
  },
  components: {
    MessageElement,
    goodsRecommend,
    doctorComp,
    emoji
  },
  data () {
    return {
      chatValue: '',
      chatArr: [],
      liveRoom: {},
      playerOptions: {
        preload: 'auto',
        autoplay: true,
        muted: false,
        sources: []
      },
      time: '',
      showLive: false,
      liveLoop: '',
      recommendDialog: false,
      modal: true,
      doctorDialog: false,
      groupID: false,
      loading: false,
      recommendLoading: false,
      consultedLoading: false
    }
  },
  created () {
    this.liveRoom = { ...JSON.parse(this.$route.query.liveRoom) }
  },
  beforeDestroy () {
  },
  methods: {
    async getDoctorInfo () {
      const rowInfo = this.$refs.doctorRef.rowInfo
      const { deptId, deptName, faceUrl, orgId, skillTitle2Name, skillTitle2Code, tenantId, orgName, doctorId } = rowInfo
      this.recommendLoading = true
      await playback.recommendDoctorOneByOne({
        deptId,
        deptName,
        doctorAccount: this.sig.userID,
        doctorId,
        doctorName: rowInfo.doctorName,
        doctorFaceUrl: faceUrl,
        groupId: this.groupID,
        liveRecordId: this.liveRoom.id,
        orgId,
        orgName,
        patientAccount: this.obj.waiting.patientAccount || this.obj.received.patientAccount,
        roomId: this.liveRoom.roomId,
        skillTitle2Code,
        skillTitle2Name,
        tenantId
      })
      this.recommendLoading = false
      // this.chatArr.push({ _type: 'goods', flow: 'out', nick: '客服', goodsName: rowInfo.doctorName, goodsPicture: faceUrl })
      this.doctorDialog = false
    },
    getMessageList () {
      if (!this.tim) return
      this.tim.getMessageList({ conversationID: 'GROUP' + this.groupID, count: 5 }).then(history => {
        const vm = this
        this.chatArr = []
        history.data.messageList.map((item) => {
          if (item.payload.data) {
            try {
              const data = JSON.parse(item.payload.data)
              if (Number(data.code) === 43) return
              const { goodsName, goodsPicture, doctorName, doctorFaceUrl, skillTitle2Name, deptName } = data.msgData
              vm.chatArr.push({ _type: 'goods', flow: 'out', nick: '客服', goodsName: goodsName || doctorName, goodsPicture: doctorFaceUrl || goodsPicture, skillTitle2Name, deptName })
            } catch (err) {
              console.error('解析商品报错：', err)
            }
          } else {
            if (item.from !== '@TIM#SYSTEM') {
              // console.log('item >> ', item)
              vm.chatArr.push(item)
              // vm.chatArr.push({ flow: 'in', nick: '客户', payload: { description: 'dddd' } })
            }
          }
        })
      })
    },
    onMessageReceived (event) {
      const datas = event.data
      const canRead = datas.length && (datas[0].payload.description || datas[0].payload.data) && datas[0].to === this.groupID
      if (canRead) {
        const payload = event.data[0].payload
        if (payload.data) {
          try {
            const { goodsName, goodsPicture, doctorName, doctorFaceUrl } = JSON.parse(payload.data).msgData
            this.chatArr.push({ _type: 'goods', flow: 'out', nick: '客服', goodsName: goodsName || doctorName, goodsPicture: doctorFaceUrl || goodsPicture })
          } catch (err) {
            console.error('解析报错：', err)
          }
        } else {
          if (event.data[0].from === '@TIM#SYSTEM') return
          this.chatArr.push(event.data[0])
        }
      }
      this.scrollMessageListToButtom()
    },
    focusValue () {
      window.addEventListener('keydown', this.keydowns, this)
    },
    blurValue () {
      window.removeEventListener('keydown', this.keydowns, this)
    },
    async giveAdvice () {
      if (!this.obj || !this.obj.waiting || !this.obj.waiting.patientAccount) {
        return
      }
      this.consultedLoading = true
      await playback.consultedImUser({
        'tenantId': localStorage.getItem('TENANTID'),
        'liveRecordId': this.liveRoom._liveRoom.videoRecordId,
        'chatRoomId': this.liveRoom.roomId,
        'doctorAccountId': this.sig.userID,
        'patientAccount': this.obj.waiting.patientAccount,
        'patientAccountName': this.obj.waiting.patientAccountName
      })
      this.$emit('init', this.obj.waiting.patientAccount)
      this.modal = false
      this.consultedLoading = false
    },
    sendEmoji (key) {
      this.chatValue += key
    },
    sendClickBtn (text) {
      if (!this.groupID) {
        return
      }
      if (this.time) clearTimeout(this.time)
      let vm = this
      vm.loading = true
      this.time = setTimeout(() => {
        if (vm.chatValue || typeof text === 'string') {
          let message = vm.tim.createCustomMessage({
            to: this.groupID,
            conversationType: vm.$_TIM.TYPES.CONV_GROUP,
            payload: {
              description: typeof text !== 'string' ? vm.chatValue : text,
              extension: '客服'
            }
          })
          let promise = vm.tim.sendMessage(message)
          promise.then(function (imResponse) {
            // 发送成功
            vm.chatValue = ''
            vm.chatArr.push(imResponse.data.message)
            vm.scrollMessageListToButtom()
            vm.loading = false
          }).catch(function (imError) {
            // 发送失败
            vm.loading = false
            vm.$message(
              {
                message: '发送失败！请刷新后再试！',
                type: 'error'
              }
            )
            console.warn('sendMessage error:', imError)
          })
        } else {
          this.$message({
            message: '不能发送空内容',
            type: 'error'
          })
          this.loading = false
        }
      }, 200)
    },
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
    async sendGoodsInfo () {
      const list = this.$refs.goodsRef.infoArr
      const goods = []
      list.map(item => {
        const { goodsId, name, goodsPicture, price, shopId } = item
        goods.push(
          {
            goodsId,
            goodsName: name,
            goodsPicture,
            price,
            shopId,
            _type: 'goods',
            flow: 'out',
            nick: '客服'
          }
        )
      })
      await playback.recommendGoodsToImUser({ goodsItemList: goods, groupId: this.groupID, liveRecordId: this.liveRoom.id, tenantId: localStorage.getItem('TENANTID') })
      this.recommendDialog = false
    }
  },
}
</script>
<style lang="less" scoped>
.live-chat {
  height: calc(100vh - 15vh);
  display: flex;
  .chat {
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    padding: 20px;
    position: relative;
    .text-header {
      position: absolute;
      height: 60px;
      border: 1px solid #ccc;
      width: 97%;
      box-sizing: border-box;
      padding: 20px;
    }
    .chat-text {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 240px;
      margin-top: 80px;
      overflow: scroll;
    }
    .chat-input {
      position: absolute;
      padding: 0px 20px 0;
      bottom: 53px;
      left: 0;
      right: 0;
      .send-btn {
        margin-top: 10px;
        margin-right: 10px;
      }
      .emoji {
        position: absolute;
        top: 17px;
      }
      .confirm {
        z-index: 200;
        position: relative;
        top: 80px;
        .btn {
          width: 400px;
          font-size: 16px;
        }
      }
      .modal {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #f3f3f3;
        z-index: 100;
      }
    }
  }
}
.dialog-btn {
  text-align: right;
  margin: 0;
}
</style>
