<template>
  <el-dialog title="追加项目" :visible.sync="v" width="50%" class='order ui_dialog_02 spe' >
    <div class='scoll'>
      <prescription
          ref="pres"
          :title="'医嘱内容'"
          :visit-type="visitType"
          :show-add="showAdd"
          :filterPlaceholder="'请输入检查、检验、治疗、手术'"
          :init-data.sync="waitSendData"
          :callback-data="callbackData"
          :user-info="baseInfo"
          :is-add-tpl="true"
          :filterAdviceType="adviceType"
          @change="showAddEvent"
          @open="openAddEvent"
          @submit="submitEvent">
        </prescription>
    </div>
  </el-dialog>
</template>
<script>
import prescription from '@/inpatient/components/medical.orders/issued.orders'
export default {
  props: ['dialogVisible'],
  components: {
    prescription // 开医嘱组件
  },
  data () {
    return {
      visitType: 1,
      showAdd: false,
      adviceType: '300,800,801,802,867,2125',
      waitSendData: [],
      callbackData: '',
      baseInfo: this.$route.query
    }
  },
  created () {

  },
  watch: {
    'dialogVisible': {
      handler: function (val, oldval) {
        if (val) {
          // this.feeList.map(v => (v.flowFee = ''))
        }
      }
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
  },
  methods: {
    submitEvent (val) {
      this.$emit('appendFun', val)
      this.$emit('update:dialogVisible', false)
      this.waitSendData = []
    },
    showAddEvent () {
      this.showAdd = !this.showAdd
    },
    openAddEvent () {
      this.showAll = false
      this.showSend = true
      this.showAdd = true
    }
  }
}
</script>
