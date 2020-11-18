<template>
  <div>
    <ever-bread-crumb name="拆零" showTitle="true" @back="backTo" is-custom-back></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <el-row :gutter="20" v-if="!objId && !queryId">
          <el-col :span="2" align="right">
            <span style="line-height: 36px;">选择物资</span>
          </el-col>
          <el-col :span="6">
            <material-select
              ref="remoteselect"
              v-model="materialObj"
              :params="queryParams"
              :needObjFlag="true"
              apiName="getSplitFlag"
              @change="handleSelect">
            </material-select>
          </el-col>
        </el-row>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :span="12"
          v-if="objId"
          class="readform form"
          :nosubmit="true">
            <template slot="outStoukCode">
            <a class="blue cur" @click="$router.push(`/storages/output/outputedit/${obj.outStock.id}?look=${obj.outStock.id}`)">{{obj.outStock ? obj.outStock.code : ''}}</a>
            出库完成
          </template>
          <template slot="inStockCode">
            <a class="blue cur" @click="$router.push(`/storages/entry/entryedit/${obj.inStock.id}?look=${obj.inStock.id}`)">{{obj.inStock ?obj.inStock.code : ''}}</a>
            入库完成
          </template>
        </ever-form2>
        <h3 v-if="objId || queryId" style="paddingLft: 40px;" class="ml20">{{beforeObj.materialName}}</h3>
        <h4>物资明细</h4>
        <div class="content_box mt20 alg_c" v-if="!localMaterialId">
          <p class="nodata">请先选择需要拆零的物资</p>
        </div>
        <div v-else>
          <el-row :gutter="20">
            <el-col :span="15">
              <strong class="mr20 ml15">包装单位：{{beforeObj.unitName}}</strong>
              <strong>包装规格：{{beforeObj.spec}}</strong>
            </el-col>
            <el-col :span="2">
              <div style="visibility: hidden;">占位</div>
            </el-col>
            <el-col :span="4">
              <strong class="mr20">包装单位：{{afterObj.unitName}}</strong>
              <strong>包装规格：{{afterObj.spec}}</strong>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="detail_body">
            <el-col :span="15">
              <ever-table
                :data="tableData"
                border
                :columns="columns"
                :tableDefaultCellValue="tableDefaultCellValue"
                :el-table-attr="elTableAttr">
                <template slot="num" slot-scope="scope">
                  <el-input-number
                    v-if="!objId"
                    style="width: 100px"
                    size="small"
                    v-model="scope.row.num"
                    @blur="changeInput(scope.row, scope.$index)"
                    :controls="false">
                  </el-input-number>
                  <span v-else>{{scope.row.num || '-'}}</span>
                </template>
                <template slot="batchUserNum" slot-scope="scope">
                  {{scope.row.usableNum || tableDefaultCellValue}}
                </template>
              </ever-table>
            </el-col>
            <el-col :span="2" class="icon_r">
              <i class="iconfont icon-zhuyuan-yizhu-tonggu cGray font_30"></i>
            </el-col>
            <el-col :span="4">
              <el-table
                border
                :class="{ 'rightTableEdit': objId, 'rightTable': !objId }"
                style="width: 300px;"
                :data="rightTable">
                <el-table-column label="增加库存" align="center" prop="stockNum"></el-table-column>
                <el-table-column label="加成率" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.localMaterialId" @click="handleOpenPrice(scope.row, scope.$index)" :class="{ 'cur': priceClick && !objId, 'blue': priceClick && !objId }" style="lineHeight: '30px;'">
                      {{scope.row.markupPercentage}}%
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="销售价" align="center" show-overflow-tooltip>
                   <template slot-scope="scope">
                    <span v-if="scope.row.localMaterialId && typeof scope.row.splitSalePrice === 'number'" @click="handleOpenPrice(scope.row, scope.$index)" :class="{ 'cur': priceClick && !objId, 'blue': priceClick && !objId }">
                      {{scope.row.splitSalePrice}}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 15px;">
            <el-col :span="17">
            <!-- 提交 -->
            <el-button
              type="primary"
              size="small"
              v-if="!objId"
              :loading="unRepeatedBtn"
              class="w_100"
              @click="handleSubmit"
            >提交</el-button>
            </el-col>
            <el-col :span="7" v-if="!objId">
              <div class="note">
                注：未拆零过的批次销售价=拆零前物资系统批次采购单价/转化比*（1+拆零后物资加成率）。
              </div>
              <div class="note">
                拆零过的批次，再次拆零时，拆零后物资销售价沿用上次销售价。
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 调价弹窗 -->
    <entry-price-table
      ref="priceDialog"
      :row-data="rowData"
      :is-batch-price="true"
      @svaePrice="svaePriceBtn">
    </entry-price-table>
    <!-- loadinng -->
    <loading-cover :loading="onloadLoading">
      <h2 slot="title">数据加载中</h2>
    </loading-cover>
  </div>
