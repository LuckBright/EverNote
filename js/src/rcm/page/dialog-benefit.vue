<template>
  <el-dialog title="优惠详情" :visible.sync="v" class="ui_dialog_02">
    <dialogbenefitdetail :obj="obj" :key="obj.settlementid"></dialogbenefitdetail>
  </el-dialog>
</template>
<script type="text/javascript">
  import dialogbenefitdetail from '@/rcm/page/dialogbenefitdetail'
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
