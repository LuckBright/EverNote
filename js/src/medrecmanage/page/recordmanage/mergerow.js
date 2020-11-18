import {findLastIndex} from 'lodash'
export default{
  methods: {
    afterSearch(table) {
      // obj: {// key：起始行index，value：合并行数
      //   0: 2,
      //   2: 2,
      //   5: 3
      // }
      this.mergeRowRule = {}
      let tableData = table.result
      let patientObj = {}
      tableData.forEach((item, index) => {
        if (patientObj[item.visitId]) {
          patientObj[item.visitId]++
        } else {
          patientObj[item.visitId] = 1
        }
      })
      for (let visitId in patientObj) {
        let lastIndex = findLastIndex(tableData, item => item.visitId === visitId)
        let index = tableData.findIndex(item => item.visitId === visitId)
        this.mergeRowRule[index] = patientObj[visitId]
        // 防止出院时间丢失（危险操作，请勿模仿）
        this.$set(this.$refs.table.localData[index], 'leaveHospitalTime', this.$refs.table.localData[lastIndex].leaveHospitalTime)
      }
    },
    mergeRow ({row, column, rowIndex, columnIndex}) {
      if (!this.mergeRowRule) return
      for (let key in this.mergeRowRule) {
        let min = Number(key)
        let max = this.mergeRowRule[key] + Number(key)
        let rowspan = this.mergeRowRule[key]
        if ([0, 1, 2, 3, 4, 5, 6].includes(columnIndex) && (rowIndex < max) && (rowIndex >= min)) {
          if (Object.keys(this.mergeRowRule).includes(rowIndex + '')) {
            return {
              rowspan: rowspan,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
  }
}
