<template>
  <div id="consultlist" class="layout_inner">
    <div class="main-head">
      <ever-form2
      class="gray-label-form"
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
        <el-button @click="memberadd">添加客户</el-button>
        <el-button type="primary" class="ml10" @click="showAddAppoint=true">添加预约</el-button>
        <el-button type="primary" @click="addConsult">添加咨询</el-button>
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
          label="咨询ID"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="客户姓名"
          width="160">
          <template slot-scope="scope">
            <label v-if="scope.row.patient && scope.row.patient.name">{{scope.row.patient.name}} </label>
            <router-link v-else :to="{ name: 'userBaseAdd' }" class="col-red" tag="a" target="_blank">
              新用户
            </router-link>
            <!-- <i class="iconfont icon-huiyuan_dianhu" style="cursor: pointer;color: #1C7BEF;position: relative;top:1px;" @click="calling(scope.row)"></i> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="patient.mobile"
          label="手机号码"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          label="咨询部门"
          align="center"
          width="120">
          <template slot-scope="scope">
            {{scope.row.dptName || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="咨询内容"
          prop="content"
          min-width="240">
        </el-table-column>
        <el-table-column
          label="咨询方式"
          align="center"
          width="120">
          <template slot-scope="scope">
            <sys-value type="THC_CC_FOLLOWUP" :code="scope.row.way"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          label="来源"
          align="center"
          width="120">
          <template slot-scope="scope">
            <sys-value type="THC_CONSULT_RESOURCE" :code="scope.row.source"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="咨询时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          label="通过时长"
          width="160"
          align="center">
          <template slot-scope="scope">
            {{scope.row.callRecord ? scope.row.callRecord.duration + '秒' : '无'}}
          </template>
        </el-table-column>
        <el-table-column
          label="录音地址"
          align="center"
          min-width="120">
          <template slot-scope="scope">
            <a v-if="scope.row.callRecord" :href="scope.row.callRecord.url" class="col-blue" target="_blank">有录音</a>
            <span v-else>无录音</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100"
          fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="linkDetailPage(scope.row.id)">查看</el-button>
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
    <add-appoint :show.sync="showAddAppoint"></add-appoint>
  </div>
</template>
<script>
import api from '../store/consultapi'
import depart from '../../warehouse/store/departmentapi'
import utillist from '../../util/list'
import sendMessage from '../page/sendmessage'
import addAppoint from '@/arrange/page/register/addappoint.vue'
let querySchema = [
  {
    name: 'dptId',
    comp: 'ever-subject-select',
    label: '咨询部门',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  },
  {
    name: 'way',
    comp: 'sys-type',
    label: '咨询方式',
    props: {
      code: 'THC_CC_FOLLOWUP',
      clearable: true,
      useValue: true,
    }
  },
  {
    name: 'source',
    comp: 'sys-type',
    label: '来源',
    props: {
      code: 'THC_CONSULT_RESOURCE',
      clearable: true,
      useValue: true,
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.origId = 1
    queryObj.type = 0
    return {
      api: api,
      depart: depart,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      selected: [],
      showAddAppoint: false,
      allparams: {
        msgType: 110
      }
    }
  },
  created () {
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
    addConsult () {
      this.$router.push({ name: 'createconsult', path: 'createconsult' })
    },
    linkDetailPage (id) {
      this.$router.push({ name: 'viewconsult', path: 'viewconsult', query: { id: id } })
    },
    handleSelectionChange (val) {
      this.selected = val.filter(item => {
        item.mobile = item.patient.mobile
        return item.patientId !== null
      })
    },
    calling (val) {
      this.$parent.$parent.$parent.callData = { mobile: val.patient.mobile, patientName: val.patient.name, patientId: val.patient.id }
      this.$parent.$parent.$parent.$refs.iphone.visible = true
    },
    memberadd () {
      this.$router.push({ path: '/crm/memberadd' })
    }
  },
  components: {
    sendMessage,
    addAppoint
  }
}
</script>
