<template>
  <div v-loading="loading" class="chufang-box">
    <div v-for="(items, index) in detailsList" :key="index">
      <enjoin-details v-if="items" :list="items" :info="info"></enjoin-details>
      <table-info
        :name="serviceType[items.serviceType]"
        :serviceType="items.serviceType"
        :resultData="items"
        ref="tableref"
      ></table-info>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/orderdetail/index.js'
import tableInfo from './table-info'
import enjoinDetails from './enjoin.details'
import storage from '@/util/storage'
export default {
  components: {
    tableInfo,
    enjoinDetails
  },
  data () {
    return {
      serviceType: {
        301: '西药',
        302: '中成药',
        303: '中药材',
        304: '中药材',
        800: '检查',
        801: '检验'
      },
      detailsList: [],
      api,
      storage,
      addressList: [],
      info: {},
      loading: false
    }
  },
  created () {
    console.log(this.$route.query[0])
    let info = this.$route.query[0] ? JSON.parse(this.$route.query[0]).row : { visitNumber: this.$route.query.visitNumber, orgId: this.$route.query.orgId, visitType: this.$route.query.visitType, settlementId: '' }
    this.info = info
    this.getInfo(info.visitNumber, info)
  },
  methods: {
    /**
     * 格式化请求表格数据
     */
    setInfo (values) {
      let arr301 = []
      let arr302 = []
      let arr303 = []
      let arr800 = []
      let arr801 = []
      values.list = []
      if (values.serviceType === '301') {
        arr301.push(values)
      } else if (values.serviceType === '302') {
        arr302.push(values)
      } else if (values.serviceType === '303' || values.serviceType === '304') {
        arr303.push(values)
      } else if (values.serviceType === '800') {
        arr800.push(values)
      } else if (values.serviceType === '801') {
        arr801.push(values)
      }
      if (arr301.length) values.list.push(arr301)
      if (arr302.length) values.list.push(arr302)
      if (arr303.length) values.list.push(arr303)
      if (arr800.length) values.list.push(arr800)
      if (arr801.length) values.list.push(arr801)
    },
    /**
     * 获取数据
     */
    async getInfo (id, info) {
      this.loading = true
      this.detailsList.length = 0
      let newArr = await api.getRecipeDetailByVisitNumberAndSettlementId(id, info.settlementId)
      let payTimeArr = []
      let keys = Object.keys(this.serviceType)
      newArr.forEach(items => {
        let obj = {}
        obj.province = items.province
        obj.city = items.city
        obj.county = items.county
        obj.addressDetail = items.addressDetail
        obj.name = items.name
        obj.mobile = items.mobile
        // this.getAddressList(items.recipeOrderId, obj)
        this.addressList.push(obj)
        // 获取支付时间
        items.recipeList.forEach(item => {
          item.doctorAdviceList.forEach(k => {
            if (keys.includes(k.serviceType)) {
              let obj = {}
              obj.payTime = item.payTime ? item.payTime : '--'
              obj.id = JSON.parse(k.content).id
              payTimeArr.push(obj)
            }
          })
        })
      })
      // this.$emit('address', this.addressList)
      // 获取医嘱列表项
      let params = {
        data: {
          visitNumber: id,
          settlementId: info.settlementId
        },
        config: { 'x-org-id': info.orgId }
      }
      let detailsArr = await api.getRecipeAvailableByVisitNumberAndSettlementId(params)
      detailsArr.forEach(items => {
        items.createTime = items.submitTime
        // this.setInfo(items)
        payTimeArr.forEach(item => {
          if (item.id === items.id) {
            items.payTime = item.payTime
          }
        })
      })
      console.log(detailsArr)
      this.detailsList = detailsArr
      this.loading = false
    },
    getAddressList (id, obj) {
      // 查询物流信息
      api.getAddressList({ recipeOrderId: id }).then(res => {
        obj.list = res
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .chufang-box{
    min-height: 150px;
  }
</style>
