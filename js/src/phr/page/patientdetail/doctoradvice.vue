<template>
  <div class="right-main-container">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="doctorAdviceTermCode" v-if="$route.query.visitSerialTypeCode === '3'">
          医嘱类型&nbsp;&nbsp;
          <el-select v-model="queryObj.doctorAdviceTermCode" filterable clearable placeholder="请选择医嘱类型">
            <el-option
              v-for="item in adviceTimeTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list()">查询</el-button>
            <el-button size="small" @click="resetSearchForm()">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
<!--    :config-option="{isAutoId: false}"-->
    <ever-table
      width="100%"
      :table-loading="tableLoading"
      ref="table"
      :fixedHeight="$route.query.fromType === 'crm' ? 1 : 135"
      class="doctoradvice-table"
      row-key="id"
      :show-index="false"
      :columns="tableColunmns"
      :data="newTableData"
      :cell-class-name="cellClassNameNew"
      @configChange="configChange"
      :maxBtnCount="6">
<!--    :span-method="arraySpanMethod"-->
<!--    :header-cell-class-name="headerCellClassName"-->
<!--    :cell-class-name="cellClassName"-->
<!--    :row-class-name="rowClassName"-->
<!--       :params.sync="queryObj"<template slot="setName" slot-scope="scope">-->
<!--        <template>-->
<!--          <span>{{scope.row.setName}}</span> - <span class="cGray"><sys-value type="THC_SET_VERSION" :code="scope.row.setVersion"></sys-value></span>-->
<!--        </template>-->
<!--      </template>-->
      <template slot="doctorAdviceTermCodeTable" slot-scope="scope">
        {{scope.row.doctorAdviceTermName}}
      </template>
    <template slot="categoryCode" slot-scope="scope">
      <div v-for="(item, index) in scope.row.arrData">
        <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.doctorAdviceTypeCode || item.doctorAdviceItemTypeCode" :show-en="true"></sys-value>
      </div>
    </template>
      <template slot="doctorAdviceName" slot-scope="scope">
        <div class="namesWrap" v-for="(item, index) in scope.row.arrData" :ref="'name' + scope.row.serviceId + index" :style="'height:' + handelHeight( scope.row.serviceId + index, 'name', scope.row.arrData) + 'px'">
          <!-- 父子医嘱标识 -->
          <span v-if="Number(item.parentChildAdviceFlag)" class="leftIcons">
<!--             && scope.row.arrData.length > 1-->
            <span class="top" v-if="Number(item.parentChildAdviceFlag) === 1"></span>
            <span class="bottom" v-else-if="index === scope.row.arrData.length - 1"></span>
            <span class="middle" v-else></span>
          </span>
          <span class="cellMain">
            <!-- 组套 -->
            <template v-if="item.setFlag">
              <service-set-items :item="item"></service-set-items>
            </template>
            <!-- 药品逻辑 -->
            <template v-else-if="['301', '302', '303', '304'].includes(item.doctorAdviceTypeCode)">
              <!-- 西药、中成药 -->
              <template v-if="['301', '302'].includes(item.doctorAdviceTypeCode)">
<!--                <drug-info class="bold" :drug-obj="scope.row"></drug-info>-->
                 {{(item && item.doctorAdviceName || item.adviceJson.doctorAdviceName)}} {{ item.specification }}
              </template>
              <!-- 中药饮片、中药颗粒 -->
              <template v-if="['303', '304'].includes(item.doctorAdviceTypeCode)">
                {{(item && item.doctorAdviceName || item.adviceJson.doctorAdviceName)}} {{ item.specification }}
<!--                <span v-for="(drug, d) in item.outpatientPrescriptions" :key="d" class="labWrap" style="margin-right: 5px">-->
<!--                  <template v-if="String(drug.visitTypeCode) === '1'">-->
<!--                    <label class="bold">{{drug.medicineName}}</label>-->
<!--                    <label style="top:-5px;" class="lab" v-if="drug.decoctionName">({{drug.decoctionName}})</label>-->
<!--                    <label style="position:relative;bottom:-2px; left:-2px; font-size: 12px " class="lab">{{drug.medicineUseDosage}}{{drug.medicineUseDosageUnit}}</label>-->
<!--                  </template>-->
<!--                </span>-->
              </template>
            </template>
            <!-- 非药品逻辑 -->
            <template v-else>
              <span class="bold">{{item.doctorAdviceName || item.serviceName}} {{ item.specification }}</span>
            </template>
          </span>
        </div>
      </template>
      <template slot="doctorAdviceContent" slot-scope="scope">
        <div v-for="(item, index) in scope.row.arrData" :ref="'content' + scope.row.serviceId + index" :style="'height:' + handelHeight( scope.row.serviceId + index, 'content', scope.row.arrData) + 'px'">
