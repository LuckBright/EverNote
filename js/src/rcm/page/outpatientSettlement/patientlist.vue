<template>
  <div class="patientList">
    <div class="settle_body payStyle">
      <el-header style="height:auto;padding:10px 10px 0px 0px">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :is-query="true"
          :labelWidth="'70px'"
          class="search"
        >
          <template slot="recipeCode">
            <el-input v-model="queryObj.recipeCode" @change="codechange"></el-input>
          </template>
          <template slot="patientName">
            <ever-patient-select
              v-model="queryObj.patientName"
              :allow-create="true"
              @select="selectPatient"
              placeholder="姓名／手机号／身份证"
              :hideNo="true"
            ></ever-patient-select>
          </template>
          <template slot="orderDoctor">
            <doctor
              :providerId="''"
              v-model="queryObj.orderDoctor"
              :field="{filterable: true, clearable: true}"
              @change="list(true)"
            ></doctor>
          </template>
          <template slot="arrival">
            <el-checkbox
              v-model="queryObj.arrival"
              :true-label="1"
              :false-label="0"
              @change="list(true)"
              class="arrive"
            >到诊</el-checkbox>
          </template>
          <template slot="payStatus">
            <el-checkbox
              v-model="queryObj.payStatus"
              :true-label="1"
              :false-label="0"
              @change="list(true)"
            >待结算</el-checkbox>
          </template>
          <template slot="daterange">
            <ever-range-picker
              :start.sync="queryObj.beginDate"
              :end.sync="queryObj.endDate"
              @change="list(true)"
            ></ever-range-picker>
          </template>
          <template slot="default">
            <el-col class="btn">
              <el-form-item>
                <el-button type="primary" @click="list(true)">查 询</el-button>
                <el-button @click="reset">重 置</el-button>
              </el-form-item>
            </el-col>
          </template>
        </ever-form2>
      </el-header>
      <el-main style="overflow:inherit;padding:10px 0 0 0!important">
        <el-table
          ref="table"
          :data="tableData"
          class="no-border table-hover-blue"
          height="calc(100vh - 420px)"
          style="width: 100%"
          :highlight-current-row="true"
          v-loading="patientLoading"
          @row-click="rowClick"
        >
          <el-table-column prop="patientName" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="birthday" label="生日" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderDeptName" label="科室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="arrivedTime" label="到诊时间" width="130" v-if="queryObj.arrival">
            <template slot-scope="scope">{{scope.row.arrivedTime}}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="记账时间" width="130" v-else>
            <template slot-scope="scope">{{scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column prop="settleStatus" label="状态">
            <template slot-scope="scope">{{scope.row.settleStatus | filterstatus}}</template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer class="settlefoot">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagerCount="5"
          :totalCount="totalCount"
          :small="true"
          :layout="'total, prev, pager, next'"
        ></ever-pagination>
      </el-footer>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import { getPatients } from '@/rcm/store/outpatient/outpatient.js'
import { birthdayPopup, debounce } from '@/util/common'
import doctor from '@/rcm/page/outpatientSettlement/doctorselect.vue'
import api from '@/titancare/api/operation/index.js'
let schema = [
  {
    name: 'recipeCode',
    label: '扫码收费',
    comp: 'custom',
    span: 24
  },
  {
    name: 'patientName',
    label: '患者姓名',
    comp: 'custom',
    span: 24
  },
  {
    name: 'orderDept',
    label: '开单科室',
    comp: 'everSubjectSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 24
  },
  {
    name: 'orderDoctor',
    label: '开单医生',
    comp: 'everStaffSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id',
      params: { typeCode: 'DOCTOR' }
    },
    span: 24
  },
  {
    name: 'daterange',
    label: '到诊时间',
    comp: 'custom', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
    span: 24
  },
  {
    label: '',
    name: 'arrival',
    comp: 'custom',
    span: 5
  },
  {
    label: '',
    name: 'payStatus',
    comp: 'custom',
    value: 1,
    span: 5
  }
]
export default {
  mixins: [list],
  components: {
    doctor
  },
  watch: {
    'queryObj.patientName': {
      handler: function (val, oldval) {
        if (oldval && !val) {
          this.queryObj.patientid = ''
          this.list(true)
        }
      }
    },
    'queryObj.arrival': {
      handler: function (val) {
        if (val) {
          this.$ever.getFieldFromSchema(this.querySchema, 'daterange').label =
            '到诊时间'
        } else {
          this.$ever.getFieldFromSchema(this.querySchema, 'daterange').label =
            '记账时间'
        }
      }
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    // 启用requestSwitch，禁掉list里面默认的mounted调用list
    // 改由自己决定created调用list(true)或list(false)
    obj.requestSwitch = true
    obj.payStatus = 1
    obj.arrival = 1
    obj.beginDate = new Date()
    obj.endDate = new Date()
    obj.patientid = ''
    return {
      api,
      patientLoading: false,
      tableData: [],
      querySchema: schema,
      queryObj: obj,
      cardloading: false,
      orderDoctorOptions: [],
      clinic: this.$ever.clinic,
      cachePatientId: '',
      showlist: this.$route.query.showlist,
      originRoute: ''
    }
  },
  filters: {
    filterstatus (val) {
      switch (Number(val)) {
        case 1:
          return '已收费'
        case 2:
          return '待收费'
        case 3:
          return '待退费'
        default:
          return '后台返回的状态不对'
      }
    }
  },
  async created () {
    this.originRoute = this.$route.path
    // 开单医生开单科室
    this.list(!this.$route.query.patientId)
  },
  methods: {
    codechange (val) {
      if (val) {
        this.reset()
        this.queryObj.recipeCode = val
        this.queryObj.payStatus = 1
        localStorage.removeItem('recipeCode')
        // this.$bus.$emit('bill:recipeCode', val || '')
        var orignalSetItem = localStorage.setItem
        localStorage.setItem = function (key, newValue) {
          var setItemEvent = new Event('setItemEvent')
          setItemEvent.key = key
          setItemEvent.newValue = newValue
          window.dispatchEvent(setItemEvent)
          orignalSetItem.apply(this, arguments)
        }
        localStorage.setItem('recipeCode', val)
        this.list(true)
      }
    },
    reset () {
      Object.keys(this.queryObj).forEach(v => {
        v !== 'requestSwitch' ? (this.queryObj[v] = '') : null
      })
    },
    selectPatient (val) {
      if (val) {
        // 患者检索框检索该患者后弹出生日提醒
        if (
          val.birthday &&
          this.$moment(val.birthday).format('MM-DD') ===
          this.$moment().format('MM-DD')
        ) {
          birthdayPopup(this)
        }
        this.queryObj.patientName = val.name
        this.queryObj.patientid = val.id
        this.list(true)
      } else {
        this.queryObj.patientid = ''
        this.queryObj.patientName = val.name
      }
    },
    rowClick: debounce(function (row, event, column) {
      // click患者弹出生日提醒
      if (this.cachePatientId !== row.patientid) {
        let birthdayArr = row.birthday && row.birthday.split('-')
        let birthdayStr =
          birthdayArr && birthdayArr.length > 0
            ? `${birthdayArr[1]}-${birthdayArr[2]}`
            : ''
        if (birthdayStr === this.$moment().format('MM-DD')) birthdayPopup(this)
        this.cachePatientId = row.patientid
      }
      const actions = new Map([
        [
          1,
          [
            '/rcm/reconstruct/settled',
            {
              patientId: row.patientid,
              visitNumber: row.rootorderid,
              dptId: row.orderDept,
              showDetail: 1
            }
          ]
        ],
        [
          2,
          [
            '/rcm/reconstruct/peddingsettlement',
            {
              patientId: row.patientid,
              visitNumber: row.rootorderid,
              dptId: row.orderDept
            }
          ]
        ],
        [
          3,
          [
            '/rcm/reconstruct/refunded',
            {
              patientId: row.patientid,
              visitNumber: row.rootorderid,
              dptId: row.orderDept
            }
          ]
        ],
        [
          'default',
          [
            '/rcm/reconstruct/peddingsettlement',
            {
              patientId: row.patientid,
              visitNumber: row.rootorderid,
              dptId: row.orderDept
            }
          ]
        ]
      ])
      let val = row.settleStatus || 'default'
      let action = actions.get(val)
      if (val === 2 || val === 'default') {
        let params = {
          visitNumber: row.rootorderid,
          visitType: 1
        }
        api.getOrderInfo(params).then(rs => {
          let useInsurance = rs.data && rs.data.useInsurance
          if (useInsurance) {
            action[1]['insuranceOrgId'] = useInsurance.insuranceOrgId
          }
          this.goPath(action)
        }, rj => {
          this.goPath(action)
        })
      } else {
        this.goPath(action)
      }
    }, 500),
    goPath (action) {
      const routerPathNow = this.$route.path
      // 左侧列表的切换这样才push，否则跳转到其他菜单的话，在新菜单里就可以了
      if (routerPathNow.indexOf('/rcm/reconstruct') > -1) {
        this.$router.push({
          path: action[0],
          query: action[1]
        })
      }
    },
    // 患者列表
    async list (isopen) {
      this.patientLoading = true
      let params = {
        offset: this.offset,
        pagesize: this.pagesize
      }
      if (this.showlist) {
        this.reset()
        params.rootorderid = this.$route.query.visitNumber
      }
      try {
        let data = await getPatients(Object.assign(params, this.queryObj))
        this.patientLoading = false
        this.tableData = data.data
        this.totalCount = data.totalCount
        // 如果有参数则从参数获取
        if (data.data && data.data.length > 0) {
          if (this.showlist) {
            // 如果是从外面来的，将query.showlist去掉
            let query = Object.assign({}, this.$route.query)
            delete query.showlist
            this.$router.replace({
              path: this.$route.path,
              query: query
            })
            this.showlist = null
            return
          }
          const visitNumber = this.$route.query.visitNumber
          let index = this.tableData.findIndex(item => item.rootorderid === visitNumber)
          if (visitNumber && index === -1) {
            return
          }
          if (!visitNumber) {
            index = 0
          }
          this.$nextTick(_ => {
            this.$refs.table.$el.querySelectorAll('.el-table__row')[index].click()
          })
        } else {
        }
      } catch (err) {
        console.log(err)
        this.patientLoading = false
      }
    }
  }
}
</script>
<style scoped>
.patientList {
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  height: 100%;
  position: relative;
}
.patientList .payStyle {
  width: 100%;
  padding: 0;
  background-color: #fff;
  height: 100%;
  position: relative;
}
.patientList /deep/ .el-input__inner,
.el-textarea__inner {
  padding: 0 10px;
  /* padding-right: 30px; */
}
.type {
  font-size: 12px;
  color: #1c7bef;
}
.patientList /deep/ .el-pagination {
  overflow-x: auto;
}
.patientList /deep/ .el-form-item .ever_date_picker .el-date-editor--daterange {
  width: 100% !important;
}
.patientList /deep/ .el-table {
  margin-top: 0;
}
.patientList /deep/ .el-table .cell {
  word-break: keep-all;
}
.patientList /deep/ .el-footer {
  height: auto !important;
  padding: 0 15px;
  margin-bottom: 15px;
  position: absolute;
  right: 0;
  bottom: 0;
}
.patientList /deep/ .search .el-form-item__label {
  font-size: 12px;
}
.patientList /deep/ .btn .el-form-item {
  margin-bottom: 0 !important;
}
.el-header /deep/.el-form .el-row > .el-col:nth-child(5) .el-form-item {
  margin-bottom: 0;
}
.settlefoot.el-footer {
  padding: 0;
}
</style>

