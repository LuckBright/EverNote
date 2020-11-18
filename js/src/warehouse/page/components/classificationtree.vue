<!-- 药理分类树结构 -->
<template>
  <div id="tree" class="body_con flex outer">
    <el-tree
      style="padding: 0;"
      :data="tableData"
      node-key="id"
      class="overflow item outer"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      @node-click="handelNodeData"
      @check-change="checkChange"
      ref="tree"
      :highlight-current="true"
      :draggable="true"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :props="treeProps"
      :default-expanded-keys="defaultKeys"
      :show-checkbox="showCheckBox ? true : false">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span class="">
          <span class="f14">{{node.label}}</span>
        </span>
        <span class="" v-if="!showCheckBox">
          <el-button v-if="!data.pharmacologyCategories" size="mini" @click="handelRelated(data)">{{associationName}}</el-button>
        </span>
      </div>
    </el-tree>
  </div>
</template>
<script>
import { getFirstRoutePath } from '@/util/common'
export default {
  props: ['customApi', 'customClassifyId', 'showCheckBox'],
  data () {
    return {
      treeProps: {
        label: 'name',
        children: 'pharmacologyCategories'
      },
      tableData: [],
      cacheData: [],
      defaultKeys: [],
      associationName: ''
    }
  },
  created () {
    this.handelChangeData({})
    getFirstRoutePath(this.$route.path, 1) === 'manages' ? this.associationName = '查看已关联药品' : this.associationName = '关联药品'
  },
  methods: {
    async handelChangeData ({ node, customClassifyId, customClassifyArr }) {
      let pamars = {}
      if (customClassifyArr) pamars = { id: customClassifyId }
      if (node && node.data && node.data.id) pamars = { id: node.data.id }
      let nodeData = await this.customApi.list(pamars).then()
      if (pamars.id && ((node && node.level === 1) || customClassifyArr)) {
        nodeData.length && this.tableData.length && this.tableData.forEach((item, index) => {
          if ((node && item.id === node.data.id) || (item.id === customClassifyId)) {
            let createNodeArr = []
            if (node && node.level === 1 && this.tableData[index].pharmacologyCategories && this.tableData[index].pharmacologyCategories.length) createNodeArr = this.tableData[index].pharmacologyCategories
            this.$set(this.tableData[index], 'pharmacologyCategories', [...createNodeArr, ...nodeData])
            this.cacheData = JSON.parse(JSON.stringify(this.tableData))
            this.defaultKeys = [pamars.id]
          }
        })
      } else {
        this.tableData = nodeData
      }
      if (customClassifyArr) {
        this.defaultKeys = customClassifyArr
        this.$refs.tree.setCurrentKey(pamars.id)
      }
    },
    handelNodeData (data, node, event) {
      if (node.level === 1 && !data.pharmacologyCategories) {
        // this.handelChangeData({node})
      }
    },
    checkChange (data, self, child) {
      let ids = this.$refs.tree.getCheckedNodes(child)
      this.$emit('checkChange', ids)
    },
    handelRelated (data) {
      // 关联药品
      getFirstRoutePath(this.$route.path, 1) === 'group' ? this.$router.push('/group/associationdrugs/' + data.id) : this.$router.push('/manages/agencyassociationdrugs/' + data.id)
    },
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.name)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.name)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.name)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.name, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.name, dropType)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.name === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.name
    }
  },
  watch: {
    'customClassifyId' (val) {
      if (val && val.length) {
        this.tableData.map(item => {
          this.$refs.tree.store.nodesMap[item.id].expanded = false
        })
        val.map(item => {
          this.$refs.tree.store.nodesMap[item].expanded = true
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './src/warehouse/page/group/view/organization/index.scss';
.el-tree {
  border: 1px solid #cccccc;
}
.custom-tree-node {
  flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;
}
#tree /deep/ .el-tree > .el-tree-node {
  &:first-child {
    border-top: none;
  }
  border-top: 1px solid #dddddd;
}
#tree /deep/ .el-tree > .el-tree-node > .el-tree-node__content {
  background-color: #ffffff;
}
#tree /deep/ .el-tree-node__content {
  height: auto; padding: 5px 0;
}
</style>

