<template>
  <div class="layout_inner">
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :isQuery="true"
      :inline="true"
      @query="list"
    >
      <template slot="btns">
        <div class="btns">
          <el-button size="small" type="primary" @click="list(true)">查询</el-button>
          <el-button size="small" @click="resetForm">重置</el-button>
        </div>
      </template>
      <div></div>
    </ever-form2>
    <div class="flex_column_1_hidden layout_inner">
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        class="el-td-border no-vertical-border"
      >
        <el-table-column show-overflow-tooltip prop="insuranceOrgName" label="保险公司名称"></el-table-column>
        <el-table-column show-overflow-tooltip width="90" prop="businessUserName" label="业务人员"></el-table-column>
        <el-table-column prop="businessUserCode" label="人员编号"></el-table-column>
        <el-table-column show-overflow-tooltip width="110" label="签到状态">
          <template slot-scope="scope">{{scope.row.checkStatus==0?'已签到':'已签退'}}</template>
        </el-table-column>
        <el-table-column prop="checkInTime" width="160" show-overflow-tooltip label="签到时间"></el-table-column>
        <el-table-column prop="checkOutTime" width="160" show-overflow-tooltip label="签退时间"></el-table-column>
        <el-table-column prop="insuranceBusinessNo" label="交易周期号"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click="signOut(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.checkStatus==0"
            >签退</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current="current"
      :totalCount="totalCount"
    ></ever-pagination>
  </div>
</template>
<script>
import list from '@/util/list'
import { page, signOut } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
let schema = [
  {
    label: '保险公司',
    name: 'insuranceOrgId',
    comp: medicalOrgList,
    props: {
      defaultFirst: true,
      clearable: false
    },
  }, {
    name: 'businessUserName',
    label: '业务员名称',
    comp: 'ever-staff-select',
    props: {
      fields: ['id', 'name']
    }
  },
  {
    label: '登记时间',
    name: 'registerTime',
    comp: 'everRangePicker',
    props: {
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    label: '',
    name: 'btns',
    comp: 'custom'
  }]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      tableData: []
    }
  },
  methods: {
    async signOut (row) {
      try {
        let params = {
          recordId: row.id,
          macId: this.macId
        }
        await signOut(params)
        this.$messageTips(this, 'success', '签退成功')
        this.list()
      } catch (err) {
        this.$messageTips(this, 'error', '签退失败')
      }
    },
    // 患者列表
    async list (flag) {
      this.loading = true
      let [checkInTimeStart, checkInTimeEnd] = this.queryObj.registerTime
      if (flag) {
        this.current = 1
        this.offset = 0
      }
      let params = { pagesize: this.pagesize, offset: this.offset }
      if (this.queryObj.businessUserName) {
        // 查询接口要的是名字
        params.businessUserName = this.queryObj.businessUserName.name
      }
      if (this.queryObj.registerTime.length >= 2) {
        params.checkInTimeStart = this.$moment(checkInTimeStart).format('YYYY-MM-DD 00:00:00')
        params.checkInTimeEnd = this.$moment(checkInTimeEnd).format('YYYY-MM-DD 23:59:59')
      }
      if (this.queryObj.insuranceOrgId) {
        params.insuranceOrgId = this.queryObj.insuranceOrgId
      }
      try {
        let data = await page(params)
        this.tableData = data.data
        this.totalCount = data.totalCount
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
    resetForm () {
      // 保存当前医保机构，重置后再赋值回来
      let insuranceOrgId = this.queryObj.insuranceOrgId
      this.$refs.form.resetForm()
      this.queryObj.insuranceOrgId = insuranceOrgId
      this.list(true)
    },
  }
}
</script>
