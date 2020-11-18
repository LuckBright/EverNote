<template>
  <div class="col">
    <div class="plan-task" align="right">
      <el-button type="primary" @click="add">添加阶段</el-button>
    </div>
    <div class="mt10">
      <div class="container h32 bg">
        <div class="wid100 fl pt10"><span class="pl20">任务模版</span></div>
        <div class="fl right pt10">操作</div>
      </div>
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

        <div class="tree-node wid100 line" slot-scope="{node, data}">
          <div class="container">
            <div class="wid100 fl">{{node.label}}</div>
            <div class="fl right">
              <el-button type="text" :disabled="isDisabled(data)" size="mini" @click="() => modify(data)">编辑</el-button>
              <el-button v-if="!$route.path.indexOf('ordermarketingplanedit')" type="text" size="mini" class="cRed" @click="() => deleteRow(data.id)">删除</el-button>
              <el-button v-if="data.parentId === '0'" type="text" size="mini" @click="() => append(node)">添加任务</el-button>
            </div>
          </div>

        </div>
      </el-tree>
    </div>
    <dialog-stage ref="stage" :packageId="packageId" :packageName="packageDetails.name" :detailId="detailId" :parentId="parentId"></dialog-stage>
    <dialog-plan ref="plan" :packageId="packageId" :packageName="packageDetails.name" :detailId="detailId" :parentId="parentId"></dialog-plan>
  </div>
</template>
<script>
import api from '@/card/store/guaranteeplan/api.js'
import dialogStage from './dialog.stage.vue'
import dialogPlan from './dialog.plan.vue'
export default {
  props: {
    'packageDetails': {
      type: Object,
      default: () => {}
    }
  },
  components: {
    dialogStage,
    dialogPlan
  },
  data () {
    return {
      api,
      defProps: {children: 'childs', label: 'name', isLeaf: 'leaf'},
      treeData: [],
      treeDataTemp: [], // 初始列表
      packageId: this.$route.query.packageId,
      parentId: '',
      detailId: ''
    }
  },
  watch: {
  },
  created () {
    this.getDetails()
  },
  methods: {
    isDisabled (data) {
      if (this.$route.path.indexOf('order') >= 0) {
        if (data.parentId !== '0') {
          return data.executeStatus !== 1 && this.$route.path.indexOf('ordermarketingplanedit')
        } else {
          return !this.treeDataTemp.findIndex(item => item.id === data.id) >= 0
        }
      } else {
        return false
      }
    },
    add () {
      this.parentId = '0'
      this.detailId = ''
      this.$nextTick(_ => {
        this.$refs.stage.open()
      })
    },
    handleNodeClick (data) {
      this.currentParentNum = this.totalParent(data)
      // this.$emit('nodeClick', data)
    },
    getDetails () {
      let params = {}
      if (this.$route.path.indexOf('ordermarketingplanedit') >= 0) {
        if (this.$route.query.instanceId) {
          params.businessInstanceId = this.$route.query.instanceId
        } else {
          params.businessInstanceId = this.$route.query.orderId + this.$route.query.packageId
        }
        api.getByBusinessInstanceId(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.treeData = rs.data || []
            if (!this.treeData.length) {
              this.treeDataTemp = this.treeData
            }
          }
        })
      } else {
        api.getBytemplateId({
          businessTemplateId: this.packageId
        }).then(rs => {
          if (rs.head.errCode === 0) {
            this.treeData = rs.data || []
          }
        })
      }
    },
    modify (val) {
      // todo val.patientId === '0' 阶段or任务
      this.detailId = val.id
      this.parentId = val.parentId
      this.$nextTick(_ => {
        val.parentId === '0' ? this.$refs.stage.open() : this.$refs.plan.open()
      })
    },
    deleteRow (id) {
      api.deleteRow({
        id: id
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'warning', '删除成功')
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
.col /deep/ {
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
.el-form .el-form-item:last-child {
  float:right;
}
</style>
