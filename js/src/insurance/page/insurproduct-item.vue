<template>
  <div>
    <ever-bread-crumb name="明细规则"></ever-bread-crumb>
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
          >新增</el-button>明细信息
        </h4>

        <el-table :data="obj.details" style="width: 100%" border>
          <el-table-column prop label="序号" width="50" type="index"></el-table-column>
          <el-table-column prop label="项目类型">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.itemType"
                placeholder="请选择"
                style="width: 100%"
                @change="setItemCode(scope.row)"
              >
                <el-option
                  v-for="visit in api.itemType"
                  :key="visit.id"
                  :label="visit.name"
                  :value="visit.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop label="项目名称">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.itemCode"
                placeholder="请选择"
                style="width: 100%"
                v-if="scope.row.itemType===2"
              >
                <el-option
                  v-for="visit in insuranceOrg"
                  :key="visit.stdSrvItemCode"
                  :label="visit.stdSrvItemName"
                  :value="visit.stdSrvItemCode"
                ></el-option>
              </el-select>
              <el-select
                v-model="scope.row.itemCode"
                placeholder="请选择"
                style="width: 100%"
                v-if="scope.row.itemType===1"
              >
                <el-option
                  v-for="visit in insuranceOrgTreat"
                  :key="visit.stdSrvItemCode"
                  :label="visit.stdSrvItemName"
                  :value="visit.stdSrvItemCode"
                ></el-option>
              </el-select>
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
import itemApi from '../store/insurproductitemapi'
import insurstditemmedicalApi from '../store/insurstditemmedicalapi'
import insurstditemtreatApi from '../store/insurstditemtreatapi'
var schema = [
  {
    name: 'itemRuleCode',
    label: '规则编号'
  },
  {
    name: 'itemRuleName',
    label: '规则名称'
  },
  {
    name: 'description',
    label: '规则描述',
    type: 'textarea',
    span: 24
  }
]

var itemUnit = {
  itemType: 1,
  itemCode: '',
  operation: 0
}
export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.insuranceProductID = this.$route.params.id
    obj.details = []
    // obj.deleteIDs = []
    if (this.$route.params.itemId) {
      schema.filter(function (v, i) {
        return v.name === 'itemRuleCode'
      })[0].disabled = true
    } else {
      schema.filter(function (v, i) {
        return v.name === 'itemRuleCode'
      })[0].disabled = false
    }
    return {
      schema,
      obj: obj,
      api: itemApi,
      objId: this.$route.params.itemId,
      insuranceOrg: [],
      insuranceOrgTreat: [],
      rules: {
        // insureOrgCnName: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // insureOrgCode: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    addRow () {
      this.obj.details.push(Object.assign({}, itemUnit))
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    afterSave () {
      history.go(-1)
    },
    setItemCode (obj) {
      obj.itemCode = ''
    }
  },
  created () {
    insurstditemmedicalApi.list({ insuranceOrgID: this.$route.params.insid })
      .then(result => {
        this.insuranceOrg = result.data
      })
    insurstditemtreatApi.list({ insuranceOrgID: this.$route.params.insid })
      .then(result => {
        this.insuranceOrgTreat = result.data
      })
  }
}
</script>
