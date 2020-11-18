/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-21 18:51:36
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-09-07 11:28:36
 */
/**
 * 互联网商城
*/
import Public from '../mixins/public'
import OrderList from '../components/order.list'
import OrderDetail from '../components/order.detail'
import OrderHeader from '../components/order.header'
import Search from '../components/search'
import PostDialog from '../components/post.dialog'
import leftOrderColumns from '../columns/left.order'
import api from '@/warehouse/views/drug/api/internetapi.js'
import list from '@/util/list'
import { get, omit } from 'lodash'
import storage from '@/util/storage'

export default {
  data () {
    return {
      leftOrderColumns,
      api,
      queryObj: { requestSwitch: true },
      isRefund: '', // 发药任务 是否退药中
      searchCode: '', // 搜索框当前查询内容
      getCount: -1, // 请求次数
      leftLoading: false,
      rightLoading: false,
      orderCode: '', // 当前选择订单code
      expressInformationId: '', // 物流信息id
      tableData: [],
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      postData: {}, // 当前订单邮寄信息
      orderHeadObj: {}, // 订单头信息
      orderTableData: [], // 订单明细表格数据
      selectionData: [] // 订单列表选中项
    }
  },
  mixins: [Public, list],
  components: {
    OrderList,
    OrderDetail,
    OrderHeader,
    Search,
    PostDialog,
  },
  created () {
    // 是否执行list方法
    if (!this.noRunListFn) {
      this.list()
    }
  },
  methods: {
    /**
     * 打开发货填写物流窗口
     * * 打开邮寄信息弹框
     * @param {Boolean} isBatch 是否批量操作
     * @param {Boolean} isCheckRules 是否检验输入项
    */
    openPostDialog (isBatch, isCheckRules) {
      this.$refs.post.open(isBatch, isCheckRules)
    },
    closePostDialog () {
      this.$refs.post.close()
    },
    handlerRowClick (row) {
      this.getOrderDetail(this.orderCode = row.orderCode)
    },
    handlerSelectionChange (selection) {
      this.selectionData = selection
    },
    setCurrentRow (curData) {
      this.$nextTick(_ => {
        let table
        if ((table = get(this.$refs, 'orderList.$refs.tableList.$refs.everTable', ''))) {
          table.setCurrentRow(curData)
        }
      })
    },
    /**
     * 获取订单列表
     * @param {String} orderName 姓名或订单编号
     * @param {Boolean} forceUpdate 强制更新数据
    */
    list (orderName, forceUpdate = false) {
      this.leftLoading = true
      api[this.queryApiName](Object.assign({ orderName, storageRoomId: this.currentStorageRoomId, pagesize: this.pagesize, offset: this.offset }, this.queryParams || {})).then(res => {
        // 累计当前页面请求此处
        this.getCount++
        if (Array.isArray(res) && res.length) {
          this.tableData = res
          this.totalCount = res.totalCount
          const curData = this.tableData.find(item => item.orderCode === this.orderCode) || this.tableData[0]
          this.orderCode = curData.orderCode
          this.setCurrentRow(curData)
          this.getOrderDetail(this.orderCode)
        } else if (forceUpdate) {
          this.tableData = []
          this.totalCount = 0
          this.orderHeadObj = {}
        } else if (this.getCount && !forceUpdate) {
          this.everWarning('暂无匹配的结果')
        }
      }).finally(_ => {
        this.leftLoading = false
      })
    },
    /**
     * 获取订单详情
     * @param {String} orderCode  订单编号
     * @param {Number} pricingModel 定价模式
    */
    getOrderDetail (orderCode) {
      // 初始化当前订单编号
      this.orderCode = orderCode
      this.rightLoading = true
      api.getOrderDetail({ orderCode, pricingModel: this.isBatch }).then(res => {
        if (res) {
          this.orderHeadObj = omit(res, ['orderInformations'])
          this.orderTableData = res.orderInformations
          // 物流单号id
          this.expressInformationId = res.expressInformationId
          // 是否退药中 1：退药中
          this.isRefund = res.isRefund
          const index = this.tableData.findIndex(item => item.orderCode === orderCode)
          if (~index && this.tableData[index].isRefund !== this.isRefund) {
            this.tableData[index].isRefund = this.isRefund
          }
          this.setPostData(res)
        }
      }).finally(_ => {
        this.rightLoading = false
      })
    },
    /**
     * 删除当条订单
    */
    deleteCurrentOrder () {
      let index
      this.tableData.splice(index = this.tableData.findIndex(item => item.orderCode === this.orderCode), 1)
      this.closePostDialog()
      const len = this.tableData.length
      if (index >= len || index === 0) index = -1
      this.orderHeadObj = {}
      if (this.tableData.length) {
        const curData = this.tableData[index + 1]
        this.getOrderDetail(curData.orderCode)
        this.setCurrentRow(curData)
      }
    },
    /**
     * 设置当前订单的邮寄信息
    */
    setPostData (row) {
      // this.postData = row
      const { expressCompanyId, logisticsCode, logisticsName, expressCode } = row
      this.postData = {
        expressCompanyId: expressCompanyId ? expressCompanyId - 0 : '',
        logisticsCode,
        expressCode,
        logisticsName
      }
    },
    /**
     * 发货
    */
    sendOrder (obj) {
      api.singleSend(Object.assign({}, obj, { orderCode: this.orderCode, pricingModel: this.isBatch })).then(res => {
        if (!res) return
        const { msg } = res || {}
        if (!msg) {
          this.everSuccess('发货完成')
          this.deleteCurrentOrder()
        } else {
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            showCancelButton: false
          })
            .then(() => {
              // this.getOrderDetail(this.orderCode)
              // // 取消的订单将不在任务列表展示
              // if (code === 3) {
              //   this.deleteCurrentOrder()
              // }
              this.closePostDialog()
              this.list(this.searchCode, true)
            })
            .catch(action => { })
        }
      }).finally(_ => {
        this.$refs.post && this.$refs.post.resetLoading()
      })
    }
  }
}
