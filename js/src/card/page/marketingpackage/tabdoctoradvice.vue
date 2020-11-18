<template>
  <el-container>
    <el-header class="mt10" style="height: auto;">
      <h4 class="directory_title f16">医嘱</h4>
      <el-row class="mt15">
        <el-col :span="14" class="f14">
          <el-row>
            <span style="line-height: 36px;" class="fl mr5">项目名称</span>
            <el-col :span="6"><sys-text v-model.trim="medicalOrderName" placeholder="项目名称" :clearable="true" @keyup.enter.native="refreshList"></sys-text></el-col>
            <el-col :span="2"><el-button class="ml10" type="primary" @click="refreshList" size="small">查询</el-button></el-col>
          </el-row>
        </el-col>
        <el-col :span="10" class="f14" v-if="$route.path !== '/card/ordermarketingplanedit'">
          <el-row v-if="!isGroupControl && (cacheData && !cacheData.isClinic)">
            <el-col :span="7"><ever-select v-model="discountMethodId" :options="DISCOUNT_METHOD" :disabled="true"></ever-select></el-col>
            <el-col :span="17" class="clear clearfix">
              <ever-price class="ml5 fl" v-model="discountMethodNum" placeholder="折扣" :to-fixed-len="1" :append="discountMethodId == DISCOUNT_METHOD[0].id ? '%' : '元'" :max="discountMethodId == DISCOUNT_METHOD[0].id ? 100 : 999999" @keyup.enter.native="submitBackCalculation"></ever-price>
              <el-button class="fr" style="margin-top: 2px;" type="primary" @click="submitBackCalculation" size="small" :disabled="tabDAobj.tableData.length ? false : true">反算</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table
        :data="tabDAobj.tableData"
        :border="false"
        :height="tabDAobj.tableData.length ? 'calc(75vh - 280px)' : 'auto'"
        style="width: 100%;"
        v-loading.body="loading">
        <el-table-column prop="catalogName" label="目录" width="90" show-overflow-tooltip>
          <template slot-scope="scope"><span :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.catalogName}}</span></template>
        </el-table-column>
        <el-table-column prop="typeName" label="类型" width="90">
          <template slot-scope="scope"><span :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.typeName}}</span></template>
        </el-table-column>
        <el-table-column prop="setMealDetails" label="服务名称" v-if="$route.query.categoryId === '06'">
          <template slot-scope="scope">
            <el-input
              v-if="!isGroupControl && (cacheData && !cacheData.isClinic)"
              clearable
              v-model="scope.row.serviceContent"
              @change="contentChange(scope.row.serviceContent, scope.row)">
            </el-input>
            <span v-else :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.serviceContent}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceName" label="项目名称" show-overflow-tooltip>
          <template slot-scope="scope"><span :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.serviceName}}</span></template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100">
          <template slot-scope="scope"><span :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.price | formatToFinacial}}</span></template>
        </el-table-column>
        <el-table-column prop="itemNumFinished" label="已用数量" v-if="$route.path !== '/card/marketinprotecorderadd'"></el-table-column>
        <el-table-column prop="isUnlimited" label="不限数量">
          <template slot-scope="scope">
            <el-checkbox :true-label="1" :false-label="0" v-model="scope.row.isUnlimited" @change="tempunlimitedChange(scope.row)"></el-checkbox>
          </template>>
        </el-table-column>
        <el-table-column prop="totalCount" label="数量" width="70">
          <template slot-scope="scope">
            <ever-price v-if="!isGroupControl && (cacheData && !cacheData.isClinic)" :class="scope.row.isServiceValid ? '' : 'cRed'" v-model="scope.row.totalCount" :to-fixed-len="4" @focus-num="handleCacheTotalData({totalCount: scope.row.totalCount})" @blur-num="handleEditTotalCount(scope.row)"></ever-price>
            <span v-else :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.totalCount}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="discountNum" label="折扣" width="90" v-if="!isPlan">
          <template slot-scope="scope">
            <ever-price v-if="!isGroupControl && (cacheData && !cacheData.isClinic)" :class="scope.row.isServiceValid ? '' : 'cRed'" v-model="scope.row.discountNum" :to-fixed-len="4" :max="10" @focus-num="handleCacheTotalData({discount: scope.row.discountNum})" @blur-num="handleEditDiscount(scope.row)" append="折"></ever-price>
            <span v-else :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.discountNum}}折</span>
            </template>
        </el-table-column>
        <el-table-column prop="priceDis" label="折后单价" width="120" v-if="!isPlan">
          <template slot-scope="scope">
            <ever-price v-if="!isGroupControl && (cacheData && !cacheData.isClinic)" :class="scope.row.isServiceValid ? '' : 'cRed'" v-model="scope.row.priceDis" :to-fixed-len="2" @focus-num="cacheDiscountedunitprice({priceDis: scope.row.priceDis})" @blur-num="discountedunitprice(scope.row)"></ever-price>
            <span v-else :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.priceDis}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPriceDis" label="折后金额" width="120" v-if="!isPlan">
          <template slot-scope="scope">
            <ever-price v-if="!isGroupControl && (cacheData && !cacheData.isClinic)" :class="scope.row.isServiceValid ? '' : 'cRed'" v-model="scope.row.totalPriceDis" :to-fixed-len="2" @focus-num="recordOldValue({totalPriceDis: scope.row.totalPriceDis})" @blur-num="updateTotalPriceDis(scope.row)"></ever-price>
            <span v-else :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.totalPriceDis}}</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="顺序" width="60" v-if="!isGroupControl && (cacheData && !cacheData.isClinic) && !isPlan">
          <template slot-scope="scope" class="clearfix">
            <el-col v-show="scope.row.isServiceValid">
              <i
                v-if="(scope.$index != serviceValidDisable.length)"
                class="iconfont icon-shangyi fl"
                @click="handleMoveUp(scope.row, scope.column, scope.$index)"
              ></i>
              <i
                v-if="(scope.$index != (tabDAobj.tableData.length - 1))"
                class="iconfont icon-xiayi fr"
                @click="handleMoveDown(scope.row, scope.column, scope.$index)"
              ></i>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column prop="stop" label="是否停用" width="78">
          <template slot-scope="scope"><span :class="scope.row.isServiceValid ? '' : 'cRed'">{{scope.row.isServiceValid ? '否' : '是'}}</span></template>
        </el-table-column>
        <el-table-column label="操作" width="80" v-if="!isGroupControl && (cacheData && !cacheData.isClinic)">
          <template slot-scope="scope">
            <package-confirm @confirm="itemDelete(scope.row)" msg="确定要删除吗？" :iconType="0"></package-confirm>
          </template>
        </el-table-column>
      </el-table>
      <el-container>
        <el-main>
          <div class="statistics cBlack f14 alg_r" v-if="$route.path !== '/card/ordermarketingplanedit'">
            总金额：<span class="cRed f18 mr15">￥{{tabDAobj.totalPrices | formatToFinacial}}</span>
            折后总金额： <span class="cRed f22">￥{{tabDAobj.totalPriceDiss | formatToFinacial}}</span>
          </div>
          <doctor-advice ref="chargeItem" v-if="!isGroupControl && (cacheData && !cacheData.isClinic)" style="width:100%;" @submitEvent="submitEvent"
            :filterPlaceholder="convertFilterPlaceholder"></doctor-advice>
        </el-main>
      </el-container>
    </el-main>
    <el-footer v-if="$route.meta.isAdd === 1" class="bor_top_1 alg_r pt10 pb10 pr20">
      <el-button type="primary" @click="handleNext">下一步</el-button>
    </el-footer>
  </el-container>
