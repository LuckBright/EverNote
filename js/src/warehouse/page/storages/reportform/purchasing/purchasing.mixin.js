import { debounce } from '@/util/common'
import storageroomapi from '@/warehouse/store/storageroomapi.js'

export default {
  data () {
    return {
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      current: Number(this.$route.query.page) || 1
    }
  },
  methods: {
    query: debounce(function () {
      this.list()
    }),
    handlerQuery () { // 查询
      this.current = 1
      this.offset = 0
      this.query()
    },
    handlerReset () { // 重置
      this._info()
      this.query()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.query()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.query()
    },
    async list () {
      // 加个锁 第一次进入报表 list 比 watch 的走得早 手动查询一次配置
      this.loading = true
      let printCode = null
      if (this.once) {
        await storageroomapi.selectSystemSettingByClinicId().then(res => {
          if (res && res.id) {
            printCode = res.printCodeSetting || 2
          }
        })
      }
      this.once = false
      if (this.status === '24') {
        this.obj.flag = this.checkObj.flag ? 'money' : 'num'
        this.obj.viewAll = this.checkObj.viewAll ? 'y' : 'n'
      } else {
        this.obj.viewAll = this.checkObj.viewAll ? '' : 'y' // 在库物品&&在库物品批次表复选框条件 因为后端条件反了 所以前端为适配后端 也反着写
      }
      let newObj = Object.assign({}, this.obj)
      if (newObj.materialTypes) newObj.materialTypes = [newObj.materialTypes]
      Object.keys(newObj).forEach(item => {
        if (!newObj[item] || !newObj[item].length) {
          delete newObj[item]
        }
      })
      delete newObj.date
      if (!newObj.viewAll) newObj.viewAll = ''
      let params = Object.assign({ offset: this.offset, pagesize: this.pagesize, page: this.current }, newObj)
      if (!params.clinicIds) params.clinicIds = []
      if (this.isclinc) {
        params.materialSkuId = params.materialID
        delete params.materialID
      }
      params.type = this.type
      if (params.type === 2) {
        params.showTypes && !params.showTypes.some(item => item === '1') && params.showTypes.unshift('1')
      }
      params.pricingModel = Number(this.isBatch)
      if (this.status === '24') params.storageRoomItemze = Number(this.storageRoomItemze)
      if (['11', '15', '13', '19', '17', '22'].includes(this.status)) params.printCodeSetting = printCode || this.printCodeSetting
      const listData = await this.api[this.apiName](params)
      if (listData && listData.data && Array.isArray(listData.data.list)) {
        this.tableData = JSON.parse(JSON.stringify(listData.data.list))
        this.totalCount = listData.data.total
        this.sumsObj = listData.sum ? JSON.parse(JSON.stringify(listData.sum)) : []
        this.getTableHeader(listData)
      } else {
        this.tableData = []
        this.totalCount = 0
      }
      this.getTableWidth()
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    // 列表表头字段处理
    getTableHeader (data) {
      // 进销存报表添加固定列 2020.3.3 周静
      if (this.routeName === 'inventory' && this.status === '24') {
        let fixedIndex = data.header.findIndex(index => { return index.value === '物资名称' })
        data.header.forEach((fixed, index) => { fixed.fixed = fixedIndex >= index })
      }
      // 这块联动改为后端处理
      // else if (this.status === '14') {
      //   let column = ['supplierName', 'businessType', 'happenedAmount', 'happenedMoney']
      //   data.header = data.header.filter(item => {
      //     if (!this.obj.showTypes.length) {
      //       return column.includes(item.key)
      //     } else {
      //       if (this.obj.showTypes.length === 1 && this.obj.showTypes.includes('1')) {
      //         return ['clinicName', ...column].includes(item.key)
      //       } else if (this.obj.showTypes.length === 2 && !this.obj.showTypes.includes('3')) {
      //         return ['clinicName', 'storageRoomName', ...column].includes(item.key)
      //       } else if (this.obj.showTypes.length === 1 && this.obj.showTypes.includes('2')) {
      //         return ['storageRoomName', ...column].includes(item.key)
      //       } else {
      //         return this.type === 2 ? !['clinicName'].includes(item.key) : true
      //       }
      //     }
      //   })
      // }
      this.invoList = JSON.parse(JSON.stringify(data.header))
    },
    getSummaries ({ columns }) { // 表尾合计
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index > 0) {
          // 只有金额才补0和千分符
          let strArr = column.property.split('')
          if (strArr.slice(-5).join('') === 'Money') {
            sums[index] = !this.sumsObj[column.property] ? '' : this.$filters.formatToFinacial(this.sumsObj[column.property], 4)
          } else {
            sums[index] = this.sumsObj[column.property]
          }
        }
      })
      return sums
    }
  },
}
