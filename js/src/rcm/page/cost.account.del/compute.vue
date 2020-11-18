<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <el-button type="primary" @click="dialogVisible=true" size="small">计算</el-button>
        </div>
      </div>

      <el-table v-loading.body="loading" :data="tableData">
        <el-table-column show-overflow-tooltip prop="clinicName" label="医疗机构名称" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="materialName" label="物料名称" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="costPeriodName" label="成本期间" align="center"></el-table-column>
        <!--<el-table-column show-overflow-tooltip-->
        <!--prop="warehouseName"-->
        <!--label="库房名称"-->
        <!--align="center">-->
        <!--</el-table-column>-->
        <el-table-column show-overflow-tooltip prop="periodBalancePrice" label="物料成本" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.periodBalancePrice | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="详情" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="成本计算" :visible.sync="dialogVisible" class="ui_dialog_02">
        <ever-form-model
          :schema="computeSchema"
          labelPosition="right"
          labelWidth="80px"
          v-model="computeObj"
        ></ever-form-model>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compute" type="primary">
            <i class="iconfont el-icon-edit"></i>计算
          </el-button>
        </span>
      </el-dialog>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/cost.account/compute'
import common from '@/rcm/store/common'
import list from '@/util/list'
// import clinicApi from '@/warehouse/store/clinicapi'
import sysvalue from '@/warehouse/store/sysvalueapi'

const querySchema = [
  // {
  //   name: 'clinicId',
  //   label: '医疗机构',
  //   type: 'select',
  //   clearable: true,
  //   options: []
  // },
  {
    name: 'setOfBooksId',
    label: '账　　套',
    clearable: true,
    type: 'select',
    options: []
  },
  {
    name: 'year',
    label: '期间年度',
    type: 'select',
    options: []
  },
  {
    name: 'costPeriodId',
    label: '成本期间',
    clearable: true,
    type: 'select',
    options: []
  },
  {
    name: 'materialType',
    label: '物料类型',
    clearable: true,
    type: 'select',
    useValue: true,
    options: []
  },
  {
    name: 'materialCode',
    label: '物料名称',
    type: 'remote',
    placeholder: '请输入名称查询',
    options: [],
    loading: false,
    useObject: 'drugObject',
    funs: (query) => {
      console.log(query)
    }
  }
  //    {
  //      name: 'wareHouseId',
  //      label: '库房名称',
  //      type: 'select',
  //      options: []
  //    }
]

