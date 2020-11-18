<template>
  <div id="packageunit2">
    <el-dialog
      title="添加包装单位"
      :visible.sync="dialogVisible"
      class="ui_dialog_02">
      <div style="min-height:500px;font-size: 20px">
        <el-row class="infoStyle">
          <el-col :span="24" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="通用名：">
                <span>{{drugObj.byname}}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <ever-form2 :schema="schema" v-model="obj" ref="form2" :span="12" :rules="rules" :api="beHospitalizedApi" :nosubmit="true" @objsaved="afterSave">
          <template slot="photoUrl">
            <upload-file @success="uploadSuccess" @change="fileList" listType="picture-card" maxNum="8" :list="fileArr"></upload-file>
          </template>
        </ever-form2>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="close"><i class="iconfont icon-quxiao"></i>取消</el-button>
          <el-button @click="submit" type="primary"><i class="iconfont icon-tijiao"></i>确认</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import beHospitalizedApi from '@/warehouse/store/behospitalizedapi'
import manufacturerApi from '@/warehouse/store/manufacturerapi'
import {HERBALTYPE} from '@/util/common'
var schema = [
  {
    name: 'name',
    label: '商品名'
  },
  {
    name: 'initialTrade',
    label: '商品名拼音简码'
  },
  {
    name: 'herbalType',
    label: '类别',
    comp: 'ever-select',
    props: {
      options: HERBALTYPE
    }
  },
  {
    name: 'unit',
    label: '单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_ZYCDW'
    }
  },
  {
    name: 'dosageunit',
    label: '规格单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_ZYCDW'
    }
  },
  {
    name: 'specratio',
    label: '规格转换比',
    props: {
      type: 'number'
    }
  },
  {
    name: 'produceCompanyId',
    label: '生产厂商',
    comp: 'ever-remoteMethod',
    props: {
      api: manufacturerApi,
      isSilentQuery: true
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'barCode',
    label: '条码'
  },
  {
    name: 'photoUrl',
    label: '上传图片',
    comp: 'custom',
    span: 24
  }
]
var ratioSchema = {
  name: 'drugRatio',
  label: '药效比',
  props: {
    type: 'number'
  }
}
var ratioRules = {drugRatio: [{required: true, message: '必填项', trigger: 'blur'}, {min: 1, max: 6, message: '药效比小于6位数,请重新输入', trigger: 'blur'}]}
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      dialogVisible: false,
      schema,
      obj,
      obj2: obj,
      beHospitalizedApi,
      drugObj: '',
      fileArr: [],
      uploadList: [],
      rules: {
        unit: [{required: true, message: '必填项', trigger: 'change'}],
        initialTrade: [{required: true, message: '必填项', trigger: 'blur'}],
        name: [{required: true, message: '必填项', trigger: 'blur'}]
      },
      tempRules: {}
    }
  },
  mounted () {
    this.tempRules = this.rules
  },
  methods: {
    uploadSuccess: function (file) {
      // console.log('file--->', file)
    },
    fileList: function (fileList) {
      this.fileArr = fileList
      let photoArr = []
      this.fileArr.forEach(item => {
        photoArr.push(item.response)
      })
      this.obj.photoUrl = photoArr.join(',')
    },
    open (data) {
      for (let key in this.obj) {
        this.obj[key] = ''
      }
      this.obj.herbalType = '1'
      this.obj.drugRatio = '1'
      this.fileArr = []
      this.drugObj = data
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    submit () {
      this.obj = Object.assign({}, this.drugObj, this.obj)
      delete this.obj.drugs
      delete this.obj.id
      this.obj.source = this.$store.state.currentUser.organizationId
      this.obj.sourceName = this.$store.state.currentUser.organizationName
      this.obj.byname = this.drugObj.byname
      this.obj.drugType = this.drugObj.drugType
      this.obj.oriUuid = this.drugObj.id// spuid
      for (let key in this.obj) {
        if (this.obj[key] === null) {
          delete this.obj[key]
        }
      }
      this.$nextTick(function () {
        this.$refs.form2.submitForm()
        this.obj = this.obj2
      })
    },
    afterSave (val) {
      this.close()
      this.$emit('close:query', val, this.drugObj)
    },
    _setSchema () {
      let index = this.schema.findIndex(item => {
        return item.name === 'herbalType'
      })
      return index
    }
  },
  watch: {
    'dialogVisible' (val) {
      if (!val) this.$refs.form2.resetForm()
    },
    'obj.herbalType' (val) {
      this.rules = this.tempRules
      if (val === '2') {
        let index = this._setSchema()
        this.schema.splice(index + 1, 0, ratioSchema)
        this.rules = Object.assign({}, this.rules, ratioRules)
      } else {
        let index = this.schema.findIndex(item => {
          return item.name === 'drugRatio'
        })
        if (index > -1) {
          let index2 = this._setSchema()
          this.schema.splice(index2 + 1, 1)
          this.obj.drugRatio = '1'
        }
      }
      this.$nextTick(() => {
        this.$refs.form2.$refs.form.clearValidate()
        this.obj.herbalType = val
      })
    }
  }
}
</script>
<style scoped>
.infoStyle .el-form-item { margin-bottom: 0}
.infoStyle { margin-bottom: 10px}
</style>
