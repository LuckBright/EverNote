<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <binglitree  @nodeclick="handleNodeClick"></binglitree>
    </div>
    <div class="tree-detail">
      <div class="tree-detail-inner">
        <el-tabs v-if="editableTabs.length > 0" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.dataId"
            :label="item.name"
            :name="item.dataId + ''"
          >
            <bingli :data="item" style="margin-left: -1px"></bingli>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import binglitree from './components/binglitree'
import bingli from './components/bingliindex'
export default {
  data () {
    return {
      editableTabsValue: '',
      editableTabs: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick (data, node) {
      if (node.isLeaf) {
        this.addTab(data)
      }
    },
    addTab (data) {
      let tempIndex = this.editableTabs.findIndex(item => item.dataId === data.dataId)
      if (tempIndex === -1) {
        this.editableTabs.push(data)
        this.editableTabsValue = data.dataId + ''
      } else {
        this.editableTabsValue = this.editableTabs[tempIndex].dataId + ''
      }
    },
    removeTab (targetName) {
      let tempIndex = this.editableTabs.findIndex(item => (item.dataId + '') === targetName)
      if (targetName === this.editableTabsValue && this.editableTabs.length > 1 && tempIndex !== -1) {
        let temptab = this.editableTabs[tempIndex + 1] || this.editableTabs[tempIndex - 1]
        this.editableTabsValue = temptab.dataId + ''
      }
      this.editableTabs.splice(tempIndex, 1)
    }
  },
  components: {
    binglitree,
    bingli
  }
}
</script>

<style lang="less" scoped>
  .tree-detail{
    /deep/ .el-tabs__content {
      height: calc(~"100vh - 190px");
      overflow-y: auto;
    }
    padding: 20px 10px 0 20px;
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    overflow: auto;
    .tree-detail-inner{
      min-width: 836px;
      max-width: 1400px;
      min-height: 100%;
      box-sizing: border-box;
      /*margin: 0 auto;*/
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav{
        border: 0px;
      }
      /deep/ .el-tabs__header {
        margin: 0 0 -1px 0;
      }
      /deep/ .el-tabs__nav-wrap is-top{
        background: #F3F7FB;
      }
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.el-tabs__item.is-active{
        color: #333;
        background: #ffffff;
        border-bottom: 1px solid #fff;
      }
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
        border-top: none;
        border-left: none;
        border-right: 1px solid #e4e7ed;
        border-bottom: 1px solid #e4e7ed;
        border-radius: 0;
        background: #F3F7FB;
        font-weight: normal;
        color: #666;
        :hover{
          color: #333;
        }
      }
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable{
        padding-left: 13px;
        padding-right: 13px;
      }
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
        width: 14px;
        line-height: 14px;
      }
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav{
        border-radius: 0;
      }
     }
    .btn-box{
      min-width: 836px;
      max-width: 1400px;
      /*margin: 0 auto 10px;*/
      text-align: right;
      button{
        margin-left: 10px;
      }
    }
  }
</style>
