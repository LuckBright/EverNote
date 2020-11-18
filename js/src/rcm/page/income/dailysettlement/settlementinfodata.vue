<template>
  <div class="settleinfodata">
    <ul v-if="show" class="clearfix">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="feeshow"
        :class="{max: item.value=='upperReceiveCashFee' && data.length%4 > 0}"
      >
        <div v-if="!exceptFormatToNum.includes(item.value)">
          <label>{{item.label}}：</label>
          {{info[item.value] | formatToFinacial}}
        </div>
        <!-- 尾差单独拎出来，要求保留6位小数 -->
        <div v-else-if="item.value=='diff'">
          <label>{{item.label}}：</label>
          {{info[item.value] | formatToFinacial(6)}}
        </div>
        <div v-else-if="item.value=='disputeRefund'">
          <!-- 纠纷退费，挂号日结不显示 -->
          <template v-if="infoObj.feeType=='1'">
            <label>{{item.label}}：</label>
            {{info[item.value] | formatToFinacial}}
          </template>
        </div>
        <div v-else-if="item.value=='upperReceiveCashFee'" class="upperReceive">
          <label>{{item.label}}：</label>
          <div
            style="display: inline-block;width: calc(100% - 90px)"
          >{{info.receiveCashFee | intToChinese}}</div>
        </div>
        <div v-else-if="item.value=='totalCount'">
          <label>{{item.label}}：</label>
          <span v-if="isShowInDialog || infoObj.feeType === '3'">{{info[item.value]}}</span>
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
      <li v-if="infoObj.feeType === '1'" class="feeshow" style="width: 100%;">
        <h4 style="margin-bottom: 0;">注：纠纷退费发生时，应收金额会与费用合计不符</h4>
      </li>
    </ul>
    <div class="divider">___</div>
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
      // 这些数字都不需要格式化为金额类型
      exceptFormatToNum: ['upperReceiveCashFee', 'totalCount', 'diff', '初诊', '复诊', '总挂号数', '实际挂号数', '退号数', 'returnCount', 'disputeRefund'],
      colDataHead: [
        { label: '应收金额', value: 'flowFee' },
        { label: '实收金额', value: 'receiveFee' },
        { label: '优惠合计', value: 'disFee' },
        { label: '预收核销', value: 'preWriteOffPay' }
      ],
      // colDataInsu: [
      //   { label: '商保应收', value: 'insuranceFee' },
      //   { label: '商城应收', value: 'mallFee' }
      // ],
      colDataRefund: [
        { label: '结算退费', value: 'returnFee' },
        { label: '纠纷退费', value: 'disputeRefund' }
      ],
      colDataRound: [
        { label: '尾差金额', value: 'diff' },
        { label: '抹零金额', value: 'wipeOff' }
      ],
      colDataCount: [
        { label: '收据张数', value: 'totalCount' }
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
      for (let key in json.regs) {
        let obj = {}
        obj.label = key
        obj.value = key
        this.regsData.push(obj)
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
            this.data = [...this.regsData, ...this.colDataHead, ...this.colDataRefund, ...this.colDataRound, ...this.colDataCount, ...this.colDataFooters]
            // console.log(this.data, '初始化数据')
          } else if (!this.isMall && newValue.feeType === '1') {
            this.data = [...this.colDataHead, ...this.colDataRefund, ...this.colDataRound, ...this.colDataCount, ...this.colDataFooters]
          }
          this.info = newValue
          this.show = true
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.el-col {
  padding-top: 10px;
}
.feeshow {
  float: left;
  width: 25%;
  line-height: 30px;
}
.feeshow.max {
  width: 40%;
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
.upperReceive {
  label {
    float: left;
  }
}
.divider {
  visibility: hidden;
  height: 20px;
}
@media print {
  .settleinfodata {
    font-size: 12px;
  }
  .settleinfodata ul li.feeshow {
    color: #000;
  }
  .settleinfodata ul li a {
    color: #000;
  }
  .divider {
    height: 0;
  }
}
</style>

