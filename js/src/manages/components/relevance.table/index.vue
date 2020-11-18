<template>
    <!-- :span-method="arraySpanMethod" -->
  <ever-table
    :key="1000"
    :columns="tableColumns"
    :is-auto-height="false"
    :data="tableListData"
    class="init-table"
    :cell-class-name="cellClassName"
    :header-cell-class-name="cellClassName"
    :row-style="toggleDisplayTr"
    :row-class-name="rowClassName"
    :span-method="arraySpanMethod"
    v-loading="loading"
    :is-flex="true"
    border
    @eventChange="eventChange">
    <template slot="architectureName">
      <el-table-column prop="architectureName" label="机构列表" min-width="300" align="left">
        <template slot-scope="scope">
          <p @click="toggleFoldingStatus(scope)" :style="`margin-left: ${scope.row.__level * 20}px;margin-top:0;margin-bottom:0;cursor: pointer;`" class="df">
            <span>
              <i
                class="permission_toggleFold"
                :class="toggleFoldingClass(scope.row)"
                v-if="scope.row.nodes && scope.row.nodes.length"></i>
              <span v-else style="width: 20px;" class="inline-block">&nbsp;</span>
              <template v-if="selected">
                <el-checkbox v-model="checkSelected[scope.row.__identity]" @change="handleCheckSelected(checkSelected[scope.row.__identity], scope.row.__identity, scope.$index)"><label></label></el-checkbox>
              </template>
            </span>
            <span class="flex1">
              {{scope.row.architectureName}}
              <!-- <svg class="icon" aria-hidden="true" v-if="scope.row[associated]">
                <use xlink:href="#icon-wancheng"></use>
              </svg> -->
            </span>
          </p>
        </template>
      </el-table-column>
    </template>
    <template v-for="item in tableColumns">
      <el-table-column
        :key="item.prop"
        :slot="item.prop"
        v-if="item.display"
        :label="item.label"
        :width="item.width"
        :prop="item.prop"
        :align="item.align || 'left'">
        <template slot="header" slot-scope="scope">
          <el-checkbox :value="ctrlSwitchStatus[item.prop]" v-if="ctrlSwitchs.includes(item.prop) && !disabled" :indeterminate="isIndeterminate" @change="(val) => handleCheckAllChange(item.prop, val, tableListData)"></el-checkbox>
          {{item.label}}
        </template>
        <template slot-scope="scope">
          <col-td :row="scope.row" :render="bindObj(item.render)" :td-key="item.prop" :td-key-name="item.label"></col-td>
        </template>
      </el-table-column>
    </template>
  </ever-table>
</template>

<script>
import treeTable from '@/util/treetable.js'
import colTd from './coltd'
import api from '@/manages/page/prescription/managesapi'
import priceInfo from '@/manages/components/price.manage/price.info'
import {objRemove} from '@/util/common'

