<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list(true)"
          ref="form"
          class="package-sale"
          :labelWidth="140"
          label-position="right"
          :is-query="true"
          v-ever-bind-enter
          :inline="true"
        >
          <template slot="patientInfo">
             <ever-patient-select ref='inputSeach' v-model="queryObj.patientInfo" @select="infoChange" :allowCreate="false"></ever-patient-select>
           </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button
                type="primary"
                @click="eliminate(1)"
              >积分清零</el-button>
              <el-button
                type="primary"
                @click="eliminate(2)"
              >积分减半</el-button>
              <el-button
                type="primary"
                @click="typeSetting()"
              >变动类型设置</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div v-if="tableData && tableData.length > 0">
        <el-table
          v-loading.body="loading"
          :data="tableData"
          border
        >
          <el-table-column
            prop
            :label="$t('姓名')"
          >
            <template slot-scope="scope">{{scope.row.patient?scope.row.patient.name:''}}</template>
          </el-table-column>
          <el-table-column
            prop
            :label="$t('手机号')"
          >
            <template slot-scope="scope">{{scope.row.patient?scope.row.patient.mobile:''}}</template>
          </el-table-column>
          <el-table-column
            prop="points"
            align="right"
            :label="$t('积分')"
          >
            <template slot-scope="scope">{{scope.row.points | initIntegral}}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="330"
            fixed="right"
            align="center"
            prop="status"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="addPoint(scope.$index, scope.row)"
              >增加积分</el-button>
              <el-button
                type="primary"
                @click="changePoint(scope.$index, scope.row)"
              >兑换积分</el-button>
              <el-button
                type="primary"
                @click="showList(scope.$index, scope.row)"
              >交易记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-no-data height="180" v-else></ever-no-data>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
    <add-point
      ref="addpoint"
      :rowData="rowData"
      @query="list(true)"
    ></add-point>
    <change-point
      ref="changepoint"
      :rowData="rowData"
      @query="list(true)"
    ></change-point>
    <change-list ref="changelist"></change-list>
    <credit-type-setting
      ref="typeSettingListLog"
      @query="list(true)"
    ></credit-type-setting>
  </div>
</template>

<script>
import api from '../store/creditapi'
import utillist from '../../util/list'
import addPoint from '../page/addpoint'
import changePoint from '../page/changepoint'
import changeList from '../page/changelist'
import creditTypeSetting from '../page/credittypesetting'

let querySchema = [
  {
    label: '患者姓名',
    name: 'patientInfo',
    comp: 'custom'
  }
]

export default {
  mixins: [utillist],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    obj.patientId = ''
    return {
      tableData: [],
      querySchema: querySchema,
      queryObj: obj,
      rowData: '',
    }
  },
  filters: {
    initIntegral (val) {
      let integer = val.toString().split('.')[0]
      let decimal = val.toString().split('.')[1]
      if (decimal && decimal.length > 2) {
        return integer + '.' + Number(decimal.substring(0, 3) / 10).toFixed()
      } else {
        return val
      }
    }
  },
  methods: {
    infoChange (val) {
      if (val) {
        this.queryObj.patientId = val.id
      } else {
        this.queryObj.patientId = ''
      }
    },
    typeSettingListLog (i, rs) {
      this.$refs.typeSettingListLog.onDialogOpen(rs)
    },
    addPoint (i, rs) {
      this.rowData = rs
      this.$refs.addpoint.onDialogOpen(rs)
    },
    changePoint (i, rs) {
      this.rowData = rs
      this.$refs.changepoint.onDialogOpen(rs)
    },
    showList (i, rs) {
      this.rowData = rs
      this.$refs.changelist.onDialogOpen(rs)
    },
    eliminate (val) {
      let titleVal = `确定要把所有用户的积分进行${Number(val) === 1 ? `清零` : `减半`}吗？`
      this.$confirm(titleVal, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = Number(val) === 1 ? 'setAllZero' : 'setAllHalve'
        api[url]().then(result => {
          if (result.head.errCode === 0) {
            this.list(true)
            this.$messageTips(this, 'success', '操作成功')
          }
        })
      })
    },
    typeSetting () {
      this.typeSettingListLog()
    }
  },
  created () {
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    addPoint,
    changePoint,
    changeList,
    creditTypeSetting
  }
}
</script>
<style scoped>
.tb-header {
  background-color: #eef1f6;
  line-height: 40px;
  text-align: center;
  margin-bottom: 10px;
}
.tb-title {
  background-color: #eef1f6;
  line-height: 30px;
  padding: 0 10px;
}
.tb-table {
  border-left: 1px solid #eef1f6;
  border-top: 1px solid #eef1f6;
  line-height: 30px;
}
.tb-table td {
  border-bottom: 1px solid #eef1f6;
  border-right: 1px solid #eef1f6;
}
.package-sale {
  position: relative;
}
.package-sale /deep/ .el-form-item:last-child {
  position: absolute;
  right: 0;
}
</style>

