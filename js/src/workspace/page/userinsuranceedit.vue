<template>
  <div id="insuranceinfo">
    <div v-show="this.$ever.getClinicConfig().showMedicalInsurce === '1'">
      <el-row class="title">
        <el-col>
          <span class="name">社保信息</span>
        </el-col>
      </el-row>
      <el-row>
        <el-form :inline="true" :model="obj" class="demo-form-inline">
          <el-form-item label="社会保障卡号码">
            <el-input v-model="obj.socialIdNo" placeholder="输入社会保障卡号码"></el-input>
          </el-form-item>
          <el-form-item label="社保卡号">
            <el-input v-model="obj.socialSecurityNo" placeholder="输入社保卡号"></el-input>
          </el-form-item>
          <el-form-item label="医保应用号">
            <el-input v-model="obj.medicalNo" placeholder="输入医保应用号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSocialInsurFrm">保存</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <hr>
    </div>

    <el-row class="title">
      <el-col>
        <span class="name">商保信息</span>
        <a href="javascript:;" class="addMore-btn" @click="showInsuranceForm()">添加商保信息</a>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="tableData" border>
        <el-table-column prop="insurerName" align="center" label="保险公司名称"></el-table-column>
        <el-table-column prop="productName" align="center" label="产品名称"></el-table-column>
        <el-table-column prop="typeName" align="center" label="保险类型"></el-table-column>
        <el-table-column prop="insurCompany" align="center" label="投保企业"></el-table-column>
        <el-table-column prop="policyNum" align="center" label="保单编号"></el-table-column>
        <el-table-column prop="origNum" align="center" label="保险团体号"></el-table-column>
        <el-table-column prop="validity" align="center" label="有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime | formatDateByExp('YYYY-MM-DD')}} - {{ scope.row.endTime | formatDateByExp('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="welfare" align="center" show-overflow-tooltip label="患者福利"></el-table-column>
        <el-table-column prop="interiorContent" align="center" show-overflow-tooltip label="内部备注"></el-table-column>
        <el-table-column label="证件" show-overflow-tooltip prop align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.image">
              <a :href="$ever.fileUrl2 + scope.row.image" target="_blank">保险卡</a>
            </p>
            <p v-if="scope.row.copyFile">
              <a :href="$ever.fileUrl2 + scope.row.copyFile" target="_blank">保险卡复印件</a>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="商保信息"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
        class="ui_dialog_02"
      >
        <ever-form2
          :schema="schema2"
          v-model="obj2"
          :api="api"
          :rules="rules2"
          ref="insuranceForm"
          label-position="right"
          :info="true"
        >
          <div slot="default"></div>
          <template slot="availableDate">
            <el-date-picker
              style="width: 100%"
              v-model="obj2.date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </template>
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
        </ever-form2>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">
            <i class="iconfont icon-quxiao"></i>取消
          </el-button>
          <el-button type="primary" @click="selectInsur()">
            <i class="iconfont icon-tijiao"></i>保存
          </el-button>
        </div>
      </el-dialog>
  </el-row>
  </div>
</template>
<script>
import api from '../store/userinsuranceapi'
import insuranceorgApi from '@/insurance/store/insuranceorgapi'
import insuranceproductApi from '@/insurance/store/insuranceproductapi'
import { dateFormat } from '@/util/common'

var schema2 = [
  {
    name: 'insurerObj',
    comp: 'ever-select',
    label: '保险公司名称',
    needObjFlag: true,
    props: {
      options: []
    },
  },
  {
    name: 'productObj',
    span: 24,
    comp: 'ever-select',
    label: '产品名称',
    needObjFlag: true,
    props: {
      options: []
    },
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
    comp: 'custom',
    label: '有效期'
  },
  {
    name: 'welfare',
    label: '患者福利',
    comp: 'textarea',
    span: 24,
    props: {
      maxlength: 500,
      showWordLimit: true,
      autosize: { minRows: 3, maxRows: 4 },
      placeholder: '请输入患者福利'
    },
  },
  {
    name: 'interiorContent',
    label: '保险专员备注',
    comp: 'textarea',
    span: 24,
    props: {
      maxlength: 200,
      showWordLimit: true,
      autosize: { minRows: 3, maxRows: 4 },
      placeholder: '请输入保险专员备注'
    },
  },
  {
    name: 'uploadImgs',
    label: '上传图片',
    span: 24,
    comp: 'custom'
  }
]

