<template>
  <div>
    <h4 class="tit">审批流程</h4>
    <div class="cnt">
      <div class="flows">
        <!-- 流程发起点 -->
        <div class="flow">
          <div class="flowArrow"></div>
          <p class="iconWar">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-faqi"></use>
            </svg>
          </p>
          <p><span class="time">{{ $moment(Number(processOriginObj.startTime)).format("YYYY-MM-DD HH:MM:SS") }}</span><span class="name">发起人：</span><span class="position">{{ processOriginObj.initiatorName }}</span></p>
          <div class="flowArrow"></div>
        </div>
        <div class="flow" v-for="(item, index) in processArray" :key="index">
          <template>
            <p class="iconWar"><i :class="formatProcessIcon(item.variables)"></i></p>
            <p>
              <span class="time">{{item.variables && item.variables.handleTime }}　
                <span v-if="item.duration">历时：{{ dateDiffBymsecond(item.duration * 1000) }}</span>
              </span>
              <span class="name">{{ item.activityName }}</span><span class="position">{{ item.variables && item.variables.handleUserName }}</span>
            </p>
            <p><span class="status cGreen">{{ item.variables | formatProcessStatus }}</span><span class="remark">审核意见：{{ item.variables && item.variables.remark }}</span></p>
          </template>
        </div>
        <!-- 为了可读性，起因是不知道后面还有多少个节点需要审批，又不能直接绘制到最后一个节点所以增加一个看起来是有下一步的节点展示方式 -->
        <div class="flow" v-if="!completeFlag">
          <p class="iconWar">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-faqi"></use>
            </svg>
          </p>
          <p><span class="name">．．．</span></p>
          <div class="flowArrow"></div>
        </div>
        <!-- 流程结束点 -->
        <div class="flow">
          <p class="iconWar">
            <template v-if="completeFlag">
              <i class="icon iconfont icon-wancheng cGreen"></i>
            </template>
            <template v-else>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-faqi"></use>
              </svg>
            </template>
          </p>
          <p><span class="name">审批结束</span></p>
        </div>
      </div>
    </div>
    <div v-if="processHandleFlag">
      <h4 class="tit">审批意见</h4>
      <div class="cnt">
        <div class="submit-content">
          <el-input type="textarea" placeholder="请填写审批意见" :rows="4" v-model="remark"></el-input>
        </div>
        <div align="left">
          <el-button
            type="primary"
            v-for="(item, index) in handlers" :key="index"
            v-ever-click-once="disabled"
            :disabled="disabled"
            @click="processHandle(item)">{{item.name}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'
import { dateDiffBymsecond } from '@/util/common'

export default {
  props: {
    'processInstanceId': {
      type: String
    }
  },
  data () {
    return {
      disabled: false,
      taskId: '',
      detailObject: {},
      formUrl: '',
      remark: '',
      processArray: [],
      processHandleFlag: false,
      handlers: [],
      processOriginObj: {
        startTime: '',
        activityName: ''
      },
      completeFlag: false
    }
  },
  filters: {
    formatProcessStatus: function (val) {
      if (val) {
        if (val.flag === '1') {
          return '已通过'
        } else if (val.flag === '0') {
          return '已驳回'
        }
      } else {
        return ''
      }
    }
  },
  created () {
    this.getProcessDetail()
    this.getProcessArray()
    this.getProcessOriginDetail()
  },
  methods: {
    // 根据状态显示不同图标
    formatProcessIcon: function (val) {
      if (val) {
        if (val.flag === '1') {
          return 'icon iconfont icon-wancheng cGreen'
        } else if (val.flag === '0') {
          return 'icon iconfont icon-cuowu cRed'
        }
      } else {
        return 'icon iconfont icon-zhengzaishenhe cOrange'
      }
    },
    // 格式化历时（后端返回的是秒，需要变成 X天X小时X分X秒 的格式
    dateDiffBymsecond (msecond) {
      return dateDiffBymsecond(msecond)
    },
    // 改流程的操作方式。一般为 通过|驳回 flag=1 通过，flag=0 驳回，也接受用户自定义操作名称（name）和提交参数（flag=1）
    processHandle (data) {
      let params = {
        processData: {
          taskId: this.taskId
        },
        businessData: {
          remark: this.remark,
        }
      }
      delete data.name
      Object.assign(params.businessData, data)
      request(urlMap.process.completeTask, params).then(res => {
        if (res.head.errCode === 0) {
          let that = this
          this.processHandleFlag = false
          this.$messageTips(this, 'success', '操作成功', '提示', 3000, false, function () {
            that.$emit('onSubmit')
          })
        }
      })
    },
    // 获取该流程的部分信息，审批单名称,发起人姓名,发起时间,业务编号,查看详情url地址
    getProcessDetail () {
      request(urlMap.process.getToDoTask, {
        'processInstanceId': this.processInstanceId,
        'pagesize': 1,
        'offset': 0
      }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data) {
            let tmp = res.data[0]
            tmp.variables.forEach(element => {
              if (element.name === 'businessCode') {
                tmp.businessCode = element.text
              }
              if (element.name === 'formUrl') {
                tmp.formUrl = element.text
              }
            })
            this.taskId = tmp.taskId
            this.detailObject = tmp
            this.getProcessHandles(tmp.taskId)
            this.processHandleFlag = true
            // this.$emit('getProcessObj', this.detailObject)
          }
        }
      })
    },
    // 获取该流程的部分信息发起人，发起时间两个信息
    getProcessOriginDetail () {
      request(urlMap.process.getVarByProcessInstanceId, {
        'processInstanceId': this.processInstanceId
      }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data) {
            this.processOriginObj = res.data
            this.$emit('getProcessObj', this.processOriginObj)
          }
        }
      })
    },
    // 获取每个审批步骤
    getProcessArray () {
      request(urlMap.process.getInstanceInfoById, {
        'processInstanceId': this.processInstanceId,
      }).then(res => {
        if (res.head.errCode === 0) {
          this.processArray = res.data
          // 最后一个节点有流程变量表示该流程已经办完了
          if (this.processArray.pop().variables) {
            this.completeFlag = true
          }
        }
      })
    },
    // 获取下个节点的操作状态，也就是当前节点可以的操作
    getProcessHandles (taskId) {
      request(urlMap.process.nextFlowNode, {
        'taskId': taskId,
      }).then(res => {
        if (res.head.errCode === 0) {
          this.handlers = res.data
        }
      })
    }
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
.tit {
  border-left: 3px solid #1c7bef;
  padding-left: 5px;
  font-size: 14px;
  margin: 10px 0;
}
.cnt {
  line-height: 30px;
  color: #333;
  font-size: 14px;
}
.cnt p .ti {
  color: #666;
  display: inline-block;
  width: 8em;
  text-align: right;
}
.submit-content {
  margin-bottom: 10px;
}
.flows {
  border-left: 1px solid #ccc;
  margin-left: 80px;
  font-size: 14px;
  max-width: 600px;
}
.flows .flow {
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 8px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  margin: 0 0 30px 20px;
  padding: 5px 8px;
  position: relative;
}
.flow p {
  line-height: 26px;
}
.flow .iconWar {
  position: absolute;
  left: -29px;
  top: 4px;
}
.flowArrow {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  margin-bottom: 3px;
  border-right-color: #ccc;
  border-left-width: 0;
  border-width: 6px;
  filter: drop-shadow(0 0 8px 0 rgba(204, 204, 204, 0.5));
  left: -13px;
  top: 12px;
}
.flowArrow:after {
  content: ' ';
  border-width: 6px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  bottom: -6px;
  left: 1px;
  border-right-color: #fff;
  border-left-width: 0;
}
.flow .time {
  float: right;
  color: #ccc;
  font-size: 12px;
}
.flow .name {
  font-weight: bold;
  color: #000;
  font-size: 14px;
}
.flow .position {
  font-size: 12px;
  color: #666;
  padding-left: 0.5em;
}
.flow .status {
  float: right;
  font-size: 14px;
  line-height: 18px;
}
.flow .remark {
  display: block;
  margin-right: 50px;
  line-height: 20px;
  font-size: 12px;
  color: #666;
}
</style>
