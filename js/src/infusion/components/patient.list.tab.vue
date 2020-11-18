<template>
  <div class="tab-patient">
    <div class="tab-header">
      <el-tabs v-model="queueType" type="card" @tab-click="tableClick">
        <el-tab-pane  v-for="item in tabsList" :label="item.label" :name="item.value" :key='item.value'></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tab-body">
      <div class="querydiv">
        <div class="patientselect">
          <ever-patient-select
            size="small"
            v-model.trim="searchName"
            @select="input"
            :scence="0"
            :allow-create="true"
            :dialog-show="false"
            :show-attr-type="false"
          ></ever-patient-select>
        </div>
        <el-date-picker
          @change='queryList("")'
          v-model="date"
          type="daterange"
          value-format='yyyy-MM-dd'
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="patient-list">
        <ever-table
          table-class="flex_layout_scroll no-border patient-queue"
          :data="list"
          :table-loading="loading"
          :columns="columns"
          :row-class-name="rowClassName"
          :config-option="configOption"
          @row-click="rowClick"
          >
          <template slot="visitType" slot-scope="scope">
            <span>{{+scope.row.visitType === 1 ? '门诊' : '住院'}}</span>
            <!-- <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.visitType" :show-en="true"></sys-value> -->
          </template>
          <template slot="specimenType" slot-scope="scope">
            <sys-value type="THC_SOB_SPECIMEN_TYPE" :code="scope.row.specimenType" :show-en="true"></sys-value>
          </template>
        </ever-table>
      </div>
      <div class="pagination">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleSizeChange"
          :totalCount="totalCounts"
          :small='true'
          :pager-count="5"
          :pagesize="pagesize"
          :current='currentPage'
          layout="prev, pager, next"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { EOP_PATIENT_LIST } from '@/util/table-config'
import api from '@/infusion/store/infusion'
import moment from 'moment'
/**
 * // 点击队列携带的query
 * appointmentId: "921b92ed-fd93-4eb3-8faf-c5679b3ae9e4"
 * patientId: "ubkUSeydUbmMJLg5K6q"
 * taskIds: "%5B"921b92ed-fd93-4eb3-8faf-c5679b3ae9e4","2ee4ea90-23ef-45c1-979e-4bfd654cc6bf"%5D"
 * timeStamp: "1574832064051"
 * triageId: "76245bbf-cc8c-4a91-9ef8-bee6b9f92cdb"
 * visitNumber: "OPOP201911270000004497
 * // 队列请求参数
 * tenantDeptId科室ID
 * resourceId为医生ID
 * resourceType类型 挂号: register、疫苗: vaccine、检验: lis、预检: pre-check、检查: pacs、输液: infusion、体检: health-checkup 治疗: cure
 */
let date = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
export default {
  props: {
    tenantDeptId: String,
    resourceType: String,
    resourceId: String
  },
  data () {
    return {
      name: '模版',
      searchName: '',
      list: [],
      activeIndex: '',
      loading: false,
      queueType: '10',
      date: date,
      timer: 0,
      totalCounts: 0,
      pagesize: 20,
      currentPage: 1
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleSizeChange (currentPage) {
      this.currentPage = currentPage
      this.queryList()
    },
    tableClick () {
      this.currentPage = 1
      this.queryList()
    },
    input ({id}) {
      clearTimeout(this.timer)
      this.timer = setTimeout(_ => {
        this.queryList(id)
      }, 300)
    },
    init () {
      this.tabsList = [{label: '待执行', value: '10'}, {label: '执行中', value: '20'}, {label: '已执行', value: '30,55'}]
      this.columns = this.getColumns()
      this.configOption = {id: EOP_PATIENT_LIST}
      this.queryList()
    },
    async queryList (patientId) {
      this.loading = true
      let params = {
        executeStatusList: this.queueType.split(','), // 10-待执行 20-执行中 30-已完成 40-已取消
        serviceTypes: ['801', '10003'],
        providerId: this.tenantDeptId, // 科室Id
        search: patientId || this.searchName,
        offset: this.pagesize * (this.currentPage - 1),
        pagesize: this.pagesize
      }
      if (this.date && this.date[0] && this.date[1]) {
        params.startTime = this.date[0] + ' 00:00:00'
        params.endTime = this.date[1] + ' 23:59:59'
      }
      let res = await api.getCheckPatientList(params)
      this.list = res.data || []
      this.totalCounts = res.totalCount
      this.loading = false
    },
    rowClassName ({row}) {
      let id = this.$route.query.adviceId
      if (id === row.adviceId) {
        return 'patient-active'
      }
      return ''
    },
    rowClick ({row}) {
      row.executeIds = row.executeId ? [row.executeId] : []
      this.$router.push({query: {
        // appointmentId: row.patientId, // 检验没有
        // triageId: row.triageId, // 检验没有,不需要接诊
        adviceId: row.adviceId,
        patientId: row.patientId,
        taskId: row.executeId, // 执行单Id
        visitType: row.visitType,
        visitNumber: row.visitNumber || row.hospitalizedNumber,
        hospitalizedNumber: row.hospitalizedNumber,
        timeStamp: Date.now()
      }})
    },
    getColumns () {
      return [{
        prop: 'barCode',
        showOverflowTooltip: true,
        label: '标本号'
      }, {
        prop: 'patientName',
        label: '姓名'
      }, {
        slot: 'visitType',
        prop: 'visitType',
        label: '来源'
      }, {
        slot: 'specimenType',
        prop: 'specimenType',
        label: '标本类型',
        minWidth: '100px'
      }]
    },
  },
}
</script>
<style lang="scss" scoped>
  .tab-patient{
    height: 100%;
    width: 350px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    /deep/ .el-tabs--card > .el-tabs__header{
      .el-tabs__nav{
        width: 100%;
      } 
      .el-tabs__item {
        width: 33%;
        text-align: center;
      }
    }
    /deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
      width: 100%;
    }
    /deep/ .el-tabs__header {
      margin-bottom: 0px;
    }
    .tab-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      overflow: hidden;
      .querydiv{
        padding:0 15px;
        padding-top:15px;
        .patientselect{
          margin-bottom: 15px;;
        }
      }
      .search-name {
        margin: 10px 0;
      }
      .patient-list {
        flex: 1;
        overflow-y: auto;
        /deep/ .patient-queue {
          .el-table__row  {
            cursor: pointer;
          }
          .patient-active {
            background-color: #1c7bef;
            color: #fff;
            &:hover {
              color: inherit;
            }
          }
        }
      }
      .pagination{
        height: 35px;
      }
      .search-butn {
        cursor: pointer;
      }
    }
  }
</style>
