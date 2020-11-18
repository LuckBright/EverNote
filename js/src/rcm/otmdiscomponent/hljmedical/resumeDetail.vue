<template>
  <el-dialog
    :visible.sync="v"
    title="门诊消费明细"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" labelWidth="80px">
      <template slot="btns">
        <el-button size="small" type="primary" @click="queryList">查询</el-button>
        <el-button size="small" @click="cancel">退出</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" border stripe v-loading="loading" max-height="600px">
      <el-table-column label="发生时间" prop="diseaseNo" width="160">
        <template slot-scope="scope">{{$moment(scope.row.diseaseNo).format('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column label="票据号" prop="medicareSerialNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="姓名" prop="name" width="90"></el-table-column>
      <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip></el-table-column>
      <el-table-column label="人员待遇类别" prop="peopleTypeName"></el-table-column>
      <el-table-column label="门诊定点机构名称" prop="organName" width="150"></el-table-column>
      <el-table-column label="项目名称" prop="detailItemHisName" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="detailItemNum"></el-table-column>
      <el-table-column label="单价" prop="detailItemPrice"></el-table-column>
      <el-table-column label="金额" prop="detailItemAmount"></el-table-column>
      <el-table-column label="医疗类别" prop="medicalCareTypeName"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { outType } from '@/rcm/otmdiscomponent/config-js/hlj-base-config.js'
import { prewarnConsume } from '@/rcm/store/otmdiscomponent/hlj-api.js'
const schema = [{
  label: '时间范围',
  name: 'dateRange',
  comp: 'everRangePicker',
  props: {
    autoWidth: true
  },
  span: 6
},
{
  label: '门诊类别',
  name: 'type',
  comp: 'ever-select',
  props: {
    options: outType
  },
  span: 6
},
{
  label: '个人编号',
  name: 'personalNo',
  props: {
    disabled: true
  },
  span: 6
},
{
  label: '',
  name: 'btns',
  comp: 'custom',
  labelWidth: '15px',
  span: 6
}]

export default {
  props: {
    resumeDetailShow: {
      type: [Boolean]
    },
    currentRow: {
      type: [Object],
      default: _ => { }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.type = '0'
    // 默认时间本月开始到结束
    let startDay = this.$moment().format('YYYY-MM-01')
    let endDay = this.$moment(startDay).add('month', 1).add('days', -1).format('YYYY-MM-DD')
    queryObj.dateRange = [startDay, endDay]
    return {
      schema,
      queryObj,
      loading: false,
      tableData: []
    }
  },
  computed: {
    v: {
      get () {
        return this.resumeDetailShow
      },
      set (val) {
        this.$emit('update:resumeDetailShow', val)
      }
    },
  },
  methods: {
    queryList () {
      this.loading = true
      let [startDay, endDay] = this.queryObj.dateRange
      let params = {
        personalNo: this.queryObj.personalNo,
        type: this.queryObj.type,
        startDay: startDay,
        endDay: endDay,
        macId: this.macId
      }
      for (let item in params) {
        if (!params[item]) {
          delete params[item]
        }
      }
      // xxxx
      prewarnConsume(params).then(res => {
        let result = res.data
        this.tableData = result.history.map(item => {
          item.idCard = result.idCard
          item.name = result.name
          item.peopleTypeName = result.peopleTypeName
          return item
        })
        this.loading = false
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    // 取消
    cancel () {
      this.v = false
    }
  },
  created () {
    Object.assign(this.queryObj, this.currentRow)
  }
}
</script>

