<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
        <div class="main-option">
          <el-button @click="dialogVisible=true" id="btn_2" size="small">新增</el-button>
          <el-button type="primary" @click.native.prevent="updatePeriod()" v-loading.fullscreen.lock="fullscreenLoading" size="small">保存</el-button>
        </div>
      </div>

      <el-table
        v-loading.body="loading"
        :data="tableData"
        >
        <el-table-column show-overflow-tooltip
                         prop="materialId"
                         label="物料编码"
                         align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="materialName"
                         label="物料名称"
                         align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="costPeriodName"
                         label="成本期间"
                         align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="costUnit"
                         label="成本单位"
                         align="center">
        </el-table-column>
        <!--<el-table-column show-overflow-tooltip-->
        <!--prop="warehouseName"-->
        <!--label="库房名称"-->
        <!--align="center">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="costUpdateType"
          label="成本更新类型"
          align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.costUpdateType" size="small" placeholder="请选择" >
              <el-option
                v-for="item in costUpdateTypeOpt"
                :key="Number(item.code)"
                :label="item.name"
                :value="Number(item.code)">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="periodBalancePrice"
                         label="物料成本"
                         align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.periodBalancePrice" size="small" placeholder="物料成本"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="新增"
        :visible.sync="dialogVisible"
        class="ui_dialog_02"
      >
        <ever-form-model
          :schema="updateSchema"
          v-model="computeObj"
          ref="form"
          :rules="rules"
          @objsaved="afterSave" label-position="right" label-width="120px">
        </ever-form-model>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createCost"><i class="iconfont icon-tijiao"></i>提交</el-button>
        </div>
      </el-dialog>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
  import api from '@/rcm/store/cost.account/update'
  import common from '@/rcm/store/common'
  import list from '@/util/list'
  // import clinicApi from '@/warehouse/store/clinicapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import { Notification } from 'element-ui'

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
      options: [],
      loading: false,
      placeholder: '请输入名称查询',
      useObject: 'drugObject',
      funs: (query) => {
        console.log(query)
      }
    }
//    ,
//    {
//      name: 'wareHouseId',
//      label: '库房名称',
//      type: 'select',
//      options: []
//    }
  ]

  const updateSchema = [
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
      needObjFlag: true,
      options: []
    },
    {
      name: 'materialCode',
      label: '物料名称',
      type: 'remote',
      options: [],
      placeholder: '请输入名称查询',
      loading: false,
      useObject: 'drugObject',
      funs: (query) => {
        console.log(query)
      }
    },
