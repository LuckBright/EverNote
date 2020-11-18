<template>
  <div>
    <div>以患者用药天数
      <el-input-number v-model="day" size="mini" style="width: 100px" class="ml10 mr10" @change="handleChange" :controls="false" :min="1" :max="999" :precision="0"></el-input-number>天为例，以 <strong class="blue">{{name}}</strong> 开医嘱</div>
    <h4>根据已录入的数据，检测结果如下：</h4>
    <div>
      医嘱名称：{{adviceName}} - {{obj.SXX000010}} {{unitName}}
    </div>
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        width="80"
        label="默认剂量">
        <template slot-scope="scope">
          <span v-if="scope.row[DOSE]">{{scope.row[DOSE]}} {{unitName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="180"
        label="默认途径">
        <template slot-scope="scope">
          <span v-if="channelName">{{channelName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="默认频次">
        <template slot-scope="scope">
          <span v-if="frequencyName">{{frequencyName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        label="天数">
        <template slot-scope="scope">
          {{day}} 天
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="按制剂单位总用量">
        <template slot-scope="scope">
          <span v-if="totalNum1">
            {{totalNum1}}
            {{preparationUnitName}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="按包装单位总用量">
        <template slot-scope="scope">
          <span v-if="totalNum2">
            {{totalNum2}}
            {{packageUnitObj.name}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 成药规格 \ 成分规格 \ 剂量 \ 是否允许复用
import { MEDICINE_SPEC_CODE, COMPONENT_SPEC_CODE, DOSE, MULTIPLEX_CODE } from '@/util/common'
export default {
  // type  计量单位 1:成分  2:成药  3:制剂
  props: ['params', 'obj', 'type', 'name', 'schema', 'unitName', 'channelName', 'frequencyName', 'adviceName', 'frequencyNum', 'preparationUnitName', 'packageUnitName', 'packageUnitObj'],
  data () {
    return {
      tableData: [],
      DOSE,
      day: 1,
      totalNum1: '',
      totalNum2: '',
      frequencyList: [] // 频次
    }
  },
  created () {
    this.tableData.push(this.obj)
    this.calc()
  },
  methods: {
    handleChange () {
      this.calc()
    },
    calc () {
      const isRepeatVal = 2104
      const isRepeat = Number(this.obj[MULTIPLEX_CODE]) // 2104:是  2105:否
      // 取制剂： （剂量 * 频次 * 天数）/ 包装转换比   结果向上取整
      // 取成分或成药： 如果可以重复使用（isReused === 1）：[（剂量/制剂成分转换比） * 频次 * 天数] / 包装转换比  结果向上取整；
      // 如果不可重复使用(isReused !== 1)：[（剂量/制剂成分转换比）向上取整 * 频次 * 天数] / 包装转换比  结果向上取整
      switch (this.type) {
        case 1:
        case 2:
          // 成分-成药
          const tempCode = this.type === 1
            ? COMPONENT_SPEC_CODE
            : MEDICINE_SPEC_CODE
          if (isRepeat === isRepeatVal) { // 重复使用
            this.totalNum1 = Math.ceil((this.obj[DOSE] / this.obj[tempCode]) * this.frequencyNum * this.day)
          } else {
            this.totalNum1 = Math.ceil(this.obj[DOSE] / this.obj[tempCode]) * this.frequencyNum * this.day
          }
          break
        case 3:
          // 制剂
          this.totalNum1 = this.obj[DOSE] * this.frequencyNum * this.day
          break
      }
      this.totalNum2 = this.packageUnitObj.value ? Math.ceil(this.totalNum1 / this.packageUnitObj.value) : ''
    }
  },
  watch: {
    day (v) {
      if (!v || v <= 0) {
        this.day = 1
      }
    }
  }
}
</script>

