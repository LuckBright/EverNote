
<template>
  <div>
    <ever-bread-crumb name="期间定义" path="/financeistall/periodsetups"></ever-bread-crumb>
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
            type="primary"
            @click.native.prevent="addRow()"
          >新增</el-button>期间明细
        </h4>
        <el-table :data="obj.details" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="left"></el-table-column>
          <el-table-column prop label="名称" align="left">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="请填写名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop label="年" align="left">
            <template slot-scope="scope">
              <date-picker
                v-model="scope.row.year"
                :autoWidth="true"
                :outformat="'yyyy'"
                :type="'year'"
              ></date-picker>
            </template>
          </el-table-column>
          <el-table-column prop label="季度" align="left">
            <template slot-scope="scope">
              <el-select v-model="scope.row.season" placeholder="请选择季度" style="width: 100%">
                <el-option
                  v-for="item in seasonArr"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop label="开始日期" align="left">
            <template slot-scope="scope">
              <date-picker
                v-model="scope.row.startTime"
                :autoWidth="true"
                :outformat="'yyyy-MM-dd'"
              ></date-picker>
            </template>
          </el-table-column>
          <el-table-column prop label="结束日期" align="left">
            <template slot-scope="scope">
              <date-picker v-model="scope.row.endTime" :autoWidth="true" :outformat="'yyyy-MM-dd'"></date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="isAdjust" label="是否调整" align="left">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isAdjust"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="200" align="left">
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
        <el-button size="small" type="primary" @click="submitForm('form')" v-if="!objId">创建</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')" v-if="objId">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import area from '../store/periodsetupapi'
import form from '../../util/form'

var schema = [
  {
    name: 'periodName',
    label: '期间名称',
    type: 'text',
    max: 40
  },
  {
    name: 'periodNum',
    label: '期间个数',
    type: 'text',
    max: 11
  },
  {
    name: 'description',
    label: '期间说明',
    span: 24,
    type: 'textarea'
  }
]
var details = {
  name: '',
  year: '',
  season: '',
  startTime: '',
  endTime: '',
  isAdjust: false
}
export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.details = []
    obj.periodNum = '0'
    return {
      schema,
      obj: obj,
      api: area,
      objId: this.$route.params.id,
      seasonArr: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ]
    }
  },
  created () {
  },
  methods: {
    afterSave (params) {
      history.go(-1)
    },
    addRow () {
      this.obj.details.push(Object.assign({}, details))
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    }
  },
  watch: {
    'obj.details': {
      handler (newValue) {
        this.obj.periodNum = this.obj.details.length + ''
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.panel-body {
  padding-top: 5px;
}
.panel-body h4 {
  margin-block-start: 0;
}
</style>
