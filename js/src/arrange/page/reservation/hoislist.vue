<template>
  <div class="hoiss">
    <div class="search">
      <ever-patient-select
        size="small"
        v-model.trim="patientName"
        @select="selectPatient"
        :scence="0"
        :allow-create="true"
        :dialog-show="false"
        :show-attr-type="false"
      ></ever-patient-select>      
      <!--<el-input v-model="patientName" placeholder="查找患者" @keyup.enter.native="search"></el-input>-->
      <div v-if="ishistory">
        <el-date-picker
          v-model="time"
          type="daterange"
          @change="timeChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="list">
      <ever-table
        v-if="tableData"
        table-class="flex_layout_scroll no-border"
        :table-loading="loading"
        :key="tableKey"
        :max-height="maxHeight"
        :columns="ishistory ? historycolumns : columns"
        :fixedHeight="fixedHeight"
        :highlight-current-row="true"
        :header-cell-class-name="headerCellClassNameFn"
        :data="tableDatas"
        @row-dblclick="rowClick"
        :row-class-name="rowClassName"
        :config-option="ishistory ? null : configOption"
      ></ever-table>
      <el-row type="flex" justify="end" v-if="ishistory">
        <el-col :span="24" align="right">
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :current-page.sync="current"
            :page-size="20"
            :pager-count="5"
            layout="total, prev, pager, next"
            :total="totalCounts">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { QUEUE_MANAGEMENT, tableColWidth } from '@/util/table-config'
