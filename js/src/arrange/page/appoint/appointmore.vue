<template>
  <el-dialog
    title=""
    :fullscreen="true"
    :visible.sync="show">
    <div class="mainbox">
      <el-table
        v-if="show"
        :data="tableData"
        border
        style="width: 100%">       
        <el-table-column
          prop="patientName"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="patientSex"
          label="性别"
          width="50">
          <template slot-scope="scope">
            <span class="gray">{{ scope.row.patientSex | formatSex}}</span>
          </template>          
        </el-table-column>
        <el-table-column
          label="年龄"
          width="100">
          <template slot-scope="scope">
            <span class="gray">{{scope.row.patient.ageShowText}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.appointmentStateDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="patientMobile"
          label="电话"
          width="122">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室"
          width="160">
        </el-table-column>
        <el-table-column
          prop="resourceName"
          label="医生"
          width="120">
        </el-table-column>
        <el-table-column
          align="right"
          prop="startTimeStr"
          label="预约开始"
          width="79">
        </el-table-column>
        <el-table-column
          align="left"
          label="时长"
          width="79">
          <template slot-scope="scope">
            <span class="gray">{{getTimerange(scope.row.startTimeStr, scope.row.endTimeStr)}} min</span>
          </template>           
        </el-table-column>        
        <el-table-column
          align="left"
          prop="endTimeStr"
          label="预约结束"
          width="79">
        </el-table-column>
        <el-table-column
          align="left"
          prop="symptom"
          width="400"
          label="预约备注">
        </el-table-column>
        <el-table-column
          v-if="type === 'cancel'"
          align="left"
          prop="cancelReason"
          label="取消原因">
        </el-table-column>         
        <el-table-column
          v-if="type !== 'cancel'"
          align="left"
          label="操作">
          <template slot-scope="scope" v-if="scope.row.appointmentState !== -1">
            <appointinfo :appoint-id="scope.row.id" first-pannel="update" :inline="true">
              <el-button type="primary" plain>改约</el-button>
            </appointinfo>
            <appointinfo :appoint-id="scope.row.id" first-pannel="cancel" :inline="true">
              <el-button type="danger" plain>取消</el-button>
            </appointinfo>            
          </template>
        </el-table-column>         
      </el-table>      
    </div>
  </el-dialog>
</template>
<script>
import { APPOINT_STATUS } from '@/util/common'
import api from '@/arrange/store/appointmentapi'
import appointinfo from '@/arrange/page/appoint/appointinfo.vue'
export default {
  props: ['data', 'visible', 'type'],
  data () {
    return {
      show: false,
      api,
      stateStyle: APPOINT_STATUS,
      tableData: []
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$bus.$emit('appoint:showinfo', true)
        let ids = this.data.map(item => {
          return item.id
        })
        this.api.getCancalAppoint({ids}).then(rs => {
          this.tableData = rs.data
        })
      }
      this.$emit('update:visible', val)
    },
    visible (val) {
      this.show = val
    }
  },
  methods: {
    getTimerange (start, end) {
      let startTime = new Date('2019-06-01' + ' ' + start).getTime()
      let endTime = new Date('2019-06-01' + ' ' + end).getTime()
      let diff = Math.floor((endTime - startTime) / 1000 / 60)
      return diff
    }
  },
  components: {
    appointinfo
  }
}
</script>
 <style scoped>
 .mainbox{ padding: 10px 20px;}
 .area {height: 100%;}
 .gray{color: #999;}
</style>
