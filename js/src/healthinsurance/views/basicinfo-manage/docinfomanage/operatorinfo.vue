<template>
  <el-container class="flex_column_full" v-loading="loading">
    <div class="middleLayer">
      <el-button class="btnRight" type="primary" size="small" @click="upload(false)">上传</el-button>
    </div>
    <el-container class="flex_column_full pos_re mt20">
      <el-table :data="tableData" border stripe @selection-change="handleSelectionChange" class="no-margin-table flex_column_full_hidden">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="医生/操作员编号" prop="id" width="175"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="性别" prop="gender">
          <template slot-scope="scope">{{scope.row.gender | formatSex}}</template>
        </el-table-column>
        <el-table-column label="医师级别" prop="level">
          <template slot-scope="scope">{{scope.row.level | doctorLevel}}</template>
        </el-table-column>
        <el-table-column label="科室名称" prop="deptName" width="110"></el-table-column>
        <el-table-column label="职称" prop="title" width="110">
          <template slot-scope="scope">{{scope.row.title | doctorLevel}}</template>
        </el-table-column>
        <el-table-column label="行政职务" prop="administrativePosition"></el-table-column>
        <el-table-column label="身份证号" prop="idNo"></el-table-column>
        <el-table-column label="联系电话" prop="contactNumber"></el-table-column>
        <el-table-column label="执业证书编号" prop="practiceCertificateNo" width="120"></el-table-column>
        <el-table-column label="执业范围" prop="practiceArea"></el-table-column>
        <el-table-column label="执业证书注册日期" prop="practiceRegDate" width="90"></el-table-column>
        <el-table-column label="主治疾病内容" prop="mainDisease"></el-table-column>
        <el-table-column label="疾病种类" prop="diseaseCategory"></el-table-column>
        <el-table-column label="医院人员类别" prop="hospitalPersonnelCategory"></el-table-column>
        <el-table-column label="医院经办人" prop="hospitalManager"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="upload(scope.row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </el-container>
</template>

<script>
import list from '@/util/list'
import {
  uploadDoctorInfo,
  pageList
} from '@/healthinsurance/store/syyb.insurance.js'
import filters from '@/healthinsurance/components/filters.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let schema = [
  {
    label: '上传标识',
    comp: 'ever-select',
    props: {
      options: [{
        id: '1',
        name: '全部'
      },
      {
        id: '2',
        name: '已上传'
      }, {
        id: '3',
        name: '未上传'
      }]
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
  mixins: [list, filters],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
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
        param: []
      }
      if (row) {
        params.param = [row]
      } else {
        params.param = this.multipleSelection
      }
      if (!params.param.length) {
        this.$messageTips(this, 'error', '请选择上传数据')
        return
      }
      this.loading = true
      uploadDoctorInfo(params).then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '上传成功')
          this.list()
        } else {
          this.$messageTips(this, 'error', '上传失败')
        }
        this.loading = false
      }).catch(rj => {
        this.loading = false
        this.$messageTips(this, 'error', '上传失败')
      })
    },
    list () {
      let params = {
        outStaffGetStaffListByConditionReqDTO: {
          offset: this.offset,
          pagesize: this.pagesize,
          typeCodeList: ['DOCTOR']
        }
      }
      pageList(params).then(rs => {
        if (!rs.head.errCode) {
          this.initData(rs.data.resultList)
          this.totalCount = rs.data.totalCount
        }
      })
    },
    initData (data) {
      let tableData = []
      data.forEach(item => {
        let time = item.tsStaffFileList && item.tsStaffFileList[0] && item.tsStaffFileList[0]['certificateTime']
        let obj = {
          id: item.jobNumber,
          name: item.name,
          gender: item.genderName === '男性' ? 1 : item.genderName === '女性' ? 2 : 9,
          level: this.$options.filters.doctorLevelCode(item.skillsTitle2Name),
          deptName: item.tsStaffSubjectList && item.tsStaffSubjectList[0] && item.tsStaffSubjectList[0]['orgSubjectName'],
          title: this.$options.filters.doctorLevelCode(item.skillsTitle2Name),
          administrativePosition: '',
          idNo: '',
          contactNumber: item.mobile,
          practiceCertificateNo: item.tsStaffFileList && item.tsStaffFileList[0] && item.tsStaffFileList[0]['fileNo'],
          practiceArea: '',
          practiceRegDate: time ? this.$moment(time).format('YYYYMMDD') : '',
          mainDisease: '',
          diseaseCategory: '',
          hospitalPersonnelCategory: '',
          hospitalManager: '',
          remark: '',
        }
        tableData.push(obj)
      })
      this.tableData = tableData
    }
  }
}
</script>
<style scoped>
.query {
  width: 100%;
}
.middleLayer {
  text-align: right;
}
</style>
