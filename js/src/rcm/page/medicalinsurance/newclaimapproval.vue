<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-03 12:00:23
 -->
<template>
  <div v-loading="loading">
    <ever-bread-crumb
      name="新建审批单"
      :path="meta === 1 ? '/financial/claimapproval' : '/financial/claimapprovalcustomer'"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <h4 class="settle_title">审批基本信息</h4>
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        labelWidth="100px"
        ref="ruleForm"
        :rules="rules"
      >
        <div></div>
      </ever-form2>
      <h4 class="settle_title">账单明细</h4>
      <div class="textright">
        <el-button type="primary" plain @click="addsettle" size="small">添加结算单</el-button>
      </div>
      <el-table :data="claimetableData" height="400" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="chargeDate" label="结算日期"></el-table-column>
        <el-table-column prop="clinicName" label="就诊机构"></el-table-column>
        <el-table-column prop="orderDeptName" label="就诊科室"></el-table-column>
        <el-table-column prop="orderDoctorName" label="就诊医生"></el-table-column>
        <el-table-column prop="patientCode" label="患者档案号"></el-table-column>
        <el-table-column prop="patientName" label="客户姓名"></el-table-column>
        <el-table-column prop="settlementCode" label="结算单号"></el-table-column>
        <el-table-column prop="totalFee" label="账单总额" align="right">
          <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="payInsur" :label="this.meta===1?'商保应收':'大客户应收'" align="right">
          <template slot-scope="scope">{{scope.row.payInsur | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="diagnosis" label="当次诊断"></el-table-column>
        <el-table-column prop="country" label="客户国籍"></el-table-column>
        <el-table-column prop="birthday" label="出生日期"></el-table-column>
        <el-table-column prop="productName" :label="this.meta===1?'保险产品':'大客户产品'"></el-table-column>
        <el-table-column prop="insurCardNo" :label="this.meta===1?'保险卡号':'大客户卡号'"></el-table-column>
        <el-table-column prop="groupInsurCompany" label="团险公司"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, claimetableData)"
              type="text"
              size="small"
              :disabled="id?true:false"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textright">
        <el-button type="primary" @click="saveBtn('ruleForm')" :disabled="savedisabled">提交审批</el-button>
        <el-button type="primary" @click="cancel" plain>取 消</el-button>
      </div>
    </div>
    <el-dialog title="选择结算单" :visible.sync="dialogVisible" width="70%">
      <dialog-settlement-list @close="getdata" :meta="meta"></dialog-settlement-list>
    </el-dialog>
  </div>
</template>
<script>
import dialogSettlementList from '@/rcm/page/medicalinsurance/dialog-settlelist'
import { createClaimApproval } from '@/rcm/store/medicalinsurance'
let schema = [
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
    name: 'fastMailCode',
    label: '快递单号',
    span: 8,
    props: {
      placeholder: '请输入快递单号'
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
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.createTime = new Date()
    return {
      loading: false,
      claimetableData: [],
      schema,
      queryObj,
      id: this.$route.query.id,
      dialogVisible: false,
      savedisabled: false,
      meta: this.$route.meta.type,
      rules: {
        fastMailCode: [
          {
            required: true,
            message: '输入快递单号',
            trigger: 'blur',
            type: 'string'
          },
          {
            min: 1,
            message: '快递单号在1到20位之间',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '快递单号在1到20位之间',
            trigger: 'blur'
          }
        ],
        mailSendDate: [
          {
            required: true,
            message: '选择寄出日期',
            trigger: 'change',
            type: 'date'
          }
        ],
        remark: [{
          max: 20,
          message: '备注长度在20个字符以内',
          trigger: 'blur'
        }]
      },
      btnDisabled: false
    }
  },
  components: {
    dialogSettlementList
  },
  methods: {
    // 新建添加数据
    getdata (val) {
      this.dialogVisible = false
      val.forEach(v => {
        this.claimetableData.push(v)
      })
      let obj = {}
      this.claimetableData = this.claimetableData.reduce((total, cur) => {
        obj[cur.settlementId]
          ? ''
          : (obj[cur.settlementId] = true && total.push(cur))
        return total
      }, [])
    },
    // 添加结算单
    addsettle () {
      this.dialogVisible = true
    },
    // 删除结算单
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    // 新建
    saveBtn (ruleForm) {
      this.savedisabled = true
      this.$refs[ruleForm].$refs.form.validate(async valid => {
        if (valid) {
          if (this.claimetableData.length <= 0) {
            this.$messageTips(this, 'error', '至少添加一条结算单')
            return false
          }
          try {
            let data = []
            this.claimetableData.forEach((v, i) => {
              data.push({
                insurOrgId: v.insurOrgId,
                insurProductId: v.insurProductId,
                fastMailCode: this.queryObj.fastMailCode,
                mailSendDate: this.queryObj.mailSendDate,
                remark: this.queryObj.remark,
                settlementCode: v.settlementCode,
                settlementId: v.settlementId,
                checkType: this.meta === 1 ? 0 : 1
              })
            })
            let params = {
              data: data,
              subToCheck: true
            }
            createClaimApproval(params).then(res => {
              if (res.head && res.head.errCode === 0) {
                this.$messageTips(this, 'success', '新建账单审批成功')
                this.$router.push(this.meta === 1 ? '/financial/claimapproval' : '/financial/claimapprovalcustomer')
              } else {
                this.savedisabled = false
              }
            })
          } catch (err) {
            this.savedisabled = false
          }
        } else {
          this.savedisabled = false
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel () {
      this.$router.push(this.meta === 1 ? '/financial/claimapproval' : '/financial/claimapprovalcustomer')
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
.textright {
  text-align: right;
}
</style>