</template>

<script>
import { batchColumns } from '@/warehouse/page/storages/business/store/batch.columns.js'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import splitApi from '@/warehouse/page/storages/store/splitapi.js'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import { formula, priceChang } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'
import ManageConfigMixin from '@/manages/mixin/manageconfigmixin'
import { floatTool, PARSE_SPECIAL_REG, debounce } from '@/util/common'
import storage from '@/util/storage'

let schema = [
  {
    name: 'code',
    label: '拆零单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'updatedBy',
    label: '创建人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createTime',
    label: '创建时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'storageRoom',
    label: '出入库库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outStoukCode',
    label: '出库任务单',
    comp: 'custom',
    span: 6
  },
  {
    name: 'inStockCode',
    label: '入库任务单',
    comp: 'custom',
    span: 6
  },
]

export default {
  mixins: [getstorage, ManageConfigMixin],
  components: {
    entryPriceTable: () => import('@/warehouse/page/storages/components/entry.price.table.vue'),
    loadingCover: () => import('@/warehouse/page/components/procurement/loadingcover'), // loading
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      tableData: [],
      rightTable: [],
      localMaterialId: '',
      beforeObj: {},
      afterObj: {},
      schema,
      obj,
      rowData: {},
      materialObj: {},
      objId: this.$route.params.id || '',
      queryId: this.$route.query.localMaterialId || '',
      PARSE_SPECIAL_REG,
      clincId: storage.getStorageByClinic('CLINICID') || '', // 储存的当前机构ID
      tenantId: storage.getStorageByClinic('TENANTID') || '', // 集团机构id
      queryParams: { offset: 0, pagesize: 100, storageRoomId: '' },
      unRepeatedBtn: false,
      back: 0,
      elTableAttr: {
        'empty-text': '无可用批次',
      },
      tableDefaultCellValue,
      onloadLoading: false,
    }
  },
  computed: {
    columns () {
      let batch = batchColumns.filter(col => !['usableNum', 'handle'].includes(col.prop))
      return batch.map(item => {
        if (item.label === '当前库存') item.label = '可用库存'
        return item
      })
    },
    priceClick () {
      // 是否拥有(机构||集团)物资列表权限 && 是否价格集团管控
      return (this.priceManage || !this.priceManage && this.clincId === this.tenantId) &&
      (this.$hasPermission('Auth_menu_manages_material_dictionary_control') ||
      this.$hasPermission('Auth_menu_clinic_basic_materiallists_unifiedpricing') ||
      this.$hasPermission('Auth_menu_clinic_basic_materiallists_unifiedpricings'))
    }
  },
  created () {
    this.queryParams.storageRoomId = this.storageId
    if (this.objId) this.getDetail(this.objId)
    if (this.queryId) {
      this.localMaterialId = this.queryId
      this.getBySpu()
    }
  },
  methods: {
    backTo () {
      if (this.back) {
        this.$router.go(-2)
      } else {
        this.$router.go(-1)
      }
    },
    handleSubmit: debounce(function () {
      let params = {
        status: 111,
        storageRoomId: this.storageId,
        materialType: this.afterObj.classifyId,
        splitNumberItemList: [],
        pricingModel: 1
      }
      let itemList = []
      this.tableData.forEach((item, index) => {
        const { num, inDate, batchNum, sysBatchCode, price, salePrice, usableNum, produceDate, validityDate } = item
        const rightItem = this.rightTable[index]
        if (num) {
          itemList.push({
            materialType: this.afterObj.classifyId,
            storageRoomId: this.storageId,
            localMaterialIdBefore: this.beforeObj.localMaterialId,
            localMaterialIdAfter: this.afterObj.localMaterialId,
            numBefore: num,
            numAfter: rightItem.stockNum,
            batchNum,
            inDate,
            purchasePrice: price,
            salePrice,
            sysBatchCode,
            usableNum,
            splitSalePrice: rightItem.splitSalePrice,
            priceList: rightItem.priceList ? rightItem.priceList : [{ scene: 'base', price: rightItem.splitSalePrice }],
            sysBatchCodeSplit: rightItem.sysBatchCodeSplit,
            sysBatchId: rightItem.sysBatchId,
            produceDate: produceDate,
            validityDate: validityDate,
            unitIdBefore: this.beforeObj.unitId || '',
            unitIdAfter: this.afterObj.unitId || ''
          })
        }
      })
      params.splitNumberItemList = itemList
      if (!itemList.length) return this.everWarning('请填写拆零数量')
      this.unRepeatedBtn = true
      splitApi.create(params).then(res => {
        if (res && res.flag) {
          this.$router.push('/storages/business/splitabatchinfo/' + res.splitNumber.id)
          this.objId = res.splitNumber.id
          this.getDetail(res.splitNumber.id)
          this.back = 2
          return this.everSuccess('提交拆零单成功')
        }
      })
      setTimeout(() => {
        this.unRepeatedBtn = false
      }, 300)
    }),
    // 更新对应批次的加成率和销售价
    svaePriceBtn (row) {
      const index = this.rowData.index
      const { base, bonusRate, priceList } = row
      this.$set(this.rightTable[index], 'markupPercentage', bonusRate)
      this.$set(this.rightTable[index], 'splitSalePrice', Number(base))
      this.$set(this.rightTable[index], 'priceList', priceList)
    },
    changeInput (row, index) {
      let { num, usableNum } = row
      let { stockNum } = this.rightTable[index]
      if (num > usableNum) {
        this.$set(this.rightTable[index], 'stockNum', '')
        this.$set(this.tableData[index], 'num', undefined)
        return this.everWarning('拆零数量不允许大于可用库存数量，请重新录入')
      }
      if (!PARSE_SPECIAL_REG.test(num)) {
        this.$set(this.rightTable[index], 'stockNum', '')
        this.$set(this.tableData[index], 'num', undefined)
        return this.everWarning('请输入大于0的正整数，请重新录入')
      } else {
        stockNum = floatTool.multiply(num, this.beforeObj.packageToPrepareRatio)
      }
      this.$set(this.rightTable[index], 'stockNum', stockNum)
    },
    handleSelect (data) {
      if (data) {
        const { localMaterialId, isManageAlone } = data
        if (isManageAlone === 1) {
          this.localMaterialId = ''
          this.$refs.remoteselect.select = ''
          this.everWarning('该物资是唯一码管理，不允许拆零')
        }
        this.localMaterialId = localMaterialId
        this.getBySpu()
      } else {
        this.$refs.remoteselect.select = ''
        this.localMaterialId = ''
      }
    },
    handleOpenPrice: debounce(function (row, index) {
      if (row) return
      if (this.priceClick) {
        this.rowData = {}
        this.rowData = JSON.parse(JSON.stringify(row))
        this.rowData.index = index
        this.rowData.salePrice = row.splitSalePrice
        if (!row.price) return
        setTimeout(() => {
          this.$refs.priceDialog.open()
        }, 500)
      }
    }),
    getDetail (id) {
      this.onloadLoading = true
      splitApi.getById(this.objId).then(res => {
        if (res && res.splitNumber.id) {
          const { splitNumber, storageRoomObject, splitNumberItemList, inStock, outStock } = res
          this.obj = Object.assign({}, this.obj, splitNumber)
          this.obj.storageRoom = storageRoomObject.name
          this.localMaterialId = splitNumberItemList[0].beforeObject.localMaterialId
          this.obj.inStock = inStock
          this.obj.outStock = outStock
          this.afterObj = splitNumberItemList[0].afterObject
          this.beforeObj = splitNumberItemList[0].beforeObject
          let right = []
          let left = []
          splitNumberItemList.forEach(item => {
            let { splitSalePrice, numAfter, numBefore, purchasePrice } = item
            // 加成率计算
            const newPrice = this.getNewPrice(purchasePrice, this.beforeObj.packageToPrepareRatio)
            left.push(Object.assign(item, { num: numBefore, price: purchasePrice }))
            right.push({
              stockNum: numAfter,
              splitSalePrice,
              localMaterialId: this.localMaterialId,
              markupPercentage: Number(priceChang(formula('salePrice', newPrice, splitSalePrice), 'bonusRate'))
            })
          })
          this.tableData = left
          this.rightTable = right
        }
      })
      setTimeout(() => {
        this.onloadLoading = false
      })
    },
    getBySpu () {
      let params = {
        localMaterialId: this.localMaterialId,
        materialType: '',
        pricingModel: 1,
        storageRoomId: this.storageId
      }
      splitApi.getBySpu(params).then(res => {
        if (res && res.flag) {
          this.beforeObj = res.beforeObject
          this.afterObj = res.afterObject
          this.obj = res
          this.rightTable = res.stockContainerVoList.map(stock => {
            const { price, localMaterialId, splitSalePrice, salePrice, sysBatchCodeSplit, sysBatchId } = stock
            const newPrice = this.getNewPrice(price, res.beforeObject.packageToPrepareRatio)
            // 加成率的规则：该批次未拆零过则用拆零前的加成率，拆零过则根据基础价计算自己的加成率
            const markupPercentage = splitSalePrice ? formula('salePrice', newPrice, splitSalePrice) : formula('salePrice', price, salePrice) || 0
            // 基础价的规则：有拆零后的基础价则直接展示，没有则根据拆零后采购单价和加成率计算基础价
            const splitSaPrice = splitSalePrice ? splitSalePrice : formula('bonusRate', newPrice, markupPercentage)
            return {
              salePrice,
              stockNum: '',
              markupPercentage: priceChang(markupPercentage, 'bonusRate'),
              localMaterialId,
              serviceId: res.afterObject.serviceId,
              splitSalePrice: Number(priceChang(splitSaPrice, 'salePrice')),
              price: newPrice,
              sysBatchCodeSplit,
              sysBatchId
            }
          })
          this.tableData = res.stockContainerVoList.map(item => {
            item.num = undefined
            return item
          })
        }
      })
    },
    // 拆零后采购单价 = 拆零前采购单价 / 转换比
    getNewPrice (price, transition) {
      // 100 / 12 = 8.3333333333333333 这种情况四舍五入保留到第 4 为小数
      return floatTool.divide(price, transition).toFixed(4)
    }
  }
}

</script>
<style scoped lang="less">
.icon_r {
  display: flex;
  align-items: center;
  justify-content: center;
}
.font_30 {
  font-size: 30px !important;
}
.rightTableEdit /deep/ .el-table__row {
  height: 30px;
}
.rightTable /deep/ .el-table__row {
  height: 37px;
}
.detail_body {
  display: flex;
  border: 1px solid #ccc;
  max-height: 200px;
  margin: 15px !important;
  overflow-y: auto;
}
</style>
