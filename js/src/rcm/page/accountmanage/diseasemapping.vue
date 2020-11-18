<template>
  <div>
    <ever-bread-crumb name="诊断和病种映射" path="/accountmanage/diseasemapping"></ever-bread-crumb>
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
          prop="diagnoseName"
          label="诊断名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="diagnoseCode"
          label="诊断编码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="diseaseName"
          label="病种名称"
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
    <el-dialog :title="loginfo.title" :visible.sync="loginfo.dialogVisible" class="ui_dialog_02">
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
            <template slot="diagnoseId">
                <el-autocomplete
                  v-model="addqueryObj.diagnoseId"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  :disabled="loginfo.disabled"
                  @select="handleSelect"
                ></el-autocomplete>
            </template>
            <template slot="diseaseId">
                <el-select v-model="addqueryObj.diseaseId" placeholder="请选择">
                    <el-option
                    v-for="item in name2list"
                    :key="item.id"
                    :label="item.diseaseName"
                    :value="item.id">
                    </el-option>
                </el-select>
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
import selectapi from '@/workspace/store/medicalapi'
import api from '@/rcm/store/accountmanage/diseasemappingapi'
import list from '@/util/list'

let schemat = [
  {
    name: 'diagnoseId',
    label: '诊断名称',
    comp: 'custom',
    span: 24
  },
  {
    name: 'diseaseId',
    label: '病种名称',
    comp: 'custom',
    span: 24
  }
]
export default {
  mixins: [list],
  data () {
    let addobj = this.$ever.createObjFromSchema(schemat)
    let rules = {
      'diagnoseId': [
          { required: true, message: '必填项', trigger: 'blur' }
      ],
      'diseaseId': [
          { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    addobj['diagnose'] = ''
    return {
      querySchemat: schemat,
      addqueryObj: addobj,
      api,
      selectapi,
      rules,
      time: null,
      curId: '',
      name1list: [],
      name2list: [],
      loginfo: {
        dialogVisible: false,
        id: '',
        title: '新建映射关系',
        disabled: false
      }
    }
  },
  methods: {
    getSelect () {
      api.getSelect({offset: 0, pagesize: 300}).then(result => {
        this.name2list = result.data
      })
    },
    querySearchAsync (queryString, cb) {
      clearTimeout(this.time)
      this.time = null
      this.time = window.setTimeout(_ => {
        selectapi.searchDiagnose({
          offset: 0,
          pagesize: 200,
          name: queryString
        }).then(res => {
          cb(this.initdata(res.data.resultList))
        })
      }, 300)
    },
    initdata (data) {
      if (data.length === 0) return []
      let arr = []
      if (Object.prototype.toString.call(data[0]) === '[object Array]') {
        data.forEach(item => {
          arr = [...arr, ...item]
        })
      } else {
        arr = data
      }
      arr.forEach(item => {
        item['value'] = item.diseaseName
      })
      return arr
    },
    handleSelect (item) {
      this.addqueryObj.diagnose = item.id
      this.addqueryObj.diagnoseId = item.diseaseName
    },
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
      this.addqueryObj.diseaseId = row.diseaseId
      this.addqueryObj.diagnoseId = row.diagnoseName
      this.addqueryObj.diagnose = row.diagnoseId
      this.loginfo.disabled = true
      this.loginfo.title = '编辑映射关系'
      this.loginfo.id = row.id
    },
    createReceivables () {
      this.loginfo.dialogVisible = true
    },
    addtype () {
      let self = this
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let url = 'add'
          let params = {
            diagnoseId: self.addqueryObj.diagnose,
            diseaseId: self.addqueryObj.diseaseId
          }
          if (this.loginfo.id) {
            params['id'] = this.loginfo.id
            url = 'update'
          }
          if (!self.addqueryObj.diagnose || !self.addqueryObj.diagnoseId) {
            this.$notify({
              title: '',
              message: '诊断名称不能为空',
              type: 'error'
            })
            return
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
          this.addqueryObj.diagnoseId = ''
          this.addqueryObj.diagnose = ''
          this.addqueryObj.diseaseId = ''
          this.loginfo.disabled = false
          this.loginfo.title = '新建映射关系'
          this.loginfo.id = ''
        }
      },
      immediate: true
    }
  },
  created () {
    this.getSelect()
  }
}
</script>
<style lang="less" scoped>
  .ui_dialog_02{
    .el-dialog__body{
      box-sizing: border-box;
      margin:0 20px !important;
      padding:20px 20px 40px 20px !important;
      border-top: 1px solid #bfcbd9;
      max-height:500px !important;
      .el-select{
        width: 100%;
      }
      .el-autocomplete{
        width: 100%;
      }
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
