<template>
  <el-popover
    v-model="visible"
    @show="getTimeTrunkInfo"
    placement="right"
    width="300"
    trigger="click"
  >
    <el-row v-for="(item, i) in list" :key="i" class="{line: i < list.length - 1}">
      <el-col :span="24" v-if="i === 0">
        <strong>{{item.organName}} {{item.deptName}}</strong>
      </el-col>
      <el-col :span="20">
        <p v-if="item.resourceArrangeServiceList && item.resourceArrangeServiceList[0]">
          <label>服务：</label>
          <span
            v-for="(service, k) in item.resourceArrangeServiceList"
            :key="k"
          >{{service.serviceName}} {{k < item.resourceArrangeServiceList.length - 1 ? '/' : ''}}</span>
        </p>
        <p v-if="item.resourceArrangeResourceList && item.resourceArrangeResourceList[0]">
          <label>关联：</label>
          <span
            v-for="(resourc, k) in item.resourceArrangeResourceList"
            :key="k"
          >{{resourc.resourceName}} {{k < item.resourceArrangeResourceList.length - 1 ? '、' : ''}}</span>
        </p>
        <template v-for="range in item.timeRangeList">
          <p v-for="(res, j) in range.resourceArrangeTimeRangeList" class="clearfix" :key="j">
            <span style="margin-right: 20px;" class="fl">{{res.startTime}}-{{res.endTime}}</span>
            <span
              v-if="res.arrangeType===1"
              class="fl"
            >{{res.serviceTimeSlice}} 分钟 / {{res.sliceVolume}} 人</span>
            <span v-if="res.arrangeType===2" class="fl">{{res.totalVolume}} 人</span>
            <!-- <i class="iconfont icon-woderenwu fr" @click="selectTimeTrunkInfo(item, res, $event)" v-if="operate === 2"></i> -->
          </p>
        </template>
      </el-col>
      <el-col :span="4" align="right">
        <p>
          <i class="iconfont icon-delete" @click="delTimeTrunkInfo(item.id)" v-if="operate === 1"></i>
          <i class="iconfont icon-edit" @click="editTimeTrunkInfo(item)" v-if="operate === 1"></i>
        </p>
      </el-col>
    </el-row>
    <el-button
      :type="timetrunk.canAppoint === false ? 'info' : 'primary'"
      plain
      slot="reference"
      size="medium"
      class="trunkBtn ellipsis"
    >{{timetrunk.timeTrunkName}}</el-button>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/schedulingapi'
import settingapi from '@/arrange/store/settingapi'
import appointapi from '@/arrange/store/appointapi'

export default {
  props: ['timetrunk', 'templetId', 'resource', 'dept', 'date', 'operate', 'trunkType', 'popover'],
  data () {
    return {
      api,
      appointapi,
      settingapi,
      visible: false,
      list: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$emit('select', {
          timeTrunkType: !this.templetId ? 1 : this.trunkType,
          templetId: this.templetId,
          resourceId: this.resource.resourceId,
          resourceName: this.resource.resourceName,
          deptId: this.dept.deptId,
          deptIds: [this.dept.deptId],
          deptName: this.dept.deptName,
          organId: this.timetrunk.organId,
          timeTrunkId: this.timetrunk.timeTrunkId,
          date: this.date
        })
      }
    }
  },
  methods: {
    getTimeTrunkInfo () {
      let params = {
        timeTrunkType: !this.templetId ? 1 : this.trunkType,
        templetId: this.templetId,
        resourceId: this.resource.resourceId,
        resourceName: this.resource.resourceName,
        deptId: this.dept.deptId,
        deptName: this.dept.deptName,
        organId: this.timetrunk.organId,
        timeTrunkId: this.timetrunk.timeTrunkId,
        date: this.date
      }
      this.visible = true
      this.list = []
      this.api.getResourceArrange(params).then(rs => {
        this.list = rs.data
      })
    },
    editTimeTrunkInfo (val) {
      this.visible = false
      this.$emit('edit', val)
    },
    delTimeTrunkInfo (id) {
      this.api.del(id).then(rs => {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return this.api.del(id)
        }).then(() => {
          this.$messageTips(this, 'success', '删除成功!')
          this.$emit('refresh', true)
        }).catch((e) => {
          this.settingapi.returnArrangeBasesetResource(id).then(rs => {
            this.$emit('refresh', true)
          })
        })
      })
    }
  }
}
</script>
<style scoped>
.line {
  border-bottom: 1px solid #ddd;
}
.trunkBtn {
  margin-bottom: 5px;
  max-width: 150px;
  margin-right: 5px;
  margin-left: 0;
}
.iconfont {
  color: #1c7bef;
  cursor: pointer;
}
.el-button + .el-button {
  margin-right: 10px;
  margin-left: 0;
}
</style>
