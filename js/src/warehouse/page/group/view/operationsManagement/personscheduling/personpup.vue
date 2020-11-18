<template>
    <el-dialog :title="'为' + titleData.name +'在' + titleData.dptName + '排' + titleData.date + '的排班'" :visible="dialogFormVisible" :before-close="closepup">
       <table>
          <thead>
              <th>班次</th>
              <th>机构</th>
              <th>用途</th>
          </thead>
          <tbody>
            <template v-for='(val,i) in classesList' >
              <tr :key="i">
                <td :key="val.id">{{val.name}}</td>
                <td>
                  <el-select v-model="val.orgId" placeholder="请选择机构" clearable>
                      <el-option
                        v-for="(item, index) in clinicList"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                  </el-select>
                </td>
                <td>
                  <el-select v-model="val.outCallStatus" placeholder="不出诊" clearable>
                    <el-option
                      v-for="(zitem, index) in tempStatus"
                      :key="index"
                      :label="zitem.label"
                      :value="zitem.value">
                    </el-option>
                  </el-select>
                </td>
              </tr>
            </template>
          </tbody> 
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="successPup">确 定</el-button>
        <el-button @click="closepup">取 消</el-button>
        <el-button @click="del">删除排班</el-button>
      </div>
    </el-dialog>
</template>
<script>
  import api from '@/arrange/store/workapi'
  export default {
    props: {
      'dialogFormVisible': {
        type: Boolean,
        default: undefined
      },
      'titleData': {
        type: Object,
        default: () => {}
      },
    },
    data () {
      return {
        api,
        value: [],
        valueA: [],
        classesList: [
          {
            timetrunkId: '',
            outCallStatus: '',
          }
        ],
        tempStatus: [
          {
            value: 1,
            label: '出诊'
          },
          {
            value: 2,
            label: '陪诊'
          },
          {
            value: 3,
            label: '其他'
          }
        ],
        clinicList: [],
        flag: false
      }
    },
    created () {
      this.getList()
    },
    methods: {
      closepup (done) {
        if (typeof done === 'function') {
          done()
        }
        this.$emit('closepup')
      },
      successPup () {
        let tempArr = []
        this.classesList.map((item, index) => {
          let tempObj = {
            timetrunkId: '',
            orgId: '',
            outCallStatus: ''
          }
          if (item.outCallStatus && item.id) {
            tempObj.timetrunkId = item.id
            tempObj.orgId = item.orgId
            tempObj.outCallStatus = item.outCallStatus
            tempArr.push(tempObj)
          }
        })
        let params = {
          doctorId: this.titleData.doctorId,
          tenantDeptId: this.titleData.dptId,
          arrangeTime: this.titleData.date,
          timetrunks: tempArr
        }
        let flag = ''
        flag = tempArr.length && tempArr.every(item => {
          return !!(item.orgId && item.outCallStatus)
        })
        if (flag) {
          this.api.create(params).then(rs => {
            if (rs.head.errCode === 0) {
              this.$emit('update')
            }
          })
        } else {
          this.$messageTips(this, 'warning', '请填写完整的机构和科室', '警告')
          return false
        }
      },
      getList () {
        this.api.list(
          {
            'categoryCode': 'OUTPATIENT_DOCTOR'
          }
        ).then(rs => {
          if (rs.head.errCode === 0) {
            this.classesList = rs.data && rs.data.map(item => {
              item.orgId = null
              item.outCallStatus = ''
              return item
            })
            this.$nextTick(_ => {
              this.getclinicList(this.titleData.doctorId, this.titleData.dptId)
              this.getDetail()
            })
          }
        })
      },
      getclinicList (staffId, sectionRecordId) {
        let params = {
          staffIdList: [staffId],
          tenantSubjectIdList: [sectionRecordId]
        }
        this.api.getAllcliniclist(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.clinicList = rs.data.resultList
          }
        })
      },
      getDetail () {
        let params = {
          doctorId: this.titleData.doctorId,
          tenantDeptId: this.titleData.dptId,
          arrangeTime: this.titleData.date
        }
        this.api.getDetail(params).then(rs => {
          if (rs.head.errCode === 0 && rs.data) {
            let tempArr = []
            tempArr = rs.data.timetrunks && rs.data.timetrunks.map(item => {
              item.id = item.timetrunkId
              item.name = item.timetrunkName
              return item
            })
            tempArr.map(item => {
              this.classesList.map(el => {
                if (el.id === item.timetrunkId) {
                  el.outCallStatus = item.outCallStatus
                  el.orgId = item.orgId.toString()
                }
                return el
              })
            })
          }
        })
      },
      del () {
        let params = {
          tenantDeptId: this.titleData.dptId,
          arrangeTime: this.titleData.date,
          doctorId: this.titleData.doctorId
        }
        this.$confirm('删除排班可能会影响已经预约的患者，请确认后谨慎操作', '您是否确认要删除此排班?', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.del(params).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除排班成功')
              this.$emit('update')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
</script>
<style scoped>
    table{width:100%;text-align:center;border-collapse:collapse;border: 1px solid gainsboro;}
    table thead th,table,table tr,table tr th, table tr td { border: 1px solid gainsboro;}
    tr,td,th{height: 50px;}
    table>thead{background-color: #eef1f7;}
    .el-select{width: 100%;}
</style>
