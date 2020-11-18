
<template>
  <div>
    <ever-bread-crumb name="类别规则"></ever-bread-crumb>
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
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop label="项目分类方法">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.itemclassifyMethod"
                placeholder="请选择"
                style="width: 100%"
                @change="changeDetails(scope.row)"
              >
                <el-option
                  v-for="visit in classOptions"
                  :key="visit.value"
                  :label="visit.name"
                  :value="visit.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop label="明细">
            <template slot-scope="scope">
              <sys-type v-model="scope.row.itemClass" :code="scope.row.itemclassifyMethod"></sys-type>
            </template>
          </el-table-column>
          <el-table-column prop="operation" width="150" label="范围">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.operation">
                <el-radio class="radio" :label="0">包括</el-radio>
                <el-radio class="radio" :label="1">排除</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="80" align="center">
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
import api from '../store/insurproductclassapi'
import form from '../../util/form'
import sysvalue from '@/warehouse/store/sysvalueapi'

var schema = [
  {
    name: 'classRuleCode',
    label: '项目分类规则编号'
  },
  {
    name: 'classRuleName',
    label: '项目分类规则名称'
  },
  {
    name: 'description',
    label: '项目分类规则描述',
    span: 24,
    type: 'textarea'
  }
]
var details = {
  value: 1,
  itemclassifyMethod: '',
  itemClass: '',
  operation: 0,
  itemClassArr: []
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
        return v.name === 'classRuleCode'
      })[0].disabled = true
    } else {
      schema.filter(function (v, i) {
        return v.name === 'classRuleCode'
      })[0].disabled = false
    }
    return {
      schema,
      obj: obj,
      api,
      objId: this.$route.params.id,
      classOptions: []
    }
  },
  created () {
    sysvalue.listOnce('THC_RCM_ClASS')
      .then(options => {
        this.classOptions = options
      })
  },
  methods: {
    afterSave () {
      history.go(-1)
    },
    changeDetails (obj) {
      obj.itemClass = ''
    },
    addRow () {
      this.obj.details.push(Object.assign({}, details))
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    }
  },
  watch: {
    obj: {
      handler (cur, old) {
      },
      deep: true
    }
  }
}
</script>
