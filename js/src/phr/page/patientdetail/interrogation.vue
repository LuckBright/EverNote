<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree
        :default-expand-all="true" ref="" node-key="id" :data="treeData" :props="defaultProps"
        @node-click="handleNodeClick">
        <div :class="{'custom-tree-node': true, 'tree-checked': data.orderNo === crt.orderNo}" slot-scope="{ node, data }">
          {{data.inquiryFinishTime}}
        </div>
      </el-tree>
    </div>
    <div class="tree-detail">
      <div class="tree-detail-inner pb20" v-if="treeData && treeData[0] && treeData[0].inquiryFinishTime">
<!--        <follow-box v-if="crt._treeId" :follow-data="crt"></follow-box>-->
        <div class="interrogation-box">
          <div class="message-wrap">
            <div class="message-list">
              <template v-if="chatData && chatData.length">
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
              </template>
            </div>
          </div>
          <el-row type='flex' justify='center' v-if='total'>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-sizes="[20, 30, 50, 70]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-row>
        </div>
      </div>
    </div>
  </div>
<!--  <div class="right-main-container">-->
<!--    -->
<!--  </div>-->
</template>

<script>
  import { msgHandler } from '../../util/msgHandler'
  import { MSGTYPE, ROLE_TYPE, ROLE_TYPE_BUTTON } from '../../util/models'
  import msgTime from '../../component/msgTime'
  import msgText from '../../component/msgText'
  import msgImage from '../../component/msgImage'
  import msgAudio from '../../component/msgAudio'
  import msgCustom from '../../component/msgCustom'
  import mixinAudioPlayer from '../../mixin/audioPlayer'
  import mixinBusinessHandler from '../../mixin/businessHandler'
  import {request} from '@/util/req'
  import urlMap from '../../api/urls'

  export default {
    name: 'interrogation',
    mixins: [mixinAudioPlayer, mixinBusinessHandler],
    data () {
      return {
        MSGTYPE,
        ROLE_TYPE_BUTTON,
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
        crt: {},
        treeData: [],
        defaultProps: {
          label: 'inquiryFinishTime',
          value: 'orderNo',
        },
      }
    },
    created () {
      request(urlMap.getPhrInquiringInfoBySerialNumber, {
        // patientId: 'bqyWrIQEResF45xDR69',
        // outpatientSerialNumber: 'TWIH20200000077',
        patientId: this.$route.query.patientId,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
      }).then(res => {
        this.treeData = (res.data.resultList || []).filter(item => item.inquiryFinishTime)
        if (this.treeData && this.treeData.length) {
          // const orderNo = this.$route.params.orderNo || this.treeData[0].orderNo
          // this.searchDetail(orderNo)
          let crt = this.treeData[0]
          if (this.$route.params.orderNo) {
            crt = this.treeData.find(t => t.orderNo === this.$route.params.orderNo)
          }
          if (crt) {
            this.handleNodeClick(crt, {isLeaf: true})
          }
        }
      })
    },
    mounted () {
      // let params = JSON.parse(this.$route.query[0]).row
      // this.localhost = params.localhost
      // this.groupId = params.orderNo
      // this.initIMConfig() // 初始化im配置
      // this.fetchGroupInfo(this.groupId) // 获取群成员信息
    },
    methods: {
      handleNodeClick (data, node) {
        if (node.isLeaf) {
          this.crt = data
          this.$router.replace({
            query: {
              fromType: this.$route.query.fromType,
              activatedId: data.orderNo,
              patientId: this.$route.query.patientId,
              hospitalizedNumber: this.$route.query.hospitalizedNumber,
              outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
              visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
              visitSerialNumber: this.$route.query.visitSerialNumber,
            }
          })
          this.searchDetail()
        }
      },
      searchDetail () {
        // request(urlMap.getImInfoByOrderNo, {
        //   orderNo: this.crt.orderNo,
        //   // orderNo: '9101G1229319055375159298',
        // }).then(res => {
        //   this.chatData = msgHandler(res.data.resultList)
        //   console.log(JSON.stringify(this.chatData), 'this.chatData')
        // })
        this.initIMConfig()
        this.groupId = this.crt.orderNo
        this.fetchGroupInfo(this.groupId)
      },
      // 初始化配置
      initIMConfig () {
        localStorage.setItem('roleType', this.roleType)
      },
      // 获取群成员信息
      fetchGroupInfo (groupId) {
        request(urlMap.getGroupMemberByOrderNo, {
          orderNo: groupId,
          // orderNo: '9101G1232616325768110082',
        }).then(res => {
          if (JSON.stringify(res.data) !== '{}') {
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
            localStorage.setItem('groupInfo', JSON.stringify(this.groupInfo))
            this.fetchHistoryData(this.groupId) // 拉取历史消息
          }
        })
      },
      // 获取历史聊天记录
      fetchHistoryData (groupId) {
        this.chatData = []
        request(urlMap.getImInfoByOrderNo, {
          orderNo: groupId,
          // orderNo: '9101G1232616325768110082',
          pagesize: this.pageSize,
          offset: (this.pageNo - 1) * this.pageSize,
        }).then(res => {
          if (JSON.stringify(res.data) !== '[]') {
            this.total = res.data.totalCount
            this.chatData = [...this.chatData, ...msgHandler(res.data.resultList, this.groupInfo)]
            // this.$previewRefresh()
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
  .tree-detail-inner {
    background-color: #d5d5d5;
  }
  .tree-detail{
    /*min-width: 900px;*/
    /*max-width: 1400px;*/
    margin: 0 auto;
    /*background: #fff;*/
    font-size: 14px;
    box-sizing: border-box;
    padding: 40px 20px;
    min-height: 100%;
  }
  .message-wrap {
    padding: 0 10px 10px;
    overflow: auto;
    margin: 0 auto;
    width: 500px;
    .message-list {
      background-color: #d5d5d5;
      .msg-item {
        padding: 10px 10px 0 10px;
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
