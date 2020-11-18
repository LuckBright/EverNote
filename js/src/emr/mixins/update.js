import {registTemplateModule, eventType} from '@/emr/store/template.module'
import { createNamespacedHelpers } from 'vuex'
let { mapState, mapMutations, mapActions } = createNamespacedHelpers('templateModule')
export default{
  beforeCreate () {
    if (this.$store.state['templateModule']) return
    registTemplateModule()
  },
  computed: {
    ...mapState(['templateChange', 'editorObj'])
  },
  methods: {
    ...mapMutations({
      setChange: eventType.SET_TEMPLATE_CHANGE,
      setEditor: eventType.SET_EDITOR_PARAMS
    }),
    ...mapActions({
      setAsyncChange: eventType.SET_TEMPLATE_CHANGE,
      setAsyncEditor: eventType.SET_EDITOR_PARAMS
    })
  }
}
