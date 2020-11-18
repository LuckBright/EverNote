<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-12 14:54:13
 -->
<template>
  <div v-loading="loading">
    <ever-bread-crumb
      :name="objId ? '理赔单详情' : '新建理赔单'"
      :path="meta === 1?'/financial/claim':'/financial/claimcustomer'"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <h4 class="settle_title">理赔单信息</h4>
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        labelWidth="100px"
        ref="ruleForm"
        :allDisabled="claimFormStatus ? true : false"
        :rules="rules"
      >
        <div></div>
      </ever-form2>
      <h4 class="settle_title">源单信息</h4>
      <div class="textright" v-if="!claimFormStatus">
        <el-button type="primary" plain @click="addsettle">添加结算单</el-button>
      </div>
      <el-table :data="claimetableData" height="400" style="width: 100%">
        <el-table-column prop="chargeDate" :formatter="convertTime" label="结算日期"></el-table-column>
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
        <el-table-column prop="paidInsur" :label="this.meta===1?'商保已收':'大客户已收'" align="right">
          <template slot-scope="scope">{{scope.row.paidInsur | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="diagnosis" label="当次诊断"></el-table-column>
        <el-table-column prop="country" label="客户国籍"></el-table-column>
        <el-table-column prop="birthday" :formatter="convertBirthday" label="出生日期"></el-table-column>
        <el-table-column prop="productName" :label="this.meta===1?'保险产品':'大客户产品'"></el-table-column>
        <template v-if="meta === 1">
          <el-table-column prop="insurCardNo" label="保险卡号"></el-table-column>
          <el-table-column prop="groupInsurCompany" label="团险公司"></el-table-column>
        </template>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, claimetableData)"
              type="danger"
              size="small"
              :disabled="claimFormStatus ? true : false"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textright" v-if="!claimFormStatus">
        <el-button type="primary" @click="saveBtn('ruleForm')" :disabled="savedisabled">保 存</el-button>
      </div>
    </div>
    <claimsettledialog :dialogVisible.sync="dialogVisible" @getdata="getdata"></claimsettledialog>
  </div>
</template>
<script>
import { insuranceName, save, getById, getAll } from '@/rcm/store/medicalinsurance'
import claimsettledialog from '@/rcm/page/medicalinsurance/claimsettledialog'
let schema = [
  {
    name: 'insurOrgId',
    label: '公司名称',
    span: 8,
    comp: 'el-select',
    style: {
      width: '100%'
    },
    props: {
      options: []
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
    name: 'claimNumber',
    label: '理赔单单号',
    span: 8,
    comp: 'el-input',
    props: {
      disabled: true
    }
  },
  {
    name: 'mailDate',
    label: '寄出日期',
    span: 8,
    comp: 'el-date-picker',
    style: {
      width: '100%'
    }
  },
  {
    name: 'courierNumber',
    label: '快递单号',
    span: 8,
    comp: 'el-input'
  },
  {
    name: 'remark',
    label: '备注',
    span: 8,
    comp: 'el-input'
  },
  {
    name: 'receivableTotalFee',
    label: '应收金额合计',
    span: 8,
    comp: 'el-input',
    props: {
      disabled: true
    }
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
      objId: this.$route.query.id,
      claimFormStatus: this.$route.query.collectionStatus && this.$route.query.id ? 'true' : undefined, // 收款状态
      dialogVisible: false,
      savedisabled: false,
      meta: this.$route.meta.type,
      rules: {
        insurOrgId: [
          {
            required: true,
            message: '请选择公司',
            trigger: 'change',
            type: 'string'
          }
        ],
        courierNumber: [
          {
            required: true,
            message: '输入快递单号',
            trigger: 'blur',
            type: 'string'
          }
        ],
        mailDate: [
          {
            required: true,
            message: '选择创建日期',
            trigger: 'change',
            type: 'date'
          }
        ]
      }
    }
  },
  components: {
    claimsettledialog
  },
  created () {
    this.getCompanyByMeta()
  },
  watch: {
    'objId': {
      handler: function (objId) {
        if (this.objId) {
          this.getDetail()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 保险名称
    async getCompanyByMeta () {
      if (this.meta === 1) {
        let data = await insuranceName()
        data.data.forEach(v => { v['name'] = v.insuranceOrgCnName })
        this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options = data.data
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options = data.data
        } catch (err) {

        }
      }
    },
    // 新建添加数据
    getdata (val) {
      val.forEach(v => {
        // 兼容运哲与春超两边字段名不一致问题
        v.chargeDate = v.settleDate
        v.productName = v.insurProductName
        if (v.id) { // 新加过来的源单都要去掉id,否则更新应收单的时候会误以为是更新该条明细
          delete v.id
        }
        this.claimetableData.push(v)
      })
      let obj = {}
      this.claimetableData = this.claimetableData.reduce((total, cur) => {
        obj[cur.settlementId]
          ? ''
          : (obj[cur.settlementId] = true && total.push(cur))
        return total
      }, [])
      this.computedPayInsurSum()
    },
    // 计算应收金额合计
    computedPayInsurSum () {
      this.queryObj.receivableTotalFee = this.claimetableData
        .reduce((total, cur) => {
          total += Number(cur.payInsur || 0)
          return total
        }, 0)
        .toFixed(2)
    },
    // 添加结算单
    addsettle () {
      this.dialogVisible = true
    },
    // 删除结算单
    deleteRow (index, rows) {
      rows.splice(index, 1)
      this.computedPayInsurSum()
    },
    // 新建
    saveBtn (ruleForm) {
      this.$refs[ruleForm].$refs.form.validate(async valid => {
        if (valid) {
          if (this.claimetableData.length <= 0) {
            this.$messageTips(this, 'error', '至少添加一条结算单')
            return false
          }
          this.savedisabled = true
          try {
            let params = {}
            Object.keys(this.queryObj).forEach(v => {
              params[v] = this.queryObj[v]
            })
            params.details = this.claimetableData
            // type=0表示商保应收单，1表示期初应收单
            params.type = 0
            if (this.objId) {
              params.id = this.objId // 如果有id，则必须传id进行更新
            }
            params.businessType = this.meta // 标志是商保还是大客户
            let data = await save(params)
            this.savedisabled = false
            if (data.head && data.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              if (this.meta === 1) {
                this.$router.push('/financial/claim')
              } else {
                this.$router.push('/financial/claimcustomer')
              }
            } else {
              this.$messageTips(this, 'error', '保存失败')
            }
          } catch (err) {
            this.savedisabled = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查看详情
    async getDetail () {
      this.loading = true
      try {
        let data = await getById({ id: this.objId })
        this.loading = false
        // console.log(data)
        if (data && data.data) {
          Object.keys(this.queryObj).forEach(v => {
            this.queryObj[v] = data.data.master[v]
          })
          this.claimetableData = data.data.details
          this.computedPayInsurSum()
        }
      } catch (err) {
        this.loading = false
      }
    },
    convertTime (row) {
      let date = row.chargeDate || row.settleDate
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
.textright {
  text-align: right;
}
</style>
