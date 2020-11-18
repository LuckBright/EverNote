<template>
  <div class="set_meal_wrap" v-loading="loading" ref="allheight">
    <template v-if="setMealArr && setMealArr.length">
      <el-tabs v-model="activeName">
        <template v-for="(item, index) in setMealArr">
          <el-tab-pane :name="String(index)" :key="index">
            <template slot="label">
              <template v-if="item.status === '未支付'">
                <el-badge :value="item.status" class="item">{{$t(item.setMealName)}}</el-badge>
              </template>
              <template v-else>{{$t(item.setMealName)}}</template>
            </template>
            <div class="packageInfo">
              <span>购买金额：</span>
              <span class="cRed">￥{{item.amountDis | formatToFinacial}}</span>
              <span>剩余项目金额：</span>
              <span class="cRed">￥{{item.amountValable | formatToFinacial}}</span>
              <span>使用有效期：</span>
              <span>{{item.invalidDate ? $moment(setMealArr[activeName].invalidDate).format('YYYY-MM-DD') : ''}}</span>
            </div>
            <template v-if="item.catalogInfos && item.catalogInfos.length">
              <div>
                <div style="margin-bottom:20px;" class="only" v-if="item.catalogInfos.length>0">
                  <div class="diy-tbody">
                    <span>项目名称</span>
                    <span>数量</span>
                    <span>原价</span>
                    <span>售价</span>
                    <span>可用数量</span>
                  </div>
                  <el-tree :data="item.catalogInfos" node-key="id">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span v-if="data.isgen" style="position:relative;">
                        <p
                          class="type-btn type-btn-1"
                          v-if="data.status=='未支付'"
                          @click="gotoPay(data.orderId)"
                        >未支付</p>
                        <p class="type-btn type-btn-2" v-if="data.status=='未用完'">未用完</p>
                      </span>
                      <span class="diy-tr">{{ data.count}}</span>
                      <span class="diy-tr">{{ data.amount | formatToFinacial}}</span>
                      <span class="diy-tr">{{ data.amountDis | formatToFinacial}}</span>
                      <span class="diy-tr">{{ data.countleft}}</span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </template>
    <ever-no-data tipTxt="无套餐" v-else></ever-no-data>
  </div>
