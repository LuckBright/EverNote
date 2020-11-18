<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{horizontal, collapsable}">
      <org-tree-node
        :ruleTree="ruleTree"
        @sureClose="sureClose"
        :data="treeData[0]"
        :props="props"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :render-content="renderContent"
        :variableCurrentOptions="variableCurrentOptions"
        :constantCurrentOptions="constantCurrentOptions"
        @on-expand="(e, data) => $emit('on-expand', e, data)"
        @on-node-focus="(e, data) => $emit('on-node-focus', e, data)"
        @on-node-click="(e, data) => $emit('on-node-click', e, data)"
        @on-node-mouseover="(e, data) => $emit('on-node-mouseover', e, data)"
        @on-node-mouseout="(e, data) => $emit('on-node-mouseout', e, data)"
        @addChild="addChild"
      />
    </div>
    <el-button type="primary" @click="showres">保存</el-button>
  </div>
</template>

<script>
import orgTreeNode from './org-tree-node'

export default {
  name: 'Vue2OrgTree',
  components: {
    // OrgTreeNode: {
    //   render,
    //   functional: true
    // }
    orgTreeNode
  },
  props: {
    ruleTree: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Object, Array],
      required: true
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        expand: 'expand',
        children: 'children'
      })
    },
    horizontal: Boolean,
    selectedKey: String,
    collapsable: Boolean,
    renderContent: Function,
    selectedClassName: [Function, String],
    variableCurrentOptions: {
      type: Array,
      default: () => []
    },
    constantCurrentOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      treeData: []
    }
  },
  created () {
    if (this.data) {
      try {
        this.treeData = JSON.parse(JSON.stringify(this.data))
      } catch (e) {}
    }
  },
  watch: {
    data (val) {
      if (val) {
        try {
          this.treeData = JSON.parse(JSON.stringify(val))
        } catch (e) {}
      }
    }
  },
  computed: {
    // treeData () {
    //   return JSON.parse(JSON.stringify(this.data))
    // }
  },
  methods: {
    sureClose () {
      this.$emit('sureClose', this.treeData)
    },
    showres () {
      this.$emit('sureClose', this.treeData)
      console.log(this.treeData)
    },
    addChild () {
      console.log(this.treeData)
    },
    addChildren () {
      if (this.data.children) {
        this.data.children.push({
          label: '新节点',
          id: new Date().getTime()
        })
      } else {
        this.data.children = [{
          label: '新节点',
          id: new Date().getTime()
        }]
      }
      console.log(this.data)
      this.$emit('addChild', this.data.id)
    },
    delParentChild (delId) {
      let delindex = this.data.children.findIndex((item) => {
        return delId === item.id
      })
      if (delindex !== -1) {
        this.data.children.splice(delindex, 1)
      }
      this.$emit('delChild', this.data.id)
    }
  }
}
</script>

<style lang="less">
  @import '../../styles/org-tree';
</style>
