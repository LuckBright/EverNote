<template>
  <div class="chuyuan">
    <el-table class="noborder" :data="tableData" :span-method="arraySpanMethod">
      <el-table-column label="出院中医诊断" width="292">
        <template slot-scope="scope">
          <label v-if="scope.$index === 0" class="el-form-item__label first"
            >主病</label
          >
          <label v-if="scope.$index === 1" class="el-form-item__label first"
            >主证</label
          >
          <!-- 其他诊断 -->
          <div
            class="inline"
            v-if="scope.$index !== tableData.length - 1 && scope.$index !== 0"
          >
            <m-other
              type="zhong"
              :index="scope.row.index1"
              :value="zhongData"
              @change="changeZhongOther"
            ></m-other>
          </div>
          <!-- 主诊断 -->
          <div class="inline" v-if="scope.$index === 0">
            <el-diagnosis
              :value="value"
              :prop="ZHONG_ZHU_BING_NAME"
              :index="scope.$index"
            ></el-diagnosis>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="疾病编码" width="60">
        <template slot-scope="scope">
          <!-- 主诊断 -->
          <div class="inline" v-if="scope.$index === 0">
            <m-input
              readonly
              :value="value"
              :prop="ZHONG_ZHU_BING_CODE"
            ></m-input>
          </div>
          <span style="font-size:10px" v-else>{{
            zhongData[scope.row.index1][ZHONG_ZHU_ZHENG_CODE]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入院病情" width="40">
        <template slot-scope="scope">
          <div v-if="scope.$index === tableData.length - 1">
            <label class="el-form-item__label first">入院病情</label>
            <span class="span">1.有 2.临床未确定 3.情况不明 4.无</span>
          </div>
          <m-state
            v-if="scope.$index !== 0 && scope.$index !== tableData.length - 1"
            :prop="ZHONG_ZHU_ZHENG_QING"
            :value="zhongData"
            :index="scope.row.index1"
            @change="changeZhongState"
          ></m-state>
          <m-state
            v-if="scope.$index === 0"
            :value="value"
            prop="ZHONG_ZHU_BING_QING"
            @change="change"
          ></m-state>
        </template>
      </el-table-column>
      <el-table-column label="出院西医诊断" width="292">
        <template slot-scope="scope">
          <label v-if="scope.$index === 0" class="el-form-item__label first"
            >主要诊断</label
          >
          <label v-if="scope.$index === 1" class="el-form-item__label first"
            >其他诊断</label
          >
          <!-- 其他诊断 -->
          <div
            class="inline"
            v-if="scope.$index !== 0"
          >
            <m-other
              type="xi"
              :index="scope.row.index2"
              :value="xiData"
              @change="changeXiOther"
            ></m-other>
          </div>
          <!-- 主诊断 -->
          <div class="inline" v-if="scope.$index === 0">
            <el-diagnosis
              :value="value"
              :prop="XI_ZHU_ZHEN_NAME"
              :index="scope.$index"
              @change="changeXiZhu"
            ></el-diagnosis>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="疾病编码" width="60">
        <template slot-scope="scope">
          <!-- 主诊断 -->
          <div class="inline" v-if="scope.$index === 0">
            <m-input readonly :value="value" :prop="XI_ZHU_ZHEN_CODE"></m-input>
          </div>
          <span v-else style="font-size:10px">{{
            xiData[scope.row.index2][QI_TA_ZHEN_CODE]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入院病情" width="40">
        <template slot-scope="scope">
          <m-state
            v-if="scope.$index !== 0"
            :value="xiData"
            :prop="QI_TA_ZHEN_QING"
            :index="scope.row.index2"
            @change="changeXiState"
          ></m-state>
          <m-state
            v-if="scope.$index === 0"
            :value="value"
            prop="XI_ZHU_ZHEN_QING"
            @change="change"
          ></m-state>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import elDiagnosis from '@/components/medicalindex/components/diagnosis'
import { keyMap } from '../phrmap'
import mInput from '@/components/medicalindex/components/minput'
import mOther from './mother'
import mState from './mstate'
const {
  ZHONG_ZHU_ZHENG_NAME,
  ZHONG_ZHU_ZHENG_CODE,
  ZHONG_ZHU_ZHENG_QING,
  QI_TA_ZHEN_NAME,
  QI_TA_ZHEN_CODE,
  QI_TA_ZHEN_QING
} = keyMap
export default {
  props: {
    value: Object
  },
  data () {
    return {
      ...keyMap,
      tableData: [
        { index1: '0', index2: '0' },
        { index1: '0', index2: '0' },
        { index1: 1, index2: 1 },
        { index1: 2, index2: 2 },
        { index1: 3, index2: 3 },
        { index1: 4, index2: 4 },
        { index1: 5, index2: 5 },
        { index1: 6, index2: 6 },
        { index1: 7, index2: 7 },
        { index1: 8, index2: 8 },
        { index1: 9, index2: 9 },
        { index1: '0', index2: 10 }
      ],
      dialogVisible: false,
      name: '',
      diagnosis: [], // 其它诊断
      xiData: [],
      zhongData: []
    }
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () {},
  watch: {
    'value.otherDiagnoseList.length' () {
      const arr = this.value.otherDiagnoseList
      if (Array.isArray(arr)) {
        arr.map((item, index) => {
          this.$set(this.xiData, item.indexNum, item)
        })
      }
    },
    'value.mainProveList.length' () {
      const arr = this.value.mainProveList
      if (Array.isArray(arr)) {
        arr.map((item, index) => {
          this.$set(this.zhongData, item.indexNum, item)
        })
      }
    }
  },
  methods: {
    initData (res, key, name, code, bingqing) {
      // 初始化其它疾病数据
      for (let i = 0; i <= 11; i++) {
        const obj = {
          [name]: '',
          [code]: '',
          [bingqing]: '',
          index: i
        }
        res.push(obj)
      }
      // copy已有的数据
      const arr = this.value[key]
      if (Array.isArray(arr)) {
        arr.map((item, index) => {
          if (res[item.indexNum]) {
            res[item.indexNum] = item
          }
        })
      }
    },
    init () {
      this.initData(
        this.zhongData,
        'mainProveList',
        ZHONG_ZHU_ZHENG_NAME,
        ZHONG_ZHU_ZHENG_CODE,
        ZHONG_ZHU_ZHENG_QING
      )
      this.initData(
        this.xiData,
        'otherDiagnoseList',
        QI_TA_ZHEN_NAME,
        QI_TA_ZHEN_CODE,
        QI_TA_ZHEN_QING
      )
    },
    changeZhongZhu (val) {
      this.change(keyMap.ZHONG_ZHU_BING_CODE, val.diseaseCode)
      this.change(keyMap.ZHONG_ZHU_BING_NAME, val.diseaseName)
    },
    changeZhongState (key, val, index) {
      this.zhongData[index][key] = val
      this.change('mainProveList', this.zhongData)
    },
    changeZhongOther (val, index) {
      this.zhongData[index][ZHONG_ZHU_ZHENG_NAME] = val.diseaseName
      this.zhongData[index][ZHONG_ZHU_ZHENG_CODE] = val.diseaseCode
      this.change('mainProveList', this.zhongData)
    },
    changeXiState (key, val, index) {
      this.xiData[index][key] = val
      this.change('otherDiagnoseList', this.xiData)
    },
    changeXiOther (val, index) {
      this.xiData[index][QI_TA_ZHEN_NAME] = val.diseaseName
      this.xiData[index][QI_TA_ZHEN_CODE] = val.diseaseCode
      this.change('otherDiagnoseList', this.xiData)
    },
    changeXiZhu (val) {
      this.change(keyMap.XI_ZHU_ZHEN_CODE, val.diseaseCode)
      this.change(keyMap.XI_ZHU_ZHEN_NAME, val.diseaseName)
    },
    change (key, val) {
      this.$emit('change', key, val)
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 11 && columnIndex <= 2) {
        if (columnIndex < 2) {
          return {
            rowspan: 1,
            colspan: 0
          }
        } else if (columnIndex === 2) {
          return {
            rowspan: 1,
            colspan: 3
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    }
  },
  components: {
    elDiagnosis,
    mInput,
    mOther,
    mState
  }
}
</script>
<style scoped lang="scss">
.inline {
  display: inline-block;
  width: 100%;
}
.chuyuan {
  .span {
    line-height: 30px;
    display: inline-block;
    height: 30px;
  }
  /deep/.el-table {
    border: 1px solid #000;
    border-right: 0px;
  }
  /deep/.el-table td,
  /deep/.el-table th {
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 0px;
  }
  /deep/.el-table th {
    background: #fff;
  }
  /deep/.el-table:not(.no-hover) tr.hover-row td,
  /deep/.el-table:not(.no-hover) tr:hover td {
    background-color: #fff;
  }
  /deep/.el-table .cell {
    padding: 0px;
  }
  /deep/.el-table__header, /deep/.el-table__body{
    table-layout: auto;
  }
  .noborder {
    /deep/ .el-table__body .el-input, /deep/ .el-table__body .el-input .el-input__inner {
      padding: 0px;
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border: none;
      box-sizing: border-box;
      color: #000;
      display: inline-block;
      font-size: inherit;
      outline: none;
      width: 100%;
    }
  }
}
</style>
