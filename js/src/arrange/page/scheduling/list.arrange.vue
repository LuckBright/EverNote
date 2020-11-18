<template>
  <div class="list" :style="{'max-height': maxHeight}">
    <el-row class="mb10 mt10">
      <el-col :span="16">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          @query="list(true)"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </template>
          <template slot="orgId">
            <ever-org-select
              ref="eos"
              v-model="queryObj.orgId"
              fields="id"
              :isOrg="false"
              :props="{
                'clearable': false
              }">
            </ever-org-select>
          </template>
          <template slot="tenantDeptId">
            <ever-subject-select
              ref="ess"
              v-model="queryObj.tenantDeptId"
              fields="orgSubjectCode"
              :params="{
                'orgId': queryObj.orgId,
                'type2CodeList': typeCode,
                'status': 'Y'
              }">
            </ever-subject-select>
          </template>
          <template slot="resourceName">
            <el-form-item :label="resourceName">
              <el-input v-model="queryObj.resourceName"></el-input>
            </el-form-item>
          </template>
          <template slot="billDate">
            <el-date-picker
              v-model="queryObj.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="8" class="right">
        <el-button type="primary" class="el-button--small" @click="deleteBatch">批量删除</el-button>
        <!-- <el-button type="primary" class="el-button--small" @click="publish">发布</el-button> -->
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="listTable"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column
          prop="tenantDeptName"
          label="科室"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="resourceName"
          :label="resourceName"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          :label="$route.path.split('/')[3] === 'out' ? '号别': '服务能力'"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.services.length > 0 " v-for="item in scope.row.services" :key="item.id">
              <div v-if="item.frequencyType === 1">
                <span>{{item.serviceName}}</span>
                <span>{{item.frequencyAmount}}</span>分钟 <span>{{item.frequencyVolume}}</span>个
              </div>
              <div v-else>
                <span>{{item.serviceName}}</span>
                <span>每班次{{item.frequencyVolume}}</span>个
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="arrangeTime"
          label="排班日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="timetrunkName"
          label="班次"
          align="center">
        </el-table-column>
        <el-table-column
          label="时段"
          align="center">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.timeranges" :key="index" class="mr5"> {{item.startTime.substring(0,5)}}-{{item.endTime.substring(0,5)}} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="排班状态"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status === 1 ? '未发布': '已发布'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button :disabled="$moment(scope.row.arrangeTime).isBefore($moment().format('YYYY-MM-DD'))" type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button :disabled="$moment(scope.row.arrangeTime).isBefore($moment().format('YYYY-MM-DD'))" type="danger" size="small" @click="deleteItems(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="currentPage"
          :page-sizes="[10, 20]"
        ></ever-pagination>
    </el-row>
  </div>
</template>
<script>
import api from '@/arrange/store/workapi'
import utillist from '@/util/list'
let querySchema = [
  {
    name: 'orgId',
    label: '机构',
    comp: 'custom'
  },
  {
    name: 'tenantDeptId',
    comp: 'custom',
    label: '科室'
  },
  {
    name: 'resourceName',
    comp: 'custom',
  },
  {
    name: 'billDate',
    label: '排班日期',
    comp: 'custom'
  }
]
export default {
  props: {
    'dptName': {
      type: String,
      default: ''
    },
    'resourceName': {
      type: String,
      default: ''
    },
    'categoryCode': {
      type: String,
      default: ''
    },
    'typeCode': {
      type: Array,
      default: () => []
    }
  },
  minix: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.date = [
      this.$moment().format('YYYY-MM-DD'),
      this.$moment().add(7, 'days').format('YYYY-MM-DD')
    ]
    return {
      api,
      queryObj,
      querySchema,
      listTable: [],
      checkArr: [],
      totalCount: 0,
      currentPage: 1,
      offset: 0,
      pagesize: 20,
      maxHeight: null
    }
  },
  watch: {
    'queryObj.orgId': {
      handler (val) {
        if (val) this.queryObj.tenantDeptId = ''
      },
      deep: true
    },
    'categoryCode': {
      handler (val, oldVal) {
        if (val !== oldVal) {
          this.queryObj.resourceName = ''
          this.queryObj.tenantDeptId = ''
          this.queryObj.date = [
            this.$moment().format('YYYY-MM-DD'),
            this.$moment().add(7, 'days').format('YYYY-MM-DD')
          ]
          this.getOrgList()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.maxHeight = (window.innerHeight - 150) + 'px'
  },
  created () {
    this.$nextTick(_ => {
      this.getOrgList()
    })
  },
  methods: {
    async getOrgList () {
      this.api.getAllcliniclist().then(rs => {
        if (rs.head.errCode === 0) {
          rs.data.resultList && rs.data.resultList.map(item => {
            if (item.id === this.$store.state.currentUser.organizationId.toString()) {
              this.queryObj.orgId = item.id
            }
          })
          this.list(true)
        }
      })
    },
    search () {
      this.offset = 0
      this.currentPage = 1
      this.list()
    },
    list () {
      api.listSearch({
        categoryCode: this.categoryCode,
        orgId: this.queryObj.orgId,
        tenantDeptId: this.queryObj.tenantDeptId,
        resourceName: this.queryObj.resourceName,
        startDate: this.queryObj.date && this.queryObj.date[0],
        endDate: this.queryObj.date && this.queryObj.date[1],
        offset: this.offset,
        pagesize: this.pagesize,
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.listTable = rs.data ? rs.data.resultList : []
          this.totalCount = rs.data ? rs.data.totalCount : 0
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.currentPage - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list()
    },
    handleSelectionChange (val) {
      this.checkArr = val
    },
    deleteBatch () {
      this.$confirm('删除排班可能会影响已经预约的患者，请确认后谨慎操作', '您是否确认要删除此排班?', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        this.checkArr.filter(item => {
          ids.push(item.id)
        })
        if (ids.length === 0) {
          this.$messageTips(this, 'warning', '请先勾选要批量删除的记录')
          return false
        }
        this.api.deleteByInstanceIds(
          {
            'ids': ids
          }
        ).then(rs => {
          if (rs.head.errCode === 0) {
            this.list()
            this.$message({
              type: 'success',
              message: '批量删除成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    publish () {
      let ids = []
      this.checkArr.filter(item => {
        ids.push(item.id)
      })
      let params = {
        ids: ids
      }
      if (ids.length === 0) {
        this.$messageTips(this, 'warning', '请先勾选需要发布的的记录')
        return false
      }
      this.api.publishList(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.list()
        }
      })
    },
    // 科室数据切换
    getSource (type, val) {
      let params = {
        type2CodeList: [type],
        roomPurposeCodeList: [val]
      }
      api.getSource(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.dptList = []
          this.dptList = rs.data.resultList.filter(item => {
            item.tsStaffList = item.roomList
            return item
          })
        }
      })
    },
    deleteItems (id) {
      this.$confirm('删除排班可能会影响已经预约的患者，请确认后谨慎操作', '您是否确认要删除此排班?', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.delByInstanceId(
          {
            'id': id
          }
        ).then(rs => {
          if (rs.head.errCode === 0) {
            this.list()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    edit (val) {
      let titleData = {
        date: val.arrangeTime,
        orgName: val.orgName,
        orgId: val.orgId,
        dptName: val.tenantDeptName,
        dptId: val.tenantDeptId,
        docName: val.resourceName,
        doctorId: val.resourceId
      }
      this.$bus.$emit('showdpt', val.id, titleData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .list{
    overflow-y: scroll;
  }
</style>

