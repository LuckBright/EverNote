<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/financeistall/periodcontrol'">
            <el-button size="small" type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="accountPeriodName" label="期间名称" align="center"></el-table-column>
        <el-table-column prop label="核算期间状态" align="center">
          <template slot-scope="scope">{{stateStr}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '../store/periodcontrolapi'
import apperiodmangeapi from '../store/apperiodmangeapi'
import list from '../../util/list'
import { getClinicInfo } from '../store/voucherEntries'
var schema = [
  {
    name: 'clinicid',
    label: '医疗机构名称',
    type: 'text',
    disabled: true
  },
  {
    name: 'id',
    label: '账套名称',
    clearable: true,
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
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      api,
      tableData: [],
      stateStr: '已创建'
    }
  },
  methods: {
    // 获取当前机构
    async getCurrentClinc () {
      try {
        let data = await getClinicInfo()
        this.queryObj.clinicid = data.data && data.data[0].name
      } catch (err) { }
    }
  },
  created () {
    this.getCurrentClinc()
    apperiodmangeapi
      .getListByClinicId({
        clinicId: this.queryObj.clinicid
      })
      .then(result => {
        result.data.forEach(function (item, index) {
          item.name = item.setOfBooksName
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'id').options =
          result.data
        if (result.data.length > 0) {
          this.queryObj.id = this.$ever.getFieldFromSchema(
            this.querySchema,
            'id'
          ).options[0].id
        }
      })
  },
  watch: {
    'queryObj.id': {
      handler (cur, old) {
        this.queryObj.year = ''
        if (cur !== old) {
          if (this.queryObj.id) {
            apperiodmangeapi
              .getPeriodYear({
                setOfBooksId: this.queryObj.id
              })
              .then(result => {
                let yearDate = []
                result.date.forEach(function (item) {
                  let yearObj = {}
                  yearObj.id = item
                  yearObj.name = item
                  yearDate.push(yearObj)
                })
                this.$ever.getFieldFromSchema(
                  this.querySchema,
                  'year'
                ).options = yearDate
              })
          }
        }
      }
    }
  }
}
</script>
