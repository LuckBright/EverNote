<template>
  <el-dialog
    class="dialog newadd"
    title="新建模版"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="395px"
  >
    <el-form ref="myform" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="模版名称：" prop="name" class="height32">
        <el-input v-model="form.name" placeholder="请输入模版名称"></el-input>
      </el-form-item>
      <el-form-item label="适用科室：" prop="depts">
        <el-select type="textarea" v-model="form.depts" placeholder="请选择科室" multiple value-key="orgSubjectCode" style="width:265px;" filterable :multiple-limit="10">
          <el-option
            v-for="item in dptOptions"
            :key="item.orgSubjectCode"
            :label="item.orgSubjectName"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="适用疾病：" prop="content">
        <el-input type="textarea" v-model="form.content" placeholder="必填,150字"></el-input>
      </el-form-item> -->
      <el-form-item label="初复诊：" prop="visitType">
        <el-radio-group v-model="form.visitType">
          <el-radio :label="1">初诊</el-radio>
          <el-radio :label="2">复诊</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模版权重：" prop="weight">
        <el-input
          v-model.number="form.weight"
          placeholder="选填"
          type="number"
          :maxlength="2"
        ></el-input>
      </el-form-item>
      <el-form-item label="模版设置：" prop="isAutoSendQuestion">
        <el-checkbox label="图文问诊自动发送" v-model="isAutoSendQuestion"></el-checkbox>
        <el-checkbox label="复用问诊单" v-model="resueCheck"></el-checkbox>
      </el-form-item>
      <el-form-item label="复用模版：" prop="reusename" v-if="resueCheck">
        <!-- <el-input v-model="form.reusename" placeholder="请选择模版"></el-input> -->
        <el-autocomplete
            class="inline-input"
            v-model="reusename"
            :fetch-suggestions="querySearch"
            placeholder="请输入要复用模版的名称"
            @select="handleSelect"
          ></el-autocomplete>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="onSubmit(form)">确定</el-button>
        <el-button class="cancel" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import api from '@/titancare/api/visit/visitapi'
import { debounce } from '@/titancare/utils/common'
import bus from '@/util/eventbus'
// import storage from '@/util/storage'
import { routerArr } from './routeconfig'

export default {
  props: {
    'category': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      api,
      // storage,
      dialogVisible: false,
      edit: false, // 默认可编辑1
      form: {
        name: '',
        depts: [],
        visitType: 1,
        weight: 99
      },
      dptOptions: [],
      checkList: [],
      resueCheck: false,
      isAutoSendQuestion: false,
      reusename: '',
      sendData: {},
      rules: {
        name: [
          { required: true, message: '请输入模版名称', trigger: 'blur' },
          { max: 20, message: '最多20个字符', trigger: 'blur' }
        ],
        depts: [
          { required: true, message: '请选择适用科室', trigger: 'blur' }
        ],
        visitType: [
          { required: true, message: '请选择复诊类型', trigger: 'change' }
        ],
        weight: [
          { required: false, trigger: 'blur' },
          { type: 'number', max: 999, message: '最大值999', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'dialogVisible': {
      handler (val) {
        val && this.getdpt()
        this.$nextTick(_ => {
          this.resetForm()
        })
      },
      deep: true
    }
  },
  methods: {
    onSubmit: debounce(function () {
      this.$refs.myform.validate((valid) => {
        if (valid) {
          this.form.category = this.category
          this.form.isAutoSendQuestion = this.isAutoSendQuestion
          this.api.create(this.form).then(rs => {
            if (rs.errCode === 0) {
              this.$notify({
                message: '保存成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.reset()
              this.sendData = rs.data
              this.$router.push({
                name: routerArr[Number(this.category) - 1] + 'edit',
                query: {
                  id: rs.data.questionId,
                  categoryId: this.category
                }
              })
              // this.$router.push({
              //   name: 'visitdetail',
              //   params: {
              //     id: rs.data.questionId,
              //     categoryId: this.category
              //   }
              // })
            }
          })
        }
      })
    }),
    getdpt (v) {
      let params = {}
      switch (this.category) {
        case '1':
          params = {
            orgIdList: []
          }
          break
        case '2':
          params = {
            orgIdList: [localStorage.getItem('CLINICID')]
          }
          break
        case '3':
          params = {
            staffIdList: [localStorage.getItem('USERID')]
          }
          break
        case '4':
          params = {
            staffIdList: [localStorage.getItem('USERID')]
          }
          break
      }
      params.status = 'y'
      params.offset = '0'
      params.pagesize = 10000
      api.getdpt(params).then(rs => {
        if (rs.errCode === 0) {
          this.dptOptions = rs.data && rs.data.resultList.filter(item => {
            item.objId = item.orgSubjectCode
            item.objName = item.orgSubjectName
            return item
          })
        }
      })
    },
    cancel () {
      this.dialogVisible = false
      this.reset()
    },
    reset () {
      this.form = {
        name: '',
        depts: [],
        visitType: 1,
        weight: null,
        templateId: ''
      }
    },
    resetForm () {
      this.$refs.myform.resetFields()
    },
    querySearch (query, cb) {
      const emptyArr = []
      query = query && String(query).trim()
      if (query) {
        this.remoteMethod(query).then(rs => {
          if (!rs || !rs.length) {
            cb(emptyArr)
          }
          if (rs) {
            let arr = rs.map(item => {
              let model = {} // Object.assign({}, item)
              model.value = item.name
              model.id = item.id
              return model
            })
            cb && cb(arr)
          }
        })
      } else {
        cb(emptyArr)
      }
    },
    handleSelect (val) {
      this.form.templateId = val.id
    },
    remoteMethod (query) {
      if (!query) {
        return
      }
      query = query && String(query).trim()
      let params = {
        name: query
      }
      return api.search(params).then(rs => {
        if (rs.errCode === 0) {
          return rs.data && rs.data.resultList
        }
      })
    }
  },
  destroyed () {
    bus.$emit('visitdetail', this.sendData)
  }
}
</script>

<style scoped lang="less">
.dialog /deep/ .el-dialog__body {
  padding: 5px 20px;
}
.dialog /deep/ .el-form .el-form-item {
  margin-bottom: 15px !important;
}
.dialog /deep/ .el-form-item__label {
  color: #666666;
  font-size: 14px;
}
.title {
  font-size: 16px;
  color: #2b333d;
}
.ml10 {
  margin-left: 10px;
}
.dialog /deep/ .el-form-item__label{
  line-height: 32px;
  height: 32px;
}
.newadd /deep/ .el-form-item__content {
  line-height: 33px;
  min-height:33px;
}
.newadd /deep/ .el-input__inner{
  line-height: 33px;
  height:33px;
}
</style>
