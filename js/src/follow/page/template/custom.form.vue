<template>
  <div>
    <ever-form2
      :schema="schema"
      v-model="obj"
      ref="form"
      :span="24"
      :label-width="'70px'"
      :label-position="'right'"
      :rules="rules"
      :readonly="readonly"
      @focus="(name, obj) => {this.$emit('focus', name, obj)}"
      @click="(name, obj) => {this.$emit('click', name, obj)}"
      class="form remote-form"
      :nosubmit="true"
    >
      <template v-for="name in slotNames" :slot="name">
        <slot :name="name">
          <search-select :key="name" v-model="obj[name]"></search-select>
        </slot>
      </template>
    </ever-form2>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { getMixed } from '@/util/formconverter'
import searchSelect from './search.select.vue'
export default {
  props: {
    'templateId': {
      type: String,
      default: ''
    },
    'readonly': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      obj: {},
      schema: [],
      rules: null,
      loading: false,
      initObj: {},
      selectList: [],
      slotNames: []
    }
  },
  created () {
    this._setFormInitData()
  },
  methods: {
    async _setFormInitData () {
      await request(urlMap.follow.propertyRuleTemplate.getByTemplateId, {
        templateId: this.templateId
      }, 'get').then(rs => {
        if (!rs.data) return
        if (rs.head.errCode === 0 && rs.data) {
          let element = []
          let tempObj = {}
          rs.data.rule.items && rs.data.rule.items.map(item => {
            let templabel = {
              label: item.name,
              name: item.keyName + '/' + item.id,
            }
            tempObj[item.keyName + '/' + item.id] = !Array.isArray(item.propertyValue) ? item.propertyValue : [].join()
            // isDynamic: true 调用后端远程搜索接口
            // slot 方式 展示select查询下拉
            if (item.isDynamic) {
              // todo
              item.formStyle.comp = 'custom'
              item.formStyle.name = item.keyName
              this.slotNames.push(item.keyName)
              tempObj[item.keyName] = []
            }
            if (item.formCode === 'radio') {
              item.formStyle.props = {
                type: item.formStyle.comp,
                options: item.customData && item.customData.filter(val => {
                  val.id = val.name
                  val.name = val.code
                  return val
                }),
              }
            }
            if (item.keyName === 'age') { // age custom
              item.formStyle.comp = 'custom'
              item.formStyle.name = 'age'
            }
            element.push(Object.assign(item.formStyle, templabel))
          })
          let obj = getMixed(element)
          this.schema = obj.schema
          obj.obj = tempObj
          this.obj = obj.obj || {}
        }
      })
    },
  },
  components: {
    searchSelect
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: calc(100% - 50px);
}
</style>
