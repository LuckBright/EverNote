<template>
  <div class="set_meal_wrap" v-loading="loading" ref="allheight">
    <template v-if="setMealArr && setMealArr.length">
      <el-tabs v-model="activeName">
        <template v-for="(item, index) in setMealArr">
          <el-tab-pane :name="String(index)">
            <template slot="label">
              <template v-if="item.status === '未支付'">
                <el-badge :value="item.status" class="item">{{$t(item.setMealName)}}</el-badge>
              </template>
              <template v-else>{{$t(item.setMealName)}}</template>
            </template>
            <div :style="style">
              <div class="set_meal_search">
                <ever-form2
                  :schema="querySchema"
                  v-model="queryObj"
                  :inline="true"
                  :is-query="true"
                  @query="selectOrderByPatient(true, true)"
                ></ever-form2>
              </div>
              <template v-if="item.catalogInfos && item.catalogInfos.length">
                <div class="set_meal_list layout_box">
                  <el-collapse v-model="activeNames">
                    <div class="item" v-for="(sitem,sindex) in item.catalogInfos" :key="sindex">
                      <el-collapse-item :name="sindex + 1">
                        <template slot="title">
                          <h3 class="til">{{sitem.name}}</h3>
                        </template>
                        <el-table
                          v-loading.body="tableLoading"
                          ref="shoptable"
                          :data="sitem.serviceInfos || []"
                          :border="false"
                          @select="(val,row) => {handleSelectionChange(row, item)}"
                          @select-all="(list) => selectAllChange(sindex, list)"
                        >
                          <el-table-column type="selection" width="35" :selectable="selectCtrl"></el-table-column>
                          <el-table-column prop="name" label="名称">
                            <template slot-scope="scope">{{scope.row.adviceName}}</template>
                          </el-table-column>
                          <el-table-column prop="count" label="可用" width="80" align="center">
                            <template
                              slot-scope="scope"
                            >{{(scope.row.count - scope.row.itemRefundNum - scope.row.itemNumFinished) | formatCount}}</template>
                          </el-table-column>
                          <el-table-column prop="count" label="总数" width="80" align="center"></el-table-column>
                        </el-table>
                      </el-collapse-item>
                    </div>
                  </el-collapse>
                </div>
              </template>
              <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
            </div>
            <div
              style="text-align:left;border-top: 1px solid #ddd;padding:10px;"
              v-if="item.catalogInfos && item.catalogInfos.length"
            >
              <el-button type="primary" @click="submitData" :disabled="subDisabled">提交</el-button>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </template>
    <ever-no-data tipTxt="无套餐" v-else></ever-no-data>
  </div>
