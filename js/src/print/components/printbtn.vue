<template>
  <el-dropdown split-button  :size="size" :type="type" trigger="click"
    @click="print(code, params, lang || (langs.length&&langs[0]))"
    @command="command => {print(code, params, command)}">
    <slot>打印</slot>
    <el-dropdown-menu slot="dropdown" class="table-button-menu">
      <el-dropdown-item v-for="v in langs" :key="v" :command="v" :class="{active: lang && lang === v}">{{getLangStr(v)}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  import {everprint} from '@/util/print'
  import {request} from '@/util/req'
  import {default as api} from '@/warehouse/store/sysvalueapi'
  import {commandLog} from '@/phr/mixin/operationLog.js'
  
  export default {
    props: {
      code: {
        type: String,
        required: true
      },
      params: {
        type: Object
      },
      size: {
        type: String,
        default: 'normal'
      },
      type: {
        type: String,
        default: 'default'
      },
      lang: {
        type: String,
        default: null
      },
      supportLangs: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        langs: ['_preview'],
        langMap: {
        }
      }
    },
    methods: {
      print (code, params, lang) {
        commandLog({// 需要加备注
          content: `打印${this.params.title}`,
          opModuleOne: `电子病历-门诊病历-${this.params.categoryName}`,
          opType: 'PRINT',
          patientId: this.params.patientId,
          patientName: this.params.patientName,
          visitNumber: this.params.visitId
        })
        let preview = false
        if (lang && lang.endsWith('_preview')) {
          lang = lang.substring(0, lang.length - '_preview'.length)
          preview = true
        }
        everprint(code, params, {
          preview,
          lang
        })
      },
      getLangStr (lang) {
        let suffix = ''
        if (lang.endsWith('_preview')) {
          lang = lang.substring(0, lang.length - '_preview'.length)
          suffix = '预览'
        }
        let langStr = this.langMap[lang] || '中文'
        langStr += suffix
        return langStr
      },
      addPreview (langs) {
        return langs.reduce((acc, curr) => {
          return [...acc, curr, curr + '_preview']
        }, [])
      }
    },
    created () {
      api.listOnce('THC_SYS_LANGUAGE').then(result => {
        let map = result.reduce((acc, curr) => {
          acc[curr.code] = curr.name
          return acc
        }, {})
        map[''] = '打印'
        this.langMap = map
      })
      if (!this.supportLangs) {
        request('/platform-extend/base/print/vt/langSupports', {
          code: this.code
        }, 'get').then(result => {
          if (result.data.length) {
            this.langs = this.addPreview(result.data)
          }
        })
      } else {
        if (this.supportLangs.length > 0) {
          this.langs = this.addPreview(this.supportLangs)
        }
      }
      // this.langs = [this.lang, this.lang + '_preview']
      // 请求所有可打印语言列表
    }
  }
</script>
<style lang="scss" scoped>
  .el-dropdown-menu{
    /deep/ .el-dropdown-menu__item{
      &.active{
        color: #fff;
        background: #1c7bef;
      }
    }
  }
</style>
