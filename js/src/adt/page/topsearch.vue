<template>
  <div class="adt">
    <template>
      <ever-form2
        :schema='filterSchema'
        v-model='filterModel'
        ref='filterform'
        :inline='true'
      >
        <template slot='admitDeptId'>
          <ever-select
            :options='admitDeptIdSelect'
            v-model='filterModel.admitDeptId'
            :filterable='true'
            :clearable='true'
          ></ever-select>
        </template>
        <template slot='inHosDate'>
          <el-date-picker
            v-model="filterModel.inHosDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </template>
        <template slot="leaveHosDate">
          <el-form-item label="出院日期" style="margin-left:35px;" v-if="$route.path === '/adt/leaveHospita'">
            <el-date-picker
              v-model="filterModel.leaveHosDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
        </template>
        <template slot="status">
          <el-select v-model="filterModel.status" placeholder="客户状态" clearable>
            <el-option
              v-for="item in (this.flag === 'inhospaital' ? statusArr : leaveArr)"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot="admitDepositStatus">
          <el-select v-model="filterModel.admitDepositStatus" placeholder="押金状态" clearable>
            <el-option
              v-for="item in depositArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot="insuranceCompanyId" v-if="$route.path !== '/adt/moneymanage'">
          <el-select v-model="filterModel.insuranceCompanyId" placeholder="押金状态" clearable>
            <el-option
              v-for="item in insuranceCompanySelect"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot='button'>
          <el-button
            type="primary"
            @click='searchBtn(true)'
          >查询</el-button>
          <el-button @click='resetBtn'>重置</el-button>
        </template>
        <div solt='default'></div>
      </ever-form2>
    </template>
  </div>
</template>
<script>
import api from '@/adt/store/register'
let filterSchema = [
  {
    label: '病案号',
    name: 'inpatientNumber',
    comp: 'text',
    span: 4,
    labelWidth: '100px'
  },
  {
    label: '姓名',
    name: 'patientName',
    props: {
      placeholder: '客户姓名'
    },
    comp: 'text',
    span: 4,
    labelWidth: '80px'
  },
  {
    label: '科室',
    name: 'admitDeptId',
    comp: 'custom',
    span: 4,
    labelWidth: '80px'
  },
  {
    label: '床位',
    name: 'admitBedId',
    comp: 'text',
    span: 4,
    labelWidth: '80px'
  },
  {
    label: '入院日期',
    name: 'inHosDate',
    comp: 'custom',
    span: 8,
    labelWidth: '100px'
  },
  {
    name: 'leaveHosDate',
    comp: 'custom',
    span: 8
  },
  {
    label: '状态',
    name: 'status',
    comp: 'custom',
    span: 4,
    newRow: true,
    labelWidth: '80px'
  },
  {
    label: '押金状态',
    name: 'admitDepositStatus',
    comp: 'custom',
    span: 4,
    labelWidth: '100px'
  },
  {
    label: '医保类型',
    name: 'insuranceCompanyId',
    comp: 'custom'
  },
  {
    name: 'button',
    comp: 'custom',
    span: 7,
    labelWidth: '80px'
  }
]
export default {
  props: {
    'flag': {
      type: String,
      default: ''
    }
  },
  data () {
    let filtermodel = this.$ever.createObjFromSchema(filterSchema)
    return {
      filterSchema: filterSchema,
      filterModel: filtermodel,
      admitDeptIdSelect: [],
      statusArr: [
        {id: 3, name: '待入科'},
        {id: 4, name: '已入科'},
        {id: 5, name: '待转科'},
        {id: 7, name: '已出科'},
        {id: 12, name: '退科'}
      ],
      leaveArr: [
        {id: 7, name: '已出科'},
        {id: 8, name: '办理出院'},
        {id: 9, name: '出院已结算'}
      ],
      depositArr: [
        {id: 1, name: '未缴押金'},
        {id: 2, name: '已缴押金'},
        {id: 3, name: '押金警告'},
        {id: 4, name: '押金透支'}
      ],
      insuranceCompanySelect: []
    }
  },
  created () {
    this.getTenantMethod()
    this.getMedical()
  },
  methods: {
    searchBtn (val = false) {
      this.$emit('change', this.filterModel, val)
    },
    resetBtn () {
      this.$refs.filterform.resetForm()
      this.$emit('change', this.filterModel)
    },
    getTenantMethod () {
      api.getTenantList({type2CodeList: ['01.01']}).then(res => {
        if (res.head && res.head.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.tenantSubjectCode
            obj.name = item.tenantSubjectName
            this.admitDeptIdSelect.push(obj)
          })
        }
      })
    },
    // 医保类型
    getMedical () {
      api.getOrgList().then(res => {
        if (res && res.head.errCode === 0) {
          res.data.forEach(items => {
            let obj = {}
            obj.id = items.id
            obj.name = items.insuranceOrgCnName
            obj.corpType = items.corpType
            this.insuranceCompanySelect.push(obj)
          })
        }
      })
    }
  }
}
</script>
