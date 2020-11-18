<template>
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
            <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" file-prefix="值集(集)"></ever-export-sql>
            <el-button type="primary" @click="add()">添加集合</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      is-auto-height
      class="fixLeftPos"
      row-key="id"
      show-checkbox
      :not-select-checkbox="true"
      :show-index="true"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :maxBtnCount="6"
      :el-table-attr="tableProps"
      @selection-change="handleSelect"
      @eventChange="eventChange">
      <template slot="setName" slot-scope="scope">
        <template v-if="scope.row.setVersion">
          <span>{{scope.row.setName}}</span> - <span class="cGray"><sys-value type="THC_SET_VERSION" :code="scope.row.setVersion"></sys-value></span>
        </template>
        <template v-else>
          <span>{{scope.row.setName}}</span>
        </template>
      </template>
    </ever-table>

    <el-dialog
      title="集合信息"
      class="ui_dialog_02 spe"
      :key="currentTime"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <div class="cnt">
        <ever-form2 v-model="obj" ref="formEdit" :schema="schema" :rules="rules">
          <template slot="default">
            <span></span>
          </template>
        </ever-form2>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSet()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import urlMap, { prefix } from '@/util/urls'
import { request } from '@/util/req'
import { tableColWidth } from '@/util/table-config'

let querySchema = [
  {
    name: 'setName',
    label: '集名称',
    props: {
      clearable: true,
      placeholder: '请输入集名称'
    }
  },
  {
    name: 'setCode',
    label: '集编码',
    width: '500',
    props: {
      clearable: true,
      placeholder: '请输入集code'
    }
  },
  {
    name: 'name',
    label: '值名称',
    width: '400',
    props: {
      clearable: true,
      placeholder: '请输入值名称'
    }
  },
  {
    name: 'code',
    label: '值code',
    width: '400',
    props: {
      clearable: true,
      placeholder: '请输入值code'
    }
  }
]

let setVersionSchema = [
  {
    name: 'setVersion',
    label: '选择版本',
    comp: 'sys-type',
    props: {
      code: 'THC_SET_VERSION',
      placeholder: '请选择版本',
    }
  },
]

