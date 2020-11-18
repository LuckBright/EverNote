import { PRE_DEPOSIT_INQUIRY, FEE_SUMMARY_BY_DATE } from '@/bi/util/reportoutpatientschema'
import { TOTAL_CHARGE_MONITORING } from '@/bi/util/reportoutpatienttotalschema.js'

export function switchQuerySchema (code) {
  switch (code) {
    // case 'thc_rcm_alert_outpatient_charges':
    //   return CHARGE_MONITORING
    case 'thc_rcm_card_query_statical':
      return PRE_DEPOSIT_INQUIRY
    case 'thc_rcm_sum_outpatient_fee':
      return FEE_SUMMARY_BY_DATE
  }
}

export function switchTotalSchema (code) {
  switch (code) {
    case 'thc_rcm_alert_outpatient_charges':
      return TOTAL_CHARGE_MONITORING
  }
}
