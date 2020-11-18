<template>
  <div :class="{ layout_inner: true }">
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
      <div class="fr"></div>
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
</template>

<script>
import { request } from '@/util/req'

const schema = [
  {
    name: 'channelDatasourceTypeCode',
    label: '通道类型',
    comp: 'input',
    props: {
      clearable: true
    }
  },
  {
    name: 'channelCode',
    label: '分类code',
    comp: 'select',
    props: {
      options: [
        {
          id: 'thc_phr',
          name: 'thc_phr'
        },
        {
          id: 'thc_report',
          name: 'thc_report'
        }
      ],
    }
  },
]
const editSchema = [
  {
    name: 'channelName',
    label: '分类名称',
  },
  {
    name: 'channelCode',
    label: '分类code',
    comp: 'select',
    props: {
      options: [
        {
          id: 'thc_phr',
          name: 'thc_phr'
        },
        {
          id: 'thc_report',
          name: 'thc_report'
        }
      ],
    }
  },
  {
    name: 'channelDatabaseClassName',
    label: '数据库驱动类',
  },
  {
    name: 'channelDatabasePassword',
    label: '数据库密码',
  },
  {
    name: 'channelDatabaseTypeCode',
    label: '数据库类型'
  },
  {
    name: 'channelDatabaseUrl',
    label: '数据库连接信息'
  },
  {
    name: 'channelDatabaseUsername',
    label: '数据库用户名'
  },
  {
    name: 'channelDatasourceTypeCode',
    label: '通道类型'
  }
]
export default {
  name: 'datachannel',
  data () {
    const form = this.$ever.createObjFromSchema(schema)
    let editForm = this.$ever.createObjFromSchema(editSchema)
    return {
      form,
      schema,
      columns: [
        {
          prop: 'channelDatasourceTypeCode',
          label: '通道类型'
        },
        {
          prop: 'channelCode',
          label: '分类code',
        },
        {
          prop: 'channelName',
          label: '分类名称',
        },
        {
          prop: 'channelDatabaseClassName',
          label: '数据库驱动类',
        },
        {
          prop: 'channelDatabasePassword',
          label: '数据库密码',
        },
        {
          prop: 'channelDatabaseTypeCode',
          label: '数据库类型'
        },
        {
          prop: 'channelDatabaseUrl',
          label: '数据库连接信息'
        },
        {
          prop: 'channelDatabaseUsername',
          label: '数据库用户名'
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
      url: 'thc-data/dataSwitchingChannel/list',
      editForm,
      editSchema,
      editRules: {
        channelCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatabaseClassName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatabasePassword: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatabaseTypeCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatabaseUrl: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatabaseUsername: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatasourceTypeCode: [
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
      const { channelId } = row
      const res = await request('thc-data/dataSwitchingChannel/deleteById', { channelId })
      if (res && res.success) {
        this.$message({ type: 'success', message: '删除成功' })
      }
      this.search()
    },
    edit ({ row }) {
      const {
        channelCode,
        channelName,
        channelDatabaseClassName,
        channelDatabasePassword,
        channelDatabaseTypeCode,
        channelDatabaseUrl,
        channelDatabaseUsername,
        channelDatasourceTypeCode,
        channelId } = row
      this.editForm.channelId = channelId
      this.editForm.channelName = channelName
      this.editForm.channelCode = channelCode
      this.editForm.channelDatabaseClassName = channelDatabaseClassName
      this.editForm.channelDatabasePassword = channelDatabasePassword
      this.editForm.channelDatabaseTypeCode = channelDatabaseTypeCode
      this.editForm.channelDatabaseUrl = channelDatabaseUrl
      this.editForm.channelDatabaseUsername = channelDatabaseUsername
      this.editForm.channelDatasourceTypeCode = channelDatasourceTypeCode

      this.editDialog = true
      this.showUpdateBtn = true
    },
    save () {
      const validate = this.$refs.editForm.$refs.form.validate
      let url
      validate(async valid => {
        if (valid) {
          if (this.showUpdateBtn) {
            url = 'thc-data/dataSwitchingChannel/update'
          } else {
            url = 'thc-data/dataSwitchingChannel/save'
          }
          const res = await request(url, this.editForm)
          if (res) {
            this.$message({ type: 'success', message: '成功' })
          }
          this.search()
          this.editDialog = false
          this.showUpdateBtn = false
        }
      })
    },
    createSys () {
      this.editForm = this.$ever.createObjFromSchema(editSchema)
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
.bg {
  background-color: #ffffff;
  padding: 2px 10px 0px 2px;
  overflow: auto;
  height: 100%;
}
</style>
