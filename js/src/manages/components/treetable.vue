<template>
    <!-- 【ever-table】使用ever-table替换el-table-->
<!--      <ever-table-->
<!--        :columns="columns" 渲染表格的列-->
<!--        border 表格是否需要竖边框-->
<!--        :url="url" 查询表格数据的url 在urls.js中定义一个url-->
<!--        :is-auto-height="true" 是否为自适应高度的表格 【效果：表头固定，身体自动撑满剩余高度，并出现滚动条】-->
<!--        :params="params" -->
<!--        :config-option="configOption" 表格是否需要配置-->
<!--        @eventChange="eventChange"-->
<!--      ></ever-table>-->
  <ever-table
    ref="treeTable"
    :table-loading="tableLoading"
    :key="title"
    :columns="newColumns"
    :data="tableListData"
    :selectable="selectable"
    class="flex_col_1_hidden main-wrap custom_table_first_td_cell"
    table-class="flex_column_full_hidden x-hidden"
    :border="true"
    :cell-class-name="handlerCellClassName"
    :row-style="toggleDisplayTr"
    :header-cell-class-name="handlerCellClassName"
    :show-checkbox="showCheckbox"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
    @eventChange="eventChange">
    <template slot="architectureName">
      <!-- 机构列表 -->
      <el-table-column prop="architectureName" min-width="200" label="机构列表" align="left">
        <template slot-scope="scope">
          <p @click="toggleFoldingStatus(scope.row)" :style="`margin-left: ${scope.row.__level * 30}px;margin-top:0;margin-bottom:0;cursor: pointer;`" class="df">
            <span>
              <i
                class="permission_toggleFold w20"
                :class="toggleFoldingClass(scope.row)"
                v-if="scope.row.nodes && scope.row.nodes.length"></i>
              <span v-else class="inline-block w20">&nbsp;</span>
              <template v-if="selected">
                <!-- 是否全选机构checkbox -->
                <el-checkbox v-model="selectTree[scope.row.__identity]" @change="handleCheckSelected(selectTree[scope.row.__identity], scope.row.__identity, scope.$index)"><label></label></el-checkbox>
              </template>
            </span>
            <span class="flex1">
              <template v-if="scope.row.clinicObject">{{scope.row.clinicObject.name}}</template>
              <template v-if="scope.row.architectureName">{{scope.row.architectureName}}</template>
              <template v-else>{{scope.row.name}}</template>
            </span>
          </p>
        </template>
      </el-table-column>
    </template>
    <!-- 管理权 -->
    <template slot="managePermission" v-if="needPermission">
      <el-table-column prop="managePermission" :width="managePermissionWidth" align="left">
        <template slot="header" slot-scope="scope">
          <el-checkbox :indeterminate="indeterminate.managePermission" v-model="checkObj.managePermission" @change="handleCheckAllChange(checkObj.managePermission, 'managePermission')">管理权</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.managePermission"
            @change="manageChangeHandle(scope.row, scope.$index)"
            :disabled="!!scope.row.ifRoot || scope.row.manageDisabled">
          </el-switch>
        </template>
      </el-table-column>
    </template>
    <!-- 关联菜单 -->
    <template slot="usePermission" v-if="!exception">
      <el-table-column prop="usePermission" width="200" align="center">
        <template slot="header" slot-scope="scope">
          <el-checkbox v-if="ctrlSwitch" :indeterminate="indeterminate[propertyName]" v-model="checkObj[propertyName]" @change="handleCheckAllChange(checkObj[propertyName], propertyName)">{{title}}</el-checkbox>
          <slot name="slotStatusParent"></slot>
        </template>
        <template slot-scope="scope">
          <!-- disabled 取 !!scope.row.usePermission  3.6.1本期机构关联应用后自动置灰，该机构可使用不可取消实例 -->
          <!-- isRelation  控制关联应用switch是否可操作 -->
          <!-- {{scope.row.usePermission}} == {{scope.row.isRelation}} -->
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row[propertyName]"
            @change="handleCheckItemChange(scope.row[propertyName], scope.$index, propertyName)"
            :disabled="checkString ? !scope.row[checkString] : (!!scope.row[propertyName] && scope.row.isRelation)">
          </el-switch>
          <!-- <el-checkbox v-model="scope.row.usePermission" @change="handleCheckItemChange(scope.row.usePermission, scope.$index)"></el-checkbox> -->
        </template>
      </el-table-column>
    </template>
    <!-- 自定义表头内容，通过slot透传方式 -->
    <template v-for="slot in newColumns" :slot="slot.slotHeader" slot-scope="scope">
      <slot :name="slot.slotParent"></slot>
    </template>
  </ever-table>
