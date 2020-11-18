<template>
  <div>
    <!-- <ever-bread-crumb name="银行收款对账" path="/rcm/account/check"></ever-bread-crumb> -->
    <div class="layout_inner">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
      </ever-query-form>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width:100%"
        >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="日期"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="通道"
          align="center">
        </el-table-column>
        <el-table-column label="THC_系统应收款" align="center">
          <el-table-column
            prop="systemSingular"
            label="笔数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="systemVolume"
            label="金额（元）"
            align="center">
            <template slot-scope="scope">
              {{scope.row.systemVolume | formatToFinacial}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="通道_实际应收款" align="center">
          <el-table-column
            prop="tradeSingular"
            label="笔数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="tradeVolume"
            label="金额（元）"
            align="center">
            <template slot-scope="scope">
              {{scope.row.tradeVolume | formatToFinacial}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="state"
          label="对账情况"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.state === 0">
              {{ACCOUNT_CHECK_STATUS[scope.row.state]}}
            </template>
            <template v-if="scope.row.state === 1">
              <router-link :to="'/rcm/account/check/'+scope.row.id">{{ACCOUNT_CHECK_STATUS[scope.row.state]}}</router-link>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import api from '@/rcm/store/account.check/check'
  import {ACCOUNT_CHECK_STATUS} from '@/util/common'
  import list from '@/util/list'

  const querySchema = [
    {
      startName: 'start_date',
      endName: 'end_date',
      name: 'daterange',
      type: 'daterange',
      dateType: 'datetimerange',
      label: '日期',
      format: 'YYYY-MM-DD HH:mm:ss',
      editable: false
    }
  ]

  export default {
    mixins: [list],
    data () {
      let obj = this.$ever.createObjFromSchema(querySchema)
      return {
        tableData: [],
        querySchema: querySchema,
        queryObj: obj,
        api,
        ACCOUNT_CHECK_STATUS
      }
    }
  }
</script>
