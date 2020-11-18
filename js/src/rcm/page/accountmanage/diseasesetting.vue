<template>
  <div>
    <ever-bread-crumb name="病种设置" path="/accountmanage/diseasesetting"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <div class="main-option">
          <el-button type="primary" @click="createReceivables" style="margin-right:10px;">新增</el-button>
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        >
        <el-table-column
          prop="diseaseCode"
          label="病种编码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="diseaseName"
          label="病种名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="diseaseDescription"
          label="病种说明"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createUser"
          label="操作"
          align="center">
          <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="edittype(scope.row)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-row>
    </div>
    <el-dialog :title="loginfo.title" :visible.sync="loginfo.dialogVisible" class="ui_dialog_02 q_ui_dialog_diy">
        <div class="patientInfo" v-if="loginfo.dialogVisible">
            <ever-form2
            class="diy-form"
            :schema="querySchemat"
            v-model="addqueryObj"
            :span=12
            :api="api"
            :info="true"
            :nosubmit="true"
            :rules="rules"
            ref="form">
            <template slot="diseaseCode">
                <el-input v-model="addqueryObj.diseaseCode" placeholder="请输入病种编码" :maxlength='20'></el-input>
            </template>
            <template slot="diseaseName">
                <el-input v-model="addqueryObj.diseaseName" placeholder="请输入病种名称" :maxlength='20'></el-input>
            </template>
            <template slot="diseaseDescription">
                <el-input v-model="addqueryObj.diseaseDescription" placeholder="请输入病种说明" :maxlength='50'></el-input>
            </template>
        </ever-form2>
        </div>
        <div style="float:right">
          <el-button type="primary" @click="addtype" style="margin-right:10px;">保存</el-button>
        <el-button  @click="loginfo.dialogVisible=false" style="margin-right:10px;">取消</el-button>
        
        </div>

  </el-dialog>
</div>
</template>
<script>
import api from '@/rcm/store/accountmanage/diseasesettingapi.js'
import list from '@/util/list'

let schemat = [
  {
    name: 'diseaseCode',
    label: '病种编码',
    comp: 'custom'
  },
  {
    name: 'diseaseName',
    label: '病种名称',
    comp: 'custom'
  },
  {
    name: 'diseaseDescription',
    label: '病种说明',
    comp: 'custom',
    span: 24
  }
]
export default {
  mixins: [list],
  data () {
    let addobj = this.$ever.createObjFromSchema(schemat)
    let rules = {
      diseaseCode: [
          { required: true, message: '必填项', trigger: 'blur' }
      ],
      diseaseName: [
          { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    return {
      loading: false,
      querySchemat: schemat,
      addqueryObj: addobj,
      api,
      rules,
      curId: '',
      loginfo: {
        dialogVisible: false,
        id: '',
        title: '新建病种',
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
        return api.del({id: id})
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.list()
      })
    },
    edittype (row) {
      this.loginfo.dialogVisible = true
      this.addqueryObj.diseaseCode = row.diseaseCode
      this.addqueryObj.diseaseName = row.diseaseName
      this.addqueryObj.diseaseDescription = row.diseaseDescription
      this.loginfo.disabled = true
      this.loginfo.title = '编辑病种'
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
          let url = 'add'
          let params = {
            diseaseCode: self.addqueryObj.diseaseCode,
            diseaseName: self.addqueryObj.diseaseName,
            diseaseDescription: self.addqueryObj.diseaseDescription
          }
          if (this.loginfo.id) {
            params['id'] = this.loginfo.id
            url = 'update'
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
          this.addqueryObj.diseaseCode = ''
          this.addqueryObj.diseaseName = ''
          this.addqueryObj.diseaseDescription = ''
          this.loginfo.disabled = false
          this.loginfo.title = '新建病种'
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
  .q_ui_dialog_diy{
    .el-dialog__body{
      box-sizing: border-box;
      margin:0 20px !important;
      padding:20px 20px 40px 20px !important;
      border-top: 1px solid #bfcbd9;
      max-height:500px !important;
    }

    .content{
      font-size: 16px;
      padding:30px 40px;
    }
    .el-row{
      margin-bottom: 15px;
    }
    .downbtn{
      color:#409eff
    }
  }
</style>
