/**
 * 管理工作站物资，人员，科室列表关联机构
 * 机构化属性变化自动勾选treetable => Checkbox
 */

import storage from '@/util/storage'
import { debounce } from '@/util/common'
import SyncDialog from '@/manages/components/sync.dialog'
const CURRENT_INDEX = 'CURRENT_INDEX' // 本地存储label
export default {
  components: {
    SyncDialog
  },
  beforeRouteEnter (to, from, next) {
    // meta.location 定位页面是否是同一类菜单 【明细 to 列表】
    // location 不一致时清空seessionStorage中CURRENT_INDEX
    if (to.meta.location !== from.meta.location) {
      storage.removeSessionStorage(CURRENT_INDEX)
    }
    next()
  },
  watch: {
    current () { // 当前页数变化，清空stroage中的当前点击位置
      storage.removeSessionStorage(CURRENT_INDEX)
    },
    // 默认查询左侧列表第一条
    tableData: {
      handler (v) {
        if (v.length) {
          this.$nextTick(() => {
            const currentIndex = storage.getSessionStorage(CURRENT_INDEX) || 0
            const el = this.$refs.section
            if (el) {
              const ele = el.$el.querySelectorAll('.el-table .el-table__body .el-table__row')[currentIndex]
              el.$el.querySelector('.el-table__body-wrapper').scrollTop = ele.offsetTop
              ele.click()
            }
          })
        }
      },
      deep: true
    }
  },
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      cacheNewTreeData: [],
      customPagesize: 20, // 控制list.js中默认查询列表条数
      cacheMultipleSelection: [], // 缓存被选中的数据
      visible: false, // 批量处理组件显示或隐藏状态
      syncVisible: false, // 同步数据处理组件显示或隐藏状态
      multipleSelection: [], // tree 首列 checkbox 选中项
      recordSelection: [], // 记录选中项的树明细
    }
  },
  computed: {
    multipleSelectionLen () { // 缓存多选项的长度
      return !!this.multipleSelection.length
    }
  },
  methods: {
    resetSelectionCheck (row) {
      let index = -1
      let len = 0
      let treeLen = this.newTreeData.length
      this.newTreeData.forEach((tree, i) => {
        if (tree.clinicId === row.clinicId) index = i
        if (tree[this.arg]) len++
      })
      this.$set(this.newTreeData[index], this.arg, row[this.arg])
      this.checkAll = false
      if (len === treeLen) {
        this.isIndeterminate = false
        this.checkAll = true
      } else if (len) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
    },
    handleCheckAllChange (checked) {
      this.isIndeterminate = false
      this.newTreeData.forEach((tree, index) => {
        this.newTreeData[index][this.arg] = +checked
      })
      this.newTreeData = JSON.parse(JSON.stringify(this.newTreeData))
    },
    /**
     * 管理权是否有变化
     * hasManageChange
     * @param {*} data     比对的数据值(新值对象)
     * @param {*} list     要比对的数据项（老数据列表）
     */
    hasManageChange (data, list) { //
      const relation = list.find(item => item.clinicId === data.clinicId) // 找到机构数据
      const m = data.managePermission
      if (relation) {
        const n = relation.managePermission
        return !(m === n) // 两者相等 - 管理权没变化 取反
      } else {
        // list中没有找到，但是当前值'm'为真，产生了变化
        return !!m
      }
    },
    hasChange (data, list) { // 批量操作保存时， 对比treetable中每一项是否变化
      const relation = list.find(item => item.clinicId === data.clinicId) // 找到机构数据
      if (relation) {
        const isChanged = Object.keys(data.ext).some(key => { // 遍历ext所有key 和 cacheRelations的值比较
          return data[key] !== relation[key] //  说明该条数据变化了
        })
        return isChanged
      } else {
        return true
      }
    },
    doRelationDownTreeHandler () {
      this.syncVisible = true
    },
    // 查看详情
    handlerLook (url, index) {
      storage.setSessionStorage(CURRENT_INDEX, index)
      this.$router.push(url)
    },
    handlerSaveBatch () { // 选择批量处理数据后，执行同步treetable data
      this.newTreeData.forEach(item => Object.assign(item, this.batchObj, { usePermission: 1 }))
      //  物资需要单独处理 批量设置的数据
      this.materialSaveBatchExt && this.materialSaveBatchExt()
      this.newTreeData = JSON.parse(JSON.stringify(this.newTreeData))
      // this.toggleRowSelection()
    },
    toggleRowSelection (row) {
      const multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
      this.$nextTick(() => {
        const ele = this.$refs.multipleTable.$refs.treeTable.$refs.everTable
        ele.clearSelection()
        if (row) {
          const index = multipleSelection.findIndex(cSelect => cSelect.clinicId === row.clinicId)
          !~index && multipleSelection.push(row)
        }
        multipleSelection.forEach(selection => {
          const findSelection = this.newTreeData.find(tree => tree.clinicId === selection.clinicId)
          findSelection && ele.toggleRowSelection(findSelection)
        })
      })
    },
    handlerBatchSetting () { // 进行批量处理
      // if (!this.multipleSelectionLen) return this.$messageTips(this, 'warning', '请选择需要批量设置的机构')
      this.visible = true
    },
    handlerSelectionChange: debounce(function (selection) { // 选择项发生变化时 更新checkbox（多选）
      const selectSize = selection.length
      const cacheSelectSize = this.cacheMultipleSelection.length
      const treeSize = this.newTreeData.length
      // 数据被取消选择时，显示该条数据的真实状态，不记录修改的内容
      // 选择数据不为空，并且不是全选，并且本次选择项笑语上次选择项时，执行重置整个treetable数据，并且把本次选择项之前更改后的数据更新到新的treetable中
      if (selectSize && selectSize !== treeSize && selectSize < cacheSelectSize) {
        const ele = this.$refs.multipleTable.$refs.treeTable.$refs.everTable
        this.newTreeData = JSON.parse(JSON.stringify(this.cacheNewTreeData))
        this.cacheMultipleSelection.forEach(cache => {
          const has = selection.find(select => cache.clinicId === select.clinicId)
          if (has) { // 新旧选择性对比，还被选择中的
            // 拿被取消的这条去newTreeTable中查找， 找到后，重置该条数据
            const index = this.newTreeData.findIndex(tree => tree.clinicId === cache.clinicId)
            this.$set(this.newTreeData, index, cache)
            this.$nextTick(() => {
              // 把更新后的数据项设置选中状态
              ele.toggleRowSelection(this.newTreeData[index], true)
            })
          }
        })
        // 有选中项，而且有被取消选择的
      } else if (!selectSize && cacheSelectSize) {
        // 全不选，重置整个表格
        this.newTreeData = JSON.parse(JSON.stringify(this.cacheNewTreeData))
      }
      this.multipleSelection = selection
      this.cacheMultipleSelection = JSON.parse(JSON.stringify(selection))
    })
  }
}
