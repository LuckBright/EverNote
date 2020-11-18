<template>
  <div>
    <div class="layout_inner">
      <el-row class="payment-home">
        <el-col :span="12">
          <div class="content pos_re">
            <el-row>
              <el-col :span="8" style="text-align:left;"
                >今日收费总额:
                {{ overviewObj.paidAmount | formatToFinacial }}</el-col
              >
              <el-col :span="8" style="text-align:center;"
                >未支付金额:
                {{ overviewObj.noAmount | formatToFinacial }}</el-col
              >
              <el-col :span="8" style="text-align:right;"
                ><el-button @click="modulerightbtn(1)"
                  >结算单查询</el-button
                ></el-col
              >
            </el-row>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column
                v-for="(item, index) in arr"
                :key="index"
                :label="item.name"
              >
                <template slot-scope="scope">
                  {{ scope.row[item.name] | formatToFinacial }}
                </template>
              </el-table-column>
            </el-table>
            <el-row class="home-pay-row">
              <el-col :span="12" style="text-align:left;"
                ><el-button @click="modulerightbtn(2)"
                  >日结处理</el-button
                ></el-col
              >
              <el-col :span="12" style="text-align:right;"
                ><el-button @click="modulerightbtn(3)"
                  >日结查询</el-button
                ></el-col
              >
            </el-row>
          </div>
        </el-col>
        <el-col :span="12" id="dailyNewsletter">
          <div class="content pos_re">
            <el-row class="mb20">
              <el-col :span="24" style="text-align:left;"
                >当日门诊收费总览</el-col
              >
            </el-row>
            <ever-form2
              :schema="overviewSchema"
              v-model="overviewObj"
              ref="form"
              :span="12"
              :rules="overviewRules"
              :nosubmit="true"
              labelWidth="130px"
            >
              <template slot="totalFee">
                <span>{{ overviewObj.totalFee | formatToFinacial }}</span>
              </template>
              <template slot="registerFee">
                <span>{{ overviewObj.registerFee | formatToFinacial }}</span>
              </template>
              <template slot="kaiYaoAmount">
                <span>{{ overviewObj.kaiYaoAmount | formatToFinacial }}</span>
              </template>
            </ever-form2>
            <el-row class="home-pay-row">
              <el-col :span="12" style="text-align:left;"
                ><el-button @click="modulerightbtn(4)"
                  >日结汇总查询</el-button
                ></el-col
              >
              <el-col :span="12" style="text-align:right;"
                ><el-button @click="modulerightbtn(5)"
                  >日结查询</el-button
                ></el-col
              >
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/rcm/store/outpatient/settlepaymenthomeapi'
let overviewSchema = [
  {
    name: 'cashierCount',
    label: '收费员:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0',
      slotVal: '人'
    },
    span: 8
  },
  {
    name: 'closedCount',
    label: '已经日结:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0',
      slotVal: '人'
    },
    span: 8
  },
  {
    comp: 'div',
    label: '',
    style: {
      height: '42px'
    },
    span: 8
  },
  {
    name: 'patientCount',
    label: '门诊总量:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0',
      slotVal: '人次'
    },
    span: 8
  },
  {
    name: 'initZenCount',
    label: '新患者:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0',
      slotVal: '人次'
    },
    span: 8
  },
  {
    name: 'repeatZenCount',
    label: '老患者:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0',
      slotVal: '人次'
    },
    span: 8
  },
  {
    name: 'totalFee',
    label: '收费总额:',
    comp: 'custom',
    span: 8
  },
  {
    name: 'registerFee',
    label: '其中挂号费:',
    comp: 'custom',
    span: 8
  },
  {
    name: 'kaiYaoAmount',
    label: '其中开药金额:',
    comp: 'custom',
    span: 8
  },
  {
    name: 'payPersonCount',
    label: '收费人次:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0'
    },
    span: 8
  },
  {
    name: 'noPatient',
    label: '未收费人次:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0'
    },
    span: 8
  },
  {
    name: 'kaiYaoPersonCount',
    label: '开药人次:',
    comp: 'everReadonlyItemContent',
    props: {
      defaultField: '0'
    },
    span: 8
  }
]
export default {
  data () {
    let overviewObj = this.$ever.createObjFromSchema(overviewSchema)
    return {
      overviewSchema,
      overviewObj,
      overviewRules: {},
      api,
      a: false,
      b: false,
      c: false,
      d: false,
      e: false,
      tableData: [],
      arr: []
    }
  },
  created () {
    this.getinfo()
    Object.assign(this.overviewObj)
  },
  methods: {
    getinfo () {
      api.info().then(result => {
        Object.assign(this.overviewObj, result.data)
        this.initData(result.data.paymethodSum || {})
      })
    },
    initData (data) {
      let arr = []
      let obj = {}
      let len = 1
      let a = 0
      for (let key in data) {
        if (len < 5) {
          arr.push({ name: key, rol: data[key] })
          obj[key] = data[key]
          len++
        } else {
          a += Number(data[key])
        }
      }
      if (a !== 0) {
        arr.push({ name: '其他', rol: a })
        obj['其他'] = a
      }
      this.arr = arr
      this.tableData.push(obj)
    },
    modulerightbtn (key) {
      let url = ''
      switch (key) {
        case 1:
          url = '/rcm/settlements'
          break
        case 2:
          url = '/rcm/daily/settlement/3'
          break
        case 3:
          url = '/rcm/dailysettlement/list'
          break
        case 4:
          url = '/rcm/daily/collectSettlement'
          break
        case 5:
          url = '/rcm/outpatient/summary'
          break
      }
      window.scrollTo(0, 0)
      this.$router.push({
        path: url,
        query: {}
      })
    }
  }
}
</script>
<style lang="less" scoped>
.layout_inner #dailyNewsletter /deep/ .el-form-item__label {
  font-size: 16px;
}
.layout_inner #dailyNewsletter /deep/ .el-form-item__content > span {
  font-size: 16px;
}
.layout_inner {
  margin-top: 20px;
}
.payment-home {
  .content {
    height: 350px;
    border: 1px solid#dcdfe6;
    padding: 20px;
  }
  .el-col-12 {
    padding: 20px;
  }
}
.home-pay-row {
  position: absolute;
  width: 100%;
  bottom: 23px;
  left: 0px;
  padding: 0px 15px;
}
</style>
