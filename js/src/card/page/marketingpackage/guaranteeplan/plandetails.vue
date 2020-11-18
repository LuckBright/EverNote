<template>
  <div class="col">
    <ever-bread-crumb :showTitle="'返回'"></ever-bread-crumb>
    <div class="plan-task" align="right">
      <common-head
        align="left"
        :patientId="patientId"
        :code="'013'"
        :visitnumber="''"
      >
      </common-head>
      <el-button v-if="![3,4,6].includes($route.query.status)" type="primary" size="small" @click="editMaster">修改计划任务</el-button>
      <el-button v-if="![3,4,6].includes($route.query.status)" type="primary" size="small" @click="stopMaster">终止计划任务</el-button>
    </div>
    <div class="mt10">
      <!-- <div class="container h32 bg">
        <div class="wid100 fl pt10"><span class="pl20">任务模版</span></div>
        <div class="fl right pt10">操作</div>
      </div> -->
    </div>
    <div>
      <el-tree
        class="tree plantree"
        ref="tree"
        :data="treeData"
        :props="defProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="handleNodeClick"
        :indent="24">

        <div class="tree-node wid100" slot-scope="{node, data}">
          <div class="container">
            <div class="wid100 fl">
              <div class="wid50">
                <span>{{node.label}}</span>
                <span v-if="data.parentId !== '0'" class="send-span ml5" :class="data.executeMethod === 1 ? 'bgbule': 'bggreen'">{{data.executeMethod === 1 ? '短信' : '微信'}}</span>
              </div>
              <div v-if="data.parentId !== '0'" class="wid50">
                <span align="right">{{EXECUTESTATUS[data.executeStatus]}}</span>
              </div>
            </div>
            <div class="fl right">
              <el-button type="text" size="mini" @click="() => showDetail(data)">查看</el-button>
              <el-button v-if="data.executeStatus === 2" type="text" size="mini" class="cRed" @click="() => stopTask(data.id)">停止</el-button>
              <el-button v-if="data.executeStatus === 1" type="text" size="mini" @click="() => startTask(data.id)">立即启动</el-button>
            </div>
          </div>
        </div>
      </el-tree>
    </div>
    <dialog-palndetail ref="plandetail" :detailId="detailId"></dialog-palndetail>
    <dialog-stagedetail ref="stagedetail" :detailId="detailId"></dialog-stagedetail>
  </div>
</template>
<script>
import commonHead from '@/inpatient/components/common.head.js'
import dialogPalndetail from './dialog.plandetail.vue'
import dialogStagedetail from './dialog.stagedetail.vue'
import api from '@/card/store/guaranteeplan/api.js'
import {EXECUTESTATUS} from '@/card/util/cardcommon.js'
export default {
  data () {
    return {
      api,
      EXECUTESTATUS,
      defProps: {children: 'childs', label: 'name', isLeaf: 'leaf'},
      treeData: [],
      parentId: '',
      patientId: this.$route.params.id,
      instanceId: this.$route.query.instanceId,
      detailId: '',
      key: ''
    }
  },
  components: {
    commonHead,
    dialogPalndetail,
    dialogStagedetail
  },
  created () {
    this.getDetails()
  },
  methods: {
    showDetail (data) {
      this.detailId = data.id
      this.$nextTick(_ => {
        data.parentId === '0' ? this.$refs.stagedetail.open() : this.$refs.plandetail.open()
      })
    },
    handleNodeClick (data) {
      this.currentParentNum = this.totalParent(data)
    },
    getDetails () {
      api.getByBusinessInstanceId({
        businessInstanceId: this.instanceId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.treeData = rs.data || []
        }
      })
    },
    modify (val) {
      this.detailId = val.id
      this.parentId = val.parentId
      this.$nextTick(_ => {
        val.parentId === '0' ? this.$refs.stage.open() : this.$refs.plan.open()
      })
    },
    stopTask (id) {
      api.stopTask({
        id: id
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '停止成功')
          this.getDetails()
        }
      })
    },
    editMaster() {
      this.$bus.$emit('package-tab', { name: '3' })
      if (this.$route.path.indexOf('/kanban/package/plandetails') >= 0) {
        this.$router.push({path: '/kanban/ordermarketingplanedit', query: {packageId: this.$route.query.planId, instanceId: this.$route.query.instanceId, orderId: this.$route.query.orderId, categoryId: '06', activeName: 3}})
      } else {
        this.$router.push({path: '/card/ordermarketingplanedit', query: {packageId: this.$route.query.planId, instanceId: this.$route.query.instanceId, categoryId: '06', activeName: 3}})
      }
    },
    stopMaster () {
      api.stopMasterTask({
        id: this.instanceId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          this.getDetails()
        }
      })
    },
    startTask (id) {
      api.startTask({
        id: id
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '启动成功')
          this.getDetails()
        }
      })
    },
    append (val) {
      this.parentId = val.key
      this.detailId = ''
      this.$nextTick(_ => {
        this.$refs.plan.open()
      })
    },
    totalParent () {}
  }
}
</script>
<style lang="less" scoped>
.fl{float: left;}
.wid100{width: 100%;}
.container{ padding-right:230px;}
.right{ width: 230px;margin-right:-230px;}
.h32{height: 32px;}
.bg{background: #F0F5FA;font-size: 14px;color: #4E5259;border: 1px solid #DADCE0;}
.wid50{width:50%;display: inline-block;}
.send-span{width:39px;border-radius: 2px;font-size: 14px;color: #FFFFFF;line-height: 14px;}
.bgbule{background: #1C7BEF;}
.bggreen{background: #6DC829;}
.col{
  font-size: 14px;
  vertical-align: inherit;
  /deep/ .el-tree{
    color: #2B333D;
    .el-tree-node {
      line-height: 32px;
    }
    .el-tree-node__content{
      border-bottom: 1px solid #DADCE0;
      border-left: 1px solid #DADCE0;
      border-right: 1px solid #DADCE0;
      height:32px;
    }
  }
}
</style>
