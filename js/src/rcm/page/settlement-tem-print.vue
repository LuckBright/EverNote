<template>
<div id="print">
  <div class="tem_settle">
    <div class="code">
      <barcode v-if="printinfo.outpatientNumber" :value=String(printinfo.outpatientNumber) :options="{ displayValue: false, width: 3, height: 60, fontSize: 20, margin: 0, textMargin: 2, lineColor: '#000'}" tag="img"></barcode>
    </div>
    <div class="printinfo_id">{{printinfo.outpatientNumber}}</div>
    <h1 class="settletitle">{{printinfo.clinicName}}门诊收费明细</h1>
    <div class="patientinfo">
      <p><span style="padding-right: 20px;">患 者：{{printinfo.patientName}}/<sys-value type="GBT.2261.1" :code="printinfo.patientSex"></sys-value>/{{printinfo.patientAge}}岁</span></p>
      <p><span>收费员：{{printinfo.createUser}}</span></p>
      <p><span>时 间：{{printinfo.createTime}}</span></p>
    </div>
    <div class="settlelistbox">
      <div class="settlelisttitle">
        <el-row>
          <el-col :span="8">
            项目名称
          </el-col>
          <el-col :span="5">
            单位
          </el-col>
          <el-col :span="5">
            规格
          </el-col>
          <el-col :span="5" style="text-align: right;">
            实收
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            数量
          </el-col>
          <el-col :span="6">
            单价
          </el-col>
          <el-col :span="6">
            金额
          </el-col>
          <el-col :span="6">
            <!-- 收费等级 -->
          </el-col>
        </el-row>
      </div>
      <div class="listitem" v-for="item,i in settleDetail">
        <el-row class="listitemtitle" v-if="item.groupId">
          <el-col :span="16">
            {{item.fatherItemClassName}}
          </el-col>
          <el-col :span="8">
            {{item.totalFee && item.totalFee.toFixed(2)}}
          </el-col>
        </el-row>
        <div class="listitemcon">
          <el-row>
            <el-col :span="8">
              {{item.itemDisName || item.itemname}}
            </el-col>
            <el-col :span="5">
              {{item.unit}}
            </el-col>
            <el-col :span="5">
              {{item.spec || '无'}}
            </el-col>
            <el-col :span="5" style="text-align: right;">
              {{item.preFee && item.preFee.toFixed(2)}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              {{item.quantity}}
            </el-col>
            <el-col :span="6">
              {{item.prePrice && item.prePrice.toFixed(2)}}
            </el-col>
            <el-col :span="6">
              {{item.preFee && item.preFee.toFixed(2)}}
            </el-col>
            <el-col :span="6">
              <!-- {{api.levelObj[item.comLevel]}} -->
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="borderbottom"></div>
    <div class="patientinfo" style="padding-top: 20px;">
      <p><span>总 计：<b>{{printinfo.totalFee}}</b></span></p>
      <p><span>金额大写：{{digitUppercase(printinfo.totalFee)}}</span></p>
      <p>
        <span v-if="printinfo.comInsuranceDirectFee">商保应收：{{printinfo.comInsuranceDirectFee | formatToFinacial}}</span>
         <span v-if="printinfo.majoraccountStatus == 1">大客户应收：{{printinfo.majorAccountFee | formatToFinacial}}</span>
        <span v-for="(v, k) in printinfo.payDetails" style="padding-right:10px;">
          {{k}}: {{v && v.toFixed(2)}}
        </span>
      </p>
      <!-- 优惠金额 -->
        <!-- <p v-if="printinfo.memberCardFee && Number(printinfo.memberCardFee) !== 0"><span>储值卡消费: {{printinfo.memberCardFee | formatToFinacial}}</span></p> -->
        <p v-if="printinfo.membergradecutfee && Number(printinfo.membergradecutfee) !== 0"><span>储值卡优惠: {{printinfo.membergradecutfee | formatToFinacial}}</span></p>
        <p v-if="printinfo.benefitFee && Number(printinfo.benefitFee) !== 0"><span>身份卡优惠: {{printinfo.benefitFee | formatToFinacial}}</span></p>
        <p v-if="printinfo.memberactcutfee && Number(printinfo.memberactcutfee) !== 0"><span>优惠券: {{printinfo.memberactcutfee | formatToFinacial}}</span></p>
        <p v-if="printinfo.promotionFee && Number(printinfo.promotionFee) !== 0"><span>活动: {{printinfo.promotionFee | formatToFinacial}}</span></p>
        <!-- <p v-if="printinfo.comInsuranceDirectFee && Number(printinfo.comInsuranceDirectFee) !== 0"><span>商保支付: {{printinfo.comInsuranceDirectFee | formatToFinacial}}</span></p> -->
        <!-- <p v-if="printinfo.comInsurancePlanFee && Number(printinfo.comInsurancePlanFee) !== 0"><span>商保理赔: {{printinfo.comInsurancePlanFee | formatToFinacial}}</span></p> -->
        <p v-if="printinfo.comInsuranceBenefitFee && Number(printinfo.comInsuranceBenefitFee) !== 0"><span>商保优惠: {{printinfo.comInsuranceBenefitFee | formatToFinacial}}</span></p>
        <p v-if="printinfo.medInsurPubPayFee && Number(printinfo.medInsurPubPayFee) !== 0"><span>医保基金支付金额: {{printinfo.medInsurPubPayFee | formatToFinacial}}</span></p>
        <p v-if="printinfo.medInsurOwnPayFee && Number(printinfo.medInsurOwnPayFee) !== 0"><span>个人账户支付金额: {{printinfo.medInsurOwnPayFee | formatToFinacial}}</span></p>
        <p v-if="(printinfo.medInsurOwnPayFee && Number(printinfo.medInsurOwnPayFee) !== 0) || (printinfo.medInsurPubPayFee && Number(printinfo.medInsurPubPayFee) !== 0)"><span>医疗保险支付总计: {{(printinfo.medInsurPubPayFee + printinfo.medInsurOwnPayFee) | formatToFinacial}}</span></p>
    </div>
  </div>
</div>
</template>

<script>
  import api from '@/rcm/store/settlementapi'
  export default {
    props: ['printinfo'],
    data () {
      return {
        api
      }
    },
    computed: {
      settleDetail () {
        // let sortArr = JSON.parse(JSON.stringify(this.printinfo.details.settlementDetail)) // 打印展示合并后信息
        let sortArr = JSON.parse(JSON.stringify(this.printinfo.mergedSettleDetail))
        sortArr.sort(function (a, b) {
          return Number(a.fatherItemClass || 0) - Number(b.fatherItemClass || 0)
        })
        let m = sortArr.reduce(function (total, curr) {
          if (!total[curr.fatherItemClass]) {
            total[curr.fatherItemClass] = []
          }
          total[curr.fatherItemClass].push(curr)
          return total
        }, {})
        let arr = []
        for (let k in m) {
          m[k][0].groupId = k
          m[k][0].totalFee = this.totalFeeFn(m[k])
          arr = arr.concat(m[k])
        }
        return arr
      }
    },
    methods: {
      totalFeeFn (arr) {
        let sum = 0
        arr.forEach(function (v) {
          sum += Number(v.preFee)
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
  /*@page {
    size: A5 portrait;
  }*/
  .el-row{
    overflow: hidden;
  }
  .tem_settle { color: #000; width: 100%; padding: 0 10px 0;}
  .tem_settle .code { text-align: center; margin: 20px auto 0px; }
  .tem_settle .code img { width: 100%; height: 60px; }
  .printinfo_id { font-size: 18px; line-height: 20px; text-align: center; }
  .tem_settle .settletitle { text-align: center; font-size: 16px; font-family: MicrosoftYaHei-Bold; color: #000; margin: 15px 0 15px; }
  .tem_settle .patientinfo { font-size: 14px; font-family: MicrosoftYaHei; line-height: 20px; margin-bottom: 20px; }
  .tem_settle .patientinfo p { margin: 0; }
  .settlelistbox { font-size: 14px; line-height: 20px; }
  /*.settlelistbox .el-col { -webkit-transform:scale(0.8); -webkit-transform-origin: 0 0; }*/
  .settlelisttitle, .listitemtitle { border-bottom: 1px solid #000; }
  .listitemtitle { font-weight: bold; line-height: 24px; border-top: 1px solid #000; margin-top: -1px; }
  .listitemcon { border-bottom: 1px dashed #000; }
  .borderbottom { border-bottom: 1px solid #000; height: 0; width: 100%; margin-top: -1px; }
</style>
