<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="true"
        :ext-btn-string="'新建'"
        :ext-class-name="'fr'"
        @extAction="toNew"
      >
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
            <el-button size="small" @click="resetForm()">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="columns"
      :max-btn-count="5"
      :url="url"
      fixed-elements="js-main-head js-title"
      :params.sync="queryObj"
      @eventChange="eventChange"
    >
    </ever-table>
    <el-dialog title="编辑流程" :visible.sync="dialog">
      <ever-form2
        v-model="dialogForm"
        ref="dialogForm"
        :schema="dialogSchema"
      >
        <template>
          <div></div>
        </template>
        <template slot="type">
          <sys-type code="THC_SYS_BUSINESS" v-model="dialogForm.type" use-object obj-simple
                    @change="changeType"></sys-type>
        </template>
      </ever-form2>
      <template slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'
import { listDestValue } from '@/util/common'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

const stateList = [
  {
    id: 0,
    name: '未发布',
  },
  {
    id: 1,
    name: '已发布',
  },
  {
    id: 2,
    name: '已撤销',
  },
]
const querySchema = [
  {
    name: 'processName',
    label: '流程名称',
  },
  {
    name: 'modelKey',
    label: '流程CODE',
  },
  {
    name: 'state',
    label: '流程状态',
    comp: 'select',
    props: {
      options: stateList,
    },
  },
  {
    name: 'typeCode',
    label: '流程类别',
    comp: 'sys-type',
    props: {
      code: 'THC_SYS_BUSINESS',
    },
  },
]
const dialogSchema = [
  {
    name: 'type',
    label: '流程类别',
    comp: 'custom',
  },
  {
    name: 'description',
    label: '描述',
  },
]
export default {
  data: function () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    const dialogForm = this.$ever.createObjFromSchema(dialogSchema)
    dialogForm.id = ''
    dialogForm.typeCode = ''
    dialogForm.typeName = ''
    return {
      columns: [
        {
          prop: 'id',
          label: '流程ID',
          width: 340,
        },
        {
          prop: 'processKey',
          label: '流程KEY',
          width: 280,
        },
        {
          prop: 'processName',
          label: '流程名称',
          width: 280,
        },
        {
          prop: 'secondName',
          label: '流程别名',
          width: 280,
        },
        {
          prop: 'modelKey',
          label: '流程CODE',
          width: 160,
        },
        {
          prop: 'typeName',
          label: '流程类别',
          width: 160,
        },
        {
          prop: 'description',
          label: '描述',
          width: 160,
        },
        {
          prop: 'state',
          label: '流程状态',
          width: 160,
          formatter ({ value }) {
            return listDestValue(stateList, value)
          },
        },
        {
          prop: 'version',
          label: '流程版本',
          width: 140,
        },
        {
          type: 'btns',
          label: '操作',
          fixed: 'right',
          width: 500,
          btns ({ row }) {
            return [
              'edit',
              ...(row.state === 0 || row.state === 2 ? [{
                prop: 'publish',
                label: '发布',
              }] : []),
              ...(row.state === 1 ? [{
                prop: 'revoke',
                label: '撤销发布',
              }] : []),
              ...(row.state === 0 || row.state === 2 ? [{
                prop: 'delete',
                label: '删除',
                type: 'danger',
              }] : []),
              {
                prop: 'editFlow',
                label: '编辑流程图',
              },
            ]
          },
        },
      ],
      querySchema,
      queryObj,
      url: urlMap.process.getProcesses,
      dialog: false,
      dialogForm,
      dialogSchema,
    }
  },
  created () {
  },
  mounted () {
    this.list(false)
  },
  methods: {
    list (searchFirstPage = true) {
      this.$refs.table.list(searchFirstPage)
    },
    resetForm () {
      this.$refs.form.resetForm()
      this.list()
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    edit (row) {
      this.dialog = true
      this.dialogForm.id = row.id
      this.dialogForm.typeCode = row.typeCode
      this.dialogForm.typeName = row.typeName
      this.dialogForm.type = {
        code: row.typeCode,
        name: row.typeName,
      }
      this.dialogForm.description = row.description
    },
    delete (row) {
      this.confirm(row, 'delete')
    },
    publish (row) {
      this.confirm(row, 'publish')
      // request(urlMap.process.publish, { modelId: row.id }).then(res => {
      //   if (res.head.errCode === 0) {
      //     this.$messageTips(this, 'success', '发布成功')
      //     this.list()
      //   }
      // })
    },
    editFlow (row) {
      window.open(this.$ever.api + '/process-engine/#/editor/' + row.id, '_blank')
    },
    revoke (row) {
      this.confirm(row)
    },
    confirm (row, type = 'revoke') {
      const h = this.$createElement
      let cascade = false
      let title = '确认撤销'
      let msg = '撤销成功'
      let url = urlMap.process.revoke
      const params = {
        deploymentId: row.deploymentId
      }
      if (type === 'delete') {
        title = '确认删除'
        msg = '删除成功'
        url = urlMap.process.delete
        params.modelId = row.id
      } else if (type === 'publish') {
        title = '确认发布'
        msg = '发布成功'
        url = urlMap.process.publish
        params.modelId = row.id
      }
      this.$msgbox({
        title,
        message: h('div', null, [
          h('el-checkbox', {
            key: U(),
            on: {
              change (val) {
                cascade = val
              }
            }
          }, '是否级联'),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            params.cascade = cascade
            request(url, params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', msg)
                if (done) done()
                this.list()
              }
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            if (done) done()
          }
        },
      }).then(() => {
      }).catch(() => { })
    },
    toNew () {
      this.$router.push({ name: 'sysprocessdetail' })
    },
    ok () {
      request(urlMap.process.update, this.dialogForm).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '更新成功')
          this.dialog = false
          this.list()
        }
      })
    },
    cancel () {
      this.dialog = false
    },
    changeType (obj) {
      this.dialogForm.typeName = obj.name
      this.dialogForm.typeCode = obj.code
    },
  },
}
</script>
<style scoped lang="less">
</style>
