<template>
  <div>
    <el-table 
      border
      :span-method="arraySpanMethod"
      @row-dblclick="handlerDbClick"
      :data="hanlderItems"
      empty-text="请先填写基础信息">
      <el-table-column label="物资名称" align="center">
        <template slot-scope="scope">
          <material-select
            v-if="scope.row.add && scope.$index === tableData.length - 1"
            ref="remoteselect"
            :params="queryParams"
            :needObjFlag="true"
            @change="handleSelect">
          </material-select>
          <span v-else class="fl">{{scope.row.materialName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center" width="100">
        <template slot-scope="{ row: { spec } }">
          {{spec || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="生产批号" align="center" width="120">
        <template slot-scope="{ row: { batchNum } }">
          {{batchNum || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="系统批号" align="center" width="130">
        <template slot-scope="{ row: { sysBatchCode } }">
          {{sysBatchCode || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="生产日期" align="center" width="110">
        <template slot-scope="{ row: { produceDate } }">
          <span v-if="produceDate">
            {{produceDate | formatDateByExp('YYYY-MM-DD')}}
          </span>
          <span v-else>{{tableDefaultCellValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center" width="110">
        <template slot-scope="{ row: { validityDate } }">
          <span v-if="validityDate">
            {{validityDate | formatDateByExp('YYYY-MM-DD')}}
          </span>
          <span v-else>{{tableDefaultCellValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单价" align="center" width="100">
        <template slot-scope="{ row: { price } }">
          {{price || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="销售价" align="center" width="100">
        <template slot-scope="{ row: { salePrice } }">
          {{salePrice || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="批次可用库存" align="center" width="130">
        <template slot-scope="{ row: { usableNum } }">
          {{usableNum || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column :label="numName + '数量'" align="center" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.sysBatchCode">
            <div class="fl">
              <el-input
                :class="{border_red: scope.row.red}"
                :placeholder="numName + '数量'"
                style="width: 100px"
                v-model="scope.row.num"
                type="number"
                @blur="handleCheckNum(scope.row)"
                size="small"
              ></el-input>
              {{scope.row.packagUnitName}}
            </div>
          </span>
          <span v-else>{{tableDefaultCellValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <i
            class="iconfont icon-bingli-shanchu red"
            @click="handlerDelter(scope.$index)"
            :class="{'mr15': scope.$index === tableData.length - 1}"
            v-if="tableData.length > 1 || (tableData.length === 1 && scope.row.localMaterialId)">
          </i>
          <i
            v-if="scope.$index === tableData.length - 1"
            @click="handlerAdd(scope.row, scope.$index)"
            :class="{ 'blue': !btnGray, 'cGray': btnGray }"
            class="iconfont icon-tianjiabingli">
            </i>
        </template>
      </el-table-column>
    </el-table>
    <div class="hr"></div>
    <!-- 左下批次详情表格 -->
    <div class="batch_table">
      <ever-table 
        :data="rowBatchTable"
        border
        :table-loading="batchLoding"
        :tableDefaultCellValue="tableDefaultCellValue"
        :columns="columns"
        :el-table-attr="elTableAttr"
        @row-dblclick="handlerRowDbClick"
        max-height="150"
        width="100%">
        <template slot="handle" slot-scope="scope">
          <i
            @click="handlerRowAdd(scope.row, scope.$index)"
            class="iconfont icon-tianjiabingli"
            :class="{ 'cGray': !scope.row.sysBatchCode, 'blue': scope.row.sysBatchCode }">
            </i>
        </template>
      </ever-table>
    </div>
  </div>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import { batchColumns } from '@/warehouse/page/storages/business/store/batch.columns.js'
import { DECIMAL_FOUR } from '@/warehouse/util/reg.js'
import { checkNonNegativeInteger, CHINESE_MEDICINE_TYPE } from '@/util/common'
import { hanlderItems, btnGray, arraySpanMethod } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'
import api from '@/warehouse/page/storages/store/givebackapi.js'

export default {
  data () {
    return {
      tableDefaultCellValue,
      batchLoding: false,
      flag: false,
      remoteRow: {},
      tableData: [],
      elTableAttr: {
        'empty-text': '',
      },
      rowBatchTable: []
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([ ])
    },
    queryParams: {
      type: Object,
      default: () => ({ })
    },
    numName: String
  },
  computed: {
    columns () {
      return batchColumns.filter(col => !col.spilt)
    },
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      return hanlderItems(this.tableData)
    },
    btnGray () {
      return btnGray(this.tableData, true)
    }
  },
  methods: {
    async handleSelect (v) {
      if (v) {
        const { localMaterialId } = v
        if (v && this.tableData.some(item => item.localMaterialId === localMaterialId)) {
          this.$nextTick(_ => {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          })
          return this.everWarning('当前物资已经存在列表中')
        }
        let metaerObj = Object.assign({}, v, { num: '' })
        metaerObj.usableNum = ''
        await this.getBatchList(v)
        if (this.flag) this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      } else {
        this.rowBatchTable = []
        this.remoteRow = {}
      }
    },
    resetTable () {
      this.rowBatchTable = []
    },
    handlerDelter (index) {
      if (this.tableData.length === 1) {
        this.tableData = [{ add: true }]
        this.rowBatchTable = []
        this.$nextTick(_ => {
          if (this.$refs.remoteselect) {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          }
        })
      } else {
        this.tableData.splice(index, 1)
        if (this.tableData[this.tableData.length - 1].localMaterialId) {
          this.tableData[this.tableData.length - 1].add = false
        }
      }
    },
    handlerAdd (row) {
      if (this.btnGray) return
      const { localMaterialId, num } = row
      if (!localMaterialId) return this.everWarning('请选择物资再点击添加')
      if (num <= 0 || num === '') return this.everWarning(`请填写${this.numName}数量后再添加`)
      this.$set(row, 'add', false)
      this.tableData.push({ add: true })
      this.$nextTick(() => {
        setTimeout(_ => {
          if (this.$refs.remoteselect && this.$refs.remoteselect.$el.querySelectorAll('input')) {
            this.$refs.remoteselect.$el.querySelectorAll('input')[0].focus()
          }
        }, 100)
      })
    },
    async getBatchList (row) {
      const { localMaterialId } = row
      let params = {
        pricingModel: 1,
        localMaterialId,
        storageRoomId: this.queryParams.storageRoomId
      }
      this.batchLoding = true
      await api.listQuery(params).then(res => {
        if (res && res.batchNumList) {
          this.remoteRow = Object.assign({}, row, res)
          this.rowBatchTable = res.batchNumList
          this.flag = true
        } else {
          this.remoteRow = {}
          this.rowBatchTable = []
          this.flag = false
          return this.everWarning('无可用批次')
        }
      })
      setTimeout(() => {
        this.batchLoding = false
      }, 1000)
    },
    // 物资列表 row 双击重新查询该物资的批次
    handlerDbClick (v) {
      if (this.btnGray) return
      if (this.remoteRow.localMaterialId === v.localMaterialId) return
      this.getBatchList(v)
    },
    handlerRowAdd (row) {
      this.addTable(row)
    },
    handlerRowDbClick ({ row }) {
      this.addTable(row)
    },
    // 添加方法
    addTable (row) {
      // 如果有系统批号相同的就说明已经添加
      const { batchNum, localMaterialId, price, produceDate, sysBatchCode, validityDate, salePrice, inDate, usableNum, sysBatchId, materialSkuId } = row
      // 没有 系统批号不给添加
      if (!sysBatchCode) return
      const { classifyId, materialName, packagUnitName, unitId, spec } = this.remoteRow
      const sameSysBatch = this.tableData.some(sys => sys.sysBatchCode === sysBatchCode)
      if (sameSysBatch) return this.everWarning('列表已有相同系统批号物资')
      // 找到第一次出现的位置
      let firstIndex = this.tableData.findIndex(key => key.localMaterialId === localMaterialId)
      // 找到这个物资一共有几条
      let materLen = this.tableData.filter(key => key.localMaterialId === localMaterialId).length
      let metaerObj = {
        batchNum,
        spec,
        localMaterialId,
        produceDate,
        price,
        sysBatchCode,
        validityDate,
        salePrice,
        classifyId,
        inDate,
        materialName,
        materialSkuId,
        packagUnitName,
        unitId,
        usableNum,
        sysBatchId,
        num: ''
      }
      // 物资 > 1 往该物资的最后一条增加
      if (materLen > 0 && this.tableData[this.tableData.length - 1].sysBatchCode) {
        this.tableData.splice(firstIndex + materLen, 0, metaerObj)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      }
    },
    handleCheckNum (row) {
      if (row.num === '') return this.titleTips(row, `请填写${this.numName}数量，请重新录入`)
      if (Number(row.num) <= 0 && row.num) {
        return this.titleTips(row, `${this.numName}数量不允许为0或负数，请重新录入`)
      }
      const dataType = row.classifyId || ''
      let pieces = !CHINESE_MEDICINE_TYPE.includes(dataType)
      if (pieces && !checkNonNegativeInteger(row.num) && row.num) { // 除“中药饮片”和“中药颗粒”外其他类型的商品，限制出库数量录入小数
        return this.titleTips(row, `该物资${this.numName}数量只允许录入正整数`)
      }
      if (!DECIMAL_FOUR.test(row.num) && !pieces) {
        return this.titleTips(row, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
      }
      if (row.num > row.usableNum) return this.titleTips(row, `${this.numName}数量不允许大于批次可用库存，请重新录入`)
      if (row.red) row.red = false
    },
    // 数量统一提示方法
    titleTips (row, text) {
      row.num = ''
      this.$set(row, 'red', true)
      return this.everWarning(`${text}`)
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      return arraySpanMethod({ row, column, rowIndex, columnIndex }, this.tableData, [0, 1])
    }
  },
  watch: {
    value: {
      handler (v) {
        this.tableData = v
      }
    },
    tableData: {
      handler (v) {
        this.$emit('update:value', v)
      },
      deep: true
    }
  }
}

</script>
<style lang="less" scoped>
.batch_table {
  max-width: 75%;
}
.border_red /deep/ .el-input__inner {
  border-color: red;
}
</style>
