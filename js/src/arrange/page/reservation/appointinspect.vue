<template>
  <div class="layout_box" id="appointIn">
    <div class="flex_column_1_hidden layout_inner">
      <div class="main-head">
        <el-form
          :model="queryObj"
          :inline="true"
          label-position="right"
          ref="queryObj"
          class="triageForm"
          size="small"
        >
          <el-form-item label label-width="0px" prop="patient.name" style="width:300px">
            <ever-patient-select
              v-if="show"
              v-model="queryObj.patient.name"
              @select="selectPatient"
              :allow-create="true"
              @newuser="resetPatient"
              style="width: 100%;"
            ></ever-patient-select>
          </el-form-item>
          <el-form-item label label-width="20px" prop="deptId">
            <dept-cascader v-model="selectDept" :template-type="1" style="width:100%"></dept-cascader>
          </el-form-item>
          <el-form-item label prop="date">
            <el-date-picker
              v-model="queryObj.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex_col_1_hidden main-wrap">
        <el-table
          height="100%"
          v-loading.body="loading"
          :show-header="true"
          :data="tableData"
          border
          style="width:100%"
        >
          <el-table-column prop="patientName" label="患者姓名"></el-table-column>
          <el-table-column prop="date" label="性别">
            <template
              slot-scope="scope"
            >{{scope.row.patient&&scope.row.patient.sex&&scope.row.patient.sex=='1'?'男':'女'}}</template>
          </el-table-column>
          <el-table-column prop="date" label="出生日期">
            <template
              slot-scope="scope"
              v-if="scope.row.patient"
            >{{ scope.row.patient.birthday | formatDateByExp('YYYY-MM-DD') }}</template>
          </el-table-column>
          <el-table-column prop="providerName" label="科室">
            <template slot-scope="scope">{{scope.row.providerName?scope.row.providerName:'--'}}</template>
          </el-table-column>
          <el-table-column prop="serviceName" label="服务"></el-table-column>
          <el-table-column prop="planExecutorTime" label="开单时间" width="260">
            <template slot-scope="scope">{{scope.row.createTime | formatDateByExp}}</template>
          </el-table-column>
          <el-table-column prop="appointmentDate" label="预约时间" width="260">
            <template slot-scope="scope" v-if="scope.row.appointmentDto">
              <span>{{ scope.row.appointmentDto.appointmentDate | formatDateByExp }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="appointmentStatus" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.appointmentStatus == 0">待预约</span>
              <span v-else-if="scope.row.appointmentStatus&&scope.row.appointmentStatus == 1">已预约</span>
              <span v-else-if="scope.row.appointmentStatus&&scope.row.appointmentStatus == -1">已取消</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作">
            <template slot-scope="scope">
              <addinspect
                @success="reload"
                :value="{id:scope.row.id,excuteProvider: scope.row.providerId, excuteProviderName: scope.row.providerName,serviceId:scope.row.serviceId,patientId:scope.row.patient.id,appointmentDto:scope.row.appointmentDto,visitNumber:scope.row.visitNumber}"
              ></addinspect>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/inspectapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import addinspect from '@/arrange/page/reservation/addinspect.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    return {
      api,
      schedulingapi,
      show: true,
      loading: true,
      deptList: [],
      queryObj: {
        serviceClassification: '800',
        date: '',
        selectDept: '',
        deptId: '',
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: ''
        }
      },
      selectDept: '',
      tableData: []
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        this.queryObj.startTime = this.queryObj.date && this.queryObj.date[0] ? this.$moment(this.queryObj.date[0]).format('YYYY-MM-DD') : ''
        this.queryObj.endTime = this.queryObj.date && this.queryObj.date[1] ? this.$moment(this.queryObj.date[1]).format('YYYY-MM-DD') : ''
        this.list()
      },
      deep: true
    },
    'queryObj.patient.name' (val) {
      if (!val) {
        this.queryObj.patientId = ''
        this.list()
      }
    },
    'selectDept' (val) {
      this.queryObj.deptId = val.id
    }
  },
  methods: {
    reload () {
      this.list()
    },
    selectPatient (val) {
      if (val && val.id) {
        this.queryObj.patientId = val.id
      }
    },
    resetPatient () {
      this.queryObj.patient = {
        agebirthday: '',
        name: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: ''
      }
    }
  },
  components: {
    addinspect,
    deptCascader
  }
}
</script>
<style scoped>
.btn_ml {
  margin-left: 50px;
}
#appointIn /deep/ .el-form--inline .el-form-item__content {
  width: 100%;
}
</style>

