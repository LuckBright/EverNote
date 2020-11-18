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
          <span style="font-size:10px">{{ scope.row[SHOU_SHU_NAME] }}</span>
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
            <m-person :dpt-id="dptId"
                      :type="['DOCTOR']"
                      :value="scope.row"
                      :index="scope.$index"
                      @change="change"
                      :prop="SHU_ZHE"></m-person>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         width="80"
                         label="Ⅰ助">
          <template slot-scope="scope">
            <m-person :dpt-id="dptId"
                      :type="['DOCTOR']"
                      :value="scope.row"
                      :index="scope.$index"
                      @change="change"
                      :prop="YI_ZHU"></m-person>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         width="80"
                         label="Ⅱ助">
          <template slot-scope="scope">
            <m-person :dpt-id="dptId"
                      :type="['DOCTOR']"
                      :value="scope.row"
                      :index="scope.$index"
                      @change="change"
                      :prop="ER_ZHU"></m-person>
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
                    @change="change"
                    :prop="YU_HE_DENG_JI"></m-qiekou>
        </template>
      </el-table-column>
      <el-table-column prop="address"
                       label="麻醉医师">
        <template slot-scope="scope">
          <m-person :dpt-id="dptId"
                    :type="['DOCTOR']"
                    :value="scope.row"
                    :index="scope.$index"
                    @change="change"
                    :prop="MA_ZUI_SHI"></m-person>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import hrDiv from '@/components/medicalindex/components/hrdiv'
import elOp from './operation'
import elMazui from './mazui'
import { keyMap } from '../phrmap'
import mDate from '@/components/medicalindex/components/mdate'
import mGrade from './mgrade'
import mInput from '@/components/medicalindex/components/minput'
import mQiekou from './mqiekou'
import mPerson from '@/components/medicalindex/components/person'

const {
  SHOU_SHU_BIAN_MA,
  SHOU_SHU_NAME,
  SHOU_SHU_JI_BIE,
  SHOU_SHU_DATE,
  SHU_ZHE,
  YI_ZHU,
  ER_ZHU,
  MA_ZUI_FANG_SHI_VALUE,
  MA_ZUI_FANG_SHI_CODE,
  YU_HE_DENG_JI,
  MA_ZUI_SHI
} = keyMap
export default {
  props: {
    value: Object,
    dptId: String
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
  watch: {
    'value.surgeryList.length' () {
      const arr = this.value.surgeryList
      if (Array.isArray(arr)) {
        this.value.surgeryList.map((item, index) => {
          this.tableData[item.indexNum] = item
        })
      }
    }
  },
  methods: {
    init () {
      const template = []
      for (let i = 0; i < 8; i++) {
        const obj = {
          [SHOU_SHU_BIAN_MA]: '',
          [SHOU_SHU_NAME]: '',
          [SHOU_SHU_DATE]: '',
          [SHOU_SHU_JI_BIE]: '',
          [SHOU_SHU_DATE]: '',
          [SHU_ZHE]: '',
          [YI_ZHU]: '',
          [ER_ZHU]: '',
          [MA_ZUI_FANG_SHI_VALUE]: '',
          [MA_ZUI_FANG_SHI_CODE]: '',
          [YU_HE_DENG_JI]: '',
          [MA_ZUI_SHI]: '',
          index: i
        }
        template.push(obj)
      }
      this.tableData = template
      const arr = this.value.surgeryList
      if (Array.isArray(arr)) {
        arr.map(item => {
          this.$set(this.tableData, item.indexNum, item)
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
    change (prop, val, index) {
      this.tableData[index][prop] = val
      this.$emit('change', 'surgeryList', this.tableData)
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
    mQiekou,
    mPerson
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
    line-height: 14px;
    text-align: center;
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
  /deep/.el-table__header, /deep/.el-table__body{
    table-layout: auto;
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
