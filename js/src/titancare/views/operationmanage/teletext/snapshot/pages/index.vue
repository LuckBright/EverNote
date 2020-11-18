<template>
  <div class="message-wrap">
    <div class="message-list">
      <viewer :options="options" :images="[]" class="images">
        <div class="msg-item" v-for="(item, index) in chatData" :key="index">
          <template v-if="item.msgDisplay && !item.msgRevoked">
            <!-- 时间 -->
            <msg-time :preTime="chatData[index - 1] && chatData[index - 1].msgTime" :currTime="item.msgTime" :formatTime="item.msgTimeStamp"></msg-time>
            <!-- 文本/表情 -->
            <msg-text v-if="item.msgType === MSGTYPE.TEXT" :msgData="item"></msg-text>
            <!-- 图片 -->
            <msg-image v-else-if="item.msgType === MSGTYPE.IMAGE" :msgData="item"></msg-image>
            <!-- 语音 -->
            <msg-audio v-else-if="item.msgType === MSGTYPE.AUDIO" :msgData="item"></msg-audio>
            <!-- 自定义消息 -->
            <msg-custom v-else-if="item.msgType === MSGTYPE.CUSTOM" :msgData="item" :oppositeInfo="oppositeInfo"></msg-custom>
          </template>
        </div>
      </viewer>
    </div>
    <el-row type='flex' justify='end' v-if='total'>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[20, 30, 50, 70]"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { jsonStringify } from '../common/utils'
import { msgHandler } from '../common/msgHandler'
import { MSGTYPE, ROLE_TYPE, ROLE_TYPE_BUTTON } from '../common/config'
import msgTime from '../components/msgTime'
import msgText from '../components/msgText'
import msgImage from '../components/msgImage'
import msgAudio from '../components/msgAudio'
import msgCustom from '../components/msgCustom'
import mixinAudioPlayer from '../mixin/audioPlayer'
import mixinBusinessHandler from '../mixin/businessHandler'
import api from '@/titancare/api/operation'

export default {
  mixins: [mixinAudioPlayer, mixinBusinessHandler],
  data () {
    return {
      api,
      MSGTYPE,
      ROLE_TYPE_BUTTON,
      visitNumber: '',
      groupId: '', // 群组id
      roleId: '', // 医生登录IM id
      roleType: ROLE_TYPE[2], // 角色身份（默认医生）
      groupInfo: {}, // 群组成员信息
      oppositeInfo: {}, // 对方信息
      allLoaded: false,
      pageNo: 1,
      total: 0,
      pageSize: 20, // 一次请求数量（默认20条）
      chatData: [],
      localhost: '',
      options: {
        title: false,
        url: 'data-src'
      }
    }
  },
  mounted () {
    // let params = JSON.parse(this.$route.query[0]).row
    // this.localhost = params.localhost
    this.visitNumber = this.$route.query.visitNumber
    this.initIMConfig() // 初始化im配置
    api.getGroupId(this.visitNumber).then(rs => {
      if (rs.data && rs.data.orderNo) {
        this.groupId = rs.data.orderNo
        this.fetchGroupInfo(this.groupId)
      }
    })
  },
  methods: {
    // 初始化配置
    initIMConfig () {
      localStorage.setItem('roleType', this.roleType)
    },
    // 获取群成员信息
    fetchGroupInfo (groupId) {
      api.getGroupMember(groupId).then(res => {
        if (!res.errCode) {
          const tempGroupInfo = res.data
          this.roleId = Object.values(tempGroupInfo).filter(item => {
            return item.userTypeEnum === 'DOCTOR'
          })[0].imId
          const onmysiteId = this.roleId
          const oppositeId = Object.keys(tempGroupInfo).filter(id => {
            return id !== this.roleId
          })[0]
          this.groupInfo = {
            admin: {
              msgNick: '',
              msgAccount: '',
              msgHeadurl: ''
            },
            [onmysiteId]: {
              msgNick: tempGroupInfo[onmysiteId].nick,
              msgAccount: tempGroupInfo[onmysiteId].imId,
              msgHeadurl: tempGroupInfo[onmysiteId].faceUrl
            },
            [oppositeId]: {
              msgNick: tempGroupInfo[oppositeId].nick,
              msgAccount: tempGroupInfo[oppositeId].imId,
              msgHeadurl: tempGroupInfo[oppositeId].faceUrl
            }
          }
          this.oppositeInfo = {
            msgNick: tempGroupInfo[oppositeId].nick,
            msgAccount: tempGroupInfo[oppositeId].imId,
            msgHeadurl: tempGroupInfo[oppositeId].faceUrl
          }
          localStorage.setItem('roleId', onmysiteId)
          localStorage.setItem('groupInfo', jsonStringify(this.groupInfo))
          this.fetchHistoryData(this.groupId) // 拉取历史消息
        }
      })
    },
    // 获取历史聊天记录
    fetchHistoryData (groupId) {
      this.chatData = []
      api.getImRecordList({
        groupId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        if (!res.errCode) {
          this.total = res.data.totalCount
          this.chatData = [...this.chatData, ...msgHandler(res.data.resultList, this.groupInfo)]
          this.$previewRefresh()
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchHistoryData(this.groupId)
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.fetchHistoryData(this.groupId)
    }
  },
  components: {
    msgTime,
    msgText,
    msgImage,
    msgAudio,
    msgCustom
  }
}
</script>

<style lang="scss" scoped>
  .message-wrap {
    padding: 0 10px 10px;
    overflow: auto;
    .message-list {
      .msg-item {
        padding-top: 10px;
      }
      padding-bottom: 46px;
    }
    .message-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 46px;
      line-height: 46px;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #fff;
      background-color: #1C7BEF;
    }
    .message-btn:active {
      background-color: #629EEF;
    }
  }
</style>