</template>

<script>
import treeTable from '@/util/treetable.js'
const MANAGE = 'managePermission'
export default {
  data () {
    return {
      isIndeterminate: false,
      indeterminate: {
        managePermission: false,
        [this.propertyName]: false,
      },
      checkObj: {
        managePermission: false,
        [this.propertyName]: false,
      },
      checkOptions: {
        managePermission: [],
        [this.propertyName]: false,
      },
      selectTree: {},
      selectChecked: [],
      ele: null
    }
  },
  mixins: [treeTable],
  props: {
    filterNeedFul: Function, // 过滤树结构中不需要的字段内容（不传：默认取id，name）
    tableLoading: Boolean, // 表格数据查询加载loading状态
    selectData: { // 选中的数据项
      type: Array,
      default: () => []
    },
    needPermission: { // 是否需要展示管理权
      type: Boolean,
      default: true
    },
    managePermissionWidth: { // 管理权列动态宽度
      type: String,
      default: '200'
    },
    selectable: Function, // 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
    showCheckbox: { // 是否全选
      type: Boolean,
      default: false
    },
    newTreeData: { // 新的扁平树结构数据
      type: Array,
      default: () => []
    },
    managePermission: { // 是否具有机构管理权限标记
      type: String,
      default: 'managePermission'
    },
    checkString: {  //  自定义验证 使用权限 disabled规则字段
      type: String,
      default: ''
    },
    switchProp: String, // 过滤禁选字段
    propertyName: { // 关联应用字段名称
      type: String,
      default: 'usePermission'
    },
    ctrlSwitch: Boolean, // 是否统一控制第二列switch
    title: { // 机构关联应用标题
      type: String,
      default: '关联该科室'
    },
    unfoldTree: { // 是否展开树
      type: Boolean,
      default: true
    },
    isMultiRows: { // 是否一个机构有多行数据
      type: Boolean,
      default: false
    },
    columns: { // 表头数据
      type: Array,
      default: () => []
    },
    data: { // 表格数据（tree）
      type: Array,
      default: () => []
    },
    selected: { // 是否显示checkbox
      type: Boolean,
      default: false,
    },
    exception: { // 例外（设置右侧ext数据状态是否可操作）
      type: Boolean,
      default: false
    }
  },
  computed: {
    ext () {
      // 通过columns中的数据取出ext中key
      const ext = {}
      this.columns.map(item => {
        ext[item.prop] = ''
      })
      return ext
    },
    newColumns () {
      // 拼接固定的机构树前两列字段
      const arr = [{
        prop: 'architectureName',
        slotName: 'architectureName',
        label: '机构名称',
        notSelectCheckbox: true,
      }, {
        prop: 'managePermission', // 是否具有管理权
        slotName: 'managePermission',
        label: '管理权',
        notSelectCheckbox: true,
      }, {
        prop: 'usePermission', // 是否具有使用权
        slotName: 'usePermission',
        label: '关联应用',
        notSelectCheckbox: true,
      }]
      return [...arr].concat(this.columns)
    }
  },
  created () {
    this.foldList = []
    this.tableListData = this.formatConversion([], this.data)
    // tree数据，转换成一维结构发送给父组件
    this.$emit('update:newTreeData', this.tableListData)
  },
  mounted () {
    this.ele = this.$refs.treeTable.$refs.everTable
  },
  watch: {
    newTreeData: {
      // 监听一维结构tree，设置已关联数据并选中给selectChecked并发送给父组件
      handler (newTree) {
        let len = {}
        const treeLen = newTree.length
        const keys = Object.keys(this.checkObj)
        keys.forEach(key => {
          len[key] = 0
        })
        this.selectChecked = []
        newTree.forEach(tree => {
          keys.forEach(key => {
            if (tree[key]) len[key]++
          })
          if (tree[this.propertyName]) this.selectChecked.push(Object.assign(this.ownNeedFulValFn(tree), this.ownExtData(tree)))
        })
        Object.keys(len).forEach(key => {
          this.checkObj[key] = false
          this.indeterminate[key] = false
          if (len[key] === treeLen) {
            this.checkObj[key] = true
          } else if (len[key] && !this.checkObj[key]) {
            this.indeterminate[key] = true
          }
        })
        this.tableListData = newTree
        this.$emit('update:selectData', this.selectChecked)
      },
      deep: true,
      immediate: true
    },
    data (v) {
      // 监听tree源数据，并转换成一维结构， 发送给父组件
      this.tableListData = this.formatConversion([], v)
      this.$emit('update:newTreeData', this.tableListData)
      this.isIndeterminate = false
    },
    selected (val) {
      // 每次selected变化 初始化selectTree对象， 重新选择
      this.selectTree = Object.create(null)
    },
    tableListData: {
      // 通过自定义[this.propertyName]字段是否关联，控制右侧其他项目是否可以编辑，并把已选中项push进入checkOptions中
      handler (data) {
        if (this.exception) return // 不需要关联应用，直接return
        this.checkOptions = {
          managePermission: [],
          [this.propertyName]: []
        }
        const keys = Object.keys(this.checkOptions)
        data.map(item => {
          // compDisabled 设置右侧ext数据状态是否可操作
          keys.forEach(key => {
            if (item[key]) {
              this.checkOptions[key].push(item[key])
            }
          })
          if (item[this.propertyName]) {
            item.compDisabled = false
          } else {
            item.compDisabled = true
          }
        })
        this.$nextTick(() => {
          Object.keys(this.checkOptions).forEach(key => {
            if (this.checkOptions[key].length && this.checkOptions[key].length < data.length) this.indeterminate[key] = true
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    manageChangeHandle (row, index) { // 管理权变更
      this.handleCheckSelected(row.managePermission, row.__identity, index)
      this.handleCheckItemChange(row.managePermission, index, MANAGE)
      let checkLen = 0
      const tableLen = this.newTreeData.length
      this.newTreeData.forEach(tree => {
        if (tree[MANAGE]) checkLen++
      })
      this.checkObj[MANAGE] = checkLen === tableLen
      // this.$emit('manage-handle', row)
    },
    // 选中的机构数据
    handleSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    // 选中的机构数据 全选／反选
    handleSelectAll (selection) {
      this.$emit('select-all', selection)
    },
    ownNeedFulValFn (data) {
      // 获取父组件传递的方法，selectChecked数据中需要的字段和扩展对象ext需要获取的字段；或者取本组件中ownNeedFul中提供的默认字段
      if (this.filterNeedFul) return this.filterNeedFul(data)
      return this.ownNeedFul(data)
    },
    ownExtData (data) {
      // 给扩展对象ext具体key赋值
      Object.keys(this.ext).forEach(key => {
        this.ext[key] = data[key]
      })
      return this.ext
    },
    downwardNodes (nodes, val) {
      // select tree结构向"下"查找节点
      if (!Array.isArray(nodes)) return
      nodes.map(node => {
        // if ([0, 1].includes(node.managePermission)) { // 初始化，不等于0或者1时，不进行任何重新赋值
        // }
        const index = this.tableListData.findIndex(item => item.clinicId === node.clinicId)
        node.managePermission = val
        this.$set(this.tableListData[index], 'managePermission', val)
        // this.ele.toggleRowSelection(node, true)
        if (Array.isArray(node.nodes) && node.nodes.length) this.downwardNodes(node.nodes, val)
      })
    },
    upwardNodes (sourceData, index) {
      // select tree结构向"上"查找节点
      const level = ~-sourceData[index].__level
      const parentIdentity = sourceData[index].__family[level]
      const parentIndex = sourceData.findIndex(item => item.__identity === parentIdentity)
      const parentNodes = sourceData[parentIndex].nodes
      const parent = sourceData[parentIndex]
      if (!Array.isArray(parentNodes)) return
      if (parent) {
        parent.managePermission = 1
        this.$set(sourceData[parentIndex], 'managePermission', 1)
        // this.ele.toggleRowSelection(sourceData[parentIndex], true)
      }
      if (parentNodes[0].__level > 1) {
        this.upwardNodes(sourceData, parentIndex)
      }
    },
    handleCheckSelected (val, identity, index) {
      // 是否全选机构
      this.tableListData[index].managePermission = val
      this.$set(this.tableListData[index], 'managePermission', val)
      !val && this.downwardNodes(this.tableListData[index].nodes, val) // 父级关闭同步关闭子
      if (this.tableListData[index].__level >= 1) this.upwardNodes(this.tableListData, index)
    },
    handlerCellClassName ({ row, column }) {
      // 给机构列表和关联应用列 -- 添加列className （添加竖线功能）
      return ![this.propertyName, 'architectureName'].includes(column.property) ? 'group-manangs-table' : ''
    },
    handleCheckItemChange (checked, index, args) {
      // 关联应用子项点击操作
      const curData = this.tableListData[index]
      // 在选中项中查找当前选项的下标
      const sIndex = this.selectChecked.findIndex(select => {
        return select.clinicId === curData.clinicId
      })
      if (checked) {
        // 下标 === -1 给选中项push 该机构数据，并解构ext数据
        if (sIndex === -1) {
          this.selectChecked.push(Object.assign(this.ownNeedFulValFn(curData), this.ownExtData(curData)))
          this.checkOptions[args].push(checked)
        }
      } else {
        if (sIndex > -1) {
          this.selectChecked.splice(sIndex, 1)
          this.checkOptions[args].shift()
        }
      }
      // 右侧子项根据当前列数据真假控制是否可以操作
      if (args !== 'managePermission') curData.compDisabled = !checked
      this.tableListData = [...this.tableListData]
      const tableLen = this.tableListData.length
      const checkLen = this.checkOptions[args].length
      this.indeterminate[args] = checkLen > 0 && checkLen <= tableLen
      this.checkObj[args] = checkLen === tableLen
      this.$emit('update:selectData', this.selectChecked)
      this.$emit('switch-event', checked, curData) // 发送switch切换事件
    },
    handleCheckAllChange (checked, args) {
      const keys = Object.keys(this.checkObj)
      // 全选关联应用checkbox（批量选中）
      this.selectChecked = []
      this.tableListData.map((item, index) => {
        // switchProp 属性值 控制关联应用字段是否可以操作
        if (!item[this.switchProp] && !item.manageDisabled) {
          if (keys.includes(args)) {
            if ((args === MANAGE && !item.ifRoot) || args !== MANAGE) this.$set(this.tableListData[index], args, Number(checked))
          } else {
            this.$set(this.tableListData[index], args, Number(checked))
          }
        }
        // 设置[this.propertyName]为真，push 该机构数据，并解构ext数据
        checked && this.selectChecked.push(Object.assign(this.ownNeedFulValFn(item), this.ownExtData(item)))
      })
      this.checkObj[args] = checked
      this.indeterminate[args] = false
      // 发送所有选中项目数据给父组件
      this.$emit('update:selectData', this.selectChecked)
    },
    ownNeedFul ({ clinicId, architectureName, usePermissionId }) {
      // 默认解构selectChecked数据中需要的字段
      return {
        usePermissionId,
        clinicId,
        architectureName
      }
    },
    updateMultiRows (curData) {
      let changeExts = []
      if (this.isMultiRows) {
        curData.ext.map(item => {
          !item.status && changeExts.push(item) // Todo: 现写死判断字段为状态进行处理（是否设置使用权）(物资状态刚好相反，所以取了个反)
        })
      }
      return changeExts
    },
    eventChange ($event) {
      this.tableListData = [...this.tableListData] // 触发事件后， 更新tree数据
      const curData = $event.row
      const tIndex = this.newTreeData.findIndex(tree => {
        return tree.clinicId === curData.clinicId
      })
      const index = this.selectChecked.findIndex(select => {
        return select.clinicId === curData.clinicId
      })
      if (this.exception) {
        if (index > -1) {
          if (this.newTreeData[tIndex].unbind) {
            let changeExts = this.updateMultiRows(curData)
            this.isMultiRows && this.$set(this.selectChecked[index], 'changeExts', changeExts)
            if (!this.isMultiRows || !changeExts.length) {
              this.selectChecked.splice(index, 1)
              // Object.assign(this.newTreeData[tIndex], { [this.propertyName]: 0, unbind: 0, changeExts: [] }) // 把该条树数据初始化
            }
          } else {
            this.selectChecked.splice(index, 1, Object.assign(this.ownNeedFulValFn(curData), this.ownExtData(curData)))
          }
        } else {
          let changeExts = this.updateMultiRows(curData)
          this.selectChecked.push(Object.assign(this.newTreeData[tIndex], { [this.propertyName]: 1, unbind: 1, changeExts })) // unbind 自定义字段， 本地关联数据，可以执行删除操作
        }
      } else {
        if (index > -1) {
          // 当前数据变化后， 删除选中项selectChecked中该条数据，然后插入包含ext需要字段数据， 并发送给父组件（替换数据splice）
          this.selectChecked.splice(index, 1, Object.assign(this.ownNeedFulValFn(curData), this.ownExtData(curData)))
        }
      }
      this.$emit('update:selectData', this.selectChecked)
      this.$emit('eventChange', $event) // 发送事件
    }
  }
}
</script>

<style lang="scss" scoped>
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
.w20 {width: 20px;}
</style>
