<template>
  <div>
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="add">添加</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :show-index="true"
      is-single-table
      is-auto-height
      :fixed-height="50"
      @eventChange="eventChange">
      <template slot="menu" slot-scope="scope">
        <template v-if="scope.row.sysMenus && scope.row.sysMenus.length > 0">
          <el-tag
            class="menu"
            :key="index"
            size="small"
            effect="plain"
            type="info"
            v-for="(item, index) in scope.row.sysMenus">
            {{item.name}} <span class="f12">({{item.menuId}})</span>
          </el-tag>
        </template>
      </template>
    </ever-table>

    <el-dialog
      :title="title"
      class="ui_dialog_02 spe"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <div class="cnt">
        <ever-form2 v-model="obj" ref="form" :schema="schema" :rules="rules">
          <template slot="default">
            <span></span>
          </template>
          <template slot="rids">
            <res-tree v-model="obj.rids"></res-tree>
          </template>
        </ever-form2>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import urlMap from '@/systemset/urls'
import resTree from './res.tree'
import { request } from '@/util/req'

const querySchema = [
  {
    name: 'uriName',
    label: '接口名称',
  },
  {
    name: 'uri',
    label: '接口地址',
  },
]

const schema = [
  {
    label: '接口名称',
    name: 'interfaceName',
    props: {
      placeholder: '请输入接口名称'
    }
  },
  {
    label: '接口地址',
    name: 'uri',
    props: {
      placeholder: '输入接口地址，例如：thc-platform-core/sysInterface/createSysInterface'
    }
  },
  {
    label: 'yapi地址',
    name: 'interfaceYapiUrl',
    props: {
      placeholder: '请输入yapi内的url地址'
    }
  },
  {
    label: '选择菜单',
    name: 'rids',
    comp: 'custom'
  },
]

const rules = {
  interfaceName: [
    { required: true, message: '请输入接口名称', trigger: 'blur' }
  ],
  uri: [
    { required: true, message: '输入接口的uri', trigger: 'blur' }
  ],
}
export default {
  components: {
    resTree
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    let obj = this.$ever.createObjFromSchema(schema)
    obj.rids = []
    return {
      querySchema,
      queryObj,
      schema,
      obj,
      dialogVisible: false,
      allColumns: [
        {
          prop: 'interfaceName',
          label: '接口名称',
          width: '200px',
          showOverflowTooltip: true
        },
        {
          prop: 'uri',
          label: '接口地址',
          showOverflowTooltip: true
        },
        {
          label: '接口所属页面/菜单',
          slot: 'menu',
          minWidth: '400px',
        },
        {
          prop: 'createTime',
          label: '修改时间',
          align: 'center',
          width: '180px',
          formatter: ({ value }) => {
            return this.$filters.formatDateByExp(value)
          }
        },
        {
          prop: 'ever-op',
          type: 'btns',
          label: '操作',
          align: 'center',
          width: '150px',
          btns: ({ row }) => {
            let btns = [
              {
                prop: 'edit',
                label: '编辑',
              },
              'del',
            ]
            return btns
          }
        }
      ],
      url: urlMap.sysInterface.getSysInterfaceAndMenus,
      rules,
      title: '新增接口权限',
    }
  },
  methods: {
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    // 需要手动触发list方法 传false表示当页查（保留翻页信息），true表示从第一页查
    list (flag) {
      this.$refs.table.list(flag)
    },
    add () {
      this.title = '新增接口权限'
      this.dialogVisible = true
    },
    submit () {
      this.$refs.form.$refs.form.validate(valid => {
        if (this.obj.rids.length === 0) {
          this.$messageTips(this, 'error', '请选择菜单')
          return false
        }
        if (valid) {
          let url = urlMap.sysInterface.createSysInterface
          if (this.obj.id) {
            url = urlMap.sysInterface.updateSysInterface
          }
          request(url, this.obj).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.dialogVisible = false
              this.list()
            }
          })
        }
      })
    },
    // 删除记录
    del (row) {
      request(urlMap.sysInterface.deleteSysInterface, {
        id: row.id
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.dialogVisible = false
          this.list()
        }
      })
    },
    // 编辑记录
    edit (row) {
      if (row.id) {
        this.title = '编辑接口权限'
      }
      this.obj = JSON.parse(JSON.stringify(row))
      let tmp = []
      row.sysMenus.forEach(item => {
        if (item.menuId) {
          tmp.push(item.menuId)
        }
      })
      this.obj.rids = tmp
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped>
.menu.el-tag{margin:2px 10px 2px 0;}
</style>
