<template>
  <span v-if="icno">
    {{$t('社保信息')}}：
    <span class="pointer" @click="showClinicTrade">{{$t('基本医疗保险')}}</span>
    <dialog-clinictradelist :icno="icno" ref="clinictraderef"></dialog-clinictradelist>
  </span>
</template>
<script>
import dialogClinictradelist from '@/workspace/page/dialog-clinictradelist'

export default {
  components: {
    dialogClinictradelist
  },
  props: {
    'icno': {
      type: String,
      default: ''
    },
  },
  data () {
    return {
    }
  },
  methods: {
    showClinicTrade () {
      if (this.icno) {
        this.$refs.clinictraderef.open()
      }
    },
  }
}
</script>
