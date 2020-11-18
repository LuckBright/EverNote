import { routerMap } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export const jumpRouter = (_this, inisuranceOrgId, visitNumber) => {
  let queryParams = encodeURIComponent(JSON.stringify({ visitNumber: visitNumber }))
  let path = routerMap[inisuranceOrgId]
  if (!path) {
    return false
  }
  window.open(window.location.origin + _this.$ever.adtIndex + path + '?q=' + queryParams, '_blank')
}
