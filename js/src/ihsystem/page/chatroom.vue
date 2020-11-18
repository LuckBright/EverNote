<template>
  <div>
    <div class="wrap">
      <div class="mobile" v-show="linkPageUrl && iframeBoxLoading">
        <el-row class="header" v-if="appoint">
          <el-col :span="24"><span>适用科室：{{appoint.deptName}}</span></el-col>
          <el-col :span="24"><span>初复诊：{{appoint.subsequentVisitDesc}}</span></el-col>
        </el-row>
        <div class="iwarp">
          <iframe
            :src="linkPageUrl"
            style="display:block;vertical-align:top;"
            width="100%"
            height="100%"
            frameborder="0"
          ></iframe>
        </div>
        <el-row class="footer">
          <el-col :span="24" align="right"><el-button type="primary" size="small" @click="closeMobile">关闭</el-button></el-col>
        </el-row>
      </div>
      <div class="left" @scroll="loadMore" ref="msglist" :style="{bottom: showButton ? '141px' : '62px'}">
        <div class="roompanel">
          <!-- Left -->
          <viewer :images="imagesList" :options="options" class="images">
            <template v-for="(item, i) in outChatArr">
              <div :key="'a'+i">
                <div class="chat-notice" :key="'b'+ i" v-if="(i === 0 || item.time - outChatArr[i - 1].time > 60) && (item.payload.data || item.payload.second || item.payload.text || item.payload.imageInfoArray)">
                  <span>{{imTimeFormat(item.time)}}</span>
                </div>
                <msg-info v-if="item.payload.data && item.payload.data.type !== 'LIVE_STATUS_NOTIFY'" :item="item" @link="setLinkPage"></msg-info>
                <msg-video v-if="item.payload.data && item.payload.data.type === 'LIVE_STATUS_NOTIFY'" :item="item"></msg-video>
                <msg-text v-if="item.payload.text" :item="item"></msg-text>
                <msg-audio v-if="item.payload.second" :item="item"></msg-audio>
                <msg-image v-if="item.payload.imageInfoArray" :item="item" :images-list="imagesList" @load="loadImgComplete"></msg-image>
              </div>
            </template>
          </viewer>
        </div>
      </div>
      <div :span="17" class="right">
        <patient-detail></patient-detail>
      </div>
    </div>
    <div class="leftbottom" :style="{bottom: showButton ? 0 : '-79px'}" v-if="!isCloseIm">
      <div class="inputrow">
        <el-input v-model.trim="messageValue" size="small" class="msginput" @focus="focusValue" @blur="blurValue" @paste.native="pasteImg"></el-input>
        <el-button type="primary" size="small" @click="sendTextMessage">发送</el-button>
        <span class="sendicon" @click="showButton = !showButton"><i :class="!showButton ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
      </div>
      <ul class="clearfix">
        <li>
          <span class="bticon"><i class="el-icon-picture"></i></span>
          <span class="bttext">图片</span>
          <input type="file" class="imgfile" id="imagePicker" multiple="false" accept="image/*" @change="uploadImg" />
        </li>
        <li @click="createVideoRoom" v-if="$route.query.visitType === '6' && isHaveVideo">
          <span class="bticon"><i class="el-icon-video-camera-solid"></i></span>
          <span class="bttext">视频</span>
        </li>
        <li @click="doctorFinish">
          <span class="bticon"><i class="el-icon-s-claim"></i></span>
          <span class="bttext">完成看诊</span>
        </li>
      </ul>
    </div>
    <div class="video" draggable v-drag id="videowrap" v-if="client">
      <div class="head">
        <i class="point" :class="remoteStreamHtml ? 'green' : 'red'"></i>
        <span class="time" v-if="mTimer.view && remoteStreamHtml">{{mTimer.view}}</span>
        <span @click="reduce">
          <svg class="icon iconfont" aria-hidden="true">
            <use xlink:href="#icon-suoxiao" v-if="!isReduce"></use>
            <use xlink:href="#icon-fangda" v-else></use>
          </svg>
        </span>
      </div>
      <div :class="isChangeVideo ? 'smallvideo': 'mainvideo'" @click="isChangeVideo=!isChangeVideo" v-show="!isReduce || !isChangeVideo" :style="{height: isReduce && !isChangeVideo ? '158px' : ''}">
        <div v-html="remoteStreamHtml" v-show="remoteStreamHtml && localStream" style="height:100%"></div>
      </div>
      <div :class="!isChangeVideo ? 'smallvideo': 'mainvideo'" @click="isChangeVideo=!isChangeVideo" v-show="!isReduce || isChangeVideo" :style="{height: isReduce && isChangeVideo ? '158px' : ''}">
        <div id="local_stream" v-show="remoteStreamHtml && localStream" style="height:100%"></div>
      </div>
      <div class="photo" v-if="!isReduce && !remoteStreamHtml">
        <img :src="photoUrl(this.user ? this.user.faceUrl : '')"/>
        <span>{{this.user ? this.user.nick : '患者'}}</span>
        <span class="linkstate">{{currLinkState}}</span>
      </div>
      <div class="buttons" v-if="!isReduce">
        <ul>
          <li v-if="remoteStreamHtml" @click="closeAudio">
            <span class="btn">
              <svg class="icon iconfont" aria-hidden="true">
                <use xlink:href="#icon-jingyin" v-if="!isCloseAudio"></use>
                <use xlink:href="#icon-jingyin-bai" v-else></use>
              </svg>
            </span>
            <span class="text">静音</span>
          </li>
          <li>
            <span class="btn" @click="leave(remoteStreamHtml ? 3 : 1)">
              <svg class="icon iconfont" aria-hidden="true">
                <use xlink:href="#icon-guaduan1"></use>
              </svg>
            </span>
            <span class="text">挂断</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/util/eventbus'
