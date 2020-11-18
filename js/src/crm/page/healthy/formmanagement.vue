<template>
  <div class="min-height bg">
    <div class="bg pd20 pbb">
      <el-row>
        <el-col :span="20">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="getByCategory(queryObj.name)"
          ></ever-form2>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" @click="addRow">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bg pdb20">
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border>
            <el-table-column label="表单名称" prop="name" :span="2" align="center"></el-table-column>
            <el-table-column label="表单分类" prop="categoryName" :span="2"></el-table-column>
            <el-table-column label="添加时间" align="center" prop="createTime" :span="2"></el-table-column>
            <el-table-column label="添加人" align="center" prop="creatorName" :span="2"></el-table-column>
            <el-table-column label="操作" align="center" :span="2">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="openFormDialog(scope.row)">预览</el-button>
                <el-button type="primary" size="small" @click="showDialog(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <dialog-addimgtext
      ref="createForm"
      :id="imgId"
      :title="`表单`"
      :visible="dialogVisible"
      @close="close"
      @update="update"
    ></dialog-addimgtext>
    <el-dialog :title="formName" width="100%" :visible.sync="formDialog">
      <task-form :id="'-1'" :schema-id="formUrl" :nosubmit="true"></task-form>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import dialogAddimgtext from '@/crm/page/healthy/dialog.createform'
import taskForm from '@/form/components/remoteform'
let querySchema = [
  {
    name: 'name',
    label: '分类名称',
    comp: 'ever-select',
    props: {
      options: [],
      placeholder: '分类名称'
    }
  }
]
export default {
  name: 'formmanagement',
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      queryObj,
      querySchema,
      imgId: '',
      dialogVisible: false,
      tableData: [],
      formDialog: false,
      formUrl: '',
      formName: ''
    }
  },
  watch: {
    'queryObj.name': {
      handler: function (val) {
        val && this.getByCategory(val)
      },
      deep: true
    }
  },
  created () {
    this.getAllImageText()
  },
  methods: {
    openFormDialog (form) {
      this.formUrl = form.url
      this.formDialog = true
      this.formName = form.name
    },
    getAllImageText () {
      api.getAllImageText().then(rs => {
        if (rs.head.errCode === 0) {
          this.$ever.getFieldFromSchema(
            this.querySchema,
            'name'
          ).props.options = rs.data
          this.queryObj.name = rs.data[0].id
        }
      })
    },
    getByCategory (id) {
      api.getForm({ category: id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
        }
      })
    },
    linkurlDetail (val) {
      window.open(val.url)
    },
    addRow () {
      this.imgId = null
      this.$refs.createForm.isAdd = true
      this.dialogVisible = true
    },
    showDialog (id) {
      this.imgId = id
      this.$refs.createForm.isAdd = false
      this.dialogVisible = true
    },
    deleteRow (val) {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteImg({ id: val }).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功!')
              this.getByCategory(this.queryObj.name)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    close () {
      this.dialogVisible = false
    },
    update (id) {
      this.dialogVisible = false
      this.getByCategory(id)
      this.queryObj.name = id
    }
  },
  components: {
    dialogAddimgtext,
    taskForm
  }
}
</script>
<style scoped>
.min-height {
  min-height: 100%;
}
.pbb {
  padding-bottom: 0px;
}
</style>
