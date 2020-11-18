<template>
  <div class="visitlist">
    <el-card style="height: 100%;border: 0px;overflow:auto;padding: 0px">
      <el-row>
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
              value-format="yyyy-MM-dd HH:mm:ss"
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
            <template slot="patientId">
              <el-input v-model="queryObj.patientId" placeholder="按姓名检索"></el-input>
            </template>
          </template>
          <template slot="specimenType">
            <el-select :clearable="true" v-model="queryObj.specimenType" placeholder="请选择">
              <el-option
                v-for="item in queryStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="recipeStatus">
            <el-select v-model="queryObj.recipeStatus" placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in recipeStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template>
            <el-button @click="searchMarerial">查询</el-button>
            <el-button @click="delivery" :disabled="selectedArr.length === 0">配送</el-button>
          </template>
        </ever-form2>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            border
            @selection-change="selectionChange"
            ref="table"
            style="margin-top: 0px"
          >
            <el-table-column type="selection" :selectable="selectable"></el-table-column>
            <el-table-column label="病区" width="150px" prop="areaName" show-overflow-tooltip></el-table-column>
            <el-table-column label="患者姓名" prop="patientName" show-overflow-tooltip></el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
              </template>
            </el-table-column>
            <el-table-column label="出生日期" width="180px" show-overflow-tooltip prop="birthday">
              <template
                slot-scope="scope"
              >{{!scope.row.birthday ? '--' : $moment(scope.row.birthday).format('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column label="床号" show-overflow-tooltip prop="hospitalizedBedName"></el-table-column>
            <el-table-column label="医嘱" width="400px" :span="1">
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
            <el-table-column label="标本状态" prop="status" :span="2">
              <template slot-scope="scope">{{sampleStatus(scope.row.status)}}</template>
            </el-table-column>
            <el-table-column label="条码打印人" width="100px" prop="barcodePrintAuthorName" :span="1"></el-table-column>
            <el-table-column label="打印时间" width="160px" prop="barcodePrintTime" :span="2"></el-table-column>
            <el-table-column label="采集人" width="90px" prop="gather" :span="1"></el-table-column>
            <el-table-column label="采集时间" width="160px" :span="3" prop="gatherTime"></el-table-column>
            <el-table-column label="配送人" :span="1" prop="deliveryAuthorName"></el-table-column>
            <el-table-column label="配送时间" width="160px" prop="deliveryTime" :span="2"></el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog title="配送" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="deliveryObj" :rules="rules" label-width="80px">
        <el-form-item label="配送人" prop="deliveryAuthorName">
          <el-select
            v-model="deliveryObj.deliveryAuthorName"
            placeholder="请选择"
            filterable
            style="width:220px"
          >
            <el-option
              v-for="item in nursersData"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送时间" prop="deliveryTime">
          <el-date-picker
            v-model="deliveryObj.deliveryTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/inpatient/store/sampleapi'
import list from '@/util/list'
import storage from '@/util/storage.js'
import registerapi from '@/rcm/store/hospitalization/register'
import valueKey from '@/crm/page/healthy/taskvaluekey'
import inhospital from '@/workspace/store/inhospital'
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
    label: '采集日期',
    comp: 'custom'
  },
  {
    name: 'hospitalizedBedId',
    label: '',
    comp: 'sys-select',
    span: 3,
    props: {
      options: [],
      placeholder: '按床号检索'
    }
  },
  {
    name: 'patientId',
    label: '',
    span: 3,
    comp: 'ever-patient-select'
  },
  {
    name: 'specimenType',
    label: '标本类型',
    comp: 'sys-type',
    span: 3,
    props: {
      placeholder: '标本类型',
      code: 'THC_SOB_SPECIMEN_TYPE',
      filterable: true
    }
  },
  {
    name: 'recipeStatus',
    label: '标本状态',
    comp: 'custom',
    span: 3,
    props: {
      placeholder: '是否采集',
      options: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 30,
          name: '已采集'
        },
        {
          id: 35,
          name: '已配送'
        }
      ]
    }
  },
  {
    name: 'urgent',
    label: '',
    comp: 'custom'
  }
]

