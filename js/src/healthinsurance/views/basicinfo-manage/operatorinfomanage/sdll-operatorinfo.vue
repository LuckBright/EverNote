<template>
  <el-container class="flex_column_full" v-loading="loading">
    <ever-form2 :inline="true" :schema="schema" v-model="obj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-container class="flex_column_full pos_re mt20">
      <!-- THC操作员信息 -->
      <el-table
        :data="tableData"
        border
        stripe
        class="no-margin-table flex_column_full_hidden docTable"
      >
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="uploadDocInfo(scope.row)">上传</el-button>
          </template>
        </el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="医师编号"
          prop="id"
          width="90"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="姓名"
          prop="name"
          width="90"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="性别"
          prop="gender"
        >
          <template slot-scope="scope">{{scope.row.gender | formatSex}}</template>
        </el-table-column>
        <el-table-column label="身份证号码" prop="cardNumber" width="170"></el-table-column>
        <el-table-column label="科室编码" prop="deptCode" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="医师状态">
          <template slot-scope="scope">{{scope.row.status=='Y'?'正常':''}}</template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday" width="110"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="职务" prop="administrativePosition"></el-table-column>
        <el-table-column label="执业医师证编号" prop="practiceCertificateNo" width="120"></el-table-column>
        <el-table-column label="注册医师证编号" prop="practiceCertificateNo" width="120"></el-table-column>
        <el-table-column label="医师职称" prop="skillsTitle2Name" width="100"></el-table-column>
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
  pageList
} from '@/healthinsurance/store/syyb.insurance.js'
import { addCzy } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import filters from '@/healthinsurance/components/filters.js'
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
  mixins: [list, filters],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      thcOrMedical: true
    }
  },
  methods: {
    uploadDocInfo (row) {
      if (this.checkParams(row)) {
        this.loading = true
        let params = {
          macId: this.macId,
          insuranceOrgId: sdllCode,
          sbjgbh: '37140101', // 医保局编号写死
          jsonPara: {
            rybh: row.id,
            xm: row.name,
            xb: row.gender,
            password: 666666,
            zxbz: 0
          }
        }
        addCzy(params).then(rs => {
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
      } else {
        this.$messageTips(this, 'error', '该数据缺少必要参数，请选择其他数据或者完善必填参数后再试')
      }
    },
    list () {
      this.thcOrMedical = true
      this.loading = true
      let params = {
        outStaffGetStaffListByConditionReqDTO: {
          offset: this.offset,
          pagesize: this.pagesize,
          // typeCodeList: ['FINANCE']
        }
      }
      pageList(params).then(rs => {
        if (!rs.head.errCode) {
          this.initData(rs.data.resultList)
          this.totalCount = rs.data.totalCount
          this.loading = false
        }
      }).catch(err => {
        console.log('err', err)
        this.loading = false
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
          deptCode: item.tsStaffSubjectList && item.tsStaffSubjectList[0] && item.tsStaffSubjectList[0]['orgSubjectCode'],
          contactNumber: item.mobile,
          practiceCertificateNo: item.tsStaffFileList && item.tsStaffFileList[0] && item.tsStaffFileList[0]['fileNo'],
          practiceRegDate: time ? this.$moment(time).format('YYYYMMDD') : ''
        }
        tableData.push({ ...item, ...obj })
      })
      this.tableData = tableData
    },
    checkParams (row) {
      return row.id && row.name && (`${row.gender}`)
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
.el-table.docTable /deep/ th > .requiredClass,
.el-table.docTable /deep/ td.requiredClass > .cell {
  color: red;
}
</style>
