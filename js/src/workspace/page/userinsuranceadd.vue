<template>
  <div class="main-war">
    <div v-show="this.$ever.getClinicConfig().showMedicalInsurce === '1'">
      <h4 class="title-h">社保信息</h4>
      <div class="l4">
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          label-position="right"
        ></ever-form-model>
      </div>
      <hr>
    </div>

    <h4 class="title-h" style="position:relative;" v-if="!isAppoint">
      商保信息
      <a href="javascript:;" class="addMore-btn" @click="showInsuranceForm()">添加商保信息</a>
    </h4>
    <div class="l5" v-if="!isAppoint">
      <el-table :data="tableData" border>
        <el-table-column prop="insurerName" align="center" label="保险公司名称"></el-table-column>
        <el-table-column prop="productName" align="center" label="产品名称"></el-table-column>
        <el-table-column prop="insurCompany" align="center" label="投保企业"></el-table-column>
        <el-table-column prop="policyNum" align="center" label="保单编号"></el-table-column>
        <el-table-column prop="origNum" align="center" label="保险团体号"></el-table-column>
        <el-table-column prop="validity" align="center" label="有效期">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.startTime).format('YYYY-MM-DD')}} - {{$moment(scope.row.endTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="welfare" align="center" show-overflow-tooltip label="患者福利"></el-table-column>
        <el-table-column prop="remarks" align="center" show-overflow-tooltip label="内部备注"></el-table-column>
        <el-table-column prop width="150" align="center">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="deleteRow(scope.$index, tableData)"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="商保信息"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
        class="ui_dialog_02"
      >
        <ever-form-model
          :schema="schema2"
          v-model="obj2"
          :api="api"
          :rules="rules2"
          ref="insuranceForm"
          label-position="right"
        >
          <template slot="uploadImgs">
            <div class="c">
              <p>保险卡图片</p>
              <ever-upload1 v-model="obj2.image" :limit="1" :tipsFlag="true" :appendToBody="true"></ever-upload1>
            </div>
            <div class="c">
              <p>保险卡复印件</p>
              <ever-upload1 v-model="obj2.copyFile" :limit="1" :tipsFlag="true" :appendToBody="true"></ever-upload1>
            </div>
          </template>
        </ever-form-model>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="selectInsur()">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '../store/userinsuranceapi'
import insuranceorgApi from '@/insurance/store/insuranceorgapi'
import insuranceproductApi from '@/insurance/store/insuranceproductapi'
import moment from 'moment'

var schema = [
  {
    name: 'socialIdNo',
    span: 7,
    label: '社会保障卡号码'
  },
  {
    name: 'socialSecurityNo',
    span: 7,
    label: '社保卡号'
  },
  {
    name: 'medicalNo',
    span: 7,
    label: '医保应用号'
  }
]

var schema2 = [
  {
    name: 'insurerObj',
    type: 'select',
    label: '保险公司名称',
    needObjFlag: true,
    options: []
  },
  {
    name: 'productObj',
    span: 24,
    type: 'select',
    label: '产品名称',
    needObjFlag: true,
    options: []
  },
  {
    name: 'policyNum',
    span: 24,
    label: '保单编号'
  },
  {
    name: 'insurCompany',
    span: 24,
    label: '投保企业'
  },
  {
    name: 'origNum',
    span: 24,
    label: '保险团体号'
  },
  {
    name: 'availableDate',
    span: 24,
    type: 'daterange',
    label: '有效期'
  },
  {
    name: 'welfare',
    type: 'textarea',
    span: 24,
    max: 200,
    label: '患者福利'
  },
  {
    name: 'interiorContent',
    type: 'textarea',
    span: 24,
    max: 200,
    label: '保险专员备注'
  },
  {
    name: 'uploadImgs',
    label: '上传图片',
    span: 24,
    type: 'custom'
  }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var obj2 = this.$ever.createObjFromSchema(schema2)
    obj2.availableDate = ''

    var checkInsure = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入保险公司名称'))
      }
      callback()
    }
    var checkProduct = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入产品名称'))
      }
      callback()
    }
    var checkDate = (rule, value, callback) => {
      if (value.length < 2) {
        return callback(new Error('请输入有效期'))
      }
      callback()
    }
    return {
      isAppoint: true,
      schema,
      obj,
      schema2,
      obj2,
      objId: this.$route.params.id > -1 ? this.$route.params.id : null,
      api: api,
      tableData: [],
      rules: {

      },
      rules2: {
        insurerObj: [
          { required: true, validator: checkInsure, trigger: 'change' }
        ],
        policyNum: [
          { max: 40, message: '最多40个汉字', trigger: 'blur' }
        ],
        insurCompany: [
          { max: 40, message: '最多40个汉字', trigger: 'blur' }
        ],
        origNum: [
          { max: 40, message: '最多40个汉字', trigger: 'blur' }
        ],
        productObj: [
          { required: true, validator: checkProduct, trigger: 'change' }
        ],
        availableDate: [
          { required: true, validator: checkDate, trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      value1: '',
      value2: '',
      insuranceType: 1,
      noWatch: true
    }
  },
  methods: {
    selectInsur: function () {
      this.$refs.insuranceForm.$refs.form.validate(valid => {
        if (valid) {
          var insur = Object.assign({}, this.obj2)
          insur.insurerId = insur.insurerObj.id
          insur.insurerName = insur.insurerObj.insuranceOrgCnName
          insur.productId = insur.productObj.id
          insur.productName = insur.productObj.productName
          insur.startTime = moment(insur.availableDate[0]).format('YYYY-MM-DD HH:MM:SS')
          insur.endTime = moment(insur.availableDate[1]).format('YYYY-MM-DD HH:MM:SS')
          insur.type = insur.productObj.insuranceProductTypeId
          delete insur.productObj
          delete insur.insurerObj
          this.tableData.push(insur)
          this.dialogFormVisible = false
          this.noWatch = false
          this.$refs.insuranceForm.$refs.form.resetFields()
        }
      })
    },
    deleteRow (index, rows) {
      this.$confirm('确定要删除该保险产品吗?').then(() => {
        if (rows[index].id) {
          api.delBusinessInsur({
            id: rows[index].id
          }).then(result => {
            rows.splice(index, 1)
          })
        } else {
          rows.splice(index, 1)
        }
      }).catch((e) => {

      })
    },
    showInsuranceForm () {
      this.noWatch = true
      this.dialogFormVisible = true
    },
    handleClose () {
      this.dialogFormVisible = false
      this.noWatch = false
      this.$refs.insuranceForm.$refs.form.resetFields()
    }
  },
  created () {
    if (this.$route.path.indexOf('/crm/register') > -1) {
      this.isAppoint = true
    } else if (this.$route.path.indexOf('/crm/memberadd') > -1) {
      this.isAppoint = false
    }
    let params = {
      corpType: '',
      insuranceOrgCnName: '',
      insureOrgShortName: '',
      offset: 0,
      pagesize: 200
    }
    insuranceorgApi.list(params).then(result => {
      for (var insur of result.data) {
        insur.name = insur.insuranceOrgCnName
      }
      this.$ever.getFieldFromSchema(this.schema2, 'insurerObj').options = result.data
    })
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    'obj2.insurerObj': {
      handler: function (val, oldVal) {
        if (this.noWatch) {
          this.$ever.getFieldFromSchema(this.schema2, 'productObj').options = []
          this.obj2.productObj = ''
          insuranceproductApi.listByOrgId(val.id).then(result => {
            for (var product of result.data) {
              product.name = product.productName
            }
            this.$ever.getFieldFromSchema(this.schema2, 'productObj').options = result.data
          })
        }
      }
    },
    'obj': {
      handler: function (val) {
        this.$emit('formChange4', val)
      },
      deep: true
    },
    'tableData': {
      handler: function (val) {
        this.$emit('formChange5', val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.main-war h2.main-title span {
  margin: 0 0 10px 0;
  border-bottom: 2px solid #1c7bef;
  background: #fff;
  color: #000;
  display: inline-block;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  padding: 0 20px;
}
.addMore-btn {
  font-size: 14px;
  color: #409eff;
  line-height: 14px;
  padding: 5px 10px;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 2px;
  text-decoration: none;
  position: absolute;
  right: 30px;
  font-weight: normal;
}
.c {
  float: left;
  text-align: center;
  margin-right: 10px;
}
.c p {
  margin: 0;
}
</style>

