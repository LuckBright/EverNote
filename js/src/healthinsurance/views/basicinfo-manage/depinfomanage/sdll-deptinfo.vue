<template>
  <el-container class="flex_column_full pos_re" v-loading="loading">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button type="primary" size="small" @click="queryDeptList">医保科信息</el-button>
      </template>
      <div></div>
    </ever-form2>
    <template v-if="thcOrMedical">
      <el-container class="flex_column_full pos_re">
        <el-table
          class="no-margin-table flex_column_full_hidden"
          style="overflow:auto;"
          :data="tableData"
          border
          stripe
        >
          <el-table-column label="科室编号" prop="orgSubjectCode"></el-table-column>
          <el-table-column label="科室名称" prop="orgSubjectName"></el-table-column>
          <el-table-column label="注销日期" prop="chargerName"></el-table-column>
          <el-table-column label="注销标志" prop="chargerMobile">
            <template slot-scope="scope">{{scope.row.status == 'N'?'是':'否'}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="upload(scope.row)">上传</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <ever-pagination
        :current="current"
        :pagesize="pagesize"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </template>
    <el-container v-else class="flex_column_full pos_re">
      <el-table class="no-margin-table flex_column_full_hidden" :data="tableData" border stripe>
        <el-table-column label="科室编码" prop="ksbm"></el-table-column>
        <el-table-column label="科室名称" prop="ksmc"></el-table-column>
        <el-table-column label="起始日期" prop="qsrq"></el-table-column>
        <el-table-column label="终止日期" prop="zzrq"></el-table-column>
      </el-table>
    </el-container>
  </el-container>
</template>

<script>
import list from '@/util/list'
import {
  uploadDeptInfo,
  getDeptList,
  queryHospDept
} from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let schema = [
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
      thcOrMedical: true
    }
  },
  methods: {
    upload (row) {
      this.loading = true
      let params = {
        macId: this.macId,
        insuranceOrgId: sdllCode,
        sbjgbh: '37140101', // 医保局编号写死
        jsonPara: {
          ksbm: row.orgSubjectCode,
          ksmc: row.orgSubjectName,
          // zxrq:注销日期不填
          zxbz: 0
        }
      }
      uploadDeptInfo(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.loading = false
          this.$messageTips(this, 'success', '上传成功')
          this.list()
        }
      }).catch(rj => {
        this.loading = false
      })
    },
    list (refresh) {
      this.thcOrMedical = true
      this.loading = true
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      let params = {
        page: this.current,
        pagesize: this.pagesize,
        offset: (this.current - 1) * this.pagesize
      }
      getDeptList(params).then(rs => {
        if (!rs.head.errCode) {
          const { resultList, totalCount } = rs.data
          this.tableData = resultList
          this.totalCount = totalCount
          this.loading = false
        }
      }).catch(err => {
        console.log('err', err)
        this.tableData = []
        this.totalCount = 0
        this.loading = false
      })
    },
    // 获取医保端科室信息
    queryDeptList () {
      this.thcOrMedical = false
      this.loading = true
      this.tableData = []
      const params = {
        macId: this.macId,
        insuranceOrgId: sdllCode,
        sbjgbh: '37140101', // 医保局编号写死
        jsonPara: {
          filetype: 'json'
        }
      }
      queryHospDept(params).then(res => {
        const { dept_ds: tableData } = res.data
        this.tableData = tableData
        this.loading = false
      }).catch((err) => {
        console.log('err', err)
        this.loading = false
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
.query {
  width: 100%;
}
.middleLayer {
  text-align: right;
}
</style>
