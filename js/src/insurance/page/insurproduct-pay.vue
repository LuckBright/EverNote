<template>
  <div>
    <ever-bread-crumb name="支付规则"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          ref="form"
          :rules="rules"
          labelWidth="140px"
          @objsaved="afterSave"
          label-position="right">
        </ever-form-model>
        <h4 class="panel-hr">
          <el-button style="float:right" size="small" type="danger" @click.native.prevent="addRow()">新增</el-button>
          单位信息
        </h4>
        <el-table
          :data="obj.details"
          style="width: 100%"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop=""
            label="分类方法">
            <template slot-scope="scope">
              <el-select v-model="scope.row.classType" placeholder="请选择" style="width: 100%" @change="classChange(scope.row)">
                <el-option
                  v-for="visit in api.classTypeStr"
                  :key="visit.id"
                  :label="visit.name"
                  :value="visit.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="项目分类方法">
            <template slot-scope="scope">
              <el-select v-model="scope.row.itemclassifyMethod" placeholder="请选择" style="width: 100%" v-if="scope.row.classType==1">
                <el-option
                  v-for="visit in classOptions"
                  :key="visit.value"
                  :label="visit.name"
                  :value="visit.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="明细">
            <template slot-scope="scope">
              <sys-type v-model="scope.row.itemClass" :code="scope.row.itemclassifyMethod" v-if="scope.row.classType==1"></sys-type>

              <el-select v-model="scope.row.medicalItem" placeholder="请选择" style="width: 100%" v-if="scope.row.classType==2">
                <el-option
                  v-for="visit in insuranceOrg"
                  :key="visit.id"
                  :label="visit.stdSrvItemName"
                  :value="visit.id">
                </el-option>
              </el-select>

              <el-select v-model="scope.row.treatItem" placeholder="请选择" style="width: 100%" v-if="scope.row.classType==3">
                <el-option
                  v-for="visit in insuranceOrgTreat"
                  :key="visit.id"
                  :label="visit.itemName"
                  :value="visit.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="就诊方式">
            <template slot-scope="scope">
              <el-select v-model="scope.row.visitType" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="visit in api.visitTypeStr"
                  :key="visit.id"
                  :label="visit.name"
                  :value="visit.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="payRatio"
            label="支付比例">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.payRatio"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            width="200"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click.native.prevent="deleteRow(scope.$index, obj.details)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="submitForm('form')" v-if="!objId">创建</el-button>
        <el-button type="primary" @click="submitForm('form')" v-if="objId">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/insurproductpayapi'
  import form from '../../util/form'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import insurstditemmedicalApi from '../store/insurstditemmedicalapi'
  import insurstditemtreatApi from '../store/insurstditemtreatapi'

  var schema = [
    {
      name: 'payRuleCode',
      label: '产品支付规则编号'
    },
    {
      name: 'payRuleName',
      label: '产品支付规则名称'
    },
    {
      name: 'isLimitTimes',
      label: '次数限制',
      type: 'radio',
      options: [
        {id: 1,
          name: '是'},
        {id: 0,
          name: '否'}
      ]
    },
    {
      name: 'limitTimes',
      label: '限制次数'
    },
    {
      name: 'isLimitFeeOfSingle',
      label: '单次金额限制',
      type: 'radio',
      options: [
        {id: 1,
          name: '是'},
        {id: 0,
          name: '否'}
      ]
    },
    {
      name: 'feeOfSingle',
      label: '单次金额'
    },
    {
      name: 'isLimitFeeOfSum',
      label: '总金额限制',
      type: 'radio',
      options: [
        {id: 1,
          name: '是'},
        {id: 0,
          name: '否'}
      ]
    },
    {
      name: 'feeOfSum',
      label: '总金额'
    },
    {
      name: 'isLimitFeeOfDay',
      label: '每天限额限制',
      type: 'radio',
      options: [
        {id: 1,
          name: '是'},
        {id: 0,
          name: '否'}
      ]
    },
    {
      name: 'feeOfDay',
      label: '每天限额'
    },
    {
      name: 'isLimitFeeOfMonth',
      label: '每月限额限制',
      type: 'radio',
      options: [
        {id: 1,
          name: '是'},
        {id: 0,
          name: '否'}
      ]
    },
    {
      name: 'feeOfMonth',
      label: '每月限额'
    },
    {
      name: 'deductibles',
      label: '免赔额'
    },
    {
      name: 'description',
      label: '规则描述',
      span: 24,
      type: 'textarea'
    }
  ]
  var details = {
    itemclassifyMethod: 'THC_RCM_CLASS_MED_CLASS',
    itemClass: '',
    visitType: '',
    classType: 1,
    treatItem: '',
    medicalItem: ''
    // operation: 0,
  }
  export default {
    mixins: [form],
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      obj.insuranceProductID = this.$route.params.productid
      obj.id = this.$route.params.id
      obj.details = []
      obj.deleteIDs = []
      if (this.$route.params.id) {
        schema.filter(function (v, i) {
          return v.name === 'payRuleCode'
        })[0].disabled = true
      } else {
        schema.filter(function (v, i) {
          return v.name === 'payRuleCode'
        })[0].disabled = false
      }
      return {
        schema,
        obj: obj,
        api,
        objId: this.$route.params.id,
        disabled: false,
        classOptions: [],
        insuranceOrg: [],
        insuranceOrgTreat: [],
        rules: {
          isLimitTimes: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ],
          isLimitFeeOfSingle: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ],
          isLimitFeeOfSum: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ],
          isLimitFeeOfDay: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ],
          isLimitFeeOfMonth: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ]
        }
      }
    },
    created () {
      sysvalue.listOnce('THC_RCM_ClASS').then(options => {
        this.classOptions = options
      })
      insurstditemmedicalApi.list({insuranceOrgID: this.$route.params.insid})
        .then(result => {
          this.insuranceOrg = result.data
        })
      insurstditemtreatApi.list({insuranceOrgID: this.$route.params.insid})
        .then(result => {
          this.insuranceOrgTreat = result.data
        })
    },
    methods: {
      getDetail () {
        this.api.getById(this.objId).then(result => {
          if (result && result.id) {
            result.details.forEach(function (item) {
              item.itemClass = item.itemClass && String(item.itemClass)
            })
            Object.assign(this.obj, result)
          }
        })
      },
      afterSave () {
        history.go(-1)
      },
      classChange (obj) {
        obj.itemclassifyMethod = 'THC_RCM_CLASS_MED_CLASS'
        obj.itemClass = ''
        obj.treatItem = ''
        obj.medicalItem = ''
      },
      addRow () {
        this.obj.details.push(Object.assign({}, details))
      },
      deleteRow (index, rows) {
        rows.splice(index, 1)
      }
    }
  }
</script>
