<template>
  <el-tree
    v-model="clinicAndDeptKey"
    ref="tree"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :data="options"
    :default-checked-keys="clinicAndDeptKey"
    :props="props"
    :empty-text="tipMsg"
    @check="handleCheck"
  ></el-tree>
</template>
<script>
import clinicApi from '@/warehouse/store/clinicapi'
import { treeToList } from '@/util/common'
import storage from '@/util/storage'

export default {
  props: {
    'value': [Array, String],
    'clinicId': [String]
  },
  data () {
    return {
      props: {
        label: 'text',
        children: 'children'
      },
      options: [],
      clinicAndDeptKey: [], // 返回的叶子节点（科室）数组
      clinicNodeList: [],  // 打平机构+科室数据
      clinicNodeListObject: {}, // 把机构科室数组 clinicNodeList 中的机构 转成 object 方便查找
      deptNodeListObject: {}, // 把机构科室数组 clinicNodeList 中的科室转成 object 方便查找
      deptNodeSelectList: [], // 选中的叶子节点（科室）
      tipMsg: '数据加载中...',
      isManage: this.$route.matched[0].meta.manage
    }
  },
  created () {
    this.initTree()
  },
  watch: {
    'value': {
      handler: function (val) {
        if (val) {
          this.clinicAndDeptKey = val
        }
      },
      immediate: true
    },
    'clinicAndDeptKey': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    },
  },
  methods: {
    // 初始化机构科室树
    async initTree () {
      let result = await clinicApi.queryGroupClinics({
        clinicId: this.clinicId || (this.isManage ? '' : storage.getStorageByClinic('CLINICID'))
      })
      this.options = result
      if (this.options.length === 0) {
        this.tipMsg = '暂无数据'
      }
      this.clinicNodeList = treeToList(JSON.parse(JSON.stringify(result)), {
        key: 'id',
        parent: 'pid',
        children: 'children'
      })
      this.clinicNodeList.forEach((item, index) => {
        if (item.type === 0) {
          this.clinicNodeListObject[item.id] = {
            orgId: item.data.id,
            orgName: item.data.name,
            id: item.id,
            type: item.type,
            applyDepts: []
          }
        }
        if (item.type === 1) {
          this.deptNodeListObject[item.id] = item
        }
      })
      this.initDeptPostData()
    },
    // 把返回的id格式化成要提交的数据
    initDeptPostData () {
      this.clinicAndDeptKey.forEach(item => {
        if (this.deptNodeListObject[item]) {
          this.deptNodeSelectList.push(this.deptNodeListObject[item])
        }
      })
      this.handleData(this.deptNodeSelectList)
    },
    // 每次点击清空depts数组
    cleanSelectDepts () {
      Object.keys(this.clinicNodeListObject).forEach(key => {
        this.clinicNodeListObject[key].applyDepts = []
      })
    },
    // 勾选内容 获取勾选数据，格式化数据
    handleCheck () {
      this.clinicAndDeptKey = this.$refs.tree.getCheckedKeys(true, false)
      let _tmpSel = this.$refs.tree.getCheckedNodes(true, false)
      this.handleData(_tmpSel)
    },
    // 叶子节点（科室）转化为树状结构给后端
    handleData (_tmpSel) {
      this.cleanSelectDepts()
      _tmpSel.forEach(item => {
        this.clinicNodeListObject[item.parentId].applyDepts.push({
          id: item.id,
          type: item.type,
          deptId: item.data.id,
          deptName: item.data.name,
          parentId: item.parentId
        })
      })
      let res = Object.values(this.clinicNodeListObject).filter(item => {
        if (item.applyDepts.length > 0) {
          return item
        }
      })
      this.$emit('tackThisToBackend', res)
    }
  }
}
</script>
