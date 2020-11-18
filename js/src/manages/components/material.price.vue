<template>
  <div>
    <el-row v-if="edit && !status">
      <el-col :span="14">
        <el-input ref="priceinput" type="number" v-model="price" @keyup.enter.native="successEdit" size="mini" :class="{error: price == undefined}" :controls="false"></el-input>
      </el-col>
      <el-col :span="10" class="pricema">
        <el-button size="small" type="text" @click="successEdit"><i class="iconfont icon-zhuyuan-yizhu-yizhix"></i></el-button>
        <el-button size="small" type="text" @click="cancelEdit"><i class="iconfont icon-zhuyuan-yizhu-bohui"></i></el-button>
      </el-col>
    </el-row>
    <span v-if="!edit" @dblclick="editPrice">{{showPrice()}}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    status: Number
  },
  data () {
    return {
      edit: false,
      thisObject: this.value,
      price: ''
    }
  },
  methods: {
    showPrice () {
      let strPrice = ''
      if (!this.status && this.thisObject.id) {
        if (this.thisObject.price === undefined || this.thisObject.price === null || this.thisObject.price === '') {
          strPrice = '未设置，请设置销售价'
        } else {
          strPrice = this.thisObject.price
        }
      } else {
        strPrice = '-'
      }
      return strPrice
    },
    successEdit () {
      if (this.validatePrice(this.price)) {
        this.thisObject['price'] = this.price
        this.edit = false
        this.$emit('change')
      }
    },
    // 校验价格格式是否正确
    validatePrice (price) {
      const dotNumber = String(price).split('.')[1]
      if (typeof price === 'undefined' || price === '' || (Number(price) < 0 || (dotNumber && dotNumber.length > 4))) {
        this.$messageTips(this, 'warning', '价格为空或者格式错误')
        return false
      } else {
        return true
      }
    },
    cancelEdit () {
      this.edit = false
    },
    editPrice () {
      if (!this.status && this.thisObject.id) {
        this.price = this.thisObject.price
        this.edit = true
        this.$nextTick(() => {
          this.$refs.priceinput.focus()
        })
      }
    }
  },
  watch: {
    value: {
      handler (v) {
        this.thisObject = v
        this.$forceUpdate()
      },
      deep: true
    },
    thisObject: {
      handler (v) {
        this.$emit('input:value')
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.pricema{
  line-height: 33px;
  /deep/ button {
    margin-left: 5px;
  }
  i {
    font-size: 18px;
  }
}
.el-input-number.error /deep/ .el-input__inner{
  border: 1px solid #ff0000;
}
</style>