let schema = [
  {
    name: 'setName',
    label: '集合显示名',
  },
  {
    name: 'setNameEn',
    label: '显示英文名',
  },
  {
    name: 'setCode',
    label: '集合code',
    props: {
      disabled: false
    }
  },
  {
    name: 'refSetCode',
    label: '引用集code',
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
]

export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      tableProps: {
        treeProps: { children: 'valueSetAttrs', hasChildren: 'hasChildren' },
        indent: 0
      },
      url: urlMap.valueSet.getValueSets,
      dialogVisible: false,
      allColumns: [
        {
          prop: 'setName',
          label: '显示名称',
          slot: 'setName',
          showOverflowTooltip: true,
        },
        {
          prop: 'setCode',
          label: '编码',
          showOverflowTooltip: true,
          width: tableColWidth.w200,
        },
        {
          prop: 'refSetCode',
          label: '引用集code',
          showOverflowTooltip: true,
          width: tableColWidth.w200,
        },
        {
          prop: 'modifyUserName',
          label: '修改人',
          showOverflowTooltip: true,
          width: '150'
        },
        {
          prop: 'modifyTime',
          label: '修改时间',
          align: 'center',
          showOverflowTooltip: true,
          width: '200',
          formatter: ({ value }) => {
            return this.$filters.formatDateByExp(value)
          }
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '300',
          fixed: 'right',
          btns: ({ row }) => {
            let btns = [
              {
                prop: 'editSet',
                label: '编辑',
              },
              'del',
              {
                prop: 'handleValueDetail',
                label: '查看详情',
              },
              {
                prop: 'copySet',
                label: '添加版本',
              },
            ]
            if (row.setVersion) {
              btns.length = 3
            }
            return btns
          }
        },
      ],
      querySchema: querySchema.slice(),
      queryObj,
      params: {},
      schema,
      obj,
      rules: {
        setVersion: [
          { required: true, message: '请选择集合版本', trigger: ['blur', 'change'] }
        ],
        setName: [
          { required: true, message: '请输入集合名称', trigger: 'blur' }
        ],
        setCode: [
          { required: true, message: '请输入集合code', trigger: 'blur' }
        ],
      },
      currentTime: new Date().getTime(),
      selectArr: [],
      expUrl: prefix.core + urlMap.valueSet.exportValueSet.url
    }
  },
  methods: {
    // 多选内容
    handleSelect (data) {
      let tmpArr = []
      data.forEach(item => {
        tmpArr.push(item.id)
      })
      this.selectArr = tmpArr
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    // 需要手动触发list方法 传false表示当页查（保留翻页信息），true表示从第一页查
    list (flag) {
      this.$refs.table.list(flag)
    },
    handleSetAdd (row) {
      this.dialogVisible = true
    },
    add () {
      this.schema = this.schema.filter(item => {
        return item.name !== 'setVersion'
      })
      this.rules.setVersion[0].required = false
      this.$ever.getFieldFromSchema(schema, 'setCode').props.disabled = false
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.setName = ''
      this.obj.setNameEn = ''
      this.obj.setCode = ''
      this.obj.attr1 = ''
      this.obj.attr2 = ''
      this.obj.attr3 = ''
      delete this.obj.id
      this.currentTime = new Date().getTime()
      this.dialogVisible = true
    },
    editSet (row) {
      if (!row.setVersion) {
        this.schema = this.schema.filter(item => {
          return item.name !== 'setVersion'
        })
        this.rules.setVersion[0].required = false
      } else {
        this.schema = [...setVersionSchema, ...schema]
        this.rules.setVersion[0].required = true
      }
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.setName = row.setName
      this.obj.setNameEn = row.setNameEn
      this.obj.setCode = row.setCode
      this.obj.refSetCode = row.refSetCode
      this.obj.id = row.id
      this.obj.setVersion = row.setVersion
      this.obj.attr1 = row.attr1
      this.obj.attr2 = row.attr2
      this.obj.attr3 = row.attr3
      this.currentTime = new Date().getTime()
      this.$ever.getFieldFromSchema(schema, 'setCode').props.disabled = true
      this.dialogVisible = true
    },
    copySet (row) {
      this.schema = [...setVersionSchema, ...schema]
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.setName = row.setName
      this.obj.setNameEn = row.setNameEn
      this.obj.setCode = row.setCode
      this.obj.refSetCode = row.refSetCode
      delete this.obj.id
      this.rules.setVersion[0].required = true
      this.obj.attr1 = row.attr1
      this.obj.attr2 = row.attr2
      this.obj.attr3 = row.attr3
      this.currentTime = new Date().getTime()
      this.$ever.getFieldFromSchema(schema, 'setCode').props.disabled = true
      this.dialogVisible = true
    },
    // 修改，新增之后post数据方法
    handleEditSet () {
      this.$refs.formEdit.$refs.form.validate(valid => {
        if (valid) {
          let url = urlMap.valueSet.createValueSet
          if (this.obj.setVersion) {
            url = urlMap.valueSet.createValueSetAttr
          }
          let msg = '新增成功'
          if (this.obj.id) {
            url = urlMap.valueSet.updateValueSet
            if (this.obj.setVersion) {
              url = urlMap.valueSet.updateValueSetAttr
            }
            msg = '更新成功'
          }
          request(url, this.obj).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', msg)
              this.dialogVisible = false
              this.list(!this.obj.id) // 操作完数据之后查询的时候 需要注意：新增的时候需要从第一页查，修改的时候不需要重第一页查
            }
          })
        } else {
          return false
        }
      })
    },
    // 查看值对应的集列表
    handleValueDetail (row) {
      this.$router.push({
        name: 'valuelist',
        params: { setCode: row.setCode, setName: row.setName, setVersion: row.setVersion }
      })
    },
    // 删除值
    async del (row) {
      let url = urlMap.valueSet.deleteById
      if (row.setVersion) {
        url = urlMap.valueSet.deleteById1
      }
      let rs = await request(url, { id: row.id })
      if (rs.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功')
        this.list(false)
      }
    },
  },
}
</script>