</template>
<script>
import api from '@/workspace/store/set.meal.api'
export default {
  props: ['patientId'],
  data () {
    return {
      api,
      activeName: '0',
      setMealArr: [],
      loading: false,
      fullLoading: null,
      activeNames: [],
      packageInfo: {
        amout: 0,
        amoutDis: 0
      }
    }
  },
  created () {
    this.selectOrderByPatient(true)
  },
  methods: {
    // 支付套餐
    gotoPay (orderId) {
      this.openFullScreen()
      // 添加isBacktrack=true为了配合熊珊处理页面跳转后返回按钮问题
      window.open(
        `${this.$ever.kanbanIndex}/kanban/orderdetails/${orderId}?isBacktrack=true`
      )
    },
    // 打开遮罩层
    openFullScreen () {
      this.fullLoading = this.$loading({
        lock: true,
        text: '套餐支付中，点击刷新状态。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(55, 55, 55, 0.7)'
      })
      const _this = this
      if (document.onclick) {
        document.onclick = null
      }
      setTimeout(() => {
        document.onclick = _this.selectOrderByPatient
      }, 500)
    },
    async selectOrderByPatient (isLocal, isQuery) {
      if (this.fullLoading) {
        this.fullLoading.close()
        this.$emit('afterPaid')
        document.onclick = null
      }
      this.loading = true
      this.activeNames = []
      if (this.patientId) {
        let params = {
          patientId: this.patientId,
          deptCode: this.$route.query.dptId
        }
        const res = await api.selectOrderByPatient(params)
        if (res && res.data && res.data.length) {
          res.data.forEach(item => {
            item.catalogInfos = []
          })
          this.setMealArr = res.data
          this.getOrderBySetMealId(isLocal, isQuery)
        } else {
          this.setMealArr = []
          this.loading = false
        }
      }
    },
    async getOrderBySetMealId (isLocal, isQuery) {
      if (!this.setMealArr[this.activeName].catalogInfos.length) {
        this.loading = true
      }
      let params = {
        itemName: '',
        setMeal: this.setMealArr && this.setMealArr[this.activeName] ? this.setMealArr[this.activeName].setMealId : '',
        orderMealId: this.setMealArr && this.setMealArr[this.activeName] ? this.setMealArr[this.activeName].orderId : ''
      }
      const res = await api.getOrderBySetMealId(params)
      this.loading = false
      if (res && res.data && res.data.length) {
        // 获取上面显示的套餐信息
        let packageInfo = {}
        packageInfo.amount = 0  // 原价
        packageInfo.amountDis = 0 // 折扣价
        packageInfo.count = 0  // 总数量
        packageInfo.countleft = 0  // 可用数量
        // 套餐的数量及
        res.data.forEach(item => {
          packageInfo.amount += item.amount
          packageInfo.amountDis += item.amountDis
          packageInfo.count += item.count
          // packageInfo.countleft += (item.count - item.itemRefundNum - item.itemNumFinished)
        })
        Object.assign(this.setMealArr[this.activeName], packageInfo)
        // 处理el-tree中显示信息
        this.handleTreeData(res.data)
      }
    },
    handleTreeData (data) { // 初始化树形数据
      // 套餐本身的名字
      let _data = {}
      Object.assign(_data, this.setMealArr[this.activeName])
      _data.label = this.setMealArr[this.activeName].setMealName
      _data.isgen = true
      _data.countleft = 0
      let amountValable = 0 // 套餐剩余项目金额
      data.forEach(item => {
        // 目录层
        if (item.serviceInfos) {
          item.children = item.serviceInfos
          item.label = item.name
          item.countleft = 0  // 目录层可用数量
          // 套餐层
          item.children.forEach(val => {
            val.children = []
            val.label = val.name
            val.countleft = val.count - val.itemRefundNum - val.itemNumFinished
            item.countleft += val.countleft
            amountValable += val.countleft * val.amountDis // 从医嘱项收集套餐可用金额
          })
          _data.countleft += item.countleft  // 套餐层可用数量
        }
      })
      _data.children = data
      this.setMealArr[this.activeName].amountValable = amountValable
      this.setMealArr[this.activeName].catalogInfos = [_data]
    }
  },
  watch: {
    patientId () {
      this.selectOrderByPatient(true)
    },
    activeName () {
      this.selectArr = []
      this.activeNames = []
      this.getOrderBySetMealId(true)
    }
  }
}
</script>
<style lang="less" scoped>
.set_meal_wrap {
  overflow: scroll;
  .packageInfo {
    margin-bottom: 15px;
  }
  /deep/ .el-tabs__nav-wrap {
    /deep/ .el-tabs__nav {
      padding-top: 10px;
    }
  }
  /deep/ .el-tree-node__content {
    height: 40px;
    border-bottom: 1px solid #eee;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  .custom-tree-node {
    margin: 15px 0;
    position: relative;
    width: 100%;
    font-size: 16px;
  }
  .diy-tbody {
    height: 50px;
    line-height: 50px;
    background-color: #eeeeee;
    span {
      display: block;
      float: right;
      width: 100px;
    }
    :first-child {
      float: left;
      padding-left: 10px;
    }
  }
}
.diy-tr {
  width: 100px;
  height: 10px;
  float: right;
  display: block;
}
.type-btn {
  margin: 0 0 0 10px;
  display: inline-block;
  font-size: 12px;
  border-radius: 2px;
  width: 45px;
  text-align: center;
  height: 25px;
  line-height: 25px;
}
.type-btn-1 {
  border: 1px solid #ee4433;
  color: #ee4433;
}
.type-btn-2 {
  border: 1px solid #ff9c00;
  color: #ff9c00;
}
.custom-tree-node {
  font-size: 14px !important;
}
</style>
<style scoped>
@media screen and (max-width: 1599px) {
  .set_meal_wrap {
    max-height: 510px !important;
  }
}
@media screen and (min-width: 1600px) {
  .set_meal_wrap {
    max-height: 600px !important;
  }
}
.set_meal_wrap /deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2),
.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
  padding-left: 0;
}
.set_meal_wrap /deep/ .el-tabs--top .el-tabs__item.is-top:last-child,
.el-tabs--top .el-tabs__item.is-bottom:last-child,
.el-tabs--bottom .el-tabs__item.is-top:last-child,
.el-tabs--bottom .el-tabs__item.is-bottom:last-child {
  padding-right: 0;
}
.set_meal_wrap /deep/ .el-tabs__item {
  padding: 0 20px;
}
</style>
