<template>
  <div>
    <ever-bread-crumb name="账套定义" path="/financeistall/subledgers"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          ref="form"
          :rules="rules"
          labelWidth="80px"
          @objsaved="afterSave"
          label-position="right"
        ></ever-form-model>
        <h4 class="panel-hr">
          <el-button
            style="float:right"
            size="small"
            type="primary"
            @click.native.prevent="addRow()"
          >新增</el-button>账套明细
        </h4>
        <el-table :data="obj.details" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="code" label="段代码" align="center">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.code" disabled placeholder="请填写段代码"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="段名" align="center"></el-table-column>
          <el-table-column prop="accountSheetId" label="值列表名称" align="center">
            <template slot-scope="scope">
              <el-select
                size="small"
                v-model="scope.row.accountSheetId"
                :disabled="scope.row.code=='ACCOUNT' && obj.id>0"
                placeholder="请选择输入项"
                style="width: 100%"
                @change="changeHandler(scope.row, scope.$index)"
              >
                <el-option
                  v-for="visit in availableArr(scope.row)"
                  :key="visit.id"
                  :label="visit.code"
                  :value="visit.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click.native.prevent="deleteRow(scope.$index, obj.details)"
                :disabled="scope.row.code=='ACCOUNT'"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-footer">
        <el-button size="small" type="primary" @click="submitForm('form')" v-if="!objId">创建</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')" v-if="objId">保存</el-button>
        <el-button size="small" type="primary" @click="linktomapping" v-if="objId">账套科目表</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/subledgerapi'
import form from '../../util/form'
import periodsetupapi from '../store/periodsetupapi'
// import clinicApi from '@/warehouse/store/clinicapi'
import coaaccountapi from '../store/coaaccountapi'
var schema = [
  {
    name: 'setOfBooksName',
    label: '账套名称',
    type: 'text',
    min: 1,
    max: 40
  },
  {
    name: 'description',
    label: '账套说明'
  },
  {
    name: 'accountperiodId',
    label: '期间名称',
    type: 'select',
    options: []
  },
  {
    name: 'currency',
    label: '币种',
    type: 'systype',
    code: 'ISO.4217',
    useValue: true
  }
  // {
  //   name: 'clinicid',
  //   label: '机构名称',
  //   type: 'select',
  //   options: []
  // }
  // {
  //   name: 'isHostSetOfBook',
  //   label: '是否主账套',
  //   type: 'radio',
  //   disabled: true,
  //   options: [{id: false, name: '否'}, {id: true, name: '是'}]
  // }
]
var details = {
  code: '',
  name: '',
  accountSheetId: '',
  valueListNmae: ''
}
export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.id = this.$route.params.id
    obj.hostSetOfBook = true
    obj.details = [
      {
        code: 'ACCOUNT',
        name: '会计科目',
        accountSheetId: '',
        valueListNmae: ''
      }
    ]
    let arr = ['setOfBooksName', 'accountperiodId', 'currency']
    if (this.$route.params.id) {
      arr.forEach(function (item) {
        schema.filter(function (v, i) {
          return v.name === item
        })[0].disabled = true
      })
    } else {
      arr.forEach(function (item) {
        schema.filter(function (v, i) {
          return v.name === item
        })[0].disabled = false
      })
    }
    return {
      schema,
      obj: obj,
      api: api,
      objId: this.$route.params.id,
      valueArr: [],
      setofbookArr: [],
      rules: {
        setOfBooksName: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        accountperiodId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
        // clinicid: [
        //   { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        // ]
      }
    }
  },
  created () {
    periodsetupapi.list()
      .then(result => {
        result.data.forEach(function (item) {
          item.name = item.periodName
        })
        this.$ever.getFieldFromSchema(this.schema, 'accountperiodId').options = result.data
      })
    // clinicApi.list()
    //   .then(result => {
    //     this.$ever.getFieldFromSchema(this.schema, 'clinicid').options = result
    //   })
    coaaccountapi.list({})
      .then(result => {
        this.valueArr = result.data
      })
    api.getDimensionList().then(result => {
      let newarr = result.data.slice(0, result.data.length - 1)
      newarr.forEach(v => {
        this.setofbookArr.push({
          code: v.dimesionName,
          id: v.id,
          showCode: v.dimesionCode,
          name: v.dimesionName
        })
      })
    })
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    availableArr (row) {
      let arr = []
      if (row.code === 'ACCOUNT') {
        arr = this.valueArr
      } else {
        arr = this.setofbookArr
      }
      return arr
    },
    changeHandler (obj, index) {
      console.log(obj)
      let valArr = []
      valArr = obj.code === 'ACCOUNT' ? this.valueArr : this.setofbookArr
      console.log(valArr)
      valArr.forEach(function (item) {
        if (obj.accountSheetId === item.id) {
          obj.name = item.name
          obj.valueListNmae = item.showCode
          if (obj.code === 'ACCOUNT') {

          } else {
            // obj.code = item.showCode
          }
        }
      })
    },
    linktomapping () {
      this.$router.push('/financeistall/subledgermapping/' + this.objId + '/' + this.obj.details[0].accountSheetId)
    },
    afterSave () {
      history.go(-1)
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    addRow () {
      this.obj.details.push(Object.assign({}, details))
      this.obj.details.forEach(function (item, index) {
        if (index > 0) {
          item.code = 'calcu' + index
        }
      })
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
