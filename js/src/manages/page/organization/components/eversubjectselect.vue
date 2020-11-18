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
      :filter-method="filterMethodSelect">
      <el-option
        v-for="item in viewList"
        :key="item.orgSubjectCode"
        :label="item.orgSubjectName"
        :value="item.orgSubjectCode"
      ></el-option>
    </el-select>
    <template v-else-if="type === 'tree'">
      <div class="subjectWar">
        <div class="flex-column">
          <p class="all">
            <el-checkbox :indeterminate="isIndeterminate" v-model="selectAllFlag">全选</el-checkbox>
          </p>
          <div class="flex1 oxhya">
            <el-tree
              v-model="selectedCodeListList"
              ref="tree"
              show-checkbox
              node-key="orgSubjectCode"
              default-expand-all
              :data="list"
              :default-checked-keys="ids"
              v-bind="localProps"
              @check-change="handleCheck"
            ></el-tree>
          </div>
        </div>
      </div>
    </template>
  </span>
</template>
<script>
import { request } from '@/util/req'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import { convertListToTree, changeToTreeList, sortTreeListByIdList, getAllParentById, getObjByIncludes, isNotEmpty } from '@/manages/page/organization/utils/fns'
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
     *   {orgSubjectCode: 'xx'},
     *   {orgSubjectCode: 'xx'},
     * ]
     * 或者
     * ['xx', 'xx']
     * 单选时，格式为
     * {orgSubjectCode: 'xx'} 或者 'xx'
     */
    value: {
      type: [Array, String, Object, Number],
      default: () => []
    },
    /**
     * 快捷查询条件 默认值，查询条件是当前登录者所选择的机构id，传false，则查询条件为当前机构所在集团的id
     */
    isOrg: {
      type: Boolean,
      default: true, // 默认是机构
    },
    /**
     * 查出来的结果：默认值是查出机构对应的集团科室 传true，表示查出来的是机构科室
     */
    useOrg: {
      type: Boolean,
      default: false, // 默认是集团
    },
    /**
     * 展现形式 可选值：cascader select tree 其中cascader 是默认值
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
     */
    params: {
      type: Object,
      default () {
        return {}
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
    fields: {
      type: [Array, String],
      default () {
        return [
          'id',
          'orgSubjectCode',
          'orgSubjectName',
        ]
      }
    },
    disabled: Boolean,
    isManage: Boolean, // 是否是管理员使用，默认为false，为true时，调用的接口为对内的接口
    placeholder: {
      type: String,
      default: ''
    },
    // 发现没有匹配的数据时，处理方式
    // '1': 抛出有未匹配数据的事件
    // '2': 直接清除未匹配的数据
    afterNotMatch: {
      type: String,
      default: '1',
    },
    useInput: {
      type: Boolean,
      default: false,
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
      changeProps: { label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode' },
      ids: [],
      selectAllFlag: false,
      isEmpty: false,
      isIndeterminate: false
    }
  },
  watch: {
    'value': {
      handler (val) {
        if (isNotEmpty(val)) {
          if (this.isMultiple()) {
            this.selectedLoaded = true
            this.selectedCodeList = val && val.length ? val.map(item => item.orgSubjectCode === undefined ? item : item.orgSubjectCode) : []
            this.setAsyncValue()
          } else {
            this.selectedLoaded = true
            this.selectedCodeList = val ? (val.orgSubjectCode === undefined ? val : val.orgSubjectCode) : null
            this.setAsyncValue()
          }
        } else {
          // 如果值为空的时候把 options的值清空
          if (this.isMultiple()) {
            this.selectedCodeList = []
            this.selectedCodeListList = []
          } else {
            this.selectedCodeList = null
            this.selectedCodeListList = []
          }
          this.filterMethodSelect('')
        }
        if (this.type === 'tree') {
          if (val.length > 0 && val.length < this.originList.length) {
            this.isIndeterminate = true
          } else {
            this.isIndeterminate = false
          }
        }
      },
      deep: true,
      immediate: true,
    },
    // 业务方传参数进来参与过滤查询 例如 {orgId:5001,type:100,...}
    'params': {
      handler (val) {
        this.search()
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
    this.search()
  },
  methods: {
    // tree下全选勾选方法方法
    handleSelectAll (flag) {
      if (flag) {
        let res = []
        this.originList.forEach(item => {
          res.push(item.orgSubjectCode)
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
    getConfig () {
      let url = ''
      let params = {}
      const searchId = this.isOrg ? storage.getStorageByClinic('CLINICID') : storage.getLocalStorage('TENANTID')
      if (this.isManage) {
        url = this.useOrg ? 'loadOrgSubjectListByOrgId' : 'loadTenantSubjectListByOrgId'
        if (this.params && this.params.orgId) {
          params = { orgId: searchId, ...this.params }
        } else {
          params = { ...this.params, orgId: searchId }
        }
      } else {
        url = 'outGetTenantSubjectListByCondition'
        params = {
          orgIdList: this.params.orgId ? [this.params.orgId] : [searchId],
          ...this.params,
        }
      }
      // 加上默认的参数
      params = {
        ...params,
        status: params.status === undefined ? 'Y' : params.status,
      }
      return {
        url: orgUrlMap.subject[url],
        params,
      }
    },
    // 查询数据方法
    search () {
      // 传进来的参数需要和orgId merge到一起，如果传的参数有orgid 以传进来的orgid为准，如果没有以localStorage内的值为准。
      // 查询科室
      const config = this.getConfig()
      const params = config.params
      // 默认查询接口 /thc-platform-core/out/subject/getTenantSubjectListByCondition
      request(config.url, params).then(res => {
        let list = res.data[this.isManage ? 'pageList' : 'resultList']
        list = list.map(item => {
          const pinyin = convertCharToPinyin(item.orgSubjectName)
          return {
            ...item,
            _py_quanpin: pinyin.quanpin,
            _py_shoupin: pinyin.shoupin,
          }
        })
        if (this.isManage) {
          if (params.type1CodeList && params.type1CodeList.length) {
            list = list.filter(item => params.type1CodeList.includes(item.type1Code))
          }
          if (params.type2CodeList && params.type2CodeList.length) {
            list = list.filter(item => params.type2CodeList.includes(item.type2Code))
          }
        }
        this.originList = list
        this.viewList = list
        if (this.type === 'cascader' || this.type === 'tree') {
          this.listForTree = changeToTreeList(list, this.changeProps)
          this.list = convertListToTree(this.listForTree)
          this.listLoaded = true
          this.setAsyncValue()
        } else if (this.type === 'select') {
          this.listLoaded = true
          this.setAsyncValue()
        }
      })
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
            if (node) {
              const parentList = getAllParentById(this.listForTree, node.id)
              return [...parentList, node]
            } else {
              return []
            }
          })
          // 3. 将路径对象数组转化为路径code数组，这样达到了显示的目的
          this.selectedCodeListList = this.selectedObjListList.map(nodeList => nodeList.map(item => item._id))
        } else if (!this.isMultiple() && this.selectedLoaded && this.listLoaded && this.selectedCodeList && this.selectedCodeList.length) {
          // 根据 this.selectedCodeList 获取路径
          const crtNode = this.originList.find(item => item.orgSubjectCode === this.selectedCodeList)
          if (!crtNode) {
            this.selectedCodeListList = []
            return
          }
          const parentList = getAllParentById(this.listForTree, this.selectedCodeList)
          this.selectedCodeListList = [
            ...parentList.map(item => item._id),
            crtNode._id,
          ]
        }
      } else if (this.type === 'tree') {
        // 如果是tree 传进来的值需要勾选上 给 default-checked-keys 赋值
        this.ids = this.value
        this.selectedCodeListList = this.value
      } else if (this.type === 'select') {
        // 判断 传入的值是否在list中存在，若存在，则不做任何操作，若不存在，则显示值改为空
        if (this.selectedLoaded && this.listLoaded && this.selectedCodeList && this.selectedCodeList.length) {
          if (this.isMultiple()) {
            const selected = []
            const notSelected = []
            this.selectedCodeList.forEach(item => {
              const isSelected = this.originList.find(_item => _item.orgSubjectCode === item)
              if (isSelected) {
                selected.push(item)
              } else {
                notSelected.push(item)
              }
            })
            // 是否有未匹配的数据
            if (notSelected.length) {
              if (this.afterNotMatch === '1') {
                this.$emit('after-not-match', notSelected)
              } else if (this.afterNotMatch === '2') {
                if (!selected.length) {
                  if (this.selectedCodeList.length !== 0) {
                    this.selectedCodeList = []
                    this.$emit('input', [])
                    this.$emit('change', [])
                  }
                } else {
                  if (this.selectedCodeList.length !== selected.length) {
                    this.selectedCodeList = selected
                    this.$emit('input', selected)
                    this.$emit('change', selected)
                  }
                }
              }
            }
          } else {
            const selected = this.originList.find(item => item.orgSubjectCode === this.selectedCodeList)
            if (!selected) {
              if (this.afterNotMatch === '1') {
                this.$emit('after-not-match')
              } else if (this.afterNotMatch === '2') {
                if (this.selectedCodeList !== '') {
                  this.selectedCodeList = ''
                  this.$emit('input', '')
                  this.$emit('change', '')
                }
              }
            }
          }
        }
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
            const subject = this.originList.find(s => s._id === id)
            return this.isObj() ? {
              orgSubjectId: subject._id,
              orgSubjectCode: subject.orgSubjectCode,
              orgSubjectName: subject.orgSubjectName,
              tenantSubjectCode: subject.tenantSubjectCode,
              tenantSubjectName: subject.tenantSubjectName,
            } : subject[this.fields === 'id' ? '_id' : this.fields]
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
            const subject = this.originList.find(s => s._id === id)
            return this.isObj() ? {
              orgSubjectId: subject._id,
              orgSubjectCode: subject.orgSubjectCode,
              orgSubjectName: subject.orgSubjectName,
            } : subject[this.fields === 'id' ? '_id' : this.fields]
          })
          this.selectedObjList = this.selectedObjListList[this.selectedObjListList.length - 1]
          this.$emit('input', this.selectedObjList)
          this.$emit('change', this.selectedObjList)
        }
      } else if (this.type === 'select') {
        if (this.isMultiple()) {
          this.selectedObjList = value.map(item => getObjByIncludes(this.originList.find(subject => subject.orgSubjectCode === item), this.getFields()))
          this.$emit('input', this.isObj() ? this.selectedObjList : this.selectedObjList.map(item => item[this.fields]))
          this.$emit('change', this.isObj() ? this.selectedObjList : this.selectedObjList.map(item => item[this.fields]))
        } else {
          this.selectedObjList = getObjByIncludes(this.originList.find(subject => subject.orgSubjectCode === value), this.getFields())
          this.$emit('input', this.isObj() ? (isNotEmpty(this.selectedObjList) ? this.selectedObjList : '') : this.selectedObjList[this.fields])
          this.$emit('change', this.isObj() ? (isNotEmpty(this.selectedObjList) ? this.selectedObjList : '') : this.selectedObjList[this.fields])
        }
      }
    },
    filterMethodCascader (node, keyword) {
      if (!keyword) return true
      let item = node.data
      return item.orgSubjectName.toLowerCase().includes(keyword.toLowerCase()) ||
        item._py_quanpin.toLowerCase().includes(keyword.toLowerCase()) ||
        item._py_shoupin.toLowerCase().includes(keyword.toLowerCase())
    },
    filterMethodSelect (keyword) {
      if (keyword) {
        this.viewList = this.originList.filter(item => {
          return item.orgSubjectName.toLowerCase().includes(keyword.toLowerCase()) ||
            item._py_quanpin.toLowerCase().includes(keyword.toLowerCase()) ||
            item._py_shoupin.toLowerCase().includes(keyword.toLowerCase())
        })
      } else {
        this.viewList = [...this.originList]
      }
      this.isEmpty = !this.viewList.length
      if (this.useInput) {
        this.$emit('input', keyword)
        this.$emit('change', keyword)
      }
    },
    blurSelect () {
      if (!this.useInput) {
        setTimeout(() => {
          if (this.isEmpty) {
            this.filterMethodSelect('')
          }
        })
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
