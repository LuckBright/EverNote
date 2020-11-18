<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
        <div class="main-option">
          <el-button type="primary" @click.native.prevent="createPeriodMange()" v-loading.fullscreen.lock="fullscreenLoading" size="small">保存</el-button>
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        >
        <el-table-column
          prop="periodName"
          label="期间名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop=""
          label="收入期间状态"
          align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.arPeriodStatus" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in arPeriodOptions"
                :key="Number(item.id)"
                :label="item.name"
                :value="Number(item.id)">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '../store/arperiodmangeapi'
import list from '../../util/list'
// import clinicApi from '@/warehouse/store/clinicapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { Notification } from 'element-ui'
var schema = [
  // {
  //   name: 'clinicId',
  //   label: '医疗机构名称',
  //   type: 'select',
  //   options: []
  // },
  {
    name: 'setOfBooksId',
    label: '账套名称',
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
    obj.requestSwitch = true
    return {
      querySchema: schema,
      queryObj: obj,
      api,
      fullscreenLoading: false,
      tableData: [],
      arPeriodOptions: []
    }
  },
  methods: {
    createPeriodMange () {
      api.create(this.tableData).then(result => {
        Notification.success('保存成功')
      })
    },
    getSetOfBook () {
      this.queryObj.setOfBooksId = ''
      this.queryObj.year = ''
      api.getListByClinicId({
        // clinicId: this.queryObj.clinicId
      })
      .then(result => {
        result.data.forEach(function (item, index) {
          item.name = item.setOfBooksName
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'setOfBooksId').options = result.data
        if (result.data.length > 0) {
          this.queryObj.setOfBooksId = this.$ever.getFieldFromSchema(this.querySchema, 'setOfBooksId').options[0].id
        }
      })
    }
  },
  beforeCreate () {
    this.api = api
  },
  async created () {
    const _self = this
    // let result = await clinicApi.list()
    // _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options = result
    // _self.queryObj.clinicId = _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options[0].id
    _self.getSetOfBook()
    _self.queryObj.requestSwitch = !_self.queryObj.requestSwitch

    sysvalue.cascade(
      'THC_RCM_PERIOD_STATUS').then(options => {
        this.arPeriodOptions = options
      })
  },
  watch: {
    'queryObj.setOfBooksId': {
      handler (cur, old) {
        this.queryObj.year = ''
        if (cur !== old) {
          api.getPeriodYear({
            setOfBooksId: this.queryObj.setOfBooksId
          })
            .then(result => {
              let yearDate = []
              result.date.forEach(function (item) {
                let yearObj = {}
                yearObj.id = item
                yearObj.name = item
                yearDate.push(yearObj)
              })
              this.$ever.getFieldFromSchema(this.querySchema, 'year').options = yearDate
            })
        }
      }
    }
  }
}
</script>
