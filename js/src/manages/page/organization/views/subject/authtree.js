import {convertListToTree, getAllParentById, getAllChildrenById} from '@/manages/page/organization/utils/fns'
export default {
  data () {
    return {
      originTreeList: [],
      allRelation: false, // 关联项的全选
      allIndependent: false, // 独立项的全选
      relationIndeterminate: false, // 关联项的指示
      independentIndeterminate: false, // 关联项的指示
      changedList: [],
    }
  },
  methods: {
    doCheck (data, value, field, isRelation) {
      // 改变当前项
      const crt = this.originTreeList.find(item => item._id === data._id)
      if (crt) {
        crt[field] = value
      }
      // 改完之后再判断
      this['all' + (isRelation ? 'Relation' : 'Independent')] = this.originTreeList.every(item => !!item[field])
      if (isRelation) {
        this.refreshTree(data, value, field)
      } else {
        this.treeProps.props.data = convertListToTree(this.originTreeList)
      }
      const allUn = this.originTreeList.every(item => !item[field])
      this[(isRelation ? 'relation' : 'independent') + 'Indeterminate'] = !this['all' + (isRelation ? 'Relation' : 'Independent')] && !allUn
      if (this.getChangedList) {
        this.getChangedList()
      }
      if (this.afterCheck) {
        this.afterCheck()
      }
    },
    checkAll (field, isRelation) {
      this[(isRelation ? 'relation' : 'independent') + 'Indeterminate'] = false
      this.originTreeList.forEach(item => { item[field] = this['all' + (isRelation ? 'Relation' : 'Independent')] })
      this.treeProps.props.data = convertListToTree(this.originTreeList)
      if (this.getChangedList) {
        this.getChangedList()
      }
      if (this.afterCheck) {
        this.afterCheck()
      }
    },
    refreshTree (data, value, field) {
      // 如果value 为true 则将其所有父节点都改为true
      if (value) {
        const allParent = getAllParentById(this.originTreeList, data.id)
        allParent.forEach(item => {
          item[field] = true
        })
      } else {
        // 如果value 为false 则将其所有子节点都改为false
        const allChildren = getAllChildrenById(this.originTreeList, data.id)
        allChildren.forEach(item => {
          item[field] = false
        })
      }
      this.treeProps.props.data = convertListToTree(this.originTreeList)
    },
  },
}
