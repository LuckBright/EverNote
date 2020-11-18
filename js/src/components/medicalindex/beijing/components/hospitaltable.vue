<template>
  <div class="chuyuan">
    <el-table class="noborder"
              :data="tableData"
              :span-method="arraySpanMethod">
      <el-table-column label="出院诊断"
                       width="293">
        <template slot-scope="scope">
          <span v-if="scope.$index === 0"
                style="font-weight: 600;">主要诊断:</span>
          <span v-if="scope.$index === 1"
                style="font-weight: 600;">其他诊断:</span>
          <!-- 其他诊断 -->
          <div class="inline"
               v-if="scope.$index !== tableData.length - 1 && scope.$index !== 0">
            <m-other :index="scope.row.index1"
                     :value="diagnosis"
                     @change="changeOther"></m-other>
          </div>
          <!-- 主诊断 -->
          <div class="inline"
               v-if="scope.$index === 0">
            <el-diagnosis :value="value"
                          :prop="ZHU_ZHEN_DUAN_NAME"
                          :index="scope.$index"
                          @change="changeZhuyao"></el-diagnosis>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="疾病编码"
                       width="65">
        <template slot-scope="scope">
          <!-- 主诊断 -->
          <div class="inline">
            <m-input v-if="scope.$index === 0"
                     readonly
                     :value="value"
                     :prop="ZHU_ZHEN_DUAN_CODE"></m-input>
            <m-input v-else
                     readonly
                     :value="diagnosis[scope.row.index1]"
                     :prop="QI_TA_CODE"></m-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="入院病情"
                       width="35">
        <template slot-scope="scope">
          <div v-if="scope.$index === tableData.length - 1">
            <label class="el-form-item__label first">入院病情</label>
            <span class="span">1.有 2.临床未确定 3.情况不明 4.无</span>
          </div>
          <m-state v-if="scope.$index !== 0 && scope.$index !== tableData.length - 1"
                   :value="diagnosis"
                   :index="scope.row.index1"
                   @change="changeState"></m-state>
          <m-state v-if="scope.$index === 0"
                   :value="value"
                   prop="ZHU_BING_QING_CODE"
                   @change="change"></m-state>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       label="出院诊断"
                       width="292">
        <template slot-scope="scope">
          <span v-if="scope.$index === 0"
                style="font-weight: 600;">其他诊断:</span>
          <div class="inline">
            <m-other :index="scope.row.index2"
                     :value="diagnosis"
                     @change="changeOther"></m-other>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="疾病编码"
                       width="65">
        <template slot-scope="scope">
          <m-input  v-if="scope.$index <= 20"
                     readonly
                     :value="diagnosis[scope.row.index2]"
                     :prop="QI_TA_CODE"></m-input>
        </template>
      </el-table-column>
      <el-table-column width="35"
                       label="入院病情">
        <template slot-scope="scope">
          <m-state :value="diagnosis"
                   :index="scope.row.index2"
                   @change="changeState"></m-state>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import elDiagnosis from '@/components/medicalindex/components/diagnosis'
import { keyMap, keyObj } from '../keymap'
import mInput from '@/components/medicalindex/components/minput'
import mOther from './mother'
import mState from './mstate'

export default {
  props: {
    value: Object,
  },
  data () {
    return {
      ...keyObj,
      ...keyMap,
      tableData: [
        { index2: 0 },
        { index1: 1, index2: 2 },
        { index1: 3, index2: 4 },
        { index1: 5, index2: 6 },
        { index1: 7, index2: 8 },
        { index1: 9, index2: 10 },
        { index1: 11, index2: 12 },
        { index1: 13, index2: 14 },
        { index1: 15, index2: 16 },
        { index1: 17, index2: 18 },
        { index1: 19, index2: 20 },
        { index1: 19, index2: 21 }
      ],
      dialogVisible: false,
      name: '',
      diagnosis: [] // 其它诊断
    }
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () { },
  watch: {
    'value.otherDiagnoses.length' () {
      const arr = this.value.otherDiagnoses
      if (Array.isArray(arr)) {
        arr.map((item, index) => {
          if (!this.diagnosis[item.index]) return
          for (let key in item) {
            this.diagnosis[item.index][key] = item[key]
          }
        })
      }
    },
  },
  methods: {
    init () {
      // 初始化其它疾病数据
      const { QI_TA_CODE, QI_TA_NAME, QI_TA_BING_QING_CODE } = this
      for (let i = 0; i <= 21; i++) {
        const obj = {
          [QI_TA_CODE]: '',
          [QI_TA_NAME]: '',
          [QI_TA_BING_QING_CODE]: '',
          index: i
        }
        this.diagnosis.push(obj)
      }
      // copy已有的数据
      const arr = this.value.otherDiagnoses
      if (Array.isArray(arr)) {
        arr.map((item, index) => {
          if (!this.diagnosis[item.index]) return
          for (let key in item) {
            this.diagnosis[item.index][key] = item[key]
          }
        })
      }
    },
    changeState (key, val, index) {
      this.$set(this.diagnosis[index], key, val)
      this.change('otherDiagnoses', this.diagnosis)
    },
    changeOther (val, index) {
      this.$set(this.diagnosis[index], this.QI_TA_NAME, val.diseaseName)
      this.$set(this.diagnosis[index], this.QI_TA_CODE, val.diseaseCode)
      this.change('otherDiagnoses', this.diagnosis)
    },
    changeZhuyao (val, index, prop) {
      this.change(keyMap.ZHU_ZHEN_DUAN_CODE, val.diseaseCode)
      this.change(keyMap.ZHU_ZHEN_DUAN_NAME, val.diseaseName)
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
.small {
  font-size: 10px;
}
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
    padding: 2px;
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
    line-height: 14px;
  }
  /deep/.el-table__header, /deep/.el-table__body{
    table-layout: auto;
    .gutter{
      padding: 0;
      border: none;
    }
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
      outline: none;
      width: 100%;
    }
  }
}
</style>
