<template>
  <el-drawer
    title="调整菜单顺序"
    :visible.sync="dialogVisible"
    class="resDrawer"
    direction="rtl"
    size="40%">
    <el-tree
      class="filter-tree"
      ref="tree"
      v-model="filterText"
      v-loading="loading"
      :data="resTreeArr"
      node-key="rid"
      draggable
      @node-drop="handleDrop"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :default-expanded-keys="defaultExpandList"
      :props="defaultProps"
      :filter-node-method="filterNode">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span :class="[{'group-node': !data.menuId}, (node.data.type === 2 ? 'cBlue' : '')]">
          {{ getNodeDisplay(node) }}
        </span>
      </div>
    </el-tree>
  </el-drawer>
</template>
<script>
import api from '@/auth/store/resourceapi'

export default {
  props: {
    resTreeArr: {
      type: Array,
      default: []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultExpandList: [],
      // this.defaultExpandList.push(`rid-group${i}`)
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      loading: false,
      filterText: '',
      dialogVisible: false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    // 获取页面的层级
    handleDrop (draggingNode, dropNode) {
      api.updateMenusIndexNumbers(dropNode.parent.data.list.map((item, i) => ({ menuId: item.menuId, indexNum: i + 1 }))).then((res) => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '排序更新成功！', '提示')
        }
      })
    },
    allowDrop (draggingNode, dropNode, dropType) {
      let allow = false
      if (dropNode.level === 2) {
        allow = draggingNode.data.groupCode === dropNode.data.groupCode
      } else {
        allow = draggingNode.data.parentId === dropNode.data.parentId
      }
      return draggingNode.level === dropNode.level && dropType !== 'inner' && allow
    },
    // 不允许拖拽分组
    allowDrag (draggingNode) {
      return draggingNode.level !== 1
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getNodeDisplay (node) {
      return (node.level === 1 || node.level === 2) ? node.label : (node.data.color && node.data.color.trim() ? (node.label + (node.data.color.startsWith('#') ? '' : `（${node.data.color}）`)) : node.label)
    }
  }
}
</script>
