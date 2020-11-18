<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-18 16:05:06
 -->
<template>
  <div v-loading="loading">
    <ever-bread-crumb
      name="账单审批详情"
      :path="this.meta===1?'/financial/claimapproval':'/financial/claimapprovalcustomer'"
      :haveReturn="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <h4 class="settle_title">账单基本信息</h4>
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        :rules="schemaRules"
        labelWidth="100px"
        ref="ruleForm"
      >
        <div></div>
      </ever-form2>
      <h4 class="settle_title">账单明细</h4>
      <el-table :data="claimetableData" style="width: 100%">
        <el-table-column prop="settleDate" :formatter="converTime" label="结算日期"></el-table-column>
        <el-table-column prop="clinicName" label="就诊机构"></el-table-column>
        <el-table-column prop="orderDeptName" label="就诊科室"></el-table-column>
        <el-table-column prop="orderDoctorName" label="就诊医生"></el-table-column>
        <el-table-column prop="patientCode" label="患者档案号"></el-table-column>
        <el-table-column prop="patientName" label="客户姓名"></el-table-column>
        <el-table-column prop="settlementCode" label="结算单号"></el-table-column>
        <el-table-column prop="totalFee" label="账单总额"></el-table-column>
        <el-table-column prop="payInsur" :label="this.meta===1?'商保应收':'大客户应收'"></el-table-column>
        <el-table-column prop="diagnosis" label="当次诊断"></el-table-column>
        <el-table-column prop="country" label="客户国籍"></el-table-column>
        <el-table-column prop="birthday" :formatter="convertBirthday" label="出生日期"></el-table-column>
        <el-table-column prop="insurProductName" :label="this.meta===1?'保险产品':'大客户产品'"></el-table-column>
        <el-table-column prop="insurCardNo" :label="this.meta===1?'保险卡号':'大客户卡号'"></el-table-column>
        <el-table-column prop="groupInsurCompany" label="团险公司"></el-table-column>
      </el-table>
      <div class="ApprovalProcess">
        <h4 class="settle_title" v-if="this.meta===1">审批流程</h4>
        <div style="height: 200px;">
          <el-steps direction="vertical" :active="logLength-1" finish-status="success">
            <el-step
              v-for="(item,key) in approvalLog"
              :key="key"
              :status="item.variables?(item.variables.flag=='1'?'success':'error'):'proccess'"
            >
              <template slot="title">
                <span class="titletext">{{item.variables&&item.variables.handleUserName}}</span>
                <span class="titletext">{{item.activityName}}</span>
                <span
                  class="dateTime"
                >{{item.variables&&checkStatus[item.variables.flag]}}{{$moment(item.variables&&item.variables.handleTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
              <template
                slot="description"
                v-if="item.variables&&item.variables.remark"
              >{{item.variables&&item.variables.remark}}</template>
            </el-step>
          </el-steps>
        </div>
        <div class="approvalremark">
          <el-input
            type="textarea"
            :placeholder="'请输入审批意见'"
            v-model="approvalremark"
            v-if="this.meta===1&&roleLevel>0"
          ></el-input>
        </div>
      </div>

      <div class="textright">
        <el-button
          type="primary"
          @click="passApproval"
          v-if="(roleLevel>0 && (status!=2)&&this.meta===1) || (status!=2&&status!=3&&this.meta===2&&$hasPermission('Auth_menu_financial_income_batchapproval'))"
          :disabled="btnDisabled"
        >通过</el-button>
        <el-button
          type="primary"
          plain
          @click="rejectApproval"
          v-if="(roleLevel>0 && (status!=2)&&this.meta===1) || (status!=2&&status!=3&&this.meta===2&&$hasPermission('Auth_menu_financial_income_rejectionapproval'))"
          :disabled="btnDisabled"
        >驳回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  passClaimApproval,
  rejectClaimApproval,
  // submitClaimApproval,
  getClaimApprovalDetail,
  getClaimApprovalLog
} from '@/rcm/store/medicalinsurance'
import approvalFlows from '@/message/page/approval.flows.vue'
let schema = [
  {
    name: 'insurOrgName',
    label: '公司名称',
    span: 8,
    props: {
      disabled: true
    }
  },
  {
    name: 'createTime',
    label: '创建日期',
    span: 8,
    comp: 'el-date-picker',
    style: {
      width: '100%'
    },
    props: {
      disabled: true
    }
  },
  {
    name: 'checkCode',
    label: '账单审批号',
    span: 8,
    props: {
      placeholder: '提交后自动生成',
      disabled: true
    }
  },
  {
    name: 'mailSendDate',
    label: '寄出日期',
    span: 8,
    comp: 'el-date-picker',
    props: {
      placeholder: '请选择寄出日期'
    },
    style: {
      width: '100%'
    }
  },
  {
    name: 'remark',
    label: '备注',
    span: 8,
    comp: 'el-input'
  },
  {
    name: 'fastMailCode',
    label: '快递单号',
    span: 8,
    props: {
      placeholder: '请输入快递单号'
    }
  }
]
let schemaRules = {
  remark: [
    {
      max: 20,
      message: '备注应该在0-20个字符之间',
      trigger: 'blur'
    }]
}
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.createTime = new Date()
    return {
      loading: false,
      claimetableData: [],
      schema,
      queryObj,
      schemaRules: schemaRules,
      id: this.$route.query.id,
      roleLevel: 0,
      approvalLog: [],
      logLength: 0,
      approvalremark: '',
      status: this.$route.query.status,
      meta: this.$route.meta.type,
      checkStatus: {
        '1': '已通过',
        '0': '已驳回'
      },
      btnDisabled: false
    }
  },
  watch: {
    'id': {
      handler: function (id) {
        // 根据id获取详情代码
        if (id) {
          getClaimApprovalDetail(id).then(res => {
            // console.log(res, '审批账单详情')
            if (res.head && res.head.errCode === 0) {
              this.claimetableData = []
              Object.assign(this.queryObj, res.data)
              this.claimetableData.push(res.data)
            }
          })
        }
        if (Number(this.meta) !== 1) return
        this.getApprovalLog(id)
      },
      immediate: true
    }
  },
  components: {
    approvalFlows
  },
  methods: {
    passApproval () {
      this.btnDisabled = true
      let params = {
        ids: [this.id],
        suggestion: this.approvalremark
      }
      passClaimApproval(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          if (this.meta === 1) {
            this.getApprovalLog(this.id)
          }
          this.btnDisabled = false
          // 如果是从待办跳过来的，则将新窗口关闭，如果是从列表过来的，则退回列表
          if (window.opener) {
            // 审批流操作完成后，通知原页面刷新
            window.opener.postMessage('commercialInsuranceApproval', location.origin + this.$ever.rcmIndex + 'financial/claimapproval')
            window.close()
          } else {
            this.$router.push(this.meta === 1 ? '/financial/claimapproval' : '/financial/claimapprovalcustomer')
          }
        }
      }, _ => {
        this.btnDisabled = false
      })
    },
    rejectApproval (item) {
      this.btnDisabled = true
      this.$confirm('驳回后，审批流程将终止？', '提示', {
        confirmButtonText: '驳回',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        // 调用驳回接口
        let params = {
          ids: [this.id],
          suggestion: this.approvalremark
        }
        rejectClaimApproval(params).then(res => {
          if (res.head && res.head.errCode === 0) {
            this.$messageTips(this, 'success', '操作成功')
            if (this.meta === 1) {
              this.getApprovalLog(this.id)
            }
            this.btnDisabled = false
            // 如果是从待办跳过来的，则将新窗口关闭，如果是从列表过来的，则退回列表
            if (window.opener) {
              // 审批流操作完成后，通知原页面刷新
              window.opener.postMessage('commercialInsuranceApproval', location.origin + this.$ever.rcmIndex + 'financial/claimapproval')
              window.close()
            } else {
              this.$router.push(this.meta === 1 ? '/financial/claimapproval' : '/financial/claimapprovalcustomer')
            }
          }
        }, _ => {
          this.btnDisabled = false
        })
      })
    },
    getApprovalLog (id) {
      getClaimApprovalLog(id).then(res => {
        // 先清空原来的数组
        this.approvalLog = res.data
        this.logLength = res.data && res.data.length
        // 该接口返回了账号审批权限
        this.roleLevel = res.roleLevel
      })
    },
    converTime (row) {
      let date = new Date(row.settleDate)
      return this.$moment(date).format('YYYY-MM-DD')
    },
    convertBirthday (row) {
      return this.$moment(row.birthday).format('YYYY-MM-DD')
    }
  }
}
</script>
<style scoped>
.layout_box .main-head .el-form {
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.settle_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  margin: 0 0 20px 0;
  border-left: 3px solid #1c7bef;
}
.ApprovalProcess {
  margin-top: 15px;
}
.ApprovalProcess .titletext {
  font-size: 18px;
  font-weight: bold;
}
.ApprovalProcess .dateTime {
  margin-left: 40px;
  font-size: 14px;
}
.ApprovalProcess .approvalremark {
  margin-top: 15px;
}
.textright {
  margin-top: 15px;
  text-align: right;
}
</style>
