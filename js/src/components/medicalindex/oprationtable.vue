<template>
  <div class="opration diag">
    <el-table class="noborder"
              :data="tableData"
              style="width: 208mm"
              :span-method="arraySpanMethod">
      <el-table-column prop="date"
                       width="85">
        <template slot="header">
          <p style="text-align:center;margin: 0px;">手术及</p>
          <p style="text-align:center;margin: 0px;">操作编码</p>
        </template>
        <template slot-scope="scope">
          <el-op :value="scope.row"
                 :index="scope.$index"
                 @change="changeCode"></el-op>
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       width="115">
        <template slot="header">
          <p style="text-align:center;margin: 0px;">手术及</p>
          <p style="text-align:center;margin: 0px;">操作日期</p>
        </template>
        <template slot-scope="scope">
          <m-date :value="scope.row"
                  format="yyyy-MM-dd HH:mm"
                  :prop="SHOU_SHU_DATE"
                  :index="scope.$index"
                  @change="change"
                  type="datetime"></m-date>
        </template>
      </el-table-column>
      <el-table-column prop="address"
                       label="手术级别"
                       width="26">
        <template slot-scope="scope">
          <m-grade :value="scope.row"
                   :index="scope.$index"
                   @change="change"></m-grade>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       width="90">
        <template slot="header">
          <p style="text-align:center;margin: 0px;">手术及</p>
          <p style="text-align:center;margin: 0px;">操作名称</p>
        </template>
        <template slot-scope="scope">
          <el-input type="textarea"
                    resize="none"
                    readonly
                    :rows="3"
                    placeholder="—"
                    v-model="scope.row[SHOU_SHU_NAME]"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       width="80">
        <template slot="header">
          <p style="text-align:center;margin: 0px;">手术及操作医师</p>
        </template>
        <el-table-column prop="name"
                         width="80"
                         label="术者">
          <template slot-scope="scope">
            <m-input :value="scope.row"
                     :index="scope.$index"
                     @change="change"
                     :prop="SHU_ZHE"></m-input>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         width="80"
                         label="Ⅰ助">
          <template slot-scope="scope">
            <m-input :value="scope.row"
                     :index="scope.$index"
                     @change="change"
                     :prop="YI_ZHU"></m-input>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         width="80"
                         label="Ⅱ助">
          <template slot-scope="scope">
            <m-input :value="scope.row"
                     :index="scope.$index"
                     @change="change"
                     :prop="ER_ZHU"></m-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="address"
                       label="麻醉方式">
        <template slot-scope="scope">
          <el-mazui :value="scope.row"
                    :index="scope.$index"
                    @change="changeMazui"></el-mazui>
        </template>
      </el-table-column>
      <el-table-column prop="address"
                       label="切口愈合等级"
                       width="60">
        <template slot-scope="scope">
          <m-qiekou :value="scope.row"
                    :index="scope.$index"
                    @change="change"></m-qiekou>
        </template>
      </el-table-column>
      <el-table-column prop="address"
                       label="麻醉医师">
        <template slot-scope="scope">
          <m-input :value="scope.row"
                   :index="scope.$index"
                   @change="change"
                   :prop="MA_ZUI_SHI"></m-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import hrDiv from './hrdiv'
import elOp from './operation'
import elMazui from './mazui'
import { keyMap } from '@/components/medicalindex/keymap'
import mDate from '@/components/medicalindex/mdate'
import mGrade from '@/components/medicalindex/mgrade'
import mInput from '@/components/medicalindex/minput'
import mQiekou from '@/components/medicalindex/mqiekou'

export default {
  props: {
    value: Object
  },
  data () {
    return {
      ...keyMap,
      tableData: [],
      dialogVisible: false,
      name: '',
      levelOprions: []
    }
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () { },
  watch: {},
  methods: {
    init () {
      // 初始化其它疾病数据
      for (let i = 0; i < 8; i++) {
        const obj = {
          [this.SHOU_SHU_BIAN_MA]: '',
          [this.SHOU_SHU_NAME]: '',
          [this.SHOU_SHU_DATE]: '',
          [this.SHOU_SHU_JI_BIE]: '',
          [this.SHOU_SHU_DATE]: '',
          [this.SHU_ZHE]: '',
          [this.YI_ZHU]: '',
          [this.ER_ZHU]: '',
          [this.MA_ZUI_FANG_SHI]: '',
          [this.YU_HE_DENG_JI]: '',
          [this.MA_ZUI_SHI]: '',
          index: i
        }
        this.tableData.push(obj)
      }
      const arr = this.value.surgeries
      if (Array.isArray(arr)) {
        this.value.surgeries.map((item, index) => {
          this.tableData[item.index] = item
        })
      }
    },
    show () {
      this.dialogVisible = true
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
    },
    isArrayFn (arr) {
      return Array.isArray(arr) ? arr : []
    },
    change (prop, val, index) {
      this.tableData[index][prop] = val
      this.$emit('change', 'surgeries', this.tableData)
    },
    changeMazui (item, index) {
      this.change(this.MA_ZUI_FANG_SHI_VALUE, item.name, index)
      this.change(this.MA_ZUI_FANG_SHI_CODE, item.code, index)
    },
    changeCode (item, index) {
      this.change(this.SHOU_SHU_NAME, item.name, index)
      this.change(this.SHOU_SHU_BIAN_MA, item.code, index)
    }
  },
  components: {
    hrDiv,
    elOp,
    elMazui,
    mDate,
    mGrade,
    mInput,
    mQiekou
  }
}
</script>
<style scoped lang="scss">
.inline {
  display: inline-block;
}
.opration {
  margin-left: 2px;
  /deep/.el-table {
    border: 1px solid #000;
  }
  /deep/.el-table .cell {
    padding: 0px;
  }
  /deep/.el-table td,
  /deep/.el-table th {
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  /deep/.el-table th {
    background: #fff;
  }
  /deep/.el-table:not(.no-hover) tr.hover-row td,
  /deep/.el-table:not(.no-hover) tr:hover td {
    background-color: #fff;
  }
  /deep/ .el-textarea .el-textarea__inner {
    border: none;
    padding: 0px;
  }
  /deep/ .el-form--inline .el-form-item {
    margin-bottom: 0px;
    margin-right: 0px;
    height: 20px;
    .el-input .el-input__inner {
      border: none;
      border-radius: unset;
      border-bottom: 0px solid black;
      height: 20px;
      line-height: 20px;
      padding: 0px;
    }
  }
  .noborder /deep/ .el-table__body .el-input .el-input__inner {
    padding: 0px;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border: 0px solid #bbb;
    box-sizing: border-box;
    color: #000;
    display: inline-block;
    font-size: inherit;
    height: 20px;
    line-height: 20px;
    outline: none;
    width: 100%;
  }
}
</style>
