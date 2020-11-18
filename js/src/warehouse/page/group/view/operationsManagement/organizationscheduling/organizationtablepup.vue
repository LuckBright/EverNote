<template>
    <el-dialog 
      :title="titleData.clinicName + ' ' + titleData.dptName + ' ' + titleData.date + '的排班'"
      :visible="visible"
      :before-close="closepupcrm">
      <div>
      </div>
       <table>
          <thead>
              <th class="wid80">医生</th>
              <th class="wid66">全天班</th>
              <th class="wid508">排班情况</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
                <td :key="item.id">{{item.name}}</td>
                <td>
                  <el-checkbox @change="allCheckedChange(index, item.allCheck)" v-model="item.allCheck"></el-checkbox>
                </td>
                <td>
                  <class-select :list="item.classesList" @update="v => updateClass(index, v)"></class-select>
                </td>
            </tr>
          </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createByClinic">确 定</el-button>
        <el-button @click="closepupcrm">取 消</el-button>
         <el-button @click="delItem">删除排班</el-button>
      </div>
    </el-dialog>
</template>
<script>
  import api from '@/arrange/store/settingapi'
  import wapi from '@/arrange/store/workapi'
  import classSelect from './class.select.vue'
  export default {
    props: {
      'visible': {
        type: Boolean,
        default: undefined
      },
      'titleData': {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        api,
        wapi,
        list: [],
        doctors: [],
        classesLength: 0
      }
    },
    async created () {
      await this.getByclinic()
    },
    methods: {
      // async getDoctor () {
      //   let params = {
      //     outSubjectGetTenantSubjectListByConditionReqDTO: {
      //       orgIdList: [this.titleData.clinicId],
      //       idList: [this.titleData.dptId] // 科室id？
      //     },
      //     outStaffGetStaffListByConditionReqDTO: {
      //       typeCodeList: ['DOCTOR'],
      //       practiceOrgIdList: [this.titleData.clinicId]
      //     }
      //   }
      //   this.api.getdocByorgDpt(params).then(rs => {
      //     if (rs.head.errCode === 0) {
      //       if (rs.data.resultList && rs.data.resultList[0].tsStaffList) {
      //         this.list = rs.data.resultList && rs.data.resultList[0].tsStaffList
      //         this.doctors = this.list.map(item => {
      //           item.doctorId = item.id
      //           item.classesList = JSON.parse(JSON.stringify(this.classesList))
      //           return item
      //         })
      //         this.getByclinic()
      //       }
      //     }
      //   })
      // },
      closepupcrm (done) {
        if (typeof done === 'function') {
          done()
        }
        this.$emit('closepupcrm')
      },
      updateClass (index, val) {
        if (val.length === 0) {
          this.list[index].allCheck = false
        } else {
          let flag = null
          flag = val.length === this.classesLength && val.every(el => {
            return el.outCallStatus === 1
          })
          this.list[index].allCheck = !!flag
        }
      },
      createByClinic () {
        let params = {
          orgId: this.titleData.clinicId,
          tenantDeptId: this.titleData.dptId,
          arrangeTime: this.titleData.date,
          doctors: []
        }
  
        this.list.map(el => {
          if (el.classesList.some(item => item.outCallStatus !== null)) {
            let tempObj = {
              doctorId: el.id,
              timetrunks: el.classesList.map(item => {
                if (item.outCallStatus) {
                  return item
                }
              })
            }
            params.doctors.push(tempObj)
          }
        })
        if (params.doctors.length === 0) {
          this.$messageTips(this, 'warning', '请选择排班')
          return false
        }
        this.wapi.createByClinic(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.$emit('success')
          }
        })
      },
      delItem () {
        let params = {
          orgId: this.titleData.clinicId,
          tenantDeptId: this.titleData.dptId,
          arrangeTime: this.titleData.date
        }
        this.$confirm('删除排班可能会影响已经预约的患者，请确认后谨慎操作', '您是否确认要删除此排班?', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.deleteByclinic(params).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除排班成功')
              this.$emit('success')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      async getByclinic () {
        let params = {
          orgId: this.titleData.clinicId,
          tenantDeptId: this.titleData.dptId,
          arrangeTime: this.titleData.date
        }
        api.getByclinic(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.list = rs.data && rs.data.map(el => {
              el.allCheck = false
              el.classesList = JSON.parse(JSON.stringify(el.timetrunks))
              return el
            })
            this.classesLength = rs.data && rs.data[0].timetrunks.length
            // this.doctors.map(item => {
            //   rs.data && rs.data.map(el => {
            //     if (item.doctorId === el.id) {
            //       item.classesList.map(cl => {
            //         el.timetrunks.map(tl => {
            //           if (cl.id === tl.timetrunkId) {
            //             cl.outCallStatus = tl.outCallStatus
            //           }
            //         })
            //       })
            //     }
            //   })
            // })
          }
        })
      },
      allCheckedChange (index, val) {
        this.list[index].classesList.map(item => {
          item.outCallStatus = val ? 1 : null
        })
      }
    },
    components: {
      classSelect
    }
  }
</script>
<style scoped>
    table{width:100%;text-align:center;border-collapse:collapse;border: 1px solid gainsboro;}
    table thead th,table,table tr,table tr th, table tr td { border: 1px solid gainsboro;}
    tr,td,th{height: 42px;}
    table>thead{background-color: #F0F5FA;border: 1px solid #D0DBE4;}
    .el-select{width: 100%;}
    .wid80{width:88px;}
    .wid66{width:66px;}
    .wid508{width:500px;height:42px;}
</style>
