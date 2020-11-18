<template>
  <div class="common-box">
    <div class="common-content p0 common-border common-no-border-bottom">
      <el-tree
        class="tree follow-syscode-tree"
        ref="tree"
        :data="treeData"
        :props="defProps"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="true"
        :highlight-current="true"
        @node-click="handleNodeClick"
      >
        <span class="tree-node" slot-scope="{node}">
          <span class="syscode-name">{{node.label}}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { convertListToTree } from '../util/fn'

const typeIdMap = {
  template: 1, // 模板分类
}
export default {
  props: {
    typeId: {
      type: [String, Number],
      default: typeIdMap.template,
    }, // 类型
  },
  data () {
    return {
      defProps: { children: 'children', label: 'name' },
      treeData: [], // 树状数据
      defaultExpandedKeys: ['all'], // 默认只展开全部
      originData: [],
    }
  },
  created () {
    request(urlMap.follow.syscode.findByTypeId, { typeId: this.typeId }).then(res => {
      if (res.head.errCode === 0) {
        this.originData = res.data || []
        this.initTree()
      }
    })
  },
  methods: {
    initTree () {
      this.treeData = convertListToTree([{
        name: '全部',
        id: 'all',
        code: '0', // 一级分类的parentCode为0
        parentCode: null,
      }, ...this.originData])
    },
    handleNodeClick (data) {
      this.$emit('nodeClick', data)
    }
  },
}
</script>

<style scoped lang="less">
</style>