export default {
  data () {
    var obj2 = this.$ever.createObjFromSchema(schema2)
    obj2.date = []
    // obj2.copyFile = ''
    // obj2.image = ''
    obj2.productName = ''
    obj2.type = ''

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
      if (this.obj2.date.length < 2) {
        return callback(new Error('请输入有效期'))
      }
      callback()
    }
    return {
      obj: {
        socialIdNo: '',
        socialSecurityNo: '',
        medicalNo: ''
      },
      schema2,
      obj2,
      patientId: this.$route.params.patientId ? this.$route.params.patientId : '',
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
      noWatch: true,
      tempProduct: [],
      tempInsurerObj: [],
      imageArr1: []
    }
  },
  methods: {
    selectInsur () {
      this.$refs.insuranceForm.$refs.form.validate(valid => {
        if (valid) {
          this.submitCustomerInsurFrm()
        }
      })
    },
    deleteRow (index, rows) {
      this.$confirm('确定要删除该保险产品吗?').then(() => {
        if (rows[index].id) {
          api.delBusinessInsur({
            id: rows[index].id
          }).then(result => {
            if (result.head.errCode === 0) {
              this.$notify({
                title: '成功',
                message: '商保信息删除成功',
                type: 'success'
              })
              this.$bus.$emit('updateInsurance', true)
              this.$router.push({ path: '/crm/memberinfo/userinfo/userinsuranceinfo/' + this.patientId })
            }
          })
        }
      }).catch(_ => {
      })
    },
    submitSocialInsurFrm () {
      Object.assign(this.obj, {
        patientId: this.patientId
      })
      api.createOrModifySocialInsur(this.obj).then(result => {
        if (result.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '社保信息保存成功',
            type: 'success'
          })
        }
      })
    },
    submitCustomerInsurFrm () {
      this.obj2.patientId = this.patientId
      this.obj2.productId = this.obj2.productObj
      this.obj2.insurerId = this.obj2.insurerObj
      this.obj2.startTime = dateFormat(this.obj2.date[0])
      this.obj2.endTime = dateFormat(this.obj2.date[1])
      this.obj2.typeName = this.obj2.type === '7bc980498bb14aca86536daee85cef0a' ? '商保' : '商补'
      delete this.obj2.date
      api.createOrmodify(this.obj2).then(result => {
        if (result.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '商保信息保存成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.noWatch = false
          this.$refs.insuranceForm.$refs.form.resetFields()
          this.$bus.$emit('updateInsurance', true)
          this.$router.push({ path: '/crm/memberinfo/userinfo/userinsuranceinfo/' + this.patientId })
        }
      })
    },
    cancel () {
      this.$router.push({ path: '/crm/memberinfo/userinfo/userinsuranceinfo/' + this.patientId })
    },
    getByIdInfo () {
      api.getSocialInsur({
        patientId: this.patientId
      }).then(result => {
        Object.assign(this.obj, result.data)
      })

      api.getBusinessInsur({
        patientId: this.patientId
      }).then(result => {
        this.tableData = result.data
      })
    },
    showInsuranceForm () {
      this.noWatch = true
      this.dialogFormVisible = true
    },
    handleClose () {
      this.noWatch = false
      this.dialogFormVisible = false
      this.$refs.insuranceForm.$refs.form.resetFields()
    },
    edit (val) {
      this.noWatch = true
      this.dialogFormVisible = true
      this.getInfo(val.id)
    },
    getInfo (id) {
      api.getInfo({ 'id': id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj2.insurerObj = rs.data.insurerId
          Object.assign(this.obj2, rs.data)
          let tempDate = [this.$moment(rs.data.startTime).format('YYYY-MM-DD'), this.$moment(rs.data.endTime).format('YYYY-MM-DD')]
          this.obj2.date = [...tempDate]
          this.obj2.productObj = rs.data.productId
        }
      })
    }
  },
  created () {
    this.getByIdInfo()
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
      this.$ever.getFieldFromSchema(this.schema2, 'insurerObj').props.options = result.data
      this.tempInsurerObj = result.data
    })
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    'obj2.insurerObj': {
      handler: function (val) {
        if (this.noWatch) {
          this.$ever.getFieldFromSchema(this.schema2, 'productObj').props.options = []
          val && insuranceproductApi.listByOrgId(val).then(result => {
            for (var product of result.data) {
              product.name = product.productName
            }
            this.$ever.getFieldFromSchema(this.schema2, 'productObj').props.options = result.data
            this.tempProduct = result.data
          })
          this.tempInsurerObj.map(item => {
            if (item.id === val) {
              this.obj2.insurerName = item.name
            }
          })
        }
      }
    },
    'obj2.productObj': {
      handler: function (val) {
        this.tempProduct.map(item => {
          if (item.id === val) {
            this.obj2.productName = item.name
            this.obj2.typeName = item.typeName
            this.obj2.type = item.insuranceProductTypeId
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
}
#insuranceinfo {
  padding-bottom: 20px;
}
#insuranceinfo .title {
  margin-bottom: 5px;
}
#insuranceinfo .title .el-col {
  padding: 0 10px;
}
#insuranceinfo .title span.name {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  border-left: 2px solid #1c7bef;
  padding-left: 10px;
}
#insuranceinfo .title .el-button {
  padding: 0;
}
#insuranceinfo .table {
  line-height: 36px;
  font-size: 14px;
  color: #151515;
  margin-bottom: 20px;
}
#insuranceinfo .table .th {
  padding-left: 20px;
}
#insuranceinfo .table .th span {
  color: #999999;
}
#insuranceinfo .tablelist {
  margin-top: 16px;
}
#insuranceinfo .tablelist th,
#insuranceinfo .tablelist td {
  height: 50px;
  line-height: 50px;
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
.insuranceinfo /deep/ .el-dialog__wrapper {
  z-index: 3000 !important;
}
</style>
