<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        @query="list(true)"
      >
        <template slot="default">
          <el-form-item>
            <el-button @click="list(true)" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button @click="add" type="primary">新建受限客户</el-button>
          </el-form-item>
        </template>
        <template slot="scopeType">
          <el-row>
            <el-col :span="queryObj.scopeType == 2 ? 10 : 22">
              <ever-select v-model="queryObj.scopeType" :options="range" :clearable="true"></ever-select>
            </el-col>
            <el-col :span="12" class="ml10" v-show="queryObj.scopeType == 2">
              <ever-staff-select v-model="queryObj.scopeContent" :params="{ typeCodeList: [STAFF_TYPE[0].id] }" :clearable="true" type="select" fields="id"></ever-staff-select>
            </el-col>
          </el-row>
        </template>
      </ever-form2>
    </div>
    <div class="flex_col_1_hidden main-wrap">
      <el-table style="height:100% !important;" :data="tableData" border>
        <el-table-column label="姓名" align="center" :span="2" prop="name">
          <template slot-scope="scope">{{scope.row.patient && scope.row.patient.name || '--'}}</template>
        </el-table-column>
        <el-table-column label="标签" align="center" :span="2">
          <template
            slot-scope="scope"
          >{{scope.row.patient && scope.row.patient.member && scope.row.patient.member.labelNames || '--'}}</template>
        </el-table-column>
        <el-table-column label="添加日期" align="center" :span="2">
          <template slot-scope="scope">{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="限制期" align="center" :span="1">
          <template slot-scope="scope">
            <span v-if="scope.row.timeWay == 1">永久</span>
            <span v-else>{{scope.row.timeNum}}{{timeTypeArr[scope.row.timeType]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="失效日期" align="center" :span="2">
          <template slot-scope="scope">
            <span v-if="scope.row.timeWay == 1">{{'永不失效'}}</span>
            <span v-else>{{$moment(scope.row.invalidTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="受限范围" align="center" :span="2">
          <template slot-scope="scope">
            <span v-if="scope.row.scopeType == 1">全集团</span>
            <span
              v-show="scope.row.scopeType == 2"
            >医生：{{scope.row.scopeDoctorNames && scope.row.scopeDoctorNames.map(item => item.name).join()}}</span>
          </template>
        </el-table-column>
        <el-table-column label="受限业务" align="center" :span="1">
          <template slot-scope="scope">
            <span
              class="cBlue"
              v-show="scope.row.service"
              @click="showInfo(scope.row.id)"
            >{{scope.row.service.split(',').map(item => serviceType[item]).join()}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="reason" label="备注" align="center" :span="3"></el-table-column>
        <el-table-column label="状态" :span="2" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">生效中</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :span="2" fixed="right">
          <template slot-scope="scope" v-if="scope.row.status == 1">
            <el-button type="primary" size="small" @click="edit(scope.row.id)">修改</el-button>
            <el-button type="danger" size="small" @click="stopped(scope.row.id)">停用</el-button>
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
    <dialog-restrict
      ref="restrict"
      :visible="showRestrict"
      :title="title"
      @update="update"
      :id="rowId"
      :editHide="editHide"
      :isreadOnly="isreadOnly"
      :isEdit="isEdit"
      @change="change"
    ></dialog-restrict>
  </div>
</template>
<script>
import dialogRestrict from '@/crm/page/member/dialog.restrict'
import utillist from '@/util/list'
import api from '@/crm/store/greydenyapi'
import { STAFF_TYPE } from '@/crm/util/common'
let querySchema = [
  {
    name: 'patientId',
    label: '患者',
    comp: 'ever-patient-select-query',
    props: {
      placeholder: '输入患者姓名、患者档案号',
      clearable: true,
    },
  },
  {
    name: 'service',
    label: '限制业务',
    comp: 'sys-type',
    props: {
      code: 'THC_CRM_DENY_SERVICE',
      useValue: true,
      placeholder: '全部'
    }
  },
  {
    name: 'scopeType',
    label: '限制范围',
    comp: 'custom'
  },
  {
    name: 'status',
    label: '状态',
    comp: 'el-select',
    props: {
      options: [
        {
          value: '1',
          label: '生效中'
        },
        {
          value: '2',
          label: '停用'
        }
      ]
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.scopeType = ''
    return {
      api,
      queryObj,
      querySchema,
      rangeValue: '',
      range: [
        {
          id: '1',
          name: '集团'
        }, {
          id: '2',
          name: '医生'
        }
      ],
      timeTypeArr: {
        1: '年',
        2: '月',
        5: '天'
      },
      serviceType: {
        '1': '预约',
        '2': '挂号'
      },
      tempList: [],
      rowId: '',
      isDisabled: false,
      showRestrict: false,
      isreadOnly: false,
      isEdit: false,
      editHide: false,
      title: '添加用户限制',
      STAFF_TYPE
    }
  },
  watch: {
    'queryObj.scopeType': {
      handler (val) {
        this.isDisabled = val === '1'
        if (val === '1') this.queryObj.scopeContent = ''
      }
    },
  },
  created () {},
  methods: {
    reset () {
      Object.keys(this.queryObj).forEach(key => {
        this.queryObj[key] = ''
      })
      this.list(true)
    },
    add () {
      this.showRestrict = true
      this.isEdit = false
      this.isreadOnly = false
      this.editHide = false
      this.rowId = ''
      this.title = '添加用户限制'
      this.$refs.restrict.open()
    },
    update (val) {
      this.showRestrict = val
      this.list(true)
    },
    edit (val) {
      this.rowId = val
      this.showRestrict = true
      this.isEdit = true
      this.editHide = true
      this.isreadOnly = false
      this.title = '修改用户限制'
      this.$refs.restrict.open()
    },
    stopped (id) {
      this.$confirm('你确定要停用此用户的业务限制吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.stop({ 'id': id }).then(rs => {
          if (rs.head.errCode === 0) {
            this.list(true)
          }
        })
      }).catch(() => {})
    },
    showInfo (val) {
      this.showRestrict = true
      this.isreadOnly = true
      this.editHide = true
      this.rowId = val
      this.title = '用户限制'
      this.$refs.restrict.open()
    },
    change (val) {
      this.isreadOnly = false
      this.isEdit = true
    }
  },
  components: {
    dialogRestrict
  }
}
</script>
<style scoped>
</style>