import patientDetail from '@/ihsystem/page/patient.detail.vue'
import api from '@/ihsystem/store/webapi'
import ihapi from '@/ihsystem/store/webihapi'
import { imTimeFormat } from '@/util/common'
import msgTime from '@/phr/component/msgTime.vue'
import msgText from '@/ihsystem/components/msgText.vue'
import msgAudio from '@/ihsystem/components/msgAudio.vue'
import msgImage from '@/ihsystem/components/msgImage.vue'
import msgVideo from '@/ihsystem/components/msgVideo.vue'
import msgInfo from '@/ihsystem/components/msgInfo.vue'
import mixinAudioPlayer from '@/ihsystem/mixin/audioPlayer'
import draggable from 'vuedraggable'
const SHOWTYPE = ['LIVE_STATUS_NOTIFY', 'TW_QUESTION', 'TW_RPLIST', 'GOODS', 'PRECONSULTATION', 'OCR', 'ENSUREPLANTJ', 'SYS_PLAIN', 'TW_WAIT_FOR_FINISH', 'MEDICAL_RECORDS', 'TW_STATUS_CHANGED']
import session from '@/util/session'

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.state.im) {
        vm.$store.dispatch('getSig', {isIm: true})
      }
    })
    next(true)
  },
  beforeRouteLeave (to, from, next) {
    next(vm => {
      vm.leave(vm.remoteStreamHtml ? 3 : 1)
    })
    next(true)
  },
  mixins: [mixinAudioPlayer, session],
  data () {
    return {
      api,
      ihapi,
      user: '',
      outChatArr: [],
      imagesList: [],
      groupId: this.$route.query.groupId || localStorage.getItem('CHATROOMID'),
      appoint: localStorage.getItem('CURRENTAPPOINT') ? JSON.parse(localStorage.getItem('CURRENTAPPOINT')) : '',
      messageValue: '',
      groupMember: '',
      avatar: require('@/assets/avtarbg.png'),
      Bus,
      nextReqMessageID: '',
      isCompleted: false,
      showButton: true,
      linkPageUrl: '',
      iframeBoxLoading: false,
      isLoading: false,
      isSendMsg: false,
      isToBottom: false,
      isCloseIm: false,
      isJoinRoom: false,
      isPublished: false,
      isReduce: false,
      isCloseAudio: false,
      isHaveVideo: true,
      isChangeVideo: false,
      options: {
        title: false,
        url: 'data-src'
      },
      SHOWTYPE,
      SIG: '',
      client: '',
      localStream: '',
      remoteStreamHtml: '',
      roomId: '',
      videowrap: '',
      mTimer: {
        step: 0,
        time: 0,
        view: ''
      },
      timer: null,
      myLink: null,
      linkState: {
        'DISCONNECTED': '连接断开',
        'CONNECTING': '正在连接中',
        'RECONNECTING': '自动重连中',
        'CONNECTED': '已连接'
      },
      currLinkState: '',
      videoPoint: {
        x: 0,
        y: 0
      }
    }
  },
  created () {
    this.iframeBoxLoading = false
    let SIG = window.localStorage.getItem('SIG')
    if (SIG && SIG !== 'false') {
      this.SIG = JSON.parse(SIG)
    } else {
      window.localStorage.removeItem('SIG')
    }
    this.api.getApolloValue({key: 'online-consultation-video-is-open', defaultValue: '1'}).then(rs => {
      this.isHaveVideo = rs.data === '1'
    })
    this.api.getGroupMember(this.groupId).then(rs => {
      this.groupMember = rs.data
      this.$nextTick(_ => {
        this.getMessageList()
      })
    })
  },
  mounted () {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.beforeunloadHandler(e))
  },
  watch: {
    '$store.state.sig' (val) {
      this.SIG = val
      window.localStorage.setItem('SIG', JSON.stringify(val))
    },
    '$store.state.imMessage' (val) {
      if (!val || !val.data[0]) {
        return false
      }
      this.isToBottom = false
      val.data.map(item => {
        if (item.conversationID === 'GROUP' + this.groupId) {
          if (item.payload.data && this.isJsonStr(item.payload.data)) {
            item.payload.data = JSON.parse(item.payload.data)
          }
          if ((!item.payload.data || (SHOWTYPE.includes(item.payload.data.type) && item.payload.data.content.type !== 'create_live')) && !item.isRevoked) {
            if (item.from !== this.$route.query.creatorId) {
              item.avatar = this.groupMember[this.SIG.userID].faceUrl
            } else {
              item.avatar = this.groupMember[this.$route.query.creatorId].faceUrl
            }
            this.outChatArr.push(item)
          }
          if (item.payload.data && item.payload.data.type === 'SYS_PLAIN' && item.payload.data.content.info.busMsg) {
            let revId = item.payload.data.content.info.busMsg
            this.sendRevMessage(revId)
          }
          if (item.payload.data && item.payload.data.type === 'TW_STATUS_CHANGED') {
            this.isCloseIm = true
          }
          if (item.payload.data && item.payload.data.type === 'LIVE_STATUS_NOTIFY' && item.payload.data.content.info.resource) {
            this.remoteStreamHtml = null
            // this.currLinkState = item.payload.data.content.info.doctor
            this.leave(2)
          }
          if (item.payload.imageInfoArray && item.payload.imageInfoArray[0]) {
            this.imagesList.unshift(item.payload.imageInfoArray[0].imageUrl.split(',')[0])
          }
        }
      })
      this.scrollToButtom()
    },
    '$store.state.imReady' (val) {
      this.getMessageList()
    },
    '$store.state.revMessage' (val) {
      console.log('$store.state.revMessage', val)
    },
    'isCloseIm' (val) {
      if (val) {
        this.$alert('该患者已完成结诊', {callback: action => {
          window.close()
        }})
      }
    },
    'mTimer.step' (val) {
      this.mTimer.view = this.$moment(this.mTimer.time + this.mTimer.step * 1000).format('mm:ss')
      if (val >= 15 && !this.remoteStreamHtml) {
        this.currLinkState = '对方手机可能不在身边'
      }
      if (val >= 30 && !this.remoteStreamHtml) {
        // this.currLinkState = '对方无应答'
        this.remoteStreamHtml = null
        this.leave(-1)
      }
    },
    isChangeVideo (val) {
      console.log(val)
    }
  },
  methods: {
    imTimeFormat,
    isJsonStr (str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      } else {
        return false
      }
    },
    sendTextMessage () {
      let vm = this
      if (!vm.messageValue || vm.isSendMsg) {
        return false
      }
      if (vm.isCloseIm) {
        vm.$alert('该患者已完成结诊, 确认后关闭聊天窗口', {callback: action => {
          window.close()
        }})
      }
      vm.isSendMsg = true
      let message = vm.IM.createTextMessage({
        to: this.groupId,
        conversationType: vm.$_TIM.TYPES.CONV_GROUP,
        payload: {
          text: this.messageValue
        }
      })
      let promiseise = vm.IM.sendMessage(message)
      promiseise.then(function(imResponse) {
        // console.log(imResponse.data.message)
        if (vm.groupMember) {
          let doctor = vm.groupMember[imResponse.data.message.from]
          let message = imResponse.data.message
          message.nick = doctor.nick
          message.avatar = doctor.faceUrl
          vm.outChatArr.push(message)
          vm.isToBottom = false
          vm.scrollToButtom()
          // vm.IM.setMessageRead({conversationID: 'GROUP' + vm.groupId})
        }
        vm.messageValue = ''
        vm.isSendMsg = false
      }).catch(function(imError) {
        console.log('sendMessage error:', imError) // 发送失败
      })
    },
    sendImageMessage (file) {
      let vm = this
      let message = vm.IM.createImageMessage({
        to: this.groupId,
        conversationType: vm.$_TIM.TYPES.CONV_GROUP,
        payload: {
          file: file,
        },
        onProgress: function(event) { return false }
      })
      // 2. 发送消息
      let promise = vm.IM.sendMessage(message)
      promise.then(function(imResponse) {
        // 发送成功
        if (vm.groupMember) {
          let doctor = vm.groupMember[imResponse.data.message.from]
          let message = imResponse.data.message
          message.nick = doctor.nick
          message.avatar = doctor.faceUrl
          vm.outChatArr.push(message)
          vm.isToBottom = false
          vm.imagesList.unshift(message.payload.imageInfoArray[0].imageUrl.split(',')[0])
          vm.scrollToButtom()
          // vm.IM.setMessageRead({conversationID: 'GROUP' + vm.groupId})
        }
      }).catch(function(imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
      })
    },
    uploadImg () {
      let imgFile = document.getElementById('imagePicker')
      if (!imgFile) {
        return false
      }
      this.sendImageMessage(imgFile)
    },
    pasteImg (e) {
      let clipboardData = e.clipboardData
      let imgFile
      if (clipboardData && clipboardData.files && clipboardData.files.length > 0) {
        imgFile = clipboardData.files[0]
        // 图片消息发送成功后，file 指向的内容可能被浏览器清空，如果接入侧有额外的渲染需求，可以提前复制一份数据
      }
      if (typeof imgFile === 'undefined') {
        console.warn('file 是 空，请检查代码或浏览器兼容性！')
        return false
      }
      this.sendImageMessage(imgFile)
    },
    loadImgComplete () {
      // this.isToBottom = false
      // this.scrollToButtom()
    },
    getMessageList (flag) {
      let vm = this
      if (!vm.IM || vm.isLoading) {
        return false
      }
      if (vm.isCloseIm) {
        vm.$alert('该患者已完成结诊, 确认后关闭聊天窗口', {callback: action => {
          window.close()
        }})
      }
      vm.isLoading = true
      let promise = vm.IM.getMessageList({conversationID: 'GROUP' + vm.groupId, count: 15, nextReqMessageID: vm.nextReqMessageID})
      promise.then(function(imResponse) {
        let messageList = imResponse.data.messageList // 消息列表。
        vm.nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
        vm.isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
        let list = messageList.map(item => {
          if (item && item.payload && item.payload.data && vm.isJsonStr(item.payload.data)) {
            item.payload.data = JSON.parse(item.payload.data)
          }
          if (item.payload.imageInfoArray && item.payload.imageInfoArray[0]) {
            vm.imagesList.unshift(item.payload.imageInfoArray[0].imageUrl.split(',')[0])
          }
          if (vm.groupMember && vm.SIG && vm.$route.query.creatorId) {
            if (item.from !== vm.$route.query.creatorId) {
              item.avatar = vm.groupMember[vm.SIG.userID].faceUrl
            } else {
              item.avatar = vm.groupMember[vm.$route.query.creatorId].faceUrl
            }
          }
          return item
        }).filter(item => {
          return (!item.payload.data || (SHOWTYPE.includes(item.payload.data.type) && item.payload.data.content.type !== 'create_live')) && !item.isRevoked
        })
        vm.outChatArr = [...list, ...vm.outChatArr]
        if (flag) {
          vm.scrollToTop()
        } else {
          vm.scrollToButtom()
        }
        vm.isLoading = false
      })
    },
    focusValue () {
      window.addEventListener('keydown', this.keyDowns, this)
    },
    blurValue () {
      window.removeEventListener('keydown', this.keyDowns, this)
    },
    keyDowns (e) {
      if (e.keyCode === 13 && !this.isSendMsg) {
        this.sendTextMessage()
      }
    },
    scrollToButtom () {
      this.$nextTick(() => {
        setTimeout(_ => {
          let messageListNode = this.$refs['msglist']
          if (!messageListNode) {
            return
          }
          messageListNode.scrollTop = messageListNode.scrollHeight
          this.isToBottom = true
        }, 500)
      })
    },
    scrollToTop () {
      this.$nextTick(_ => {
        setTimeout(_ => {
          let messageListNode = this.$refs['msglist']
          if (!messageListNode) {
            return
          }
          messageListNode.scrollTop = 50
          this.isToBottom = false
        }, 500)
      })
    },
    loadMore (event) {
      if (!this.isCompleted && event.target.scrollTop <= 10) {
        this.getMessageList(true)
      }
    },
    doctorFinish () {
      if (this.remoteStreamHtml) {
        this.$alert('视频通话正在进行中，无法操作完成看诊')
        return false
      }
      this.$confirm('是否结束患者 ' + this.$route.query.patientName + ' 看诊?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ihapi.doctorFinish({orderNo: this.$route.query.groupId}).then(rs => {
          if (this.client) {
            this.leave(this.remoteStreamHtml ? 3 : 1)
          }
        })
      }).catch(() => {
        return false
      })
    },
    photoUrl (val) {
      let url = ''
      if (val && val.indexOf('http') > -1) {
        url = val
      } else if (val) {
        url = this.$ever.fileUrl2 + val
      } else {
        url = this.avatar
      }
      return url
    },
    setLinkPage (val) {
      this.linkPageUrl = val
      setTimeout(() => {
        this.iframeBoxLoading = true
      }, 500)
    },
    closeMobile () {
      this.iframeBoxLoading = false
    },
    sendRevMessage (ids) {
      let vm = this
      let revList = vm.outChatArr.filter(item => {
        return item.payload.data && item.payload.data.type === 'TW_RPLIST' && JSON.stringify(item.payload.data.content.recipeIds) === ids
      })
      if (revList[0]) {
        let promise = vm.IM.revokeMessage(revList[0])
        promise.then(function(imResponse) {
          vm.outChatArr = vm.outChatArr.filter(item => {
            return item.random !== revList[0].random
          })
          // console.log('消息撤回成功')
        }).catch(function(imError) {
          console.warn('revokeMessage error:', imError) // 消息撤回失败
        })
      }
    },
    createClient () {
      if (!this.SIG || !this.SIG.userID || !this.SIG.SDKAppID || this.client) {
        return false
      }
      if (window.localStorage.getItem('REMOTEID')) {
        this.$alert('视频正在通话中，请挂断后重新发起视频')
        return false
      }
      this.client = this.$_TRTC.createClient({
        mode: 'rtc',
        sdkAppId: this.SIG.SDKAppID,
        userId: this.SIG.userID,
        userSig: this.SIG.userSig
      })
      this.client.on('stream-added', event => {
        const remoteStream = event.stream
        console.log('远端流增加: ' + remoteStream.getId()) // 订阅远端流
        this.client.subscribe(remoteStream)
      })
      this.client.on('stream-subscribed', event => {
        const remoteStream = event.stream
        console.log('远端流订阅成功：' + remoteStream.getId())
        // 播放远端流
        this.remoteStreamHtml = `<view id="${'remote_stream-' + remoteStream.getId()}"></view>`
        this.$nextTick(() => {
          this.setTimer()
          window.localStorage.setItem('REMOTEID', remoteStream.getId())
          remoteStream.play('remote_stream-' + remoteStream.getId()) // 播放
        })
      })
      this.client.on('stream-removed', event => {
        console.log('对方已关闭')
        this.remoteStreamHtml = null
        this.leave(0)
      })
      this.$nextTick(_ => {
        this.videowrap = document.querySelector('#videowrap')
        this.videowrap.style.left = (document.body.clientWidth - this.videowrap.offsetWidth - 40) + 'px'
      })
    },
    createVideoRoom () {
      if (!this.SIG || !this.SIG.userID || !this.SIG.SDKAppID || !this.$route.query.creatorId || this.client) {
        return false
      }
      this.createClient()
      if (this.roomId) {
        this.join()
        return false
      }
      this.user = this.groupMember[this.$route.query.creatorId]
      this.ihapi.createLiveSession({
        createRoom: true,
        groupId: this.$route.query.groupId,
        userID: this.SIG.userID,
        doctors: [{doctorId: this.SIG.userID}],
        members: [{memberId: this.$route.query.creatorId}]
      }).then(rs => {
        this.roomId = rs.data.roomID
        this.currLinkState = '正在连接中'
        this.join()
      })
    },
    reduce () {
      this.isReduce = !this.isReduce
      this.videowrap.style.width = this.isReduce ? '115px' : '369px'
      this.videowrap.style.height = this.isReduce ? '200px' : '630px'
    },
    resetTimer () {
      let currTime = new Date()
      currTime.setHours(0)
      currTime.setMinutes(0)
      currTime.setSeconds(0)
      this.mTimer.step = 0
      this.mTimer.time = currTime.getTime()
      if (this.timer) {
        window.clearInterval(this.timer)
      }
    },
    setTimer () {
      this.resetTimer()
      this.timer = window.setInterval(_ => {
        this.mTimer.step++
      }, 1000)
    },
    clearStream () {
      this.resetTimer()
      this.client = null
      this.roomId = ''
      this.localStream = null
      this.remoteStreamHtml = null
      this.isJoinRoom = false
      window.localStorage.removeItem('REMOTEID')
    },
    getHeight() {
      if (!this.isSelfVideo) {
        return '100px'
      } else if (this.isReduce) {
        return '158px'
      } else {
        return '588px'
      }
    },
    async beforeunloadHandler (e) {
      await this.leave(this.remoteStreamHtml ? 3 : 1)
      this.clearStream()
      return '离开页面'
    },
    async changeLiveState (params) {
      await this.ihapi.changeLiveState(params)
    },
    async join () {
      if (!this.client) {
        return false
      }
      this.ihapi.changeLiveState({resource: this.SIG.userID, roomId: this.roomId, status: 5}).then(rs => {
        this.client.join({ roomId: this.roomId }).then(() => {
          console.log('加入房间')
          this.isJoinRoom = true
          this.isCloseAudio = false
          this.localStream = this.$_TRTC.createStream({ userId: this.SIG.userID, audio: true, video: true })
          this.localStream.initialize().then(() => {
            if (this.localStream) {
              this.setTimer()
              this.localStream.play('local_stream')
              this.publish()
            }
          }).catch((error) => {
            // 本地流初始化失败
            console.error(error)
          })
        })
      })
    },
    async publish() {
      if (!this.isJoinRoom) {
        console.warn('发布视频流之前先加入房间')
        return false
      }
      if (this.isPublished) {
        console.warn('视频流已经存在，请尝试关闭其它视频流')
        return false
      }
      if (!this.localStream) {
        console.warn('没有建立视频流')
        return false
      }
      this.isPublished = true
      try {
        await this.client.publish(this.localStream)
      } catch (e) {
        console.error('failed to publish local stream ' + e)
        this.isPublished = false
      }
    },
    async unpublish() {
      await this.client.unpublish(this.localStream)
      this.isPublished = false
    },
    async leave(status) {
      if (!this.isJoinRoom) {
        console.warn('没有加入房间')
        return false
      }
      if (this.isPublished && this.localStream) {
        await this.unpublish()
      }
      if (this.client) {
        await this.client.leave()
      }
      if (this.localStream) {
        this.localStream.stop()
        this.localStream.close()
      }
      if (status) {
        await this.changeLiveState({resource: this.SIG.userID, roomId: this.roomId, status})
      }
      this.clearStream()
    },
    async closeAudio () {
      this.isCloseAudio = !this.isCloseAudio
      if (this.isCloseAudio) {
        this.localStream.muteAudio()
      } else {
        this.localStream.unmuteAudio()
      }
    }
  },
  computed: {
    IM () {
      return this.$store.state.im
    }
  },
  directives: {
    drag: {
      inserted (el, binding) {
        el.onmousedown = function (e) {
          e.stopPropagation()
          let disx = e.pageX - el.offsetLeft
          let disy = e.pageY - el.offsetTop
          document.onmousemove = function (e) {
            e.preventDefault()
            el.style.left = e.pageX - disx + 'px'
            el.style.top = e.pageY - disy + 'px'
          }
          document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null
            // binding 传参，可忽略
            if (binding && binding.value) {
              binding.value.clientX = parseInt(el.style.left)
              binding.value.clientY = parseInt(el.style.top)
            }
          }
        }
      }
    }
  },
  components: {
    msgTime,
    msgText,
    msgAudio,
    msgImage,
    msgInfo,
    msgVideo,
    patientDetail,
    draggable
  },
  beforeDestroy () {
    this.leave(this.remoteStreamHtml ? 3 : 1)
    window.removeEventListener('beforeunload', e => {})
    window.removeEventListener('unload', e => {})
  }
}
</script>

