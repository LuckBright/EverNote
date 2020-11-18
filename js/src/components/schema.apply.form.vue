<template>
  <div class="apply_form_wrap">
    <div class="handle_btn">
      <span class="h_txt" @click="applyFormShow" ref="apply">申请单</span>
    </div>
    <phrform-dialog
      ref="applyForm"
      :title="field.title"
      v-model="input"
      :data-id="dataId"
      :tpl-code="field.formCode"
      :base-info="baseInfo"
      :dataEcho="dataEcho"
    ></phrform-dialog>
  </div>
</template>
<script>
import phrformDialog from '@/form/components/phrform.dialog'

export default {
  props: ['value', 'field'],
  data () {
    return {
      input: this.value || {},
      baseInfo: this.$route.query,
      dataId: (this.value && this.value.id) || '-1'
    }
  },
  created () {
    this.$bus.$off('OPEN_DIALOG')
    this.$bus.$on('OPEN_DIALOG', val => {
      this.applyFormShow()
    })
  },
  computed: {
    dataEcho () {
      // 需要数据回显的表单code
      let dataEchoCodeArr = ['YUN_ZAO_QI_CHAN_QIAN_SHAI_CHA_SHEN_QING_DAN', 'YUN_ZHONG_QI_CHAN_QIAN_SHAI_CHA_SHEN_QING_DAN']
      if (dataEchoCodeArr.includes(this.field.formCode)) {
        return true
      }
      return false
    }
  },
  methods: {
    applyFormShow () {
      if (this.value && this.value.id) {
        this.dataId = this.value.id
      } else {
        this.dataId = '-1'
      }
      this.$refs.applyForm && this.$refs.applyForm.open()
    }
  },
  watch: {
    'value': {
      handler (val) {
        this.input = val || {}
      },
      deep: true
    },
    'input': {
      handler (val) {
        val = val || {}
        val.phrFormCode = this.field.formCode
        this.$emit('input', val)
      },
      deep: true
    }
  },
  components: {
    phrformDialog
  }
}
</script>
<style lang="scss" scoped>
.apply_form_wrap {
  .handle_btn {
    display: flex;
    height: 65px;
    align-items: flex-end;
    .h_txt {
      padding: 5px;
      line-height: 20px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>
