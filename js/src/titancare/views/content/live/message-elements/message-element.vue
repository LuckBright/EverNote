<template>
  <div>
    <div class="message-comp">
      <div class="position">
        <el-popover
          placement="top"
          width="160"
          trigger="hover"
          v-model="visible"
          title="屏蔽确认"
          v-if="showProhibit && !isMine"
        >
          <p>确认要屏蔽该用户的发言？</p>
          <div style="text-align: center; margin: 0">
            <el-button
              type="primary"
              size="mini"
              @click="addImUserToProhibitList"
              >确定</el-button
            >
          </div>
          <span slot="reference">{{ isMine ? name : message.nick }}：</span>
        </el-popover>
        <span v-if="!isCustomer">
          <span v-if="isMine">{{ isMine ? name : message.nick }}：</span>
          <text-element
            v-if="message._type !== 'goods'"
            class="text-element"
            :payload="message.payload"
          />
          <div v-else>
            <div>
              <el-card class="card">
                <img
                  :src="message.goodsPicture | lgfixImgSrc"
                  class="image"
                  style="width: 50px; height: 50px"
                />
                <div>
                  <span>{{ message.goodsName }}</span>
                </div>
              </el-card>
            </div>
          </div>
        </span>
        <div v-if="isCustomer">
          <div :class="['message', { you: !isMine, me: isMine }]">
            <img class="avatar" :src="isMine ? $store.state.currentUser.photo ? $ever.fileUrl2 + $store.state.currentUser.photo : meAvatar : message.avatar"/>
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">
                  <text-element
                    v-if="message._type !== 'goods'"
                    class="plain"
                    :payload="message.payload"
                  />
                  <div v-else class="card plain">
                    <img
                      :src="message.goodsPicture | lgfixImgSrc"
                      class="fl mt5"
                      style="width: 50px; height: 50px"
                    />
                    <div class="ml60">
                      <span>{{ message.goodsName }}</span>
                      <div class="skill">
                        {{ message.skillTitle2Name }}
                        <span v-show="message.skillTitle2Name">，</span>
                        <span>{{ message.deptName }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TextElement from './text-element'
import playback from '@/titancare/api/content/playback'
export default {
  components: {
    TextElement
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    name: {
      default: '医生',
      type: String
    },
    showProhibit: {
      default: false,
      type: Boolean
    },
    isCustomer: Boolean
  },
  data () {
    return {
      visible: false,
      meAvatar: require('./me.png'),
      youAvatar: require('./you.png'),
    }
  },
  computed: {
    isMine () {
      // console.log('this.message :>> ', this.message)
      return this.message.flow === 'out' || (this.message.flow === 'in' && this.message.payload.data === '1')
    }
  },
  methods: {
    async addImUserToProhibitList () {
      await playback.addImUserToProhibitList({
        imId: this.message.from,
        imName: this.message.nick,
        roomId: this.message.to,
        tenantId: localStorage.getItem('TENANTID')
      })
      this.visible = false
      this.$message({
        message: '禁言成功！',
        type: 'success'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.message-comp {
  line-height: 30px;
}
.position {
  /*display: flex;*/
  overflow: hidden;
}
.text-element {
  display: inline;
  overflow-wrap: anywhere;
}
.card {
  width: 200px;
}
.text-right {
  text-align: right;
}
.message {
  width: 100%;
  margin-bottom: 16px;
  .ml60 {
    margin-left: 60px;
    .skill {
      color: #999;
      font-size: 12px;
      height: 28px;
    }
  }
  &.me {
    float: right;
    text-align: right;
    clear: right;
    .avatar {
      float: right;
    }
    .bubble {
      background-color: #a1e75a;
      &:after,
      &:before {
        border-left-color: #a1e75a;
        border-left-width: 4px;
        left: 100%;
      }
    }
  }
  &.you {
    float: left;
    text-align: left;
    clear: left;
    .avatar {
      float: left;
    }
    .bubble {
      background-color: white;
      &:after,
      &:before {
        border-right-color: white;
        border-right-width: 4px;
        right: 100%;
      }
    }
  }
  .avatar {
    height: 30px;
    width: 30px;
    border-radius: 2px;
  }
  .bubble {
    max-width: 500px;
    min-height: 1em;
    display: inline-block;
    vertical-align: top;
    position: relative;
    text-align: left;
    font-size: 14px;
    border-radius: 4px;
    margin: 0 10px;
    &:after,
    &:before {
      position: absolute;
      top: 9px;
      border: 6px solid transparent;
      content: ' ';
    }
    .bubble_cont {
      word-break: break-all;
      min-height: 25px;
      .plain {
        padding: 9px 13px;
      }
    }
  }
}
</style>
