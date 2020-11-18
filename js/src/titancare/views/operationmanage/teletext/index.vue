<template>
  <div class="layout_inner">
    <div class="min-high">
      <div class="form-box">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          @query="list(true)"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list()">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        class="doctor-table"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column show-overflow-tooltip label="编号" prop="visitNumber"></el-table-column>
        <el-table-column show-overflow-tooltip label="患者信息" prop="patientName"></el-table-column>
        <el-table-column show-overflow-tooltip label="服务名称" prop="serviceName"></el-table-column>
        <el-table-column show-overflow-tooltip label="机构名称" prop="organName"></el-table-column>
        <el-table-column show-overflow-tooltip label="接诊医生" prop="doctorName"></el-table-column>
        <el-table-column show-overflow-tooltip label="问诊状态" prop="appointmentStateDesc"></el-table-column>
        <el-table-column show-overflow-tooltip label="问诊时间" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.dateStr && scope.row.startTimeStr">{{scope.row.dateStr}} {{scope.row.startTimeStr}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="诊费">
          <template slot-scope="scope">
            <span v-if="scope.row.serviceOrder">￥ {{scope.row.serviceOrder.totalPrice}} 元</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="支付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.serviceOrder">{{scope.row.serviceOrder.isPaidDesc}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="接诊时间">
          <template slot-scope="scope">
            <span>{{scope.row.receptionTime ? $moment(scope.row.receptionTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="结诊时间">
          <template slot-scope="scope">
            <span>{{scope.row.visitEndTime ? $moment(scope.row.visitEndTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="seeInfo(scope.row)">查看资料</el-button>
            <template v-if="scope.row.orderId && scope.row.serviceOrder">
              <el-button size="small" type="danger" @click="refund(scope.row)" v-if="scope.row.serviceOrder.isPaid === 1 && [3, 4].includes(scope.row.visitStatus)">退费</el-button>
              <el-button size="small" type="primary" @click="refund(scope.row)" v-if="scope.row.serviceOrder.isPaid === -5">退费详情</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current="current"
          :totalCount="totalCount"
          :pageSizes="[10, 20, 50, 100, 200]"
          :pagesize="pagesize"
        ></ever-pagination>
      </el-row>
      <el-dialog
        title="退费详情"
        class="ui_dialog_02 spe"
        width="700px"
        :visible.sync="isShowDialog"
        :close-on-click-modal="false"
      >
        <dialog-info v-if="isShowDialog" :details="dialogDetails" ref="dialogRef"></dialog-info>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="sendInfo" :disabled="isDisabledBtn">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import list from '@/titancare/mixins/list'
import api from '@/titancare/api/operation'
import dialogInfo from './dialog.info'

let schema = [
  {
    name: 'patientName',
    label: '患者姓名',
    props: {
      placeholder: '请输入患者姓名'
    },
  },
  {
    name: 'resourceId',
    label: '就诊医生',
    comp: 'ever-staff-select',
    // props: {
    //   placeholder: '请输入就诊医生姓名',
    //   disabled: false,
    //   clearable: true,
    //   fields: ['id'],
    //   params: {
    //     everQueryType: 'out'
    //   }
    // }
  },
  {
    name: 'date',
    label: '问诊日期',
    comp: 'el-date-picker',
    props: {
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      placeholder: '请选择日期'
    },
  },
  {
    name: 'visitType',
    label: '问诊类型',
    comp: 'el-select',
    props: {
      placeholder: '问诊类型',
      options: [
        { name: '图文问诊', value: 5 },
        { name: '视频问诊', value: 6 },
        { name: '在线咨询', value: 7 },
      ]
    },
  },
  {
    name: 'appointmentState',
    label: '问诊状态',
    comp: 'el-select',
    props: {
      placeholder: '问诊状态',
      options: []
    },
  },
  {
    name: 'isPaid',
    label: '支付状态',
    comp: 'el-select',
    props: {
      placeholder: '支付状态',
      options: []
    },
  },
  {
    name: 'visitNumber',
    label: '编号',
    props: {
      placeholder: '请输入编号'
    },
  },
]

export default {
  components: {
    dialogInfo
  },
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    // queryObj.requestSwitch = true
    queryObj.apptType = 2
    queryObj.bizScene = 5
    queryObj.visitTypes = [5, 6, 7]
    return {
      schema,
      queryObj,
      loading: false,
      api,
      tableData: [],
      isShowDialog: false,
      dialogDetails: [],
      tenantOptions: [],
      payStatus: {},
      businessStatus: {},
      localhost: '',
      isDisabledBtn: false,
      groupId: ''
    }
  },
  created () {
    this.getSelectList()
    this.list()
  },
  methods: {
    getSelectList () {
      api.payStatus().then(rs => {
        if (!rs.errCode) {
          this.$ever.getFieldFromSchema(schema, 'isPaid').props.options = rs.data
          rs.data.forEach(item => {
            this.payStatus[item.value] = item.name
          })
        }
      })
      api.counselStatus().then(rs => {
        if (!rs.errCode) {
          this.$ever.getFieldFromSchema(schema, 'appointmentState').props.options = rs.data
          rs.data.forEach(item => {
            this.businessStatus[item.value] = item.name
          })
        }
      })
    },
    list (refresh) {
      this.tableData = []
      this.loading = true
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign(
        {
          offset: this.offset,
          pagesize: this.pagesize
        },
        this.queryObj
      )
      delete params['requestSwitch']
      delete params['button']
      delete params['tenantName']
      api.searchlist(params).then(rs => {
        if (!rs.errCode) {
          this.totalCount = rs.totalCount
          this.tableData = rs.data
        } else {
          this.totalCount = 0
        }
        this.loading = false
      })
    },
    seeInfo (row) {
      this.$router.push({
        name: 'teletextdetails',
        query: {
          visitType: row.visitType,
          visitNumber: row.visitNumber,
          orgId: row.orgId
        }
      })
    },
    refund (row) {
      this.isDisabledBtn = row.serviceOrder.isPaid === -1
      this.isShowDialog = true
      this.dialogDetails = [row]
      api.getGroupId(row.visitNumber).then(rs => {
        if (rs.data && rs.data.orderNo) {
          this.groupId = rs.data.orderNo
          api.findRefund(this.groupId).then(rs => {
            if (!rs.errCode && rs.data) this.$refs.dialogRef.infoObj = rs.data
          })
        }
      })
    },
    sendInfo () {
      let obj = this.$refs.dialogRef.infoObj
      let price = this.$refs.dialogRef.details[0]['price']
      obj.orderNo = this.groupId
      if (Number(obj.amount) > price) {
        this.$notify({
          title: '警告',
          message: '退费金额不能大于问诊金额',
          type: 'warning'
        })
        return false
      }
      this.$refs.dialogRef.$refs.form.validate(valid => {
        if (valid) {
          api.refund(obj).then(rs => {
            if (!rs.errCode) {
              this.$messageTips(this, 'success', '退款操作已完成')
              this.list()
              this.isShowDialog = false
            }
          })
        }
      })
    }
  }
}
</script>
