<template>
  <div id="ward_mgt">
    <listWaiting :space='space' :titleArr='titleArr' :areaId="areaId" :providerId="'5000.A03'" @waitingdbclick='turn' v-if='areaId' :key='areaId'></listWaiting>
    <bed :space='space' @turn='turn'></bed>
  </div>
</template>
<script>
import listWaiting from '@/inpatient/components/list.waiting.new'
import bed from '@/inpatient/page/bed'
import storage from '@/util/storage.js'
export default {
  props: ['space'],
  data () {
    return {
      storage,
      areaId: '',
      titleArr: ['病区患者', '待入科患者', '已出科患者', '我的患者', '科室患者'],
      // titleArr: ['我的患者', '科室患者']
    }
  },
  mounted () {
    let str = this.storage.getLocalStorage(`${this.space}Key`)
    if (str) this.areaId = str.split(',')[0]
  },
  methods: {
    turn (item) {
      let path
      if (this.space === 'inpatient') {
        path = '/inpatient/patientmgt/fee'
      } else if (this.space === 'resident') {
        path = '/resident/patientmgt/open'
      } else if (this.space === 'birth_nurse') {
        path = '/birth_nurse/patientmgt/advice'
      } else if (this.space === 'birth_doctors') {
        path = '/birth_doctors/patientmgt/open'
      }
      let query = {
        patientId: item.patientId,
        patientName: item.patientName,
        hospitalizedNumber: item.hospitalizedNumber,
        providerId: item.providerId,
        providerName: item.providerName,
        areaId: item.hospitalizedAreaId,
        bedId: item.bedId,
        bedName: item.bedName,
        status: item.status,
        doctorId: item.chargeDoctorId
      }
      if (item.isChild) { // 判断是孩子还是大人
        query.isChild = 1
        // query.neonateInBed = item.neonateInBed
      }
      this.$router.push({
        path,
        query
      })
    }
  },
  components: {
    bed,
    listWaiting
  }
}
</script>
<style lang="scss" scoped>
.ward_mgt {
  padding: 0;
  display: flex;
  flex-direction: row;
}
</style>

