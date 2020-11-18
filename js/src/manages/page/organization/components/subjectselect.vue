<template>
  <el-cascader
    class="w"
    v-model="selectedCodeListList"
    :options="list"
    :props="cascaderMulProps"
    filterable
    @change="changeMul"
  ></el-cascader>
</template>
<script>
  import {request} from '@/util/req'
  import orgUrlMap from '@/manages/page/organization/utils/urls'
  import {convertListToTree, changeToTreeList, sortTreeListByIdList, getAllParentById} from '@/manages/page/organization/utils/fns'
  import '@/warehouse/page/building/assets/index.less'
  import storage from '@/util/storage'
  export default {
    props: {
      /**
       * 需要回显的数据，格式为
       * [
       *   {orgSubjectName: 'xx', orgSubjectCode: 'xx', orgSubjectId: 'xx'},
       *   {orgSubjectName: 'xx', orgSubjectCode: 'xx', orgSubjectId: 'xx'},
       * ]
       */
      value: {
        type: [Array, String],
        default: () => []
      },
      /**
       * 是否是机构科室，否则是集团科室
       */
      isOrg: {
        type: Boolean,
        default: true, // 默认是机构
      },
    },
    data () {
      return {
        cascaderMulProps: {
          checkStrictly: true,
          multiple: true,
        },
        selectedCodeListList: [], // 选中的code 数组 路径
        selectedObjListList: [], // 选中的对象数组 路径
        selectedCodeList: [], // 选中的code 数组
        selectedObjList: [], // 选中的对象数组
        list: [], // 树状数据
        listForTree: [], // 可以转化为树的数据
        originList: [], // 平行数据
        selectedLoaded: false,
        listLoaded: false,
        changeProps: {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'},
      }
    },
    created () {
      const searchId = this.isOrg ? storage.getStorageByClinic('CLINICID') : storage.getLocalStorage('TENANTID')
      // 查询数组数据
      request(orgUrlMap.subject.loadOrgSubjectListByOrgId, {orgId: searchId}).then(res => {
        this.originList = res.data.pageList
        this.listForTree = changeToTreeList(res.data.pageList, this.changeProps)
        this.list = convertListToTree(this.listForTree)
        this.listLoaded = true
        this.setAsyncValue()
      })
    },
    methods: {
      // 当数据发生了变化，且数组已经查询完成，则进行赋值
      setAsyncValue () {
        if (this.selectedLoaded && this.listLoaded && this.selectedCodeList && this.selectedCodeList.length) {
          // 1. 将code组成的list，转化为有序的数组，【顺便将code转化为了对象】
          const objList = sortTreeListByIdList(this.listForTree, this.selectedCodeList)
          // 2. 将对象数组转化为路径对象数组
          this.selectedObjListList = objList.map(node => {
            const parentList = getAllParentById(this.listForTree, node.id)
            return [...parentList, node]
          })
          // 3. 将路径对象数组转化为路径code数组，这样达到了显示的目的
          this.selectedCodeListList = this.selectedObjListList.map(nodeList => nodeList.map(item => item._id))
        }
      },
      changeMul (value) {
        if (!value) return
        this.selectedObjListList = value.map(item => item.map(id => {
          const subject = this.originList.find(s => s._id === id)
          return {
            orgSubjectId: subject._id,
            orgSubjectCode: subject.orgSubjectCode,
            orgSubjectName: subject.orgSubjectName,
          }
        }))
        this.selectedObjList = this.selectedObjListList.map(item => item[item.length - 1])
        this.$emit('input', this.selectedObjList)
        this.$emit('change', this.selectedObjList)
      },
      setValue (val) {
        this.selectedLoaded = true
        this.selectedCodeList = val && val.length ? val.map(item => item.orgSubjectCode) : []
        this.setAsyncValue()
      },
    },
  }
</script>
