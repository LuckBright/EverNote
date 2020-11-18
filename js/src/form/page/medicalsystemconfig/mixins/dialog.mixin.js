import { request } from '@/util/req'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default {
  data () {
    return {
      levelOneName: '病历管理',
      levelTwoName: '病历系统配置',
      editForm: {},
      addVisible: false,
      editVisible: false,
      // 集团类型值
      tenantScope: 0,
      // 机构类型值
      orgScope: 1
    }
  },
  props: {
    org: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openAdd () {
      commandLog({
        content: `增加${this.pageName}`,
        opModuleOne: `${this.levelOneName}-${this.levelTwoName}-${this.pageName}`,
        opType: 'CLICK_CREATE'
      })
      this.addVisible = true
      this.reset('add')
    },
    openEdit (row) {
      commandLog({
        content: `修改了${row.orgName || row.tenantName}的${this.pageName}`,
        opModuleOne: `${this.levelOneName}-${this.levelTwoName}-${this.pageName}`,
        opType: 'CLICK_EDIT'
      })
      request(this.detailUrl, {id: row.id}).then(res => {
        if (res.head.errCode === 0) {
          this.editForm = Object.assign({}, res.data)
          this.$nextTick(() => {
            this.editVisible = true
            this.reset('edit')
          })
        }
      })
    },
    close (type) {
      this[type] = false
      this.$refs.list.query()
    },
    reset (form) {
      if (!this.$refs[form]) return
      this.$refs[form].reset()
    }
  }
}

