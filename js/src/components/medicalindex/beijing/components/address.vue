<template>
  <el-popover placement="bottom" width="400" v-model="visible">
    <ever-address
      v-if="show"
      ref="address"
      @detail="detail"
      v-model="str"
      :level="level"
      :showDetialAddr="false"
    ></ever-address>
    <el-input
      v-show="showdetail"
      clearable
      placeholder="详细地址"
      v-model="address.addressDetail"
    ></el-input>
    <el-button class="fr mr" type="primary" size="mini" @click="confirm"
      >确定</el-button
    >
    <el-input
      @focus="show = true"
      slot="reference"
      :value="addressDetail"
      placeholder="—"
    ></el-input>
  </el-popover>
</template>

<script>
import { keyMap } from '../keymap'
const {
  XIAN_ZHU_ZHI_SHENG,
  XIAN_ZHU_ZHI_SHI,
  XIAN_ZHU_ZHI_XIAN,
  XIAN_ZHU_ZHI_XIANG,
  HU_KOU_SHENG,
  HU_KOU_SHI,
  HU_KOU_XIAN,
  HU_KOU_XIANG,
  GONG_ZUO_SHENG,
  GONG_ZUO_SHI,
  GONG_ZUO_XIAN,
  GONG_ZUO_XIANG,
  GONG_ZUO_COMPANY,
  CONTACT_SHENG,
  CONTACT_SHI,
  CONTACT_XIAN,
  CONTACT_XIANG,
  CHU_SHENG_SHENG,
  CHU_SHENG_SHI,
  CHU_SHENG_XIAN,
  JI_GUAN_SHENG,
  JI_GUAN_SHI
} = keyMap
export default {
  props: {
    value: Object,
    level: {
      type: Number,
      default: 3
    },
    showdetail: {
      type: Boolean,
      default: false
    },
    prop: String
  },
  data () {
    return {
      address: {
        provinceName: '',
        cityName: '',
        countyName: '',
        addressDetail: ''
      },
      addressDetail: '',
      str: '',
      visible: false,
      show: false
    }
  },
  computed: {},
  mounted () {},
  created () {
    this.init()
  },
  watch: {
    value: {
      handler () {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    init () {
      const value = this.value
      if (this.prop === XIAN_ZHU_ZHI_SHENG) {
        this.mixStr('XIAN_ZHU_ZHI')
      }
      if (this.prop === HU_KOU_SHENG) {
        this.mixStr('HU_KOU')
      }
      if (this.prop === GONG_ZUO_SHENG) {
        this.mixStr('GONG_ZUO')
      }
      if (this.prop === CONTACT_SHENG) {
        this.mixStr('CONTACT')
      }
      if (!this.showdetail) {
        this.addressDetail = value[this.prop]
      }
    },
    mixStr (str) {
      const value = this.value
      const strObj = {
        province: this.isStr(value[keyMap[`${str}_SHENG`]]),
        city: this.isStr(value[keyMap[`${str}_SHI`]]),
        xian: this.isStr(value[keyMap[`${str}_XIAN`]]),
        xiang: this.isStr(value[keyMap[`${str}_XIANG`]])
      }
      if (str === 'GONG_ZUO') {
        this.addressDetail =
          this.isStr(value[GONG_ZUO_COMPANY]) +
          strObj.province +
          strObj.city +
          strObj.xian +
          strObj.xiang
      } else {
        this.addressDetail =
          strObj.province + strObj.city + strObj.xian + strObj.xiang
      }
    },
    isStr (str) {
      return typeof str === 'string' ? str : ''
    },
    detail (val) {
      this.address.provinceName = val.provinceName
      this.address.cityName = val.cityName
      this.address.countyName = val.countyName
    },
    getAddressObj () {
      const { provinceName, cityName, countyName, addressDetail } = this.address
      let obj = {}
      if (this.prop === HU_KOU_SHENG) {
        obj[HU_KOU_SHENG] = provinceName
        obj[HU_KOU_SHI] = cityName
        obj[HU_KOU_XIAN] = countyName
        obj[HU_KOU_XIANG] = addressDetail
      }
      if (this.prop === XIAN_ZHU_ZHI_SHENG) {
        obj[XIAN_ZHU_ZHI_SHENG] = provinceName
        obj[XIAN_ZHU_ZHI_SHI] = cityName
        obj[XIAN_ZHU_ZHI_XIAN] = countyName
        obj[XIAN_ZHU_ZHI_XIANG] = addressDetail
      }
      if (this.prop === GONG_ZUO_SHENG) {
        obj[GONG_ZUO_SHENG] = provinceName
        obj[GONG_ZUO_SHI] = cityName
        obj[GONG_ZUO_XIAN] = countyName
        obj[GONG_ZUO_XIANG] = addressDetail
      }
      if (this.prop === CONTACT_SHENG) {
        obj[CONTACT_SHENG] = provinceName
        obj[CONTACT_SHI] = cityName
        obj[CONTACT_XIAN] = countyName
        obj[CONTACT_XIANG] = addressDetail
      }
      if (this.prop === CHU_SHENG_SHENG) {
        obj[CHU_SHENG_SHENG] = provinceName
        obj[CHU_SHENG_SHI] = cityName
        obj[CHU_SHENG_XIAN] = countyName
      }
      if (this.prop === JI_GUAN_SHENG) {
        obj[JI_GUAN_SHENG] = provinceName
        obj[JI_GUAN_SHI] = cityName
      }
      return obj
    },
    changeAddress () {
      const { provinceName, cityName, countyName, addressDetail } = this.address
      const obj = this.getAddressObj()
      for (let key in obj) {
        this.$emit('change', key, obj[key])
      }
      if (this.showdetail) {
        this.addressDetail =
          provinceName + cityName + countyName + addressDetail
      } else {
        this.addressDetail = provinceName
      }
    },
    confirm (val) {
      const arr = this.$refs.address.arr
      if (this.$refs.address.arr.length < 2) {
        if (arr.length === 1) {
          this.address.provinceName = arr[0] ? this.address.provinceName : ''
        } else {
          this.address.provinceName = ''
        }
        this.address.cityName = ''
        this.address.countyName = ''
      }
      this.changeAddress()
      this.visible = false
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
.mr {
  margin-top: 10px;
}
</style>
