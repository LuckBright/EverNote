<template>
  <div>
    <div class="layout_inner flex_col_1_auto">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          labelWidth="140px"
          label-position="right"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="default">
            <el-form-item>
              <el-button @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button type="primary" @click="visible=true">新建</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column prop="name" label="团体名称"></el-table-column>
        <el-table-column prop="sourceName" label="渠道来源"></el-table-column>
        <el-table-column prop="contacts" label="联系人"></el-table-column>
        <el-table-column prop="telephone" label="联系电话"></el-table-column>
        <el-table-column prop="payStatusChs" label="创建日期">
          <template slot-scope="scope">{{scope.row.createTime.split(' ')[0]}}</template>
        </el-table-column>
        <el-table-column prop="comment" width="300" label="备注"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="details(scope.row)">导入</el-button>
            <el-button size="mini" type="primary" @click="emit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="cancel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <el-dialog
      v-if="visible"
      :title="title"
      :visible.sync="visible"
      width="40%"
      class="order ui_dialog_02 spe grouplog"
    >
      <div class="scoll">
        <ever-form2
          :schema="schema"
          v-model="obj"
          :span="24"
          :api="api"
          :rules="rules"
          ref="form"
          label-position="right"
        >
          <template slot="default">
            <el-col>
              <el-form-item>
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="update">确认</el-button>
              </el-form-item>
            </el-col>
          </template>
        </ever-form2>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../store/packageapi.js'
import list from '@/util/list'
import SourceCascader from '@/crm/components/sourcecascader'
let querySchema = [
  {
    label: '团体名称',
    name: 'name'
  },
  {
    label: '渠道来源',
    name: 'sourceId',
    comp: SourceCascader,
    props: {
      placeholder: '渠道来源'
    }
  }
]
let schema = [
  {
    name: 'name',
    label: '团体名称',
    props: {
      maxlength: 30
    }
  },
  {
    name: 'sourceId',
    label: '渠道来源',
    comp: SourceCascader,
    props: {
      placeholder: '渠道来源'
    }
  },
  {
    name: 'contacts',
    label: '联系人'
  },
  {
    name: 'telephone',
    label: '电话'
  },
  {
    name: 'comment',
    label: '备注说明',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 50
    },
    span: 24
  }
]
let rules = {
  name: [
    { required: true, message: '必填项', trigger: 'blur', type: 'string' }
  ],
  sourceId: [
    { required: true, message: '必填项', trigger: ['change', 'blur'] }
  ]
}
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      listApiName: 'groupList',
      visible: false,
      curId: '',
      title: '新建团体',
      api,
      queryObj,
      querySchema,
      obj,
      schema,
      rules
    }
  },
  created () {},
  watch: {
    'visible': {
      handler: function (val, oldval) {
        if (!val) {
          this.title = '新建团体'
          this.obj.name = ''
          this.obj.sourceId = ''
          this.obj.contacts = ''
          this.obj.telephone = ''
          this.obj.comment = ''
          this.curId = ''
        }
      }
    }
  },
  methods: {
    querySearchAsync (queryString, cb) {
      clearTimeout(this.time)
      this.time = null
      this.time = window.setTimeout(_ => {
        api.searchAvailable({
          offset: 0,
          pagesize: 200,
          name: queryString
        }).then(res => {
          let data = this.initData(res.data.resultList)
          cb(data)
        })
      }, 300)
    },
    initData (data) {
      let arr = []
      data.forEach(item => {
        arr.push({ value: item.name, address: item.id })
      })
      return arr
    },
    emit (row) {
      this.title = '编辑团体'
      this.curId = row.id
      this.obj.name = row.name
      this.obj.sourceId = row.sourceId
      this.obj.contacts = row.contacts
      this.obj.telephone = row.telephone
      this.obj.comment = row.comment
      this.visible = true
    },
    update () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.obj)
          if (params.telephone) {
            let res = /^(0\d{2,3}-\d{7,8})|(1[34578]\d{9})$/
            if (!res.test(params.telephone)) {
              this.$messageTips(this, 'error', '电话格式不正确')
              return
            }
          }
          if (this.curId) {
            params['id'] = this.curId
          }
          api.createOrUpdate(params).then(result => {
            this.$messageTips(this, 'success', '保存成功')
            this.visible = false
            this.list(true)
          })
        } else {
          this.$refs.form.autofocus()
        }
      })
    },
    cancel (row) {
      if (row.details.length > 0) {
        this.$messageTips(this, 'error', '团体已有人员，不能删除')
        return
      }
      this.$confirm('确定是要删除此团体?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteById({ id: row.id }).then(result => {
          if (result.head.errCode === 0) {
            this.list(true)
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      })
    },
    details (row) {
      this.$router.push({ path: '/kanban/uploadinfo/' + row.id })
    }
  },
  components: {
    SourceCascader
  }
}
</script>
<style lang="less" scoped>
.grouplog /deep/ {
  .submit-zone {
    display: none;
  }
  .el-select {
    width: 100%;
  }
}
</style>
