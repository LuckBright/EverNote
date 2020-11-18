<template>
  <div class="layout_inner">
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
      <div slot="default"></div>
    </ever-form2>
    <el-table
      border
      max-height="680"
      class="mb20"
      :data="appointList"
      style="width: 100%">
      <el-table-column show-overflow-tooltip label="问诊类型" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.visitType === 5">图文问诊</span>
          <span v-if="scope.row.visitType === 6">视频问诊</span>
          <span v-if="scope.row.visitType === 7">在线咨询</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="问诊状态">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentStateDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="left" label="患者档案号">
        <template slot-scope="scope">
          <span>{{scope.row.patient.patientNumber || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.patient && scope.row.patient.sex | formatSex }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="年龄" width="90">
        <template slot-scope="scope">
          <span>{{scope.row.patientAgeText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" width="150">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.date).format('YYYY-MM-DD')}} {{scope.row.startTimeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="接诊时间" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.receptionTime ? $moment(scope.row.receptionTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="结诊时间" width="150">
          <template slot-scope="scope">
          <span>{{scope.row.visitEndTime ? $moment(scope.row.visitEndTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="left" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.appointmentState">
            <el-button size="small" plain @click="seeInfo(scope.row)">查看详情</el-button>
            <el-button size="small" plain type="primary" v-if="scope.row.appointmentState === 2" @click="doctorAccept(scope.row)">接诊</el-button>
            <el-button size="small" plain type="danger" v-if="scope.row.appointmentState === 2" @click="doctorReject(scope.row)">拒绝</el-button>
            <el-button size="small" plain type="info" v-if="scope.row.appointmentState === 3" @click="inChatRoom(scope.row)">看诊</el-button>
            <el-button size="small" plain type="success" v-if="scope.row.appointmentState === 3" @click="doctorFinish(scope.row)">完成看诊</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" align="right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="拒绝原因"
      width="30%"
      :visible.sync="isShowReject"
      :before-close="closeReject">
      <el-form>
        <el-form-item label="请选择原因" label-width="92px">
          <sys-type code="THC_TITAN_CANCEL_REASON" v-model="cancelReason" size="middle" type="tag" :needTagName="true"></sys-type>
        </el-form-item>
        <el-form-item label="请输入原因" label-width="92px">
          <el-input
            type="textarea"
            placeholder="请输入原因"
            v-model="cancelReason"
            maxlength="40"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReject">取 消</el-button>
        <el-button type="primary" @click="submitReject()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/ihsystem/store/webapi'
import ihapi from '@/ihsystem/store/webihapi'
import { urlEncode } from '@/util/common'
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
    name: 'daterange',
    label: '问诊日期',
    comp: 'el-date-picker',
    props: {
      'type': 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期'
    },
    labelWidth: '100px',
    span: 5
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
        { name: '在线咨询', value: 7 }
      ]
    },
    newRow: true,
    labelWidth: '70px',
    span: 5
  },
  {
    name: 'appointmentState',
    label: '问诊状态',
    comp: 'el-select',
    props: {
      placeholder: '问诊状态',
      options: [
        { name: '已取消', value: -1 },
        { name: '预约成功', value: 1 },
        { name: '待接诊', value: 2 },
        { name: '看诊中', value: 3 },
        { name: '已结诊', value: 4 }
      ]
    },
    newRow: true,
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
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    queryObj.organId = localStorage.getItem('CLINICID')
    queryObj.apptType = 2
    queryObj.bizScene = 5
    queryObj.visitTypes = [5, 6, 7]
    queryObj.appointmentStates = [-1, 1, 2, 3, 4]
    queryObj.resourceId = localStorage.getItem('USERID')
    return {
      api,
      ihapi,
      schema,
      isShowReject: false,
      queryObj,
      currentPage: 1,
      totalCount: 0,
      currentAppoint: '',
      cancelReason: '',
      params: {
        offset: 0,
        pagesize: 20
      },
      appoint: '',
      appointList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.state.im) {
        vm.$store.dispatch('getSig', {isIm: true})
      }
    })
    next(true)
  },
  created () {
    this.list()
  },
  methods: {
    seeInfo (row) {
      this.$router.push({
        name: 'ihdetail',
        query: {
          visitType: row.visitType,
          visitNumber: row.visitNumber,
          orgId: row.orgId
        }
      })
    },
    list (searchFirstPage = true) {
      if (searchFirstPage) {
        this.currentPage = 1
        this.params.offset = 0
      }
      if (this.queryObj.daterange && this.queryObj.daterange[0]) {
        this.queryObj.startDate = this.$moment(this.queryObj.daterange[0]).format('YYYY-MM-DD')
        this.queryObj.endDate = this.$moment(this.queryObj.daterange[1]).format('YYYY-MM-DD')
      } else {
        this.queryObj.startDate = ''
        this.queryObj.endDate = ''
      }
      let params = Object.assign(
        this.queryObj,
        this.params
      )
      this.api.searchList(params).then(rs => {
        if (rs && rs.head && rs.head.errCode) {
          return false
        }
        this.appointList = rs.data
        this.totalCount = rs.totalCount
      })
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.list(false)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.list(false)
    },
    inChatRoom (val) {
      this.api.getGroupId(val.visitNumber).then(rs => {
        if (rs.data && rs.data.orderNo) {
          let groupId = rs.data.orderNo
          localStorage.setItem('CURRENTAPPOINT', JSON.stringify(val))
          let queryParams = urlEncode({
            groupId: groupId,
            patientId: val.patientId,
            patientName: val.patientName,
            providerId: val.deptId,
            providerName: val.deptName,
            visitNumber: val.visitNumber,
            visitType: val.visitType,
            serviceOrderId: val.orderId,
            creatorId: val.creatorId
          }).slice(1)
          let linkUrl = this.$ever.ihsystemIndex + '/ihsystem/chatroom?' + queryParams
          window.open(linkUrl, groupId)
        }
      })
    },
    closeReject () {
      this.isShowReject = false
      this.cancelReason = ''
      this.currentAppoint = ''
    },
    doctorAccept (val) {
      this.api.getAppointState({visitType: val.visitType, visitNumber: val.visitNumber}).then(state => {
        if (state === 2) {
          this.$confirm('是否开始为患者 ' + val.patientName + ' 看诊?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.api.getGroupId(val.visitNumber).then(rs => {
              if (rs.data && rs.data.orderNo) {
                let groupId = rs.data.orderNo
                localStorage.setItem('CURRENTAPPOINT', JSON.stringify(val))
                this.ihapi.doctorAccept({orderNo: rs.data.orderNo}).then(rs => {
                  let queryParams = urlEncode({
                    groupId: groupId,
                    patientId: val.patientId,
                    patientName: val.patientName,
                    providerId: val.deptId,
                    providerName: val.deptName,
                    visitNumber: val.visitNumber,
                    visitType: val.visitType,
                    serviceOrderId: val.orderId,
                    creatorId: val.creatorId
                  }).slice(1)
                  let linkUrl = this.$ever.ihsystemIndex + '/ihsystem/chatroom?' + queryParams
                  window.open(linkUrl, groupId)
                })
              }
            })
          }).catch(() => {
            return false
          })
        } else if (state === 3) {
          this.$confirm('患者 ' + val.patientName + ' 已被接诊，是否进入看诊?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.inChatRoom(val)
          }).catch(() => {
            return false
          })
        } else if (state === 4) {
          this.$confirm('患者 ' + val.patientName + ' 已经结诊，是否重新刷新页面?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list(true)
          }).catch(() => {
            return false
          })
        }
      })
    },
    doctorFinish (val) {
      this.api.getGroupId(val.visitNumber).then(rs => {
        if (rs.data && rs.data.orderNo) {
          this.ihapi.getRejectState(rs.data.orderNo).then(state => {
            if (state !== 14) {
              this.$confirm('是否结束患者 ' + val.patientName + ' 看诊?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.ihapi.doctorFinish({orderNo: rs.data.orderNo}).then(rs => {
                  this.$messageTips(this, 'success', '等待患者确认结诊后，将自动结诊')
                  this.list(true)
                })
              }).catch(() => {
                return false
              })
            } else {
              this.$alert('等待患者确认结诊后，将自动结诊')
            }
          })
        }
      })
    },
    showReject (val) {
      this.isShowReject = true
      this.currentAppoint = val
    },
    doctorReject (val) {
      this.api.getAppointState({visitType: val.visitType, visitNumber: val.visitNumber}).then(state => {
        if (state === 2) {
          this.showReject(val)
        } else if (state === 3) {
          this.$confirm('患者 ' + val.patientName + ' 已被接诊，是否进入看诊?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.inChatRoom(val)
          }).catch(() => {
            return false
          })
        } else if (state === 4) {
          this.$confirm('患者 ' + val.patientName + ' 已经结诊，是否重新刷新页面?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list(true)
          }).catch(() => {
            return false
          })
        }
      })
    },
    submitReject () {
      let val = this.currentAppoint
      if (!val) {
        this.isShowReject = false
        return false
      }
      if (!this.cancelReason) {
        this.$messageTips(this, 'error', '请填写拒绝原因')
        return false
      }
      this.api.getGroupId(val.visitNumber).then(rs => {
        if (rs.data && rs.data.orderNo) {
          this.ihapi.doctorReject({
            orderNo: rs.data.orderNo,
            cancelReason: this.cancelReason
          }).then(rs => {
            this.closeReject()
            this.list(true)
          })
        }
      })
    }
  }
}
</script>

