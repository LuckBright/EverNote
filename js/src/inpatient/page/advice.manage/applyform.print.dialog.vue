<template>
  <el-dialog
    title="申请单打印"
    :visible.sync="visibleFlag"
    :close-on-click-modal="false"
    class="ui_dialog_02 applyformDialog"
    @close="cancel"
  >
    <el-tabs v-model="activeName" class="pathTabs">
      <el-tab-pane v-for="item in tabPanel" :key="item.type" :name="item.type">
        <span slot="label" class="tab-label" :class="{'has-data-icon': item.data.length && !printedType.includes(item.type)}">{{item.name}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="table-list">
      <el-table
        v-loading.body="loading"
        ref="applyformPrint"
        :data="tableData || []"
        :border="false"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column width="100" label="床号" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.bedName">{{scope.row.bedName}}</template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column width="110" label="患者信息" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.patientName}}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.adviceJson.doctorAdviceName}}
            <span v-if="scope.row.emergencyFlag">
              <i class="txt_icon">急</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <advice-item-show :item="getContent(scope.row)" :visit-type="3"></advice-item-show>
          </template>
        </el-table-column>
        <el-table-column label="执行科室" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.adviceJson.executeProviderName}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <el-row class="footarea">
      <el-col align="right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitEvent">立即打印</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/inpatient/store/advice/review'
import { ageShow, objFind } from '@/util/common'
import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'

