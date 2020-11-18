import { convertCharToPinyin } from '@/components/pinyin.js'
const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
export default {
  mounted () {
    if (this.$refs.cascader) this.$refs.cascader.handleInputChange = this.handleInputChange
  },
  methods: {
    handleInputChange (value) {
      const vm = this.$refs.cascader
      if (!vm.menuVisible) return
      vm.flatOptions.map(item => {
        item.map(option => {
          const pinyin = convertCharToPinyin(option.name || option.label)
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
        filteredFlatOptions = [{
          __IS__FLAT__OPTIONS: true,
          label: vm.t('el.cascader.noMatch'),
          value: '',
          disabled: true
        }]
      }
      vm.menu.options = filteredFlatOptions
      vm.$nextTick(vm.updatePopper)
    }
  }
}
