<template>
  <el-select
    v-model="phrform"
    filterable
    remote
    placeholder="请输入关键词"
    :remote-method="remotelist"
    @clear="clear"
    clearable
    @change="getObj"
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
  import phrapi from '../store/phrapi'
  import tplapi from '../store/phrtplapi'
  
  export default {
    props: ['value', 'dptId'],
    data () {
      return {
        options: []
      }
    },
    created () {
    },
    computed: {
      phrform: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      getObj (val) {
        let data = {}
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].id === val) {
            data.id = this.options[i].dataId
            data.type = this.options[i].type
          }
        }
        this.$bus.$emit('templateManage', data)
      },
      list () {
        phrapi.getTpls(this.dptId).then(result => {
          this.options = result.resultList.map(v => {
            return {
              id: v.templateId,
              name: v.schema.templateName
            }
          })
        })
      },
      clear () {
        this.$emit('clear')
      },
      remotelist (val) {
        tplapi.getTemplateListByName({name: val, dptId: this.dptId}).then(res => {
          this.options = res.map(v => {
            return {
              id: v.formTemplateId,
              name: v.formTemplateName,
              dataId: v.id,
              type: v.type
            }
          })
        })
      }
    },
    watch: {
      'dptId' (newVal) {
        if (newVal) {
          this.list()
        }
      }
    }
  }
</script>
