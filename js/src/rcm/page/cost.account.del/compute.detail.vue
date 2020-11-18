<template>
  <div>
    <ever-bread-crumb name="成本明细" path="/cost/compute"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          ref="form" label-position="right" label-width="160px">
        </ever-form-model>
        <el-table
          :data="tableData.detailList"
          style="width: 100%"
          >
          <el-table-column
            label="期间"
            prop="costPeriodName"
          >
          </el-table-column>
          <el-table-column
            label="日期"
            prop="dealDate"
          >
          </el-table-column>
          <el-table-column
            label="单价"
            prop="materialPrice"
            align="right">
              <template slot-scope="scope">
                <span>{{scope.row.materialPrice | formatToFinacial}}</span>
              </template>
          </el-table-column>
          <el-table-column
            label="数量"
            prop="materialQty"
            align="right">
              <template slot-scope="scope">
                <span>{{scope.row.materialQty}}</span>
              </template>
          </el-table-column>
          <el-table-column
            label="包装单位"
            prop="packagUnitText"
          >
          </el-table-column>
          <el-table-column
            label="金额"
            prop="totalMoney"
            align="right">
              <template slot-scope="scope">
                <span>{{scope.row.totalMoney | formatToFinacial}}</span>
              </template>
          </el-table-column>
          <el-table-column
            label="库房"
            prop="warehouseName"
          >
          </el-table-column>
          <el-table-column
            label="事务处理类型"
            prop="dealType"
          >
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount" :current="current">
          </ever-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/rcm/store/cost.account/compute.detail'
  import list from '@/util/list'
  export default {
    mixins: [list],
    data () {
      var schema = [
        {
          name: 'clinicName',
          label: '医疗机构',
          readonly: true
        },
        {
          name: 'materialName',
          label: '物料名称',
          readonly: true
        },
        {
          name: 'costPeriodName',
          label: '成本期间',
          readonly: true
        },
        {
          name: 'warehouseName',
          label: '库房名称',
          readonly: true
        },
        {
          name: 'periodBalancePrice',
          label: '物料成本',
          readonly: true
        }
      ]

      var obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        objId: this.$route.params.id,
        api,
        obj: obj,
        tableData: [],
        dialogVisible: false,
        prePaymentVisible: false,
        queryObj: {
          requestSwitch: true
        },
        loading: true
      }
    },
    created () {
      if (this.objId) {
        this.queryObj.id = this.objId
        this.queryObj.requestSwitch = !this.queryObj.requestSwitch
      }
    },
    methods: {
      async list () {
        const _self = this
        let params = {
          id: _self.objId
        }
        params = Object.assign(params, _self.queryObj)
        params.pagesize = _self.pagesize
        params.offset = _self.offset
        const result = await _self.api.list(params)
        if (result) {
          Object.assign(_self.obj, result.data.title)
          _self.tableData = result.data
          _self.totalCount = result.totalCount
        }
      }
    },
    watch: {
      'tableData': {
        handler (cur, old) {
          if (cur && cur.title) {
            this.obj = cur.title
          }
        }
      }
    }
  }
</script>
