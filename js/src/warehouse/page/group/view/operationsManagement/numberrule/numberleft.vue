<template>
  <div class="left">
    <el-form :model="params" label-width="95px" class="bg">
      <el-form-item class="item" label="科室范围">
        <el-select
          class="wid"
          v-model="params.deptId"
          placeholder="全部科室"
          value-key="id"
          clearable
          filterable>
          <el-option v-for="item in deptList" :key="item.tenantSubjectCode" :value="item.tenantSubjectCode" :label="item.tenantSubjectName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item" label="启用状态">
        <el-select v-model="params.status" class="wid">
          <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="bggray">
      <el-form label-width="108px" class="add">
        <el-form-item label>
          <el-button type="primary" plain @click="addnew">新增规则</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        highlight-current-row
        class="tableboder"
        max-height="650"
        min-height="500"
        @row-click="handleRowChange"
      >
        <el-table-column prop="deptName" label="专科"></el-table-column>
        <el-table-column prop="resourceName" label="医生"></el-table-column>
        <el-table-column prop="serviceRelList" label="服务">
          <template slot-scope="scope">
            <div
              class="fontstyle"
              v-for="(item,index) in scope.row.serviceRules"
              :key="index"
            >{{item.serviceName}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="current"
        :page-size="pagesize"
        layout="prev, pager, next, jumper"
        :total="totalCount"
        class="page"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/arrange.js'
import appointapi from '@/arrange/store/appointapi'
export default {
  props: ['refresh'],
  data () {
    return {
      api,
      appointapi,
      addnum: 0,
      tableData: [],
      pagesize: Number(this.$route.query.pagesize) || 10,
      offset: 0,
      current: Number(this.$route.query.page) || 1,
      totalCount: 0,
      deptId: '',
      status: 1,
      state: [{ value: 1, label: '启用中' }, { value: 2, label: '停用中' }],
      deptList: [],
      params: {
        deptId: '',
        status: 1
      }
    }
  },
  watch: {
    'refresh' (v) {
      if (v) {
        this.tablelist()
      }
    },
    'params.status': {
      handler (val) {
        this.offset = 0
      },
      deep: true
    },
    'params.deptId': {
      handler (val) {
        this.offset = 0
      },
      deep: true
    },
    'params': {
      handler (v) {
        this.query(v)
      },
      deep: true
    }
  },
  created () {
    this.tablelist()
    this.getSectionVoListForService()
  },
  methods: {
    getSectionVoListForService () {
      let params = {
        type1CodeList: ['01'],
        type2CodeList: ['01.02'],
        // webHospitalDoctor: '0',
      }
      this.api.getTenantSubjectListByCondition(params).then(rs => {
        if (rs.head.errCode === 0 && rs.data.resultList) {
          this.deptList = rs.data.resultList
        }
      })
    },
    query (v) {
      this.$emit('chooseparams', v)
      this.deptId = v.deptId
      this.status = v.status
      this.tablelist()
    },
    tablelist () {
      let parms = {
        deptId: this.deptId,
        status: this.status,
        offset: this.offset,
        pagesize: this.pagesize
      }
      this.appointapi.search(parms).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount ? rs.data.totalCount : 0
        }
      })
    },
    handleRowChange (val) {
      let tempObj = {
        currentStatus: this.params.status
      }
      Object.assign(val, tempObj)
      this.$emit('chooseone', val)
    },
    addnew () {
      this.$emit('addnew', this.addnum++, this.params.status)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.tablelist()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.tablelist()
    }
  }
}
</script>
<style scoped>
.tableboder {
  width: 410px;
  margin: 0 auto;
  margin-bottom: 10px;
  /* min-height: 550px; */
}

.add {
  margin-top: 5px;
}
.border_bottom {
  border-bottom: 1px solid #d0d6df;
}
.page {
  float: right;
  margin-top: 6px;
  margin-bottom: 6px;
}
.bggray {
  background-color: #f6f7f9;
  padding-top: 10px;
}
.fontstyle {
  margin: 0px;
  padding: 0px;
  white-space: normal;
  margin-top: 5px;
  margin-bottom: 5px;
}
.bg {
  background: #e3e8ee;
  padding-top: 30px;
  padding-bottom: 1px;
  padding-left: 13px;
}
.wid {
  width: 350px;
}
.item {
  font-size: 14px;
  color: #999999;
}
</style>