</template>
<script>
import api from '@/workspace/store/set.meal.api'
// import medicalapi from '@/workspace/store/medicalapi'
import { objFind, objRemove } from '@/util/common'
// import storage from '@/util/storage'
export default {
  props: ['patientId', 'setmealType', 'visitType'],
  data () {
    let querySchema = [
      {
        name: 'query',
        label: '',
        props: {
          placeholder: '请输入项目名称'
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      queryObj,
      querySchema,
      activeName: '0',
      setMealArr: [],
      selectArr: [],
      checkList: [],
      subDisabled: false,
      loading: false,
      style: {
        overflowY: 'scroll'
      },
      activeNames: [],
      tableLoading: false
    }
  },
  created () {
    this.selectOrderByPatient(true)
  },
  mounted () {
    // this.$bus.$on('update:setMealCount', _ => {
    //   if (_) {
    //     this.setMealArr.forEach(item => {
    //       item.catalogInfos.forEach(val => {
    //         val.serviceInfos.forEach(m => {
    //           if (m.orderDetailId === _) {
    //             let content = JSON.parse(storage.getSessionStorage(`SET_MEAL_${m.orderDetailId}`))
    //             if (content) {
    //               let itemNumFinished = content.itemNumFinished
    //               m.itemNumFinished = itemNumFinished
    //             } else {
    //               m.itemNumFinished = 0
    //             }
    //           }
    //         })
    //       })
    //     })
    //   } else {
    //     this.getOrderBySetMealId(true)
    //   }
    // })
    this.computerHeight()
  },
  methods: {
    computerHeight () {
      setTimeout(_ => {
        this.style.height = (this.$refs.allheight.clientHeight - 115) + 'px'
      })
    },
    async submitData () {
      if (!this.selectArr || !this.selectArr.length) {
        return this.$messageTips(this, 'warning', '请选择要添加的套餐', '提示')
      }
      this.tableLoading = true
      let data = []
      this.subDisabled = true
      setTimeout(_ => {
        this.$refs.shoptable.forEach(n => {
          n.clearSelection()
          this.selectArr = []
        })
        this.subDisabled = false
        this.tableLoading = false
      }, 1500)
      data = this.selectArr.map(item => {
        return {
          serviceName: item.byName || item.name,
          serviceId: item.serviceId,
          shopSetItemId: item.orderDetailId,
          isSet: item.isSet
        }
      })
      this.$emit('quote', data)
      // let isValid = true
      // const promise = this.selectArr.map(async item => {
      //   let params = {
      //     name: item.name,
      //     pagesize: 30,
      //     scene: this.visitType,
      //     visitNumber: this.$route.query.visitSn || '',
      //     serviceClassificationList: []
      //   }
      //   let res = await medicalapi.searchForBrowserNoCancel(params)
      //   if (res.data && res.data.length) {
      //     let service = {}
      //     res.data.forEach(v => {
      //       if (v.id === item.serviceId) {
      //         service = v
      //         service.shopSetItemId = item.orderDetailId
      //       }
      //     })
      //     if (isValid) {
      //       return service
      //     } else {
      //       return null
      //     }
      //   }
      // })
      // for (const result of promise) {
      //   let obj = await result
      //   if (obj) {
      //     data.push(obj)
      //   }
      // }
      // if (isValid) {
      //   if (data && data.length) {
      //     this.checkList = []
      //     this.$emit('quote', data)
      //     this.$refs.shoptable.forEach(n => {
      //       n.clearSelection()
      //       this.selectArr = []
      //     })
      //     this.selectArr = []
      //     setTimeout(_ => {
      //       // this.selectOrderByPatient(true)
      //       this.subDisabled = false
      //       this.tableLoading = false
      //     }, 1500)
      //   } else {
      //     this.subDisabled = false
      //     return this.$messageTips(this, 'warning', '套餐数据有问题，请联系套餐接口技术支持', '提示')
      //   }
      // } else {
      //   this.$messageTips(this, 'warning', '引用套餐数量已占用', '提示')
      //   this.subDisabled = false
      //   // this.selectOrderByPatient(true)
      // }
    },
    selectCtrl (row, index) {
      if (row.count === row.itemNumFinished || !(row.count - row.itemRefundNum - row.itemNumFinished)) {
        return false
      } else {
        return true
      }
    },
    async selectOrderByPatient (isLocal, isQuery) {
      this.loading = true
      this.selectArr = []
      this.checkList = []
      this.activeNames = []
      if (this.patientId) {
        let parms = this.setmealType ? { setmealType: this.setmealType, patientId: this.patientId } : parms = { patientId: this.patientId }
        if (this.$route.query.dptId) parms.deptCode = this.$route.query.dptId
        const res = await api.selectOrderByPatient(parms)
        if (res && res.data && res.data.length) {
          this.setMealArr = res.data.map(item => {
            item.catalogInfos = []
            return item
          })
          this.getOrderBySetMealId(isLocal, isQuery)
        } else {
          this.setMealArr = []
          this.loading = false
        }
      }
    },
    async getOrderBySetMealId (isLocal, isQuery) {
      if (!this.setMealArr[this.activeName] || !this.setMealArr[this.activeName].setMealId) {
        return false
      }
      if (this.setMealArr[this.activeName] && this.setMealArr[this.activeName].catalogInfos && !this.setMealArr[this.activeName].catalogInfos.length) {
        this.loading = true
      }
      let params = {
        containService: parseInt(this.$ever.getClinicConfig().mealContainService),
        itemName: this.queryObj.query,
        setMeal: this.setMealArr && this.setMealArr[this.activeName] ? this.setMealArr[this.activeName].setMealId : '',
        orderMealId: this.setMealArr && this.setMealArr[this.activeName] ? this.setMealArr[this.activeName].orderId : ''
      }
      const res = await api.getOrderBySetMealId(params)
      this.loading = false
      if (res && res.data && res.data.length) {
        res.data.forEach(item => {
          item.serviceInfos = item.serviceInfos.filter(val => {
            val.isPaid = this.setMealArr[this.activeName].status === '未支付' ? 0 : 1
            return +val.discontinue !== 1
          })
        })
        this.setMealArr[this.activeName].catalogInfos = res.data
        if (isLocal) {
          this.setMealArr[this.activeName].catalogInfos.map(sitem => {
            sitem.serviceInfos.map(mitem => {
              if (mitem.byName) {
                mitem.adviceName = (mitem.byName) + (mitem.name ? '（' + mitem.name + '）  ' : '  ') + (mitem.spec ? ' ' + mitem.spec : '')
              } else {
                mitem.adviceName = (mitem.name ? mitem.name : '  ') + (mitem.spec ? ' ' + mitem.spec : '')
              }
              // let localSessionCount = storage.getSessionStorage(`SET_MEAL_${mitem.orderDetailId}`)
              // if (localSessionCount && localSessionCount !== 'undefined') {
              //   localSessionCount = JSON.parse(localSessionCount)
              //   mitem.itemNumFinished = mitem.itemNumFinished > Number(localSessionCount.itemNumFinished) ? mitem.itemNumFinished : Number(localSessionCount.itemNumFinished)
              //   localSessionCount.itemNumFinished = mitem.itemNumFinished
              //   localSessionCount.count = mitem.count
              //   storage.setSessionStorage(`SET_MEAL_${mitem.orderDetailId}`, JSON.stringify(localSessionCount))
              // }
              return mitem
            })
            return sitem
          })
        }
        if (isQuery) {
          this.setMealArr[this.activeName].catalogInfos.forEach((item, index) => {
            this.activeNames.push(index + 1)
          })
        }
      }
    },
    handleSelectionChange (row, item) {
      this.setSelectArr(row)
    },
    setSelectArr (item, select, list) {
      let isSelect = objFind(this.selectArr, { orderDetailId: item.orderDetailId })
      if (select) {
        if (select === 1) {
          if (!isSelect) this.selectArr.push(item)
        } else if (select === 2) {
          if (isSelect) objRemove(this.selectArr, { orderDetailId: item.orderDetailId })
        }
      } else {
        if (!isSelect) {
          this.selectArr.push(item)
        } else {
          objRemove(this.selectArr, { orderDetailId: item.orderDetailId })
        }
      }
    },
    selectAllChange (index, list) {
      if (list.length) {
        list.forEach(item => {
          let isSelect = objFind(this.selectArr, { orderDetailId: item.orderDetailId })
          if (!isSelect) {
            this.selectArr.push(item)
          }
        })
      } else {
        let mealData = this.setMealArr[this.activeName].catalogInfos[index] || []
        mealData.serviceInfos && mealData.serviceInfos.forEach(item => {
          let isSelect = objFind(this.selectArr, { orderDetailId: item.orderDetailId })
          if (isSelect) {
            objRemove(this.selectArr, { orderDetailId: item.orderDetailId })
          }
        })
      }
    }
  },
  watch: {
    patientId () {
      this.selectOrderByPatient(true)
    },
    activeName () {
      this.computerHeight()
      this.selectArr = []
      this.checkList = []
      this.activeNames = []
      this.queryObj.query = ''
      this.getOrderBySetMealId(true)
    }
  },
  destroyed () {
    // this.$bus.$off('update:setMealCount')
  },
  filters: {
    formatCount (val) {
      if (String(val).includes('.')) {
        return val.toFixed(2)
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
.set_meal_wrap {
  /deep/ .el-tabs__nav-scroll {
    padding-left: 10px;
    /deep/ .el-tabs__nav {
      padding: 10px 35px 0;
    }
    /deep/ .el-tabs__active-bar {
      padding: 0 35px;
    }
  }
  /deep/.el-tabs__header {
    margin: 0 0 5px;
  }
  .set_meal_search {
    padding: 5px 10px;
  }
  .set_meal_list {
    padding-left: 10px;
    padding-right: 20px;
    /deep/ .el-checkbox.is-disabled {
      display: none;
    }
    /deep/ .el-collapse {
      border: none;
      .el-collapse-item__header {
        display: block;
        height: 30px;
        line-height: 30px;
        border: none;
        overflow: hidden;
        .til {
          font-size: 14px;
          display: inline-block;
          margin: 0 0 0 5px;
        }
        .el-collapse-item__arrow {
          float: left;
          line-height: 30px;
          margin: 0;
        }
      }
      .el-collapse-item__wrap {
        border: none;
      }
      /deep/.el-table {
        margin-top: 0;
      }
    }
  }
  .select_all {
    margin-right: 5px;
    /deep/ .el-checkbox__label {
      display: none;
    }
  }
  .red_icon_small {
    margin-left: 10px;
    padding: 2px 5px;
    border-radius: 2px;
    font-size: 12px;
    color: #fff;
    background: #ee4433;
  }
}
</style>
