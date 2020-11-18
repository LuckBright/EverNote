<template>
  <div>
    <ever-bread-crumb name="地区规则"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
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
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop label="国家">
            <template slot-scope="scope">
              <el-select v-model="scope.row.country" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in countryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop label="省市">
            <template slot-scope="scope">
              <ever-address v-model="scope.row.cityArr" :level="2"></ever-address>
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
import area from '../store/insurproductareaapi'
import form from '../../util/form'
import sysvalue from '@/warehouse/store/sysvalueapi'

var schema = [
  {
    name: 'areaRuleCode',
    label: '地区规则编号'
  },
  {
    name: 'areaRuleName',
    label: '地区规则名称'
  },
  {
    name: 'description',
    label: '地区规则描述',
    span: 24,
    type: 'textarea'
  }
]
var details = {
  operation: 0,
  country: '1000000000'
}
export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.insuranceProductID = this.$route.params.productid
    obj.id = this.$route.params.id
    obj.details = []
    if (this.$route.params.id) {
      schema.filter(function (v, i) {
        return v.name === 'areaRuleCode'
      })[0].disabled = true
    } else {
      schema.filter(function (v, i) {
        return v.name === 'areaRuleCode'
      })[0].disabled = false
    }
    return {
      schema,
      obj: obj,
      api: area,
      objId: this.$route.params.id,
      cityOptions: [],
      countryOptions: []
    }
  },
  created () {
    sysvalue.cascade('GBT.2659-2000').then(options => {
      this.countryOptions = options
    })
  },
  methods: {
    afterSave () {
      history.go(-1)
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
