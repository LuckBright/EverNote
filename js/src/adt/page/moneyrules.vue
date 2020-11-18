<template>
  <div class='moneryrules'>
    <div class='box'>
      <div>
        <el-button class='addBtn' @click='newAddBtn'>新增</el-button>
      </div>
      <template class='table-box'>
        <el-table
          :data="tableData"
          style="width: 100%"
          border>
          <el-table-column
            label="状态"
            width='150'>
            <template slot-scope="scope">
              <el-switch
                @change='addBtn(scope.row, scope.$index)'
                v-model="scope.row.isEnabled">
              </el-switch>
              <span>{{scope.row.isEnabled ? '已启用' : '已禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width='150'>
            <template slot-scope='scope'>
              <el-button
                v-if="scope.row.isEdit"
                type="text"
                size="small"
                @click='modify(scope.row, scope.$index)'>
                编辑
              </el-button>
              <span v-else>
                <el-button
                  type="text"
                  size="small"
                  @click='addBtn(scope.row, scope.$index)'>
                  保存
                </el-button>
                <el-button
                  class="danger"
                  type="text"
                  size="small"
                  @click='deletedBtn(scope.$index, scope.row, tableData)'>
                  删除
                </el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="科室">
            <template slot-scope="scope">
              <ever-select
                :options='dptList'
                v-model='scope.row.deptId'
                @change='getSick(scope.row.deptId, scope.$index)'
                :index='scope.$index'
                :key="scope.row.deptId + scope.$index"
                :filterable='true'
                :clearable='true'
                :disabled='scope.row.isEdit'
              ></ever-select>
            </template>
          </el-table-column>
          <el-table-column
            label="病区">
            <template slot-scope="scope">
              <ever-select
                :options='scope.row.flag ? scope.row.sickArr : allsickArr'
                v-model='scope.row.wardId'
                :key="scope.row.wardId + scope.$index"
                :index='scope.$index'
                :filterable='true'
                :clearable='true'
                :disabled='scope.row.isEdit'
              ></ever-select>
          </template>
          </el-table-column>
          <el-table-column
            label="欠费警戒线"
            width='190'>
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.promptAmount" :disabled="scope.row.isEdit"></el-input>
              <ever-number 
                v-else
                v-model="scope.row.promptAmount"
                number-type="number"
                :to-fixed-len="2">
              </ever-number>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="催款方式">
            <template slot-scope="scope">
              <el-select 
                v-model='scope.row.promptMethod' 
                placeholder='请选择催款方式'
                :disabled='scope.row.isEdit'>
                <el-option v-for='item in rulesOptions' :key='item.id' :value='item.id' :label='item.name'></el-option>
              </el-select>
            </template>
          </el-table-column> -->
        </el-table>
      </template>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="offset"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          style='float:right; margin-top: 20px'
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/adt/store/register'

export default {
  data () {
    return {
      tableData: [],
      offset: 1,
      pageSize: 20,
      total: 0,
      rulesOptions: [
        {id: 1, name: '强制'},
        {id: 2, name: '非强制'}
      ],
      rulesObj: {
        isEnabled: true,
        deptId: '',
        wardId: '',
        promptAmount: '',
        promptMethod: ''
      },
      dptList: [],
      allsickArr: [],
      sickArr: []
    }
  },
  created () {
    this.getRulesList()
    this.getDpt()
    this.getSick() // 病区
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getRulesList()
    },
    handleCurrentChange (val) {
      this.offset = val
      this.getRulesList()
    },
    // 获取规则
    getRulesList () {
      this.tableData = []
      let params = {
        offset: (this.offset - 1) * this.pageSize,
        pagesize: this.pageSize
      }
      api.getRulesInfo(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.total = res.data.totalCount
          this.tableData = res.data.resultList && res.data.resultList.map(item => {
            item.isEnabled = !!item.isEnabled
            item.flag = false
            item.sickArr = []
            return item
          })
        }
      })
    },
    getDpt () {
      api.getTenantList({
        type2CodeList: ['01.01'],
        orgIdList: [this.$store.state.currentUser.organizationId]
      }).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.dptList = res.data.resultList && res.data.resultList.map(item => {
            item.id = item.id
            item.name = item.tenantSubjectName
            return item
          })
        }
      })
    },
    // getSick
    getSick (dptId, index) {
      if (dptId && (index === 0 || index)) {
        this.tableData[index].flag = true
        this.tableData[index].wardId = ''
      }
      api.getAdmitWardSelect({
        tenantSubjectId: dptId || this.$store.state.currentUser.tenantSubjectId,

      }).then(res => {
        if (res.head && res.head.errCode === 0) {
          if (dptId && (index === 0 || index)) {
            let arr = []
            arr = res.data && res.data.map(item => {
              item.id = item.id
              item.name = item.sickAreaName
              return item
            })
            this.tableData[index].sickArr = [...arr]
          } else {
            this.allsickArr = res.data && res.data.map(item => {
              item.id = item.id
              item.name = item.sickAreaName
              return item
            })
          }
        }
      })
    },

    // 新增
    newAddBtn () {
      let obj = {
        id: null,
        isEnabled: true,
        deptId: '',
        wardId: '',
        promptAmount: '',
        promptMethod: '',
        sickArr: [],
        isEdit: false
      }
      let isedit = this.tableData.some(val => {
        return val.isEdit === false
      })
      if (isedit) {
        this.$messageTips(this, 'warning', '请保存之后再新增，否则未保存的内容会丢失')
        return false
      }
      this.tableData.unshift(obj)
    },
    // 保存按钮
    addBtn (row, index) {
      let params = JSON.parse(JSON.stringify(row))
      params.isEnabled = Number(params.isEnabled)
      api.ruleCreate(params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.tableData[index].id = res.data.id
          this.tableData[index].isEdit = true
        }
      })
    },
    deletedBtn (index, row, data) {
      if (row.id) {
        let params = {id: row.id}
        api.ruleDeleted(params).then(res => {
          if (res && res.head.errCode === 0) {
            this.getRulesList()
          }
        })
      } else {
        data.splice(index, 1)
      }
    },
    modify (row, index) {
      this.tableData[index].isEdit = false
    }
  },
}
</script>
<style scoped>
.moneryrules{
  height: calc(100% - 20px);
  background: white;
  padding: 20px 5px;
  overflow-y: scroll;
}
.moneryrules .addBtn{
  width: 50px;
  margin-bottom: 20px;
  border: 1px solid #000;
}
.danger{
  color: #EE4433;
}
.box /deep/ .el-input-number__increase{
  top: 4px !important;
  width: 26px !important;
  height: 26px !important;
}
.box /deep/ .el-input-number__decrease {
  top: 4px !important;
  width: 26px !important;
  height: 26px !important;
}
</style>