export default {
  /**
   * visible
   */
  props: ['visible', 'data'],
  components: { adviceItemShow },
  data () {
    return {
      loading: false,
      api,                        // 接口所在api文件
      ageShow,
      tableData: [],            // 展示的检查table数据
      visibleFlag: false,         // dialog显示隐藏标识
      activeName: '',
      selectList: [],
      codes: {
        'jiancha': 'ZY_CPOE_JIAN_CHA_SHEN_QING_DAN',
        'jianyan': 'ZY_CPOE_JIAN_YAN_SHEN_QING_DAN',
        'zhiliao': 'ZY_CPOE_ZHI_LIAO_DAN',
        'shoushu': 'ZY_CPOE_SHOU_SHU_SHEN_QING_DAN',
        'zhongyao': 'ZY_CPOE_ZHONG_YAO_CHU_FANG_DAN',
        // 'bingli': 'BING_LI_SHEN_QING_DAN_ZHUYUAN',
        // 'shuxue': 'QU_XUE_DAN_ZY',               // 输血医嘱 打印取血单
        // 'beixue': 'SHU_XUE_SHEN_QING_DAN',        // 备血医嘱 打印输血单
        // 'chanqian': 'CHAN_QIAN_SHAI_CHA_SHEN_QING_BIAO'   // 孕早期和孕中期
      },
      printedType: [],
      tabPanel: [
        {name: '检查申请打印', type: '800', data: [], isPrint: false},
        {name: '检验申请打印', type: '801', data: [], isPrint: false},
        {name: '手术申请打印', type: '2125', data: [], isPrint: false},
        {name: '治疗单打印', type: '802', data: [], isPrint: false},
      ]
    }
  },
  created () {
  },
  methods: {
    separateData () {
      let datas = this.data
      let listObj = {}
      datas.forEach(item => {
        if (!listObj[item.serviceType]) {
          listObj[item.serviceType] = []
        }
        listObj[item.serviceType].push(item)
      })
      return listObj
    },
    getContent (row) {
      return Object.assign({}, row, row.adviceJson, row.extendFieldJson)
    },
    getTableData () {
      let tabPanel = objFind(this.tabPanel, {type: this.activeName})
      if (tabPanel) {
        this.tableData = tabPanel.data || []
      } else {
        this.tableData = []
      }
      this.$nextTick(() => {
        this.tableData.forEach(item => {
          this.$refs.applyformPrint.toggleRowSelection(item)
        })
      })
    },
    handleSelectionChange (val) {
      this.selectList = val
    },
    submitEvent () {
      if (!this.selectList.length) {
        return this.$messageTips(this, 'warning', '请选择要操作的医嘱', '提示')
      }
      this.printedType.push(this.activeName)
      mutiplePrint(this.getMergePrintData(this.selectList))
    },
    cancel () {
      this.visibleFlag = false
      this.$emit('update:visible', this.visibleFlag)
      this.printedType = []
    },
    getPrintData (data) {
      let print = []
      data.forEach(item => {
        if (item.serviceType === '800') {
          item.printType = 'jiancha'
        } else if (item.serviceType === '801' || item.serviceType === '10003') {
          item.printType = 'jianyan'
        } else if (item.serviceType === '802') {
          item.printType = 'zhiliao'
        } else if (item.serviceType === '2125') {
          item.printType = 'shoushu'
        } else if (item.serviceType === '303' || item.serviceType === '304' || item.serviceType === '3002') {
          item.printType = 'zhongyao'
        }
        if (this.codes[item.printType]) {
          print.push({
            code: this.codes[item.printType],
            params: {
              doctorAdviceIdList: [item.id],
              patientId: item.patientId,
              visitId: item.hospitalizedNumber
            }
          })
        }
      })
      return print
    },
    // 申请单合并打印
    getMergePrintData (list) {
      let dataTree = {}
      let formatData = (code, data) => {
        let randomStr = ''
        if (!this.codes[code]) {
          return
        }
        if (code === 'shoushu') {
          randomStr = Math.random().toString().slice(2)
        }
        let keyName = code + '_' + data.patientId + randomStr
        if (!dataTree[keyName]) {
          dataTree[keyName] = {
            code: this.codes[code],
            params: {
              patientId: data.patientId,
              visitId: data.hospitalizedNumber,
              doctorAdviceIdList: []
            }
          }
        }
        dataTree[keyName].params.doctorAdviceIdList.push(data.id)
      }
      let listCopy = JSON.parse(JSON.stringify(list))
      listCopy.sort((a, b) => {
        return a.serialNumber > b.serialNumber ? 1 : -1
      })
      listCopy.forEach(item => {
        if (item.serviceType === '800') {
          formatData('jiancha', item)
        } else if (item.serviceType === '801' || item.serviceType === '10003') {
          formatData('jianyan', item)
        } else if (item.serviceType === '802') {
          formatData('zhiliao', item)
        } else if (item.serviceType === '2125') {
          formatData('shoushu', item)
        } else if (item.serviceType === '303' || item.serviceType === '304' || item.serviceType === '3002') {
          formatData('zhongyao', item)
        }
      })
      return Object.values(dataTree)
    }
  },
  watch: {
    'visible' (val) {
      if (!val) {
        this.activeName = ''
        return
      }
      let hasData = false
      let listObj = this.separateData()
      this.tabPanel.forEach(item => {
        item.data = listObj[item.type] && listObj[item.type].sort((a, b) => {
          return a.serialNumber > b.serialNumber ? 1 : -1
        }) || []
        if (item.data.length && !hasData) {
          hasData = true
          this.activeName = item.type
        }
      })
      this.visibleFlag = val
    },
    'activeName' (val) {
      if (!val) {
        return
      }
      this.getTableData()
    }
  }
}
</script>
<style scoped lang="scss">
.applyformDialog {
  padding: 20px;
  /deep/.el-dialog__title {
    padding: 0;
  }
  /deep/.el-dialog__body {
    display: flex;
    flex-direction: column;
    padding: 0 15px 15px;
    .el-table {
      border: 1px solid #ccc;
      margin-top: 0;
      overflow-y: auto;
      .el-table__body-wrapper {
      }
    }
  }
  .footarea {
    margin-top: 15px;
    height: 36px;
    text-align: right;
  }
  .table-list {
    flex: 1;
    overflow: auto;
  }
  .tab-label {
    position: relative;
  }
  .has-data-icon::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 0px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: red;
  }
}
</style>
