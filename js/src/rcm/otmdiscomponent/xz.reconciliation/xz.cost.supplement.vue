<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 
          :schema="querySchema" 
          v-model="queryObj"
          labelWidth="140px"
          :inline="true"
          :is-query="true"
          >
          <el-button type="primary" @click="list">查询</el-button>
        </ever-form2>
        <div class="main-option">
          <el-button type="primary" @click="declare">补报</el-button>
          <el-button @click="cancel">删除申请</el-button>
          <el-button type="primary" @click="checkResult">申报结果</el-button>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="statTime" label="统计时间"></el-table-column>
        <el-table-column prop="hospitalName" label="医院名称"></el-table-column>
        <el-table-column prop="hospitalNo" label="医院编号"></el-table-column>
        <el-table-column prop="bankAccount" label="银行帐号"></el-table-column>
        <el-table-column prop="bankName" label="银行名称"></el-table-column>
        <el-table-column prop="approveStatus" label="审批状态"></el-table-column>
        <el-table-column prop="flag" label="是否申报">
          <template slot-scope="scope">
            {{scope.row.flag ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            {{scope.row.type === 1 ? '申报' : '补报'}}
          </template>
        </el-table-column>
        <el-table-column prop="outpatientPersonTime" label="普通门诊人次"></el-table-column>
        <el-table-column prop="outpatientRenalPersonTime" label="门诊肾透析人次"></el-table-column>
        <el-table-column prop="spicalOutpatientPersonTime" label="特殊人群门诊人次"></el-table-column>
        <el-table-column prop="hosPersonTime" label="普通住院人次"></el-table-column>
        <el-table-column prop="birthPersonTime" label="生育人次"></el-table-column>
        <el-table-column prop="birthNormalPersonTime" label="生育正常产人次"></el-table-column>
        <el-table-column prop="birthLatPersonTime" label="生育侧切人次"></el-table-column>
        <el-table-column prop="birthLapPersonTime" label="生育剖腹产人次"></el-table-column>
        <el-table-column prop="personAccount" label="普通门诊个人帐户"></el-table-column>
        <el-table-column prop="bitrhPersonAccount" label="生育住院个人帐户"></el-table-column>
        <el-table-column prop="normalOutAmount" label="普通门诊基本统筹"></el-table-column>
        <el-table-column prop="spicalOutAmount" label="特殊门诊基本统筹"></el-table-column>
        <el-table-column prop="hospitalAmount" label="普通住院基本统筹"></el-table-column>
        <el-table-column prop="hospitalBiirthAmount" label="生育住院基本统筹"></el-table-column>
        <el-table-column prop="normalOutLargeAmount" label="普通门诊大额补助"></el-table-column>
        <el-table-column prop="spicalOutLargeAmount" label="特殊门诊大额补助"></el-table-column>
        <el-table-column prop="normalHosLargeAmount" label="普通住院大额补助"></el-table-column>
        <el-table-column prop="birthHosLargeAmount" label="生育住院大额补助"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>

        <!-- <el-table-column prop="armyPersonAccount" label="伤残军人个人帐户"></el-table-column>
        <el-table-column prop="birthHosCivilAmount" label="生育住院公务员补助"></el-table-column>
        <el-table-column prop="controlTotal" label="总额控制标志"></el-table-column>
        <el-table-column prop="hosCost" label="普通住院统筹基金人均住院定额"></el-table-column>
        <el-table-column prop="hosPersonCash" label="住院基本医疗个人现金"></el-table-column>
        <el-table-column prop="hosSpicalPersonCash" label="住院特殊人员个人现金"></el-table-column>
        <el-table-column prop="hospitalPersonAccount" label="普通住院个人帐户"></el-table-column>
        <el-table-column prop="medicalPay" label="基本医疗医保垫付"></el-table-column>
        <el-table-column prop="month" label="月份"></el-table-column>
        <el-table-column prop="normalHosCivilAmount" label="普通住院公务员补助"></el-table-column>
        <el-table-column prop="normalOutCivilAmount" label="普通门诊公务员补助"></el-table-column>
        <el-table-column prop="outPersonCash" label="门诊基本医疗个人现金"></el-table-column>
        <el-table-column prop="outSpicalPersonCash" label="门诊特殊人员个人现金"></el-table-column>
        <el-table-column prop="renalPersonAccount" label="门诊肾透析个人帐户"></el-table-column>
        <el-table-column prop="retPersonAccount" label="离休老红军个人帐户"></el-table-column>
        <el-table-column prop="spicalDiseaseAmount" label="特殊疾病公务员补助"></el-table-column>
        <el-table-column prop="spicalDiseaseLargeAmount" label="特殊疾病大额补助"></el-table-column>
        <el-table-column prop="spicalDiseaseMedical" label="特殊疾病基本统筹"></el-table-column>
        <el-table-column prop="spicalDiseasePersonAccount" label="特殊疾病个人帐户"></el-table-column>
        <el-table-column prop="spicalMedicalPay" label="特殊人员医保垫付"></el-table-column>
        <el-table-column prop="spicalOutCivilAmount" label="特殊门诊公务员补助"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column> -->
        
      </el-table>
      <div>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/rcm/store/otmdiscomponent/xzreconciliationapi.js'
import list from '@/util/list'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import storage from '@/util/storage'

let schema = [
  {
    name: 'year',
    label: '申报年份',
    comp: 'elDatePicker',
    props: {
      type: 'year'
    }
  },
  {
    name: 'month',
    label: '申报月份',
    comp: 'everSelect',
    props: {
      options: []
    }
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requestSwitch = true
    return {
      api,
      querySchema: schema,
      queryObj: obj,
      loading: false,
      reason: '',
      insuranceOrgId: '873a1a554e2c4746afedb75842fd9aaa',
      macId: this.$store.state.macAddress || storage.getLocalStorage('macId')
    }
  },
  components: {
    medicalOrgList
  },
  watch: {
    'queryObj.year': {
      handler (val) {
        if (val) {
          this.queryObj.month = ''
          this.getMonth()
        }
      }
    }
  },
  methods: {
    getMonth () {
      let params = {
        macId: this.macId,
        insuranceOrgId: this.insuranceOrgId,
        year: this.$moment(this.queryObj.year).format('YYYY')
      }
      api.medicalCostMouthQuery(params).then(rs => {
        if (rs.head.errCode === 0) {
          rs.data.forEach(item => {
            item.id = item.mouth
            item.value = item.mouth
          })
          this.$ever.getFieldFromSchema(this.schema, 'status').props.options = rs.data
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'status').props.options = []
        }
      })
    },
    declare () {
      if (!this.queryObj.month) {
        this.$messageTips(this, 'error', '月份不能为空')
        return
      }
      let params = {
        month: this.$moment(this.queryObj.month).format('YYYY-MM').replace('-', ''),
        macId: this.macId,
        insuranceOrgId: this.insuranceOrgId
      }
      api.supDeclare(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '补报成功')
          this.list()
        }
      })
    },
    list () {
      if (!this.queryObj.month) {
        this.$messageTips(this, 'error', '月份不能为空')
        return
      }
      this.loading = true
      let params = {
        insuranceOrgId: this.insuranceOrgId,
        month: this.queryObj.month
      }
      api.searchSupDeclareInfo(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
        }
        this.loading = false
      })
    },
    checkResult () {
      if (!this.queryObj.month) {
        this.$messageTips(this, 'error', '月份不能为空')
        return
      }
      let params = {
        month: this.$moment(this.queryObj.month).format('YYYY-MM').replace('-', ''),
        macId: this.macId,
        insuranceOrgId: this.insuranceOrgId
      }
      api.confirmDeclare(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '查询成功')
          this.list()
        }
      })
    },
    cancel () {
      if (!this.queryObj.month) {
        this.$messageTips(this, 'error', '月份不能为空')
        return
      }
      let params = {
        month: this.$moment(this.queryObj.month).format('YYYY-MM').replace('-', ''),
        macId: this.macId,
        insuranceOrgId: this.insuranceOrgId
      }
      api.deleteDeclare(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除申请成功')
          this.list()
        }
      })
    }
  }
}
</script>
<style scoped>
  .el-button {
    padding: 8px;
  }
</style>
