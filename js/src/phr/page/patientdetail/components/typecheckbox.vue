<!--  -->
<template>
  <el-checkbox-group v-model="checkList" class="checkbox" @change="change">
    <el-checkbox
      v-for="item in checkMap"
      :label="item.name"
      :disabled="item.disabled || allDisabled"
      :key="item.name"
    ></el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  props: {
    allCodes: Array
  },
  data () {
    return {
      checkList: ['门诊', '住院', '互联网'],
      allDisabled: false,
      checkMap: {
        '1': {
          name: '门诊',
          disabled: true,
          had: false
        },
        '3': {
          name: '住院',
          disabled: true,
          had: false

        },
        '5': {
          name: '互联网',
          disabled: true,
          had: false

        }
      }
    }
  },
  watch: {
    allCodes: {
      handler (val) {
        if (!val.length) return
        if (val.length === 1) {
          this.allDisabled = true
        }
        this.stored = {}
        val.map(key => {
          this.checkMap[key].had = true
          this.checkMap[key].disabled = false
          this.stored[key] = this.checkMap[key]
        })
        for (let key in this.checkMap) {
          if (!this.checkMap[key].had) {
            delete this.checkMap[key]
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {},

  computed: {},

  created () { },

  methods: {
    change () {
      const map = {
        '门诊': '1',
        '住院': '3',
        '互联网': '5'
      }
      let arr = []
      for (let i = 0; i < this.checkList.length; i++) {
        arr.push(map[this.checkList[i]])
      }
      arr = arr.filter(key => key in this.stored)
      if (arr.length === 1) {
        this.checkMap[arr[0]].disabled = true
      } else {
        arr.map(key => {
          this.stored[key].disabled = false
        })
      }
      this.$emit('change', arr)
    },
  }
}

</script>
<style lang='scss' scoped>
.checkbox {
  z-index: 100;
  position: absolute;
  top: 14px;
  left: 14px;
  /deep/ .el-checkbox {
    margin-right: 16px;
  }
  /deep/ .el-checkbox__label {
    padding-left: 5px;
  }
}
</style>
