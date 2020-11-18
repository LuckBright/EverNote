<!-- 结算退费订单医嘱详情表格 -->
<template>
  <div>
    <p class="label-tip">
      <span class="value-info">{{name}}</span>
    </p>
    <el-table
      v-if="[...WESTERN_MEDICINE, ...CHINESE_PATENT_MEDICINE].includes(serviceType)"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="doctorAdviceName" show-overflow-tooltip label="医嘱名称"></el-table-column>
      <el-table-column
        prop='advicePrice'
        show-overflow-tooltip
        label='金额'
        width='80'
      >
        <template slot-scope="scope">
          {{scope.row.sellingPriceTotal + '元'}}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="数量" width="80"></el-table-column>
      <el-table-column prop="spec" label="规格" width="80"></el-table-column>
      <el-table-column label="剂量" width="80">
        <template slot-scope="scope">{{scope.row.measure}}{{scope.row.measureUnitName}}</template>
      </el-table-column>
      <el-table-column prop="employName" label="用法" width="80"></el-table-column>
      <el-table-column prop="useFreqName" label="频次" width="80"></el-table-column>
      <el-table-column prop="useDay" label="用药天数" width="80" align="right"></el-table-column>
    </el-table>
    <el-table
      v-else-if="[...TRADITIONAL_CHINESE_PIECES, ...TRADITIONAL_CHINESE_GRANULE].includes(serviceType)"
      ref="multipleTable"
      :data="details"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="name" show-overflow-tooltip label="药品名称">
        <template slot-scope="scope">
          {{scope.row.serviceName}}、{{scope.row.count}}{{scope.row.countUnitName}}、
          <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="scope.row.footnote"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="剂数" width="80"></el-table-column>
      <el-table-column prop="useFreqName" label="频次" width="80"></el-table-column>
      <el-table-column prop="employName" label="用法" width="80"></el-table-column>
      <el-table-column prop="decoctFlag" label="煎法" width="80">
        <template slot-scope="scope">
          <sys-value type="THC_SYS_DECOCTION_OF_TCM" :code="scope.row.decoct"></sys-value>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-else-if="[...EXAMINATION].includes(serviceType)"
      ref="multipleTable"
      :data="inspectArr"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="doctorAdviceName" show-overflow-tooltip label="检查名称"></el-table-column>
      <el-table-column prop="positionName" label="部位" width="100"></el-table-column>
      <el-table-column prop="orgName" label="执行机构" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="executeProviderName" label="执行科室" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="advicePrice" label="价格" width="100"></el-table-column>
    </el-table>
    <el-table
      v-else-if="[...INSPECT].includes(serviceType)"
      ref="multipleTable"
      :data="testArr"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="doctorAdviceName" show-overflow-tooltip label="检验名称"></el-table-column>
      <el-table-column prop="specimenTypeName" label="标本类型" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orgName" label="执行机构" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="executeProviderName" label="执行科室" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="checkGuidance" label="检验指导" width="100"></el-table-column>
      <el-table-column prop="advicePrice" label="价格" width="80"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { WESTERN_MEDICINE, CHINESE_PATENT_MEDICINE, TRADITIONAL_CHINESE_PIECES, TRADITIONAL_CHINESE_GRANULE, EXAMINATION, INSPECT } from './../../util/common'
