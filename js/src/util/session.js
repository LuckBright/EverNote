import sessionapi from '@/auth/store/sessionapi'
import staticvars from '@/store/staticvars'
var preFix = staticvars.prefix

export default {
  async beforeCreate () {
    const CLINIC_ID = localStorage.getItem('CLINICID')
    if (CLINIC_ID) {
      this.$store.commit('setUser', { organizationId: CLINIC_ID })
    }
    const TOKEN = localStorage.getItem('TOKEN')
    if (!TOKEN) {
      window.location = preFix + '/login'
      return
    }
    let [resources, user] = await Promise.all([
      sessionapi.resources(),
      sessionapi.user()
    ])
    if (
      resources.head &&
      resources.head.errCode &&
      resources.head.errCode !== 0
    ) {
      window.location = preFix + '/login'
      return
    } else {
      if (resources.rID) {
        this.$store.commit('setResources', resources.rID)
      }
    }
    if (user) {
      user.name = user.displayName
      this.$store.commit('setUser', user)
      this.$store.commit('setMobile', user.telephoneNumber)
    }
  }
}
