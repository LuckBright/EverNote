<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <!-- <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form> -->
        <!--<div class="main-option">-->
          <!--<el-button type="primary" @click="$router.push('/warehouse/supplieradd/')">新建</el-button>-->
        <!--</div>-->
      </div>

      <el-table
        v-loading.body="loading"
        :data="tableData"
        >
        <el-table-column show-overflow-tooltip
                         prop="clinicId"
                         label="医疗机构编码">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="clinicName"
                         label="医疗机构名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="paramName"
                         label="参数名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="paramValue"
          label="参数值"
          align="right">
          <template slot-scope="scope">
            <span>{{scope.row.paramValue}}</span>
          </template>
        </el-table-column>
      </el-table>
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
  import costAccount from '@/rcm/store/cost.account/params'
  import list from '@/util/list'
  // import clinicApi from '@/warehouse/store/clinicapi'

  var querySchema = [
    // {
    //   name: 'clinicId',
    //   label: '医疗机构',
    //   type: 'select',
    //   clearable: true,
    //   options: []
    // }
  ]

  export default {
    mixins: [list],
    data () {
      let obj = this.$ever.createObjFromSchema(querySchema)
      obj.requestSwitch = true
      return {
        tableData: [],
        querySchema: querySchema,
        queryObj: obj
      }
    },
    beforeCreate () {
      this.api = costAccount
    },
    async created () {
      const _self = this
      // 获取机构
      // let result = await clinicApi.list()
      // _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options = result
      // _self.queryObj.clinicId = _self.$ever.getFieldFromSchema(_self.querySchema, 'clinicId').options[0].id
      _self.queryObj.requestSwitch = !_self.queryObj.requestSwitch
    }
  }
</script>
