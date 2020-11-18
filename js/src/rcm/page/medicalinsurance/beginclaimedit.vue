<template>
  <div v-loading="loading">
    <ever-bread-crumb
      :name="objId ? '期初理赔单详情' : '新建期初理赔单'"
      :path="meta === 1?'/financial/claim':'/financial/claimcustomer'"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <h4 class="settle_title">理赔单信息</h4>
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        labelWidth="100px"
        ref="ruleForm"
        :allDisabled="initialClaimFormStatus ? true : false"
        :rules="rules"
      >
        <div></div>
      </ever-form2>
      <h4 class="settle_title">源单信息</h4>
      <el-table :data="claimetableData" height="400" style="width: 100%">
        <el-table-column prop="chargeDate" label="结算日期">
          <template slot-scope="scope">
            <span
              v-if="initialClaimFormStatus"
            >{{$moment(scope.row.chargeDate).format('YYYY-MM-DD')}}</span>
            <date-picker v-else v-model="scope.row.chargeDate" :showformat="'yyyy-MM-dd'"></date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="clinicid" label="就诊机构">
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.clinicName}}</span>
            <template v-else>
              <ever-select
                :options="clinicOptions"
                v-model="scope.row.clinicid"
                @change="(val) => {clinicChange(val, scope.$index)}"
                :index="scope.$index"
                :filterable="true"
                :clearable="true"
              ></ever-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="orderDept" label="就诊科室">
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.orderDeptName}}</span>
            <template v-else>
              <ever-select
                :options="scope.row.orderDeptOptions"
                :filterable="true"
                :clearable="true"
                @change="(val) => {orderDeptChange(val, scope.$index)}"
                v-model="scope.row.orderDept"
              ></ever-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="orderDoctor" label="就诊医生">
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.orderDoctorName}}</span>
            <div v-else class="doctorSelect">
              <ever-select
                :options="scope.row.doctorOptions"
                :filterable="true"
                :clearable="true"
                v-model="scope.row.orderDoctor"
              ></ever-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="patientCode" label="患者档案号">
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.patientCode}}</span>
            <el-input
              v-else
              :disabled="true"
              :placeholder="'自动关联无需填写'"
              v-model="scope.row.patientCode"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="patientid" label="客户姓名">
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.patientName}}</span>
            <template v-else>
              <ever-patient-select
                v-if="scope.row.id"
                @select="selectPatient($event, scope.$index)"
                v-model="scope.row.patientName"
              ></ever-patient-select>
              <ever-patient-select
                v-else
                @select="selectPatient($event, scope.$index)"
                v-model="scope.row.patientid"
              ></ever-patient-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="settlementCode" label="结算单号">
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.settlementCode}}</span>
            <el-input v-else v-model="scope.row.settlementCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalFee"
          label="账单总额"
          :align="initialClaimFormStatus ? 'right' : ''"
        >
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.totalFee | formatToFinacial}}</span>
            <el-input
              type="number"
              v-else
              v-model="scope.row.totalFee"
              @keyup.native="limitDecimal(scope.row.totalFee,'totalFee', scope.$index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="payInsur"
          :label="meta==1 ? '商保应收':'大客户应收'"
          :align="initialClaimFormStatus ? 'right' : ''"
        >
          <template slot-scope="scope">
            <span v-if="initialClaimFormStatus">{{scope.row.payInsur | formatToFinacial}}</span>
            <el-input
              type="number"
              v-else
              v-model="scope.row.payInsur"
              @keyup.native="limitDecimal(scope.row.payInsur,'payInsur', scope.$index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="objId" prop="paidInsur" label="已收金额" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.paidInsur | formatToFinacial}}</span>
            <!-- <el-input type="number" v-else  v-model="scope.row.paidInsur" @change="handlePaidInsur(scope.row)"></el-input> -->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, claimetableData)"
              type="danger"
              size="small"
              :disabled="initialClaimFormStatus ? true : false"
            >删除</el-button>
            <el-button
              @click.native.prevent="addRow(scope.row)"
              type="primary"
              size="small"
              :disabled="initialClaimFormStatus ? true : false"
            >新增行</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textright" v-if="!initialClaimFormStatus">
        <el-button type="primary" @click="saveBtn('ruleForm')" :disabled="savedisabled">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { insuranceName, getById, getClinicInfo, getDptsByOrgId, save, getAll, getParamByCode, getOrgInfo } from '@/rcm/store/medicalinsurance'
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
      // 缓存table数据
      cacheDetailsData: [],
      loading: false,
      claimetableData: [],
      newRow: {
        chargeDate: new Date(),
        clinicid: '',
        clinicName: '',
        clinicOptions: [],
        orderDept: '',
        orderDeptName: '',
        orderDeptOptions: [],
        orderDoctor: '',
        orderDoctorName: '',
        doctorOptions: [],
        patientCode: '',
        patientid: '',
        patientName: '',
        settlementCode: '',
        totalFee: '',
        payInsur: '',
        paidInsur: ''
      },
      clinicDeptOptions: {

      },
      schema,
      queryObj,
      objId: this.$route.query.id,
      initialClaimFormStatus: this.$route.query.collectionStatus && this.$route.query.id ? 'true' : undefined, // 收款状态
      savedisabled: false,
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
      },
      meta: this.$route.meta.type,
      clinicOptions: [],
      codeParam: 2 // 显示患者档案号是机构还是集团，1：集团，2：机构
    }
  },
  components: {
    claimsettledialog
  },
  created () {
    getClinicInfo().then(result => {
      result.data.forEach(item => {
        item.id = Number(item.id)
      })
      this.clinicOptions = result.data
      this.newRow.clinicOptions.push({ id: result.data.id, name: result.data.name })
      this.claimetableData.push(JSON.parse(JSON.stringify(this.newRow)))
    })
    this.getCompanyByMeta()
    getParamByCode({ code: 'patient_number_show_way' }).then(res => {
      // 显示患者档案号是机构还是集团，1：集团，2：机构
      this.codeParam = res.data
    })
  },
  watch: {
    'objId': {
      handler: function () {
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
    // 新增行
    addRow (row) {
      this.claimetableData.push(JSON.parse(JSON.stringify(this.newRow)))
    },
    // 删除结算单
    deleteRow (index, rows) {
      rows.splice(index, 1)
      this.computedAllFee()
    },
    computedAllFee () {
      this.queryObj.receivableTotalFee = this.claimetableData
        .reduce((total, cur) => {
          total += Number(cur.payInsur || 0)
          return total
        }, 0)
        .toFixed(2)
    },
    // 处理行内机构选择改变
    clinicChange (val, index) {
      // console.log(val, index, '机构发生改变')
      // val不需要校验，如果val没有值，不会触发change事件
      // index需要检验，因为select组件中触发了两次change事件，第二次没有把index给传出来，不校验会报错
      if (index !== undefined) {
        let params = {
          orgIdList: [val]
        }
        getDptsByOrgId(params).then(result => {
          if (result.data) {
            for (let v of result.data.resultList) {
              this.claimetableData[index].orderDeptOptions.push({ id: v.id, name: v.orgSubjectName })
            }
          }
        })
      }
    },
    // 就诊科室改变，应该将就诊医生清空
    orderDeptChange (val, index, type) {
      console.log(val, index)
      let row = this.claimetableData[index]
      let params = {
        offset: '1',
        pagesize: '100',
        orgId: row.clinicid,
        tenantSubjectIdList: [row.orderDept]
      }
      getOrgInfo(params).then(rs => {
        if (rs.head.errCode === 0 && rs.data && rs.data.pageList) {
          let options = []
          rs.data.pageList.forEach(item => {
            if (item.typeName === '医生') {
              options.push({id: item.id, name: item.name})
            }
          })
          this.claimetableData[index].doctorOptions = options
          this.claimetableData = JSON.parse(JSON.stringify(this.claimetableData))
        } else {
          row.doctorOptions = []
        }
      })
      if (!type) { // 只有手动修改的时候才清空
        row.orderDoctor = ''
        row.orderDoctorName = ''
      }
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
            if (this.objId) {
              // 编辑状态下客户姓名的转化
              this.claimetableData.forEach((item, i) => {
                this.cacheDetailsData.forEach((cacheItem, cacheI) => {
                  if (item.id === cacheItem.id && item.patientName + ' ' !== cacheItem.patientName + ' ') {
                    this.claimetableData[cacheI].patientid = item.patientName
                  }
                })
              })
            }
            let params = {}
            Object.keys(this.queryObj).forEach(v => {
              params[v] = this.queryObj[v]
            })
            params.details = JSON.parse(JSON.stringify(this.claimetableData))
            // 客户编号就是patientid,申请金额就是商保应付
            for (let i = 0; i < params.details.length; i++) {
              let item = params.details[i]
              if (item.patientid === '') {
                this.$messageTips(this, 'error', `第${i + 1}行患者姓名不能为空`)
                this.savedisabled = false
                return false
              } else if (item.settlementCode === '') {
                this.$messageTips(this, 'error', `第${i + 1}行结算单号不能为空`)
                this.savedisabled = false
                return false
              } else if (item.totalFee === '') {
                this.$messageTips(this, 'error', `第${i + 1}行账单总额不能为空`)
                this.savedisabled = false
                return false
              } else if (item.payInsur === '') {
                this.$messageTips(this, 'error', `第${i + 1}行${this.meta === 1 ? '商保' : '大客户'}应收金额不能为空`)
                this.savedisabled = false
                return false
              }
              item.insurInitFee = item.payInsur
              item.orderDeptOptions = [] // 提交接口时，去掉这个庞然大物
            }
            // type=0表示商保应收单，1表示期初应收单
            params.type = 1
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
        if (data && data.data) {
          this.cacheDetailsData = JSON.parse(JSON.stringify(data.data.details))
          Object.keys(this.queryObj).forEach(v => {
            this.queryObj[v] = data.data.master[v]
          })
          this.claimetableData = data.data.details
          if (this.claimetableData.length) {
            this.claimetableData.forEach((item, i) => { // 循环遍历数组是否有就诊机构，调用查询科室
              this.claimetableData[i].clinicOptions = this.newRow.clinicOptions
              if (item.clinicid) this._getDepartmentIndex({ orgIdList: [item.clinicid], index: i })
              this.orderDeptChange(item.orderDept, i, true)
            })
          }
        }
      } catch (err) {
        this.loading = false
      }
    },
    // 获取对应机构下科室arr
    _getDepartmentIndex ({ orgIdList, index }) {
      getDptsByOrgId({ orgIdList }).then(result => {
        if (result.data.resultList.length) {
          let options = []
          for (let v of result.data.resultList) {
            options.push({ id: v.id, name: v.orgSubjectName })
          }
          this.claimetableData[index].orderDeptOptions = options
          this.claimetableData = JSON.parse(JSON.stringify(this.claimetableData))
        }
      })
    },
    // 用户选择患者之后，自动填充患者档案号
    selectPatient (val, index) {
      // 具体显示机构编号还是集团编号，走配置
      this.claimetableData[index].patientCode = this.codeParam === '1' ? val.patientNumber : val && val.patientOrg && val.patientOrg.patientNumber
    },
    // 限制金额只能两位小数
    limitDecimal (fee, param, index) {
      if (/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
      } else {
        this.claimetableData[index][param] = fee.substring(0, fee.length - 1)
      }
      if (param === 'payInsur') {
        if (Number(this.claimetableData[index].payInsur) > Number(this.claimetableData[index].totalFee)) {
          this.claimetableData[index].payInsur = 0
          this.$messageTips(this, 'error', '应收金额不能大于账单总额')
        }
        this.computedAllFee()
      }
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
.doctorSelect /deep/ .el-form .el-form-item {
  margin-bottom: 0;
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
