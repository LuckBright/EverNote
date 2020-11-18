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
      <template slot="sysInterfaces" slot-scope="scope">
        <template v-if="scope.row.sysInterfaces && scope.row.sysInterfaces.length > 0">
          <el-tag
            class="menu"
            :key="index"
            size="small"
            effect="plain"
            type="info"
            v-for="(item, index) in scope.row.sysInterfaces">
            {{item.interfaceName}} <span class="f12">({{item.uri}})</span>
          </el-tag>
        </template>
      </template>
    </ever-table>
    <el-drawer
      direction="rtl"
      size="60%"
      custom-class="drawer1"
      v-if="dialogVisible"
      :title="title"
      :key="currentKey"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <div class="inter">
        <div class="head">
          <el-popover
            placement="bottom-start"
            v-model="menuVisible"
            width="400"
            :disabled="editFlag"
            trigger="click">
            <res-tree :show-checkbox="false" :handle-select-flag="true" @selectMenu="getMenu"></res-tree>
            <div slot="reference">
              <div class="rid mb5"><span class="cRed">*</span> 选择菜单：<span class="s">{{menustr}}</span></div>
            </div>
          </el-popover>
        </div>
        <div class="body">
          <ever-form2
            v-model="urlForm.form"
            class="interfaceForm"
            v-for="(urlForm, index) in urlFormList"
            :key="urlForm.index"
            :ref="'urlForm' + urlForm.index"
            :schema="urlForm.schema"
            :rules="urlForm.rules"
            :inline="true">
            <template slot="interfaceName">
              <el-autocomplete
                v-model="urlForm.form.interfaceName"
                value-key="interfaceName"
                placeholder="请输入接口名称"
                :fetch-suggestions="querySearchAsync"
                :disabled="urlForm.schema[0].props.disabled"
                @select="(item) => handleSelect(item, index)">
                <template slot-scope="{ item }">
                  <div class="name">{{ item.interfaceName }} <span class="f12">({{ item.uri }})</span></div>
                </template>
              </el-autocomplete>
            </template>
            <template slot="default">
              <el-form-item>
                <el-button icon="el-icon-plus" v-if="index === urlFormList.length - 1" @click="addBedForm(urlForm.index)"></el-button>
                <el-button icon="el-icon-minus" @click="minusBedForm(urlForm.index)"></el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </div>
        <div class="foot">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit()">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import urlMap from '@/systemset/urls'
import resTree from './res.tree'
import { request } from '@/util/req'

const querySchema = [
  {
    name: 'menuName',
    label: '菜单名称',
  },
  {
    name: 'rid',
    label: '菜单id',
  },
]

const schema = [
  {
    label: '接口名称',
    name: 'interfaceName',
    comp: 'custom',
    props: {
      disabled: false
    }
  },
  {
    label: '接口地址',
    name: 'uri',
    props: {
      placeholder: '输入接口地址，例如：/thc-platform-core/sysInterface/createSysInterface',
      disabled: false
    }
  },
  {
    label: 'yapi地址',
    name: 'interfaceYapiUrl',
    props: {
      placeholder: '输入yapi地址',
      disabled: false
    }
  },
]

