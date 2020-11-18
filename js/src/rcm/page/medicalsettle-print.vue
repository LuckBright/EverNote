<template>
<div id="medicalprint">
  <div class="medicalprint"  v-for="page in pages">
    <h1 class="settletitle">医疗门诊收费票据</h1>
    <h4 class="settlesubtitle" v-if="printinfo.medicalNo">已上传医保</h4>
    <h4 class="settlesubtitle" v-else>医保已实时结算</h4>
    <div class="medicalmessage">
      <el-row v-if="printinfo.medicalNo">
        <el-col :span="24">
          实时结算：<i class="iconfont icon-Star"></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          交易流水号：{{printinfo.tradeno}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          业务流水号：{{printinfo.settleCode}}
        </el-col>
        <el-col :span="8">
          医疗机构类型：{{printinfo.clinicType}}
        </el-col>
      </el-row>
    </div>
    <div class="settledetail">
      <div class="settledetailmessage">
        <el-row>
          <el-col :span="4" class="nextWord">
            患者姓名：{{printinfo.name}}
          </el-col>
          <el-col :span="4">
            性别：{{printinfo.sex}}
          </el-col>
          <el-col :span="8">
            医保类型：{{printinfo.fundtype}}
          </el-col>
          <el-col :span="8" class="text_right">
            社会保障卡号：{{printinfo.cardno}}
          </el-col>
        </el-row>
      </div>

      <div class="settlelistbox">
        <div class="dotborder"></div>
        <el-row class="boxrow">
          <el-col :span="12" v-for="col in [0, 1]" :key="col" class="settlelistboxcol">
            <div>
              <el-row class="border_bottom">
                <el-col :span="8">
                  项目/规格
                </el-col>
                <el-col :span="3">
                  单价
                </el-col>
                <el-col :span="5">
                  数量/单位
                </el-col>
                <el-col :span="3">
                  金额
                </el-col>
                <el-col :span="5">
                  收费等级
                </el-col>
              </el-row>
              <template v-for="item,i in settleDetail.slice(page * 10 + col * 5, page * 10 + col * 5 + 5)">
                <el-row v-if="item.groupId">
                  <el-col :span="16" class="settleclasstitle">
                    {{item.itemClassName}}
                  </el-col>
                  <el-col :span="4">
                    {{item.totalFee && item.totalFee.toFixed(2)}}
                  </el-col>
                </el-row>
                <el-row class="ever_row_01">
                  <el-col :span="8">
                    {{item.itemDisName || item.itemname}}
                  </el-col>
                  <el-col :span="4">
                    {{item.price && item.price.toFixed(2)}}
                  </el-col>
                  <el-col :span="4">
                    {{item.quantity}}/{{item.unit}}
                  </el-col>
                  <el-col :span="3">
                    {{item.fee && item.fee.toFixed(2)}}
                  </el-col>
                  <el-col :span="5">
                    {{medLevelMap[item.medLevel]}}
                  </el-col>
                </el-row>
              </template>
            </div>
          </el-col>
        </el-row>
        <el-row class="medicaldetail">
          <el-col :span="8" style="float: right;">
            <el-row>
              <el-col :span="16">自付一：</el-col>
              <el-col :span="8">{{printinfo.payself1 | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="medicaldetail">
          <el-col :span="8">
            <el-row>
              <el-col :span="16">门诊大额支付：</el-col>
              <el-col :span="8">{{printinfo.mzbigpay | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">本次医保范围内金额：</el-col>
              <el-col :span="8">{{printinfo.mzfeein | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">起付金额：</el-col>
              <el-col :span="8">{{printinfo.mzpayfirst | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="medicaldetail">
          <el-col :span="8">
            <el-row>
              <el-col :span="16">退休补充支付：</el-col>
              <el-col :span="8">{{printinfo.bcpay | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">累计医保范围内金额：</el-col>
              <el-col :span="8">0.00</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">超封顶金额：</el-col>
              <el-col :span="8">0.00</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="medicaldetail">
          <el-col :span="8">
            <el-row>
              <el-col :span="16">残军补助支付：</el-col>
              <el-col :span="8">{{printinfo.jcbz | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">年度门诊大额累计支付：</el-col>
              <el-col :span="8">0.00</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">自付二：</el-col>
              <el-col :span="8">{{printinfo.payself1 | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="medicaldetail">
          <el-col :span="8">
            <el-row>
              <el-col :span="16">单位补充险【原公疗】支出：</el-col>
              <el-col :span="8">0.00</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">个人账户余额：</el-col>
              <el-col :span="8">{{printinfo.personcountaftersub | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">自费：</el-col>
              <el-col :span="8">{{printinfo.payself | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="medicaldetail">
          <el-col :span="8">
            <el-row>
              <el-col :span="16">基金支付：</el-col>
              <el-col :span="8">{{printinfo.fund | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">个人账户支付：</el-col>
              <el-col :span="8">{{printinfo.personcountpay | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="16">个人支付金额：</el-col>
              <el-col :span="8">{{printinfo.feepersonpay | formatToFinacial}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="medicalsettlemoney">
      <el-row>
        <el-col :span="18" class="border_right">
          <el-row>
            <el-col :span="4">
              合计(大写):
            </el-col>
            <el-col :span="20">
              {{digitUppercase(printinfo.fee)}}
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="text_center">
          ￥{{printinfo.fee | formatToFinacial}}
        </el-col>
      </el-row>
    </div>
    <div class="needwrite">
      <el-row>
        <el-col :span="8">
          收款单位（章）:
        </el-col>
        <el-col :span="8">
          收款人（签单）: <span>{{printinfo.createUserCode}}</span>
        </el-col>
        <el-col :span="8" class="text_right">
          {{printinfo.createtime | formatDateByExp('ll')}}
        </el-col>
      </el-row>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    props: ['printinfo'],
    data () {
      return {
        medLevelMap: {
          1: '无自付',
          2: '有自付',
          3: '全自付'
        }
      }
    },
    computed: {
      settleDetail () {
        // let sortArr = [].concat(this.printinfo.settlementDetail)
        let sortArr = JSON.parse(JSON.stringify(this.printinfo.settlementDetail))
        sortArr.sort(function (a, b) {
          return Number(a.itemClass || 0) - Number(b.itemClass || 0)
        })
        let m = sortArr.reduce(function (total, curr) {
          if (!total[curr.itemClass]) {
            total[curr.itemClass] = []
          }
          total[curr.itemClass].push(curr)
          return total
        }, {})
        let arr = []
        for (let k in m) {
          m[k][0].groupId = k
          m[k][0].totalFee = this.totalFeeFn(m[k])
          arr = arr.concat(m[k])
        }
        return arr
      },
      pages () {
        let num = parseInt(this.settleDetail.length / 20) + 1
        let arr = []
        for (let i = 0; i < num; i++) {
          arr.push(i)
        }
        return arr
      }
    },
    methods: {
      printFee () {
        let that = this
        let fee = 0
        for (var v in that.printinfo.payDetails) {
          if (v !== '会员卡') {
            fee += that.printinfo.payDetails[v]
          }
        }
        return fee.toFixed(2)
      },
      totalFeeFn (arr) {
        let sum = 0
        arr.forEach(function (v) {
          sum += Number(v.fee)
        })
        return sum
      },
      digitUppercase (n) {
        var fraction = ['角', '分']
        var digit = [
          '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'
        ]
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ]
        var head = n < 0 ? '欠' : ''
        n = Math.abs(n)
        var s = ''
        for (var i = 0; i < fraction.length; i++) {
          s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
        }
        s = s || '整'
        n = Math.floor(n)
        for (var k = 0; k < unit[0].length && n > 0; k++) {
          var p = ''
          for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p
            n = Math.floor(n / 10)
          }
          s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][k] + s
        }
        return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整')
            .replace(/角$/, '角整')
      }
    }
  }
</script>
<style scoped>
  .medicalprint { width: 1200px; padding: 0 80px 0; margin: 0 auto;/* transform: scale(.5);*/ font-family: STSongti-SC-Black; }
  .medicalprint .settletitle { font-size: 36px; height: 76px; line-height: 76px; padding-top: 20px; margin: 0; text-align: center; }
  .medicalprint .settlesubtitle { text-align: center; margin: 0; font-size: 24px; line-height: 24px; font-weight: normal; }
  .medicalprint .medicalmessage { padding-left: 20px; padding-right: 20px; font-size: 18px; line-height: 18px; }
  .medicalprint .iconfont { font-size: 18px; color: #000; }
  .medicalprint /deep/ .el-row { padding-bottom: 10px; }
  .medicalprint .text_right { text-align: right; }
  .settledetailmessage { padding-left: 20px; padding-right: 20px; height: 44px; line-height: 44px; font-size: 18px; border: 2px solid #000; border-bottom: none;}
  .settlelistbox { border:2px solid #000; height: 428px; position: relative; }
  .settlelistbox .boxrow { height: 312px; }
  .settlelistbox .dotborder { position: absolute; top: 30px; left:50%; width:0; height: 220px; border-left: 2px dashed #000; }
  .settlelistboxcol /deep/ .el-row { padding-left: 20px; font-size: 18px; line-height: 28px; padding-bottom: 0; }
  .border_bottom { border-bottom: 2px solid #000; }
  .medicalprint .el-row.ever_row_01 /deep/ .el-col, .medicalprint .nextWord{
    white-space:normal;
    word-break:break-all;
  }
  .medicalprint .medicaldetail { padding:0 20px 0; }
  .medicalprint .medicaldetail /deep/ .el-row { padding-bottom: 0; }
  .medicalprint .medicaldetail /deep/ .text_right { text-align: right; }
  .medicalprint .medicalsettlemoney /deep/ .el-row {padding-bottom: 0; }
  .medicalprint .medicalsettlemoney { padding: 0 20px 0; height: 40px; line-height: 40px; font-size: 18px; border:2px solid #000; border-top: none; }
  .medicalprint .border_right { border-right: 2px solid #000; }
  .medicalprint .text_center { text-align: center; }
  .medicalprint .needwrite { padding: 0 20px 0; height: 38px; line-height: 38px;}
  .medicalprint .needwrite .el-col /deep/ span { padding-left: 30px; }
</style>

