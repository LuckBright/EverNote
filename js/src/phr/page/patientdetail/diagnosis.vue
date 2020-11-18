<template>
  <div class="right-main-container">
<!--    <commonTable :columns="columns" :url="urls.diagnosisList" id="_PHR_DIAGOSIS"></commonTable>-->
<!--    :config-option="{isAutoId: false}"-->
    <ever-table
      :border="true"
      :table-loading="tableLoading"
      ref="table"
      is-auto-height
      class=""
      row-key="id"
      :show-index="false"
      :columns="tableColunmns"
      :data="tableData"
      :maxBtnCount="6">
      <!--      <template slot="setName" slot-scope="scope">-->
      <!--        <template>-->
      <!--          <span>{{scope.row.setName}}</span> - <span class="cGray"><sys-value type="THC_SET_VERSION" :code="scope.row.setVersion"></sys-value></span>-->
      <!--        </template>-->
      <!--      </template>-->
      <template slot="receptionTime" slot-scope="scope">
        <template>
          {{scope.row.modifyTime ? scope.row.modifyTime : scope.row.createTime}}
        </template>
      </template>
      <template slot="diagnosisSerialNumber" slot-scope="scope">
        <template>
         <div :class="{'item-box': true,'bottom-border': index != scope.row.aboutArr.length - 1}" v-for="(item, index) in scope.row.aboutArr">
           {{item.diagnosisSerialNumber}}
         </div>
        </template>
      </template>
      <template slot="diagnosisName" slot-scope="scope">
        <template>
          <div  :class="{'bottom-border': index != scope.row.aboutArr.length - 1}"  v-for="(item, index) in scope.row.aboutArr">
            <div :class="{'item-box': true}" v-for="(sitem) in item.diagnoseItems">
              {{sitem.diagnosisName}}
            </div>
          </div>
        </template>
      </template>
    </ever-table>
  </div>
</template>

<script>
import urls from '@/phr/api/urls'
import commonTable from '@/phr/component/detail.common.table'
import {request} from '@/util/req'
import { formateColums } from '@/phr/util/formateData'
export default {
  name: 'diagnosis',
  components: {
    commonTable,
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      urls: urls,
      tableColunmns: [],
      columns: [
        {
          prop: 'receptionTime',
          label: '诊断日期',
          slot: 'receptionTime',
          width: 170,
        },
        {
          prop: 'diagnosisTypeName',
          label: '诊断类别',
          width: 120,
        },
        // {
        //   prop: 'diagnosisSerialNumber',
        //   label: '诊断序号',
        //   slot: 'diagnosisSerialNumber',
        // },
        {
          prop: 'diagnosisName',
          label: '诊断名称',
          slot: 'diagnosisName',
          showOverflowTooltip: true,
        },
        {
          prop: 'diagnosisDoctorName',
          label: '诊断医师',
          width: 100,
        }
      ],
      queryObj: {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
        patientId: this.$route.query.patientId,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
      }
    }
  },
  created () {
    this.tableColunmns = formateColums(this.columns, '诊断信息')
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      request(urls.diagnosisList, {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber || this.phrPatientActive.visitSerialNumber,
        patientId: this.$route.query.patientId,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
      }).then((res) => {
        this.tableLoading = false
        if (res.head.errCode === 0) {
          this.tableData = this.formateTableData(res.data)
          console.log('this.tableData', this.tableData)
        }
      })
    },
    formateTableData (data) {
      let tempTableData = []
      let temptableDataObj = {}
      data.forEach((item, index) => {
        if (temptableDataObj[item.diagnosisTypeCode]) {
          temptableDataObj[item.diagnosisTypeCode].push(item)
        } else {
          temptableDataObj[item.diagnosisTypeCode] = [item]
        }
      })
      for (let k in temptableDataObj) {
        tempTableData.push({
          createTime: temptableDataObj[k][0].createTime,
          modifyTime: temptableDataObj[k][0].modifyTime,
          receptionTime: temptableDataObj[k][0].receptionTime,
          diagnosisTypeName: temptableDataObj[k][0].diagnosisTypeName,
          diagnosisDoctorId: temptableDataObj[k][0].diagnosisDoctorId,
          diagnosisDoctorName: temptableDataObj[k][0].diagnosisDoctorName,
          aboutArr: temptableDataObj[k]
        })
      }
      return tempTableData
    }
  }
}
</script>

<style  lang="less" scoped>
  .item-box{
    line-height: 25px;
    height: 25px;
    display: block;
    width: calc(~'100% + 20px');
    position: relative;
    left: -10px;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.bottom-border{
      border-bottom: solid 1px #ddd;
    }
  }
</style>
