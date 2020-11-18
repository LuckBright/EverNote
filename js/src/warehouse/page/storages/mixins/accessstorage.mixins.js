import examineDialog from '@/warehouse/page/purchease/component/examineDialog.vue' // 审核弹窗
import tooltipInfo from '@/warehouse/page/components/tooltip.schema.vue' // 审核意见

// 出入库公用的审核schema
let examineSchema = [
  {
    name: 'auditerName',
    label: '审核人',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'auditTime',
    label: '审核时间',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'auditOpinion',
    label: '审核意见',
    comp: 'custom',
    span: 6
  }
]

export default {
  data () {
    return {
      examineSchema,
      visibleDialog: false,
      processConfig: this.$store.state.processConfig || {}
    }
  },
  components: {
    examineDialog,
    tooltipInfo,
  }
}
