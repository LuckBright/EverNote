<template>
  <div>
    <div class="layout_inner">
      <ever-form2
        v-model="form"
        ref="form"
        :schema="schema"
        :inline="true"
        clearable
      >
        <template slot="default">
          <el-form-item>
            <el-button @click="search">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="createSys">新建</el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <ever-table
        ref="table"
        :columns="columns"
        :url="url"
        fixed-elements="js-main-head"
        :params.sync="form"
        :isRecordUrlParams="false"
        :maxBtnCount="5"
        @del="del"
        @edit="edit"
      ></ever-table>
      <el-dialog :visible.sync="editDialog" append-to-body title="编辑">
        <ever-form2
          v-model="editForm"
          ref="editForm"
          :schema="editSchema"
          :nosubmit="true"
          :rules="editRules"
        ></ever-form2>
        <div slot="footer">
          <el-button @click="cancel">取消</el-button>
          <el-button @click="save" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urls from '@/phr/api/urls'
const { list, del, insert, update } = urls.dataInterface
const schema = [
  {
    name: 'apiCode',
    label: '接口编码',
    comp: 'input',
    props: {
      clearable: true
    }
  },
  {
    name: 'apiName',
    label: '接口名称',
    comp: 'input',
    props: {
      clearable: true
    }
  },
  {
    name: 'apiOwner',
    label: '接口人',
    comp: 'input',
    props: {
      clearable: true
    }
  }
]
const createSchema = [
  {
    name: 'apiCode',
    label: '接口编码',
  },
  {
    name: 'apiName',
    label: '接口名称',
  },
  {
    name: 'apiOwner',
    label: '接口创建人',
  },
  {
    name: 'bizGroup',
    label: '业务组',
  },
  {
    name: 'selectSql',
    label: '查询SQL',
  },
  {
    name: 'memo',
    comp: 'input',
    label: '备注',
  },
]
const editSchema = [
  {
    name: 'apiName',
    label: '接口名称',
  },
  {
    name: 'apiOwner',
    label: '接口创建人',
  },
  {
    name: 'bizGroup',
    label: '业务组',
  },
  {
    name: 'querySql',
    label: '查询SQL',
  },
  {
    name: 'memo',
    comp: 'input',
    label: '备注',
  },
]
export default {
  name: 'ipManagement',
  data () {
    const form = this.$ever.createObjFromSchema(schema)
    let editForm = this.$ever.createObjFromSchema(editSchema)
    return {
      form,
      schema,
      columns: [
        {
          prop: 'apiCode',
          label: '接口编码',
        },
        {
          prop: 'apiName',
          label: '接口名称',
        },
        {
          prop: 'apiOwner',
          label: '接口人',
        },
        {
          prop: 'bizGroup',
          label: '业务组'
        },
        {
          prop: 'op',
          label: '操作',
          type: 'btns',
          width: 200,
          btns ({ row }) {
            return ['edit', 'del']
          }
        }
      ],
      url: list,
      editForm,
      editSchema,
      editRules: {
        apiCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        apiName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        apiOwner: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        bizGroup: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        selectSql: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
      },
      editDialog: false,
      orderDiag: false,
      orderTemp: {}
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    cancel () {
      this.editDialog = false
    },
    search () {
      this.$refs.table.list()
    },
    async operation (res) {
      this.$message({ type: 'success', message: '' })
    },
    async del ({ row }) {
      const { id } = row
      const res = await request(del, { id })
      if (res) {
        this.$messageTips(this, 'success', '删除成功')
      }
      this.search()
    },
    edit ({ row }) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editSchema = editSchema
      this.schema =
      this.editDialog = true
      this.showUpdateBtn = true
    },
    save () {
      const validate = this.$refs.editForm.$refs.form.validate
      let url
      validate(async valid => {
        if (valid) {
          if (this.showUpdateBtn) {
            url = update
          } else {
            url = insert
          }
          const res = await request(url, this.editForm)
          if (res) {
            this.$messageTips(this, 'success', '成功')
          }
          this.search()
          this.editDialog = false
          this.showUpdateBtn = false
        }
      })
    },
    createSys () {
      this.showUpdateBtn = false
      this.editForm = this.$ever.createObjFromSchema(createSchema)
      this.editSchema = createSchema
      this.editForm.type = 1
      this.editDialog = true
    },
  },
  components: {
  }
}
</script>

<style scoped>
.padding {
  padding: 10px;
}
</style>