<!--          {{item.doctorAdviceContent}}-->
          <template v-if="['301', '302', '303', '304'].includes(item.doctorAdviceTypeCode)">
            {{item.doctorAdviceContent}}
          </template>
          <template v-else>
            <advice-item-show :item="item" :visit-type="$route.query.visitSerialTypeCode"></advice-item-show>
          </template>
        </div>

<!--        <span v-if="scope.row.adviceFeesDtoList && scope.row.adviceFeesDtoList[0] && String(scope.row.adviceFeesDtoList[0].feesType) === '2'">数量：{{scope.row.count}}{{scope.row.countUnitName || '项'}}</span>-->
<!--        <advice-item-show :item="scope.row" :visit-type="queryObj.visitType" v-else></advice-item-show>-->
      </template>
      <template slot="doctorAdviceRemark" slot-scope="scope">
        <div v-for="(item, index) in scope.row.arrData">
          {{item.doctorAdviceRemark}}
        </div>
      </template>
      <template slot="status" slot-scope="scope">
        <div v-for="(item, index) in scope.row.arrData">
          <template v-if="adviceStatus[String(item.doctorAdviceStatusCode)] && adviceStatus[String(item.doctorAdviceStatusCode)].txt">
            <span :class="{'cRed': ['2', '70'].includes(String(item.doctorAdviceStatusCode))}">{{adviceStatus[String(item.doctorAdviceStatusCode)].txt}}</span>
          </template>
          <template v-else>--</template>
        </div>
      </template>
    </ever-table>
  </div>
</template>

<script>
import urlMap from '@/phr/api/urls'
import { request } from '@/util/req'
import drugInfo from '@/inpatient/components/drug.info'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import { OUTPATIENT_ADVICE_STATUS, ADVICE_STATUS } from '@/util/common'
import { specialClassify } from '@/inpatient/components/doctor.state/index.js'
import { formateColums } from '@/phr/util/formateData'
// import adviceData from './adviceJson.json'
let querySchema = [
  {
    name: 'doctorAdviceTermCode',
    label: '',
    comp: 'custom'
  },
  {
    name: 'doctorAdviceName',
    label: '医嘱名称',
    props: {
      clearable: true,
      placeholder: '请输入医嘱名称'
    }
  }
]

