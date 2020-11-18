<template>
    <el-dialog title="结算单" :visible.sync="v" width="70%">
       <claimsettle  @close="close"></claimsettle>
    </el-dialog>
</template>
<script>
import claimsettle from '@/rcm/page/medicalinsurance/claimsettle'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    claimsettle
  },
  data () {
    return {
    }
  },
  methods: {
    close (val) {
      this.v = false
      this.$emit('getdata', val)
    }
  },
  computed: {
    v: {
      get () {
        return this.dialogVisible
      },
      set (val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  }
}
</script>

