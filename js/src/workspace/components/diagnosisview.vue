<template>
  <div id="diagnosisview">
    <div class="inner">
      <div 
        v-if="medicalRecords.length>0"
      >
        <div v-for="(medicalRecord,index) in medicalRecords" :key="medicalRecord.medicalRecordContentId">
          <phrref
            :title="medicalRecord.docName"
            v-if="medicalRecord.fileDesignerId==='1'"
            :schema-id="medicalRecord.medicalRecordTemplateId"
            :id="medicalRecord.medicalRecordContentId"
            ref="bingli"
            :disabled="disabled"
          ></phrref>
          
          <docref 
            v-else
            :title="medicalRecord.docName"
            :dataId="medicalRecord.patientCaseId"
          ></docref>
          <hr v-if="index!==medicalRecords.length-1"/>

        </div>
      </div>
      
      <el-row class="tr" v-if="totalRecord && totalRecord.length">
        <el-table
          class="margin no-border"
          ref="xiyao"
          :data="totalRecord"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="storeSelected"
        >
          <el-table-column type="selection" width="30px" v-if="!disabled"></el-table-column>
          <el-table-column>
            <template slot="header">
              {{ $t('处方信息') }}
              <el-button
                type="primary"
                size="mini"
                @click="selectionTreat()"
                v-if="!disabled"
                :disabled="!selectedList.length"
                style="margin-left:5px;"
              >{{ $t('引用') }}</el-button>
            </template>
            <template slot-scope="scope">
              <el-col v-for="(item, index) in scope.row" :key="index">
                <el-row :gutter="15" class="history-order">
                  <el-col :span="1" class="history-order-name" style="">
                    <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.serviceType" v-if="!index" :showEn="true"></sys-value>
                  </el-col>
                  <div class="history-order-content" v-if="['301', '302'].includes(item.serviceType)">
                    <el-col :span="10" style="font-weight:bold;">
                      <template v-if="scope.row.length > 1">
                        <span v-if="index === 0">┏</span>
                        <span v-if="index === scope.row.length - 1">┗</span>
                        <span v-if="index > 0 && index < scope.row.length - 1">┣</span>
                      </template>
                      {{item.serviceName}}
                    </el-col>
                    <el-col :span="11">{{item.adviceJson && item.adviceJson.doctorAdviceContent}}</el-col>
                  </div>
                  <div class="history-order-content" v-else-if="['303', '304'].includes(item.serviceType)">
                    <el-col :span="10" v-if="item.adviceFeesDtoList && item.adviceFeesDtoList.length">
                      <span class="inlineB" v-for="v in item.adviceFeesDtoList" :key="v.id" style="font-weight:bold;">
                        <span>{{v.serviceName}}</span>
                        <span class="medicine-measure">
                          {{v.count || 0}}{{(v.countUnitName || '') + (v.footnote && '/' || '')}}<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="v.footnote"></sys-value>
                        </span>
                      </span>
                    </el-col>
                    <el-col :span="11">
                      <span>
                        <sys-value type="CV06.00.102" :code="item.useMethod"></sys-value>
                      </span>
                      <span>{{item.adviceJson && item.adviceJson.doctorAdviceContent}}</span>
                      <!-- <span>{{item.decoctFlag ? '' : ',不代煎'}}</span> -->
                      <!-- doctorAdviceContent里面新加的煎法，所以不用从值及里面取了 -->
                    </el-col>
                  </div>
                  <div class="history-order-content" v-else-if="['800', '801', '802', '10003'].includes(item.serviceType)">
                    <el-col :span="10" class="pdlr" style="font-weight:bold;">
                      {{item.serviceName}}:
                      <span>{{item.adviceJson && item.adviceJson.doctorAdviceContent}}</span>
                    </el-col>
                    <el-col :span="11">
                      <a
                        href="javascript:;"
                        class="detail"
                        v-if="item.releaseReport"
                        @click="seeDetail(item, item.id)"
                      >{{ $t('查看报告') }}</a>
                    </el-col>
                  </div>
                  <div class="history-order-content" v-else-if="['2125'].includes(item.serviceType)">
                    <el-col :span="10" class="pdlr" style="font-weight:bold;">{{item.serviceName}}</el-col>
                    <el-col :span="11" class="td">
                      <span>{{item.content}}</span>
                      <span>{{item.comment}}{{item.entrust}}</span>
                    </el-col>
                  </div>
                  <div class="history-order-content" v-else>
                    <el-col :span="10" class="pdlr" style="font-weight:bold;">{{item.serviceName}}</el-col>
                  </div>
                </el-row>
              </el-col>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <item-dialog ref="itemDialog" :inspectItem="inspectItem"></item-dialog>
    </div>
  </div>
</template>

