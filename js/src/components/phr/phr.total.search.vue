<template>
  <div class="phr_search">
    <ever-form2
      :schema="defaultSchema"
      v-model="queryObj"
      :api="api"
      ref="form"
      :inline="true"
      class="maintltle"
      >
      <template slot="visitTypeCode">
        <!-- <el-radio v-model="queryObj.visitTypeCode" label="0">全部</el-radio> -->
        <!-- <el-radio v-model="queryObj.visitTypeCode" label="2" style="margin-left:10px;">急诊</el-radio> -->
        <el-radio v-model="queryObj.visitTypeCode" label="1" style="margin-left:10px;">门诊</el-radio>
        <!-- <el-radio v-model="queryObj.visitTypeCode" label="3" style="margin-left:10px;">住院</el-radio> -->
        <!-- <el-radio v-model="radio" label="4">体检</el-radio> -->
      </template>
      <template slot="comeTime">
        <ever-range-picker
          :start.sync="queryObj.comeStartTime"
          :end.sync="queryObj.comeEndTime">
        </ever-range-picker>
      </template>
      <template slot="default">
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
  </div>
</template>
<script>
import api from '@/patientinfo/store/phr/historyapi'
// import dptApi from '@/manages/page/person/personapi'
// import storage from '@/util/storage'
// 综合视图/综合视图详情
let schema = [
  {
    name: 'visitTypeCode',
    comp: 'custom',
    label: '就诊类型'
  },
  {
    name: 'visitOrgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'visitTenantSubjectCode',
    comp: 'ever-subject-select',
    label: '就诊科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  },
  {
    name: 'outpatientInpatientDoctorId',
    label: '就诊医生',
    comp: 'ever-staff-select',
    props: {
      fields: 'id',
      params: {
        'tenantSubjectIdList': [],
        'orgIdList': []
      }

    }
  },
  // {
  //   name: 'doctorId',
  //   comp: 'select',
  //   props: {
  //     filterable: true,
  //     options: [],
  //     disabled: false
  //   },
  //   label: '就诊医生'
  // }
]
// 病历
let schema2 = [
  {
    name: 'visitTypeCode', // 就诊类型1:门诊 2:急诊 3:住院
    comp: 'custom',
    label: '就诊类型'
  },
  {
    name: 'comeTime',
    comp: 'custom',
    label: '就诊/入院日期'
  },
  {
    name: 'visitOrgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'visitDeptId',
    comp: 'ever-subject-select',
    label: '就诊科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  },
]
export default {
  props: {
    searchType: {
      type: String,
      default: ''
    },
    emptyable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let defaultSchema = []
    if (this.searchType === 'medicalRecord') {
      defaultSchema = schema2
    } else {
      defaultSchema = schema
    }
    var queryObj = this.$ever.createObjFromSchema(defaultSchema)
    // console.log(queryObj, 'queryObj')
    queryObj.visitTypeCode = '1'
    queryObj.comeStartTime = this.$moment()
      .subtract(30, 'days')
      .format('YYYY-MM-DD')
    queryObj.comeEndTime = this.$moment()
      .subtract(0, 'days')
      .format('YYYY-MM-DD')
    if (this.searchType !== 'medicalRecord') {
      delete queryObj.comeStartTime
      delete queryObj.comeEndTime
    }
    return {
      queryObj,
      defaultSchema,
      api,
    }
  },
  created () {
    // this.queryObj.visitOrgId = storage.getStorageByClinic('CLINICID') || ''
  },
  watch: {
    'queryObj': {
      handler (obj) {
        let copyObj = JSON.parse(JSON.stringify(obj))
        if (copyObj.visitTypeCode === '0') {
          copyObj.visitTypeCode = ''
        }
        this.$emit('input', copyObj)
      },
      deep: true,
      immediate: true
    },
    'queryObj.visitOrgId': {
      handler (val) {
        if (this.$ever.getFieldFromSchema(this.defaultSchema, 'visitDeptId') != null) {
          if (val) {
            // 机构选择之后需要把机构id传到科室选择组件内，传参方式有变化，参考 src\msgcenter\page\msglist.vue 20191022forphr
            this.$ever.getFieldFromSchema(this.defaultSchema, 'visitDeptId').props.params = {
              orgId: val
            }
            this.$ever.getFieldFromSchema(this.defaultSchema, 'visitDeptId').props.disabled = false
          } else {
            this.$ever.getFieldFromSchema(this.defaultSchema, 'visitDeptId').props.disabled = true
            this.queryObj.visitDeptId = ''
          }
        }
      },
      immediate: true
    },
    'queryObj.visitDeptId': {
      handler (val) {
        if (!this.searchType && this.$ever.getFieldFromSchema(this.defaultSchema, 'doctorId') != null) {
          if (val) {
            this.$ever.getFieldFromSchema(this.defaultSchema, 'doctorId').props.params.tenantSubjectIdList = [val]
            this.$ever.getFieldFromSchema(this.defaultSchema, 'doctorId').props.params.orgIdList = [this.queryObj.visitOrgId]
            this.$ever.getFieldFromSchema(this.defaultSchema, 'doctorId').props.disabled = false
          } else {
            this.$ever.getFieldFromSchema(this.defaultSchema, 'doctorId').props.disabled = true
            this.queryObj.doctorId = ''
          }
        }
      },
      immediate: true
    },
  },
  methods: {
    reset () {
      if (this.searchType === 'medicalRecord') {
        this.defaultSchema = schema2
      } else {
        this.defaultSchema = schema
      }
      this.queryObj = {}
      this.queryObj = this.$ever.createObjFromSchema(this.defaultSchema)
      this.queryObj.visitTypeCode = '1'
      this.queryObj.comeStartTime = this.$moment()
        .subtract(29, 'days')
        .format('YYYY-MM-DD')
      this.queryObj.comeEndTime = this.$moment()
        .subtract(0, 'days')
        .format('YYYY-MM-DD')
      if (this.searchType !== 'medicalRecord') {
        delete this.queryObj.comeStartTime
        delete this.queryObj.comeEndTime
      }
    }
  }
}
</script>

