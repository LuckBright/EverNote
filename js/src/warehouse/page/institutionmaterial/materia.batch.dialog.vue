<template>
  <el-dialog
    width="78%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible">
    <h2 class="no_h2">
      <wh-code-to-name
        v-if="rowData.ext"
        :isExt="true"
        :cType="3"
        :patchObj="{list: rowData.ext}">
      </wh-code-to-name>
    </h2>
    <div class="right_button">
      <el-checkbox v-model="splitFlag" @change="queryEvent">只看可用大于0的</el-checkbox>
      <!-- 发布价格按钮 -->
        <price-submit-button
          size="small"
          type="primary"
          class="price-submit-btn mr20"
          source="org"
          :modal="false"
          :checkLength="true"
          @submit="priceSubmit"
          sourceModule="warehouse">
        </price-submit-button>
    </div>

      <ever-table 
        ref="everTable"
        :columns="columns"
        :border="true"
        :max-height="350"
        :table-class="'no-hover'"
        class="flex_column_full_hidden"
        :tableKey="'localMaterialId'"
        :data="tableData">
         <!-- 价格管理 -->
        <template v-for="item in columns">
          <el-table-column
            :key="item.prop"
            :slot="item.prop"
            v-if="item.display"
            :label="item.label"
            :width="item.width"
            :prop="item.prop">
            <template slot="header" slot-scope="scope">
              {{item.label}}
            </template>
            <template slot-scope="scope">
              <col-td :row="scope.row" :render="bindObj(item.render)" :td-key="item.prop" :td-key-name="item.label"></col-td>
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <!-- 分页 -->
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current="current"
        :totalCount="totalCount"
      ></ever-pagination>
  </el-dialog>
</template>

<script>
import markInfo from '@/warehouse/page/storages/components/markon.info.js'
import colTd from '@/manages/components/relevance.table/coltd.js'
import api from '@/warehouse/page/institutionmaterial/store/materiallistapi.js'
import priceApi from '@/manages/api/price.js'
import { priceChang, formula } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'
import list from '@/util/list'

