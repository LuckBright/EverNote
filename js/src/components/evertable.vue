<template>
  <div :class="'ever-table-wrap' + (isFlex ? ' flex_col_1_hidden main-wrap' : '')">
<!--  <div class="ever-table-wrap">-->
<!--  <div>-->
    <!--    当所有的列都被隐藏之后，在列上都配置按钮将无法显示，此时需要显示该备份的配置按钮-->
    <span
      v-if="(configOption && !configOption.onlyPageSize) && showBackUp"
      @click="openConfigDialog"
      class="icon iconfont icon-biaoge-shezhi ever-table-config-back-up"
    ></span>
    <el-table
      v-loadmore="loadMore"
      ref="everTable"
      class="w ever-table"
      v-loading="tableLoading === '' ? loading : tableLoading"
      :border="border"
      :data="localData"
      :highlight-current-row="isSingleTable"
      :max-height="maxHeight ? +maxHeight : null"
      :height="localHeight"
      :key="tableKey"
      :row-key="rowKey"
      :row-style="rowStyle"
      :class="tableClz"
      :show-header="showHeader"
      :checkboxFixed="checkboxFixed"
      :selectable="selectable"
      :default-expand-all="defaultExpandAll"
      :row-class-name="classNameFormatter"
      :cell-class-name="cellClassNameFn"
      :header-cell-class-name="headerCellClassNameFn"
      :span-method="spanMethod"
      v-bind="elTableAttr"
      :empty-text="elTableAttr['empty-text'] || $t('暂无数据')"
      @expand-change="handleExpandChange"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-click="elRowClick"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @row-dblclick="rowDblclick"
      @current-change="handleCurrentChange"
      @header-dragend="headerDragend"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @cell-mouse-enter="cellMouseEnter"
    >
      <template>
        <!--判断是否显示多选框-->
        <template v-if="showCheckbox">
          <el-table-column
            :align="checkboxAlign"
            type="selection"
            :fixed="checkboxFixed"
            :selectable="selectable"
            :width="checkboxWidth || 54"
          ></el-table-column>
        </template>
        <template v-if="showIndex">
          <el-table-column
            type="index"
            :label="indexLabel === '' || indexLabel === ' ' ? ' ' : indexLabel"
            :width="checkboxWidth || 54"
            align="center"
          ></el-table-column>
        </template>
        <template v-if="showExpand">
          <el-table-column type="expand">
            <template slot-scope="props">
              <slot name="expand" :row="props.row"></slot>
            </template>
          </el-table-column>
        </template>
        <template v-for="(col, index) of localColumns">
          <!--不使用slot进行渲染-->
          <el-table-column
            v-if="!col.slotName && !col.hidden"
            :key="col._uuid"
            :fixed="col.fixed"
            :prop="col.prop || col.key"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth || col.width"
            :align="col.align"
            :column-key="index.toString()"
            :sortable="col.sortable ? 'custom' : false"
            :filters="col.filters"
            :class-name="col.className || ''"
            :show-overflow-tooltip="col.showOverflowTooltip"
          >
            <!--渲染表头-->
            <template slot="header" slot-scope="scope">
              <span
                v-if="(isDragTable || (configOption && !configOption.onlyPageSize)) && !col.undraggable"
                class="thead-cell"
                draggable
                @dragstart="onDragStart(scope.column)"
                @dragenter="onDragEnter(scope.column, $event)"
                @dragend="onDragEnd()"
                @dragover="onDragOver($event)"
              >
                <span class="drag-element">
                  <span v-if="col.slotHeader">
                    <slot
                      :name="col.slotHeader"
                      :row="scope.row"
                      :column="scope.column"
                      :$index="scope.$index"
                      :col="col"
                      :scope="scope"
                    ></slot>
                  </span>
                  <span v-else>{{scope.column.label}}</span>
                </span>
              </span>
              <template v-else>
                <span v-if="col.slotHeader">
                  <slot
                    :name="col.slotHeader"
                    :row="scope.row"
                    :column="scope.column"
                    :$index="scope.$index"
                    :col="col"
                    :scope="scope"
                  ></slot>
                </span>
                <span v-else>{{scope.column.label}}</span>
              </template>
              <!--是否可配置，一般放在最后一列的表头上-->
              <span
                v-if="(configOption && getConfigTableId() && !configOption.onlyPageSize) && index === getVisibleColumns.length - 1"
                @click="openConfigDialog"
                class="icon iconfont icon-biaoge-shezhi ever-table-config"
              ></span>
            </template>
            <!--渲染内容-->
            <template slot-scope="scope" :col="col">
              <span v-if="col.slot">
                <slot
                  :name="col.slot"
                  :row="scope.row"
                  :column="scope.column"
                  :$index="scope.$index"
                  :col="col"
                  :scope="scope"
                ></slot>
              </span>
              <ever-table-cell
                v-else
                :scope="scope"
                :col="col"
                :primary-key="getKey(scope.row)"
                :table-default-cell-value="tableDefaultCellValue"
                :max-btn-count="maxBtnCount"
                @eventChange="eventChange($event)"
              ></ever-table-cell>
            </template>
          </el-table-column>
          <!--使用slot进行渲染-->
          <!--如果使用slot渲染的是最后一列，且，最后一列的header上需要有一个可配置的图标按钮，则可以在slot中加上可配置的header，并触发openConfigDialog-->
          <slot v-else-if="col.slotName" :name="col.slotName"></slot>
        </template>
      </template>
    </el-table>
    <!--    暂时不支持本地分页 - 适用场景太少-->
    <el-pagination
      v-if="url && isPagination && localData.length && !useLoadMore"
      class="tar"
      v-bind="getPaginationAttr()"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
    ></el-pagination>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      v-if="(configOption && !configOption.onlyPageSize)"
      class="bt"
    >
      <span slot="title">
        自定义列
        <a class="restore" @click="restore">恢复默认</a>
        <a class="restore" @click="selectAll">{{allSelected ? '取消全选' : '全选'}}</a>
      </span>
      <ever-table-config v-if="dialogVisible" ref="configTable" :config-data="configData"></ever-table-config>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="submit" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import everTableCell from './evertablecell.vue'
