<template>
  <el-dialog
    title="优惠详情"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="v"
    class="ui_dialog_02"
    width="70%"
  >
    <dialogbenefitdetail :obj="obj" :key="obj.id"></dialogbenefitdetail>
  </el-dialog>
</template>
<script type="text/javascript">
import dialogbenefitdetail from './dialogbenefitdetail'
export default {
  props: ['obj', 'dialogBenefitVisible'],
  data () {
    return {
    }
  },
  components: {
    dialogbenefitdetail
  },
  computed: {
    v: {
      get () {
        return this.dialogBenefitVisible
      },
      set (val) {
        this.$emit('update:dialogBenefitVisible', val)
      }
    }
  }
}
</script>
