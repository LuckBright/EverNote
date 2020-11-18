<template>
  <el-select
    v-model="select"
    filterable
    clearable
    class="mouse"
    remote
    :size="size"
    :disabled="disabled"
    :placeholder="placeholder"
    :remote-method="(query)=>{remoteMethod(query)}"
    :loading="loading"
    :needObjFlag="false"
    :value-key="needObjFlag ? 'id' : 'value'"
    @clear="clear"
    :default-first-option="true"
    @change="change">
    <el-option
      v-for="(option, i) in options"
      :key="i"
      :label="option.name"
      :value="needObjFlag ? option : option.id">
    </el-option>
  </el-select>
</template>
<script>
import setName from '@/util/setstatusname'
import { SEARCH_CODE, patch, MATERILA_PINYIN_CODE, GOLBAL_VAL_MATERIL_NAME, parserComplex, BLOOD_CLASSIFYID, GENERAL_CODE, BLOOD_SPECIFICATION } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
export default {
  /**
   * props                        字段含义
   * @param userType              只查询该账户所属内容
   * @param params                接口请求参数
   * @param apiName               接口请求名称
   * @param showKeys              物资数据展示 （Boolean）
   * @param simpleQuery           简单查询参数， 无需拼接condesMatchValues （Boolean）
   * @param showName              取数据某个对象的中得值 （Object）
   * @param filter                过滤返回数据中的某个字段值（value）
   * @param filterName            过滤返回数据中的某个字段键 (key)
   * @param retain                保留返回数据中的某个字段键 (value)
   * @param retainEqual           保留返回数据中的某个字段键 (key)
   * @param otherOption           保留不是库房的下拉选项 (boolean)
   * @param isLocalSettingSearch  是否需要localSettingSearch (boolean)
   * @param needObjFlag           是否返回option (boolean)
   * @param isMaterialPropertys   查找字段
   * @param isCodeBlood           是否增加血液code
   * @param isSilentQuery         是否需要静默查询
   * @param paramsNameToCustom    自定义查询参数name to custom(xxx)
   * @param paramsNameToCustomType 自定义查询参数key 数据类型(值类型)
   */
  props: ['value', 'showOrgName', 'customName', 'everHook', 'customId', 'placeholder', 'size', 'disabled', 'showName', 'api', 'initoptions', 'userType', 'params', 'apiName', 'showKeys', 'simpleQuery', 'filterName', 'filter', 'clearOptions', 'retainEqual', 'retain', 'otherOption', 'isLocalSettingSearch', 'needObjFlag', 'isMaterialPropertys', 'isCodeBlood', 'isObjSearch', 'isSilentQuery', 'simpleList', 'paramsNameToCustom', 'paramsNameToCustomType'],
  mixins: [setName, getstorage],
  data () {
    return {
      loading: false,
      options: this.initoptions || [],
      select: this.value,
      isObjSelect: ''
    }
  },
  watch: {
    'storageId': {
      handler (v) {
        if (this.options) this.options = []
      },
      deep: true
    },
    'value': function (v) {
      this.select = this.value
      if (this.needObjFlag) {
        // isObjSearch 临时解决方案，返回option不查询
        if (!this.isObjSearch) {
          this.isObjSelect = v.id
          this.remoteMethod(v.id)
        } else {
          this.options = [this.value]
        }
      } else {
        if (!this.clearOptions) {
          this.isObjSelect = v
          this.remoteMethod(v)
        }
      }
    },
    'select': function () {
      this.$emit('input', this.select)
    },
    'initoptions' () {
      this.options = this.initoptions
    },
    'api' (val) {
      if (this.isSilentQuery && val) this.remoteMethod()
    }
  },
  created () {
    if (this.isSilentQuery) this.remoteMethod()
  },
  methods: {
    clear () {
      if (this.clearOptions) this.options = []
      if (this.isSilentQuery) this.remoteMethod()
    },
    change (val) {
      this.$emit('change', val)
    },
    remoteMethod (name) {
      name = name || ''
      // if (name && this.select && name !== this.select) return
      if (name === undefined) {
        this.options = this.initoptions || []
      } else {
        if (!name && !this.isSilentQuery) return
        this.loading = true
        let params = Object.assign({}, { pagesize: 20 }, this.params)
        if (name === this.isObjSelect && this.isObjSelect || this.value === this.isSilentQuery) {
          params.id = this.isObjSelect ? this.isObjSelect : this.isSilentQuery
          params.isLocalSettingSearch = {
            id: this.isObjSelect ? this.isObjSelect : this.isSilentQuery
          }
        } else {
          if (this.showKeys && !this.simpleQuery) {
            // 增加拼音码搜索
            let codeQuery = []
            codeQuery = [...MATERILA_PINYIN_CODE, ...SEARCH_CODE]
            if (this.isCodeBlood) codeQuery = [...codeQuery, GENERAL_CODE]
            if (name) this.isLocalSettingSearch ? params = Object.assign({}, { codesMatchValues: [{ codes: codeQuery, value: name }] }, this.params) : params = Object.assign({}, { localSettingSearch: { codesMatchValues: [{ codes: codeQuery, value: name }] } }, this.params)
          } else {
            params.name = name
          }
        }
        params.filterOverdueRecord = true
        params.offset = 0
        if (typeof name === 'number') {
          params.localMaterialId = name
          params.name = ''
        }
        // 获取当前人员权限控制下库房 userType: true
        if (this.userType) {
          params.userType = 1
        }
        if (this.everHook && this.everHook.supplyParams) params = this.everHook.supplyParams(params)
        let apiName = this.apiName ? this.apiName : 'list'
        // 支持参数自定义name名称，并且根据传入的自定义类型赋值为字符串 或者 数组(请传入自定义参数类型时，首字母大写)
        if (this.paramsNameToCustom) {
          params[this.paramsNameToCustom] = this.paramsNameToCustomType === 'Array' ? [params.name] : params.name
          delete params.name
        }
        this.api[apiName](params).then(res => {
          if (res) {
            let stoUrl = this.$route.path.split('/')[1]
            let tempResult = res.list || res.data || res
            if (tempResult.resultList) tempResult = tempResult.resultList
            let result = stoUrl === 'storages' ? [] : [...tempResult]
            if (stoUrl === 'storages' && tempResult.length) {
              tempResult.forEach(item => {
                if (item.id !== this.storageId || this.showName === 'supplierObject' || this.otherOption) {
                  result.push(item)
                }
              })
            }
            // showName 转义对象参数 ---- 取对象name值
            if (this.showName) {
              for (let key in result) {
                if (!result[key].name) {
                  result[key] = Object.assign({}, result[key], { name: '' })
                }
                result[key].name = result[key][this.showName] ? result[key][this.showName].name : ''
              }
            }
            // filter      过滤字段值
            // filterName  过滤字段名字
            // 删除匹配filter(值)的数据
            let resArr = []
            if (this.filter) {
              result.forEach((item, i) => {
                if (String(item[this.filterName] || item.id) !== String(this.filter)) {
                  resArr.push(item)
                }
              })
            }
            // retain      保留字段值
            // retainEqual 保留字段名字
            // 保留匹配retain(值)的数据
            // 当有需要过滤字段值时，获取过滤后的数据匹配需要保留的数据
            if (this.filter && resArr) {
              result = []
              result = resArr.slice(0)
            }
            let newResArr = []
            // retain 非数组
            if (!Array.isArray(this.retain) && this.retain && this.retainEqual) {
              result.forEach((item, i) => {
                if (String(item[this.retainEqual]) === String(this.retain)) {
                  newResArr.push(item)
                }
              })
            }
            // retain 是数组的情况下
            if (Array.isArray(this.retain) && this.retain.length && this.retainEqual) {
              result.forEach((item, i) => {
                this.retain.forEach(items => {
                  if (String(item[this.retainEqual]) === String(items)) {
                    newResArr.push(item)
                  }
                })
              })
            }
            let opts = []
            if (this.filter || (this.retain && this.retainEqual)) {
              if (this.filter && !this.retain && !this.retainEqual) {
                opts = resArr
              } else {
                opts = newResArr
              }
            } else {
              opts = result
            }
            this.options = this.showKeys ? this._resetOptions(opts) : this.showOrgName ? this.orgResOptions(opts) : this.simpleList ? this.gerSimpleArr(opts) : opts
          } else {
            this.options = []
          }
          this.loading = false
        })
      }
    },
    gerSimpleArr (result) { // 数据结构为简单数组，无ID,name处理
      let data = []
      result.map(item => {
        data.push({
          id: item,
          name: item
        })
      })
      return data
    },
    orgResOptions (result) { // 处理平台给过来的扁平数据结构
      let data = []
      result.map(item => {
        if (item[this.customName]) {
          data.push({
            name: item[this.customName],
            id: item[this.customId] ? item[this.customId] : item.id
          })
        }
      })
      return data
    },
    _resetOptions (result) {
      for (let key = 0; key < result.length; key++) {
        let data = []
        // this.isMaterialPropertys ? data = result[key][this.isMaterialPropertys] : data = result[key].materialSkuObject.materialPropertys
        if (this.isMaterialPropertys && result[key][this.isMaterialPropertys]) {
          data = result[key][this.isMaterialPropertys]
        } else if (result[key].materialSkuObject) {
          data = result[key].materialSkuObject.ext
        } else { // 数据结构一天一变，为了兼容后端返回数据新增一个条件 2019-07-25
          data = result[key].ext
        }
        // 增加血液名称显示
        result[key].name = parserComplex({
          data,
          standard: true,
          propertys: result[key].classifyId === BLOOD_CLASSIFYID ? [GENERAL_CODE, ...BLOOD_SPECIFICATION] : GOLBAL_VAL_MATERIL_NAME.NAME_ONE
        })
      }
      return result
    },
    ...patch
  }
}
</script>
<style scoped>
  .el-select { width: 100%}
  .el-select /deep/ .el-input__inner { cursor: text!important}
</style>
