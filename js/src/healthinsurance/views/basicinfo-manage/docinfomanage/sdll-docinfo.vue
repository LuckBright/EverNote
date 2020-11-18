<template>
  <el-container class="flex_column_full" v-loading="loading">
    <ever-form2 :inline="true" :schema="schema" v-model="obj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button type="primary" size="small" @click="getMedicalDocList">医保端医师信息查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-container class="flex_column_full pos_re mt20">
      <!-- THC医师信息 -->
      <el-table
        v-show="thcOrMedical"
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
          width="80"
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
          width="70"
        >
          <template slot-scope="scope">{{scope.row.gender | formatSex}}</template>
        </el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="身份证号码"
          prop="cardNumber"
          width="170"
        ></el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="科室编码"
          prop="deptCode"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="医师状态"
          prop="status"
        >
          <template slot-scope="scope">{{scope.row.status=='Y'?'正常':''}}</template>
        </el-table-column>
        <el-table-column
          class-name="requiredClass"
          label-class-name="requiredClass"
          label="出生日期"
          prop="birthday"
          width="110"
        ></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="职务" prop="administrativePosition"></el-table-column>
        <el-table-column label="执业医师证编号" prop="practiceCertificateNo" width="150"></el-table-column>
        <el-table-column label="注册医师证编号" prop="practiceCertificateNo" width="150"></el-table-column>
        <el-table-column label="医师职称" prop="skillsTitle2Name" width="100"></el-table-column>
      </el-table>
      <!-- 医保端医师信息 -->
      <el-table
        class="no-margin-table flex_column_full_hidden"
        v-show="!thcOrMedical"
        :data="tableData"
        border
        stripe
      >
        <el-table-column label="医师编号" prop="ysbm"></el-table-column>
        <el-table-column label="姓名" prop="xm"></el-table-column>
        <el-table-column label="性别" prop="xb">
          <template slot-scope="scope">{{scope.row.xb | formatSex}}</template>
        </el-table-column>
        <el-table-column label="身份证号码" prop="sfzhm" width="170"></el-table-column>
        <el-table-column label="科室编码" prop="ksbm" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="医师状态" prop="yszt">
          <template slot-scope="scope">{{scope.row.yszt | docType}}</template>
        </el-table-column>
        <el-table-column label="出生日期" prop="csrq" width="110"></el-table-column>
        <el-table-column label="备注" prop="bz"></el-table-column>
        <el-table-column label="职务" prop="zw" width="100"></el-table-column>
        <el-table-column label="执业医师编号" prop="zyyszbh" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="注册医师编号" prop="zcyszbh" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="医师职称" prop="yszc" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="执业类别" prop="zylb">
          <template slot-scope="scope">{{scope.row.zylb | doczylb}}</template>
        </el-table-column>
        <el-table-column label="执业范围" prop="zyfw">
          <template slot-scope="scope">{{scope.row.zyfw | doczyfw}}</template>
        </el-table-column>
        <el-table-column label="执业地点" prop="zydd" width="120"></el-table-column>
        <el-table-column label="医院人员类别" prop="yzrylb"></el-table-column>
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
import { addYs, queryYs } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { docType, doczyfw, doczylb } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'
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
            ysbm: row.id,
            xm: row.name,
            xb: row.gender,
            sfzhm: row.cardNumber, // 身份证号码
            ksbm: row.deptCode,
            yszt: 1, // 1:正常，2:注销，3:暂停，其他具体值调用数据字典接口获取，代码编号：YSZT
            csrq: row.birthday
          }
        }
        addYs(params).then(rs => {
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
          typeCodeList: ['DOCTOR']
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
        this.totalCount = 0
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
          administrativePosition: '',
          contactNumber: item.mobile,
          practiceCertificateNo: item.tsStaffFileList && item.tsStaffFileList[0] && item.tsStaffFileList[0]['fileNo'],
          practiceRegDate: time ? this.$moment(time).format('YYYYMMDD') : '',
        }
        tableData.push({ ...item, ...obj })
      })
      this.tableData = tableData
    },
    getMedicalDocList () {
      this.thcOrMedical = false
      this.$nextTick(_ => {
        this.loading = true
        const params = {
          macId: this.macId,
          insuranceOrgId: sdllCode,
          sbjgbh: '37140101', // 医保局编号写死
          jsonPara: {
            filetype: 'json'
          }
        }
        queryYs(params).then(res => {
          const { ys_ds: tableData } = res.data
          this.tableData = tableData
          this.totalCount = 0
          this.loading = false
        }).catch((err) => {
          this.tableData = []
          this.totalCount = 0
          this.loading = false
          console.log('err', err)
        })
      })
    },
    checkParams (row) {
      return row.id && row.name && (`${row.gender}`) && row.cardNumber && row.deptCode && row.birthday
    }
  },
  filters: {
    docType (val) {
      return docType[val]
    },
    doczyfw (val) {
      return doczyfw[val]
    },
    doczylb (val) {
      return doczylb[val]
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
