<template>
  <!-- 查询添加商品 -->
  <div>
    <div class="invoice" v-if="description && description.purchaseSaleType === 1 && (status !== 10 || (status === 10 && !list.more))" style="margin-top: 0px">
      <el-form :inline="true" class="demo-form-inline" onsubmit="return false;" size="small">
        <el-form-item label="发票号：" ref="invoiceTitle">
          <el-input
            v-if="list.invoiceStatus === 0"
            placeholder="请输入发票号"
            v-model="list.invoiceNo"
            size="small"
            clearable
          ></el-input>
          <!-- <span v-if="list.invoiceStatus === 1">发票未到</span> -->
          <span v-if="list.invoiceStatus === 3">{{list.invoiceNo}}</span>
        </el-form-item>
        <el-form-item style="width: 200px">
          <div v-if="status != 12">
            <el-button
              type="text"
              v-if="list.invoiceStatus === 0"
              @click="handleSaveInvoice(list)"
            >保存</el-button>
            <el-button
              type="text"
              v-if="((list.invoiceStatus === 1 || list.invoiceStatus === 3) && status !== 11 && status !== 100) || (status === 11 && list.invoiceStatus === 3 && (itemKey || switchInow) && list.edit)"
              @click="handleEditInvoice()"
            >修改</el-button>
            <el-button
              type="text"
              v-if="list.invoiceStatus === 1 && status === 11 && !list.edit"
              @click="handleEditInvoice()"
            >补录发票</el-button>
            <!-- <el-button
              type="text"
              v-if="status !== 11 && list.invoiceStatus === 0 && !parentData.some(item => item.invoiceStatus === 1)"
              @click="handleNoInvoice(1)"
            >发票未到</el-button> -->
          </div>
        </el-form-item>
        <el-form-item label="发票金额：" v-if="list.invoiceStatus === 3">
          <span class="yellow">¥{{fpPrice | formatToFinacial(4)}}</span>
        </el-form-item>
        <el-button
          v-if="(status === 9 && ((itemKey || (!itemKey && list.item.length > 1)) || list.invoiceStatus !== 0)) || (status == 10 && !list.more)"
          @click="deleteListItem"
          type="text" class="fr">删除发票及物资</el-button>
      </el-form>
    </div>
    <div class="table">
      <!-- 查询添加商品 -->
      <div>
        <el-table
          border
          ref="additem"
          :key="tableKey"
          :data="tableData"
          class="tableClass"
          :height="tableData.length > 9 ? 300 : 'auto'"
          v-tableloadmore="loadMoreData"
          :span-method="arraySpanMethod"
          :row-class-name="tableRowClassName"
          @select-all="handleAllSelect"
          @select="handleSelectionChange">
          <el-table-column
            v-if="list.edit"
            type="selection"
            width="35">
          </el-table-column>
          <el-table-column
            v-if="list.edit"
            label="操作"
            width="50"
            align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="operatingClick(scope.$index, $event)">•••</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="物资名称" min-width="300">
            <template slot-scope="scope">
              <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            label="规格">
            <template slot-scope="scope">
              <span>{{scope.row.spec || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            label="货位号">
            <template slot-scope="scope">
              {{scope.row.freightCode || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            label="采购数量"
            align="center"
            width="80"
            v-if="billCode">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                {{scope.row.expectNum}}{{scope.row.packagUnitName}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop label="生产批号" align="center" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                {{scope.row.batchNum}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="系统批号" align="center" width="130" v-if="isBatch && status === 11">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                {{scope.row.sysBatchCode}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop width="100" align="center" label="生产日期">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                {{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop width="100" align="center" label="有效期">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                {{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="入库数量" align="center" width="100">
            <template slot-scope="scope">
              {{scope.row.num}}
              {{scope.row.packagUnitName}}
            </template>
          </el-table-column>
          <el-table-column label="采购单价" align="center" width="110">
            <template slot-scope="scope">
              {{scope.row.price | formatToFinacial(4)}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="90"
            align="center"
            label="入库金额">
            <template slot-scope="scope">
              {{scope.row.showTotalPrice | formatToFinacial(4)}}
            </template>
          </el-table-column>
          <el-table-column label="加成率%" align="center" width="90" v-if="isBatch">
            <template slot-scope="scope">
              {{scope.row.serviceId ? scope.row.bonusRate : '-'}}
            </template>
          </el-table-column>
          <el-table-column label="销售价" align="center" width="110" v-if="isBatch">
            <template slot-scope="scope">
              {{scope.row.serviceId ? scope.row.salePrice : '-'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右键操作按钮列表 -->
    <contextmenu
      v-if="list.edit"
      ref="rightClick"
      :class-name="rowClass"
      :menu="contextList"
      @menu="getMenuList"
      @select="contextSelect">
    </contextmenu>
  </div>
</template>

<script>
import { floatTool, patch, SPEC_CODE, CHINESE_MEDICINE_TYPE, PACKAGE_CODE } from '@/util/common'
import api from '../store/enterapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import remoteSelect from '../../joinstorage/remoteselect'
import contextmenu from '@/workspace/components/contextmenu'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
import entryCheck from './entrycheck.js'
import { chunk } from 'lodash'
const menuList = [
  { id: '1', name: '添加到发票号', disabled: false, methodName: 'addInvoiceList' },
  { id: '2', name: '无发票号', disabled: false, methodName: 'addInvoiceList' },
]
export default {
  mixins: [entryCheck],
  props: {
    parentData: {
      type: Array,
      default: () => ({})
    },
    list: {
      type: Object,
      default: () => ({})
    },
    itemKey: Number,
    description: {
      type: Object,
      default: () => { }
    },
    invoiceNos: {
      type: Array,
      default: () => []
    },
    billCode: {
      type: String
    },
    isBatch: {
      type: Number,
      default: 0
    },
    status: Number
  },
  created () {
    this.rowClass = this.rowClass + this.itemKey
  },
  data () {
    return {
      objId: this.$route.params.id,
      api,
      isRight: false, // 是否是右键弹窗操作
      SPEC_CODE,
      PACKAGE_CODE,
      CHINESE_MEDICINE_TYPE,
      getMaterialInfoApi,
      cachePrice: '',
      fpPrice: 0,
      tableKey: 1,
      switchInow: false,
      rowClass: 'sendContextRow',
      selectLists: [],
      contextList: menuList,
      REMOTE_METHODS_PLACEHOLDER,
      tableDataArr: [],
      tableData: [],
      loadSign: true,
      scrollType: '',
      page: 0,
      pagesize: 20
    }
  },
  directives: {
    tableloadmore: {
      bind: function (el, binding) {
        let selectWrap = el.querySelector('.el-table__body-wrapper')
        selectWrap.addEventListener('scroll', function () {
          let sign = 0
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance <= sign) {
            binding.value('down', () => {
              selectWrap.scrollTop = 30 * 20 - 200
            })
          }
          if (this.scrollTop <= sign) {
            binding.value('up', () => {
              selectWrap.scrollTop = 30 * 20 - 200
            })
          }
        })
      }
    }
  },
  methods: {
    loadMoreData (type, callback) {
      if (this.loadSign) {
        this.loadSign = false
        if (type === 'up') {
          this.page--
          if (this.page < 0) {
            this.page = 0
            this.loadSign = true
            return
          }
          this.tableData = [...this.tableDataArr[this.page], ...this.tableDataArr[this.page + 1]]
        } else {
          this.page++
          if (this.page > this.tableDataArr.length - 1) {
            this.page = this.tableDataArr.length - 1
            this.loadSign = true
            return
          }
          this.tableData = [...this.tableDataArr[this.page - 1], ...this.tableDataArr[this.page]]
        }
        this.$nextTick(() => {
          let ids = []
          this.tableData.forEach((item, index) => {
            if (!ids.includes(item.localMaterialId)) {
              let arr = this.selectLists.filter(child => child.localMaterialId === item.localMaterialId)
              if (arr.length) this.$refs.additem.toggleRowSelection(arr[0], true)
              ids.push(item.localMaterialId)
            }
          })
        })
        this.scrollType = type
        callback && callback()
        setTimeout(() => {
          this.loadSign = true
        }, 50)
      }
    },
    tableRowClassName ({ row, rowIndex }) { // 动态显示背景颜色
      return `sendContextRow${this.itemKey}`
    },
    // 保存发票 检查发票是否存在
    handleSaveInvoice (data) {
      if (data.invoiceNo === '') {
        return this.$messageTips(this, 'warning', '发票号不能为空，请重新输入')
      }
      if (this.invoiceNos.includes(data.invoiceNo)) return this.$messageTips(this, 'warning', '您提交的发票号已经在本入库单中填写过，请检查后重新录入')
      this.list.invoiceStatus = 3
    },
    handleEditInvoice () {
      if (this.status === 11 && this.itemKey === 0 && this.list.invoiceStatus === 1) {
        this.list.edit = 1
        this.contextList = this.contextList.filter(item => ['1', '2'].includes(item.id))
        this.contextList[1].disabled = true
        this.switchInow = true
        this.tableKey++
      } else {
        if (this.list.invoiceStatus === 1 || this.list.invoiceStatus === 2) {
          this.list.invoiceNo = ''
        }
        this.list.invoiceStatus = 0
      }
    },
    deleteListItem () {
      this.$emit('deleteListItem', this.itemKey)
    },
    // table勾选框选中数据
    handleSelectionChange (selection, row) {
      selection = selection.filter(item => !!item)
      if (!this.selectLists.find(child => row.localMaterialId === child.localMaterialId)) {
        if (selection.find(item => row.localMaterialId === item.localMaterialId)) {
          this.selectLists.push(row)
        } else {
          this.selectLists = this.selectLists.filter(child => child.localMaterialId !== row.localMaterialId)
        }
      } else {
        if (!selection.find(item => row.localMaterialId === item.localMaterialId)) {
          this.selectLists = this.selectLists.filter(child => child.localMaterialId !== row.localMaterialId)
        }
      }
    },
    handleAllSelect (selection) {
      this.selectLists = selection.length ? this.list.item : []
    },
    // 点击table某一行前面的操作按钮 弹出操作按钮列表 左键操作菜单
    operatingClick (index, event) {
      this.getMenuList(index)
      this.isRight = false
      this.$refs.rightClick.indexItem = index
      this.$refs.rightClick.style.top = event.y + 1 + 'px'   // 鼠标点击时给div定位Y轴
      this.$refs.rightClick.style.left = event.x + 3 + 'px'  // 鼠标点击时给div定位X轴
      this.$refs.rightClick.style.visibility = 'visible'    // 显示div盒子
    },
    // 右键点击添加到发票号/归为发票未到
    addInvoiceList (data, btn) {
      // 判断是选的多行还是只操作当前行
      let selectData = this.list.item.filter(item => {
        return this.selectLists.length ? this.selectLists.find(check => check.localMaterialId === item.localMaterialId) : item.localMaterialId === data.localMaterialId
      })
      if ((selectData && selectData.length === this.list.item.length) && this.list.invoiceStatus !== 0) {
        this.$emit('deleteListItem', this.itemKey, true, selectData, btn)
        return
      }
      this.$emit('updataInvoice', selectData, btn, this.itemKey)
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      // this.list = JSON.parse(JSON.stringify(this.parentData[this.itemKey]))
      let indexThis = index
      if (this.page > 0 && this.tableData.length > this.pagesize) {
        indexThis = this.page * this.pagesize - this.pagesize + index
      }
      this[item.methodName](this.list.item[indexThis], item)
    },
    getMenuList (index) { // 右键呼出操作菜单
      this.isRight = true
      // 入库完成 补录发票的第0条新增的发票号，需要把右键发票未到放开
      if (this.status === 11 && this.itemKey === 0 && this.list.invoiceNo && this.list.invoiceStatus === 3) {
        let findObj = this.contextList.find(item => item.id === '2' && item.disabled === true)
        if (findObj) findObj.disabled = false
      }
      this.setSelectListsDisabled(['2'], this.list.invoiceStatus === 1)
    },
    setSelectListsDisabled (arr, swit) {
      this.contextList.forEach(item => {
        if (arr.includes(item.id)) item.disabled = swit
      })
    },
    // 合并单元格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let thisCont = row.thisCont
      let thisIndex = row.thisIndex
      let columnIndes = this.list.showBtn ? [5, 6, 7, 8] : [3, 4, 5, 6, 9]
      if (this.status === 11) {
        columnIndes = this.billCode ? [4, 5, 6, 8] : [3, 4, 5, 6]
      }
      if (this.status === 100) {
        columnIndes = this.billCode ? [2, 4, 5, 6, 7] : [3, 4, 5, 6]
      }
      if (!columnIndes.includes(columnIndex) && thisCont >= 2) {
        if (((rowIndex - (thisIndex + thisCont)) % thisCont) === 0) {
          return {
            rowspan: thisCont,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 计算发票总金额
    calcTotalPrice (data, price) {
      let totalPrice = 0
      let ids = []
      for (let i = 0; i < data.length; i++) {
        if (!ids.includes(data[i].localMaterialId) && data[i][price]) {
          totalPrice = floatTool.add(data[i][price] || 0, totalPrice)
          ids.push(data[i].localMaterialId)
        }
      }
      this.fpPrice = !isNaN(totalPrice) ? totalPrice : 0.00
    },
    // 计算单行物资总金额 显示
    rowCountPrice (data) {
      if (!data.localMaterialId) return
      let nums = 0
      let findObj = null
      let indexs = []
      this.list.item.forEach(item => {
        if (item.localMaterialId === data.localMaterialId) {
          if (!findObj) findObj = item
          indexs.push(item)
          if (item.num) nums = nums + parseFloat(item.num)
        }
      })
      this.$set(findObj, 'showTotalPrice', floatTool.multiply(findObj.price, nums))
    },
    ...patch
  },
  components: {
    remoteSelect,
    contextmenu
  },
  watch: {
    'list': {
      handler (v) {
        this.tableDataArr = chunk(v.item, this.pagesize)
        if (this.scrollType === 'up') {
          if (this.page - 1 < 0) {
            this.page = 0
            this.tableData = this.tableDataArr[0]
          } else {
            this.tableData = [...this.tableDataArr[this.page - 1], ...this.tableDataArr[this.page]]
          }
        } else if (this.scrollType === 'down') {
          if (this.page + 1 > this.tableDataArr.length - 1) {
            this.page = this.tableDataArr.length - 1
            this.tableData = [...this.tableDataArr[this.page - 1], ...this.tableDataArr[this.page]]
          } else {
            this.tableData = [...this.tableDataArr[this.page], ...this.tableDataArr[this.page + 1]]
          }
        } else {
          this.tableData = this.tableDataArr[0]
        }
        this.calcTotalPrice(v.item, 'showTotalPrice')
        this.$emit('updataList', v, this.itemKey)
      },
      deep: true,
      immediate: true
    }
  },
}
</script>

<style scoped lang="scss">
.tablenumber{
  width: 80px;
  /deep/ .el-input__inner{
    padding: 0;
  }
}
.tableClass {
  /deep/ td{
    // vertical-align: top;
  }
  /deep/ .noCheck_color {
    background-color: #FFF5B7;
  }
  /deep/ .check_color {
    background-color: #E2ECF9;
  }
  /deep/ .el-table__body /deep/ tr:hover>td{
    background-color: transparent !important;
  }
}
</style>
