<template>
</template>
<script>
import { objFind } from '@/util/common'

export default {
  props: {
    checks: {
      type: Array,
      default: () => []
    },
    query: {
      type: Object
    }
  },
  created () {
    this.$bus.$off('hospital_patient_list_mq_refresh')
    this.$bus.$on('hospital_patient_list_mq_refresh', this.checkInpatient)
    this.$bus.$on('storageChange', () => {
      this.$emit('refresh', 'storage')
    })
  },
  methods: {
    checkInpatient (inpatients) {
      if (this.query && this.query.patientId) {
        let patient = objFind(inpatients, {patientId: this.query.patientId})
        if (!patient) {
          this.$emit('refresh', false, false, inpatients)
          return
        }
        let changeKey = ''
        this.checks.forEach(k => {
          if (String(this.query[k]) === String(patient[k])) {
            return
          }
          changeKey = k
        })
        this.$emit('refresh', changeKey, patient, inpatients)
        return
      }
      this.$emit('refresh', false, false, inpatients)
    }
  }
}
</script>
