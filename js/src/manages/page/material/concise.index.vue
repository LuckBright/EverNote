<template>
  <div class="overflowauto pos_re">
    <material-concise-list :isClinic="false" :pr="true"></material-concise-list>
  </div>
</template>

<script>
import materialConciseList from '@/warehouse/page/institutionmaterial/materiallist'
export default {
  data () {
    return {
      listType: 1
    }
  },
  methods: {
    listChang () {
      this.$router.push('/manages/material')
    }
  },
  components: {
    materialConciseList
  }
}
</script>

<style lang="scss" scoped>
.overflowauto{overflow-y:auto;}
.list-type{
  right: 10px;
  top: 10px;
  z-index: 22;
}
</style>