export default {
  mixins: [list, valueKey],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.recipeStatus = -1
    obj.urgent = '-1'
    obj.adviceType = '801'
    return {
      api,
      querySchema: schema,
      queryObj: obj,
      dateRange: [],
      queryStatus: [],
      dialogVisible: false,
      selectedArr: [],
      deliveryObj: {
        deliveryAuthorName: '',
        deliveryTime: ''
      },
      rules: {
        deliveryAuthorName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        deliveryTime: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ]
      },
      nursersData: [],
      recipeStatus: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 30,
          name: '已采集'
        },
        {
          id: 35,
          name: '已配送'
        }
      ]
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
    this.pickDay(0)
    this.getNursers()
  },
  methods: {
    async getNursers () {
      let res = await inhospital.getStaffRecordVoListForService({
        relationType: '402',
        relationId: storage.getSessionStorage(this.sessionKey),
        staffType: '40'
      })
      if (res && res.data && res.data.length) {
        this.nursersData = res.data
      } else {
        this.nursersData = []
      }
    },
    pickDay (timeRange) {
      const day = new Date()
      const startDay = day.getTime() - 3600 * 1000 * 24 * timeRange
      const endDay = day.getTime()
      this.dateRange = []
      this.dateRange.push(new Date(startDay))
      this.dateRange.push(new Date(endDay))
    },
    selectionChange (arr) {
      this.selectedArr = arr
    },
    delivery () {
      if (this.selectedArr.length !== 0) {
        this.dialogVisible = true
        this.deliveryObj.deliveryAuthorName = ''
        this.deliveryObj.deliveryTime = new Date()
      }
    },
    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitForm () {
      const ids = []
      this.selectedArr.forEach(item => {
        item.res.forEach(sub => {
          ids.push(sub.id)
        })
      })
      this.deliveryObj.deliveryTime = this.$moment(
        this.deliveryObj.deliveryTime
      ).format('YYYY-MM-DD HH:mm:ss')
      this.deliveryObj.ids = ids
      const res = await api.updateSpecimenDelivered(this.deliveryObj)
      if (res === true) {
        this.$messageTips(this, 'success', '操作成功')
        this.searchMarerial()
        this.dialogVisible = false
      } else {
        console.log(res)
      }
    },
    searchMarerial () {
      this.current = 1
      this.offset = 0
      this.tableData = []
      this.totalCount = 0
      this.list()
    },
    async list () {
      // 医嘱类型 检验 - 801 | 备血 - 10001 | 病理 - 10003
      let adviceType = this.queryObj.adviceType
      if (adviceType === '10003') {
        this.queryObj.specimenType = ''
      }
      if (this.dateRange != null && this.dateRange.length !== 0) {
        this.queryObj.gatherStartTime = this.$moment(this.dateRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.queryObj.gatherEndTime = this.$moment(this.dateRange[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      } else {
        this.queryObj.gatherStartTime = ''
        this.queryObj.gatherEndTime = ''
      }
      this.queryObj.pagesize = this.pagesize
      this.queryObj.offset = this.offset
      const res = await api.searchSpecimen(this.queryObj)
      this.tableData = []
      if (res) {
        res.list.map(item => {
          if (item.length === 0) return
          item[0].res = item
          this.tableData.push(item[0])
        })
        this.totalCount = res.totalCount
      }
    },
    selectable (row, index) {
      return row.status === 30
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

<style scope lang="scss">
.mtop {
  margin-top: 35px;
  height:96.1%;
  /deep/ .el-card__body {
    padding: 10px;
  }
  /deep/ .el-form .el-form-item {
    margin-bottom: 8px;
  }
  .card {
    height: 100%;border: 0px;overflow:auto;padding: 0px
  }
}
.visitlist {
  background: #fff;
}
.input {
  width: 220px;
}
.timefont {
  font-size: 10px;
}
</style>
