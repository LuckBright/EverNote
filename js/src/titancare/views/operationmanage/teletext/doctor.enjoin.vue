<template>
  <div>
    <div v-for="(list, index) in detailsObj" :key="index">
      <div v-for="(items, index) in list.list" :key="index">
        <enjoin-details v-if="items.length" :list="list"></enjoin-details>
        <table-info
          v-for="(item, index) in items"
          :key="index"
          :name="serviceType[item.serviceType]"
          :serviceType="item.serviceType"
          :resultData="item"
          ref="tableref"
          ></table-info>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
import tableInfo from './table-info'
import enjoinDetails from './enjoin.details'
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
      detailsObj: [],
      addressList: []
    }
  },
  created () {
    let visitNumber = this.$route.query.visitNumber
    let orgId = this.$route.query.orgId
    this.getInfo(visitNumber, orgId)
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
    async getInfo (id, orgId) {
      this.detailsObj.length = 0
      let newArr = await api.getRecipeDetailByVisitNumber(id)
      let payTimeArr = []
      let keys = Object.keys(this.serviceType)
      newArr.data.forEach(items => {
        let obj = {}
        obj.province = items.province
        obj.city = items.city
        obj.county = items.county
        obj.addressDetail = items.addressDetail
        obj.name = items.name
        obj.mobile = items.mobile
        this.getList(items.recipeOrderId, obj)
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
      this.$emit('address', this.addressList)

      // 获取医嘱列表项
      let params = {
        data: {
          visitNumber: id
        },
        config: { 'x-org-id': orgId }
      }
      let details = await api.getRecipeAvailableByVisitNumber(params)
      if (!details.errCode) {
        details.data.forEach(items => {
          items.createTime = items.submitTime
          // this.setInfo(items)
          payTimeArr.forEach(item => {
            if (item.id === items.id) {
              items.payTime = item.payTime
            }
          })
        })
        this.detailsObj = details.data
      }
    },
    getList (id, obj) {
      // 查询物流信息
      api.getAddressList({ recipeOrderId: id, orgId: this.$route.query.orgId }).then(res => {
        obj.list = res.errCode === 0 ? res.data : []
      })
    }
  }
}
</script>
