<template>
  <el-dialog
    title="预约备注"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <el-form :model="params" :inline="true">
      <el-form-item label="科室">
        <ever-subject-select v-model="selectDept" type="select"></ever-subject-select>
      </el-form-item>
      <el-form-item label="备注内容">
        <el-input v-model="params.symptom" placeholder="备注内容关键字"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button @click.native="getTableData">查询</el-button>
        <el-button @click="addRemarks">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table max-height="680" class="mb20" :data="tableData" style="width: 100%">
      <el-table-column label="科室" width="160">
        <template slot-scope="scope">
          <ever-subject-select v-model="scope.row.dept" type="select" v-if="scope.row.isEdit"></ever-subject-select>
          <label v-else>{{scope.row.deptName}}</label>
        </template>
      </el-table-column>
      <el-table-column label="备注内容">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.symptom"
            placeholder="请输入备注内容"
            :maxlength="50"
            style="width:100%"
            v-if="scope.row.isEdit"
          ></el-input>
          <label v-else>{{scope.row.symptom}}</label>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" width="160">
        <template slot-scope="scope">
          <label>{{scope.row.updaterName || '--'}}</label>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" width="160">
        <template slot-scope="scope">
          <label>{{scope.row.updateTime ? $moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm') : '--'}}</label>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="saveRemarks(scope.row, scope.$index)"
            v-if="scope.row.isEdit"
          >保存</el-button>
          <el-button
            type="primary"
            size="small"
            @click="editRemarks(scope.row, scope.$index)"
            v-if="!scope.row.isEdit"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteRemarks(scope.row, scope.$index)"
            v-if="!scope.row.isEdit"
          >删除</el-button>
          <el-button
            type="danger"
            size="small"
            @click="cannelRemarks(scope.row, scope.$index)"
            v-if="scope.row.isEdit"
          >取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" align="right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import api from '@/arrange/store/appointapi'
import storage from '@/util/storage'
export default {
  props: ['show'],
  data () {
    return {
      api,
      storage,
      showDialog: false,
      selectDept: '',
      tableData: [],
      deptList: [],
      currentPage: 1,
      totalCount: 0,
      params: {
        organId: parseInt(storage.getLocalStorage('CLINICID')),
        deptId: '',
        deptName: '',
        symptom: '',
        pagesize: 20,
        offset: 0
      }
    }
  },
  watch: {
    show (val) {
      this.showDialog = val
    },
    showDialog (val) {
      this.$emit('update:show', val)
    },
    selectDept (val) {
      this.params.deptId = val ? val.id : ''
      this.params.deptName = val ? val.name : ''
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableData = []
      this.api.getAppointmentSymptom(this.params).then(rs => {
        if (rs.data[0]) {
          this.totalCount = rs.totalCount
          this.tableData = rs.data
        } else {
          this.addRemarks()
        }
      })
    },
    saveRemarks (item, index) {
      if (!item.dept) {
        this.$messageTips(this, 'warning', '请选择科室')
        return false
      }
      if (!item.symptom) {
        this.$messageTips(this, 'warning', '请填写备注内容')
        return false
      }
      item.deptId = item.dept.deptId
      item.deptName = item.dept.deptName
      this.api.updateSymptom(item).then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '备注信息已保存成功', '保存成功')
          this.getTableData()
        }
      })
    },
    editRemarks (item, index) {
      this.$set(item, 'dept', { deptId: item.deptId, deptName: item.deptName })
      this.$set(item, 'isEdit', true)
    },
    deleteRemarks (item, index) {
      if (item.id) {
        this.$confirm('您确定要删除此备注信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.deleteSymptom({ id: item.id }).then(rs => {
            if (!rs.head.errCode) {
              this.getTableData()
            }
          })
        })
      } else {
        this.tableData.splice(index, 1)
      }
    },
    cannelRemarks (item, index) {
      if (item.id) {
        this.$set(item, 'isEdit', false)
      } else {
        this.tableData.splice(index, 1)
      }
    },
    selectPatient (val) {
      this.params.queryPatientParam = val.name
      this.params.patientId = val.id
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getTableData()
    },
    addRemarks () {
      this.totalCount++
      this.tableData.push({
        id: '',
        dept: '',
        deptId: '',
        deptName: '',
        symptom: '',
        isEdit: true
      })
    }
  }
}
</script>
<style scoped>
.blue {
  color: #1c7bef;
}
.green {
  color: #61a812;
}
.orange {
  color: #e38748;
}
.violet {
  color: #bd10e0;
}
.gray {
  color: #666666;
}
.deepblue {
  color: #366298;
}
</style>
