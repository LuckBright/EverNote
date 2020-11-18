<template>
  <div>
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2
          :schema="querySchema"
          v-model="obj"
          :inline="true"
          style="width: calc(100% - 110px)"
          @query="customList">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
            <el-button size="small" class="btnW" @click="handlerReset">重置</el-button>
          </template>
        </ever-form2>
      </div>
      <el-table
        v-loading.body="loading"
        border
        :data="tableData">
        <el-table-column align="center" width="60">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column align="center" prop="code" label="采购单号">
          <template slot-scope="scope">
            <a
              @click="handlerRoute(scope.row)"
            >{{scope.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column align="center" label="汇总单号">
          <template slot-scope="scope">
            <a
              v-if="scope.row.summaryCode"
              @click="$router.push('/goods/summarydetail/' + scope.row.summaryId + '?status=2')"
            >{{scope.row.summaryCode}}</a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" v-if="isNew" align="center"></el-table-column>
        <el-table-column align="center" prop="totalPrice" label="采购单总金额" width="200">
          <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial(4)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="operatorName" label="创建人" width="100"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="160px">
          <template slot-scope="scope">
            <span>{{scope.row.createTime || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="采购单状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{setName(FULL_STATE.purchase, scope.row.status, true)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from './purcheasenewapi'
import customList from '@/warehouse/page/storages/util/customList'
import sets from '@/util/setstatusname'
import { FULL_STATE, drugOrMaterialType, MATERIA_TYPE_OPTIONS } from '@/util/common'
import beforeRouteEnter from '@/warehouse/page/storages/util/beforer.route.enter.js'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'
var querySchema = [
  {
    name: 'code',
    label: '采购单号',
    style: 'width: 200px'
  },
  {
    name: 'summaryCode',
    label: '汇总单号',
    style: 'width: 200px'
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', splitFlag: 0 },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '序号',
    name: 'printCode',
    style: {
      width: '100px'
    }
  },
  {
    name: 'materialType',
    label: '物资类型',
    comp: 'sys-select',
    props: {
      options: MATERIA_TYPE_OPTIONS
    },
    style: 'width: 100px'
  }
]
export default {
  mixins: [customList, sets, beforeRouteEnter, printCodeSettingMixmins],
  props: {
    isNew: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      drugOrMaterialType,
      MATERIA_TYPE_OPTIONS,
      querySchema,
      api,
      supplierLocalId: this.$route.params.supplierId,
      FULL_STATE,
      obj,
    }
  },
  created () {
    this.obj.supplyMode = '1'
    this.querySchema = this.createdSchema(this.querySchema)
    this.customList()
  },
  activated () {
    this.customList()
  },
  methods: {
    handlerRoute (v) { // 跳转查看或者新建页面
      this.$router.push(v.status !== 1 ? '/goods/focusdrugpurchease/' + v.id + '?focus=focus' : `/goods/drugpurcheaseadd/${v.id}?status=${v.status}`)
    },
    handlerReset () { // 重置
      this.obj = this.$ever.createObjFromSchema(querySchema)
    },
    handlerQuery () {
      this.customList(true)
    },
    customList: function (flag) {
      let params = {}
      params.offset = flag ? 0 : this.offset
      params.pagesize = this.pagesize
      Object.assign(params, this.obj)
      if (!this.isNew) params.supplierLocalId = this.supplierLocalId
      params.purchaseType = 2
      this.api.list(params).then(res => {
        if (res && res.list) {
          let results = JSON.parse(JSON.stringify(res.list))
          this.tableData = results
          this.totalCount = res.totalCount
          if (flag) this.current = 1
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
.btnW {
  width: 60px;
}
</style>
