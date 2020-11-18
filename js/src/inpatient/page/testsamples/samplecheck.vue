<template>
  <div class="flex_column_full_hidden visitlist">
    <div class="flex_column_1_hidden layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          @query="list"
          :gutter="10"
          labelWidth="0"
          class="labelprintForm"
        >
          <template slot="dateRange">
            <el-date-picker
              style="width: 260px; padding:0px 0px 0px 8px"
              v-model="dateRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </template>
          <template slot="areaId">
            <el-select :clearable="true" v-model="queryObj.areaId" placeholder="请选择">
              <el-option
                v-for="item in queryStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <template slot="hospitalizedBedId">
              <el-input v-model="queryObj.hospitalizedBedId" placeholder="按床号检索"></el-input>
            </template>
          </template>
          <template slot="specimenType">
            <el-select
              :clearable="true"
              filterable
              v-model="queryObj.specimenType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in queryStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="gatherCode">
            <el-select :clearable="true" filterable v-model="queryObj.gatherCode" placeholder="请选择">
              <el-option
                v-for="item in nursersData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template>
            <div class="el-form-item">
              <div class="el-form-item__content">
                <el-button @click="searchMarerial">查询</el-button>
              </div>
            </div>
          </template>
        </ever-form2>
      </div>
      <div class="flex_col_1_hidden main-wrap">
        <el-table height="100%" :data="tableData">
          <el-table-column label="病区" prop="areaName" show-overflow-tooltip width="150px"></el-table-column>
          <el-table-column label="患者姓名" prop="patientName" show-overflow-tooltip></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
            </template>
          </el-table-column>
          <el-table-column label="出生日期" show-overflow-tooltip prop="birthday" width="150px">
            <template
              slot-scope="scope"
            >{{!scope.row.birthday ? '--' : $moment(scope.row.birthday).format('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column
            label="床号"
            show-overflow-tooltip
            prop="hospitalizedBedName"
            width="150px"
          ></el-table-column>
          <el-table-column label="医嘱" width="400px" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-table class="no-border" :data="scope.row.res" :show-header="false">
                <el-table-column>
                  <template slot-scope="scope">
                    {{scope.row.serviceName}}
                    <span v-if="scope.row.urgent === 1">
                      <i class="txt_icon">急</i>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.specimenType">
                        标本类型:
                        <sys-value type="THC_SOB_SPECIMEN_TYPE" :code="scope.row.specimenType"></sys-value>
                      </span>
                      <span v-if="scope.row.urgen == 1">加急: 是</span>
                    </div>
                    <div v-if="scope.row.checkGuidance">检验指导: {{scope.row.checkGuidance}}</div>
                    <div v-if="scope.row.excuteProvider">执行科室: {{scope.row.excuteProvider}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="开单医生" show-overflow-tooltip prop="doctorName"></el-table-column>
          <el-table-column label="标本状态">
            <template slot-scope="scope">{{sampleStatus(scope.row.status)}}</template>
          </el-table-column>
          <el-table-column label="条码打印人" width="150px" prop="barcodePrintAuthorName"></el-table-column>
          <el-table-column label="打印时间" width="200px" show-overflow-tooltip prop="barcodePrintTime"></el-table-column>
          <el-table-column label="采集人" show-overflow-tooltip prop="gather"></el-table-column>
          <el-table-column label="采集时间" width="200px" show-overflow-tooltip prop="gatherTime"></el-table-column>
          <el-table-column
            label="配送人"
            width="100px"
            show-overflow-tooltip
            prop="deliveryAuthorName"
          ></el-table-column>
          <el-table-column label="配送时间" width="200px" show-overflow-tooltip prop="deliveryTime"></el-table-column>
          <el-table-column label="签收人" show-overflow-tooltip prop="signName"></el-table-column>
          <el-table-column label="签收时间" width="200px" show-overflow-tooltip prop="signTime"></el-table-column>
          <el-table-column label="上机操作人" width="150px" show-overflow-tooltip prop="operateName"></el-table-column>
          <el-table-column label="上机时间" width="200px" prop="operateTime"></el-table-column>
          <el-table-column label="报告审核人" width="150px" show-overflow-tooltip prop="publishReportName"></el-table-column>
          <el-table-column
            label="报告审核时间"
            width="200px"
            show-overflow-tooltip
            prop="publishReportTime"
          ></el-table-column>
        </el-table>
      </div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/inpatient/store/sampleapi'
import list from '@/util/list'
import storage from '@/util/storage.js'
import registerapi from '@/rcm/store/hospitalization/register'
import inhospital from '@/workspace/store/inhospital'
import valueKey from '@/crm/page/healthy/taskvaluekey'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import { findIndex } from 'lodash'

const schema = [
  {
    name: 'adviceType', // 单选 - adviceType | 多选 - adviceTypes 后端做了处理
    label: '',
    comp: 'sys-select',
    style: {
      width: '100px'
    },
    props: {
      clearable: false,
      placeholder: '医嘱类型',
      options: [
        {
          id: 801,
          name: '检验类'
        },
        {
          id: 10001,
          name: '备血类'
        },
        {
          id: 10003,
          name: '病理类'
        }
      ]
    }
  },
  {
    name: 'dateRange',
    label: '条码打印日期',
    comp: 'custom'
  },
  {
    name: 'hospitalizedBedId',
    label: '床号',
    comp: 'sys-select',
    span: 3,
    props: {
      options: [],
      placeholder: '按床号检索'
    }
  },
  {
    name: 'specimenType',
    label: '标本类型',
    comp: 'sys-type',
    span: 3,
    props: {
      placeholder: '标本类型',
      code: 'THC_SOB_SPECIMEN_TYPE'
    }
  },
  {
    name: 'recipeStatus',
    label: '标本状态',
    comp: 'sys-select',
    span: 3,
    props: {
      placeholder: '是否采集',
      options: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 20,
          name: '已打印'
        },
        {
          id: 30,
          name: '已采集'
        },
        {
          id: 35,
          name: '已配送'
        },
        {
          id: 45,
          name: '已签收'
        },
        {
          id: 50,
          name: '检验中'
        },
        {
          id: 60,
          name: '已完成'
        }
      ]
    }
  },
  {
    name: 'barcodePrintAuthorCode',
    label: '条码打印人',
    comp: 'sys-select',
    span: 3,
    props: {
      placeholder: '按条码打印人检索',
      options: []
    }
  },
  {
    name: 'gatherCode',
    label: '采集人',
    comp: 'custom',
    span: 3,
    props: {
      placeholder: '按采集人检索',
      options: []
    }
  }
]

export default {
  mixins: [list, valueKey],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.recipeStatus = '-1'
    obj.adviceType = '801'
    return {
      api,
      querySchema: schema,
      queryObj: obj,
      dateRange: [],
      queryStatus: [],
      dialogVisible: false,
      deliveryObj: {},
      keyValueMap: {},
      nursersData: []
    }
  },
  created () {
    const spaceName = this.$route.matched[0].meta.space
    this.sessionKey = 'spaceId'
    if (spaceName === 'csa') {
      this.sessionKey = 'csaSpaceId'
    } else if (spaceName === 'birth_nurse') {
      this.sessionKey = 'birthSpaceId'
    }
    this.queryObj.areaId = storage.getSessionStorage(this.sessionKey)
    this.getAdmitBedSelect()
    this.getNursers()
    this.pickDay(0)
  },
  methods: {
    pickDay (timeRange) {
      const day = new Date()
      const startDay = day.getTime() - 3600 * 1000 * 24 * timeRange
      const endDay = day.getTime()
      this.dateRange = []
      this.dateRange.push(new Date(startDay))
      this.dateRange.push(new Date(endDay))
    },
    async getNursers () {
      let res = await inhospital.getStaffRecordVoListForService({})
      if (res && res.data && res.data.length) {
        this.$ever.getFieldFromSchema(
          this.querySchema,
          'barcodePrintAuthorCode'
        ).props.options = res.data
        this.$ever.getFieldFromSchema(
          this.querySchema,
          'gatherCode'
        ).props.options = res.data
        this.nursersData = res.data
        this.keyValueMap = {}
        this.nursersData.map(item => {
          this.keyValueMap[item.id] = item.name
        })
      } else {
        this.nursersData = []
      }
    },
    searchMarerial () {
      this.current = 1
      this.offset = 0
      this.list()
    },
    async list () {
      // 医嘱类型 检验 - 801 | 备血 - 10001 | 病理 - 10003
      let adviceType = this.queryObj.adviceType
      if (adviceType === '10003') {
        this.queryObj.specimenType = ''
      }
      if (this.queryObj.gatherCode in this.keyValueMap) {
        this.queryObj.gather = this.keyValueMap[this.queryObj.gatherCode]
      } else {
        this.queryObj.gather = ''
      }
      if (this.dateRange != null && this.dateRange.length !== 0) {
        this.queryObj.startTime = this.$moment(this.dateRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.queryObj.endTime = this.$moment(this.dateRange[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      } else {
        this.queryObj.startTime = ''
        this.queryObj.endTime = ''
      }
      this.queryObj.pagesize = this.pagesize
      this.queryObj.offset = this.offset
      const res = await api.searchSpecimenTracking(this.queryObj)
      if (res !== null) {
        this.tableData = []
        res.list.map(item => {
          if (item.length === 0) return
          item[0].res = item
          this.tableData.push(item[0])
        })
        this.totalCount = res.totalCount
      }
    },
    async getAdmitBedSelect () {
      let params = {
        relationType: '201',
        relationId: this.queryObj.areaId
      }
      const res = await registerapi.getAdmitBedSelect(params)
      if (
        res &&
        res.head &&
        res.head.errCode === 0 &&
        res.data &&
        res.data.resultList &&
        res.data.resultList.length
      ) {
        let list = []
        res.data.resultList.forEach(item => {
          list.push({
            id: item.id,
            name: item.bedNum
          })
        })
        this.$ever.getFieldFromSchema(
          this.querySchema,
          'hospitalizedBedId'
        ).props.options = list
      }
    }
  },
  components: {
    adviceItemShow
  },
  watch: {
    dateRange () {
      this.searchMarerial()
    },
    'queryObj.adviceType' (val) {
      const specimenType = {
        name: 'specimenType',
        label: '标本类型',
        comp: 'sys-type',
        props: {
          placeholder: '标本类型',
          code: 'THC_SOB_SPECIMEN_TYPE'
        }
      }
      let arrIndex = findIndex(this.querySchema, (item) => item.name === 'specimenType')
      if (val === '10003' && arrIndex !== -1) {
        this.querySchema.splice(arrIndex, 1)
      } else if (arrIndex === -1) {
        this.querySchema.splice(2, 0, specimenType)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.flex_column_full_hidden {
  /deep/ .el-form .el-form-item {
    margin-bottom: 0px;
  }
}
.mtop {
  margin-top: 35px;
}
</style>
