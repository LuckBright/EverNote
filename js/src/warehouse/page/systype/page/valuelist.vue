<template>
  <div>
    <ever-bread-crumb class="js-bread-crumb" name="查看详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
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
              <el-button type="primary" v-if="this.$route.params.setVersion" @click="importValues()">导入</el-button>
              <ever-export-sql :exp-url="expUrl" :select-arr="selectValueExportArr" :exp-params="expParams" file-prefix="值集(值)"></ever-export-sql>
              <el-button type="primary" @click="add()">添加</el-button>
            </el-form-item>
          </template>
        </ever-form2>
        <div class="setCnt">
          集合名称：
          <span class="cRed">{{setName}}</span>
          <span class="spl">
            集合code：
            <span class="cRed">{{setCode}}</span>
          </span>
          <span class="spl" v-if="this.$route.params.setVersion">
            版本：
            <sys-value class="cRed" type="THC_SET_VERSION" :code="this.$route.params.setVersion"></sys-value>
          </span>
        </div>
      </div>
      <ever-table
        ref="table"
        class="fixLeftPos"
        row-key="id"
        :show-index="true"
        :columns="allColumns"
        :url="url"
        :fixed-height="60"
        :params.sync="queryObj"
        :el-table-attr="tableProps"
        :handleResult="handleResult"
        :show-checkbox="true"
        :is-record-url-params="false"
        @selection-change="handleSelectExport"
        fixed-elements="main-head"
        @eventChange="eventChange">
      </ever-table>
      <el-dialog
        title="值信息"
        class="ui_dialog_02 spe"
        :key="currentTime"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false">
        <div class="cnt">
          <ever-form2 v-model="obj" ref="formEdit" :schema="schema" :rules="rules">
            <template slot="refCodeSelect">
              <el-select v-model="obj.refCodeSelect" :disabled="disabled" value-key="code" style="width: 100%" filterable @change="change" placeholder="请选择基础版内的值">
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </template>
            <template slot="default">
              <span></span>
            </template>
          </ever-form2>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleValue()">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="导入值列表"
        class="ui_dialog_02 spe"
        :key="currentTime1"
        :visible.sync="importDiaVis"
        :close-on-click-modal="false">
        <div class="cnt">
          <ever-table
            ref="table1"
            :columns="allColumns1"
            :data="options"
            :show-checkbox="true"
            :is-record-url-params="false"
            @selection-change="handleSelectValues"
          ></ever-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="importDiaVis = false">取消</el-button>
          <el-button type="primary" @click="handleImport()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import urlMap, { prefix } from '@/util/urls'
import { request } from '@/util/req'
import { tableColWidth } from '@/util/table-config'
import { regs } from '@/manages/page/organization/utils/model'
// import { convertListToTree } from '@/manages/page/organization/utils/fns'

let querySchema = [
  {
    name: 'name',
    label: '显示名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'code',
    label: '编码',
    props: {
      clearable: true,
    }
  },
]

let schema = [
  {
    name: 'refCodeSelect',
    label: '标准版对应值',
    comp: 'custom',
    props: {
      placeholder: '请选择标准版中对应的值'
    }
  },
  {
    name: 'name',
    label: '显示名',
  },
  {
    name: 'nameEn',
    label: '显示英文名',
  },
  {
    name: 'code',
    label: 'code',
  },
  {
    name: 'refCode',
    label: '引用code',
    props: {
      disabled: false
    }
  },
  {
    name: 'orderNumber',
    label: '排序号',
  },
  {
    name: 'parentId',
    label: '父id',
  },
  {
    name: 'isDelete',
    label: '状态',
    comp: 'el-switch',
    props: {
      activeValue: 0,
      inactiveValue: 1,
      activeText: '启用',
      inactiveText: '禁用'
    },
  },
  {
    name: 'attr1',
    label: '扩展属性1',
    props: {
      placeholder: '请输入扩展属性，后端字段名为attr1'
    }
  },
  {
    name: 'attr2',
    label: '扩展属性2',
    props: {
      placeholder: '请输入扩展属性，后端字段名为attr2'
    }
  },
  {
    name: 'attr3',
    label: '扩展属性3',
    props: {
      placeholder: '请输入扩展属性，后端字段名为attr3'
    }
  },
  {
    name: 'attr4',
    label: '扩展属性4',
    props: {
      placeholder: '请输入扩展属性，后端字段名为attr4'
    }
  },
  {
    name: 'attr5',
    label: '扩展属性5',
    props: {
      placeholder: '请输入扩展属性，后端字段名为attr5'
    }
  },
]

