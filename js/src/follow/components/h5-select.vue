<template>
  <div>
    <div class="h5-select-warp" v-if="selectDate && selectDate.length">
      <select
        class="h5-select"
        @change="setSelect"
        :class="value?'cBlack':'cGray'"
        :disabled="disabled"
      >
        <option value disabled selected style="display: none;">
          <span style="color:#bbbbbbb;">{{code === "GBT.2659"?"请填写国家":"请填写与患者关系"}}</span>
        </option>
        <option
          v-for="(item, index) in selectDate"
          :key="index"
          class="item"
          :value="item.code"
        >{{item.name}}</option>
      </select>
    </div>
    <div v-else class="bb1 h30">{{setName?setName:'无'}}</div>
  </div>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  props: ['disabled', 'code', 'value', 'setValue'],
  data () {
    return {
      selectDate: [], // {id: 1, value: '4', name: '中国', code: '8'}
      isFirst: false,
      setName: ''
    }
  },
  created () {
    this.getData()
  },
  watch: {
    'setValue' (val) {
      if (val && this.selectDate[0]) {
        this.selectDate.filter(v => {
          if (v.code === val) {
            this.setName = v.name
          }
        })
      }
    }
  },
  methods: {
    setSelect (option) {
      this.selected = option
    },
    getData () {
      sysvalue.listOnce(this.code).then(result => {
        // console.log(result, 'result')
        this.selectDate = result
      })
    }
  },
  computed: {
    selected: {
      set (val) {
        this.$emit('input', val.target.value)
      },
      get () {
        return this.value
      }
    }
  }
}
</script>
<style scoped>
.bb1 {
  border-bottom: 1px solid #bbbbbb;
}
.h30 {
  height: 30px;
}
.h5-select {
  width: 100%;
  background: #ffffff;
  height: 32px;
  border: 0 none;
  border-bottom: 1px solid #bbbbbb;
  outline: none;
  border-radius: 0px;
}
.h5-select::-ms-expand {
  display: none;
}
select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  border-radius: 0px;
}
.h5-select-warp::after {
  font-size: 14px;
  content: "\e77a";
  color: #bbbbbb;
  position: absolute;
  right: 0px;
  font-family: "iconfont" !important;
}
.cGray {
  color: #bbbbbb;
}
.cblack {
  color: #333333;
}
</style>
