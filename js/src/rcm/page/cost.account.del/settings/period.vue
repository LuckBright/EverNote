<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
        <div class="main-option">
          <el-button type="primary" @click.native.prevent="updatePeriod()" v-loading.fullscreen.lock="fullscreenLoading" size="small">保存</el-button>
        </div>
      </div>

      <el-table
        v-loading.body="loading"
        :data="tableData"
        >
        <el-table-column show-overflow-tooltip
                         prop="name"
                         label="期间名称"
                         align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="inventoyPeriodStatus"
                         label="库存期间状态"
                         align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.inventoyPeriodStatus" size="small" placeholder="请选择" style="width: 150px">
              <el-option
                v-for="item in stockPeriodOptions"
                :key="Number(item.code)"
                :label="item.name"
                :value="Number(item.code)">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="costperiodStatus"
                         label="成本期间状态"
                         align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.costperiodStatus" size="small" placeholder="请选择" style="width: 150px">
              <el-option
                v-for="item in costPeriodOptions"
                :key="Number(item.code)"
                :label="item.name"
                :value="Number(item.code)">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import api from '@/rcm/store/cost.account/period'
  import list from '@/util/list'
  // import clinicApi from '@/warehouse/store/clinicapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import { Notification } from 'element-ui'

  var querySchema = [
    // {
    //   name: 'clinicId',
    //   label: '医疗机构',
    //   type: 'select',
    //   clearable: true,
    //   options: []
    // },
    {
      name: 'setOfBooksId',
      label: '账套',
      type: 'select',
      options: []
    },
    {
      name: 'year',
      label: '期间年度',
      type: 'select',
      options: []
    }
  ]

  export default {
    mixins: [list],
    data () {
      let obj = this.$ever.createObjFromSchema(querySchema)
      obj.requestSwitch = true
      return {
        tableData: [],
        querySchema: querySchema,
        queryObj: obj,
        api,
        costPeriodOptions: [],
        stockPeriodOptions: [],
        fullscreenLoading: false,
        loading: false
      }
    },
    async created () {
      const _self = this
      // let result = await clinicApi.list()
      // _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options = result
      // _self.queryObj.clinicId = _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options[0].id
      _self.getSetOfBook()
      _self.costPeriodOptions = await sysvalue.cascade('THC_RCM_COST_PERIOD_STATUS')
      _self.stockPeriodOptions = await sysvalue.cascade('THC_RCM_STOCK_PERIOD_STATUS')
      _self.queryObj.requestSwitch = !_self.queryObj.requestSwitch
    },
    methods: {
      updatePeriod () {
        let updateData = {
          data: []
        }
        if (this.tableData && this.tableData.length) {
          this.tableData.forEach((item) => {
            updateData.data.push({
              id: item.id,
              inventoyPeriodStatus: item.inventoyPeriodStatus,
              costperiodStatus: item.costperiodStatus
            })
          })
        }

        api.update(updateData).then(result => {
          Notification.success('保存成功')
        })
      },
      async getSetOfBook () {
        this.queryObj.setOfBooksId = ''
        const result = await api.getListByClinicId({
          // clinicId: this.queryObj.clinicId
        })
        if (result && result.data && result.data.length) {
          result.data.forEach(function (item, index) {
            item.name = item.setOfBooksName
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'setOfBooksId').options = result.data
          if (result.data.length > 0) {
            this.queryObj.setOfBooksId = this.$ever.getFieldFromSchema(this.querySchema, 'setOfBooksId').options[0].id
          }
        }
      }
    },
    watch: {
      'queryObj.setOfBooksId': {
        async handler (cur, old) {
          this.queryObj.year = ''
          if (cur !== old) {
            const result = await api.getPeriodYear({setOfBooksId: this.queryObj.setOfBooksId})
            let yearDate = []
            if (result && result.date && result.date.length) {
              result.date.forEach(function (item) {
                let yearObj = {}
                yearObj.id = item
                yearObj.name = item
                yearDate.push(yearObj)
              })
              this.$ever.getFieldFromSchema(this.querySchema, 'year').options = yearDate
              this.queryObj.year = this.$ever.getFieldFromSchema(this.querySchema, 'year').options[0].id
            }
          }
        }
      }
    }
  }
</script>
