<template>
  <div>
    <p>
      <span>科室</span>
      <el-select class="select-mr" v-model="orgValue" filterable clearable placeholder="请选择" size="small">
        <el-option
          v-for="item in orgOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
      <span>职称</span>
      <el-select class="select-mr"  v-model="zcValue" filterable clearable placeholder="请选择" size="small">
        <el-option
          v-for="item in zcOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
      <span>姓名</span>
      <el-input class="select-mr" placeholder="请输入姓名" v-model="nameValue" size="small" style="width: 20%"></el-input>
      <el-button type="primary" @click="list(1)">查询</el-button>
    </p>
    <el-table
      :data="tableData"
      border
      size="small"
      height="500px"
      style="width: 100%">
      <el-table-column width="30">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.row.docId">{{''}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="doctorName"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="科室">
      </el-table-column>
      <el-table-column
        prop="skillTitle2Name"
        label="职称">
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>
<script>
import list from '@/titancare/mixins/list.js'
import api from '@/titancare/api/content/live'
export default {
  mixins: [list],
  data () {
    return {
      orgOptions: [],
      zcOptions: [],
      orgValue: '',
      zcValue: '',
      tableData: [],
      radio: '',
      rowInfo: '',
      nameValue: ''
    }
  },
  created () {
    this.getDocList()
    this.getZcList()
    this.list()
  },
  methods: {
    list (isTrue) {
      if (isTrue) this.offset = 0
      let params = {
        outStaffGetStaffListByConditionReqDTO: {
          practiceOrgIdList: [],
          tenantSubjectIdList: this.orgValue ? [this.orgValue] : [],
          skillsTitle2CodeList: this.zcValue ? [this.zcValue] : [],
          webHospitalDoctor: '1',
          mobileList: [],
          nameList: this.nameValue ? [this.nameValue] : [],
          pagesize: this.pagesize,
          offset: this.offset,
          typeCodeList: ['DOCTOR'],
          skillsTitle1CodeList: []
        },
        outOrgGetOrgListByConditionReqDTO: {
          idList: []
        },
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          orgIdList: [],
          idList: this.orgValue ? [this.orgValue] : []
        }
      }
      this.tableData = []
      api.getStaffListHasOrgHasSubjectByCondition(params).then(rs => {
        if (!rs.errCode) {
          this.totalCount = rs.data.totalCount
          rs.data.resultList.forEach(item => {
            let obj = {}
            obj.skillTitle1Code = item.skillsTitle1Code
            obj.skillTitle1Name = item.skillsTitle1Name
            obj.skillTitle2Code = item.skillsTitle2Code
            obj.skillTitle2Name = item.skillsTitle2Name
            obj.doctorName = item.name
            obj.doctorId = item.id
            obj.docId = item.id
            obj.doctorFaceUrl = item.faceUrl
            obj.faceUrl = item.faceUrl
            obj.tenantId = item.tenantId
            if (item.tsStaffOrganizationList.length && item.tsStaffOrganizationList[0].tsStaffSubjectList.length) {
              let list = item.tsStaffOrganizationList[0].tsStaffSubjectList[0]
              obj.deptName = list.orgSubjectName
              obj.deptId = list.orgSubjectCode
              obj.orgName = item.tsStaffOrganizationList[0].name
            }
            this.tableData.push(obj)
          })
        }
      })
    },
    // 查询医生
    getDocList () {
      let params = {
        orgIdList: [localStorage.getItem('CLINICID')],
        pagesize: 9999,
        offset: 0
      }
      api.getTenantSubjectListByCondition(params).then(rs => {
        if (!rs.errCode) {
          rs.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.orgSubjectCode
            obj.label = item.tenantSubjectName
            this.orgOptions.push(obj)
          })
        }
      })
    },
    // 查询职称
    getZcList () {
      api.getValueListBySetCode({ 'setCode': ['THC_WH_RYZC2'] }).then(rs => {
        if (!rs.errCode) {
          rs.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.code
            obj.label = item.name
            this.zcOptions.push(obj)
          })
        }
      })
    }
  },
  watch: {
    radio (n, l) {
      this.rowInfo = this.tableData.filter(item => item.docId === n)[0]
    }
  }
}
</script>
<style lang="less" scoped>
  .select-mr {
    margin: 0 15px 0 5px;
  }
  .pagination {
    text-align: right;
  }
</style>