//    {
//      name: 'wareHouseId',
//      label: '库房名称',
//      clearable: true,
//      type: 'select',
//      options: []
//    },
    {
      name: 'costUpdateType',
      label: '成本更新类型',
      clearable: true,
      type: 'select',
      needObjFlag: true,
      options: []
    },
    {
      name: 'periodBalancePrice',
      label: '物料成本',
      type: 'text'
    }
  ]
  export default {
    mixins: [list],
    data () {
      let rules = {
        // clinicId: [
        //   {required: true, message: '必填项', trigger: 'blur', type: 'number'}
        // ],
        materialCode: [
          {required: true, message: '必填项', trigger: 'blur', type: 'number'}
        ],
        costPeriodId: [
          {required: true, message: '必填项', trigger: 'blur', type: 'number'}
        ],
//        wareHouseId: [
//          {required: true, message: '必填项', trigger: 'blur'}
//        ],
        costUpdateType: [
          {required: true, message: '必填项', trigger: 'blur', type: 'object'}
        ],
        periodBalancePrice: [
          {required: true, message: '必填项', trigger: 'blur'}
        ]
      }
      let obj = this.$ever.createObjFromSchema(querySchema)
      let computeObj = this.$ever.createObjFromSchema(updateSchema)
      obj.requestSwitch = true
      return {
        tableData: [],
        querySchema: querySchema,
        updateSchema: updateSchema,
        queryObj: obj,
        computeObj: computeObj,
        api,
        rules,
        dialogVisible: false,
        fullscreenLoading: false,
        costUpdateTypeOpt: []
      }
    },
    async created () {
      const _self = this
      _self.$ever.getFieldFromSchema(_self.querySchema, 'materialCode').funs = _self.queryMaterial
      _self.$ever.getFieldFromSchema(_self.updateSchema, 'materialCode').funs = _self.createMaterial

      _self.clinicIdChange(_self.queryObj, _self.querySchema)
      _self.clinicIdChange(_self.computeObj, _self.updateSchema)
      // 获取机构
      // let result = await clinicApi.list()
      // _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options = result
      // _self.queryObj.clinicId = _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options[0].id
      // 计算属性
      // _self.$ever.getFieldFromSchema(_self.updateSchema, 'clinicId').options = result
      // _self.computeObj.clinicId = _self.$ever.getFieldFromSchema(_self.updateSchema, 'clinicId').options[0].id

      _self.costUpdateTypeOpt = await sysvalue.cascade('THC_RCM_Cost_Update_Type')
      _self.$ever.getFieldFromSchema(_self.updateSchema, 'costUpdateType').options = _self.costUpdateTypeOpt
      _self.computeObj.costUpdateType = _self.$ever.getFieldFromSchema(_self.updateSchema, 'costUpdateType').options[0]

//      // 获取库房
//      const wareHouseObj = [
//        {
//          schema: _self.querySchema,
//          obj: _self.queryObj
//        },
//        {
//          schema: _self.updateSchema,
//          obj: _self.computeObj
//        }
//      ]
//      await _self.getWareHouse(_self.queryObj.clinicId, wareHouseObj)
      // 物料类型
      const materialResult = await sysvalue.cascade('THC_WH_OBJECT_TYPE')
      if (materialResult && materialResult.length) {
        materialResult.forEach((item) => {
          item.value = item.code
        })
        _self.$ever.getFieldFromSchema(_self.querySchema, 'materialType').options = materialResult
        _self.queryObj.materialType = _self.$ever.getFieldFromSchema(_self.querySchema, 'materialType').options[0].code
        // 新增
        _self.$ever.getFieldFromSchema(_self.updateSchema, 'materialType').options = materialResult
        _self.computeObj.materialType = _self.$ever.getFieldFromSchema(_self.updateSchema, 'materialType').options[0]
      }

      // 成本期间
      await _self.getPeriodFn(_self.queryObj, _self.querySchema)

      _self.queryObj.requestSwitch = !_self.queryObj.requestSwitch
    },
    methods: {
      async updatePeriod () {
        let updateData = {
          data: []
        }
        if (this.tableData && this.tableData.length) {
          this.tableData.forEach((item) => {
            if (item.costUpdateType !== 0) {
              updateData.data.push({
                id: item.id,
                clinicId: item.clinicId,
                costUnit: item.costUnit,
                materialId: item.materialId,
                materialType: item.materialType,
                warehouseId: item.warehouseId,
                costUpdateType: item.costUpdateType,
                costPeriodId: item.costPeriodId,
                periodBalancePrice: item.periodBalancePrice
              })
            }
          })
        }
        if (updateData.data.length) {
          const result = await api.update(updateData)
          if (result && result.head && result.head.errCode === 0) {
            Notification.success('保存成功')
          }
        } else {
          Notification.info('没有满足条件的数据')
        }
      },
      async queryMaterial (query) {
        const _self = this
        await _self.getLocalSettingList(query, _self.queryObj, _self.querySchema, true)
      },
      async createMaterial (query) {
        const _self = this
        await _self.getLocalSettingList(query, _self.computeObj, _self.updateSchema)
      },
      async getLocalSettingList (query, obj, schema, isValue) {
        const _self = this
        if (query) {
          const postdata = {
            name: query,
            materialType: Number(obj['materialType'].value || obj['materialType'])
          }
          const result = await api.getLocalSettingList(postdata)
          if (result && result.length) {
            let options = result.map(item => {
              let VoItem = item.materialVoObject
              if (isValue) {
                VoItem.id = `${VoItem.id}${obj['materialType']}`
              }
              return VoItem
            })
            _self.$ever.getFieldFromSchema(schema, 'materialCode').options = options
          }
        } else {
          _self.$ever.getFieldFromSchema(schema, 'materialCode').options = []
        }
      },
      async createCost () {
        const _self = this
        this.$refs.form.$refs.form.validate(async (valid) => {
          if (valid) {
            if (_self.$ever.getFieldFromSchema(_self.updateSchema, 'materialCode').options && _self.computeObj.materialCode) {
              _self.$ever.getFieldFromSchema(_self.updateSchema, 'materialCode').options.forEach(item => {
                if (_self.computeObj.materialCode === item.id) {
                  _self.computeObj.costUnit = item.unitGroupItemObject.name
                }
              })
            }
            const postdata = {
              data: [{
                clinicId: _self.computeObj.clinicId,
                materialId: _self.computeObj.materialCode,
                materialType: _self.computeObj.materialType.value,
                costPeriodId: _self.computeObj.costPeriodId,
                costUnit: _self.computeObj.costUnit,
                wareHouseId: _self.computeObj.wareHouseId,
                costUpdateType: _self.computeObj.costUpdateType.value,
                periodBalancePrice: _self.computeObj.periodBalancePrice
              }]
            }
            const result = await api.update(postdata)
            if (result && result.head && result.head.errCode === 0) {
              Notification.success('保存成功')
              _self.afterSave()
            }
          } else {
            return false
          }
        })
      },
      async getPeriodFn (obj, schema) {
        const _self = this
        // 成本期间
        const periodResult = await api.getPeriod({clinicId: obj['clinicId'], setOfBooksId: obj['setOfBooksId'], year: obj['year']})
        if (periodResult && periodResult.data && periodResult.data.length) {
          _self.$ever.getFieldFromSchema(schema, 'costPeriodId').options = periodResult.data
          obj['costPeriodId'] = _self.$ever.getFieldFromSchema(schema, 'costPeriodId').options[0].id
        }
      },
      async getWareHouse (clinicId, schemaObj) {
        const _self = this
        // 获取库房
        const result = await api.getStorageRoomList({clinicId: clinicId})
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
        const result = await common.getSetOfBook({clinicId: obj['clinicId']})
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
          const result = await common.getPeriodYear({setOfBooksId: obj['setOfBooksId']})
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
      handleSubmit () {
        this.dialogVisible = false
      },
      afterSave () {
        this.dialogVisible = false
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
      //     await _self.clinicIdChange(cur, old, _self.computeObj, _self.updateSchema)
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
          await _self.setOfBooksIdChange(cur, old, _self.computeObj, _self.updateSchema)
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
            await _self.getPeriodFn(_self.computeObj, _self.updateSchema)
          }
        }
      }
    }
  }
</script>

