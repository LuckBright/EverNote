<template>
  <div class="layout_inner">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="tradeno" label="门诊交易流水号" width="200"></el-table-column>
      <el-table-column prop="tradeoldno" label="原交易流水号" width="200"></el-table-column>
      <el-table-column prop="tradedate" label="交易日期时间" width="180"></el-table-column>
      <el-table-column prop="trademicode" label="就诊定点医疗机构编码" width="150"></el-table-column>
      <el-table-column fixed="right" label="详情" width="200">
        <template slot-scope="scope">
          <el-popover placement="bottom" title width="800" trigger="click">
            <el-table :data="gridData">
              <el-table-column width="200" property="tradeno" label="交易流水号"></el-table-column>
              <el-table-column width="100" property="diagnoseno" label="诊断序号"></el-table-column>
              <el-table-column width="100" property="recipeno" label="处方序号"></el-table-column>
              <el-table-column width="200" property="recipedatetime" label="处方日期/时间"></el-table-column>
              <el-table-column width="100" property="diagnosecode" label="诊断编码"></el-table-column>
              <el-table-column width="100" property="diagnosename" label="诊断名称"></el-table-column>
            </el-table>
            <el-button size="small" slot="reference" @click="showTradeDetail(scope.row)">处方信息</el-button>
          </el-popover>
          <el-popover placement="bottom" title width="1000" trigger="click">
            <el-table :data="itemData">
              <el-table-column width="200" property="tradeno" label="交易流水号"></el-table-column>
              <el-table-column width="100" property="recipeno" label="处方序号"></el-table-column>
              <el-table-column width="100" property="itemno" label="项目序号"></el-table-column>
              <el-table-column width="300" property="itemcode" label="项目代码"></el-table-column>
              <el-table-column width="200" property="itemname" label="项目名称"></el-table-column>
              <el-table-column width="100" property="itemtypeTitle" label="业务分类"></el-table-column>
              <el-table-column width="100" property="doseTitle" label="剂型"></el-table-column>
              <el-table-column width="100" property="specification" label="规格"></el-table-column>
            </el-table>
            <el-button size="small" slot="reference" @click="showItemDetail(scope.row)">明细分解信息</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
  </div>
</template>

<script>
import api from '../store/mainheadertradeapi'
import utillist from '../../util/list'
export default {
  props: ['cardNum'],
  mixins: [utillist],
  data () {
    return {
      api,
      icno: '',
      listParams: { 'icno': this.cardNum },
      tableData: [],
      gridData: [],
      itemData: []
    }
  },
  methods: {
    showTradeDetail (row) {
      let params = {
        tradeno: row.tradeno
      }
      api.tradeList(params).then(res => {
        this.gridData = res.data
      })
    },
    showItemDetail (row) {
      let params = {
        tradeno: row.tradeno
      }
      api.tradeItemList(params).then(res => {
        this.itemData = res.data
      })
    }
  }
}
</script>
