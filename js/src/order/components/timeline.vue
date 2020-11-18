<template>
  <div>
    <!-- 标题 -->
    <div class="title f_bold">{{title}}</div>

    <el-timeline class="timeline">
      <el-timeline-item :type="type ? 'primary' : line.type" :timestamp="line.createTime" :hide-timestamp="hideTimestamp" v-for="(line, index) in timeLines" :key="index" placement="top">
        <el-card shadow="hover">
          <!-- 明细标题  展示在节点左侧 -->
          <div class="timeline-title f14 f_bold">{{line.operationNode | formateValueToFnt({list: OPERATION_NODE})}}</div>

          <el-row :gutter="20">
            <el-col :span="6">
              <!-- -->
              <strong v-if="[4, 11, 12].includes(line.operationNode)">{{line.pushResults | formateValueToFnt({list: PUSH_STATUS, showKey: line.pushResults == 1 ? 'alias' : 'name'})}} &nbsp;</strong>
              <strong v-else>{{line.transactor}} &nbsp;
                <span :class="line.operationNode | formateValueToFnt({list: OPERATION_NODE, showKey: 'color'})" class="f16">{{line.operationNode | formateValueToFnt({list: OPERATION_NODE, showKey: 'subName'})}}</span>
              </strong>
            </el-col>
            <el-col :span="6" align="right">
              <div>{{line.createTime}}</div>
            </el-col>
            <el-col :span="12" v-if="index > 0">
              <div>耗时： {{dateDiffBymsecond(line.createTime, timeLines[index - 1].createTime) }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="line.operationNode == 6 && (line.expressCompanyName || line.expressNumber)">
            <el-col :span="6">
              <strong>{{line.expressCompanyName}}</strong>
            </el-col>
            <el-col :span="18">
              <div>快递单号：{{tranformArrayToString(line.expressNumber)}}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { OPERATION_NODE, PUSH_STATUS } from '../util/const'
import { dateDiffBymsecond } from '@/util/common'
export default {
  props: {
    title: { // 标题
      type: String,
      default: '发货流程'
    },
    timeLines: { // 时间轴数据列表
      type: Array,
      required: true,
      default: () => []
    },
    type: { // 节点类型,默认为 primary
      type: String,
      default: 'primary'
    },
    hideTimestamp: { // 是否隐藏时间戳
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      OPERATION_NODE,
      PUSH_STATUS
    }
  },
  methods: {
    // 格式化历时（后端返回的是秒，需要变成 X天X小时X分X秒 的格式
    dateDiffBymsecond (curTime, beforeTime) {
      const msecond = this.$moment(curTime).valueOf() - this.$moment(beforeTime).valueOf()
      return dateDiffBymsecond(msecond)
    },
    /**
     * array 转换 为 字符串
     * 后端返回字符串形式的数组，parse后可能无法解析
    */
    tranformArrayToString (arr) {
      try {
        return JSON.parse(arr).join(', ')
      } catch (e) {
        return '非法数据'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline {
  margin-left: 180px;
  /deep/.el-card__body {
    padding: 10px 15px;
    line-height: 30px;
  }
  .timeline-title {
    position: absolute;
    top: -5px;
    left: -200px;
    width: 180px;
    text-align: right;
    padding-right: 20px;
  }
}
.title {
  font-size: 16px;
  color: #333;
  padding-left: 10px;
  margin: 15px 0;
  border-left: 3px solid #1C7BEF;
}
</style>
