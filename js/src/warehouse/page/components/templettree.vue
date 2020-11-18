<template>
<div class="custom-tree-container flex_column_full_hidden" style="overflow-y: auto">
  <div class="block">
    <el-tree
      :show-checkbox="checkbox ? true : false"
      :data="tableData"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :default-checked-keys="defaultChecked || []"
      :indent="150"
      ref="tree"
      height="300"
      @check-change="checkChange"
      :render-content="renderContent">
    </el-tree>
  </div>
</div>
</template>
<script>
import { getFirstRoutePath } from '@/util/common'
export default {
  props: ['tableData', 'checkbox', 'setAll', 'defaultChecked', 'customPath', 'customPathsee', 'systemType', 'customPathList', 'propertyPath', 'btnselectall'],
  data () {
    return {
      defaultProps: {
        children: 'classifyList',
        label: 'name'
      }
    }
  },
  created () { },
  methods: {
    checkChange (data, self, child) {
      let ids = this.$refs.tree.getCheckedNodes(child)
      this.$emit('checkChange', ids)
    },
    handleJump (data) {
      let source = data.templetDictObject ? 'tempdictionary' : 'group'
      let id = data.templetDictObject ? data.templetDictObject.id : data.templetObject.id
      let status = data.templetDictObject ? data.templetDictObject.status : data.templetObject.status
      let classifyId = data.templetDictObject ? data.templetDictObject.classifyId : data.templetObject.classifyId
      this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.customPathsee}/${id}?source=${source}&status=${status}&classifyId=${classifyId}&inUse=${data.isInUse}&systemType=${this.systemType}&routePath=${this.customPath}&customPathList=${this.customPathList}&propertyPath=${this.propertyPath}`)
    },
    handleHistory (store, data) {
      this.$emit('handleHistory', { store, data })
    },
    handleEdit (store, data) {
      let id = ''
      if (data.templetDictObject) {
        id = data.templetDictObject.id
        this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.customPath}/${id}?systemType=${this.systemType}&inUse=true&routePath=${this.customPath}&propertyPath=${this.propertyPath}&customPathList=${this.customPathList}`)
      }
      if (data.templetObject) {
        id = data.templetObject.id
        this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.customPath}/${id}?systemType=${this.systemType}&source=group&inUse=true&routePath=${this.customPath}&propertyPath=${this.propertyPath}&customPathList=${this.customPathList}`)
      }
    },
    getTempletName (store, data) {
      let name = ''
      if (data.templetObject) {
        name = data.templetObject.name || ''
      } else if (data.templetDictObject) {
        name = data.templetDictObject.name || ''
      }
      return name
    },
    renderContent (h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <span class="pos_ab templet_name"><el-button type="text" on-click={() => this.handleJump(data)}>{this.getTempletName(store, data)}</el-button></span>
            <span class="pos_ab templet_btn">
              <span v-show={data.relevance === 3 || data.templetObject}>
                <el-button size="small" plain on-click={() => this.handleEdit(store, data)}>编辑模版</el-button>
                <el-button v-show={false} size="small" plain on-click={() => this.handleHistory(store, data)}>历史记录</el-button>
              </span>
            </span>
          </span>
        </span>)
    },
    _recursion (data, name, arr) {
      data.forEach(item => {
        if (item[name]) {
          this._recursion(item[name], name, arr)
        }
        arr.push(item)
      })
    }
  },
  watch: {
    setAll (v) { // 全选checkbox
      if (!this.btnselectall) return
      let arr = []
      let arr2 = []
      // 平铺table数据
      this._recursion(this.tableData, 'classifyList', arr)
      if (!v) {
        arr.forEach((item, index) => {
          for (let i = 0; i < this.defaultChecked.length; i++) {
            if (item.id === this.defaultChecked[i]) {
              arr2.push(item)
            }
          }
        })
        arr = arr2
      }
      this.$refs.tree.setCheckedNodes(arr)
    }
  }
}
</script>
<style scoped lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree {
    /deep/ .el-tree-node__content { line-height: 39px; height: 39px; }
  }
  .el-tree {
    font-size: 14px;
    border: 1px solid #dfe6ec;
    border-top: none;
    border-radius: 0 0 4px;
    padding: 0;
    /deep/ .el-tree-node__content>.el-checkbox {
      vertical-align: top;
    }
    /deep/ .el-tree-node {
      position: relative;
      .el-tree-node__content {
        border-top: 1px solid #dfe6ec;
      }
    }
    /deep/ .el-tree-node__expand-icon {position: relative; left: -1000px}
    /deep/ .pos_re { display: inline-block }
    /deep/ .templet_name { left: 500px;}
    /deep/ .templet_btn { right: 20px;}
  }
</style>
