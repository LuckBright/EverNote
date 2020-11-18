<template>
  <div class="prescription_review">
    <prescription-review v-if='userId' :doctorId="userId"></prescription-review>
  </div>
</template>

<script>
import prescriptionReview from '@/warehouse/page/prescription.review/components/prescription.review'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  computed: {
    userId() {
      return this.$store.state.currentUser.userId
    }
  },
  mounted () {
  },
  components: {
    prescriptionReview
  },
  destroyed () {
  }
}
</script>

<style scoped>
</style>