<style scoped>
  .wrap {height: 100%; position: relative; overflow: hidden;}
  .left {position: absolute; width: 425px; left: 0; top: 0; bottom: 139px; background: #F5F6F7; overflow-y: auto;}
  .mobile {position: absolute; width: 425px; left: 425px; top: 0; bottom: 0; background: #ffffff; overflow-y: auto; z-index: 1001;border-right: 1px solid #dadce0;}
  .right { position: relative; height: 100%; margin-left: 425px;}
  .leftbottom {position: absolute; width: 405px; bottom: -78px; left: 0; background: #ffffff; padding: 10px; height: 120px; border-top: 1px solid #dadce0;}
  .leftbottom ul {list-style: none; margin: 0; padding: 0 7px; margin-top: 20px; }
  .leftbottom ul li {width: 50px;  float: left; margin-right: 16px; cursor: pointer; position: relative; cursor: pointer;}
  .leftbottom ul li .bticon{display: block; width: 50px; height: 50px; border-radius: 4px; text-align: center; background: #f2f2f2;}
  .leftbottom ul li .bttext {display: block; font-size: 12px; text-align: center; line-height: 25px; color: #999;}
  .leftbottom ul li i {font-size: 28px; color: #4995f2; margin-top: 10px;}
  .roompanel {padding: 20px; min-height: 750px;}
  .roompanel p {margin: 0; padding: 0;}
  .msginput {background: #F5F6F7; border: 0 solid #E9E9E9; border-radius: 4px; border-radius: 4px; width: 300px; background: #fff;}
  .sendicon {display: inline-block; width: 21px; height: 21px; text-align: center; line-height: 24px; border: 1px solid #383B48; font-weight: bold; border-radius: 50%; position: relative; top: 2px; left: 15px; cursor: pointer;}
  .imgfile {position: absolute; left: 0; right: 0; top: 0; bottom: 0; opacity: 0; z-index: 1001; width: 50px; cursor: pointer;}

  .chat-tips {clear: both; font-size: 12px; text-align: center; line-height: 1.75; padding: 10px 50px; margin-bottom: 10px; color:#999;}
  .chat-notice{
    clear: both;
    font-size: 12px;
    color: white;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .chat-notice span{
    background-color: #cecece;
    line-height: 25px;
    border-radius: 5px;
    padding: 5px 10px;
  }
  .mobile > .header {padding: 20px;}
  .mobile > .header > .el-col {border-bottom: 1px solid #dadce0; padding: 10px; font-size: 14px; color: #000;}
  .mobile > .header > .el-col span {color: #666;}
  .mobile > .iwarp {position: absolute; left: 0; bottom: 61px; right: 0; top: 118px; padding: 0 10px;}
  .mobile > .footer {position: absolute; left: 0; bottom: 0; right: 0; border-top: 1px solid #dadce0; text-align: right;}
  .mobile > .footer > .el-col {padding: 10px 20px 19px 10px;}

  .video {position: fixed; width: 369px; left: 10px; top: 0; height: 630px; background:rgba(0, 0, 0, 0.7); z-index: 1012; border-radius: 6px;}
  .smallvideo {position: absolute; width: 66px; height: 100px; right: 0; top: 42px; z-index: 1013; cursor: pointer;}
  .mainvideo {border-radius: 6px; height: 588px; cursor: pointer;}
  .video .buttons {position: absolute; bottom: 0; left:0; right: 0; padding: 40px; text-align: center; background: rgba(0, 0, 0, 0.7); border-radius: 6px;}
  .video .buttons ul {list-style-type: none; padding: 0; margin: 0; display: flex;}
  .video .buttons ul li {list-style-type: none; padding: 0; margin: 0; flex: 1} 
  .video .buttons ul li .iconfont{font-size: 50px; color: #E33C3B;}
  .video .buttons ul li span.btn {display: block;}
  .video .buttons ul li span.text {display: block; color: #fff; font-size: 14px; padding: 10px 0;}
  .video .photo{position: absolute; top: 20%; text-align: center; width: 100%;}
  .video .photo img {width: 100px; height: 100px; margin-bottom: 10px; display: inline-block; border-radius: 6px;}
  .video .photo span {display: block; text-align: center; color: #fff; line-height: 30px;}
  .video .photo span.linkstate {font-size: 14px;}
  .video .head {height: 42px; line-height: 42px; background:rgba(0, 0, 0, 0.8); text-align: center; border-radius: 6px 6px 0 0; position: relative; cursor:move;}
  .video .head .point {width: 12px; height: 12px; border-radius: 50%;  position: absolute; display: block; left: 10px; top: 14px;}
  .video .head i.green {background: #28CC42;}
  .video .head i.red {background: #E33C3B;}
  .video .head .iconfont {font-size: 20px; color: #1C7BEF; position: absolute; right: 9px; top: 9px; z-index: 1014;}
  .video .head span.time {color: #fff;}
</style>
