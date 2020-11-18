<template>
  <div>
    <!-- 黑龙江慢病 -->
    <hljSpecialdis :specialDis.sync="hljSpecialdisShow" v-on="$listeners" v-bind="$attrs"></hljSpecialdis>
    <!-- 吉林蛟河慢病 -->
    <jljhSpecialdis :specialDis.sync="jljhSpecialdisShow" v-on="$listeners" v-bind="$attrs"></jljhSpecialdis>
  </div>
</template>

<script>
import hljSpecialdis from '@/rcm/otmdiscomponent/hljmedical/hlj-specialdis.vue'
import jljhSpecialdis from '@/rcm/otmdiscomponent/jljhmedical/jljh-specialdis.vue'
import { hljybCode, jljhCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  props: ['specialDis', 'insuranceOrgId'],
  data () {
    return {
      hljybCode,
      jljhCode
    }
  },
  computed: {
    hljSpecialdisShow: {
      get () {
        return this.specialDis && this.insuranceOrgId === hljybCode
      },
      set (newVal) { }
    },
    jljhSpecialdisShow: {
      get () {
        return this.specialDis && this.insuranceOrgId === jljhCode
      },
      set () { }
    }
  },
  components: {
    hljSpecialdis,
    jljhSpecialdis
  }
}
</script>
