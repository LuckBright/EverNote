<template>
  <div id="calender" class="flex_column_full_hidden">
    <el-row id="search-head" class="head clearfix pt20 pl20 pr20">
      <el-form :inline="true" label-width="10" label-position="right" class="demo-form-inline">
        <el-col :span="12">
          <el-form-item>
            <el-select v-model="city" placeholder="请选择" clearable>
              <el-option
                v-for="item in cityList"
                :key="item.cityCode"
                :label="item.cityName"
                :value="item.cityCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="orgId" placeholder="全部机构" clearable filterable>
              <el-option
                v-for="(item, index) in searchOrg"
                :key="index + '-' + item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item>
           <copy-popover :calltype="'clinic'" @upadte="v => {this.onSearch()}"></copy-popover>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="publish">发布</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <arrange-week v-model="changeDate" @update="updateWeek"></arrange-week>
        </el-col>
      </el-form>
    </el-row>
    <organizationtable
      ref="otable"
      :arrange-week="weeks"
      :table-data="tableData"
      :check-clinic="checkClinic"
      :td-width="170"
      :changeDate="changeDate && changeDate.substring(8)"
      @update="upshowDialog"
      @loadmore="loadMore"
    ></organizationtable>
    <organizationtablepup
      v-if="showdialogcrm"
      :titleData="titleData"
      :visible="showdialogcrm"
      @closepupcrm="closedialogcrm"
      @success="successCreate"
    ></organizationtablepup>
  </div>
</template>
<script>
import form from '@/util/form'
import api from '@/arrange/store/settingapi'
import wapi from '@/arrange/store/workapi'
import organizationtablepup from './organizationtablepup.vue'
import organizationtable from './organizationtable.vue'
import arrangeWeek from '../personscheduling/arrange.week.vue'
import copyPopover from './copy.popover.vue'
export default {
  mixins: [form],
  data () {
    return {
      api,
      wapi,
      weeks: [],
      tableData: [],
      cityList: [],
      showdialogcrm: false,
      changeDate: this.$moment().format('YYYY-MM-DD'),
      searchOrg: [],
      clinicList: [],
      checkClinic: [],
      titleData: {},
      orgId: '',
      city: '',
      params: {
        startDate: '',
        endDate: ''
      },
      offset: 0,
      pagesize: 20,
      noMore: false,
      count: 0
    }
  },
  watch: {
    'orgId': {
      handler (val) {
        this.onSearch()
        if (val) {
          this.checkdpt(val)
        } else {
          this.checkClinic = []
          this.getSearchOrg(this.city)
        }
      },
      deep: true
    },
    'city': {
      handler (val) {
        if (val) {
          this.orgId = ''
          this.getSearchOrg(val)
        } else {
          this.offset = 0
          this.getSearchOrg()
        }
      },
      deep: true
    }
  },
  created () {
    this.getSourceByClinicCityList()
    this.getSearchOrg()
    this.$nextTick(_ => {
      this.getArrangeList()
    })
  },
  methods: {
    loadMore (val) {
      if (this.noMore) {
        this.offset = (this.count - 1) * this.pagesize
        this.$refs.otable.resetCount()
      } else {
        this.offset = (val - 1) * this.pagesize
      }
      this.getArrangeList(true)
    },
    updateWeek (val, date) {
      if (date) {
        this.$nextTick(_ => {
          this.$refs.otable.resetCount()
          this.onSearch()
        })
      }
      this.weeks = val
    },
    getSearchOrg (val) {
      let params = {
        outOrgGetOrgListByConditionReqDTO: {
          cityCodeList: val ? [val] : null,
        },
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          type2CodeList: ['01.02', '01.03']
        }
      }
      this.wapi.getAllorgdpt(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.searchOrg = []
          rs.data.resultList && rs.data.resultList.map(item => {
            item.tenantSubjectList.length > 0 && this.searchOrg.push(item)
          })
        }
      })
    },
    getAllclinic (val) {
      let params = {
        outOrgGetOrgListByConditionReqDTO: {
          cityCodeList: val ? [val] : null,
          idList: this.orgId ? [this.orgId] : null,
          offset: val ? 0 : this.offset,
          pagesize: val ? 5 : this.pagesize
        },
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          type2CodeList: ['01.02', '01.03']
        }
      }
      this.wapi.getAllorgdpt(params).then(rs => {
        if (rs.head.errCode === 0) {
          if (this.offset === 0) {
            this.clinicList = []
          }
          rs.data.resultList && rs.data.resultList.map(item => {
            item.tenantSubjectList.length > 0 && this.clinicList.push(item)
          })
        }
      })
    },
    getSourceByClinicCityList () {
      this.wapi.getAllclinic().then(rs => {
        if (rs.head.errCode === 0 && rs.data) {
          this.cityList = rs.data || []
        }
      })
    },
    onSearch () {
      this.offset = 0
      this.getArrangeList()
    },
    upshowDialog (val) {
      this.titleData = val
      this.showdialogcrm = true
    },
    successCreate (p) {
      this.offset = 0
      this.$refs.otable.resetCount()
      this.getArrangeList()
      this.showdialogcrm = false
    },
    closedialogcrm () {
      this.showdialogcrm = false
    },
    publish () {
      this.params.startDate = this.weeks[0].date
      this.params.endDate = this.weeks[this.weeks.length - 1].date
      this.params.orgId = this.orgId
      this.api.publishByclinic(this.params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            title: '提示',
            type: 'success',
            message: '排班记录已发布',
            duration: 2000
          })
          this.getArrangeList()
        }
      })
    },
    getArrangeList (isMore) { // 调取查询接口  渲染table列表
      if (this.noMore) this.offset = 0
      let params = {
        startDate: this.weeks[0].date,
        endDate: this.weeks[this.weeks.length - 1].date,
        orgId: this.orgId,
        cityCode: this.city,
        offset: this.offset,
        pagesize: this.pagesize
      }
      this.api.searchByClinic(params).then(rs => { // 机构排班查询
        if (rs.head.errCode === 0) {
          if (!isMore) {
            this.tableData = rs.data.resultList
          } else {
            this.noMore = !rs.data.resultList.length
            if (!rs.data.resultList.length) {
              this.count = this.$refs.otable.count
            }
            this.tableData = rs.data.resultList ? this.tableData.concat(rs.data.resultList) : this.tableData
            let tempObj = {}
            this.tableData = this.tableData && this.tableData.reduce((cur, next) => {
              tempObj[next.id] ? '' : tempObj[next.id] = true && cur.push(next)
              return cur
            }, [])
          }
        }
      })
    },
    checkdpt (val) {
      this.clinicList.map(item => {
        if (item.id === val) {
          this.checkClinic = []
          this.checkClinic.push(item)
        }
      })
    }
  },
  components: {
    organizationtablepup,
    organizationtable,
    arrangeWeek,
    copyPopover
  },
  beforecreated () {
    this.api = api
  }
}
</script>

<style scoped>
#calender {
  background: #fff;
  overflow: hidden;
}
#calender .title {
  line-height: 36px;
}
#calender .changeweek {
  vertical-align: bottom;
}
#calender .changeweek /deep/ .el-button {
  border-radius: 0;
  width: 100px;
  float: left;
}
#calender .changeweek /deep/ .el-button:hover {
  border-color: #dcdfe6;
}
#calender .changeweek /deep/ .el-button + .el-button {
  margin-left: -1px;
}
</style>
