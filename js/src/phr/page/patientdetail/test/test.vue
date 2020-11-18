<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree
        :default-expand-all="true"
        ref=""
        node-key="id"
        :data="treedata"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
        <div
          v-if="treedata.length > 0"
          :class="{
            'custom-tree-node': true,
            'tree-checked': data.id === nowCheckNode.id,
          }"
          slot-scope="{ node, data }"
        >
          {{ data.label }}
        </div>
      </el-tree>
    </div>
    <div v-if="nowCheckNode" class="tree-detail">
      <div class="btn-box">
        <el-button size="medium" @click="showHistory">历史对比</el-button>
        <btn-popper :reportData="lineData"></btn-popper>
      </div>
      <div class="tree-detail-inner">
        <template
          v-if="
            nowCheckNode.result.resultReportSource === '2' &&
            nowCheckNode.result.pdfReportUrl
          "
        >
          <template
            v-for="item in JSON.parse(nowCheckNode.result.pdfReportUrl)"
          >
            <pdf-show
              :url="$ever.fileUrl2 + item.fileId"
              :key="item.fileId"
            ></pdf-show>
          </template>
        </template>
        <template v-if="nowCheckNode.result.resultReportSource !== '2'">
          <report :reportData="nowCheckNode" />
        </template>
      </div>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible" v-if="dialogVisible">
      <div class="history-box">
        <div class="change-box">
          <span
            class="mr20 icon iconfont icon-zhuyuan-bingli-tlieb"
            :class="{ active: type === 'table' }"
            @click="type = 'table'"
          ></span>
          <span
            class="btn icon iconfont icon-zhuyuan-bingli-tuxin"
            :class="{ active: type === 'chart' }"
            @click="type = 'chart'"
          ></span>
        </div>
        <div class="history-test-box">
          <div class="test-title">检验</div>
          <ul>
            <li
              :class="{
                checked:
                  item.inspectionResultDetailId ===
                  currentChart.inspectionResultDetailId,
              }"
              v-for="(item, index) in nowCheckNode.result.details"
              :key="item.inspectionItemId + index"
              @click="getChartData(item, 'change')"
            >
              {{ item.inspectionReportItemName }}({{
                item.inspectionItemNameAbbr
              }})
            </li>
          </ul>
        </div>
        <div class="history-chat-box" v-loading="loading">
          <div class="chat-title">{{ nowCheckNode.inspectionServiceName }}</div>
          <div class="chat-checkbox" v-show="type === 'chart'">
            <el-checkbox-group v-model="checkList" @change="changeCheckbox">
              <el-checkbox
                v-for="item in checkListOptions"
                :label="item.value"
                :key="item.value"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
          <div
            v-show="type === 'chart'"
            class="chat-box"
            ref="testChart"
            id="testChart"
            style="width: 600px; height: 400px"
          ></div>
          <div
            v-show="type === 'table'"
            class="chat-box"
            style="width: 600px; height: 400px"
          >
            <ever-table ref="table" :columns="columns" :data="tableData" border :row-class-name="classFn">
            </ever-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import btnPopper from './components/btnpopper'
