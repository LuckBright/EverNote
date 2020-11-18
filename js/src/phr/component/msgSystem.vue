<template>
  <msg-sys-text v-if="msgData.systemType === SYSTEMMSGTYPE[6] || msgData.systemType === SYSTEMMSGTYPE[7]" :msgData="msgData.systemData"></msg-sys-text>
  <msg-sys-notice v-else-if="msgData.systemType === SYSTEMMSGTYPE[8]" :msgData="msgData.systemData"></msg-sys-notice>
</template>

<script>
import { SYSTEMMSGTYPE } from '../util/models'
import msgSysText from './msgSysText'
import msgSysNotice from './msgSysNotice'

export default {
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      SYSTEMMSGTYPE
    }
  },
  components: {
    msgSysText,
    msgSysNotice
  }
}
</script>
