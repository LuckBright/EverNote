<template>
  <div>
    <ever-bread-crumb
      :name="crumbName ? crumbName: '新建随访计划'"
      show-edit-fnt="false"
      :have-return="true"
    ></ever-bread-crumb>
    <div class="bg pd20">
      <el-row>
        <el-col :span="20" class="title">
          <span class="name">计划内容</span>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" @click="addRow">添加随访子内容</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bg pdb20">
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border>
            <!-- <el-table-column prop="name" label="随访时间" :span="2" align="center">
              <template slot-scope="scope">
                <sys-value type="THC_FOLLOW_UP_TIME" :code="scope.row.triggerType"></sys-value>
                {{scope.row.timeNum}}{{scope.row.timeTypeName}}
              </template>
            </el-table-column> -->
            <el-table-column label="随访任务" prop="templateName" :span="2">
              <template slot-scope="scope">{{scope.row.material && scope.row.material.name}}</template>
            </el-table-column>
            <el-table-column label="随访方式" align="center" prop="createTime" :span="2">
              <template slot-scope="scope">
                <sys-value type="THC_CC_FOLLOWUP" :code="scope.row.way"></sys-value>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" :span="2" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="linkImgurl(scope.row)">预览</el-button>
                <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="formName" width="100%" :visible.sync="formDialog">
      <task-form :id="'-1'" :schema-id="formUrl" :nosubmit="true"></task-form>
    </el-dialog>
    <dialog-subtask
      ref="subtask"
      :id="imgId"
      :visible="dialogVisible"
      @close="close"
      @update="update"
    ></dialog-subtask>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import dialogSubtask from '@/crm/page/healthy/dialog.subtask'
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
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      queryObj,
      querySchema,
      imgId: '',
      dialogVisible: false,
      tableData: [],
      id: this.$route.params.id,
      crumbName: '',
      formUrl: '',
      formDialog: false,
      formName: ''
    }
  },
  created () {
    this.getTemplatelist()
  },
  methods: {
    getTemplatelist () {
      api.getTemplatelist({ 'templateId': this.id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
          this.crumbName = rs.data && rs.data[0].templateName
        }
      })
    },
    linkRepeatPage (id) {
      let queryData = {}
      queryData['id'] = id
      queryData['type'] = this.type
      this.$router.push({ path: 'repeatdetail', query: queryData })
    },
    addRow () {
      this.imgId = null
      this.dialogVisible = true
      this.$refs.subtask.isCreate = true
    },
    linkImgurl (val) {
      if (val.material.type === 1) {
        window.open(val.material.url)
      } else {
        this.formName = val.material.name
        this.formUrl = val.material.url
        this.formDialog = true
      }
    },
    deleteRow (val) {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteTask({ 'id': val }).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功!')
            this.getTemplatelist()
          }
        })
      }).catch(() => {
        return false
      })
    },
    close () {
      this.dialogVisible = false
    },
    update (id) {
      this.dialogVisible = false
      this.getTemplatelist()
    },
    edit (id) {
      this.dialogVisible = true
      this.$refs.subtask.isCreate = false
      this.imgId = id
    }
  },
  components: {
    dialogSubtask,
    taskForm
  }
}
</script>