import report from './components/report'
import pdfShow from '@/phr/component/pdf-show'
import { request } from '@/util/req'
import urls from '@/phr/api/urls'
export default {
  data () {
    return {
      type: 'chart',
      loading: false,
      tableData: [],
      columns: [
        {
          prop: 'inspectionExecuteTime',
          label: '检验日期',
          width: '159'
        },
        {
          prop: 'inspectionReportItemName',
          label: '项目名称'
        },
        {
          prop: 'exceptionStatus',
          label: '结果',
          formatter ({ row }) {
            return row.inspectionQuantityValue + ' ' + row.inspectionQualityValue
          }
        },
        {
          prop: 'inspectionSubItemRemark',
          label: '备注'
        },
        {
          prop: 'inspectionQuantityUnit',
          label: '单位',
          formatter ({ row }) {
            return row.inspectionQuantityUnit || row.inspectionReportItemCode
          }
        },
        {
          prop: 'refValue',
          label: '参考范围'
        },
      ],
      lineData: { doctorAdvice: {}, report: {} }, // 示踪对象
      chatOptionObj: [],
      currentChart: {},
      reportItemList: [{ id: 1, name: '白细胞(WBC)' }, { id: 2, name: '平均红细胞血红蛋白浓度(MCHC)' }],
      checkList: [],
      checkListOptions: [],
      dialogVisible: false,
      showPdf: false,
      reportData: {},
      nowCheckNode: null,
      treedata: [
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chartOption: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      }
    }
  },
  mounted () {

  },
  created () {
    this.getTree()
  },
  methods: {
    classFn ({row}) {
      if (row.inspectionQualityValue.includes('阳性')) {
        return 'cRed'
      }
    },
    getTree () {
      request(urls.testList, {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
        patientId: this.$route.query.patientId,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
      }).then((res) => {
        let resdata = res.data
        let templateTree = []

        resdata.forEach((item, index) => {
          let tempparent = {
            id: item.inspectionTime,
            label: this.$moment(item.inspectionTime).format('YYYY-MM-DD'),
            ...(item),
            children: []
          }
          item.inspections.forEach((ritem, rindex) => {
            tempparent.children.push({
              id: ritem.patientInspectionId,
              label: ritem.inspectionServiceName,
              ...(ritem)
            })
          })
          templateTree.push(tempparent)
        })
        this.treedata = templateTree
        if (templateTree[0] && templateTree[0].children.length > 0) {
          this.nowCheckNode = templateTree[0].children[0]
          this.getLine()
        }
        // }
      })
    },
    /**
     * 折线图 多选框日期 被改变时候 进行数据筛选
     */
    changeCheckbox () {
      this.filterChartOption(this.chatOptionObj, this.checkList)
    },
    /**
     * 点击 历史数据按钮 时
     */
    showHistory () {
      this.dialogVisible = true
      setTimeout(() => {
        this.initDialogChart()
      })
    },
    /**
     * 初始化折线图 弹出框 数据
     */
    initDialogChart () {
      this.chart = echarts.init(this.$refs.testChart)
      this.chart.setOption(this.chartOption)
      if (this.nowCheckNode.result.details.length > 0) {
        this.getChartData(this.nowCheckNode.result.details[0])
      }
    },
    /**
     * 格式化 折线图 数据
     * @param data
     * @returns {{xAxis: [], series: [], checkList: [], checkListOptions: [], chatOptionObj: []}}
     */
    getChartOption (data) {
      let tempOption = { xAxis: [], series: [], checkListOptions: [], checkList: [], chatOptionObj: [] }
      this.tableData = []
      data.hisDataList.forEach((item, index) => {
        tempOption.checkListOptions.push({
          value: item.resultDate,
          label: item.resultDate
        })
        tempOption.checkList.push(item.resultDate)
        item.details.forEach((ditem, dindex) => {
          const value = ditem.inspectionQualityValue || ditem.inspectionQuantityValue
          const num = isNaN(value) ? 0 : value
          this.tableData.push(ditem)
          tempOption.xAxis.push(item.resultDate)
          tempOption.series.push(num)
          tempOption.chatOptionObj.push({
            date: ditem.inspectionExecuteTime,
            value: num
          })
        })
      })
      return tempOption
    },
    /**
     * 通过 日期checkbox 过滤数据
     * @param chatOptionObj
     * @param checkList
     */
    filterChartOption (chatOptionObj, checkList) {
      let optionsData = { xAxis: [], series: [] }
      chatOptionObj.forEach((item, index) => {
        if (checkList.includes(item.date.substr(0, 10))) {
          optionsData.xAxis.push(item.date)
          optionsData.series.push(item.value)
        }
      })
      this.setChartOption(optionsData.xAxis, optionsData.series)
    },
    /**
     * 获取折线图数据
     * @param item
     * @param type
     */
    getChartData (item, type = 'init') {
      this.currentChart = item
      this.loading = true
      request(urls.hisList, {
        resultDetailId: item.inspectionResultDetailId,
        limit: 10
      }).then((res) => {
        // if (res.head.errCode === 0) {
        let optionsData = this.getChartOption(res.data)
        this.checkListOptions = optionsData.checkListOptions
        this.checkList = optionsData.checkList
        this.chatOptionObj = optionsData.chatOptionObj
        this.filterChartOption(optionsData.chatOptionObj, this.checkList)
        this.loading = false
        // }
      })
    },
    /**
     * 设置折线图数据
     * @param xAxis
     * @param series
     */
    setChartOption (xAxis, series) {
      const styleArr = ['rgba(60,178,248,$)', 'rgba(28,123,239,$)']
      const replaceAlp = (str, alp = 1) => str.replace('$', alp)

      this.chart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis.map((str) => str.replace(' ', '\n')),
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          bottom: 20,
          right: 40,
        },
        title: {
          text: this.currentChart.inspectionReportItemName
        },
        series: [
          {
            name: '',
            data: series,
            type: 'line',
            symbol: 'circle',
            showSymbol: true,
            symbolSize: 8,
            smooth: true,
            smoothMonotone: 'x',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                1, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: replaceAlp(styleArr[0])
                  },
                  {
                    offset: 1,
                    color: replaceAlp(styleArr[1])
                  }
                ]
              )
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: replaceAlp(styleArr[0], 0.1)
              }, {
                offset: 1,
                color: replaceAlp(styleArr[1], 0.1)
              }])
            },
          }
        ]
      })
    },
    togglePdf () {
      this.showPdf = !this.showPdf
    },
    /**
     * 左侧树节点被点击选择时
     * @param data
     * @param node
     */
    handleNodeClick (data, node) {
      if (node.isLeaf) {
        this.nowCheckNode = data
        this.getLine()
      }
    },
    /**
     * 获取示踪数据
     */
    getLine () {
      request(urls.lineList, {
        patientInspectionId: this.nowCheckNode.patientInspectionId
      }, 'get').then((res) => {
        this.lineData = res.data
        if (res.head.errCode === 0) {

        }
      })
    }
  },
  components: {
    btnPopper,
    report,
    pdfShow
  }
}
</script>

