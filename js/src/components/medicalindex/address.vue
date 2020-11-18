<template>
  <el-popover placement="bottom" width="400" v-model="visible">
    <ever-address
      ref="address"
      @detail="detail"
      v-model="str"
      :level="level"
      :showDetialAddr="false"
    ></ever-address>
    <el-input v-show="showdetail" clearable placeholder="详细地址" v-model="address.addressDetail"></el-input>
    <el-button class="fr" type="primary" size="mini" @click="confirm">确定</el-button>
    <el-input slot="reference" :value="value[prop]" placeholder="—"></el-input>
  </el-popover>
</template>

<script>
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
      str: '',
      visible: false
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    detail (val) {
      this.address.provinceName = val.provinceName
      this.address.cityName = val.cityName
      this.address.countyName = val.countyName
    },
    confirm (val) {
      if (this.$refs.address.arr.length < 2) {
        this.address.provinceName = ''
        this.address.cityName = ''
        this.address.countyName = ''
      }
      const { provinceName, cityName, countyName, addressDetail } = this.address
      const hasData = this.$refs.address.arr.length > 1 || addressDetail

      if (!hasData) {
        if (this.showdetail) {
          this.$emit('change', this.prop, '')
        } else {
          this.$emit('change', '')
        }
      } else {
        if (this.showdetail) {
          this.$emit(
            'change',
            this.prop,
            provinceName + cityName + countyName + addressDetail
          )
        } else {
          this.$emit('change', this.address)
        }
      }
      this.visible = false
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
</style>
