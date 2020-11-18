<template>
  <div class="layout_box" id="inspectUpdate">
    <div class="flex_column_1_hidden layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list(true)"
          :is-query="true"
          :inline="true"
        >
          <template slot="patientName">
            <ever-patient-select
              v-model="queryObj.patientName"
              :allow-create="true"
              @select="selectPatient"
            ></ever-patient-select>
          </template>
          <template slot="deptObj">
            <dept-cascader v-model="queryObj.deptObj" :template-type="1"></dept-cascader>
          </template>
          <template slot="daterange">
            <ever-range-picker
              :start.sync="queryObj.startDate"
              :end.sync="queryObj.endDate"
              @change="list(true)"
            ></ever-range-picker>
          </template>
        </ever-form2>
        <!-- <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
                  <template slot="deptObj">
                    <dept-cascader v-model="queryObj.deptObj"></dept-cascader>
                  </template>
        </ever-query-form>-->
        <div class="main-option">
          <el-button type="primary" @click="addAppoint">预约检查</el-button>
        </div>
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
          <el-table-column prop="patientName" show-overflow-tooltip label="患者姓名" width="120"></el-table-column>
          <el-table-column prop="date" show-overflow-tooltip label="性别" width="80">
            <template slot-scope="scope" v-if="scope.row.sex">
              <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="birth" show-overflow-tooltip label="出生日期" width="105">
            <template
              slot-scope="scope"
              v-if="scope.row.birth"
            >{{ scope.row.birth | formatDateByExp('YYYY-MM-DD') }}</template>
          </el-table-column>
          <el-table-column prop="deptName" show-overflow-tooltip label="科室"  width="200">
            <template slot-scope="scope">{{scope.row.deptName?scope.row.deptName:'--'}}</template>
          </el-table-column>
          <el-table-column prop="projectName" show-overflow-tooltip label="项目"></el-table-column>
          <el-table-column prop="orderTime" show-overflow-tooltip width="170" label="开单时间">
            <template slot-scope="scope">{{scope.row.orderTime | formatDateByExp}}</template>
          </el-table-column>
          <el-table-column prop="appointmentDate" show-overflow-tooltip width="170" label="预约时间">
            <template slot-scope="scope" v-if="scope.row.appointmentTime">
              <span>{{ scope.row.appointmentTime | formatDateByExp }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" show-overflow-tooltip label="状态" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.status?statusObj[scope.row.status]:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dataType" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <ever-confirm
                :msg="'确定取消此预约吗？'"
                action="取消"
                @confirm="cancel(scope.row)"
                v-if="scope.row.status===1&&scope.row.dataType===3"
              ></ever-confirm>
              <el-button
                type="primary"
                size="small"
                @click="addAppoint(scope.row)"
                v-if="scope.row.dataType!=3&&!scope.row.appointmentRecordId"
              >预约</el-button>
              <el-button
                type="primary"
                size="small"
                @click="addAppoint(scope.row)"
                v-if="scope.row.dataType!=3&&scope.row.appointmentRecordId"
              >改约</el-button>
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
    <dialog-addinspect ref="addinspect" @success="appointSuccess"></dialog-addinspect>
    <send-message ref="sendmessage" :users="sendPatient" :disabled="true" :allparams="allparams"></send-message>
  </div>
</template>
<script>
import api from '@/arrange/store/addinspectapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import dialogAddinspect from '@/arrange/page/reservation/dialog-addinspect.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import list from '@/util/list'
import sendMessage from '@/crm/page/sendmessage'
let querySchema = [
  {
    name: 'searchType',
    comp: 'select',
    label: '类型',
    props: {
      options: [
        { id: '1', name: '检查单' },
        { id: '2', name: '预约信息' }
      ],
      placeholder: '请选择类型',
      clearable: false
    }
  },
  {
    name: 'patientName',
    placeholder: '输入患者姓名',
    comp: 'custom',
    label: '患者',
    options: []
  },
  {
    name: 'deptObj',
    label: '科室',
    comp: 'custom'
  },
  {
    name: 'daterange',
    label: '预约时间',
    comp: 'custom', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
    span: 24
  }
]

export default {
  mixins: [list],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.startDate = ''
    queryObj.endDate = ''
    queryObj.searchType = '1'
    querySchema.patientName = {}
    return {

      api,
      schedulingapi,
      show: true,
      loading: true,
      deptList: [],
      queryObj,
      querySchema,
      selectDept: '',
      tableData: [],
      sendPatient: '',
      isShow: true,
      statusObj: {
        '-5': '等待',
        '-4': '待支付',
        '-3': '爽约',
        '-2': '迟到',
        '-1': '已取消',
        '0': '待确认',
        '1': '预约成功',
        '2': '已到诊',
        '3': '已接诊',
        '4': '接诊完毕',
        '9': '已结诊'
      },
      allparams: {}
    }
  },
  watch: {
    'queryObj.deptObj': {
      handler (val) {
        if (val) {
          this.queryObj.deptId = val.deptId
        } else {
          this.queryObj.deptId = ''
        }
        console.log(this.queryObj, 'this.queryObj')
        this.query(this.queryObj)
      },
      deep: true
    },
    'queryObj.patientName': {
      handler: function (val, oldval) {
        if (!val) {
          this.queryObj.patientId = ''
          this.list(true)
        }
      }
    }
  },
  methods: {
    addAppoint (data) {
      if (!data) {
        data = {}
      }
      data.searchType = this.queryObj.searchType
      this.$refs.addinspect.open(data)
    },
    reload () {
      this.list()
    },
    selectPatient (val) {
      if (val && val.id) {
        this.queryObj.patientId = val.id
        this.list(true)
      }
    },
    appointSuccess (val) {
      this.list()
      this.allparams = val.allparams
      this.allparams.msgType = 108
      if (val.sendMessage) {
        this.sendPatient = val.patient
        this.$refs.sendmessage.sendVisible = true
      }
    },
    cancel (val) {
      this.api.cancelAppoint({ appointmentRecordId: val.appointmentRecordId, isSendSms: 0 }).then(rs => {
        if (rs && rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '取消预约成功', '提示')
          this.list()
        }
      })
    }
  },
  components: {
    dialogAddinspect,
    deptCascader,
    sendMessage
  }
}
</script>
