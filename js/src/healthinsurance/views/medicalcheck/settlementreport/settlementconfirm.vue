<template>
  <div class="layout_inner" v-loading="loading">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="middleLayer">
      <el-button class="btnRight" type="primary" size="small" @click="upload(false)">上传</el-button>
    </div>
    <el-table
      class="table"
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="结算单ID" prop="insuranceSettlementId"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="sex">
        <template slot-scope="scope">
          {{scope.row.sex | formatSex}}
        </template>
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday"></el-table-column>
      <el-table-column label="就诊流水号" prop="visitNumber"></el-table-column>
      <el-table-column label="单据号" prop="settleCode"></el-table-column>
      <el-table-column label="经办人" prop="createName"></el-table-column>
      <el-table-column label="经办日期" prop="updateTime">
        <template slot-scope="scope">
          {{$moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column label="确认标志" prop="confirmMark">
        <template slot-scope="scope">
          {{scope.row.confirmMark ? '已上传' : '未上传'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="upload(scope.row)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </div>
</template>

<script>
import list from '@/util/list'
import {
  getSettleInfos,
  settleConfirm
} from '@/healthinsurance/store/syyb.insurance.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let schema = [
  {
    label: '上传标识',
    name: 'confirmMark',
    comp: 'ever-select',
    props: {
      options: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '2',
          name: '已上传'
        }, {
          id: '0',
          name: '未上传'
        }
      ]
    }
  },
  {
    label: '',
    name: 'btns',
    labelWidth: '15px',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      loading: false,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    upload (row) {
      let params = {
        macId: this.macId,
        insuranceOrgId: sysqzyyCode,
        info: []
      }
      if (row) {
        params.info = [{insuranceSettlementId: row.insuranceSettlementId, settleCode: row.settleCode, visitNumber: row.visitNumber}]
      } else {
        params.info = this.multipleSelection.map(item => { return {insuranceSettlementId: item.insuranceSettlementId, settleCode: item.settleCode, visitNumber: item.visitNumber} })
      }
      if (!params.info.length) {
        this.$messageTips(this, 'error', '请选择上传数据')
        return
      }
      this.loading = true
      settleConfirm(params).then(rs => {
        if (!rs.head.errCode) {
          this.loading = false
          this.$messageTips(this, 'success', '上传成功')
          this.list()
        }
      }).catch(rj => {
        this.loading = false
      })
    },
    list () {
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        confirmMark: this.obj.confirmMark ? Number(this.obj.confirmMark) : ''
      }
      getSettleInfos(params).then(rs => {
        if (!rs.head.errCode) {
          this.tableData = rs.data
          this.totalCount = rs.totalCount
        }
      })
    }
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
.table {
  overflow: auto;
}
.query {
  width: 100%;
}
.middleLayer {
  text-align: right;
}
</style>
