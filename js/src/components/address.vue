<!--
  <ever-address v-model="address3" :level="2" :showDetialAddr="true"></ever-address>
  :level="2"  // 显示省市县还是 省市
  :showDetialAddr="true"   // 是否显示详细地址    true 显示  false 隐藏 默认 true
  :enMode="true"    // 英文模式
  :convertToFnt     // 控制改组件的功能模式  false 表示是输入状态， true 表示是把json格式化为对应的汉字 默认false
-->
<template>
  <span>
    <template v-if="convertToFnt">
      <span>{{addrFnt}}</span>
    </template>
    <template v-else>
      <template v-if="layout === '2'">
        <el-row class="address">
          <el-col :span="24">
            <el-cascader
              :options="options"
              v-model="arr"
              style="width: 100%"
              placeholder="请选择省市县"
              :clearable="true"
              :filterable="true"
              :enMode="enMode"
              :disabled="disabled"
            ></el-cascader>
          </el-col>
        </el-row>
        <el-row class="address" style="margin-top: 5px">
          <el-col :span="24">
            <el-input
              v-model="addressDetail"
              placeholder="请输入详细地址"
              type="textarea"
              :rows="3"
              :maxlength="40"
              :disabled="disabled"
            ></el-input>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row class="address">
          <el-col :span="showDetialAddr ? 12 : 24">
            <el-cascader
              :options="options"
              v-model="arr"
              style="width: 100%"
              placeholder="请选择省市县"
              :clearable="true"
              :filterable="true"
              :enMode="enMode"
              :disabled="disabled"
            ></el-cascader>
          </el-col>
          <el-col :span="12" v-if="showDetialAddr">
            <el-input
              v-model="addressDetail"
              placeholder="请输入详细地址"
              :maxlength="40"
              :disabled="disabled"
            ></el-input>
          </el-col>
        </el-row>
      </template>
    </template>
  </span>
</template>
<script>
import citys from '@/util/citys'
export default {
  props: {
    'value': {
      type: String,
      default: ''
    },
    'level': {
      type: Number,
      default: 3
    },
    'showDetialAddr': {
      type: Boolean,
      default: true
    },
    'enMode': {
      type: Boolean,
      default: false
    },
    'disabled': {
      type: Boolean,
      default: false
    },
    'convertToFnt': {
      type: Boolean,
      default: false
    },
    'split': {
      type: String,
      default: ' '
    },
    'layout': {
      type: String,
    },
    'defaultEmptyStr': {
      type: String,
      default: '-'
    },
  },
  data () {
    return {
      options: [],
      arr: [],
      addressDetail: '',
      address: {
        province: '',
        city: '',
        county: ''
      },
      addrFnt: ''
    }
  },
  watch: {
    'arr': {
      handler (newVal) {
        this.address.province = newVal[0]
        this.address.city = newVal[1]
        this.address.county = newVal[2]
        let obj = Object.assign({}, this.address)
        this.$emit('input', (JSON.stringify(obj) !== '{}') ? JSON.stringify(obj) : '')
        this.emitDetailAddress(newVal)
      },
      deep: true
    },
    'addressDetail' (val) {
      this.address.addressDetail = val || ''
      let obj = Object.assign({}, this.address)
      this.$emit('input', (JSON.stringify(obj) !== '{}') ? JSON.stringify(obj) : '')
    },
    'value': {
      handler (val) {
        if (val) {
          let obj = {}
          try {
            obj = JSON.parse(val)
            if (this.convertToFnt) {
              citys.getCityName1(val).then(res => {
                if (res) {
                  this.addrFnt = res
                } else {
                  this.addrFnt = this.defaultEmptyStr
                }
              })
            } else {
              this.arr = [obj.province]
              if (obj.city) this.arr[1] = obj.city
              if (obj.county) this.arr[2] = obj.county
              if (obj.addressDetail !== '') {
                this.address.addressDetail = obj.addressDetail
                this.addressDetail = obj.addressDetail
              }
            }
          } catch (e) {
          }
        } else {
          this.addrFnt = this.defaultEmptyStr
          this.arr = []
          this.address = {
            province: '',
            city: '',
            county: ''
          }
          this.addressDetail = '' // 如果没有地址信息的话，详细地址也应该清空
        }
      },
      immediate: true
    }
  },
  async created () {
    this.options = await citys.getAddressList({
      level: this.level,
      enMode: this.enMode
    })
    // if (this.value && this.convertToFnt) {
    //   citys.getCityName1(this.value).then(res => {
    //     this.addrFnt = res
    //   })
    // }
  },
  methods: {
    emitDetailAddress (val) {
      const length = this.options.length
      const address = {
        provinceCode: val[0],
        cityCode: val[1],
        countyCode: val[2],
      }
      for (let i = 0; i < length; i++) {
        const item = this.options[i]
        if (item.value === val[0]) {
          address.provinceName = item.label
          address.provinceEnglishName = item.nameEn
          if (item.children) {
            for (let j = 0; j < item.children.length; j++) {
              const cityItem = item.children[j]
              if (cityItem.value === val[1]) {
                address.cityName = cityItem.label
                address.cityEnglishName = cityItem.nameEn
                if (cityItem.children) {
                  for (let k = 0; k < cityItem.children.length; k++) {
                    const countyItem = cityItem.children[k]
                    if (countyItem.value === val[2]) {
                      address.countyName = countyItem.label
                      address.countyEnglishName = countyItem.nameEn
                      this.$emit('detail', address)
                      return
                    }
                  }
                } else {
                  address.countyCode = ''
                  address.countyName = ''
                  address.countyEnglishName = ''
                  this.$emit('detail', address)
                  return
                }
              }
            }
          } else {
            address.cityCode = ''
            address.cityName = ''
            address.cityEnglishName = ''
            address.countyCode = ''
            address.countyName = ''
            address.countyEnglishName = ''
            this.$emit('detail', address)
            return
          }
        }
      }
    },
  },
}
</script>
<style scoped>
.address .el-col + .el-col {
  padding-left: 10px;
}
</style>
