<template>
  <el-cascader
    ref="cascader"
    style="width: 100%"
    v-model="input"
    :placeholder="placeholder || '请选择'"
    :options="options"
    :disabled="disabled"
    :filterable="filterable"
    :clearable="(clearable || (field && (field.clearable || field.clearable === undefined))) ? true : false"
    :separator="separator || '/'"
    :props="props"
    :size="size"
    :filterMethod="filterMethod"
    :partCascader="field && field.partCascader"
    @focus="focus"
    @blur="blur"
  ></el-cascader>
</template>

<script>
import { base as axios } from './baseapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { objKeyBy, objFind, isNull } from '@/util/common'
import { convertCharToPinyin } from '@/components/pinyin.js'
import storage from '@/util/storage'
import selfApi from './self.com.api'

const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
export default {
  props: [
    'value',
    'code',
    'cache',
    'placeholder',
    'disabled',
    'filterable',
    'clearable',
    'separator',
    'field',
    'apiUrl',
    'apiParams',
    'size'
  ],
  data () {
    return {
      objFind,
      input: [],
      options: [],
      postdata: {},
      props: {
        value: 'id',
        label: 'name'
      },
      dropRate: []
    }
  },
  async created () {
    if (this.code === 'CV06.00.102') {
      await this.getDropRate()
    }
    let val = this.value
    if (val && typeof val === 'string') {
      val = [val]
    }
    this.input = val || []
    await this.setOptions()
    // this.input = this.value
    if (this.input.length && this.options && this.options.length) {
      this.handleItemChange(this.input)
    }
    this.$refs.cascader.handleInputChange = this.handleInputChange
  },
  methods: {
    filterMethod (node, keyword) {
      let option = node.data
      // 头疼！！！
      let parent = node.parent && node.parent.data
      let parentHasKey = parent && (parent.name.includes(keyword) || parent.quanpin.includes(keyword) || parent.shoupin.includes(keyword))
      return parentHasKey ||
        option.name.includes(keyword) ||
        option.quanpin.includes(keyword) ||
        option.shoupin.includes(keyword)
    },
    toPinyinOptions (options) {
      if (!options || !options.length) {
        return []
      }
      options.forEach(item => {
        item = Object.assign(item, convertCharToPinyin(item.name))
        if (item.children) {
          this.toPinyinOptions(item.children)
        }
      })
      return options
    },
    handleInputChange (value) {
      const vm = this.$refs.cascader
      vm.menu.options = []
      if (!vm.menuVisible) return
      vm.flatOptions.map(item => {
        item.map(option => {
          const pinyin = convertCharToPinyin(option.name)
          option.quanpin = pinyin.quanpin
          option.shoupin = pinyin.shoupin
        })
      })
      const flatOptions = vm.flatOptions
      if (!value) {
        vm.menu.options = vm.options
        vm.$nextTick(vm.updatePopper)
        return
      }
      let filteredFlatOptions = flatOptions.filter(optionsStack => {
        return optionsStack.some(
          option =>
            (new RegExp(escapeRegexpString(value), 'i').test(
              option[vm.labelKey]
            ) ||
              new RegExp(escapeRegexpString(value), 'i').test(
                option.quanpin
              ) ||
              new RegExp(escapeRegexpString(value), 'i').test(
                option.shoupin
              ))
        )
      })
      if (filteredFlatOptions.length > 0) {
        filteredFlatOptions = filteredFlatOptions.map(optionStack => {
          return {
            __IS__FLAT__OPTIONS: true,
            value: optionStack.map(item => item[vm.valueKey]),
            label: vm.renderFilteredOptionLabel(value, optionStack),
            disabled: optionStack.some(item => item[vm.disabledKey])
          }
        })
      } else {
        filteredFlatOptions = [
          {
            __IS__FLAT__OPTIONS: true,
            label: vm.t('el.cascader.noMatch'),
            value: '',
            disabled: true
          }
        ]
      }
      vm.menu.options = filteredFlatOptions
      vm.$nextTick(vm.updatePopper)
    },
    async handleItemChange (val) {
      if (this.code !== 'CV06.00.102') {
        if (val && val[0]) {
          const res = await this.apiSearch(val[0])
          this.options = res
          this.toPinyinOptions(this.options)
          // this.options.map((item, index) => {
          //   if (item.id === val[0]) {
          //     if (res && res.length) {
          //       this.$set(item, 'children', res)
          //       this.$set(this.options, index, item)
          //       this.$set(this.input, 1, res[0].id)
          //       // this.$nextTick(_ => {
          //       //   setTimeout(() => {
          //       //     if (res[0].id && this.$refs.cascader.menu && this.$refs.cascader.menu.$refs.menus) {
          //       //       const nextMenu = this.$refs.cascader.menu.$refs.menus[1]
          //       //       nextMenu.querySelectorAll("[tabindex='-1']") && nextMenu.querySelectorAll("[tabindex='-1']").length && nextMenu.querySelectorAll("[tabindex='-1']")[0].focus()
          //       //     }
          //       //   }, 300)
          //       // })
          //     }
          //   }
          //   return item
          // })
        }
      } else {
        // if (val[0] === '2275') {
        if (val[0] === '405' && !val[1]) {
          this.$set(this.input, 1, this.dropRate[0].id)
        }
      }
    },
    async getDropRate () {
      let res = await sysvalue.listOnce('THC_CPOE_DropRate')
      if (res && res.length) {
        this.dropRate = res
      } else {
        this.dropRate = []
      }
    },
    async setOptions () {
      let result = []
      // 用药频次特殊处理
      if (this.code === 'CV06.00.228') {
        result = await this.remoteMethod()
        if (this.input && this.input.length) {
          let selected = objFind(result, {id: this.input[0]})
          if (selected) {
            if (this.input.length === 1) {
              this.input.push(selected.children[0].id)
            }
            if (this.input.length === 2) {
              let child = objFind(selected.children, {id: this.input[1]})
              if (!child) {
                this.input = null
              }
            }
          } else {
            this.input = null
          }
        } else {
          this.input = [result[0].id, result[0].children[0].id]
        }
        this.options = result || []
        this.toPinyinOptions(this.options)
        sessionStorage.setItem(
          'CV06.00.228',
          JSON.stringify({ options: this.options })
        )
        return false
      } else {
        result = await sysvalue.cascade(this.code)
        if (result && result.length) {
          this.options = result
        } else {
          this.options = []
        }
      }
      let itemKeys = ['id', 'name', 'code', 'nameEn', 'description', 'value', 'children']
      if (this.options && this.options.length) {
        this.options.map(item => {
          // 如果切换到英文需要取另外一个字段 by lvjiangtao 3.5.2_sp 需要改功能
          if (storage.getLocalStorage('LANG') === 'en') {
            item.name = item.nameEn ? item.nameEn : item.name
          }
          let keys = Object.keys(item)
          keys.forEach(sitem => {
            if (!itemKeys.includes(sitem)) {
              delete item[sitem]
            }
          })
          // 用法选择静脉滴注时，加载滴速
          if (this.code === 'CV06.00.102') {
            // if (item.id === '2275') {
            if (['404', '405'].includes(item.id)) {
              item.children = this.dropRate
            }
          } else {
            item.children = []
          }
          return item
        })
        if (this.cache) {
          sessionStorage.setItem(this.code, JSON.stringify({ options: result }))
        }
        this.toPinyinOptions(this.options)
        this.handleItemChange(this.input)
      }
    },
    async remoteMethod (data) {
      let params = data || {}
      let optionsArr = []
      if (this.apiUrl) {
        this.loading = true
        let options = []
        let result
        if (selfApi[this.apiUrl]) { // 对接口请求做本地处理
          result = await selfApi[this.apiUrl](params)
          return result.list || []
        } else {
          result = await axios.post(this.apiUrl, params)
        }
        this.loading = false
        if (result) {
          if (result.list && result.list.length) {
            options = result.list.slice(0)
          } else if (result.length) {
            options = result.slice(0)
          } else {
            optionsArr = ''
          }
          if (options && options.length) {
            options.forEach(item => {
              let opt = {
                id: item.id,
                name: item.name || item.displayName || item.position
              }
              if (!isNull(item.nameEn)) opt.nameEn = item.nameEn
              if (!isNull(item.code)) opt.code = item.code
              if (!isNull(item.value)) opt.value = item.value
              if (item.children) opt.children = item.children
              optionsArr.push(opt)
            })
          }
        } else {
          optionsArr = ''
        }
      }
      return optionsArr
    },
    async apiSearch (val) {
      // 动态判断组件接口访问
      if (this.apiParams && this.apiParams.length && val) {
        let params = objKeyBy(this.apiParams, 'value')
        let paramsKey = Object.keys(params)
        paramsKey.forEach(item => {
          this.postdata[params[item].code] = val
        })
        return await this.remoteMethod(this.postdata)
      } else {
        return ''
      }
    },
    focus () {
      // 解决聚焦没有触发下拉的问题
      this.$refs.cascader.toggleDropDownVisible(true)
    },
    blur () {
      // 解决失去焦点没有触发回收的问题
      // this.$refs.cascader.toggleDropDownVisible(false)
    }
  },
  watch: {
    value (val) {
      if (val && typeof val === 'string') {
        val = [val]
      }
      this.input = val || []
    },
    input: {
      handler (val) {
        val = val || []
        if (val.length === 1) this.handleItemChange(val)
        this.$emit('input', val)
      },
      deep: true
    },
    code () {
      this.setOptions()
    }
  }
}
</script>
