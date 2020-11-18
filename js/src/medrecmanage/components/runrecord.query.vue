<template>
  <ever-form2
    :schema="schema"
    v-model="obj"
    :gutter="20"
    :is-query="true"
    :inline="true"
    label-position="right"
    @query="search">
    <!-- 病历归档时显示归档按钮 -->
    <template slot="default" v-if="type !== 'runRecord'&&type !== 'printRecord'">
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="archive()">归档</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-show="obj.opStatus === '1'"
          type="primary"
          @click="exportIndex">
          病案首页导出
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="obj.opStatus === '1' && $hasPermission('Auth_menu_medrecord_archive_syncBtn')"
          type="primary"
          @click="syncData">
          同步病案首页
        </el-button>
      </el-form-item>
    </template>
    <!-- 选择科室组件 -->
    <template slot="dptId">
      <ever-subject-select
        ref="dept"
        v-model="deptId"
        type="select"
        placeholder="科室名称"
        fields="orgSubjectCode">
      </ever-subject-select>
    </template>
  </ever-form2>
</template>
<script>
import storage from '@/util/storage'
import { dateFormat } from '@/util/common'

export default {
  data () {
    let defaultSchema = [
      {
        name: 'dptId',
        label: '科室',
        comp: 'custom',
        span: 6
      },
      {
        name: 'visitId',
        label: '住院号',
        span: 6
      },
      {
        name: 'name',
        label: '姓名',
        span: 6
      },
      {
        name: 'admitDoctorId',
        label: '住院医师',
        comp: 'everStaffSelect',
        props: {
          clearable: true,
          type: 'select',
          fields: 'id',
          params: {
            typeCodeList: ['DOCTOR'],
            everQueryType: 'out',
          }
        },
        span: 6
      },
      {
        name: 'admission',
        label: '入院时间',
        comp: 'date-picker',
        props: {
          type: 'daterange',
          outformat: 'yyyy-MM-dd',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
        span: 6
      },
      {
        name: 'discharge',
        label: '出院时间',
        comp: 'date-picker',
        props: {
          type: 'daterange',
          outformat: 'yyyy-MM-dd',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
        span: 6
      },
      // 患者状态
      {
        name: 'patientStatus',
        label: '在院状态',
        comp: 'ever-select',
        span: 6,
        props: {
          options: [
            {
              id: '1',
              name: '在院'
            },
            {
              id: '2',
              name: '出院'
            }
          ]
        }
      },
      // 文书状态
      {
        name: 'opStatus',
        label: '归档状态',
        comp: 'ever-select',
        span: 6,
        props: {
          options: [
            {
              id: '0',
              name: '未归档'
            },
            {
              id: '1',
              name: '已归档'
            }
          ]
        }
      }
    ]
    let schema = []
    let obj = this.$ever.createObjFromSchema(defaultSchema)
    // 根据运行病历和病历归档显示不同查询状态字段
    if (this.type === 'printRecord') {
      schema = defaultSchema
    } else if (this.type === 'runRecord') {
      schema = defaultSchema.slice(0, 7)
    } else {
      schema = defaultSchema.slice(0, 6).concat(defaultSchema.slice(7, 8))
    }

    return {
      deptId: '',
      schema,
      obj: obj
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    deptId () {
      this.search()
    }
  },
  methods: {
    search () {
      this.$emit('query', this.makeSearchObj())
    },
    archive () {
      this.$emit('archive')
    },
    makeSearchObj () {
      let queryObj = Object.assign({}, this.obj)
      if (queryObj.admission && queryObj.admission.length === 2) {
        queryObj.admissionStartTime = dateFormat(this.obj.admission[0], false, 'startDay')
        queryObj.admissionEndTime = dateFormat(this.obj.admission[1], false, 'endDay')
      }
      delete queryObj.admission

      if (queryObj.discharge && queryObj.discharge.length === 2) {
        queryObj.dischargeStartTime = dateFormat(this.obj.discharge[0], false, 'startDay')
        queryObj.dischargeEndTime = dateFormat(this.obj.discharge[1], false, 'endDay')
      }
      delete queryObj.discharge

      if (this.deptId) {
        queryObj.dptId = this.deptId
      }
      return queryObj
    },
    async exportIndex () {
      const TOKEN = storage.getStorageByClinic('TOKEN')
      let obj = this.makeSearchObj()
      obj.orgId = storage.getLocalStorage('CLINICID')
      obj.tenantId = storage.getLocalStorage('TENANTID')
      let url = this.$ever.api + '/medical-record/doctor/exporter/export?'
      Object.keys(obj).forEach(val => {
        if (obj[val]) url += val + '=' + encodeURIComponent(obj[val]) + '&'
      })
      url += 'token=' + encodeURIComponent(TOKEN)
      url += '&x-access-token=' + encodeURIComponent(TOKEN)
      window.open(url)
    },
    syncData () {
      this.$emit('sync-data')
    }
  }
}
</script>