export default {
  components: {
    adviceItemShow,
    drugInfo
  },
  props: {
    // visitType: {                // 场景， 1：门诊，3：住院
    //   type: Number,
    //   default: 1
    // }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      tableColunmns: [],
      tableLoading: true,
      tableHeigt: 100,
      querySchema,
      queryObj,
      hoscolumns: [
        {
          widthbili: 0.12,
          prop: 'doctorAdviceOpenTime',
          label: '开立日期',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'doctorAdviceOpenSignName',
          label: '开立者',
          // slot: 'setName',
          widthbili: 0.05,
        },
        {
          slot: 'doctorAdviceTermCodeTable',
          prop: 'doctorAdviceTermCode',
          label: '医嘱类别',
          // slot: 'setName',
          widthbili: 0.05,
        },
        {
          slot: 'categoryCode',
          prop: 'doctorAdviceTypeCode',
          label: '医嘱项目类别',
          // slot: 'setName',
          widthbili: 0.07,
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '医嘱名称',
          widthbili: 0.24,
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: '医嘱内容',
          widthbili: 0.24,
        },
        {
          prop: 'adviceStopByName',
          label: '停止者',
          showOverflowTooltip: true,
          widthbili: 0.05,
          width: '100',
        },
        {
          prop: 'doctorAdviceStopTime',
          label: '停止时间',
          showOverflowTooltip: true,
          widthbili: 0.11,
          width: '100',
        },
        {
          // slot: 'status',
          prop: 'doctorAdviceStatusName',
          label: '医嘱状态',
          widthbili: 0.07,
          slot: 'status',
        },
      ],
      columns: [
        {
          widthbili: 0.12,
          prop: 'doctorAdviceOpenTime',
          label: '开立日期',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          slot: 'categoryCode',
          prop: 'doctorAdviceTypeCode',
          label: '处方项目类别',
          // slot: 'setName',
          widthbili: 0.07,
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '处方名称',
          widthbili: 0.3,
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: '处方内容',
          widthbili: 0.3,
        },
        {
          prop: 'doctorAdviceRemark',
          label: '嘱托',
          showOverflowTooltip: true,
          widthbili: 0.14,
          width: '100',
          slot: 'doctorAdviceRemark'
        },
        {
          // slot: 'status',
          prop: 'doctorAdviceStatusName',
          label: '执行状态',
          widthbili: 0.07,
          slot: 'status',
        },
      ],
      url: urlMap.doctoradviceList,
      configOption: {
        id: '_PHR_DOCTORADVIVE_LIST'
      },
      adviceTypeOption: [
        {
          value: 1,
          label: '门诊'
        },
        {
          value: 3,
          label: '住院'
        }
      ],
      adviceTimeTypeOption: [
        {
          value: '0',
          label: '临时'
        },
        {
          value: '1',
          label: '长期'
        }
      ],
      arraySpan: ['doctorAdviceOpenTime', 'termType', 'executeProviderName', 'stopTime', 'stopByName', 'source', 'storageRoomName', 'doctorName'],
      noBorderSpan: ['doctorAdviceItemTypeCode', 'doctorAdviceItemTypeName', 'doctorAdviceName', 'doctorAdviceContent', 'doctorAdviceRemark', 'entrust', 'doctorAdviceStatusName', 'advicePrice'],
      setMainGroupId: 'parentChildGroupId',
      tableData: [],
      initData: [],
      OUTPATIENT_ADVICE_STATUS,  // 门诊医嘱状态
      ADVICE_STATUS,             // 住院医嘱执行状态
      specialClassify,           // 特殊药品标识
      configData: []
    }
  },
  created () {
    let columns = this.$route.query.visitSerialTypeCode === '3' ? this.hoscolumns : this.columns
    let tableWidth = (document.body.clientWidth > 1440 ? document.body.clientWidth : 1440) - 277
    columns.forEach((item, index) => {
      item.width = tableWidth * item.widthbili
    })
    this.tableColunmns = formateColums(columns, '医嘱信息', 160)
    this.list()
  },

  computed: {
    // 执行状态 实际 门诊和住院会有不同
    adviceStatus () {
      return this.$route.query.visitSerialTypeCode === '1' ? this.OUTPATIENT_ADVICE_STATUS : this.ADVICE_STATUS
    },
    // 处理父子医嘱
    fuziData () {
      let obj = {}
      this.initData.forEach(item => {
        if (obj[item[this.setMainGroupId]]) {
          obj[item[this.setMainGroupId]].push(item)
        } else {
          obj[item[this.setMainGroupId]] = [item]
        }
      })
      console.log('fuziData', obj)
      return obj
    },
    // 处理父子医嘱
    newTableData () {
      let obj = {}
      this.initData.forEach(item => {
        item.status = item.doctorAdviceStatusCode
        item.serviceType = item.doctorAdviceTypeCode
        item.adviceJson = Object.assign({}, (item.doctorAdviceContentJson ? JSON.parse(item.doctorAdviceContentJson) : {}), (item.doctorAdviceExtendFieldJson ? JSON.parse(item.doctorAdviceExtendFieldJson) : {}))
        if (obj[item[this.setMainGroupId]]) {
          obj[item[this.setMainGroupId]].push(item)
        } else {
          obj[item[this.setMainGroupId]] = [item]
        }
      })
      let tempNewTableData = []
      for (let k in obj) {
        tempNewTableData.push({
          arrData: obj[k],
          ...(obj[k][0]),
        })
      }
      console.log('newTableData', tempNewTableData)
      return tempNewTableData
    },
  },
  methods: {
    handelHeight (id, type, arr) {
      if (arr.length <= 1) return
      let heightArr = []
      setTimeout(() => {
        heightArr = [this.$refs['name' + id][0].clientHeight, this.$refs['content' + id][0].clientHeight]
        heightArr.sort((a, b) => {
          return a > b
        })
        console.log(this.$refs[type + id])
        if (this.$refs[type + id]) {
          this.$refs[type + id][0].style.height = heightArr[0] + 'px' || ''
        }
      })
    },
    // 获取医嘱列表
    list () {
      // if (this.queryObj.doctorAdviceTermCode === 1 && !this.$route.query.outpatientSerialNumber) {
      //   this.$messageTips(this, 'warning', '无门诊医嘱数据', '提示')
      //   return
      // }
      // if (this.queryObj.doctorAdviceTermCode === 3 && !this.$route.query.hospitalizedNumber) {
      //   this.$messageTips(this, 'warning', '无住院医嘱数据', '提示')
      //   return
      // }
      this.tableLoading = true
      request(urlMap.doctoradviceList,
        {
          visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
          visitSerialNumber: this.$route.query.visitSerialNumber, // 'BJOP202007585JT',
          patientId: this.$route.query.patientId, // 'IBZOIwQ6wpEinUP5jH4',
          outpatientSerialNumber: this.queryObj.doctorAdviceTermCode === 1 ? this.$route.query.outpatientSerialNumber : '',
          hospitalizedNumber: this.queryObj.doctorAdviceTermCode === 3 ? this.$route.query.hospitalizedNumber : '',
          ...(this.queryObj)
        },
        'post'
      ).then((res) => {
        if (res.head.errCode === 0) {
          this.tableLoading = false
          // this.tableData = this.resetData(res.data)
          this.tableData = this.resetData(res.data)
          this.initData = this.resetData(res.data) // JSON.stringify()
          setTimeout(() => {
            this.$refs['table'].handleExpandChange()
          })
        }
      })
    },
    /**
     *重置搜索条件
     */
    resetSearchForm () {
      this.$refs.form.resetForm()
      this.list()
    },
    // 数据处理，将json数据取出，将毒麻精放等特殊标识合为一个，将父子医嘱放在一起
    resetData (data) {
      let obj = {}
      data.forEach(item => {
        // if (this.doctorAdviceItemTypeCodeList && this.doctorAdviceItemTypeCodeList.length && item.doctorAdviceItemTypeCode) {
        //   let obj = this.doctorAdviceItemTypeCodeList.filter(v => {
        //     return item.doctorAdviceItemTypeCode === v.code
        //   })[0]
        //   item.doctorAdviceItemTypeCodeName = obj && obj.name || ''
        // }
        // item = Object.assign({}, item, item.doctorAdviceExtendFieldJson)
        // item = Object.assign({}, item, item.doctorAdviceContentJson)
        // if (item.adviceFeesDtoList && item.adviceFeesDtoList.length) {
        //   item.adviceFeesDtoList = item.adviceFeesDtoList.map(val => {
        //     if (val.feesJson) {
        //       val = Object.assign({}, val, val.feesJson)
        //     }
        //     return val
        //   })
        //   if (!['303', '304'].includes(item.doctorAdviceItemTypeCode) && !item.setFlag) {
        //     item.chargeLevel = item.adviceFeesDtoList[0].chargeLevel
        //   }
        // }
        // if (['301', '302'].includes(item.doctorAdviceItemTypeCode)) {
        //   item.specialClassifyDrug = []
        //   if (item.specialClassify) {
        //     item.specialClassifyDrug.push(item.specialClassify)
        //   }
        //   if (item.antibioticType) {
        //     item.specialClassifyDrug.push(item.antibioticType)
        //   }
        //   if (item.highRisk) {
        //     item.specialClassifyDrug.push(item.highRisk)
        //   }
        //   item.specialClassifyDrug = item.specialClassifyDrug.join(',')
        // }
        if (!obj[item[this.setMainGroupId]]) {
          obj[item[this.setMainGroupId]] = [item]
        } else {
          obj[item[this.setMainGroupId]].push(item)
        }
      })
      let finalData = []
      Object.keys(obj).forEach(item => {
        obj[item].sort((n1, n2) => {
          return Number(n1.parentChildAdviceFlag) - Number(n2.parentChildAdviceFlag)
        })
        finalData = finalData.concat(obj[item])
      })
      return finalData
    },
    // 合并单元格处理
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let list1 = []
      // if (this.showCheckbox && !this.specCheckboxMergeFlag) {
      //   list1.push(0)
      // } else if (this.specCheckboxMergeFlag) {
      //   if (columnIndex === 0 && this.checkMergeData[row[this.specCheckboxMergeFlag]].length > 1) {
      //     let n = this.checkMergeData[row[this.specCheckboxMergeFlag]].findIndex(val => { return row.id === val.id })
      //     let n0 = this.checkMergeData[row[this.specCheckboxMergeFlag]] && this.checkMergeData[row[this.specCheckboxMergeFlag]].length || 0
      //     if (!n) {
      //       return {rowspan: n0, colspan: 1}
      //     } else {
      //       return {rowspan: 0, colspan: 0}
      //     }
      //   }
      // }
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (this.arraySpan.includes(item.prop)) {
            list1.push(this.showCheckbox ? index + 1 : index)
          }
        })
      }
      if (list1.includes(columnIndex)) {
        // 父子医嘱合并单元格
        if (Number(row.parentChildAdviceFlag) === 1) {
          let m2 = this.fuziData[row[this.setMainGroupId]] && this.fuziData[row[this.setMainGroupId]].length || 0
          return {rowspan: m2, colspan: 1}
        } else if (Number(row.parentChildAdviceFlag) > 1) return {rowspan: 0, colspan: 0}
      }
    },
    // 给header设置类名
    headerCellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      if (this.configData && this.configData.length) {
        this.configData.forEach(item => {
          if (!item.hidden) count++
        })
      }
      let className = []
      if (this.showCheckbox && Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      return className.join(' ')
    },
    // 给body中cell 设置类名
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      let configIndex = []
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (!item.hidden) count++
          if (this.noBorderSpan.includes(item.prop)) configIndex.push(String(index))
        })
      }
      let className = []
      if (this.showCheckbox && Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      if (String(row.status) === '210' || String(row.status) === '500' || String(row.status) === '11') {
        className.push('lineGray')
      }
      if (configIndex.includes(column.columnKey)) {
        if (Number(row.parentChildAdviceFlag) && this.fuziData[row[this.setMainGroupId]] && this.fuziData[row[this.setMainGroupId]].length) {
          if (this.fuziData[row[this.setMainGroupId]].length > this.fuziData[row[this.setMainGroupId]].findIndex(item => { return item.creatorId === row.creatorId }) + 1) {
            className.push('noBottomBorder')
          }
          // 处理父子医嘱标识问题
          if (Number(row.parentChildAdviceFlag) === 1) {
            className.push('topCell')
          } else {
            if (row.creatorId === this.fuziData[row[this.setMainGroupId]][this.fuziData[row[this.setMainGroupId]].length - 1].creatorId) {
              className.push('bottomCell')
            } else {
              className.push('middleCell')
            }
          }
        }
      }
      return className.join(' ')
    },
    cellClassNameNew ({ row, column, rowIndex, columnIndex }) {
      let className = []
      if (String(row.doctorAdviceStatusCode) === '210' || String(row.doctorAdviceStatusCode) === '500' || String(row.doctorAdviceStatusCode) === '11') {
        className.push('lineGray')
      }
      return className.join(' ')
    },
    // 给row设置类名
    rowClassName ({ row, rowIndex }) {
      return (this.rowClass !== '-1' ? this.rowClass : '') + (row && row.isSelect || row && row.specbg ? ' selectbg' : '') + (row.status === 0 ? ' waitbg' : '')
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    getTableHeight () {
      this.tableHeigt = document.body.clientHeight - 130 - this.$parent.getHeaderHeight()
    }
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
  .right-main-container{
    overflow: hidden;
  }
  .detail-main-right{
    .doctoradvice-table /deep/ .el-table tr .lineGray {
      text-decoration: line-through;
      color: #ccc;
    }
    .doctoradvice-table /deep/ .el-table tr td.noBottomBorder{
      border-bottom: none;
    }
    .doctoradvice-table /deep/ .el-table td, .doctoradvice-table /deep/  .el-table th {
      border-right:solid 1px #ddd;
      box-sizing: border-box;
      &:nth-last-of-type(1){
        border-right: none;
      }
    }
    .doctoradvice-table /deep/ .el-table:not(.no-hover) tr.hover-row td,.doctoradvice-table /deep/ .el-table:not(.no-hover) tr:hover td{
      background: none;
    }
    .doctoradvice-table /deep/ .el-table tr td{
      &.middleCell{
        .cell{
          margin-bottom: -6px;
        }
      }
      &.topCell{
        .cell{
          margin-bottom: -6px;
        }
      }
      &.bottomCell{
        .cell{
          margin-top: -2px;
        }
      }
      .cell{
        line-height: 23px;
        .namesWrap{
          display: flex;
          .leftIcons {
            width: 6px;
            margin-right: 8px;
            position: relative;
            .top {
              border-top: 3px solid;
              border-left: 3px solid;
              width: 100%;
              position: absolute;
              top: 8px;
              bottom: 0;
            }
            .middle {
              border-left: 3px solid;
              width: 100%;
              position: absolute;
              top: 0;
              bottom: 0;
            }
            .bottom {
              border-bottom: 3px solid;
              border-left: 3px solid;
              width: 100%;
              height: 10px;
              position: absolute;
              top: 0;
            }
          }
        }
      }
    }
  }
</style>
