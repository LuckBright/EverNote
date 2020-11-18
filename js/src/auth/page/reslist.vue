<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="schema"
        :inline="true"
        :is-query="true">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="filterData()">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button
              type="primary"
              @click="handleAddBench()"
            >添加工作站</el-button>
            <el-button
              type="primary"
              size="medium"
              @click="$router.push({name:'resSql'})"
            >导出sql</el-button>
            <el-button
              type="primary"
              size="medium"
              @click="treealign = true"
            >调整顺序</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      border
      :columns="columns"
      :data="treeObj"
      is-auto-height
      :el-table-attr="props"
      :maxBtnCount="6"
      :loading="loading1"
      default-expand-all
      :is-single-table="true"
      row-key="rid"
      @eventChange="eventChange">
      <template slot="resBtns" slot-scope="scope">
        <template v-if="scope.row && scope.row.level !== 0">
          <template v-if="scope.row.btnList && scope.row.btnList.length > 0">
            <el-tag
              :key="index"
              size="small"
              v-for="(btn, index) in scope.row.btnList"
              closable
              :disable-transitions="false"
              @click="handelEditBtn(btn, scope.row)"
              @close="handleRemoveRes(btn, index, 'button', scope.row.btnList)">
              {{btn.name}}
            </el-tag>
          </template>
          <el-button class="button-new-tag" size="small" @click="handleAddBtn(scope.row, 'button')">添加</el-button>
        </template>
      </template>
      <template slot="authRow" slot-scope="scope">
        <template v-if="scope.row && scope.row.level !== 0">
          <el-tag
            :key="index"
            size="small"
            v-for="(auth, index) in scope.row.rowDataArr"
            closable
            :disable-transitions="false"
            @click="handleEditAuthRowAndCol(auth, 'row')"
            @close="handleRemoveAuthrowAndCol(auth, 'row')">
            {{auth.name}}
          </el-tag>
          <el-button class="button-new-tag" size="small" @click="handleAddAuthRowAndCol(scope.row, 'row')">添加权限</el-button>
        </template>
      </template>
      <template slot="authCol" slot-scope="scope">
        <template v-if="scope.row && scope.row.level !== 0">
          <el-tag
            :key="index"
            size="small"
            v-for="(auth, index) in scope.row.colDataArr"
            closable
            :disable-transitions="false"
            @click="handleEditAuthRowAndCol(auth, 'col')"
            @close="handleRemoveAuthrowAndCol(auth, 'col')">
            {{auth.name}}
          </el-tag>
          <el-button v-if="scope.row.level !== 0" class="button-new-tag" size="small" @click="handleAddAuthRowAndCol(scope.row, 'col')">添加权限</el-button>
        </template>
      </template>
      <template slot="options" slot-scope="scope">
        <template v-if="scope.row && scope.row.level !== 0">
          <el-button
            v-if="scope.row.menuId"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEditMenu(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAddMenu(scope.row)"
          ></el-button>
          <el-button v-if="scope.row.menuId" size="mini" type="danger" icon="el-icon-delete" @click="() => {handleRemoveRes(scope.row, scope.$index, 'menu')}"></el-button>
        </template>
      </template>
    </ever-table>
    <dialog-res ref="dialogres" :res-data="currentRow" @success="handleSuccess" :res-type="resType"></dialog-res>
    <dialog-auth-row-and-col ref="dialogauthrow" @success="handleSuccess"></dialog-auth-row-and-col>
    <res-align :visible.sync="treealign" :res-tree-arr="treeObj"></res-align>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'
import DialogRes from './dialog.res'
import DialogAuthRowAndCol from './dialog.auth.row.col'
import authUrlMap from '@/auth/store/urls'
import { objGroupBy, debounce1 } from '@/util/common'
import ResAlign from './res.align'

const rebuildData = (value, arr) => {
  if (!value) {
    return arr
  }
  let newarr = []
  arr.forEach(element => {
    if (element.name.indexOf(value) > -1) {
      newarr.push(element)
    } else {
      if (element.list && element.list.length > 0) {
        const ab = rebuildData(value, element.list)
        const obj = {
          ...element,
          list: ab
        }
        if (ab && ab.length > 0) {
          newarr.push(obj)
        }
      }
    }
  })
  return newarr
}

const schema = [
  {
    name: 'name',
    label: '资源名',
    placeholder: '输入资源名'
  },
]

export default {
  components: {
    DialogRes,
    DialogAuthRowAndCol,
    ResAlign
  },
  watch: {
    'queryObj.name': {
      handler: debounce1(function (val) {
        this.filterData()
      }, 500),
    }
  },
  created () {
    this.getTree()
  },
  data () {
    var queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      treeObj: [],
      treeObjOrigin: [],
      loading: true,
      loading1: true,
      currentRow: {},
      resType: '',
      rowDataArr: [],
      colDataArr: [],
      treealign: false,
      props: {
        'tree-props': { children: 'list' }
      },
      columns: [
        {
          prop: 'name',
          label: '名称',
          customCellSpanClassFormatter ({ row }) {
            let _res = ''
            if (row.level === 0) {
              _res = 'f_bold'
            }
            return _res
          },
          width: '200px',
          showOverflowTooltip: true,
          afterHtmlFormatter ({ row }) {
            if (row.icon) {
              return `<i style="color:${row.color}" class="icon iconfont ${row.icon} ml5"></i>`
            } else {
              return ''
            }
          },
        },
        {
          prop: 'rid',
          label: '资源id',
          width: '200px',
          showOverflowTooltip: true
        },
        {
          prop: 'version',
          label: '版本',
          width: '170px',
          showOverflowTooltip: true
        },
        {
          label: '操作按钮',
          slot: 'resBtns',
          minWidth: '300px'
        },
        {
          label: '数据行权限',
          slot: 'authRow',
          minWidth: '200px'
        },
        {
          label: '数据列权限',
          slot: 'authCol',
          minWidth: '200px'
        },
        {
          label: '操作',
          slot: 'options',
          width: '150px'
        },
      ]
    }
  },
  methods: {
    // 前端查询过滤条件
    filterData () {
      this.treeObj = rebuildData(this.queryObj.name, this.treeObjOrigin)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    // 编辑成功之后刷新页面
    handleSuccess () {
      this.queryObj.name = ''
      this.getTree()
    },
    // 编辑菜单
    handleEditMenu (row) {
      this.currentRow = row
      if (row.parentId === '0') {
        this.$refs.dialogres.open('bench', row, 'edit')
      } else {
        this.$refs.dialogres.open('menu', row, 'edit')
      }
    },
    // 添加工作站
    handleAddBench () {
      this.resType = 'bench'
      this.currentRow = {}
      this.$refs.dialogres.open('bench', {}, 'add')
    },
    // 给菜单添加子菜单
    handleAddMenu (row) {
      this.resType = 'menu'
      this.currentRow = row
      this.$refs.dialogres.open('menu', row, 'add')
      this.$refs.table.toggleRowSelection(row, true)
    },
    // 给菜单添加子按钮
    handleAddBtn (row) {
      this.resType = 'button'
      this.currentRow = row
      this.$refs.dialogres.open('button', row, 'add')
    },
    // 编辑按钮权限
    handelEditBtn (btn, row) {
      this.resType = 'button'
      this.currentRow = row
      this.$refs.dialogres.open('button', btn, 'edit')
    },
    // 删除权限(菜单|按钮)
    handleRemoveRes (data, index, type, arr) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request(authUrlMap.sysMenu.del, { menuId: data.menuId }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功！', '提示')
            if (type === 'menu') {
              this._recursion1(this.treeObj, 'list', data.menuId)
            } else {
              arr = arr.splice(index, 1)
            }
          }
        })
      })
    },
    // 查找资源并删除
    _recursion1 (data, name, menuId) {
      if (data && data.length > 0) {
        data.forEach((item, index) => {
          if (item[name]) {
            this._recursion1(item[name], name, menuId)
          }
          if (item.rid === menuId) {
            data.splice(index, 1)
          }
        })
      }
    },
    // 删除行权限
    handleRemoveAuthrowAndCol (auth, type) {
      let url = authUrlMap.dataRowAccess.deleteDataRowAccess
      if (type === 'col') {
        url = authUrlMap.dataColAccess.deleteDataColAccess
      }
      request(url, {
        id: auth.id
      }).then(res => {
        if (res.head.errCode === 0) {
          // 删除一个行数据，动态删除arr
          // let _index = row.rowDataArr.findIndex(item => { return item.id === auth.id })
          // row.rowDataArr.splice(_index, 1)
          this.$messageTips(this, 'success', '删除成功')
          this.getTree()
        }
      })
    },
    // 编辑行权限
    handleEditAuthRowAndCol (auth, type) {
      this.$refs.dialogauthrow.edit(auth, type)
    },
    // 表格 treeObj 找到一行数据
    // 针对后端数据打补丁：为了显示方便，查出行权限和列权限放到资源树里面
    findObj (data, name, rid) {
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item[name]) {
            this.findObj(item[name], name, rid)
          }
          if (item.rid === rid) {
            return item
          }
        })
      }
    },
    // 弹出行权限
    handleAddAuthRowAndCol (row, type) {
      this.currentRow = {}
      this.$refs.dialogauthrow.open(row, type)
    },
    // 针对后端数据打补丁：为了显示方便，查出行权限和列权限放到资源树里面
    _recursion (data, name) {
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item[name]) {
            this._recursion(item[name], name)
          }
          if (item.rid) {
            item.rowDataArr = this.rowDataArr[item.rid] || []
            item.colDataArr = this.colDataArr[item.rid] || []
          }
        })
      }
    },
    // 获取资源树的列表
    async getTree () {
      // 获取行权限列表 把数据组装进资源树
      let result = await request(authUrlMap.dataRowAccess.getDataRowAccesss, {})
      if (result.head.errCode === 0) {
        this.rowDataArr = objGroupBy(result.data, 'rid')
      }
      // 获取行权限列表 把数据组装进资源树
      let rescol = await request(authUrlMap.dataColAccess.getDataColAccesss, {})
      if (rescol.head.errCode === 0) {
        this.colDataArr = objGroupBy(rescol.data, 'rid')
      }
      // 获取资源树
      let res = await request(urlMap.sys.getResources, {}, 'post')
      if (res.head.errCode === 0) {
        this.defaultExpandList = []
        this.treeObj = res.menuList.map((item, i) => {
          this.defaultExpandList.push(`rid-group${i}`)
          return { ...item, rid: `rid-group${i}`, groupCode: item.list[0].groupCode, level: 0 }
        })
        this._recursion(this.treeObj, 'list')
        this.treeObjOrigin = this.treeObj.slice(0)
        this.$refs.table.resize()
        this.loading = false
      }
    },
  }
}
</script>
<style scoped lang="less">
.el-tree-node__content,
.custom-tree-node {
  width: 100%;
}
.group-node {
  font-weight: bold;
}
.custom-tree-node:hover .edit-btn {
  display: inline-block;
}
.edit-btn {
  display: none;
  margin-left: 30px;
}
.el-tag{margin: 0 5px 5px 0}
.resDrawer /deep/ .el-drawer__body{overflow:auto}
</style>