export default {
  props: {
    name: String,
    isShow: {
      type: Boolean,
      default: true
    },
    isShowCheckBox: {
      type: Boolean,
      default: false
    },
    resultData: {
      type: [Object, Array],
      defaylt: {}
    },
    serviceType: {
      type: [Number, String],
      default: ''
    }
  },
  created () {
    this.setInfo(this.resultData)
  },
  data () {
    return {
      tableData: [],
      details: [],
      allSelection: [],
      inspectArr: [],
      testArr: [],
      WESTERN_MEDICINE,
      CHINESE_PATENT_MEDICINE,
      TRADITIONAL_CHINESE_PIECES,
      TRADITIONAL_CHINESE_GRANULE,
      EXAMINATION,
      INSPECT
    }
  },
  methods: {
    setInfo (items) {
      this.tableData.length = 0
      this.details.length = 0
      this.inspectArr.length = 0
      if ([...WESTERN_MEDICINE, ...CHINESE_PATENT_MEDICINE].includes(items.serviceType)) {
        // let obj = {}
        // obj.advicePrice = items.advicePrice
        // obj.doctorAdviceName = items.adviceJson.doctorAdviceName
        // obj.count = items.count
        // obj.spec = items.adviceJson.countUnitName
        // obj.measure = items.measure
        // obj.measureUnitName = items.adviceJson.measureUnitName
        // obj.employName = items.adviceJson.employName
        // obj.useFreqName = items.adviceJson.useFreqName
        // obj.useDay = items.useDay
        // obj.doctorAdviceId = items.doctorAdviceId
        // obj.dispensingStatus = items.dispensingStatus
        // this.tableData.push(obj)
        items.adviceFeesDtoList.forEach(item => {
          let obj = {}
          obj.sumPrice = items.advicePrice
          obj.sellingPriceTotal = item.sellingPriceTotal
          obj.doctorAdviceName = items.adviceJson.doctorAdviceName
          obj.count = items.count
          obj.spec = item.countUnitName
          obj.measure = items.measure
          obj.measureUnitName = items.adviceJson.measureUnitName
          obj.useFreqName = items.adviceJson.useFreqName
          obj.employName = items.adviceJson.employName
          obj.useDay = items.useDay
          obj.doctorAdviceId = items.doctorAdviceId
          obj.dispensingStatus = items.dispensingStatus
          this.tableData.push(obj)
        })
      } else if ([...TRADITIONAL_CHINESE_PIECES, ...TRADITIONAL_CHINESE_GRANULE].includes(items.serviceType)) {
        // items.adviceFeesDtoList.forEach(item => {
        //   let obj = {}
        //   obj.advicePrice = items.advicePrice
        //   obj.count = items.count
        //   obj.useFreqName = items.adviceJson.useFreqName
        //   obj.employName = items.adviceJson.employName
        //   obj.decoctFlag = items.decoctFlag ? '是' : '否'
        //   obj.name = ''
        //   obj.name += item.serviceName + '、' + item.count + item.countUnitName + (item.decoctionName ? '、' + item.decoctionName : '')
        //   obj.doctorAdviceId = items.doctorAdviceId
        //   obj.dispensingStatus = items.dispensingStatus
        //   this.details.push(obj)
        // })
        items.adviceFeesDtoList.forEach(item => {
          let obj = {}
          obj.sumPrice = items.advicePrice
          obj.advicePrice = (item.count * item.price).toFixed(2)
          obj.count = items.count
          obj.useFreqName = items.adviceJson.useFreqName
          obj.employName = items.adviceJson.employName
          obj.decoct = items.decoct
          obj.serviceName = item.serviceName
          obj.count = items.count
          obj.countUnitName = item.countUnitName
          obj.footnote = item.footnote
          // obj.decoctFlag = items.decoctFlag ? '是' : '否'
          // obj.name = ''
          // obj.name += item.serviceName + '、' + item.count + item.countUnitName + '、' + item.decoctionName
          obj.doctorAdviceId = items.doctorAdviceId
          obj.dispensingStatus = items.dispensingStatus
          this.details.push(obj)
        })
      } else if ([...EXAMINATION].includes(items.serviceType)) {
        let obj = {}
        obj.doctorAdviceName = items.adviceJson.doctorAdviceName
        obj.positionName = items.adviceJson.positionName
        obj.orgName = items.adviceJson.orgName
        obj.executeProviderName = items.adviceJson.executeProviderName || '--'
        obj.advicePrice = items.advicePrice
        this.inspectArr.push(obj)
      } else if ([...INSPECT].includes(items.serviceType)) {
        let obj = {}
        obj.doctorAdviceName = items.adviceJson.doctorAdviceName
        obj.specimenTypeName = items.adviceJson.specimenTypeName || '--'
        obj.orgName = items.adviceJson.orgName
        obj.executeProviderName = items.adviceJson.executeProviderName || '--'
        obj.checkGuidance = items.adviceJson.checkGuidance || '--'
        obj.advicePrice = items.advicePrice
        this.testArr.push(obj)
      }
    }
  },
  watch: {
    resultData: {
      handler (v) {
        this.setInfo(v)
      },
      deep: true
    }
  }
}
</script>
<style lang='less' scoped>
.label-tip {
  line-height: 16px;
  margin-bottom: 10px;
  &:before {
    content: "";
    display: inline-block;
    position: relative;
    top: 4px;
    height: 14px;
    margin-right: 5px;
    border: 2px solid #1c7bef;
    border-radius: 2px;
  }
}
.value-info {
  font-size: 14px;
  line-height: 14px;
  color: #333;
  margin-right: 20px;
}
</style>
