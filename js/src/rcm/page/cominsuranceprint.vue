<template>
  <div class="page_content_wrap" id="cominsuranceprint">
    <h1 class="insTitle">{{printData[0] && printData[0].details[0].clinicName}}账单</h1>
    <el-row class="insPatientInfo">
      <el-col :span="6">门诊档案号：{{printData[0] && printData[0].patientNumber}}</el-col>
      <el-col :span="6">姓名：{{printData[0] && printData[0].patientName}}</el-col>
      <el-col
        :span="6"
      >出生日期：{{printData[0] && printData[0].birthday && printData[0].birthday.substring(0, 10).replace(/-/g, '/')}}</el-col>
      <el-col :span="6">打印时间：{{$moment().format('YYYY/MM/DD HH:mm:ss')}}</el-col>
      <div class="clearfix"></div>
    </el-row>
    <el-row class="insPatientInfo">
      <el-col
        :span="6"
      >就诊日期：{{printData[0] && $moment(printData[0].settledate).format('YYYY/MM/DD')}}</el-col>
      <el-col :span="6">就诊类别：门诊</el-col>
      <div class="clearfix"></div>
    </el-row>
    <el-row class="insTableTitle">
      <el-col :span="3">收费类别</el-col>
      <el-col :span="6">项目名称</el-col>
      <el-col :span="3">单位</el-col>
      <el-col :span="3">单价</el-col>
      <el-col :span="3">数量</el-col>
      <el-col :span="3">原价</el-col>
      <el-col :span="3">折后价</el-col>
      <div class="clearfix"></div>
    </el-row>
    <div class="insDep" v-for="item in printData" :key="item.patientid">
      <el-row class="insDepTitle">
        <el-col :span="6">就诊科室：{{item.orderDeptName}}</el-col>
        <el-col :span="6">费别：{{item.feeType}}</el-col>
        <el-col :span="6">保险机构：{{item.insuranceOrgCnName}}</el-col>
        <el-col :span="6">保单号：{{item.policyNum}}</el-col>
        <div class="clearfix"></div>
      </el-row>
      <div class="insDepClassBox" v-for="(value, index) in item.classObj" :key="index">
        <el-row class="insDepClassTitle">{{value[0].fatherItemClassName}}</el-row>
        <div class="insDepClassDetail">
          <el-row
            class="insDepClass"
            v-for="(v,childindex) in value"
            :key="`${index}_${childindex}_${v.adviceId}`"
          >
            <el-col :span="6" :offset="3">{{v.itemname || '--'}}</el-col>
            <el-col :span="3">{{v.qtyunit || '--'}}</el-col>
            <el-col :span="3">{{v.price | formatToFinacial}}</el-col>
            <el-col :span="3">{{v.quantity || '--'}}</el-col>
            <el-col :span="3">{{v.preFee | formatToFinacial}}</el-col>
            <el-col :span="3">{{v.fee | formatToFinacial}}</el-col>
            <div class="clearfix"></div>
          </el-row>
        </div>
        <el-row class="insDepMoney">
          <el-col :span="6">{{value[0].fatherItemClassName}}小计：</el-col>
          <el-col :span="3" :offset="12">￥{{value[0].totalPreFee | formatToFinacial}}</el-col>
          <el-col :span="3">￥{{value[0].totalFee | formatToFinacial}}</el-col>
          <div class="clearfix"></div>
        </el-row>
      </div>
    </div>
    <el-row class="insDepTotalMoney">
      <el-col
        :span="6"
        v-for="(item,index) in printObj.feeData"
        :key="index"
      >{{item.name}} : {{item.fee | formatToFinacial}}</el-col>
      <div class="clearfix"></div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['printObj'],
  data () {
    return {
    }
  },
  computed: {
    insTotalFee () {
      if (this.printObj.data && this.printObj.data.length > 0) {
        let printData = JSON.parse(JSON.stringify(this.printObj.data))
        let sumfee = 0
        printData.forEach(function (item) {
          sumfee += (item.sumFee || 0)
        })
        return sumfee
      } else {
        return 0
      }
    },
    comInsuranceFee () {
      if (this.printObj.data && this.printObj.data.length > 0) {
        let printData = JSON.parse(JSON.stringify(this.printObj.data))
        let sumFee = 0
        printData.forEach(function (item) {
          item.details.forEach(function (v) {
            sumFee += v.comInsuranceDirectFee
          })
        })
        return sumFee
      } else {
        return 0
      }
    },
    printData () {
      let that = this
      if (this.printObj.data && this.printObj.data.length > 0) {
        let printData = JSON.parse(JSON.stringify(this.printObj.data))
        printData.forEach(function (item) {
          let sortArr = item.details.sort(function (a, b) {
            return Number(a.fatherItemClass || 0) - Number(b.fatherItemClass || 0)
          })
          let m = sortArr.reduce(function (total, curr) {
            if (!total[curr.fatherItemClass]) {
              total[curr.fatherItemClass] = []
            }
            total[curr.fatherItemClass].push(curr)
            return total
          }, {})
          for (let k in m) {
            m[k][0].groupId = k
            m[k][0].totalFee = that.totalFeeFn(m[k], 'fee')
            m[k][0].totalPreFee = that.totalFeeFn(m[k], 'preFee')
          }
          item.classObj = Object.assign({}, m)
        })
        return printData
      } else {
        return []
      }
    }
  },
  methods: {
    totalFeeFn (arr, name) {
      let sum = 0
      arr.forEach(function (v) {
        sum += Number(v[name])
      })
      return sum
    }
  }
}
</script>
<style scoped>
#cominsuranceprint {
  width: 100%;
  padding: 22px 0;
  margin: 0 auto;
}
.insTitle {
  font-size: 24px;
  line-height: 62px;
  text-align: center;
}
.insPatientInfo {
  padding-left: 14px;
  font-size: 12px;
  line-height: 22px;
}
.insTableTitle {
  padding-left: 14px;
  border: 0.5px solid #000;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.insDep {
  border: 0.5px solid #000;
  margin-bottom: 10px;
  border-bottom: none;
}
.insDepTitle {
  padding-left: 14px;
  font-size: 12px;
  line-height: 34px;
  height: 34px;
  border-bottom: 0.5px solid #000;
}
.insDepClassTitle {
  padding-left: 14px;
  font-size: 12px;
  line-height: 22px;
  padding-top: 10px;
}
.insDepClassDetail {
  padding-bottom: 10px;
}
.insDepClass {
  font-size: 12px;
  line-height: 22px;
}
.insDepMoney {
  padding-left: 14px;
  font-size: 12px;
  line-height: 34px;
  height: 34px;
  border-top: 0.5px solid #000;
  border-bottom: 0.5px solid #000;
}
.insDepTotalMoney {
  font-size: 12px;
  line-height: 12px;
  text-align: right;
}
.clearfix {
  clear: both;
}
</style>

