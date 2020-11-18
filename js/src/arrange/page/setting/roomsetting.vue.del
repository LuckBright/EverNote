<template>
  <div class="roomsetting">
    <div class="flex_column_1_hidden layout_inner">
      <el-row class="search-audit">
        <el-col :span="20">
          <el-col :span="20">
          <el-form :model="queryObj" size="small" :inline="true" @query="list(true)" label-width="10" label-position="right">
            <el-form-item>
              <el-select
                v-model="template"
                placeholder="请选择模版"
                value-key="id"
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="selectOrgan" placeholder="请选择机构" value-key="organId">
                <el-option
                  v-for="item in template.templetOrgList"
                  :key="item.organId"
                  :value="item"
                  :label="item.organName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <dept-cascader
                v-model="selectDept"
                :organ-id="queryObj.orgId"
                :template-type="template.timeTrunkType"
              ></dept-cascader>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryObj.arrangeDate"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reload" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        </el-col>
        <el-col :span="4" align="right">
          <add-temp-trunk
            :dept="selectDept"
            :organ="selectOrgan"
            :date="queryObj.arrangeDate"
            :template="template"
            @success="reload"
          ></add-temp-trunk>
        </el-col>
      </el-row>
      <div class="flex_col_1_hidden main-wrap">
        <el-table height="100%" :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="deptName" label="专科" width></el-table-column>
          <el-table-column prop="resourceName" label="医生" width></el-table-column>
          <el-table-column prop="date" label="日期">
            <template slot-scope="scope">{{scope.row.date| formatDateByExp('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="timeTrunkName" label="班次"></el-table-column>
          <el-table-column prop="doctorCode" label="医生编码">
            <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row.doctorCode"
                @focus="handleFocus(scope.row,scope.$index)"
                @blur="handleBlur(scope.row,scope.$index)"
                :disabled="scope.row.isPast"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="诊室">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.resourceR"
                value-key="resourceName"
                clearable
                placeholder="请选择诊室"
                :disabled="scope.row.isPast"
                @change="changeRoom(scope.row,scope.$index)"
              >
                <el-option
                  v-for="item in scope.row.clinicRoomList"
                  :key="item.id"
                  :label="item.resourceName"
                  :value="item"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="clinicCode" label="诊室编码">
            <template slot-scope="scope">
              <span>{{scope.row.clinicCode&&scope.row.clinicCode?scope.row.clinicCode:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop align="center" label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.visitStatus === 1 ? 'danger' : 'success'"
                size="small"
                @click="setArrangeState(scope.row)"
              >{{scope.row.visitStatus === 1 ? '停诊' : '出诊'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount" :current="currentPage">
      </ever-pagination>
    </div>
    <roomtips ref="roomtips" @clickBtn="reback"></roomtips>
  </div>
</template>
<script>

import api from '@/arrange/store/roomsettingapi'
import panelapi from '@/sob/store/service.panel'
import tempapi from '@/arrange/store/templateapi'
import settingapi from '@/arrange/store/settingapi'
import list from '@/util/list'
import roomtips from './dialog-roomtips'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import addTempTrunk from '@/arrange/page/setting/addtemptrunk'
import resource from '@/arrange/page/scheduling/resource.vue'
import storage from '@/util/storage'
// import moment from 'moment'
export default {
  mixins: [list],
  data () {
    return {
      api,
      panelapi,
      tempapi,
      settingapi,
      templateList: [],
      tableData: [],
      queryObj: {
        arrangeDate: '',
        templetId: '',
        orgId: '',
        depId: '',
        offset: 0,
        pageSize: 20
      },
      offset: 0,
      pageSize: 20,
      template: '',
      selectOrgan: '',
      selectDept: '',
      deptParams: {
        relationType: 401,
        relationId: storage.getLocalStorage('USERID')
      },
      configValue: '',
      today: this.$moment(new Date()).format('YYYY-MM-DD'),
      oldCode: '',
      loading: false,
      totalCount: 0,
      currentPage: 1
    }
  },
  created () {
    this.queryObj.arrangeDate = this.$moment(new Date()).format('YYYY-MM-DD')
    this.queryObj.requestSwitch = true
    // 是否允许一个诊室供多个医生使用
    this.getRuleConfigByKey()
    this.getTemplateList()
    this.getDptinfo(this.deptParams)
  },
  watch: {
    template: {
      handler (val) {
        if (val.templetOrgList && val.templetOrgList[0]) {
          this.selectOrgan = val.templetOrgList[0]
        }
        this.queryObj.templetId = val.id
      },
      deep: true
    },
    selectOrgan: {
      handler (val) {
        this.queryObj.orgId = val.organId
      },
      deep: true
    },
    selectDept: {
      handler (val) {
        if (val && val.id) {
          this.queryObj.depId = val.id
        } else {
          this.queryObj.depId = ''
        }
      },
      deep: true
    },
    queryObj: {
      handler (val) {
        if (val.templetId && val.orgId) {
          this.list()
        }
      },
      deep: true
    }
  },
  methods: {
    getRuleConfigByKey () {
      this.api.getRuleConfigByKey(
        { configKey: 'CLINIC_ROOM_DOCTOR_LIMIT' }
      ).then(rs => {
        // 1.诊室设置，每个诊室限制一个医生；2.诊室设置，不限制诊室中医生数量；
        if (rs && rs.data) {
          this.configValue = rs.data.configValue
        }
      })
    },
    reback (val) {
      // 重新分配诊室
      let queryObj = {
        arrangeId: val.obj.id,
        resourceId: val.obj.resourceR.resourceId,
        resourceName: val.obj.resourceR.resourceName,
        clinicCode: val.obj.resourceR.resourceCode
      }
      if (val && val.type === 1) {
        let i = val.index
        this.tableData[i].resourceR = null
      } else {
        // 确认共用诊室
        if (val && val.obj && val.obj.resourceR && val.obj.resourceR.resourceId) {
          this.updateClinicSetting(queryObj)
        }
      }
    },
    async changeRoom (val, i) {
      let queryObj = {
        arrangeId: val.id,
        resourceId: val.resourceR.id,
        resourceName: val.resourceR.resourceName,
        clinicCode: val.resourceR.resourceCode
      }
      if (val.resourceR && val.resourceR.id) {
        if (this.configValue === '2') {
          let rs = await this.api.hasDoctorFlag({ resourceRId: val.resourceR.id })
          if (rs.data === '0') {
            this.updateClinicSetting(queryObj, i)
          } else {
            this.getTips(val, i)
          }
        } else {
          this.updateClinicSetting(queryObj, i)
        }
      } else {
        this.updateClinicSetting(queryObj, i)
      }
    },
    handleFocus (val, i) {
      if (val && val.doctorCode) {
        this.oldCode = val.doctorCode
      }
    },
    handleBlur (val, i) {
      if (val && val.doctorCode && val.doctorCode !== this.oldCode) {
        this.updateClinicSetting({ arrangeId: val.id, doctorCode: val.doctorCode })
      }
    },
    getTips (val, i) {
      this.$refs.roomtips.open(val, i)
    },
    updateClinicSetting (queryObj, i) {
      this.api.updateClinicSetting(queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '更新成功')
          this.list()
        } else {
          this.tableData[i].resourceR = null
        }
      })
    },
    getTemplateList () {
      this.tempapi.list().then(rs => {
        if (rs.head.errCode) {
          return false
        }
        if (rs && rs.data[0]) {
          this.templateList = rs.data
          this.template = rs.data[0]
          this.selectOrgan = this.template.templetOrgList[0]
        }
      })
    },
    setArrangeState (item) {
      this.$confirm('您确定要进行停诊/出诊操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.settingapi.updateTempArrange({
          id: item.id,
          visitStatus: item.visitStatus === 1 ? 0 : 1
        }).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '修改成功', '提示')
            this.reload()
          }
        })
      })
    },
    reload () {
      this.list()
    },
    // 获取当前登录用户科室信息
    getDptinfo (queryObj) {
      this.panelapi.getLocalSectionVoBySearch(queryObj).then(rs => {
        if (rs && rs[0]) {
          this.queryObj.requestSwitch = false
          this.selectDept = rs[0]
        } else {
          this.queryObj.requestSwitch = true
        }
      })
    }
  },
  components: {
    deptCascader,
    resource,
    addTempTrunk,
    roomtips
  }
}
</script>
<style scoped>
.roomsetting {
  background: #ffffff;
}
.roomsetting .search-audit {
  border-bottom: 1px solid #ddd;
}
.layout_box .table_border_all /deep/ .el-table--border th,
.layout_box .table_border_all /deep/ .el-table--border td {
  border-right: 1px solid #ccc !important;
}
.table_border_all /deep/ .el-table th,
.table_border_all /deep/ .el-table td {
  border-bottom: 1px solid #ccc !important;
}
.roomsetting /deep/ .el-table .success-isUnusualStatus td {
  background-color: #fddfdf !important;
}
</style>
