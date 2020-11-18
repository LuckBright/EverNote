<template>
  <el-dialog
    title="医保报销信息"
    :visible.sync="v"
    width="70%"
    class="medicalsettle"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="insurancefee">
      <!-- 通过insuranceOrgId与filedMaps字段映射，可以自动显示出报销信息 -->
      <ReimburseinfoUnit :result="result" :fieldMap="filedMaps[insuranceOrgId]"></ReimburseinfoUnit>
    </div>
  </el-dialog>
</template>
<script>
import { getMedicalResultBySettlementId } from '@/rcm/store/outpatient/outpatient.js'
import ReimburseinfoUnit from '@/rcm/otmdiscomponent/reimburseinfo/reimburseinfo-unit.vue'
import {jlccybCode, jlssbCode, hljybCode, jljhCode, sdllCode} from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { tableconfig as jlccFieldMap } from '@/rcm/otmdiscomponent/config-js/reimburseinfo.js'
import { tableconfig as jlsbFieldMap } from '@/rcm/otmdiscomponent/config-js/jlssb-reimburseinfo.js'
import { tableconfig as hljFieldMap } from '@/rcm/otmdiscomponent/config-js/hljyb-reimburseinfo.js'
import { tableconfig as jljhFieldMap } from '@/rcm/otmdiscomponent/config-js/jljh-reimbuseinfo.js'
import { tableconfig as sdllFieldMap } from '@/rcm/otmdiscomponent/config-js/sdll-reimbuseinfo.js'
export default {
  props: ['settlementId', 'reimburvisiavle'],
  data () {
    return {
      result: {},
      insuranceOrgId: '',
      filedMaps: {
        [jlccybCode]: jlccFieldMap,
        [jlssbCode]: jlsbFieldMap,
        [hljybCode]: hljFieldMap,
        [jljhCode]: jljhFieldMap,
        [sdllCode]: sdllFieldMap
      }
    }
  },
  computed: {
    v: {
      get () {
        return this.reimburvisiavle
      },
      set (val) {
        this.$emit('update:reimburvisiavle', val)
      }
    }
  },
  methods: {
    getMedicalResultBySettlementId () {
      let params = { settlementId: this.settlementId }
      getMedicalResultBySettlementId(params).then(res => {
        this.insuranceOrgId = res.data && res.data.insuranceOrgId
        this.result = res.data
      }, err => { console.log('err', err) })
    }
  },
  mounted () {
    this.getMedicalResultBySettlementId()
  },
  components: {
    ReimburseinfoUnit
  }
}
</script>
<style scoped>
.insurancefee {
  border: 1px solid #cccccc;
}
.medicalsettle /deep/ .el-dialog__title {
  font-size: 18px;
  color: #000;
  font-weight: 500;
}
</style>

