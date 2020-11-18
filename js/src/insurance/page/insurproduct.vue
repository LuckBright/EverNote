<template>
  <div class="insurproducts insurproductadd">
    <ever-bread-crumb name="保险产品管理"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        ref="form"
        :schema="schema"
        v-model="obj"
        :rules="rules"
        :span="12"
        label-position="right"
        :api="api"
      >
        <template slot="insuranceOrgID">
          <el-col :span="12">
            <el-form-item prop="insuranceOrgID" label="所属保险公司">
              <ever-select
                v-model="obj.insuranceOrgID"
                :options="insuranceOrgIDArr"
                style="width: 100%"
              ></ever-select>
            </el-form-item>
          </el-col>
        </template>
        <template slot="insuranceFee">
          <el-col :span="12">
            <el-form-item prop="insuranceFee" label="保障总额">
              <el-input placeholder="请输入内容" v-model="obj.insuranceFee">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="clinicFee">
          <el-col :span="12">
            <el-form-item prop="clinicFee" label="门诊赔付金额">
              <el-input placeholder="请输入内容" v-model="obj.clinicFee">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="hospitalFee">
          <el-col :span="12">
            <el-form-item prop="hospitalFee" label="住院及手术赔付金额">
              <el-input placeholder="请输入内容" v-model="obj.hospitalFee">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="emergencyFee">
          <el-col :span="12">
            <el-form-item prop="emergencyFee" label="急诊赔付金额">
              <el-input placeholder="请输入内容" v-model="obj.emergencyFee">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="rate">
          <el-col :span="12">
            <el-form-item prop="rate" label="全单优惠比例">
              <el-input placeholder="请输入内容" v-model="obj.rate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="recRate">
          <el-col :span="12">
            <el-form-item prop="recRate" label="保险应收比例" class="only">
              <el-input placeholder="请输入内容" v-model="obj.recRate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <template slot="insuranceProductTypeId">
          <el-col :span="10">
            <el-form-item prop="insuranceProductTypeId" label="保险产品分类">
              <el-select
                v-model="obj.insuranceProductTypeId"
                placeholder="请选择"
                @visible-change="changeBtn"
                style="display: block"
              >
                <el-option
                  v-for="item in typeArr"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-col :span="12" :offset="6">
              <el-button type="text" @click="typeManageBtn">类型管理</el-button>
            </el-col>
          </el-col>
        </template>
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">{{obj.id?'保存':'创建'}}</el-button>
              <el-button @click="clearForm">重置</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </div>
    <el-dialog
      title="类型管理"
      :visible.sync="dialogVisible"
      size="tiny"
      v-loading="typeLoading"
      class="setText"
    >
      <el-button type="primary" @click="addTypeBtn">添加分类</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="typeName" label="类型名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.typeName" v-if="scope.row.isSave" maxlength="8"></el-input>
            <span v-else>{{scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="saveTypeBtn(scope.row)"
              v-if="scope.row.isSave"
            >保存</el-button>
            <el-button
              type="text"
              size="small"
              @click="cancelTypeBtn(scope.$index,scope.row)"
              v-if="scope.row.isSave&&scope.row.id"
            >取消</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.clinicid==0"
              @click="editTypeBtn(scope.row)"
              v-if="!scope.row.isSave"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.clinicid==0"
              @click="delTypeBtn(scope.$index,scope.row)"
              v-if="(scope.row.isSave&&!scope.row.id)||!scope.row.isSave"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/insuranceproductapi'
import insuranceorgApi from '@/insurance/store/insuranceorgapi'

var schema = [
  {
    name: 'productName',
    label: '保险产品名称'
  },
  {
    name: 'productCode',
    label: '保险产品编号'
  },
  {
    name: 'insuranceOrgID',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'insurGroupCode',
    label: '保险团体号'
  },
  {
    name: 'enterpriseName',
    label: '企业名称'
  },
  {
    name: 'insuranceFee',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'clinicFee',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'hospitalFee',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'emergencyFee',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'rate',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'recRate',
    comp: 'custom',
    noWrap: true
  },
  {
    name: 'insuranceProductTypeId',
    comp: 'custom',
    noWrap: true
  }
]

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback('必填项')
      } else if (!isNaN(Number(value))) {
        if (Number(value) >= 0 && Number(value) <= 100) {
          callback()
        } else {
          callback('范围是0-100')
        }
      } else {
        callback('请输入纯数字')
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!isNaN(Number(value))) {
        if (Number(value) >= 0 && Number(value) <= 100) {
          callback()
        } else {
          callback('范围是0-100')
        }
      } else {
        callback('请输入纯数字')
      }
    }
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj: obj,
      api: api,
      insuranceOrgIDArr: [],
      typeArr: [],
      dialogVisible: false,
      isSave: false,
      tableData: [],
      apiTableData: [],
      sourceTypeName: '',
      typeLoading: false,
      rules: {
        insuranceOrgID: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        productCode: [{ required: true, message: '必填项', trigger: 'blur' }],
        productName: [{ required: true, message: '必填项', trigger: 'blur' }],
        rate: [{ validator: validatePass1, trigger: 'blur' }],
        recRate: [{ validator: validatePass, trigger: 'blur' }],
        insuranceProductTypeId: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  methods: {
    changeBtn () {
      this.getTypeList()
    },
    async getTypeList () {
      try {
        let data = await insuranceorgApi.getProductTypeList()
        if (data && data.data) {
          this.typeArr = data.data
        }
      } catch (err) { }
    },
    async typeManageBtn () {
      this.dialogVisible = true
      this.typeLoading = true
      try {
        let data = await insuranceorgApi.getProductTypeList()
        if (data && data.data) {
          data.data.map(v => {
            v.isSave = false
          })
          this.tableData = data.data
          this.apiTableData = JSON.parse(JSON.stringify(this.tableData))
        }
        this.typeLoading = false
      } catch (err) {
        this.typeLoading = false
      }
    },
    addTypeBtn () {
      this.tableData.push({
        typeName: '',
        isSave: true
      })
    },
    editTypeBtn (row) {
      row.isSave = true
    },
    async saveTypeBtn (row) {
      if (row.typeName) {

      } else {
        this.$message.error('请输入名称')
        return
      }
      if (row.id) {
        try {
          let params = {
            typeName: row.typeName,
            id: row.id
          }
          let data = await insuranceorgApi.update(params)
          if (data && data.head.errCode === 0) {
            this.typeManageBtn()
          } else {

          }
        } catch (err) {

        }
      } else {
        try {
          let params = {
            typeName: row.typeName
          }
          let data = await insuranceorgApi.create(params)
          if (data && data.head.errCode === 0) {
            this.typeManageBtn()
            row.isSave = false
          } else {

          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    async delTypeBtn (index, row) {
      if (row.id) {
        try {
          let params = {
            id: row.id
          }
          let data = await insuranceorgApi.deleteType(params)
          if (data && data.head.errCode === 0) {
            this.typeManageBtn()
          }
        } catch (err) { }
        row.isSave = false
      } else {
        this.tableData.splice(index, 1)
      }
    },
    cancelTypeBtn (index, row) {
      if (row.id) {
        row.typeName = this.apiTableData[index].typeName
      } else {

      }
      row.isSave = false
    },
    submitForm (formName) {
      this.$refs[formName].$refs[formName].validate(async valid => {
        if (valid) {
          let data = await api.createOrUpdate(this.obj)
          if (data.head && data.head.errCode === 0) {
            this.$message({
              message: data.head.errMsg,
              type: 'success'
            })
            this.afterSave()
          } else {
            this.$message({
              message: data.head.errMsg,
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    },
    clearForm () {
      this.obj.productName = ''
      this.obj.productCode = ''
      this.obj.insuranceOrgID = ''
      this.obj.insurGroupCode = ''
      this.obj.enterpriseName = ''
      this.obj.insuranceFee = ''
      this.obj.clinicFee = ''
      this.obj.hospitalFee = ''
      this.obj.emergencyFee = ''
      this.obj.rate = ''
      this.obj.recRate = ''
      this.obj.insuranceProductTypeId = ''
    },
    afterSave () {
      this.$router.push('/manages/insurproducts')
    }
  },
  created () {
    this.getTypeList()
    var params = {
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
      this.insuranceOrgIDArr = result.data
      // this.$ever.getFieldFromSchema(this.schema, 'insuranceOrgID').options =
      //   result.data
    })
  }
}
</script>
<style lang="less">
.insurproductadd {
  .insurproducts /deep/ .el-dialog__header .el-dialog__title {
    font-size: 14px;
    color: #000;
    border-left: 0;
    padding-left: 0;
    margin: 0;
  }
  .insurproducts /deep/.setText .cell {
    text-align: center;
  }
  .el-form-item.only /deep/ input {
    background-color: #fef5be;
  }
}
</style>

