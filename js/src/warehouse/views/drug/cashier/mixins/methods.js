/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-21 18:51:59
 * @Last Modified by:   xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-21 18:51:59
 */
/**
 * 超市收银
*/
import Public from '@/warehouse/views/drug/internetmall/mixins/public'
import OrderList from '@/warehouse/views/drug/internetmall/components/order.list'
import OrderDetail from '@/warehouse/views/drug/internetmall/components/order.detail'
import OrderHeader from '@/warehouse/views/drug/internetmall/components/order.header'
import Search from '@/warehouse/views/drug/internetmall/components/search'
import leftColumns from '../columns/left.columns'
import list from '@/util/list'
import { get, omit } from 'lodash'
import { debounce } from '@/util/common'
import api from '@/warehouse/views/drug/api/cashierapi.js'
export default {
  mixins: [Public, list],
  data () {
    return {
      leftColumns,
      api,
      orderTableData: [],
      orderHeadObj: {},
      loadingRight: false,
    }
  },
  components: {
    OrderList,
    OrderDetail,
    OrderHeader,
    Search,
  },
  watch: {
    queryObj: {
      handler: debounce(function () {
        this.query(this.queryObj)
      }),
      deep: true
    },
    tableData: {
      handler: debounce(function (v) {
        if (v.length) {
          const curData = v[0]
          this.orderCode = curData[this.detaialApiName === 'getTaskItem' ? 'sourceCode' : 'code']
          this.$nextTick(_ => {
            let table
            if ((table = get(this.$refs, 'orderList.$refs.tableList.$refs.everTable', ''))) {
              table.setCurrentRow(curData)
            }
            // this.$refs.orderList.$refs.tableList.$refs.everTable.setCurrentRow(curData)
          })
          this.getTaskItem(this.orderCode)
        } else {
          this.orderHeadObj = {}
        }
      }),
      deep: true
    }
  },
  methods: {
    handlerRowClick (row) {
      this.getTaskItem(row[this.detaialApiName === 'getTaskItem' ? 'sourceCode' : 'code'])
    },
    getTaskItem (code) {
      this.loadingRight = true
      api[this.detaialApiName](code).then(res => {
        if (res) {
          this.orderHeadObj = omit(res, ['itemList'])
          this.orderTableData = res.itemList
        }
      }).finally(_ => {
        this.loadingRight = false
      })
    },
    reset () {
      this.queryObj = Object.assign({}, this.initQueryObj)
    }
  }
}
