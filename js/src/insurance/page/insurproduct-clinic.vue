<template>
  <div>
    <ever-bread-crumb name="机构规则"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          labelWidth="140px"
          @objsaved="afterSave"
          label-position="right"
        ></ever-form-model>
        <h4 class="panel-hr">
          <el-button
            style="float:right"
            size="small"
            type="danger"
            @click.native.prevent="addRow()"
          >新增</el-button>单位信息
        </h4>

        <el-table :data="obj.details" style="width: 100%" border>
          <el-table-column prop label="序号" width="50" type="index"></el-table-column>
          <el-table-column prop="medicalInstitutionCode" label="医疗机构编号">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.medicalInstitutionCode"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in clinicid"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="medicalInstitutionType" label="医疗机构类型">
            <template slot-scope="scope">
              <sys-value
                type="THC_WH_CLINIC_TYPE"
                :code="clinicFn(scope.row.medicalInstitutionCode, scope.$index)"
              ></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="范围">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.operation">
                <el-radio class="radio" :label="0">包括</el-radio>
                <el-radio class="radio" :label="1">排除</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click.native.prevent="deleteRow(scope.$index, obj.details)"
              >删除</el-button>
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
import form from '../../util/form'
import clinicApi from '../store/insurproductclinicapi'
import clinicapi from '@/warehouse/store/clinicapi'
var schema = [
  {
    name: 'clinicRuleCode',
    label: '医疗机构规则编号'
  },
  {
    name: 'clinicRuleName',
    label: '医疗机构规则名称'
  },
  {
    name: 'description',
    label: '医疗机构规则描述',
    type: 'textarea',
    span: 24
  }
]

var clinicUnit = {
  medicalInstitutionCode: '',
  medicalInstitutionType: '',
  operation: 0
}
export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.insuranceProductID = this.$route.params.id
    obj.details = []
    if (this.$route.params.clinicId) {
      schema.filter(function (v, i) {
        return v.name === 'clinicRuleCode'
      })[0].disabled = true
    } else {
      schema.filter(function (v, i) {
        return v.name === 'clinicRuleCode'
      })[0].disabled = false
    }
    return {
      schema,
      obj: obj,
      api: clinicApi,
      objId: this.$route.params.clinicId,
      clinicType: [],
      clinicid: [],
      rules: {
        clinicRuleCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    clinicapi.list()
      .then(result => {
        result.forEach(function (item) {
          item.id = item.id && String(item.id)
        })
        this.clinicid = result
      })
  },
  methods: {
    clinicFn (id, index) {
      let type = ''
      this.clinicid.forEach(function (item) {
        if (item.id === id) {
          type = item.type
        }
      })
      this.obj.details[index].medicalInstitutionType = type
      return type
    },
    addRow () {
      this.obj.details.push(Object.assign({}, clinicUnit))
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    afterSave () {
      history.go(-1)
    }
  }
}
</script>
