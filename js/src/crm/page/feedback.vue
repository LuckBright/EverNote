<template>
  <div id="consultlist" class="layout_inner">
    <div class="main-head">
      <ever-form2
      v-model="queryObj"
      ref="form"
      :schema="querySchema"
      :inline="true"
      :is-query="true"
      :has-ext="false"
      :ext-class-name="'fr'"
      @query="list(true)">
      </ever-form2>
      <div class="main-option">
        <el-button :disabled="selected.length==0" @click="sendMessage">发短信</el-button>
        <el-button type="primary" @click="addConsult">添加反馈</el-button>
      </div>
    </div>
    <div class="main-wrap">
      <el-table
        v-if="visible"
        @selection-change="handleSelectionChange"
        :data="tableData"
        border>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="sn"
          label="反馈ID"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="类型"
          width="120"
          align="center">
          <template slot-scope="scope">
            <sys-value type="THC_FEEDBACK_TYPE" :code="scope.row.type"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.patientName">{{scope.row.patientName}}</span>
            <!-- <i class="iconfont icon-huiyuan_dianhu" style="cursor: pointer;color: #1C7BEF;position: relative;top:1px;" @click="calling(scope.row)"></i> -->
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="content"
          label="反馈内容"
          align="center"
          max-width="180">
        </el-table-column>
        <el-table-column
          label="涉及部门"
          align="center"
          width="200">
          <template slot-scope="scope">
            {{scope.row.dptNames || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="处理人员"
          max-width="200">
          <template slot-scope="scope">
            {{scope.row.handleNames || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="接待时间"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="接待人"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          label="处理状态"
          align="center"
          width="180">
          <template slot-scope="scope">
            <sys-value type="THC_FEEDBACK_STATUS" :code="scope.row.status.toString()"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="linkDetailPage(scope.row.id, scope.row.status)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
    <send-message ref="sendmessage" :users="selected" :allparams="allparams"></send-message>
  </div>
</template>
<script>
import api from '../store/feedbackapi'
import capi from '../../warehouse/store/clinicapi'
import sysvalueapi from '../../warehouse/store/sysvalueapi'
import depart from '@/warehouse/store/departmentapi'
import utillist from '../../util/list'
import sendMessage from '../page/sendmessage'
let querySchema = [
  {
    name: 'origId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'dptId',
    comp: 'ever-subject-select',
    label: '涉及部门',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  },
  {
    name: 'type',
    comp: 'sys-type',
    label: '类型',
    props: {
      code: 'THC_FEEDBACK_TYPE',
      clearable: true,
      useValue: true,
    }
  },
  {
    name: 'date',
    label: '反馈时间',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  // {
  //   startName: 'createTime',
  //   endName: 'endTime',
  //   name: 'daterange',
  //   type: 'daterange',
  //   dateType: 'daterange',
  //   format: 'YYYY-MM-DD',
  //   editable: false,
  //   label: '反馈时间',
  //   placeholder: '选择开始时间',
  //   span: 4
  // }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      capi,
      sysvalueapi: sysvalueapi,
      depart: depart,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      callData: '',
      selected: [],
      allparams: {
        msgType: 110
      }
    }
  },
  watch: {
    'queryObj.date' (val) {
      if (val && val[0]) {
        this.queryObj.createTime = val[0]
        this.queryObj.endTime = val[1]
      } else {
        this.queryObj.createTime = ''
        this.queryObj.endTime = ''
      }
    },
    // 机构变化之后 科室的值要清空掉
    'queryObj.origId' (val) {
      this.$ever.getFieldFromSchema(querySchema, 'dptId').props.params = {
        orgId: val
      }
      this.queryObj.dptId = ''
    }
  },
  created () {
    // this.getDptList(querySchema, 'dptId')
    // this.getClinicList(querySchema, 'origId')
  },
  methods: {
    sendMessage () {
      if (this.selected.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择接收短信客户',
          type: 'warning'
        })
        return false
      }
      this.$refs.sendmessage.sendVisible = true
    },
    getClinicList (schema, name) {
      let origId = this.$ever.getFieldFromSchema(schema, name)
      this.capi.list().then(rs => {
        origId.options = rs
      })
    },
    getDptList (schema, name) {
      let dpt = this.$ever.getFieldFromSchema(schema, name)
      this.depart.list().then(rs => {
        if (rs.length > 0) {
          dpt.options = rs
        }
      })
    },
    addConsult () {
      this.$router.push({ name: 'createfeedback', path: 'createfeedback' })
    },
    linkDetailPage (id, status) {
      if (status === 1) {
        this.$router.push({ name: 'feedbackhandle', path: 'feedbackhandle', query: { id: id } })
      } else if (status === 4) {
        this.$router.push({ name: 'feedcompete', path: 'feedcompete', query: { id: id } })
      } else {
        this.$router.push({ name: 'feedbackdetail', path: 'feedbackdetail', query: { id: id } })
      }
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    calling (val) {
      this.$parent.$parent.$parent.callData = { mobile: val.patientMobile, patientName: val.patientName, patientId: val.patientId }
      this.$parent.$parent.$parent.$refs.iphone.visible = true
    }
  },
  components: {
    sendMessage
  }
}
</script>