</template>
<script>
import prescription from '@/inpatient/components/medical.orders/issued.orders'
import api from '@/card/store/packagemanagement/api'
// import packageapi from '@/crm/store/packageapi.js'
import gapi from '@/card/store/guaranteeplan/api.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { DISCOUNT_METHOD } from '@/util/common'
import PackageConfirm from '@/card/page/packagemanagement/packageconfirm'
import DoctorAdvice from '@/card/page/marketingpackage/doctoradvice'
export default {
  props: ['isGroupControl', 'packageDetails'],
  data () {
    return {
      loading: false,
      cacheData: {},
      tabDAobj: { // 医嘱对象
        tableData: [],
        totalPrices: 0,
        totalPriceDiss: 0
      },
      adviceType: '',
      singleTotalPriceDiss: 0,  // 通过折扣价格，修改折扣时，记录旧值
      cacheTotalCount: 0,
      cacheDiscount: 0,
      discountedUnitPrice: 0,
      adviceTypeName: {},
      medicalOrderName: '', // 医嘱项目名称
      discountMethodId: '', // 折扣方式
      discountMethodNum: '', // 折扣数
      serviceValidDisable: [], // 停用医嘱数组
      DISCOUNT_METHOD,
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      packageName: '', // 套餐name
      packageDirectoryName: '', // 套餐目录name
      setMealCatalogs: [],
      tableData: []
    }
  },
  components: {
    prescription,
    PackageConfirm,
    DoctorAdvice
  },
  computed: {
    convertFilterPlaceholder() {
      if (this.isPlan) {
        return '请输入检验、检查、治疗、手术、药品、医事服务费、在线问诊等项目名称'
      } else {
        return '请输入检查、检验、治疗、手术' + (this.$route.query.categoryId === '06' ? '、药品、医事服务费、图文问诊' : '')
      }
    },
    isPlan () {
      return this.$route.meta.type === 'plan'
    }
  },
  created () {
    this.refreshList()
    // 获取所有医嘱类型
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(result => {
      let adviceType = []
      for (let item of result) {
        this.adviceTypeName[item.id] = item.name
        adviceType.push(item.id)
      }
      this.adviceType = adviceType.join(',')
    })
  },
  mounted () {
    this.$bus.$on('refresh:AdviceAfterQuote', this.refreshList)
    this.$bus.$on('changeTable', (val) => {
      this.setMealCatalogs = val
    })
  },
  destroyed () {
    this.$bus.$off('changeTable')
  },
  methods: {
    // 不限自定义勾选事件回调
    tempunlimitedChange(val) {
      if (val.isUnlimited) {
        val.totalCount = 9999
      }
      let params = {
        id: val.id,
        totalCount: val.totalCount,
        isUnlimited: val.isUnlimited
      }
      if (this.isPlan) {
        params.orderId = this.$route.query.orderId
      }
      api.createOrupdateMeal(params).then(res => {
        this.$messageTips(this, 'success', '信息更新成功')
        this.refreshList()
      })
    },
    handleCacheTotalData ({totalCount, discount}) {
      totalCount ? this.cacheTotalCount = totalCount : this.cacheTotalCount = 0
      discount ? this.cacheDiscount = discount : this.cacheDiscount = 0
    },
    handleEditTotalCount (val) { // 医嘱数量
      if (val.totalCount !== '' && val.totalCount !== this.cacheTotalCount) {
        if (!val.totalCount && val.totalCount !== 0) {
          this.$messageTips(this, 'warning', '请输入数量')
          val.totalCount = this.cacheTotalCount
          return false
        }
        val.isMust = Number(val.isMust)
        Object.assign(val, { isGroup: this.isGroup })
        api.createOrupdateMeal(val).then(res => {
          this.$messageTips(this, 'success', '信息更新成功')
          this.refreshList()
        })
      }
    },
    handleEditDiscount (val) {
      if (val.discountNum > 10 || val.discountNum < 0) {
        this.$messageTips(this, 'warning', '数值只能在0-10之间')
        val.discountNum = this.cacheDiscount
        let valDiscountNum = (val.discountNum + '').slice(0, 2)
        val.discountNum = valDiscountNum
      }
      if (val.discountNum !== '' && val.discountNum !== this.cacheDiscount) {
        val.isMust = Number(val.isMust)
        val.discount = val.discountNum * 10
        Object.assign(val, { isGroup: this.isGroup })
        api.createOrupdateMeal(val).then(result => {
          this.$messageTips(this, 'success', '信息更新成功')
          this.refreshList()
        })
      }
    },
    recordOldValue ({totalPriceDis}) {
      // 记录折扣总额旧值
      this.singleTotalPriceDiss = totalPriceDis
    },
    updateTotalPriceDis (row) {
      // 如果折扣总额旧值没有发生变化，则不去请求变更
      if (row.totalPriceDis !== '' && Number(this.singleTotalPriceDiss) !== Number(row.totalPriceDis)) {
        if (row.totalPriceDis < 0) {
          row.totalPriceDis = this.singleTotalPriceDiss
          this.$messageTips(this, 'error', '折扣金额不能小于0')
          return this.refreshList()
        }
        let params = {
          id: row.id,
          totalPriceDis: row.totalPriceDis,
          isGroup: this.isGroup
        }
        if (row.price === 0) {
          this.$confirm('该医嘱目前单价为0，您确定要修改折扣金额吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(_ => {
            api.updateTotalPriceDis(params).then(result => {
              this.$messageTips(this, 'success', '折扣反算成功')
              this.refreshList()
            })
          })
        } else {
          api.updateTotalPriceDis(params).then(result => {
            this.$messageTips(this, 'success', '折扣反算成功')
            this.refreshList()
          })
        }
      }
    },
    cacheDiscountedunitprice ({priceDis}) {
      this.discountedUnitPrice = priceDis !== '' ? Number(priceDis) : ''
    },
    discountedunitprice (row) {
      // 如果折扣总额旧值没有发生变化，则不去请求变更
      if (row.priceDis !== '' && Number(this.discountedUnitPrice) !== Number(row.priceDis)) {
        // console.log(this.discountedUnitPrice, row.priceDis)
        if (row.priceDis < 0) {
          row.priceDis = this.discountedUnitPrice
          this.$messageTips(this, 'error', '折扣单价不能小于0')
          return this.refreshList()
        }
        if (row.priceDis !== this.discountedUnitPrice) {
          row.isMust = Number(row.isMust)
          Object.assign(row, { isGroup: this.isGroup })
          api.createOrupdateMeal(row).then(res => {
            this.$messageTips(this, 'success', '信息更新成功')
            this.refreshList()
          })
        }
      }
    },
    contentChange (val, row) {
      row.serviceContent = val
      row.isMust = Number(row.isMust)
      Object.assign(row, { isGroup: this.isGroup })
      api.createOrupdateMeal(row).then(res => {
        this.$messageTips(this, 'success', '信息更新成功')
        this.refreshList()
      })
    },
    async submitEvent (item) {
      // console.log(item)
      this.$refs.chargeItem.onEmpty()
      if (!this.$route.query.directoryId) {
        this.$messageTips(this, 'error', '请先选择一个套餐目录')
        return false
      }
      // 点击确定之后，新增医嘱
      // 为了照顾药品，多条药品分开操作
      let params = {
        isGroup: this.isGroup,
        setMealId: this.$route.query.packageId,
        setMealCatalogId: this.$route.query.directoryId,
        isMust: 0,
        serviceId: item.id,
        serviceCode: item.code,
        price: item.price || 0,
        totalCount: 1,
        totalPrice: item.price || 0,
        discount: 100,
        totalPriceDis: item.price || 0,
        isSet: item.isSet
      }
      if (this.isPlan) {
        params.orderId = this.$route.query.orderId
        params.setMealCatalogOrderNum = this.$route.query.orderNum
        params.setMealCatalogName = this.$route.query.name
        params.serviceContent = item.displayName
      }
      await api.createOrupdateMeal(params).then(result => {
        this.$messageTips(this, 'success', '保存医嘱成功')
      })
      this.refreshList()
    },
    submitBackCalculation () { // 反算
      console.log(DISCOUNT_METHOD)
      if (!this.discountMethodNum && this.discountMethodNum !== 0) return this.$messageTips(this, 'warning', `请输入${this.discountMethodId === DISCOUNT_METHOD[0].id ? DISCOUNT_METHOD[0].name : DISCOUNT_METHOD[1].name}`)
      this.$confirm(`您确定要修改${this.$route.query.directoryId ? this.packageDirectoryName : this.packageName}下所有医嘱项目${this.discountMethodId === DISCOUNT_METHOD[0].id ? DISCOUNT_METHOD[0].name : DISCOUNT_METHOD[1].name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        let params = {
          isGroup: this.isGroup,
          setMealId: this.$route.query.packageId,
          setMealCatalogId: this.$route.query.directoryId || ''
        }
        this.discountMethodId === DISCOUNT_METHOD[0].id ? params.discount = this.discountMethodNum : params.totalPriceDis = this.discountMethodNum
        api.updateMoreTotalPriceDis(params).then(result => {
          if (result) {
            this.$messageTips(this, 'success', '折扣反算成功')
            this.medicalOrderName = ''
            this.refreshList()
          }
        })
      })
    },
    handleNext () {
      if (this.$route.query.categoryId === '06') {
        this.createBatch()
      } else {
        let name = this.isGroup === 1 ? '4' : '5'
        this.$bus.$emit('package-tab', {name: name})
      }
    },
    projDelete (row) {
      let params = { id: row.id, isGroup: this.isGroup }
      api.deleteMealById(params).then(result => {
        this.$messageTips(this, 'success', '删除医嘱项成功')
        this.refreshList()
      })
    },
    itemDelete (row) {
      let params = { id: row.id, isGroup: this.isGroup }
      if (this.$route.meta.type === 'plan') {
        params.orderId = this.$route.query.orderId
      }
      api.deleteMealById(params).then(result => {
        this.$messageTips(this, 'success', '删除医嘱项成功')
        this.refreshList()
      })
    },
    handleMoveUp (row, column, $index) {
      let params = [{
        id: row.id,
        orderNum: row.orderNum,
        isGroup: this.isGroup
      },
      {
        id: this.tabDAobj.tableData[$index - 1].id,
        orderNum: this.tabDAobj.tableData[$index - 1].orderNum,
        isGroup: this.isGroup
      }]
      api.changeOrderNum(params).then(result => {
        this.$messageTips(this, 'success', '顺序调整成功')
        this.refreshList()
      })
    },
    handleMoveDown (row, column, $index) {
      let params = [{
        id: row.id,
        orderNum: row.orderNum,
        isGroup: this.isGroup
      },
      {
        id: this.tabDAobj.tableData[$index + 1].id,
        orderNum: this.tabDAobj.tableData[$index + 1].orderNum,
        isGroup: this.isGroup
      }]
      api.changeOrderNum(params).then(result => {
        this.$messageTips(this, 'success', '顺序调整成功')
        this.refreshList()
      })
    },
    refreshList () { // 刷新列表
      let query = this.$route.query
      if (query.directoryId) { // 如果存在目录id，则读取目录下的所有医嘱
        if (query.directoryId === 'root') {
          this.getAllsetMealList(query.packageId)
        } else {
          this.getsetMealList(query.directoryId)
        }
      } else {
        if (query.packageId) { // 如果不存在目录id，存在套餐id则获取套餐的所有医嘱项
          this.getAllsetMealList(query.packageId)
        }
      }
    },
    // 获取套餐下所有目录信息
    getAllsetMealList (packageId) {
      this.loading = true
      let params = {
        id: packageId,
        isGroup: this.isGroup
      }
      if (this.isPlan) {
        params.orderId = this.$route.query.orderId
      }
      api.getPackageById(params).then(result => {
        if (result.data && result.data.setMealCatalogs) {
          this.discountMethodId = result.data.discountSet
          this.packageName = result.data.name
          this.handlePackageInformation({data: result.data, listAll: true})
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取目录下套餐信息
    getsetMealList (directoryId) {
      this.loading = true
      let params = {id: directoryId, serviceName: this.medicalOrderName, isGroup: this.isGroup}
      if (this.isPlan) {
        params.orderId = this.$route.query.orderId
      }
      api.getDirectorysById(params).then(result => {
        if (result.data) {
          this.packageDirectoryName = result.data.name
          this.handlePackageInformation({data: result.data})
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handlePackageInformation ({data, listAll}) {
      this.cacheData = data
      let tabDAobjData = []
      this.serviceValidDisable = []
      let serviceValidArr = []
      if (listAll) { // 是否根目录
        for (let item of data.setMealCatalogs) {
          tabDAobjData = tabDAobjData.concat(item.setMealDetails) // 医嘱
        }
      } else {
        tabDAobjData = data && data.setMealDetails // 医嘱
      }
      // 处理医嘱中特殊字段
      for (let item of tabDAobjData) {
        item.isMust = Boolean(item.isMust)
        item.discountNum = '0'
        item.discountNum = (item.discount / 10) + ''
        !item.isServiceValid ? this.serviceValidDisable.push(item) : serviceValidArr.push(item)
      }
      tabDAobjData = [...this.serviceValidDisable, ...serviceValidArr]
      // 获取套餐的折扣
      this.tabDAobj.tableData = tabDAobjData
      this.tabDAobj.totalPrices = data.totalPrices
      this.tabDAobj.totalPriceDiss = data.totalPriceDiss
    },
    createBatch () {
      let params = {
        businessTemplateId: this.packageDetails.id,
        businessTemplateName: this.packageDetails.name,
        names: this.setMealCatalogs.map(v => v.name)
      }
      gapi.createBatch(params).then(rs => {
        if (rs.head.errCode === 0) {
          let name = '3'
          this.$bus.$emit('package-tab', {name: name})
        }
      })
    }
  },
  watch: {
    '$route.query': { // 监控路由
      handler: function (query) {
        if (query.packageId || query.directoryId) {
          this.refreshList()
        }
      }
    },
    'packageDetails.discountSet': {
      handler (val, oldVal) {
        this.discountMethodId = val
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.el-header { padding: 0 10px !important; }
.directory_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 3px 0 3px;
}
.statistics {
  line-height: 33px;
}
.el-main /deep/ .el-input-group__append {
  padding: 0 5px;
}
</style>
