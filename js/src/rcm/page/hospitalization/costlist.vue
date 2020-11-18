<template>
  <div>
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      ref="form"
      :info="true"
      labelWidth="120px"
      label-position="right"
      :nosubmit="true"
      :inline="true"
    >
      <template slot="medChargeLevel">
        <el-select v-model="queryObj.medChargeLevel" clearable placeholder="请选择">
          <el-option
            v-for="item in options.type"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </template>
      <template slot="btn">
        <el-button type="primary" @click="query">查询</el-button>
      </template>
      <!-- <template slot="condition">
        <el-checkbox
          v-model="check.showSetName"
          :false-label="'0'"
          :true-label="'1'"
          style="margin-left:20px;"
          @change="showSetNameChange"
        >显示组套名称</el-checkbox>
        <el-checkbox
          v-model="check.excludeUrgent"
          :false-label="'0'"
          :true-label="'1'"
          @change="excludeUrgentChange"
        >排除加急</el-checkbox>
        <el-checkbox
          v-model="check.excludeClassC"
          :false-label="'0'"
          :true-label="'1'"
          @change="excludeClassChange"
        >排除丙类</el-checkbox>
      </template>-->
    </ever-form2>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="createTime" label="时间" width="200"></el-table-column>
      <el-table-column prop="itemName" label="项目名称"></el-table-column>
      <el-table-column prop="itemClassName" label="类别"></el-table-column>
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="quantity" label="数量" align="right"></el-table-column>
      <el-table-column prop="unitPrice" label="单价" align="right">
        <template slot-scope="scope">{{scope.row.unitPrice | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="fee" label="应收金额" align="right">
        <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣比例" align="right" :formatter="convertToPercent"></el-table-column>
      <el-table-column prop="actualFee" label="实收金额" align="right">
        <template slot-scope="scope">{{scope.row.actualFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="chargeLevelName" label="收费等级"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from '@/rcm/store/hospitalization/costlist'
let schema = [
  {
    label: '',
    name: 'itemName',
    props: {
      placeholder: '项目名称'
    }
  },
  {
    name: 'itemClass',
    label: '业务分类',
    comp: 'sys-type',
    props: {
      code: 'THC_RCM_FIN_TYPE',
      useValue: true,
      placeholder: '业务分类'
    },
    noWrap: true,
    span: 6
  },
  {
    label: '',
    name: 'medChargeLevel',
    comp: 'custom'
  },
  {
    name: 'queryTimeRange',
    label: '住院期间',
    comp: 'everRangePicker'
  },
  {
    label: '',
    name: 'btn',
    comp: 'custom'
  },
  // {
  //   label: '',
  //   name: 'condition',
  //   comp: 'custom'
  // }
]
export default {
  props: ['check'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      tableData: [],
      querySchema: schema,
      queryObj: obj,
      radio: '',
      loading: false,
      options: {
        type: [
          { id: '1', name: '甲类' },
          { id: '2', name: '乙类' },
          { id: '3', name: '丙类' }
        ]
      }
    }
  },
  watch: {
    '$route.query.patientId': {
      handler: function (val, oldval) {
        if (val !== oldval) {
          this.clear()
          this.query()
        }
      },
      immediate: true
    }
  },
  methods: {
    showSetNameChange (val) {
      if (val === '1') {
        this.check.excludeUrgent = '0'
        this.check.excludeClassC = '0'
      }
      this.query()
    },
    excludeUrgentChange (val) {
      if (val === '1') {
        this.check.showSetName = '0'
      }
      this.query()
    },
    excludeClassChange (val) {
      if (val === '1') {
        this.check.showSetName = '0'
      }
      this.query()
    },
    query () {
      let params = Object.assign({ patientId: this.$route.query.patientId, ipNo: this.$route.query.ipNo }, this.queryObj, this.check)
      delete params.btn
      delete params.condition
      if (this.queryObj.queryTimeRange.length > 0) {
        params.startTime = this.$moment(this.queryObj.queryTimeRange[0]).format('YYYY-MM-DD 00:00:00')
        params.endTime = this.$moment(this.queryObj.queryTimeRange[1]).format('YYYY-MM-DD 23:59:59')
      }
      this.loading = true
      api.getList(params).then(rs => {
        this.loading = false
        this.tableData = rs.data || []
        this.check.listTotalCount = this.tableData.length
      }).catch(rj => {
        this.loading = false
      })
    },
    clear () {
      this.check.showSetName = '0'
      this.check.excludeUrgent = '0'
      this.check.excludeClassC = '0'
      this.check.listTotalCount = 0
      this.queryObj.itemName = ''
      this.queryObj.itemClass = ''
      this.queryObj.medChargeLevel = ''
    },
    convertToPercent (row) {
      return row.discount * 100 + '%'
    }
  }
}
</script>

