<template>
  <div class="visitlist" :class="{suifang: !weirdCss}">
    <ever-bread-crumb v-if="isYihu" :name="'返回'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div style="height: 96%;border: 0px" class="layout_inner">
      <el-row>
        <el-col :span="20">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="false"
            @query="list(true)"
          >
            <template>
              <el-button @click="searchList" type="primary">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </template>
            <template slot="name">
              <el-autocomplete
                style="width:100%"
                v-model="queryObj.name"
                :maxlength="50"
                :fetch-suggestions="querySearch"
                placeholder="请输入随访计划名称"
              ></el-autocomplete>
            </template>
          </ever-form2>
        </el-col>
        <!-- <el-col :span="4" align="right">
          <el-button @click="linkNewfollow" type="primary">新建随访</el-button>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border>
            <el-table-column label="患者信息" :span="3" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.patientName}}
                <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
                {{scope.row.patientBirthday && $moment(scope.row.patientBirthday).format('YYYY-MM-DD')}}
              </template>
            </el-table-column>
            <el-table-column label="随访计划" :span="1" prop="templateName"></el-table-column>
            <el-table-column show-overflow-tooltip label="归属科室" prop="belongDptName" :span="1"></el-table-column>
            <el-table-column show-overflow-tooltip label="随访说明" :span="2">
              <template slot-scope="scope">{{scope.row.comment ? scope.row.comment : '--'}}</template>
            </el-table-column>
            <el-table-column prop="execDptName" label="随访执行科室" align="center" :span="1"></el-table-column>
            <el-table-column label="随访状态" align="center" :span="2">
              <template slot-scope="scope">
                <span>{{statusText(scope.row.status)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dptName" label="创建随访科室" align="center" :span="1"></el-table-column>
            <el-table-column label="创建人" align="center" prop="creatorName" :span="1"></el-table-column>
            <el-table-column prop="createTime" width="200px" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" width="200px" align="center">
              <template slot-scope="scope">
                <el-button
                  v-show="scope.row.status !== 0"
                  type="primary"
                  size="small"
                  @click="showDialog(scope.row.id)"
                >操作日志</el-button>
                <el-button
                  v-show="scope.row.status === 1"
                  type="danger"
                  size="small"
                  @click="endVisit(scope.row.id)"
                >终止</el-button>
                <el-button
                  v-show="scope.row.status === 0"
                  type="danger"
                  size="small"
                  @click="deleteRow(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
      <dialog-log :followupId="followupId" :visible="dialogVisible" @close="close" @update="update"></dialog-log>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import wapi from '@/arrange/store/appointapi'
import dialogLog from '@/crm/page/healthy/dialog.log'
import list from '@/util/list'
import taskvaluekey from '@/crm/page/healthy/taskvaluekey'
let querySchema = [
  {
    name: 'name',
    comp: 'custom',
    label: '随访计划名称',
    span: 4
  },
  {
    name: 'status',
    comp: 'el-select',
    props: {
      options: [
        {
          id: '0',
          name: '待执行'
        },
        {
          id: 1,
          name: '进行中'
        },
        {
          id: 2,
          name: '已完成'
        },
        {
          id: 3,
          name: '已终止'
        },
        {
          id: 5,
          name: '已过期'
        },
        {
          id: 6,
          name: '已取消'
        },
        {
          id: 7,
          name: '未分配'
        }
      ],
      placeholder: '选择状态'
    },
    label: '状态',
    span: 4
  },
  {
    name: 'belongDptId',
    label: '归属科室',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '请选择归属科室',
      filterable: true
    }
  }
]
export default {
  mixins: [list, taskvaluekey],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      weirdCss: false,
      api: api,
      listApiName: 'getAllfollowUp',
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      followupId: '',
      dialogVisible: false,
      isYihu: false
    }
  },
  created () {
    // 为门急诊添加返回按钮
    if (this.$router.currentRoute.path.includes('workspace/followup')) {
      this.isYihu = true
    }
    this.getDpt()
    // 处理样式异常
    if (
      this.$router.currentRoute.path.includes('resident') ||
      this.$router.currentRoute.path.includes('inpatient')
    ) {
      this.weirdCss = true
    }
  },
  methods: {
    showDialog (val) {
      this.followupId = val
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    update () {
      this.dialogVisible = false
    },
    searchList () {
      this.queryObj.pagesize = this.pagesize
      this.queryObj.offset = 0
      this.api.getAllfollowUp(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        }
      })
    },
    list (flag) {
      this.queryObj.pagesize = this.pagesize
      if (flag) {
        this.queryObj.offset = 0
      } else {
        this.queryObj.offset = this.offset
      }
      this.api.getAllfollowUp(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        }
      })
    },
    reset () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
    },
    linkNewfollow () { // 跳转到newfollowlist已废弃，删不删再说，反正是不用了
      this.$router.push({ name: 'newfollowlist', path: 'newfollowlist' })
    },
    deleteRow (id) {
      this.$confirm('您确定要删除随访吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.api.deleteFollowup({ id: id }).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功!')
              this.list()
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    querySearch (val, callback) {
      this.api.list({ name: val }).then(rs => {
        rs.data.resultList.map(item => {
          item.value = item.name
          item.id = item.id
        })
        callback(rs.data.resultList)
      })
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    endVisit (id) {
      // todo 终止随访计划
      this.$confirm('您确定要终止随访吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.stopFollow({ id: id }).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '终止随访!')
              this.list()
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    getDpt () {
      wapi
        .getWarehouseDeptList({
          codesMatchValues: [
            {
              codes: ['SXX000002'],
              value: ''
            }
          ]
        })
        .then(rs => {
          this.$ever.getFieldFromSchema(
            this.querySchema,
            'belongDptId'
          ).props.options = rs.data
        })
    }
  },
  components: {
    dialogLog
  }
}
</script>
<style scoped lang="scss">
.visitlist {
  /deep/ .el-card__body {
    padding: 10px;
  }
  /deep/ .el-form .el-form-item {
    margin-bottom: 0px;
  }
}
.visitlist .title .el-col {
  height: 36px;
  line-height: 36px;
}
.visitlist .title .el-col strong {
  font-size: 18px;
}
.visitlist .title .el-col span {
  font-size: 12px;
}
.mtop {
  margin-top: 35px;
}
.suifang {
  height: 98.5%;
}
</style>
