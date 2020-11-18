<template>
  <el-select
    class="w"
    v-model="selectedStaffList"
    :multiple="multiple"
    filterable
    remote
    value-key="id"
    :disabled="disabled"
    :placeholder="placeholder"
    v-bind="localProps"
    :remote-method="remoteMethod"
    @blur="blurSelect"
    @change="changeValue"
    @clear="handleClear"
  >
    <el-option
      v-for="item in viewStaffList"
      :key="item.id"
      :label="item.name"
      :value="isObj() && multiple ? item : item.id"
    ></el-option>
  </el-select>
</template>
<script>
  /**
   * 2020-03-13
   * 远程搜索 + 多选时，会有一个bug尚未解决
   * bug描述：搜索并选择一个选项时，其他已选择的选项会变为 id
   * bug原因：初步对比得知element的版本有问题，通过升级element可能会起到效果
   * 目前解决方案：尽量不要使用远程搜索 + 多选，在遇到这种情况时，改为了一次性查询1000条数据 条件为 typeCode 有意义
   */
  import {request, requestWithCache} from '@/util/req'
  import orgUrlMap from '@/manages/page/organization/utils/urls'
  import '@/warehouse/page/building/assets/index.less'
  import {getObjByIncludes, isNotEmpty} from '@/manages/page/organization/utils/fns'
  // import {isNotEmpty} from '@/manages/page/organization/utils/fns'
  export default {
    props: {
      props: {
        type: Object,
        default () {
          return {}
        }
      },
      /**
       * 需要回显的数据，格式为
       * [
       *   {id: 'xx'},
       *   {id: 'xx'},
       * ]
       * 或者
       * ['xx']
       * 或者
       * {id: 'xx'}
       * 或者
       * 'xx'
       */
      value: {
        type: [Array, String, Object, Number],
        default: () => []
      },
      multiple: Boolean,
      /**
       * everQueryType 默认值 ''
       * everQueryType === 'out'
        */
      params: {
        type: Object,
        default () {
          return {
            everQueryType: '',
          }
        }
      },
      // 如果是多选，目前只支持一个属性 id
      // 暂时未遇到 既需要多选，又需要对象的情况
      fields: {
        type: [String, Array],
        default () {
          return ['id']
        },
      },
      disabled: Boolean,
      placeholder: {
        type: String,
        default: '请选择'
      },
      useCache: {
        type: Boolean,
        default: true,
      }
    },
    data () {
      return {
        // selectedStaffObjList: [],
        selectedStaffList: [],
        viewStaffList: [],
        originList: [],
        selectedLoaded: false,
        searchListLoaded: false,
        isEmpty: false,
        changeCount: 0,
      }
    },
    computed: {
      localProps () {
        return {
          clearable: true,
          ...this.props,
        }
      }
    },
    created () {
      // this.selectedStaffObjList = []
      // 查询数组数据
      // this.search()
    },
    watch: {
      value: {
        handler (val) {
          if (this.multiple) {
            if (val && val.length) {
              this.selectedStaffList = val.map(item => item.id === undefined ? item : item.id)
              if (this.isObj() && this.multiple) {
                this.selectedStaffList = val
              }
              if (!this.searchListLoaded) {
                this.search()
              } else {
                // 进行回显赋值
                this.reviewSelectedValue()
              }
            } else {
              this.selectedStaffList = []
              // console.log('multiple 值为空时，清空', 'search')
              // 当值为空时，清空搜索
              if (!this.searchListLoaded) {
                this.remoteMethod('')
              }
            }
          } else {
            if (isNotEmpty(val)) {
              this.selectedStaffList = val.id === undefined ? val : val.id
              if (!this.searchListLoaded) {
                this.search()
              } else {
                // 进行回显赋值
                this.reviewSelectedValue()
              }
            } else {
              this.selectedStaffList = ''
              // console.log('single 值为空时，清空', 'search')
              // 当值为空时，清空搜索
              if (!this.searchListLoaded) {
                this.remoteMethod('')
              }
            }
          }
          this.selectedLoaded = true
        },
        immediate: true,
        deep: true,
      },
      'params': {
        handler (val) {
          // console.log('参数变化', 'search')
          this.search()
        },
        deep: true,
      }
    },
    methods: {
      reviewSelectedValue () {
        setTimeout(() => {
          // 只在回显时执行
          this.syncSearSelectedItem()
        })
      },
      // isSearch 表示是否是手动检索
      search (keyword = '', isSearch = false) {
        // console.log('do search')
        let url = orgUrlMap.staff.pageList
        const pageSize = 20
        let params = {pagesize: pageSize, offset: 0, ...this.params, name: keyword || ''}
        if (this.params.everQueryType === 'out') {
          url = orgUrlMap.staff.getStaffListByCondition
          params = {pagesize: pageSize, offset: 0, ...this.params, nameList: [keyword || '']}
        }
        // 发送带有缓存功能的请求
        (this.useCache ? requestWithCache : request).bind(this)(url, params).then(res => {
          const list = this.params.everQueryType ? res.data.resultList : res.data.pageList
          this.originList = list
          this.viewStaffList = list
          this.isEmpty = !this.viewStaffList.length
          this.searchListLoaded = true
          if (isSearch) {
            // 改变值之后，如果是多选，则需要将已经选择过的值，添加到 viewList 中，否则，已选的值会变成id
            // if (this.multiple && this.selectedStaffList && this.selectedStaffList.length) {
            //   const temp = this.selectedStaffList.filter(s => this.viewStaffList.some(v => v.id === s))
            //   if (temp.length) {
            //     this.viewStaffList = [...temp.map(t => this.selectedStaffObjList.find(so => so.id === t)), ...this.viewStaffList]
            //   }
            // }
          } else {
            setTimeout(() => {
              // 只在回显时执行
              this.syncSearSelectedItem()
            })
          }
          // 查询结束后 向外暴露事件
          this.$emit('finish', {
            res
          })
        })
      },
      syncSearSelectedItem () {
        const doLoad = () => {
          // 先判断当前人是否在列表中存在
          if (this.multiple) {
            // 过滤出不在viewStaffList中的id
            if (this.selectedStaffList && this.selectedStaffList.length) {
              const list = this.selectedStaffList.filter(item => {
                return !this.viewStaffList.some(v => v.id === (this.isObj() ? item.id : item))
              })
              if (list.length) {
                request(orgUrlMap.staff.getStaffListByIdList, {idList: list.map(item => this.isObj() ? item.id : item)}).then(res => {
                  if (res.head.errCode === 0) {
                    // const arr = res.data.map(item => ({id: item.id, name: item.name}))
                    // this.selectedStaffObjList = [...arr]
                    const innerList = res.data.filter(item => {
                      return !this.viewStaffList.some(v => v.id === (this.isObj() ? item.id : item))
                    }).map(item => ({id: item.id, name: item.name}))
                    if (innerList.length) {
                      this.viewStaffList = [...innerList, ...this.viewStaffList]
                    }
                  }
                })
              }
            }
          } else {
            if (this.selectedStaffList && !this.viewStaffList.some(item => item.id === this.selectedStaffList)) {
              request(orgUrlMap.staff.load, {id: this.selectedStaffList}).then(res => {
                if (res.head.errCode === 0) {
                  // 由于是异步操作，在加入到数组之前再做一次判断
                  if (!this.viewStaffList.some(item => res.data.id === item.id)) {
                    this.viewStaffList = [{id: res.data.id, name: res.data.name}, ...this.viewStaffList]
                  }
                }
              })
            }
          }
        }
        if (this.searchListLoaded) {
          doLoad()
        } else {
          setTimeout(() => {
            doLoad()
          }, 500)
        }
      },
      getFields () {
        if (typeof this.fields === 'string') {
          return [this.fields]
        }
        return this.fields
      },
      isObj () {
        if (Array.isArray(this.fields)) {
          return this.fields.length !== 1
        } else {
          return false
        }
      },
      changeValue (value) {
        if (this.multiple) {
          if (value && value.length) {
            if (this.isObj()) {
              let objArray = value.map(v => this.getFields().map(f => ({[f]: v[f]})).reduce((p, c) => ({...p, ...c}), {}))
              this.$emit('change', objArray)
              this.$emit('input', objArray)
            } else {
              this.$emit('change', value)
              this.$emit('input', value)
            }
          } else {
            this.$emit('change', [])
            this.$emit('input', [])
          }
          // value.forEach(s => {
          //   if (!this.selectedStaffObjList.some(so => so.id === s)) {
          //     this.selectedStaffObjList.push(this.originList.find(o => o.id === s))
          //   }
          // })
        } else {
          if (value) {
            const list = getObjByIncludes(this.originList.find(staff => staff.id === value), this.getFields())
            this.$emit('change', this.isObj() ? list : list[this.getFields()[0]])
            this.$emit('input', this.isObj() ? list : list[this.getFields()[0]])
          } else {
            this.$emit('change', '')
            this.$emit('input', '')
          }
        }
      },
      remoteMethod (keyword) {
        // console.log('keyword', keyword)
        this.search(keyword, true)
      },
      handleClear () {
        // console.log('handleClear', 'search')
        this.search()
      },
      blurSelect () {
        setTimeout(() => {
          // 当上次的检索结果为空时，执行此操作
          if (!this.multiple && this.isEmpty) {
            // console.log('blurSelect', 'search')
            this.remoteMethod('')
          }
        })
      },
    },
  }
</script>
