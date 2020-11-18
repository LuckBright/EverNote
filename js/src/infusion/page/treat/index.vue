<template>
  <div class="operate">
    <log ref='LOG' @close='$emit("close")'></log>
    <reject ref='REJECT' @close='$emit("close","REJECT")'></reject>
    <execute ref='EXECUTE' @close='$emit("close","EXECUTE")'></execute>
    <ediotor ref='CREATE_HANDWRITE_REPORT' @close='$emit("close")'></ediotor>
    <uploadFile ref='UPLOAD_FILE' @close='$emit("close")'></uploadFile>
  </div>
</template>
<script>
import log from './treat.log'
import reject from './reject.vue'
import execute from './execute.vue'
import ediotor from '@/infusion/page/dialog.ediotor.vue'
import uploadFile from '@/infusion/page/treat/treat.file.upload.vue'
export default {
  components: {log, reject, execute, ediotor, uploadFile},
  props: [],
  data () {
    return {

    }
  },
  methods: {
    open (patient, ids, code) {
      this.$refs[code].open(patient, ids, code)
    }
  }
}
</script>
<style lang="scss" scoped>
.operate{

}
</style>

