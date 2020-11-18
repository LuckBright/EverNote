<template>
<div>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    :visible.sync="visible">
    <h2 class="no_h2">物资销售价</h2>
    <ever-table 
      ref="everTable"
      :columns="columns"
      :border="true"
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

    <el-footer class="alg_c">
      <!-- 发布价格按钮 -->
      <price-submit-button
        v-if="!isBatchPrice"
        size="small"
        type="primary"
        class="price-submit-btn"
        source="org"
        :modal="false"
        :checkLength="true"
        @submit="priceSubmit"
        sourceModule="warehouse">
      </price-submit-button>
      <!-- 批次定价 -->
      <el-button @click="save" type="primary" class="w_80 ml20" size="small" v-else>保存</el-button>
      <el-button @click="visible = false" class="w_80 ml20" size="small">关闭</el-button>
    </el-footer>
  </el-dialog>
</div>
</template>

<script>
import storage from '@/util/storage'
import priceSubmitButton from '@/manages/components/price.manage/price.submit.vue'
import priceInfo from '@/manages/components/price.manage/price.info'
import markInfo from '@/warehouse/page/storages/components/markon.info.js'
import colTd from '@/manages/components/relevance.table/coltd.js'
import { floatTool } from '@/util/common'
import { priceChang } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  props: {
    rowData: {
      type: Object,
      default: () => ({ })
    },
    isBatchPrice: { // 是否批次定价
      type: Boolean | Number,
      default: false,
    },
  },
  mixins: [storage],
  data () {
    return {
      tableData: [],
      columns: [],
      copyRowData: {}, // 批次定价中复制的一份 rowData 数据
      priceChangeList: [],
      visible: false,
      floatTool,
      clincId: storage.getStorageByClinic('CLINICID') || '', // 储存的当前机构ID
    }
  },
  watch: {
    rowData: {
      handler (v) {
        this.copyRowData = v
      },
      deep: true
    }
  },
  methods: {
    // 批次定价保存
    save () {
      let row = this.tableData[0]
      let arr = []
      Object.keys(row).forEach(key => {
        if (key !== 'priceList') {
          arr.push({
            price: row[key],
            scene: key
          })
        }
      })
      row.priceList = arr.filter(item => item.scene !== 'bonusRate')
      this.$emit('svaePrice', row)
      this.visible = false
    },
    async open () {
      const { serviceId, markupPercentage, salePrice } = this.rowData
      if (!serviceId) return
      let PriceConfig = await this.getPriceConfig(serviceId)
      this.$nextTick(() => {
        this.columns = [...PriceConfig.columns.map(item => {
          delete item.width
          return item
        })]
        const data = Object.assign(PriceConfig.data, this.isBatchPrice ? { bonusRate: markupPercentage, base: salePrice } : { orgId: serviceId, localMaterialId: this.rowData.localMaterialId })
        this.tableData = [data]
        this.visible = true
      })
    },
    // 组装价格体系列表和列表数据
    async getPriceConfig (serviceId) {
      let columns = []
      let data = {}
      if (this.isBatchPrice) {
        const info = await markInfo.getMarkonConfig()
        columns = [].concat(markInfo.getMarkonColumns.call(this, info.columns))
      } else {
        // 下面是统一定价
        const info = await priceInfo.getPriceConfig({ itemIdList: [serviceId], orgId: this.clincId }, 'item')
        columns = [].concat(priceInfo.getPriceColumns.call(this, info.columns, info.data, 'localMaterialId'))
        data = { priceData: info.data[serviceId] }
      }
      return {
        columns,
        data
      }
    },
    // 提交修改价格
    priceSubmit (submit, param) {
      let newObj = [{
        orgId: this.clincId,
        items: []
      }]
      this.priceChangeList.forEach(item => {
        newObj[0].items = newObj[0].items.concat(item.items)
      })
      if (!newObj[0].items.length) return this.everWarning('没有修改任何数据')
      param.data = newObj
      submit(param).then(res => {
        if (res) {
          const { serviceId } = this.rowData
          let pricePromise = new Promise((resolve, reject) => {
            const PriceConfig = this.getPriceConfig(serviceId)
            if (PriceConfig) resolve(PriceConfig)
          })
          pricePromise.then(rev => {
            if (rev) {
              const { price, newPrice } = rev.data.priceData.base
              if (price && newPrice) {
                const data = Object.assign(rev.priceData, { orgId: serviceId, localMaterialId: this.rowData.localMaterialId })
                this.tableData = [data]
                return
              }
              this.$emit('priceSubmitSuccess', price)
            }
          })
          this.$messageTips(this, 'success', '调价发布成功')
          this.priceChangeList = []
        }
      })
    },
    // 加成率发生变化
    markonChange (val, tdKey) {
      const { price } = this.copyRowData
      // 通过加成率反算基础价
      if (tdKey === 'bonusRate') {
        let salePrice = val ? floatTool.multiply(price, (1 + floatTool.divide(val, 100))) : price
        this.$set(this.tableData[0], 'base', priceChang(salePrice, 'base'))
        this.$set(this.tableData[0], 'bonusRate', val)
      } else if (tdKey === 'base') {
        // 加成率 = （基础价 / 采购价 - 1 ）* 100
        let bonusRate = floatTool.multiply(floatTool.subtract(floatTool.divide(val, price), 1), 100)
        this.$set(this.tableData[0], 'bonusRate', priceChang(bonusRate, 'bonusRate'))
        this.$set(this.tableData[0], 'base', val)
      } else {
        this.$set(this.tableData[0], tdKey, val)
      }
    },
    // 输入框价格发生变动
    priceChange (serviceId, data) {
      data.itemId = serviceId
      let priceChangeObj = {}
      this.priceChangeList.forEach(item => {
        item.items.forEach(v => {
          priceChangeObj[v.itemId + '&&' + v.scene] = v
        })
      })
      if (data.originalPrice !== null && +data.originalPrice === data.currentPrice) {
        delete priceChangeObj[data.itemId + '&&' + data.scene]
      } else {
        priceChangeObj[data.itemId + '&&' + data.scene] = data
      }
      let resObj = {}
      Object.keys(priceChangeObj).forEach(key => {
        let keys = key.split('&&')
        let serviceId = keys[0]
        if (resObj[serviceId]) {
          resObj[serviceId].items.push(priceChangeObj[key])
        } else {
          resObj[serviceId] = {
            orgId: this.clincId,
            items: [priceChangeObj[key]]
          }
        }
      })
      this.priceChangeList = Object.values(resObj)
    },
    bindObj (render) {
      return render.bind(this)
    },
  },
  components: {
    priceSubmitButton,
    colTd,
    markInfo
  }
}

</script>
<style scoped lang="less">
.w_80 {
  width: 80px;
}
.no_h2 {
  margin: 0;
}
</style>