export default {
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkOptions: [],
      checkSelected: {},
      toggleList: []
    }
  },
  components: {
    colTd
  },
  mixins: [treeTable],
  props: {
    // switchProp: String, // 过滤禁选字段
    ctrlSwitchs: {
      type: Array,
      default: () => []
    },
    ctrlSwitchStatus: {
      type: Object,
      default: () => ({})
    },
    title: { // 机构关联应用标题
      type: String,
      default: '关联该科室'
    },
    unfoldTree: { // 是否展开树
      type: Boolean,
      default: true
    },
    columns: { // 表头数据
      type: Array,
      default: []
    },
    data: { // 表格数据（tree）
      type: Array,
      default: []
    },
    selected: { // 是否显示checkbox
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default: () => ''
    },
    cellClassName: {
      type: Function,
      default: () => ''
    },
    handleCheckAllChange: {
      type: Function,
      default: () => { }
    }
  },
  computed: {
    tableColumns () {
      const arr = [{
        prop: 'architectureName',
        slotName: 'architectureName',
        label: '机构名称',
      }]
      return [...arr].concat(this.columns)
    }
  },
  created () {
    this.tableListData = this.formatConversion([], this.data)
  },
  watch: {
    data (v) {
      this.toggleList = []
      this.tableListData = this.formatConversion([], v)
    },
    selected (val) {
      this.checkSelected = Object.create(null)
    },
    tableListData: {
      handler (data) {
        this.checkOptions = []
        data.map(item => {
          if (item.relation) {
            this.checkOptions.push(item.relation)
            item.disabled = false
          } else {
            item.disabled = true
          }
        })
        this.$nextTick(() => {
          if (this.checkOptions.length) this.isIndeterminate = true
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    downwardNodes (nodes, flag) {
      nodes.map(node => {
        this.checkSelected[node.__identity] = flag
        if (Array.isArray(node.nodes) && node.nodes.length) this.downwardNodes(node.nodes, flag)
      })
    },
    upwardNodes (sourceData, index) {
      const level = ~-sourceData[index].__level
      const parentIdentity = sourceData[index].__family[level]
      const parentIndex = sourceData.findIndex(item => item.__identity === parentIdentity)
      const parentNodes = sourceData[parentIndex].nodes
      this.checkSelected[parentIdentity] = parentNodes.every(node => this.checkSelected[node.__identity])
      if (parentNodes[0].__level > 1) {
        this.upwardNodes(sourceData, parentIndex)
      }
    },
    handleCheckSelected (val, identity, index) {
      this.checkSelected[identity] = !!val
      this.downwardNodes(this.tableListData[index].nodes, val)
      if (this.tableListData[index].__level >= 1) this.upwardNodes(this.tableListData, index)
      this.checkSelected = JSON.parse(JSON.stringify(this.checkSelected))
    },
    // handleCheckAllChange (key, val) {
    //   this.tableListData.forEach(item => {
    //     // disEditor 配置全选不可选的字段
    //     if (!item.disEditor || (item.disEditor && !item.disEditor.includes(key))) {
    //       item[key] = val
    //     }
    //   })
    // },
    eventChange ($event) {
      this.$emit('eventChange', $event)
    },
    officeSelect (row) {
      this.$parent.openCorrelationDialog()
    },
    bindObj (render) {
      return render.bind(this.$parent)
    },
    async serverToTree (serviceId, list, selfFormatter, key = 'usePermission') {
      // Promise.all([api.getChildOrgServiceList, api.])
      // 没有医嘱项id不请求数据
      if (!serviceId) {
        throw new Error('缺少serviceId')
      }
      let tree = await api.getTreeNodes({
        outOrgGetOrgListByConditionReqDTO: { idList: [this.$store.state.currentUser.organizationId] }
      })
      let listObj = {}
      list.forEach(item => {
        listObj[item.orgId] = item
      })
      let orgIds = []
      tree.forEach(function getOrgIds (item) {
        item.id && orgIds.push(+item.id)
        if (item.outOrgGetOrgAndChildrenResDTOList && item.outOrgGetOrgAndChildrenResDTOList.length) {
          item.outOrgGetOrgAndChildrenResDTOList.forEach(getOrgIds)
        }
      })
      const info = await priceInfo.getPriceConfig({itemId: serviceId, orgIdList: orgIds}, 'org')
      let columns = [].concat(priceInfo.getPriceColumns.call(this.$parent, info.columns, info.data, key))
      let treeData = [...tree.map((item, index) => this.treeFormatter(item, listObj, info.data, index, selfFormatter))]
      return {
        columns,
        treeData,
        orgTree: tree
      }
    },
    // 机构树和医嘱关联的机构绑定
    treeFormatter (nodes, listObj, priceObj, index, selfFormatter) {
      let afterTree = {}
      afterTree.orgId = nodes.id
      afterTree.architectureName = nodes.name
      afterTree.parentCode = nodes.parentCode
      afterTree.treeIndex = index + ''
      afterTree.priceData = priceObj[nodes.id] || {}
      selfFormatter && selfFormatter(afterTree, nodes, listObj)
      afterTree.children = nodes.outOrgGetOrgAndChildrenResDTOList && nodes.outOrgGetOrgAndChildrenResDTOList.map((item, k) => {
        // item, listObj, info.data, index, selfFormatter
        return this.treeFormatter(item, listObj, priceObj, index + '-' + k, selfFormatter)
      }) || []
      return afterTree
    },
    // 折叠
    toggleFoldingStatus (data) {
      let row = data.row
      let index = data.$index
      let treeIndex = row.treeIndex
      let fold = !this.toggleList.includes(row.treeIndex)
      if (fold) {
        this.toggleList.push(row.treeIndex)
      } else {
        objRemove(this.toggleList, (item) => {
          return treeIndex === item || new RegExp('^' + treeIndex + '-').test(item)
        })
      }
      for (let i = index + 1; i < this.tableListData.length; i++) {
        let item = this.tableListData[i]
        if (new RegExp('^' + treeIndex + '-').test(item.treeIndex)) {
          item.fold = fold
        } else {
          break
        }
      }
      this.foldList.includes(row.__identity) ? this.foldList.splice(this.foldList.indexOf(row.__identity), 1) : this.foldList.push(row.__identity)
    },
    toggleFoldingClass (params) {
      return params.nodes.length === 0 ? 'permission_placeholder' : (this.toggleList.indexOf(params.treeIndex) === -1 ? 'iconfont icon-domn' : 'iconfont icon-up')
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.fold) {
        return [0, 0]
      } else {
        return [1, 1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.init-table {
  margin-bottom: 20px;
}
.permission_toggleFold {
  &.iconfont.icon-up {
    transform: rotate(90deg)
  }
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  cursor: pointer;
  color:#999;
}
.office-select {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  .cur-select {
    color: #1c7bef;
  }
}
</style>
