<template>
  <div>
    <region-group-clinic-tap :type="type" :isGroupControl="isGroupControl" :layerTreeData="organData"  :treeData="regionAllData" :isClinic = 'packageDetails.isClinic'></region-group-clinic-tap>
  </div>
</template>
<script>
import groupClinicTree from './groupclinictree'
import regionGroupClinicTap from './regiongroupclinictap'
import api from '@/card/store/packagemanagement/api'
import activityApi from '@/card/store/activityapi'
export default {
  props: ['packageDetails', 'isGroupControl'],
  data () {
    return {
      api,
      packageId: this.$route.query.packageId,
      organData: [],
      regionData: [],
      regionAllData: [],
      type: 1
    }
  },
  components: {
    groupClinicTree,
    regionGroupClinicTap
  },
  methods: {
    handleClick () {

    },
    initData (data) {
      this.organData = data
    },
    initRegionData (data) {
      this.regionAllData = data
    },
    initCheckTree () {
      if (this.organData.length > 0 && this.packageDetails && this.packageDetails.useRangeList) {
        this.packageDetails.useRangeList.forEach(item => {
          this.foreData(this.organData, item)
        })
      }
    },
    foreData (data, info) {
      for (let i = 0; i < data.length; i++) {
        if (String(data[i]['id']) === String(info.orgId)) {
          data[i].isSale = info.isSale
          data[i].isUse = info.isUse
          data[i].endDate = info.endDate
          data[i].discount = info.discount || ''
          data[i].totalPriceDisSet = info.totalPriceDisSet || ''
        } else {
          if (data[i]['children'] && data[i]['children'].length > 0) {
            this.foreData(data[i]['children'], info)
          }
        }
      }
    },
    initClinic (data, cityList) { // 适用机构联级数据结构处理
      data.forEach(function (item) {
        delete item.children
      })
      let map = {}
      let cityMap = {}
      data.forEach(function (item) {
        map[item.id] = item
      })
      cityList.forEach(item => {
        item.label = item.cityName
        item.id = item.cityCode
        cityMap[item.cityCode] = item
      })
      let clinicVal = []
      data.forEach(function (item) {
        item.label = item.name
        item.isSale = 0
        item.isUse = 0
        item.endDate = ''
        item.totalPriceDisSet = ''
        item.discount = ''
        let parent = map[item.parentCode]
        let val = cityList.find(lab => lab.cityCode === item.cityCode) || cityList.find(lab => lab.cityCode === 'other')
        if (val) {
          (val.children || (val.children = [])).push(item)
        }
        if (parent) {
          (parent.children || (parent.children = [])).push(item)
        } else {
          clinicVal.push(item)
        }
      })
      return clinicVal
    }
  },
  async created () {
    let cityList = await activityApi.getClinicCityList() // 获取区域列表
    // if (cityList.data && cityList.data.resultList.length) return
    let cityCodeList = []
    cityList.data.forEach(item => {
      cityCodeList.push(item.cityCode)
    })
    let clinicList = await api.getClinicByCityCodeList({ cityCodeList }) // 获取区域对应的机构树
    cityList.data.push({cityName: '其他', cityCode: 'other'}) // 部分机构没有区域，增加其他区域
    let treeData = this.initClinic(clinicList.data.resultList, cityList.data) // 格式化树结构
    this.initData(treeData)
    this.initRegionData(cityList.data)
    this.initCheckTree(cityList.data)
  },
  watch: {
    'packageDetails': {
      handler: function (val) {
        this.type = this.packageDetails.discountSet
        this.initCheckTree()
      },
      immediate: true
    }
  }
}
</script>

