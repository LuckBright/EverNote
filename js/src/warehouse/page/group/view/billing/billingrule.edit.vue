<template>
  <div>
    <ever-bread-crumb :name="backName" :path="'/manages/billingrule?isPoint=true'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner billing-rule-editor" v-if="schema.length">
      <ever-form2
        v-model="obj"
        ref="form"
        :schema="schema"
        :rules="rules"
        :row-flex="false"
        :inline="true">
        <template slot="taskTime">
          <time-picker-rule v-model="obj.taskTime"></time-picker-rule>
        </template>
        <div class="btn-box" slot="default">
          <el-button type="primary" @click="saveData">保存</el-button>
          <el-button type="default" @click="cancel">取消</el-button>
        </div>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/billingapi.js'
import managesApi from '@/manages/page/prescription/managesapi.js'
import timePickerRule from './time.picker.rule.vue'
import {objFind} from '@/util/common'
export default {
  components: { timePickerRule },
  data () {
    return {
      // api,
      obj: {},
      backName: '',
      clinicList: [],
      schema: [],
      rules: {}
    }
  },
  methods: {
    init () {
      this.orgType = this.$route.params.orgType
      this.id = this.$route.params.id
      if (this.id === '-1' || !this.id) {
        this.backName = '添加'
      } else {
        this.backName = '编辑'
      }
    },
    initData () {
      let formCon = this.getFormCon(this.orgType === 'group')
      this.schema = formCon.schema
      this.rules = formCon.rules
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.taskTime = '00:00:00'
      this.getByIdData(this.id)
    },
    cancel () {
      this.$router.push({name: 'billingrule', query: { isPoint: true }})
    },
    async getByIdData (id) {
      if (id === '-1') {
        return
      }
      let res = await api.getFeeRuleDetailById({id: id})
      if (res) {
        let keys = Object.keys(this.obj)
        keys.forEach(item => {
          this.obj[item] = String(res[item]) || null
        })
      }
    },
    async saveData (valid) {
      if (this.obj.taskTime === 'Invalid date') {
        this.obj.taskTime = ''
      }
      this.$refs.form.$refs.form.validate(async (valid) => {
        if (!valid) return
        let params = Object.assign({}, this.obj, {
          tenantId: this.tenantId,
        })
        if (this.orgType === 'group') {
          let org = objFind(this.clinicList, {id: this.obj.orgId})
          if (!org) {
            this.obj.orgId = null
            return
          }
          params.orgName = org.name
          params.isValid = 1
        } else {
          params.orgId = this.tenantId
          params.orgName = this.$store.state.currentUser.tenantName
        }
        if (this.id === '-1') {
          let res = await api.createFeeRule(params)
          if (res) {
            this.$messageTips(this, 'success', '添加成功')
            this.cancel()
            return
          }
          return
        }
        params.id = this.id
        let res = await api.updateFeeRule(params)
        if (res) {
          this.$messageTips(this, 'success', '编辑成功')
          this.cancel()
          return
        }
      })
    },
    async getClinics () {
      this.clinicList = []
      if (!this.tenantId) {
        return
      }
      let list = await managesApi.getTreeNodes({outOrgGetOrgListByConditionReqDTO: {idList: [this.tenantId]}}).then(res => res).catch(() => [])
      let self = this
      function mergeChild (data) {
        data.forEach(item => {
          // item.id !== self.tenantId &&
          self.clinicList.push({id: item.id, name: item.name})
          let childList = item.outOrgGetOrgAndChildrenResDTOList
          if (!childList || !childList.length) {
            return
          }
          mergeChild(childList)
        })
      }
      mergeChild(list)
    },
    getFormCon (type) {
      let schema = []
      let rules = {}
      if (type) {
        schema = [{
          name: 'orgId',
          label: '机构',
          comp: 'sys-select',
          props: {
            optionToStr: true,
            options: this.clinicList
          }
        }, {
          name: 'taskTime',
          label: '自动计费点',
          comp: 'custom'
        }, {
          name: 'timeRuleCode',
          label: '入院当天是否计费',
          comp: 'sys-select',
          span: 24,
          props: {
            // type: 'radio',
            options: [{id: 1, name: '是'}, {id: 0, name: '否'}]
          }
        }]
      } else {
        schema = [{
          name: 'taskTime',
          label: '自动计费点',
          comp: 'custom'
        }, {
          name: 'timeRuleCode',
          label: '入院当天是否计费',
          comp: 'sys-select',
          props: {
            // type: 'radio',
            options: [{id: 1, name: '是'}, {id: 0, name: '否'}]
          }
        }, {
          name: 'isValid',
          label: '状态',
          comp: 'sys-select',
          span: 24,
          props: {
            // type: 'radio',
            options: [{id: 1, name: '启用'}, {id: 0, name: '关闭'}]
          }
        }]
      }
      schema.forEach(item => {
        rules[item.name] = [{required: true, message: '必填项', trigger: ['blur', 'change']}]
      })
      return {schema, rules}
    }
  },
  watch: {
    '$store.state.currentUser': {
      async handler (val) {
        this.init()
        if (!val) return
        this.tenantId = val.tenantId
        if (this.orgType === 'group') {
          await this.getClinics()
        }
        this.initData()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.billing-rule-editor {
  background-color: transparent;
  .btn-box {
    margin-top: 20px;
  }
  /deep/ .el-form-item__label {
    font-weight: 700;
  }
}
.bg {
  background-color: #fff;
}
.pdlr20 {
  padding: 0px 20px;
}
.mgl20 {
  margin-left: 20px;
  padding-bottom: 20px;
}
.pdt20 {
  padding-top: 20px;
}
.mgt20 {
  margin-top: 20px;
}
.pd20 {
  padding: 20px;
}
.orderNumber {
  width: 120px;
}
.orderSelect {
  width: 120px;
  display: inline-block;
}
.orderinput {
  width: 170px;
  margin-left: 10px;
  display: inline-block;
}
.wid3 {
  width: 300px;
}
.el-form-item__label {
  width: 173px !important;
}
</style>