const rules = {
  interfaceName: [
    { required: true, message: '请输入接口名称', trigger: ['change', 'blur'] }
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
    obj.id = ''
    return {
      querySchema,
      queryObj,
      schema,
      obj,
      dialogVisible: false,
      allColumns: [
        {
          prop: 'name',
          label: '菜单名称',
          width: '200',
          showOverflowTooltip: true
        },
        {
          prop: 'menuId',
          label: '菜单id',
          width: '350',
          showOverflowTooltip: true
        },
        {
          label: '页面接口',
          slot: 'sysInterfaces',
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
            if (row.setVersion) {
              btns.length = 3
            }
            return btns
          }
        }
      ],
      url: urlMap.sysMenu.getMenuInterfaces,
      rules,
      title: '增加权限',
      curMenuId: '',
      menustr: '选择菜单',
      urlFormList: [
        {
          form: obj,
          schema,
          rules,
          index: 0,
        },
      ],
      editFlag: false,
      currentKey: new Date().getTime(),
      menuVisible: false
    }
  },
  methods: {
    // 接口列表查询（快捷选择接口）
    querySearchAsync (queryString, cb, index) {
      request(urlMap.sysInterface.getSysInterfaceAndMenus, {
        uriName: queryString,
        offset: 0,
        pagesize: 20
      }).then(res => {
        let tmp = []
        if (res.head.errCode === 0 && res.data && res.data.length) {
          tmp = res.data
        }
        cb(tmp)
      })
    },
    // 选择接口地址
    handleSelect (item, index) {
      let tmpform = this.urlFormList[index]
      tmpform.schema[0].props.disabled = true
      tmpform.schema[1].props.disabled = true
      tmpform.schema[2].props.disabled = true
      tmpform.form.uri = item.uri
      tmpform.form.interfaceYapiUrl = item.interfaceYapiUrl
      tmpform.form.interfaceName = item.interfaceName
      tmpform.form.id = item.id
    },
    // 增加一行记录
    addBedForm (index) {
      if (this.urlFormList.length >= 25) {
        this.$message.error('一个页面下最多可以添加25个接口')
        return
      }
      let cpSchema = JSON.parse(JSON.stringify(schema))
      cpSchema[0].props.disabled = false
      cpSchema[1].props.disabled = false
      cpSchema[2].props.disabled = false
      const obj = this.$ever.createObjFromSchema(cpSchema)
      this.urlFormList.push({
        index: index + 1,
        form: obj,
        schema: cpSchema,
        rules,
      })
    },
    // 删除一行记录
    minusBedForm (index) {
      if (this.urlFormList.length === 1) {
        this.$message.error('最后一个接口不能删除')
        return
      }
      this.urlFormList = this.urlFormList.filter(item => item.index !== index)
    },
    // 选中菜单之后给rid赋值
    getMenu (val) {
      this.menustr = val.name + '(' + val.rid + ')'
      this.curMenuId = val.rid
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    // 需要手动触发list方法 传false表示当页查（保留翻页信息），true表示从第一页查
    list (flag) {
      this.$refs.table.list(flag)
    },
    // 增加权限
    add () {
      this.currentKey = new Date().getTime()
      this.editFlag = false
      this.title = '新增权限'
      this.menustr = '选择菜单'
      this.curMenuId = ''
      this.dialogVisible = true
      let cpSchema = JSON.parse(JSON.stringify(schema))
      cpSchema[0].props.disabled = false
      cpSchema[1].props.disabled = false
      cpSchema[2].props.disabled = false
      const obj = this.$ever.createObjFromSchema(cpSchema)
      this.urlFormList = [
        {
          index: 0,
          form: obj,
          schema: cpSchema,
          rules,
        }
      ]
    },
    // 修改权限
    edit (row) {
      this.currentKey = new Date().getTime()
      this.editFlag = true
      this.title = '编辑权限'
      this.menustr = row.rid
      this.dialogVisible = true
      this.curMenuId = row.rid
      let cpSchema = JSON.parse(JSON.stringify(schema))
      cpSchema[0].props.disabled = true
      cpSchema[1].props.disabled = true
      cpSchema[2].props.disabled = true
      this.urlFormList = row.sysInterfaces.map((item, index) => {
        return {
          index: index + 1,
          form: {
            interfaceName: item.interfaceName,
            uri: item.uri,
            interfaceYapiUrl: item.interfaceYapiUrl,
            id: item.id
          },
          schema: cpSchema,
          rules,
        }
      })
    },
    submit () {
      if (!this.curMenuId) {
        this.$message.error('请选择一个菜单')
        this.menuVisible = true
        return false
      }
      Promise.all(this.urlFormList.map((item) => {
        return this.$refs['urlForm' + item.index][0].$refs.form.validate()
      })).then(validList => {
        if (validList.every(valid => !!valid)) {
          const params = {}
          // 判断是否有重复的
          const tempObj = {}
          for (let i = 0; i < this.urlFormList.length; i++) {
            const item = this.urlFormList[i]
            if (tempObj[item.form.uri]) {
              this.$messageTips(this, 'error', '接口有重复，请修改。')
              return
            } else {
              tempObj[item.form.uri] = 1
            }
          }
          params.rid = this.curMenuId
          params.sysInterfaces = this.urlFormList.map(urlForm => {
            return urlForm.form
          })
          let url = urlMap.sysMenu.createMenuInterface
          if (this.editFlag) {
            url = urlMap.sysMenu.updateMenuInterface
          }
          request(url, params).then(res => {
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
      request(urlMap.sysMenu.deleteMenuInterface, {
        rid: row.rid
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.dialogVisible = false
          this.list()
        }
      })
    },
  }
}
</script>
<style scoped lang="less">
.menu.el-tag{margin:2px 10px 2px 0;}
.rid{line-height: 32px;}
.rid .s{border: 1px solid #bbb; padding:1px 10px;border-radius: 4px;display: inline-block;font-size: 12px; height: 24px; line-height: 24px}
.interfaceForm{margin:3px 0 10px;}
.inter{ height: 100%; overflow: hidden; display: flex; flex-direction: column}
.inter .head {padding: 0 20px; border-bottom: 1px solid #bbb}
.inter .body{ flex: 1; overflow-x: hidden; overflow-y: auto; padding: 10px 20px 0;}
.inter .foot{ padding: 10px 20px; border-top: 1px solid #bbb}
</style>
