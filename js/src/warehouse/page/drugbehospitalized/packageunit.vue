<template>
  <div id="packageunit">
    <el-dialog
      title="添加包装单位"
      :visible.sync="dialogVisible"
      class="ui_dialog_02">
      <div style="min-height:500px;font-size: 20px">
        <el-row class="infoStyle">
          <el-col :span="12" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="通用名：">
                <span>{{drugObj.byname}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="商品名：">
                <span>{{drugObj.name}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="剂量：">
                <span>{{drugObj.content}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="剂量单位：">
                <span>{{setName(packageUnitArr, drugObj.unit, true)}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="说明书规格：">
                <span>{{drugObj.packageInfo}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="剂型：">
                <span>{{setName(packageUnitArr2, drugObj.dosageForm, true)}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="生产厂商：">
                <span>{{drugObj.produceCompanyName}}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="druginfo">
            <el-form label-position="right"  label-width="120px">
              <el-form-item label="批准文号：">
                <span>{{drugObj.ratifyCode}}</span>
              </el-form-item>
            </el-form>
          </el-col>

        </el-row>
        <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :api="beHospitalizedApi" :nosubmit="true" @objsaved="afterSave">
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
import setname from '@/util/setstatusname'
import validator from '@/util/validator'
import sysvalue from '@/warehouse/store/sysvalueapi'
var schema = [
  {
    name: 'packageUnit',
    label: '包装单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'preparationUnit',
    label: '制剂单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'convertRatio',
    label: '包装转换比',
    props: {
      type: 'number'
    }
  },
  {
    name: 'singleDoseUnit',
    label: '单次用药单位',
    comp: 'ever-select',
    props: {
      options: [
        {
          id: 1,
          name: '剂量单位'
        },
        {
          id: 2,
          name: '制剂单位'
        }
      ]
    }
  },
  {
    name: 'barCode',
    label: '条码'
  }
  // {
  //   name: 'photoUrl',
  //   label: '上传图片',
  //   comp: 'custom',
  //   span: 24
  // }
]
export default {
  mixins: [setname],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      dialogVisible: false,
      schema,
      obj,
      obj2: obj,
      beHospitalizedApi,
      packageUnitArr: [],
      packageUnitArr2: [],
      drugObj: '',
      fileArr: [],
      uploadList: [],
      rules: {
        packageUnit: [{ required: true, message: '必填项', trigger: 'change' }],
        preparationUnit: [{ required: true, message: '必填项', trigger: 'change' }],
        convertRatio: [
          { required: true, validator: validator.checkPositiveNumber, trigger: 'blur' }
        ],
        singleDoseUnit: [{ required: true, message: '必填项', trigger: 'change', type: 'number' }]
      }
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_DOSE_UNIT').then(res => {
      if (res) {
        this.packageUnitArr = res
      }
    })
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.packageUnitArr2 = res
      }
    })
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
      this.obj.singleDoseUnit = 1
      this.fileArr = []
      this.drugObj = data
      this.dialogVisible = true
      // this.$nextTick(function () {
      //   this.$refs.form.resetForm()
      // })
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
      this.obj.drugType = this.drugObj.drugType
      this.obj.oriUuid = this.drugObj.id // spuid
      this.obj.packageUnitTxt = this.setName(this.packageUnitArr, this.obj.packageUnit)
      this.obj.preparationUnitTxt = this.setName(this.packageUnitArr, this.obj.preparationUnit)
      for (let key in this.obj) {
        if (this.obj[key] === null) {
          delete this.obj[key]
        }
      }
      this.$nextTick(function () {
        this.$refs.form.submitForm()
        this.obj = this.obj2
      })
    },
    afterSave (val) {
      this.close()
      this.$emit('close:query', val, this.drugObj)
    }
  },
  watch: {
    'dialogVisible' (val) {
      if (!val) {
        this.$refs.form.resetForm()
      }
    }
  }
}
</script>
<style scoped>
.infoStyle .el-form-item { margin-bottom: 0}
.infoStyle { margin-bottom: 10px}
</style>