import list from '@/util/list'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
export default {
  mixins: [list],
  props: ['tableDatas', 'indexObj', 'ishistory', 'totalCounts', 'tablePage', 'activeName'],
  data () {
    return {
      tableKey: U(),
      loading: false,
      patientName: '',
      maxHeight: '480',
      fixedHeight: 32,
      columns: [
        {
          prop: 'status',
          label: '状态',
          width: tableColWidth.name4W80,
          beforeHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.status === 1) html += `<span class="s1">未到诊</span>`
            if (row.status === 3) html += `<span class="s1">候诊</span>`
            if (row.status === 4 || row.status === 6) html += `<span class="s1" style="background: #E4E4E4">已诊</span>`
            if (row.status === 5) html += `<span class="s1" style="background: #C4E1E8">回诊</span>`
            return html
          },
          formatter: ({ row }) => ' '
        },
        {
          prop: 'patientName',
          label: '姓名',
          showOverflowTooltip: true,
          beforeHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.patientName && row.patinetSex && row.patinetAge) html += `<span class="name_style">${row.patientName}</span> ${row.patinetSex} ${row.patinetAge}`
            if (row.patientName && row.patinetSex) html += `<span class="name_style">${row.patientName}</span> ${row.patinetSex}`
            if (row.patientName) html += `<span class="name_style">${row.patientName}</span>`
            return html
          },
          formatter: ({ row }) => ' '
        },
        {
          prop: 'visitType',
          label: '渠道',
          formatter: ({ row }) => {
            return row.visitType === 1 ? '门诊' : row.visitType === 3 ? '住院' : ''
          },
          hidden: false,
        },
        {
          prop: 'serviceType',
          label: '类型',
          hidden: true,
        },
        {
          prop: 'appointmentNum',
          label: '号'
        },
        {
          prop: 'waitingTime',
          label: '时间'
        },
        {
          prop: 'appointWay',
          label: '挂号方式'
        }
      ],
      historycolumns: [
        {
          prop: 'patientName',
          label: '姓名',
          showOverflowTooltip: true,
          beforeHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.patientName && row.patinetSex && row.patinetAge) html += `<span class="name_style">${row.patientName}</span> ${row.patinetSex} ${row.patinetAge}`
            if (row.patientName && row.patinetSex) html += `<span class="name_style">${row.patientName}</span> ${row.patinetSex}`
            if (row.patientName) html += `<span class="name_style">${row.patientName}</span>`
            return html
          },
          formatter: ({ row }) => ' '
        },
        {
          prop: 'patinetSex',
          label: '性别',
          width: '40',
          showOverflowTooltip: true,
          formatter: ({ row }) => {
            if (row.patientSex === '1') {
              row.patientSex = '男'
            } else if (row.patientSex === '2') {
              row.patientSex = '女'
            } else if (row.patientSex === '0') {
              row.patientSex = '未知'
            } else if (row.patientSex === '9') {
              row.patientSex = '未说明'
            }
            return row.patientSex
          }
        },
        {
          prop: 'patientAge',
          label: '年龄',
          width: '40'
        },
        {
          prop: 'treatmentTime',
          label: '就诊时间',
          width: '124',
          formatter: ({ row }) => {
            return this.$moment(row.treatmentTime).format('YYYY-MM-DD HH:mm')
          },
          showOverflowTooltip: true
        },
        {
          prop: 'subsequentvisit',
          label: '状态',
          width: '40',
          formatter: ({ row }) => {
            let r = row.subsequentVisit
            switch (r) {
              case -1: r = '未知'
                break
              case 0: r = '初诊'
                break
              case 1: r = '复诊'
                break
              case 2: r = '转诊'
                break
              case 3: r = '急诊'
                break
              case 4: r = '体检'
                break
              case 5: r = '简易'
                break
              case 6: r = '疫苗'
                break
              case 7: r = '团队体检'
                break
            }
            return r
          }
        }
      ],
      configOption: { id: QUEUE_MANAGEMENT },
      defaultRowStatus: true,
      startDate: '',
      endDate: '',
      time: '',
      patient: '',
      medicalUpdateStatus: false,
      isAutoSaveStatus: false
    }
  },
  mounted () {
    this.$bus.$off('medicalUpdateStatus')
    this.$bus.$on('medicalUpdateStatus', status => {
      this.medicalUpdateStatus = status
    })
    // 通知病历是否在自动保存
    this.$bus.$off('medicalAutoSave')
    this.$bus.$on('medicalAutoSave', (status) => {
      this.isAutoSaveStatus = status
    })
  },
  watch: {
    'ishistory': {
      handler () {
        this.tableKey = U()
      },
      immediate: true,
    },
    'tablePage' (val) {
      this.current = val
    },
    'activeName' (val) {
      this.patient = ''
      this.patientName = ''
    },
    '$route.query': {
      handler (val) {
        this.medicalUpdateStatus = false
        this.isAutoSaveStatus = false
      },
      immediate: true
    }
  },
  methods: {
    selectPatient (val) {
      this.patient = val
      this.$emit('search', {
        patientId: val && val.id ? val.id : '',
        patientName: val && val.name ? val.name : '',
        startDate: this.startDate,
        endDate: this.endDate,
        type: 'search'
      })
    },
    rowClassName ({ row, rowIndex }) {
      row.index = rowIndex
      if ((this.indexObj.rowIndex === rowIndex) && this.indexObj.tabIndex === this.indexObj.oldTabIndex) {
        return 'current-row-color'
      }
    },
    async rowClick (row, column, event) {
      if (this.isAutoSaveStatus && this.medicalUpdateStatus) {
        return this.$messageTips(this, 'warning', '病历正在自动保存中，请稍后切换！')
      }
      // 切换患者是判断病历保存状态
      if (this.medicalUpdateStatus) {
        this.$confirm('页面尚有信息未保存，切换后信息将会被清空，是否切换？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.indexObj.rowIndex = row.row.index
          row.row.rowIndex = row.row.index
          row.row.tabIndex = this.indexObj.tabIndex
          this.$emit('rowclickemit', row.row)
          this.medicalUpdateStatus = false
        }).catch(() => {

        })
      } else {
        this.indexObj.rowIndex = row.row.index
        row.row.rowIndex = row.row.index
        row.row.tabIndex = this.indexObj.tabIndex
        this.$emit('rowclickemit', row.row)
        this.medicalUpdateStatus = false
      }
    },
    // 给header设置类名
    headerCellClassNameFn ({ row, column, rowIndex, columnIndex }) {
      return 'th-style'
    },
    timeChange (value) {
      if (value) {
        this.startDate = this.$moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        this.endDate = this.$moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.startDate = ''
        this.endDate = ''
      }
      this.$emit('search', {
        patientId: this.patient && this.patient.id ? this.patient.id : '',
        patientName: this.patient && this.patient.name ? this.patient.name : '',
        startDate: this.startDate,
        endDate: this.endDate,
        type: 'search'
      })
    },
    handleCurrentChange (val) {
      this.$emit('getPageInfo', {offset: val, pagesize: 20})
    }
  }
}
</script>
<style lang="scss" scoped>
.hoiss {
  margin-top: 60px;
}
.search {
  position: relative;
  padding-left: 11px;
  padding-right: 11px;
  /deep/ .el-date-editor--daterange {
    width: 330px;
    margin-top: 10px;
    .el-range-input {
      background-color: #f1f1f1;
    }
  }
}
.list {
  /deep/ .el-table .current-row-color {
    &:hover > td {
      background-color: #007aff;
    }
    background-color: #007aff !important;
    .cell-content {
      color: #ffffff;
    }
    .name_style {
      color: #ffffff;
    }
  }
  /deep/ .el-table tr {
    height: 32px;
  }
  /deep/ .s1 {
    background: #d1e8c4;
    border-radius: 2px;
    padding: 0px 3px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #000000;
  }
  /deep/ .cell-content {
    color: #999999;
  }
  /deep/ .name_style {
    color: #000;
    font-family: PingFangSC-Semibold;
  }
  /deep/ .el-table {
    border-left: 1px solid #cccccc !important;
    border-right: 1px solid #cccccc !important;
    .tr {
      height: 32px !important;
    }
    .td {
      border: none !important;
    }
  }
  /deep/ .th-style {
    color: #999999 !important;
    font-size: 12px;
  }
  /deep/ .el-table__row {
    cursor: pointer;
  }
}
.search /deep/ .el-input__inner {
  background-color: #f1f1f1;
}
.packup {
  text-align: center;
}
.search i {
  position: absolute;
  top: 7px;
  right: 20px;
  font-size: 22px;
}
section {
  max-height: 604px;
}
.draw-enter-active,
.draw-leave-active {
  transition: all 0.5s ease;
}
.draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
  max-height: 0;
}
</style>
