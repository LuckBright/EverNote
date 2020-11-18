<template>
  <span>
    <el-cascader
      v-if="type === 'cascader'"
      class="w"
      v-model="selectedCodeListList"
      :options="list"
      :props="localCascaderProps"
      filterable
      :disabled="disabled"
      :placeholder="placeholder"
      v-bind="localProps"
      @change="changeValue"
      :filter-method="filterMethodCascader"
    ></el-cascader>
    <template v-else-if="type === 'tree'">
      <div class="subjectWar">
        <div class="flex-column">
          <p class="all">
            <el-checkbox v-model="selectAllFlag" :disabled="disabled">全选</el-checkbox>
          </p>
          <div class="flex1 oxhya">
            <el-tree
              v-model="selectedCodeListList"
              ref="tree"
              show-checkbox
              node-key="id"
              default-expand-all
              :data="list"
              :props="localCascaderProps"
              :default-checked-keys="ids"
              v-bind="localProps"
              @current-change="handleCurrentChange"
              @check="handleCheck"
            ></el-tree>
          </div>
        </div>
      </div>
    </template>
    <el-select
      v-else-if="type === 'select'"
      class="w"
      v-model="selectedCodeList"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      filterable
      :disabled="disabled"
      :placeholder="placeholder"
      v-bind="localProps"
      @change="changeValue"
      @blur="blurSelect"
      :filter-method="filterMethodSelect"
    >
      <el-option
        v-for="item in viewList"
        :key="item.id"
        :label="item.name"
        :value="item.code"
      ></el-option>
    </el-select>
  </span>