<style lang="less" scoped>
.right-tree-container /deep/ .el-dialog {
  width: 900px;
}
.history-box {
  display: flex;
  width: 100%;
  .change-box {
    position: absolute;
    right: 60px;
    .active {
      color: #4484c9;
    }
  }
  .history-test-box {
    overflow: auto;
    height: 500px;
    width: 240px;
    flex-shrink: 0;
    border-right: solid 1px #f1f2f5;
    background-color: #f5f6f8;
    .test-title {
      font-size: 16px;
      padding: 10px;
      font-weight: bold;
    }
    ul {
      padding: 5px 15px;
      margin-top: 0px;
      background: #f1f2f5;
      li {
        line-height: 25px;
        cursor: pointer;
        &:hover {
          color: #4484c9;
        }
        &.checked {
          color: #4484c9;
        }
      }
    }
  }
  .history-chat-box {
    height: 500px;
    flex: 1;
    padding: 0 10px;
    .chat-title {
      margin-top: 10px;
      font-size: 18px;
      margin-bottom: 10px;
      font-weight: bold;
      .chat-checkbox {
        margin-bottom: 10px;
      }
    }
  }
}
.btn-box {
  min-width: 836px;
  max-width: 1400px;
  margin: 0 auto 10px;
  text-align: right;
  button {
    margin-left: 10px;
  }
}
.tree-detail {
  padding: 15px 15px 0 25px;
  height: 100%;
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
  .tree-detail-inner {
    min-width: 836px;
    max-width: 1400px;
    background: #fff;
    min-height: calc(~'100% - 43px');
    margin: 0 auto;
    position: relative;
  }
}
.tree-detail-inner {
  iframe {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
