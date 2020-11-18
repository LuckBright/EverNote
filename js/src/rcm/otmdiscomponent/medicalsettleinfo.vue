<template>
  <el-dialog :visible.sync="v" width="80%">
    <div>
      <h4 class="tit">医保结算信息</h4>
      <div>
        <el-table :data="tableData">
          <el-table-column label="就诊流水号"></el-table-column>
          <el-table-column label="交易流水号"></el-table-column>
          <el-table-column label="医疗费总额"></el-table-column>
          <el-table-column label="现金支付金额"></el-table-column>
          <el-table-column label="本次账户支付"></el-table-column>
          <el-table-column label="救助金支付金额"></el-table-column>
          <el-table-column label="公务员补助支付金额"></el-table-column>
          <el-table-column label="医院承担金额"></el-table-column>
          <el-table-column label="补充医疗支付金额"></el-table-column>
          <el-table-column label="票据号"></el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <h4 class="tit">支付信息</h4>
      <div>
        <el-table :data="tableData" @cell-click="handleCellClick">
          <el-table-column prop="prop1.value" label="visitNumber"></el-table-column>
          <el-table-column prop="prop2.value" label="交易流水号"></el-table-column>
          <el-table-column prop="prop3.value" label="医疗费总额">
            <template slot-scope="scope">
              <template v-if="scope.row.prop3.editable">
                <el-input v-model="scope.row.prop3.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop3.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop4.value" label="现金支付金额">
            <template slot-scope="scope">
              <template v-if="scope.row.prop4.editable">
                <el-input v-model="scope.row.prop4.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop4.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop5.value" label="本次账户支付">
            <template slot-scope="scope">
              <template v-if="scope.row.prop5.editable">
                <el-input v-model="scope.row.prop5.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop5.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop6.value" label="救助金支付金额">
            <template slot-scope="scope">
              <template v-if="scope.row.prop6.editable">
                <el-input v-model="scope.row.prop6.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop6.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop7.value" label="公务员补助支付金额">
            <template slot-scope="scope">
              <template v-if="scope.row.prop7.editable">
                <el-input v-model="scope.row.prop7.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop7.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop8.value" label="医院承担金额">
            <template slot-scope="scope">
              <template v-if="scope.row.prop8.editable">
                <el-input v-model="scope.row.prop8.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop8.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop9.value" label="补充医疗支付金额">
            <template slot-scope="scope">
              <template v-if="scope.row.prop9.editable">
                <el-input v-model="scope.row.prop9.value"></el-input>
              </template>
              <template v-else>{{scope.row.prop9.value}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="prop10.value" label="票据号"></el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['settleInfoShow'],
  data () {
    return {
      tableData: [{
        prop1: { editable: false, value: 'prop1' },
        prop2: { editable: false, value: 'prop2' },
        prop3: { editable: false, value: 'prop3' },
        prop4: { editable: false, value: 'prop4' },
        prop5: { editable: false, value: 'prop5' },
        prop6: { editable: false, value: 'prop6' },
        prop7: { editable: false, value: 'prop7' },
        prop8: { editable: false, value: 'prop8' },
        prop9: { editable: false, value: 'prop9' },
        prop10: { editable: false, value: 'prop10' }
      }]
    }
  },
  computed: {
    v: {
      get () {
        return this.settleInfoShow
      },
      set (val) {
        this.$emit('update:settleInfoShow', val)
      }
    }
  },
  methods: {
    handleCellClick (row, column, cell, event) {
      let columnIndex = column.property.split('.')[0]
      row[columnIndex]['editable'] = true
    },
    handleSure () { }
  }
}
</script>

<style scoped>
.tit {
  border-left: 3px solid #1c7bef;
  padding-left: 5px;
  font-size: 14px;
  margin: 10px 0;
}
</style>
