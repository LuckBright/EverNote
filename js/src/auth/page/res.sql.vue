<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="flex_column_1_hidden layout_inner">
      <div class="main-head">
        <div class="main-head">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        </div>
      </div>
      <div class="flex_col_1_auto main-wrap">
        <p class="tit cRed">
          为了精确选择导出内容，树状结构取消了父子联动的勾选，请准确勾选要导出的内容。第一层级“门诊业务”“医技业务”属于写死数据，不属于导出范围。
        </p>
        <div class="tree-container">
          <div class="all">
            <el-checkbox v-model="selectAllFlag">全选</el-checkbox>
          </div>
          <div class="role-tree">
            <el-tree
              ref="mytree"
              show-checkbox
              node-key="menuId"
              v-model="filterText"
              v-loading.fullscreen="loading"
              :check-strictly="true"
              :data="treeObj"
              :default-expand-all="false"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @check="nodeClick">
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <span :class="{'group-node': !data.menuId}">{{ getNodeDisplay(node) }}</span>
              </div>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="panel-footer" style="padding-left:140px;">
        <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" file-prefix="菜单"></ever-export-sql>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/auth/store/roleapi'
import resourceApi from '@/auth/store/resourceapi'
import urlMap, { prefix } from '@/systemset/urls'
// import { convertListToTree, changeToTreeList } from '@/manages/page/organization/utils/fns'

export default {
  data () {
    return {
      api,
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      checkedKey: [],
      treeObj: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      parentIdMap: {},
      loading: true,
      disabled: false,
      filterText: '',
      selectAllFlag: false,
      ids: [],
      changeProps: { label: 'name', id: 'rid', parentId: 'parentId' },
      list: [],
      expUrl: prefix.core + urlMap.sys.exportMenu.url,
      selectArr: [],
    }
  },
  watch: {
    filterText (val) {
      this.$refs.mytree.filter(val)
    },
    // tree选择的时候 勾选“全选”触发的方法
    'selectAllFlag' (val) {
      this.handleSelectAll(val)
    }
  },
  methods: {
    nodeClick () {
      this.selectArr = this.$refs.mytree.getHalfCheckedKeys().concat(this.$refs.mytree.getCheckedKeys()).filter(item => {
        if (item) {
          return item
        }
      })
    },
    _recursion (data, name, arr) {
      data.forEach(item => {
        if (item[name]) {
          this._recursion(item[name], name, arr)
        }
        arr.push(item)
      })
    },
    // tree下全选勾选方法方法
    handleSelectAll (flag) {
      if (flag) {
        let selArr = []
        let arr = []
        this._recursion(this.treeObj, 'list', arr)
        arr.forEach(item => {
          selArr.push(item.rid)
        })
        this.$refs.mytree.setCheckedKeys(selArr)
      } else {
        this.$refs.mytree.setCheckedKeys([])
      }
      this.nodeClick()
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
    getTree () {
      resourceApi.listTree().then(result => {
        this.recursion(result.menuList, 'list')
        this.treeObj = result.menuList
        this.loading = false
      })
    }
  },
  created () {
    this.getTree()
  },
}
</script>

<style scoped>
.tree-container {
  padding:20px 0 20px 50px;
  display: flex;
  flex-flow: column;
  font-size: 14px;
}
.all{padding-left: 24px; border-bottom: 1px solid #ddd;padding-bottom:4px}
.tree-label {
  display: inline-block;
  margin-left: -30px;
}
.filter {
  margin-left: 10px;
}
.tit{padding: 10px;font-size:16px;margin:10px 0;border:1px solid #ddd; border-radius:3px}
</style>
