<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :width="dialogWidth"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :modal-append-to-body="true"
    >
      <span slot="title" class="fee-add-title f18">{{$t('补费')}}</span>
      <div v-if="visible">
        <patient-fee v-bind="$attrs"></patient-fee>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import patientFee from './index.vue'
export default {
  components: {
    patientFee
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '1400px'
    }
  },
  data () {
    return {
      name: '补费'
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.dialogShow
      },
      set: function (val) {
        this.$emit('update:dialogShow', val)
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:dialogShow', false)
      this.$emit('close')
    }
  }
}
</script>