</template>
<script>
  import {request} from '@/util/req'
  import orgUrlMap from '@/manages/page/organization/utils/urls'
  import {convertListToTree, changeToTreeList, sortTreeListByIdList, getAllParentById, getObjByIncludes, isNotEmpty} from '@/manages/page/organization/utils/fns'
  import '@/warehouse/page/building/assets/index.less'
  import storage from '@/util/storage'
  import { convertCharToPinyin } from '@/components/pinyin.js'
  export default {
    props: {
      props: {
        type: Object,
        default () {
          return {}
        }
      },
      /**
       * 需要回显的数据，多选时，格式为
       * [
       *   {code: 'xx'},
       *   {code: 'xx'},
       * ]
       * 或者
       * ['xx', 'xx']
       * 单选时，格式为
       * {code: 'xx'} 或者 'xx'
       */
      value: {
        type: [Array, String, Object, Number],
        default: () => []
      },
      /**
       * 控制查询条件是机构id还是集团id
       */
      isOrg: {
        type: Boolean,
        default: true, // 默认是机构
      },
      /**
       * 展现形式 可选值：cascader select 其中cascader 是默认值
       */
      type: {
        type: String,
        default: 'cascader'
      },
      /**
       * 是否为多选，默认值是false
       */
      multiple: {
        type: Boolean,
      },
      collapseTags: {
        type: Boolean,
        default: false
      },
      /**
       * 查询参数
       * everQueryType 默认为空
       * 空 表示 查询当前机构及当前机构下所有下级机构 loadWithChildsById
       * isLogin 表示 查询 当前户可登录的机构
       * isOut 根据条件查询机构 默认返回当前登录人的执业机构
       */
      params: {
        type: Object,
        default () {
          return {
            everQueryType: '',
          }
        }
      },
      cascaderProps: {
        type: Object,
        default () {
          return {
            checkStrictly: true,
          }
        }
      },
      // 返回的字段 若传入 字符串，则返回的是字符串，若传入的数组，则返回的是对象
      fields: {
        type: [Array, String],
        default () {
          return [
            'id',
            'code',
            'name',
          ]
        }
      },
      disabled: Boolean,
      placeholder: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        selectedCodeListList: [], // 选中的code 数组 路径
        selectedObjListList: [], // 选中的对象数组 路径
        selectedCodeList: [], // 选中的code 数组
        selectedObjList: [], // 选中的对象数组
        selectedObj: [], // 选中的对象
        list: [], // 树状数据
        listForTree: [], // 可以转化为树的数据
        originList: [], // 平行数据
        viewList: [], // 平行数据
        selectedLoaded: false,
        listLoaded: false,
        changeProps: {label: 'name', id: 'code', parentId: 'parentCode'},
        ids: [],
        selectAllFlag: false,
        isEmpty: false,
      }
    },
    watch: {
      'value': {
        handler (val) {
          if (isNotEmpty(val)) {
            if (this.isMultiple()) {
              this.selectedLoaded = true
              this.selectedCodeList = val && val.length ? val.map(item => item.code === undefined ? item : item.code) : []
              this.setAsyncValue()
            } else {
              this.selectedLoaded = true
              this.selectedCodeList = val ? (val.code === undefined ? val : val.code) : null
              this.setAsyncValue()
            }
          } else {
            // 如果值为空的时候把 options的值清空
            if (this.isMultiple()) {
              this.selectedCodeList = []
            } else {
              this.selectedCodeList = null
            }
            this.selectedCodeListList = []
            this.filterMethodSelect('')
          }
        },
        deep: true,
        immediate: true,
      },
      // 请求接口时候带值过来参与查询和过滤
      'params': {
        handler (val) {
          if (this.search) {
            this.search()
          }
        },
        deep: true,
      },
      // tree选择的时候 勾选“全选”触发的方法
      'selectAllFlag' (val) {
        this.handleSelectAll(val)
      }
    },
    computed: {
      localCascaderProps () {
        return {
          ...this.cascaderProps,
          multiple: this.isMultiple()
        }
      },
      localProps () {
        return {
          clearable: true,
          ...this.props,
        }
      }
    },
    created () {
      // 查询集团下的机构，或者当前机构下的所有机构
      const config = this.getConfig()
      const params = config.params
      const everQueryType = params.everQueryType
      // const isLogin = params.isLogin
      delete params.everQueryType
      request(config.url, params).then(res => {
        let list = res.data.pageList
        if (everQueryType === 'isOut') {
          list = res.data.resultList
        }
        list = list.map(item => {
          const pinyin = convertCharToPinyin(item.name)
          return {
            ...item,
            _py_quanpin: pinyin.quanpin,
            _py_shoupin: pinyin.shoupin,
          }
        })
        this.originList = list
        this.viewList = list
        if (this.type === 'cascader' || this.type === 'tree') {
          this.listForTree = changeToTreeList(list, this.changeProps)
          this.list = convertListToTree(this.listForTree)
          this.listLoaded = true
          this.setAsyncValue()
        }
      })
    },
    methods: {
      getConfig () {
        const searchId = this.isOrg ? storage.getStorageByClinic('CLINICID') : storage.getLocalStorage('TENANTID')
        const config = {
          url: orgUrlMap.org.loadWithChildsById,
          params: {
            ...this.params,
            id: searchId,
          }
        }
        if (this.params.everQueryType === 'isOut') {
          config.url = orgUrlMap.org.getOrgListByCondition
          config.params = {
            staffIdList: [storage.getLocalStorage('USERID')],
            ...this.params,
          }
        } else if (this.params.everQueryType === 'isLogin') {
          config.url = orgUrlMap.org.loadByStaffId
          config.params = {
            staffId: localStorage.getItem('USERID'),
            staffLoginOrgPermission: '1',
          }
        }
        return config
      },
      // tree下全选勾选方法方法
      handleSelectAll (flag) {
        if (flag) {
          let res = []
          this.originList.forEach(item => {
            res.push(item.code)
          })
          this.selectedCodeListList = res
          this.$refs.tree.setCheckedKeys(res)
        } else {
          this.selectedCodeListList = []
          this.$refs.tree.setCheckedKeys([])
        }
        this.$emit('input', this.selectedCodeListList)
        this.$emit('change', this.selectedCodeListList)
      },
      // 监听tree形式的勾选方法
      handleCheck (data, val) {
        this.selectedCodeListList = this.$refs.tree.getCheckedKeys()
        this.$emit('input', this.selectedCodeListList)
        this.$emit('change', this.selectedCodeListList)
      },
      // 监听tree形式的勾选方法
      handleCurrentChange (data, val) {
        this.selectedCodeListList = this.$refs.tree.getCheckedKeys()
        this.$emit('input', this.selectedCodeListList)
        this.$emit('change', this.selectedCodeListList)
      },
      isMultiple () {
        return !!this.multiple || this.cascaderProps.multiple
      },
      // 当数据发生了变化，且数组已经查询完成，则进行赋值
      setAsyncValue () {
        if (this.type === 'cascader') {
          if (this.isMultiple() && this.selectedLoaded && this.listLoaded && this.selectedCodeList && this.selectedCodeList.length) {
            // 1. 将code组成的list，转化为有序的数组，【顺便将code转化为了对象】
            const objList = sortTreeListByIdList(this.listForTree, this.selectedCodeList)
            // 2. 将对象数组转化为路径对象数组
            this.selectedObjListList = objList.map(node => {
              const parentList = getAllParentById(this.listForTree, node.id)
              return [ ...parentList, node ]
            })
            // 3. 将路径对象数组转化为路径code数组，这样达到了显示的目的
            this.selectedCodeListList = this.selectedObjListList.map(nodeList => nodeList.map(item => item._id))
          } else if (!this.isMultiple() && this.selectedLoaded && this.listLoaded && this.selectedCodeList && this.selectedCodeList.length) {
            // 根据 this.selectedCodeList 获取路径
            const crtNode = this.originList.find(item => item.code === this.selectedCodeList)
            const parentList = getAllParentById(this.listForTree, this.selectedCodeList)
            this.selectedCodeListList = [
              ...parentList.map(item => item._id),
              crtNode._id,
            ]
          }
        } else if (this.type === 'tree') {
          // 如果是tree 传进来的值需要勾选上 给 default-checked-keys 赋值,同时给v-model赋值
          this.ids = this.value
          this.selectedCodeListList = this.value
        }
      },
      getFields () {
        if (typeof this.fields === 'string') {
          return [this.fields]
        }
        return this.fields
      },
      isObj () {
        return typeof this.fields !== 'string'
      },
      changeValue (value) {
        if (this.type === 'cascader') {
          if (this.isMultiple()) {
            if (!value) {
              this.$emit('input', [])
              this.$emit('change', [])
              return
            }
            this.selectedObjListList = value.map(item => item.map(id => {
              const org = this.originList.find(s => s._id === id)
              return this.isObj() ? {
                id: org._id,
                code: org.code,
                name: org.name,
              } : org[this.fields === 'id' ? '_id' : this.fields]
            }))
            this.selectedObjList = this.selectedObjListList.map(item => item[item.length - 1])
            this.$emit('input', this.selectedObjList)
            this.$emit('change', this.selectedObjList)
          } else {
            if (!value) {
              this.$emit('input', '')
              this.$emit('change', '')
              return
            }
            this.selectedObjListList = value.map(id => {
              const org = this.originList.find(s => s._id === id)
              return this.isObj() ? {
                id: org._id,
                code: org.code,
                name: org.name,
              } : org[this.fields === 'id' ? '_id' : this.fields]
            })
            this.selectedObjList = this.selectedObjListList[this.selectedObjListList.length - 1]
            this.$emit('input', this.selectedObjList)
            this.$emit('change', this.selectedObjList)
          }
        } else if (this.type === 'select') {
          if (this.isMultiple()) {
            this.selectedObjList = value.map(item => getObjByIncludes(this.originList.find(org => org.id === item), this.getFields()))
            this.$emit('input', this.isObj() ? this.selectedObjList : this.selectedObjList.map(item => item[this.fields]))
            this.$emit('change', this.isObj() ? this.selectedObjList : this.selectedObjList.map(item => item[this.fields]))
          } else {
            this.selectedObjList = getObjByIncludes(this.originList.find(org => org.id === value), this.getFields())
            this.$emit('input', this.isObj() ? (isNotEmpty(this.selectedObjList) ? this.selectedObjList : '') : this.selectedObjList[this.fields])
            this.$emit('change', this.isObj() ? (isNotEmpty(this.selectedObjList) ? this.selectedObjList : '') : this.selectedObjList[this.fields])
          }
        }
      },
      filterMethodCascader (node, keyword) {
        if (!keyword) return true
        let item = node.data
        return item.name.includes(keyword) ||
          item._py_quanpin.includes(keyword) ||
          item._py_shoupin.includes(keyword)
      },
      filterMethodSelect (keyword) {
        if (keyword) {
          this.viewList = this.originList.filter(item => {
            return item.name.includes(keyword) ||
              item._py_quanpin.includes(keyword) ||
              item._py_shoupin.includes(keyword)
          })
        } else {
          this.viewList = [...this.originList]
        }
        this.isEmpty = !this.viewList.length
      },
      blurSelect () {
        if (this.isEmpty) {
          this.filterMethodSelect('')
        }
      },
    },
  }
</script>
<style scoped>
.subjectWar {
  height: 400px;
  overflow: hidden;
}
.flex-column {
  height: 100%;
  overflow: hidden;
}
.all {
  border-bottom: 1px solid #ddd;
  padding: 0 25px;
  margin: 0;
  line-height: 33px;
}
.all.f1 {
  margin: 0 0 5px 0;
  padding: 0;
}
</style>
