<template>
  <span>
    <span v-if="showEn">{{$t(codeDisplay)}}</span>
    <span v-else>{{codeDisplay}}</span>
  </span>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import { string2Array, formatLang } from '@/util/common'

export default {
  /**
   * props                        字段含义
   * @param customVal             取options中自定义值
   * @param {Arrary} addOptions             添加options选项（值集中不存在的）[{code: 'x': name: 'xxx}]
   */
  props: ['code', 'type', 'value', 'multiple', 'initoptions', 'disabled', 'customVal', 'showEn', 'addOptions', 'split'],
  data: function () {
    return {
      options: []
    }
  },
  computed: {
    codeDisplay () {
      // options要是数组，如果不是数组转一下
      if (this.options.length > 0) {
        let valArr = this.code
        if (!Array.isArray(this.code)) {
          valArr = string2Array(this.code) || []
        }
        let multiArr = []
        this.options.filter(v => {
          valArr.forEach(item => {
            item = '' + item
            // 新的值集都是拿code来比较的，不在考虑原来的 id 和value 的兼容
            if (v.code === item) {
              multiArr.push(formatLang(v))
            }
          })
        })
        multiArr.reverse()
        let _tmpsplit = this.split || ','
        return multiArr.length ? multiArr.join(_tmpsplit) : this.disabled ? '无' : ''
      } else {
        return this.disabled ? '无' : ''
      }
    }
  },
  created () {
    this.setOptions()
  },
  methods: {
    setOptions () {
      this.options = []
      if (!this.initoptions) {
        sysvalue.listOnce(this.type).then(result => {
          if (result) {
            this.options = result
          } else {
            this.options = []
          }
          if (this.addOptions) {
            this.options.push(this.addOptions)
          }
          // 模拟后端值集接口返回双语数据方式，by lvjiangtao 3.5.2
          // this.options = this.options.filter(item => {
          //   item.nameEn = 'balabala'
          //   return true
          // })
        })
      } else {
        this.options = this.initoptions
      }
    }
  },
  watch: {
    'initoptions' (v) {
      this.options = v
    },
    type (val) {
      // 监听值集code变化  重新set options
      this.setOptions()
    }
  }
}
</script>
