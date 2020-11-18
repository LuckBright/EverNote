
<template>
  <div
    class="layout_box health_insurance_wrap"
    :class="{'page_layout_full_hidden': !$route.meta.notFull}"
  >
    <keep-alive class="flex_column_full_hidden station_layout_wrap" v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view class="flex_column_full_hidden station_layout_wrap" v-else></router-view>
  </div>
</template>

<script>
import '@/healthinsurance/assets/css/index.scss'
import session from '@/util/session'
import { mapActions } from '@/healthinsurance/store/modules/insuraneCenter/publish.js'
import getmacAddress from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
export default {
  mixins: [session, getmacAddress],
  methods: {
    ...mapActions(['getMedicalOrgList'])
  },
  async created () {
    // Vuex Methods
    await this.getMedicalOrgList()
  }
}
</script>
