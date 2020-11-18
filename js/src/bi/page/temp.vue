<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="visitStartDate">
          <ever-range-picker
            width="380px"
            :customWidth="'380px'"
            dateType="datetimerange"
            :disabled="timeDisabled"
            :autoWidth="false"
            :clearable="true"
            :start.sync="queryObj.startTime"
            :end.sync="queryObj.endTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="openTime">
          <ever-range-picker
            width="380px"
            :customWidth="'380px'"
            dateType="datetimerange"
            :disabled="timeDisabled"
            :autoWidth="false"
            :clearable="true"
            :start.sync="queryObj.openStartTime"
            :end.sync="queryObj.openEndTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="exeTime">
          <ever-range-picker
            width="380px"
            :customWidth="'380px'"
            dateType="datetimerange"
            :disabled="timeDisabled"
            :autoWidth="false"
            :clearable="true"
            :start.sync="queryObj.startTime"
            :end.sync="queryObj.endTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="insuranceorgid">
          <medical-org-list v-model="queryObj.insuranceorgid" @change="medicalOrgChange"></medical-org-list>
        </template>
        <template slot="isHide">
          <el-checkbox v-model="queryObj.isHide">库房分列</el-checkbox>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="box-iframe">
      <iframe
        :src="url"
        style="width:100%;height:85vh;margin: 0 auto;"
        frameborder="0"
        :key="key"
        v-if="show">
      </iframe>
      <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
    </div>
  </div>
</template>

<script>
import storage from '@/util/storage'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { MATERIA_TYPE_OPTIONS } from '@/util/common'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'

