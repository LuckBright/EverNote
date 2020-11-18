<template>
  <el-dialog
    title="执行记录"
    :visible.sync="visibleFlag"
    class="excuteRecordDialog ui_dialog_02"
    width="900px"
    @close="closeDialog"
  >
    <div class="excute-body" v-for="(eitem, eindex) in tableData" :key="eindex">
      <div class="advice-name" v-for="(item, index) in eitem.doctorAdvices" :key="index">
        <template v-if="eitem.doctorAdvices.length > 1">
          <span v-if="index === 0">┏</span>
          <span v-if="index > 0 && index < eitem.doctorAdvices.length-1">┣</span>
          <span v-if="index === eitem.doctorAdvices.length-1">┗</span>
        </template>
        <span class="bold">{{item.adviceJson.doctorAdviceName}}</span>&nbsp;&nbsp;
        <span>{{item.adviceJson.doctorAdviceContent}}</span>
      </div>
      <div class="excute-table">
        <el-table :data="eitem.outpatientExecutes || []">
          <el-table-column prop="number" label="执行记录" width="100">
            <template slot-scope="scope">第 {{Number(scope.row.executeSerialNumber)}} 次</template>
          </el-table-column>
          <el-table-column label="实际执行时间" width="170">
            <template slot-scope="scope">
              <!-- <div>{{scope.row.executeResult && scope.row.executeResult.recordTime ? $moment(scope.row.executeResult.recordTime).format('YYYY-MM-DD HH:mm') : '--'}}</div> -->
              <div>{{scope.row.completeTime ? scope.row.completeTime : '--'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="执行状态">
            <template slot-scope="scope">
              <div
                v-if="String(scope.row.status) && excuteStatus[String(scope.row.status)]"
                style="position:relative;"
              >
                {{excuteStatus[String(scope.row.status)]}}
                <!-- <i
                  v-if="String(scope.row.drugStatus) === '190'"
                  class="iconfont icon-fayao"
                  style="position:absolute;top:-12px;right:45px;color:#ee4433;font-size:36px;"
                ></i> -->
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="出库状态" v-if="['301', '302', '303', '304'].includes(currentObj.serviceType)">
            <template slot-scope="scope">
              <span v-if="String(scope.row.dispenseStatus)">
                {{drugStatus[String(scope.row.dispenseStatus)]}}
                <!-- <el-tooltip v-if="String(scope.row.dispenseStatus) === '70'" placement="right" effect="light">
                  <span slot="content"><span v-html="scope.row.remarks"></span></span>
                  <i class="iconfont icon-yichang cRed"></i>
                </el-tooltip> -->
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="执行人">
            <template slot-scope="scope">
              <span v-if="scope.row.executeName">{{scope.row.executeName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="结果" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.records && ['55'].includes(String(scope.row.status))">
                <sys-value type="THC_CPOE_HOSP_NURES_NOT_EXCUTE_REASON" :code="scope.row.records[0].reason"></sys-value>
                <el-tooltip  placement="top" effect="light" :disabled="!scope.row.records[0].remark" :content="scope.row.records[0].remark">
                  <i class="records-icon el-icon-warning"></i>
                </el-tooltip>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 待执行，并且待出库，或已出库，或退库驳回，治疗，待执行，可取消 -->
              <!-- <template
                v-if="(currentObj.serviceType === '802' && String(scope.row.status) === '10') || (String(scope.row.status) === '10' && (String(scope.row.dispenseStatus) === '0' || String(scope.row.dispenseStatus) === '190' || String(scope.row.dispenseStatus) === '70'))"
              > -->
              <template  v-if="['55', '10'].includes(String(scope.row.status))">
                <ever-confirm
                  :msg="'您确定要作废执行单吗？'"
                  action="作废"
                  @confirm="cancleRecipe(scope.row, scope.$index, eindex)"
                >
                  <template slot="reference">
                    <el-button type="primary" size="small">作废</el-button>
                  </template>
                </ever-confirm>
              </template>
              <!-- <template
                v-else-if="currentObj.serviceType === '802' && String(scope.row.status) === '30'"
              > -->
              <template v-else-if="String(scope.row.status) === '60'">
                <el-button type="primary" size="small" @click="checkViewReport(scope.row)">查看报告</el-button>
              </template>
              <template v-else>
                <span>--</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import medicalapi from '@/workspace/store/medicalapi'
export default {
  props: ['visible', 'data', 'currentObj'],
  data () {
    return {
      medicalapi,                 // 接口所在api文件
      isPrintForm: false,         // 是否打印退药单
      visibleFlag: false,         // dialog显示隐藏标识
      excuteStatus: {
        '10': '待执行',
        '20': '执行中',
        '30': '已完成',
        '40': '已取消',
        '53': '已作废',
        '55': '已拒绝',
        '60': '报告已出'
      },
      drugStatus: {
        '0': '未出库',
        '7': '已取消',
        '70': '出库驳回',
        '150': '退库申请中',
        '160': '已退库',
        '170': '部分退库中',
        '180': '退库驳回',
        '190': '已出库',
        '200': '部分已退库'
      }
    }
  },
  computed: {
    tableData () {
      let list = []
      list = this.data.map(item => {
        if (item && item.executeRecords && item.executeRecords.length) {
          item.outpatientExecutes = []
          item.executeRecords.forEach(v => {
            if (v && v.outpatientExecutes && v.outpatientExecutes.length) {
              let records = v.outpatientExecuteRecords
              v.outpatientExecutes.forEach(m => {
                m.records = records
                if (m.mainFlag < 2) {
                  item.outpatientExecutes.push(m)
                }
              })
            }
          })
        }
        return item
      })
      return list
    }
  },
  methods: {
    closeDialog () {
      this.visibleFlag = false
      this.$emit('update:visible', this.visibleFlag)
    },
    async cancleRecipe (item, index, eindex) {
      let ids = []
      if (this.tableData[eindex].executeRecords[index].outpatientExecutes && this.tableData[eindex].executeRecords[index].outpatientExecutes.length) {
        this.tableData[eindex].executeRecords[index].outpatientExecutes.forEach(val => {
          ids.push(val.id)
        })
      }
      let result = await medicalapi.cancleRecipeExcute({ ids: ids }).catch(() => {
        this.$emit('update')
      })
      if (result.head && result.head.errCode === 0) {
        this.$emit('update')
        this.$messageTips(this, 'success', '执行单作废成功', '提示')
      }
    },
    checkViewReport (row) {
      let obj = {
        serviceType: this.currentObj.serviceType,
        serviceId: this.currentObj.serviceId,
        serviceName: this.currentObj.serviceName,
        executeId: row.executeResult && row.executeResult.executeId || ''
      }
      this.$emit('viewReport', obj)
    }
  },
  watch: {
    'visible' (val) {
      this.visibleFlag = val
    }
  }
}
</script>
<style scoped lang="scss">
.excuteRecordDialog {
  padding: 20px;
  .records-icon {
    color: #efad1b;
  }
  /deep/.el-dialog__title {
    font-size: 16px !important;
    line-height: 16px;
    color: #333333 !important;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    .excute-body {
      margin-top: 10px;
    }
    .el-table {
      border: 1px solid #ccc;
      max-height: 350px;
      overflow: auto;
      /deep/.el-table__body-wrapper {
        // max-height: 300px;
        overflow: visible;
        /deep/ .cell {
          // overflow: visible;
        }
      }
    }
    padding: 0 20px 20px;
  }
}
</style>
