<template>
  <div>
    <el-input v-model="personno" maxlength="20">
      <icCard
        slot="suffix"
        :insuranceOrgId="insuranceOrgId"
        :scence="1"
        @emitPersonNo="emitPersonNo"
        :usedInPersonNo="true"
      ></icCard>
    </el-input>
  </div>
</template>

<script>
import icCard from '@/components/readdevice/iccard/iccard.vue'
import { componentUpward } from '@/warehouse/views/util/index.js'
export default {
  props: ['value', 'insuranceOrgId'],
  data () {
    return {
      hasCard: true
    }
  },
  computed: {
    personno: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  methods: {
    emitPersonNo (medicalInfo) {
      this.personno = medicalInfo.personno
      const $parent = componentUpward(this, 'getSystemIdfromPersonno')
      if ($parent) {
        $parent.getSystemIdfromPersonno(medicalInfo)
      }
    },
  },
  components: {
    icCard
  }
}
</script>