let singleSchema = [
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '机构名称',
    props: {
      type: 'select',
      fields: 'id',
      props: {
        clearable: false
      },
      params: {
        everQueryType: 'isLogin'
      }
    }
  },
  {
    name: 'openDeptId',
    label: '开单科室',
    comp: 'ever-subject-select',
    props: {
      params: {
      },
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'deptId',
    label: '科室',
    comp: 'ever-subject-select',
    props: {
      params: {
      },
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'exeDeptId',
    label: '执行科室',
    comp: 'ever-subject-select',
    props: {
      params: {
      },
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'openDoctorId',
    label: '开单人',
    comp: 'ever-staff-select',
    props: {
      useCache: false,
      params: {
        everQueryType: 'out'
      }
    }
  },
  {
    name: 'doctorId',
    label: '医生',
    comp: 'ever-staff-select',
    props: {
      useCache: false,
      params: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
      }
    }
  },
  {
    name: 'person',
    label: '收银员',
    comp: 'ever-staff-select',
    props: {
      useCache: false,
      params: {
        everQueryType: 'out',
        typeCodeList: ['FINANCE'],
      }
    }
  },
  {
    name: 'storageRoomId',
    label: '库房',
    comp: 'everStorageroomSelect',
    props: {
      params: {
        clinicIds: [storage.getLocalStorage('CLINICID')]
      }
    }
  },
  {
    name: 'orderString',
    comp: 'select',
    label: '排序',
    props: {
      options: [
        {
          id: 'quantity',
          name: '数量'
        },
        {
          id: 'totalMoney',
          name: '金额'
        }
      ]
    }
  },
  {
    name: 'type',
    comp: 'select',
    label: '类型',
    props: {
      options: [
        { id: 1, name: '门诊' },
        { id: 2, name: '住院' }
      ]
    }
  },
  {
    name: 'settleType',
    comp: 'select',
    label: '结算状态',
    props: {
      options: [
        { id: 2, name: '已结算' },
        { id: 1, name: '未结算' }
      ]
    }
  },
  {
    name: 'rjtype',
    comp: 'select',
    label: '日结类型',
    props: {
      options: [
        { id: 1, name: '门诊' },
        { id: 2, name: '挂号' }
      ]
    }
  },
  {
    name: 'itemType',
    label: '分类',
    props: {
      options: MATERIA_TYPE_OPTIONS.filter(item => !['299', '300', '10008'].includes(item.id))
    }
  },
  {
    name: 'visitStartDate',
    label: '业务日期',
    comp: 'custom'
  },
  {
    name: 'openTime',
    label: '开单时间',
    comp: 'custom'
  },
  {
    name: 'exeTime',
    label: '执行时间',
    comp: 'custom'
  },
  {
    name: 'insuranceorgid',
    label: '医保单位',
    comp: 'custom'
  },
  {
    name: 'overallarea',
    comp: 'select',
    label: '区域',
    props: {
      options: []
    }
  },
  {
    name: 'treattype',
    comp: 'select',
    label: '医疗类别',
    props: {
      options: []
    }
  },
  {
    name: 'hospitalizedNumber',
    label: '住院编号'
  },
  {
    name: 'termType',
    comp: 'select',
    label: '医嘱类型',
    props: {
      options: [
        { id: '0', name: '临时医嘱' },
        { id: '1', name: '长期医嘱' }
      ]
    }
  },
  {
    name: 'isHide',
    label: '',
    comp: 'custom'
  }
]
export default {
  props: ['code', 'pageObject'],
  data () {
    let schema = this.pageObject.schema || []
    let querySchema = []
    schema.forEach(item => {
      if (item instanceof Object) {
        if (this.code === 'report_storageroom_apply' && this.$route.path.indexOf('/storages') > -1 && item.name === 'orgId') return
        if (this.code === 'report_storageroom_apply' && this.$route.path.indexOf('/storages/') > -1 && item.name === 'storageRoomId') {
          const storageOptions = storage.getLocalStorage('STORAGE_ITEM') ? JSON.parse(storage.getLocalStorage('STORAGE_ITEM')) : []
          if (storageOptions.length) item.props.initOptions = storageOptions
        }
        querySchema.push(item)
      } else {
        const thisItem = singleSchema.find(child => child.name === item)
        thisItem && querySchema.push(thisItem)
      }
    })
    let deptSchema = querySchema.find(item => { return item.name === 'deptId' })
    if (deptSchema) {
      if (['report_work_ip_kdltjmx_new'].includes(this.code)) {
        deptSchema.label = '开单科室'
      } else if (['report_work_mt_gzltj_settlement', 'report_work_mt_zxltjmx_new'].includes(this.code)) {
        deptSchema.label = '执行科室'
      } else {
        deptSchema.label = '科室'
      }
    }
    let docSchema = querySchema.find(item => { return item.name === 'doctorId' })
    if (docSchema) {
      if (['report_work_mt_gzltj_settlement', 'report_work_mt_zxltjmx_new'].includes(this.code)) {
        docSchema.label = '执行人'
        docSchema.props.params = {
          everQueryType: 'out'
        }
      } else {
        docSchema.label = '医生'
        docSchema.props.params = {
          everQueryType: 'out',
          typeCodeList: ['DOCTOR'],
        }
      }
    }
    let typeSchema = querySchema.find(item => { return item.name === 'type' })
    if (typeSchema) {
      if (['report_work_mt_gzltj_settlement'].includes(this.code)) {
        typeSchema.label = '途径'
      } else {
        typeSchema.label = '类型'
      }
    }
    let itemTypeSchema = querySchema.find(item => { return item.name === 'itemType' })
    if (itemTypeSchema) {
      if (['report_work_mt_zxltjmx_new', 'report_work_mt_gzltj_settlement'].includes(this.code)) {
        itemTypeSchema.label = '项目名称'
        itemTypeSchema.props = {}
      } else {
        itemTypeSchema.label = '分类'
        itemTypeSchema.comp = 'select'
        itemTypeSchema.props = {
          options: MATERIA_TYPE_OPTIONS.filter(item => !['299', '300', '10008'].includes(item.id))
        }
      }
    }
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj = Object.assign(queryObj, this.pageObject.defaultQueryObj || {})
    if (this.code.indexOf('report_other_out_mzsfyrb') > -1) {
      queryObj.userId = localStorage.getItem('USERID')
    }
    return {
      queryObj,
      querySchema: JSON.parse(JSON.stringify(querySchema)),
      style: 'width:100%;height:85vh;',
      key: 0,
      show: false,
      url: `${this.$ever.api}/report-engine/reportJsp/showReportRedefine.jsp?hisReportCode=${this.code}&x-access-token=`,
      areaArr: [],
      typeArr: []
    }
  },
  computed: {
    timeDisabled () {
      return ['report_work_out_gzltjmx_today', 'report_work_out_gzltjhz_today'].includes(this.code)
    }
  },
  watch: {
    // 需要跟机构联动的数据
    'queryObj.orgId' (val) {
      this.$ever.getFieldFromSchema(this.querySchema, 'deptId') && (this.$ever.getFieldFromSchema(this.querySchema, 'deptId').props.params.orgIdList = Array.isArray(val) ? [...val] : [val])
      this.$ever.getFieldFromSchema(this.querySchema, 'exeDeptId') && (this.$ever.getFieldFromSchema(this.querySchema, 'exeDeptId').props.params.orgIdList = Array.isArray(val) ? [...val] : [val])
      this.$ever.getFieldFromSchema(this.querySchema, 'doctorId') && (this.$ever.getFieldFromSchema(this.querySchema, 'doctorId').props.params.orgIdList = Array.isArray(val) ? [...val] : [val])
      this.$ever.getFieldFromSchema(this.querySchema, 'openDeptId') && (this.$ever.getFieldFromSchema(this.querySchema, 'openDeptId').props.params.orgIdList = Array.isArray(val) ? [...val] : [val])
      this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId') && (this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId').props.params.clinicIds = Array.isArray(val) ? [...val] : [val])
      this.querySchema = JSON.parse(JSON.stringify(this.querySchema))
    },
    queryObj: {
      handler (val) {
        this.defaultSearch(val)
      },
      deep: true
    }
  },
  methods: {
    list () {
      this.key++
    },
    medicalOrgChange (val) {
      let areaOptions = this.areaArr.filter(item => { return item.insuranceOrgId === val })
      let typeOptions = this.typeArr.filter(item => { return item.insuranceOrgId === val })
      this.$ever.getFieldFromSchema(this.querySchema, 'overallarea').props.options = areaOptions
      this.$ever.getFieldFromSchema(this.querySchema, 'treattype').props.options = typeOptions
      this.queryObj.overallarea = ''
      this.queryObj.treattype = ''
    },
    defaultSearch (vals) {
      let val = JSON.parse(JSON.stringify(vals))
      for (let key in val) {
        if (val[key] == null) {
          val[key] = ''
        }
        if (Array.isArray(val[key])) {
          val[key] = val[key].join(',')
        }
      }
      this.key++
      this.mergeURL(val)
    },
    mergeURL (patenVal) {
      this.show = false
      this.url = this._url
      Object.keys(patenVal).forEach(val => {
        if (['visitStartDate', 'openTime', 'exeTime'].includes(val)) return
        if (Array.isArray(patenVal[val]) && (patenVal[val].includes('.') || patenVal[val].includes(','))) {
          this.url = this.url + ('&' + val + '=' + `${patenVal[val]}`)
        } else {
          this.url = this.url + '&' + val + '=' + `${patenVal[val]}`
        }
      })
      this.show = true
    },
    getOptions () {
      request(urlMap.report.getOverallarea, {}).then(res => {
        if (res.head.errCode === 0 && res.data) {
          res.data.forEach(item => {
            item.id = item.code
          })
          this.areaArr = res.data
        }
      })
      request(urlMap.report.getTreattype, {}).then(res => {
        if (res.head.errCode === 0 && res.data) {
          res.data.forEach(item => {
            item.id = item.code
          })
          this.typeArr = res.data
        }
      })
    }
  },
  components: {
    medicalOrgList
  },
  async created () {
    this.getOptions()
    this.url += `${storage.getLocalStorage('TOKEN')}`
    this._url = this.url
    // 判断是否是医生
    if (this.queryObj.doctorId) {
      await request('thc-platform-core/tsStaff/load/', {id: this.queryObj.doctorId}).then(res => {
        if (res.data && res.data.typeCode) {
          if (res.data.typeCode !== 'DOCTOR') {
            this.queryObj.doctorId = ''
          } else {
            this.defaultSearch(this.queryObj)
          }
        } else {
          this.defaultSearch(this.queryObj)
        }
      })
    } else {
      this.defaultSearch(this.queryObj)
    }
    this.$nextTick(() => {
      document.addEventListener('visibilitychange', () => {
        if (!document['hidden']) {
          let dom = document.querySelectorAll('.el-form .el-input__inner')
          if (dom && dom.length) dom.forEach(item => { item.blur() })
        }
      })
    })
  },
  mounted () {
  }
}
</script>

<style scoped>
.layout_inner .main-head{
  height: auto;
}
.box-iframe {
  position: relative;
}
</style>