export default {
  mixins: [list],
  data () {
    return {
      visible: false,
      splitFlag: true,
      orgId: '',
      tableData: [],
      rowData: {},
      columns: [],
      priceChangeList: [],
      leftColumns: [
        {
          prop: 'inDate',
          width: 170,
          label: '入库时间',
          align: 'center'
        },
        {
          prop: 'code',
          width: 160,
          align: 'center',
          label: '采购入库单号'
        },
        {
          prop: 'batchNum',
          width: 120,
          align: 'center',
          label: '生产批号'
        },
        {
          prop: 'sysBatchCode',
          width: 140,
          align: 'center',
          label: '系统批号'
        },
        {
          prop: 'produceDate',
          width: 110,
          align: 'center',
          label: '生产日期',
          formatter: ({ value }) => {
            if (value) {
              return this.$filters.formatDateByExp(value, 'YYYY-MM-DD')
            } else {
              return '-'
            }
          }
        },
        {
          prop: 'validityDate',
          width: 110,
          align: 'center',
          label: '有效期',
          formatter: ({ value }) => {
            if (value) {
              return this.$filters.formatDateByExp(value, 'YYYY-MM-DD')
            } else {
              return '-'
            }
          },
        },
        {
          prop: 'inNum',
          width: 100,
          align: 'center',
          label: '入库数量'
        },
        {
          prop: 'stockNum',
          width: 100,
          align: 'center',
          label: '可用数量'
        },
        {
          prop: 'purchasePrice',
          width: 110,
          align: 'center',
          label: '采购单价'
        }
      ]
    }
  },
  components: {
    priceSubmitButton: () => import('@/manages/components/price.manage/price.submit.vue'),
    colTd
  },
  watch: {
    visible (val) {
      if (!val) this.priceChangeList = []
    }
  },
  methods: {
    /**
     * @param {Object} row 当前条数据
     * @param {Array} columns 需要拼接的价格体系的列
     */
    async open (row, columns, orgId) {
      this.rowData = row
      let rigthColumns = []
      this.orgId = orgId
      this.splitFlag = true
      await this.getTableData(row, orgId)
      const info = await markInfo.getMarkonConfig(columns, true)
      rigthColumns = [].concat(markInfo.getMarkonColumns.call(this, info.columns))
      rigthColumns.splice(1, 0, {
        prop: 'ceilingPrice',
        label: '最高限价',
        width: 110,
        align: 'center'
      })
      // // 把基础价摆放在最高限价后面
      // let baseIndex = rigthColumns.findIndex(key => key.prop === 'base')
      // if (baseIndex > -1) {
      //   let base = rigthColumns.splice(baseIndex, 1)
      //   rigthColumns.splice(2, 0, [...base])
      // }
      this.columns = [...this.leftColumns, ...rigthColumns]
      this.visible = true
    },
    // 合并左右两边表格数据
    async getTableData ({ id, serviceId }, orgId) {
      let params = {
        materialSkuId: id,
        offset: this.offset,
        pagesize: this.pagesize,
        page: this.current,
        ifMoreThanZero: Number(this.splitFlag)
      }
      const res = await api.getLeftSkuInfo(params)
      const sysBatchCodeList = res.filter(key => key.sysBatchCode).map(item => {
        if (item.sysBatchCode) return item.sysBatchCode
      })
      let rightData = sysBatchCodeList.length ? await priceApi.getOrgBatchPrice({ itemIdList: [serviceId], orgId, sysBatchCodeList }) : []
      const itemData = res.map((left, index) => {
        let codeList = rightData.filter(right => right.sysBatchCode === left.sysBatchCode)
        if (codeList.length) {
          // 组装医保数据
          let obj = {}
          for (let bacth in codeList) {
            obj[codeList[bacth].scene] = codeList[bacth]
          }
          left.priceData = obj
          // 实时更新数据上的采购单价
          let baseData = codeList.find(base => base.scene === 'base')
          if (baseData) {
            left.purchasePrice = baseData.purchasePrice
            // 获取数据的时候计算每一条明细的加成率
            let bonusRate = formula('base', baseData.purchasePrice, baseData.price)
            left.bonusRate = priceChang(bonusRate, 'bonusRate')
          }
        } else {
          left.bonusRate = 0
        }
        // 给每条数据增加一个唯一下标
        left.index = index
        return left
      })
      this.tableData = itemData
      this.totalCount = res['totalCount']
    },
    // 加成率发生变化
    markonChange (val, tdKey, row, originalPrice, label) {
      const { purchasePrice } = row
      const originalRow = JSON.parse(JSON.stringify(row))
      if (tdKey === 'bonusRate') {
        let salePrice = formula(tdKey, purchasePrice, val)
        this.$set(row, 'bonusRate', val)
        this.setRowPriceData(row, 'base', priceChang(salePrice, 'base'))
      } else if (tdKey === 'base') {
        let bonusRate = formula(tdKey, purchasePrice, val)
        this.setRowPriceData(row, tdKey, val)
        row.bonusRate = priceChang(bonusRate, 'bonusRate')
      } else {
        this.setRowPriceData(row, tdKey, val)
      }
      const newOriginalPrice = tdKey === 'bonusRate' ? originalRow.priceData ? originalRow.priceData.price : 0 : originalPrice
      this.setSubmitItem(row, newOriginalPrice, tdKey, label)
    },
    setRowPriceData (row, tdKey, val) {
      if (!row.priceData) {
        row.priceData = Object.create(null)
        row.priceData[tdKey] = { price: val }
      } else {
        if (row.priceData[tdKey]) {
          row.priceData[tdKey].price = val
        } else {
          row.priceData[tdKey] = { price: val }
        }
      }
    },
    // 组装发布价格 itemList
    setSubmitItem (row, originalPrice, tdKey, label) {
      const newTdKey = tdKey === 'bonusRate' ? 'base' : tdKey
      const newLabel = tdKey === 'bonusRate' ? '基础价' : label
      let copyRow = JSON.parse(JSON.stringify(row))
      const { priceData, sysBatchId, batchNum, sysBatchCode, purchasePrice, code, inDate, produceDate, validityDate, itemId } = copyRow
      const item = {
        sysBatchId,
        batchNum,
        sysBatchCode,
        purchasePrice,
        inStockCode: code,
        inDate,
        produceDate,
        validityDate,
        currentPrice: priceData[newTdKey].price,
        scene: newTdKey,
        itemId,
        sceneName: newLabel,
        originalPrice
      }
      // 如果找到相同的就覆盖
      let index = this.priceChangeList.findIndex(key => key.sysBatchCode === sysBatchCode && key.scene === tdKey)
      if (~index) {
        this.priceChangeList[index] = item
      } else {
        this.priceChangeList.push(item)
      }
    },
    // 发布价格
    priceSubmit (submit, param) {
      if (!this.priceChangeList.length) return this.$messageTips(this, 'success', '未修改任何价格')
      let newObj = [{
        orgId: this.orgId,
        items: this.priceChangeList
      }]
      param.data = newObj
      submit(param).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '调价发布成功')
          this.priceChangeList = []
          // 调价发布成功重新查询物资列表
          this.$parent.publishSuccess()
          this.getTableData(this.rowData, this.orgId)
        }
      })
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.getTableData(this.rowData, this.orgId)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.getTableData(this.rowData, this.orgId)
    },
    queryEvent (val) {
      this.splitFlag = val
      this.getTableData(this.rowData, this.orgId)
    },
    bindObj (render) {
      return render.bind(this)
    },
  }
}

</script>
<style scoped lang="less">
.no_h2 {
  margin: 0;
}
.right_button {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
</style>
