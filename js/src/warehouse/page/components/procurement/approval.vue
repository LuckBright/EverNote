<template>
  <div class="approval">
    <!-- 横线 -->
    <div class="hr"></div>
    <!-- 标题 -->
    <div class="title">{{title || '审批流程'}}</div>
    <div class="approval_flow">
      <!-- 展开状态 -->
      <ul v-if="expand">
        <li v-for="(item, index) in data" :key="index">
          <div class="label" :class="item.variables.eventStatus === 'REJECT' ? 'red' : ''">{{item.variables.eventName ? item.variables.eventName : '待处理'}}</div>
          <div class="step">
            <span class="line"></span>
            <span class="bot" :class="item.variables.eventStatus === 'REJECT' ? 'bot_disagree' : item.variables.eventStatus === 'AGREE' ? 'bot_agree' : ''"></span>
            <span class="line"></span>
          </div>
          <div class="content">
            <p class="name">{{item.variables.operateName}}<span>{{Number(item.startTime) | formatDateByExp('YYYY-MM-DD')}}</span></p>
            <p class="desc" :title="item.variables.suggestion" v-if="item.variables.suggestion">审批意见：{{item.variables.suggestion}}</p>
            <p class="process" v-if="index !== data.length - 1"></p>
          </div>
        </li>
      </ul>
      <!-- <p v-if="expand && data.length > 1" class="expand expand_margin" @click="expand = false">收起审批详情</p> -->
      <!-- 非展开状态 -->
      <ul v-else-if="!expand && data.length > 1">
        <li>
          <div class="label">{{data[0].variables.eventName}}</div>
          <div class="step">
            <span class="line"></span>
            <span class="bot"></span>
            <span class="line"></span>
          </div>
          <div class="content">
            <p class="name">{{data[0].variables.operateName}}<span>{{data[0].startTime | formatDateByExp('YYYY-MM-DD')}}</span></p>
            <!-- <p class="process"><i class="iconfont icon-shenpi_zhankai"></i><span class="expand" @click="expand = true">展开审批详情</span></p> -->
          </div>
        </li>
        <li>
          <div class="label">{{data[data.length - 1].variables.eventName}}</div>
          <div class="step">
            <span class="line"></span>
            <span class="bot" :class="data[data.length - 1].variables.eventStatus === 'REJECT' ? 'bot_disagree' : data[data.length - 1].variables.eventStatus === 'AGREE' ? 'bot_agree' : ''"></span>
            <span class="line"></span>
          </div>
          <div class="content">
            <p class="name">{{data[data.length - 1].variables.operateName}}<span>{{data[data.length - 1].startTime | formatDateByExp('YYYY-MM-DD')}}</span></p>
          </div>
        </li>
      </ul>
      <!-- 输入框 -->
      <el-input v-if="!disabled && data[data.length - 1].variables.eventStatus !== 'RESTART'" placeholder="请输入审批意见" v-model="textarea"></el-input>
    </div>
    <!-- 按钮 -->
    <el-button v-if="!disabled && data[data.length - 1].variables.eventStatus !== 'RESTART'" type="primary" @click="agreeProcess">同意</el-button>
    <el-button v-if="!disabled && data[data.length - 1].variables.eventStatus !== 'RESTART'" @click="disagreeProcess">{{disagreetext ? disagreetext : '驳回'}}</el-button>
    <el-button type="text" v-if="!disabled && data[data.length - 1].variables.eventStatus !== 'RESTART' && remarkFlag" @click="remark">
        <i class="iconfont icon-pingjia"></i>
        <span class="log-btn-text">评论</span>
    </el-button>
  </div>
</template>

<script>
  import {debounce} from '@/util/common'
  import sets from '@/util/setstatusname'
  export default {
    mixins: [sets],
    props: ['title', 'data', 'disabled', 'remarkFlag', 'disagreetext'],
    data () {
      return {
        expand: true,
        textarea: ''
      }
    },
    methods: {
      remark: debounce(function () { // 同意
        this.$emit('remark')
      }),
      agreeProcess: debounce(function () { // 同意
        this.$emit('agree', this.textarea.trim())
      }),
      disagreeProcess: debounce(function () { // 驳回
        if (this.textarea.trim()) {
          this.$emit('disagree', this.textarea.trim())
        } else {
          this.$messageTips(this, 'warning', '请输入审批意见', '提示')
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .approval {
    padding-top: 10px;
    .log-btn-text {
      font-size: 14px;
    }
    .iconfont {
      vertical-align: -2px;
    }
    .hr {
      padding: 0;
      margin: 0;
      border-color: #ddd;
    }
    .title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
      padding-left: 10px;
      margin: 20px 0;
      border-left: 3px solid #1C7BEF;
    }
    .approval_flow {
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      ul {
        padding: 0;
        margin: 0;
        li {
          display: flex;
          .label {
            width: 80px;
            text-align: center;
            font-size: 16px;
            color: #333;
          }
          .red {
            color: #EE4433;
          }
          .step {
            margin: 0 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .bot {
              width: 8px;
              height: 8px;
              border-radius: 4px;
              background: #1C7BEF;
            }
            .bot_agree {
              background: #7ED321;
            }
            .bot_disagree {
              background: #EE4433;
            }
            .line {
              display: inline-block;
              width: 2px;
              background: #ddd;
            }
            .line:first-child {
              height: 5px;
            }
            .line:last-child {
              flex: 1;
            }
          }
          .content {
            p {
              margin: 0;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
            }
            .name {
              font-size: 16px;
              color: #333;
              span {
                font-size: 12px;
                color: #999;
                margin-left: 10px;
              }
            }
            .desc {
              width: 372px;
              font-size: 14px;
              color: #666;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: inline-block;
            }
            .process {
              font-size: 14px;
              color: #999;
              margin-left: -32px;
              .icon {
                background: url("../../../../assets/img/step.png") no-repeat;
              }
              .iconfont {
                background-color: #fff;
              }
              .icon, .iconfont {
                width: 17px;
                height: 17px;
                border-radius: 50%;
                margin-right: 15px;
              }
            }
          }
        }
        li:first-child {
          .step {
            .line:first-child {
              opacity: 0;
            }
          }
        }
        li:last-child {
          .step {
            .line:last-child {
              opacity: 0;
            }
          }
          .content {
            margin-bottom: 0;
            p:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .expand {
        font-size: 14px;
        color: #1C7BEF;
        text-decoration: underline;
        margin-bottom: 0;
        cursor: pointer;
      }
      .expand_margin {
        margin-left: 128px;
      }
    }
    .el-input {
      margin: 10px 0;
    }
  }
</style>
