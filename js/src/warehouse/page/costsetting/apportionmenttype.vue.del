<template>
  <div>
    <!-- <ever-bread-crumb name="分摊参数" path="/warehouse/apportionmenttype"></ever-bread-crumb> -->
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <el-button size="small" type="primary" @click="createReceivables" style="margin-right:10px;">新增</el-button>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" :border="false">
        <el-table-column prop="code" label="分摊参数代码" align="center"></el-table-column>
        <el-table-column prop="name" label="分摊参数名称" align="center"></el-table-column>
        <el-table-column prop="createUser" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="edittype(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
    <el-dialog
      :title="loginfo.title"
      :visible.sync="loginfo.dialogVisible"
      class="ui_dialog_02 q_ui_dialog_diy"
    >
      <div class="patientInfo" v-if="loginfo.dialogVisible">
        <ever-form2
          class="diy-form"
          :schema="querySchemat"
          v-model="addqueryObj"
          :span="12"
          :api="api"
          :info="true"
          :nosubmit="true"
          :rules="rules"
          ref="form"
        >
          <template slot="code">
            <el-input
              v-model="addqueryObj.code"
              placeholder="请输入分摊参数代码"
              :disabled="loginfo.disabled"
              :maxlength="20"
            ></el-input>
          </template>
          <template slot="name">
            <el-input v-model="addqueryObj.name" placeholder="请输入分摊参数名称" :maxlength="20"></el-input>
          </template>
        </ever-form2>
      </div>
      <div style="float:right">
        <el-button type="primary" @click="addtype" style="margin-right:10px;">保存</el-button>
        <el-button @click="loginfo.dialogVisible=false" style="margin-right:10px;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/store/apportionmenttypeapi'
import list from '@/util/list'

var schema = [
  {
    name: 'name',
    label: '分摊参数名称'
  }
]
let schemat = [
  {
    name: 'code',
    label: '分摊参数代码',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '分摊参数名称',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    let addobj = this.$ever.createObjFromSchema(schemat)
    let rules = {
      code: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    return {
      querySchema: schema,
      querySchemat: schemat,
      queryObj: obj,
      addqueryObj: addobj,
      api,
      rules,
      curId: '',
      loginfo: {
        dialogVisible: false,
        id: '',
        title: '新建分摊参数',
        disabled: false
      }
    }
  },
  methods: {
    handleDelete (id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.del({ id: id })
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功')
        this.list()
      })
    },
    edittype (row) {
      this.loginfo.dialogVisible = true
      this.addqueryObj.code = row.code
      this.addqueryObj.name = row.name
      this.loginfo.disabled = true
      this.loginfo.title = '编辑分摊参数'
      this.loginfo.id = row.id
    },
    createReceivables () {
      this.loginfo.dialogVisible = true
      // this.checkArr.length
      // this.$notify.error({
      //   title: '',
      //   message: '111'
      // })
    },
    addtype () {
      let self = this
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let url = 'addapportionType'
          let params = {
            name: self.addqueryObj.name
          }
          if (this.loginfo.id) {
            params['id'] = this.loginfo.id
            url = 'editapportionType'
          } else {
            params['code'] = self.addqueryObj.code
          }
          api[url](params).then(result => {
            this.$notify({
              title: '',
              message: '保存成功',
              type: 'success'
            })
            this.loginfo.dialogVisible = false
            this.list()
          })
        }
      })
    }
  },
  watch: {
    'loginfo.dialogVisible': {
      handler (newValue) {
        if (!newValue) {
          this.addqueryObj.code = ''
          this.addqueryObj.name = ''
          this.loginfo.disabled = false
          this.loginfo.title = '新建分摊参数'
          this.loginfo.id = ''
        }
      },
      immediate: true
    }
  },
  created () {
    // insuranceorgApi.list({}).then(result => {
    //   for (var insur of result.data) {
    //     insur.name = insur.insuranceOrgCnName
    //   }
    //   this.$ever.getFieldFromSchema(this.querySchema, 'insuranceOrgID').options = result.data
    // })
  }
}
</script>
<style lang="less">
.q_ui_dialog_diy {
  .el-dialog__body {
    box-sizing: border-box;
    margin: 0 20px !important;
    padding: 20px 20px 40px 20px !important;
    border-top: 1px solid #bfcbd9;
    max-height: 500px !important;
  }

  .content {
    font-size: 16px;
    padding: 30px 40px;
  }
  .el-row {
    margin-bottom: 15px;
  }
  .downbtn {
    color: #409eff;
  }
}
</style>
