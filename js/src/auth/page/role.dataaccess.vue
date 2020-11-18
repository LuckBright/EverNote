<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="flex_column_1_hidden layout_inner">
      <div class="flex_col_1_auto main-wrap">
        <el-tree
          class="filter-tree"
          ref="tree"
          v-model="filterText"
          v-loading="loading"
          :data="treeObj"
          node-key="rid"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultExpandList"
          :props="defaultProps"
          :filter-node-method="filterNode">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span :class="[{'group-node': !data.menuId}, (node.data.type === 2 ? 'cBlue' : '')]">
              {{ getNodeDisplay(node) }}
            </span>
            <div v-if="data.roleDataArr.length > 0" class="rowWar">
              <el-checkbox
                v-for="(item, index) in data.roleDataArr"
                :key="index"
                border
                size="small"
                :checked="checkedAccessKey.includes(item.id)"
                @change="(val) => {changeAccessRes(val, item)}"
                :true-label="item.id"
                false-label="">{{item.name}}</el-checkbox>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
    <div class="panel-footer" style="padding-left:140px;">
      <el-button type="primary" v-ever-click-once="disabled" :disabled="disabled" @click="giveAccessToRole()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { request } from '@/util/req'
import authUrlMap from '@/auth/store/urls'
import { objGroupBy } from '@/util/common'
import urlMap from '@/systemset/urls'

export default {
  data () {
    return {
      authArr: [],
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      roleId: this.$route.params.id,
      dataType: this.$route.params.type,
      roleDataArr: [],
      roleAccessOrigin: [],
      loading: true,
      filterText: '',
      defaultExpandList: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      treeObj: [],
      checkedAccessKey: [],
      disabled: false
    }
  },
  created () {
    this.initTree()
  },
  watch: {
  },
  methods: {
    // 授权借口
    giveAccessToRole () {
      let postArr = []
      this.checkedAccessKey.forEach(item => {
        let tmp = this.roleAccessOrigin.find(ite => {
          return ite.id === item
        })
        postArr.push({
          dataId: item,
          menuId: tmp.rid
        })
      })
      request(authUrlMap.dataRowAccess.giveDataAccess, {
        roleId: this.roleId,
        dataType: this.dataType,
        data: postArr
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.$router.push({
            name: 'roles'
          })
        }
      })
    },
    changeAccessRes (data, node) {
      if (data && !this.checkedAccessKey.includes(data)) {
        this.checkedAccessKey.push(data)
      } else {
        let _index = this.checkedAccessKey.findIndex(item => {
          return item === node.id
        })
        this.checkedAccessKey.splice(_index, 1)
      }
    },
    filterNode () {},
    // 针对后端数据打补丁：为了显示方便，查出行权限和列权限放到资源树里面
    _recursion (data, name) {
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item[name]) {
            this._recursion(item[name], name)
          }
          if (item.rid) {
            item.roleDataArr = this.roleDataArr[item.rid] || []
          }
        })
      }
    },
    async initTree () {
      let url = (this.dataType === '2' ? authUrlMap.dataColAccess.getColDataAccessByRoleId : authUrlMap.dataRowAccess.getRowDataAccessByRoleId)
      let res1 = await request(url, {
        roleId: this.roleId,
        dataType: this.dataType,
        // menuId: 'Auth_menu_kanban'
      })
      if (res1.head.errCode === 0) {
        let tmp = []
        res1.data.forEach(item => {
          tmp.push(item.id)
        })
        this.checkedAccessKey = tmp
      }
      // 获取行/列权限列表 把数据组装进资源树
      if (this.roleDataArr.length === 0) {
        let url1 = (this.dataType === '2' ? authUrlMap.dataColAccess.getDataColAccesss : authUrlMap.dataRowAccess.getDataRowAccesss)
        let result = await request(url1, {})
        if (result.head.errCode === 0) {
          this.roleAccessOrigin = result.data
          this.roleDataArr = objGroupBy(result.data, 'rid')
        }
      }
      // 获取资源树
      let res = await request(urlMap.sys.getResources, {}, 'post')
      if (res.head.errCode === 0) {
        this.defaultExpandList = []
        this.treeObj = res.menuList.map((item, i) => {
          this.defaultExpandList = Object.keys(this.roleDataArr)
          return { ...item, rid: `rid-group${i}`, groupCode: item.list[0].groupCode, level: 0 }
        })
        this._recursion(this.treeObj, 'list')
        this.loading = false
      }
    },
    getNodeDisplay (node) {
      return (node.level === 1 || node.level === 2) ? node.label : (node.data.color && node.data.color.trim() ? (node.label + (node.data.color.startsWith('#') ? '' : `（${node.data.color}）`)) : node.label)
    }
  },
}
</script>

<style scoped>
.el-tree /deep/ .el-tree-node__content {
  height: auto;
  line-height: 24px;
  align-items: flex-start
}
.rowWar{border: 1px solid #ddd;padding: 10px; white-space: normal; width: 700px}
.rowWar label{margin-bottom: 5px; margin-right: 10px}
.rowWar label:first-child{margin-left:10px}
</style>
