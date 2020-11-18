<template>
  <div>
    <ever-bread-crumb name="物流详情"></ever-bread-crumb>
    <div class="address-container">
      <template v-if="$route.query.deliveryMethod && $route.query.deliveryMethod === '1'">
        <div class="pt10 pl30 f14">配送方式：自提</div>
        <div class="pl30">{{supplyInfo.addressInfo}}</div>
      </template>
      <template v-else>
        <div class="pt10 pl30 f14">配送方式：邮寄</div>
        <div v-for="(item, index) in addressList" :key="index">
          <receiving-address
            :showexpress="true"
            :values="userAddressObj"
            :list="item.list"
          ></receiving-address>
        </div>
      </template>
      <div class="no-trans" v-if="addressList.length === 0 && $route.query.deliveryMethod !== '1'">暂无物流信息</div>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/orderdetail/index.js'
import receivingAddress from '@/titancare/views/operationmanage/receiving.address'
import storage from '@/util/storage'
import citys from '@/util/citys'
export default {
  components: {
    receivingAddress
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
      api,
      storage,
      addressList: [],
      recipeId: this.$route.query.recipeId,
      userAddressObj: {},
      supplyInfo: {}
    }
  },
  created () {
    // this.getInfo(this.$route.query.visitNumber, this.$route.query.settlementId, this.$route.query.orgId)
    this.getAddressInfo()
  },
  methods: {
    /**
     * 获取数据
     */
    async getInfo (id, settlementId, orgId) {
      let newArr = await api.getRecipeDetailByVisitNumberAndSettlementId(id, settlementId)
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
        this.getAddressList(items.recipeOrderId, obj)
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
    },
    getAddressInfo () {
      if (this.$route.query.dispensingWay === 3) {
        // 处方流转平台查询物流信息
        if (this.$route.query.recipelRoamOrderNum) {
          api.getTransInfo({ recipelRoamOrderNum: this.$route.query.recipelRoamOrderNum }).then(res => {
            this.userAddressObj = {
              dispensingWay: 3,
              province: res.provinceName,
              city: res.cityName,
              county: res.countyName,
              addressDetail: res.deliveryAddress,
              name: res.consignee,
              mobile: res.consigneeMobile,
            }
            let tempTrans = {
              expressComCode: res.expressCompanyId,
              expressComName: res.expressCompanyName,
              expressNumber: res.expressNum,
              verificationCode: res.receiveCheckCode,
              orderExecuteStatus: res.orderExecuteStatus,
            }
            this.addressList = [{list: [tempTrans]}]
          })
        }
        if (this.$route.query.deliveryMethod === '1') {
          if (this.$route.query.recipelRoamSupplierCode) {
            // 查供应商信息
            api.getSupplyInfo({ recipelRoamSupplierCode: this.$route.query.recipelRoamSupplierCode }).then(res => {
              let tempSupplyInfo = res.data[0].supplierInfo
              citys.getCityName1(JSON.stringify({
                addressDetail: tempSupplyInfo.addressDetail,
                province: tempSupplyInfo.addrProvinceCode,
                city: tempSupplyInfo.addressCityCode,
                county: tempSupplyInfo.addressCountyCode,
              })).then(res => {
                this.supplyInfo = tempSupplyInfo
                this.supplyInfo.addressInfo = res
              })
            })
          }
        }
      } else {
        // 查询物流信息
        api.getRecipeId({ recipeId: this.recipeId }).then(res => {
          this.userAddressObj = res
          this.getAddressList(res.recipeOrderId)
        })
      }
    },
    getAddressList (id) {
      // 查询物流信息
      api.getAddressList({ recipeOrderId: id, orgId: this.$route.query.orgId }).then(res => {
        this.addressList = [{list: res}]
      })
    }
  }
}
</script>
<style lang="less" scoped>
.address-container{
  min-height: 100%;
  background: #fff;
}
.no-trans{
  text-align: center;
  margin-top: 200px;
  color: #999;
}
</style>
