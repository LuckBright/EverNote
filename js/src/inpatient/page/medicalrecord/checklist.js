import checkHistory from '@/inpatient/page/medicalrecord/check.history'
import checkJiancha from '@/inpatient/page/medicalrecord/check.jiancha'
import checkJianyan from '@/inpatient/page/medicalrecord/check.jianyan'
import checkYizhu from '@/inpatient/page/medicalrecord/check.yizhu'
export default {
  name: 'check_list',
  components: {
    checkHistory,
    checkJiancha,
    checkJianyan,
    checkYizhu,
  },
  props: {
    checkType: {
      type: String,
      required: true
    },
    visitId: {
      type: String,
      required: true
    },
    patientId: {
      type: String,
      required: true,
    },
    deptId: {
      type: String,
      required: true
    }
  },
  render (h) {
    let tag = `check-${this.checkType}`
    return h(tag, {
      class: {
        'flex_column_full_hidden': true
      },
      props: {
        hospitalizedNumber: this.visitId,
        deptId: this.deptId,
        patientId: this.patientId
      }
    })
  }
}
