<template>
  <div>
    <el-row>
      <el-col :span="24" align="right">
        <el-button @click="add">添加合约</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table border :data="tableData" align="right">
          <el-table-column
            label="签约类型"
            width="200"
            align="center">
            <template slot-scope="scope">
              <sys-value type="THC_CRM_SIGN_DOCTOR" :code="scope.row.type"></sys-value>
            </template>
          </el-table-column>
          <el-table-column label="医生" width="200" prop="doctorName" align="center">
          </el-table-column>
          <el-table-column label="手机号码" prop="doctorPhone" align="center" width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="签约开始日期" align="center" width="200">
            <template slot-scope="scope">
              {{ scope.row.startTime | formatDateByExp('YYYY-MM-DD') }} 
            </template>
          </el-table-column>
          <el-table-column
            label="签约结束日期"
            align="center"
            width="200">
            <template slot-scope="scope">
              {{ scope.row.endTime | formatDateByExp('YYYY-MM-DD') }} 
            </template>
          </el-table-column>
          <el-table-column label="签约生效状态" align="center" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">待生效</span>
              <span v-else-if="scope.row.status === 1">生效</span>
              <span v-else>失效</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="rescind(scope.row.id)" :disabled="scope.row.status === 2">解约</el-button>
              <el-button size="small" @click="edit(scope.row.id)" :disabled="scope.row.status === 2">编辑</el-button>
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
    <dialog-sign ref="sign" :signId="signId" :patientId="patientId" :isedit="isEdit" @update="() => this.list()"></dialog-sign>
  </div>
</template>
<script>
import api from '@/crm/store/signapi'
import dialogSign from './dialog.sign.vue'
export default {
  data () {
    return {
      api,
      tableData: [],
      totalCount: 0,
      patientId: this.$router.currentRoute.params.patientId,
      current: 1,
      pagesize: 20,
      offset: 0,
      isEdit: false,
      signId: ''
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    list () {
      this.tableData = []
      api.list({'patientId': this.patientId, 'pagesize': this.pagesize, 'offset': this.offset}).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    rescind (id) {
      this.$confirm('确定进行解约操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.terminate({'id': id}).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '解约成功')
            this.list()
          }
        })
      }).catch((e) => {
      })
    },
    edit (id) {
      this.isEdit = true
      this.signId = id
      this.$refs.sign.open()
    },
    add () {
      this.signId = ''
      this.isEdit = false
      this.$refs.sign.open()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    }
  },
  components: {
    dialogSign
  }
}
</script>
