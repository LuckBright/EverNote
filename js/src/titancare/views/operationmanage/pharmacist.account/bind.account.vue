<template>
  <div class='bind-account'>
    <div>
      <el-form ref='form' :model='form' label-width='120px' :rules='rules' :inline=true>
        <el-form-item label='姓名'>
          <el-input v-model.trim='result.name' disabled></el-input>
        </el-form-item>
        <el-form-item label='手机号'>
          <el-input v-model='result.mobile' disabled></el-input>
        </el-form-item>
        <el-form-item label='身份证号'>
          <el-input v-model='result.idCardNum' disabled></el-input>
        </el-form-item>
        <el-form-item label='性别' prop='sex'>
          <el-select v-model='form.sex' placeholder='性别'>
            <el-option
              v-for='item in sexOptions'
              :key='item.value'
              :label='item.name'
              :value='item.value'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='药师执业证机构' prop='pracHospital'>
          <el-input v-model='form.pracHospital' placeholder='药师执业证机构'></el-input>
        </el-form-item>
        <el-form-item label='发证时间' prop='pracRecDate'>
          <el-date-picker
            v-model="form.pracRecDate"
            type="date"
            value-format='yyyy-MM-dd'
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='专业技能职称' prop='titleCode'>
          <el-select v-model='form.titleCode' filterable placeholder='专业技能职称'>
            <el-option
              v-for='item in titleCodeOptions'
              :key='item.value'
              :label='item.name'
              :value='item.value'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='出生日期' prop='birthday'>
          <el-date-picker
            v-model="form.birthday"
            type="date"
            value-format='yyyy-MM-dd'
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div>
        <ever-form2
          :schema='schema'
          v-model='schemaObj'
          :api='api'
          :inline='true'
          ref='formR'
          label-position='right'
        >
          <template slot='idCardFile'>
            <upload-file2
              @success1="(file) => {uploadSuccess(file, 'idCardFile')}"
              @change="(file) => {fileList(file, 'idCardFile')}"
              :list="fileArr.idCardFile"
              previewInline="true"
              uploadApiType="ucloud"
              listType="picture-card"
            ></upload-file2>
          </template>
          <template slot="pracFile">
            <upload-file2
              @success1="(file) => {uploadSuccess(file, 'pracFile')}"
              @change="(file) => {fileList(file, 'pracFile')}"
              :list="fileArr.pracFile"
              previewInline="true"
              uploadApiType="ucloud"
              listType="picture-card"
            ></upload-file2>
          </template>
          <div slot='default'></div>
        </ever-form2>
      </div>
      <div>
        <bind-tenant @change='addClick' :json='tenantInfo'></bind-tenant>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
import bindTenant from './bind.tenant'
let schema = [
  {
    name: 'idCardFile',
    label: '身份证',
    comp: 'custom'
  },
  {
    name: 'pracFile',
    label: '药师执业证',
    comp: 'custom'
  }
]
export default {
  props: ['id', 'result'],
  components: {
    bindTenant
  },
  data () {
    let schemaObj = this.$ever.createObjFromSchema(schema)
    let rules = {
      sex: [
        {required: true, message: '必填项', trigger: ['change', 'blur']}
      ],
      pracHospital: [
        {required: true, message: '必填项', trigger: 'blur'}
      ],
      pracRecDate: [
        {required: true, message: '必填项', trigger: 'blur'}
      ],
      titleCode: [
        {required: true, message: '必填项', trigger: ['change', 'blur']}
      ],
      birthday: [
        {required: true, message: '必填项', trigger: 'blur'}
      ]
    }
    return {
      schemaObj,
      schema,
      tenantInfo: [],
      fileArr: {
        pracFile: [], // 药师执业证
        idCardFile: [] // 身份证
      },
      rules,
      api,
      form: {
        sex: '',
        pracHospital: '',
        pracRecDate: '',
        birthday: '',
        titleCode: ''
      },
      sexOptions: [
        {value: '1', name: '男'},
        {value: '2', name: '女'}
      ],
      titleCodeOptions: [],
    }
  },
  mounted () {
    this.getAccount()
  },
  methods: {
    uploadSuccess (file, type) {
      this.fileArr[type].push({url: this.$ever.fileUrl2 + file.fileId, fileId: file.fileId})
    },
    fileList (file, type) {
      if (file.length === 0) {
        this.fileArr[type] = []
      } else {
        this.fileArr[type] = file
      }
    },
    getAccount () {
      let params = {platformAccountIds: [this.id]}
      api.searchPlatformAccount(params).then(res => {
        if (res.length) {
          this.form = Object.assign({}, this.form, res[0])
          let obj = {}
          obj['idCardFile'] = res[0].idCardFile
          obj['pracFile'] = res[0].pracFile
          this.tenantInfo = res[0]
          this.assignInfo(obj, this.schemaObj)
        }
      })
      api.getTitleCodeTwoYS().then(res => {
        if (res) {
          this.titleCodeOptions = res
        }
      })
    },
    assignInfo (obj, schema) {
      for (let key in schema) {
        if (['idCardFile', 'pracFile'].includes(key)) {
          if (obj[key]) {
            this.fileArr[key] = obj[key].map(item => { return {url: this.$ever.fileUrl2 + item.value, fileId: item.value} })
          }
        }
      }
    },
    // 添加绑定账号
    addClick (val, localhost) {
      if (this.result.name) {
        this.$refs.form.validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.result, this.form, this.schemaObj, val, {id: ''})
            params.platformAccountId = this.result.id
            params.idCard = this.result.idCardNum
            params.idCardFile = this.fileArr['idCardFile'].map(item => { return item.fileId })
            params.pracFile = this.fileArr['pracFile'].map(item => { return item.fileId })
            if (params.idCardFile.length && params.pracFile.length) {
              api.savePlatformThcTenantInfo(localhost, params).then(res => {
                if (JSON.stringify(res) !== '{}') {
                  this.$notify({
                    message: '操作成功',
                    type: 'success',
                    duration: 2000
                  })
                  // this.$router.push({path: '/titancare/operation/pharmacistaccountlist'})
                  this.$router.push({path: '/titancare/operation/pharmacistaccountlist', query: {obj: JSON.parse(this.$route.query.obj)}})
                }
              })
            } else {
              this.$notify.error({
                message: '请上传证件照片'
              })
            }
          }
        })
      } else {
        this.$notify.error({
          message: '请先创建账户'
        })
      }
    }
  }
}
</script>
<style scoped>
.bind-account >>> .el-input__inner{
  width: 180px;
}
</style>
