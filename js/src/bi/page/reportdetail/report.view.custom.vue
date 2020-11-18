<template>
  <div class="settle_inner flex_column_full h100 oa custom">
    <component v-if="componentName" :is="componentName" :code="$route.params.code"></component>
    <purchasing-wh v-else :api="api" :reStatus="obj.status" :hisSubModule="hisSubModule" :apiName="obj.apiName" :exportType="obj.exportType" class="flex_column_full oa"></purchasing-wh>
  </div>
</template>
<script>
import api from '@/warehouse/page/storages/reportform/purchasing/purchasingapi'
import purchasingWh from '@/warehouse/page/storages/reportform/purchasing/purchasingwh'
import { apiName } from './reportconfig'
import phrVisitTotal from '@/phr/page/analysis/group_diagnosis'
import phrOrganDiagnosis from '@/phr/page/analysis/organ_diagnosis'
import phrDepartmentGroup from '@/phr/page/analysis/department_group'
import phrOutpatientDiagnosis from '@/phr/page/analysis/outpatient_diagnosis'
import phrHospitalDiagnosis from '@/phr/page/analysis/hospital_diagnosis'

export default {
  components: {
    purchasingWh,
    phrVisitTotal,
    phrOrganDiagnosis,
    phrDepartmentGroup,
    phrOutpatientDiagnosis,
    phrHospitalDiagnosis
  },
  props: {
    'hisSubModule': {
      type: String
    },
    componentName: String,
  },
  data () {
    return {
      obj: {
        apiName: 'dispensemedicinecount',
        exportType: '7',
        status: ''
      },
      api
    }
  },
  methods: {
    getReportObj (code) {
      if (apiName[code]) {
        this.obj.apiName = apiName[code].apiName
        this.obj.exportType = apiName[code].exportType
        this.obj.status = apiName[code].status
      }
    }
  },
  created () {
  },
  watch: {
    '$route.query.code': {
      handler (val) {
        if (val) {
          this.getReportObj(val)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.custom {
  height: calc(100vh - 114px);
}
</style>
