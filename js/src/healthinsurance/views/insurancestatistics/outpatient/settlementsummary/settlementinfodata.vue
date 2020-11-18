<template>
  <div class="settleinfodata">
    <ul v-if="show" class="clearfix">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="feeshow"
        :class="item.value=='upperReceiveCashFee'?'morewidth':null"
      >
        <div
          v-if="item.value=='flowFee'||item.value=='disFee'||item.value=='receiveFee'||item.value=='insuranceFee'||item.value=='returnFee'||item.value=='receiveCashFee'"
        >
          <label>{{item.label}}：</label>
          {{info[item.value] | formatToFinacial}}
        </div>
        <div v-else-if="item.value=='upperReceiveCashFee'">
          <label>{{item.label}}：</label>
          {{info.receiveCashFee | intToChinese}}
        </div>
        <div v-else-if="item.value=='totalCount'">
          <label>{{item.label}}：</label>
          <span v-if="isShowInDialog">{{info[item.value]}}</span>
          <a
            v-else
            class="btn-color"
            style="cursor:pointer"
            @click="getBillDetail"
          >{{info[item.value]}}</a>
        </div>
        <div v-else>
          <label>{{item.label}}：</label>
          {{info[item.value]}}
        </div>
      </li>
    </ul>
    <div style="visibility:hidden;height:20px;">___</div>
  </div>
</template>
<script>
export default {
  props: ['isMall', 'infoObj'],
  data () {
    return {
      show: true,
      info: {},
      data: [],
      regsData: [],
      colDataHead: [
        { label: '应收金额', value: 'flowFee' },
        { label: '优惠合计', value: 'disFee' },
        { label: '实收金额', value: 'receiveFee' },
        { label: '退款合计', value: 'returnFee' }
      ],
      colDataInsu: [
        { label: '商保应收', value: 'insuranceFee' }
      ],
      colDataCount: [
        { label: '收据总张数', value: 'totalCount' }
      ],
      colDataFooters: [
        { label: '应交现金', value: 'receiveCashFee' },
        { label: '应交大写', value: 'upperReceiveCashFee' }
      ],
      isShowInDialog: this.$route.query.isShowInDialog // 在日结缴款弹窗里显示
    }
  },
  methods: {
    initRegs (json) {
      // console.log(json.regs, '初始化regs')
      this.regsData = []
      let sign = false
      for (let key in json.regs) {
        let obj = {}
        obj.label = key
        obj.value = key
        this.regsData.push(obj)
        if (key === '实际挂号数') {
          sign = true
          this.regsData.push({ label: '退号数', value: 'returnCount' })
        }
      }
      if (!sign) {
        this.regsData.unshift({ label: '退号数', value: 'returnCount' })
      }
      // console.log(this.regsData, '初始化resgdata')
    },
    getBillDetail () {
      this.$emit('getBillDetail')
    }
  },
  watch: {
    'infoObj': {
      handler (newValue) {
        if (newValue) {
          this.show = false
          this.data = []
          if (this.isMall) {
            this.colDataHead[1]['label'] = '尾差'
            this.data = [...this.colDataHead, ...this.colDataCount, ...this.colDataFooters]
          } else if (!this.isMall && newValue.feeType === '3') {
            this.initRegs(newValue)
            this.data = [...this.regsData, ...this.colDataHead, ...this.colDataInsu, ...this.colDataFooters]
            // console.log(this.data, '初始化数据')
          } else if (!this.isMall && newValue.feeType === '1') {
            this.data = [...this.colDataHead, ...this.colDataInsu, ...this.colDataCount, ...this.colDataFooters]
          }
          this.info = newValue
          this.show = true
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.el-col {
  padding-top: 10px;
}
.feeshow {
  float: left;
  width: 25%;
  line-height: 30px;
}
ul {
  margin: 0;
  padding: 0;
}
.morewidth {
  width: 75%;
}
.btn-color {
  cursor: pointer;
  color: rgb(28, 123, 239);
}
@media print {
  .settleinfodata {
    font-size: 12px;
  }
  .settleinfodata ul li a {
    color: #000;
  }
}
</style>

