<template>
  <div class="paper_jianyan">
    <div v-if="tableData && tableData.length">
      <div v-show="showPdf">
        <embed
          type="application/pdf"
          width="100%"
          :src="pdfUrl"
          :height="pdfHeight" />
      </div>
      <div v-show="showInfo">
        <el-row>
          <h2 class="title">
            检验报告单
          </h2>
        </el-row>
        <el-row class="header">
          <template v-for="item in header">
            <el-col
              :key="item.key"
              :span="item.span || 4">
              <span>{{ item.label }}:</span>
              <span>{{ headerData[item.key] }}</span>
            </el-col>
          </template>
        </el-row>
        <el-row class="content_title">
          <el-col
            :span="2"
            class="number">
            No
          </el-col>
          <el-col :span="10">
            项目
          </el-col>
          <el-col :span="4">
            结果
          </el-col>
          <el-col :span="4">
            参考值
          </el-col>
          <el-col :span="4">
            单位
          </el-col>
        </el-row>
        <div class="min_height">
          <template v-for="(item, index) in tableData">
            <el-row
              :key="item.index"
              :class="getRowColor(item.resultStatus)"
              class="content_data">
              <el-col
                :span="2"
                class="number">
                {{ startIndex + index + 1 }}
              </el-col>
              <el-col :span="10">
                {{ item.inspectionReportItemName }}
              </el-col>
              <el-col :span="4">
                {{ item.inspectionQualityValue || item.inspectionQuantityValue }} <span :class="[getIcon(item.inspectionResultStatus) == '↑' ? 'top_color' : 'down_color']">{{ getIcon(item.inspectionResultStatus) }}</span>
              </el-col>
              <el-col :span="4">
                {{ item.refValue }}
              </el-col>
              <el-col :span="4">
                {{ item.inspectionQuantityUnit }}
              </el-col>
            </el-row>
          </template>
        </div>
        <el-row class="footer">
          <template v-for="item in footer">
            <el-col
              :key="item.key"
              :span="item.span || 6">
              <span>{{ item.label }}:</span>
              <span>{{ headerData[item.key] }}</span>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
    <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
  </div>
</template>

<script>
  export default {
    props: {
      startIndex: {
        type: Number
      },
      headerData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      tableData: {
        type: Array
      },
      show: {
        type: String,
        default: ''
      },
      pdfHeight: {
        type: Number
      },
      pdfUrl: {
        type: String
      }
    },
    data () {
      return {
        header: [
          {
            label: '姓名',
            key: 'name'
          },
          {
            label: '住院号',
            key: 'zhuyuanhao',
            span: 6
          },
          {
            label: '标本种类',
            key: 'biaobenzhonglei',
            span: 6
          },
          {
            label: '样本编号',
            key: 'yangbenbianhao',
            span: 8
          },
          {
            label: '性别',
            key: 'sex'
          },
          {
            label: '科别',
            key: 'kebie',
            span: 6
          },
          {
            label: '采样时间',
            key: 'caiyangshijian',
            span: 6
          },
          {
            label: '临床诊断',
            key: 'linchuangzhenduan',
            span: 8
          },
          {
            label: '年龄',
            key: 'age'
          },
          {
            label: '床号',
            key: 'bed',
            span: 6
          },
          {
            label: '送检医生',
            key: 'specimenDistributorName',
            span: 6
          },
          {
            label: '备注',
            key: 'applicationRemark',
            span: 8
          }
        ],
        footer: [
          {
            label: '接收时间',
            key: 'jieshoushijian'
          },
          {
            label: '报告时间',
            key: 'baogaoshijian'
          },
          {
            label: '校验者',
            key: 'jianyanzhe'
          },
          {
            label: '审核者',
            key: 'shenhezhe'
          }
        ]
      }
    },
    computed: {
      showPdf () {
        return this.show === 'pdf'
      },
      showInfo () {
        return this.show === 'info'
      }
    },
    methods: {
      getIcon (value) {
        let v = this.judgeStatus(value)
        if (v === '1') {
          return '↑'
        } else if (v === '-1') {
          return '↓'
        }
      },
      getRowColor (value) {
        return this.judgeStatus(value) !== '0' ? 'red' : ''
      },
      judgeStatus (str) {
        if (!str) return '0'
        let lower = str.indexOf('L')
        let high = str.indexOf('H')
        if (lower === 0) {
          return '-1'
        } else if (high === 0) {
          return '1'
        } else {
          return '0'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .paper_jianyan{
    background:#fff;
    padding:20px;
    font-size:12px;
    position: relative;
    height: 100%;
  }
  .title{
    text-align: center;
    font-size:18px;
  }
  .header{
    font-size:12px;
    padding-bottom:14px;
    border-bottom:2px solid #000;
    line-height:16px;
  }
  .content_title{
    border-bottom:1px solid #000;
    line-height:20px;
    font-size:14px;
    font-weight:bold;
  }
  .content_data{
    font-size:14px;
    line-height:18px;
  }
  .min_height{
    min-height:300px;
  }
  .number{
    padding-left:14px;
  }
  .footer{
    border-top:2px solid #000;
    line-height:16px;
    margin-bottom: 10px;
  }
  .red {
    color: red;
  }
  .top_color {
    color: #ee4433;
  }
  .down_color {
    color: #1c7bef;
  }
</style>