<script>
import itemDialog from '@/infusion/components/report.card.vue'
import docref from '@/form/components/docref.vue'
import { objSortBy, objGroupBy } from '@/util/common'
export default {
  name: 'diagnosisview',
  components: {
    itemDialog,
    docref
  },
  props: [
    'num',
    'treatment',
    'diagnosisArrList',
    'disabled'
  ],
  data () {
    return {
      checkedAll: false,
      currentTpl: {
        formDataName: '病历信息'
      },
      index: 200,
      totalRecord: [],
      dialogFlag: false,
      recordId: 0,
      inspectItem: {},
      patientId: this.$route.query.patientId,
      selectedList: []
    }
  },
  computed: {
    medicalRecords () {
      let index = this.num
      let historyList = this.diagnosisArrList
      if (historyList && historyList[index] && historyList[index].medicalRecords && historyList[index].medicalRecords.length) {
        return historyList[index].medicalRecords
      } else {
        return []
      }
    }
  },
  watch: {
    treatment: {
      handler: function (val) {
        this.totalRecord = []
        if (val && val.length) {
          let newData = objGroupBy(val, 'mainGroupId')
          for (let item in newData) {
            newData[item] = objSortBy(newData[item], 'mainFlag')
            this.totalRecord.push(newData[item])
          }
        }
      },
      deep: true
    }
  },
  methods: {
    quoteHandle (data, item) {
      if (item) {
        if (typeof data.allergicHis === 'string' && data.allergicHis !== '') {
          data.allergicHis = JSON.parse(data.allergicHis)
        }
        let qdata = {}
        qdata[item] = data
        this.$emit('quote', qdata)
      } else {
        if (typeof data.allergicHis === 'string' && data.allergicHis !== '') {
          data.allergicHis = JSON.parse(data.allergicHis)
        }
        this.$emit('quote', data)
      }
    },
    selectionTreat (key) {
      let list = this.selectedList.map(item => {
        delete item.adviceJson.shopSetItemId // 引用历史处方删除套餐标示
        item = Object.assign(item, item.adviceJson, item.extendFieldJson)
        delete item.adviceJson
        delete item.extendFieldJson
        return item
      })
      let _tmp = JSON.parse(JSON.stringify(list))
      this.treat(_tmp)
    },
    storeSelected (arr, key) {
      this.selectedList = []
      arr.forEach(v => {
        this.selectedList = this.selectedList.concat(v)
      })
    },
    treat (data) {
      if (!data.length) {
        return this.$messageTips(this, 'warning', '请选择需要引用的处方信息', '提示')
      }
      this.$emit('treat', data)
      this.$bus.$emit('toggle_off')
    },
    seeDetail (value, recordId) {
      this.inspectItem = value
      this.recordId = recordId
      this.$emit('openReport', value)
    },
    countService: function (servObj) {
      var result = servObj.items
      var arr = []
      result.sort(function (a, b) {
        return a['serviceId'] - b['serviceId']
      })
      for (var i = 0; i < result.length;) {
        var count = 0
        for (var j = i; j < result.length; j++) {
          if (result[i]['serviceId'] === result[j]['serviceId']) {
            count++
          }
        }
        arr.push({
          name: result[i]['serviceName'],
          count: count
        })
        i += count
      }
      servObj.countArr = arr
      return servObj
    }
  }
}
</script>
<style scoped lang="scss">
hr{
  margin-bottom:0;
  opacity:.2;
  border-color:#eee;
}
/deep/ .el-table .el-table-column--selection .cell {
  overflow: visible;
}
#diagnosisview {
  height: 100%;
}
#diagnosisview .inner {
  background-color: #ffffff;
  height: 100%;
}
#diagnosisview .title.spec {
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}
#diagnosisview .title.spec .el-col {
  background-image: linear-gradient(
    -269deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.02) 100%
  );
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
}
#diagnosisview .title.spec .el-col {
  font-size: 14px;
  color: #000;
}
#diagnosisview .tr {
  line-height: 2;
  color: #2a2a2a;
}
#diagnosisview .tr .th {
  padding-left: 10px;
  font-size: 14px;
  color: #666666;
  font-weight: 700;
}
#diagnosisview .tr .td {
  padding: 0 10px;
  font-size: 14px;
}
#diagnosisview .inlineB {
  display: inline-block;
  margin-right: 30px;
}
#diagnosisview .mb20 {
  margin-bottom: 20px;
}
#diagnosisview .tr .td {
  word-break: break-all;
}
#diagnosisview .quote_btn {
  color: #000;
  background: #fff;
  border: 1px solid #bbb;
}
.report {
  position: relative;
}
a.detail {
  color: #357fed;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}
.provider {
  font-size: 18px;
  color: #000;
  font-weight: 700;
  margin-right: 10px;
}
.doctor {
  font-size: 14px;
  color: #666666;
}
.m {
  margin-left: 12px;
}
.margin {
  margin: 0px;
}
.medicine-measure {
  font-weight: normal;
  font-size: 12px;
}
.history-order {
  display: flex;
}
.history-order-name {
  min-width:75px;
  min-height:27px;
  border-right:1px solid #ccc;
  padding-top:4px;
  padding-bottom:4px;
}
.history-order-content {
  width: 100%;
  padding:4px 0;
}
/deep/ .el-table {
  tr:hover {
    td {
      background-color: transparent !important;
    }
  }
  .el-table__header-wrapper {
    th {
      background: transparent;
    }
  }
  .el-table__body {
    td {
      border-top: 1px solid #ccc;
    }
    .el-table-column--selection {
      vertical-align: top;
      padding-top: 4px!important;
    }
  }
}
</style>