const computeSchema = [
  // {
  //   name: 'clinicId',
  //   label: '医疗机构',
  //   type: 'select',
  //   clearable: true,
  //   options: []
  // },
  {
    name: 'setOfBooksId',
    label: '账　　套',
    clearable: true,
    type: 'select',
    options: []
  },
  {
    name: 'year',
    label: '期间年度',
    type: 'select',
    options: []
  },
  {
    name: 'costPeriodId',
    label: '成本期间',
    clearable: true,
    type: 'select',
    options: []
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    let computeObj = this.$ever.createObjFromSchema(computeSchema)
    obj.requestSwitch = true
    return {
      tableData: [],
      querySchema: querySchema,
      computeSchema: computeSchema,
      queryObj: obj,
      computeObj: computeObj,
      api,
      dialogVisible: false,
      fullscreenLoading: false
    }
  },
  async created () {
    const _self = this
    _self.$ever.getFieldFromSchema(_self.querySchema, 'materialCode').funs = this.queryMaterial
    // 获取机构
    // let result = await clinicApi.list()
    // _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options = result
    // _self.queryObj.clinicId = _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options[0].id
    // // 计算属性
    // _self.$ever.getFieldFromSchema(_self.computeSchema, 'clinicId').options = result
    // _self.computeObj.clinicId = _self.$ever.getFieldFromSchema(_self.computeSchema, 'clinicId').options[0].id
    _self.clinicIdChange(_self.queryObj, _self.querySchema)
    _self.clinicIdChange(_self.computeObj, _self.computeSchema)
    // 物料类型
    const materialResult = await sysvalue.cascade('THC_WH_OBJECT_TYPE')
    if (materialResult && materialResult.length) {
      materialResult.forEach((item) => { item.name = item.label })
      _self.$ever.getFieldFromSchema(_self.querySchema, 'materialType').options = materialResult
      _self.queryObj.materialType = _self.$ever.getFieldFromSchema(_self.querySchema, 'materialType').options[0].value
    }

    //      // 获取库房
    //      const wareHouseObj = [
    //        {
    //          schema: _self.querySchema,
    //          obj: _self.queryObj
    //        }
    //      ]
    //      await _self.getWareHouse(_self.queryObj.clinicId, wareHouseObj)

    // 成本期间
    await _self.getPeriodFn(_self.queryObj, _self.querySchema)

    _self.queryObj.requestSwitch = !_self.queryObj.requestSwitch
  },
  methods: {
    async queryMaterial (query) {
      let materialType = String(this.queryObj.materialType)
      if (materialType === '295') { // 值集错误 298正确
        materialType = '298'
      }
      if (query) {
        const postdata = {
          name: query,
          materialType: materialType
        }
        const result = await api.getLocalSettingList(postdata)
        if (result && result.list && result.list.length) {
          result.list.forEach(item => {
            if (materialType === '294') {
              item.name = item.consumptiveMaterialObject.name
            } else if (materialType === '296') {
              item.name = item.drugObject.name
            } else if (materialType === '298') {
              item.name = item.equipmentObject.name
            }
            item.id = `${item.id}${this.queryObj.materialType}`
          })
          this.$ever.getFieldFromSchema(querySchema, 'materialCode').options = result.list
        }
      } else {
        this.$ever.getFieldFromSchema(querySchema, 'materialCode').options = []
      }
    },
    async getPeriodFn (obj, schema) {
      const _self = this
      // 成本期间
      const periodResult = await api.getPeriod({ clinicId: obj['clinicId'], setOfBooksId: obj['setOfBooksId'], year: obj['year'] })
      if (periodResult && periodResult.data && periodResult.data.length) {
        _self.$ever.getFieldFromSchema(schema, 'costPeriodId').options = periodResult.data
        obj['costPeriodId'] = _self.$ever.getFieldFromSchema(schema, 'costPeriodId').options[0].id
      }
    },
    async getWareHouse (clinicId, schemaObj) {
      const _self = this
      // 获取库房
      const result = await api.getStorageRoomList({ clinicId: clinicId })
      schemaObj.forEach(item => {
        item.obj['wareHouseId'] = ''
        _self.$ever.getFieldFromSchema(item.schema, 'wareHouseId').options = []
        if (result && result.list && result.list.length) {
          _self.$ever.getFieldFromSchema(item.schema, 'wareHouseId').options = result.list
          // item.obj['wareHouseId'] = _self.$ever.getFieldFromSchema(item.schema, 'wareHouseId').options[0].id
        }
      })
    },
    async clinicIdChange (obj, schema) {
      const _self = this
      obj['setOfBooksId'] = ''
      const result = await common.getSetOfBook({ clinicId: obj['clinicId'] })
      if (result) {
        result.data.forEach(function (item, index) {
          item.name = item.setOfBooksName
        })
        _self.$ever.getFieldFromSchema(schema, 'setOfBooksId').options = result.data
        if (result.data.length > 0) {
          obj['setOfBooksId'] = _self.$ever.getFieldFromSchema(schema, 'setOfBooksId').options[0].id
        }
      }
    },
    async setOfBooksIdChange (cur, old, obj, schema) {
      const _self = this
      if (cur !== old) {
        obj['year'] = ''
        const result = await common.getPeriodYear({ setOfBooksId: obj['setOfBooksId'] })
        let yearDate = []
        if (result && result.date && result.date.length) {
          result.date.forEach(function (item) {
            let yearObj = {}
            yearObj.id = item
            yearObj.name = item
            yearDate.push(yearObj)
          })
          _self.$ever.getFieldFromSchema(schema, 'year').options = yearDate
          obj['year'] = _self.$ever.getFieldFromSchema(schema, 'year').options[0].id
        }
        // 成本期间
        await _self.getPeriodFn(obj, schema)
      }
    },
    async compute () {
      if (!this.computeObj.costPeriodId) {
        this.$messageTips(this, 'error', '成本期间不能为空', '提示')
        return false
      }
      const res = await this.api.update(this.computeObj)
      this.dialogVisible = false
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '计算成功', '提示')
      }
    },
    handleSubmit () {
      this.dialogVisible = false
    },
    handleDetails (data) {
      this.$router.push(`/financial/compute/${data.id}`)
    }
  },
  watch: {
    // 'queryObj.clinicId': {
    //   async handler (cur, old) {
    //     const _self = this
    //     await _self.clinicIdChange(cur, old, _self.queryObj, _self.querySchema)
    //   }
    // },
    // 'computeObj.clinicId': {
    //   async handler (cur, old) {
    //     const _self = this
    //     await _self.clinicIdChange(cur, old, _self.computeObj, _self.computeSchema)
    //   }
    // },
    'queryObj.setOfBooksId': {
      async handler (cur, old) {
        const _self = this
        await _self.setOfBooksIdChange(cur, old, _self.queryObj, _self.querySchema)
      }
    },
    'computeObj.setOfBooksId': {
      async handler (cur, old) {
        const _self = this
        await _self.setOfBooksIdChange(cur, old, _self.computeObj, _self.computeSchema)
      }
    },
    'queryObj.year': {
      async handler (cur, old) {
        const _self = this
        if (cur !== old) {
          this.queryObj.costPeriodId = ''
          // 成本期间
          await _self.getPeriodFn(_self.queryObj, _self.querySchema)
        }
      }
    },
    'computeObj.year': {
      async handler (cur, old) {
        const _self = this
        if (cur !== old) {
          _self.computeObj.costPeriodId = ''
          // 成本期间
          await _self.getPeriodFn(_self.computeObj, _self.computeSchema)
        }
      }
    }
  }
}
</script>