export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.setCode = this.$route.params.setCode
    queryObj.codes = []
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      tableProps: {
        treeProps: { children: 'valueSetItems' },
        indent: 20
      },
      allColumns: [
        {
          prop: 'name',
          label: '显示名称',
          minWidth: 300
        },
        {
          prop: 'nameEn',
          label: '英文名称',
        },
        {
          prop: 'code',
          label: '编码',
          width: 80
        },
        {
          prop: 'refCode',
          label: '引用code',
          props: {
            disabled: true
          }
        },
        {
          prop: 'parentId',
          label: '父id',
          showOverflowTooltip: true,
          width: '300',
        },
        {
          prop: 'orderNumber',
          label: '排序',
          width: '80',
        },
        {
          prop: 'isDelete',
          label: '状态',
          width: '100',
          formatter ({ value }) {
            return value === 1 ? '禁用' : '启用'
          }
        },
        {
          prop: 'creatorName',
          label: '创建人',
          width: tableColWidth.datetimeAllW160,
        },
        {
          prop: 'modifyUserName',
          label: '修改人',
          width: '150'
        },
        {
          prop: 'modifyTime',
          label: '修改时间',
          align: 'center',
          width: tableColWidth.datetimeAllW160,
          formatter: ({ value }) => {
            return this.$filters.formatDateByExp(value)
          }
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '200',
          fixed: 'right',
          btns: [
            'edit',
            'del',
            {
              prop: 'add',
              label: '添加子内容'
            }
          ],
        },
      ],
      allColumns1: [
        {
          prop: 'name',
          label: '显示名称',
          minWidth: '100'
        },
        {
          prop: 'code',
          label: '编码',
          showOverflowTooltip: true,
          width: '200',
        },
      ],
      selectValueArr: [],
      querySchema,
      queryObj,
      schema,
      obj,
      params: {},
      options: [],
      url: this.$route.params.setVersion ? urlMap.valueSet.getValueSetItemAttrsForWeb : urlMap.valueSet.getValueSetItemByCodeForWeb,
      url1: urlMap.valueSet.getValueSetItemsForWeb,
      currentTime: new Date().getTime(),
      dialogVisible: false,
      currentTime1: new Date().getTime() + 'a',
      importDiaVis: false,
      rules: {
        name: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入对应code', trigger: 'blur' }
        ],
        orderNumber: [
          { pattern: regs.number, message: '请输入数字', trigger: ['change', 'blur'] }
        ]
      },
      setCode: this.$route.params.setCode || '--',
      setName: this.$route.params.setName || '--',
      disabled: false,
      selectValueExportArr: [],
      expUrl: prefix.core + urlMap.valueSet.exportValueSetItem.url,
      expParams: {
        setCode: this.$route.params.setCode || '--',
      }
    }
  },
  created () {
    // 看url里面带不带setversion参数，如果带表示是操作扩展版本，各种换url，控件修改，如果无version表示基础版，默认增删改查
    if (this.$route.params.setVersion) {
      this.getValueList()
      this.$ever.getFieldFromSchema(schema, 'refCode').props.disabled = true
    } else {
      this.schema = this.schema.filter(item => {
        return item.name !== 'refCodeSelect'
      })
      this.$ever.getFieldFromSchema(schema, 'refCode').props.disabled = false
    }
  },
  watch: {
    'queryObj.code' (val) {
      if (val) {
        let tmp = []
        tmp.push(this.queryObj.code)
        this.queryObj.codes = tmp
      } else {
        this.queryObj.codes = []
      }
    }
  },
  methods: {
    // 导出值集选择列表
    handleSelectExport (data) {
      let tmpArr = []
      data.forEach(item => {
        tmpArr.push(item.id)
      })
      this.selectValueExportArr = tmpArr
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    handleResult (res) {
      return res.data
      // convertListToTree(res.data)
    },
    async handleImport () {
      let url = urlMap.valueSet.copyItemToAttr
      let rs = await request(url, {
        setVersion: this.$route.params.setVersion,
        ids: this.selectValueArr,
      })
      if (rs.head.errCode === 0) {
        this.$messageTips(this, 'success', '导入成功')
        this.list()
        this.importDiaVis = false
      }
    },
    // 导入值集选择列表
    handleSelectValues (data) {
      let tmpArr = []
      data.forEach(item => {
        tmpArr.push(item.id)
      })
      this.selectValueArr = tmpArr
    },
    importValues () {
      this.importDiaVis = true
      this.currentTime1 = new Date().getTime() + 'a'
    },
    // 获取基础版里面的值列表
    async getValueList () {
      let url = urlMap.valueSet.getValueSetItemsForWeb
      let rs = await request(url, { setCode: this.$route.params.setCode })
      this.options = rs.data
    },
    // 需要手动触发list方法 传false表示当页查（保留翻页信息），true表示从第一页查
    list (flag) {
      this.$refs.table.list(flag)
    },
    add (row) {
      this.currentTime = new Date().getTime()
      this.obj.setCode = this.setCode
      this.obj.name = ''
      this.obj.nameEn = ''
      this.obj.code = ''
      this.obj.orderNumber = ''
      this.obj.parentId = (row && row.id) ? row.id : ''
      this.obj.refCode = ''
      this.obj.isDelete = 0
      this.obj.attr1 = ''
      this.obj.attr2 = ''
      this.obj.attr3 = ''
      this.obj.attr4 = ''
      this.obj.attr5 = ''
      this.obj.setVersion = this.$route.params.setVersion
      delete this.obj.id
      this.dialogVisible = true
    },
    edit (row) {
      this.obj.name = row.name
      this.obj.nameEn = row.nameEn
      this.obj.code = row.code
      this.obj.orderNumber = row.orderNumber
      this.obj.parentId = row.parentId
      this.obj.refCode = row.refCode
      this.obj.isDelete = row.isDelete
      this.obj.attr1 = row.attr1
      this.obj.attr2 = row.attr2
      this.obj.attr3 = row.attr3
      this.obj.attr4 = row.attr4
      this.obj.attr5 = row.attr5
      this.obj.id = row.id
      this.obj.setVersion = row.setVersion
      delete this.obj.setCode
      this.currentTime = new Date().getTime()
      this.dialogVisible = true
      if (row.refCode) {
        this.obj.refCodeSelect = { code: row.refCode }
      }
    },
    // 新增，修改之后 提交数据
    handleValue () {
      this.$refs.formEdit.$refs.form.validate(valid => {
        if (valid) {
          // 如果有setVersion 表示修改的扩展版值集
          let url = urlMap.valueSet.createValueSetItem
          if (this.$route.params.setVersion) {
            url = urlMap.valueSet.createValueSetItemAttr
          }
          if (this.obj.id) {
            if (this.$route.params.setVersion) {
              url = urlMap.valueSet.updateValueSetItemAttr
            } else {
              url = urlMap.valueSet.updateValueSetItem
            }
          }
          delete this.obj.refCodeSelect
          request(url, this.obj).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.dialogVisible = false
              // 操作完数据之后查询的时候 需要注意：新增的时候需要从第一页查，修改的时候不需要重第一页查
              if (this.obj.id) {
                this.queryObj.name = ''
                this.queryObj.code = ''
                this.list(false)
              } else {
                this.list(true)
              }
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除集
    async del (row) {
      let url = urlMap.valueSet.deleteValueById
      if (this.$route.params.setVersion) {
        url = urlMap.valueSet.deleteValueById1
      }
      let rs = await request(url, { id: row.id })
      if (rs.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功')
        this.list(false)
      }
    },
    change (item) {
      this.obj.code = item.code
      this.obj.refCode = item.code
      this.obj.name = item.name
    }
  },
}
</script>
<style scoped>
.setCnt {
  height: 25px;
  line-height: 25px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 15px;
  background: #fff;
}
.setCnt .spl {
  padding-left: 30px;
}
</style>
