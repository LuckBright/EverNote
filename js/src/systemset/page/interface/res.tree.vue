<template>
  <div>
    <el-input class="nobg" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="role-tree bor_1 p10 oxhya mt5"
      ref="mytree"
      :show-checkbox="showCheckbox"
      node-key="menuId"
      v-model="value"
      :loading="loading"
      :check-strictly="true"
      :data="treeObj"
      :default-expand-all="false"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :default-checked-keys="value"
      :default-expanded-keys="value"
      @check-change="handleCheckChange"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span :class="{'group-node': !data.menuId}">{{ getNodeDisplay(node) }}</span>
        <template v-if="handleSelectFlag">
          <el-button
            v-if="data.rid"
            size="mini"
            icon="el-icon-finished"
            @click="handleSel(data)"
          ></el-button>
        </template>
      </div>
    </el-tree>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'

export default {
  props: {
    'value': {
      type: Array,
      default: function () {
        return []
      }
    },
    'showCheckbox': {
      type: Boolean,
      default: true
    },
    'handleSelectFlag': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      treeObj: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      loading: false,
      filterText: '',
      selectArr: [],
      checkedkey: [],
      defaultExpandedkey: []
    }
  },
  created () {
    this.getTree()
  },
  watch: {
    // 'value': {
    //   handler (val, oldval) {
    //     console.log(val, 'value')
    //     this.defaultExpandedkey = val
    //     this.checkedkey = val
    //     this.getTree()
    //   },
    //   deep: true,
    //   immediate: true
    // },
    'filterText' (val) {
      this.$refs.mytree.filter(val)
    },
  },
  methods: {
    handleSel (val) {
      this.$emit('selectMenu', val)
    },
    handleCheckChange (data, checked, indeterminate) {
      let tmpArr = []
      this.$refs.mytree.getCheckedNodes(false, false).forEach(item => {
        if (item.menuId) {
          tmpArr.push(item.menuId)
        }
      })
      this.selectArr = tmpArr
      this.$emit('input', this.selectArr)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getNodeDisplay (node) {
      return (node.level === 1 || node.level === 2) ? node.label : (node.data.color && node.data.color.trim() ? (node.label + (node.data.color.startsWith('#') ? '' : `（${node.data.color}）`)) : node.label)
    },
    // 针对后端数据打补丁：为了授权方便，把按钮都放到了btnList里面，在菜单权限编辑页面再放回去
    recursion (data, name) {
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item[name]) {
            this.recursion(item[name], name)
          }
          if (item.btnList) {
            item.list = item.btnList
          }
        })
      }
    },
    // 获取资源列表，根据角色id查询角色内的资源，然后匹配打钩
    async getTree () {
      let res = await request(urlMap.sys.getResources)
      if (res.head.errCode === 0) {
        this.treeObj = res.menuList
        this.loading = false
      }
    },
  }
}
</script>
<style scoped>
.role-tree{height: 250px;}
.group-node{font-weight: bold;}
</style>

