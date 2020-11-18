<template>
  <div class="print_list">
    <el-dialog title="打印中心" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
      <div class="print_title" v-if="patientObj">
        <el-row class="mb4">
          <el-col :span="14"><span>姓名：</span>{{patientObj.name || '--'}} {{patientObj.patientNumber?patientObj.patientNumber:''}}</el-col>
          <el-col :span="10"><span>生日：</span>
            {{patientObj.birthday | formatDateByExp('YYYY-MM-DD') }}
            <span>{{patientObj.ageShowText || '--'}}</span>
            <sys-value type="GBT.2261.1" :code="patientObj && patientObj.sex ? patientObj.sex:''"></sys-value>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><span>预约时间：</span></el-col>
          <el-col :span="8">{{patientObj.appointmentDate | formatDateByExp('YYYY-MM-DD')}} {{patientObj.startTime}}</el-col>
        </el-row>
      </div>
      <div>
        <ul class="printList" v-if="printData && printData[0]">
          <li v-for="item in printData" :key="item.busiDocId">
            <span>{{item.busiDocName}}</span>
            <span>
              <el-button type="primary" plain size="mini" @click="print(item)">中文</el-button>
              <!-- <el-button type="primary" plain size="mini">英文</el-button> -->
            </span>
          </li>
        </ul>
        <div v-else class="empty">
          暂无数据
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/workspace/store/printlistapi.js'
import { everprint } from '@/util/print'

export default {
  data () {
    return {
      api,
      dialogVisible: false,
      printData: [],
      patientObj: {}
    }
  },
  methods: {
    open (val) {
      if (val && val.patient) {
        this.patientObj = val.patient
        this.patientObj.appointmentDate = val.date
        this.patientObj.startTime = val.startTimeStr
      } else {
        this.patientObj = {}
        this.patientObj.appointmentDate = ''
      }
      this.dialogVisible = true
      let params = {
        conditions: [
          {
            patientId: val.patientId, // 'o98XaXlrtMMWZYYGPy4',
            busiCode: 'CUSTOMER_LABEL_MEMBER' // 客户标签
          },
          {
            patientId: val.patientId,
            busiCode: 'DIAN_ZI_LIU_CHENG_DAN', // 电子流程单
            type1Code: 'visitNumber',
            type1Value: val.visitNumber
          },
          {
            patientId: val.patientId,
            busiCode: 'doctor_advice_list', // 医嘱清单
            type1Code: 'visitNumber',
            type1Value: val.visitNumber
          }
        ],
      }
      if (val) {
        this.getList(params)
      }
    },
    close () {
      this.patientObj = null
      this.printData = []
      this.dialogVisible = false
    },
    print (item) {
      everprint(item.busiCode, item.dataReqParams, {
        preview: true,
        lang: item.lang,
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    getList (params) {
      this.api.batchQuery(params).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.printData = rs.data
        } else {
          this.printData = []
        }
      })
    }
  }
}
</script>
<style scoped>
.print_list /deep/ .ui_dialog_02 .el-dialog .el-dialog__header{padding:20px 0px 0px 20px;}
.print_list /deep/ .ui_dialog_02 .el-dialog .el-dialog__body{padding-bottom:20px;}
.print_title{background: #EEEEEE;margin:0 10px;padding:10px;margin-bottom: 10px;}
.print_title .el-row .el-col span:first-child{color: #666666;}
.print_list /deep/ .ui_dialog_02 .el-dialog{width:510px;}
.aleft{text-align:left;}
.mb4{margin-bottom: 4px;}
.printList {padding:0;margin:0 10px;border: 1px solid #CCCCCC;border-bottom:none;}
.printList li{display: flex;justify-content: space-between;padding:0 10px;background: #ffffff;
height:34px;line-height: 34px;font-size:14px;color:#000000;border-bottom: 1px solid #DDDDDD;}
.printList li:hover{background: #DEEEFF;}
.printList li /deep/.el-button--mini{border-radius: 2px;padding: 3px 11px;}
.empty{margin:10px;text-align: center;border:1px solid #CCCCCC;padding:10px;}
</style>

