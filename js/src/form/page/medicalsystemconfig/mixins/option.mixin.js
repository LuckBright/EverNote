import urlMap from '@/form/urls'
import { request } from '@/util/req'
import storage from '@/util/storage.js'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default {
  data () {
    return {
      levelOneName: '病历管理',
      levelTwoName: '病历系统配置',
      // 集团信息
      // tenantData: JSON.parse(storage.getLocalStorage('TENANTDATA')),
      // 机构类型
      orgScope: 1,
      // 机构名称
      orgName: ''
    }
  },
  computed: {
    tenantData () { // 租户信息
      let data = JSON.parse(JSON.stringify(this.$store.state.currentUser))
      data.userName = data.name// 将name存成另一个字段，要不需要改好几个配置文件
      data.name = data.tenantName// 把租户名称赋值给name
      return data
    },
    showOrg () {
      return !this.org && this.value.scope === this.orgScope
    }
  },
  created () {
    if (this.pageType === 'add' && this.org && !this.orgName) {
      // 添加机构类型时查询机构信息
      request(urlMap.commonConfig.getOrgList, {
        idList: [ storage.getLocalStorage('CLINICID') ]
      }).then(res => {
        if (res.head.errCode === 0 && Array.isArray(res.data)) {
          this.orgName = res.data[0].name
        } else {
          this.orgName = ''
        }
      })
    }
  },
  methods: {
    reset () {
      if (this.pageType === 'edit') {
        this.value = this.form
        // 机构不为空时回选机构
        if (this.value.orgId) {
          this.value.orgId = Object.assign({}, {
            id: this.value.orgId.toString(),
            code: this.value.orgId.toString(),
            name: this.value.orgName,
          })
        }
      }

      this.resetData()
      // 清除提示信息
      try {
        // 第一次加载报错
        this.$refs.form.resetFields()
      } catch (e) {}
    },
    // 自定义重置方法
    resetData () {
    },
    validate (log) {
      // 机构类型时 机构不允许为空
      if (this.value.scope === this.orgScope && !this.value.orgId) {
        this.$messageTips(this, 'error', '机构名称必填', '提示')
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(this.value, log)
        } else {
          return false
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    makeCommonData () {
      let data = Object.assign({}, this.value)
      // 新增时设置集团
      if (this.pageType === 'add') {
        data.tenantId = storage.getLocalStorage('TENANTID')
        data.tenantName = this.tenantData.name
      }
      if (this.value.orgId) {
        data.orgName = this.value.orgId.name
        data.orgId = this.value.orgId.id
      } else if (this.org) {
        data.orgId = storage.getLocalStorage('CLINICID')
        data.orgName = this.orgName
      } else {
        data.orgName = ''
        data.orgId = ''
      }

      return data
    },
    makeSaveData () {
      return this.makeCommonData()
    },
    async save (val, {name}) {
      let url = this.config[this.pageType]
      if (!this.editConfig && this.pageType === 'edit') {
        url = urlMap.commonConfig.edit
      }
      const msg = await request(url, this.makeSaveData())
      if (msg.head && msg.head.errCode === 0) {
        this.$emit('close')
        let tipMsg = '添加成功'
        if (this.pageType === 'edit') {
          tipMsg = '更新成功'
        }
        this.$messageTips(this, 'success', tipMsg, '提示')
        commandLog({
          content: `保存${this.value.orgName || this.value.tenantName || (this.value.orgId && this.value.orgId.name)}的${this.pageName}`,
          opModuleOne: `${this.levelOneName}-${this.levelTwoName}-${this.pageName}`,
          opType: 'SAVE'
        })
      }
    }
  }
}