import everTableConfig from './evertableconfig.vue'
import api from './evertableapi.js'
import { getUrl } from '@/util/req'
import { debounce1 as debounce } from '@/util/common'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

/**
 * @Description: everTable插件
 * @author fuyongbo@everjiankang.com
 * @date 2019-04-02
 */
// 默认的主键 依次查看 id code name 是否存在于columns中，如果都不存在则会在选择是报错
const primaryKeys = ['code', 'name']
const fixedHeightMap = {
  '1': 43, // 表单为一行时的高度
  '2': 86, // 表单为两行时的高度
}
export default {
  components: { everTableCell, everTableConfig },
  props: {
    // 最大展开的按钮数，Infinity 为不展开
    maxBtnCount: {
      type: [Number, String],
      default: 3,
      validator (value) {
        return value >= 1
      }
    },
    tableLoading: {
      type: [String, Boolean],
      default: ''
    },
    columns: {
      type: Array,
      default () {
        return []
      },
      required: true,
    },
    url: {
      type: [Object, String],
    },
    params: {
      type: Object,
      default: function () {
        return {}
      }
    },
    method: {
      type: String,
      default: 'post',
    },
    rowKey: { // 适用于树状表格数据
      type: String,
    },
    data: {
      type: Array,
      default () {
        return []
      },
    },
    isPagination: {
      type: Boolean,
      default: true,
    },
    paginationAttr: {
      type: Object,
    },
    tableClass: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    isSingleTable: {
      type: Boolean,
      default: false,
    },
    isDragTable: { // 表格是否可以拖拽 ，注意：有configOption的表格肯定能拖拽，但是isDragTable不一定可配置
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    checkboxAlign: {
      type: String,
      default: 'center',
    },
    checkboxFixed: {
      type: [String, Boolean]
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
    indexLabel: {
      type: String,
      default: '序号'
    },
    primaryKey: {
      type: String,
    },
    specialCellConfig: {
      type: [Object, Array],
    },
    /**
     * @Description: 配置表格参数
     * 属性           必填 含义
     * id            是   唯一id
     * url           否   默认表格配置的json形式【不推荐此方式，在定义columns的时候就是按照默认的方式进行的】
     * onlyPageSize  否   为true表示该表格仅配置pageSize，不配置表格的拖拽等
     * @author fuyongbo@everjiankang.com
     * @date 2019-05-18
     */
    configOption: {
      type: Object,
    },
    height: {
      type: [Number, String],
    },
    maxHeight: {
      type: [Number, String],
    },
    tableHeightStrategy: {
      type: [Number, String],
      default: 1,
    },
    rowClassName: {
      type: Function,
    },
    selectable: {
      type: Function,
    },
    cellClassName: {
      type: Function,
    },
    headerCellClassName: {
      type: Function,
    },
    // 该方法比较麻烦，且精确度不够高，可以选择性使用
    // 自动设置表格高度 【注意：使用该功能时，务必保证页面的结构与模板packagesalelist.vue保持一致】
    isAutoHeight: {
      type: Boolean,
      default: false,
    },
    // 固定的需要减去的高度，和 fixedElements 配合可以较精准的控制表格的高度
    fixedHeight: {
      type: Number,
    },
    fixedHeightType: {
      type: Number,
    },
    // 传入需要计算的元素的选择器
    fixedElements: {
      type: String,
    },
    isFlex: {
      type: Boolean,
      default: false
    },
    isRecordUrlParams: { // 是否在查询时记录表格的查询参数，在弹出层的表格中应该传false
      type: Boolean,
      default: true
    },
    queryKey: {
      type: String,
      default: 'q'
    },
    isAutoCheckRow: { // 是否根据地址栏的checkboxes自动勾选选中项
      type: Boolean,
      default: true
    },
    rowStyle: {
      type: Function
    },
    tableDefaultCellValue: {
      type: String
    },
    beforeList: {
      type: Function,
    },
    // element-table属性
    elTableAttr: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 是否使用滚动分页
    useLoadMore: {
      type: Boolean,
      default: false,
    },
    spanMethod: {
      type: Function,
    },
    // 忽略默认sort操作
    ignoreSort: Boolean,
    handleResult: Function,
    handleTotal: Function,
    /**
     * 点击行时不自动选中checkbox 【即默认是false，会自动选中；传true时不会自动选中】
     */
    notSelectCheckbox: {
      type: Boolean,
      default: false,
    },
    checkboxWidth: Number,
    pageKey: {
      type: String,
    },
    beautyParams: {
      type: Object,
      default () {
        return {}
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    tablePageSize: {
      type: [String, Number],
      default: 20,
    },
    request: {
      type: [String, Object],
      default: 'request',
    }
  },
  computed: {
    tableClz () {
      const classObj = {}
      if (this.tableClass) {
        this.tableClass.split(' ').forEach(key => {
          classObj[key] = true
        })
      }
      return {
        'moving': this.dragState.dragging,
        'draggable-table': this.isDragTable || (this.configOption && !this.configOption.onlyPageSize),
        // 'flex-table': this.isFlex,
        'flex_column_full_hidden': this.isFlex,
        ...classObj,
      }
    },
    getVisibleColumns () {
      return this.localColumns.filter(item => !item.hidden)
    },
    showBackUp () {
      const visible = this.getVisibleColumns
      return visible.length === 0 || visible.every(item => item.isOperate || item.btns || item.slotName === 'opCol')
    },
    // key () {
    //   let primaryKey = this.primaryKey || primaryKeys.find(key => this.localColumns.some(item => item.prop === key))
    //   if (!primaryKey) {
    //     // 对于必须提供primaryKey的表格来说，需要报错提示
    //     if (this.isRememberSelectedRow) {
    //       throw Error('请指定表格的主键primaryKey')
    //     }
    //   }
    //   return primaryKey
    // },
  },
  data () {
    return {
      allSelected: false,
      tableKey: U(),
      loading: false,
      localData: this.data,
      originLocalData: this.data, // 保存原始本地数据的顺序
      localParams: deepClone(this.params),
      localColumns: this.columns,
      originLocalColumns: this.columns,
      currentRow: null,
      multipleSelection: [],
      dragState: {
        start: -9,
        end: -9,
        dragging: false,
        direction: undefined,
      },
      dialogVisible: false,
      configData: [],
      defaultPaginationAttr: {
        pageSizes: [10, 20, 30, 50, 100],
        background: true,
        layout: 'total, sizes, prev, pager, next, jumper',
      },
      currentPage: 1, // 当前页码
      pageSize: this.tablePageSize || 20, // 每页条数
      totalCount: 0,
      sortObj: {
        sortField: null,
        sortOrder: null,
      },
      defaultRowStatus: true, // 默认行状态
      localHeight: this.height,
      checkboxes: [],
      selectedId: '',
      isFirstSearch: true, // 是否为第一次查询
    }
  },
  watch: {
    columns: {
      handler (v) {
        this.localColumns = v
        this.addUuidForColumns()
      },
      deep: true,
    },
    data: {
      handler (v) {
        if (v) {
          this.localData = v
          this.originLocalData = [...v]
        } else {
          this.localData = []
          this.originLocalData = []
        }
      },
      deep: true,
    },
    params: {
      handler: debounce(function (v) {
        this.localParams = deepClone(v)
        this.requestData(!this.isFirstSearch)
        this.isFirstSearch = false
      }, 200),
      deep: true,
    },
    height: {
      handler (v) {
        this.localHeight = v
      },
    },
    configData: {
      handler (val) {
        this.$emit('configChange', val)
      },
      deep: true
    }
  },
  created () {
    // 初始化 分页查询参数
    const query = this.$route.query
    if (this.isRecordUrlParams && query && query[this.queryKey]) {
      const queryObj = JSON.parse(query[this.queryKey])
      // 初始化时，为查询表单赋值 此处会触发watch中对params对监听
      this.$emit('update:params', { ...this.params, ...queryObj, ...{ _uuid: U() } })
      // 启用滚动加载，则刷新页面时永远查询第一页
      this.currentPage = this.useLoadMore ? 1 : (queryObj.currentPage || queryObj.page)
      this.pageSize = this.useLoadMore ? 50 : queryObj.pagesize
      if (queryObj._checkboxes && queryObj._checkboxes.length) {
        this.checkboxes = queryObj._checkboxes
      }
      if (queryObj._selectedId || queryObj._selectedId === 0) {
        this.selectedId = queryObj._selectedId
      }
    } else {
      this.currentPage = 1
      this.$emit('update:params', { ...this.params, ...{ _uuid: U() } })
    }
    // 根据配置项读取列信息，和pageSize信息
    if (this.configOption && this.getConfigTableId()) {
      api.getConfig({
        tableId: this.getConfigTableId(),
      }).then(res => {
        const config = res.data.config
        const pageSize = res.data.pageSize
        if (config) {
          // 初始化 是否已经全选
          this.allSelected = config.every(v => !v.hidden)
          this.setData(config)
        } else {
          // 列配置项的初始化数据存在json文件中
          // 存在默认的json配置文件
          if (this.configOption.url) {
            api.getStaticConfig(this.configOption.url).then((resp) => {
              this.setData(resp.data.config)
            })
          } else {
            this.allSelected = this.columns.every(v => !v.hidden)
            this.setData()
          }
        }
        // pageSize的初始化数据为this.pageSize的初始值
        this.pageSize = this.useLoadMore ? 50 : (pageSize || this.pageSize)
      })
    }
    if (!this.url) {
      setTimeout(() => {
        this.resize()
      })
    }
    // 监听浏览器窗口变化
    if (this.isAutoHeight || this.fixedHeight || this.fixedHeightType || this.fixedElements) {
      window.addEventListener('resize', this.resize)
    }
  },
  mounted () {
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    // treetable展开的时候需要计算一下表格高度修改，修正滚动条
    handleExpandChange () {
      if (this.isAutoHeight || this.fixedHeight || this.fixedHeightType || this.fixedElements) {
        this.resize()
      }
    },
    getKey (row) {
      if ('id' in row) {
        return 'id'
      }
      let primaryKey
      if (this.primaryKey) {
        return this.primaryKey
      } else {
        primaryKey = primaryKeys.find(item => !!row[item])
        if (primaryKey) {
          return primaryKey
        } else {
          // 对于必须提供primaryKey的表格来说，需要报错提示
          // if (this.isRememberSelectedRow) {
          //   throw Error('请指定表格的主键属性primaryKey')
          // }
        }
      }
    },
    /* 多选时记录选中的条目，并将选中的数据加上标记 */
    handleSelectionChange (selection) {
      if (this.showCheckbox) {
        this.multipleSelection = selection
        this.$emit('selection-change', selection)
      }
    },
    handleSelect (selection, row) {
      if (this.showCheckbox) {
        // 在地址栏记录选中的值
        this.checkboxes = selection.map(item => item[this.getKey(item)])
        this.recordUrlParams()
        this.$emit('select', selection, row)
      }
    },
    handleSelectAll (selection) {
      if (this.showCheckbox) {
        // 在地址栏记录选中的值
        this.checkboxes = selection.map(item => item[this.getKey(item)])
        this.recordUrlParams()
        this.$emit('select-all', selection)
      }
    },
    /* 给选中的行加上特殊类 */
    classNameFormatter (arg) {
      const { row } = arg
      // 勾选之后的样式
      // return (this.rowClassName ? this.rowClassName({row}) : '') + (this.showCheckbox ? (this.multipleSelection.some(item => item === row) ? 'selected' : '') : '')
      // 外部函数控制的样式
      const outerClassName = this.rowClassName ? this.rowClassName(arg) : ''
      // 渲染记住当前行的样式
      let _selectedId
      const query = this.$route.query
      if (query && query[this.queryKey]) {
        const queryObj = JSON.parse(query[this.queryKey])
        _selectedId = queryObj._selectedId
      }
      let rememberClassName = this.defaultRowStatus ? (_selectedId !== undefined && row[this.getKey(row)] === _selectedId ? 'remember-row' : '') : ''
      return outerClassName + ' ' + rememberClassName
    },
    /* 单选时记录当前选中的行 */
    handleCurrentChange (val) {
      if (this.isSingleTable) this.currentRow = val
      this.$emit('current-change', val)
    },
    /* 获取拖拽下表头的样式 */
    headerCellClassNameFn (arg) {
      const { column } = arg
      // 外部函数控制的样式
      const outerClassName = this.headerCellClassName ? this.headerCellClassName(arg) : ''
      // 判断哪些表头可以拖拽，哪些不能
      let dragClass = ''
      const crtColumn = this.localColumns.find(item => column.property === item.prop && item.prop)
      if (crtColumn && !crtColumn.undraggable) {
        dragClass = 'draggable'
      }
      const active = column.columnKey - 0 === this.dragState.end ? `drag-active-${this.dragState.direction}` : ''
      const start = column.columnKey - 0 === this.dragState.start ? `drag-start` : ''
      return `${active} ${start} ${dragClass} ${outerClassName}`
    },
    /* 单元格的样式 */
    cellClassNameFn (args) {
      const { row, column } = args
      const outerClassName = this.cellClassName ? this.cellClassName(args) : ''
      let specialCellClassName = ''
      // 存在特殊单元格配置 则根据特殊单元格配置 为单元格的className赋值
      if (this.specialCellConfig && (Array.isArray(this.specialCellConfig) || this.specialCellConfig.prop)) {
        specialCellClassName = 'spe-cell'
        // 如果配置是单个对象，则根据该配置为匹配的单元格赋值
        if (this.specialCellConfig.prop &&
          row[this.specialCellConfig.prop] === this.specialCellConfig.value &&
          column.property === this.specialCellConfig.prop) {
          specialCellClassName += ' ' + this.specialCellConfig.className
        } else if (Array.isArray(this.specialCellConfig)) {
          this.specialCellConfig.forEach(item => {
            if (row[item.prop] === item.value && column.property === item.prop && item.prop) {
              specialCellClassName += ' ' + item.className
            }
          })
        }
      }
      return specialCellClassName + ' ' + outerClassName
    },
    /* 拖拽列宽 */
    headerDragend (nw, ow, c) {
      // 有时会和拖拽的操作重合
      this.dragState = {
        start: -9,
        end: -8,
        dragging: false,
        direction: undefined,
      }
      // 在localColumns上和configData上都改变对应列都宽度
      const localItem = this.localColumns.find(item => item.prop === c.property && item.prop)
      if (localItem) {
        localItem.width = nw
      }
      // this.localColumns = [...this.localColumns]
      const configItem = this.configData.find(item => item.prop === c.property && item.prop)
      if (configItem) {
        configItem.width = nw
      }
      // this.configData = [...this.configData]
      if ((this.configOption && !this.configOption.onlyPageSize)) {
        this.save(false)
      }
    },
    eventChange ($event) {
      // 记住的原理是：在路由上记住需要的数据，刷新时能够获取该参数
      if (['_link', 'edit', 'detail'].includes($event.prop)) {
        this.defaultRowStatus = true
        // 需要记住该行
        this.selectedId = $event.row[this.getKey($event.row)]
        this.recordUrlParams()
        if ($event.prop === '_link') {
          // 如果是跳转事件，则跳转到对应的路由
          if ($event.linkPath) {
            if ($event.target) {
              window.open($event.linkPath, $event.target)
            } else {
              this.$router.push($event.linkPath)
            }
          }
        }
      }
      if (!$event.prop.startsWith('_')) {
        this.$emit('eventChange', $event)
        // 使用这种方式发送事件，更简洁 2019-12-04
        this.$emit($event.prop, $event)
      }
    },
    setData (config) {
      if (config) {
        this.configData = config.map(item => ({ ...item, width: item.width || 'auto' }))
      } else {
        // 排除操作按钮
        this.configData = [...this.originLocalColumns.filter(item => !(item.isOperate || item.btns || item.slotName === 'opCol')).map(item => ({ ...item, width: item.width || 'auto' }))]
      }
      // 将this.localColumns的配置信息修改成从配置文件中取出来的配置
      this.setLocalColumns()
    },
    /* 配置表格相关事件 */
    /* 恢复默认 */
    restore () {
      if (this.configOption.url) {
        api.getStaticConfig(this.configOption.url).then((resp) => {
          if (resp.head.errCode === 0) {
            this.setData(resp.data.config)
            this.save(true, true)
          }
        })
      } else {
        this.setData()
        this.save(true, true)
      }
    },
    save (close = true, restore = false) {
      // 将数据保存到后台
      if (this.configOption) {
        api.saveConfig({
          tableId: this.getConfigTableId(),
          config: restore ? null : this.configData, // 只改config，不改pageSize
        }).then(() => {
          // 提示保存成功
          // 恢复默认之后需要将弹窗关闭，若不关闭，则需要解决勾选框与数据同步的问题（需要发送事件）
          if (close) {
            this.dialogVisible = false
            // 点击保存之后发送事件，适用于一个页面多个 ever-table 表格
            this.$emit('save-config')
          }
        })
      }
    },
    /* 保存配置 */
    submit: debounce(function () {
      // TODO 在配置的过程中配置如何避免auto的列别隐藏的问题
      // TODO 思路：计算非隐藏列的所有列宽之和与当前表格的宽度比较，如果列宽和小于表格宽度，则提示用户不能这么设置
      // 执行保存操作
      const configTable = this.$refs.configTable
      const mergedData = [...configTable.localConfigData.map(item => {
        const localItem = this.localColumns.find(c => item.prop && c.prop === item.prop)
        const viewItem = configTable.viewArray.find(v => v.prop === item.prop)
        return {
          ...localItem,
          ...item,
          ...viewItem,
        }
      })]
      // 在配置列表中修改数据时候，同步到数据展示页面
      this.configData = [...mergedData.map(item => ({ ...item, width: item.width || 'auto' }))]
      this.setLocalColumns()
      this.save()
    }, 200),
    setLocalColumns () {
      const mergeItemFn = (item) => {
        // 找到本地配置的item，与configItem合并，得到最终item
        const localItem = this.localColumns.find(c => c.prop && c.prop === item.prop)
        return {
          ...item,
          ...(localItem || {}),
          width: item.width === 'auto' ? undefined : item.width,
          align: item.align || 'left',
          hidden: !!item.hidden,
          disableConfig: item.disableConfig,
        }
      }
      // 一般来说，localColumns中存在，configData中却不存在数据就是操作列了，一般来说只有1个操作列，而且操作列只会出现在第一列或者最后一列
      const opColumn = this.localColumns.find(item => item.isOperate || item.btns || item.slotName === 'opCol')
      const opIndex = this.localColumns.findIndex(item => item.isOperate || item.btns || item.slotName === 'opCol')
      let tempColumns = [...this.configData.filter(item => !item.hidden).map(item => mergeItemFn(item))]
      if (opColumn) {
        if (opIndex === 0) {
          tempColumns = [opColumn, ...tempColumns]
        } else {
          tempColumns = [...tempColumns, opColumn]
        }
      }
      // 将隐藏的列放到最后，以保证配置按钮在最后一个显示的列头出现
      this.localColumns = [...tempColumns, ...this.configData.filter(item => item.hidden).map(item => mergeItemFn(item))]
      // 获取合并后的完整的 表格列
      this.$emit('get-config-table-columns', this.localColumns)
      this.addUuidForColumns()
    },
    setConfigData () {
      // 一般来说，configData是localColumns到子集，根据localColumns 同步configData
      // 此方法只同步width和顺序
      this.configData = [...this.localColumns.filter(item => this.configData.some(c => item.prop && c.prop === item.prop)).map(item => {
        const configItem = this.configData.find(c => item.prop && c.prop === item.prop)
        const columnItem = this.localColumns.find(c => item.prop && c.prop === item.prop)
        return {
          ...configItem,
          ...columnItem,
          width: item.width || 'auto',
        }
      })]
    },
    onDragStart (col) {
      this.dragState.dragging = true
      this.dragState.start = parseInt(col.columnKey)
    },
    onDragEnter (col, e) {
      if (this.dragState.dragging) {
        const index = parseInt(col.columnKey)
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right'
        } else {
          this.dragState.direction = undefined
        }
        this.dragState.end = parseInt(col.columnKey)
      }
      e.preventDefault()
    },
    onDragEnd () {
      this.dragColumn(this.dragState)
      this.dragState = {
        start: -9,
        end: -8,
        dragging: false,
        direction: undefined,
      }
    },
    onDragOver (e) {
      e.preventDefault()
    },
    dragColumn ({ start, end }) {
      if (start !== end && start >= 0 && end >= 0) {
        const tempData = []
        const min = Math.min(start, end)
        const max = Math.max(start, end)
        for (let i = 0; i < this.localColumns.length; i++) {
          if (i === end) {
            tempData.push(this.localColumns[start])
          } else if (i < min || i > max) {
            // 不受影响的列
            tempData.push(this.localColumns[i])
          } else if (min === end) {
            // 向左划 tempData中第end的位置存start的列，end + i的位置存
            if (i > min && i <= max) {
              tempData.push(this.localColumns[i - 1])
            }
          } else if (min === start) {
            if (i >= min && i < max) {
              tempData.push(this.localColumns[i + 1])
            }
          }
          // if (i === end) {
          //   tempData.push(this.localColumns[start])
          // } else if (i > min && i < max) {
          //   tempData.push(this.localColumns[isLeft ? i - 1 : i + 1])
          // } else {
          //   tempData.push(this.localColumns[i])
          // }
        }
        this.localColumns = [...tempData]
        this.addUuidForColumns()
        // 在调整顺序之后，需要将此时的配置信息保存到后台，并且同步到配置表格
        this.setConfigData()
        this.save(false)
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      // 从第一页开始查询
      this.requestData(true)
      if (this.configOption) {
        api.savePageSize({
          tableId: this.getConfigTableId(),
          pageSize: this.pageSize,
        }).then(() => { })
      }
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      // 根据currentPage查询
      this.requestData()
    },
    getConfigTableId () {
      if (this.configOption.id) {
        return this.configOption.id
      } else {
        if (this.configOption.isAutoId) {
          let url = ''
          if (this.url) {
            url = getUrl(this.url).url.split('/').join('.')
            if (!url.endsWith('.')) {
              url = url + '.'
            }
            if (url.startsWith('.')) {
              url = url.slice(1)
            }
          }
          // console.log(url, 'url')
          // console.log(window.location.hash, 'window.location.hash')
          // console.log(url + (window.location.hash || '').slice(2, (window.location.hash || '').indexOf('?')).split('/').join('.'), 'result')
          return url + (window.location.hash || '').slice(2, (window.location.hash || '').includes('?') ? (window.location.hash || '').indexOf('?') : undefined).split('/').join('.')
        }
      }
    },
    getPaginationAttr () {
      return {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...this.defaultPaginationAttr,
        ...(this.paginationAttr || {}),
        total: this.totalCount,
      }
    },
    /* 主动触发查询 */
    list (searchFirstPage = true) {
      this.requestData(searchFirstPage)
    },
    recordUrlParams () {
      // 如果查询不是在弹出层中发生的则记录查询条件
      if (this.isRecordUrlParams) {
        let queryObj = Object.keys(this.localParams).reduce((acc, curr) => {
          if (this.localParams[curr]) {
            acc[curr] = this.localParams[curr]
          }
          return acc
        }, {})
        const currentQuery = this.$route.query // 当前地址栏的查询条件
        let currentQueryObj = {} // 当前表格的查询条件
        if (currentQuery && currentQuery[this.queryKey]) {
          currentQueryObj = JSON.parse(currentQuery[this.queryKey])
        }
        if (!this.checkboxes.length) {
          delete currentQueryObj._checkboxes
        }
        if (this.selectedId === undefined || this.selectedId === null || this.selectedId === '') {
          delete currentQueryObj._selectedId
        }
        // 不显示多余的属性
        delete queryObj.currentPage
        delete queryObj.pageSize
        delete queryObj.offset
        // 删除自定义的多余的属性 this.beautyParams.excludes中的
        if (this.beautyParams.excludes && this.beautyParams.excludes.length) {
          for (const item of this.beautyParams.excludes) {
            delete queryObj[item]
          }
        }
        // 将当前表格的查询参数保存到url地址栏上
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...currentQuery,
            [this.queryKey]: JSON.stringify({
              // ...currentQueryObj, // 不需要保留之前的条件了
              ...queryObj,
              page: this.currentPage,
              pagesize: this.pageSize,
              ...(this.checkboxes.length ? { _checkboxes: this.checkboxes } : {}),
              ...(this.selectedId ? { _selectedId: this.selectedId } : {}),
            }),
          },
        })
        // 发送数据出去给表单赋值
        // this.$emit('formValue', queryObj)
      }
    },
    requestData (searchFirstPage = false) {
      // 是否允许查询 -- 通过beforeList控制
      const canList = this.beforeList ? this.beforeList() : true
      if (!canList) {
        return
      }
      // 是否允许查询 -- 通过在params中传 _doNotSearch = true 控制
      if (this.localParams._doNotSearch) {
        return
      }
      // 是否查询第一页 -- 通过在params中传 searchFirstPage = true 控制
      if (this.localParams.searchFirstPage) {
        this.localParams.searchFirstPage = false
        this.currentPage = 1
      }
      // 是否查询第一页 -- 通过调用list(true)
      if (searchFirstPage) {
        this.currentPage = 1
      }
      // 更新查询参数
      // 查询参数来自 传进来的params
      // 分页参数 1. 初始化页面时，来自地址栏的参数 2. 其他时候来自 this.pageSize this.currentPage
      this.localParams = {
        ...this.localParams,
        currentPage: this.currentPage, // 新项目需求
        page: this.currentPage,
        // pageSize: this.pageSize, // 新项目需求  2020 02 27 按领导指示 去掉此兼容 统一小写
        pagesize: this.pageSize,
        offset: this.pageSize * (this.currentPage - 1),
        ...this.sortObj,
      }
      if (this.pageKey) {
        this.localParams[this.pageKey] = this.localParams.page
      }
      for (let key in this.localParams) {
        const value = this.localParams[key]
        if (value === '' || value === null || value === undefined ||
          key === 'requestSwitch' || key === '_uuid' || key === 'searchFirstPage' || key === '_doNotSearch' ||
          (Array.isArray(value) && value.length === 0)) {
          delete this.localParams[key]
        }
      }
      // delete this.localParams.requestSwitch
      // delete this.localParams._uuid
      // delete this.localParams.searchFirstPage
      // delete this.localParams._doNotSearch
      this.recordUrlParams()
      if (this.url) {
        this.loading = true
        api.getData(this.url, { ...this.localParams }, this.method, this.request).then(res => {
          this.loading = false
          const result = res.data
          this.totalCount = res.totalCount
          let tempData = []
          if (result) {
            if (result.warningType) this.warningType = result.warningType
            if ('list' in result) {
              tempData = result.list
            } else if ('data' in result) {
              tempData = result.data
            } else {
              tempData = result
            }
            this.totalCount = this.totalCount || (result.totalCount ? result.totalCount : 0)
            if (tempData && 'resultList' in tempData) {
              if ('totalCount' in tempData) {
                this.totalCount = tempData.totalCount
              }
              tempData = tempData.resultList
            } else if (tempData && 'pageList' in tempData) {
              if ('totalCount' in tempData) {
                this.totalCount = tempData.totalCount
              }
              tempData = tempData.pageList
            }
            if (!tempData || (tempData && !tempData[0])) {
              tempData = []
            }
          } else {
            tempData = res.resultList || []
            this.totalCount = 0
          }
          if (this.useLoadMore) {
            this.localData = this.localData.concat(tempData)
            // 第一次加载完成之后如果没有出现滚动条，则继续加载下一页，直到滚动条出现
            setTimeout(() => {
              if (!this.appearScrollbar()) {
                this.loadMore()
              }
            }, 50)
          } else {
            this.localData = tempData
          }
          this.totalCount = this.handleTotal ? this.handleTotal(res) : this.totalCount
          this.localData = this.handleResult ? this.handleResult(res) : this.localData
          this.$emit('afterSearch', { result: this.localData })
          this.resize()
          if (this.localData.length) {
            setTimeout(() => {
              this.toggleRowSelection()
            }, 500)
          }
        })
      } else {
        this.loading = false
        this.localData = []
        this.totalCount = 0
      }
    },
    // 根据浏览器地址栏中选中的值 回显被勾选的数据
    toggleRowSelection () {
      const currentQuery = this.$route.query // 当前地址栏的查询条件
      let currentQueryObj = {} // 当前表格的查询条件
      if (currentQuery && currentQuery[this.queryKey]) {
        currentQueryObj = JSON.parse(currentQuery[this.queryKey])
      }
      if (this.isRecordUrlParams && this.isAutoCheckRow) {
        if (currentQueryObj._checkboxes && currentQueryObj._checkboxes.length) {
          const me = this
          const selectedList = this.localData.filter(item => currentQueryObj._checkboxes.some(c => c === item[this.getKey(item)]))
          if (selectedList.length) {
            selectedList.forEach(item => {
              me.$refs.everTable.toggleRowSelection(item, true)
            })
            this.$emit('auto-checked', selectedList)
          }
        }
      }
    },
    filterChange (filters) {
      // todo 根据columnKey找到对应的prop，再向后台发送数据
    },
    cellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', { row, column, cell, event })
    },
    sortChange ({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
      if (this.ignoreSort) return
      this.sortObj.sortField = prop
      this.sortObj.sortOrder = order
      // 排序
      if (this.url) {
        // 发送请求排序，根据currentPage查询
        this.requestData()
      } else {
        // 对localData进行排序
        if (order) {
          this.localData.sort((a, b) => {
            if (order === 'descending') {
              if (a[prop] > b[prop]) {
                return 1
              } else {
                return -1
              }
            } else {
              if (a[prop] > b[prop]) {
                return -1
              } else {
                return 1
              }
            }
          })
          this.localData = [...this.localData]
        } else {
          // 恢复到未排序之前到样子
          this.localData = [...this.originLocalData]
        }
      }
    },
    /* 在改变列的时候经常出现错位的现象，使用唯一的uuid作为key可以解决此问题 */
    addUuidForColumns () {
      this.localColumns = this.localColumns.map(item => ({
        ...item, _uuid: U(),
      }))
      this.changeTableKey()
    },
    changeTableKey () {
      this.tableKey = U()
    },
    elRowClick (row, column) {
      if (column) {
        // 点击行时 判断点击的列是否为 不需要切换checkbox的列
        const localCol = this.localColumns.find(item => item.prop && (item.prop === column.property || item.key === column.property))
        // 如果该列是slot列 该列没有链接，没有按钮时切换勾选
        if (!this.notSelectCheckbox && (!localCol || !(localCol.linkRoot || localCol.urlFormatter || localCol.btns || localCol.notSelectCheckbox))) {
          this.$refs.everTable.toggleRowSelection(row)
        }
      }
      // 将默认选中的行的显示标识切改为false
      this.defaultRowStatus = false
      this.$emit('row-click', { row, column })
    },
    cellClick (row, column, cell, event) {
      this.$emit('cell-click', { row, column, cell, event })
    },
    rowDblclick (row, column, event) {
      this.$emit('row-dblclick', { row, column, event })
    },
    cellDblclick (row, column, cell, event) {
      this.$emit('cell-dblclick', { row, column, cell, event })
    },
    resize () {
      /* 获取元素的属性值 只支持单位为px的属性 */
      const getStyleNumber = (selector, attr) => {
        const el = document.querySelector(selector)
        if (el) {
          return Number.parseFloat(window.getComputedStyle(el)[attr]) || 0
        }
        return 0
      }
      if (this.isAutoHeight || this.fixedHeight || this.fixedHeightType || this.fixedElements) {
        const me = this
        me.$nextTick(() => {
          setTimeout(() => {
            // 固定需要减去的高度
            // el-header:50px
            // el-main:上下padding 10 * 2
            // layout_inner:上下padding 10 + 15
            // el-table:上下margin 10 * 2
            // 如果存在el-pagination 则el-pagination:28
            const elHeader = document.querySelectorAll('#el-header')[0]
            // header 有时为50 有时为85
            const elHeaderHeight = elHeader ? elHeader.clientHeight : 0
            // el-main 的padding 上下相加一般为 20
            const elMainPadding = getStyleNumber('.el-main.layout_main_wrap', 'padding-top') + getStyleNumber('.el-main.layout_main_wrap', 'padding-bottom')
            // layout_inner 的padding 上下相加一般为 25 新的布局下为0 2019-05-30
            let layoutInnerPadding = getStyleNumber('.el-main.layout_box .layout_inner', 'padding-top') + getStyleNumber('.el-main.layout_box .layout_inner', 'padding-bottom')
            if (layoutInnerPadding === 0) {
              layoutInnerPadding = getStyleNumber('.layout_box > .layout_inner', 'padding-top') + getStyleNumber('.layout_box > .layout_inner', 'padding-bottom')
            }
            const elTableMargin = 10 * 2
            // 调试表格高度
            let resizeHeight = 0
            // 没有数据时 分页器的高度应该变为 0
            const elPaginationHeight = me.isPagination ? (me.localData.length ? 32 : 0) : 0
            // 计算表格高度
            let fixedHeight = me.fixedHeight || 0
            if (me.isAutoHeight) {
              // 2020-04-08 出现未知原因使得页面自动计算表格高度时，出现问题，表格高度无法自动减去表格的头部高度，使得页面出现问题
              // resizeHeight = 30
              // const tableHeaderElement = me.$refs.everTable.$el.querySelector('.el-table__header-wrapper')
              // resizeHeight = tableHeaderElement ? tableHeaderElement.clientHeight : 0
              // resizeHeight = 0
              // console.log(resizeHeight, 'resizeHeight')
              // 找到当前页面的.main-head元素的高度
              const mainHead = document.querySelectorAll('.layout_inner .main-head')[0]
              if (mainHead) {
                fixedHeight += mainHead.clientHeight
              }
            } else if (me.fixedHeightType) {
              fixedHeight += fixedHeightMap['' + (me.fixedHeightType || 1)]
            } else if (me.fixedElements) {
              const els = me.fixedElements.split(' ')
              let elsFixedHeight = 0
              els.forEach(c => {
                const el = document.querySelector(`.${c}`)
                // 这里只是计算基本的情况，如果指定的元素之间发生了margin合并，则应该从fixedHeight中处理
                if (el) {
                  elsFixedHeight += el.clientHeight + getStyleNumber(`.${c}`, 'margin-top') + getStyleNumber(`.${c}`, 'margin-bottom')
                }
              })
              fixedHeight += elsFixedHeight
            }
            /* 表格高度调试 start */
            // console.log('window.innerHeight', window.innerHeight)
            // console.log('elHeaderHeight', elHeaderHeight)
            // console.log('elMainPadding', elMainPadding)
            // console.log('layoutInnerPadding', layoutInnerPadding)
            // console.log('elTableMargin', elTableMargin)
            // console.log('elPaginationHeight', elPaginationHeight)
            // console.log('fixedHeight', fixedHeight)
            /* 表格高度调试 end */
            const localHeight = window.innerHeight - elHeaderHeight - elMainPadding - layoutInnerPadding - elTableMargin - elPaginationHeight - fixedHeight - resizeHeight
            // console.log('localHeight', localHeight)
            // 默认的表格高度策略：表格的高度比屏幕高度小时不设置高度
            if (this.tableHeightStrategy === 1) {
              if (me.$refs.everTable) {
                const tableContentElement = me.$refs.everTable.$el.querySelector('.el-table__body-wrapper > table.el-table__body')
                const tableHeaderElement = me.$refs.everTable.$el.querySelector('.el-table__header-wrapper')
                if (tableContentElement && tableHeaderElement) {
                  if (tableContentElement.clientHeight + tableHeaderElement.clientHeight + 1 <= localHeight) {
                    me.localHeight = null
                  } else {
                    me.localHeight = localHeight
                  }
                } else {
                  me.localHeight = localHeight
                }
              } else {
                me.localHeight = localHeight
              }
            } else {
              // 表格高度撑满剩余空间
              me.localHeight = localHeight
            }
            me.$nextTick(() => {
              if (me.$refs.everTable) {
                me.$refs.everTable.doLayout()
              }
            })
          }, 50)
        })
      }
    },
    openConfigDialog (e) {
      this.dialogVisible = true
      e.stopPropagation()
      return false
    },
    // 实现滚动加载的效果
    loadMore () {
      // 只在启用滚动加载的情况下调用
      if (this.useLoadMore) {
        if (!this.loading) {
          // 加载下一页数据
          if (this.currentPage * this.pageSize < this.totalCount) {
            this.currentPage = this.currentPage + 1
            this.requestData()
          }
        }
      }
    },
    // 判断表格是否出现了滚动条
    appearScrollbar () {
      const scrollEl = this.$refs.everTable.$el.querySelector('.el-table__body-wrapper')
      if (!scrollEl) {
        return true
      }
      // 两种方法都能实现
      // return window.getComputedStyle(scrollEl).getPropertyValue('overflow-y') === 'auto'
      return scrollEl.scrollHeight > scrollEl.clientHeight
    },
    selectAll () {
      this.allSelected = !this.allSelected
      // 执行配置列表的全选
      this.$refs.configTable.handleSelectAll(this.allSelected)
    },
  },
}
function deepClone (v) {
  return JSON.parse(JSON.stringify(v))
}
</script>

<style scoped lang="less">
.moving {
  opacity: 0.5;
}

.restore {
  cursor: pointer;
  color: #1c7bef;
  margin-left: 15px;
  font-size: 14px;
}

.tar {
  text-align: right;
}

.ever-table-wrap {
  width: 100%;
  position: relative;
  .ever-table-config-back-up {
    color: #666;
    font-size: 14px;
    line-height: 14px;
    margin-top: 8px;
    position: absolute;
    right: 10px;
    z-index: 1;
  }
  // 分页器样式
  .el-pagination {
    .el-input--mini .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>
