<template>
  <div class="tableContainer">
    <ever-form2 ref="queryform" :inline="true" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="queryList">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-container class="flex_column_full pos_re mt20">
      <el-table
        class="no-margin-table flex_column_full_hidden table"
        v-loading="loading"
        :data="tableData"
        border
        stripe
      >
        <el-table-column label="结算单ID" prop="jshid" width="210"></el-table-column>
        <el-table-column label="总金额" prop="zje" align="right" width="120">
          <template slot-scope="scope">{{scope.row.zje | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="医保负担金额" prop="ybfdje" align="right" width="120">
          <template slot-scope="scope">{{scope.row.ybfdje | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="个人账户支付" prop="grzhzf" align="right" width="120">
          <template slot-scope="scope">{{scope.row.grzhzf | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="现金支付" prop="xjzf" align="right" width="120">
          <template slot-scope="scope">{{scope.row.xjzf | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="医疗减免金额" prop="yljmje" align="right" width="120">
          <template slot-scope="scope">{{scope.row.yljmje | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="医疗补助金额" prop="ylbzje" align="right" width="120">
          <template slot-scope="scope">{{scope.row.ylbzje | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="其中基本账户支付" prop="qzjbzhzf" align="right" width="140">
          <template slot-scope="scope">{{scope.row.qzjbzhzf | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="病人结算日期" prop="brjsrq" width="160"></el-table-column>
        <el-table-column label="个人编号" prop="grbh" width="170"></el-table-column>
        <el-table-column label="姓名" prop="xm" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="医疗统筹类别" prop="yltclb" width="140">
          <template slot-scope="scope">{{scope.row.yltclb | yltclb}}</template>
        </el-table-column>
        <el-table-column label="险种标志" prop="xzbz">
          <template slot-scope="scope">{{scope.row.xzbz | insuranceType}}</template>
        </el-table-column>
        <el-table-column label="结算标志" prop="jsbz">
          <template slot-scope="scope">{{scope.row.jsbz | settleFlag}}</template>
        </el-table-column>
      </el-table>
    </el-container>
  </div>
</template>

<script>
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { queryJsxx } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { yltclb, insuranceType, settleFlag } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'
function obj2Arr (obj) {
  return Object.keys(obj).map(key => ({ id: key, name: obj[key] }))
}
const schema = [{
  label: '医疗统筹类别',
  name: 'yltclb',
  comp: 'ever-select',
  props: {
    options: yltclb
  }
},
{
  label: '起止日期',
  name: 'timeStartAndEnd',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '险种标志',
  name: 'xzbz',
  comp: 'ever-select',
  props: {
    options: obj2Arr(insuranceType)
  }
},
{
  label: '院区编号',
  name: 'campusid',
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}
]
const rules = {
  timeStartAndEnd: [{
    required: true,
    message: '请选择起止日期',
    trigger: 'change'
  }]
}
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      rules,
      queryObj,
      loading: false,
      tableData: []
    }
  },
  methods: {
    queryList () {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const [qsrq, zzrq] = this.queryObj.timeStartAndEnd
          const params = {
            macId: this.macId,
            insuranceOrgId: sdllCode,
            sbjgbh: '37140101', // 医保局编号写死
            jsonPara: {
              ...this.queryObj,
              qsrq,
              zzrq: this.$moment(zzrq).format('YYYY-MM-DD 23:59:59')
            }
          }
          Object.keys(params.jsonPara).forEach(key => {
            if (!params.jsonPara[key]) {
              delete params.jsonPara[key]
            }
          })
          queryJsxx(params).then(res => {
            const { jsxx_ds: tableData } = res.data
            this.tableData = tableData
            this.loading = false
          }).catch(err => {
            console.log('err', err)
            this.loading = false
          })
        }
      })
    }
  },
  filters: {
    yltclb (val) {
      const index = yltclb.find(item => item.id === val)
      return index && index.name
    },
    insuranceType (val) {
      return insuranceType[val]
    },
    settleFlag (val) {
      return settleFlag[val]
    }
  }
}
</script>
<style scoped>
.tableContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.table {
  overflow: auto;
}
</style>
