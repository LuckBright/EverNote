<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <div class="main-option">
          <el-button type="primary" @click="dialogVisible=true" size="small">新建</el-button>
        </div>
      </div>

      <el-table v-loading.body="loading" :data="tableData">
        <el-table-column show-overflow-tooltip prop="clinicName" label="医疗机构名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="inventoryDealType" label="事务处理类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="inOrdOutDirect" label="出入库方向"></el-table-column>
        <el-table-column show-overflow-tooltip prop="costCalDepend" label="成本计算依据"></el-table-column>
        <el-table-column prop label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新建事务处理类型" :visible.sync="dialogVisible" class="ui_dialog_02">
        <ever-form-model
          :schema="computeSchema"
          v-model="computeObj"
          ref="form"
          :rules="rules"
          @objsaved="afterSave"
          label-position="right"
          label-width="120px"
        ></ever-form-model>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createTransaction">
            <i class="iconfont icon-tijiao"></i>提交
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/cost.account/transaction'
import list from '@/util/list'
// import clinicApi from '@/warehouse/store/clinicapi'
import activityType from '@/warehouse/store/activitytypeapi'
import sysvalue from '@/warehouse/store/sysvalueapi'

var querySchema = [
  // {
  //   name: 'clinicId',
  //   label: '医疗机构',
  //   type: 'select',
  //   clearable: true,
  //   options: []
  // }
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
    name: 'inventoryDealType',
    label: '事务处理类型',
    clearable: true,
    type: 'select',
    options: []
  },
  {
    name: 'costCalDepend',
    label: '成本计算依据',
    clearable: true,
    type: 'select',
    needObjFlag: true,
    options: []
  }
]

export default {
  mixins: [list],
  data () {
    let rules = {
      // clinicId: [
      //   { required: true, message: '必填项', trigger: 'blur' }
      // ],
      inventoryDealType: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      costCalDepend: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    let obj = this.$ever.createObjFromSchema(querySchema)
    obj.requestSwitch = true
    let computeObj = this.$ever.createObjFromSchema(computeSchema)
    return {
      tableData: [],
      querySchema: querySchema,
      computeSchema: computeSchema,
      computeObj: computeObj,
      queryObj: obj,
      dialogVisible: false,
      inventoryDealTypeObj: null,
      rules,
      api
    }
  },
  async created () {
    const _self = this
    // let result = await clinicApi.list()
    // _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options = result
    // _self.queryObj.clinicId = _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options[0].id
    _self.queryObj.requestSwitch = !_self.queryObj.requestSwitch
    // from属性
    // _self.$ever.getFieldFromSchema(_self.computeSchema, 'clinicId').options = result
    // _self.computeObj.clinicId = _self.$ever.getFieldFromSchema(_self.computeSchema, 'clinicId').options[0].id
    // 获取成本依据值集
    const costComputeType = await sysvalue.cascade('THC_RCM_BASIS_OF_COST_COMPUTE')
    if (costComputeType && costComputeType.length) {
      costComputeType.forEach((item) => { item.name = item.label })
      _self.$ever.getFieldFromSchema(_self.computeSchema, 'costCalDepend').options = costComputeType
      _self.computeObj.costCalDepend = _self.$ever.getFieldFromSchema(_self.computeSchema, 'costCalDepend').options[0]
    }
  },
  methods: {
    handleSubmit () {
      this.dialogVisible = false
    },
    afterSave () {
      this.dialogVisible = false
    },
    // 根据机构获取事务处理类型
    async getActivityType () {
      const _self = this
      _self.$ever.getFieldFromSchema(_self.computeSchema, 'inventoryDealType').options = []
      _self.computeObj.inventoryDealType = ''
      _self.inventoryDealTypeObj = null
      let result = await activityType.list({
        // clinicId: _self.computeObj.clinicId
      })
      if (result && result.length) {
        result.forEach(item => {
          item.name = item.activityName
        })
        _self.$ever.getFieldFromSchema(_self.computeSchema, 'inventoryDealType').options = result
        _self.computeObj.inventoryDealType = _self.$ever.getFieldFromSchema(_self.computeSchema, 'inventoryDealType').options[0].id
        _self.inventoryDealTypeObj = result
      }
    },
    async createTransaction () {
      const _self = this
      const postdata = {
        data: [{
          // clinicId: _self.computeObj.clinicId,
          inventoryDealType: _self.computeObj.inventoryDealType,
          inOrdOutDirect: _self.computeObj.inOrdOutDirect,
          costCalDepend: Number(_self.computeObj.costCalDepend.value)
        }]
      }
      let result = await api.createOrUpdate(postdata)
      if (result.head.errCode === 0) {
        _self.dialogVisible = false
        _self.$notify({
          title: '提示',
          type: 'success',
          message: '提交成功！'
        })
        _self.list()
      } else {
        _self.$notify({
          title: '提示',
          type: 'fail',
          message: '提交失败！'
        })
      }
    }
  },
  watch: {
    'dialogVisible': {
      async handler (cur, old) {
        const _self = this
        if (cur) await _self.getActivityType()
      }
    },
    // 'computeObj.clinicId': {
    //   async handler (cur, old) {
    //     const _self = this
    //     if (_self.dialogVisible) await _self.getActivityType()
    //   }
    // },
    'computeObj.inventoryDealType': {
      handler (cur, old) {
        const _self = this
        if (_self.inventoryDealTypeObj && _self.inventoryDealTypeObj.length) {
          _self.inventoryDealTypeObj.forEach((item) => {
            if (item.id === cur) {
              _self.computeObj.inOrdOutDirect = item.inOutStockType
            }
          })
        }
      }
    }
  }
}
</script>
