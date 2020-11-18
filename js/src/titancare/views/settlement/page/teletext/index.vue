<template>
  <div class="teletext_box">
    <ever-bread-crumb name="图文问诊" show-edit-fnt="false"></ever-bread-crumb>
    <div class="layout_inner min-high pos_re">
      <div class="form-box">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="button">
            <el-button type="primary" @click="list(queryObj)">查询</el-button>
          </template>
          <template slot="tenantName">
            <el-select v-model="queryObj.tenantName" value-key="groupName" @change="changeSelect">
              <el-option
                v-for="item in tenantOptions"
                :key="item.tenantId"
                :label="item.groupName"
                :value="item"
              ></el-option>
            </el-select>
          </template>
          <div slot="default"></div>
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
        <el-table-column show-overflow-tooltip label="门诊号" prop="orderNo"></el-table-column>
        <el-table-column show-overflow-tooltip label="患者信息" prop="patientInfo"></el-table-column>
        <el-table-column show-overflow-tooltip label="集团名称" prop="groupName"></el-table-column>
        <el-table-column show-overflow-tooltip label="接诊医生" prop="doctorName"></el-table-column>
        <el-table-column show-overflow-tooltip label="问诊状态" prop="status"></el-table-column>
        <el-table-column show-overflow-tooltip label="问诊时间" prop="createTime"></el-table-column>
        <el-table-column show-overflow-tooltip label="诊费" prop="price"></el-table-column>
        <el-table-column show-overflow-tooltip label="支付状态" prop="payStatus">
          <template slot-scope="scope">{{payStatus[scope.row.payStatus]}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="接诊时间" prop="answerTime"></el-table-column>
        <el-table-column show-overflow-tooltip label="结诊时间" prop="finishTime"></el-table-column>
        <el-table-column show-overflow-tooltip label="操作" width="160px">
          <template slot-scope="scope">
            <a class="a_color" @click="seeInfo(scope.row)">查看资料</a>
            <a
              class="a_color"
              @click="refund(scope.row)"
              v-if="scope.row.payStatus === 1 || scope.row.payStatus === 4"
            >{{scope.row.payStatus === 4 ? '退费详情' : '退费'}}</a>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current="current"
          :totalCount="totalCount"
          :pagesize="pagesize"
        ></ever-pagination>
      </el-row>
      <el-dialog
        title="退费1111"
        :visible.sync="isShowDialog"
        center
        width="70%"
        :close-on-click-modal="false"
      >
        <dialog-info v-if="isShowDialog" :details="dialogDetails" ref="dialogRef"></dialog-info>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendInfo" :disabled="isDisabledBtn">确 定</el-button>
          <el-button @click="isShowDialog = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import list from '@/titancare/mixins/list'
import api from '@/titancare/api/operatio'
import dialogInfo from './dialog.info'
let schema = [
  {
    name: 'patientName',
    label: '患者姓名',
    props: {
      placeholder: '请输入患者姓名'
    },
    labelWidth: '100px',
    span: 5
  },
  {
    name: 'doctorName',
    label: '接诊医生',
    props: {
      placeholder: '请输入医生姓名'
    },
    labelWidth: '100px',
    span: 5
  },
  {
    name: 'createDay',
    label: '问诊日期',
    comp: 'el-date-picker',
    props: {
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      placeholder: '请选择日期'
    },
    labelWidth: '100px',
    span: 5
  },
  {
    name: 'orderStatus',
    label: '支付状态',
    comp: 'el-select',
    props: {
      placeholder: '支付状态',
      options: []
    },
    labelWidth: '100px',
    span: 6
  },
  {
    name: 'businessStatus',
    label: '问诊状态',
    comp: 'el-select',
    props: {
      placeholder: '问诊状态',
      options: []
    },
    newRow: true,
    labelWidth: '100px',
    span: 5
  },
  {
    name: 'tenantName',
    label: '集团名称',
    comp: 'custom',
    labelWidth: '100px',
    span: 5
  },
  {
    name: 'orderNo',
    label: '门诊号',
    props: {
      placeholder: '请输入门诊号'
    },
    labelWidth: '100px',
    span: 5
  },
  {
    name: 'button',
    comp: 'custom',
    labelWidth: '20px',
    span: 1
  }
]
export default {
  components: {
    dialogInfo
  },
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
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
      groupName: '',
      isDisabledBtn: false
    }
  },
  created () {
    if (typeof (this.$route.query.params) === 'object') {
      api.getTenants().then(rs => {
        if (rs.length) {
          this.tenantOptions = rs
          this.queryObj = Object.assign({}, this.$route.query.params.param)
          localStorage.setItem('IHTENANTID', this.$route.query.params.param.tenantName.tenantId)
          this.current = (this.$route.query.params.pages.offset / this.$route.query.params.pages.pagesize) + 1
          this.pagesize = this.$route.query.params.pages.pagesize
          this.offset = this.$route.query.params.pages.offset
          this.localhost = this.$route.query.params.param.tenantName.fullGroupDomainName
          this.list()
          this.getSelectList()
        }
      })
    } else {
      this.getTenantList()
    }
  },
  methods: {
    getTenantList () {
      api.getTenants().then(rs => {
        if (rs.length) {
          this.tenantOptions = rs
          localStorage.setItem('IHTENANTID', this.tenantOptions[0].tenantId)
          debugger
          this.localhost = rs[0].fullGroupDomainName
          this.queryObj.tenantName = rs[0]
          this.groupName = rs[0].groupName
          this.list()
          this.getSelectList()
        }
      })
    },
    getSelectList () {
      api.payStatus(this.localhost).then(rs => {
        if (rs.length) {
          this.$ever.getFieldFromSchema(schema, 'orderStatus').props.options = rs
          rs.forEach(item => {
            this.payStatus[item.value] = item.name
          })
        }
      })
      api.counselStatus(this.localhost).then(rs => {
        if (rs.length) {
          this.$ever.getFieldFromSchema(schema, 'businessStatus').props.options = rs
          rs.forEach(item => {
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
          size: this.pagesize,
        },
        this.queryObj
      )
      delete params['requestSwitch']
      delete params['button']
      delete params['tenantName']
      api.searchlist(this.localhost, params).then(rs => {
        if (rs && rs.list) {
          this.totalCount = rs.totalCount
          rs.list.forEach(item => {
            item.groupName = this.groupName
            if (item.patientInfo) {
              let info = JSON.parse(item.patientInfo)
              item.patientInfo = `${info.name} ${info.ageShowText} ${info.sex === '1' ? '男' : '女'}`
            } else {
              item.patientInfo = '--'
            }
            if (item.serviceItem) {
              let doctor = JSON.parse(item.serviceItem)
              item.doctorName = doctor.doctorName
            } else {
              item.doctorName = '--'
            }
            item.status = this.businessStatus[item.status]
          })
          this.tableData = rs.list
        } else {
          this.totalCount = 0
        }
        this.loading = false
      })
    },
    seeInfo (row) {
      let param = Object.assign({}, this.queryObj)
      let pages = {offset: this.offset, pagesize: this.pagesize}
      row.localhost = this.localhost
      let obj = {row, params: {param, pages}}
      this.$router.push('/titancare/operation/teletextdetails?0=' + JSON.stringify(obj))
    },
    refund (row) {
      this.isDisabledBtn = row.payStatus === 4
      this.isShowDialog = true
      this.dialogDetails = [row]
      if (row.payStatus === 4) {
        api.findRefund(this.localhost, row.orderNo).then(rs => {
          this.$refs.dialogRef.infoObj = rs
        })
      }
    },
    sendInfo () {
      let obj = this.$refs.dialogRef.infoObj
      let price = this.$refs.dialogRef.details[0]['price']
      if (Number(obj.amount) > price) {
        this.$notify({
          title: '警告',
          message: '退费金额不能大于问诊金额',
          type: 'warning'
        })
      } else {
        obj.orderNo = this.dialogDetails[0].orderNo
        this.$refs.dialogRef.$refs.form.validate(valid => {
          if (valid) {
            api.refund(this.localhost, obj).then(rs => {
              if (JSON.stringify(rs) === '{}') {
                this.list()
                this.isShowDialog = false
              }
            })
          }
        })
      }
    },
    changeSelect (val) {
      if (val) localStorage.setItem('IHTENANTID', val && val.tenantId)
      this.localhost = val.fullGroupDomainName
      this.groupName = val.groupName
      this.list()
    }
  }
}
</script>
<style lang="less" scoped>
.teletext_box {
  .form-box /deep/ .el-form > div:nth-child(1) > div:nth-child(3) .el-input {
    width: 100%;
  }
  .a_color {
    color: #1c7be;
    cursor: pointer;
    margin-right: 5px;
  }
}
</style>
